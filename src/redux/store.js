import { configureStore } from '@reduxjs/toolkit';
import postsReducer from "./PostSlice"; // postsSlice를 가져옴

const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});

export default store;
