import React, { use, useState } from "react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import { map, uberCarIcon, logo, driverPersonImg } from "../assets/index";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { sendMessage, receiveMessage } from "../store/socketSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  logout as storeCaptainLogout,
  setEarnings,
} from "../store/captainAuthSlice.js";
import { captainService } from "../service/captainService.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CaptainLiveTracking from "../components/CaptainLiveTracking.jsx";
const CaptainHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);
  const [ride, setRide] = useState(null);
  const captain = useSelector((state) => state.captain.captainData);
  const { isConnected } = useSelector((state) => state.socket);
  const [TodayEarning, setTodayEarning] = useState(null);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  useEffect(() => {
    if (!captain?._id) return;

    if (isConnected) {
      console.log("✅ Joining socket room for captain:", captain._id);
      dispatch(
        sendMessage("join", { userType: "captain", userId: captain._id })
      );
    } else {
      console.log("⏳ Waiting for socket connection or captain data...");
    }
    // ✅ Listen for incoming rides
    //   console.log("✅ Socket ready. Listening for new rides...");
    //   dispatch(
    //     receiveMessage("new-ride", (payload) => {
    //       console.log("🚗 New ride received from server:", payload);
    //       // You can trigger a popup, sound, or state update here
    //     })
    //   );
    if (!navigator.geolocation) {
      console.error("❌ Geolocation not supported");
      return;
    }

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("📍 Location retrieved:", position.coords);

        const data = {
          userId: captain._id,
          location: {
            type: "Point",
            coordinates: [position.coords.longitude, position.coords.latitude],
          },
        };
        console.log("📤 Sending location update:", data);
        dispatch(sendMessage("update-location-captain", data));
      });
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    return () => clearInterval(locationInterval); // ✅ cleanup to prevent memory leaks
  }, [isConnected, captain, dispatch]);

  // 👇 separate effect, not mixed with location/join logic
  useEffect(() => {
    if (!isConnected) return;
    console.log("✅ Socket ready. Listening for new rides...");

    dispatch(
      receiveMessage("new-ride", (data) => {
        console.log("🚗 New ride received from server:", data);
        setRide(data);
        setRidePopUpPanel(true);
        // alert("🚕 New ride received!"); // test visual cue
        console.log(`"🚕 New ride received!"`);
      })
    );
  }, [isConnected, dispatch]);

  useEffect(() => {
    console.log(
      "⚡ useEffect triggered | captain:",
      captain?._id,
      "connected:",
      isConnected
    );

    if (!captain?._id) return console.log("⛔ captain._id missing");
    if (!isConnected) return console.log("⛔ socket not connected");

    async function loadEarnings() {
      console.log("📡 Calling earnings API...");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captains/earnings`,
          { withCredentials: true }
        );
        console.log("res", res.data.data);
        console.log("Today earning:", res.data.data.todayEarning);
        setTodayEarning(res.data.data.todayEarning);
        dispatch(
          setEarnings({
            today: res.data.data.todayEarning,
            weekly: res.data.data.weeklyEarning,
            monthly: res.data.data.monthlyEarning,
            total: res.data.data.totalEarning,
          })
        );
        console.log(TodayEarning);
      } catch (err) {
        console.log("Earning fetch error", err);
      }
    }

    loadEarnings();
  }, [isConnected, captain?._id]);

  // const captainData = useSelector((state) => state.captain.captainData);

  // console.log("Captain Data from Redux:", captainData);

  useGSAP(() => {
    if (ridePopUpPanel) {
      gsap.to(ridePopUpPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(ridePopUpPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [ridePopUpPanel]);

  useGSAP(() => {
    if (confirmRidePopUpPanel) {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmRidePopUpPanel]);

  async function logout() {
    try {
      const res = await captainService.logOut();
      console.log(res);
      if (res.status === 200) {
        dispatch(storeCaptainLogout());
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function confirmRide() {
    try {
      console.log("this is a confirm func is being called");
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);
    } catch (error) {
      console.log("the error in confirm ride func");
      console.log(error);
    }
  }

  useEffect(() => {
    // whenever socket connects or disconnects
    setShowConnectionStatus(true);

    const timer = setTimeout(() => {
      setShowConnectionStatus(false);
    }, 5000); // 7 seconds (you can set 5000–10000)

    return () => clearTimeout(timer);
  }, [isConnected]);

  return (
    <div className="w-full h-screen">
      {showConnectionStatus && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 shadow-md
      ${
        isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-green-600" : "bg-red-600"
              }`}
            />
            {isConnected ? "You are online" : "You are offline"}
          </div>
        </div>
      )}
      <div className="fixed flex items-center justify-between top-5 px-5 w-full z-[999]">
        <div className="w-20 left-7">
          <img className="" src={logo} alt="" />
        </div>
        {/* Profile Button */}
        <div
          onClick={() => navigate("/captain-profile")}
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md active:scale-90 transition"
        >
          <i className="ri-user-3-fill text-2xl"></i>
        </div>
      </div>

      {/* here make h-3/5 for section2 and for section1 h-1/2  */}
      <div className="w-full h-3/5 relative z-0">
        <CaptainLiveTracking
          pickupCoords={ride?.pickupCoords || null}
          destinationCoords={ride?.destinationCoords || null}
          onLocationUpdate={(coords) => {
            console.log("Captain Location:", coords);

            dispatch(
              sendMessage("update-location-captain", {
                userId: captain._id,
                location: {
                  type: "Point",
                  coordinates: [coords.lng, coords.lat],
                },
              })
            );
          }}
        />
      </div>

      {/* here make h-2/5 for section2 and for section1 h-1/2  */}
      <div className="w-full h-2/5 p-4">
        <CaptainDetails todayEarnings={TodayEarning} />
      </div>
      <div
        ref={ridePopUpPanelRef}
        className="w-full py-5 px-2 fixed bottom-0 translate-y-full z-10 bg-white"
      >
        <h1
          onClick={(e) => {
            setRidePopUpPanel(false);
          }}
          className="h-fit text-4xl text-center"
        >
          <i className="ri-arrow-down-s-line"></i>
        </h1>
        <RidePopUp
          ride={ride}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          confirmRide={confirmRide}
        />
      </div>

      <div
        ref={confirmRidePopUpPanelRef}
        className="w-full h-screen py-5 px-2 fixed bottom-0 translate-y-full z-10 bg-white"
      >
        <h1
          // onClick={(e) => {
          //     setConfirmRidePopUpPanel(false)
          // }}
          className="h-fit text-4xl text-center"
        >
          <i className="ri-arrow-down-s-line"></i>
        </h1>
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          setRidePopUpPanel={setRidePopUpPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
