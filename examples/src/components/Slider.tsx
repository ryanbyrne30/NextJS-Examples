import { Dispatch, SetStateAction } from "react";
import ReactSlider from "react-slider";

export default function Slider({
  value,
  setValue,
  label = "",
  max = 100,
  min = 0,
}: {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  label?: string;
  max?: number;
  min?: number;
}) {
  return (
    <div className="w-full flex flex-col items-center">
      <ReactSlider
        className="w-full h-3 pr-2 my-4 bg-gray-200 rounded-md cursor-grab"
        thumbClassName="absolute w-6 h-6 cursor-grab bg-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 -top-1"
        defaultValue={value}
        max={max}
        min={min}
        value={value}
        onChange={(v: number) => setValue(v)}
      />
      <label>{label}</label>
      <input
        className="border p-1"
        onChange={(e) => setValue(parseInt(e.target.value))}
        value={value}
        type="number"
        step={0}
      />
    </div>
  );
}
