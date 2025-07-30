function Pages({ setCurrentPageId, pageId }) {
  return (
    <div className="page-buttons">
      <button onClick={() => setCurrentPageId(1)}>Page 1</button>
      <button onClick={() => setCurrentPageId(2)}>Page 2</button>
      <br></br>
      <span>Page{pageId}</span>
    </div>
  );
}

export default Pages;
