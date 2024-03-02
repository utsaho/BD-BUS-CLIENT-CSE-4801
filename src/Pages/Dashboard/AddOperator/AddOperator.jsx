import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Components/Loading/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUserInfo from "../../../hooks/useUserInfo";
import defaultImage from "../../../assets/Images/defaultImage.png";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddOperator = () => {
  const [loading, useUserInfoLoading, dashboardUser] = useUserInfo();
  const [axiosSecure] = useAxiosSecure();
  const [makeAdminUser, setMakeAdminUser] = useState({});
  const backgroundDesign =
    "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))";
  const { data: users, isLoading, refetch} = useQuery({
    queryKey: [dashboardUser],
    queryFn: async () => {
      const res = await axiosSecure.get(`/getUsers/${dashboardUser?.email}`);
      return res?.data;
    },
  });

//   FIXME: Handle pause admin
//   const handlePause = () =>{
//     if(!makeAdminUser?.email) return;
//     console.log('Target user: ', makeAdminUser);
//   }

//   useEffect(()=>{
//     handlePause();
//   }, [makeAdminUser]);
  
  
  if (loading || useUserInfoLoading || isLoading) return <Loading />;
  //   console.log(users);


  const handleAdmin = async(event) => {
    const operatorName = event.target.operatorName.value;
    const res = await axiosSecure.post(`/superAdmin/${dashboardUser?.email}`,{
        operatorName, makeAdminUser
    })
    if(res?.data?.modifiedCount) toast.success('Operator added successfully');
    else toast.error('something went wrong');
    refetch();
  };

  return (
    <div className="my-5 h-full bg-base-100 p-10 rounded-2xl">
      <div className="overflow-x-auto">
        <table className="table">
          <thead
            className="text-white uppercase text-center"
            style={{ background: backgroundDesign }}
          >
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Address</th>
              <th>Operator Name</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => {
              return (
                <tr key={index}>
                  <th>{++index}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={user?.photoURL || defaultImage}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{user?.name}</div>
                        <div className="text-sm opacity-50">
                          {user?.phone || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {user?.email}
                    <br />
                    <span
                      className="badge badge-ghost badge-sm text-white p-2 font-bold"
                      style={{ background: backgroundDesign }}
                    >
                      {user?.address || "N/A"}
                    </span>
                  </td>
                  {user?.email !== dashboardUser?.email && (
                    <td className="text-center">
                      {user?.operatorName || (
                        <span
                          className="btn text-white btn-error"
                          onClick={() => {
                            setMakeAdminUser(user);
                            document
                              .getElementById("makeAdminModal")
                              .showModal();
                          }}
                        >
                          Make admin
                        </span>
                      )}
                    </td>
                  )}
                  {/* {user?.operatorName && (
                    <th>
                      <span
                        className="btn text-white text-center"
                        style={{ background: backgroundDesign }}
                        onClick={()=>{
                            setMakeAdminUser(user)
                        }}
                      >
                        Pause
                      </span>
                    </th>
                  )} */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <dialog id="makeAdminModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{makeAdminUser?.name}</h3>
          <p className="py-4">Email: {makeAdminUser?.email}</p>
          <form method="dialog" onSubmit={handleAdmin}>
            <label className="input input-bordered flex items-center gap-2">
              Operator Name:
              <input
                type="text"
                className="grow p-0 m-0"
                placeholder="Enter Operator name"
                name="operatorName"
                required
              />
            </label>
            <div className="modal-action">
              <span
                className="btn text-white"
                onClick={() => {
                  if (confirm("Are you sure?"))
                    document.getElementById("proceed").click();
                }}
                style={{background:backgroundDesign}}
              >
                Submit
              </span>
              <button id="proceed" />
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default AddOperator;
