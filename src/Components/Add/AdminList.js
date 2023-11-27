import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../Login/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminList.css';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://176.119.254.180:8081/admin', {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`, // Include the authentication token if required
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = (event, adminId) => {
    if (event.target.checked) {
      setSelectedAdmins(prevSelectedAdmins => [...prevSelectedAdmins, adminId]);
    } else {
      setSelectedAdmins(prevSelectedAdmins =>
        prevSelectedAdmins.filter(id => id !== adminId)
      );
    }
  };

  const handleDeleteSelectedAdmins = async () => {
    try {
      for (const adminId of selectedAdmins) {
        const response = await fetch(
          `http://176.119.254.180:8081/admin/${adminId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${getAuthToken()}`, // Include the authentication token if required
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete admin with ID ${adminId}`);
        }
      }

      // Refetch admins after deletion
      fetchAdmins();
      setSelectedAdmins([]);

      toast.success('Admin(s) successfully deleted');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while deleting admin(s)');
    }
  };

  return (
    <div className="admin-list-container">
<div className="admin-list-header">
  <i className="material-icons">checklist</i>
  <h1>Admin List</h1>
</div>
      {admins.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <React.Fragment>
          <table className='admin-table'>
            <thead>
              <tr>
                <th></th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.adminId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedAdmins.includes(admin.adminId)}
                      onChange={event =>
                        handleCheckboxChange(event, admin.adminId)
                      }
                    />
                  </td>
                  <td>{admin.username}</td>
                  <td>{admin.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="delete-button"
            onClick={handleDeleteSelectedAdmins}
            disabled={selectedAdmins.length === 0}
          >
            Delete Selected Admins
          </button>
        </React.Fragment>
      )}
      <ToastContainer
        toastStyle={{
          background: '#333',
          color: '#fff',
          borderRadius: '15px',
        }}
        bodyClassName="toast-body"
      />
    </div>
  );
};

export default AdminList;
