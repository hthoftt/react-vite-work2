// 分頁元件:onPageChange(頁數) 由使用的頁面決定要做什麼
const Pagination = ({ pagination, onPageChange }) => {
  const { current_page = 1, total_pages = 0, has_pre, has_next } = pagination;

  return (
    <nav aria-label="分頁">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${has_pre ? "" : "disabled"}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => onPageChange(current_page - 1)}
            aria-label="上一頁"
          >
            <i className="bi bi-arrow-left"></i>
          </button>
        </li>
        {Array.from({ length: total_pages }, (_, i) => i + 1).map((n) => (
          <li key={n} className={`page-item ${n === current_page ? "active" : ""}`}>
            <button type="button" className="page-link" onClick={() => onPageChange(n)}>
              {n}
            </button>
          </li>
        ))}
        <li className={`page-item ${has_next ? "" : "disabled"}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => onPageChange(current_page + 1)}
            aria-label="下一頁"
          >
            <i className="bi bi-arrow-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
