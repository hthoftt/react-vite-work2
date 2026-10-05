import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Checkout = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [falseMessage, setFalseMessage] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user: {
        name: "",
        email: "",
        tel: "",
        address: "",
      },
      message: "",
    },
    mode: "onSubmit", // 驗證在送出時觸發
  });

  const onSubmit = async (customerData) => {
    setIsLogin(true);
    try {
      const res = await axios.post(
        `/v2/api/${import.meta.env.VITE_APP_API_PATH}/order`,
        { data: customerData },
      );
      //   console.log(res);
      setSuccessMessage(res.data.message);
      setTimeout(() => {
        setSuccessMessage("");
        setIsLogin(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      //   console.error(err.response);
      setFalseMessage(err?.response?.data?.message || "送出失敗");
      setTimeout(() => {
        setFalseMessage("");
        setIsLogin(false);
      }, 1000);
    }
  };

  return (
    <>
      <div className="checkout">
        <div className="checkout-title">訂單資訊</div>
        <div
          className={`alert alert-success w-100 mb-4 ${successMessage ? "d-block" : "d-none"}`}
          role="alert"
        >
          {successMessage}
        </div>
        <div
          className={`alert alert-danger w-100 mb-4 ${falseMessage ? "d-block" : "d-none"}`}
          role="alert"
        >
          {falseMessage}
        </div>
        <div>
          <form
            className="row g-3 needs-validation"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                Name
                {errors.user?.name && (
                  <span className="invalid-feedback">
                    {errors.user.name.message}
                  </span>
                )}
              </label>
              <input
                type="text"
                id="name"
                className={`form-control ${errors.user?.name ? "is-invalid" : ""}`}
                {...register("user.name", { required: " " })}
                placeholder="..."
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="tel" className="form-label">
                Tel
                {errors.user?.tel && (
                  <span className="text-danger ms-2">
                    {errors.user.tel.message}
                  </span>
                )}
              </label>
              <input
                type="tel"
                id="tel"
                className={`form-control ${errors.user?.tel ? "is-invalid" : ""}`}
                {...register("user.tel", {
                  required: " ",
                  pattern: { value: /^09\d{8}$/, message: "格式錯誤" },
                })}
                placeholder="0912345678"
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="Email" className="form-label">
                Email
                {errors.user?.email && (
                  <span className="text-danger ms-2">
                    {errors.user.email.message}
                  </span>
                )}
              </label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.user?.email ? "is-invalid" : ""}`}
                {...register("user.email", {
                  required: " ",
                  pattern: {
                    value: /^[^@]+@[^@]+\.[^@]+$/,
                    message: "格式錯誤",
                  },
                })}
                placeholder="..."
              />
            </div>
            <div className="col-12">
              <label htmlFor="Address" className="form-label">
                Address
                {errors.user?.address && (
                  <span className="text-danger ms-2">
                    {errors.user.address.message}
                  </span>
                )}
              </label>
              <input
                type="text"
                id="address"
                className={`form-control ${errors.user?.address ? "is-invalid" : ""}`}
                {...register("user.address", {
                  required: " ",
                })}
                placeholder="..."
              />
            </div>
            <div className="col-12">
              <label className="form-label">Message</label>
              <input
                type="text"
                className="form-control"
                {...register("user.message")}
                placeholder="..."
              />
            </div>
            <div className="col-12">
              <button
                type="submit"
                className="btn btn-dark w-25"
                disabled={isLogin}
              >
                確認
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;
