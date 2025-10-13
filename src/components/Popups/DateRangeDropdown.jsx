import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function DateRangeDropdown({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 text-xs sm:text-sm hover:bg-gray-50 bg-white transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer min-w-[140px]"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </button>
      {isOpen && (
        <ul className="absolute z-50 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[140px] max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-700 hover:text-white text-xs sm:text-sm whitespace-nowrap"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
