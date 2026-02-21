import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./component/include/Navbar";
import Layout from "./component/layout/Layout";
import Sidebar from "./component/layout/Sidebar";


import Home from "./component/pages/Home";
import Bar from "./component/pages/Bar";
import Kitchen from "./component/pages/Kitchen";
import GuestHouse from "./component/pages/GuestHouse";
import GYM from "./component/pages/GYM";
import Billiard from "./component/pages/Billiard";
import Expenses from "./component/pages/Expenses";
import Credits from "./component/pages/Credits"; // ✅ Added

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Bar" element={<Bar />} />
        <Route path="/Kitchen" element={<Kitchen />} />
        <Route path="/GuestHouse" element={<GuestHouse />} />
        <Route path="/GYM" element={<GYM />} />
        <Route path="/Billiard" element={<Billiard />} />
        <Route path="/Expenses" element={<Expenses />} />
        <Route path="/credits" element={<Credits />} /> {/* ✅ Added */}
      </Routes>
    </Router>
  );
}

export default App;