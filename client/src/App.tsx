import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

function NotFound() {
  return <p className="warn">We could not find that page.</p>;
}

export default function App() {
  return (
    <BrowserRouter>
      <nav className="nav">
        <NavLink to="/" className="logo">
          Comp<span>Search</span>
        </NavLink>
      </nav>
      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/c/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}