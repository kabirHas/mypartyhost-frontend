import React from "react";

const Security = () => {
  return (
    <>
      <div className="self-stretch flex flex-col justify-start items-start gap-8 w-100%">
        <div className=" flex flex-col justify-start items-start gap-1">
          <h2 className="self-stretch justify-start text-[#292929] text-4xl font-bold font-['Inter'] leading-10">
            Security & Backup
          </h2>
          <p className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
            Mange Platform security and Backup
          </p>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-5">
          <div className="self-stretch inline-flex justify-start  gap-8">
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-4">
              <div className="self-stretch inline-flex justify-between items-center">
                <h3 className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                  Log in History
                </h3>
                <div className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                  <button className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="self-stretch bg-[#FFFFFF] rounded-2xl  outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-center items-start overflow-hidden">
                <div className="flex-1 inline-flex flex-col justify-start items-end">
                  <div className="self-stretch px-3 py-2 border-b border-[#656565] inline-flex justify-center items-center gap-2.5">
                    <div className="flex-1 justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      Admin
                    </div>
                  </div>
                  <div className="self-stretch h-12 px-3 py-2 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="w-6 h-6 bg-zinc-300 rounded-full" />
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      User1
                    </div>
                  </div>
                  <div className="self-stretch h-12 px-3 py-2 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="w-6 h-6 bg-zinc-300 rounded-full" />
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      User2
                    </div>
                  </div>
                  <div className="self-stretch h-12 px-3 py-2 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="w-6 h-6 bg-zinc-300 rounded-full" />
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      User3
                    </div>
                  </div>
                  <div className="self-stretch h-12 px-3 py-2 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="w-6 h-6 bg-zinc-300 rounded-full" />
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      User4
                    </div>
                  </div>
                </div>
                <div className="w-48 self-stretch inline-flex flex-col justify-start items-end">
                  <div className="self-stretch px-3 py-2 border-b border-[#3D3D3D] inline-flex justify-center items-center gap-2.5">
                    <div className="flex-1 justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      Last Login
                    </div>
                  </div>
                  <div className="self-stretch h-12 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      2023-10-01 10:15 AM
                    </div>
                  </div>
                  <div className="self-stretch h-12 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      2023-10-01 11:30 AM
                    </div>
                  </div>
                  <div className="self-stretch h-12 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      2023-10-01 09:45 AM
                    </div>
                  </div>
                  <div className="self-stretch h-12 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      2023-10-01 08:20 AM
                    </div>
                  </div>
                </div>
                <div className="flex-1 self-stretch inline-flex flex-col justify-start items-end">
                  <div className="self-stretch px-3 py-2 border-b border-[#3D3D3D] inline-flex justify-center items-center gap-2.5">
                    <div className="flex-1 justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      IP
                    </div>
                  </div>
                  <div className="self-stretch h-12 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      192.168.1.1
                    </div>
                  </div>
                  <div className="self-stretch h-12 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      192.168.1.2
                    </div>
                  </div>
                  <div className="self-stretch h-12 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      192.168.1.3
                    </div>
                  </div>
                  <div className="self-stretch h-12 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      192.168.1.4
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-start items-start gap-4">
              <div className="self-stretch inline-flex justify-between items-center">
                <h3 className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                  Recent System Activities
                </h3>
                <div className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                  <button className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="self-stretch h-60 bg-[#FFFFFF] rounded-2xl outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-center items-start overflow-hidden">
                <div className="w-54 self-stretch inline-flex flex-col justify-start items-end">
                  <div className="self-stretch px-3 py-2 border-b border-[#3D3D3D] inline-flex justify-center items-center gap-2.5">
                    <div className="flex-1 justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      Date
                    </div>
                  </div>
                  <div className="self-stretch flex-1 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      April 20, 2025, 08:20 AM
                    </div>
                  </div>
                  <div className="self-stretch flex-1 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      April 20, 2025, 07:50 AM
                    </div>
                  </div>
                  <div className="self-stretch flex-1 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      April 19, 2025, 10:00 PM
                    </div>
                  </div>
                  <div className="self-stretch flex-1 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      April 19, 2025, 09:45 PM
                    </div>
                  </div>
                </div>
                <div className="flex-1 self-stretch inline-flex flex-col justify-start items-end">
                  <div className="self-stretch px-3 py-2 border-b border-[#3D3D3D] inline-flex justify-center items-center gap-2.5">
                    <div className="flex-1 justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                      IP
                    </div>
                  </div>
                  <div className="self-stretch flex-1 p-3 border-b border-[#ECECEC] inline-flex justify-end items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Admin John Smith updated payment gateway settings.
                    </div>
                  </div>
                  <div className="self-stretch flex-1 p-3 border-b border-[#ECECEC] inline-flex justify-end items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Admin Olivia Parker approved 3 pending content items.
                    </div>
                  </div>
                  <div className="self-stretch flex-1 p-3 border-b border-[#ECECEC] inline-flex justify-end items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      User Sarah Jones submitted a review for VIP Gala Night.
                    </div>
                  </div>
                  <div className="self-stretch flex-1 p-3 border-b border-[#ECECEC] inline-flex justify-start items-center gap-3">
                    <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      User Emily Roberts updated her profile picture.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch inline-flex justify-start  gap-8">
            <div className="w-[500px] p-4 bg-[#FFFFFF] rounded-2xl  outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex flex-col justify-start items-start gap-4">
              <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Backup & Restore
              </h3>
              <div className="self-stretch inline-flex justify-start items-start gap-6">
                <div className="w-47% inline-flex flex-col justify-start items-start gap-2">
                  <h4 className="self-stretch justify-start text-[#3D3D3D] text-sm font-bold font-['Inter'] leading-tight">
                    Last Backup
                  </h4>
                  <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    <div className="self-stretch flex flex-col justify-start items-start gap-1">
                      <div className="inline-flex justify-start items-center gap-1">
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          Date:
                        </div>
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          April 20, 2025
                        </div>
                      </div>
                      <div className="inline-flex justify-start items-center gap-1">
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          Time:
                        </div>
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          06:00 AM
                        </div>
                      </div>
                      <div className="self-stretch inline-flex justify-start items-center gap-1">
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          Status:
                        </div>
                        <div className="justify-start text-green-700 text-sm font-normal font-['Inter'] leading-tight">
                          Completed Successfully
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
                      <div className="justify-start text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                        Restore Last Backup
                      </div>
                    </button>
                  </div>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <h4 className="self-stretch justify-start text-[#3D3D3D] text-sm font-bold font-['Inter'] leading-tight">
                    Next Scheduled Backup
                  </h4>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch flex flex-col justify-start items-start gap-1">
                      <div className="inline-flex justify-start items-center gap-1">
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          Date:
                        </div>
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          April 21, 2025
                        </div>
                      </div>
                      <div className="inline-flex justify-start items-center gap-1">
                        <div className="flex justify-start items-center gap-1">
                          <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            Time:
                          </div>
                          <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            06:00 AM
                          </div>
                        </div>
                      </div>
                      <div className="inline-flex justify-start items-center gap-1">
                        <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                          Backup Frequency:
                        </div>
                        <div className="p-1 rounded-[48px] outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-1">
                          <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            Weekly
                          </div>
                          <i className="ri-arrow-down-s-line text-zinc-800"></i>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg outline-1 border-1 outline-offset-[-1px] border-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden">
                      <div className="justify-start text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
                        Initiate Manual Backup
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 h-56 relative bg-gradient-to-b from-rose-600/20 to-black/20 rounded-2xl outline-1 outline-offset-[-1px] outline-[#ECECEC] backdrop-blur-[5px] overflow-hidden">
              <div className="left-[132px] top-[97px] absolute inline-flex flex-col justify-start items-center gap-2">
                <h3 className="justify-start text-black text-2xl font-bold font-['Inter'] leading-7">
                  Other Necessary Info
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Security;