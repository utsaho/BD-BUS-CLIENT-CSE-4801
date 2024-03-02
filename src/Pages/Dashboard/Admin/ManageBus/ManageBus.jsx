import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../../../../Components/Loading/Loading";
import useBusInfo from "../../../../hooks/useBusInfo";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import background from "../../../../assets/Images/Backgrounds/card-background.jpg";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const ManageBus = () => {
  const [bus, loading, useUserInfoLoading, dataLoading, refetch] = useBusInfo();
  const [axiosSecure] = useAxiosSecure();
  if (loading || useUserInfoLoading || dataLoading) return <Loading />;
  const buses = bus?.data;
  const backgroundDesign = "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))";
  const handleOnOff = async (event, busID) => {
    console.log(event.target.checked, busID);
    const status = event.target?.checked;
    const res = await axiosSecure.patch(`/setBusAvailable/${busID}`, {
      status,
    });
    if (res?.data?.modifiedCount) {
      toast.success("Bus information updated.");
      refetch();
    }
  };

//   BUG: Confirm before delete bus and payback the bookings
  const handleDelete = async(busID) =>{
    const res = await axiosSecure.post('/deleteBus',{busID});
    if(res?.data?.deletedCount) toast.success('bus deleted successfully.');
    refetch();
    // console.log(res);
  }
  
  return (
    <div
      className="h-full w-full"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="bg-base-100 w-full h-full fixed opacity-70"></div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="text-center text-white uppercase ">
            <tr style={{ background: backgroundDesign }}>
              <th>Name</th>
              <th>Route</th>
              <th>Total Seats</th>
              <th>Total stoppages</th>
              <th>Available</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {(typeof buses?.map === 'function') && buses?.map((bus, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold">{bus?.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {bus?.route}
                    <br />
                    {bus?.contact && (
                      <span
                        className="badge badge-ghost badge-md text-white p-2"
                        style={{ background: backgroundDesign }}
                      >
                        <span className="font-bold">Contact: </span>{" "}
                        {bus?.contact}
                      </span>
                    )}
                  </td>
                  <td className="text-center">{bus?.availableSeats.length}</td>
                  <td className="text-center">{bus?.stoppages.length}</td>
                  <th className="text-center">
                    <input
                      onChange={(event) => handleOnOff(event, bus?._id)}
                      type="checkbox"
                      className="toggle toggle-md"
                      checked = {bus?.available}
                    />
                  </th>
                  <td className="text-center">
                    <span onClick={()=>handleDelete(bus?._id)} className="btn bg-transparent border-none hover:text-red-700">
                      <FontAwesomeIcon size="2x" icon={faTrash} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBus;
