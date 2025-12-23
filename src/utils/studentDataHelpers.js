/**
 * Detect if student data is from i-Ready or Star Math Enterprise
 */
export const detectStudentDataType = (studentData) => {
  if (!studentData || !studentData.students || studentData.students.length === 0) {
    return null;
  }

  // Check first student for data type indicators
  const firstStudent = studentData.students[0];

  // i-Ready indicators
  if (
    firstStudent.overallPlacement ||
    firstStudent.grouping !== null ||
    firstStudent.domainScores ||
    firstStudent.subject ||
    firstStudent.diagnostic ||
    firstStudent.performanceLevel
  ) {
    return "iReady";
  }

  // Star Math indicators
  if (
    firstStudent.benchmarkCategory ||
    (firstStudent.scaledScore && firstStudent.percentileRank) ||
    firstStudent.suggestedSkills?.length > 0
  ) {
    return "starMath";
  }

  // Default to generic if can't determine
  return "generic";
};

/**
 * Get overall placement color variant for i-Ready based on placement and scale score
 * Rules:
 * - Grade K or scale score below 400 → Red
 * - Grade 1 or scale score 400-499 → Yellow
 * - Late 2 or scale score 500+ → Green
 */
export const getOverallPlacementVariant = (overallPlacement, scaleScore) => {
  if (!overallPlacement) {
    // If no placement but we have scale score, use scale score
    if (scaleScore != null) {
      if (scaleScore < 400) return "danger";
      if (scaleScore < 500) return "warning";
      return "success";
    }
    return "default";
  }

  const placement = overallPlacement.toString().trim().toLowerCase();

  // Check for Grade K → Red
  if (placement === "grade k" || placement === "k") {
    return "danger";
  }

  // Check for Grade 1 → Yellow (unless scale score indicates otherwise)
  if (placement === "grade 1" || placement === "1") {
    // If scale score is provided, use it for more accurate coloring
    if (scaleScore != null) {
      if (scaleScore >= 500) return "success";
      if (scaleScore >= 400) return "warning";
      return "danger";
    }
    return "warning";
  }

  // Check for Late 2 or higher → Green
  if (placement.includes("late 2") || placement === "late 2") {
    return "success";
  }

  // Check for Early 2, Mid 2, Grade 2+ → Green
  if (
    placement.includes("early 2") ||
    placement.includes("mid 2") ||
    placement.includes("late 2") ||
    placement.match(/grade\s+[2-9]/) ||
    placement.includes("surpassed")
  ) {
    return "success";
  }

  // If scale score is available, use it as primary indicator
  if (scaleScore != null) {
    if (scaleScore < 400) return "danger";
    if (scaleScore < 500) return "warning";
    return "success";
  }

  // Fallback: check for grade numbers
  const gradeMatch = placement.match(/grade\s+([0-9]+)/i);
  if (gradeMatch) {
    const gradeNum = parseInt(gradeMatch[1]);
    if (gradeNum === 0 || gradeNum === null) return "danger"; // Grade K
    if (gradeNum === 1) return "warning";
    if (gradeNum >= 2) return "success";
  }

  return "default";
};

/**
 * Get performance level color variant for i-Ready
 */
export const getPerformanceLevelVariant = (performanceLevel) => {
  if (!performanceLevel) return "default";

  const level = performanceLevel.toLowerCase();
  
  if (level.includes("mid or above") || level.includes("surpassed")) {
    return "success"; // Green
  }
  if (level.includes("early on grade")) {
    return "success"; // Green
  }
  if (level.includes("one grade level below")) {
    return "warning"; // Yellow
  }
  if (level.includes("two grade levels below")) {
    return "warning"; // Yellow/Orange
  }
  if (level.includes("three or more")) {
    return "danger"; // Red
  }

  return "default";
};

/**
 * Get benchmark category variant for Star Math
 */
export const getBenchmarkVariant = (benchmarkCategory) => {
  if (!benchmarkCategory) return "default";

  const category = benchmarkCategory.toLowerCase();
  
  if (category.includes("at/above benchmark") || category.includes("above benchmark")) {
    return "success";
  }
  if (category.includes("on watch")) {
    return "warning";
  }
  if (category.includes("intervention") && !category.includes("urgent")) {
    return "warning";
  }
  if (category.includes("urgent intervention")) {
    return "danger";
  }

  return "default";
};

/**
 * Format domain score for display
 */
export const formatDomainScore = (domainScore) => {
  if (!domainScore) return "-";
  return domainScore;
};

/**
 * Get domain score color based on placement
 * Color coding for i-Ready:
 * - Grade K → Red (danger)
 * - Grade 1 → Yellow (warning)
 * - Early 2 → Green (success)
 * - Mid 2, Late 2, Surpassed Level, Grade 2+ → Green (success)
 */
export const getDomainScoreVariant = (domainScore, currentGrade) => {
  if (!domainScore) return "default";

  const score = domainScore.toString().trim();
  const scoreLower = score.toLowerCase();
  
  // Exact matches first for precision
  
  // Grade K → Red
  if (scoreLower === "grade k" || score === "Grade K" || scoreLower === "k") {
    return "danger";
  }

  // Grade 1 → Yellow
  if (scoreLower === "grade 1" || score === "Grade 1") {
    return "warning";
  }

  // Early 2 → Green
  if (scoreLower === "early 2" || score === "Early 2") {
    return "success";
  }

  // Surpassed Level → Green
  if (scoreLower.includes("surpassed")) {
    return "success";
  }

  // Mid 2 → Green
  if (scoreLower === "mid 2" || score === "Mid 2") {
    return "success";
  }

  // Late 2 → Green
  if (scoreLower === "late 2" || score === "Late 2") {
    return "success";
  }

  // Grade 2 or higher → Green
  const gradeMatch = scoreLower.match(/grade\s+([0-9]+)/i);
  if (gradeMatch) {
    const gradeNum = parseInt(gradeMatch[1]);
    if (gradeNum >= 2) return "success";
    if (gradeNum === 1) return "warning";
  }

  // Check for "Early" with number
  const earlyMatch = scoreLower.match(/early\s+(\d+)/);
  if (earlyMatch) {
    const earlyGrade = parseInt(earlyMatch[1]);
    if (earlyGrade >= 2) return "success";
    if (earlyGrade === 1) return "warning";
    return "danger";
  }

  // Check for "Late" with number
  const lateMatch = scoreLower.match(/late\s+(\d+)/);
  if (lateMatch) {
    const lateGrade = parseInt(lateMatch[1]);
    if (lateGrade >= 2) return "success";
    if (lateGrade === 1) return "warning";
    return "danger";
  }

  // Check for "Mid" with number
  if (scoreLower.includes("mid")) {
    return "success";
  }

  // Fallback: if it contains "grade k" → Red
  if (scoreLower.includes("grade k")) {
    return "danger";
  }

  // Fallback: if it contains "grade 1" → Yellow
  if (scoreLower.includes("grade 1")) {
    return "warning";
  }

  // Default to success for higher grades
  return "success";
};

