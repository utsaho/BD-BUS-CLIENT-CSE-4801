import { Link, useLocation, useNavigate } from "react-router-dom";
import PageTitle from "../../Components/PageTitle/PageTitle";
import SocialLogin from "../SocialLogin/SocialLogin";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import toast, { Toaster } from "react-hot-toast";
import backgroundImage from "../../assets/Images/Backgrounds/background_fig.gif";

const Login = () => {
  const { signIn, logOut, resetPassword } = useContext(AuthContext);
  const captchaRef = useRef();
  const refEmail = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const [loginDisable, setLoginDisable] = useState(true);
  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleForm = (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    signIn(email, password)
      .then((userInfo) => {
        const user = userInfo.user;
        if (!user?.emailVerified) {
          logOut();
          return toast.error("Please verify you email first.");
        }
        // COMMENT: saving user date
        const userData = {name: user.displayName, email: user.email, role: "user"}
        fetch('http://localhost:5000/users',{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify(userData)
        });
        toast.success(`Welcome ${user?.displayName}`);
        console.log(`to: ${from}`);
        console.log(`user Data: ${userData}`);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const message = error.message;
        toast.error(message.split("/")[1].split(")")[0]);
        <Toaster />;
      });
  };

  const handleCaptcha = () => {
    const captchaValue = captchaRef.current.value;
    if (validateCaptcha(captchaValue, false) == true) {
      setLoginDisable(false);
    } else {
      setLoginDisable(true);
    }
  };

  const handlePasswordReset = () => {
    const email = refEmail.current.value;
    resetPassword(email)
      .then(() => {
        toast.success("Check you email.");
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  };

  return (
    <div>
      <PageTitle title="Login" />
      <div
        className="bg-fixed"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          //   background:
          // "linear-gradient(to right, rgb(58,117,183), rgb(118,80,175))",
        }}
      >
        <div className="hero min-h-screen flex justify-center items-center">
          <div className="rounded-lg flex-shrink-0 lg:max-w-lg w-96 shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleForm}>
              <h2 className="text-2xl text-center uppercase text-purple-700 font-bold">
                Login here
              </h2>
              <div className="form-control my-0 py-0">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="text"
                  placeholder="email"
                  className={`input input-bordered`}
                  name="email"
                  ref={refEmail}
                />
                <label className="label my-0 py-0"></label>
              </div>
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type={passwordShown ? "text" : "password"}
                  placeholder="password"
                  className={`input input-bordered `}
                  name="password"
                />
                <input
                  type="checkbox"
                  onClick={togglePassword}
                  className="toggle toggle-sm absolute right-3 top-12"
                />
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
              <div>
                <label className="label font-bold mb-0 pb-0">
                  <span
                    onClick={handlePasswordReset}
                    className="label-text-alt cursor-pointer link-hover"
                  >
                    Forgot password?
                  </span>
                </label>
              </div>
              <div className="form-control">
                <input
                  type="submit"
                  value="Login"
                  className={`btn btn-primary text-white ${
                    // COMMENT: FIXED: loginDisable => !loginDisable
                    !loginDisable || "btn-disabled"
                  }`}
                  style={{
                    background:
                      "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
                  }}
                />
              </div>
              <span>
                New User?
                <Link to="/signup" className="text-green-600 font-bold ml-2">
                  Sign up
                </Link>
              </span>
            </form>
            <SocialLogin buttonEnable={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
