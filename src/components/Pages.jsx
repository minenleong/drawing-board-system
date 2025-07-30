function Pages({ setCurrentPageId }) {
  return (
    <div className="page-buttons">
      <button onClick={() => setCurrentPageId(1)}>Page 1</button>
      <button onClick={() => setCurrentPageId(2)}>Page 2</button>
    </div>
  );
}

export default Pages;
