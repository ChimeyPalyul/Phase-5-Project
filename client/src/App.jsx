import React, { useEffect, useState, useContext } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./Pages/Home";
import NavBar from "./Pages/NavBar";
import Login from './Pages/Login'
import IncomeList from "./Pages/ManageIncomes./IncomeList";
import ExpenseList from "./Pages/ManageExpenses/ExpenseList";



function App() {
  const [users, setUsers] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    fetch("/api/check_session")
    .then((res) => {if(res.ok){
      res.json().then((user) => {setUsers(user); setIsLoggedIn(true)})
    }})
  }, []);
  //Navbar functionality
  const routes = createRoutesFromElements(
    <Route path="/" element={<NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUsers={setUsers}/>}>
      <Route index element={<Home />} />
      <Route path='/manage-expenses' element={<ExpenseList users={users} setUsers={setUsers}/>}/>
      <Route path='/manage-incomes' element ={<IncomeList users={users} setUsers={setUsers}/>}/>
      <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setUsers={setUsers} setIsLoggedIn={setIsLoggedIn} />} />
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