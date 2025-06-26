import React from "react";

export default function Home() {
  return (
    <div className="ml-[100px]  p-10 min-h-screen  flex items-start font-[NSregular]">
      {/* Left Side */}
      <div className="flex flex-col space-y-6 ">
        {/* Welcome Text */}
        <div>
          <h1 className="text-[50px] font-semibold text-[#194185] font-[Smedium]">Welcome !</h1>
          <p className=" text-[#ACACAC] font-[NSregular]">
            View progress on your current order
          </p>
        </div>

        {/* Upcoming Box */}
        <div className="bg-gray-200 rounded-xl p-4  ">
          <p className="text-gray-500 font-medium text-lg ">Upcoming,</p>
          <div className="flex items-end mt-1 ml-4">
            <span className="text-[62px] font-medium text-[#1b2a41] leading-none">24</span>
            <span className="ml-1  text-gray-700 mb-1">Hours  remaining </span>
          </div>
          <p className=" text-gray-600 mt-1 ml-4 leading-snug items-center text-center ">
            before shipment of <br />
            order <strong>100057</strong>
          </p>
        </div>

        {/* Schedule */}
        <div className="mt-4">
  <h3 className="text-md font-medium text-gray-500 mb-2">Schedule</h3>
  <ul className="space-y-4 text-gray-800">
    {[
      { date: "20", label: "Production", order: "100057", qty: "500" },
      { date: "25", label: "Shipment", order: "9057", qty: "250" },
      { date: "31", label: "Shipment", order: "100057", qty: "500" },
      { date: "05", label: "Payment", order: "100057", qty: "500" },
    ].map((item, index) => (
      <li key={index} className="flex">
        {/* Date (left column) */}
        <div className="w-10 text-[28px] font-medium">{item.date}</div>

        {/* Details (right column) */}
        <div>
          <div>
            {item.label} · <span  className="text-[#313B44]"> Order {item.order}</span>
          </div>
          <div className="text-sm text-[#979797]">
            Quantity : {item.qty} Pieces
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>

      </div>

      {/* Right Side */}
      <div className="ml-30 mt-20   rounded-xl p-6 text-center">
        <p className=" text-gray-400 ">Track Order No.</p>
        <h2 className="text-[38px] font-medium text-gray-800">100057</h2>
        <p className=" text-black mt-2">
          red velvet, round neck T-Shirts
        </p>
        <p className=" text-[#979797] mt-1">Quantity : 500 Pieces</p>
      </div>
    </div>
  );
}
