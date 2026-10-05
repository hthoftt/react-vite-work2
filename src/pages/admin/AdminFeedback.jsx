import { Modal } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
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
  const [err, setErr] = useState([]);
  // 刪除狀態
  const [isLording, setIsLording] = useState(false);

  useEffect(() => {
    feedbackModal.current = new Modal("#feedbackModal", { backdrop: "static" });
    deleteModal.current = new Modal("#deleteModal", { backdrop: "static" });
    getAllData();
  }, []);

  // --api 所有資料
  const getAllData = async (page = 1) => {
    const res = await axios.get(
      `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/articles?page=${page}`,
    );
    console.log(res);
    setFeedback(res.data.articles); // 存所有資料
    setPagination(res.data.pagination); // 存分頁
    setPage(page); // 存頁數
  };

  // --api 刪除單筆資料
  const deleteData = async (id) => {
    setIsLording(true);
    try {
      const res = await axios.delete(
        `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/article/${id}`,
      );
      if (res.data.success) {
        // console.log(res);
        closeDeleteModal();
        getAllData(page);
      }
      setIsLording(false);
    } catch (err) {
      setIsLording(false);
      // console.error(err.response);
      return;
    }
  };

  // 開啟/關閉feedbackModal面版
  const openDataModal = (type, message) => {
    console.log(message);
    setType(type);
    setTempData(message);
    setErr([]);
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
        tempData={tempData}
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
        isLording={isLording}
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
      <Pagination getAllData={getAllData} pagination={pagination} />
    </div>
  );
};

export default AdminFeedback;
