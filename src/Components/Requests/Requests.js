import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthToken } from '../Login/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Request.css'

const Request = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showTables, setShowTables] = useState(false);
  const [serviceType, setServiceType] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');

  const fetchServiceProviders = async () => {
    try {
      const authToken = getAuthToken();

      const response = await axios.get('http://176.119.254.180:8081/admin/providers', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.status === 200) {
        setServiceProviders(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const handleCheckboxChange = (provider) => {
    if (selectedProvider === provider) {
      setSelectedProvider(null);
      setShowTables(false);
      setServiceType('');
      setServiceDescription('');
    } else {
      setSelectedProvider(provider);
      setShowTables(true);
      setServiceType(provider.serviceRequest?.serviceType || '');
      setServiceDescription(provider.serviceRequest?.serviceDescription || '');
    }
  };

  const handleApprove = async () => {
    try {
      const authToken = getAuthToken();

      await axios.post(
        'http://176.119.254.180:8081/admin/providers',
        { serviceProviderId: selectedProvider.id },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      const response = await axios.get('http://176.119.254.180:8081/provider', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      const providerExists = response.data.some((provider) => provider.id === selectedProvider.id);

      if (providerExists) {
        toast.success(`Provider added successfully, Approve email sent to ${selectedProvider.email}`);
      } else {
        toast.error(`Failed to add provider, Reject email sent to ${selectedProvider.email}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    }
  };

  const handleDecline = async () => {
    try {
      const authToken = getAuthToken();

      await axios.delete(`http://176.119.254.180:8081/admin/providers`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        data: {
          serviceProviderId: selectedProvider.id
        }
      });

      toast.success(`Provided decline successfully, Reject email sent to ${selectedProvider.email}`);
      setSelectedProvider(null);
      setShowTables(false);
      setServiceType('');
      setServiceDescription('');
      fetchServiceProviders();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    }
  };

  return (
    <div className="request-container">
      {serviceProviders.length > 0 && (
        <table className="service-providers-table">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phonenumber</th>
              <th>City</th>
              <th>Region</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {serviceProviders.map((provider) => (
              <tr key={provider.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProvider === provider}
                    onChange={() => handleCheckboxChange(provider)}
                  />
                </td>
                <td>{provider.id}</td>
                <td>{provider.username}</td>
                <td>{provider.firstName + ' ' + provider.lastName}</td>
                <td>{provider.email}</td>
                <td>{provider.phoneNumber}</td>
                <td>{provider.city}</td>
                <td>{provider.region}</td>
                <td>{provider.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showTables && selectedProvider && (
        <div>
          <hr />
          <h2 className='myh2'>Services</h2>
          <table className="services-table-req">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Service Type</th>
                <th>Service Description</th>
                <th>Initial Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedProvider.services.map((service) => (
                <tr key={service.id}>
                  <td>{service.generalServiceName}</td>
                  <td>{service.serviceType}</td>
                  <td>{service.serviceDescription}</td>
                  <td>{service.initialPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showTables && selectedProvider && (
        <div className="service-request-container">
          <hr />
          <h2 className='myh2'>Provider suggestion about services in Baytak</h2>
          <div className="service-request-card">
            <div className="card-body">
              {serviceType && (
                <div className="row">
                  <div className="col">
                    <h4>Service Type</h4>
                  </div>
                  <div className="col">
                    <input
                      type="input"
                      value={serviceType}
                      name="serviceType"
                      className="form-control form-control-lg"
                      disabled
                    />
                  </div>
                </div>
              )}
              {serviceDescription && (
                <div>
                  <hr />
                  <div className="row">
                    <div className="col">
                      <h4>Service Description</h4>
                    </div>
                    <div className="col">
                      <textarea
                        value={serviceDescription}
                        name="serviceDescription"
                        className="form-control form-control-xl"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}
              {!serviceType && !serviceDescription && (
                <div>
                  <hr />
                  <h6 className='h6-r'>No suggestion from provider</h6>
                </div>
              )}
            </div>
          </div>
          <button className="btn1" onClick={handleApprove}>
            Approve
          </button>
          <button className="btn2" onClick={handleDecline}>
            Decline
          </button>
        </div>
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

export default Request;
