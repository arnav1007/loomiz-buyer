import SampleConfirmation from "./SampleConfirmation";
import FabricInhoused from "./FabricInhoused";
import FabricQualityCheck from "./FabricQualityCheck";
import Production from "./Production";
import Packaging from "./Packaging";
import QualityCheck from "./QualityCheck";
import OutForDelivery from "./OutForDelivery";
import ConfirmPaymentTerms from "./ConfirmPaymentTerms";

const OrderTrackingStepsHome = () => {
  return (
    <div className="space-y-4 bg-white">
      <div className="h-100 w-[95%] m-auto bg-[#979797] rounded-[40px] "></div>
      <div className=" items-center mb-6 ml-10 mt-10">
        <h2 className="text-[46px]  font-semibold text-[#1E4E79]">
          ORDER NO. 100057
        </h2>
        <span className="text-[14px] text-[#233B6E] bg-[#EDF5FF] border border-[#233B6E] px-4  rounded-full">
          ORDER CONFIRMED
        </span>
      </div>
      <div>
      <SampleConfirmation />
      <FabricInhoused />
      <FabricQualityCheck />
      <Production />
      <Packaging />
      <QualityCheck />
      <OutForDelivery />
      <ConfirmPaymentTerms />
      </div>
    </div>
  );
};

export default OrderTrackingStepsHome;
