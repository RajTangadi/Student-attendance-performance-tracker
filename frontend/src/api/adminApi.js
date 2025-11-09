import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||"http://localhost:5000/api/admin";

export const createTeacher = async (userData) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };
  const { data } = await axios.post(
    `${API_BASE_URL}/teachers`,
    userData,
    config
  );
  return data;
};

export const getAllTeacher = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/teachers`);
  return data;
};

// Delete Teacher by ID
export const deleteTeacherById = async (id) => {
  const { data } = await axios.delete(`${API_BASE_URL}/teachers/${id}`);
  return data;
};

// Update Teacher by ID
export const updateTeacherById = async (id, updateData) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };
  const { data } = await axios.put(
    `${API_BASE_URL}/teachers/${id}`,
    updateData,
    config
  );
  return data;
};

// -------------------------------------------------------
// Student APIs
// -------------------------------------------------------

export const createStudent = async (userData) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };
  const { data } = await axios.post(
    `${API_BASE_URL}/students`,
    userData,
    config
  );
  return data;
};

export const getAllStudents = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/students`);
  return data;
};

export const updateStudentById = async (id, updateData) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };
  const { data } = await axios.put(
    `${API_BASE_URL}/students/${id}`,
    updateData,
    config
  );
  return data;
};

export const deleteStudentById = async (id) => {
  const { data } = await axios.delete(`${API_BASE_URL}/students/${id}`);
  return data;
};


