import { DNA } from "react-loader-spinner";
const Loading = () => {
  return (
    <div className="flex items-center justify-center cursor-wait fixed z-[100] w-full h-full top-0 left-0">
      <DNA
        visible={true}
        height="80"
        width="80"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </div>
  );
};

export default Loading;
