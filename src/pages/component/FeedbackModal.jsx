import { useEffect, useState } from "react";
import axios from "axios";

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
  const [isLogin, setIsLogin] = useState(false);
  const now = new Date();
  const timestamp = Math.floor(now.getTime() / 1000);

  // 建空資料
  const [data, setData] = useState({
    title: "",
    description: "",
    image: "",
    tag: ["tag1"],
    create_at: timestamp,
    author: "alice",
    isPublic: false,
    content: "",
  });

  useEffect(() => {
    if (type === "create") {
      setData({
        title: "",
        description: "",
        image: "",
        tag: ["tag1"],
        create_at: timestamp,
        author: "alice",
        isPublic: false,
        content: "",
      });
    } else {
      setData({ ...tempData });
    }
  }, [tempData, type]);

  const closeModal = () => {
    setData({
      title: "",
      description: "",
      image: "",
      tag: ["tag1"],
      create_at: timestamp,
      author: "alice",
      isPublic: false,
      content: "",
    });
    closeDataModal();
  };

  // --api create或edit資料
  const submit = async (type) => {
    setIsLogin(true);
    let method = "post";
    let api = `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/article`;
    try {
      if (type === "edit") {
        method = "put";
        api = `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/article/${data.id}`;
      }
      await axios[method](api, { data: data });
      console.log(data);
      closeDataModal();
      getAllData(page);
      setIsLogin(false);
    } catch (err) {
      console.error(err.response.data.message);
      setErr(err.response.data.message);
      setIsLogin(false);
    }
  };

  // 讀取使用者輸入的資料並傳到data
  const handleChange = (e) => {
    // console.log(e);
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
                {type === "create" ? "Create Feedback" : `Edit ${tempData.title}`}
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
                disabled={isLogin}
              ></button>
            </div>
            <div className="modal-body">
              <form className="row g-3">
                {
                  <div className="col-md-12 text-danger">
                    {err
                      .map((item) => item.replace(" 屬性不得為空", " is required"))
                      .join("、")}
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
                    disabled={isLogin}
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
                    disabled={isLogin}
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
                    disabled={isLogin}
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
                    disabled={isLogin}
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
                  disabled={isLogin}
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
                disabled={isLogin}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => submit(type)}
                disabled={isLogin}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackModal;
