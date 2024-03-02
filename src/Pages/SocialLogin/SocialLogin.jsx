import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import googleSVG from "../../assets/Images/SVG/google.svg";
import facebookSVG from "../../assets/Images/SVG/facebook.wine.svg";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
const auth = getAuth();
const SocialLogin = ({ buttonEnable }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const { setUser } = useContext(AuthContext);

  const googleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        setUser(user);
        const userData = {
            name: user.displayName,
            email: user.email,
            role: "user",
        };
        fetch("http://localhost:5000/users", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        toast.success(`Welcome ${user.displayName}`);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const message = error.message;
        toast.error(message.split("/")[1].split(")")[0]);
        // ...
      });
  };

  const facebookSignIn = async () => {
    await signInWithPopup(auth, facebookProvider)
      .then((result) => {
        const user = result.user;
        setUser(user);
        toast.success(`Welcome ${user.displayName}`);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const message = error.message;
        toast.error(message.split("/")[1].split(")")[0]);
      });
  };

  return (
    <div className="pb-5">
      <div className="divider font-bold">OR</div>
      <div className="flex flex-col gap-3 justify-center items-center">
        <button
          onClick={googleSignIn}
          className={`btn bg-slate-200 hover:bg-slate-300 border-none  text-black ${
            buttonEnable || "btn-disabled"
          }`}
        >
          <img width="30px" src={googleSVG} alt="" />
          <span className={`ml-2`}>Continue with google</span>
        </button>
        <button
          onClick={facebookSignIn}
          className={`btn bg-slate-200 hover:bg-slate-300 border-none  text-black ${
            buttonEnable || "btn-disabled"
          }`}
        >
          <img width="70px" className="mx-[-26px]" src={facebookSVG} alt="" />
          <span className={`ml-2`}>Continue with facebook</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
