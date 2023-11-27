import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './Components';
import { Login } from './Components/Header/index';
import { 
  Dashboard, 
  Orders, 
  Requests, 
  GetRegions,
  Notifications,
  AdminList, 
  PostRegion, 
  Providers, 
  Customers, 
  Services, 
  AddAdmin, 
  Profile, 
  ForgotPassword, 
  AddNewServices, 
  ProviderNotification, 
  CustomerNotification
} from '../src/Components/Header/index';
function App() {
  return (


    <div className='w-100 '>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/" element={<Login/>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/services" element={<Services />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/addadmin" element={<AddAdmin />} />
            <Route path="/addservices" element={<AddNewServices />} />
            <Route path='/settings' element={<GetRegions />} />
            <Route path='/add' element={<GetRegions />} />
            <Route path='/PostRegion' element={<PostRegion />} />
            <Route path='/AdminList' element={<AdminList/>}/>
            <Route path='/Notifications' element={<Notifications/>}/>
            <Route path='/ProviderNotification' element={<ProviderNotification/>}/>
            <Route path='/CustomerNotification' element={<CustomerNotification/>}/>
          </Route>
        </Routes>
      </Router>
    </div>

  );
}

export default App;
