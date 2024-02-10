import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import "../css/ProductFilter.css";

const ProductFilter = ({ specs, brands, onFilterChange, onBrandChange, onPriceRangeChange }) => {//gets the inputs from ProductListing
  //const [expanded, setExpanded] = useState({});//expand the options
  const [selectedOptions, setSelectedOptions] = useState({});//choose the options
  const [lowerValue, setLowerValue] = useState(0);//price lower value
  const [upperValue, setUpperValue] = useState(400000);//price upper value
  const [selectedBrands, setSelectedBrands] = useState([]);

  const handleLowerSliderChange = async (event) => {//when the slide is changed, the lowervalue is changed
    try {
      const value = Math.min(Number(event.target.value), 200000);
      setLowerValue(value);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleUpperSliderChange = async (event) => {//when the slide is changed, the upper value is changed
    try {
      const value = Math.max(Number(event.target.value), 200000);
      setUpperValue(value);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    const initialSelectedBrands = [];
    const initialSelectedOptions = {};
    for (const key of specs.keys()) {
      initialSelectedOptions[key] = [];
    }
    setSelectedBrands(initialSelectedBrands);
    setSelectedOptions(initialSelectedOptions);
  }, [specs]);

  useEffect(() => {//change in price range
    onPriceRangeChange({ lower: lowerValue, upper: upperValue });
  }, [lowerValue, upperValue]);

  const handleBrandChange = (brand) => {
    setSelectedBrands((prevSelectedBrands) =>
      prevSelectedBrands.includes(brand)
        ? prevSelectedBrands.filter((selectedBrand) => selectedBrand !== brand)
        : [...prevSelectedBrands, brand]
    );
    onBrandChange(selectedBrands);
  };

  const handleCheckboxChange = (key, option) => {//change in check box
    setSelectedOptions((prevSelectedOptions) => {//checks the previous options
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

  // const toggleExpand = (key) => {
  //   setExpanded((prevExpanded) => ({
  //     ...prevExpanded,
  //     [key]: !prevExpanded[key],
  //   }));
  // };

  const renderSpecFilterGroup = (key, options) => {
    return (
      <div key={key} className="filter-group">
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
        {/* )} */}
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
      {brands.map((brand) => (
        <label key={brand}>
          <input
            type="checkbox"
            value={brand}
            checked={selectedBrands.includes(brand)}
            onChange={() => handleBrandChange(brand)}
          />
          {brand}
        </label>
      ))}
      {Object.entries(specs).map(([key, options]) =>
        renderSpecFilterGroup(key, options),
      )}
    </div>
  );
};

export default ProductFilter;
