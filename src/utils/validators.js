import * as yup from "yup";

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// File type validation
export const validateFileType = (file, allowedTypes) => {
  if (!file) return false;
  const extension = file.name.split(".").pop().toLowerCase();
  return allowedTypes.includes(`.${extension}`);
};

// File size validation
export const validateFileSize = (file, maxSizeMB = 10) => {
  if (!file) return false;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Yup schemas
export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const signupSchema = yup.object({
  name: yup.string().required("Name is required").trim(),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
  termsAccepted: yup
    .boolean()
    .oneOf([true], "You must agree to the Terms and Conditions"),
  role: yup.string().oneOf(["teacher", "admin"]).default("teacher"),
});

export const curriculumFileSchema = yup.object({
  file: yup
    .mixed()
    .required("Please select a file")
    .test("fileType", "File must be .pdf, .docx, or .txt", (value) => {
      if (!value) return false;
      const ext = `.${value.name.split(".").pop().toLowerCase()}`;
      return [".pdf", ".docx", ".txt"].includes(ext);
    }),
});

export const studentFileSchema = yup.object({
  file: yup
    .mixed()
    .required("Please select a file")
    .test("fileType", "File must be .csv or .pdf", (value) => {
      if (!value) return false;
      const ext = `.${value.name.split(".").pop().toLowerCase()}`;
      return [".csv", ".pdf"].includes(ext);
    }),
});
