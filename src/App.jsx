import { Home } from "./components/Home/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import profile from "./assets/profile.jpeg";
import "./App.css";
import Menu from "./components/Menu/Menu";
import Articles from "./components/Articles/articles";
import ArticleDetail from "./components/Articles/ArticleDetail";
import MyArticles from "./components/Articles/MyArticles";
import NewArticle from "./components/Articles/NewArticle";
import SavedArticles from "./components/Articles/SavedArticles";
import Settings from "./components/Settings/settings";
import RequireAuth from "./components/Shared/RequireAuth";
import { Navbar } from "./components/Navbar/navbar";
import Category from "./components/Menu/components/Cgory";
import Cart from "./components/Cart/Cart";
import Toaster from "./components/Shared/Toaster";
import AuthModal from "./components/Auth/AuthModal";
import Footer from "./components/Shared/Footer";
import PaymentCallback from "./components/Payments/PaymentCallback.jsx";
import OrderHistory from "./components/Payments/OrderHistory.jsx";

function App() {
  return (
    <div className="relative min-h-screen bg-slate-800 dark:bg-[#05010f]">
      <Navbar profile={profile} />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route
            path="/menu/category"
            element={<Navigate to="/menu" replace />}
          />
          <Route path="/menu/:category" element={<Category />} />
          <Route path="articles" element={<Articles />} />
          <Route
            path="articles/saved"
            element={
              <RequireAuth
                title="Sign in to view saved articles"
                description="Save articles you love and come back to them on any device."
              >
                <SavedArticles />
              </RequireAuth>
            }
          />
          <Route
            path="articles/mine"
            element={
              <RequireAuth
                title="Sign in to manage your articles"
                description="Create drafts, publish articles, and keep track of everything you have written."
              >
                <MyArticles />
              </RequireAuth>
            }
          />
          <Route
            path="articles/new"
            element={
              <RequireAuth
                title="Sign in to write an article"
                description="Share a recipe, nutrition guide, or food safety tip with the Kukin community."
              >
                <NewArticle />
              </RequireAuth>
            }
          />
          <Route path="articles/:slug" element={<ArticleDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route
            path="payment/callback"
            element={
              <RequireAuth
                title="Sign in to confirm your payment"
                description="Your payment reference is saved while you sign in."
              >
                <PaymentCallback />
              </RequireAuth>
            }
          />
          <Route
            path="orders"
            element={
              <RequireAuth
                title="Sign in to view your orders"
                description="Your order history is available to signed-in members."
              >
                <OrderHistory />
              </RequireAuth>
            }
          />
        </Routes>
      </main>

      <Footer />
      <Cart />
      <AuthModal />
      <Toaster />
    </div>
  );
}

export default App;
