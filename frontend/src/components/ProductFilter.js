import React, { useState, useEffect } from 'react';
import '../css/ProductFilter.css';

const ProductFilter = ({ specs }) => {
    const [expanded, setExpanded] = useState({});
    const [selectedOptions, setSelectedOptions] = useState({});
    const [lowerValue, setLowerValue] = useState(0);
    const [upperValue, setUpperValue] = useState(400000);

    const handleLowerSliderChange = (event) => {
        const value = Math.min(Number(event.target.value), 200000);
        setLowerValue(value);
    };

    const handleUpperSliderChange = (event) => {
        const value = Math.max(Number(event.target.value), 200000);
        setUpperValue(value);
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

    const handleCheckboxChange = (key, option) => {
        const options = selectedOptions[key];
        const newOptions = options.includes(option)
            ? options.filter(o => o !== option)
            : [...options, option];
        setSelectedOptions({ ...selectedOptions, [key]: newOptions });
    };

    const toggleExpand = key => {
        setExpanded({ ...expanded, [key]: !expanded[key] });
    };

    const renderFilterGroup = (key, options) => {
        return (
            <div key={key} className="filter-group">
                <div className="filter-header" onClick={() => toggleExpand(key)}>
                    <label>{key}</label>
                    <label>{expanded[key] ? 'Hide' : 'Show'}</label>
                </div>
                {expanded[key] && (
                    <div className="filter-options">
                        {options.map(option => (
                            <label key={option} className="filter-option">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={selectedOptions[key].includes(option)}
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
                    <span style={{color:"black"}}>{`BDT ${lowerValue}`}</span>
                    <span style={{color:"black"}}>{`BDT ${upperValue}`}</span>
                </div>
            </div>
            {Object.entries(specs).map(([key, options]) => renderFilterGroup(key, options))}
        </div>
    );
};

export default ProductFilter;
