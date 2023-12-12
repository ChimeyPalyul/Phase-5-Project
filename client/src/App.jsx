import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./Pages/Home";
import NavBar from "./Pages/NavBar";
import Login from './Pages/Login'


function App() {
  const [users, setUsers] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers)
  }, []);
  //Navbar functionality
  const routes = createRoutesFromElements(
    <Route path="/" element={<NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
    </Route>
  );

  const router = createBrowserRouter(routes);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;