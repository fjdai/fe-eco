import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import Home from "./pages/home/ModernEcommerceHomePage"
import EcommerceLoginPage from "./pages/login/EcommerceLoginPage"
import EcommerceRegisterPage from "./pages/register/EcommerceRegisterPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import { useDispatch } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";
import { callFetchAccount } from "./services/apiUser/apiAuth";
import { useEffect, FC } from "react";
import NotFound from "./components/notFound";
import { Box } from "@mui/material";
import EcommerceHeader from "./components/header/EcommerceHeader";
import EcommerceFooter from "./components/footer/EcommerceFooter";
import ProtectedRouteAdmin from "./components/protectedRoute/admin";
import LayoutManagement from "./components/layoutManagement";
import AdminDashboard from "./pages/admin";
import NewCartPage from "./pages/cart/NewCartPage";
import CheckoutPage from "./pages/cart/CheckoutPage";
import EmailMarketingAdmin from "./pages/admin/EmailMarketingAdmin";
import AdminCategories from "./pages/admin/categories";
import AdminProducts from "./pages/admin/products";
import SearchPage from "./pages/search/SearchPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentCancel from "./pages/payment/PaymentCancel";
import MyOrdersPage from "./pages/orders/MyOrdersPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { useServerKeepAlive } from "./hooks/useServerKeepAlive";
import ProductDetailPage from "./pages/products/detailproduct"
import ProductsPage from "./pages/products/productspage"
import { useClientSideEffects } from "./hooks/useClientSideEffects"

const Layout = () => {
  return (
    <div className="layout-app">
      <Box display={"flex"} flexDirection={"column"} overflow={"hidden"}>
        <EcommerceHeader />
        <Outlet />
        <EcommerceFooter />
      </Box>
    </div>
  )
}

const App: FC = () => {
  const dispatch = useDispatch();

  // Keep-alive server chỉ chạy ở client-side
    useServerKeepAlive({
      onSuccess: () => console.log('[App] Server ping thành công'),
      onError: (error) => console.warn('[App] Server ping thất bại:', error.message)
    });

  const getAccount = async () => {
    if (typeof window !== 'undefined') {
      const res = await callFetchAccount();
      if (res && res.data) {
        dispatch(doGetAccountAction(res.data))
      }
    }
  }

  useEffect(() => {
    getAccount()
  }, [])

  useClientSideEffects();
  
  // Chỉ tạo router ở client-side
  if (typeof window === 'undefined') {
    return <Layout />; // Return basic layout for SSR
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "products/:slug",
          element: <ProductDetailPage />,
        },
        {
          path: "products",
          element: <ProductsPage />,
        },
        {
          path: "categories",
          element: <CategoriesPage />,
        },
        {
          path: "search",
          element: <SearchPage />,
        },
        {
          path: "cart",
          element: <NewCartPage />,
        },
        {
          path: "checkout",
          element: <CheckoutPage />,
        },
        {
          path: "payment/success",
          element: <PaymentSuccess />,
        },
        {
          path: "payment/cancel",
          element: <PaymentCancel />,
        },
        {
          path: "orders",
          element: <MyOrdersPage />,
        },
        {
          path: "orders/:orderId",
          element: <OrderDetailPage />,
        },
        {
          path: "profile",
          element: <ProfilePage />,
        }
      ]
    },
    {
      path: "/login",
      element: <EcommerceLoginPage />,
    },
    {
      path: "/register",
      element: <EcommerceRegisterPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/admin",
      element:
        <ProtectedRouteAdmin>
          <LayoutManagement />
        </ProtectedRouteAdmin>,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <AdminDashboard />
        },
        {
          path: "categories",
          element: <AdminCategories />
        },
        {
          path: "products",
          element: <AdminProducts />
        },
        {
          path: "email-marketing",
          element: <EmailMarketingAdmin />
        },
      ]
    },
  ]);

  return <RouterProvider router={router} />;
}

export { Layout };
export default App;
