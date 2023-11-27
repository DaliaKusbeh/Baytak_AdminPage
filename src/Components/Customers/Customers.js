import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Customer.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuthToken } from '../Login/auth';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerOrders, setCustomerOrders] = useState([]);
  const [highestCustomer, setHighestCustomer] = useState(null);
  const [highestCustomerOrderCount, setHighestCustomerOrderCount] = useState(0);
  const [messageBody, setMessageBody] = useState('');
  const authToken = getAuthToken();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://176.119.254.180:8081/all_customers', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.status === 200) {
          setCustomers(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const fetchCustomerOrders = async (customerId) => {
    try {
      const response = await axios.get('http://176.119.254.180:8081/orders', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        const filteredOrders = response.data.filter(
          (order) => order.customerInfo.id === customerId
        );
        setCustomerOrders(filteredOrders);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Find the customer with the highest number of orders
    const findHighestCustomer = () => {
      const orderCounts = {};

      customerOrders.forEach((order) => {
        const customerId = order.customerInfo.id;
        orderCounts[customerId] = (orderCounts[customerId] || 0) + 1;
      });

      const highestCustomerId = Object.keys(orderCounts).reduce(
        (a, b) => (orderCounts[a] > orderCounts[b] ? a : b)
      );
      const highestCustomer = customers.find(
        (customer) => customer.id === parseInt(highestCustomerId)
      );
      const highestCustomerCount = orderCounts[highestCustomerId] || 0;

      setHighestCustomer(highestCustomer);
      setHighestCustomerOrderCount(highestCustomerCount);
    };

    if (customerOrders.length > 0) {
      findHighestCustomer();
    }
  }, [customerOrders, customers]);

  const handleCustomerSelection = (customerId) => {
    setSelectedCustomerId(customerId);
    fetchCustomerOrders(customerId);
  };

  const handleDeleteCustomer = async () => {
    try {
      const response = await axios.delete(
        `http://176.119.254.180:8081/customer/${selectedCustomerId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Customer deleted successfully.');
        setSelectedCustomerId('');
        fetchCustomerOrders(selectedCustomerId);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete customer.');
    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        `http://176.119.254.180:8081/admin/customers/${selectedCustomerId}/messages`,
        {
          type: 'INFO',
          body: messageBody,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Message sent successfully to the customer.');
        setMessageBody('');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to send message.');
    }
  };

  return (
    <div className="customer-container">
      <div className="customer-header">
        <h2>Customers</h2>
      </div>
      <table className="customer-list">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className={`customer-item ${selectedCustomerId === customer.id ? 'selected' : ''}`}
              onClick={() => handleCustomerSelection(customer.id)}
            >
              <td>{customer.id}</td>
              <td>
                {customer.firstName} {customer.lastName}
              </td>
              <td>{customer.username}</td>
              <td>{customer.email}</td>
              <td>{customer.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <h6 className='sendText'>Select Customer to delete</h6>
      {selectedCustomerId && (
        <React.Fragment>
          <button className="btn-del" onClick={handleDeleteCustomer}>
            Delete Customer
          </button>
          <div className="send-message-container">
            <h6 className='sendText'>Send Message to Customer</h6>
            <textarea className='areaText'
              rows="3"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder="Type your message here..."
            />
            <button className="sendButton" onClick={handleSendMessage}>
              Send Message
            </button>
          </div>
        </React.Fragment>
      )}
      {highestCustomer && (
        <div className="highest-customer">
          <h2 className="g1">Highest Customer</h2>
          <div className="customer-info">
            <span className="customer-name">
              {highestCustomer.firstName} {highestCustomer.lastName}
            </span>
            <span className="customer-name-1">Number of Orders: {highestCustomerOrderCount}</span>
          </div>
        </div>
      )}
      <hr />
      {selectedCustomerId && (
        <div className="customer-orders">
          <h2 className="g1">Orders for Customer ID: {selectedCustomerId}</h2>
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Service</th>
                <th>Provider</th>
              </tr>
            </thead>
            <tbody>
              {customerOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.service}</td>
                  <td>{order.providerInfo.fullName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Customers;
