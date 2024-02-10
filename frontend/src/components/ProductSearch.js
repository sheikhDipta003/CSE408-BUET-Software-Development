import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/ProductListing.css";
import api from "../api/axios";
import DataContext from "../context/DataContext";
import ProductFilter from "./ProductFilter";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const ProductListing = () => {
  const { keyword } = useParams();
  const { fetchError, isLoading } = useContext(DataContext);
  const [productCards, setProductCards] = useState([]);
  const [sortType, setSortType] = useState("priceLowToHigh");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [priceRange, setPriceRange] = useState({ lower: 0, upper: 400000 });
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [specs, setSpecs] = useState(new Map());

  const addToSet = (key, value) => {
    if (!specs.has(key)) {
      specs.set(key, new Set());
    }
  
    specs.get(key).add(value);
  }

  const goToProductDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    //fetch the product details and then iterate through them for the filtereing data
    const fetchData = async () => {
      try {
        let response = await fetch(`http://localhost:5000/products/search/${keyword}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        response = await response.json();
        console.log(response);
        setProductData(response.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    let brands =[];
    let specs = new Map();
     productData.forEach((item) => {
      if (!brands.includes(item.brand)) {
        brands.push(item.brand);
      }
      setBrands(brands);
      item.ProductSpecs.forEach((line)=>{
        addToSet(line.specName, line.value);
      })
      specs.forEach((value, key) => {
        console.log(`Key: ${key}`);
        console.log('Values:');
        value.forEach((v) => {
          console.log(`  ${v}`);
        });
        console.log('---');
      });
      setSpecs(specs);
    });
  }, [keyword]);

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  const handleBrandChange = (brands) => {
    setSelectedBrands(brands);
  }
  const filterProducts = (product) => {
    // Price Range Filter
    if (product.minPrice < priceRange.lower || product.minPrice > priceRange.upper) {
      return false;
    }

    //Checkbox Filters
    for (const specKey in selectedFilters) {
      const selectedOptions = selectedFilters[specKey];
      product.ProductSpecs.forEach((item) => {
        if (item.specName === specKey) {
          if (
            selectedOptions.length > 0 &&
            !selectedOptions.includes(item.value)
          ) {
            return false;
          }
        }
      }
      )
    }
    return true;
  };

  useEffect(() => {
    let tempProductCards = [];
    productData.forEach((product, index) =>{
      if (
        filterProducts(product) 
        &&
        (selectedBrands.length === 0 || selectedBrands.includes(product.brand)) 
      ) {
        tempProductCards.push(
          <div
            className="product-card"
            onClick={() => goToProductDetail(product.productId)}
            key={index}
            price={product.minPrice}
            brand={product.brand}
          >
            <img src={product.imagePath} alt={product.productName} />
            <h3>{product.productName}</h3>
            <p>{product.minPrice}</p>
          </div>,
        );
      }
    })
    switch (sortType) {
      case "priceLowToHigh":
        tempProductCards.sort((a, b) => a.props.price - b.props.price);
        break;
      case "priceHighToLow":
        tempProductCards.sort((a, b) => b.props.price - a.props.price);
        break;
      default:
      // default case is already sorted
    }

    setProductCards(tempProductCards);
  }, [productData, sortType, selectedFilters, selectedBrands, priceRange, keyword]);

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const generateItemsPerPageOptions = () => {
    const options = [];
    for (let i = 4; i <= productCards.length; i += 4) {
      options.push(i);
    }
    // Add an option for 'all' if the last option isn't exactly the total number of products
    if (options[options.length - 1] !== productCards.length) {
      options.push("all");
    }
    return options;
  };

  const handleItemsPerPageChange = (e) => {
    const value = e.target.value;
    setItemsPerPage(value === "all" ? productCards.length : Number(value));
    setCurrentPage(0);
  };

  const pageCount =
    itemsPerPage === "all" ? 1 : Math.ceil(productCards.length / itemsPerPage);
  const currentItems =
    itemsPerPage === "all"
      ? productCards
      : productCards.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage,
      );

  return (
    <main className="ProductListing">
      <div className="content-container">
        {productData.items && (
          <ProductFilter
            specs={specs}
            brands={brands}
            onFilterChange={handleFilterChange}
            onBrandChange={handleBrandChange}
            onPriceRangeChange={handlePriceRangeChange}
          />
        )}

        <div className="content">
          <div className="topBar">
            <div className="results-count">
              {Math.min(currentPage * itemsPerPage + 1, productCards.length) ===
                Math.min(
                  (currentPage + 1) * itemsPerPage,
                  productCards.length,
                ) ? (
                <p>
                  Showing{" "}
                  {Math.min(
                    currentPage * itemsPerPage + 1,
                    productCards.length,
                  )}{" "}
                  results for "{keyword}"
                </p>
              ) : (
                <p>
                  Showing{" "}
                  {itemsPerPage === "all"
                    ? productCards.length
                    : Math.min(
                      currentPage * itemsPerPage + 1,
                      productCards.length,
                    )}{" "}
                  -{" "}
                  {itemsPerPage === "all"
                    ? productCards.length
                    : Math.min(
                      (currentPage + 1) * itemsPerPage,
                      productCards.length,
                    )}{" "}
                  of {productCards.length} results for "{keyword}
                  "
                </p>
              )}
            </div>

            <div className="select-boxes">
              <label htmlFor="items-per-page">Show:</label>
              <select
                id="items-per-page"
                className="items-per-page border-2 border-black rounded-sm"
                onChange={handleItemsPerPageChange}
              >
                {generateItemsPerPageOptions().map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label htmlFor="sort-by">Sort by:</label>
              <select
                id="sort-by"
                className="sort-by border-2 border-black rounded-sm"
                onChange={handleSortChange}
              >
                <option value="priceLowToHigh">Price (Low to High)</option>
                <option value="priceHighToLow">Price (High to Low)</option>
                <option value="topRated">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="main-content">
            {isLoading && (
              <p className="statusMsg text-green-500">Loading products...</p>
            )}
            {!isLoading && fetchError && (
              <p className="statusMsg" style={{ color: "red" }}>
                {fetchError}
              </p>
            )}
            {!isLoading &&
              !fetchError &&
              (currentItems.length ? (
                currentItems
              ) : (
                <p className="statusMsg">No products to display.</p>
              ))}
          </div>

          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={
              "pagination flex justify-center items-center my-4"
            }
            pageClassName={"page mx-1"}
            pageLinkClassName={
              "page-link block border border-gray-300 rounded py-2 px-3 hover:bg-gray-100 cursor-pointer"
            }
            previousClassName={"previous mx-1"}
            previousLinkClassName={
              "previous-link block border border-gray-300 rounded py-2 px-3 hover:bg-gray-100 cursor-pointer"
            }
            nextClassName={"next mx-1"}
            nextLinkClassName={
              "next-link block border border-gray-300 rounded py-2 px-3 hover:bg-gray-100 cursor-pointer"
            }
            activeClassName={"active bg-blue-500 text-white"}
            disabledClassName={"disabled opacity-50 cursor-not-allowed"}
          />
        </div>
      </div>
    </main>
  );
};

export default ProductListing;
