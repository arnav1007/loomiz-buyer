"use client";
import React, { useState, useEffect, useRef } from 'react';

function Charts() {
  const tabs = ["Quote", "Order", "Production", "Shipment"];
  const [activeTab, setActiveTab] = useState("Shipment");

  const [messages, setMessages] = useState([
    { sender: "receiver", text: "we will be fine with 7 days extension thank you" },
    { sender: "sender", text: " we can only postpone upto 1 week, 10 days is not acceptable." },
    { sender: "receiver", text: "please manage extension of 7-10 days without discount" },
    { sender: "sender", text: " we cannot accept we will need to apply a 3% discount" },
    { sender: "receiver", text: "its being resolved right now, could cause a delay of 10days" },
    { sender: "receiver", text: "Dear anya, we experienced rib shortage for approximately 500 pieces." },
  ]);

  const chatRef = useRef(null);

  // const loadOlderMessages = () => {
  //   const older = [
  //     { sender: "sender", text: "Earlier update from our end." },
  //     { sender: "receiver", text: "Please review the PO terms again." },
  //   ];
  //   setMessages(prev => [...older, ...prev]);
  // };

  useEffect(() => {
    const container = chatRef.current;
    const handleScroll = () => {
      if (container.scrollTop === 0) {
        loadOlderMessages();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex w-full h-[90vh] bg-white rounded-xl shadow-md overflow-hidden font-[NSregular] mb-[30px]">
      {/* LEFT: Main Chat Panel */}
      <div className="flex flex-col w-2/3 px-6 py-4 mt-4">
        {/* Order Header */}
        <div className="w-full bg-[#3F72AF] text-white font-medium py-2 px-4 rounded-md mb-4">
          Order 12345
        </div>

        {/* Status Tabs */}
        <div className="grid grid-cols-4 bg-gray-100 rounded-md overflow-hidden mb-6 font-[Sregular]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-gray-800 text-white rounded-full"
                  : "text-gray-600 hover:bg-gray-200 hover:rounded-full"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Chat Section */}
        <div
          ref={chatRef}
          className="flex-1 flex flex-col-reverse gap-4 mb-2 overflow-y-auto pt-2"
        >
          {/* Load older messages */}
          {/* <div
            onClick={loadOlderMessages}
            className="text-center text-sm text-blue-600 underline cursor-pointer mb-2"
          >
            Click here to see older messages
          </div> */}

          {/* Chat Messages */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 ${
                msg.sender === "sender" ? "justify-end" : ""
              }`}
            >
              {msg.sender === "receiver" && (
                <img
                  src="/LlogoBlue.svg"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-contain"
                />
              )}
              <div
                className={`px-4 py-2 max-w-sm rounded-xl text-sm border ${
                  msg.sender === "sender"
                    ? "bg-blue-100 text-blue-900 border-blue-200"
                    : "bg-white text-[#49454F] border-gray-300"
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === "sender" && (
                <img
                  src="/image.png"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {/* Input Field */}
        <div className="flex items-center gap-2 pt-3">
          <img src="/PlusIcon.svg" alt="plus" className="w-6 h-6 cursor-pointer" />
          <img src="/EmojiIcon.svg" alt="emoji" className="w-6 h-6 cursor-pointer" />
          <div className="relative flex-1">
            <img
              src="/InputTextIcon.svg"
              alt="attach"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
            />
            <input
              type="text"
              placeholder="Type a message"
              className="w-full pl-10 pr-16 py-2 h-12 rounded-full border border-black text-sm focus:outline-none"
            />
            <img
              src="/VoiceIcon.svg"
              alt="voice"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"
            />
            <img
              src="/SendIcon.svg"
              alt="send"
              className="absolute right-10 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center">
        <div className="w-0.5 h-[80vh] bg-gray-400"></div>
      </div>

      {/* RIGHT: Recent Orders */}
      <div className="w-1/3 p-4 overflow-y-auto mt-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <h2 className="text-md font-bold mb-2 ml-2">Conversations</h2>
        <div className="space-y-4">
          {[1234, 2345, 3456, 4567, 5678].map((id) => (
            <div
              key={id}
              className="flex items-center justify-between text-sm hover:bg-white px-2 py-2 rounded-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-gray-200 rounded-full"></span>
                <div>
                  <div className="font-bold">Order {id}</div>
                  <div className="text-black text-xs">Supporting line text...</div>
                </div>
              </div>
              <div className="text-xs text-gray-700">10 min</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Charts;
