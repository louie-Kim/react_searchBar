import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (pageParam, { rejectWithValue }) => {
    console.log("pageParam",pageParam);
    
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=5`
      );
      // return { data: response.data, page: pageParam }; // 데이터와 페이지 정보를 반환
      return response.data; // 데이터와 페이지 정보를 반환
    } catch (error) {
      return rejectWithValue(error.response.data); // -> state.error = action.payload 로전달
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [], // 모든 포스트 데이터
    searchTerm: '', // 검색어 상태 추가
    status: 'idle', // 요청 상태
    error: null, // 에러 상태
    page: 0, // 현재 페이지 번호
    hasMore: null, // 더 불러올 데이터가 있는지 여부
  },
  reducers: {
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

        console.log("fetched data",action.payload);
        
        state.status = 'succeeded';
        state.posts = action.payload; // 기존 데이터에 새로운 데이터를 추가
        state.page += 1;
        state.hasMore = action.payload.length > 0; // 데이터가 더 없으면 hasMore를 false로 설정
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
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
