import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analyticsService";
import { getHistory } from "../services/historyService";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
export default function Analytics() {
  const [data, setData] = useState(null);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await getAnalytics();
        setData(result);
        const reviews = await getHistory();

const chartData = reviews
  .reverse()
  .map((review, index) => ({
    review: index + 1,
    score: review.score,
  }));

setTrendData(chartData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAnalytics();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Analytics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-3xl font-bold mb-8">
        Analytics Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-slate-400">
            Total Reviews
          </h2>

          <p className="text-4xl font-bold mt-2">
            {data.totalReviews}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-slate-400">
            Average Score
          </h2>

          <p className="text-4xl font-bold mt-2 text-green-400">
            {data.averageScore}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-slate-400">
            Best Score
          </h2>

          <p className="text-4xl font-bold mt-2 text-blue-400">
            {data.bestScore}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-slate-400">
            Most Used Language
          </h2>

          <p className="text-4xl font-bold mt-2 text-yellow-400">
            {data.mostUsedLanguage}
          </p>
        </div>

      </div>
      

<div className="mt-10">
  <h2 className="text-2xl font-bold mb-6">
    Language Statistics
  </h2>

  <div className="grid md:grid-cols-2 gap-6">

    {data.languageStats?.map((lang) => (
      <div
        key={lang.language}
        className="bg-slate-900 p-6 rounded-xl border border-slate-800"
      >
        <h3 className="text-xl font-semibold text-yellow-400">
          {lang.language.toUpperCase()}
        </h3>

        <p className="mt-3 text-slate-300">
          Reviews: {lang.reviews}
        </p>

        <p className="text-slate-300">
          Average Score: {lang.averageScore}
        </p>
      </div>
    ))}

  </div>
</div>

<div className="mt-12">
  <h2 className="text-2xl font-bold mb-6">
    Score Progress
  </h2>

  <div className="bg-slate-900 p-6 rounded-xl">
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <LineChart data={trendData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="review" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="score"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
    </div>
  );
}