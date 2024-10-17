import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"


const SearchBar = ({ posts, setSearchResults }) => {

  console.log("SearchBar posts",posts);
  

  const handleSubmit = (e)=> e.preventDeffault() // 새로고침 방지 
 
  const handleSearchChange = (e) =>{

    // if(!e.target.value) return setSearchResults(posts)
    // const resultArray = posts.filter(post => {
    //   // 
    //   // 게시글 100개 로깅 추가
    //   console.log("Post Title:", post.title);
    //   console.log("Post Body:", post.body);
    //   console.log("Post id:", post.id);
    //   return post.title.includes(e.target.value) || post.body.includes(e.target.value);
    // });



    // 사용자가 입력한 값을 공백 없이 이어붙임 , (/\s+/g, '') 문자열 내에서 공백을 찾아 제거하는 정규식
    const searchTerm = e.target.value.replace(/\s+/g, '');

    if(!searchTerm) return setSearchResults(posts)

    const resultArray = posts.filter(post => {

      // 게시글 100개 로깅 추가
      console.log("Post Title:", post.title);
      console.log("Post Body:", post.body);
      console.log("Post id:", post.id);
      //  post.title 문자열에서 '공백'을 제거
      const titleNoSpaces = post.title.replace(/\s+/g, '');
      // post.body 문자열에서 공백을 제거
      const bodyNoSpaces = post.body.replace(/\s+/g, '');
      
      // include(): true , false 반환
      // searchTerm에서 공백을 제거하고, titleNoSpaces에서도 공백을 제거한 후, 
      // 두 값을 비교하여 '포함 여부'를 확인
      return titleNoSpaces.includes(searchTerm) || bodyNoSpaces.includes(searchTerm);
    });

      console.log("서칭 결과", resultArray);
        
      // searchResults -> App.js -> <ListPage searchResults={searchResults} />
      setSearchResults(resultArray) 
  }      

  return (

    <header>
        <form className="search" onSubmit={handleSubmit}>
            <input
                className="search__input"
                type="text"
                id="search"
                onChange={handleSearchChange}
            />
            <button className="search__button">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </form>
    </header>
  )

}

export default SearchBar