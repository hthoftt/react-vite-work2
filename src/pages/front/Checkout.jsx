import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { pushMessage } from "../../slice/messageSlice";
import { api, getErrorData } from "../../api";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, getCart } = useOutletContext();
  const cartItems = cart.carts || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      user: { name: "", email: "", tel: "", address: "" },
      message: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      const res = await api.post("/order", { data: formData });
      dispatch(pushMessage({ text: res.data.message || "訂單已送出" }));
      await getCart(); // 下單後購物車清空,更新右上角數量
      navigate("/");
    } catch (err) {
      dispatch(pushMessage({ type: "danger", text: getErrorData(err).message }));
    }
  };

  // 欄位錯誤訊息
  const errorText = (name) =>
    errors.user?.[name] ? (
      <span className="text-danger ms-2 fs-6">{errors.user[name].message}</span>
    ) : null;

  return (
    <div className="checkout">
      <div className="checkout-title">訂單資訊</div>

      {/* 購物車明細 */}
      <ul className="list-unstyled border-bottom pb-3 mb-4">
        {cartItems.map((item) => (
          <li key={item.id} className="d-flex justify-content-between mb-2">
            <span>
              {item.product.title} × {item.qty}
            </span>
            <span>NT${item.final_total}</span>
          </li>
        ))}
        <li className="d-flex justify-content-between fw-bold mt-3">
          <span>總計</span>
          <span>NT${cart.final_total || 0}</span>
        </li>
      </ul>

      {cartItems.length === 0 ? (
        <p>
          購物車還是空的,<Link to="/products">去逛逛</Link>
        </p>
      ) : (
        <form className="row g-3" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              姓名
              {errorText("name")}
            </label>
            <input
              type="text"
              id="name"
              className={`form-control ${errors.user?.name ? "is-invalid" : ""}`}
              {...register("user.name", { required: "必填" })}
              autoComplete="name"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="tel" className="form-label">
              手機
              {errorText("tel")}
            </label>
            <input
              type="tel"
              id="tel"
              className={`form-control ${errors.user?.tel ? "is-invalid" : ""}`}
              {...register("user.tel", {
                required: "必填",
                pattern: { value: /^09\d{8}$/, message: "請輸入 09 開頭的 10 碼手機" },
              })}
              placeholder="0912345678"
              autoComplete="tel"
            />
          </div>
          <div className="col-md-12">
            <label htmlFor="email" className="form-label">
              Email
              {errorText("email")}
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.user?.email ? "is-invalid" : ""}`}
              {...register("user.email", {
                required: "必填",
                pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Email 格式不正確" },
              })}
              autoComplete="email"
            />
          </div>
          <div className="col-12">
            <label htmlFor="address" className="form-label">
              地址
              {errorText("address")}
            </label>
            <input
              type="text"
              id="address"
              className={`form-control ${errors.user?.address ? "is-invalid" : ""}`}
              {...register("user.address", { required: "必填" })}
              autoComplete="street-address"
            />
          </div>
          <div className="col-12">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <input type="text" id="message" className="form-control" {...register("message")} />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-dark w-25" disabled={isSubmitting}>
              {isSubmitting ? "送出中..." : "確認"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
