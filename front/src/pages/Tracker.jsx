import React, {useState, useEffect} from 'react'
import Header from '../components/Header'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const Tracker = () => {

    let param = useParams();
    const [location, setLocation] = useState({ latitude: 22.753284, longitude: 75.893700 });
    let [position, setPosition] = useState({ lat: 22.753284, lng: 75.893700 })
    useEffect(()=>{
        axios
        .put("http://192.168.0.107:3000/api/v1/"+param.unique, location)
        .then(response=>{
            console.log(response.data);
        })
    },[])


    const [error, setError] = useState(null)
    useEffect(()=>{
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
        },[])
        if (error) {
    return <div>Error: {error}</div>;
  }

  if (!location.latitude || !location.longitude) {
    return <div>Getting your location...</div>;
  }
  return (
    <>
    <Header />
    <div className="container">
        <div className="row">
            <div className="col-md-12">
                <div style={{ height: '500px', width: '100%' }}> {/* Parent container needs a defined size */}
                      
                        <APIProvider apiKey={'AIzaSyD-vpcc3LQ4s5b7yrEvIG7u0jMHlQL8pzU'}>
                        <Map defaultCenter={position} defaultZoom={14} mapId={'45ba5dc6d10f9f67beb0237c'}>
                          <AdvancedMarker position={position}>
                            <Pin background={'#fb0404ff'} glyphColor={'#000'} borderColor={'#000'} />
                          </AdvancedMarker>
                        </Map>
                      </APIProvider>
                      
                    </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Tracker