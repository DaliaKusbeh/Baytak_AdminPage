
// export default Profile;import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { getAdminId, getAuthToken } from '../Login/auth';
import axios from 'axios';
import './profile.css'; 

const Profile = () => {
  const [adminData, setAdminData] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminId = getAdminId();
        const authToken = getAuthToken();

        const response = await axios.get('http://176.119.254.180:8081/admin', {
          headers: {
            Authorization: `Bearer ${authToken}` 
          }
        });
        
        if (response.status === 200) {
          setAdminData(response.data[0]); 
        } else {
          toast.error('Failed to fetch admin data.');
        }
      } catch (error) {
        toast.error('Failed to fetch admin data.');
        console.error(error);
      }
    };

    fetchAdminData();
  }, []);

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error('Password should be at least 8 characters long.');
      return;
    }

    if (!/\d/.test(newPassword)) {
      toast.error('Password should contain at least one digit.');
      return;
    }

    try {
      const authToken = getAuthToken();

      const response = await axios.put(
        'http://176.119.254.180:8081/admin/change_password',
        {
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}` // إضافة التوكن في عنوان الطلب
          }
        }
      );

      if (response.status === 200) {
        toast.success('Password changed successfully.');
      } else {
        toast.error('Failed to change password.');
      }
    } catch (error) {
      toast.error('Failed to change password.');
      console.error(error);
    }
  };

  return (
    <div className="profile-container">
      {adminData ? (
        <div>
          <h2>Admin profile</h2>
          <p>Username: {adminData.username}</p>
          <p>Email: {adminData.email}</p>
        </div>
      ) : (
        <p>Loading admin profile...</p>
      )}

      <div>
        <h3>Change your password</h3>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button onClick={handleChangePassword}>Change Password</button>
      </div>
    </div>
  );
};

export default Profile;

