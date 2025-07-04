// Import React library
import React from "react";
// Import ReactDOM library for rendering React components in the DOM
import ReactDOM from "react-dom/client";
// Import the main App component
import App from "./App";

// Get the root DOM element where the React app will be mounted
const root = ReactDOM.createRoot(document.getElementById("root"));
// Render the App component into the root DOM element
root.render(
  // StrictMode is a tool for highlighting potential problems in an application.
  // It activates additional checks and warnings for its descendants.
  <React.StrictMode>
    {/* Main application component */}
    <App />
  </React.StrictMode>
);
