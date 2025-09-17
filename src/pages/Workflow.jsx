import React from "react";
import image from "../asset/images/workflow.png";

function WorkFlow() {
  return (
    <div className="self-stretch  inline-flex flex-col justify-start items-start gap-2.5 font-['Inter']">
    <div className="self-stretch flex flex-col justify-start items-start gap-8">
        <div className="self-stretch flex-col md:flex-row w-full inline-flex justify-start items-center gap-4 md:gap-16">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                <h1 className="self-stretch justify-start text-[#292929] text-4xl font-bold font-['Inter'] leading-10">Workflows & Automations</h1>
                <p className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">Streamline your operations with customizable automated processes. Set up email alerts, SMS notifications, and admin task workflows to reduce manual work and improve efficiency.</p>
            </div>
            <div className="px-6 w-full md:w-fit py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-1 overflow-hidden">
                <button className="justify-start w-full text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug text-white">New Automation</button>
            </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-center gap-6">
            <div className="self-stretch flex-col md:flex-row w-full inline-flex justify-start items-center gap-4">
                <div className="flex-1 w-full p-4 bg-[#FFFFFF] rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch inline-flex justify-start items-center gap-4">
                        <p className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">Active Workflows</p>
                    </div>
                    <div className="self-stretch ">
                        <p className="justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">12</p>
                    </div>
                </div>
                <div className="flex-1 w-full p-4 bg-[#FFFFFF] rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch inline-flex justify-start items-center gap-4">
                        <p className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">Workflow Success Rate</p>
                    </div>
                    <div className="self-stretch inline-flex justify-start items-center gap-2">
                        <p className="justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">98%</p>
                    </div>
                </div>
                <div className="flex-1 w-full p-4 bg-[#FFFFFF] rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch inline-flex justify-start items-center gap-4">
                        <p className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">Last Run</p>
                    </div>
                    <div className="self-stretch inline-flex justify-start items-center gap-2">
                        <p className="justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">5</p>
                        <div className="w-28 flex justify-start items-center gap-1">
                            <span className="flex-1 justify-center text-[#3D3D3D] text-xs font-normal font-['Inter'] leading-none">mins ago</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 w-full p-4 bg-[#FFFFFF] rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch inline-flex justify-start items-center gap-4">
                        <p className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">Pending Automations</p>
                    </div>
                    <div className="self-stretch inline-flex justify-start items-center gap-2">
                        <p className="justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">2</p>
                        <div className="flex-1 flex justify-start items-center gap-1">
                            <span className="flex-1 text-right justify-center text-[#E61E4D] text-sm font-bold font-['Inter'] leading-tight" >Perform</span>
                        </div>
                    </div>
                </div>
            </div>
          <img className="w-[1022px] h-[598px]  " src={image} />
        </div>
      </div>
    </div>
  );
}

export default WorkFlow;
