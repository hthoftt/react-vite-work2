import axios from "axios";
import { useEffect } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import Message from "../component/Message";
import { getToken, clearToken } from "../../api";

const navItems = [
  { to: "/admin/products", label: "商品頁" },
  { to: "/admin/orders", label: "訂單" },
  { to: "/admin/adminFeedback", label: "顧客回饋" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const token = getToken(); // 沒有 cookie 時回傳空字串,不會讓頁面崩潰

  // 登出:讓 cookie 過期並回到登入頁
  const logout = () => {
    clearToken();
    navigate("/login");
  };

  // 沒有 token 或 token 無效就回登入頁
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        await axios.post("/v2/api/user/check", {}, { headers: { Authorization: token } });
      } catch {
        clearToken();
        navigate("/login");
      }
    })();
  }, [navigate, token]);

  return (
    <>
      <Message />
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid mx-4">
          <div className="navbar-brand fw-bold">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="借我穿一下"
              style={{ width: "100px" }}
            />
          </div>
          <div className="navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  className="nav-link me-2"
                  to={item.to}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  {item.label}
                </NavLink>
              ))}
            </ul>
            <button className="btn btn-outline-dark" type="button" onClick={logout}>
              登出
            </button>
          </div>
        </div>
      </nav>
      <div className="w-100 mb-3">{token && <Outlet />}</div>
    </>
  );
};

export default Dashboard;
