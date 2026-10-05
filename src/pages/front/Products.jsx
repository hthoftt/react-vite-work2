import { Link, useOutletContext } from "react-router-dom";

const Products = () => {
  const { products, setProducts, allProducts, setCurrentFilter, toggleIcon } =
    useOutletContext();

  const li = ["男生", "女生", "兒童"];

  const handleChange = (category, unit, e = null) => {
    setCurrentFilter(category);
    let productsFilter;
    if (category === "全部" && unit === "全部") {
      setProducts(allProducts);
      return;
    }
    if (category === "搜尋" && unit === "搜尋") {
      productsFilter = allProducts.filter((product) =>
        product.title
          .toLowerCase()
          .includes(e.target.value.trim().toLowerCase()),
      );
      setProducts(productsFilter);
      return;
    }
    if (category === "我的最愛" && unit === "我的最愛") {
      productsFilter = allProducts.filter((product) => product.save);
      setProducts(productsFilter);
      return;
    }

    productsFilter = allProducts.filter(
      (product) => product.category === category && product.unit === unit,
    );
    setProducts(productsFilter);
  };

  return (
    <>
      <nav className="navbar products-navbar navbar-expand fs-5">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              className="nav-link"
              onClick={() => handleChange("全部", "全部")}
              to="."
            >
              全部
            </Link>
          </li>
          {li.map((prev, i) => {
            return (
              <li className="nav-item dropdown" key={i}>
                <Link
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  to="."
                >
                  {prev}
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      className="dropdown-item"
                      onClick={() => handleChange(prev, "上衣")}
                      to="."
                    >
                      上衣
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      onClick={() => handleChange(prev, "褲子")}
                      to="."
                    >
                      褲子
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      onClick={() => handleChange(prev, "外套")}
                      to="."
                    >
                      外套
                    </Link>
                  </li>
                </ul>
              </li>
            );
          })}
          <li className="nav-item">
            <Link
              className="nav-link"
              aria-current="page"
              onClick={() => handleChange("配件", "配件")}
              to="."
            >
              配件
            </Link>
          </li>
          <li>
            <form role="search">
              <input
                className="form-control"
                type="search"
                placeholder="search"
                aria-label="Search"
                onChange={(e) => handleChange("搜尋", "搜尋", e)}
              />
            </form>
          </li>
          <li>
            <Link
              className="nav-link"
              onClick={() => handleChange("我的最愛", "我的最愛")}
              to="."
            >
              我的最愛
            </Link>
          </li>
        </ul>
      </nav>
      <div className="clothes">
        {products.length ? (
          <ul>
            {products.map((product, i) => {
              return (
                <li className="mb-5" key={i}>
                  <div>
                    <Link
                      className="text-decoration-none li_link"
                      to={`/products/${product.id}`}
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <div className="img-box">
                        <img
                          src={product.imageUrl}
                          alt="圖片"
                          className="border rounded"
                        />
                      </div>
                      <i
                        className={`star ${product.save ? "bi bi-star-fill" : "bi bi-star"} fs-3 text-light`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleIcon(product.id);
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
              );
            })}
          </ul>
        ) : (
          <div className="notProducts">目前仍未有商品哦!!</div>
        )}
      </div>
    </>
  );
};

export default Products;
