import { useDispatch, useSelector } from "react-redux";
import { removeMessage } from "../../slice/messageSlice";

// 全站 toast 通知,資料來自 Redux store
const Message = () => {
  const messages = useSelector((state) => state.message);
  const dispatch = useDispatch();

  return (
    <div
      className="position-fixed d-flex flex-column gap-2"
      style={{ top: "100px", right: "29px", zIndex: 1000000, width: "220px" }}
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`toast show text-bg-${msg.type} slide-in`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{msg.text}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              aria-label="Close"
              onClick={() => dispatch(removeMessage(msg.id))}
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Message;
