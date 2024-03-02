import { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import Loading from "../../../Components/Loading/Loading";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import background from '../../../assets/Images/Backgrounds/card-background.jpg';

const UpdatePassword = () => {
  const { user, userUpdatePassword, loading, logOut } = useContext(AuthContext);
  const [passwordShown, setPasswordShown] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  if (loading) {
    return <Loading></Loading>;
  }
  if(!user){
    return <Navigate to='/login'/>
  }
  // console.log(user);
  const updatePassword = (event) => {
    userUpdatePassword(event.password).then(()=>{
        toast.success("Password Updated. Please login again");
        logOut();
    }).catch(errors=>{
        toast.error(errors?.message || "Unwanted error occurs");
    });
    reset();
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
      <div className="rounded-xl shadow-lg" style={{backgroundImage:`url(${background})`, backgroundRepeat:'no-repeat', backgroundSize:'cover', backgroundPosition:'center'}}>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold">
              Update Password
            </h2>
          </div>
          <form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit(updatePassword)}
          >
            <div className="rounded-md shadow-sm -space-y-px">

              <div className="form-control relative">
                <label className="label my-0 py-0">
                  <span className="label-text mt-2">Password</span>
                </label>
                <input
                  type={passwordShown ? "text" : "password"}
                  placeholder="New Password"
                  className={`input input-bordered ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                      message: "Atleast 6 character 1 number and 1 character",
                    },
                  })}
                />
                <label className="label my-0 py-0">
                  {(errors?.password?.type === "required" || errors?.password?.type === "pattern") && (
                    <span className="text-red-500 font-bold">
                      {errors.password?.message}
                    </span>
                  )}
                  <input
                    type="checkbox"
                    onClick={togglePassword}
                    className="toggle toggle-sm absolute right-3 top-11"
                  />
                </label>
              </div>

              <div className="form-control relative">
                <label className="label my-0 py-0">
                  <span className="label-text mt-2">Confirm Password</span>
                </label>
                <input
                  type={passwordShown ? "text" : "password"}
                  placeholder="Confirm Password"
                  className={`input input-bordered ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  {...register("confirmPassword", {
                    required: {
                      value: true,
                      message: "Confirm password is required",
                    }
                  })}
                />
                <label className="label my-0 py-0">
                  {(errors?.confirmPassword?.type === "required" || (watch('password') !== watch('confirmPassword'))) && (
                    <span className="text-red-500 font-bold">
                      {errors.confirmPassword?.message || 'Password does not match'}
                    </span>
                  )}
                </label>
              </div>

            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={watch('password') !== watch('confirmPassword')}
                className="btn text-white border-0"
                style={{
                    background:
                      "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
                  }}
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
