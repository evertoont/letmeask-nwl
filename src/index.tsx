import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/global.scss";
import "./services/firebase";
import { AuthContextProvider } from "./contexts/AuthContext";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
