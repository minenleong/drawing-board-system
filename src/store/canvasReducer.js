import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTool: "rect",
  currentPageId: 1,
  fillColor: "#ff0000",
  brushSize: 18,
  hex: "#ff0000",
  pencilTools: "",
  fontSize: 16,
  fontFamily: "Arial",
  history: JSON.parse(localStorage.getItem("history")) || [],
  historyIndex:
    localStorage.getItem("historyIndex") !== null
      ? parseInt(localStorage.getItem("historyIndex"), 10)
      : -1,
  elements: JSON.parse(localStorage.getItem("elements")) || [],
  selectedId: null,
  scale: 1,
  pages: {
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
  },
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setCurrentTool: (state, action) => {
      state.currentTool = action.payload;
    },
    setCurrentPageId: (state, action) => {
      state.currentPageId = action.payload;
    },
    setFillColor: (state, action) => {
      state.fillColor = action.payload;
    },
    setBrushSize: (state, action) => {
      state.brushSize = action.payload;
    },
    setHEX: (state, action) => {
      state.hex = action.payload;
    },
    setPencilTools: (state, action) => {
      state.pencilTools = action.payload;
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
      localStorage.setItem("history", JSON.stringify(state.history));
    },
    setHistoryIndex: (state, action) => {
      state.historyIndex = action.payload;
      localStorage.setItem("historyIndex", state.historyIndex);
    },
    setElements: (state, action) => {
      state.elements = action.payload;
      localStorage.setItem("elements", JSON.stringify(state.elements));
    },
    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },
    setScale: (state, action) => {
      state.scale = action.payload;
    },
    setPages: (state, action) => {
      state.pages = action.payload;
    },
    saveToHistory: (state, action) => {
      // Push new element state into history, trimming any redo history
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        action.payload,
      ];
      state.history = newHistory;
      state.historyIndex = newHistory.length - 1;
      state.elements = action.payload;

      localStorage.setItem("elements", JSON.stringify(state.elements));
      localStorage.setItem("history", JSON.stringify(state.history));
      localStorage.setItem("historyIndex", state.historyIndex);
    },
    undo: (state) => {
      if (state.historyIndex <= 0) return;
      state.historyIndex--;
      state.elements = JSON.parse(
        JSON.stringify(state.history[state.historyIndex])
      );
      localStorage.setItem("elements", JSON.stringify(state.elements));
      localStorage.setItem("historyIndex", state.historyIndex);
    },
    redo: (state) => {
      if (state.historyIndex >= state.history.length - 1) return;
      state.historyIndex++;
      state.elements = JSON.parse(
        JSON.stringify(state.history[state.historyIndex])
      );
      localStorage.setItem("elements", JSON.stringify(state.elements));
      localStorage.setItem("historyIndex", state.historyIndex);
    },
  },
});

export const {
  setCurrentTool,
  setCurrentPageId,
  setFillColor,
  setBrushSize,
  setHEX,
  setPencilTools,
  setFontSize,
  setFontFamily,
  setHistory,
  setHistoryIndex,
  setElements,
  setSelectedId,
  setScale,
  setPages,
  saveToHistory,
  undo,
  redo,
} = canvasSlice.actions;

export default canvasSlice.reducer;
