import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AppLayout from "./components/AppLayout";
import ScrollToTop from "./components/ScrollToTop";
import ApiProvider from "./contexts/ApiProvider";

export default function App() {
  return (
    <>
      <ApiProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="" element={<HomePage />} />
          </Route>
        </Routes>
      </ApiProvider>
    </>
  );
}
