import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const ListPage = () => {

const searchResults = useSelector((state)=> state.posts.searchResults)

console.log("searchResults",searchResults);

  const results = searchResults.map( post=> <Post key={post.id} post={post}  /> )  
  console.log("ListPage[]",  results);
  
  const content = results?.length ? results : <article><p>No Matching Posts</p></article>
  
  return (
    <main>{content}</main>
  )

}

export default ListPage