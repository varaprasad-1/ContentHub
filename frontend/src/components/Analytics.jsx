import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Analytics() {
  const [analytics, setAnalytics] = useState([]);
  const [platformStats, setPlatformStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedPlatform, setSelectedPlatform] =
    useState('all');

  const token = localStorage.getItem('token');

  const API_URL =
    process.env.REACT_APP_API_URL ||
    'http://localhost:5000/api';


  useEffect(() => {

    const fetchAnalytics = async () => {

      setLoading(true);

      try {

        let response;

        if (selectedPlatform === 'all') {

          response = await axios.get(
            `${API_URL}/analytics`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        } else {

          response = await axios.get(
            `${API_URL}/analytics/platform/${selectedPlatform}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        }


        const data = response.data || [];

        setAnalytics(data);


        // ----------------------------------
        // Calculate platform statistics
        // ----------------------------------

        const stats = {};


        data.forEach((item) => {

          const platform = item.platform;

          if (!stats[platform]) {

            stats[platform] = {
              views: 0,
              likes: 0,
              comments: 0,
              shares: 0,
              revenue: 0,
              count: 0,
            };

          }


          stats[platform].views +=
            Number(item.views || 0);

          stats[platform].likes +=
            Number(item.likes || 0);

          stats[platform].comments +=
            Number(item.comments || 0);

          stats[platform].shares +=
            Number(item.shares || 0);

          stats[platform].revenue +=
            Number(item.revenue || 0);

          stats[platform].count += 1;

        });


        setPlatformStats(stats);


      } catch (error) {

        console.error(
          'Error fetching analytics:',
          error.response?.data ||
          error.message
        );

        setAnalytics([]);
        setPlatformStats({});

      } finally {

        setLoading(false);

      }

    };


    fetchAnalytics();

  }, [selectedPlatform, API_URL, token]);


  if (loading) {
    return <div className="spinner"></div>;
  }


  return (

    <div>

      <h1 className="card-title">
        Analytics
      </h1>


      {/* PLATFORM FILTER */}
      <div
        className="card"
        style={{
          marginBottom: '2rem'
        }}
      >

        <select
          value={selectedPlatform}
          onChange={(e) =>
            setSelectedPlatform(e.target.value)
          }
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border)',
            fontSize: '1rem'
          }}
        >

          <option value="all">
            All Platforms
          </option>

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


      {/* PLATFORM STATISTICS */}
      <div className="card">

        <h2 className="card-title">
          Platform Statistics
        </h2>


        <div className="table-responsive">

          <table>

            <thead>

              <tr>

                <th>
                  Platform
                </th>

                <th>
                  Total Views
                </th>

                <th>
                  Total Likes
                </th>

                <th>
                  Total Comments
                </th>

                <th>
                  Total Shares
                </th>

                <th>
                  Revenue
                </th>

                <th>
                  Posts
                </th>

              </tr>

            </thead>


            <tbody>

              {Object.keys(platformStats).length > 0 ? (

                Object.keys(platformStats).map(
                  (platform) => {

                    const stats =
                      platformStats[platform];

                    return (

                      <tr key={platform}>

                        <td>
                          <strong>
                            {platform}
                          </strong>
                        </td>


                        <td>
                          {stats.views.toLocaleString()}
                        </td>


                        <td>
                          {stats.likes.toLocaleString()}
                        </td>


                        <td>
                          {stats.comments.toLocaleString()}
                        </td>


                        <td>
                          {stats.shares.toLocaleString()}
                        </td>


                        <td>
                          ${stats.revenue.toLocaleString()}
                        </td>


                        <td>
                          {stats.count}
                        </td>

                      </tr>

                    );

                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign: 'center',
                      padding: '2rem'
                    }}
                  >
                    No analytics data available
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

export default Analytics;