import { useEffect, useState } from "react";
import Loading from "../../../../Components/Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBangladeshiTakaSign } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useUserInfo from "../../../../hooks/useUserInfo";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart, Pie } from "react-chartjs-2";


const AccountHistory = () => {
  const [loading, useUserInfoLoading, dashboardUser] = useUserInfo();
  const [available, setAvailable] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedBus, setSelectedBus] = useState('');
  const [availability, setAvailability] = useState('');
  const [axiosSecure] = useAxiosSecure();
  const [totalFare, setTotalFare] = useState(0);
  const [bookingFare, setBookingFare] = useState(0);
  const [updatingDateLoading, setUpdatingDateLoading] = useState(false);
  const backgroundDesign = "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))";

  const today = new Date();
const nextDay = new Date(today);
nextDay.setDate(today.getDate() + 1);

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
    labels: [ 'Remaining Fare', 'Booking Fare','Total Fare'],
    datasets: [
      {
        label: 'BDT: ',
        data: [Math.abs(totalFare-bookingFare), bookingFare, totalFare],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };



const { data:bus, isLoading, refetch } = useQuery({
    queryKey: [dashboardUser],
    queryFn: async () => {
        const query = {email: dashboardUser?.email,fromDate,toDate,selectedBus,availability,};
        return await axiosSecure.post(`/accountHistory/${dashboardUser?.email}`, {query});
    },
});
  
useEffect(()=>{
    setUpdatingDateLoading(true);
    const setBuses = () => {
        if (Array.isArray(bus?.data?.busResult)) {
          const buses = bus.data.busResult;
          const shortAvailableInfo = buses.map(({ name, available }) => ({
            name,
            available,
          }));
          setAvailable(shortAvailableInfo);
        }
    };
    setBuses();

    const setTotalFareFn = () =>{
        setTotalFare(0);
        if(Array.isArray(bus?.data?.busResult)){
            const buses = bus.data.busResult;
            buses.map((bus)=>{
                const totalSeat = bus?.availableSeats?.length
                const maxPrice = bus?.stoppages.reduce((max, stoppage)=>{
                    // console.log(stoppage?.price);
                    return Math.max(max, stoppage.price);
                }, 0)
                setTotalFare((previousTotalFare) => previousTotalFare + maxPrice * totalSeat);
                
            });
        }
    }
    setTotalFareFn();

    const  setBookingFareFn = () =>{
        setBookingFare(0);
        if(!Array.isArray(bus?.data?.bookings)) return;
        const bookings = bus?.data?.bookings;
        const buses = bus?.data?.busResult;
        buses?.map(({name})=>{
            bookings?.map(({busData, persons})=>{
                if(busData?.bus?.name === name) setBookingFare(previousBookingFare => previousBookingFare+(busData?.cost * persons?.length))
            });
        })
    }
    setBookingFareFn();
setUpdatingDateLoading(false);
},[bus]);
  
  if ((loading || isLoading) || (useUserInfoLoading || updatingDateLoading)) return <Loading />;
//   console.log("Bookings: ",bus.data?.bookings);
//   console.log("BusResult: ",bus.data?.busResult);

  const smallDiv = (title, amount) => {
    return (
      <div className="w-52 h-52 bg-base-100 rounded-lg p-2 hover:drop-shadow-xl">
        <h1 className="text-xl font-extralight">{title}</h1>
        <div
          className="divider m-0 h-1 w-5/6"
          style={{ background: backgroundDesign }}
        />
        <h1 className="text-center font-bold text-3xl mt-10">
          {amount}{" "}
          <span className="align-super">
            <FontAwesomeIcon icon={faBangladeshiTakaSign} />
          </span>
        </h1>
      </div>
    );
  };


  const handleSearch = () => {
    refetch();
    setTotalFare(0);
    setBookingFare(0);
    // fun();
    // console.log("From Date", fromDate);
    // console.log("To date", toDate);
    // console.log("Bus name: ", selectedBus);
    // console.log("Availability: ", availability);
  };

  return (
    <div className="bg-base-100 w-full p-3 h-full">
      <div
        className="w-full h-full p-5 ms-5 rounded-2xl"
        style={{ background: "rgb(241,244,244)" }}
      >
        <h1 className="text-3xl font-bold my-2 font-sans">Account Dashboard</h1>
        <div className="w-full flex gap-4">
        {/* COMMENT: date selector */}
          <div className=" bg-base-100 p-2 rounded-lg">
            <label className="label p-0 m-0">
              <span className="label-text">Range from</span>
            </label>
            <input
              type="date"
              max={nextDay.toISOString().split("T")[0]}
              onChange={(event) => {
                setFromDate(event.target.value);
              }}
              onSelect={handleSearch}
              className="select select-none"
            />
          </div>

          {/* COMMENT: date selector */}
          <div className=" bg-base-100 p-2 rounded-lg">
            <label className="label p-0 m-0">
              <span className="label-text">Range to</span>
            </label>
            <input
              type="date"
              max={nextDay.toISOString().split("T")[0]}
              onChange={(event) => {
                setToDate(event.target.value);
              }}
              onSelect={handleSearch}
              className="select select-none"
            />
          </div>

          {/* COMMENT: bus selection */}
          <div className=" bg-base-100 p-2 rounded-lg">
            <label className="label p-0 m-0">
              <span className="label-text">Bus</span>
            </label>
            <select
              onChange={(event) => {
                setSelectedBus(event.target.value);
              }}
              onClickCapture={handleSearch}
              className="select select-none w-full max-w-xs"
            >
              <option defaultChecked>All</option>
              {available?.map(({ name }, index) => {
                return <option key={index}>{name}</option>;
              })}
            </select>
          </div>

          {/* COMMENT: bus status selection */}
          <div className=" bg-base-100 p-2 rounded-lg">
            <label className="label p-0 m-0">
              <span className="label-text">Availability</span>
            </label>
            <select
              onChange={(event) => {
                setAvailability(event.target.value);
              }}
              onClickCapture={handleSearch}
              className="select select-none w-full max-w-xs"
            >
              <option>Both</option>
              <option>true</option>
              <option>false</option>
            </select>
          </div>
        </div>
        <div className="w-full flex justify-between mt-5">
          {smallDiv("Total Fare", totalFare)} {smallDiv("Booking Fare", bookingFare)}{" "}
          {smallDiv("Remaining Fare", Math.abs(bookingFare-totalFare))}
          <div className="w-52 h-auto bg-base-100 rounded-lg p-2  hover:drop-shadow-xl">
            <h1 className="text-xl font-extralight">Pictorial View</h1>
            <div className="divider m-0 h-1 w-5/6" style={{ background: backgroundDesign }}/>
            <Pie data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHistory;
