import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, isAllowed, redirectTo }) {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}
