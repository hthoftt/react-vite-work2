import { useEffect, useState } from "react";
import { adminApi, getErrorData } from "../../api";

// 新增時的空白資料,日期預設今天
const emptyFeedback = () => ({
  title: "",
  description: "",
  image: "",
  tag: ["tag1"],
  create_at: Math.floor(Date.now() / 1000),
  author: "admin",
  isPublic: false,
  content: "",
});

const FeedbackModal = ({
  closeDataModal,
  getAllData,
  tempData,
  page,
  type,
  err,
  setErr,
}) => {
  // 載入狀態 綁住disabled
  const [isLoading, setIsLoading] = useState(false);

  // 建空資料
  const [data, setData] = useState(emptyFeedback());

  useEffect(() => {
    if (type === "create") {
      setData(emptyFeedback());
    } else {
      setData({ ...tempData });
    }
  }, [tempData, type]);

  const closeModal = () => {
    setData(emptyFeedback());
    closeDataModal();
  };

  // --api create或edit資料
  const submit = async (type) => {
    setIsLoading(true);
    try {
      // 列表 API 回傳的資料沒有 content 欄位,編輯時表單裡的 content 會是空的。
      // 畫面上只有一個「內容」欄位(寫入 description),送出時一律同步到 content,
      // 避免沒動到內容欄位就無法儲存。
      const payload = { ...data, content: data.description };
      if (type === "edit") {
        await adminApi.put(`/article/${data.id}`, { data: payload });
      } else {
        await adminApi.post("/article", { data: payload });
      }
      closeDataModal();
      getAllData(page);
    } catch (err) {
      // API 錯誤訊息可能是字串或陣列
      const { message } = getErrorData(err);
      setErr(
        (Array.isArray(message) ? message : [message])
          .map((item) => item.replace(" 屬性不得為空", " 為必填"))
          .join("、"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 讀取使用者輸入的資料並傳到data
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "isPublic") {
      setData({ ...data, [id]: e.target.checked });
    } else if (id === "content") {
      setData({ ...data, [id]: value, description: value });
    } else if (id === "create_at") {
      const date = new Date(value); // 建立 Date 物件
      const timestamp = Math.floor(date.getTime() / 1000);
      setData({ ...data, [id]: timestamp });
    } else {
      setData({ ...data, [id]: value });
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // 秒數要乘 1000
    return date.toISOString().split("T")[0]; // "2026-09-18"
  };

  return (
    <>
      <div
        className="modal fade"
        id="feedbackModal"
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
                {type === "create" ? "新增 顧客回饋" : `編輯 ${tempData.title}`}
              </h1>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => {
                  if (type === "create") {
                    closeModal();
                  } else {
                    closeDataModal();
                    setData({ ...tempData });
                  }
                }}
                disabled={isLoading}
              ></button>
            </div>
            <div className="modal-body">
              <form className="row g-3">
                {
                  <div className="col-md-12 text-danger">
                    {err}
                  </div>
                }
                <div className="col-md-12">
                  <label htmlFor="title" className="form-label">
                    顧客名稱
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="..."
                    onChange={handleChange}
                    value={data.title}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="create_at" className="form-label">
                    留言日期
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="create_at"
                    onChange={handleChange}
                    value={formatDate(data.create_at)}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="content" className="form-label">
                    內容
                  </label>
                  <textarea
                    className="form-control"
                    id="content"
                    rows="3"
                    placeholder="..."
                    onChange={handleChange}
                    value={data.description}
                    disabled={isLoading}
                  />
                </div>
                {/* <div className="col-md-12">
                  <label htmlFor="content" className="form-label">
                    內容 content
                  </label>
                  <textarea
                    className="form-control"
                    id="content"
                    rows="3"
                    placeholder="..."
                    onChange={handleChange}
                    value={data.content}
                    disabled={isLoading}
                  />
                </div> */}
              </form>
            </div>
            <div className="modal-footer">
              <div className="col">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isPublic"
                  onChange={handleChange}
                  checked={!!data.isPublic}
                  disabled={isLoading}
                />
                <label className="form-check-label mx-2" htmlFor="isPublic">
                  公開
                </label>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  if (type === "create") {
                    closeModal();
                  } else {
                    closeDataModal();
                    setData({ ...tempData });
                  }
                }}
                disabled={isLoading}
              >
                關閉
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => submit(type)}
                disabled={isLoading}
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

export default FeedbackModal;
