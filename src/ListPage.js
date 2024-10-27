import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectFilteredPosts, setPage } from './redux/PostSlice';
import { useInView } from "react-intersection-observer"
import Post from './Post';

const ListPage = () => {

    const dispatch = useDispatch();
    const posts = useSelector(selectFilteredPosts); // 서칭으로 필터링된 포스트
    const { status, error, page, hasMore} = useSelector((state) => state.posts);
    const { ref, inView } = useInView();
    
    
    console.log("page",page); 
    // console.log("hasMore",hasMore); 
    // console.log("검색어로 조회된 포스팅수",posts);
    // console.log("status:",status);
    
    // // 무한 스크롤
    // // 스크롤이 바닥에 닿았을 때 다음 페이지를 불러옴
    // useEffect(() => {
    //   // inView: true(스크롤바닥) -> false        
    //   if (inView && status === 'succeeded' && hasMore) {
    //     dispatch(fetchPosts(page + 1));
    //   }
    // }, [inView, status, hasMore, page, dispatch]);


    const handleNextPage = () => {
      if (hasMore) {
        const nextPage = page + 1;
        dispatch(setPage(nextPage)); // 다음 페이지로 이동
        dispatch(fetchPosts(nextPage)); // 다음 페이지에 해당하는 데이터 요청
      }
    };
    
    const handlePreviousPage = () => {
      if (page > 1) {
        const previousPage = page - 1;
        dispatch(setPage(previousPage)); // 이전 페이지로 이동
        dispatch(fetchPosts(previousPage)); // 이전 페이지에 해당하는 데이터 요청
      }
    };
    
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
        
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            style={{ marginRight: '10px' , borderRadius: '5px' }}
          >
            Previous
          </button>
          {/* <span style={{ backgroundColor: 'white', padding: '5px 10px', borderRadius: '5px' }}>
            Page: {page}
          </span> */}

          {[...Array(10)].map((_, index) => {
                    const page = index + 1;
                    
                    return (
                        <button
                            key={page}
                            onClick={() => dispatch(fetchPosts(page))}
                            style={{
                                margin: '5px',
                                backgroundColor:'white'
                            }}
                            // disabled={page === page}
                        >
                            {page}
                        </button>
                    )
            })}


          <button
            onClick={handleNextPage}
            // disabled={!hasMore}
            disabled={page === 10}
            style={{ marginLeft: '10px', borderRadius: '5px' }}
          >
            Next
          </button>
      </div>

      
    </div>
  );
};

export default ListPage;
