import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useStation = () => {
    // const [stations, setStations] = useState([]);
    // const [loading, setLoading] = useState(true);
    // useEffect(()=>{
    //     fetch('http://localhost:5000/stations').then(res=>res.json()).then(data=>{
    //         // console.log(data);   
    //         setStations(data);
    //         setLoading(false);
    //     });
    // },[]);

    const {data: stations, isLoading: loading} = useQuery({
        queryKey:["stations"],
        queryFn: async()=>{
            return await fetch('http://localhost:5000/stations').then(res=>res.json());
        }
    });
    return [stations, loading];
};

export default useStation;