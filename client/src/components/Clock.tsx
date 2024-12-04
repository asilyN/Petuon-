import React, { useEffect, useState } from "react";

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Extract parts of the time and date
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const day = days[time.getDay()];
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className="flex ml-[54rem] mt-[-4em] ">
      <div style={{ fontFamily: '"Crimson Pro", serif' }} className="mt-[1rem] flex items-center text-[#354F52]  py-4 px-8 rounded-lg">
        {/* Day */}
        <div className="text-center mx-4">
          <div className="text-4xl ">{day}</div>
          <div className="text-sm uppercase mt-1 ">Day</div>
        </div>

        {/* Divider */}
        <div className="w-0.5 bg-white h-12 mx-4" style={{ backgroundColor: "#354F52" }}></div>

        {/* Hours */}
        <div className="text-center mx-4">
          <div className="text-4xl ">{hours}</div>
          <div className="text-sm uppercase mt-1">Hours</div>
        </div>

        {/* Divider */}
        <div className="w-0.5 h-12 mx-4" style={{ backgroundColor: "#354F52" }}></div>

        {/* Minutes */}
        <div className="text-center mx-4">
          <div className="text-4xl ">{minutes}</div>
          <div className="text-sm uppercase mt-1">Minutes</div>
        </div>

        {/* Divider */}
        <div className="w-0.5 bg-white h-12 mx-4" style={{ backgroundColor: "#354F52" }} ></div>

        {/* Seconds */}
        <div className="text-center mx-4">
          <div className="text-4xl ">{seconds}</div>
          <div className="text-sm uppercase mt-1">Seconds</div>
        </div>
      </div>
    </div>
    
  );
};

export default Clock;
