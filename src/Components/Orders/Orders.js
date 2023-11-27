import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { getAuthToken } from '../Login/auth';

import './Order.css'; // Import the CSS file for styling

const ProviderOrderData = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showTables, setShowTables] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getAuthToken();
        const response = await axios.get('http://176.119.254.180:8081/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setOrders(response.data);
        } else {
          console.log('Error:', response.status);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'status-completed';
      case 'PENDING':
        return 'status-pending';
      case 'IN PROGRESS':
        return 'status-in-progress';
      case 'PENDING PAYMENT':
        return 'status-pending-payment';
      case 'ACCEPTED':
        return ' recent-order__status-accepted ';
      case 'CANCELLED':
        return ' recent-order__status-cancelled '
      default:
        return '';
    }
  };

  const handleOrderClick = async (orderId) => {
    if (selectedOrder === orderId) {
      setSelectedOrder(null);
      setSelectedCustomer(null);
      setSelectedProvider(null);
      setShowTables(false);
    } else {
      setSelectedOrder(orderId);
      setShowTables(true);

      try {
        const token = getAuthToken();
        const response = await axios.get(`http://176.119.254.180:8081/order?id=${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          const { customerInfo, providerInfo } = response.data;
          setSelectedCustomer(customerInfo);
          setSelectedProvider(providerInfo);
        } else {
          console.log('Error:', response.status);
        }
      } catch (error) {
        console.error('Error fetching order information:', error);
      }
    }
  };

  const fetchTransactionDetails = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`http://176.119.254.180:8081/admin/orders/${selectedOrder}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setTransactionDetails(response.data);
        setShowTransactionDetails(true);
      } else {
        console.log('Error:', response.status);
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };

  const handleShowTransactionDetails = async () => {
    if (selectedOrder) {
      fetchTransactionDetails();
    }
  };

  return (
    <div className='order-container'>
      {selectedOrder &&
        orders.find((order) => order.orderId === selectedOrder)?.status === 'COMPLETED' && (
          <>
            {/* Add the order number dynamically */}
            <h2 className='page-title'>For Order No. {selectedOrder}</h2>
            <button className='transaction-details-btn' onClick={handleShowTransactionDetails}>
              Show Transaction Details
            </button>
            {showTransactionDetails && (
              <div className='transaction-details-section'>
                <table className='transaction-details-table'>
                  <thead>
                    <tr>
                      <th>From Customer</th>
                      <th>To Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(transactionDetails.fromCustomer).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{JSON.stringify(value)}</td>
                      </tr>
                    ))}
                    {Object.entries(transactionDetails.toProvider).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{JSON.stringify(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

      {showTables && (
        <div>
          <h2 className='info-section-title'>Customer Info</h2>
          <table className='info-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Phonenumber</th>
                <th>Email Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedCustomer?.id}</td>
                <td>{selectedCustomer?.username}</td>
                <td>{selectedCustomer?.fullName}</td>
                <td>{selectedCustomer?.phoneNumber}</td>
                <td>{selectedCustomer?.email}</td>
              </tr>
            </tbody>
          </table>

          <h2 className='info-section-title'>Provider Info</h2>
          <table className='info-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Phonenumber</th>
                <th>Email Address</th>
                <th>City</th>
                <th>Region</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedProvider?.id}</td>
                <td>{selectedProvider?.username}</td>
                <td>
                  {selectedProvider?.fullName} {selectedProvider?.lastName}
                </td>
                <td>{selectedProvider?.phoneNumber}</td>
                <td>{selectedProvider?.email}</td>
                <td>{selectedProvider?.city}</td>
                <td>{selectedProvider?.region}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <h2 className='page-title'>Orders</h2>
      <table className='orders-table'>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Service</th>
            <th>Initial Price</th>
            <th>Add Price</th>
            <th>Submission Date</th>
            <th>Submission Time</th>
            <th>Reservation Date</th>
            <th>Reservation Start Time</th>
            <th>Reservation End Time</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th className='sth'>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.orderId}
              onClick={() => handleOrderClick(order.orderId)}
              className={selectedOrder === order.orderId ? 'selected' : ''}
            >
              <td>{order.orderId}</td>
              <td>{order.service}</td>
              <td>{order.initialPrice}</td>
              <td>{order.addedPrice}</td>
              <td>{order.submissionDate}</td>
              <td>{order.submissionTime}</td>
              <td>{order.reservationDate}</td>
              <td>{order.reservationStartTime}</td>
              <td>{order.reservationEndTime}</td>
              <td>{order.startTime}</td>
              <td>{order.endTime}</td>
              <td className={`status-cell ${getStatusColor(order.status)}`}>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProviderOrderData;
 