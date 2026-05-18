// App.jsx — Main router
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar/index';
import Toast from './components/Toast/index';
import useToast from './hooks/useToast/index';

// Pages (we'll create these next)
import Feed from './pages/Feed/index';
import SingleOffer from './pages/SingleOffer/index';
import SearchResults from './pages/SearchResults/index';
import Login from './pages/Login/index';
import Register from './pages/Register/index';
import CreateOffer from './pages/CreateOffer/index';
import EditOffer from './pages/EditOffer/index';
import MyRequests from './pages/MyRequests/index';
import UserProfile from './pages/UserProfile/index';
import AuthCallback from './pages/AuthCallback/index';

const App = () => {
  const { toasts, showToast, removeToast } = useToast();

  return (
    <>
      <Navbar showToast={showToast} />
      <Toast toasts={toasts} removeToast={removeToast} />
      <Routes>
        <Route path="/"                      element={<Feed showToast={showToast} />} />
        <Route path="/offers/:id"            element={<SingleOffer showToast={showToast} />} />
        <Route path="/search"                element={<SearchResults showToast={showToast} />} />
        <Route path="/login"                 element={<Login showToast={showToast} />} />
        <Route path="/register"              element={<Register showToast={showToast} />} />
        <Route path="/offers/new"            element={<CreateOffer showToast={showToast} />} />
        <Route path="/offers/:id/edit"       element={<EditOffer showToast={showToast} />} />
        <Route path="/offers/:id/requests"   element={<MyRequests showToast={showToast} />} />
        <Route path="/users/:id"             element={<UserProfile showToast={showToast} />} />
        <Route path="/auth/callback"         element={<AuthCallback showToast={showToast} />} />
      </Routes>
    </>
  );
};

export default App;