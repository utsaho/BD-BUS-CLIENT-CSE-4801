import { useQuery } from "@tanstack/react-query";
import useUserInfo from "../../../../hooks/useUserInfo";
import Loading from "../../../../Components/Loading/Loading";
import background from "../../../../assets/Images/Backgrounds/card-background.jpg";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";

const Customers = () => {
  const [loading, useUserInfoLoading, dashboardUser] = useUserInfo();
  const [axiosSecure] = useAxiosSecure();
  const [modalData, setModalData] = useState({});
  const [query, setQuery] = useState({});
  const [typing, setTyping] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 8;
  const backgroundDesign = "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))";


//   COMMENT: counting total page
  const {data:count, isLoading:counting} = useQuery({
    queryKey: ['pagination', "customers", dashboardUser?.operatorName, query],
    enabled:!loading,
    queryFn: async()=>{
        const operator = dashboardUser?.operatorName;
        const res = await axiosSecure.patch("/bookings?count=true", { operator, query });
        setTotalPage(Math.ceil(parseInt(res?.data?.count)/perPage))
        return res?.data;
    }
  });
  
  const { data: customers, isLoading, refetch } = useQuery({
    queryKey: ["customers", dashboardUser?.operatorName, query, currentPage],
    queryFn: async () => {
      const operator = dashboardUser?.operatorName;
      const res = await axiosSecure.patch(`/bookings?currentPage=${currentPage}&perPage=${perPage}`, { operator, query });
      return res?.data;
    },
  });


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        document.getElementById("searchModal").showModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };

  }, []);

  useEffect(()=>{
    if(typing === 'All') {
        setQuery({});
        document.getElementById('searchModalClose').click();
    }
  },[typing]);
  
const handleSearch = (event) =>{
    const searchText = event.target?.searchText?.value
    const filter = event.target?.filter?.value.toLowerCase();
    if(filter !== 'filter'){
        if(filter!=='all')setQuery({searchText, filter});
        else setQuery({});
    }
}

  if ((loading || useUserInfoLoading) || (isLoading || counting)) return <Loading />;
  return (
    <div className="h-full w-full" style={{backgroundImage: `url(${background})`,backgroundRepeat: "no-repeat",backgroundSize: "cover",backgroundPosition:'center'}}
    >
        {/* COMMENT: Search mdoal */}
      <dialog id="searchModal" className="modal">
        <form
          className="fixed top-0"
          style={{ background: `(${backgroundDesign})` }}
          onSubmit={handleSearch}
           method="dialog"
        >
          <div className="join">
            <div>
              <label className="input input-bordered flex items-center gap-2 rounded-e-none">
                <input type={typing=='date'?'date':'text'} className="grow" placeholder="Search" onChange={(e)=>setTyping(e.target.value)}
                required
                name="searchText"
                />
                
              </label>
            </div>
            <select className="select select-bordered join-item"
            name="filter" onChange={(e)=>setTyping(e.target.value)}
            >
              <option disabled defaultValue={'filter'}>
                Filter
              </option>
              <option disabled>Bus</option>
              <option disabled>Email</option>
              <option disabled>Phone</option>
              <option>Search</option>
              <option value='date'>Date</option>
              <option className="font-bold" value={'All'}>All</option>
            </select>
            <div className="indicator"/>
            <button className="btn join-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button id="searchModalClose">close</button>
        </form>
      </dialog>
      <div className="bg-base-100 w-full h-full fixed opacity-70"></div>
      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead className="text-white uppercase ">
            <tr style={{ background: backgroundDesign }}>
              <th className="">Name</th>
              <th>Bus</th>
              <th className="px-0">Date</th>
              <th className="px-0">Passenger</th>
              <th className="px-0">Phone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map(
              (
                { busData, passengerDetails, persons, transactionID },
                index
              ) => {
                return (
                  <tr key={index}>
                    <td className="w-fit px-0">
                      <span className="font-bold text-center">
                        {passengerDetails?.name}
                      </span>
                    </td>
                    <td>
                      {busData?.bus?.name}
                      <br />
                      {busData?.bus?.contact && (
                        <span
                          className="badge badge-ghost badge-md text-white font-bold"
                          style={{ background: backgroundDesign }}
                        >
                          Bus Contact: {busData?.bus?.contact}
                        </span>
                      )}
                    </td>
                    <td className="px-0">{busData?.date}</td>
                    <td>
                      <span
                        className="btn"
                        onClick={() => {
                          setModalData({
                            persons,
                            passengerDetails,
                            transactionID,
                          });
                          document.getElementById("personsModal").showModal();
                        }}
                      >
                        {persons?.length}
                      </span>
                    </td>

                    <td className="font-bold px-0">
                      <span className="text-red-700">
                        {passengerDetails?.phone}
                      </span>{" "}
                      <br />
                      <span className="font-bold">
                        {busData?.from} to {busData?.to}
                      </span>
                    </td>
                    <td>{passengerDetails?.email}</td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
      <dialog id="personsModal" className="modal">
        <div className="modal-box hover:shadow-inherit shadow-2xl ">
          <h3 className="font-bold text-lg">
            Persons Details [
            <span className="text-red-700">
              {modalData?.passengerDetails?.email}
            </span>{" "}
            - {modalData?.transactionID}]
          </h3>
          <div
            className="divider m-0 h-1/2 p-0 w-4/6 mb-5"
            style={{ background: backgroundDesign }}
          />
          {modalData?.persons?.map((person, index) => {
            return (
              <p key={index}>
                <p>
                  <span className="me-3">
                    <span className="font-bold">{index + 1}. Name: </span>
                    {person?.name}
                  </span>{" "}
                  <span className="me-3">
                    <span className="font-bold">Age: </span>
                    {person?.age}
                  </span>{" "}
                  <span className="me-3">
                    <span className="font-bold">Seat-no: </span>
                    {person?.seatNo}
                  </span>
                </p>
              </p>
            );
          })}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div className="join w-full relative flex justify-center my-2">
        {
            [...Array(totalPage).keys()].map((value, index)=>{
                return <button key={index} style={{background:currentPage == value && backgroundDesign}} className={`join-item btn btn-outline ${currentPage == value && 'text-white'}`} onClick={()=>setCurrentPage(index)}>{value+1}</button>
            })
        }
            </div>
    </div>
  );
};

export default Customers;

