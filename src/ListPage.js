import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectFilteredPosts } from './redux/PostSlice';
import { useInView } from "react-intersection-observer"
import Post from './Post';

const ListPage = () => {

    const dispatch = useDispatch();
    const posts = useSelector(selectFilteredPosts); // 필터링된 포스트
    const { status, error, page, hasMore } = useSelector((state) => state.posts);
    const { ref, inView } = useInView();

    console.log("검색어 조회된 포스팅수",posts);
    console.log("status:",status);
    
    
    // 스크롤이 바닥에 닿았을 때 다음 페이지를 불러옴
    useEffect(() => {
      // inView: true(스크롤바닥) -> false        
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
    
    console.log("page",page); //2
    // console.log("status",status);
  return (
    <div className="container">
      {posts.map((post) => <Post key={post.id} post={post} />)}

      <div ref={ref} style={ { backgroundColor: 'white' } }>
         <h1>{`Inside viewport: ${inView ? 'Yes' : 'No'}`}</h1>
      </div>
      
    </div>
  );
};

export default ListPage;
