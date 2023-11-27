import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { getAuthToken } from '../Login/auth';
import { NavLink } from 'react-router-dom';
import './Regions.css';

const GetRegions = () => {
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const token = getAuthToken(); // Get the authentication token
        const response = await axios.get('http://176.119.254.180:8081/cities', {
          headers: { Authorization: `Bearer ${token}` } // Add the token to the request headers
        });
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const fetchRegions = async () => {
    try {
      const token = getAuthToken(); // Get the authentication token
      const response = await axios.get(
        `http://176.119.254.180:8081/regions/cityId?cityId=${selectedCityId}`,
        { headers: { Authorization: `Bearer ${token}` } } // Add the token to the request headers
      );
      setRegions(response.data);
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCityId(cityId);
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
  };

  useEffect(() => {
    if (selectedCityId !== null) {
      fetchRegions();
    }
  }, [selectedCityId]);

  useEffect(() => {
    if (selectedRegion && iframeRef.current) {
      const { latitude, longitude } = selectedRegion;
      iframeRef.current.src = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=es;&output=embed`;
    }
  }, [selectedRegion]);

  return (
    <div className="region-container">
      <div className="region-left-panel">
        <h2 className='myTextt'>Regions</h2>
        <div className="region-city-select">
          <label>Select a City:</label>
          <select
            value={selectedCityId}
            onChange={handleCityChange}
            className="form-select"
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.cityId} value={city.cityId}>
                {city.cityName}
              </option>
            ))}
          </select>
        </div>
        {regions.length > 0 && (
          <div className="region-list">
            <h2>Regions in Selected City</h2>
            {regions.map((region) => (
              <div
                key={region.regionId}
                onClick={() => handleRegionClick(region)}
                className="region-item"
              >
                <p>Region ID: {region.regionId}</p>
                <p>Region Name: {region.regionName}</p>
                <p>Latitude: {region.latitude}</p>
                <p>Longitude: {region.longitude}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="region-middle-panel">
        <h2 className='myText'>Selected Region</h2>
        {selectedRegion && (
          <iframe
            ref={iframeRef}
            id="iframeId"
            className="region-map"
            allowFullScreen=""
            aria-hidden="false"
            width="600px"
            height="600px"
            tabIndex="0"
          />
        )}
      </div>
      <hr />
      <div className="region-right-panel">
        <NavLink to="/PostRegion" className="region-nav-link" activeClassName="active">
          <button className='myButton'>        
            Add new Region?</button>
        </NavLink>
      </div>
    </div>
  );
};

export default GetRegions;
