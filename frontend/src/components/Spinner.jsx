import { Oval } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div>
      <Oval
        height={20}
        width={20}
        color="#fff"
        visible={true}
        ariaLabel="oval-loading"
      />
    </div>
  );
};

export default Spinner;
