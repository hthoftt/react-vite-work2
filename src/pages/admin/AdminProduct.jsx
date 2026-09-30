import { Modal } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Pagination from "../component/Pagination";
import ProductsModal from "../component/ProductsModal";
import DeleteModal from "../component/DeleteModal";

const AdminProducts = () => {
  // 所有資料
  const [products, setProducts] = useState([]);
  // 存分頁切換
  const [pagination, setPagination] = useState({});
  // 存當下分頁
  const [page, setPage] = useState(1);
  // 綁定productModal跟deleteModal版面開關
  const productModal = useRef(null);
  const deleteModal = useRef(null);
  // 存開啟productModal狀態
  const [type, setType] = useState("create");
  // 存點擊的商品
  const [tempData, setTempData] = useState({});
  // 載入api錯誤訊息
  const [err, setErr] = useState([]);

  useEffect(() => {
    productModal.current = new Modal("#productModal", { backdrop: "static" });
    deleteModal.current = new Modal("#deleteModal", { backdrop: "static" });
    getAllData();
  }, []);

  // --api 所有資料
  const getAllData = async (page = 1) => {
    const res = await axios.get(
      `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/products?page=${page}`,
    );
    console.log(res.data);
    setProducts(res.data.products); // 存所有資料
    setPagination(res.data.pagination); // 存分頁
    setPage(page); // 存頁數
  };

  // --api 刪除單筆資料
  const deleteData = async (id) => {
    try {
      const res = await axios.delete(
        `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/product/${id}`,
      );
      if (res.data.success) {
        // console.log(res);
        closeDeleteModal();
        getAllData(page);
      }
    } catch (err) {
      // console.error(err.response);
      return;
    }
  };

  // 開啟/關閉ProductsModal面版
  const openDataModal = (type, product) => {
    setType(type);
    setTempData(product);
    setErr([]);
    productModal.current?.show();
  };
  const closeDataModal = () => {
    productModal.current?.hide();
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
      <ProductsModal
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
        DeleteData={deleteData}
        id={tempData?.id}
        title={tempData?.title}
      />
      <div className="d-flex justify-content-between align-items-center m-5">
        <h2 className="fw-bold">商品頁</h2>
        <div className="text-end">
          <button
            type="button"
            className="btn btn-outline-success mx-4"
            onClick={() => openDataModal("create", null)}
          >
            新增 商品
          </button>
        </div>
      </div>
      <table className="table text-center table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">類別</th>
            <th scope="col">類別</th>
            <th scope="col">圖片</th>
            <th scope="col">商品</th>
            <th scope="col">原價</th>
            <th scope="col">特價</th>
            <th scope="col">啟用</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            return (
              <tr key={product.id}>
                <td className="align-middle">{product.num}</td>
                <td className="align-middle">{product.category}</td>
                <td className="align-middle">{product.unit}</td>
                <td className="align-middle">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt="圖片"
                      style={{
                        width: "100px",
                        height: "66px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </td>
                <td className="align-middle">{product.title}</td>
                <td className="align-middle">{product.origin_price}</td>
                <td className="align-middle">{product.price}</td>
                <td className="align-middle">
                  {product.is_enabled ? "啟用" : "未啟用"}
                </td>
                <td className="align-middle">
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={() => openDataModal("edit", product)}
                  >
                    編輯
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => openDeleteModal(product)}
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

export default AdminProducts;
