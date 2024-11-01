import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (pageParam, { rejectWithValue }) => {
    console.log("pageParam",pageParam);
    
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`
      );
      console.log("Fetched data:", response.data); 
      return response.data; // 데이터와 페이지 정보를 반환
    } catch (error) {
      return rejectWithValue(error.response.data); // -> state.error = action.payload 로전달
    }
  }
);

// getState : 현재 상태를 가져오는 함수
export const setPageAndFetchPosts = (nextPage) => (dispatch, getState) => {
  // 페이지를 업데이트하고 최신 page 값으로 fetchPosts 호출
  console.log("next page?");
  
  dispatch(setPage(nextPage));
  const updatedPage = getState().posts.page;
  dispatch(fetchPosts(updatedPage));
};


const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [], 
    searchTerm: '', 
    status: 'idle', 
    error: null, 
    page: 1, // 현재 페이지 번호 , 무한스크롤때는 0 으로 설정
    pageGroup: 0, 
    hasMore: null, 
  },
  reducers: {
    setSearchTerm: (state, action) => {
      console.log("검색어 ", action.payload);
      state.searchTerm = action.payload; // 검색어 상태 업데이트
     
    },
    // 페이지 네이션
    setPage: (state, action) => {
      console.log("페이지 번호: ", action.payload);

      state.page = action.payload; // 페이지 번호를 업데이트
    },
    setPageGroup: (state, action) => {  
      // 페이지 그룹을 설정하는 액션 추가
      console.log("페이지 그룹", action.payload);
      
      state.pageGroup = action.payload;
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
       
        // state.page += 1 ;          // 무한스크롤때는 살리기
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

// 메모이제이션된 검색 결과 
// 최초 렌더링 시에도 동작 -> 모든 selector가 처음 한 번 실행
export const selectFilteredPosts = createSelector(
  [selectPosts, selectSearchTerm],
  (posts, searchTerm) => {

     // 메모이제이션 로깅: searchTerm과 posts가 바뀔 때만 실행됨
     console.log('Memoization!');
    
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

export const { setSearchTerm, setPage, setPageGroup } = postsSlice.actions;

export default postsSlice.reducer;
