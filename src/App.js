import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { getProfile } from "./store/slices/authSlice";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Categories from "./pages/Categories";
import Banners from "./pages/Banners";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import LegalContent from "./pages/LegalContent";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";

function App() {
  // Protected Route Component - moved inside App function
  const ProtectedRoute = ({ children }) => {
    const dispatch = useAppDispatch();
    const { user, loading, token } = useAppSelector((state) => state.auth);

    useEffect(() => {
      if (token && !user) {
        dispatch(getProfile());
      }
    }, [dispatch, token, user]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />

          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="categories" element={<Categories />} />
              <Route path="banners" element={<Banners />} />
              <Route path="orders" element={<Orders />} />
              <Route path="users" element={<Users />} />
              <Route path="legal" element={<LegalContent />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
