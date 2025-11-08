import axios from "axios";

export const registerUser = async (userData) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };
  const { data } = await axios.post(
    "http://localhost:5000/api/auth/register",
    userData,
    config
  );
  return data;
};


export const loginUser = async (email, password) => {

  // const config = {
  //   headers: { "Content-Type": "application/json" },
  // };

   const { data } = await axios.post(
          "http://localhost:5000/api/auth/login",
          { email, password }
       );
       console.log(data);
       
  return data;
}
