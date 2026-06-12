import axios from "axios";

export const explainIssue = async (issue) => {
  const res = await axios.post(
    "http://localhost:5000/api/review/explain",
    { issue },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return res.data;
};