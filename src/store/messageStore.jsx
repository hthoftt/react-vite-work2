import { createContext } from "react";

// useContext 跨元件傳遞
export const MessageContext = createContext({});

// 初始狀態
export const initState = {
  type: "",
  tittle: "",
};

// Reducer
export const messageReducer = (state, action) => {
  switch (action.type) {
    case "POST_MESSAGE":
      return {
        ...action.payload,
      };
    case "CLEAR_MESSAGE":
      return {
        ...initState,
      };
    default:
      return state;
  }
};

// 新增商品的訊息
export function handleSuccessMessage(dispatch) {
  dispatch({
    type: "POST_MESSAGE",
    payload: { type: "success", tittle: "已加入購物車" },
  });
  setTimeout(() => {
    dispatch({ type: "CLEAR_MESSAGE" });
  }, 2000);
}

// 商品數量更新的訊息
export function handleUpdatedMessage(dispatch) {
  dispatch({
    type: "POST_MESSAGE",
    payload: { type: "success", tittle: "商品數量已更新" },
  });
  setTimeout(() => {
    dispatch({ type: "CLEAR_MESSAGE" });
  }, 2000);
}

// 商品刪除的訊息
export function handleDeleteMessage(dispatch) {
  dispatch({
    type: "POST_MESSAGE",
    payload: { type: "danger", tittle: "商品已刪除" },
  });
  setTimeout(() => {
    dispatch({ type: "CLEAR_MESSAGE" });
  }, 2000);
}
