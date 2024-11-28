import './App.css'
// import QRCode from 'react-qr-code';
import {QRCodeCanvas} from 'qrcode.react';
import { useEffect, useState, useRef } from 'react';
import CountdownTimer from './CountdownTimer';

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
  // const [isRejected] = useState(false);
  // const [isSuccess, setIsSuccess] = useState(false); // To show success animation

  const [clientData, setClientData] = useState({
    given_name: "",
    picture: "",
    phone_number: ""
  });
  const [isPolled, setIsPolled] = useState(true);
  const [, setUrlEncodedData] = useState("");
  // const [, setStatus] = useState({});
  const pollingRef = useRef(null);
  const [timerKey, setTimerKey] = useState(0); // Used to re-render the timer component

  const resetTimer = () => {
    setTimerKey((prevKey) => prevKey + 1); // Change key to force re-render
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };
  // const handleScanComplete = () => {
  //   setTimeout(() => {
  //     setIsPolled(false); // Hide QR code
  //     setIsSuccess(true); // Show success message
  //   }, 1000); // Simulate a delay after scanning
  // };
  const startPolling = (urlEncodedDataTemp) => {
    if (!pollingRef.current) {
      pollingRef.current = setInterval(() => {
        polling(urlEncodedDataTemp);
      }, 5000); // Poll every 5 seconds
    }
  };
  
  const polling = async (urlEncodedDataTemp) => {
    //fetch server data
    const response = await fetch('https://sdk-apps-noneu.truecaller.com/oauth/device/token', {
      method: 'POST', // Specify the method as POST
      headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: urlEncodedDataTemp
    });
    const data = await response.json();

    if(!data.sub) {
      if(data?.status === "PENDING") {
        console.log("pending")
      } else if(data?.status === "REJECTED") {
        console.log("rejected")
      } else {
        console.log("issue from backend")
      }
    } else {
      setClientData(data);
      setIsPolled(false)
      stopPolling();
    }
 };

 const fetchData = async () => {
      try {
        resetTimer();
        const response = await fetch('https://sdk-apps-noneu.truecaller.com/oauth/device/code', {
          method: 'POST', // Specify the method as POST
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        });
        const result = await response.json();
        console.log(result)
        setUserData(result);
        const urlEncodedDataTemp = new URLSearchParams({
          grant_type : "rjkgjrgktge",
          device_code : result.device_code
        }).toString();
        setUrlEncodedData(urlEncodedDataTemp)
        startPolling(urlEncodedDataTemp);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

  useEffect(() => {
    // Call fetchData when component mounts
    fetchData();
    return () => stopPolling();
  }, [])


  
  return (
    <div className="netflix-banner">
      <div className="moving-background"></div>
      <div className="banner-content">
        <div className="banner-header">
          <h1 className="logo">PETFLIX</h1>
          {/* <div className="language-options">
            <button className="language-btn">English</button>
            <button className="sign-in-btn">Sign In</button>
          </div> */}
        </div>
        <div className="banner-main-content">
        {isPolled ? (<div className="signin-container">
            {/* Option 1 */}
            
            <div className="option">
              <h3>Sign in with Truecaller</h3>
              <p>For quick sign up, scan the QR code shown</p>
              <div className="qr-code">
                <div>
                    <div>  
                    <QRCodeCanvas
                      size={256}
                     
                      value={userData.verification_uri_complete}
                      // viewBox={`0 0 256 256`}
                      
                    />
                    {/* {isRejected && <div>Sorry... something went wrong.</div>} */}
                  </div>
                  {/* <button
                      className="regenerate-btn"
                      onClick={handleScanComplete}
                    >
                      Simulate Scan
                    </button> */}
                </div> 
              </div>
            </div>

            {/* Option 2 */}
            <div className="option">
              <h3>Steps</h3>
              {/* <p>Sign-in from Browser/Mobile app</p> */}
              <ol>
                <li>
                Open the Truecaller App
                </li>
                <li>
                Click on settings at the right top
                </li>
                <li>Click “Activate TV”</li>
                <li>Scan the QR shown on the screen</li>
                <li>Click “Continue” and Done!</li>
              </ol>
              <div className="activation-code">
                
                <button onClick={fetchData} className="regenerate-btn">Reload QR</button>
              </div>
              <CountdownTimer key={timerKey}/>
             
            </div>
          </div>): 
          (<div className="success-container">
          <div className="avatar-container">
            <img
              className="avatar"
              src={clientData?.picture}
              alt={`${clientData?.given_name}'s avatar`}
            />
            <div className="user-number">
              {clientData?.phone_number.slice(2)}
          </div>
          </div>
          <div className="success-animation">
            <h2>Welcome, {clientData.given_name}!</h2>
            <p className="success-message">
              Your sign-in was successful. Enjoy your experience on Petflix!
            </p>
          </div>
        </div>)
          }
        </div>
      </div>
    </div>
  );


//   return (
//     <>
//       <div className='container'>
//         <section id="nav">
//           <img width={100} height={100} src='/logo.jpg'/>
//         </section>
//         <section className='scanner-container'>
          // {
          //   isPolled ? <div>
          //     <h3>Login With Truecaller</h3>
          //     {/* <h2>{userData.}</h2> */}
          //     <div
          //     style={{
          //       height: "auto",
          //       width: "100%",
          //     }}
             
          //   >
                
          //     <QRCode
          //       size={256}
          //       style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          //       value={userData.verification_uri_complete}
          //       viewBox={`0 0 256 256`}
                
          //     />
          //     {isRejected && <div>Sorry... something went wrong.</div>}
          //   </div>
          // </div> : 
          // <div> <h2>Welcome {clientData.given_name}</h2></div>
          // }
          
          
//         </section>
//       </div>
//     </>
//   )
}

export default App;
