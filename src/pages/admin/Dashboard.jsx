import axios from "axios";
import { useEffect } from "react";
import { NavLink, Link, useNavigate, Outlet } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  // 登出 清空hexToken並跳回Login
  const logout = async () => {
    document.cookie = "hexToken=;";
    navigate("/");
  };

  // 取出token 1.以;分割 2.找到有hexToken位置 3.以=分割並取出=後面陣列 4.預設axios的token
  const token = document.cookie
    .split(";")
    .find((row) => row.startsWith("hexToken"))
    .split("=")[1];
  axios.defaults.headers.common["Authorization"] = token;

  useEffect(() => {
    // 沒有token就自動跳回Login
    if (!token) {
      navigate("/");
    }
    // 當navigate, token值變動時立即判斷token值是否有效,無效就跳回Login
    (async () => {
      try {
        (await axios.post(`/v2/api/user/check`),
          {},
          { headers: { Authorization: token } });
      } catch (err) {
        navigate("/");
      }
    })();
  }, [navigate, token]);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid mx-4">
          <Link className="navbar-brand fw-bold" to={"/admin/products"}>
            <img src="../../../public/logo.png" alt="logo" style={{width:"100px"}} />
          </Link>
          <div className="navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <NavLink className="nav-link me-2" to={"/admin/products"}>
                商品頁
              </NavLink>
              <NavLink className="nav-link me-2" to={"/admin/orders"}>
                訂單
              </NavLink>
              <NavLink className="nav-link me-2" to={"/admin/adminFeedback"}>
                顧客回饋
              </NavLink>
            </ul>
            <button
              className="btn btn-outline-dark"
              type="submit"
              onClick={logout}
            >
              登出
            </button>
          </div>
        </div>
      </nav>
      <div className="w-100 mb-3">{token && <Outlet context={token} />}</div>
    </>
  );
};

export default Dashboard;
