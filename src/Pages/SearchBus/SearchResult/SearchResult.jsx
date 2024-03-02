import { useNavigate, useSearchParams } from "react-router-dom";
import useSearchBus from "../../../hooks/useSearchBus";
import Loading from "../../../Components/Loading/Loading";
import { useData } from "../../../providers/DataContext";
import BusNotFound from "../BusNotFound/BusNotFound";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  // BUG: search bus based on time
  const timeStamp = new Date().toLocaleTimeString();
  const currentTime = timeStamp.slice(0, 5) + timeStamp.slice(8, 11);
  const [availableBus, loading] = useSearchBus({ from, to, date, currentTime });
  const {setGlobalData} = useData();    /* Context to pass data between children */
  const navigate = useNavigate();
  
  if (loading) {
    return <Loading></Loading>;
  } else {
    history.pushState(null, null, `/booking/search?from=${from}&to=${to}&date=${date}`);
  }

  const handleBooking = busData =>{
    setGlobalData(busData);
    console.log(busData.bus._id);
    navigate(`/booking/${busData.bus._id}`)
  }
  
  console.log(availableBus)
  // const searchInfo = [from, to, date, currentTime];
  //   useEffect(() => {
  //     fetch("http://localhost:5000/search", {
  //       method: "POST",
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //       body: JSON.stringify({ from, to, date, currentTime }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setAvailableBus(data);
  //       });
  //   }, []);

  return (
    <div className="overflow-x-auto">
      {!availableBus.length? <BusNotFound/>:<table className="table table-md">
        <thead>
          <tr>
            <th>#</th>
            <th>Operator</th>
            <th>Model</th>
            <th>Route</th>
            <th>{from} Dep. Time</th>
            <th>{to} Arr. Time</th>
            <th>Seat Available</th>
            <th>Cost</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {availableBus.map((bus, index) => {
            const depCost = bus.stoppages.find((item) => item.name == from).price;
            const arrCost = bus.stoppages.find((item) => item.name == to).price;
            const price = arrCost-depCost;
            let depTime, arrTime;
            if(price>=0){
                depTime = bus.stoppages.find((item) => item.name == from).upTime;
                arrTime = bus.stoppages.find((item) => item.name == to).upTime;
            }
            else{
                depTime = bus.stoppages.find((item) => item.name == from).downTime;
                arrTime = bus.stoppages.find((item) => item.name == to).downTime;
            }

            const busData = {
                bus: bus,
                from: from,
                to: to,
                depTime: depTime,
                date: date,
                cost: Math.abs(price-0),
            }
            
            return (
              <tr key={bus._id}>
                <th>{index + 1}</th>
                <td>{bus.Operator}</td>
                <td>{bus.name}</td>
                <td>{bus.route}</td>
                <td>{depTime}</td>
                <td>{arrTime}</td>
                <td>{bus.availableSeats.length}</td>
                <td>{Math.abs(depCost-arrCost)}</td>
                <td>
                  <button
                  onClick={()=>handleBooking(busData)}
                    className="btn btn-primary text-white font-bold"
                    style={{
                      background:
                        "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
                    }}
                  >
                    Book Now
                  </button>{" "}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>}
    </div>
  );
};

export default SearchResult;
