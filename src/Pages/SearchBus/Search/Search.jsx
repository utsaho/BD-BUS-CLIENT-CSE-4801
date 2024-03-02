import { useForm } from "react-hook-form";
import useStation from "../../../hooks/useStation";
import { useState } from "react";
import Loading from "../../../Components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../Components/PageTitle/PageTitle";

const Search = ({white=false}) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    // formState: { isSubmitting }    ,
  } = useForm();
  const [stations, loading] = useStation();
  const [fromSuggestion, setFromSuggestion] = useState([]);
  const [toSuggestion, setToSuggestion] = useState([]);
  const backgroundDesign = "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))";

  const searchSubmit = (event) => {
    const { from, to, date } = event;
    navigate(`/booking/search?from=${from}&to=${to}&date=${date}`);
  };
console.log(white);
  const handleInput = (inputField) => {
    const fromValue = watch(inputField);

    const suggestions = stations
      .filter((station) =>
        station.name.toLowerCase().startsWith(fromValue.toLowerCase())
      )
      .map((station) => station?.name);

    if (inputField == "from") setFromSuggestion(suggestions);
    if (inputField == "to") setToSuggestion(suggestions);

    if (inputField == "from" && watch("to"))
      setFromSuggestion(suggestions.filter((item) => item !== watch("to")));
    if (inputField == "to" && watch("from"))
      setToSuggestion(suggestions.filter((item) => item !== watch("from")));

    if (watch("from") == "") setFromSuggestion([]);
    if (watch("to") == "") setToSuggestion([]);
  };

  const handleClickSuggestion = (inputField) => {
    setFromSuggestion([]);
    setToSuggestion([]);
    const clicked = event.target.innerText;
    setValue(inputField, clicked);
  };

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <div>
        <PageTitle title={'Search'}/>
        {!white ? <h1 className="text-4xl font-bold text-center pt-10 relative">
        <span
        style={{
            background: "linear-gradient(to right,#E72D41,#00684D)",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
        }}
        >
        Explore{" "}
        </span>
        <span
        style={{
            background: "linear-gradient(to right, #00684D,#E72D41)",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
        }}
        >
        Bangladesh
        </span>
        </h1>:<h1 className="text-4xl font-bold text-white text-center pt-10 relative">Explore Bangladesh</h1>}
      <div className="hero min-h-screen xl:mt-[-90px]">
        <div className="hero-content w-full flex-col lg:flex-row-reverse">
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit(searchSubmit)}>
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">From</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter City"
                  autoComplete="off"
                  className="input input-bordered"
                  onKeyUp={() => handleInput("from")}
                  {...register("from")}
                  required
                />
              </div>
              <div
                className={`relative w-full bg-yellow-400 ${
                  fromSuggestion.length || "hidden"
                }`}
              >
                <ul className="absolute bg-slate-100 w-full p-2">
                  {fromSuggestion.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => handleClickSuggestion("from")}
                      className="cursor-pointer hover:text-white hover:bg-green-700 px-2"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">To</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter City"
                  autoComplete="off"
                  className="input input-bordered"
                  onKeyUp={() => handleInput("to")}
                  {...register("to")}
                  required
                />
              </div>
              <div className="relative"></div>
              <div
                className={`relative w-full bg-yellow-400 ${
                  toSuggestion.length || "hidden"
                }`}
              >
                <ul className="absolute bg-slate-100 w-full p-2">
                  {toSuggestion.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => handleClickSuggestion("to")}
                      className="cursor-pointer hover:text-white hover:bg-green-700 px-2"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Journey Date</span>
                </label>
                <input
                  type="date"
                  min={(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).toISOString().split("T")[0]}
                  placeholder="Enter city"
                  className="input input-bordered"
                  {...register("date")}
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn text-white uppercase" style={{background:backgroundDesign}}>booking</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
