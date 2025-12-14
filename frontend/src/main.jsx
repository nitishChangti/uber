import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import "./index.css";
import Start from "./pages/Start.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import UserSignUp from "./pages/UserSignUp.jsx";
import CaptainSignup from "./pages/CaptainSignup.jsx";
import CaptainSignIn from "./pages/CaptainSignIn.jsx";
import Home from "./pages/Home.jsx";
import { Protected as AuthLayout } from "./components/AuthLayout.jsx";
import { CapProtected as CaptainLayout } from "./components/CapLayout.jsx";
import CaptainHome from "./pages/CaptainHome.jsx";
import Riding from "./pages/Riding.jsx";
import CaptainRiding from "./pages/CaptainRiding.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import RideHistory from "./pages/RideHistory.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import CaptainProfile from "./pages/CaptainProfile.jsx";
import CaptainEditProfile from "./pages/CaptainEditProfile.jsx";
import CaptainRideHistory from "./pages/CaptainRideHistory.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Start />,
      },
      {
        path: "/login",
        element: <UserLogin />,
      },
      {
        path: "/signup",
        element: <UserSignUp />,
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication={true}>
            <UserProfile />
          </AuthLayout>
        ),
      },
      {
        path: "/ride-history",
        element: (
          <AuthLayout authentication={true}>
            <RideHistory />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <AuthLayout authentication={true}>
            <EditProfile />
          </AuthLayout>
        ),
      },
      {
        path: "/captain-login",
        element: <CaptainSignIn />,
      },
      {
        path: "/captain-signup",
        element: <CaptainSignup />,
      },
      {
        path: "/captain-profile",
        element: (
          <CaptainLayout authentication={true}>
            <CaptainProfile />
          </CaptainLayout>
        ),
      },
      {
        path: "/captain-edit-profile",
        element: (
          <CaptainLayout authentication={true}>
            <CaptainEditProfile />
          </CaptainLayout>
        ),
      },
      {
        path: "/captain-ride-history",
        element: (
          <CaptainLayout authentication={true}>
            <CaptainRideHistory />
          </CaptainLayout>
        ),
      },
      {
        path: "/home",
        element: (
          <AuthLayout authentication={true}>
            <Home />
          </AuthLayout>
        ),
      },
      {
        path: "/riding",
        element: (
          <AuthLayout authentication={true}>
            <Riding />
          </AuthLayout>
        ),
      },
      {
        path: "/captain-home",
        element: (
          <CaptainLayout authentication={true}>
            <CaptainHome />
          </CaptainLayout>
        ),
      },
      {
        path: "/captain-riding",
        element: (
          <CaptainLayout authentication={true}>
            <CaptainRiding />
          </CaptainLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
