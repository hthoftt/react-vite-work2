import { Routes, Route } from "react-router-dom";
import Login from "./pages/front/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminOrders from "./pages/admin/AdminOrders";
import FrontLayout from "./pages/front/FrontLayout";
import Home from "./pages/front/Home";
import Products from "./pages/front/Products";
import About from "./pages/front/About";
import Blog from "./pages/front/Blog";
import ProduntsDetail from "./pages/front/ProduntsDetail";
import Checkout from "./pages/front/Checkout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FrontLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProduntsDetail />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
        <Route path="/admin" element={<Dashboard />}>
          <Route path="products" element={<AdminProduct />} />
          <Route path="adminFeedback" element={<AdminFeedback />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
