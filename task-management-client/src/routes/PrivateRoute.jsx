import { Navigate } from "react-router-dom";
import Loading from "../pages/Loading/Loading";
import { useUsers } from "../utils/TanstackQuery/TanstackQuery";
import { useLocation } from "react-router-dom";
const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { data: loggedUser, isLoading } = useUsers();
  if (isLoading) {
    return <Loading />;
  }
  if (loggedUser === null) {
    return <Navigate state={location.pathname} to={"/login"} />;
  }
  return children;
};

export default PrivateRoute;
