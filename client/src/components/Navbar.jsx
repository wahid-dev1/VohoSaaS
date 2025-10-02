// src/components/Navbar.jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/signup" style={{ marginRight: "10px" }}>Signup</Link>
      <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
    </nav>
  );
}

export default Navbar;
