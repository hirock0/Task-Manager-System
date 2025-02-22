import { Navigate } from "react-router-dom";
import Loading from "../pages/Loading/Loading";
import { useUsers } from "../utils/TanstackQuery/TanstackQuery";
import { useLocation } from "react-router-dom";
const PublicRoute = ({ children }) => {
  const location = useLocation();
  const { data: loggedUser, isLoading } = useUsers();
console.log(loggedUser)
  if (isLoading) {
    return <Loading />;
  }
  if (loggedUser === null) {
    return children;
  }
  return <Navigate to={location.state === null ? "/" : location.state} />;
};

export default PublicRoute;
