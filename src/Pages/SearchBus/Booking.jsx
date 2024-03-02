import { useContext, useEffect, useState } from "react";
import { DataContext, useData } from "../../providers/DataContext";
import { AuthContext } from "../../providers/AuthProvider";
import { useForm } from "react-hook-form";
import busBookingBackground from "../../assets/Images/Backgrounds/busBookingBackground.jpg";
import cardBackground from "../../assets/Images/Backgrounds/card-background.jpg";
import { Link } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";
import busSeat from "../../assets/Images/SVG/busSeat.png";
import seatAvailable from "../../assets/Images/SVG/seatAvailable.png";
import seatBooked from "../../assets/Images/SVG/seatBooked.png";
import seatSelected from "../../assets/Images/SVG/seatSelected.png";
import wheel from "../../assets/Images/SVG/steering-wheel.png";
import axios from "axios";

const Booking = () => {
  const { user } = useContext(AuthContext);
  const { data, setGlobalData } = useContext(DataContext);
  const userName = user?.displayName;
  const userEmail = user?.email;
  const [fullData, setFullData] = useState({});
  const [proceed, setProceed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seatError, setSeatError] = useState("");
  const [OTPsent, setOTPsent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [requestID, setRequestID] = useState("");
  const serviceCharge = 20;
  const discount = 0;
  const vat = 5; /* 5% */
  const backgroundDesign = "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))";

  //   COMMENT: seat selector
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [seats, setSeats] = useState([]);
  //   const seats = [1, 2,3, 4,5, 6,7, 8,9, 10,11, 12,13, 14,15, 16,17, 18,19, 20,21, 22,23, 24,25, 26,27, 28,29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
  const seatBreaks = [
    1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61,
  ];
  const [booked, setBooked] = useState([]);
  const [totalSeat, setTotalSeat] = useState([]);

  useEffect(() => {
    // const temp = booked.concat(seats);
    if (booked?.length && seats?.length) {
      const sorted = booked
        ?.concat(seats)
        ?.slice()
        .sort((a, b) => a - b);
      setTotalSeat(sorted);
    } else if (booked?.length) {
      setTotalSeat(booked);
    } else setTotalSeat(seats);
  }, [booked, seats]);
  //   console.log("TOTAL SEAT: ", totalSeat);
  //   console.log("Available seats", seats);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  if (loading) return <Loading />;
  const handleBooking = async(event) => {
    setLoading(true);
    proceed && setProceed(false);
    setBooked(data?.bus?.booked);
    setSeats(data?.bus?.availableSeats);
    const temp = {
        busData: data,
        user: { ...user },
        passengerDetails: {
            ...event,
            name: user?.displayName,
            email: user?.email,
        },
    };
    setFullData(temp);
    const phone = event?.phone;
    const formattedPhone = phone[0] === '0' ? `88${phone}` : `880${phone}`;
    const result = await axios.get(`http://localhost:5000/sendOTP/${formattedPhone}`).then(res=>res?.data);
    setRequestID(result?.request_id);
    console.log('result: ', result);
    setLoading(false);
  };
console.log('requestID: ', requestID);
  //   console.log("Available seat: ", seats);
  //   console.log("booked seat: ", booked);

  const handleSeatBooking = (event) => {
    setLoading(true);
    const persons = selectedSeat.map((item) => {
      return {
        seatNo: item,
        name: event.target[`name${item}`].value,
        age: event.target[`age${item}`].value,
        gender: event.target[`gender${item}`].value,
      };
    });
    setFullData({ ...fullData, persons: persons });
    persons.length != 0 && setProceed(!proceed);
    setLoading(false);
  };


//   WORKING: OTP verification function
  const handleVerifyOTP = async(notError) =>{
    if(!notError) return;
    const otp = document.getElementById('otpCode').value;
    const verifyOTP = await axios.get(`http://localhost:5000/verifyOTP/${requestID}/${otp}`).then(res=>res?.data);
    // console.log(phoneNumber);
    console.log(verifyOTP);

    verifyOTP?.status && document.getElementById("seatChoosing").showModal();
  }
  

//   console.log(fullData);
  const splitedDate = new Date(data?.date).toDateString().split(" ");
  //   console.log(fullData);
  if (loading) {
    return <Loading></Loading>;
  }
  if (!data || !totalSeat) history.back();

  //   COMMENT: Every Seat templete
  const btn = (index, temp) => {
    //   console.log('booked: ', booked);
    //   COMMENT:97'th line commented for last two chair
    //   if(Math.max(...seats)<temp) return;
    //   console.log(temp);
    return (
      <button
        key={index}
        className={`tooltip tooltip-success w-fit ms-2 ${
          booked?.includes(temp) ? "cursor-not-allowed" : "cursor-pointer"
        } `}
        disabled={booked?.includes(temp)}
        data-tip={`ST:${temp}`}
        // COMMENT: Changing seat selection
        onClick={(event) => {
          let modifySeat = selectedSeat;
          const found = modifySeat.includes(temp);
          if (modifySeat.length >= 4 && !found) {
            setSeatError("You cannot allocate more then 4 seat");
            return;
          }

          !modifySeat.includes(temp)
            ? modifySeat.push(temp)
            : modifySeat.splice(modifySeat.indexOf(temp), 1);
          modifySeat.sort();
          setSelectedSeat([...modifySeat]);
          setSeatError("");

          // COMMENT: Change Seat image
          const newChild = document.createElement("img");
          newChild.className = "w-5 rotate-180 pointer-events-none";

          if (found) {
            newChild.setAttribute("src", seatAvailable);
          } else {
            newChild.setAttribute("src", seatSelected);
          }
          event.currentTarget.replaceChildren(newChild);
          if (selectedSeat.length === 0)
            setSeatError("Atleast 1 seat should be added");
        }}
      >
        <img
          className="w-5 rotate-180 pointer-events-none"
          src={booked?.includes(temp) ? seatBooked : seatAvailable}
        />
      </button>
    );
  };

  // console.log(selectedSeat);

  return (
    <div>
      <div
        className="bg-fixed"
        style={{
          backgroundImage: `url(${busBookingBackground})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="hero min-h-screen bg-fixed bg-black bg-opacity-50">
          <div className="hero-content flex-col gap-[250px] w-full lg:flex-row px-10 justify-between">
            <div
              className={`card shrink-0 w-full max-w-sm shadow-2xl bg-base-100`}
            >
              {/* COMMENT: Get Phone number */}
              <form
                className="card-body"
                onSubmit={handleSubmit(handleBooking)}
              >
                {/* COMMENT: Default Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="email"
                    className="input input-bordered"
                    disabled
                    value={userEmail}
                  />
                </div>
                {/* COMMENT: Default Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="name"
                    className="input input-bordered"
                    disabled
                    value={userName}
                  />
                </div>
                {/* COMMENT: Phone number */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <div className="join">
                    <span className="btn join-item" disabled>
                      <span className="text-black">+880</span>
                    </span>
                    <input
                      type="text"
                      className="input input-bordered join-item  border-0"
                      placeholder="Enter Phone Number"
                      inputMode="numeric"
                      min={0}
                      {...register("phone", {
                        required: {
                          value: true,
                          message: "Phone is required",
                        },
                        pattern: {
                          value: /^0?1[3-9]\d{8}$/,
                          message: "Enter valid mobile number!",
                        },
                      })}
                    />
                  </div>
                </div>
                {/* {console.log(errors)} */}
                {(errors?.phone?.type === "pattern" ||
                  errors?.phone?.type === "required") && (
                  <span className="text-red-500 font-bold">{errors.phone?.message}</span>
                )}


                {/* COMMENT: Verify OTP */}
                <div className={`join ${!OTPsent && 'hidden'}`}>
                <input className="input input-bordered join-item" placeholder="Enter OTP" type="text" id="otpCode" minLength={4}/>
                <span className="btn join-item text-white" style={{background:backgroundDesign}} onClick={async () => {
                      const notError = await trigger();
                      handleVerifyOTP(notError);
                    }}>Verify</span>
                </div>

                {/* COMMENT: proceed button to show modal and check errors */}
                <div className="form-control mt-6">
                  <button
                    className="btn btn-primary"
                    onClick={()=>setOTPsent(true)}
                    style={{
                      background:
                        "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
                    }}
                  >
                    Send OTP
                  </button>
                </div>
              </form>
            </div>

            {/* COMMENT: seat choosing modal */}
            <dialog id="seatChoosing" className="modal modal-middle">
              <div className="modal-box w-11/12 max-w-5xl h-4/6">
                <h3 className="font-bold text-2xl text-center pb-4">
                  <span
                    style={{
                      background: "linear-gradient(to right,#00684D,#E72D41)",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Choose your{" "}
                  </span>
                  <span
                    style={{
                      background: "linear-gradient(to right,#E72D41,#00684D)",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Seat
                  </span>
                </h3>
                <div className="w-full">
                  <div className="flex">
                    {/* COMMENT: Available Seats */}
                    <div className="w-[500px]">
                      {/* COMMENT: Indicating seat icon */}
                      <p className="flex">
                        <span>
                          <img
                            className="w-5 inline ms-2"
                            src={seatAvailable}
                            alt="Seat Available"
                          />{" "}
                          Available
                        </span>
                        <span>
                          <img
                            className="w-5 inline ms-2"
                            src={seatSelected}
                            alt="Seat Selected"
                          />{" "}
                          Selected
                        </span>
                        <span>
                          <img
                            className="w-5 inline ms-2"
                            src={seatBooked}
                            alt="Seat Booked"
                          />{" "}
                          Booked
                        </span>
                      </p>
                      {/* COMMENT: Driving Wheel */}
                      <div className="flex items-end justify-end mb-2 pt-2 w-8/12">
                        <img
                          src={wheel}
                          className="w-5 pointer-events-none"
                          alt="Driver"
                        />
                      </div>
                      {totalSeat?.map((temp, index) => {
                        if (!seatBreaks.includes(temp)) return;
                        return (
                          <div key={index} className="grid grid-cols-2 gap-1">
                            {/* {console.log(temp)} */}
                            <div>
                              {btn(index, temp)}
                              {btn(index + 1, temp + 1)}
                            </div>
                            <div className="">
                              {btn(index + 2, temp + 2)}
                              {btn(index + 3, temp + 3)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* COMMENT: Seat Details and taking passengers informations */}
                    <div className="divider divider-horizontal ms-[-30px]"></div>
                    <div
                      className="border rounded-xl w-full"
                      style={{
                        backgroundImage: `url(${cardBackground})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                    >
                      <h1 className="text-xl font-bold">
                        Passenger information:
                      </h1>
                      <p>
                        <span className="font-bold">Seat/s: </span>
                        {selectedSeat.map((item, index) => (
                          <span key={index}>
                            {item}
                            {selectedSeat[index + 1] ? "," : "."}{" "}
                          </span>
                        ))}
                      </p>
                      <p>
                        <span className="font-bold">Total Seat: </span>
                        {selectedSeat.length}
                      </p>
                      <p>
                        <span className="text-red-500 font-bold">
                          {seatError}
                        </span>
                      </p>
                      <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 modal-backdrop text-black">
                          ✕
                        </button>
                      </form>
                      <form
                        onSubmit={handleSeatBooking}
                        className="flex flex-col items-center mt-5 me-10 w-full h-fit"
                        method="dialog"
                      >
                        {selectedSeat.map((temp, index) => {
                          return (
                            <div
                              key={index}
                              className="join my-0.5 ms-5 w-full"
                            >
                              <div className="flex items-center">
                                <h2 className="me-3 w-full text-center font-bold">
                                  Seat holder:{temp}{" "}
                                </h2>
                                <div>
                                  <input
                                    className="input input-bordered join-item"
                                    type="text"
                                    name={`name${temp}`}
                                    required
                                    placeholder="Name"
                                  />
                                </div>
                              </div>
                              <div>
                                <div>
                                  <input
                                    className="input input-bordered join-item w-fit"
                                    type="number"
                                    name={`age${temp}`}
                                    required
                                    placeholder="Age"
                                  />
                                </div>
                              </div>
                              <select
                                className="select select-bordered join-item"
                                name={`gender${temp}`}
                              >
                                <option disabled defaultValue={"gender"}>
                                  Gender
                                </option>
                                <option value={"male"}>Male</option>
                                <option value={"female"}>Female</option>
                                <option value={"other"}>Other</option>
                              </select>
                            </div>
                          );
                        })}
                        {selectedSeat.length != 0 && (
                          <input
                            className="btn mt-5 text-white"
                            type="submit"
                            value="Submit"
                            style={{
                              background:
                                "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
                            }}
                          />
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </dialog>

            {/* COMMENT: Information */}
            <div className={`w-full h-full flex flex-col items-center ms-20`}>
              <div
                className={`${!proceed && "blur-[2px] hover:cursor-progress"}`}
              >
                {/* COMMENT: Passenger Information */}
                <div
                  className="card w-96 bg-base-100 shadow-xl"
                  style={{
                    backgroundImage: `url(${cardBackground})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                >
                  <div className={`card-body`}>
                    <h2 className="card-title my-[-20px]">Journey Details</h2>
                    <div className="divider mb-[-10px]"></div>
                    <p className="font-sans text-xl font-bold text-success">
                      {fullData?.busData?.from} - {fullData?.busData?.to}
                    </p>

                    <p className="font-sans text-md my-[-10px]">
                      <span className="font-bold">Operator:</span>{" "}
                      {fullData?.busData?.bus?.Operator}
                    </p>
                    <p className="font-sans text-md mb-[-10px]">
                      <span className="font-bold">Model:</span>{" "}
                      {fullData?.busData?.bus?.name}
                    </p>
                    <p className="font-sans text-md mb-[-5px]">
                      <span className="font-bold">Route:</span>{" "}
                      {fullData?.busData?.bus?.route}
                    </p>
                    <p className="font-sans text-md mb-[-10px]">
                      <span className="font-bold">Seat/s:</span>{" "}
                      {selectedSeat.map((seat, index) => (
                        <span key={index}>
                          {seat}
                          {selectedSeat[index + 1] ? "," : "."}{" "}
                        </span>
                      ))}
                    </p>
                    <p className="font-sans text-md mb-[-10px]">
                      <span className="font-bold">Date and Time:</span>{" "}
                      {splitedDate[0]}, {splitedDate[2]} {splitedDate[1]}{" "}
                      {splitedDate[3]}{" "}
                      <span className="ms-3">{fullData?.busData?.depTime}</span>
                    </p>
                    <p className="font-sans text-md mb-[-10px]">
                      <span className="font-bold">Total Passenger: </span>
                      {selectedSeat.length}
                    </p>

                    <div className="divider mb-[-10px]"></div>

                    <p className="font-sans text-md mb-[-10px]">
                      <span className="font-bold">Name:</span> {userName}
                    </p>
                    <p className="font-sans text-md mb-[-10px]">
                      <span className="font-bold">Email:</span> {userEmail}
                    </p>
                    <p className="font-sans text-md mb-[-10px]">
                      <span className="font-bold">Phone:</span>{" "}
                      <a href={`tel: +88${fullData?.passengerDetails?.phone}`}>
                        +880{fullData?.passengerDetails?.phone}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  !proceed && "blur-[2px] hover:cursor-progress"
                } mt-5`}
              >
                {/* COMMENT: Payment Information */}
                <div
                  className="card w-96 bg-base-100 shadow-xl"
                  style={{
                    backgroundImage: `url(${cardBackground})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                >
                  <div className="card-body">
                    <h2 className="card-title my-[-20px]">Fare Details</h2>
                    <div className="divider mb-[-10px]"></div>

                    <p className="font-sans text-md my-[-5px] flex justify-between">
                      <span className="font-bold">Ticket Price:</span>{" "}
                      {fullData?.busData?.cost * selectedSeat.length} BDT
                    </p>

                    <div className="divider my-[-6px]"></div>
                    <p className="font-sans text-md my-[-5px] flex justify-between">
                      <span className="font-bold">Service Charge:</span>{" "}
                      {discount} BDT
                    </p>

                    <div className="divider my-[-6px]"></div>
                    <p className="font-sans text-md my-[-5px] flex justify-between">
                      <span className="font-bold">Discount:</span>{" "}
                      {serviceCharge} BDT
                    </p>

                    <div className="divider my-[-6px]"></div>
                    <p className="font-sans text-md my-[-5px] flex justify-between">
                      <span className="font-bold">VAT:</span>{" "}
                      <span>
                        {fullData?.busData?.cost * (vat / 100) + " BDT"}{" "}
                        <small>({vat}%)</small>
                      </span>
                    </p>

                    <div className="divider my-[-6px]"></div>
                    <p className="font-sans text-md my-[-5px] flex justify-between">
                      <span className="font-bold text-red-600">Total:</span>{" "}
                      {fullData?.busData?.cost * selectedSeat.length -
                        discount +
                        serviceCharge +
                        fullData?.busData?.cost * (vat / 100)}{" "}
                      BDT
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMMENT: Payment Button */}
      {proceed && (
        <div className="text-center pb-5 mt-5 md:flex md:flex-row justify-center flex-col gap-2">
          <div className="overflow-x-auto w-[500px]">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Seat No</th>
                </tr>
              </thead>
              <tbody>
                {fullData.persons.map((person, index) => {
                  return (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{person.name}</td>
                      <td>{person.age}</td>
                      <td>{person.gender}</td>
                      <td>{person.seatNo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="md:w-0 sm:w-full">
            <Link
              onClick={() => setGlobalData(fullData)}
              to={`/dashboard/payment`}
              className="btn btn-primary text-white h-full"
              style={{
                background:
                  "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
              }}
            >
              PAY NOW
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
