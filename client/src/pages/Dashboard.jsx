import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import { reviewCode } from "../services/reviewService";

export default function Dashboard() {
  const navigate = useNavigate();

  const codeTemplates = {
    java: `public class Main {
      public static void main(String[] args) {
  
      }
  }`,
  
    python: `def main():
      print("Hello World")
  
  if __name__ == "__main__":
      main()`,
  
    javascript: `function main() {
    console.log("Hello World");
  }
  
  main();`,
  
    c: `#include <stdio.h>
  
  int main() {
      printf("Hello World");
      return 0;
  }`,
  
    cpp: `#include <iostream>
  using namespace std;
  
  int main() {
      cout << "Hello World";
      return 0;
  }`,
  
    csharp: `using System;
  
  class Program {
      static void Main() {
          Console.WriteLine("Hello World");
      }
  }`,
  
    go: `package main
  
  import "fmt"
  
  func main() {
      fmt.Println("Hello World")
  }`,
  
    rust: `fn main() {
      println!("Hello World");
  }`,
  
    php: `<?php
  echo "Hello World";
  ?>`
  };

  const [language, setLanguage] = useState("java");

  const [code, setCode] = useState(
    codeTemplates.java
  );

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  
  useEffect(() => {
    if (review?.score !== undefined && review?.score !== null) {
      let start = 0;
      const end = review.score;

      const interval = setInterval(() => {
        start += 1;
        setDisplayScore(start);

        if (start >= end) clearInterval(interval);
      }, 15);

      return () => clearInterval(interval);
    }
  }, [review]);

  const handleReview = async () => {
    try {
      setLoading(true);

      const result = await reviewCode({
        language,
        code,
      });

      console.log("RESULT:", result);

      setReview(result);
      setDisplayScore(0); 

    } catch (error) {
      console.log("Review error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <nav className="border-b border-slate-800 px-8 py-4 flex justify-between">
        <h1 className="text-2xl font-bold">CodeSage</h1>

        <div className="flex gap-3">

  <button
    onClick={() => navigate("/history")}
    className="bg-slate-700 px-4 py-2 rounded-lg"
  >
    History
  </button>

  <button
    onClick={() => navigate("/analytics")}
    className="bg-purple-700 px-4 py-2 rounded-lg"
  >
    Analytics
  </button>

  <button
    onClick={handleLogout}
    className="bg-red-600 px-4 py-2 rounded-lg"
  >
    Logout
  </button>

</div>
      </nav>

      <div className="p-8">

        
        <select
          value={language}
          onChange={(e) => {
            const selectedLanguage = e.target.value;
          
            setLanguage(selectedLanguage);
            setCode(codeTemplates[selectedLanguage]);
          }}
          className="bg-slate-800 p-3 rounded-lg mb-4"
        >
          <option value="java">Java</option>
<option value="python">Python</option>
<option value="javascript">JavaScript</option>
<option value="c">C</option>
<option value="cpp">C++</option>

<option value="csharp">C#</option>
<option value="go">Go</option>
<option value="rust">Rust</option>
<option value="php">PHP</option></select>

        
        <CodeEditor
          language={language}
          code={code}
          setCode={setCode}
        />

        
        <button
          onClick={handleReview}
          disabled={loading}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>

        
        {review?.summary && (
          <div className="mt-8 bg-slate-900 p-6 rounded-xl space-y-4 border border-slate-800">

            <h2 className="text-2xl font-bold">
              AI Code Review
            </h2>

            <p className="text-slate-300">
              {review.summary}
            </p>

           
            <div className="bg-green-900 p-3 rounded-lg">
              <h3 className="font-semibold">
                Score: {displayScore}/100
              </h3>
            </div>

            {/* ISSUES */}
            <div>
              <h3 className="text-red-400 font-semibold mb-2">
                Issues:
              </h3>

              {review?.issues?.length ? (
                <ul className="list-disc ml-6 text-red-300">
                  {review.issues.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400">No issues found</p>
              )}
            </div>

            
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">
                Suggestions:
              </h3>

              {review?.suggestions?.length ? (
                <ul className="list-disc ml-6 text-blue-300">
                  {review.suggestions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400">No suggestions found</p>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}