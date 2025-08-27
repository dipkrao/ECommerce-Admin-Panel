import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { login, logout, getProfile } from "../store/slices/authSlice";
import { fetchProducts } from "../store/slices/productSlice";

const ReduxExample = () => {
  const dispatch = useAppDispatch();
  const { user, loading, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const { products, loading: productsLoading } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    // Fetch products when component mounts
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleLogin = () => {
    dispatch(login({ email: "admin@example.com", password: "admin123" }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleGetProfile = () => {
    dispatch(getProfile());
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Redux Example Component</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Authentication State</h3>
        <div className="space-y-2">
          <p>Loading: {loading ? "Yes" : "No"}</p>
          <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
          <p>User: {user ? JSON.stringify(user, null, 2) : "None"}</p>
        </div>

        <div className="mt-4 space-x-2">
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login (Demo)
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
          <button
            onClick={handleGetProfile}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Get Profile
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Products State</h3>
        <div className="space-y-2">
          <p>Loading: {productsLoading ? "Yes" : "No"}</p>
          <p>Products Count: {products.length}</p>
          <p>
            Products:{" "}
            {products.length > 0
              ? JSON.stringify(products.slice(0, 2), null, 2)
              : "None"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReduxExample;
