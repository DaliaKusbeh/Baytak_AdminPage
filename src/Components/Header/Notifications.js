import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthToken } from '../Login/auth';
import './Notifications.css'; // استورد ملف الأنماط CSS هنا

const Notifications = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = getAuthToken(); // You may need to implement the function to get the authentication token.
        const response = await axios.get('http://176.119.254.180:8081/admin/customers/messages', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to decode Base64 image data and return the URL
  const decodeBase64Image = (base64String) => {
    return `data:image/jpeg;base64,${base64String}`;
  };

  useEffect(() => {
    console.log('Data:', data);
    console.log('Error:', error);
  }, [data, error]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Notifications</h1>
      <div className="notifications-list">
        {data.map((item) => (
          <div key={item.id} className="notification-item">
            {item.userDetails.image ? (
              <div className="profile-image">
                <img src={decodeBase64Image(item.userDetails.image)} alt={`Notification ${item.id}`} />
              </div>
            ) : (
              <span className="no-image">No Image Available</span>
            )}
            <div className="notification-info">
              <p>To {item.userDetails.firstName} {item.userDetails.lastName} | {item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
