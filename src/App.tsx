import './App.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapView from './components/MapView';
import TimelineSlider from './components/TimelineSlider';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { TOTAL_HOURS } from './utils/constants';

function App() {
  
  const [range, setRange] = useState<[number, number]>([350, 370]);
  const [formattedRange, setForMattedRange] = useState<[string, string]>(["",""]);

  const calculateTimePeriod = () => {
    const start = dayjs().subtract(TOTAL_HOURS - range[0], 'hour');
    const end = dayjs().subtract(TOTAL_HOURS - range[1], 'hour');
    setForMattedRange([start.format("DD, MMM YYYY"),end.format("DD, MMM YYYY")]);
    const selectedDays = end.diff(start, 'day');
    console.log(selectedDays + " days");
  }

  useEffect(()=>{
    calculateTimePeriod();
  },[range]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-4 text-white items-center justify-start min-h-screen w-screen max-w-7xl px-6 py-8 mx-auto">
        <div className="min-h-fit w-[100%] flex flex-col space-y-4 max-w-7xl rounded-lg p-4 bg-gray-800 border border-gray-500">
          <div className='flex space-x-4 gap-1 items-center justify-start'>
            <h1 className="text-lg md:text-xl font-semibold">Time Period</h1>
            <p>{formattedRange[0]} - {formattedRange[1]}</p>
          </div>
          <TimelineSlider value={range} onChange={setRange} />
        </div>

        <div className="flex min-h-[600px] w-[100%] bg-gray-800 p-4 rounded-lg ">
          <div className="flex-1">
            <MapView />
          </div>
          <div className="w-[30%] p-4 overflow-y-auto bg-gray-800">
            <h1 className="text-lg font-bold mb-2">Control Panel</h1>
          </div>
        </div>

      </div>
    </>
  )
}

export default App;
