import { useEffect, useState } from "react";
import { useParams, Link, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { pushMessage } from "../../slice/messageSlice";
import { api, getErrorData } from "../../api";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { allProducts, toggleFavorite, getCart } = useOutletContext();
  const [product, setProduct] = useState({}); // 當前商品資料
  const [quantity, setQuantity] = useState(1); // 每個商品各自的選購數量
  const [isLoading, setIsLoading] = useState(false); // 避免重複送出

  // 換商品時重新取得資料,數量重設為 1
  useEffect(() => {
    setQuantity(1);
    (async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        dispatch(pushMessage({ type: "danger", text: getErrorData(err).message }));
      }
    })();
  }, [id, dispatch]);

  const addToCart = async () => {
    setIsLoading(true);
    try {
      await api.post("/cart", { data: { product_id: product.id, qty: quantity } });
      await getCart();
      dispatch(pushMessage({ text: "已加入購物車" }));
      setQuantity(1);
    } catch (err) {
      dispatch(pushMessage({ type: "danger", text: getErrorData(err).message }));
    } finally {
      setIsLoading(false);
    }
  };

  // 您可能也會喜歡:固定 4 件,先放同分類,不足再用其他商品補滿
  const related = product.id
    ? [
        ...allProducts.filter((p) => p.id !== product.id && p.category === product.category),
        ...allProducts.filter((p) => p.id !== product.id && p.category !== product.category),
      ].slice(0, 4)
    : [];

  return (
    <div className="productDetail">
      <div className="container fs-5">
        <div className="row">
          <div className="col-6">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.title} style={{ width: "100%" }} />
            )}
          </div>
          <div className="col-6">
            <div className="col mb-3">
              {product.category} {product.title}
            </div>
            <div className="col mb-3 fs-6 description">{product.description}</div>
            <div className="d-flex col justify-content-end">
              <div className="text-decoration-line-through fs-6">
                NT${product.origin_price}
              </div>
              <div className="text-danger fw-bold fs-2">NT${product.price}</div>
            </div>
            <div className="col mt-4 mb-2">
              <div className="d-flex">
                <button
                  type="button"
                  className="btn border-0"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="減少數量"
                >
                  <i className="bi bi-dash-lg"></i>
                </button>
                <input
                  type="number"
                  className="border-0 text-center"
                  aria-label="數量"
                  readOnly
                  style={{ width: "100%", color: "rgb(77, 80, 79)" }}
                  value={quantity}
                />
                <button
                  type="button"
                  className="btn border-0"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="增加數量"
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-outline-dark w-100 my-3"
              onClick={addToCart}
              disabled={isLoading || !product.id}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
      <div className="my-3 mayLike">
        <div className="mayLike-title">您可能也會喜歡</div>
        <ul className="mayLike-ul">
          {related.map((item) => (
            <li key={item.id}>
              <Link
                className="text-decoration-none li_link"
                to={`/products/${item.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="img-box">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="border rounded mayLike-img"
                    loading="lazy"
                  />
                </div>
                <i
                  className={`${item.save ? "bi bi-star-fill" : "bi bi-star"} fs-3 text-light`}
                  role="button"
                  aria-label={item.save ? "取消收藏" : "加入收藏"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                ></i>
                <div className="clothes-text my-2">
                  <h4 className="clothes-text-1 mb-1">{item.title}</h4>
                  <div className="clothes-text-2">
                    <h3 className="fw-bold text-decoration-line-through">
                      NT${item.origin_price}
                    </h3>
                    <h3 className="fw-bold fs-5 ">NT${item.price}</h3>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default ProductDetail;
