import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { ProductPage } from './pages/ProductPage';
import { Search } from './pages/Search';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Account, OrderConfirmation, TrackOrder } from './pages/Orders';
import { About, Contact, Faq, Policy, Returns } from './pages/Info';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections/:handle" element={<Collection />} />
        <Route path="/products/:handle" element={<ProductPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:number" element={<OrderConfirmation />} />
        <Route path="/account" element={<Account />} />
        <Route path="/pages/track-order" element={<TrackOrder />} />
        <Route path="/pages/returns" element={<Returns />} />
        <Route path="/pages/about" element={<About />} />
        <Route path="/pages/contact" element={<Contact />} />
        <Route path="/pages/faq" element={<Faq />} />
        <Route path="/policies/:slug" element={<Policy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
