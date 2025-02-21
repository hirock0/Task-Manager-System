import { Outlet } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";

const MainLayout = () => {
  return (
    <>
      <div className=" sticky top-0 z-50">
        <Nav />
      </div>
      <Outlet />
      <div className="">
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
