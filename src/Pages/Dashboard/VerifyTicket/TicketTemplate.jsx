import background from '../../../assets/Images//Backgrounds/card-background.jpg';
const TicketTemplate = (busData, passengerDetails, persons, transactionID) => {
    const splitedDate = new Date(busData?.date).toDateString().split(" ");
    
  return (
    <div
      className={`ms-5`}
    >
      <div className="card w-[700px]" id="passengerInformation" style={{background:`url(${background})`, backgroundSize:'cover', backgroundRepeat:'no-repeat'}}>
        <div className="card-body">
          <h2 className="card-title">
            {busData?.bus?.Operator}{" "}
          </h2>
          <small className="font-semibold text-green-700">
            {busData?.bus?.name}
          </small>
          <small className="font-semibold">{busData?.bus?.route}</small>

          <div className="divider my-[-10px]" />

          <p className="my-[-5px]">
            <span className="font-bold">Name:</span> {passengerDetails?.name}
          </p>
          <p className="my-[-5px]">
            <span className="font-bold">Phone:</span> {passengerDetails?.phone}
          </p>
          <p className="my-[-5px]">
            <span className="font-bold">Email:</span> {passengerDetails?.email}
          </p>
          <p className="my-[-5px]">
            <span className="font-bold">TransactionID:</span> {transactionID}
          </p>

          <p className="mb-[-5px]">
            <span className="font-bold">Destination:</span> {busData?.from} -{" "}
            {busData?.to}{" "}
          </p>
          <p
            className={`my-[-5px]`}
          >
            <span className="font-bold text-green-700">Date and Time:</span>{" "}
            {splitedDate[0]}, {splitedDate[2]} {splitedDate[1]} {splitedDate[3]}{" "}
            [{" "}
            <span className="text-green-700 font-bold">{busData?.depTime}</span>{" "}
            ]
          </p>

          <p className="font-bold mb-[-10px] mt-[5px] text-green-700">
            Passenger Details: {persons?.length}
          </p>
          <div>
            {persons?.map((person, index) => (
              <p key={index} className="mb-2">
                <span className="font-semibold">Name:</span> {person?.name},{" "}
                <span className="font-semibold">Age:</span> {person?.age},{" "}
                <span className="font-semibold">Gender:</span> {person?.gender},{" "}
                <span className="font-semibold">SeatNo:</span> {person?.seatNo}.{" "}
              </p>
            ))}
          </div>
          <div id="signature">
            <h1 className="text-center bg-orange-300 font-bold mt-10">
              Verified by BD BUD website
            </h1>
            <small>Print Date: {new Date().toDateString()}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketTemplate;
