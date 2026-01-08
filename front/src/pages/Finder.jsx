import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';


// const position = { lat: 37.42216, lng: -122.08427 };

const Finder = () => {

  let [url, setUrl]  = useState("");
  let param = useParams();
  let [msg, setMsg] = useState("")

  let [position, setPosition] = useState({ lat: null, lng: null })

  useEffect(()=>{
    axios
    .get("http://192.168.0.107:3000/api/v1/"+param.id)
    .then(response=>{
      let x = "http://192.168.0.107:5173/tracker/"+response.data.result.unique_str;
      setUrl(x);
      setPosition({ lat : response.data.result.sender_lat, lng : response.data.result.sender_long })
    })
  },[])

  let copy = async()=>{
    await navigator.clipboard.writeText(url);
    setMsg("Copied");
    //AIzaSyD-vpcc3LQ4s5b7yrEvIG7u0jMHlQL8pzU
  }
  return (
    <>
    <Header />
    <div className="container my-5">
      <div className="row">
        <div className="col-md-12">
          <p>URL you have to share with your Friend is :</p>
          <p>{url}</p>

          <button onClick={copy} className='btn btn-info'>Copy</button>
          <br />
          <small>{msg}</small>
        </div>
      </div>
    
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
    </>
    
  )
}

export default Finder