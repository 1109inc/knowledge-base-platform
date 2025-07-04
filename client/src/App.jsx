// Import necessary modules from react-router-dom for routing
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import page components
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateDocument from "./pages/CreateDocument";
import ViewDocument from "./pages/ViewDocument";
import EditDocument from "./pages/EditDocument";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/**
 * Main application component.
 * Sets up the routing for the application.
 * @returns {JSX.Element} The main application component.
 */
function App() {
  return (
    // Router component to enable routing
    <Router>
      {/* Routes component to define different routes */}
      <Routes>
        {/* Route for the login page */}
        <Route path="/" element={<Login />} />
        {/* Route for the registration page */}
        <Route path="/register" element={<Register />} />
        {/* Route for the dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Route for creating a new document */}
        <Route path="/create" element={<CreateDocument />} />
        {/* Route for viewing a specific document */}
        <Route path="/documents/:id" element={<ViewDocument />} />
        {/* Route for editing a specific document */}
        <Route path="/documents/:id/edit" element={<EditDocument />} />
        {/* Route for the forgot password page */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Route for the reset password page */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

// Export the App component as the default export
export default App;
