import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const {
    user: { user },
  } = useContext(AuthContext);
  // console.log("user role: ", user?.role);
  // console.log(children);
  console.log(user.role);

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
