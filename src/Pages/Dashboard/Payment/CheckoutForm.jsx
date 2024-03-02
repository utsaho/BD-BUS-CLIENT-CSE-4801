import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../providers/AuthProvider";
import { DataContext } from "../../../providers/DataContext";
import Loading from "../../../Components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// TODO: use axios secure   80-7
// Verify JWT

const CheckoutForm = ({ fare }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const {data} = useContext(DataContext);
  const navigate = useNavigate();
  const [axiosSecure] = useAxiosSecure();
  
  useEffect(() => {
      fetch("http://localhost:5000/payment-intent", {
          method: "POST",
          headers: {
              "content-Type": "application/json",
            },
            body: JSON.stringify({ fare: fare }),
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }, []);
    const user = data?.user;
    if(!data || !user) return <Loading></Loading>
console.log(data);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (card === null) return;
    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setCardError(error?.message);
      toast.error(error?.message);
      console.log("error", error);
    } else {
      setCardError("");
      //   console.log("payment Method", paymentMethod);
    }
    setProcessing(true);
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "unknown",
            name: user?.displayName || "unknown",
          },
        },
      });
    if (confirmError) {
      toast.error(confirmError?.message);
    }
    setProcessing(false);
    if (paymentIntent?.status === "succeeded") {
        // console.log(paymentIntent);
        // console.log(data);
        const {busData, persons, passengerDetails} = data;
            const res = await axiosSecure.post('http://localhost:5000/check',{
            busData, persons, passengerDetails, 'transactionID': paymentIntent.id
        });
        toast.success(
        `Your payment is successful. TransactionID: ${paymentIntent.id}`
        );
        const seatNos = persons?.map(person => person.seatNo).join(', ');
        toast.loading('Please wait...')
        const makingPDF = await axios.post('http://localhost:5000/makePDF',{
            busData, persons, 'transactionID':paymentIntent.id, name:data?.user?.displayName, email: data?.user?.email, seatNos
        })
        toast.loading('Please wait...')
        console.log('makingPDF data: ', makingPDF.data);
        const gettingURL = await axiosSecure.get(`http://localhost:5000/fileUpload/${paymentIntent.id}`);
        const pdfURL = `https://drive.google.com/file/d/${gettingURL?.data?.data?.id}/view`;
        const res2 = await axiosSecure.post('http://localhost:5000/postEmail',{
            busData, persons, 'transactionID':paymentIntent.id, name:data?.user?.displayName, email: data?.user?.email, pdfURL
        });
        res2.statusText === 'OK' && toast.loading('Please check confirmation email.')
        res.statusText === 'OK' && navigate('/dashboard/verify-ticket');
    }
};
  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      {cardError && <p className="text-red-600">{cardError}</p>}
      <div className="text-center">
        <button
          className="btn btn-sm mt-5 text-white w-1/2"
          type="submit"
          disabled={!stripe || !clientSecret || processing}
          style={{
            background:
              "linear-gradient(to left, rgb(58,117,183), rgb(118,80,175))",
          }}
        >
          Pay
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
