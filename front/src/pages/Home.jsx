import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    let navigate = useNavigate();
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null)
    const [name, setName] = useState("")

    const [msg, setMsg] = useState("")

    useEffect(()=>{
        // Check if the browser supports geolocation
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

    // Error callback function
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

  let generateUrl = ()=>{
    axios
    .post("https://location-tracker-j5j5.onrender.com/api/v1/", {name : name, ...location})
    .then(response=>{
      navigate("/finder/"+response.data.result._id);
      // console.log(response.data)
      // setMsg(response.data)
      
    })
  }

  return (
    <>
    <Header />
    <div className="container">
        <div className="row">
            <div className="col-md-6 offset-md-3 mt-5">
                <h2>Generate Your URL</h2>
                <br />
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder='Your Name' type='text' className='form-control' />
                <br />
                <button onClick={generateUrl} className='btn btn-info'>Generate</button>
               
            </div>
        </div>
    </div>
    </>
  )
}

export default Home