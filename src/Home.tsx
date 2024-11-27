import QRCode from 'react-qr-code';
// import ReactPolling from "react-polling/lib/ReactPolling";
import { useEffect, useState, useRef } from 'react';

function Home() {
    const [userData, setUserData] = useState({
        device_code: "", // UUID
        user_code: "", // String, randomly generated
        verification_uri: "", // Deeplink
        verification_uri_complete: 
            "", // Deeplink + user code
        expires_in: "", // Default
        interval: "" // Default
      });
      const [isRejected] = useState(false);
      const [clientData, setClientData] = useState({
        given_name: ""
      });
      const [isPolled] = useState(true);
      const [urlEncodedData, setUrlEncodedData] = useState("");
      // const [, setStatus] = useState({});
      const pollingRef = useRef(null);
    
      const stopPolling = () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      };
    
      const startPolling = () => {
        if (!pollingRef.current) {
          pollingRef.current = setInterval(() => {
            polling();
          }, 5000); // Poll every 5 seconds
        }
      };
      
      const polling = async () => {
        //fetch server data
        const response = await fetch('https://sdk-apps-noneu.truecaller.com/oauth/device/token', {
          method: 'POST', // Specify the method as POST
          headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: urlEncodedData
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
          stopPolling();
        }
     };
    
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
            const urlEncodedDataTemp = new URLSearchParams({
              grant_type : "rjkgjrgktge",
              device_code : result.device_code
            }).toString();
            setUrlEncodedData(urlEncodedDataTemp)
            startPolling();
            
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        // Call fetchData when component mounts
        fetchData();
        return () => stopPolling();
      }, [])
    
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
                  {isRejected && <div>Sorry... something went wrong.</div>}
                </div>
              </div> : 
              <div> <h2>Welcome {clientData.given_name}</h2></div>
              }
              
              
            </section>
          </div>
        </>
      )
}

export default Home;