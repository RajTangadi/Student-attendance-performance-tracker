import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/performance";

export const saveStudentPerformance = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/save`, data);
    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Error saving student performance:", error);
    return { ok: false, data: error.response?.data || {} };
  }
};

export const getPerformanceByClass = async (classId, semester) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/class`, {
      params: { classId, semester },
    });
    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Error fetching performance:", error);
    return { ok: false, data: error.response?.data || {} };
  }
};
