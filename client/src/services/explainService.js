import axios from "axios";

export const explainIssue = async (issue) => {
  const res = await axios.post(
    "https://codesage-backend-c7ue.onrender.com/api/review/explain",
    { issue },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return res.data;
};