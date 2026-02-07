import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function Protected({ children, authentication = true }) {
  const authStatus = useSelector((state) => state.auth.status);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (authentication && !authStatus) {
    return <Navigate to="/login" replace />;
  }

  if (!authentication && authStatus) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export { Protected };
