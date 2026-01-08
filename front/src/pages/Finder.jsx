import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Directions from '../components/Directions'
import {
  APIProvider,
  Map,
  
  
  AdvancedMarker,
  Pin
} from "@vis.gl/react-google-maps";

const containerStyle = {
  width: "100%",
  height: "500px",
};
// const position = { lat: 37.42216, lng: -122.08427 };

const Finder = () => {

  let [url, setUrl]  = useState("");
  let param = useParams();
  let [msg, setMsg] = useState("")
  let [unique, setUnique] = useState("");

  let [position, setPosition] = useState({ lat: null, lng: null })

  let [fetchedData, setFetachData] = useState({});

  let [source, setSource] = useState({})
    let [destination, setDestination] = useState({})

  useEffect(()=>{
    axios
    .get("https://location-tracker-j5j5.onrender.com/api/v1/"+param.id)
    .then(response=>{
      let x = "https://location-tracker-j5j5.onrender.com/tracker/"+response.data.result.unique_str;
      setUnique(response.data.result.unique_str)
      setUrl(x);
      setPosition({ lat : response.data.result.sender_lat, lng : response.data.result.sender_long })
    })
  },[])

 

  let copy = async()=>{
    await navigator.clipboard.writeText(url);
    setMsg("Copied");
   
      GetDataEvery5Sec();
   
    //AIzaSyD-vpcc3LQ4s5b7yrEvIG7u0jMHlQL8pzU
  }


  let GetDataEvery5Sec = async()=>{
    axios
    .get("https://location-tracker-j5j5.onrender.com/api/v1/getdatabyunique/"+unique)
    .then(response=>{
      
      setFetachData(response.data.result)
      setSource({ lat : response.data.result.receiver_lat, lng : response.data.result.receiver_long});
      setDestination({ lat : response.data.result.sender_lat, lng : response.data.result.sender_long});

      setTimeout(()=>{
        GetDataEvery5Sec();
      },5000)
    })
  }
  return (
    <>
    <Header />
    <div className="container my-5">
      <div className="row">
        <div className="col-md-12">
          <p>URL you have to share with your Friend is :</p>
          <p>{url ? "Your Link is Generated" : 'Please Wait ....'}</p>

          {
            url
            ?
            <button onClick={copy} className='btn btn-info'>Copy</button>
            :
            ''

          }
          <br />
          <small>{msg}</small>
        </div>
      </div>
    
    <div style={{ height: '500px', width: '100%' }}> {/* Parent container needs a defined size */}
      
        {
          fetchedData.receiver_lat != null
          ?
          <>
          <h4>You : <span style={{display : "inline-block", height : "30px", width : "30px", backgroundColor : "#d204fbff"}}></span></h4>
    <h4>Friend : <span style={{display : "inline-block", height : "30px", width : "30px", backgroundColor : "#0463fbff"}}></span></h4>
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
          <h3>Your Fiend have't click on the this link yet ...</h3>
        }
      
    </div>
    
    </div>
    </>
    
  )
}

export default Finder