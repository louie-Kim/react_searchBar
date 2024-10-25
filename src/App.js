import React from 'react';
import { useSelector } from 'react-redux';
import SearchBar from './SearchBar';
import ListPage from './ListPage';

function App() {
  
  // posts 상태와 fetch 상태 가져오기
  const postStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  // index에서 store.dispatch(fetchPosts());

  // useEffect(() => {
  //   if (postStatus === 'idle') {
  //     // 컴포넌트가 마운트될 때 데이터를 가져옴
  //     dispatch(fetchPosts());
  //   }
  // }, [postStatus, dispatch]);

  return (
    <>
      {postStatus === 'loading' && <p>Loading...</p>}
      {postStatus === 'failed' && <p>Error: {error}</p>}
      {postStatus === 'succeeded' && (
        <>
          <SearchBar/>
          <ListPage/>
        </>
      )}
    </>
  );
}

export default App;
