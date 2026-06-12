import toast from "react-hot-toast";
import { explainIssue } from "../services/explainService";
import { useEffect, useState } from "react";
import { getHistory } from "../services/historyService";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";

export default function History() {
  const [reviews, setReviews] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] =
  useState(false);
  const [search, setSearch] = useState("");
const [sort, setSort] = useState("newest");
  const [selectedLanguage, setSelectedLanguage] =
  useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getHistory();
        setReviews(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReviews();
  }, []);

  const handleExplain = async (issue) => {
    try {
      setLoadingExplanation(true);
  
      const res = await explainIssue(issue);
  
      setExplanation(res.explanation);
  
      toast.success("Explanation generated");
    } catch (err) {
      toast.error("Failed to explain issue");
    } finally {
      setLoadingExplanation(false);
    }
  };

  const downloadPDF = (review) => {
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text("CodeSage Review Report", 20, 20);
  
    doc.setFontSize(12);
  
    doc.text(
      `Language: ${review.language}`,
      20,
      40
    );
  
    doc.text(
      `Score: ${review.score}/100`,
      20,
      50
    );
  
    doc.text(
      `Summary: ${review.summary}`,
      20,
      65,
      { maxWidth: 170 }
    );
  
    let y = 95;
  
    doc.text("Issues:", 20, y);
  
    review.issues?.forEach((issue) => {
      y += 10;
      doc.text(`• ${issue}`, 25, y, {
        maxWidth: 160,
      });
    });
  
    y += 15;
  
    doc.text("Suggestions:", 20, y);
  
    review.suggestions?.forEach((item) => {
      y += 10;
      doc.text(`• ${item}`, 25, y, {
        maxWidth: 160,
      });
    });
  
    doc.save(
      `CodeSage_Review_${review.language}.pdf`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-3xl font-bold mb-8">
        Review History
      </h1>

      <select
  value={selectedLanguage}
  onChange={(e) =>
    setSelectedLanguage(e.target.value)
  }
  className="bg-slate-900 border border-slate-700 p-3 rounded-lg mb-6"
>
  <option value="all">
    All Languages
  </option>

  <option value="java">Java</option>
  <option value="python">Python</option>
  <option value="cpp">C++</option>
  <option value="c">C</option>
  <option value="javascript">
    JavaScript
  </option>
</select>
<div className="flex gap-4 mb-6">

  <input
    type="text"
    placeholder="Search language..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="bg-slate-900 border border-slate-700 p-3 rounded-lg"
  />

  <select
    value={sort}
    onChange={(e) => setSort(e.target.value)}
    className="bg-slate-900 border border-slate-700 p-3 rounded-lg"
  >
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
    <option value="high">Highest Score</option>
    <option value="low">Lowest Score</option>
  </select>

</div>
      <div className="space-y-4">

      {reviews
  .filter(
    (review) =>
      selectedLanguage === "all" ||
      review.language === selectedLanguage
  )
  .filter((review) =>
    review.language
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .sort((a, b) => {
    if (sort === "newest")
      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );

    if (sort === "oldest")
      return (
        new Date(a.createdAt) -
        new Date(b.createdAt)
      );

    if (sort === "high")
      return b.score - a.score;

    if (sort === "low")
      return a.score - b.score;

    return 0;
  })
  .map((review) => (
          <div
            key={review._id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >

            <div className="flex justify-between items-center">

              <div>
                <h2 className="text-xl font-semibold">
                  {review.language.toUpperCase()}
                </h2>

                <p className="text-slate-500 text-sm">
                  {new Date(
                    review.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              <div className="text-green-400 font-bold text-lg">
                {review.score}/100
              </div>

            </div>

            <p className="mt-4 text-slate-300">
              {review.summary}
            </p>

            <div className="mt-4 flex gap-3">

  <button
    onClick={() =>
      setOpenId(
        openId === review._id
          ? null
          : review._id
      )
    }
    className="bg-blue-600 px-4 py-2 rounded-lg"
  >
    {openId === review._id
      ? "Hide Details"
      : "View Details"}
  </button>

  <button
    onClick={() => downloadPDF(review)}
    className="bg-green-600 px-4 py-2 rounded-lg"
  >
    Export PDF
  </button>

</div>

            {openId === review._id && (
              <div className="mt-6 space-y-6">

                <div>
                  <h3 className="text-red-400 font-semibold mb-2">
                    Issues
                  </h3>

                  <ul className="list-disc ml-6 text-red-300">
                  {review.issues?.map((item, i) => (
  <li
    key={i}
    className="flex justify-between items-center gap-4"
  >
  <span>{item}</span>

  <button
    onClick={() => handleExplain(item)}
    className="text-xs bg-yellow-600 px-2 py-1 rounded"
  >
    Explain
  </button>
</li>
                    ))}
                  </ul>
                </div>
                {loadingExplanation && (
  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
    <p className="text-yellow-400 animate-pulse">
      Generating explanation...
    </p>
  </div>
)}
                {explanation && (
  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
    <h3 className="text-yellow-400 font-semibold mb-2">
      AI Explanation
    </h3>
    <div className="text-slate-300 whitespace-pre-wrap">
  <ReactMarkdown>
    {explanation}
  </ReactMarkdown>
</div>
  </div>
)}
                <div>
                  <h3 className="text-blue-400 font-semibold mb-2">
                    Suggestions
                  </h3>

                  <ul className="list-disc ml-6 text-blue-300">
                    {review.suggestions?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-yellow-400 font-semibold mb-2">
                    Reviewed Code
                  </h3>

                  <div className="relative">

  <button
    onClick={() => {
      navigator.clipboard.writeText(review.code);
      toast.success("Code copied!");
    }}
    className="absolute top-2 right-2 text-xs bg-green-600 px-2 py-1 rounded"
  >
    Copy
  </button>

  <pre className="bg-slate-950 p-4 rounded-lg overflow-auto text-sm">
    {review.code}
  </pre>

</div>
                </div>

              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}