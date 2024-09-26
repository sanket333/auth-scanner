import './App.css'
import QRCode from 'react-qr-code';
import ReactPolling from "react-polling/lib/ReactPolling";
import { useEffect, useState } from 'react';
function App() {
  const [userData, setUserData] = useState({
    device_code: "", // UUID
    user_code: "", // String, randomly generated
    verification_uri: "", // Deeplink
    verification_uri_complete: 
        "", // Deeplink + user code
    expires_in: "", // Default
    interval: "" // Default
  });
  const [isRejected, SetIsRejected] = useState(false);
  const [clientData, setClientData] = useState({
    given_name: ""
  });
  const [isPolled, setIsPolled] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://sdk-apps-noneu.truecaller.com/oauth/device/code', {
          method: 'POST', // Specify the method as POST
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        });
        const result = await response.json();
        console.log(result)
        setUserData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call fetchData when component mounts
    fetchData();
  }, [])
  const handleSuccess = (res) => {
    console.log(res);
    if(res.status === "REJECTED")   {
      SetIsRejected(true);
    }
    if(res.sub) {
      setClientData(res)
      setIsPolled(false);
    }
    // setData(res);
    return false;
  };
  // const fetchData = async () => {
  //   const data = await fetch("https://jsonplaceholder.typicode.com/users")
  //   const jsonData = await data.json();
  //   setUserData(jsonData.id)
  //   console.log(userData)
  // }

  return (
    <>
      <div className='container'>
        <section id="nav">
          <img width={100} src='../public/logo.jpg'/>
        </section>
        <section className='scanner-container'>
          {
            isPolled ? <div>
              <h3>Login With Truecaller</h3>
              {/* <h2>{userData.}</h2> */}
              <div
              style={{
                height: "auto",
                width: "100%",
              }}
            >
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={userData.verification_uri_complete}
                viewBox={`0 0 256 256`}
              />
              {userData.device_code && <ReactPolling
              
                url={`https://sdk-apps-noneu.truecaller.com/oauth/device/token?grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Adevice_code
                    &device_code=${userData.device_code}`}
                interval={3000} // in milliseconds(ms)
                onSuccess={(res) => handleSuccess(res)}
                onFailure={() => console.log("handle failure")} // this is optional
                method={"POST"}
                render={({ isPolling }) => {
                  if (isPolling) {
                    return <div></div>;
                  } else {
                    return <div></div>;
                  }
                }}
              />}
              {isRejected && <div>Sorry... something went wrong.</div>}
            </div></div> : <div> <h2>Welcome {clientData.given_name}</h2></div>
          }
          
          
        </section>
      </div>
    </>
  )
}

export default App;
