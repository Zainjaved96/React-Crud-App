import { useState } from "react";

import "./App.css";
import Header from "./Components/Header";
import Users from "./Components/Users";
import Footer from "./Components/Footer";

function App() {
  return (
    <>
      <Header />
      <Users />
      <Footer/>
    </>
  );
}

export default App;
