import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { pushMessage } from "../../slice/messageSlice";
import { api, getErrorData } from "../../api";

const navItems = [
  { to: "/", label: "首頁" },
  { to: "/about", label: "起源" },
  { to: "/store", label: "實體店面" },
];

const Navbar = ({ cart, getCart }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false); // 漢堡選單
  const [hidden, setHidden] = useState(false); // 往下捲動時隱藏導覽列
  const [cartShow, setCartShow] = useState(false); // 側邊購物車
  const [isLoading, setIsLoading] = useState(false);
  const lastScrollY = useRef(0);

  const cartItems = cart.carts || [];

  // 更新購物車數量
  const updateCart = async (item, qty) => {
    if (qty < 1) return;
    setIsLoading(true);
    try {
      await api.put(`/cart/${item.id}`, {
        data: { product_id: item.product_id, qty },
      });
      await getCart();
      dispatch(pushMessage({ text: "商品數量已更新" }));
    } catch (err) {
      dispatch(pushMessage({ type: "danger", text: getErrorData(err).message }));
    } finally {
      setIsLoading(false);
    }
  };

  // 刪除購物車單筆資料
  const deleteCartItem = async (item) => {
    setIsLoading(true);
    try {
      await api.delete(`/cart/${item.id}`);
      await getCart();
      dispatch(pushMessage({ type: "danger", text: "商品已刪除" }));
    } catch (err) {
      dispatch(pushMessage({ type: "danger", text: getErrorData(err).message }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setHidden(window.scrollY > lastScrollY.current && window.scrollY > 24);
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goTop = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* 導覽列 */}
      <div className={`navbar front-navbar px-7 ${hidden ? "hidden" : ""}`}>
        <Link className="h1" to={"/"}>
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            className="logo"
            alt="借我穿一下"
          />
        </Link>
        <ul className={`ul ${open ? "show" : ""}`}>
          {navItems.map((item) => (
            <NavLink key={item.to} className="h5" to={item.to} onClick={goTop}>
              {item.label}
            </NavLink>
          ))}
          <NavLink className="h5 products" to={"/products"} onClick={goTop}>
            Products
            <i className="bi bi-arrow-right"></i>
          </NavLink>
        </ul>
        <button
          type="button"
          className="btn border-0 ms-4 p-0"
          onClick={() => setCartShow(!cartShow)}
          aria-label="開啟購物車"
        >
          <i className="bi bi-cart3 position-relative fs-4">
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.8rem" }}
            >
              {cartItems.length}
            </span>
          </i>
        </button>
        <button
          type="button"
          className="hambuger btn border-0 p-0"
          onClick={() => setOpen(!open)}
          aria-label="開啟選單"
        >
          {open ? (
            <i className="bi bi-triangle"></i>
          ) : (
            <i className="bi bi-list"></i>
          )}
        </button>
      </div>
      {/* 購物車 */}
      <div className={`cart ${cartShow ? "show" : ""}`}>
        <button
          type="button"
          className="btn border-0 dash-icon"
          onClick={() => setCartShow(false)}
          aria-label="關閉購物車"
        >
          <i className="bi bi-x-lg"></i>
        </button>
        <div className="cart-title mx-5">
          <div>購物車清單</div>
          <div>NT${cart.final_total || 0}</div>
        </div>
        <ul>
          {cartItems.length ? (
            cartItems.map((item) => (
              <li className="mb-3" key={item.id}>
                <div className="cart-1 row">
                  <button
                    type="button"
                    className="btn border-0 col-1 mx-2 fs-5"
                    onClick={() => deleteCartItem(item)}
                    disabled={isLoading}
                    aria-label="刪除商品"
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="col-4 cart-img"
                  />
                  <div className="fs-6 cart-text text-center col-3">
                    <Link
                      className="text-dark"
                      to={`/products/${item.product_id}`}
                      onClick={() => setCartShow(false)}
                    >
                      {item.product.title}
                    </Link>
                    <h3 className="mt-2">NT${item.product.price}</h3>
                  </div>
                  <div className="d-flex bg-light rounded col-4">
                    <button
                      type="button"
                      className="btn border-0"
                      onClick={() => updateCart(item, item.qty - 1)}
                      disabled={isLoading || item.qty <= 1}
                      aria-label="減少數量"
                    >
                      <i className="bi bi-dash-lg"></i>
                    </button>
                    <span
                      className="btn text-center w-100"
                      style={{ color: "rgb(77, 80, 79)", cursor: "default" }}
                    >
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      className="btn border-0"
                      onClick={() => updateCart(item, item.qty + 1)}
                      disabled={isLoading}
                      aria-label="增加數量"
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="ms-4">購物車尚未有商品哦!!</p>
          )}
          <li>
            <Link
              to={cartItems.length ? "/checkout" : "/products"}
              className={`btn btn-outline-dark w-100 mt-5 ${isLoading ? "disabled" : ""}`}
              onClick={() => setCartShow(false)}
            >
              {cartItems.length ? "去買單" : "去逛逛"}
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
