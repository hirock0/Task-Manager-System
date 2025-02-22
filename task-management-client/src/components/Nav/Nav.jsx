import { Link, NavLink } from "react-router-dom";
import { useUsers } from "../../utils/TanstackQuery/TanstackQuery";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/Firebase/Firebase";
import { MdMenu } from "react-icons/md";
import { useEffect, useState } from "react";
const Nav = () => {
  const { data: loggedUser, isLoading } = useUsers();
  const [sidenavFlag, setSideNavFlag] = useState(false);
  const [logutPopupFlag, setLogoutPopupFlag] = useState(false);

  const logout = async () => {
    localStorage.removeItem("token");
    if (loggedUser?.auth !== undefined) {
      await signOut(auth);
    }
    window.location.reload();
  };

  useEffect(() => {
    if (logutPopupFlag) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "auto";
    }
  }, [logutPopupFlag]);
  useEffect(() => {
    window.addEventListener("click", () => {
      setSideNavFlag(false);
    });
  }, []);

  return (
    <nav className=" bg-gradient-to-bl from-teal-400 to-teal-600 text-white">
      <div className=" container mx-auto px-5">
        <div className="  flex items-center justify-between h-20">
          <div className=" font-semibold">Task Management</div>
          <div
            onClick={(e) => e.stopPropagation()}
            className={` ${
              !sidenavFlag
                ? " max-md:translate-x-full"
                : " max-md:translate-x-0"
            } transition-all max-md:fixed max-md:right-0 max-md:top-20 max-md:flex-col max-md:items-start max-md:bg-slate-200 max-md:h-full max-md:w-1/2 max-sm:w-4/6 max-md:px-5 max-md:py-5 flex items-center gap-5 `}
          >
            <NavLink to={"/"} className={" max-md:w-full"}>
              <div className=" max-md:bg-white font-semibold max-md:w-full max-md:h-12 max-md:flex max-md:items-center max-md:pl-2 max-md:shadow-lg max-md:rounded-md max-md:hover:scale-105">
                Home
              </div>
            </NavLink>
          </div>

          <div className=" flex items-center gap-5">
            {loggedUser ? (
              <div
                onClick={() => setLogoutPopupFlag(true)}
                className=" w-10 h-10 rounded-full overflow-hidden"
              >
                {isLoading ? (
                  <div className=" loading loading-spinner loading-sm"></div>
                ) : (
                  <img src={loggedUser?.image} alt="user" />
                )}
              </div>
            ) : (
              <Link to={"/login"}>Login</Link>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation(), setSideNavFlag(!sidenavFlag);
              }}
              className=" md:hidden"
            >
              <MdMenu size={30} />
            </button>
          </div>
        </div>
      </div>
      {/* modal_popup */}
      <div
        className={`${
          !logutPopupFlag ? " hidden scale-0" : "block scale-100"
        } fixed z-50 top-0 left-0 right-0 bottom-0 bg-slate-800/90 transition-all flex items-center justify-center text-white`}
      >
        <div className=" rounded-md shadow-lg backdrop:filter backdrop-blur-3xl shadow-slate-600 hover:scale-110 h-52 w-72 flex items-center justify-center">
          <div className="">
            <h1>Do you want to logout or not?</h1>
            <div className=" mt-5 flex items-center justify-center gap-5">
              <button
                onClick={() => setLogoutPopupFlag(false)}
                className=" btn bg-red-600 border-0 text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => logout()}
                className=" btn text-white btn-success "
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
