import { useEffect, useState } from "react";
import { adminApi, getErrorData } from "../../api";

const ProductsModal = ({
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
  const [data, setData] = useState({
    title: "",
    category: "",
    origin_price: 0,
    price: 0,
    unit: "",
    description: "",
    content: "",
    is_enabled: 1,
    imageUrl: "",
  });

  useEffect(() => {
    if (type === "create") {
      setData({
        title: "",
        category: "",
        origin_price: 0,
        price: 0,
        unit: "",
        description: "",
        content: "",
        is_enabled: 1,
        imageUrl: "",
      });
    } else if (tempData && tempData.id) {
      setData({ ...tempData });
    }
  }, [type, tempData]);

  const closeModal = () => {
    setData({
      title: "",
      category: "",
      origin_price: 0,
      price: 0,
      unit: "",
      description: "",
      content: "",
      is_enabled: 1,
      imageUrl: "",
    });
    closeDataModal();
  };

  // API 錯誤訊息可能是字串或陣列,統一轉成一行文字
  const toErrorText = (err) => {
    const { message } = getErrorData(err);
    return Array.isArray(message) ? message.join("、") : message;
  };

  // --api 上傳圖片,取得 imageUrl 寫入 data
  const uploadFile = async (file) => {
    if (!file) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file-to-upload", file);
    try {
      const res = await adminApi.post("/upload", formData);
      setData((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
    } catch (err) {
      setErr(toErrorText(err));
    } finally {
      setIsLoading(false);
    }
  };

  // --api create或edit資料
  const submit = async (type) => {
    setIsLoading(true);
    try {
      if (type === "edit") {
        await adminApi.put(`/product/${data.id}`, { data });
      } else {
        await adminApi.post("/product", { data });
      }
      closeDataModal();
      getAllData(page);
    } catch (err) {
      setErr(toErrorText(err));
    } finally {
      setIsLoading(false);
    }
  };

  // 讀取使用者輸入的資料並傳到data
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (["origin_price", "price"].includes(id)) {
      setData({ ...data, [id]: value ? Number(value) : 0 });
    } else if (id === "is_enabled") {
      setData({ ...data, [id]: +e.target.checked });
    } else {
      setData({ ...data, [id]: value });
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="productModal"
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
                {type === "create" ? "新增商品" : `編輯 ${tempData.title}`}
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
                {<div className="col-md-12 text-danger">{err}</div>}
                <div className="col-md-6">
                  <label htmlFor="title" className="form-label">
                    商品
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
                <div className="col-md-3">
                  <label htmlFor="category" className="form-label">
                    類別1
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    placeholder="..."
                    onChange={handleChange}
                    value={data.category}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="unit" className="form-label">
                    類別2
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="unit"
                    placeholder="..."
                    onChange={handleChange}
                    value={data.unit}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="image" className="form-label">
                    上傳圖片 (3MB)
                  </label>
                  <input
                    className="form-control custom-file-input"
                    type="file"
                    id="image"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        uploadFile(file);
                      } else {
                        setData({ ...data, imageUrl: "" });
                      }
                    }}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="origin_price" className="form-label">
                    原價
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="origin_price"
                    placeholder="..."
                    onChange={handleChange}
                    value={data.origin_price}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="price" className="form-label">
                    特價
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="price"
                    placeholder="..."
                    onChange={handleChange}
                    value={data.price}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="imageUrl" className="form-label">
                    或 圖片網址 (3MB)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="imageUrl"
                    placeholder="paste imageUrl link"
                    onChange={handleChange}
                    value={data.imageUrl}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="description" className="form-label">
                    描述
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="3"
                    placeholder="..."
                    onChange={handleChange}
                    value={data.description}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-6">
                  {data.imageUrl && (
                    <div className="text-center">
                      <img
                        src={data.imageUrl}
                        alt="圖片"
                        style={{
                          width: "180px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <div className="col">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="is_enabled"
                  onChange={handleChange}
                  checked={!!data.is_enabled}
                  disabled={isLoading}
                />
                <label className="form-check-label  mx-2" htmlFor="is_enabled">
                  啟用
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

export default ProductsModal;
