import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home/Home";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import SearchBus from "../Pages/SearchBus/SearchBus/SearchBus";
import NotFound from "../Pages/Shared/NotFound/NotFound";
import SearchResult from "../Pages/SearchBus/SearchResult/SearchResult";
import Booking from "../Pages/SearchBus/Booking";
import Dashboard from "../Layout/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Payment from "../Pages/Dashboard/Payment/Payment";
import TravelHistory from "../Pages/Dashboard/TravelHistory/TravelHistory";
import Contact from "../Pages/Shared/Contact/Contact";
import UserProfile from "../Pages/Dashboard/UserProfile/UserProfile";
import UpdatePassword from "../Pages/Dashboard/UpdatePassword/UpdatePassword";
import VerifyTicket from "../Pages/Dashboard/VerifyTicket/VerifyTicket";
import AdminProfile from "../Pages/Dashboard/Admin/AdminProfile/AdminProfile";
import Customers from "../Pages/Dashboard/Admin/Customers/Customers";
import ManageBus from "../Pages/Dashboard/Admin/ManageBus/ManageBus";
import AddNewBus from "../Pages/Dashboard/Admin/AddNewBus/AddNewBus";
import AccountHistory from "../Pages/Dashboard/Admin/AccountHistory/AccountHistory";
import AdminRoutes from "./AdminRoutes";
import { element } from "prop-types";
import AddOperator from "../Pages/Dashboard/AddOperator/AddOperator";
import SuperAdminRoute from "./SuperAdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children:[
        {
            path: '/',
            element: <Home></Home>
        },
        {
            path: 'login',
            element: <Login></Login>
        },
        {
            path: 'signup',
            element: <SignUp></SignUp>
        },
        {
            path: 'search-bus',
            element: <SearchBus></SearchBus>
        },
        {
            path: 'booking/search?',
            element: <SearchResult></SearchResult>
        },
        {
            path: 'booking/:busId',
            element: <Booking></Booking>
        },
        {
            path: '*',
            element: <NotFound></NotFound>
        }
    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRoute> <Dashboard></Dashboard></PrivateRoute>,
    children:[
        {
            path:'profile',
            element: <UserProfile></UserProfile>
        },
        {
            path:'history',
            element: <TravelHistory></TravelHistory>
        },
        {
            path:'verify-ticket',
            element: <VerifyTicket></VerifyTicket>
        },
        {
            path:'updatePassword',
            element: <UpdatePassword/>
        },
        {
            path:'payment',
            element: <Payment></Payment>
        },
        {
            path:'contact',
            element: <Contact></Contact>
        },/* COMMENT: admin routes */
        {
            path:'profile',
            element: <AdminProfile/>
        },
        {
            path: 'customers',
            element: <AdminRoutes><Customers/></AdminRoutes>
        },
        {
            path: 'buses',
            element: <AdminRoutes><ManageBus/></AdminRoutes>
        },
        {
            path: 'newBus',
            element: <AdminRoutes><AddNewBus/></AdminRoutes>
        },
        {
            path: 'accountHistory',
            element: <AdminRoutes><AccountHistory/></AdminRoutes>
        },
        {
            path: 'newOperator',
            element: <SuperAdminRoute><AddOperator/></SuperAdminRoute>
        }
    ]
  }
]);
