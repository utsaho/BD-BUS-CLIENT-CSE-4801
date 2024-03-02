import { useQuery } from "@tanstack/react-query";


const useSearchBus = ({ from, to, date, currentTime }) => {
    // const [loading, setLoading] = useState(true);
    // const [availableBus, setAvailableBus] = useState(true);
    // useEffect(() => {
    //     fetch("http://localhost:5000/search", {
    //       method: "POST",
    //       headers: {
    //         "content-type": "application/json",
    //       },
    //       body: JSON.stringify({ from, to, date, currentTime }),
    //     })
    //       .then((res) => res.json())
    //       .then((data) => {
    //         setAvailableBus(data);
    //         setLoading(false);
    //       });
    //   }, [from, to, currentTime, date]);
      const {data:availableBus, isLoading:loading, refetch} = useQuery({
        queryKey:[from, to, date],
        queryFn: async()=>{
            return await fetch("http://localhost:5000/search",{
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ from, to, date, currentTime }),
            }).then(res=>res.json())
        },
        refetchOnWindowFocus: true,
        refetchIntervalInBackground:true,
        refetchInterval:1000
      });

      
      
      return [availableBus, loading, refetch]
    };
export default useSearchBus;