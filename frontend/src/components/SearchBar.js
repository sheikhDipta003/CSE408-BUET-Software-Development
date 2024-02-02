import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const categories = {
    computers: ["all", "laptop", "desktop"],
    accessories: ["all", "keyboard", "mouse"],
  };
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const searchBarRef = useRef(null);

  useEffect(() => {
    if (input.length > 0) {
      const matchedSuggestions = [];
      Object.entries(categories).forEach(([category, subcategories]) => {
        if (category.includes(input.toLowerCase())) {
          matchedSuggestions.push(`Category: ${category}`);
        }
        subcategories.forEach((subcategory) => {
          if (subcategory.includes(input.toLowerCase())) {
            matchedSuggestions.push(`Subcategory: ${category}/${subcategory}`);
          }
        });
      });
      setSuggestions(matchedSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [input]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBarRef]);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      // const lowerInput = input.toLowerCase();
      // let path = "";
      // Object.entries(categories).forEach(([category, subcategories]) => {
      //   if (category.includes(lowerInput)) {
      //     path = `productlisting/${category}/all`;
      //   }
      //   subcategories.forEach((subcategory) => {
      //     if (subcategory.includes(lowerInput)) {
      //       path = `productlisting/${category}/${subcategory}`;
      //     }
      //   });
      // });
      // if (path) navigate(path);
      // setSuggestions([]);
      // setInput("");
      if (input.length > 0) {
        navigate(`/search/?keyword=${encodeURIComponent(input)}`);
        setSuggestions([]);
        setInput("");
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // navigate(`productlisting/${suggestion}`);
    // setSuggestions([]);
    // setInput("");
    const [type, value] = suggestion.split(": ");
    if (type === "Category") {
      navigate(`productlisting/${value}/all`);
    } else if (type === "Subcategory") {
      navigate(`productlisting/${value}`);
    }
    setSuggestions([]);
    setInput("");
  };

  return (
    <div className="relative w-5/6" ref={searchBarRef}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleEnter}
        className="border p-2 w-full"
        placeholder="Search for product, categories, subcategories..."
      />
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border mt-1 max-h-40 overflow-auto z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
