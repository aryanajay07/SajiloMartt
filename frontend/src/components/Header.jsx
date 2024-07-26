import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  const productsArray = Array.isArray(products) ? [...products] : [];

  let sortedProducts = productsArray?.sort((a, b) => (b.rating || 0) - (a.rating || 0)) || [];

  return (
    <>
      <div className="flex justify-around mx-auto flex flex-col">
        <h1 className="text-4xl text-white font-bold">High Rated Products</h1>
        <div className="xl:block lg:hidden md:hidden:sm:hidden">
          <div className="grid grid-cols-2">
            {sortedProducts.map((product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
        <ProductCarousel />
      </div>
    </>
  );
};

export default Header;
