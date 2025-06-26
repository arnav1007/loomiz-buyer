export default function Account() {
    return (
      <div className="ml-[290px] mt-[65px] p-6 bg-[#F9F9F9] min-h-[calc(100vh-65px)]">
        <div className="bg-white p-14 rounded-lg shadow-sm max-w-6xl mx-auto">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="/ProfileImage.svg"
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover"
            />
            <h2 className="text-[32px] mt-2 font-[Smedium]">Sonam Kumari</h2>
          </div>
  
          {/* Section - Account Detail */}
          <Section title="ACCOUNT DETAIL">
            <div className="grid grid-cols-1 gap-4">
              <Input label="Company Name" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {[
                ["Contact Person", "text"],
                ["Phone No.", "text"],
                ["Alt Phone No.", "text"],
                ["Email", "email"],
                ["GST/Tax Id", "text"],
                ["Industry Type", "text"],
              ].map(([label, type]) => (
                <Input key={label} label={label} type={type} />
              ))}
            </div>
          </Section>
  
          {/* Section - Address Detail */}
          <div className="mb-10">
            <h3 className="text-[20px] font-semibold mb-4 font-[NSmedium]">
              ADDRESS DETAIL
            </h3>
  
            {/* Subsection: Company Address */}
            <SubSection title="Company Address" />
            <EditWrapper>
              <AddressForm />
            </EditWrapper>
  
            {/* Subsection: Shipping Address 1 */}
            <SubSection title="Shipping Address - 1" />
            <EditWrapper>
              <AddressForm />
            </EditWrapper>
  
            {/* Subsection: Shipping Address 2 */}
            <SubSection title="Shipping Address - 2" />
            <EditWrapper>
              <AddressForm />
            </EditWrapper>
          </div>
  
          {/* Section - Financial Detail */}
          <Section title="FINANCIAL DETAIL">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Bank Name" />
              <Input label="Branch Name" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Input label="State" />
              <Input label="Country" />
              <Input label="Pincode/Zip" />
            </div>
  
            {/* Upload Section */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Upload label="Bank Certificate" />
              <Upload label="Import/Export License" />
            </div>
          </Section>
  
          {/* Save Button */}
          <div className="flex justify-center mt-10">
            <button className="bg-[#3F72AF] text-white px-10 py-2 rounded-[20px]">
              SAVE
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Reusable Components
  
  const Section = ({ title, children }) => (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4 ">
        <h3 className="text-[20px] font-semibold font-[NSmedium]">{title}</h3>
        <button className="text-[#604C45] text-sm font-[Sbold] underline ">
          Edit
        </button>
      </div>
      {children}
    </div>
  );
  
  const SubSection = ({ title }) => (
    <div className=" font-[Smedium] text-[#171721]  mb-2 mt-6 font-[20px]">
      {title}
    </div>
  );
  
  const EditWrapper = ({ children }) => (
    <div className="relative">
      <div className="absolute right-0 -top-6">
        <button className="text-[#604C45] text-sm font-[Sbold] underline ">
          Edit
        </button>
      </div>
      {children}
    </div>
  );
  
  const Input = ({ label, type = "text" }) => (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1 font-[NSmedium]">
        {label}*
      </label>
      <input
        type={type}
        placeholder={label}
        className="border border-gray-300 rounded px-3 py-2 text-sm font-[NSregular]"
      />
    </div>
  );
  
  const AddressForm = () => (
    <>
      <div className="grid grid-cols-1 gap-4">
        <Input label="Apartment No./Street Address" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Input label="Town/City" />
        <Input label="State/Country" />
        <Input label="Pincode/Zip" />
      </div>
    </>
  );
  
  const Upload = ({ label }) => (
    <div className="flex flex-col w-full sm:w-1/2">
      <label className="text-sm text-gray-600 mb-2">{label}</label>
  
      <div className="border  border-gray-300 rounded-md p-4  ">
        <div className="flex items-center gap-2 mb-2 justify-center  border border-gray-300 bg-white shadow-md rounded-md p-3 w-60 m-auto ">
          <img src="/uploadLogo.svg" alt="upload icon" className="w-6 h-6  " />
          <button className="text-sm text-[#000000] font-medium text-center">
            Upload from Browse/Drive
          </button>
        </div>
  
        {/* <input type="file" className="text-sm text-gray-500 " /> */}
        <p className="text-sm text-gray-500  mt-1 text-center ">
          You can upload files in .pdf format only (up to 10 MB)
        </p>
      </div>
    </div>
  );
  