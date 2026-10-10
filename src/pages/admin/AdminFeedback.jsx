import { Modal } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import { adminApi } from "../../api";
import Pagination from "../component/Pagination";
import FeedbackModal from "../component/FeedbackModal";
import DeleteModal from "../component/DeleteModal";

const AdminFeedback = () => {
  // 所有資料
  const [feedback, setFeedback] = useState([]);
  // 存分頁切換
  const [pagination, setPagination] = useState({});
  // 存當下分頁
  const [page, setPage] = useState(1);
  // 綁定feedbackModal跟deleteModal版面開關
  const feedbackModal = useRef(null);
  const deleteModal = useRef(null);
  // 存開啟feedbackModal狀態
  const [type, setType] = useState("create");
  // 存點擊的商品
  const [tempData, setTempData] = useState({});
  // 載入api錯誤訊息
  const [err, setErr] = useState("");
  // 刪除狀態
  const [isLoading, setIsLoading] = useState(false);

  // --api 所有資料
  const getAllData = async (page = 1) => {
    try {
      const res = await adminApi.get(`/articles?page=${page}`);
      setFeedback(res.data.articles); // 存所有資料
      setPagination(res.data.pagination); // 存分頁
      setPage(page); // 存頁數
    } catch {
      setFeedback([]);
    }
  };

  useEffect(() => {
    feedbackModal.current = new Modal("#feedbackModal", { backdrop: "static" });
    deleteModal.current = new Modal("#deleteModal", { backdrop: "static" });
    getAllData();
    return () => {
      feedbackModal.current?.dispose();
      deleteModal.current?.dispose();
    };
  }, []);

  // --api 刪除單筆資料
  const deleteData = async (id) => {
    setIsLoading(true);
    try {
      await adminApi.delete(`/article/${id}`);
      closeDeleteModal();
      getAllData(page);
    } finally {
      setIsLoading(false);
    }
  };

  // 開啟/關閉feedbackModal面版
  const openDataModal = (type, message) => {
    setType(type);
    setTempData(message);
    setErr("");
    feedbackModal.current?.show();
  };
  const closeDataModal = () => {
    feedbackModal.current?.hide();
  };

  // 開啟/關閉openDeleteModal面版
  const openDeleteModal = (message) => {
    setTempData(message);
    deleteModal.current?.show();
  };
  const closeDeleteModal = () => {
    deleteModal.current?.hide();
  };

  return (
    <div className="container-fluid">
      <FeedbackModal
        closeDataModal={closeDataModal}
        getAllData={getAllData}
        tempData={tempData || {}}
        page={page}
        type={type}
        setErr={setErr}
        err={err}
      />
      <DeleteModal
        closeDeleteModal={closeDeleteModal}
        deleteData={deleteData}
        id={tempData?.id}
        title={tempData?.title}
        isLoading={isLoading}
      />
      <div className="d-flex justify-content-between align-items-center m-5">
        <h2 className="fw-bold">顧客回饋</h2>
        <div className="text-end">
          <button
            type="button"
            className="btn btn-outline-success mx-4"
            onClick={() => openDataModal("create", null)}
          >
            新增 顧客回饋
          </button>
        </div>
      </div>
      <table className="table text-center table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">客戶名</th>
            <th scope="col">日期</th>
            <th scope="col">訊息</th>
            <th scope="col">公開</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {feedback?.map((message) => {
            const backToDate = new Date(message.create_at * 1000);
            const messageData = backToDate.toISOString().slice(5, 10);
            return (
              <tr key={message.id}>
                <td className="align-middle">{message.num}</td>
                <td className="align-middle">{message.title}</td>
                <td className="align-middle">{messageData}</td>
                <td className="align-middle w-50 text-start">
                  {message.description}
                </td>

                <td className="align-middle">
                  {message.isPublic ? "公開" : "未公開"}
                </td>
                <td className="align-middle">
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={() => openDataModal("edit", message)}
                  >
                    編輯
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => openDeleteModal(message)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination onPageChange={getAllData} pagination={pagination} />
    </div>
  );
};

export default AdminFeedback;
