import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/ProductListing.css";
import api from "../api/axios";
import ProductFilter from "./ProductFilter";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const ProductListing = () => {
  const { category, subcategory } = useParams();
  const [productCards, setProductCards] = useState([]);
  const [sortType, setSortType] = useState("priceLowToHigh");
  const [selectedFilters, setSelectedFilters] = useState(new Map());
  const [priceRange, setPriceRange] = useState({ lower: 0, upper: 400000 });
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate();
  const [brandings, setBrands] = useState([]);
  const [specifics, setSpecs] = useState(new Map());
  const [selectedBrands, setSelectedBrands] = useState([]);

  const goToProductDetail = (productId) => {
    navigate(`/products/${productId}`);
  };

  useEffect(() => {
    //fetch the product details and then iterate through them for the filtereing data
    const fetchData1 = async () => {
      try {
        let response = await api.get(
          `/products/search/${category}/${subcategory}`,
        );

        const data = response.data;
        setProductData(data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchData2 = async () => {
      try {
        let response = await api.get(
          `/products/all/${category}`,
        );

        const data = response.data;
        setProductData(data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call fetchData function inside useEffect
    if (subcategory === "all") fetchData2();
    else fetchData1();
    //console.log(productData);
  }, [category, subcategory]);

  useEffect(() => {
    let specs = new Map();
    const addToSet = (key, value) => {
      if (!specs.has(key)) {
        specs.set(key, new Set());
      }

      specs.get(key).add(value);
    };
    let brands = [];
    productData.forEach((item) => {
      if (!brands.includes(item.brand)) {
        brands.push(item.brand);
      }
      setBrands(brands);
      item.ProductSpecs.forEach((line) => {
        addToSet(line.specName, line.value);
      });
      // specs.forEach((value, key) => {
      //   console.log(`Key: ${key}`);
      //   console.log('Values:');
      //   value.forEach((v) => {
      //     console.log(`  ${v}`);
      //   });
      //   console.log('---');
      // });
      setSpecs(specs);
      //console.log(specifics);
    });
  }, [productData]);

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  const handleBrandChange = (brands) => {
    setSelectedBrands(brands);
  };

  const filterProducts = (product) => {
    // Price Range Filter
    if (
      product.minPrice < priceRange.lower ||
      product.minPrice > priceRange.upper
    ) {
      return false;
    }

    //Checkbox Filters
    let allFiltersPass = true;
    selectedFilters.forEach((value, key) => {
      if (value.size > 0) {
        const matchingSpec = product.ProductSpecs.find(
          (item) => item.specName === key,
        );
        if (!matchingSpec || !Array.from(value).includes(matchingSpec.value)) {
          allFiltersPass = false;
        }
      }
    });
    return allFiltersPass;
  };

  useEffect(() => {
    let tempProductCards = [];
    productData.forEach((product, index) => {
      if (
        filterProducts(product) &&
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
            <div className="images h-screen flex items-center">
              <img src={product.imagePath} alt={product.productName} />
            </div>
            <h3>{product.productName}</h3>
            <p>
              <strong>Price:</strong> {product.minPrice}
            </p>
          </div>,
        );
      }
    });
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
  }, [
    productData,
    sortType,
    selectedFilters,
    selectedBrands,
    priceRange,
    category,
    subcategory,
  ]);

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
    if (
      options.length === 0 ||
      options[options.length - 1] !== productCards.length
    ) {
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
        {productData.length > 0 && (
          <ProductFilter
            specs={specifics}
            brands={brandings}
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
                  results for "{category}/{subcategory}"
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
                  of {productCards.length} results for "{category}/{subcategory}
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
                value={
                  itemsPerPage === productCards.length ? "all" : itemsPerPage
                }
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
              </select>
            </div>
          </div>

          <div className="main-content">
            {currentItems.length ? (
              currentItems
            ) : (
              <p className="statusMsg">No products to display.</p>
            )}
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
