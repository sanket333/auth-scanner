import './App.css'
import QRCode from 'react-qr-code';

function App() {

  return (
    <>
      <div className='container'>
        <section id="nav">
          LOGO
        </section>
        <section className='scanner-container'>
            <h3>Login With Truecaller</h3>
            <div
            style={{
              height: "auto",
              width: "100%",
            }}
          >
            <QRCode
              size={156}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={"https://www.google.com"}
              viewBox={`0 0 256 256`}
            />
          </div>
        </section>
      </div>
    </>
  )
}

export default App;
