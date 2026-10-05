import { useEffect, useState } from "react";
import axios from "axios";

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
  const [isLogin, setIsLogin] = useState(false);

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

  // --api 上傳file 取得後端回傳imageUrl資料並寫至data
  const uploadFile = async (file) => {
    setIsLogin(true);
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("file-to-upload", file);
    try {
      const res = await axios.post(
        `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/upload`,
        formData,
      );
      const { imageUrl } = res.data;
      console.log(imageUrl);
      setData({ ...data, imageUrl }); //imageUrl: imageUrl 可直接寫成imageUrl
      setIsLogin(false);
    } catch (err) {
      console.error(err.response);
      setErr(err.response.data.message);
      setIsLogin(false);
    }
  };

  // --api create或edit資料
  const submit = async (type) => {
    setIsLogin(true);
    let method = "post";
    let api = `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/product`;
    try {
      if (type === "edit") {
        method = "put";
        api = `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/product/${data.id}`;
      }
      await axios[method](api, { data: data });
      closeDataModal();
      getAllData(page);
      setIsLogin(false);
    } catch (err) {
      // console.error(err.response.data.message);
      Array.isArray(err.response.data.message)
        ? setErr(err.response.data.message.join("、"))
        : setErr(err.response.data.message);
      setIsLogin(false);
    }
  };

  // 讀取使用者輸入的資料並傳到data
  const handleChange = (e) => {
    // console.log(e);
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
                disabled={isLogin}
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
                    disabled={isLogin}
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
                    disabled={isLogin}
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
                    disabled={isLogin}
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
                    disabled={isLogin}
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
                    disabled={isLogin}
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
                    disabled={isLogin}
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
                    disabled={isLogin}
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
                    disabled={isLogin}
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
                  disabled={isLogin}
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
                disabled={isLogin}
              >
                關閉
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => submit(type)}
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

export default ProductsModal;
