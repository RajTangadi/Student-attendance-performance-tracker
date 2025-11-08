import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/teacher";

//TeacherDashBoard
export const getStudentsByClassAndYear = async (className, selectedYear) => {
  try {
    const data = await axios.get(`${API_BASE_URL}/students`, {
      params: { class: className, year: selectedYear },
    });
    return data;
  } catch (error) {
    console.log("Error featching students by class and Year", error);
  }
};

//TeacherDashBoard
export const markAttendanceForClass = async ({ classId, date, records }) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(
      "http://localhost:5000/api/attendance",
      { classId, date, records },
      config
    );

    return { success: true, data };
  } catch (error) {
    // Capture 409 (already submitted)
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message || "Error submitting attendance.",
      };
    }

    // Fallback for network or unknown errors
    return {
      success: false,
      status: 500,
      message: "Network error or server not reachable.",
    };
  }
};

//StudentDashBoard
export const getAttendanceByStudent = async (studentId) => {
try {
    const response = await axios.get(`http://localhost:5000/api/attendance/${studentId}`);
    return response;
} catch (error) {
  console.log('Error fetching attendance:', error);
}
}

//StudentDashBoard
export const fetchPerformanceByStudent = async (studentId,semester) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/performance/student/${studentId}`,{
      params: { semester }
    })
    console.log(response);
    return response;
  } catch (error) {
    console.log("Error fetching performance student", error);
  }
}