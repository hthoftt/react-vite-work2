import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FrontLayout from "./pages/front/FrontLayout";
import Home from "./pages/front/Home";
import Products from "./pages/front/Products";
import About from "./pages/front/About";
import Store from "./pages/front/Store";
import ProductDetail from "./pages/front/ProductDetail";
import Checkout from "./pages/front/Checkout";

// 後台頁面拆開載入,前台訪客不用下載後台程式碼
const Login = lazy(() => import("./pages/front/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProduct = lazy(() => import("./pages/admin/AdminProduct"));
const AdminFeedback = lazy(() => import("./pages/admin/AdminFeedback"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<FrontLayout />}>
          <Route path="" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="store" element={<Store />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<AdminProduct />} />
          <Route path="adminFeedback" element={<AdminFeedback />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
