import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

const useUserInfo = () => {
  const { user, loading } = useContext(AuthContext);
  const [dashboardUser, setDashboardUser] = useState({});
  const [useUserInfoLoading, setUseUserInfoLoading] = useState(true);
  const email = user?.email;
  const [axiosSecure] = useAxiosSecure();
  useEffect(()=>{
    const fun = async()=>{
        setUseUserInfoLoading(true);
        const res = await axiosSecure(`/user/${email}`)
        setDashboardUser(res?.data);
        setUseUserInfoLoading(false);
    }
    fun();
},[]);
  return [loading, useUserInfoLoading, dashboardUser];
};

export default useUserInfo;
