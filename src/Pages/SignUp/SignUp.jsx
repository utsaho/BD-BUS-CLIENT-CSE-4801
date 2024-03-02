import { useForm } from "react-hook-form";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { AuthContext } from "../../providers/AuthProvider";
import Loading from "../../Components/Loading/Loading";
import {
  LoadCanvasTemplate,
  loadCaptchaEnginge,
  validateCaptcha,
} from "react-simple-captcha";
import toast, { Toaster } from "react-hot-toast";
import { getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import backgroundImage from "../../assets/Images/Backgrounds/signup_background.jpg";

const SignUp = () => {
  const [loginDisable, setLoginDisable] = useState(true);
  const [agree, setAgree] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const { createUser, loading, setLoading, setUser, logOut } =
    useContext(AuthContext);
  const captchaRef = useRef();
  const check = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const auth = getAuth();

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  //Functions
  const handleCaptcha = (event) => {
    const captchaValue = captchaRef.current.value;
    if (validateCaptcha(captchaValue, false) == true) {
      setLoginDisable(false);
    } else {
      setLoginDisable(true);
    }
    if (event.target.id == "reload_href") captchaRef.current.value = "";
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const checked = () => {
    setAgree(!agree);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const formSubmit = async ({ email, password, name }) => {
    console.log(email, password, name);
    setAgree(false);
    setLoginDisable(true);
    document.getElementById("reload_href").click();
    await createUser(email, password)
      .then((result) => {
        const resultUser = result.user;
        setUser(resultUser);
        console.log(resultUser);
        <Toaster />;

        updateProfile(auth.currentUser, {
          displayName: name,
        });

        sendEmailVerification(resultUser).then(() => {
          toast.success("Email verification sent");
        });
        logOut();
        toast.error("Verify and login");

        navigate(from, { replace: true });
      })
      .catch((error) => {
        const message = error.essage;
        toast.error(message.split("/")[1].split(")")[0]);
        <Toaster />;
        setLoading(false);
      });
    reset();
  };
  //   if (loading) {
  //     return <Loading></Loading>;
  //   }
  return (
    <div>
      {/* {loading && <Loading></Loading>} */}
      <PageTitle title="Signup" />
      <div
        className="py-12 bg-fixed"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          //   background:
          // "linear-gradient(to right, rgb(58,117,183), rgb(118,80,175))",
        }}
      >
        <div className="hero min-h-screen flex justify-center items-center">
          <div className="rounded-lg flex-shrink-0 lg:max-w-lg w-96 shadow-2xl bg-base-100 my-0 py-0">
            <form className="card-body" onSubmit={handleSubmit(formSubmit)}>
              <h2 className="text-2xl text-center uppercase text-purple-700 font-bold">
                Registration
              </h2>

              <div className="form-control">
                <label className="label my-0 py-0">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="input input-bordered"
                  {...register("name", {
                    required: {
                      value: true,
                      message: "You must provide your name!",
                    },
                  })}
                />
                {errors?.name?.type === "required" && (
                  <span className="text-red-500">{errors.name?.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label my-0 py-0">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Your email"
                  className={`input input-bordered ${
                    errors.email ? "input-error" : ""
                  }`}
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-red-500">email is required</span>
                )}
              </div>

              <div className="form-control relative">
                <label className="label my-0 py-0">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type={passwordShown ? "text" : "password"}
                  placeholder="Password"
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
                    <span className="text-red-500">
                      {errors.password?.message}
                    </span>
                  )}
                  <input
                    type="checkbox"
                    onClick={togglePassword}
                    className="toggle toggle-sm absolute right-3 top-8"
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text" onClick={handleCaptcha}>
                    <LoadCanvasTemplate />
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Type Captcha"
                  className={`input input-bordered `}
                  name="captcha"
                  ref={captchaRef}
                  onKeyUp={handleCaptcha}
                />
              </div>
              <div className="form-control">
                <div className="flex">
                  <div className="mt-0.5">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-accent checkbox-sm"
                      ref={check}
                      checked={agree}
                      id="policy"
                      onChange={() => checked()}
                    />
                  </div>
                  <div className="">
                    <span className="ml-2">
                      Accept{" "}
                      <span className="text-blue-500">
                        terms and conditions
                      </span>
                    </span>
                  </div>
                </div>
                {/* {error?.message.split("/")[1].split(")")[0] && (
                  <span className="text-red-700 mt-0">
                    {error?.message.split("/")[1].split(")")[0]}
                  </span>
                )} */}
                <button
                  className={`btn btn-primary text-white mt-1 ${
                    // COMMENT: FIXED: agree => !agree
                    // COMMENT: FIXED: !loginDisable => loginDisable
                    !agree || loginDisable ? "btn-disabled" : ""
                  }`}
                  style={{
                    background:
                      "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
                  }}
                >
                  Register
                </button>
              </div>
              <span>
                Already have an account?{" "}
                <Link to="/login" className="text-green-600 font-bold">
                  Login here
                </Link>{" "}
              </span>

              {/* Social Login */}
            </form>
            <SocialLogin buttonEnable={agree}></SocialLogin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
