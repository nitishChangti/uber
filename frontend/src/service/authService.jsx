import axios from "axios";

class AuthService {
  baseUrl = import.meta.env.VITE_BASE_URL; // change this to your backend url

  async login(email, password) {
    console.log(email, password);
    try {
      const response = await axios.post(
        `${this.baseUrl}/users/login`,
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

  async register(username, email, password, phone) {
    console.log(username, email);
    try {
      const response = await axios.post(
        `${this.baseUrl}/users/register`,
        {
          username,
          email,
          password,
          phone,
        },
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      // console.error(error);
      // console.log(error.response.data.message);
      error = error.response.data;
      return error;
    }
  }

  async getCurrentUser() {
    console.log("this is get current user");
    try {
      const response = await axios.get(`${this.baseUrl}/users/getCurrentUser`, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      return response;
    } catch (error) {
      // console.error("Error fetching current user:", error);
      console.warn("Error fetching current user:", error);
      return error;
    }
  }

  async logOut() {
    console.log("this is logout authservice");
    try {
      const response = await axios.get(`${this.baseUrl}/users/logout`, {
        withCredentials: true,
      });
      return response;
    } catch (error) {
      error = error.response.data;
      console.log(error);
      return error;
    }
  }
}

const authService = new AuthService();

export { authService };
