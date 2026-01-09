import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Directions from '../components/Directions';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin
} from "@vis.gl/react-google-maps";
import Header from '../components/Header';
import { API_URL } from '../config/API_URL';
const containerStyle = {
  width: "100%",
  height: "500px",
};

const Tracker = () => {
  let param = useParams();
  let [source, setSource] = useState({})
  let [destination, setDestination] = useState({})
  
  let [location, setLocation] = useState({latitude : null, longitude : null});
  let [error, setError] = useState(null)

  let GetGeoLocation = ()=>{
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    const successHandler = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };
    const errorHandler = (err) => {
      setError(err.message);
    }
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    setTimeout(()=>{
      GetGeoLocation()
    },10000);
  }
  useEffect(() => {
    GetGeoLocation();
  }, [])
  useEffect(()=>{
    UploadIntoServer();

  },[location])

  


  let UploadIntoServer = ()=>{
    axios
    .put(`${API_URL}/${param.unique}`, location)
    .then(response=>{
      console.log(response.data);
      setSource({ lat : parseFloat(response.data.result.receiver_lat), lng : parseFloat(response.data.result.receiver_long)});
      setDestination({ lat : parseFloat(response.data.result.sender_lat), lng : parseFloat(response.data.result.sender_long)});
      // setDestination({ lat :, lng : });

    })
  }

  

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!location.latitude || !location.longitude) {
    return <div>Getting your location...</div>;
  }

  

  return (
    <>
    <Header />
    
    <div className="container my-5">
      <div className="row">
        <div className="col-md-12">
            <h4>You : <span style={{display : "inline-block", height : "30px", width : "30px", backgroundColor : "#d204fbff"}}></span></h4>
    <h4>Friend : <span style={{display : "inline-block", height : "30px", width : "30px", backgroundColor : "#0463fbff"}}></span></h4>
      {
        source.lat
        ?
        <>
        <h1>hello</h1>
        <APIProvider apiKey="AIzaSyD-vpcc3LQ4s5b7yrEvIG7u0jMHlQL8pzU">
          <Map
            defaultZoom={14}
            defaultCenter={source}
            style={containerStyle}
            mapId={'45ba5dc6d10f9f67beb0237c'}
          >
            <AdvancedMarker position={source}>
              <Pin background={'#0463fbff'} glyphColor={'#000'} borderColor={'#000'}/>
            </AdvancedMarker>
            <AdvancedMarker position={destination}>
              <Pin background={'#d204fbff'} glyphColor={'#000'} borderColor={'#000'}/>
            </AdvancedMarker>
            {/* <Marker position={source} /> */}
            {/* <Marker position={destination} /> */}
            <Directions source={source} destination={destination} />
          </Map>
        </APIProvider>
        </>
        :
        'no'
      }
        </div>
      </div>



    </div>
    
    
    </>
  )
}

export default Tracker

