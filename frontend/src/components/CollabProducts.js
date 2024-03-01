import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faInfoCircle,
    faTimes,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

const CollabProducts = ({ collabId }) => {
    const axiosPrivate = useAxiosPrivate();
    const [products, setProducts] = useState([]);
    const [websiteId, setId] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [promoted, setPromoted] = useState(false);
    const [all, setAll] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await axiosPrivate.get(`/collab/${collabId}/products`);
            console.log(response.data);
            setProducts(response.data.result);
            setId(response.data.websiteId);
        } catch (error) {
            console.log("Error fetching products: ", error);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const filterProducts = products.filter(
            (product) =>
                product.Product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.Product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.Product.category.includes(searchQuery) ||
                product.Product.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.Product.model.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        let allFilters = filterProducts;
        if (all) {
            allFilters = allFilters;
        }
        else if (promoted) {
            allFilters = allFilters.filter(
                (product) => product.promoted === true,
            );
        }
        else if (!promoted) {
            allFilters = allFilters.filter(
                (product) => product.promoted === false,
            );
        }

        setFilteredProducts(allFilters);
    }, [
        searchQuery,
        promoted,
        all,
        products
    ]);

    const handleProductPromote = async (pwId) => {
        try {
            const response = await axiosPrivate.post(
                `/collab/${collabId}/promote`,
                JSON.stringify({
                    pwId: pwId,
                }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                },
            );
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert(err.response.data.message);
        }
    };

    const handleProductUnpromote = async (pwId) => {
        try {
            const response = await axiosPrivate.post(
                `/collab/${collabId}/unpromote`,
                JSON.stringify({
                    pwId: pwId,
                }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                },
            );
            console.log(response.data);
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert(err.response.data.message);
        }
    };

    const handleAll = () => {
        setAll(true);
        setPromoted(false);
    }

    const handlePromoted = () => {
        setAll(false);
        setPromoted(true);
    }

    const handleUnpromoted = () => {
        setAll(false);
        setPromoted(false);
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div>
            <div className="text-xl font-bold flex justify-center mt-4 w-5/6">
                All products
            </div>

            <div className="mt-2 w-5/6">
                <input
                    type="text"
                    placeholder="Search for product name, brand, category, subcategory..."
                    className="px-4 py-2 rounded mt-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            <div className="flex items-center justify-center space-x-4 mb-4">
                <label className="text-md flex items-center cursor-pointer">
                    <input
                        type="radio"
                        name="filter"
                        value="all"
                        className="size-5 mr-2 cursor-pointer"
                        checked={all}
                        onChange={handleAll}
                    />
                    All
                </label>
                <label className="text-md flex items-center cursor-pointer">
                    <input
                        type="radio"
                        name="filter"
                        value="promoted"
                        className="size-5 mr-2 cursor-pointer"
                        checked={!all && promoted}
                        onChange={handlePromoted}
                    />
                    Promoted
                </label>
                <label className="text-md flex items-center cursor-pointer">
                    <input
                        type="radio"
                        name="filter"
                        value="unpromoted"
                        className="size-5 mr-2 cursor-pointer"
                        checked={!all && !promoted}
                        onChange={handleUnpromoted}
                    />
                    Unpromoted
                </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-5/6 mt-0">
                {filteredProducts.map((product) => (
                    <div
                        key={product.pwId}
                        className="relative p-4 border border-solid border-gray-400 rounded-lg mb-4"
                    >
                        <div className="absolute top-0 right-0 mt-0 mr-2 flex">
                            <Link
                                to={`/products/${product.Product.productId}/${websiteId}`}
                                target="_self"
                                rel="noopener noreferrer"
                            >
                                <button className="bg-blue-400 text-white px-4 py-2 rounded">
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                </button>
                            </Link>
                            &nbsp;&nbsp;&nbsp;
                            {!product.promoted ? (
                                <button
                                    className="bg-blue-200 text-black px-2 py-1 rounded hover:bg-blue-400"
                                    onClick={() => handleProductPromote(product.pwId)}
                                >
                                    Promote <FontAwesomeIcon icon={faPlus} />
                                </button>
                            ) : (
                                <button
                                    className="bg-red-200 text-black px-2 py-1 rounded hover:bg-red-400"
                                    onClick={() => handleProductUnpromote(product.pwId)}
                                >
                                    Unpromote <FontAwesomeIcon icon={faTimes} />
                                </button>
                            )}
                        </div>
                        <br></br>
                        <br></br>
                        <img
                            src={product.Product.imagePath}
                            alt={product.Product.productName}
                            className="mb-4 rounded-lg"
                            style={{ width: '300px', height: '200px' }}
                        />
                        <h3 className="text-l font-bold mb-2 mt-10">{product.Product.productName}</h3>

                        <p className="text-sm text-gray-600">{product.Product.brand}</p>
                        <p className="text-sm text-gray-600">{product.Product.category}</p>
                        <p className="text-sm text-gray-600">{product.Product.subcategry}</p>
                        <p className="text-sm text-gray-600">{product.Product.model}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CollabProducts;