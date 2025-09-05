import { useState } from "react";
import Floorplan from "./assets/exactum-3.svg?react";
import "./App.css";

function App() {
  // const [count, setCount] = useState(0);
  // const [data, setData] = useState(null);
  //
  // const apiCall = async () => {
  //   const response = await fetch('http://localhost:1234');
  //   const text = await response.text();
  //   setData(text);
  // };

  return (
    <>
      <div>
        <Floorplan />
      </div>
      {/* <div className="card"> */}
      {/*   <button onClick={apiCall}> */}
      {/*     Fetch from server */}
      {/*   </button> */}
      {/*   <p>{data ? `Server responds with ${data}` : ''}</p> */}
      {/* </div> */}
    </>
  );
}

export default App;
