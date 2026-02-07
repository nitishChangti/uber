import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, logout, setLoading } from "./store/authSlice";
import { authService } from "./service/authService";
import { connectSocket, disconnectSocket } from "./store/socketSlice";

const App = () => {
  const dispatch = useDispatch();
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));
        const userAuth = JSON.parse(localStorage.getItem("userAuth"));

        if (token && userAuth) {
          const res = await authService.getCurrentUser();
          if (res?.status === 200 && res?.data?.data?.user) {
            dispatch(setUser(res.data.data.user));
            dispatch(connectSocket(import.meta.env.VITE_BASE_URL));
          } else {
            dispatch(logout());
            dispatch(disconnectSocket());
          }
        } else {
          dispatch(logout());
          dispatch(disconnectSocket());
        }
      } catch (err) {
        console.error("Auth bootstrap failed:", err);
        dispatch(logout());
        dispatch(disconnectSocket());
      } finally {
        setBootstrapped(true);
      }
    };

    bootstrapAuth();
  }, [dispatch]);

  if (!bootstrapped) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        Bootstrapping session...
      </div>
    );
  }

  return <Outlet />;
};

export default App;
