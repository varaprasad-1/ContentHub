import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    mediaUrl: '',
    platforms: [],
    category: '',
    tags: '',
  });

  const token = localStorage.getItem('token');

  const API_URL =
    process.env.REACT_APP_API_URL ||
    'http://localhost:5000/api';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePlatformChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData({
        ...formData,
        platforms: [...formData.platforms, value],
      });
    } else {
      setFormData({
        ...formData,
        platforms: formData.platforms.filter(
          (platform) => platform !== value
        ),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/posts`,
        {
          ...formData,
          tags: formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Post created successfully!');

      setFormData({
        title: '',
        description: '',
        content: '',
        mediaUrl: '',
        platforms: [],
        category: '',
        tags: '',
      });

      setShowForm(false);

      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);

      alert(
        error.response?.data?.error ||
          'Failed to create post'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);

      alert(
        error.response?.data?.error ||
          'Failed to delete post'
      );
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <h1 className="card-title">Posts</h1>

      <div
        className="card"
        style={{ marginBottom: '2rem' }}
      >
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Create Post'}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{ marginTop: '1.5rem' }}
          >
            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter post description"
              />
            </div>

            <div className="form-group">
              <label>Content</label>

              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your post content..."
                required
              />
            </div>

            <div className="form-group">
              <label>Media URL</label>

              <input
                type="text"
                name="mediaUrl"
                value={formData.mediaUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <label>Category</label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Technology, Education, Entertainment..."
              />
            </div>

            <div className="form-group">
              <label>Tags</label>

              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="coding, technology, programming"
              />
            </div>

            <div className="form-group">
              <label>Platforms</label>

              <div>
                {[
                  'YouTube',
                  'TikTok',
                  'Instagram',
                  'Twitch',
                  'Patreon',
                  'Twitter',
                  'LinkedIn',
                ].map((platform) => (
                  <label
                    key={platform}
                    style={{
                      display: 'inline-block',
                      marginRight: '1rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      value={platform}
                      checked={formData.platforms.includes(
                        platform
                      )}
                      onChange={handlePlatformChange}
                    />

                    {' '}

                    {platform}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success"
            >
              Create Post
            </button>
          </form>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">
          My Posts
        </h2>

        {posts.length === 0 ? (
          <p>
            No posts created yet. Click
            {' '}
            <strong>Create Post</strong>
            {' '}
            to create your first post.
          </p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Platforms</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td>{post.title}</td>

                    <td>
                      {post.category || 'N/A'}
                    </td>

                    <td>
                      {post.platforms?.join(', ') ||
                        'N/A'}
                    </td>

                    <td>
                      {post.status || 'draft'}
                    </td>

                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleDelete(post._id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Posts;   