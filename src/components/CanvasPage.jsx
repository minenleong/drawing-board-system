import {
  Stage,
  Layer,
  Rect,
  Line,
  Circle,
  Arrow,
  Text,
  Transformer,
  Group,
} from "react-konva";
import { useRef, useState, useEffect } from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";

function CanvasPage({
  pageId,
  currentTool,
  brushSize,
  fillColor,
  hex,
  pencilTools,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  history,
  setHistory,
  historyIndex,
  setHistoryIndex,
  elements,
  setElements,
}) {
  const isFreeDrawing = useRef(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newElement, setNewElement] = useState(null);
  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef();
  const transformerRef = useRef();

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const stage = transformerRef.current.getStage();
      const selectedNode = stage.findOne(`#text-${selectedId}`);

      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId, texts]);

  useEffect(() => {
    saveToHistory([]);
  }, []);

  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const clickedOnEmpty = e.target === e.target.getStage();
    if (currentTool === "rect") {
      if (!clickedOnEmpty) return;
      const rect = {
        type: "rect",
        x,
        y,
        width: 0,
        height: 0,
        pageId,
        text: {
          value: "test",
          fontSize,
          fontFamily,
          isEditing: false,
        },
        fill: "rgba(0, 204, 255, 1)",
        id: Date.now(),
      };
      setNewElement(rect);
      setIsDrawing(true);
    } else if (currentTool === "circle") {
      if (!clickedOnEmpty) return;
      const circle = {
        type: "circle",
        x,
        y,
        radius: 0,
        pageId,
        text: {
          value: "test",
          fontSize,
          fontFamily,
          isEditing: false,
        },
        fill: "rgba(221, 108, 255, 1)",
        id: Date.now(),
      };
      setNewElement(circle);
      setIsDrawing(true);
    } else if (currentTool === "triangle") {
      if (!clickedOnEmpty) return;
      const triangle = {
        type: "triangle",
        points: [x, y, x, y, x, y],
        pageId,
        text: {
          value: "test",
          fontSize,
          fontFamily,
          isEditing: false,
        },
        fill: "yellow",
        id: Date.now(),
      };
      setNewElement(triangle);
      setIsDrawing(true);
    } else if (currentTool === "arrow") {
      if (!clickedOnEmpty) return;
      const arrow = {
        type: "arrow",
        points: [x, y, x, y],
        pageId,
        text: {
          value: "",
          fontSize: null,
          fontFamily: null,
          isEditing: false,
        },
      };
      setNewElement(arrow);
      setIsDrawing(true);
    } else if (currentTool === "free" || currentTool === "eraser") {
      isFreeDrawing.current = true;
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      setElements((prev) => [
        ...prev,
        {
          type: "free",
          points: [point.x, point.y],
          color: currentTool === "eraser" ? "white" : hex,
          size: brushSize,
          opacity: fillColor.a,
          tool: currentTool,
          pageId,
          id: Date.now(),
        },
      ]);
    } else if (currentTool === "text") {
      if (!clickedOnEmpty) return;
      setSelectedId(null);
      const newTextElement = {
        type: "text",
        x,
        y,
        pageId,
        text: {
          value: "Double click to edit",
          fontSize: fontSize,
          fontFamily,
          isEditing: false,
        },
        id: Date.now(),
      };

      setElements((prev) => {
        const newElements = [...prev, newTextElement];
        saveToHistory(newElements);
        return newElements;
      });
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (isFreeDrawing.current) {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();

      setElements((prev) => {
        const lastElement = prev[prev.length - 1];
        if (lastElement?.type === "free") {
          return [
            ...prev.slice(0, -1),
            {
              ...lastElement,
              points: [...lastElement.points, point.x, point.y],
            },
          ];
        }
        return prev;
      });
      return;
    }

    if (!isDrawing || !newElement) return;

    if (currentTool === "rect") {
      const updated = {
        ...newElement,
        width: point.x - newElement.x,
        height: point.y - newElement.y,
      };
      setNewElement(updated);
    } else if (currentTool === "triangle") {
      const x1 = newElement.points[0];
      const y1 = newElement.points[1];
      const x2 = point.x;
      const y2 = point.y;

      const triangle = {
        ...newElement,
        points: [
          x1,
          y1, // top
          x2,
          y2, // right corner
          x1 - (x2 - x1),
          y2, // left corner
        ],
      };
      setNewElement(triangle);
    } else if (currentTool === "arrow") {
      const arrow = {
        ...newElement,
        points: [newElement.points[0], newElement.points[1], point.x, point.y],
      };
      setNewElement(arrow);
    } else if (currentTool === "circle") {
      const updated = {
        ...newElement,
        radius: Math.sqrt(
          Math.pow(point.x - newElement.x, 2) +
            Math.pow(point.y - newElement.y, 2)
        ),
      };
      setNewElement(updated);
    }
  };

  const handleMouseUp = () => {
    if (isFreeDrawing.current) {
      isFreeDrawing.current = false;
      const lastElement = elements[elements.length - 1];
      if (lastElement.points.length > 2) {
        saveToHistory(elements);
      }
      return;
    }

    if (isDrawing && newElement) {
      let shouldSave = false;
      switch (newElement.type) {
        case "text":
          shouldSave = true;
          break;
        case "circle":
          shouldSave = newElement.radius > 0;
          break;
        case "triangle":
          shouldSave =
            Math.sqrt(
              Math.pow(newElement.points[2] - newElement.points[0], 2) +
                Math.pow(newElement.points[3] - newElement.points[1], 2)
            ) > 5; // Minimum 5px length
          break;
        default: // rectangles
          shouldSave = newElement.width !== 0 && newElement.height !== 0;
      }

      if (shouldSave) {
        const updatedElements = [...elements, newElement];
        setElements(updatedElements);
        saveToHistory(updatedElements);
      }
      setNewElement(null);
      setIsDrawing(false);
    }
  };

  const visibleElements = elements.filter((el) => el.pageId === pageId);
  const tempElements = newElement?.pageId === pageId ? [newElement] : [];

  // Texteditor
  const handleDoubleClick = (id) => {
    setSelectedId(null);
    setElements((prev) =>
      prev.map((el) => {
        if (el.type !== "text") return el;

        return {
          ...el,
          text: {
            ...el.text,
            isEditing: true,
          },
        };
      })
    );

    console.log("handleDoubleClick", elements);
  };

  const handleTextChange = (id, newText) => {
    console.log("here");
    setElements((prev) => {
      const newElements = prev.map((el) => {
        if (el.type !== "text" || el.id !== id) return el;

        // Update the matching text element
        return {
          ...el,
          text: {
            ...el.text,
            value: newText,
            isEditing: false,
          },
        };
      });
      console.log("hernewElementse", newElements);
      saveToHistory(newElements);
      return newElements;
    });
  };

  const handleShapeTextChange = (index, newValue) => {
    setElements((prev) => {
      const updated = prev.map((shape) =>
        shape.id === index
          ? {
              ...shape,
              text: { ...shape.text, value: newValue, isEditing: false },
            }
          : shape
      );
      saveToHistory(updated);
      return updated;
    });
  };

  const handleTextTransformEnd = (e) => {
    const node = e.target;
    const id = node.id().replace("text-", "");

    const newWidth = Math.max(30, node.width() * node.scaleX());
    const newHeight = Math.max(20, node.height() * node.scaleY());
    setElements((prev) => {
      const newElements = prev.map((el) => {
        if (String(el.id) !== id || el.type !== "text") return el;

        return {
          ...el,
          width: newWidth,
          height: newHeight,
          text: {
            ...el.text,
          },
        };
      });

      saveToHistory(newElements);
      return newElements;
    });
    node.scaleX(1);
    node.scaleY(1);
  };

  // Handle Undo/Redo
  const saveToHistory = (currentState) => {
    setHistory((prevHistory) => {
      const clonedState = JSON.parse(JSON.stringify(currentState));

      const lastState =
        prevHistory.length > 0 ? prevHistory[prevHistory.length - 1] : null;

      if (
        !lastState ||
        JSON.stringify(clonedState) !== JSON.stringify(lastState)
      ) {
        let newHistory = [...prevHistory];

        if (historyIndex < prevHistory.length - 1) {
          newHistory = newHistory.slice(0, historyIndex + 1);
        }

        newHistory.push(clonedState);

        // Update historyIndex in sync
        setHistoryIndex(newHistory.length - 1);

        console.log("✅ Saved to history:", newHistory);
        return newHistory;
      }

      console.log("⏩ No change detected, skipped save");
      return prevHistory;
    });
  };

  return (
    <div className="flex items-center justify-center">
      <Stage
        ref={stageRef}
        width={1200}
        height={600}
        className="bg-white border border-gray-300 w-300 h-150"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {[...visibleElements, ...tempElements].map((el, i) => {
            let minX, minY, width, height;

            if (el.type === "triangle") {
              const [x1, y1, x2, y2, x3, y3] = el.points;
              minX = Math.min(x1, x2, x3);
              const maxX = Math.max(x1, x2, x3);
              minY = Math.min(y1, y2, y3);
              const maxY = Math.max(y1, y2, y3);
              width = maxX - minX;
              height = maxY - minY;
            }

            return (
              <Group
                key={i}
                draggable
                onDblClick={() => {
                  if (el.type === "arrow") return;
                  setElements((prev) =>
                    prev.map((shape, idx) =>
                      idx === i
                        ? { ...shape, text: { ...shape.text, isEditing: true } }
                        : shape
                    )
                  );
                }}
                onMouseEnter={() => (document.body.style.cursor = "pointer")}
                onMouseLeave={() => (document.body.style.cursor = "default")}
                onDragEnd={(e) => {
                  if (el.type === "rect" || el.type === "circle") {
                    const { x, y } = e.target.position();
                    setElements((prev) => {
                      const updated = prev.map((shape, idx) =>
                        idx === i
                          ? { ...shape, x: shape.x + x, y: shape.y + y }
                          : shape
                      );
                      saveToHistory(updated);
                      return updated;
                    });
                    e.target.x(0);
                    e.target.y(0);
                  } else if (el.type === "triangle") {
                    const dx = e.target.x();
                    const dy = e.target.y();
                    const newPoints = el.points.map((point, index) =>
                      index % 2 === 0 ? point + dx : point + dy
                    );
                    setElements((prev) => {
                      const updated = prev.map((shape, idx) =>
                        idx === i ? { ...shape, points: newPoints } : shape
                      );
                      saveToHistory(updated);
                      return updated;
                    });
                    e.target.x(0);
                    e.target.y(0);
                  } else if (el.type === "arrow") {
                    const { x, y } = e.target.position();

                    setElements((prev) => {
                      const updated = prev.map((shape, idx) => {
                        if (idx === i) {
                          const newPoints = shape.points.map((point, index) => {
                            return index % 2 === 0 ? point + x : point + y;
                          });
                          return { ...shape, points: newPoints };
                        }
                        return shape;
                      });

                      saveToHistory(updated);
                      return updated;
                    });

                    e.target.x(0);
                    e.target.y(0);
                  }
                }}
              >
                {el.type === "rect" && (
                  <>
                    <Rect
                      x={el.x}
                      y={el.y}
                      width={el.width}
                      height={el.height}
                      fill={el.fill}
                      stroke="black"
                    />
                    {!el.text?.isEditing && (
                      <Text
                        x={el.x}
                        y={el.y}
                        width={el.width}
                        height={el.height}
                        text={el.text?.value}
                        fontSize={el.text?.fontSize}
                        fontFamily={el.text?.fontFamily}
                        align="center"
                        verticalAlign="middle"
                      />
                    )}
                  </>
                )}

                {el.type === "circle" && (
                  <>
                    <Circle
                      x={el.x}
                      y={el.y}
                      radius={el.radius}
                      fill={el.fill}
                      stroke="black"
                    />
                    {!el.text?.isEditing && (
                      <Text
                        x={el.x - el.radius}
                        y={el.y - el.radius}
                        width={el.radius * 2}
                        height={el.radius * 2}
                        text={el.text?.value}
                        fontSize={el.text?.fontSize}
                        fontFamily={el.text?.fontFamily}
                        align="center"
                        verticalAlign="middle"
                        listening={false}
                      />
                    )}
                  </>
                )}

                {el.type === "triangle" && (
                  <>
                    <Line
                      points={el.points}
                      closed
                      strokeWidth={2}
                      fill={el.fill}
                      opacity={100}
                    />
                    {!el.text?.isEditing && (
                      <Text
                        x={minX}
                        y={minY}
                        width={width}
                        height={height}
                        text={el.text?.value}
                        fontSize={el.text?.fontSize}
                        fontFamily={el.text?.fontFamily}
                        align="center"
                        verticalAlign="middle"
                        listening={false}
                      />
                    )}
                  </>
                )}

                {el.type === "arrow" && (
                  <Arrow
                    points={el.points}
                    fill="black"
                    stroke="black"
                    strokeWidth={2}
                    pointerLength={10}
                    pointerWidth={10}
                    draggable
                  />
                )}
              </Group>
            );
          })}
          {/* Free hand */}
          {elements
            .filter((el) => el.pageId === pageId && el.type === "free")
            .map((line, i) => (
              <Line
                key={`free-${i}`}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.size}
                tension={0.5}
                opacity={line.opacity}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}

          {/* Text Editor */}
          {elements
            .filter((el) => el.type === "text")
            .map((t) => (
              <Text
                key={t.id}
                id={`text-${t.id}`}
                x={t.x}
                y={t.y}
                text={t.text.value}
                fontSize={t.text.fontSize}
                fontFamily={t.text.fontFamily}
                width={t.width}
                height={t.height}
                draggable
                onClick={() => {
                  setSelectedId(t.id);
                }}
                onDblClick={() => {
                  handleDoubleClick(t.id);
                }}
                onDragEnd={(e) => {
                  const { x, y } = e.target.position();
                  setElements((prev) =>
                    prev.map((el) => (el.id === t.id ? { ...el, x, y } : el))
                  );
                }}
                onTransformEnd={handleTextTransformEnd}
              />
            ))}

          {selectedId && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                newBox.height = Math.max(20, newBox.height);
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
      {/* Shapes Text Editing Mode */}
      {elements.map((el, i) => {
        if (el.type === "text" || !el.text?.isEditing) return null;

        const stage = stageRef.current;
        const stageBox = stage.container().getBoundingClientRect();
        const scale = stage.scaleX();

        const node = stage.findOne(`#shape-${el.id}`);
        let absPos = { x: el.x, y: el.y };
        if (node) {
          absPos = node.getAbsolutePosition();
        }

        let width, height;
        if (el.type === "rect") {
          width = el.width;
          height = el.height;
        } else if (el.type === "circle") {
          width = el.radius * 2;
          height = el.radius * 2;
          absPos.x -= el.radius;
          absPos.y -= el.radius;
        } else if (el.type === "triangle") {
          const [x1, y1, x2, y2, x3, y3] = el.points;
          width = Math.max(x1, x2, x3) - Math.min(x1, x2, x3);
          height = Math.max(y1, y2, y3) - Math.min(y1, y2, y3);
          absPos.x = Math.min(x1, x2, x3);
          absPos.y = Math.min(y1, y2, y3);
        }

        return (
          <textarea
            key={el.id}
            id={`shapeTextarea-${el.id}`}
            autoFocus
            onFocus={(e) => {
              const length = e.currentTarget.value.length;
              e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
                length;
            }}
            defaultValue={el.text.value}
            style={{
              position: "absolute",
              top: `${stageBox.top + absPos.y * scale}px`,
              left: `${stageBox.left + absPos.x * scale}px`,
              width: `${width * scale}px`,
              height: `${height * scale}px`,
              fontSize: `${el.text.fontSize * scale}px`,
              fontFamily: el.text.fontFamily,
              background: "transparent",
              outline: "none",
              textAlign: "center",
              resize: "none",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed #999",
              margin: 0,
              lineHeight: "1.2",
            }}
            onBlur={(e) => {
              const newValue = e.target.value;
              setElements((prev) =>
                prev.map((shape, idx) =>
                  idx === i
                    ? {
                        ...shape,
                        text: {
                          ...shape.text,
                          value: newValue,
                          isEditing: false,
                        },
                      }
                    : shape
                )
              );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleShapeTextChange(el.id, e.target.value);
              }
            }}
          />
        );
      })}

      {/* Text Editing Mode */}
      {elements.map((el, i) => {
        if (el.type !== "text" || !el.text?.isEditing) return null;

        const stageBox = stageRef.current.container().getBoundingClientRect();
        const top = stageBox.top + el.y;
        const left = stageBox.left + el.x;

        return (
          <textarea
            key={el.id}
            id={`textarea-${el.id}`}
            autoFocus
            onFocus={(e) => {
              const length = e.currentTarget.value.length;
              e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
                length;
            }}
            defaultValue={el.text.value}
            className="absolute z-10 p-1"
            style={{
              top: `${top}px`,
              left: `${left}px`,
              fontSize: `${el.text.fontSize}px`,
              fontFamily: el.text.fontFamily,
              border: "1px dashed #999",
              outline: "none",
              background: "white",
              width: `${el.width}px`,
              height: `${el.height}px`,
              resize: "none",
              overflow: "hidden",
              lineHeight: "1.2",
              padding: "2px",
            }}
            onBlur={(e) => {
              const newValue = e.target.value;
              setElements((prev) =>
                prev.map((shape, idx) =>
                  idx === i
                    ? {
                        ...shape,
                        text: {
                          ...shape.text,
                          value: newValue,
                          isEditing: false,
                        },
                      }
                    : shape
                )
              );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTextChange(el.id, e.target.value);
              }
            }}
          />
        );
      })}
    </div>
  );
}

export default CanvasPage;
