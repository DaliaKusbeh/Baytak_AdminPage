import React from 'react'

export const PostGeneralServices = () => {
  return (
    <div>PostGeneralServices</div>
  )
}
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from 'mdb-react-ui-kit';
import axios from 'axios';

import { getAuthToken } from '../Login/auth';
import './AddNewServices.css'; // Import the CSS file

const AddNewServices = () => {
  const [serviceName, setServiceName] = useState('');
  const [image, setImage] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [serviceNames, setServiceNames] = useState([]);

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

    try {
      const formData = new FormData();
      formData.append('serviceName', serviceName);
      formData.append('image', image);

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
    } catch (error) {
      console.error(error);

      // Show an error toast notification
      toast.error('Failed to add service');
    }
  };

  const handleSubmitSubservice = async (e) => {
    e.preventDefault();

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
      formData.append('image', image);

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
    } catch (error) {
      console.error(error);

      // Show an error toast notification
      toast.error('Failed to add subservice');
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
  },)
  return (
    <div className="container_serviceAdd">
      <ToastContainer />

      <form onSubmit={handleSubmitService} className="left-section_serviceAdd">
        <MDBContainer>
          <MDBRow>
            <MDBCol>
              <MDBCard className="card_serviceAdd">
                <MDBCardBody className="card-body_serviceAdd">
                  <MDBInput
                    label="Service Name"
                    type="text"
                    value={serviceName}
                    onChange={handleServiceNameChange}
                  />
                  <MDBInput
                    label="Image"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <MDBBtn color="primary" type="submit" className="btn-primary_serviceAdd">
                    Add Service
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </form>

      <form onSubmit={handleSubmitSubservice} className="right-section_serviceAdd">
        <MDBContainer>
          <MDBRow>
            <MDBCol>
              <MDBCard className="card_serviceAdd">
                <MDBCardBody className="card-body_serviceAdd">
                  <select
                    className="form-select_serviceAdd"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                  >
                    {serviceNames.map((service) => (
                      <option key={service.serviceId} value={service.serviceName}>
                        {service.serviceName}
                      </option>
                    ))}
                  </select>

                  <MDBInput
                    label="Service Type"
                    type="text"
                    value={serviceType}
                    onChange={handleServiceTypeChange}
                  />
                  <MDBInput
                    label="Service Description"
                    type="text"
                    value={serviceDescription}
                    onChange={handleServiceDescriptionChange}
                  />
                  <MDBInput
                    label="Initial Price"
                    type="number"
                    value={initialPrice}
                    onChange={handleInitialPriceChange}
                  />
                  <MDBInput
                    label="Image"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <MDBBtn color="secondary" type="submit" className="btn-secondary_serviceAdd">
                    Add Subservice
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </form>
    </div>
  );
};

export default AddNewServices;
