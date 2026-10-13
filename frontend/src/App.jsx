import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

import Feed from './pages/Feed';
import Search from './pages/Search';
import PostDetail from './pages/PostDetail';
import TagPage from './pages/TagPage';
import Archive from './pages/Archive';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import PostEditor from './pages/PostEditor';
import Profile from './pages/Profile';
import ProfileSettings from './pages/ProfileSettings';
import SeriesPage from './pages/SeriesPage';
import Bookmarks from './pages/Bookmarks';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Changelog from './pages/Changelog';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Core blog */}
        <Route path="/" element={<Feed />} />
        <Route path="/search" element={<Search />} />
        <Route path="/post/:slug" element={<PostDetail />} />
        <Route path="/tag/:slug" element={<TagPage />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/profile/:id" element={<Profile />} />

        {/* Auth (public) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/editor/new" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
        <Route path="/editor/:id" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />

        {/* Future features (UI only) */}
        <Route path="/series/:slug" element={<SeriesPage />} />

        {/* Platform / legal */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/changelog" element={<Changelog />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
