import { Modal } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Pagination from "../component/Pagination";
import OrdersModal from "../component/OrdersModal ";
import DeleteModal from "../component/DeleteModal";

const AdminOrders = () => {
  // 所有資料
  const [orders, setOrders] = useState([]);
  // 所有資料
  const [allOrders, setAllOrders] = useState([]);
  // 存分頁切換
  const [pagination, setPagination] = useState({});
  // 存當下分頁
  const [page, setPage] = useState(1);
  // 綁定productModal跟deleteModal版面開關
  const deleteModal = useRef(null);
  const orderModal = useRef(null);
  // 存點擊的商品
  const [tempData, setTempData] = useState({});
  // 金額狀態
  const [revenueState, setRevenueState] = useState("全部");
  // 刪除狀態
  const [isLording, setIsLording] = useState(false);

  useEffect(() => {
    orderModal.current = new Modal("#orderModal", { backdrop: "static" });
    deleteModal.current = new Modal("#deleteModal", { backdrop: "static" });
    getOrders();
  }, [revenueState]);

  const allOrder = allOrders.reduce((sum, order) => sum + order.total, 0);
  const allIsPaid = allOrders
    .filter((order) => order.is_paid === true)
    .reduce((sum, order) => sum + order.total, 0);
  const allNotPaid = allOrders
    .filter((order) => order.is_paid === false)
    .reduce((sum, order) => sum + order.total, 0);

  // --api 所有資料
  const getOrders = async (page = 1) => {
    const res = await axios.get(
      `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/orders?page=${page}`,
    );
    console.log("訂單:", res);

    let filteredOrders = res.data.orders;
    if (revenueState === "未付款") {
      filteredOrders = res.data.orders.filter((order) => !order.is_paid);
    }
    if (revenueState === "已付款") {
      filteredOrders = res.data.orders.filter((order) => order.is_paid);
    }
    setAllOrders(res.data.orders);
    setOrders(filteredOrders);
    setPagination(res.data.pagination); // 存分頁
    setPage(page); // 存頁數
  };

  // 開啟/關閉ProductsModal面版
  const openOrderModal = (order) => {
    setTempData(order);
    orderModal.current?.show();
  };
  const closeOrderModal = () => {
    orderModal.current?.hide();
  };

  // --api 刪除單筆資料
  const DeleteData = async (id) => {
    setIsLording(true);
    try {
      const res = await axios.delete(
        `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/order/${id}`,
      );
      if (res.data.success) {
        console.log(res);
        closeDeleteModal();
        getOrders(page);
      }
      setIsLording(false);
    } catch (err) {
      console.error(err.response);
      setIsLording(false);
    }
  };

  // 開啟/關閉openDeleteModal面版
  const openDeleteModal = (product) => {
    setTempData(product);
    deleteModal.current?.show();
  };
  const closeDeleteModal = () => {
    deleteModal.current?.hide();
  };

  return (
    <div className="container-fluid">
      <OrdersModal
        closeDataModal={closeOrderModal}
        getAllData={getOrders}
        tempData={tempData}
        page={page}
        setTempData={setTempData}
      />
      <DeleteModal
        closeDeleteModal={closeDeleteModal}
        deleteData={DeleteData}
        id={tempData?.id}
        title={tempData?.user?.name}
        isLording={isLording}
      />
      <div className="d-flex align-items-center mx-5 mt-5 mb-3">
        <h2 className="fw-bold">訂單</h2>
        <select
          className="form-select ms-4"
          style={{ width: "100px" }}
          aria-label="Default select example"
          onChange={(e) => setRevenueState(e.target.value)}
        >
          <option value="全部">全部</option>
          <option value="未付款">未付款</option>
          <option value="已付款">已付款</option>
        </select>
      </div>
      <div className="d-flex justify-content-end mb-5">
        <div className="text-end mx-2">{`總金額: NT$${new Intl.NumberFormat("zh-TW").format(allOrder)}`}</div>
        <div className="text-end mx-2">{`已付款: NT$${new Intl.NumberFormat("zh-TW").format(allIsPaid)}`}</div>
        <div className="text-end mx-4">{`未付款: NT$${new Intl.NumberFormat("zh-TW").format(allNotPaid)}`}</div>
      </div>
      <table className="table text-center  table-striped">
        <thead>
          <tr>
            <th scope="col">訂單日期</th>
            <th scope="col">客戶名 / 電話</th>
            <th scope="col">信箱</th>
            <th scope="col">總金額</th>
            <th scope="col">付款狀態</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => {
            return (
              <tr key={order.id}>
                <td className="align-middle">
                  {new Date(order.create_at * 1000).toLocaleDateString()}
                </td>
                <td className="align-middle">
                  {order.user?.name} / {order.user?.tel}
                </td>
                <td className="align-middle">{order.user?.email}</td>
                <td className="align-middle">{order.total}</td>
                <td className="align-middle">
                  {order.is_paid ? "已付款" : "未付款"}
                </td>
                <td className="align-middle">
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={() => openOrderModal(order)}
                  >
                    編輯
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => openDeleteModal(order)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination getAllData={getOrders} pagination={pagination} />
    </div>
  );
};

export default AdminOrders;
