// src/components/Toolbar.jsx
import { useState } from "react";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import RectangleOutlinedIcon from "@mui/icons-material/RectangleOutlined";
import ChangeHistoryOutlinedIcon from "@mui/icons-material/ChangeHistoryOutlined";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EditOffOutlinedIcon from "@mui/icons-material/EditOffOutlined";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { SketchPicker } from "react-color";
import Tooltip from "@mui/material/Tooltip";

function Toolbar({
  currentTool,
  setCurrentTool,
  brushSize,
  fillColor,
  setBrushSize,
  setFillColor,
  setHEX,
  setPencilTools,
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
  pageId,
  pages,
  setPages,
  selectedId,
  setSelectedId,
  scale,
  setScale,
}) {
  const [anchorEl, setAnchorEl] = useState(null); //dropdown button
  const fontFamilies = ["Arial", "Courier New", "Georgia", "Times New Roman"];
  const open = Boolean(anchorEl);

  const handleDropdownClick = (e) => {
    console.log("currentTool", currentTool);
    setAnchorEl(e.currentTarget);
    setCurrentTool("free");
    setPencilTools("");
  };

  const handleFillColor = (e) => {
    setFillColor(e.hsl);
    setHEX(e.hex);
  };

  const handleBrushSize = (e) => {
    setBrushSize(parseInt(e.target.value));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getButtonStyles = (toolName) => ({
    background: currentTool === toolName ? "#c9c9c9" : "transparent",
  });

  const undo = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const previousState = JSON.parse(JSON.stringify(history[newIndex]));
    setElements(previousState);
    setHistoryIndex(newIndex);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const nextState = JSON.parse(JSON.stringify(history[newIndex]));
    setElements(nextState);
    setHistoryIndex(newIndex);
  };

  // Bring shape one layer forward
  const bringForward = (id) => {
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === id);
      if (index !== -1 && index < prev.length - 1) {
        const newElements = [...prev];
        const [item] = newElements.splice(index, 1);
        newElements.splice(index + 1, 0, item);
        return newElements;
      }
      return prev;
    });
  };

  // Send shape one layer backward
  const sendBackward = (id) => {
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === id);
      if (index > 0) {
        const newElements = [...prev];
        const [item] = newElements.splice(index, 1);
        newElements.splice(index - 1, 0, item);
        return newElements;
      }
      return prev;
    });
  };

  // Bring shape to very top
  const bringToFront = (id) => {
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === id);
      if (index !== -1 && index < prev.length - 1) {
        const newElements = [...prev];
        const [item] = newElements.splice(index, 1);
        newElements.push(item);
        return newElements;
      }
      return prev;
    });
  };

  // Send shape to very bottom
  const sendToBack = (id) => {
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === id);
      if (index > 0) {
        const newElements = [...prev];
        const [item] = newElements.splice(index, 1);
        newElements.unshift(item);
        return newElements;
      }
      return prev;
    });
  };

  const zoomIn = () => {
    setScale((prev) => prev * 1.1);
  };
  const zoomOut = () => {
    setScale((prev) => prev / 1.1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": {
          m: 1,
        },
        "& .MuiButton-outlined": {
          borderColor: "#bcbcbc",
          color: "#4b4b4b",
        },
        "& .MuiButton-outlined:hover": {
          background: "#c9c9c9",
        },
      }}
    >
      <ButtonGroup variant="outlined" aria-label="Basic button group">
        <Tooltip title="Rectangle">
          <Button
            onClick={() => setCurrentTool("rect")}
            sx={getButtonStyles("rect")}
          >
            <RectangleOutlinedIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Circle">
          <Button
            onClick={() => setCurrentTool("circle")}
            sx={getButtonStyles("circle")}
          >
            <CircleOutlinedIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Triangle">
          <Button
            onClick={() => setCurrentTool("triangle")}
            sx={getButtonStyles("triangle")}
          >
            <ChangeHistoryOutlinedIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Arrow">
          <Button
            onClick={() => setCurrentTool("arrow")}
            sx={getButtonStyles("arrow")}
          >
            <ArrowRightAltOutlinedIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Textbox">
          <Button
            onClick={() => setCurrentTool("text")}
            sx={getButtonStyles("text")}
          >
            <TextFormatIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Pencil">
          <Button
            onClick={() => {
              setCurrentTool("free");
              setPencilTools("free");
            }}
            sx={getButtonStyles("free")}
          >
            <CreateOutlinedIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Eraser">
          <Button
            onClick={() => {
              setPencilTools("eraser");
              setCurrentTool("eraser");
            }}
            sx={getButtonStyles("eraser")}
          >
            <EditOffOutlinedIcon />
          </Button>
        </Tooltip>
        <Box>
          <Tooltip title="Brush Menu">
            <Button
              id="freehand-button"
              onClick={handleDropdownClick}
              aria-controls={open ? "freehand-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <ArrowDropDownIcon />
            </Button>
          </Tooltip>

          <Menu
            id="freehand-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": "freehand-button",
              },
            }}
          >
            <MenuItem>
              <p>Brush Size:</p>
              <input
                type="range"
                value={brushSize}
                onChange={handleBrushSize}
                style={{ marginLeft: "10px" }}
              />
              <p>{brushSize}</p>
            </MenuItem>
            <MenuItem>
              <SketchPicker
                color={fillColor}
                onChange={handleFillColor}
                width="250px"
              />
            </MenuItem>
          </Menu>
        </Box>
        <Tooltip title="Undo">
          <Button onClick={undo} disabled={historyIndex <= 0}>
            <UndoIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Redo">
          <Button onClick={redo} disabled={historyIndex >= history.length - 1}>
            <RedoIcon />
          </Button>
        </Tooltip>
      </ButtonGroup>
      <ButtonGroup>
        <Tooltip title="Bring Forward">
          <Button onClick={() => bringForward(selectedId)}>
            <NorthIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Send backward">
          <Button onClick={() => sendBackward(selectedId)}>
            <SouthIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Bring to the front">
          <Button onClick={() => bringToFront(selectedId)}>
            <VerticalAlignTopIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Send to the back">
          <Button onClick={() => sendToBack(selectedId)}>
            <VerticalAlignBottomIcon />
          </Button>
        </Tooltip>
      </ButtonGroup>
      <ButtonGroup>
        <Tooltip title="Zoom In">
          <Button onClick={zoomIn}>+</Button>
        </Tooltip>
        <Tooltip title="Zoom Out">
          <Button onClick={zoomOut}>-</Button>
        </Tooltip>
      </ButtonGroup>

      {currentTool === "text" ? (
        <ButtonGroup className="flex items-start">
          <select
            className=" border border-[#bcbcbc] rounded px-2 py-1"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="border  border-[#bcbcbc] rounded px-2 py-1 w-20 ml-2"
            min="8"
            max="100"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
          />
        </ButtonGroup>
      ) : null}
    </Box>
  );
}

export default Toolbar;
