import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  MDBSelect,
} from 'mdb-react-ui-kit';
import { getAuthToken } from '../Login/auth';
import './post.css';

const PostCities = () => {
  const [cityName, setCityName] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [regionName, setRegionName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const apiUrl = 'http://176.119.254.180:8081/cities';
      const authToken = getAuthToken(); // Assuming you have a function to retrieve the auth token

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Assuming the API response contains an array of city objects
      setCities(response.data);

      if (response.data.length > 0) {
        setSelectedCity(response.data[0]); // Set the initial selected city
      }
    } catch (error) {
      toast.error('An error occurred while fetching cities');
    }
  };

  const addNewCity = async () => {
    if (!cityName) {
      toast.error('Please fill in the city name');
      return;
    }

    try {
      const apiUrl = 'http://176.119.254.180:8081/cities';
      const authToken = getAuthToken(); // Assuming you have a function to retrieve the auth token

      const response = await axios.post(
        apiUrl,
        { cityName, region: selectedCity.id },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      // Assuming the API response contains a success message
      if (response.data.success) {
        toast.success('New city added successfully');
      } else {
        toast.error('Failed to add a new city');
      }
    } catch (error) {
      toast.error('An error occurred while adding the city');
    }
  };

  const addNewRegion = async () => {
    if (!regionName || !latitude || !longitude) {
      toast.error('Please fill in all region data');
      return;
    }

    try {
      const apiUrl = `http://176.119.254.180:8081/regions?cityId=${selectedCity.id}`;
      const authToken = getAuthToken(); // Assuming you have a function to retrieve the auth token

      const response = await axios.post(
        apiUrl,
        {
          cityId: selectedCity.id,
          regionName,
          latitude,
          longitude,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      // Assuming the API response contains a success message
      if (response.data.success) {
        toast.success('New region added successfully');
      }
    } catch (error) {
      toast.error('An error occurred while adding the region');
    }
  };

  const handleCitySelect = (e) => {
    const selectedCityId = e.target.value;
    const selectedCityData = cities.find((city) => city.id === selectedCityId);
    if (selectedCityData) {
      setSelectedCity(selectedCityData);
      setRegionName(selectedCityData.id);
    }
  };

  return (
    <div className="container-post-r">
      <MDBRow>
        <h2 className='h2'>Add City</h2>
        <MDBCol>
          <MDBCard className="card-r">
            <MDBCardBody className="card-body-r">
              <MDBInput
                label="City Name"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
              />
              <button className="bbbb-r" onClick={addNewCity}>
                Add City
              </button>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol>
          <MDBCard className="card-r">
            <MDBCardBody className="card-body-r">
              <select
                className="select-city-r"
                value={selectedCity.id}
                onChange={handleCitySelect}
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.cityId} {city.cityName}
                  </option>
                ))}
              </select>
              <MDBInput
                label="Region Name"
                value={regionName}
                onChange={(e) => setRegionName(e.target.value)}
              />
              <MDBInput
                label="Latitude"
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
              <MDBInput
                label="Longitude"
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
              <button className="bbbb-r" onClick={addNewRegion}>
                Add Region
              </button>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      <ToastContainer
        toastStyle={{
          background: '#333',
          color: '#fff',
          borderRadius: '15px',
        }}
        bodyClassName="toast-body"
      />    </div>
  );
};

export default PostCities;
