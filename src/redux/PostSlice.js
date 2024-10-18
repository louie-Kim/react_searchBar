import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// createAsyncThunk를 사용하여 비동기 액션 생성
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
  console.log("fetchPosts []",response.data);
  
  return response.data; // -> action.payload
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    //  posts , searchResults : 같은 데이터
    posts: [],
    searchResults: [],
    status: 'idle', // 요청 상태: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setSearchResults: (state, action) => {
      console.log("SearchBar action.payload", action.payload);
      
      state.searchResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'; // 로딩 중일 때 상태를 업데이트
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        console.log("data fetched []", action.payload);
        
        state.status = 'succeeded'; // 성공 시 상태 업데이트
        state.posts = action.payload;
        state.searchResults = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action)  => {
        state.status = 'failed'; // 실패 시 상태 업데이트
        state.error = action.error.message;
      });
  },
});

export const { setSearchResults } = postsSlice.actions;

export default postsSlice.reducer; // postsReducer로 store에 보냄
