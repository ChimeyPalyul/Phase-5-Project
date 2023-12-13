import React from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";



function NavBar({isLoggedIn, setIsLoggedIn, setUsers}) {
  console.log(isLoggedIn);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    fetch("/api/logout", {
      method: "DELETE"
    })
    .then(res => {
      setUsers(null); 
      setIsLoggedIn(false);
  })
    navigate("/login")
  }


  return (
    <h1 className="header">
    <div className="container">
      <div className="navbar">
        <NavLink exact to="/" activeClassName="active-link">
          Home
        </NavLink>
        <NavLink to="/manage-expenses" activeClassName="active-link">
          Expenses
        </NavLink>
        <NavLink to="/manage-incomes" activeClassName="active-link">
          Incomes
        </NavLink>
        <NavLink to="/income-to-expenses" activeClassName="active-link">
          Income to Expenses
        </NavLink>
        {isLoggedIn ? (
            <NavLink onClick={handleLogout} activeClassName="active-link">
              Log Out
            </NavLink>
          ) : (
            <NavLink to="/login" activeClassName="active-link">
              Log In
            </NavLink>
          )}
      </div>
      <main>
        <Outlet />
      </main>
    </div>
    Budget Buddy</h1>
  );
}

export default NavBar;