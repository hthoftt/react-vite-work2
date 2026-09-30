import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = ({ cartPoduct, quantity, setQuantity, carts }) => {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false); // 漢堡狀態
  const [cartShow, setCartShow] = useState(false); // 開啟關閉購物車
  const [isLording, setIsLording] = useState(false);
  let lastScrollY = useRef(24);

  // 更新購物車數量
  const upDateCart = async (product, qty) => {
    setIsLording(true);
    if (qty < 1) return;
    const data = {
      data: {
        product_id: product.product_id,
        qty: qty,
      },
    };
    const res = await axios.put(
      `/v2/api/${import.meta.env.VITE_APP_API_PATH}/cart/${product.id}`,
      data,
    );
    console.log("更新購物車:", res);
    carts();
    setIsLording(false);
  };

  // 刪除購物車單筆資料
  const deleteCart = async (product) => {
    setIsLording(true);
    const res = await axios.delete(
      `/v2/api/${import.meta.env.VITE_APP_API_PATH}/cart/${product.id}`,
    );
    console.log("刪除單筆購物車:", res);
    carts();
    setIsLording(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = window.scrollY;
      // console.log(lastScrollY.current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 導覽列 */}
      <div className={`navbar front-navbar px-7 ${hidden ? "hidden" : ""}`}>
        <Link className="h1" to={"/"}>
          <img src="../../../public/logo.png" className="logo" alt="logo" />
        </Link>
        <ul className={`ul ${open ? "show" : ""}`}>
          <NavLink className="h5" to={"/"} onClick={() => setOpen(false)}>
            首頁
          </NavLink>
          <NavLink className="h5" to={"/about"} onClick={() => setOpen(false)}>
            起源
          </NavLink>
          <NavLink className="h5" to={"/blog"} onClick={() => setOpen(false)}>
            顧客回饋
          </NavLink>
          <NavLink className="h5" to={"/login"} onClick={() => setOpen(false)}>
            後台登入
          </NavLink>
          <NavLink
            className="h5 products"
            to={"/products"}
            onClick={() => setOpen(false)}
          >
            Products
            <i className="bi bi-arrow-right"></i>
          </NavLink>
        </ul>
        <div
          className="ms-4"
          onClick={() => {
            setCartShow(!cartShow);
          }}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-cart3 position-relative fs-4">
            {" "}
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.8rem" }}
            >
              {Object.values(cartPoduct.carts || []).length || 0}
            </span>
          </i>
        </div>
        <div className="hambuger" onClick={() => setOpen(!open)}>
          {open ? (
            <i className="bi bi-triangle"></i>
          ) : (
            <i className="bi bi-list"></i>
          )}
        </div>
      </div>
      {/* 購物車 */}
      <div className={`cart ${cartShow ? "show" : ""}`}>
        <i
          className="bi bi-x-lg dash-icon"
          onClick={() => setCartShow(false)}
        ></i>
        <div className="cart-title mx-5">
          <div>購物車清單</div>
          <div>NT${cartPoduct.total || 0}</div>
        </div>
        <ul>
          {Object.values(cartPoduct.carts || []).map((product, i) => {
            return (
              <li className="mb-3" key={i}>
                <div className="cart-1 row">
                  <button
                    type="button"
                    className="btn border-0 col-1 mx-2 fs-5"
                  >
                    <i
                      className="bi bi-trash3"
                      onClick={() => deleteCart(product)}
                      disabled={isLording}
                    ></i>
                  </button>
                  <img
                    src={product.product.imageUrl}
                    alt="圖片"
                    className="col-4 cart-img"
                  />
                  <div className="fs-6 cart-text text-center col-3">
                    <Link
                      className="text-dark"
                      to={`/products/${product.product_id}`}
                      onClick={() => setCartShow(false)}
                    >
                      {product.product.title}
                    </Link>
                    <h3 className="mt-2">NT${product.product.price}</h3>
                  </div>
                  <div className="d-flex bg-light rounded col-4">
                    <div>
                      <button type="button" className="btn border-0">
                        <i
                          className="bi bi-plus-lg"
                          onClick={() => upDateCart(product, product.qty + 1)}
                          disabled={isLording}
                        ></i>
                      </button>
                    </div>
                    <input
                      type="button"
                      className="btn text-center"
                      style={{ width: "100%", color: "rgb(77, 80, 79)" }}
                      value={product.qty}
                      readOnly
                    />

                    <div>
                      <button type="button" className="btn border-0">
                        <i
                          className="bi bi-dash-lg"
                          onClick={() => upDateCart(product, product.qty - 1)}
                          disabled={isLording}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          <li>
            <Link
              to={"/checkout"}
              style={{ textDecoration: "none" }}
              onClick={() => setCartShow(false)}
            >
              <button
                type="button"
                className="btn btn-outline-dark w-100 mt-5"
                disabled={isLording}
              >
                去買單
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
