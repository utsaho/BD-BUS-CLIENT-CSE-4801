import { useContext, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../providers/AuthProvider";
import Loading from "../../../Components/Loading/Loading";
import background from '../../../assets/Images/Backgrounds/card-background.jpg';
import { useReactToPrint } from 'react-to-print';
import toast from "react-hot-toast";

const VerifyTicket = () => {
  const [verified, setVerified] = useState(false);
  const { user, loading: isLoading } = useContext(AuthContext);
  const [axiosSecure] = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const printRef = useRef();

//   COMMENT: Printer Hook
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforePrint: () => toast.loading('Attempting to print')
  });

  if (loading || isLoading) return <Loading />;
  const email = user?.email;

  const ticketExpired = (dateParam) => {
    const fullDate = new Date();
    const year = fullDate.getFullYear().toString();
    let month = (fullDate.getMonth() + 1).toString();
    let date = fullDate.getDate();
    if (month.length == 1) month = month.padStart(2, "0");
    if (date.length == 1) date = date.toString().padStart(2, "0");
    const currentDate = `${year}-${month}-${date}`;
    return dateParam<currentDate;
  };

//   COMMENT: handle verify-ticket form
  const verifyTicket = async (event) => {
    event.preventDefault();
    const transactionNumber = event.target.transactionNumber.value;
    setLoading(true);
    const res = await axiosSecure.get(
      `/verify-ticket/${email}/${transactionNumber}`
    );
    setLoading(false);
    setData(res?.data);
  };

  const modifyStyle = (status) =>{
    if(status){
        document.getElementsByClassName('print-btn')[0].style.visibility = "hidden"
        document.getElementById('passengerInformation').style.backgroundImage = `url(${background})`
        document.getElementById('passengerInformation').style.backgroundRepeat = 'no-repeat'
        document.getElementById('passengerInformation').style.backgroundSize = 'cover'
        document.getElementById('signature').classList.remove('hidden')
    }else{
        document.getElementsByClassName('print-btn')[0].style.visibility = "visible"
        document.getElementById('passengerInformation').style.backgroundImage = ""
        document.getElementById('signature').classList.add('hidden')
    }
  }
  
  const {busData, passengerDetails, persons, transactionID} = data;
  const splitedDate = new Date(busData?.date).toDateString().split(" ");
// console.log(data);
  return (
    <div className="flex justify-between mx-5">
      {/* COMMENT: Transaction number input */}
      <form className="w-1/2" onSubmit={verifyTicket}>
        <div className="card w-96 bg-base-100 shadow-xl"  style={{backgroundImage:`url(${background})`, backgroundSize:'cover', backgroundRepeat:'no-repeat'}}>
          <div className="card-body">
            <h2 className="card-title">Enter your transaction number</h2>

            <div className="divider my-[-8px]" />

            <input
              type="text"
              placeholder="Enter you transaction number"
              name="transactionNumber"
              className="input input-bordered input-success w-full max-w-xs"
            />

            <ReCAPTCHA
              sitekey={import.meta.env.VITE_SITE_KEY}
              onChange={() => setVerified(true)}
              onError={() => setVerified(false)}
              onExpired={() => setVerified(false)}
            />

            <div className="card-actions justify-center">
              <button
                className={`btn ${(!verified) ? "btn-disabled" : "text-white"}`}
                style={{
                  background:
                    "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
                }}
              >
                Verify Now
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* COMMENT: Passenger Information */}
      <div ref={printRef} className={`ms-5 ${(!verified || !data?.busData) && 'hidden'}`}>
        <div className="card w-[110%] glass" id="passengerInformation">
          <div className="card-body">
            <h2 className="card-title">{busData?.bus?.Operator} {ticketExpired(busData?.date) &&<span className="text-red-600 font-extrabold">[Ticket Expired]</span>}</h2>
            <small className="font-semibold text-green-700">{busData?.bus?.name}</small>
            <small className="font-semibold">{busData?.bus?.route}</small>

            <div className="divider my-[-10px]"/>

            <p className="my-[-5px]"><span className="font-bold">Name:</span> {passengerDetails?.name}</p>
            <p className="my-[-5px]"><span className="font-bold">Phone:</span> {passengerDetails?.phone}</p>
            <p className="my-[-5px]"><span className="font-bold">Email:</span> {passengerDetails?.email}</p>
            <p className="my-[-5px]"><span className="font-bold">TransactionID:</span> {transactionID}</p>

            <p className="mb-[-5px]"><span className="font-bold">Destination:</span> {busData?.from} - {busData?.to} </p>
            <p className={`my-[-5px] ${ticketExpired(busData?.date) && "line-through"}`}><span className="font-bold text-green-700">Date and Time:</span> {splitedDate[0]}, {splitedDate[2]} {splitedDate[1]} {splitedDate[3]} [ <span className="text-green-700 font-bold">{busData?.depTime}</span> ]
            </p>

            <p className="font-bold mb-[-10px] mt-[5px] text-green-700">Passenger Details: {persons?.length}</p>
            <div>
                {
                    persons?.map((person, index)=><p key={index} className="mb-2"><span className="font-semibold">Name:</span> {person?.name}, <span className="font-semibold">Age:</span> {person?.age}, <span className="font-semibold">Gender:</span> {person?.gender}, <span className="font-semibold">SeatNo:</span> {person?.seatNo}. </p>)
                }
            </div>
            <div id='signature' className="hidden">
                <h1 className="text-center bg-orange-300 font-bold mt-10">Verified by BD BUD website</h1>
                <small>Print Date: {new Date().toDateString()}</small>
            </div>
            {/* COMMENT: Print button */}
            <div className="card-actions justify-center">
              <button
                className={`btn ${!verified ? "btn-disabled" : "text-white print-btn"}`}
                onClick={()=>{
                    modifyStyle(true);
                    handlePrint();
                    modifyStyle(false);
                }}
                style={{
                  background:
                    "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
                }}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyTicket;
