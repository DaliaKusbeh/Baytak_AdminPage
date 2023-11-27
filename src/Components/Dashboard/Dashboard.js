import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Dashboard.css';
import RecentOrder from './RecentOrder';
import { getAuthToken } from '../Login/auth';

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [customerCount, setCustomerCount] = useState(0);
  const [providerCount, setProviderCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [completedOrderCount, setCompletedOrderCount] = useState(0);
  const [highestRatedProvider, setHighestRatedProvider] = useState(null);
  const [services, setServices] = useState([]);
  const authToken = getAuthToken();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    fetchData();

    return () => {
      clearInterval(timer);
    };
  }, []);

  const fetchData = async () => {
    try {
      const customerCount = await fetchCustomerCount();
      const providerCount = await fetchProviderCount();
      const orderData = await fetchOrderData();
      const completedOrderCount = countCompletedOrders(orderData);
      const providerData = await fetchProviderData();
      const highestRatedProvider = getHighestRatedProvider(providerData);
      const services = await fetchServices();

      setCustomerCount(customerCount);
      setProviderCount(providerCount);
      setOrderCount(orderData.length);
      setCompletedOrderCount(completedOrderCount);
      setHighestRatedProvider(highestRatedProvider);
      setServices(services);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCustomerCount = async () => {
    const response = await axios.get('http://176.119.254.180:8081/all_customers', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data.length;
  };

  const fetchProviderCount = async () => {
    const response = await axios.get('http://176.119.254.180:8081/provider', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data.length;
  };

  const fetchOrderData = async () => {
    const response = await axios.get('http://176.119.254.180:8081/orders', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  };

  const fetchProviderData = async () => {
    const response = await axios.get('http://176.119.254.180:8081/provider', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  };

  const countCompletedOrders = (orderData) => {
    return orderData.filter((order) => order.status === 'COMPLETED').length;
  };

  const getHighestRatedProvider = (providerData) => {
    if (providerData.length === 0) {
      return null;
    }

    return providerData.reduce((prevProvider, currentProvider) => {
      if (prevProvider === null) {
        return currentProvider;
      }

      return prevProvider.rating > currentProvider.rating ? prevProvider : currentProvider;
    }, null);
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://176.119.254.180:8081/services', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (Array.isArray(response.data)) {
        const services = response.data.map((service) => {
          const imageUrl = `data:image/png;base64,${service.imageData}`;
          return {
            ...service,
            imageUrl: imageUrl,
          };
        });

        return services;
      } else {
        console.error('Invalid services response:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  };

  const redirectToMockBank = () => {
    window.location.href = 'https://app.mockbank.io/';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-current-date">
        <div className="date-string">
          {currentDate.toDateString()}
          <hr className="hrmargin" />
          {currentDate.toLocaleTimeString()}
        </div>
        <div>
          <button className="bank-btn" onClick={redirectToMockBank}>
            Bank Information
          </button>
        </div>
      </div>

      <div className="container-dash ">
        <div className="inner-container">
          <div className="customer">
            <div>Customers</div>
            <div>{customerCount}</div>
          </div>

          <div className="provider">
            <div>Providers</div>
            <div>{providerCount}</div>
          </div>

          <div className="order">
            <div>Orders</div>
            <div>{orderCount}</div>
          </div>

          <div className="completed-order">
            <div>Completed Orders</div>
            <div>{completedOrderCount}</div>
          </div>

          {highestRatedProvider && (
            <div className="highest-rated-provider">
              <div>Highest Rated Provider</div>
              <div>
                {highestRatedProvider.firstName} {highestRatedProvider.lastName}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-container-services">
        <div className="dashboard-recent-order">
          <h2 className="h22">
            <i className="material-icons ro">list_alt</i>Recent Order
          </h2>
          <div className="scrollable">
            <RecentOrder />
          </div>
        </div>
        <div className="dashboard-services">
          <h2 className="h22">
            <i className="material-icons ro">miscellaneous_services</i> Services
          </h2>        
            <table className="services-table-dash">
            <thead>
              <tr>
                <th>Service Type</th>
                {/* <th>Image</th> */}
              </tr>
            </thead>
            <tbody>
              {services.slice(0, 5).map((service, index) => (
                <tr key={index}>
                  <td>{service.serviceType}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
