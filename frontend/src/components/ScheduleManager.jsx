import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ScheduleManager() {
  const [schedules, setSchedules] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    postId: '',
    platform: 'YouTube',
    scheduledTime: '',
    notes: '',
  });

  const token = localStorage.getItem('token');

  const API_URL =
    process.env.REACT_APP_API_URL ||
    'http://localhost:5000/api';

  useEffect(() => {
    fetchSchedules();
    fetchPosts();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/schedules`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSchedules(response.data);
    } catch (error) {
      console.error(
        'Error fetching schedules:',
        error
      );
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error(
        'Error fetching posts:',
        error
      );

      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/schedules`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        postId: '',
        platform: 'YouTube',
        scheduledTime: '',
        notes: '',
      });

      setShowForm(false);

      fetchSchedules();
    } catch (error) {
      console.error(
        'Error creating schedule:',
        error
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this schedule?'
      )
    ) {
      try {
        await axios.delete(
          `${API_URL}/schedules/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchSchedules();
      } catch (error) {
        console.error(
          'Error deleting schedule:',
          error
        );
      }
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <h1 className="card-title">
        Schedule Manager
      </h1>

      <div
        className="card"
        style={{ marginBottom: '2rem' }}
      >
        <button
          className="btn btn-primary"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          {showForm
            ? '✕ Cancel'
            : '+ Create Schedule'}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              marginTop: '1.5rem',
            }}
          >
            <div className="form-group">
              <label>
                Select Post
              </label>

              <select
                name="postId"
                value={formData.postId}
                onChange={handleInputChange}
                required
              >
                <option value="">
                  {posts.length
                    ? 'Choose a post...'
                    : 'No posts available — create one in Posts'}
                </option>

                {posts.map((post) => (
                  <option
                    key={post._id}
                    value={post._id}
                  >
                    {post.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                Platform
              </label>

              <select
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
              >
                <option value="YouTube">
                  YouTube
                </option>

                <option value="TikTok">
                  TikTok
                </option>

                <option value="Instagram">
                  Instagram
                </option>

                <option value="Twitch">
                  Twitch
                </option>

                <option value="Patreon">
                  Patreon
                </option>

                <option value="Twitter">
                  Twitter
                </option>

                <option value="LinkedIn">
                  LinkedIn
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Scheduled Time
              </label>

              <input
                type="datetime-local"
                name="scheduledTime"
                value={
                  formData.scheduledTime
                }
                onChange={
                  handleInputChange
                }
                required
              />
            </div>

            <div className="form-group">
              <label>
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={
                  handleInputChange
                }
                placeholder="Add any notes about this schedule..."
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
            >
              Schedule Post
            </button>
          </form>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">
          All Schedules
        </h2>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Post Title</th>
                <th>Platform</th>
                <th>Scheduled Time</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {schedules.length > 0 ? (
                schedules.map(
                  (schedule) => (
                    <tr key={schedule._id}>
                      <td>
                        {schedule.postId
                          ?.title ||
                          'N/A'}
                      </td>

                      <td>
                        {schedule.platform}
                      </td>

                      <td>
                        {new Date(
                          schedule.scheduledTime
                        ).toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`badge badge-${schedule.status}`}
                        >
                          {schedule.status}
                        </span>
                      </td>

                      <td>
                        {schedule.notes}
                      </td>

                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleDelete(
                              schedule._id
                            )
                          }
                          style={{
                            padding:
                              '0.25rem 0.75rem',
                            fontSize:
                              '0.875rem',
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    No schedules found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ScheduleManager;