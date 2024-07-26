import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setProducts, setChecked } from "../redux/Features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  const [hasProductsUnderPrice, setHasProductsUnderPrice] = useState(true);

  useEffect(() => {
    if (filteredProductsQuery.data) {
      if (priceFilter && !isNaN(priceFilter)) {
        const filterPrice = parseInt(priceFilter, 10);

        const filteredProducts = filteredProductsQuery.data.filter((product) => {
          const productPrice = parseInt(product.price, 10);
          return productPrice <= filterPrice;
        });

        if (filteredProducts.length > 0) {
          dispatch(setProducts(filteredProducts));
          setHasProductsUnderPrice(true);
        } else {
          setHasProductsUnderPrice(false);
        }
      } else {
        dispatch(setProducts(filteredProductsQuery.data));
        setHasProductsUnderPrice(true);
      }
    }
  }, [priceFilter, filteredProductsQuery.data, dispatch]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleVendorClick = (vendorName) => {
    const productsByVendor = filteredProductsQuery.data?.filter(
      (product) => product.vendor.username === vendorName
    );
    dispatch(setProducts(productsByVendor));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const uniqueVendors = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.vendor.username)
          .filter((vendor) => vendor !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row">
          <div className="bg-[#151515] p-3 mt-2 mb-2">
            <h2 className="h4 text-center py-2 text-white bg-black rounded-full mb-2">
              Filter by Categories
            </h2>

            <div className="p-5 w-[15rem]">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={`checkbox-${c._id}`}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />

                    <label
                      htmlFor={`checkbox-${c._id}`}
                      className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black text-white rounded-full mb-2">
              Filter by Brands
            </h2>

            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <div key={brand} className="flex items-center mr-4 mb-5">
                  <input
                    type="radio"
                    id={brand}
                    name="brand"
                    onChange={() => handleBrandClick(brand)}
                    className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />

                  <label
                    htmlFor={brand}
                    className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black text-white rounded-full mb-2">
              Filter by Vendors
            </h2>

            <div className="p-5">
              {uniqueVendors?.map((vendorName) => (
                <div key={vendorName} className="flex items-center mr-4 mb-5">
                  <input
                    type="radio"
                    id={vendorName}
                    name="vendor.username"
                    onChange={() => handleVendorClick(vendorName)}
                    className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />

                  <label
                    htmlFor={vendorName}
                    className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                  >
                    {vendorName}
                  </label>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 text-white bg-black rounded-full mb-2">
              Filter by Price Limit
            </h2>

            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
              />
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full text-white border my-4"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="h4 text-center text-white mb-2">
              Products ({products?.length})
            </h2>
            {hasProductsUnderPrice ? (
              <div className="flex flex-wrap">
                {products.length === 0 ? (
                  <Loader />
                ) : (
                  products?.map((p) => (
                    <div className="p-3" key={p._id}>
                      <ProductCard p={p} />
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p className="text-red-200">
                There are no products of price lesser than {priceFilter}.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
