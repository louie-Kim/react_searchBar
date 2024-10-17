const Post = ({ post }) => {
    return (
        <article>
            <h2>shit!! {post.title}</h2>
            <p>{post.body}</p>
            <p>Post ID: {post.id}</p>
        </article>
    )
}
export default Post