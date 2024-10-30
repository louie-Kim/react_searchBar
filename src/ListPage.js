import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectFilteredPosts, setPage, setPageAndFetchPosts, setPageGroup } from './redux/PostSlice';
import { useInView } from "react-intersection-observer"
import Post from './Post';

const ListPage = () => {

    const dispatch = useDispatch();
    const posts = useSelector(selectFilteredPosts); // 서칭으로 필터링된 포스트
    const { status, error, page, hasMore, pageGroup} = useSelector((state) => state.posts);
    const { ref, inView } = useInView();
    
    
    console.log("page",page); 
    // console.log("hasMore",hasMore); 
    // console.log("검색어로 조회된 포스팅수",posts);
    // console.log("status:",status);
    // 현재 페이지 그룹에 따른 시작 페이지와 끝 페이지 설정

    // 현재 pageGroup에 기반 : 0 일때 만
    const startPage = pageGroup * 5 + 1;
    const endPage = startPage + 4;

    const handleNextGroup = () => {

      const newPageGroup = pageGroup + 1;
      dispatch(setPageGroup(newPageGroup));
      
      console.log("newPageGroup", newPageGroup);
      
       // pageGroup이 변경된 후의 값에 기반
      const startPage = newPageGroup * 5 + 1; 
      const endPage = startPage + 4; 
      // console.log("버튼안 startPage", startPage);
      // console.log("버튼안 endPage", startPage);
      
      // 페이지 범위 내의 각 페이지 데이터를 fetchPosts로 호출
      for (let page = startPage; page <= endPage; page++) {
          dispatch(fetchPosts(page));
      }
      
    };
  
    const handlePreviousGroup = () => {
      if (pageGroup > 0) {
        const newPageGroup = pageGroup - 1;
        dispatch(setPageGroup(newPageGroup));
    
        console.log("newPageGroup", newPageGroup);
    
        // pageGroup이 변경된 후의 값에 기반
        const startPage = newPageGroup * 5 + 1;
        const endPage = startPage + 4;
        // console.log("버튼안 startPage", startPage);
        // console.log("버튼안 endPage", endPage);
    
        // 페이지 범위 내의 각 페이지 데이터를 fetchPosts로 호출
        for (let page = startPage; page <= endPage; page++) {
          dispatch(fetchPosts(page));
        }
      }
    };
    

    
    
    // console.log("pageGroup", startPage);
    
    
    // // 무한 스크롤
    // // 스크롤이 바닥에 닿았을 때 다음 페이지를 불러옴
    // useEffect(() => {
    //   // inView: true(스크롤바닥) -> false        
    //   if (inView && status === 'succeeded' && hasMore) {
    //     dispatch(fetchPosts(page + 1));
    //   }
    // }, [inView, status, hasMore, page, dispatch]);
      
        
    // const handleNextPage = () => {
        //   if (hasMore) {
        //     const nextPage = page + 1;
        //     dispatch(setPage(nextPage)); // 다음 페이지로 이동
        //     dispatch(fetchPosts(nextPage)); // 다음 페이지에 해당하는 데이터 요청
        //   }
        // };
        
        // const handlePreviousPage = () => {
          //   if (page > 1) {
          //     const previousPage = page - 1;
          //     dispatch(setPage(previousPage)); // 이전 페이지로 이동
          //     dispatch(fetchPosts(previousPage)); // 이전 페이지에 해당하는 데이터 요청
          //   }
        // };

      // console.log("posts.length" , posts.length);
      console.log("startPage", startPage);
      // console.log("바깥 endPage", startPage);
    
    
    if (status === 'loading') {
        return <h2>Loading...</h2>;
      }
      
      if (status === 'failed') {
        return <h1>{error}</h1>;
      }
      
      // console.log("status",status);
      return (
    <div className="container">
      {posts.map((post) => <Post key={post.id} post={post} />)}
       
        {/* 무한스크롤 */}
        {/* <div ref={ref} style={ { backgroundColor: 'white' } }>
          <h1>{`Inside viewport: ${inView ? 'Yes' : 'No'}`}</h1>
        </div> */}
        
        <button 
          onClick={handlePreviousGroup} disabled={pageGroup === 0} 
          style={{ marginRight: '10px', borderRadius: '5px' }}>
            Previous
        </button>
          
          {/* {[...Array(posts.length)].map((_, index) => { */}
           {[...Array(endPage - startPage + 1)].map((_, index) => { 
                     const pageNumber = startPage + index;
                    //  console.log("pageNumber", pageNumber);
                     
                    return (
                        <button
                            key={pageNumber}
                            // onClick={() => dispatch(fetchPosts(page))}
                            onClick={() => {
                              dispatch(setPage(pageNumber));
                              dispatch(fetchPosts(pageNumber));
                            }}
                            style={{
                                margin: '5px',
                                backgroundColor:'white'
                            }}
                            disabled={page === pageNumber} 
                        >
                            {pageNumber}
                        </button>
                    )
            })}


        <button 
          onClick={handleNextGroup} disabled={!hasMore} 
          style={{ marginLeft: '10px', borderRadius: '5px' }}>
          Next
        </button>

      </div>

      
    
  );
};

export default ListPage;
