// import React from 'react';
// import Post from './Post';
// import { useSelector } from 'react-redux';
// import { selectFilteredPosts } from './redux/PostSlice';

// const ListPage = () => {

//   // 필터링된 검색 결과 가져오기
//   // searchResults는 메모이제이션된 값
//   const searchResults = useSelector(selectFilteredPosts); 

//   const results = searchResults.map((post) => <Post key={post.id} post={post} />); // 포스트 목록 렌더링

//   const content = results.length ? results : <article><p>No Matching Posts</p></article>;

//   return (
//     <main>{content}</main>
//   );
// };

// export default ListPage;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectFilteredPosts } from './redux/PostSlice';
import { useInView } from 'react-intersection-observer';
import Post from './Post';

const ListPage = () => {

    const dispatch = useDispatch();
    // const posts = useSelector(selectFilteredPosts); // 필터링된 포스트
    const { status, error, page, hasMore, posts } = useSelector((state) => state.posts);
    const { ref, inView } = useInView({ threshold: 1 });


    
    // 스크롤이 바닥에 닿았을 때 다음 페이지를 불러옴
    useEffect(() => {
      // inView: true(스크롤바닥)->false        
      if (inView && status === 'succeeded' && hasMore) {
        dispatch(fetchPosts(page + 1));
      }
    }, [inView, status, hasMore, page, dispatch]);
    

    
    if (status === 'loading') {
        return <h2>Loading...</h2>;
      }
      
      if (status === 'failed') {
        return <h1>{error}</h1>;
      }
      
      console.log("hasMore",hasMore);
  return (
    <div className="container">
      {posts.map((post) => <Post key={post.id} post={post} />)}
      <div ref={ref}>
        {status === 'loading' && 'Loading more...'}
      </div>
    </div>
  );
};

export default ListPage;
