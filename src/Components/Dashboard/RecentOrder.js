
import './RecentOrder.css'
import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../Login/auth';
import axios from 'axios';

const RecentOrder = () => {
  const [orders, setOrders] = useState([]);

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
          // Sort orders by submission date in descending order
          const sortedOrders = response.data.sort((a, b) => {
            return new Date(b.submissionDate) - new Date(a.submissionDate);
          });
          // Set the first 5 orders as the most recent ones
          const recentOrders = sortedOrders.slice(0, 5);
          setOrders(recentOrders);
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

  return (
    <div className="recent-order">
      <table className="recent-order__table">
        <thead>
          <tr>
            <th className="recent-order__header">Order ID</th>
            <th className="recent-order__header">Service</th>
            <th className="recent-order__header">Submission Date</th>
            <th className="recent-order__header">Reservation Date</th>
            <th className="recent-order__header">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td className="recent-order__cell">{order.orderId}</td>
              <td className="recent-order__cell">{order.service}</td>
              <td className="recent-order__cell">{order.submissionDate}</td>
              <td className="recent-order__cell">{order.reservationDate}</td>
              <td className="recent-order__cell">
                <span className={`recent-order__status-cell ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrder;
