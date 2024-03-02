import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import Loading from "../../../Components/Loading/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";

const TravelHistory = () => {
  const { user, loading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [toSort, setSort] = useState(false);
  const [sortIcon, setSortIcon] = useState(true);
  const [axiosSecure] = useAxiosSecure();
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 13;
  const { email} = user;
  const backgroundDesign = "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))";

//   COMMENT: GETTING PAGE COUNT
  const {data:count, isLoading} = useQuery({
    queryKey:['count'],
    enabled:!loading,
    queryFn: async()=>{
        const res = await axiosSecure.get(`/verify-ticket/${email}/false?count=true`);
        setTotalPage(Math.ceil(parseInt(res?.data?.count)/perPage));
        return res.data;
    }
  });

//   console.log(currentPage);

// COMMENT: ALL TICKETS
  useEffect(() => {
    const fun = async () => {
      const res = await axiosSecure.get(`/verify-ticket/${email}/false?page=${currentPage}&perPage=${perPage}`);
      setBookings(res?.data);
    };
    fun();
  }, [email, axiosSecure, currentPage]);

  if (loading||isLoading) return <Loading />;

  const sortBooking = () =>{
    bookings.sort((firstDate, secondDate) => {
        const dateA = new Date(firstDate.busData.date);
        const dateB = new Date(secondDate.busData.date);
        if(toSort) return dateA - dateB;
        else return dateB - dateA;
    });
  }
  
const handleSort = () =>{
    setSortIcon(false);
    sortBooking()
    setSort(!toSort);
}

  return (
    <div className="w-full h-full">
      <div className="w-full h-full fixed bg-base-100 opacity-60"></div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-center">
          <thead className="text-white font-bold uppercase">
            <tr className="" style={{background:"linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))"}}>
              <th>#</th>
              <th>Destination</th>
              <th>Operator</th>
              <th>Passenger No.</th>
              <th>Cost</th>
              <th>TransactionID</th>
              <th className="hover:cursor-pointer" onClick={handleSort}> Date <FontAwesomeIcon icon={(sortIcon && faSort) || (toSort?faSortUp:faSortDown)}/> </th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map(({busData, persons, transactionID}, index) => {
              return (
                <tr key={index} className="h-14">
                  <th>{++index}</th>
                  <td>{busData?.from} - {busData?.to}</td>
                  <td>{busData?.bus?.Operator}</td>
                  <td>{persons?.length}</td>
                  <td>{busData?.cost * persons?.length} BDT</td>
                  <td>{transactionID}</td>
                  <td>{busData?.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
            <div className="join w-full relative flex justify-center my-2">
                {
                    [...Array(totalPage).keys()].map((value, index)=>{
                        return <button key={index} style={{background:currentPage == value && backgroundDesign}} className={`join-item btn btn-outline ${currentPage == value && 'text-white'}`} onClick={()=>setCurrentPage(index)}>{value+1}</button>
                    })
                }
            </div>
      </div>


    </div>
  );
};

export default TravelHistory;
