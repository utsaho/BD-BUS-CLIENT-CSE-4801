import Search from "../../SearchBus/Search/Search";
import busSearchBackground from "../../../assets/Images/Backgrounds/busSearchBackground.jpg";
import busBG from "../../../assets/Images/Backgrounds/Home/busBookingBackground2.jpg";
import Contact from "../../Shared/Contact/Contact";
import Marquee from "react-fast-marquee";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../../Components/Loading/Loading";
import PageTitle from "../../../Components/PageTitle/PageTitle";
const Home = () => {
  const backgroundDesign =
    "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))";
  const { data, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await axios("http://localhost:5000/home");
      return res?.data;
    },
  });

  console.log(data);

  if (isLoading) return <Loading />;
  const operators = data?.operators;
  const routes = data?.routes;
  return (
    <div className="relative">
        <PageTitle title={'Home'}/>
      <div
        className="relative"
        style={{
          backgroundImage: `url(${busBG})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full h-full bg-black bg-opacity-50 absolute" />
        <Search white={true} />
      </div>

      <div className="mt-10">
        <div className="w-fit mx-auto">
          <h1 className="text-center text-4xl uppercase">
            Available <span className="text-red-500">routes</span> and{" "}
            <span className="text-green-700">operators</span>
          </h1>
          <div
            className="divider h-1 my-0"
            style={{ background: backgroundDesign }}
          />
        </div>
        <div
          className="h-96 flex flex-col justify-center relative bg-fixed mt-10 text-slate-300"
          style={{
            backgroundImage: `url(${busSearchBackground})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="bg-black bg-opacity-60 w-full h-full absolute" />
          <Marquee pauseOnHover="true">
            {operators.map((operator) => {
              return (
                <h1 key={operator.id} className="text-3xl font-bold my-3 mx-10">
                  {operator}
                </h1>
              );
            })}
          </Marquee>
          <Marquee direction="right" pauseOnHover="true">
            {routes.map((route) => {
              return (
                <h1 key={route.id} className="text-3xl font-bold my-3 mx-10">
                  {route}
                </h1>
              );
            })}
          </Marquee>
        </div>
      </div>

      <Contact />
    </div>
  );
};

export default Home;
