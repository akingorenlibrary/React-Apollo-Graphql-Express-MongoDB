import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import './App.css'; // App.css'i dahil et

const GET_POSTS = gql`
  query {
    posts {
      id
      title
      content
    }
  }
`;

const ADD_POST = gql`
  mutation AddPost($title: String!, $content: String!) {
    addPost(title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_POSTS);
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });

  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      addPost({ variables: { title: newPost.title, content: newPost.content } })
        .then(() => {
          setNewPost({ title: '', content: '' });
        })
        .catch((err) => {
          console.error('Error adding post:', err);
        });
    } else {
      alert('Title and Content are required!');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Posts</h1>

      <div>
        <h2>Add New Post</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Content</label>
            <textarea
              name="content"
              value={newPost.content}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Add Post</button>
        </form>
      </div>

      <h2>All Posts</h2>
      {data.posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        data.posts.map((post) => (
          <div key={post.id} style={{ marginBottom: '20px' }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
