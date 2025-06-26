// components/OrderDetail.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
export default function OrderDetail() {
  return (
    <div className="flex-1 bg-[#F8F9FC] p-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm flex gap-6">
        {/* Side Image */}
        <div className="h-full rounded-xl bg-gray-300" />

        {/* Content Area */}
        <div className="flex-1">
          {/* Order Number */}
          <div className="flex gap-20 mb-8">
            {/* Left Image */}
            <div className="w-[200px] h-[200px] bg-[#979797] rounded-xl mt-20" />

            {/* Right Content */}
            <div className="flex-1">
              {/* Order Number */}
              <div className="flex items-center mb-6">
                <h2 className="text-[46px]  font-semibold text-[#1E4E79]">
                  ORDER NO. 100057
                </h2>
                <span className="text-[14px] text-[#233B6E] bg-[#EDF5FF] border border-[#233B6E] px-4 ml-4 rounded-full">
                  ORDER CONFIRMED
                </span>
              </div>

              {/* Loomiz Team & Manufacturer Assigned */}
              <div className="grid grid-cols-2 gap-10 mb-6">
                {/* Loomiz Team */}
                <div>
                  <h4 className="text-[#3F72AF] font-[NSmedium]  font-semibold text-[22px]">
                    LOOMIZ TEAM
                  </h4>
                  <p className=" font-[NSregular]">Name</p>
                  <p className="font-[NSregular]">Phone No</p>
                </div>

                {/* Manufacturer Assigned */}
                <div>
                  <h4 className="text-[#3F72AF] font-[NSmedium]  font-semibold   mb-1 text-[22px]">
                    MANUFACTURER ASSIGNED
                  </h4>
                  <p className="  font-[NSregular]">Assigned to</p>
                  <p className="font-[NSregular]">Capability</p>
                  <p className="font-[NSregular]">Forecasted time</p>
                </div>
              </div>

              {/* Details & Lead Time */}
              <div className="grid grid-cols-2 gap-10">
                {/* Details */}
                <div>
                  <h4 className="text-[#3F72AF] font-[NSmedium] font-semibold mb-1 text-[22px]">
                    DETAILS
                  </h4>
                  <div className="flex gap-45">
                    <p className="font-[NSregular]">No. of Pieces</p>
                    <p className="font-[NSregular]">Lead Team</p>
                  </div>
                  <div className="flex gap-60">
                    <p className="font-[NSregular]">Price</p>
                    <p className="font-[NSregular]">Lead Team</p>
                  </div>
                </div>

                {/* Lead Time */}
                <div></div>
              </div>
            </div>
          </div>

          {/* Design Section */}
          <div className="mt-12">
            <h4 className="text-[#194185] font-bold mb-4 text-[32px]">
              DESIGN
            </h4>

            <div className="flex gap-10">
              {/* Design Image */}
              <div className="w-[400px] h-[300px] rounded-[40px] bg-[#979797]" />

              {/* Color & Sizes */}
              <div className="flex-1 space-y-6">
                {/* Colours */}
                <div>
                  <h4 className="text-[#3F72AF] font-[NSmedium] font-semibold mb-2 text-[20px] ">
                    COLOURS
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-[20px] h-[20px]   bg-[#979797]" />
                        <span className="text-sm font-semibold font-[NSregular] text-gray-700">
                          #FFFFFF
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h4 className="text-[#3F72AF] font-[NSmedium]  font-semibold mb-2 text-[20px]">
                    SIZES
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {["XL", "L", "M", "S", "XS"].map((size) => (
                      <div key={size} className="flex items-center gap-2">
                        <div className="w-[20px] h-[20px]  bg-[#979797]" />
                        <span className="font-[NSregular] font-semibold">
                          {size}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* View Progress Button */}
                <div className="mt-6 flex justify-end">
                  <Link href={`/order-progress`}>
                    <button className="bg-[#4A80E2] text-white text-sm px-12 py-2 rounded-full hover:bg-[#3a6bc7] transition">
                      View Progress
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
