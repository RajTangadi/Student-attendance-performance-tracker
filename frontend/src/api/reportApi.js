import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/reports";

export const generateClassReport = async (classId, semester,year) => {
    console.log(classId, semester);
  try {
    const response = await axios.get(`${API_BASE_URL}/class`, {
      params: { classId, semester, year },
      responseType: "blob", // to receive PDF
    });
    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Error generating class report:", error);
    return { ok: false, data: error.response?.data || {} };
  }
};

export const generateStudentReport = async (studentId, semester) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student`, {
      params: { studentId, semester },
      responseType: "blob",
    });
    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Error generating student report:", error);
    return { ok: false, data: error.response?.data || {} };
  }
};
