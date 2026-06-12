function analyzeCode(code = "") {
    let score = 100;
  
    let issues = [];
    let suggestions = [];
  
    const lowerCode = code.toLowerCase();
  
    
    const hasForLoop = lowerCode.includes("for(") || lowerCode.includes("for (");
    const hasWhileLoop = lowerCode.includes("while(") || lowerCode.includes("while (");
  
    if (hasForLoop || hasWhileLoop) {
      issues.push("Loop detected in code");
  
      if (code.split("for").length > 2) {
        score -= 20;
        suggestions.push("Nested loops detected → consider optimization");
      }
    }
  
    
    const functionNameMatch = code.match(/function\s+(\w+)/);
    if (functionNameMatch) {
      const funcName = functionNameMatch[1];
      if (lowerCode.includes(funcName)) {
        issues.push("Possible recursion detected");
        score -= 10;
      }
    }
  

    if (/[a-z]\d/.test(lowerCode)) {
      issues.push("Poor variable naming detected");
      score -= 10;
      suggestions.push("Use meaningful variable names");
    }
  
   
    const openBrackets = (code.match(/{/g) || []).length;
    const closeBrackets = (code.match(/}/g) || []).length;
  
    if (openBrackets !== closeBrackets) {
      issues.push("Possible syntax imbalance");
      score -= 30;
    }
  
    
    let time = "O(1)";
  
    if (code.includes("for") && code.includes("for")) {
      time = "O(n²)";
    } else if (hasForLoop || hasWhileLoop) {
      time = "O(n)";
    }
  
    return {
      score: Math.max(score, 0),
      issues,
      suggestions,
      complexity: {
        time,
        space: "O(1)"
      }
    };
  }
  
  module.exports = analyzeCode;