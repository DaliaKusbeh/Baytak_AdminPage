import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
import { NavLink } from 'react-router-dom';

import { getAuthToken } from '../Login/auth';
import './AddNewServices.css'; // Import the CSS file

const AddNewServices = () => {
  const [serviceName, setServiceName] = useState('');
  const [image, setImage] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [serviceNames, setServiceNames] = useState([]);
  const [showAddServiceButton, setShowAddServiceButton] = useState(false);
  const [showAddSubserviceButton, setShowAddSubserviceButton] = useState(false);

  const handleServiceNameChange = (e) => {
    setServiceName(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleServiceTypeChange = (e) => {
    setServiceType(e.target.value);
  };

  const handleServiceDescriptionChange = (e) => {
    setServiceDescription(e.target.value);
  };

  const handleInitialPriceChange = (e) => {
    setInitialPrice(e.target.value);
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();

    if (!serviceName) {
      toast.error('Please enter service name and select an image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('serviceName', serviceName);
      formData.append('image', image || 'null'); // Set the value to 'null' if image is falsy

      const token = getAuthToken(); // Assuming this function returns the authentication token

      const response = await axios.post('http://176.119.254.180:8081/general_services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data); // Handle the response data as needed

      // Show a success toast notification
      toast.success('Service added successfully');

      // Reset the form
      setServiceName('');
      setImage(null);

      // Hide the add service button
      setShowAddServiceButton(false);
    } catch (error) {
      console.error(error);

      // Show an error toast notification
      toast.error('Failed to add service');
    }
  };

  const handleSubmitSubservice = async (e) => {
    e.preventDefault();

    if (!serviceName || !serviceType || !serviceDescription || !initialPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        'serviceRequest',
        JSON.stringify({
          generalServiceName: serviceName,
          serviceType,
          serviceDescription,
          initialPrice,
        })
      );
      formData.append('image', image || 'null'); // Set the value to 'null' if image is falsy

      const token = getAuthToken(); // Assuming this function returns the authentication token

      const response = await axios.post(
        `http://176.119.254.180:8081/service`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data); // Handle the response data as needed

      // Show a success toast notification
      toast.success('Subservice added successfully');

      // Reset the form
      setServiceName('');
      setServiceType('');
      setServiceDescription('');
      setInitialPrice('');
      setImage(null);

      // Hide the add subservice button
      setShowAddSubserviceButton(false);
    } catch (error) {
      console.error(error);

      // Show an error toast notification
      toast.error('Failed to add subservice');
    }
  };

  const handlePatchServiceImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', image || 'null'); // Set the value to 'null' if image is falsy

      const token = getAuthToken(); // Assuming this function returns the authentication token

      const response = await axios.put('http://176.119.254.180:8081/general_service/1/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data); // Handle the response data as needed

      // Show a success toast notification
      toast.success('Service image updated successfully');

      // Reset the form
      setImage(null);
    } catch (error) {
      console.error(error);

      // Show an error toast notification
      toast.error('Failed to update service image');
    }
  };

  useEffect(() => {
    const fetchServiceNames = async () => {
      try {
        const response = await axios.get('http://176.119.254.180:8081/general_services');
        setServiceNames(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchServiceNames();
  }, []);

  const handleAddServiceClick = () => {
    setShowAddServiceButton(true);
  };

  const handleAddSubserviceClick = () => {
    setShowAddSubserviceButton(true);
  };

  return (
    <div className="add-container">

      <ToastContainer
        toastStyle={{
          background: '#333',
          color: '#fff',
          borderRadius: '15px',
        }}
        bodyClassName="toast-body"
      />
      <div className="right-section_serviceAdd">
        <div>
          <h2 className='h2-s-a'>Add  Sub-Services</h2>

          <div className="card_serviceAdd">
            <div className="card-body_serviceAdd">
              <div className="mb-3">
                <label>Service Name</label>
                <select value={serviceName} onChange={(e) => setServiceName(e.target.value)}>
                  {serviceNames.map((service) => (
                    <option className='input-a-s' key={service.serviceId} value={service.serviceName}>
                      {service.serviceName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label>Service Type</label>
                <input className='input-a-s' type="text" value={serviceType} onChange={handleServiceTypeChange} />
              </div>
              <div className="mb-3">
                <label>Service Description</label>
                <input
                  className='input-a-s'
                  type="text"
                  value={serviceDescription}
                  onChange={handleServiceDescriptionChange}
                />
              </div>
              <div className="mb-3">
                <label>Initial Price</label>
                <input className='input-a-s' type="number" value={initialPrice} onChange={handleInitialPriceChange} />
              </div>
              <div className="mb-3">
                <label>Image</label>
                <input className='input-a-s' type="file" onChange={handleImageChange} />
              </div>
              {!showAddSubserviceButton && (
                <button type="button" onClick={handleAddSubserviceClick} className="add-button">
                  Add Subservice
                </button>
              )}
              {showAddSubserviceButton && (
                <button type="submit" onClick={handleSubmitSubservice} className="add-button">
                  Confirm Subservice
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="left-section_serviceAdd">
        <div>
          <h2 className='h2-s-a'>Add General Services</h2>
          <div className="card_serviceAdd">
            <div className="card-body_serviceAdd">
              <div className="mb-3">
                <label>Service Name</label>
                <input
                  className='input-a-s'
                  type="text"
                  value={serviceName}
                  onChange={handleServiceNameChange}
                />
              </div>
              <div className="mb-3">
                <label>Image</label>
                <input type="file" onChange={handleImageChange} />
              </div>
              {!showAddServiceButton && (
                <button type="button" onClick={handleAddServiceClick} className="add-button">
                  Add Service
                </button>
              )}
              {showAddServiceButton && (
                <button type="submit" onClick={handleSubmitService} className="add-button">
                  Confirm Service
                </button>
              )}
              <button type="button" onClick={handlePatchServiceImage} className="add-button">
                Update Service Image
              </button>
            </div>
          </div>
          <NavLink to="/services" className="region-nav-link" activeClassName="active">
            <h6 className='my-h6'>Show All Services</h6>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default AddNewServices;
