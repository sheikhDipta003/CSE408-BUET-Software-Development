import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import "../css/ProductFilter.css";

const ProductFilter = ({ specs, onFilterChange, onPriceRangeChange }) => {
  const [expanded, setExpanded] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [lowerValue, setLowerValue] = useState(0);
  const [upperValue, setUpperValue] = useState(400000);

  const handleLowerSliderChange = async (event) => {
    try {
      const value = Math.min(Number(event.target.value), 200000);
      setLowerValue(value);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleUpperSliderChange = async (event) => {
    try {
      const value = Math.max(Number(event.target.value), 200000);
      setUpperValue(value);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    // Initialize the `expanded` state with all keys set to true
    const initialExpandedState = {};
    const initialSelectedOptions = {};
    for (const key in specs) {
      initialExpandedState[key] = true; // Set all to true for default expanded
      initialSelectedOptions[key] = [];
    }
    setExpanded(initialExpandedState);
    setSelectedOptions(initialSelectedOptions);
  }, [specs]);

  useEffect(() => {
    onPriceRangeChange({ lower: lowerValue, upper: upperValue });
  }, [lowerValue, upperValue]);

  const handleCheckboxChange = (key, option) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = prevSelectedOptions[key].includes(option)
        ? prevSelectedOptions[key].filter((o) => o !== option)
        : [...prevSelectedOptions[key], option];

      const newSelectedOptions = {
        ...prevSelectedOptions,
        [key]: updatedOptions,
      };
      onFilterChange(newSelectedOptions);
      return newSelectedOptions;
    });
  };

  const toggleExpand = (key) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [key]: !prevExpanded[key],
    }));
  };

  const renderFilterGroup = (key, options) => {
    return (
      <div key={key} className="filter-group">
        <div className="filter-header" onClick={() => toggleExpand(key)}>
          <label>{key}</label>
          <FontAwesomeIcon
            icon={expanded[key] ? faCaretUp : faCaretDown}
            color="black"
          />
        </div>
        {expanded[key] && (
          <div className="filter-options">
            {options.map((option) => (
              <label key={option} className="filter-option">
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedOptions[key]?.includes(option)}
                  onChange={() => handleCheckboxChange(key, option)}
                />
                {option}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="filter-groups">
      <div className="filter-group">
        <div className="filter-header">
          <label>Price Range</label>
        </div>
        <div className="dual-slider">
          <input
            type="range"
            min="0"
            max="200000"
            step="500"
            value={lowerValue}
            onChange={handleLowerSliderChange}
            className="lower"
          />
          <input
            type="range"
            min="200000"
            max="400000"
            step="500"
            value={upperValue}
            onChange={handleUpperSliderChange}
            className="upper"
          />
        </div>
        <div className="price-range-labels">
          <span style={{ color: "black" }}>{`BDT ${lowerValue}`}</span>
          <span style={{ color: "black" }}>{`BDT ${upperValue}`}</span>
        </div>
      </div>
      {Object.entries(specs).map(([key, options]) =>
        renderFilterGroup(key, options),
      )}
    </div>
  );
};

export default ProductFilter;
