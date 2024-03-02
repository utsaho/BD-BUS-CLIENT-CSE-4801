import { useContext, useEffect, useMemo, useState } from "react";
import defaultImage from "../../../assets/Images/defaultImage.png";
import { AuthContext } from "../../../providers/AuthProvider";
import Loading from "../../../Components/Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
const UserProfile = () => {
  const { user, loading } = useContext(AuthContext);
  const [changePhoto, setChangePhoto] = useState(false);
  const [image, setImage] = useState("");   // COMMENT: contain img path of uploading
  const [newImage, setNewImage] = useState("");     // COMMENT: contain new uploaded url
  const [updateProfile, setUpdateProfile] = useState(false);
//   const [storedUser, setStoredUser] = useState({});
  const { displayName: name,photoURL, email, phoneNumber } = user;
  const [axiosSecure] = useAxiosSecure();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

//   useEffect(()=>{
//     const fun = async()=>{
        // const result = await axiosSecure.get(`/user/${email}`);
        // // console.log(result?.data);
        // setStoredUser(result?.data)
//     }
//     fun();
// },[email, axiosSecure, updateProfile]);

const {data, isLoading, refetch} = useQuery({
    queryKey:[email],
    queryFn: async()=>{
        const result = await axiosSecure.get(`/user/${email}`);
        // console.log(result?.data);
        // setStoredUser(result?.data)
        return result?.data;

    }
});
console.log(data);

useEffect(()=>{
    setValue('name',data?.name)
    setValue('phone',data?.phone)
    setValue('email',email)
    setValue('address',data?.address)
}, [data]);
    
  if ((loading || !user) || isLoading) return <Loading />;



  const uploadPhoto = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);
    const url = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_imagebb_API
    }`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success('Photo uploaded');
        setNewImage(data?.data?.display_url);
        setUpdateProfile(true);
      });
  };
  
  const handleForm = async(event) => {
    const {name, email, phone, address} = event;
    const newData = {
        name,
        email,
        phone,
        address,
        photoURL: (newImage||data?.photoURL) || photoURL
    }
    console.log("MADE DATA: ", newData);
    const res = await axiosSecure.post(`/updateProfile/${email}`,{newData});
    res?.data?.acknowledged && toast.success('Profile Updated');
    refetch()
    setUpdateProfile(false);
  };

  const handleDisable = (event) =>{
    event.target.parentNode.childNodes[0].disabled = false;
    setUpdateProfile(true)
  }
  

//   console.log(data);
  return (
    <div className="flex justify-center">
      <div className="card w-[90%] bg-base-100 shadow-xl">
        <div className="card-body w-full">
          <div className="avatar">
            <div className="w-24 rounded-xl">
              <img src={data?.photoURL || defaultImage} />
            </div>
          </div>

          <div className="">
            {changePhoto && (
              <div className="mb-5">
                <input
                  type="file"
                  name="profile"
                  onChange={(event) => setImage(event.target.files[0])}
                  className="file-input w-full max-w-xs file-input-bordered"
                />
                <span
                  onClick={uploadPhoto}
                  className="btn ms-3 text-white"
                  style={{
                    background:
                      "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
                  }}
                >
                  Upload
                </span>
              </div>
            )}
            <span
              className="btn w-fit text-white"
              onClick={() => setChangePhoto(true)}
              style={{
                background:
                  "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
              }}
            >
              Change Photo
            </span>
          </div>

          <p className="underline underline-offset-8">
            <span className="text-red-700 font-bold uppercase">Important:</span>
            Any changes in the profile section only applicable aff 'Update now'
            button clicked down below. Please be careful, changes may effect you
            ticket booking.
          </p>
          {/* <h2 className="card-title">Card title!</h2> */}

          <div className="w-3/6">
            <form className="" onSubmit={handleSubmit(handleForm)}>
              {/* COMMENT: Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="input input-bordered w-80"
                    disabled
                    {...register("name", {
                        required:{
                            value: true,
                            message: "You must provide you name."
                        }
                    })}
                  />{" "}
                  <span className="ms-2 btn glass" onClick={handleDisable}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </span>
                  {errors?.name?.type === "required" && (
                  <span className="text-red-500">{errors.name?.message}</span>
                )}
                </div>
              </div>
              {/* COMMENT: Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder={email}
                  className="input input-bordered w-80"
                  disabled
                  {...register('email')}
                />
              </div>

              {/* COMMENT: Phone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    className="input input-bordered w-80"
                    disabled
                    {...register("phone", {
                        required: {
                          value: true,
                          message: "Phone is required",
                        },
                        pattern: {
                          value: /^(0||880||\+880)?1[3-9]\d{8}$/,
                          message: "Enter valid mobile number!",
                        },
                      })}
                  />{" "}
                  <span className="ms-2 btn glass" onClick={handleDisable}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </span>
                  {(errors?.phone?.type === "pattern" ||
                  errors?.phone?.type === "required") && (
                  <span className="text-red-500">{errors.phone?.message}</span>
                )}
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Address"
                    className="input input-bordered w-80"
                    disabled
                    {...register('address',{
                        required:{
                            value: true,
                            message: 'Address is required.'
                        }
                    })}
                  />{" "}
                  <span className="ms-2 btn glass" onClick={handleDisable}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </span>
                  {errors?.address?.type === "required" && (
                  <span className="text-red-500">{errors.address?.message}</span>
                )}
                </div>
              </div>

              {/* COMMENT: SUBMIT BUTTON */}
              <div className="form-control mt-6">
                <button className="" id="submitButton"></button>
              </div>
            </form>
          </div>
          <div className="card-actions justify-end">
            <button
              className="btn ms-3 text-white"
              disabled={!updateProfile}
              onClick={() => {
                document.getElementById("submitButton").click();
              }}
              style={{
                background:
                  "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
              }}
            >
              Update now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
