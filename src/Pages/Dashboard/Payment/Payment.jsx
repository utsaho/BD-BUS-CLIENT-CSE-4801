import { Elements } from "@stripe/react-stripe-js";
import PageTitle from "../../../Components/PageTitle/PageTitle";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import bgImg from "../../../assets/Images/Backgrounds/card-background.jpg";
import { useData } from "../../../providers/DataContext";
import Loading from "../../../Components/Loading/Loading";

const stripePromise = loadStripe(import.meta.env.VITE_stripePK);
const Payment = () => {
    const { data } = useData();
    if(!data){
        console.log('no data found');
        return <Loading/>
    }
    // console.log('Payment Data: ', data);
    // console.log('refetchFunction: ', refetch);
    const totalPayment = data?.busData?.cost * data?.persons.length;
    if(!totalPayment){ 
        console.log('Payment: ', totalPayment);
        return <Loading/>
    }
    console.log(totalPayment);
  return (
    <div className="w-full h-full flex items-center">
      <div className="max-w-screen-sm mx-auto justify-center items-center w-1/2 p-10 rounded-3xl"
          style={{ backgroundImage: `url(${bgImg})`, backgroundRepeat:'no-repeat', backgroundSize:'cover' }}>
        <div className="backdrop-blur-md w-full h-full p-10 rounded-lg">
          {/* BUG: BDT to Dollar */}
          <PageTitle title="Payment"></PageTitle>
          <Elements stripe={stripePromise}>
            <CheckoutForm fare={totalPayment}></CheckoutForm>
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Payment;
