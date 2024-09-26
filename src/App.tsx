import './App.css'
import QRCode from 'react-qr-code';
import ReactPolling from "react-polling/lib/ReactPolling";
import { useEffect, useState } from 'react';
function App() {
  const [userData, setUserData] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const result = await response.json();
        console.log(result)
        setUserData(result[0].name);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call fetchData when component mounts
    fetchData();
  }, [])
  const handleSuccess = (res) => {
    console.log(res);
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
            <h3>Login With Truecaller</h3>
            <h2>{userData}</h2>
            <div
            style={{
              height: "auto",
              width: "100%",
            }}
          >
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={"https://www.google.com"}
              viewBox={`0 0 256 256`}
            />
            <ReactPolling
              url={"https://jsonplaceholder.typicode.com/users"}
              interval={3000} // in milliseconds(ms)
              retryCount={10} // this is optional
              onSuccess={(res) => console.log(res)}
              onFailure={() => console.log("handle failure")} // this is optional
              method={"POST"}
              render={({ startPolling, stopPolling, isPolling }) => {
                if (isPolling) {
                  return <div> Hello I am polling</div>;
                } else {
                  return <div> Hello I stopped polling</div>;
                }
              }}
          />
          </div>
        </section>
      </div>
    </>
  )
}

export default App;
