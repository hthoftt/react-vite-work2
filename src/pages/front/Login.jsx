import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [isLording, setIsLording] = useState({});

  // 建立帳號密碼
  const [data, setData] = useState({
    username: "tonyhung92568@gmail.com",
    password: "12345678",
  });

  // 讀取使用者輸入的值並回傳給data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // 綁送出按鈕 抓取登入api資料
  const submit = async () => {
    try {
      const res = await axios.post("/v2/admin/signin", data);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      if (res.data.success) {
        navigate("/admin/products");
      }
    } catch (err) {
      setIsLording(err.response?.data);
    }
  };

  // 連動鍵盤Enter 觸發submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <>
      <div className="login">
        <div className="row justify-content-center align-items-center login-w">
          <div className="col-md-4">
            <h2 className="my-3">登入帳號</h2>
            <div
              className={`alert alert-danger ${isLording.message ? "d-block" : "d-none"}`}
              role="alert"
            >
              {isLording.message}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label w-100">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="example@gmail.com"
                onChange={handleChange}
                name="username"
                value={data.username}
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
                placeholder=". . ."
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="password"
                value={data.password}
              />
            </div>
            <button
              type="button"
              className="btn btn-dark w-100 py-2"
              onClick={submit}
            >
              送出
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
