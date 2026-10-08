import { Modal } from "bootstrap";
import { useEffect, useMemo, useRef, useState } from "react";
import Pagination from "../component/Pagination";
import OrdersModal from "../component/OrdersModal";
import DeleteModal from "../component/DeleteModal";
import { adminApi } from "../../api";

const PER_PAGE = 10;
const formatNT = (n) => `NT$${new Intl.NumberFormat("zh-TW").format(n)}`;

const AdminOrders = () => {
  // 全部訂單(所有分頁)
  const [allOrders, setAllOrders] = useState([]);
  // 目前頁數
  const [page, setPage] = useState(1);
  // 付款狀態篩選
  const [revenueState, setRevenueState] = useState("全部");
  // 目前點擊的訂單
  const [tempData, setTempData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const deleteModal = useRef(null);
  const orderModal = useRef(null);

  // API 一頁只回 10 筆,先取第 1 頁得知總頁數,再一次取回其餘分頁
  const getOrders = async () => {
    try {
      const first = await adminApi.get("/orders?page=1");
      const totalPages = first.data.pagination?.total_pages || 1;
      const rest = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          adminApi.get(`/orders?page=${i + 2}`),
        ),
      );
      setAllOrders([first, ...rest].flatMap((res) => res.data.orders));
    } catch {
      setAllOrders([]);
    }
  };

  useEffect(() => {
    orderModal.current = new Modal("#orderModal", { backdrop: "static" });
    deleteModal.current = new Modal("#deleteModal", { backdrop: "static" });
    getOrders();
    return () => {
      orderModal.current?.dispose();
      deleteModal.current?.dispose();
    };
  }, []);

  // 金額統計(全部訂單)
  const totals = useMemo(() => {
    const sum = (list) => list.reduce((acc, o) => acc + o.total, 0);
    return {
      all: sum(allOrders),
      paid: sum(allOrders.filter((o) => o.is_paid)),
      unpaid: sum(allOrders.filter((o) => !o.is_paid)),
    };
  }, [allOrders]);

  // 依付款狀態篩選後再分頁
  const filtered = useMemo(() => {
    if (revenueState === "已付款") return allOrders.filter((o) => o.is_paid);
    if (revenueState === "未付款") return allOrders.filter((o) => !o.is_paid);
    return allOrders;
  }, [allOrders, revenueState]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const orders = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const pagination = {
    current_page: currentPage,
    total_pages: totalPages,
    has_pre: currentPage > 1,
    has_next: currentPage < totalPages,
  };

  const openOrderModal = (order) => {
    setTempData(order);
    orderModal.current?.show();
  };
  const closeOrderModal = () => {
    orderModal.current?.hide();
  };

  const openDeleteModal = (order) => {
    setTempData(order);
    deleteModal.current?.show();
  };
  const closeDeleteModal = () => {
    deleteModal.current?.hide();
  };

  // --api 刪除單筆訂單
  const deleteOrder = async (id) => {
    setIsLoading(true);
    try {
      await adminApi.delete(`/order/${id}`);
      closeDeleteModal();
      getOrders();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <OrdersModal
        closeDataModal={closeOrderModal}
        getAllData={getOrders}
        tempData={tempData}
        setTempData={setTempData}
      />
      <DeleteModal
        closeDeleteModal={closeDeleteModal}
        deleteData={deleteOrder}
        id={tempData?.id}
        title={tempData?.user?.name}
        isLoading={isLoading}
      />
      <div className="d-flex align-items-center mx-5 mt-5 mb-3">
        <h2 className="fw-bold">訂單</h2>
        <select
          className="form-select ms-4"
          style={{ width: "110px" }}
          aria-label="付款狀態篩選"
          value={revenueState}
          onChange={(e) => {
            setRevenueState(e.target.value);
            setPage(1);
          }}
        >
          <option value="全部">全部</option>
          <option value="未付款">未付款</option>
          <option value="已付款">已付款</option>
        </select>
        <span className="ms-3 text-secondary">共 {filtered.length} 筆</span>
      </div>
      <div className="d-flex justify-content-end mb-5">
        <div className="text-end mx-2">總金額: {formatNT(totals.all)}</div>
        <div className="text-end mx-2">已付款: {formatNT(totals.paid)}</div>
        <div className="text-end mx-4">未付款: {formatNT(totals.unpaid)}</div>
      </div>
      <table className="table text-center table-striped">
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
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="align-middle">
                {new Date(order.create_at * 1000).toLocaleDateString()}
              </td>
              <td className="align-middle">
                {order.user?.name} / {order.user?.tel}
              </td>
              <td className="align-middle">{order.user?.email}</td>
              <td className="align-middle">{order.total}</td>
              <td className="align-middle">{order.is_paid ? "已付款" : "未付款"}</td>
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
          ))}
        </tbody>
      </table>
      <Pagination onPageChange={setPage} pagination={pagination} />
    </div>
  );
};

export default AdminOrders;
