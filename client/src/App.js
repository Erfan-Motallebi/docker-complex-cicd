import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Fib from "./Fib";
import OtherPage from "./OtherPage";

function App() {
  return (
    <div>
      <header>
        <h2>Fib Calculator</h2>
      </header>
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
