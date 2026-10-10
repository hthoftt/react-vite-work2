import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import "bootstrap/js/dist/dropdown"; // 啟用 data-bs-toggle="dropdown"

const categories = ["男生", "女生", "兒童"];
const units = ["上衣", "褲子", "外套"];

const Products = () => {
  const { allProducts, toggleFavorite } = useOutletContext();
  // filter: { kind: "all" | "category" | "favorite", category, unit }
  const [filter, setFilter] = useState({ kind: "all" });
  const [keyword, setKeyword] = useState("");

  // 依篩選條件與關鍵字計算要顯示的商品
  const products = useMemo(() => {
    let list = allProducts;
    if (filter.kind === "category") {
      list = list.filter(
        (p) => p.category === filter.category && p.unit === filter.unit,
      );
    } else if (filter.kind === "favorite") {
      list = list.filter((p) => p.save);
    }
    const kw = keyword.trim().toLowerCase();
    if (kw) {
      list = list.filter((p) => p.title.toLowerCase().includes(kw));
    }
    return list;
  }, [allProducts, filter, keyword]);

  const isActive = (kind, category, unit) =>
    filter.kind === kind &&
    (kind !== "category" ||
      (filter.category === category && (unit ? filter.unit === unit : true)));

  return (
    <>
      <nav className="navbar products-navbar navbar-expand fs-5">
        <ul className="navbar-nav">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link btn border-0 ${isActive("all") ? "active" : ""}`}
              onClick={() => setFilter({ kind: "all" })}
            >
              全部
            </button>
          </li>
          {categories.map((category) => (
            <li className="nav-item dropdown" key={category}>
              <button
                type="button"
                className={`nav-link btn border-0 dropdown-toggle ${isActive("category", category) ? "active" : ""}`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {category}
              </button>
              <ul className="dropdown-menu">
                {units.map((unit) => (
                  <li key={unit}>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => setFilter({ kind: "category", category, unit })}
                    >
                      {unit}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link btn border-0 ${isActive("category", "配件") ? "active" : ""}`}
              onClick={() =>
                setFilter({ kind: "category", category: "配件", unit: "配件" })
              }
            >
              配件
            </button>
          </li>
          <li>
            <form role="search" onSubmit={(e) => e.preventDefault()}>
              <input
                className="form-control"
                type="search"
                placeholder="search"
                aria-label="搜尋商品"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </form>
          </li>
          <li>
            <button
              type="button"
              className={`nav-link btn border-0 ${isActive("favorite") ? "active" : ""}`}
              onClick={() => setFilter({ kind: "favorite" })}
            >
              我的最愛
            </button>
          </li>
        </ul>
      </nav>
      <div className="clothes">
        {products.length ? (
          <ul>
            {products.map((product) => (
              <li className="mb-5" key={product.id}>
                <div>
                  <Link
                    className="text-decoration-none li_link"
                    to={`/products/${product.id}`}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <div className="img-box">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="border rounded"
                        loading="lazy"
                      />
                    </div>
                    <i
                      className={`star ${product.save ? "bi bi-star-fill" : "bi bi-star"} fs-3 text-light`}
                      role="button"
                      aria-label={product.save ? "取消收藏" : "加入收藏"}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                    ></i>
                    <div className="clothes-li-text">
                      <h4 className="my-2 fs-4">{product.title}</h4>
                      <div className="d-flex align-items-center">
                        <h3 className="fw-bold text-decoration-line-through">
                          NT${product.origin_price}
                        </h3>
                        <h3 className="fw-bold fs-4 ">NT${product.price}</h3>
                      </div>
                    </div>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="notProducts">
            {filter.kind === "favorite" ? "還沒有收藏的商品哦!!" : "目前仍未有商品哦!!"}
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
