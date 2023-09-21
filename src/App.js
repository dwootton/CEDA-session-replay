import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import rrwebPlayer from 'rrweb-player';


const userData = [
    {"user": "E1D39056", "PID": "P1"},
    {"user": "7382kwtue", "PID": "P3"},
    {"user": "92ghd48xe", "PID": "P4"},
    {"user": "j2719eertu2", "PID": "P5"},
    {"user": "bjs827ee1u", "PID": "P6"},
    {"user": "lkin27js09b", "PID": "P7"},
    {"user": "li832lin23", "PID": "P8"},
    {"user": "3r2sh20ei", "PID": "P9"},
    {"user": "4728sjuiz", "PID": "P10"},
    {"user": "8v892iige", "PID": "P11"},
    {"user": "iurmer289", "PID": "P12"},
    {"user": "s294hoei", "PID": "P13"}
]

const conditionData = ["Happiness","Space"]


function App() {
  const navigate = useNavigate();
  const [pid, setPid] = useState(null);
  const [condition, setCondition] = useState(null);
  const [events, setEvents] = useState([]);

  console.log('condition', events)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const PID = params.get('PID');
    const condition = params.get('condition');

    if (PID) setPid(PID);
    if (condition) setCondition(condition);
  }, []);

  useEffect(() => {
    if (pid && condition) {
      const filePath = `/data/${pid}_${condition}.json`;
      console.log(filePath)

      // Replace this with your actual file reading logic
      fetch(filePath)
        .then(response => response.json())
        .then(data => setEvents(data))
        .catch(error => console.error('Error reading the file', error));
    }
  }, [pid, condition]);

  const handlePidChange = (value) => {
    setPid(value);
    navigate(`?PID=${value}&condition=${condition}`);
  };

  const handleConditionChange = (value) => {
    setCondition(value);
    navigate(`?PID=${pid}&condition=${value}`);
  };


  return (
    <div className="App">
      <div>
        <select value={pid} onChange={(e) => handlePidChange(e.target.value)}>
          {userData.map((data, index) => (
            <option key={index} value={data.user}>{data.PID +" - "+data.user}</option>
          ))}
        </select>
        <select value={condition} onChange={(e) => handleConditionChange(e.target.value)}>
          {["happiness", "space"].map((condition, index) => (
            <option key={index} value={condition}>{condition}</option>
          ))}
        </select>
      </div>
      {events?.events?.length > 0 && <ReplayerComponent events={events.events} />}
    </div>
  );
}

function ReplayerComponent({ events }) {
  const [replayer, setReplayer] = useState(null);
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://cdn.jsdelivr.net/npm/rrweb-player@latest/dist/style.css';
    document.head.appendChild(link);

    // Clean up function to remove the link element when the component unmounts
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {

    if(replayer){
      replayer.$destroy()
      const replayComponent = document.getElementById('replay-component');
      while (replayComponent.firstChild) {
        replayComponent.removeChild(replayComponent.firstChild);
      }
    } 
    const newPlayer = new rrwebPlayer({
        target: document.getElementById('replay-component'),
        props: {
          autoPlay: false,
          events: events,
          UNSAFE_replayCanvas: true
        }
    });

    setReplayer(newPlayer);
  },[events]);


  return (
    <div>
      <div id='replay-component'></div>
     
    </div>
  );
}
export default App;
