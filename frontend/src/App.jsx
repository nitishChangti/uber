import React, { useEffect, useState } from "react";
import { homepage_img, logo } from "./assets/index";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout, setUser } from "./store/authSlice";
import {
  login as capLogin,
  logout as capLogout,
} from "./store/captainAuthSlice";
import { useNavigate } from "react-router-dom";
import { authService } from "./service/authService";
import { captainService } from "./service/captainService";
import { Outlet } from "react-router-dom";
import { connectSocket, disconnectSocket } from "./store/socketSlice";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    console.log("userAuth in app.jsx", userAuth);
    const capAuth = JSON.parse(localStorage.getItem("capAuth"));
    console.log("capAuth in app.jsx", capAuth);
    const checkAuth = async () => {
      try {
        if (userAuth && !capAuth) {
          const res = await authService.getCurrentUser();
          console.log(" res from get current user", res, res.status);
          if (res.status === 200) {
            console.log("res.data.data.user", res.data.data.user);
            const user = res.data.data.user;
            console.log("user in app.jsx", user);
            if (user) {
              console.log("user is ", user);
              // dispatch(login(user));
              dispatch(setUser(user));
              localStorage.setItem("userAuth", JSON.stringify(true));
              // Initialize socket connection
              // Connect socket with user token
              console.log("connect socket before start");
              dispatch(connectSocket(`${import.meta.env.VITE_BASE_URL}`));
              console.log("connect socket is done");
            } else {
              console.log("logout called");
              dispatch(logout());
              // localStorage.removeItem("userAuth")
              dispatch(disconnectSocket());
            }
          } else if (res.status === 401) return dispatch(logout());
          dispatch(logout());
          // localStorage.removeItem("userAuth")
          // dispatch(disconnectSocket());
        } else if (capAuth && !userAuth) {
          // console.log('first')
          const res = await captainService.getCurrentCap();
          console.log(" res from get current cap", res);
          if (res.status === 200) {
            const user = res.data.data.user;
            if (user) {
              dispatch(capLogin(user));
              // localStorage.setItem('capAuth', JSON.stringify(true));
              // Connect socket with captain token
              dispatch(connectSocket(`${import.meta.env.VITE_BASE_URL}`));
            } else {
              dispatch(capLogout());
              // localStorage.removeItem("capAuth")
              dispatch(disconnectSocket());
            }
          } else {
            if (res.status === 401) return dispatch(capLogout());
            dispatch(capLogout());
            // localStorage.removeItem("capAuth")
            dispatch(disconnectSocket());
          }
        }
      } catch (error) {
        console.log(error);
        console.log("Auth check error:", error);
        dispatch(logout());
        // localStorage.removeItem("userAuth")
        // localStorage.removeItem("capAuth")
        dispatch(capLogout());
        dispatch(disconnectSocket());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  // return !loading ? (
  //   <main>
  //     <Outlet />
  //   </main>
  // )
  //   : null;

  if (loading) {
    console.log("loading...");
    return <h1>Loading...</h1>; // ✅ Prevents early redirects
  }

  return (
    <main>
      <Outlet />
    </main>
  );
};

export default App;
