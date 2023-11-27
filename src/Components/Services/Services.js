import { getAuthToken } from '../Login/auth';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, Outlet } from 'react-router-dom';

import './Servics.css'; // Import the CSS file for styling

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [subServices, setSubServices] = useState([]);
  const authToken = getAuthToken();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://176.119.254.180:8081/general_services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = async (serviceName) => {
    try {
      const response = await axios.get(`http://176.119.254.180:8081/general_services/service/${serviceName}`);
      setSelectedService(serviceName);
      setSubServices(response.data);
    } catch (error) {
      console.error('Error fetching sub-services:', error);
    }
  };

  const base64ToBlob = (base64String) => {
    const byteCharacters = atob(base64String);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: 'image/png' });
  };

  const decodeBase64Image = (base64Image) => {
    const blob = base64ToBlob(base64Image);
    return URL.createObjectURL(blob);
  };

  return (
    <div className="services-display-container">
      <div className="services-list">
        <h2 className='h2-s'>Services</h2>
        <div>
          <div className="service-container">
            {services.map((service) => (
              <div
                key={service.serviceId}
                onClick={() => handleServiceClick(service.serviceName)}
                className={`service-item ${service.serviceName === selectedService ? 'active' : ''}`}
              >
                <h2>{service.serviceName}</h2>
              </div>
            ))}
          </div>

        </div>
      </div>
      {subServices.length > 0 && (
        <div className="sub-services-list">
          <h2 className='h2-s'>Sub-Services</h2>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Service Name</th>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {subServices.map((subService) => (
                <tr key={subService.serviceId}>
                  <td>
                    {subService.image && (
                      <img
                        src={decodeBase64Image(subService.image)}
                        alt={subService.serviceName}
                      />
                    )}
                  </td>
                  <td>{subService.serviceName}</td>
                  <td>{subService.serviceDescription}</td>
                  <td>${subService.initialPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      <div className="add-service-button">
        <NavLink to="/addservices">

          <button className='bb'><h2 className='h2-ss'>  <i className="material-icons ii">add</i>Click To Add New Services</h2></button>
        </NavLink>
      </div>
    </div>
  );
};

export default Services;



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { getAuthToken } from '../Login/auth';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Services = () => {
//   const [services, setServices] = useState([]);
//   const [selectedService, setSelectedService] = useState(null);
//   const [subServices, setSubServices] = useState([]);
//   const authToken = getAuthToken();

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const response = await axios.get('http://176.119.254.180:8081/general_services');
//         setServices(response.data);
//       } catch (error) {
//         console.error('Error fetching services:', error);
//       }
//     };

//     fetchServices();
//   }, []);

//   const handleServiceClick = async (serviceName) => {
//     try {
//       const response = await axios.get(`http://176.119.254.180:8081/general_services/service/${serviceName}`);
//       setSelectedService(serviceName);
//       setSubServices(response.data);
//     } catch (error) {
//       console.error('Error fetching sub-services:', error);
//     }
//   };

//   const handleImageError = (e) => {
//     // e.target.onerror = null;
//     // e.target.src = 'placeholder-image-url'; // Replace with the URL of your placeholder image
//     console.log("Error uploading image!!");
//   };

//   const fetchSubServiceImage = async (serviceId) => {
//     try {
//       const response = await axios.get(`http://176.119.254.180:8081/service/${serviceId}/image`,{
//         headers: {
//           Authorization: `Bearer ${authToken}`

//     }});
//       return response.data.image;
//     } catch (error) {
//       console.error('Error fetching sub-service image:', error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const fetchSubServiceImages = async () => {
//       const imagePromises = subServices.map(async (subService) => {
//         const image = await fetchSubServiceImage(subService.serviceId);
//         return { ...subService, image };
//       });

//       const subServicesWithImages = await Promise.all(imagePromises);
//       setSubServices(subServicesWithImages);
//     };

//     fetchSubServiceImages();
//   }, [subServices]);

//   return (
//     <div style={{ display: 'flex' }}>
//       <div style={{ flex: 1 }}>
//         <h1>Services</h1>
//         <div>
//           {services.map((service) => (
//             <div
//               key={service.serviceId}
//               className={`card ${selectedService === service.serviceName ? 'selected' : ''}`}
//               onClick={() => handleServiceClick(service.serviceName)}
//             >
//               {/* <img src={service.image} height={50} width={50} alt="Service" onError={handleImageError} /> */}
//               <h2>{service.serviceName}</h2>
//             </div>
//           ))}
//         </div>
//       </div>
//       {subServices.length > 0 && (
//         <div style={{ flex: 1 }}>
//           <h3>Sub-Services</h3>
//           <div style={{ height: '400px', overflow: 'auto' }}>
//             {subServices.map((subService) => (
//               <div key={subService.serviceId} className="card">
//                 {/* {subService.image ? (
//                   <img src={subService.image} alt={subService.serviceName} onError={handleImageError} />
//                 ) : (
//                   <div>No Image</div>
//                 )} */}
//                 <h4>{subService.serviceName}</h4>
//                 <p>{subService.serviceDescription}</p>
//                 <p>Price: ${subService.initialPrice.toFixed(2)}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Services;
