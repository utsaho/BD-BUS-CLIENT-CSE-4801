import axios from "axios";
import Loading from "../../../../Components/Loading/Loading";
import useUserInfo from "../../../../hooks/useUserInfo";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// import emailjs from '@emailjs/browser';

const AddNewBus = () => {
    const [loading, useUserInfoLoading, dashboardUser] = useUserInfo();
    const [stoppages, setStoppages] = useState(0);
    // const [showObj, setShowObj] = useState({})

const {
    register,
    handleSubmit,
    unregister, 
    formState: { errors },
  } = useForm()
  if (loading || useUserInfoLoading || !dashboardUser) {
    return <Loading />;
  }

  const { email, name, operatorName, role } = dashboardUser;

//   COMMENT: formatting date
  function formatTime(time) {
    const hours = parseInt(time.split(":")[0], 10);
    const minutes = time.split(":")[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    const convertedHours = hours % 12 || 12; // Convert to 12-hour clock
  
    return `${convertedHours}:${minutes} ${ampm}`;
  }

  const validateDivisibleByFour = (value) => {
    if (value % 4 !== 0) {
      return 'Value must be divisible by 4';
    }
    return true;
  };

// COMMENT: Contact US
//   const sendEmail = () =>{
    
// const templateMessage = {
//     from_name: 'utsho',
//     from_email: 'freeusers.any@gmail.com',
//     to_name: 'customer_name',
//     message: 'hello world'
// }
// emailjs.send("service_comvsnn", "template_bedekpp", templateMessage, "IbE99_D54fFDxeO3V").then(response=>{
//     console.log('mail sent successfully.', response)
// }).catch(error =>{
//     console.log(error);
// })
//   }

  const handleForm = async (data) => {
    console.log(data);
    // console.log(Object.keys(data));

    const stoppagesArray = [];
    const stations = [];

    for (let index = 1; index <= stoppages; index++) {
        const stoppageName = data?.[`stoppageName${index}`]
        const stoppage = {
            name: stoppageName.charAt(0).toUpperCase()+stoppageName.slice(1),
            price: parseInt(data?.[`price${index}`]),
            upTime: formatTime(data?.[`upTime${index}`]),
            downTime: formatTime(data?.[`downTime${index}`])
        };
        stations.push({name:stoppage.name});
        stoppagesArray.push(stoppage);
    }

    const busInfo = {
        Operator: operatorName,
        name: data?.name,
        route: data?.route,
        contact: data?.contact,
        availableSeats: Array.from(Array(parseInt(data?.availableSeats)).keys()).map(i => i + 1),
        stoppages: stoppagesArray,
        available:true
    }
    console.log(busInfo);
    const res = await axios.post(`http://localhost:5000/add-new-bus/${email}`,{busInfo, stations})
    console.log(res?.data)
    if(res?.data?.stationInserted) toast.success('New stations added.');
    if(res?.data?.busResult?.insertedId) toast.success('New bus added.');
  };


  return (
    <div
      className="w-full h-full"
      style={{
        background:
          "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
      }}
    >

      <h1 className="text-2xl text-center sticky top-0 bg-purple-700 text-white font-bold mb-5 py-2">
        {operatorName}
      </h1>
      <div className="ms-10 w-full flex justify-center items-center">
        <form onSubmit={handleSubmit(handleForm)}>
          <table className="w-full">
            <tbody>
            <tr>
              <td className="">
                {/* COMMENT: Operator name */}
                <div className="join mx-2 my-2">
                  <div className="flex items-center">
                    <div className="">
                      <span className="btn join-item">Operator Name:</span>
                    </div>
                    <div className="join-item rtl">
                      <input
                        className="input input-bordered rounded-s-none"
                        placeholder="Operator Name"
                        value={operatorName}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </td>

              <td>
                {/* COMMENT: Bus name */}
                <div className="join mx-2 my-2">
                  <div className="flex items-center">
                    <div className="">
                      <span className="btn join-item">Bus Name:</span>
                    </div>
                    <div className="join-item rtl">
                      <input
                        className="input input-bordered rounded-s-none"
                        placeholder="Bus Name"
                        {...register("name", {
                            required: {
                              value: true,
                              message: "Enter bus name (Model)",
                            },
                          })}
                          />
                    </div>
                  </div>
                </div>
                {errors?.name?.type === "required" && (
                    <p className="bg-red-500 text-white rounded-md px-2 w-fit font-bold ms-5">{errors.name?.message}</p>
                )}
              </td>
            </tr>

            <tr>
              <td>
                {/* COMMENT: Route */}
                <div className="join mx-2 my-2">
                  <div className="flex items-center">
                    <div className="">
                      <span className="btn join-item">Route:</span>
                    </div>
                    <div className="join-item rtl">
                      <input
                        className="input input-bordered rounded-s-none"
                        placeholder="Route name"
                        {...register("route", {
                            required: {
                              value: true,
                              message: "Enter Route",
                            },
                        })}
                      />
                    </div>
                  </div>
                </div>
                {errors?.route?.type === "required" && (
                    <p className="bg-red-500 text-white rounded-md px-2 w-fit font-bold ms-5">{errors.route?.message}</p>
                )}
              </td>
              

              <td>
                {/* COMMENT: Total Seat */}
                <div className="join mx-2 my-2">
                  <div className="flex items-center">
                    <div className="">
                      <span className="btn join-item">Total Seat:</span>
                    </div>
                    <div className="join-item rtl">
                      <input
                      type="number"
                        className="input input-bordered rounded-s-none"
                        placeholder="Total seat (divisible by 4)"
                        {...register("availableSeats", {
                            required: {
                              value: true,
                              message: "Enter number of seat",
                            },
                            min:{
                                value: 40,
                                message: "Minimum 40 seat required"
                            },
                            max:{
                                value: 60,
                                message: "You can add max 60 seats"
                            },
                            validate: validateDivisibleByFour
                        })}
                      />
                    </div>
                  </div>
                </div>
                {(errors?.availableSeats?.type === "required" || errors?.availableSeats?.type === "min" || errors?.availableSeats?.type === "max"|| errors?.availableSeats?.type === "validate") && (
                    <p className="bg-red-500 text-white rounded-md px-2 w-fit font-bold ms-5">{errors.availableSeats?.message}</p>
                )}
              </td>
            </tr>

            <tr>
            <td>
                {/* COMMENT: Contact */}
                <div className="join mx-2 my-2">
                  <div className="flex items-center">
                    <div className="">
                      <span className="btn join-item">Contact:</span>
                    </div>
                    <div className="join-item rtl">
                      <input
                        className="input input-bordered rounded-s-none"
                        placeholder="Enter Contact"
                        {...register("contact", {
                            required: {
                              value: true,
                              message: "Contact is required",
                            },
                            pattern: {
                              value: /^(0||880||\+880)?1[3-9]\d{8}$/,
                              message: "Enter valid mobile number!",
                            },
                        })}
                      />
                    </div>
                  </div>
                </div>
                {(errors?.contact?.type === "required" || errors?.contact?.type === "pattern") && (
                    <p className="bg-red-500 text-white rounded-md px-2 w-fit font-bold ms-5">{errors.contact?.message}</p>
                )}
              </td>
            </tr>

            <div className="w-full">
              {/* COMMENT: Stoppage Details */}
              <div className="w-full">
                {Array.from(Array(stoppages).keys()).map((index) => {
                  return <div key={index} id={++index} className=" w-[500px]  mt-10">
                      <h1 className="font-bold bg-indigo-300 rounded-md p-2">
                        Stoppage {index}
                      </h1>
                      {/* COMMENT: Stoppage Name and price from sylhet */}
                      <tr>
                        <td className="">
                          {/* COMMENT: Stoppage name */}
                          <div className="join mx-2 my-2">
                            <div className="flex items-center">
                              <div className="">
                                <span className="btn join-item">
                                  Stoppage Name:
                                </span>
                              </div>
                              <div className="join-item rtl">
                                <input
                                  className="input input-bordered rounded-s-none"
                                  placeholder="Stoppage Name"
                                  {...register(`stoppageName${index}`, {
                                    required: {
                                      value: true,
                                      message: `Enter stoppage-${index} name`,
                                    },
                                })}
                                />
                              </div>
                            </div>
                          </div>
                          {errors?.[`stoppageName${index}`]?.type === "required" && (
                            <p className="bg-red-500 text-white rounded-md px-2 w-fit font-bold ms-5">{errors?.[`stoppageName${index}`]?.message}</p>)}
                        </td>

                        <td>
                          {/* COMMENT: Price */}
                          <div className="join mx-2 my-2">
                            <div className="flex items-center">
                              <div className="">
                                <span className="btn join-item">Price:</span>
                              </div>
                              <div className="join-item rtl">
                                <input
                                type="number"
                                  className="input input-bordered rounded-s-none"
                                  placeholder="Price from remote area"
                                  {...register(`price${index}`, {
                                    required: {
                                      value: true,
                                      message: `Enter stoppage-${index} price`,
                                    },
                                    min:{
                                        value:0,
                                        message: "negative value not allowed"
                                    }
                                })}
                                />
                              </div>
                            </div>
                          </div>
                          {(errors?.[`price${index}`]?.type === "required" || errors?.[`price${index}`]?.type === "min") && (
                            <p className="bg-red-500 text-white rounded-md px-2 w-fit font-bold ms-5">{errors?.[`price${index}`]?.message}</p>)}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          {/* COMMENT: UpTime */}
                          <div className="join mx-2 my-2">
                            <div className="flex items-center">
                              <div className="">
                                <span className="btn join-item">UpTime:</span>
                              </div>
                              <div className="join-item rtl">
                                <input
                                type="time"
                                  className="input input-bordered rounded-s-none"
                                  placeholder="Enter Uptime"
                                  {...register(`upTime${index}`, {
                                    required: {
                                      value: true,
                                      message: `Enter stoppage-${index} upTime`,
                                    },
                                })}
                                />
                              </div>
                            </div>
                          </div>
                          {errors?.[`upTime${index}`]?.type === "required" && (
                            <p className="bg-red-500 text-white rounded-md px-2 w-fit font-bold ms-5">{errors?.[`upTime${index}`]?.message}</p>)}
                        </td>

                        <td>
                          {/* COMMENT: DownTime */}
                          <div className="join mx-2 my-2">
                            <div className="flex items-center">
                              <div className="">
                                <span className="btn join-item">DownTime:</span>
                              </div>
                              <div className="join-item rtl">
                                <input
                                type="time"
                                  className="input input-bordered rounded-s-none"
                                  placeholder="Enter Downtime"
                                  {...register(`downTime${index}`, {
                                    required: {
                                      value: true,
                                      message: `Enter stoppage-${index} downTime`,
                                    },
                                })}
                                />
                              </div>
                            </div>
                          </div>
                          {errors?.[`downTime${index}`]?.type === "required" && (
                            <p className="bg-red-500 text-white rounded-md px-2 w-fit font-bold ms-5">{errors?.[`downTime${index}`]?.message}</p>)}
                        </td>
                      </tr>
                      {/* COMMENT: DELETE STOPPAGE */}
                      {/* <span onClick={()=>{
                        const newObj = showObj;
                        newObj[`${index}`] = true;
                        setShowObj(newObj)
                      }} className="btn btn-primary">Delete</span> */}
                    </div>
                  ;
                })}
              </div>

              <span
                className="btn glass mt-10 text-white font-bold"
                onClick={() => setStoppages(stoppages + 1)}
              >
                Add Stoppage
              </span>
            </div>
            </tbody>
          </table>
          <div className="w-full flex justify-center mb-10">
            <button className="btn btn-warning">Add Bus</button>
          </div>
        </form>
      </div>
      {/* <span onClick={sendEmail} className="btn btn-primary">send email</span> */}
    </div>
  );
};

export default AddNewBus;
