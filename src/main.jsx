import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { initGA } from './analytics';
import { initMonitoring } from './monitoring';
import GAListener from './components/GAListener.jsx';

// Initialize analytics and monitoring if configured in environment
initGA();
initMonitoring();

const HomePage = lazy(() => import('./components/HomePage.jsx'));
const SinglePost = lazy(() => import('./components/SinglePost.jsx'));
const ArchivesPage = lazy(() => import('./components/ArchivesPage.jsx'));

const PageLoader = () => <div className="text-center p-12">Loading…</div>;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <GAListener />
        <Routes>
          <Route element={<App />}>
            <Route element={<HomePage />} path="/" />
            <Route element={<SinglePost />} path="/post/:slug" />
            <Route element={<ArchivesPage />} path="/archives" />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);