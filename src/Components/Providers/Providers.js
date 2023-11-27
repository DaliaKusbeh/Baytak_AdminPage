import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthToken } from '../Login/auth';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Providers.css'; // Import the CSS file for styling

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [showTables, setShowTables] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  const fetchProviders = async () => {
    try {
      const authToken = getAuthToken();

      const response = await axios.get('http://176.119.254.180:8081/provider', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        setProviders(response.data);
      } else {
        if (response.status === 404) {
          console.log('Resource not found!');
        } else if (response.status === 400) {
          console.log('Bad data!');
        } else if (response.status === 500) {
          console.log('Internal Server Error!');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleProviderClick = (providerId) => {
    if (selectedProviderId === providerId) {
      setSelectedProviderId(null);
      setShowTables(false);
    } else {
      setSelectedProviderId(providerId);
      setShowTables(true);
    }
  };

  const deleteProvider = async (providerId) => {
    try {
      const authToken = getAuthToken();

      const response = await axios.delete(`http://176.119.254.180:8081/not_provider/${providerId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        setDeleteMessage('The provider was deleted successfully.');
        fetchProviders();
      } else {
        setDeleteMessage('Failed to delete the provider.');
      }
    } catch (error) {
      console.error(error);
      setDeleteMessage('An error occurred while deleting the provider.');
    }
  };

  const selectedProvider = providers.find((provider) => provider.id === selectedProviderId);

  const ratingColor = (rating) => {
    if (rating < 2.5) {
      return 'red'; // Red color for ratings less than 2.5
    } else {
      return 'black'; // Default color for other ratings
    }
  };

  // Custom star rating component
  const StarRating = ({ rating }) => {
    const totalStars = 5;
    const filledStars = Math.round(rating);
    const stars = Array.from({ length: totalStars }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={index < filledStars ? solidStar : regularStar}
        style={{ color: index < filledStars ? 'gold' : 'gray' }}
      />
    ));
    return <div>{stars}</div>;
  };

  // Function to send the warning message to the provider
  const sendWarningMessage = async (providerId) => {
    try {
      const authToken = getAuthToken();

      const response = await axios.post(
        `http://176.119.254.180:8081/admin/providers/${providerId}/messages`,
        {
          type: 'WARNING',
          body: 'Your rating is lower than the acceptable rating, please consider that and try to amend it within a month from now',
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Show success toast message
        toast.success(`Warning sent to ${selectedProvider.firstName} ${selectedProvider.lastName}`);
      } else {
        // Show error toast message
        toast.error('Failed to send warning message');
      }
    } catch (error) {
      console.error(error);
      // Show error toast message
      toast.error('An error occurred while sending the warning message');
    }
  };

  // Function to render the region data
  const renderRegion = (region) => {
    return (
      <div>
        <p>Region ID: {region.regionId}</p>
        <p>Region Name: {region.regionName}</p>
        <p>Latitude: {region.latitude}</p>
        <p>Longitude: {region.longitude}</p>
      </div>
    );
  };

  return (
    <div className="providers-container">
      <h4 className="page-title-p">
        <i className="material-icons all">groups</i>All Providers In Baytak
      </h4>

      <div className="providers-card">
        <div className="providers-card-body">
          <table className="providers-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Phone number</th>
                <th>Email Address</th>
                <th>City</th>
                <th>Region</th>
                <th>Rating</th>
                <th>Warning</th> {/* New column for displaying the warning */}
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr
                  key={provider.id}
                  onClick={() => handleProviderClick(provider.id)}
                  className={selectedProviderId === provider.id ? 'selected' : ''}
                >
                  <td>{provider.id}</td>
                  <td>{provider.username}</td>
                  <td>
                    {provider.firstName} {provider.lastName}
                  </td>
                  <td>{provider.phoneNumber}</td>
                  <td>{provider.email}</td>
                  <td>{provider.city}</td>
                  <td>{provider.region.regionName}</td> {/* Displaying only regionName */}
                  <td style={{ color: ratingColor(provider.rating) }}>
                    {provider.rating}
                    <StarRating rating={provider.rating} />
                  </td>
                  <td>
                    {provider.rating < 2.5 ? (
                      <button className='warningButton' onClick={() => sendWarningMessage(provider.id)}>Send Warning</button>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

      {deleteMessage && <div className="delete-message">{deleteMessage}</div>}

      {selectedProvider && (
        <div className="section">
          <h4 className="page-title-p">
            For {selectedProvider.firstName} {selectedProvider.lastName}
          </h4>

          <div className="message-card">
            <h5 className='sendText'>Send Message</h5>
            <textarea className='areaText' placeholder="Enter your message here..."></textarea>
            <button className='sendButton'>Send</button>
          </div>
        </div>
      )}

      <hr />

      {showTables && selectedProvider && selectedProvider.services && (
        <div className="section">
          <h4 className="page-title-p">Services</h4>

          <div className="services-card">
            <div className="services-card-body">
              <table className="service-table">
                <thead>
                  <tr>
                    <th>Service Type</th>
                    <th>Service Description</th>
                    <th>Initial Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProvider.services.map((service) => (
                    <tr key={service.id}>
                      <td>{service.serviceType}</td>
                      <td>{service.serviceDescription}</td>
                      <td>{service.initialPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <hr />

      {showTables && selectedProvider && selectedProvider.availabilities && (
        <div className="section">
          <h4 className="page-title-p">Time Slots</h4>

          <div className="time-slots-card">
            <div className="time-slots-card-body">
              <table className="time-slots-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Reserved</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProvider.availabilities.map((availability) => (
                    <tr key={availability.id}>
                      <td>{availability.date}</td>
                      <td>{availability.startTime}</td>
                      <td>{availability.endTime}</td>
                      <td>{availability.reserved ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}



      <ToastContainer />
    </div>
  );
};

export default Providers;
