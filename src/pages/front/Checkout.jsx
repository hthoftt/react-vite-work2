import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [falseMessage, setFalseMessage] = useState("");
  const navigate = useNavigate();

  const [customerData, setCustomerData] = useState({
    user: {
      name: "",
      email: "",
      tel: "",
      address: "",
    },
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "message") {
      setCustomerData((prev) => ({ ...prev, [id]: value }));
    } else {
      setCustomerData((prev) => ({
        ...prev,
        user: { ...prev.user, [id]: value },
      }));
    }
  };

  const submit = async () => {
    try {
      const res = await axios.post(
        `/v2/api/${import.meta.env.VITE_APP_API_PATH}/order`,
        { data: customerData },
      );
    //   console.log(res);
      setSuccessMessage(res.data.message);
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 2000);
    } catch (err) {
    //   console.error(err.response);
      setFalseMessage(err?.response?.data?.message || "送出失敗");
      setTimeout(() => {
        setFalseMessage("");
      }, 2000);
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
          <form className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="..."
                onChange={handleChange}
                value={customerData.user.name}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="tel" className="form-label">
                Tel
              </label>
              <input
                type="tel"
                className="form-control"
                id="tel"
                placeholder="0912345678"
                onChange={handleChange}
                value={customerData.user.tel}
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="..."
                onChange={handleChange}
                value={customerData.user.email}
              />
            </div>
            <div className="col-12">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder="..."
                onChange={handleChange}
                value={customerData.user.address}
              />
            </div>
            <div className="col-12">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <input
                type="text"
                className="form-control"
                id="message"
                placeholder="..."
                onChange={handleChange}
                value={customerData.message}
              />
            </div>
            <div className="col-12">
              <button
                type="submit"
                className="btn btn-dark w-25"
                onClick={submit}
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
