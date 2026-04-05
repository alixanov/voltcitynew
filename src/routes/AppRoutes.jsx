import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Sidebar, Home, Hot,History} from '../components';
import VideoPage from '../components/video/VideoPage';


const AppRoutes = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes basename="/">
          <Route path="/" element={<Home />} />
          <Route path="/hot" element={<Hot />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path='/history' element={<History/>} />
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes;