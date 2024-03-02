import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Loading from "../Components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const AdminRoutes = ({children}) => {
    const location = useLocation();
    const { user, loading, logOut } = useContext(AuthContext);
    const [axiosSecure] = useAxiosSecure();
    const {data:isAdmin, isLoading} = useQuery({
        queryKey: [user?.email, 'admin'],
        queryFn: async()=>{
            const res = await axiosSecure.get(`/user/${user?.email}`);
            return res?.data?.role === 'admin';
        }
    });
    if (loading || isLoading) {
      return <Loading></Loading>;
    }
    if (user && isAdmin) {
      return children;
    }
    logOut();
    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default AdminRoutes;