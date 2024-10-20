import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from './redux/PostSlice';
// import { selectFilteredPosts } from './redux/PostSlice';

const SearchBar = () => {

  // const [ searchTerm, setSearchTerm ]=useState('')
  const dispatch = useDispatch();
  
  // Redux 상태에서 검색어를 가져옴
  // const searchTerm = useSelector((state) => state.posts.searchTerm);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value)); // Redux 상태로 검색어 업데이트
  };

  const handleSubmit = (e) => e.preventDefault(); // 새로고침 방지

  return (
    <header>
      <form className="search" onSubmit={handleSubmit}>
        <input
          className="search__input"
          type="text"
          id="search"
          // value={searchTerm} // Redux 상태에서 검색어 사용
          onChange={handleSearchChange}
        />
        <button className="search__button">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>
    </header>
  );
};

export default SearchBar;
