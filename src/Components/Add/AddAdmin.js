import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './Admin.css';
import { getAuthToken } from '../Login/auth';
import { NavLink } from 'react-router-dom';

function AddAdmin() {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [adminData, setAdminData] = useState(null);
  const [selectedAdmins, setSelectedAdmins] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function saveAdmin() {
    if (!username || !password || !confirmPass || !email) {
      toast.error('Please fill in all fields.');
    } else if (password !== confirmPass) {
      toast.error('Password and Confirm Password do not match.', {
        className: 'error-toast' // Add a custom CSS class for error toast
      });
    } else {
      try {
        const authToken = getAuthToken(); // Get the token from the getAuthToken() method

        const response = await axios.post(
          'http://176.119.254.180:8081/admin',
          {
            email,
            username,
            password,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}` // Include the token in the request headers
            }
          }
        );

        if (response.status === 200) {
          toast.success('Admin added successfully!');
          // Reset form values
          setEmail('');
          setusername('');
          setPassword('');
          setConfirmPass('');
          fetchAdminData(); // Fetch admin data again after adding a new admin
        }
      } catch (error) {
        toast.error('An error occurred while adding the admin.');
        console.error(error);
      }
    }
  }

  async function fetchAdminData() {
    try {
      const authToken = getAuthToken(); // Get the token from the getAuthToken() method

      const response = await axios.get('http://176.119.254.180:8081/admin', {
        headers: {
          Authorization: `Bearer ${authToken}` // Include the token in the request headers
        }
      });

      if (response.status === 200) {
        setAdminData(response.data);
      }
    } catch (error) {
      toast.error('An error occurred while fetching admin data.');
      console.error(error);
    }
  }

  function handleAdminSelect(event, admin) {
    const selected = event.target.checked;
    if (selected) {
      setSelectedAdmins(prevSelectedAdmins => [...prevSelectedAdmins, admin]);
    } else {
      setSelectedAdmins(prevSelectedAdmins =>
        prevSelectedAdmins.filter(selectedAdmin => selectedAdmin !== admin)
      );
    }
  }

  async function deleteSelectedAdmins() {
    try {
      const authToken = getAuthToken();
      const adminIds = selectedAdmins.map(admin => admin.adminId); // Ensure that the property name is correct (e.g., adminId)

      if (adminIds.length === 0) {
        toast.error('Please select at least one admin to delete.');
        return;
      }

      await Promise.all(
        adminIds.map(async adminId => {
          const response = await axios.delete(
            `http://176.119.254.180:8081/admin/${adminId}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`
              }
            }
          );

          if (response.status !== 200) {
            throw new Error(`Failed to delete admin with ID ${adminId}`);
          }
        })
      );

      toast.success('Admin(s) deleted successfully!');
      setSelectedAdmins([]);
      fetchAdminData();
    } catch (error) {
      toast.error('An error occurred while deleting the admin(s).');
      console.error(error);
    }
  }

  return (
    <div className="container-admin">
      <div className="add-admin-form">
        <h1>
          <i></i>
          Add New Admin
        </h1>
        <div className="form-fields">
          <div className="form-field">
            <label>Username</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              name="userName"
            />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
          </div>
          <div className="form-field">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              name="cpassword"
            />
          </div>
          <i className="material-icons i-color-add" onClick={saveAdmin}>add_person</i>
        </div>
      </div>
      <NavLink to='/AdminList' className={"showAdmin"}> <button className='h222'>Show Admin In Baytak </button></NavLink>
      <ToastContainer
        toastStyle={{
          background: '#333',
          color: '#fff',
          borderRadius: '15px',
        }}
        bodyClassName="toast-body"
      />    </div>
  );
}

export default AddAdmin;
