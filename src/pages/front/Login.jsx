import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorData } from "../../api";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ username: "", password: "" });

  // 讀取使用者輸入的值
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // 送出表單(按 Enter 也會送出)
  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await axios.post("/v2/admin/signin", data);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired).toUTCString()};`;
      navigate("/admin/products");
    } catch (err) {
      setErrorMessage(getErrorData(err).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid mx-4">
          <div className="navbar-brand fw-bold">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="借我穿一下"
              style={{ width: "100px" }}
            />
          </div>
        </div>
      </nav>
      <div className="login">
        <div className="row justify-content-center align-items-center login-w">
          <form className="col-md-4" onSubmit={submit}>
            <h2 className="my-3">登入帳號</h2>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="email" className="form-label w-100">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="username"
                placeholder="example@gmail.com"
                autoComplete="username"
                value={data.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control mb-5"
                id="password"
                name="password"
                autoComplete="current-password"
                value={data.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-dark w-100 py-2" disabled={isLoading}>
              {isLoading ? "登入中..." : "送出"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
