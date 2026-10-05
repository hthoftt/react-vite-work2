import Navbar from "./Navbar";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import Message from "../component/Message";
import {
  MessageContext,
  initState,
  messageReducer,
} from "../../store/messageStore";

const FrontLayout = () => {
  const reducer = useReducer(messageReducer, initState);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("全部");
  const [cartPoduct, setCartPoduct] = useState([]);
  const [quantity, setQuantity] = useState(1); // 使用者選擇的商品數量
  const location = useLocation();
  const [feedback, setFaceback] = useState([]);

  // 取商客戶端商品資料,用updatedProducts新增資料屬性save,存取資料updatedProducts
  const getProducts = async () => {
    const res = await axios.get(
      `/v2/api/${import.meta.env.VITE_APP_API_PATH}/products/all`,
    );
    const updatedProducts = res.data.products.map((p) => ({
      ...p,
      save: false,
    }));
    console.log("商品:", res);
    setProducts(updatedProducts);
    setAllProducts(updatedProducts);
  };
  // 切換典藏save狀態
  const toggleIcon = (id) => {
    setAllProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, save: !p.save } : p)),
    );
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, save: !p.save } : p,
      );
      if (currentFilter === "我的最愛") {
        return updated.filter((p) => p.save);
      }
      return updated;
    });
  };

  const carts = async () => {
    const res = await axios.get(
      `/v2/api/${import.meta.env.VITE_APP_API_PATH}/cart`,
    );
    console.log("購物車:", res);
    setCartPoduct(res.data.data);
  };

  // 顧客回饋api
  const getFeedback = async () => {
    const res = await axios.get(
      `/v2/api/${import.meta.env.VITE_APP_API_PATH}/articles`,
    );
    setFaceback(res.data.articles);
  };

  useEffect(() => {
    getProducts();
    carts();
    getFeedback();
  }, [location.pathname]);

  return (
    <MessageContext.Provider value={reducer}>
      <Message />
      <div className="frontLayout">
        <Navbar
          cartPoduct={cartPoduct}
          quantity={quantity}
          setQuantity={setQuantity}
          carts={carts}
        />
        <Outlet
          context={{
            products,
            setProducts,
            allProducts,
            setAllProducts,
            getProducts,
            toggleIcon,
            currentFilter,
            setCurrentFilter,
            toggleIcon,
            quantity,
            setQuantity,
            carts,
            getFeedback,
            feedback,
            setFaceback,
          }}
        ></Outlet>
        <div className="footer">
          <div className="context">
            <div className="context1">
              <div>tonyhung92568@gmail.com</div>
              <div>500 Terry Francine St. San Francisco, CA 94158</div>
              <div>Tel: 123-456-7890 / Fax: 123-456-7890</div>
            </div>
            <div className="context2">
              <div>
                <div>Privacy Policy</div>
                <div>Accessibility Statement</div>
                <div>Terms & Conditions</div>
              </div>
              <div className="mes">
                <Link
                  className="bi bi-facebook"
                  to={"https://www.facebook.com/"}
                ></Link>
                <Link
                  className="bi bi-instagram"
                  to={"https://www.instagram.com/"}
                ></Link>
              </div>
            </div>
          </div>
          <div className="context3">
            <div>
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="logo"
                style={{ width: "25rem", color: "white" }}
              />
            </div>
            <p>© 2026 HTHOFTT All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </MessageContext.Provider>
  );
};
export default FrontLayout;
