import { Link } from "react-router-dom";

const Pagination = ({ pagination, getAllData }) => {

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${pagination.has_pre ? "" : "disabled"}`}>
          <Link
            className="page-link"
            onClick={(e) => {
              e.preventDefault();
              getAllData(pagination.current_page - 1);
            }}
            to={"/"}
          >
            <i className="bi bi-arrow-left"></i>
          </Link>
        </li>
        {[...new Array(pagination.total_pages)].map((_, i) => {
          return (
            <li
              key={i}
              className={`page-item ${i + 1 === pagination.current_page ? "active" : ""}`}
            >
              <Link
                className="page-link"
                onClick={(e) => {
                  e.preventDefault();
                  getAllData(i + 1);
                }}
                to={"/"}
              >
                {i + 1}
              </Link>
            </li>
          );
        })}
        <li className={`page-item ${pagination.has_next ? "" : "disabled"}`}>
          <Link
            className="page-link"
            onClick={(e) => {
              e.preventDefault();
              getAllData(pagination.current_page + 1);
            }}
            to={"/"}
          >
            <i className="bi bi-arrow-right"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
