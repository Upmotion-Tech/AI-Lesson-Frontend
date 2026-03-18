import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import curriculumReducer from "./curriculumSlice.js";
import studentDataReducer from "./studentDataSlice.js";
import lessonReducer from "./lessonSlice.js";
import adminReducer from "./adminSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    curriculum: curriculumReducer,
    studentData: studentDataReducer,
    lessons: lessonReducer,
    admin: adminReducer,
  },
});

export default store;


