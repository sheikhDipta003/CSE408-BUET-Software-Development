import React, { useState, useRef, useEffect } from 'react';
// import { Table, Form, Col } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/ProductCompare.css"

const ProductComparisonPage = () => {
  const [product1, setProduct1] = useState("");
  const [product2, setProduct2] = useState("");
  const [product1val, setProduct1val] = useState([]);
  const [product2val, setProduct2val] = useState([]);
  const [allFeatures, setAllFeatures] = useState([]);
  const [p1Features, set1Features] = useState(new Map());
  const [p2Features, set2Features] = useState(new Map());
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
          label: `${product.productName}`,
          productId: product.productId,
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
          label: `${product.productName}`,
          productId: product.productId,
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

  const handleProductSuggestClick1 = async (suggestion) => {
    const id = suggestion.productId;

    try {
      const response = await fetch(`http://localhost:5000/products/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }

      const data = await response.json();
      //console.log(data.productDetails);
      setProduct1val(data.productDetails);
      //console.log(product1val);
      setProductSuggest1([]);
      setProduct1("");
    } catch (error) {
      console.error('Error fetching product data:', error);
      // Handle the error as needed
    }
  }

  const handleProductSuggestClick2 = async (suggestion) => {
    const id = suggestion.productId;
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }

      const data = await response.json();
      //console.log(data.productDetails);
      setProduct2val(data.productDetails);
      //console.log(product2val);
      setProductSuggest2([]);
      setProduct2("");
    } catch (error) {
      console.error('Error fetching product data:', error);
      // Handle the error as needed
    }
  }

  function compareMap(map1, map2){
    if(map1.size !== map2.size)
      return false;
      return [...map1.entries()].every(([key, value]) => (map2.has(key) && map2.get(key) === value));
  }

  useEffect(() => {
  
    let features = [];
    let p1Feat = new Map();
    let p2Feat = new Map();
    if (product1val.length !== 0) {
      const specNames1 = product1val.ProductSpecs.map((spec) => spec.specName);
      specNames1.forEach((name) => {
        if (!features.includes(name)) {
          features.push(name);
        }
      });
    }
  
    if (product2val.length !== 0) {
      const specNames2 = product2val.ProductSpecs.map((spec) => spec.specName);
      specNames2.forEach((name) => {
        if (!features.includes(name)) {
          features.push(name);
        }
      });
    }
    if(features.toString() !== allFeatures.toString())
      setAllFeatures(features);

    if(product1val.length !== 0){
      
      product1val.ProductSpecs.forEach((item) => {
        if(!p1Feat.has(item.specName))
          p1Feat.set(item.specName, item.value)
      })
      allFeatures.forEach((item) => {
        if(!p1Feat.has(item))
          p1Feat.set(item, "None");
      })
      if(!compareMap(p1Feat, p1Features)){
        set1Features(p1Feat)
      }
      console.log({p1Features})
    }

    if(product2val.length !== 0){
      product2val.ProductSpecs.forEach((item) => {
        if(!p2Feat.has(item.specName))
          p2Feat.set(item.specName, item.value)
      })
      allFeatures.forEach((item) => {
        if(!p2Feat.has(item))
          p2Feat.set(item, "None");
      })
      if(!compareMap(p2Feat, p2Features)){
        set2Features(p2Feat)
      }
      console.log({p2Features})
    }
  
  }, [product1val, product2val, allFeatures, p1Features, p2Features]);

  const criteriaData = [
    { criteria: 'Price', feature1: 'Price1', feature2: 'Price2' },
    { criteria: 'Quality', feature1: 'Quality1', feature2: 'Quality2' },
    { criteria: 'Durability', feature1: 'Durability1', feature2: 'Durability2' },
    // Add more criteria as needed
  ];

  return (
    <div className="container mx-auto m-10 content-center">
      <div className="mt-2 flex justify-center items-center">
        <h3 className="text-lg font-semibold mb-4">Product Comparison</h3>
      </div>
      <div className="mt-2 flex justify-center items-center">
        <table className="w-4/5 border-collapse mb-10 text-center" id='compTable'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='border-b border-black px-6 py-10'>Criteria</th>
              <th className='border-b border-black px-6 py-10'>
                <div className="relative" ref={searchRef1}>
                  <input
                    className='searchbar'
                    type="text"
                    value={product1}
                    onChange={(e) => setProduct1(e.target.value)}
                    placeholder="Search for product to compare"
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
                </div> <br></br>
                {product1val.productName}
              </th>
              <th className='border-b border-black px-6 py-10'>
                <div className="relative" ref={searchRef2}>
                  <input
                    className='searchbar'
                    type="text"
                    value={product2}
                    onChange={(e) => setProduct2(e.target.value)}
                    placeholder="Search for product to compare"
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
                <br></br>
                {product2val.productName}

              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='border-b border-black px-6 py-6'>Brand</td>
              <td className='border-b border-black px-6 py-6'>{product1val.brand}</td>
              <td className='border-b border-black px-6 py-6'>{product2val.brand}</td>
            </tr>
            <tr>
              <td className='border-b border-black px-6 py-6'>Category</td>
              <td className='border-b border-black px-6 py-6'>{product1val.category}</td>
              <td className='border-b border-black px-6 py-6'>{product2val.category}</td>
            </tr>

            <tr>
              <td className='border-b border-black px-6 py-6'>Subcategory</td>
              <td className='border-b border-black px-6 py-6'>{product1val.subcategory}</td>
              <td className='border-b border-black px-6 py-6'>{product2val.subcategory}</td>
            </tr>

            <tr>
              <td className='border-b border-black px-6 py-6'>Min Price</td>
              <td className='border-b border-black px-6 py-6'>{product1val.minPrice}</td>
              <td className='border-b border-black px-6 py-6'>{product2val.minPrice}</td>
            </tr>
            <tr>
              <td className='border-b border-black px-6 py-6'>Available in</td>
              <td className='border-b border-black px-6 py-6'>{product1val.websites} websites</td>
              <td className='border-b border-black px-6 py-6'>{product2val.websites} websites</td>
            </tr>
            
            {allFeatures.map((feature, index) => (
            <tr key={index}>
              <td className='border-b border-black px-6 py-6'>{feature}</td>
              <td className='border-b border-black px-6 py-6'>{p1Features.size > 0 ? p1Features.get(feature) : ''}</td>
              <td className='border-b border-black px-6 py-6'>{p2Features.size > 0 ? p2Features.get(feature) : ''}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductComparisonPage;
