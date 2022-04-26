import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import OtherPage from "./OtherPage";
import Fib from "./Fib";

function App() {
  return (
    <div>
      <Router>
        <Link to="/">Home</Link>
        <br />
        <Link to="/otherpage">Other Page</Link>
        <header>
          <h1>Learn React</h1>
        </header>
        <Routes>
          <Route path="/" element={<Fib />} />
          <Route path="/otherpage" element={<OtherPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
