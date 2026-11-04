"use client";

import React, { useState, useEffect } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: PriceRangeSliderProps) {
  const [localMin, setLocalMin] = useState(value[0]);
  const [localMax, setLocalMax] = useState(value[1]);

  useEffect(() => {
    setLocalMin(value[0]);
    setLocalMax(value[1]);
  }, [value]);

  const handleMinChange = (newMin: number) => {
    const val = Math.max(min, Math.min(newMin, localMax));
    setLocalMin(val);
    onChange([val, localMax]);
  };

  const handleMaxChange = (newMax: number) => {
    const val = Math.min(max, Math.max(newMax, localMin));
    setLocalMax(val);
    onChange([localMin, val]);
  };

  const minPercent = Math.min(100, Math.max(0, ((localMin - min) / (max - min || 1)) * 100));
  const maxPercent = Math.min(100, Math.max(0, ((localMax - min) / (max - min || 1)) * 100));

  return (
    <div className="space-y-4 pt-1">
      {/* Slider Visual Track */}
      <div className="relative h-2 w-full bg-[#E8DFCF] rounded-full">
        <div
          className="absolute h-full bg-[#14532D] rounded-full"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={localMin}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="absolute w-full -top-1.5 h-5 opacity-0 cursor-pointer pointer-events-auto"
          aria-label="Minimum price slider"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={localMax}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="absolute w-full -top-1.5 h-5 opacity-0 cursor-pointer pointer-events-auto"
          aria-label="Maximum price slider"
        />
      </div>

      {/* Numerical Currency Inputs */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-[#4B5563] mb-1">
            Min Price
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4B5563] font-medium">
              $
            </span>
            <input
              type="number"
              min={min}
              max={localMax}
              value={localMin}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="w-full pl-6 pr-2 py-1.5 bg-white border border-[#E8DFCF] rounded-md text-xs font-semibold text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#14532D]"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[#4B5563] mb-1">
            Max Price
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4B5563] font-medium">
              $
            </span>
            <input
              type="number"
              min={localMin}
              max={max}
              value={localMax}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="w-full pl-6 pr-2 py-1.5 bg-white border border-[#E8DFCF] rounded-md text-xs font-semibold text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#14532D]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

