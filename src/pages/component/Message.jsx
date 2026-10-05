import { useContext } from "react";
import { MessageContext } from "../../store/messageStore";
// 商品新增成功或失敗的 toasts元件
const MessageToasts = () => {
  // const [message, setMessage] = useState({});
  const [message] = useContext(MessageContext);

  return (
    <>
      {message.type && (
        <div
          className={`position-fixed toast show text-bg-${message.type} slide-in`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{
            top: "100px",
            right: "29px",
            zIndex: "1000000",
            width: "200px",
          }}
        >
          <div className="d-flex">
            <div className="toast-body">{message.tittle}</div>
            <button
              type="button"
              className="btn-close me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageToasts;
