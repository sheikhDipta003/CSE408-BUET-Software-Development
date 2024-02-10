import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const categories = {
    computer: ["all", "laptop", "desktop"],
    accessories: ["all", "keyboard", "mouse"],
  };
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [productSuggest, setProductSuggest] = useState([]);
  const navigate = useNavigate();
  const searchBarRef = useRef(null);

  useEffect(() => {
    const fetchProductSuggestions = async () => {
      try {
        // Replace 'your-backend-endpoint' with your actual backend endpoint for fetching product suggestions
        const response = await fetch(`http://localhost:5000/products/search/${encodeURIComponent(input)}`);
        const data = await response.json();
        console.log(data);
        if (!data || data.length === 0) {
          setProductSuggest([]);
          return;
        }
        const matchedSuggestions = data.products.map((product) => ({
          label: `Product: ${product.productName}`,
          productId: product.id,
        }));

        setProductSuggest(matchedSuggestions);
      } catch (error) {
        console.error('Error fetching product suggestions:', error);
      }
    };
    console.log(input.length)
    if (input.length > 0) {
      fetchProductSuggestions();
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
      setProductSuggest([]);
      setSuggestions([]);
    }
  }, [input]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setProductSuggest([]);
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
      if (input.length > 0) {
        navigate(`/search/${encodeURIComponent(input)}`);
        setProductSuggest([]);
        setSuggestions([]);
        setInput("");
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const [type, value] = suggestion.split(": ");
    if (type === "Category") {
      navigate(`productlisting/${value}/all`);
    } else if (type === "Subcategory") {
      navigate(`productlisting/${value}`);
    }
    setProductSuggest([]);
    setSuggestions([]);
    setInput("");
  };

  const  handleProductSuggestClick = (suggestion) => {
    const id = suggestion.productId;
    navigate(`product/${id}`);
    setProductSuggest([]);
    setSuggestions([]);
    setInput("");
   }

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
      {(productSuggest.length > 0 || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 bg-white border mt-1 max-h-40 overflow-auto z-50">
          {productSuggest.length > 0 && productSuggest.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleProductSuggestClick(suggestion)}
            >
              {suggestion.label}
            </div>
          ))}
          {suggestions.length > 0 && suggestions.map((suggestion, index) => (
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
