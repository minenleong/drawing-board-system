import "./App.css";
import { useState, useRef } from "react";
import CanvasPage from "./components/CanvasPage";
import Toolbar from "./components/Toolbar";
import Pages from "./components/Pages";

function App() {
  const [currentTool, setCurrentTool] = useState("rect");
  const [currentPageId, setCurrentPageId] = useState(1);
  const [fillColor, setFillColor] = useState("#ff0000");
  const [brushSize, setBrushSize] = useState(18);
  const [hex, setHEX] = useState("#ff0000");
  const [pencilTools, setPencilTools] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [elements, setElements] = useState([]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-200">
      <section className="w-full w-auto h-auto p-6 bg-white rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Drawing Canvas Editor
        </h1>
        <Pages
          currentPageId={currentPageId}
          setCurrentPageId={setCurrentPageId}
        />
        <Toolbar
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          fillColor={fillColor}
          setFillColor={setFillColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          setHEX={setHEX}
          setPencilTools={setPencilTools}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          history={history}
          setHistory={setHistory}
          historyIndex={historyIndex}
          setHistoryIndex={setHistoryIndex}
          elements={elements}
          setElements={setElements}
        />

        <CanvasPage
          pageId={currentPageId}
          currentTool={currentTool}
          fillColor={fillColor}
          brushSize={brushSize}
          hex={hex}
          setHEX={setHEX}
          pencilTools={pencilTools}
          setPencilTools={setPencilTools}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          history={history}
          setHistory={setHistory}
          historyIndex={historyIndex}
          setHistoryIndex={setHistoryIndex}
          elements={elements}
          setElements={setElements}
        />
      </section>
    </main>
  );
}
export default App;
