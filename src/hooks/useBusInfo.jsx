import useUserInfo from "./useUserInfo";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useBusInfo = () => {
    const [loading, useUserInfoLoading, dashboardUser] = useUserInfo();
    const [axiosSecure] = useAxiosSecure();
    const {data:bus, loading:dataLoading, refetch} = useQuery({
        queryKey:[dashboardUser],
        queryFn: async()=>{
            return await axiosSecure.get(`/busInfo/${dashboardUser?.email}`)
        }
    });

    return [bus, loading, useUserInfoLoading, dataLoading, refetch];
};

export default useBusInfo;