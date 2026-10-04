import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    totalRevenue: 0,
    averageEngagement: 0,
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const API_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Get dashboard statistics
        const statsResponse = await axios.get(
          `${API_URL}/analytics/summary/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats({
          totalViews: Number(statsResponse.data.totalViews || 0),
          totalLikes: Number(statsResponse.data.totalLikes || 0),
          totalComments: Number(statsResponse.data.totalComments || 0),
          totalShares: Number(statsResponse.data.totalShares || 0),
          totalRevenue: Number(statsResponse.data.totalRevenue || 0),
          averageEngagement: Number(
            statsResponse.data.averageEngagement || 0
          ),
        });


        // Get recent posts
        const postsResponse = await axios.get(
          `${API_URL}/posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPosts(postsResponse.data.slice(0, 5));

      } catch (error) {
        console.error(
          'Error fetching dashboard data:',
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, token]);


  if (loading) {
    return <div className="spinner"></div>;
  }


  return (
    <div>

      <h1 className="card-title">
        Dashboard Overview
      </h1>


      {/* STATISTICS */}
      <div className="grid">

        <div className="stat-card">
          <div className="stat-label">
            Total Views
          </div>

          <div className="stat-value">
            {stats.totalViews.toLocaleString()}
          </div>
        </div>


        <div className="stat-card success">
          <div className="stat-label">
            Total Likes
          </div>

          <div className="stat-value">
            {stats.totalLikes.toLocaleString()}
          </div>
        </div>


        <div className="stat-card warning">
          <div className="stat-label">
            Total Comments
          </div>

          <div className="stat-value">
            {stats.totalComments.toLocaleString()}
          </div>
        </div>


        <div className="stat-card danger">
          <div className="stat-label">
            Total Shares
          </div>

          <div className="stat-value">
            {stats.totalShares.toLocaleString()}
          </div>
        </div>


        <div className="stat-card success">
          <div className="stat-label">
            Total Revenue
          </div>

          <div className="stat-value">
            ${stats.totalRevenue.toLocaleString()}
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-label">
            Avg Engagement
          </div>

          <div className="stat-value">
            {stats.averageEngagement}%
          </div>
        </div>

      </div>


      {/* RECENT POSTS */}
      <div className="card">

        <h2 className="card-title">
          Recent Posts
        </h2>

        <div className="table-responsive">

          <table>

            <thead>
              <tr>
                <th>Title</th>
                <th>Platforms</th>
                <th>Status</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Comments</th>
                <th>Shares</th>
              </tr>
            </thead>


            <tbody>

              {posts.length > 0 ? (

                posts.map((post) => (

                  <tr key={post._id}>

                    <td>
                      {post.title}
                    </td>


                    <td>
                      {Array.isArray(post.platforms)
                        ? post.platforms.join(', ')
                        : '-'}
                    </td>


                    <td>

                      <span
                        className={`badge badge-${post.status}`}
                      >
                        {post.status}
                      </span>

                    </td>


                    <td>
                      {Number(post.views || 0).toLocaleString()}
                    </td>


                    <td>
                      {Number(post.likes || 0).toLocaleString()}
                    </td>

                    <td>
                      {Number(post.comments || 0).toLocaleString()}
                    </td>

                    <td>
                      {Number(post.shares || 0).toLocaleString()}
                    </td>

                    </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    style={{
                      textAlign: 'center',
                      padding: '2rem'
                    }}
                  >
                    No posts available
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

export default Dashboard;