import React, { useMemo } from 'react';
import { Range } from 'react-range';
import dayjs from 'dayjs';

const TOTAL_HOURS = 30 * 24;
const HOURS_BEFORE = 15 * 24;

type Props = {
  value: [number, number];
  onChange: (val: [number, number]) => void;
};

const TimelineSlider: React.FC<Props> = ({ value, onChange }) => {

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
    onChange([vals[0], vals[1]]);
  }


  return (
    <div className="px-4 py-2 bg-white shadow rounded overflow-x-hidden">
      <div className="relative mt-2 h-10">
        <Range
          min={0}
          max={TOTAL_HOURS}
          step={1}
          values={value}
          onChange={(vals) => handleSliderChange(vals)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="w-full h-2 rounded bg-gray-300 relative px-4"
            >
              <div
                className="absolute top-0 h-2 bg-blue-500 rounded"
                style={{
                  left: `${(value[0] / TOTAL_HOURS) * 100}%`,
                  width: `${((value[1] - value[0]) / TOTAL_HOURS) * 100}%`,
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
                className="w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow"
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

