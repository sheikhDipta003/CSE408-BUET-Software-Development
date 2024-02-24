import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import "../css/ProductFilter.css";

const ProductFilter = ({
  specs,
  brands,
  onFilterChange,
  onBrandChange,
  onPriceRangeChange,
}) => {
  //gets the inputs from ProductListing
  //const [expanded, setExpanded] = useState({});//expand the options
  let specNames = [];
  const [selectedOptions, setSelectedOptions] = useState(new Map()); //choose the options
  const [lowerValue, setLowerValue] = useState(0); //price lower value
  const [upperValue, setUpperValue] = useState(400000); //price upper value
  const [selectedBrands, setSelectedBrands] = useState([]);

  const handleLowerSliderChange = async (event) => {
    //when the slide is changed, the lowervalue is changed
    try {
      const value = Math.min(Number(event.target.value), 200000);
      setLowerValue(value);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleUpperSliderChange = async (event) => {
    //when the slide is changed, the upper value is changed
    try {
      const value = Math.max(Number(event.target.value), 200000);
      setUpperValue(value);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    //console.log({specs})
    const initialSelectedBrands = [];
    let initialSelectedOptions = new Map();
    for (const key of specs.keys()) {
      if (!initialSelectedOptions.has(key))
        initialSelectedOptions.set(key, new Set());
    }
    setSelectedBrands(initialSelectedBrands);
    setSelectedOptions(initialSelectedOptions);
    //console.log(selectedOptions);
  }, [specs, brands]);

  useEffect(() => {
    //change in price range
    onPriceRangeChange({ lower: lowerValue, upper: upperValue });
  }, [lowerValue, upperValue]);

  const handleBrandChange = (checked, brand) => {
    if (checked) {
      setSelectedBrands((prev) => [...prev, brand]);
    }
    if (!checked) {
      setSelectedBrands((prev) => {
        return prev.filter((o) => o !== brand);
      });
    }
  };

  useEffect(() => {
    onBrandChange(selectedBrands);
  }, [selectedBrands]);

  const handleCheckboxChange = (checked, key, option) => {
    //change in check box
    setSelectedOptions((prev) => {
      const next = new Map(prev);
      if (checked) {
        const keySet = next.get(key);
        keySet.add(option);
        next.set(key, keySet);
      } else {
        const keySet = next.get(key);
        keySet.delete(option);
        next.set(key, keySet);
      }
      return next;
    });
    //console.log({selectedOptions})
    // setSelectedOptions((prevSelectedOptions) => {//checks the previous options
    //   const updatedOptions = prevSelectedOptions[key].includes(option)
    //     ? prevSelectedOptions[key].filter((o) => o !== option)
    //     : [...prevSelectedOptions[key], option];

    //   const newSelectedOptions = {
    //     ...prevSelectedOptions,
    //     [key]: updatedOptions,
    //   };
    //   onFilterChange(newSelectedOptions);
    //   return newSelectedOptions;
    // });
  };

  useEffect(() => {
    onFilterChange(selectedOptions);
  }, [selectedOptions]);

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
      <div className="filter-group">
        <div className="filter-header">
          <label>Brands</label>
        </div>
        {brands.map((brand) => (
          <label key={brand}>
            <input
              type="checkbox"
              value={brand}
              onChange={(e) => handleBrandChange(e.target.checked, brand)}
            />
            {brand}
          </label>
        ))}
      </div>
      {/* {Object.entries(specs).map(([key, options]) =>
        renderSpecFilterGroup(key, options),
      )} */}
      {specs.size > 0 &&
        Array.from(specs.entries()).map(([key, value]) => (
          <div key={key} className="filter-group">
            <div className="filter-header">
              <label>{key}</label>
            </div>
            {Array.from(value).map((v) => (
              <label key={v}>
                <input
                  type="checkbox"
                  value={v}
                  onChange={(e) =>
                    handleCheckboxChange(e.target.checked, key, v)
                  }
                />
                {v}
              </label>
            ))}
          </div>
        ))}
    </div>
  );
};

export default ProductFilter;
