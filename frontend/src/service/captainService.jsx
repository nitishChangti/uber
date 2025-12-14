import axios from "axios";

class CaptainService {
  baseUrl = import.meta.env.VITE_BASE_URL; // change this to your backend url

  async login(email, password) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/captains/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      error = error.response.data;
      console.log(error);
      return error;
    }
  }

  async logOut() {
    try {
      const response = await axios.get(`${this.baseUrl}/captains/logout`, {
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async register(fullName, email, phone, password, vehicle) {
    console.log(fullName, email, phone, password, vehicle);
    try {
      const response = await axios.post(
        `${this.baseUrl}/captains/register`,
        {
          fullName,
          email,
          phone,
          password,
          vehicle,
        },
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      console.error(error);
      // console.log(error.response.data.message);
      // error = error.response.data;
      return error;
    }
  }

  async getCurrentCap() {
    console.log("this is get current cap");
    try {
      const response = await axios.get(
        `${this.baseUrl}/captains/getCurrentUser`,
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return error;
    }
  }

  async confirmRide(rideId) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/captains/confirmRide`,
        {
          rideId,
        },
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      console.error("Error confirming ride:", error);
      return error;
    }
  }
}

const captainService = new CaptainService();

export { captainService };
