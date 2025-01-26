import "@popperjs/core";
import "bootstrap";
import Aos from "aos";
import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/antd.css";


import App from "./App";
import FlashProvider from "./contexts/FlashProvider";
import ApiProvider from "./contexts/ApiProvider";
import UserProvider from "./contexts/UserProvider";
import ModalProvider from "./contexts/ModalProvider";
import FlashMessage from "./components/FlashMessage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <FlashProvider>
      <ApiProvider>
        <UserProvider>
          <ModalProvider>
            <FlashMessage />
            <App />
          </ModalProvider>
        </UserProvider>
      </ApiProvider>
    </FlashProvider>
  </BrowserRouter>
);

(() => {
  const options = {
    duration: 700,
    easing: "ease-out-quad",
    once: true,
    startEvent: "load",
    disable: "mobile",
  };
  Aos.init(options);
})();
