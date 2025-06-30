import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateDocument from "./pages/CreateDocument"; // Add this
import ViewDocument from "./pages/ViewDocument";
import EditDocument from "./pages/EditDocument";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateDocument />} /> {/* Add this */}
        <Route path="/documents/:id" element={<ViewDocument />} /> {/* Add this */}
        <Route path="/documents/:id/edit" element={<EditDocument />} /> {/* Add this */}
      </Routes>
    </Router>
  );
}

export default App;
