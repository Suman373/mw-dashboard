import './App.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapView from './components/MapView';
import TimelineSlider from './components/TimelineSlider';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { Calendar } from 'lucide-react';
import toast, { useToasterStore } from 'react-hot-toast';
import dayjs from 'dayjs';
import { MAX_TOASTS, TOTAL_HOURS } from './utils/constants';
import StaticBadge from './components/StaticBadge';
import { useGlobalContext } from './context/GlobalContext';

function App() {

  const { state, updateState } = useGlobalContext();
  const { toasts } = useToasterStore();
  const calculateTimePeriod = () => {
    const start = dayjs().subtract(TOTAL_HOURS - state.range[0], 'hour');
    const end = dayjs().subtract(TOTAL_HOURS - state.range[1], 'hour');
    updateState("formattedRange", [start.format("DD, MMM YYYY"), end.format("DD, MMM YYYY")]);
    updateState("selectedDays", end.diff(start, 'day'));
  }

  useEffect(() => {
    calculateTimePeriod();
  }, [state.range]);



  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= MAX_TOASTS)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-4 text-white items-center justify-start min-h-screen w-screen max-w-7xl px-6 py-8 mx-auto">
        <div className="min-h-fit w-[100%] flex flex-col space-y-4 max-w-7xl rounded-lg p-4 bg-gray-800 border border-gray-500">
          <div className='flex space-x-4 gap-1 items-center justify-start'>
            <h1 className="text-lg md:text-xl font-semibold">Time Period</h1>
            <p>{state.formattedRange[0]} - {state.formattedRange[1]}</p> <StaticBadge text={`${state.selectedDays} days`} />
          </div>
          <TimelineSlider />
          <div>
            <p className='text-green-400 text-center my-1'>{dayjs().subtract(TOTAL_HOURS - 0, 'hour').format("DD MMM YYYY")} - {dayjs().subtract(TOTAL_HOURS - 720, 'hour').format("DD MMM YYYY")}</p>
          </div>
        </div>

        <div className="flex justify-center min-h-[600px] w-[100%] bg-gray-800 p-4 rounded-lg ">
          <div className="flex-1">
            <MapView />
          </div>
          <div className="w-[30%] p-4 overflow-y-auto bg-gray-800">
            <h1 className="text-lg font-bold mb-2">Control Panel</h1>
            <div className='flex flex-col px-1'>
              {state.polygons?.map((polygon)=> (
                <div className='bg-gray-500' key={polygon.id}>
                  <StaticBadge text={polygon?.id}/>
                  {polygon?.coordinates?.map((coord)=> (
                    <p>{`${coord.lat} - ${coord.lng}`} </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default App;
