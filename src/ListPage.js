import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';
import { selectFilteredPosts } from './redux/PostSlice';

const ListPage = () => {

  // 필터링된 검색 결과 가져오기
  // searchResults는 메모이제이션된 값
  const searchResults = useSelector(selectFilteredPosts); 

  const results = searchResults.map((post) => <Post key={post.id} post={post} />); // 포스트 목록 렌더링

  const content = results.length ? results : <article><p>No Matching Posts</p></article>;

  return (
    <main>{content}</main>
  );
};

export default ListPage;
