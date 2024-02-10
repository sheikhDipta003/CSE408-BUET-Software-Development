import React, { useState, useRef, useEffect } from 'react';
import { Table, Form, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductComparisonPage = () => {
  const [product1, setProduct1] = useState("");
  const [product2, setProduct2] = useState("");
  let product1val = [];
  let product2val = [];
  const [allFeatures, setAllFeatures] = useState([]);
  const searchRef1 = useRef(null);
  const searchRef2 = useRef(null);
  const [productSuggest1, setProductSuggest1] = useState([]);
  const [productSuggest2, setProductSuggest2] = useState([]);

  const handleProduct1Change = (e) => {
    setProduct1(e.target.value);
  };

  const handleProduct2Change = (e) => {
    setProduct2(e.target.value);
  };

  useEffect(() => {
    const fetchProduct1Suggestions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/products/search/${encodeURIComponent(product1)}`);
        //console.log(product1)
        const data = await response.json();
        //console.log(data);
        if (!data || data.length === 0) {
          setProductSuggest1([]);
          return;
        }
        const matchedSuggestions = data.products.map((product) => ({
          label: `${product.name}`,
          productId: product.id,
        }));

        setProductSuggest1(matchedSuggestions);
      } catch (error) {
        console.error('Error fetching product suggestions:', error);
      }
    };
    //console.log(input.length)
    if (product1.length > 0) {
      fetchProduct1Suggestions();
    } else {
      setProductSuggest1([]);
    }
  }, [product1]);

  useEffect(() => {
    const fetchProduct2Suggestions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/products/search/${encodeURIComponent(product2)}`);
        //console.log(product2)
        const data = await response.json();
        //console.log(data);
        if (!data || data.length === 0) {
          setProductSuggest2([]);
          return;
        }
        const matchedSuggestions = data.products.map((product) => ({
          label: `${product.name}`,
          productId: product.id,
        }));

        setProductSuggest2(matchedSuggestions);
      } catch (error) {
        console.error('Error fetching product suggestions:', error);
      }
    };
    //console.log(input.length)
    if (product2.length > 0) {
      fetchProduct2Suggestions();
    } else {
      setProductSuggest2([]);
    }
  }, [product2]);

  useEffect(() => {
    function handleClickOutside1(event) {
      if (
        searchRef1.current &&
        !searchRef1.current.contains(event.target)
      ) {
        setProductSuggest1([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside1);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside1);
    };
  }, [searchRef1]);

  useEffect(() => {
    function handleClickOutside2(event) {
      if (
        searchRef2.current &&
        !searchRef2.current.contains(event.target)
      ) {
        setProductSuggest2([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside2);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside2);
    };
  }, [searchRef2]);

  const  handleProductSuggestClick1 = async (suggestion) => {
    const id = suggestion.productId;

  try {
    const response = await fetch(`http://localhost:5000/products/compare`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product data');
    }

    const data = await response.json();
    console.log(data.productDetails);
    product1val = data.productDetails;
    console.log(product1val);
    setProductSuggest1([]);
    setProduct1("");
  } catch (error) {
    console.error('Error fetching product data:', error);
    // Handle the error as needed
  }
   }

   const  handleProductSuggestClick2 = async (suggestion) => {
    const id = suggestion.productId;
    try {
      const response = await fetch(`http://localhost:5000/products/compare`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
  
      const data = await response.json();
      console.log(data.productDetails);
      product2val = data.productDetails;
      console.log(product2val);
      setProductSuggest2([]);
      setProduct2("");
    } catch (error) {
      console.error('Error fetching product data:', error);
      // Handle the error as needed
    }
   }

   useEffect(() => {
    // Convert prices to pricesConv and update state
    if(product1val.length !== 0){
      const specNames = product1val.ProductSpecs.map((spec) => spec.specName);
      specNames.forEach((name) => {
        if (!allFeatures.includes(name)) {
          allFeatures.push(name);
        }
      });
    }
    console.log(allFeatures);
  }, [product1val, product2val]);
  const criteriaData = [
    { criteria: 'Price', feature1: 'Price1', feature2: 'Price2' },
    { criteria: 'Quality', feature1: 'Quality1', feature2: 'Quality2' },
    { criteria: 'Durability', feature1: 'Durability1', feature2: 'Durability2' },
    // Add more criteria as needed
  ];

  return (
    <div>
      <h1>Product Comparison</h1>

      <Table striped bordered hover width={200}>
        <thead>
          <tr>
            <th style={{ width: '300px' }}>Criteria</th>
            <th style={{ width: '400px' }}>'Product 1' || {product1val.name} <br></br>
              <div className="relative" ref={searchRef1}>
                <input
                  type="text"
                  value={product1}
                  onChange={(e) => setProduct1(e.target.value)}
                  placeholder="Search for product to compare"
                  style={{ width: '400px' }}
                />
                {productSuggest1.length > 0 && (
                  <div className="absolute top left-0 right-0 bg-white border mt-1 max-h-40 overflow-auto z-50">
                    {productSuggest1.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleProductSuggestClick1(suggestion)}
                      >
                        {suggestion.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </th>
            <th style={{ width: '400px' }}>'Product 2' || {product2val.name} <br></br>
            <div className="relative" ref={searchRef2}>
                <input
                  type="text"
                  value={product2}
                  onChange={(e) => setProduct2(e.target.value)}
                  placeholder="Search for product to compare"
                  style={{ width: '400px' }}
                />
                {productSuggest2.length > 0 && (
                  <div className="absolute top left-0 right-0 bg-white border mt-1 max-h-40 overflow-auto z-50">
                    {productSuggest2.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleProductSuggestClick2(suggestion)}
                      >
                        {suggestion.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {criteriaData.map((item, index) => (
            <tr key={index}>
              <td style={{ width: '300px' }}>{item.criteria}</td>
              <td style={{ width: '400px' }}>{item.feature1}</td>
              <td style={{ width: '400px' }}>{item.feature2}</td>
            </tr>
          ))}
          {/* {allFeatures.map((feature, index) => (
            <tr key={index}>
              <td>{feature}</td>
              <td>{product1 ? product1Features[index] : ''}</td>
              <td>{product2 ? product2Features[index] : ''}</td>
            </tr>
          ))} */}
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ProductComparisonPage;
