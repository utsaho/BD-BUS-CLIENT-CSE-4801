import { useState } from "react";
import bangladeshFlag from "../../../assets/Images/Backgrounds/BD-FLAG.png";
import toast from "react-hot-toast";
import axios from "axios";
const Contact = () => {
    const backgroundDesign = "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))";

    
    

    const handleSubmit = async (event) =>{
        event.preventDefault();
        const messageData = { name : event.target.name.value, email : event.target.email.value, message : event.target.message.value}
        const res = await axios.post('http://localhost:5000/contact', {messageData});
        if(res?.data?.email) toast.success('Email sent successfully.')
        event.target.name.value = "";
        event.target.email.value = "";
        event.target.message.value = "";
    }
    
  return (
    <div className="w-full h-full bg-slate-300">
      <div className="w-full h-full bg-base-100 rounded-lg">
        <h1
          className="text-5xl font-bold text-center p-10 "
          style={{
            backgroundImage: `url(${bangladeshFlag})`,
            backgroundRepeat: "no-repeat",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            backgroundPosition: "center",
            backgroundPositionX: "53%",
            backgroundSize: "50%",
          }}
        >
          Contact now
        </h1>

        <form className="flex justify-center flex-col gap-3 items-center border-2 border-indigo-600 p-10 rounded-lg w-fit self-center mx-auto shadow-2xl" onSubmit={handleSubmit}>
          <div className="">
            <div className="join w-full">
              <div className="indicator" >
                <span className="btn join-item">Name:</span>
              </div>
              <div className="w-full">
                <input
                  type="text"
                  className="input input-bordered join-item w-96"
                  placeholder="Enter your name"
                  name="name"
                  required
                />
              </div>
            </div>
          </div>

          <div className="">
            <div className="join w-full">
              <div className="indicator">
                <span className="btn join-item">Email:</span>
              </div>
              <div className="w-full">
                <input
                  type="email"
                  className="input input-bordered join-item w-96"
                  placeholder="Enter your email"
                  name="email"
                  required
                />
              </div>
            </div>
          </div>

          <div className="">
            <span className="btn btn-join w-96 self-start">
              Message:
            </span>
          </div>

          <div className="w-full flex justify-center items-center">
            <textarea
              placeholder="Enter your message"
              className="textarea textarea-bordered textarea-lg w-full max-w-xs"
              name="message"
              required
            ></textarea>
          </div>
          <input type="submit" className="btn" value="Submit" style={{background:backgroundDesign, color:'white'}} />
        </form>


      </div>
    </div>
  );
};

export default Contact;
