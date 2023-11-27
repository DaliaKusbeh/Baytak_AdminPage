import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setAuthToken, getAdminId } from './auth';
import './login.css';

const AdminLoginPage = () => {
  const [usernameOrEmail, setusernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectToTest, setRedirectToTest] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const cardLog = document.querySelector('.card-log');
      cardLog.classList.toggle('start-slide');
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!usernameOrEmail || !password) {
      toast.error('Please enter both username and password.');
    } else {
      try {
        const response = await axios.post('http://176.119.254.180:8081/admin/login', {
          usernameOrEmail,
          password,
        });

        if (response.status === 200) {
          const token = response.data.token;
          const adminId = getAdminId();
          setAuthToken(token, adminId);
          toast.success('Login successful!');
          console.log(token);
          console.log('Login successful!');
          navigate('/');
        } else {
          toast.error('Invalid username or password.');
          console.log('Invalid username or password');
        }
      } catch (error) {
        toast.error('Invalid username or password');
        console.log('error');
      }
    }
  };

  return (
    <div className='backgrround'>
      <div className="login-container">
        <div className="header-h1">
          <h1 className="h11">Baytak</h1>
          <i className="material-icons home-title">home</i>
          <h1 className="h11">Services</h1>
        </div>


        <div className="login-card">
          <h2 className='h2-log'> ADMIN LOGIN</h2>
          {/* <i className='material-icons m-icons'>person </i>  */}
          <span className='my-span'>Username</span>
          <input
            type="email"
            placeholder="Username"
            value={usernameOrEmail}
            onChange={(e) => setusernameOrEmail(e.target.value)}
            className="input-log"
          />
          <br />
          {/* <i className='material-icons m-icons'>https</i>     */}
          <span className='my-span' >Password</span>      <input
            type="password"

            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-log"
          />
          <br />

          <button className="buttonn" onClick={handleLogin}>
            Log In
          </button>
          <NavLink to="/ForgotPassword" className="forgot">Forgot Password ?</NavLink>

          <ToastContainer
            toastStyle={{
              background: '#333',
              color: '#fff',
              borderRadius: '15px',
            }}
            bodyClassName="toast-body"
          />
        </div>

        <div className="card-log">
          <div>
            <i className='material-icons  home-color'>electrical_services</i>
          </div>
          <div>
            <i className='material-icons  home-color'>cleaning_services</i>
          </div>
          <div>
            <i className='material-icons  home-color'>home_repair_service</i>
          </div>
          <div>
            <i className='material-icons home-color'>miscellaneous_services</i>
          </div>
          <div>
            <i className='material-icons  home-color'>design_services</i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
