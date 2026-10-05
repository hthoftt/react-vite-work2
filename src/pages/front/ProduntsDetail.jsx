import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, Link, useOutletContext } from "react-router-dom";
import { handleSuccessMessage, MessageContext } from "../../store/messageStore";

const ProduntsDetail = () => {
  const [, dispatch] = useContext(MessageContext);
  const { id } = useParams();
  const [tempProduct, setTempProducts] = useState({}); // 存放當前商品資料
  const [isLoading, setIsLoading] = useState(false); // 搭配button disabled狀態避免用戶重複觸發
  const { allProducts, toggleIcon, quantity, setQuantity, carts } =
    useOutletContext();

  // 取得當前商品資料
  const getTemProduct = async (id) => {
    const res = await axios.get(
      `/v2/api/${import.meta.env.VITE_APP_API_PATH}/product/${id}`,
    );
    console.log("單一商品:", res.data.product);
    setTempProducts(res.data.product);
  };

  useEffect(() => {
    getTemProduct(id);
  }, [id]);

  const addQuantity = (sign) => {
    if (sign === "add") {
      setQuantity((i) => i + 1);
    } else if (sign === "dash") {
      setQuantity((i) => {
        if (i === 1) {
          return i;
        }
        return i - 1;
      });
    }
  };

  const submit = async () => {
    setIsLoading(true);
    const data = {
      data: {
        product_id: tempProduct.id,
        qty: quantity,
      },
    };
    try {
      const res = await axios.post(
        `/v2/api/${import.meta.env.VITE_APP_API_PATH}/cart`,
        data,
      );
      console.log("新增商品:", res);
      setIsLoading(false);
      carts();
      handleSuccessMessage(dispatch);
    } catch (err) {
      console.error(err.response);
      setIsLoading(false);
    }
  };

  const tempProductFilter = tempProduct?.category
    ? allProducts
        ?.filter(
          (product) =>
            product.category === tempProduct.category &&
            product.id !== tempProduct.id,
        )
        .slice(0, 4)
    : [];

  return (
    <div className="produntsDetail">
      <div className="container fs-5">
        <div className="row">
          <div className="col-6">
            <img src={tempProduct.imageUrl} alt="" style={{ width: "100%" }} />
          </div>
          <div className="col-6">
            <div className="col mb-3">
              {tempProduct.category} {tempProduct.title}
            </div>
            <div className="col mb-3 fs-6 description">
              {tempProduct.description}
            </div>
            <div className="d-flex col justify-content-end">
              <div className="text-decoration-line-through fs-6">
                NT${tempProduct.origin_price}
              </div>
              <div className="text-danger fw-bold fs-2">
                NT${tempProduct.price}
              </div>
            </div>
            <div className="col mt-4 mb-2">
              <div className="d-flex">
                <div>
                  <button type="button" className="btn border-0">
                    <i
                      className="bi bi-plus-lg"
                      onClick={() => addQuantity("add")}
                    ></i>
                  </button>
                </div>
                <input
                  type="number"
                  className="border-0 text-center"
                  aria-label="Example text with button addon"
                  aria-describedby="button-addon1"
                  readOnly
                  style={{ width: "100%", color: "rgb(77, 80, 79)" }}
                  value={quantity}
                />
                <div>
                  <button type="button" className="btn border-0">
                    <i
                      className="bi bi-dash-lg"
                      onClick={() => addQuantity("dash")}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-outline-dark w-100
              my-3"
              onClick={() => submit()}
              disabled={isLoading}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
      <div className="my-3 mayLike">
        <div className="mayLike-title">您可能也會喜歡</div>
        <nav className="" aria-label="Page navigation example">
          <ul className="mayLike-ul">
            {tempProductFilter?.map((product, i) => {
              return (
                <li key={i}>
                  <Link
                    className="text-decoration-none li_link"
                    to={`/products/${product.id}`}
                    onClick={window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    <div className="img-box">
                      <img
                        src={product.imageUrl}
                        alt="圖片"
                        className="border rounded mayLike-img mx-3"
                      />
                    </div>
                    <i
                      className={`${product.save ? "bi bi-star-fill" : "bi bi-star"} fs-3 text-light`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleIcon(product.id);
                      }}
                    ></i>
                    <div className="clothes-text my-2">
                      <h4 className="clothes-text-1 mb-1">{product.title}</h4>
                      <div className="clothes-text-2">
                        <h3 className="fw-bold text-decoration-line-through">
                          NT${product.origin_price}
                        </h3>
                        <h3 className="fw-bold fs-5 ">NT${product.price}</h3>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};
export default ProduntsDetail;
