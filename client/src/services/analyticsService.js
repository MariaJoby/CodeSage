import axios from "axios";

const API_URL =
  "https://codesage-backend-c7ue.onrender.com/api/review/analytics";

export const getAnalytics = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    API_URL,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};