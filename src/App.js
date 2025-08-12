import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Product from "./Page/Product";
import Home from "./Page/Home";
import Cart from "./Page/Cart";
import RootLayoute from "./component/Layout/Root";
import ProductDetail from "./component/ProductDetail";
import AdminDashboard from "./component/AdminDashboard";
import AdminLogin from "./component/AdminLogin";
import ProtectedAdminRoute from "./component/ProtectedAdminRoute";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/" element={<RootLayoute />}>
            <Route index="true" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Route>
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
