import React, { useState } from "react";

export const Component = () => {
  const [selected, setSelected] = useState("");

  const handleChange = (value: string) => {
    setSelected(value);
  };

  return (
    <div className="radio-group">
      <div className={`radio-container ${selected === "yes" ? "checked" : ""}`}>
        <label className="radio-button">
          <input
            className="radio-input-element"
            type="radio"
            value="yes"
            name="option"
            checked={selected === "yes"}
            onChange={() => handleChange("yes")}
          />
          <svg
            className="radio-icon-element"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="8" />
          </svg>
          <div className="glow"></div>
        </label>
      </div>

      <div className={`radio-container danger ${selected === "no" ? "checked" : ""}`}>
        <label className="radio-button">
          <input
            className="radio-input-element"
            type="radio"
            value="no"
            name="option"
            checked={selected === "no"}
            onChange={() => handleChange("no")}
          />
          <svg
            className="radio-icon-element"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M6 18 18 6M6 6l12 12" />
          </svg>
          <div className="glow"></div>
        </label>
      </div>
    </div>
  );
};
