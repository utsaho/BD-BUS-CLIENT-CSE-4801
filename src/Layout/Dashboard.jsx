import {
    faAdd,
    faBus,
  faCircleCheck,
  faFileInvoiceDollar,
  faHistory,
  faHome,
  faLock,
  faPhone,
  faSearch,
  faSignOut,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toaster } from "react-hot-toast";
import { Outlet, NavLink } from "react-router-dom";
import backgroundImage from "../assets/Images/Backgrounds/leaf-bg.jpg";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import Loading from "../Components/Loading/Loading";
import useUserInfo from "../hooks/useUserInfo";
import PageTitle from "../Components/PageTitle/PageTitle";

const Dashboard = () => {
  const { logOut} = useContext(AuthContext);
//   const [dashboardUser, setDashboardUser] = useState({});
  const [loading, useUserInfoLoading, dashboardUser] = useUserInfo();
  if (loading || useUserInfoLoading || !dashboardUser) {
    // console.log(loading , useUserInfoLoading , !dashboardUser);
    return <Loading></Loading>;
  }

//   console.log(dashboardUser);
  
    
  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }}>
        <PageTitle title={'Dashboard'}/>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      {/* <div className="bg-base-100 w-full h-full fixed bg-opacity-50"></div> */}

      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <Outlet></Outlet>
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          ></label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-yellow-900 text-white">
            

            {/* NOTE: for admin only */}
            {dashboardUser?.role ==='admin' && <li>
              <NavLink to="profile">
                <FontAwesomeIcon icon={faUser} />
                Profile
              </NavLink>
            </li>}

            {/* NOTE: for admin only */}
            {dashboardUser?.role ==='admin' && <li>
              <NavLink to="customers">
                <FontAwesomeIcon icon={faUsers} />
                Customers
              </NavLink>
            </li>}

            {/* NOTE: for admin only */}
            {dashboardUser?.role ==='admin' && <li>
              <NavLink to="buses">
                <FontAwesomeIcon icon={faBus} />
                Manage Bus
              </NavLink>
            </li>}

            {/* NOTE: for admin only */}
            {dashboardUser?.role ==='admin' && <li>
              <NavLink to="newBus">
                <FontAwesomeIcon icon={faAdd} />
                Add new bus
              </NavLink>
            </li>}

            {/* NOTE: for admin only */}
            {dashboardUser?.role ==='admin' && <li>
              <NavLink to="accountHistory">
                <FontAwesomeIcon icon={faFileInvoiceDollar} />
                Account History
              </NavLink>
            </li>}

            {/* NOTE: for SUPER_ADMIN only */}
            {dashboardUser?.role ==='superAdmin' && <li>
              <NavLink to="newOperator">
                <FontAwesomeIcon icon={faAdd} />
                Add new operator
              </NavLink>
            </li>}



            {/* NOTE: for user only */}
            {dashboardUser?.role ==='user' && <li>
              <NavLink to="Profile">
                <FontAwesomeIcon icon={faUser} />
                Profile
              </NavLink>
            </li>}

            {/* NOTE: for user only */}
            {dashboardUser?.role ==='user' && <li>
            <NavLink to="history">
                <FontAwesomeIcon icon={faHistory} />
                Travel History
              </NavLink>
            </li>}

            {/* NOTE: for user only */}
            {dashboardUser?.role ==='user' && <li>
            <NavLink to="verify-ticket">
                <FontAwesomeIcon icon={faCircleCheck} />
                Verify Ticket
              </NavLink>
            </li>}
            
            <li>
              <NavLink to="updatePassword">
                <FontAwesomeIcon icon={faLock} />
                Update Password
              </NavLink>
            </li>
            <div className="divider divider-neutral"></div>
            <li>
              <NavLink to="/">
                <FontAwesomeIcon icon={faHome} />
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/search-bus">
                <FontAwesomeIcon icon={faSearch} />
                Search bus
              </NavLink>
            </li>
            <li>
              <NavLink to="contact">
                <FontAwesomeIcon icon={faPhone} />
                Contact
              </NavLink>
            </li>
            <li>
                <button onClick={logOut}><FontAwesomeIcon icon={faSignOut}/> Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
