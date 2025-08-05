import './App.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapView from './components/MapView';
import TimelineSlider from './components/TimelineSlider';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { Calendar, Trash } from 'lucide-react';
import toast, { useToasterStore } from 'react-hot-toast';
import dayjs from 'dayjs';
import { COLOR_RULE_REGEX, MAX_TOASTS, TOTAL_HOURS } from './utils/constants';
import StaticBadge from './components/StaticBadge';
import { useGlobalContext } from './context/GlobalContext';
import ColorPicker from './components/ColorPicker';

function App() {

  const { state, updateState, setState } = useGlobalContext();
  const [color, setColor] = useState<string>("#ffffffff");
  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const [condition, setCondition] = useState<string>("");
  const [condValid, setCondValid] = useState<boolean>(false);
  const { toasts } = useToasterStore();


  // calculate time period and selected days
  const calculateTimePeriod = () => {
    const start = dayjs().subtract(TOTAL_HOURS - state.range[0], 'hour');
    const end = dayjs().subtract(TOTAL_HOURS - state.range[1], 'hour');
    updateState("formattedRange", [start.format("DD, MMM YYYY"), end.format("DD, MMM YYYY")]);
    updateState("selectedDays", end.diff(start, 'day'));
  }

  // add a color rule
  const handleColorRuleAdd = () => {
    // 1 data source only for now
    if (!condValid || color.length === 0 || color === "") {
      toast.error("Not valid rule");
      return;
    }
    let colorExists = false;
    let conditionExists = false;

    state.dataSources[0].colorRules?.forEach((rule) => {
      if (rule.color === color) {
        colorExists = true;
        return;
      }
      if (rule.condition === condition) {
        conditionExists = true;
        return;
      }
    })

    if (colorExists && conditionExists) {
      toast.error("Color and condition already exists for this rule");
      return;
    } else if (colorExists) {
      toast.error("This color is already used in another rule");
      return;
    } else if (conditionExists) {
      toast.error("This condition is already used in another rule");
      return;
    }

    const newRule = { condition, color };
    setState(prev => ({
      ...prev,
      dataSources: [
        {
          ...prev.dataSources[0],
          colorRules: [...prev.dataSources[0].colorRules, newRule]
        }
      ]
    }));
    setCondValid(false);
    setCondition("");
    setColor("#ffffffff");
    setColorPickerActive(false);
    toast.success("Color code rule added");
  }


  //  delete a color rule
  const handleColorRuleDelete = (idx: number) => {
    setState(prev => ({
      ...prev,
      dataSources: [
        {
          ...prev.dataSources[0],
          colorRules: prev.dataSources[0].colorRules.filter((_, id) => id !== idx)
        }
      ]
    }));
    toast.success("Rule deleted");
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

  useEffect(() => {
    setCondValid(COLOR_RULE_REGEX.test(condition));
  }, [condition])

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-4 text-white items-center justify-start min-h-screen w-screen max-w-7xl px-6 py-8 mx-auto">

        {/* Header with timeline */}
        <div className="min-h-fit w-[100%] flex flex-col space-y-4 max-w-7xl rounded-lg p-4 bg-gray-800 border border-gray-500">
          <div className='flex space-x-4 gap-1 items-center justify-start'>
            <h1 className="text-lg md:text-xl font-semibold flex items-center space-x-4 gap-3"> <Calendar className='text-green-500' /> Time Period</h1>
            <p>{state.formattedRange[0]} - {state.formattedRange[1]}</p> <StaticBadge text={`${state.selectedDays} days`} />
          </div>
          <TimelineSlider />
          <div>
            <p className='text-green-400 text-center my-1'>{dayjs().subtract(TOTAL_HOURS - 0, 'hour').format("DD MMM YYYY")} - {dayjs().subtract(TOTAL_HOURS - 720, 'hour').format("DD MMM YYYY")}</p>
          </div>
        </div>
        {/* Map container  and sidebar  */}
        <div className="flex justify-center h-[600px] w-[100%] bg-gray-800 p-4 rounded-lg ">
          <div className="flex-1">
            <MapView />
          </div>
          <div className="w-[30%] h-full flex flex-col justify-between p-3 bg-gray-800">
            <h1 className="text-lg font-bold mb-2">Polygons</h1>
            <div className='h-[40%]  flex flex-col gap-2 px-1 overflow-y-scroll'>
              {state?.polygons?.length > 0 && state.polygons?.map((polygon) => (
                <div className='bg-gray-500 rounded-lg p-2' key={polygon.id}>
                  <StaticBadge text={`Id: ${polygon?.id}`} />
                  {polygon?.coordinates?.map((coord) => (
                    <p>{`${coord.lat.toFixed(3)} , ${coord.lng.toFixed(3)}`} </p>
                  ))}
                </div>
              ))}
              {!state?.polygons || state?.polygons?.length === 0 && <p className='flex items-center justify-center'>No polygons created</p>}
            </div>
            <h1 className="text-lg font-bold mb-2">Color Coding Rules</h1>
            <div className='flex w-full items-center justify-start gap-2 relative z-10'>
              <div
                onClick={() => setColorPickerActive(pr => !pr)}
                className='h-6 w-6 bg-white'
                style={{ backgroundColor: color }}>
                {colorPickerActive && (
                  <ColorPicker
                    color={color}
                    setColor={setColor} />
                )}
              </div>
              <input
                className='w-2/3 bg-white rounded-md  text-black px-2 py-1 indent-1'
                name='colorRule'
                type="text"
                style={{ border: !condValid ? '3px solid red' : '0' }}
                value={condition}
                onChange={(e) => {
                  setCondition(e.target.value);
                }}
              />
              <button
                onClick={() => handleColorRuleAdd()}
                className='w-16 bg-green-500 text-white text-sm p-2 rounded-md'>
                Add
              </button>
            </div>
            <div className='h-[40%] flex flex-col px-1 gap-2 overflow-y-scroll mt-2'>
              {state?.dataSources[0]?.colorRules?.length > 0 && state.dataSources[0]?.colorRules?.map((rule, idx) => (
                <div className='bg-gray-500 rounded-md p-1 flex items-center justify-between gap-1' key={`rule-${rule.condition}-${idx}`}>
                  <div className='flex items-center gap-1'>
                    <div
                      className='h-6 w-6 bg-white'
                      style={{ backgroundColor: rule.color }}>
                    </div>
                    <p>{rule.condition}</p>
                  </div>
                  <Trash
                    onClick={() => handleColorRuleDelete(idx)}
                    className="text-white bg-red-500 rounded-full p-1" size={20} />
                </div>
              ))}
              {!state?.dataSources || state?.dataSources?.length === 0 && <p className='flex items-center justify-center'>No rules created</p>}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default App;
