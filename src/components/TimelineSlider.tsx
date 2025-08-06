import { Range } from 'react-range';
import { MIN_HOUR_GAP, TOTAL_HOURS } from '../utils/constants';
import toast from 'react-hot-toast';
import { useGlobalContext } from '../context/GlobalContext';

const TimelineSlider = () => {

  const {state, updateState} = useGlobalContext();

  // generating timeline marks with 1 step -> 1 hour
  // const timelineMarks = useMemo(() => {
  //   const obj: Record<number, string> = {};
  //   for (let i = 0; i <= TOTAL_HOURS; i += 24) {
  //     const day = dayjs().subtract(HOURS_BEFORE - i, 'hour').format('MMM D');
  //     obj[i] = day;
  //   }
  //   return obj;
  // }, []);

  const handleSliderChange = (vals: number[]) => {
    const start = vals[0];
    const end = vals[1];
    if (end - start < MIN_HOUR_GAP) {
      toast.error("Select minimum 1 day range");
      return;
    }
    updateState("range",[start,end]);
  }


  return (
    <div className="px-4 py-2 bg-gray-800 rounded overflow-x-hidden">
      <div className="relative my-4 h-10">
        <Range
          min={0}
          max={TOTAL_HOURS}
          step={1}
          values={state.range}
          onChange={(vals) => handleSliderChange(vals)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="w-full h-2 rounded bg-gray-300 relative px-4"
            >
              <div
                className="absolute top-0 h-2 bg-green-500 rounded"
                style={{
                  left: `${(state.range[0] / TOTAL_HOURS) * 100}%`,
                  width: `${((state.range[1] - state.range[0]) / TOTAL_HOURS) * 100}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props, index }) => {
            const { key: itemKey, ...otherProps } = props;
            return (
              <div
                key={itemKey}
                {...otherProps}
                className="w-4 h-4 bg-white border-2 border-green-500 rounded-full shadow"
              />
            )
          }}
        />
      </div>
      {/* labels for debugging */}
      {/* <div className="flex items-center justify-between text-xs text-gray-600 px-2 relative">
        {Object.entries(timelineMarks).map(([hourStr, label]) => (
          <span
            key={hourStr}
            style={{
              position: 'absolute',
              left: `${(+hourStr / TOTAL_HOURS) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {label}
          </span>
        ))}
      </div> */}
    </div>
  );
};

export default TimelineSlider;

