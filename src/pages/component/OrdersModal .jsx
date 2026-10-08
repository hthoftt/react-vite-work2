import { useState } from "react";
import axios from "axios";

const OrdersModal = ({
  closeDataModal,
  getAllData,
  setTempData,
  tempData,
  page,
}) => {
  // 載入狀態 綁住disabled
  const [isLogin, setIsLogin] = useState(false);

  const submit = async () => {
    setIsLogin(true);
    await axios.put(
      `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/order/${tempData.id}`,
      { data: { ...tempData } },
    );
    // console.log(res);
    closeDataModal();
    getAllData(page);
    setIsLogin(false);
  };

  return (
    <>
      <div
        className="modal fade"
        id="orderModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-success">
              <h1 className="modal-title fs-5 text-light fw-bold">
                {`訂單 ${tempData?.user?.name} / ${tempData?.user?.tel}`}
              </h1>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeDataModal}
                disabled={isLogin}
              ></button>
            </div>
            <div className="modal-body"></div>
            <div className="d-flex justify-content-around">
              <div className="col-md-10">
                {`日期 ${new Date(tempData.create_at * 1000).toLocaleDateString()}`}
              </div>
            </div>
            <br />
            <div className="d-flex justify-content-around">
              <div
                className="col-md-10 text-wrap"
                style={{ wordBreak: "break-word" }}
              >
                {`地址 ${tempData?.user?.address}`}
              </div>
            </div>
            <br />
            <div className="d-flex justify-content-around">
              <div
                className="col-md-10 text-wrap"
                style={{ wordBreak: "break-word" }}
              >
                {`留言 ${tempData?.message || tempData?.user?.message || "無"}`}
              </div>
            </div>
            <br />
            <div>
              <div className="d-flex justify-content-around">
                <div className="col-md-5">商品</div>
                <div className="col-md-3">數量</div>
              </div>
              <hr />
              {Object.values(tempData?.products || {}).map((product) => {
                return (
                  <div
                    className="d-flex justify-content-around"
                    key={product.id}
                  >
                    <div className="col-md-5">{product.product?.title || product.id}</div>
                    <div className="col-md-3">{product.qty}</div>
                  </div>
                );
              })}
            </div>
            <hr />
            <div className="d-flex justify-content-around">
              <div className="col-md-5">
                <input
                  type="checkbox"
                  id="is_paid"
                  className="form-check-input"
                  onChange={(e) =>
                    setTempData({ ...tempData, is_paid: e.target.checked })
                  }
                  checked={tempData.is_paid}
                  disabled={isLogin}
                />{" "}
                <label htmlFor="is_paid" className="form-check-label  mx-2">
                  {tempData.is_paid ? "已付款" : "未付款"}
                </label>
              </div>
              <div className="col-md-3 fs-5">{`NT$${tempData.total}`}</div>
            </div>
            <br />
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDataModal}
                disabled={isLogin}
              >
                關閉
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={submit}
                disabled={isLogin}
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersModal;
