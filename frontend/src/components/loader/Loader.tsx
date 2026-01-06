import { useState } from "react";
import { LuLoaderPinwheel } from "react-icons/lu";
import './loader.scss';


const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <LuLoaderPinwheel className="loader-icon" />
        <span className="loader-text">Loading OpenTaskHub...</span>
      </div>
    </div>
  );
};

export default Loader;
