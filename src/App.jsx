import "./App.css";
import { useState } from "react";
import CanvasPage from "./components/CanvasPage";
import Toolbar from "./components/Toolbar";
import Pages from "./components/Pages";
import LogIn from "./components/LogIn";

function App() {
  const [logIn, setLogin] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
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
  const [selectedId, setSelectedId] = useState(null);
  const [scale, setScale] = useState(1);
  const [pages, setPages] = useState({
    1: {
      elements: [],
      history: [],
      historyIndex: 0,
    },
    2: {
      elements: [],
      history: [],
      historyIndex: 0,
    },
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-200">
      {logIn ? (
        <div>
          <div>
            <section className="w-full w-auto h-auto p-2 bg-white rounded-2xl shadow-xl top-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-medium">
                  Welcome, {username} 👋
                </p>
                <button
                  onClick={() => {
                    setLogin(false);
                    setUsername("");
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("username");
                  }}
                  className="px-4 py-2 text-white rounded-lg shadow bg-indigo-600 hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </section>
          </div>
          <br></br>

          <div>
            <section className="w-full w-auto h-auto p-6 bg-white rounded-2xl shadow-xl">
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                Drawing Canvas Editor
              </h1>
              <Pages
                currentPageId={currentPageId}
                setCurrentPageId={setCurrentPageId}
                pageId={currentPageId}
                elements={elements}
                setElements={setElements}
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
                pageId={currentPageId}
                pages={pages}
                setPages={setPages}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                scale={scale}
                setScale={setScale}
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
                pages={pages}
                setPages={setPages}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                scale={scale}
                setScale={setScale}
              />
            </section>
          </div>
        </div>
      ) : (
        <LogIn
          onLogin={(usernameFromForm) => {
            setLogin(true);
            setUsername(usernameFromForm);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", usernameFromForm);
          }}
        />
      )}
    </main>
  );
}
export default App;
