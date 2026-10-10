import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import Message from "../component/Message";
import { api } from "../../api";

// 收藏清單存在 localStorage,重新整理後仍保留
const FAVORITES_KEY = "favorites";
const loadFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
};

const FrontLayout = () => {
  const [rawProducts, setRawProducts] = useState([]);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [cart, setCart] = useState({});
  const [feedback, setFeedback] = useState([]);

  // 取得購物車
  const getCart = useCallback(async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.data);
    } catch {
      setCart({});
    }
  }, []);

  // 進站時取一次商品、購物車與顧客回饋(換頁不重抓)
  useEffect(() => {
    (async () => {
      try {
        const [productsRes, feedbackRes] = await Promise.all([
          api.get("/products/all"),
          api.get("/articles"),
        ]);
        setRawProducts(productsRes.data.products);
        setFeedback(feedbackRes.data.articles);
      } catch {
        setRawProducts([]);
      }
    })();
    getCart();
  }, [getCart]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // 無痕模式等情況無法寫入,略過
    }
  }, [favorites]);

  // 商品加上 save(是否收藏)屬性
  const allProducts = useMemo(
    () => rawProducts.map((p) => ({ ...p, save: favorites.includes(p.id) })),
    [rawProducts, favorites],
  );

  // 切換收藏
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  return (
    <>
      <Message />
      <div className="frontLayout">
        <Navbar cart={cart} getCart={getCart} />
        <Outlet context={{ allProducts, toggleFavorite, cart, getCart, feedback }} />
        <div className="footer">
          <div className="context">
            <div className="context1">
              <div>借我穿一下 二手潮流服飾(作品展示用,非真實店家)</div>
              <div>新北市板橋區西門街 9 號(虛構)</div>
              <div>tonyhung92568@gmail.com</div>
            </div>
            <div className="context2">
              <div className="mes">
                <a
                  className="bi bi-facebook"
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                ></a>
                <a
                  className="bi bi-instagram"
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                ></a>
              </div>
            </div>
          </div>
          <div className="context3">
            <div>
              <img
                className="footer-logo"
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="借我穿一下"
                loading="lazy"
              />
            </div>
            <p>© 2026 HTHOFTT All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default FrontLayout;
