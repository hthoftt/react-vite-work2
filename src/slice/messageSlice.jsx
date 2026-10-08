import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 全站通知訊息(toast),以陣列存放可同時顯示多則
const messageSlice = createSlice({
  name: "message",
  initialState: [],
  reducers: {
    addMessage(state, action) {
      state.push(action.payload);
    },
    removeMessage(state, action) {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const { addMessage, removeMessage } = messageSlice.actions;

// 顯示一則訊息,2.5 秒後自動移除
// 用法:dispatch(pushMessage({ type: "success", text: "已加入購物車" }))
export const pushMessage = createAsyncThunk(
  "message/pushMessage",
  async ({ type = "success", text }, { dispatch, requestId }) => {
    dispatch(addMessage({ id: requestId, type, text }));
    setTimeout(() => {
      dispatch(removeMessage(requestId));
    }, 2500);
  },
);

const messageReducer = messageSlice.reducer;
export default messageReducer;
