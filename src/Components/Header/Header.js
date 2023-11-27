
import React, { useState } from 'react';
import './Header.css';
import { NavLink, Outlet } from 'react-router-dom';

const Header = () => {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [asideVisible, setAsideVisible] = useState(true); // Added state for aside visibility

  const originalData = [
    // Your original data array goes here
    // Modify it with your actual data source
    { id: 1, name: 'Service 1' },
    { id: 2, name: 'Service 2' },
    { id: 3, name: 'Service 3' },
    // ...
  ];

  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    const filtered = originalData.filter((item) => {

      return item.name.toLowerCase().includes(searchQuery);
    });
    setFilteredResults(filtered);
    setQuery(searchQuery);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const toggleAside = () => {
    setAsideVisible((prevState) => !prevState);
  };

  const closeAside = () => {
    setAsideVisible(false);
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'} my-color`}>
      <header className={`app-header ${darkMode ? 'dark-mode' : 'light-mode'} my-color`}>
        <div className="left-section">
          <i className="material-icons menu-icon" onClick={asideVisible ? closeAside : toggleAside}>
            menu
          </i>
          <div className="dash-h11">
            <h1 className="h1-mar">Baytak</h1>
            <i className="material-icons icon-h">home</i>
            <h1 className="t">Services</h1>
          </div>


        </div>
        <div className="mid-section">
          <form>
            <input type="text" placeholder="Search . . ." onChange={handleSearch} value={query} />
            <button type="submit" >
              <i className="material-icons">search</i>
            </button>
          </form>
        </div>
        <div className="right-section">
          <a href="#" onClick={toggleDarkMode}>
            <i className="material-icons">{darkMode ? 'light_mode' : 'settings_brightness'}</i>
          </a>
          <NavLink to="/Notifications" className="nav-link">
            <i className="material-icons">notifications</i>
            </NavLink>

          <NavLink to="/profile">
            <i className="material-icons">account_circle</i>
          </NavLink>
         
        </div>
      </header>

      <div className="content-area">
        <aside className={`sidebar ${asideVisible ? 'show-sidebar' : ''} ${darkMode ? 'dark-mode' : 'light-mode'}`}>
          <nav className="nav">
            <NavLink to="/dashboard" className="nav-link" activeClassName="active">
              <i className="material-icons sty">dashboard</i>
              <span id="active-span">Dashboard</span>
            </NavLink>
            <NavLink to="/orders" className="nav-link" activeClassName="active">
              <i className="material-icons">list_alt</i>
              <span>Orders</span>
            </NavLink>
            <NavLink to="/requests" className="nav-link" activeClassName="active">
              <i className="material-icons">request_page</i>
              <span>Requests</span>
            </NavLink>
            <NavLink to="/providers" className="nav-link" activeClassName="active">
              <i className="material-icons">engineering</i>
              <span>Providers</span>
            </NavLink>
            <NavLink to="/customers" className="nav-link" activeClassName="active">
              <i className="material-icons sty">supervisor_account</i>
              <span>Customers</span>
            </NavLink>
            <NavLink to="/settings" className="nav-link" activeClassName="active">
              <i className="material-icons sty">pin_drop</i>
              <span>Regions</span>
            </NavLink>
            <NavLink to="/services" className="nav-link" activeClassName="active">
              <i className="material-icons sty">home_repair_service</i>
              <span>Services</span>
            </NavLink>
            <hr />
            <NavLink to="/addservices" className="nav-link" activeClassName="active">
              <i className="material-icons sty">medical_services</i>
              <span>New Services</span>
            </NavLink>
            <NavLink to="/addadmin" className="nav-link" activeClassName="active">
              <i className="material-icons sty">person_add</i>
              <span>New Admin</span>
            </NavLink>
            <hr />

            <NavLink to="/logout" className="nav-link" activeClassName="active">
              <i className="material-icons sty-u">logout</i>
              <span>Logout</span>
            </NavLink>
          </nav>
        </aside>

        <main className={`main-content ${darkMode ? 'dark-mode' : 'light-mode'}`}>
          <div className="dashboard-container main">
           
              <Outlet filteredResults={filteredResults} />
            </div>
      
        </main>
      </div>
    </div>
  );
};

export default Header;

