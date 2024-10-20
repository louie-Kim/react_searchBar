import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

// createAsyncThunk를 사용하여 비동기 액션 생성
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
  return response.data; // -> action.payload
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [], // 모든 포스트 데이터
    // searchResults: [], // 검색 결과 데이터
    searchTerm: '', // 검색어 상태 추가
    status: 'idle', // 요청 상태
    error: null, // 에러 상태
  },
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload; // 검색어 상태 업데이트
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
        state.searchResults = action.payload; // 초기 검색 결과는 모든 포스트로 설정
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// 기본 posts 데이터를 가져오는 선택자
const selectPosts = (state) => state.posts.posts;
const selectSearchTerm = (state) => state.posts.searchTerm;

// 메모이제이션된 검색 결과 선택자
export const selectFilteredPosts = createSelector(
  [selectPosts, selectSearchTerm],
  (posts, searchTerm) => {

     // 메모이제이션 로깅: searchTerm과 posts가 바뀔 때만 실행됨
     console.log('Selector executed: Recalculating filtered posts');
    
    if (!searchTerm) return posts;
    
    const noSpaceSearchTerm = searchTerm.replace(/\s+/g, '');
    
    return posts.filter((post) => {
      console.log("Filter function executed"); // 필터 함수가 실행될 때마다 로깅
      const titleNoSpaces = post.title.replace(/\s+/g, '');
      const bodyNoSpaces = post.body.replace(/\s+/g, '');
      return titleNoSpaces.includes(noSpaceSearchTerm) || bodyNoSpaces.includes(noSpaceSearchTerm);
    });
  }
);

export const { setSearchResults, setSearchTerm } = postsSlice.actions;

export default postsSlice.reducer;
