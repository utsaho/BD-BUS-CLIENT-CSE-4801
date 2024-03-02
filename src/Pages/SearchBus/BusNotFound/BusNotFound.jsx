import { faFaceFrown } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const BusNotFound = () => {
    return (
        <div className="w-full h-[500px] flex flex-col items-center justify-center bg-slate-300">
            <FontAwesomeIcon size="10x" className="w-full" icon={faFaceFrown}/>
            <h1 className="text-3xl text-center uppercase">bus not found</h1>
            <span className="btn mt-5 text-white" style={{background:"linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",}}><Link to='/search-bus'>Try Again</Link> </span>
        </div>
    );
};

export default BusNotFound;