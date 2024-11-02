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
    console.log("status:",status);
    // 현재 페이지 그룹에 따른 시작 페이지와 끝 페이지 설정

    console.log("pageGourp", pageGroup);
    
    
  // 최초 pageGroup수로 버튼 만들기
  const startPage = pageGroup * 5 + 1;
  const endPage = startPage + 4;
  
    
    // 현재 페이지 그룹을 업데이트하는 함수
  const handlePreviousGroup = () => {
      if (pageGroup > 0) {
        dispatch(setPageGroup(pageGroup - 1)); 
        dispatch(setPageAndFetchPosts((pageGroup - 1) * 5 + 1)); 
      }
    };

    const handleNextGroup = () => {
      if (hasMore) {
        // console.log("pageGourp", pageGroup);
        dispatch(setPageGroup(pageGroup + 1)); 
        dispatch(setPageAndFetchPosts((pageGroup + 1) * 5 + 1)); 
      }
    };
    
    // // 무한 스크롤
    // // 스크롤이 바닥에 닿았을 때 다음 페이지를 불러옴
    // useEffect(() => {
    //   // inView: true(스크롤바닥) -> false        
    //   if (inView && status === 'succeeded' && hasMore) {
    //     dispatch(fetchPosts(page + 1));  // page + 1 = pageParam
    //   }
    // }, [inView, status, hasMore, page, dispatch]);

    // console.log("posts" , posts);
    // console.log("startPage", startPage);
    // console.log("endPage", endPage);
  
    
    if (status === 'loading') {
      return <h2>Loading...</h2>;
    }
    
    if (status === 'failed') {
      return <h1>{error}</h1>;
    }
      
      // console.log("status",status);
      return (
    <div className="container">
      {/* {posts.map((post) => <Post key={post.id} post={post} />)} */}
       
        {/* 무한스크롤 */}
        {/* <div ref={ref} style={ { backgroundColor: 'white' } }>
          <h1>{`Inside viewport: ${inView ? 'Yes' : 'No'}`}</h1>
        </div> */}
        
        <button 
          onClick={handlePreviousGroup} disabled={pageGroup === 0} 
          style={{ marginRight: '10px', borderRadius: '5px' }}>
            Previous
        </button>
          
        {[...Array(endPage - startPage + 1)].map((_, index) => { 
                  const pageNumber = startPage + index;
                //  console.log("pageNumber", pageNumber);
                  
                return (
                    <button
                        key={pageNumber}
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

        {posts.map((post) => <Post key={post.id} post={post} />)}


      </div>

      
    
  );
};

export default ListPage;
