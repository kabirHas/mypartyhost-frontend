import { useState } from "react";
import { useNavigate } from "react-router-dom";



function StaffPublicProfile() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isActive, setIsActive] = useState(false); 

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };
  
  const sections = [
    {
      title: "ABOUT ME",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      title: "RATES",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      title: "AVAILABLE FOR",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      title: "JOB HISTORY",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-[100%] relative bg-[#F9F9F9] inline-flex flex-col justify-start items-start overflow-hidden">
      <div className="self-stretch px-12 pt-20 pb-40 flex flex-col justify-center items-center gap-2.5">
        <div className="w-full max-w-[1200px] flex flex-col justify-start items-center gap-6">
          <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
            <div onClick={() => navigate(-1)} className="px-3 py-2 rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2">
              <i className="ri-arrow-left-line w-6 h-6 text-[#656565]"></i>
              <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
                Back
              </div>
            </div>
          </div>
          <div className="w-full max-w-[1200px] inline-flex justify-start items-start gap-12">
            <div className="w-[588px] inline-flex flex-col justify-center items-center gap-6">
              <div className="self-stretch flex flex-col justify-center items-center gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                  <img
                    className="self-stretch object-cover object-top h-[630px] relative rounded-lg"
                    src="https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                  <div className="self-stretch inline-flex justify-start items-start gap-1.5">
                    <div className="flex-1 h-28 flex justify-start items-start gap-2">
                      <img
                        className="flex-1 object-cover object-top self-stretch rounded-lg"
                        src="https://images.unsplash.com/photo-1664850432645-15797683286d?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      />
                      <img
                        className="flex-1 object-cover object-top self-stretch rounded-lg"
                        src="https://images.unsplash.com/photo-1712112160412-10020fc6a2f7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      />
                    </div>
                    <div className="flex-1 h-28 flex justify-start items-start gap-2">
                      <img
                        className="flex-1 object-cover object-top self-stretch rounded-lg"
                        src="https://images.unsplash.com/photo-1712112145793-42f05affa760?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      />
                      <img
                        className="flex-1 object-cover object-top self-stretch rounded-lg"
                        src="https://images.unsplash.com/photo-1664763079262-056e908630e1?q=80&w=821&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      />
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-center gap-4 overflow-hidden">
                  <div className="self-stretch h-32 relative">
                    <div className="left-[-434px] top-0 absolute inline-flex justify-start items-center gap-2">
                      <div className="w-[480px] max-w-[480px] min-w-[480px] p-4 bg-[#FFFFFF] outline outline-1 outline-offset-[-1px] outline-[#292929] inline-flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch inline-flex justify-start items-start gap-3">
                          <img
                            className="w-12 h-12 rounded-full"
                            src="https://images.unsplash.com/photo-1664763079262-056e908630e1?q=80&w=821&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          />
                          <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                            <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                              Nicole M.
                            </div>
                            <div className="inline-flex justify-start items-start gap-1.5">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className="ri-star-fill w-4 h-4 text-[#292929]"></i>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          Samantha is an absolute delight! Her presence elevates
                          every event and she makes everything run smoothly.
                        </div>
                      </div>
                      <div className="w-[480px] max-w-[480px] min-w-[480px] p-4 bg-[#FFFFFF] outline outline-1 outline-offset-[-1px] outline-[#292929] inline-flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch inline-flex justify-start items-start gap-3">
                          <img
                            className="w-12 h-12 rounded-full"
                            src="https://images.unsplash.com/photo-1664763079262-056e908630e1?q=80&w=821&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          />
                          <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                            <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                              Nicole M.
                            </div>
                            <div className="inline-flex justify-start items-start gap-1.5">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className="ri-star-fill w-4 h-4 text-[#292929]"></i>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          Samantha is an absolute delight! Her presence elevates
                          every event and she makes everything run smoothly.
                        </div>
                      </div>
                      <div className="w-[480px] max-w-[480px] min-w-[480px] p-4 bg-[#FFFFFF] outline outline-1 outline-offset-[-1px] outline-[#292929] inline-flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch inline-flex justify-start items-start gap-3">
                          <img
                            className="w-12 h-12 rounded-full"
                            src="https://images.unsplash.com/photo-1664763079262-056e908630e1?q=80&w=821&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          />
                          <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                            <div className="self-stretch justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                              Nicole M.
                            </div>
                            <div className="inline-flex justify-start items-start gap-1.5">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className="ri-star-fill w-4 h-4 text-[#292929]"></i>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          Samantha is an absolute delight! Her presence elevates
                          every event and she makes everything run smoothly.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="justify-start text-[#E61E4D] text-base font-normal font-['Inter'] underline leading-snug">
                    SEE MORE
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="inline-flex justify-start items-center gap-4">
                    <div className="flex justify-start items-center gap-2">
                      <div className="flex justify-start items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="ri-star-fill w-4 h-4 text-[#292929]"></i>
                        ))}
                        <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                          5
                        </div>
                      </div>
                      <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] underline leading-snug">
                        (120 Reviews)
                      </div>
                    </div>
                    <div className="w-4 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-[#656565]"></div>
                    <div className="flex justify-start items-center gap-2">
                      <i className="ri-map-pin-line w-5 h-5 text-blue-900"></i>
                      <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Sydney, NSW
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch justify-start text-[#292929] text-6xl font-bold font-['Inter'] leading-[60.60px]">
                      Samantha Lee
                    </div>
                    <div className="self-stretch h-40 p-3 relative outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-start gap-3">
                      <div className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        I’m Samantha—a warm, professional, and versatile hostess
                        with over 4 years of experience in VIP events, corporate
                        functions, and brand promotions. I thrive on creating
                        unforgettable experiences and ensuring every event
                        sparkles with personality and style. 
                      </div>
                      <div className="w-2 h-7 left-[552px] top-[4px] absolute bg-neutral-200 rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-end gap-4 flex-wrap content-end">
                  <div
                    data-property-1="Variant2"
                    className="rounded-lg inline-flex flex-col justify-center items-center gap-2"
                  >
                    <div className="h-8 w-8 rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2.5">
                      <i className="ri-shirt-line  text-[#292929]"></i>
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Bikini/Lingerie
                    </div>
                  </div>
                  <div
                    data-property-1="Variant2"
                    className="rounded-lg inline-flex flex-col justify-center items-center gap-2"
                  >
                    <div className="h-8 w-8 rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2.5">
                      <i className="ri-shirt-line  text-[#292929]"></i>
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Poker Dealer
                    </div>
                  </div>
                  <div
                    data-property-1="Variant2"
                    className="rounded-lg inline-flex flex-col justify-center items-center gap-2"
                  >
                    <div className="h-8 w-8 rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2.5">
                      <i className="ri-shirt-line text-[#292929]"></i>
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Party Hostess
                    </div>
                  </div>
                  <div
                    data-property-1="Variant2"
                    className="rounded-lg inline-flex flex-col justify-center items-center gap-2"
                  >
                    <div className="h-8 w-8 rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2.5">
                      <i className="ri-shirt-line  text-[#292929]"></i>
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Topless Waitress
                    </div>
                  </div>
                  <div
                    data-property-1="Variant2"
                    className="rounded-lg inline-flex flex-col justify-center items-center gap-2"
                  >
                    <div className="h-8 w-8 rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2.5">
                      <i className="ri-shirt-line  text-[#292929]"></i>
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      Brand Promotion
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer"
              onClick={() => setShowModal(true)}
              >
                <div className="justify-start text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug">
                  Book Now/Invite to Event
                </div>
              </div>
              <div className="self-stretch inline-flex justify-start items-center gap-2">
                <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-2">
                  <i className="ri-calendar-check-line w-8 h-8 text-[#292929]"></i>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                    Confirm Booking
                  </div>
                </div>
                <div className="p-1 rounded-lg flex justify-start items-center gap-2.5">
                  <i className="ri-arrow-right-line w-4 h-4 text-[#292929]"></i>
                </div>
                <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                  <i className="ri-chat-3-line w-8 h-8 text-[#292929]"></i>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                    Connect with Hostess
                  </div>
                </div>
                <div className="p-1 rounded-lg flex justify-start items-center gap-2.5">
                  <i className="ri-arrow-right-line w-4 h-4 text-[#292929]"></i>
                </div>
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <i className="ri-money-dollar-circle-line w-8 h-8 text-[#292929]"></i>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                    Pay with Cash on the Day
                  </div>
                </div>
                <div className="p-1 rounded-lg flex justify-start items-center gap-2.5">
                  <i className="ri-arrow-right-line w-4 h-4 text-[#292929]"></i>
                </div>
                <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-2">
                  <i className="ri-cake-3-line w-8 h-8 text-[#292929]"></i>
                  <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                    It’s Party Time!
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    data-property-1="Default"
                    className="self-stretch border-b border-[#ECECEC] flex flex-col justify-start items-start"
                  >
                    <div className="self-stretch p-2 inline-flex justify-start items-center gap-4">
                      <div className="flex-1 justify-start text-[#292929] text-sm font-medium font-['Inter'] leading-tight">
                        {section.title}
                      </div>
                      <i className={`ri-arrow-right-down-line w-5 h-5 text-[#292929]`}></i>
                    </div>
                    <div className={`self-stretch p-2 ${openIndex === index ? "opacity-100" : "opacity-0 h-0"} inline-flex justify-center items-center gap-2.5 transition-all duration-300`}>
                      <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                        {section.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="partners w-full">
        <h3>Featured In</h3>
        <div className="partners-gallary">
          <img
            alt="Partners"
            src="https://res.cloudinary.com/dympqasl5/image/upload/v1749808567/mypartyhost/mgxyktcsdrlxrquye4wr.png"
          />
          <img
            alt="Partners"
            src="https://res.cloudinary.com/dympqasl5/image/upload/v1749808567/mypartyhost/rcdysubqhuvsavfvhjzx.png"
          />
          <img
            alt="Partners"
            src="https://res.cloudinary.com/dympqasl5/image/upload/v1749808567/mypartyhost/qqoikrb4mcyqvwcwrjet.png"
          />
          <img
            alt="Partners"
            src="https://res.cloudinary.com/dympqasl5/image/upload/v1749808567/mypartyhost/sieqnpibsfhushnyoqd3.png"
          />
          <img
            alt="Partners"
            src="https://res.cloudinary.com/dympqasl5/image/upload/v1749808567/mypartyhost/hpvn28nwddpczzxmwakt.png"
          />
        </div>
      </div>
      <div className="w-[100%] mt-4 h-[738px] relative bg-black overflow-hidden">
        <img
          className="w-[747px] object-cover h-[934px] left-[-13px] top-[-44px] absolute"
          src="/images/staffProfiles.png"
        />
        <div className="w-[859px] left-[380px] top-[57px] absolute text-right justify-start">
          <span className="text-white text-7xl font-bold font-['Inter'] uppercase leading-[80px]">
            The Party{" "}
          </span>
          <span className="text-white text-7xl font-thin font-['Inter'] uppercase leading-[80px]">
            Starts Here!
          </span>
        </div>
        <div className="w-[509px] left-[760px] top-[233px] absolute justify-start text-[#FFFFFF] text-base font-normal font-['Inter'] leading-snug">
          Get ready to party with our gorgeous, fun, and flirty hostesses.
          Whether you're keeping it classy or turning up the heat, our stunning
          team is here to make your event unforgettable. Every detail is
          designed to dazzle, ensuring that your celebration is nothing short of
          spectacular.
        </div>
        <div className="w-[498px] left-[735px] top-[578px] absolute inline-flex flex-col justify-center items-end gap-2">
          <div className="self-stretch text-right justify-start">
            <span className="text-[#FFFFFF] text-5xl font-thin font-['Inter'] uppercase leading-10">
              THE EVENT
            </span>
            <span className="text-[#FFFFFF] text-5xl font-extralight font-['Inter'] uppercase leading-10">
              {" "}
            </span>
            <span className="text-[#FFFFFF] text-5xl font-bold font-['Inter'] uppercase leading-10">
              OF THE YEAR
            </span>
          </div>
          <div className="inline-flex justify-start items-center gap-[5px]">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="ri-star-fill w-6 h-6 text-[#F9F9F9]"></i>
            ))}
          </div>
        </div>
      </div>
      <div className="self-stretch h-[938px] relative bg-white overflow-hidden">
        <img
          className="w-[570px] h-[737px] left-[870px] top-[0.09px] absolute"
          src="/images/Rectangle%20637.png"
        />
        <div className="w-[758px] h-[820px] left-[60px] top-[60px] absolute inline-flex flex-col justify-start items-start gap-12">
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <div className="self-stretch justify-start">
              <span className="text-[#292929] text-7xl font-['Poppins'] uppercase leading-[76px]">
                FREQUENTLY <br />
              </span>
              <span className="text-[#292929] text-7xl font-bold font-['Poppins'] uppercase leading-[76px]">
                ASKED QUESTIONS
              </span>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
              {[
                "What is MyPartyHostess?",
                "How do I select the best event staff for my event?",
                "How do I post a job?",
                "How much does it cost to hire event staff?",
                "How do I pay?",
                "What will the event staff wear to my event?",
                "What happens if I need to cancel?",
                "What happens if the event staff cancels?",
              ].map((question, index) => (
                <div
                  key={index}
                  className="self-stretch h-12 px-6 outline outline-1 outline-offset-[-1px] outline-[#292929] inline-flex justify-center items-center gap-2.5 overflow-hidden"
                >
                  <div className="flex-1 flex justify-between items-center">
                    <div className="justify-center text-[#292929] text-xl font-light font-['Inter'] uppercase leading-tight tracking-wide">
                      {question}
                    </div>
                    <i className="ri-arrow-right-down-line w-4 h-4 text-[#292929]"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-80 px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
            <div className="justify-start text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug">
              Get In Touch
            </div>
          </div>
        </div>
      </div>




{showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-end max-w-[1200px] mx-auto">
          <div className="w-[578px] right-0 top-[148px] absolute bg-white rounded-2xl shadow-[0px_0px_231.1999969482422px_9px_rgba(0,0,0,0.20)] outline outline-1 outline-offset-[-1px] outline-[#ececec] inline-flex flex-col justify-start items-center overflow-hidden">
    <div className="self-stretch px-6 py-8 relative flex flex-col justify-start items-end gap-8">
        <div className="p-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] inline-flex justify-start items-center gap-2.5 cursor-pointer"
        onClick={() => setShowModal(false)}>
            <i className="ri-close-line text-[32px] leading-[32px]"></i>
        </div>
        <div className="self-stretch h-[100%] flex flex-col justify-start items-start gap-8">
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch inline-flex justify-between items-center">
                        <div className="flex-1 justify-start"><span class="text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">Rate: </span><span class="text-Token-Text-Tertiary text-xs font-normal font-['Inter'] leading-none">(Minimum $50)</span></div>
                        <div className="px-4 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                            <div className="justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">$100</div>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">Event type</div>
                        <div className="self-stretch inline-flex justify-start items-start gap-3 flex-wrap content-start">
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">Party Dress</div>
                            </div>
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">Customer Service</div>
                            </div>
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">Poker/Card Dealer</div>
                            </div>
                            <div data-property-1="active" className="px-3 py-2 bg-[#FFF1F2] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#E61E4D] text-sm font-normal font-['Inter'] leading-tight">Atmosphere Model</div>
                            </div>
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">Topless Waitress</div>
                            </div>
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">Waitress</div>
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch inline-flex justify-between items-center">
                        <div className="justify-start text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">Book By Day</div>
                        <div data-property-1="ToggleLeft" className="w-12 h-12 relative">
                            <div className="h-12 flex justify-start items-center gap-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isActive}
                  onChange={handleToggle}
                />
                <div
                  className={`w-11 h-6 rounded-full ${
                    isActive ? "bg-[#E61E4D]" : "bg-gray-400"
                  } flex items-center px-1 transition-colors`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      isActive ? "translate-x-5" : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>
                        </div>
                    </div>


               <div className={`self-stretch inline-flex flex-col justify-start items-start gap-6 ${
                    !isActive ? "hidden" : ""
                  }`}>
    <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <div className="self-stretch inline-flex justify-between items-center">
            <div className="justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">Start Date</div>
            <div className="flex justify-start items-center gap-4">
                <div className="justify-start text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">Wednesday, march 19</div>
                <div data-format="Stroke" data-weight="Regular" className="w-8 h-8 relative">
                    <div className="w-8 h-8 left-0 top-0 absolute" />
                    <div className="w-5 h-5 left-[5px] top-[5px] absolute outline outline-2 outline-offset-[-1px] outline-[#E61E4D]" />
                    <div className="w-0 h-1 left-[22px] top-[3px] absolute outline outline-2 outline-offset-[-1px] outline-[#E61E4D]" />
                    <div className="w-0 h-1 left-[10px] top-[3px] absolute outline outline-2 outline-offset-[-1px] outline-[#E61E4D]" />
                    <div className="w-5 h-0 left-[5px] top-[11px] absolute outline outline-2 outline-offset-[-1px] outline-[#E61E4D]" />
                    <div className="w-[3px] h-[3px] left-[14.50px] top-[15px] absolute bg-[#E61E4D]" />
                    <div className="w-[3px] h-[3px] left-[20px] top-[15px] absolute bg-[#E61E4D]" />
                    <div className="w-[3px] h-[3px] left-[9px] top-[20px] absolute bg-[#E61E4D]" />
                    <div className="w-[3px] h-[3px] left-[14.50px] top-[20px] absolute bg-[#E61E4D]" />
                    <div className="w-[3px] h-[3px] left-[20px] top-[20px] absolute bg-[#E61E4D]" />
                </div>
            </div>
        </div>
    </div>
    <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <div className="self-stretch inline-flex justify-between items-center">
            <div className="justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">End Date</div>
            <div className="flex justify-start items-center gap-4">
                <div className="justify-start text-Token-Text-Secondary text-base font-normal font-['Inter'] leading-snug">Friday, march 20</div>
                <div data-format="Stroke" data-weight="Regular" className="w-8 h-8 relative">
                    <div className="w-8 h-8 left-0 top-0 absolute" />
                    <div className="w-5 h-5 left-[5px] top-[5px] absolute outline outline-2 outline-offset-[-1px] outline-[#E61E4D]" />
                    <div className="w-0 h-1 left-[22px] top-[3px] absolute outline outline-2 outline-offset-[-1px] outline-[#E61E4D]" />
                    <div className="w-0 h-1 left-[10px] top-[3px] absolute outline outline-2 outline-offset-[-1px] outline-[#E61E4D]" />
                    <div className="w-5 h-0 left-[5px] top-[11px] absolute outline outline-2 outline-offset-[-1px] outline-[#E61E4D]" />
                    <div className="w-[3px] h-[3px] left-[14.50px] top-[15px] absolute bg-[#E61E4D]" />
                    <div className="w-[3px] h-[3px] left-[20px] top-[15px] absolute bg-[#E61E4D]" />
                    <div className="w-[3px] h-[3px] left-[9px] top-[20px] absolute bg-[#E61E4D]" />
                    <div className="w-[3px] h-[3px] left-[14.50px] top-[20px] absolute bg-[#E61E4D]" />
                    <div className="w-[3px] h-[3px] left-[20px] top-[20px] absolute bg-[#E61E4D]" />
                </div>
            </div>
        </div>
    </div>
    <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <div className="self-stretch justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">Number of Days</div>
        <div className="self-stretch inline-flex justify-start items-center gap-3">
            <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">2 Days</div>
        </div>
    </div>
</div>




                    <div className={`${
                    isActive ? "hidden" : "flex flex-col gap-[24px]"
                  }`}>
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">Select Date</div>
                        <div data-select-all="true" data-select-button="false" data-unselect-all="true" className="self-stretch min-w-80 p-4 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex flex-col justify-start items-start gap-3">
                            <div className="self-stretch inline-flex justify-between items-center">
                                <i className="ri-arrow-left-s-line text-[24px] text-[#656565]"></i>
                                <div className="text-center justify-center text-Token-BG-Neutral-Dark-2 text-base font-medium font-['Inter'] leading-snug">March 2025</div>
                                <i className="ri-arrow-right-s-line text-[24px] text-[#292929]"></i>
                            </div>
                            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ececec]"></div>
                            <div className="self-stretch inline-flex justify-between items-center">
                                <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                    <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">SUN</div>
                                </div>
                                <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                    <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">MON</div>
                                </div>
                                <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                    <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">TUE</div>
                                </div>
                                <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                    <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">WED</div>
                                </div>
                                <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                    <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">THU</div>
                                </div>
                                <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                    <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">FRI</div>
                                </div>
                                <div className="flex-1 px-2 py-1 flex justify-center items-center gap-2.5">
                                    <div className="text-center justify-center text-Token-Text-Tertiary text-sm font-medium font-['Inter'] leading-tight">SAT</div>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <div className="self-stretch inline-flex justify-between items-center">
                                    <div data-property-1="Previous" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">26</div>
                                    </div>
                                    <div data-property-1="Previous" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">27</div>
                                    </div>
                                    <div data-property-1="Previous" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">28</div>
                                    </div>
                                    <div data-property-1="Previous" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">29</div>
                                    </div>
                                    <div data-property-1="Previous" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">30</div>
                                    </div>
                                    <div data-property-1="Previous" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">31</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">1</div>
                                    </div>
                                </div>
                                <div className="self-stretch inline-flex justify-between items-center">
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">2</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">3</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">4</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">5</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">6</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">7</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">8</div>
                                    </div>
                                </div>
                                <div className="self-stretch inline-flex justify-between items-center">
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">9</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">10</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">11</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">12</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">13</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">14</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">15</div>
                                    </div>
                                </div>
                                <div className="self-stretch inline-flex justify-between items-center">
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">16</div>
                                    </div>
                                    <div data-property-1="Today" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-[#E61E4D] text-sm font-normal font-['Inter'] leading-tight">17</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">18</div>
                                    </div>
                                    <div data-property-1="Selected" className="flex-1 h-8 p-3 bg-[#E61E4D] rounded outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-[#fff] text-sm font-normal font-['Inter'] leading-tight">19</div>
                                    </div>
                                    <div data-property-1="available" className="flex-1 h-8 p-3 bg-[#FFF1F2] rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-[#656565] text-sm font-normal font-['Inter'] leading-tight">20</div>
                                    </div>
                                    <div data-property-1="available" className="flex-1 h-8 p-3 bg-[#FFF1F2] rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-[#656565] text-sm font-normal font-['Inter'] leading-tight">21</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">22</div>
                                    </div>
                                </div>
                                <div className="self-stretch inline-flex justify-between items-center">
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">23</div>
                                    </div>
                                    <div data-property-1="available" className="flex-1 h-8 p-3 bg-[#FFF1F2] rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-[#656565] text-sm font-normal font-['Inter'] leading-tight">24</div>
                                    </div>
                                    <div data-property-1="available" className="flex-1 h-8 p-3 bg-[#FFF1F2] rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-[#656565] text-sm font-normal font-['Inter'] leading-tight">25</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">26</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">27</div>
                                    </div>
                                    <div data-property-1="Default" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">28</div>
                                    </div>
                                    <div data-property-1="Previous" className="flex-1 h-8 p-3 rounded inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-center justify-center text-zinc-500 text-sm font-normal font-['Inter'] leading-tight">1</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[530px] p-3 bg-[#FFF1F2] rounded-lg inline-flex justify-start items-start gap-1">
                            <img src="/images/info.png" alt="info" className="w-4 h-4 relative" />
                            <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">Samantha currently has 3 pending event invitations on this date, instant book now to secure your booking</div>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">Start Time</div>
                        <div className="self-stretch inline-flex justify-start items-start gap-2 flex-wrap content-start">
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">5 PM</div>
                            </div>
                            <div data-property-1="active" className="px-3 py-2 bg-[#FFF1F2] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#E61E4D] text-sm font-normal font-['Inter'] leading-tight">6 PM</div>
                            </div>
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">7 PM</div>
                            </div>
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">8 PM</div>
                            </div>
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">9 PM</div>
                            </div>
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">10 PM</div>
                            </div>
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">11 PM</div>
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch justify-start"><span class="text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">Number of Hours</span><span class="text-black text-base font-semibold font-['Inter']"> </span><span class="text-neutral-400 text-sm font-normal font-['Inter'] leading-tight">(Minimum 3 hours)</span></div>
                        <div className="self-stretch inline-flex justify-start items-start gap-2 flex-wrap content-start">
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">3</div>
                            </div>
                            <div data-property-1="active" className="px-3 py-2 bg-[#FFF1F2] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#E61E4D] text-sm font-normal font-['Inter'] leading-tight">4</div>
                            </div>
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">5</div>
                            </div>
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">6</div>
                            </div>
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">7</div>
                            </div>
                            <div data-property-1="Default" className="px-3 py-2 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">8</div>
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">End Time</div>
                        <div className="self-stretch inline-flex justify-start items-center gap-3">
                            <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">10 PM</div>
                            <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">(5 hours)</div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch flex flex-col justify-start items-start gap-1">
                            <div className="self-stretch inline-flex justify-between items-center">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">{isActive ? 'Days' : 'Hours'}</div>
                                <div className="text-right justify-start text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">3</div>
                            </div>
                            <div className="self-stretch inline-flex justify-between items-center">
                                <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">{isActive ? 'Daily Rate' : 'Rate/H'}</div>
                                <div className="text-right justify-start text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">100</div>
                            </div>
                        </div>
                        <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ececec]"></div>
                        <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">Total Cost</div>
                            <div className="justify-start text-Token-Text-Primary text-base font-normal font-['Inter'] leading-snug">$300</div>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-center gap-2">
                        <div className="self-stretch flex flex-col justify-start items-start gap-1">
                            <div className="self-stretch inline-flex justify-between items-center">
                                <div className="justify-start text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">10% down payment</div>
                                <div className="justify-start text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">30</div>
                            </div>
                            <div className="self-stretch inline-flex justify-between items-center">
                                <div className="justify-start text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">Booking fee</div>
                                <div className="justify-start text-Token-Text-Primary text-sm font-normal font-['Inter'] leading-tight">25</div>
                            </div>
                        </div>
                        <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-300"></div>
                        <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-Token-Text-Primary text-base font-bold font-['Inter'] leading-snug">Total payable now</div>
                            <div className="justify-start text-Token-Text-Primary text-base font-bold font-['Inter'] leading-snug">$55</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="self-stretch p-4 bg-Token-BG-Neutral-Light-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch inline-flex justify-start items-start gap-3">
                        <div className="flex-1 justify-start text-Token-Text-Primary text-base font-medium font-['Inter'] leading-snug">Payment Card Details</div>
                        <div className={`justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug ${isActive ? 'hidden' : ''}`}>Saved Method</div>
                    </div>
                    <div className={`self-stretch inline-flex justify-between items-center gap-3 ${!isActive ? 'hidden' : ''}`}>
                        <img src="/images/Frame.png" alt="pay" className="w-[77px]" />
                        <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">Saved Method</div>
                        </div>
                    
                    <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ececec]"></div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                            <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">Cardholder's Name</div>
                            <div className="self-stretch h-10 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                                <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">Enter the name as it appears on your card</div>
                            </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                            <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">Cardholder's Name</div>
                            <div className="self-stretch h-10 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                                <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">xxxx xxxx xxxx xxxx</div>
                            </div>
                        </div>
                        <div className="self-stretch inline-flex justify-start items-start gap-4">
                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                                <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">Expiry Date</div>
                                <div className="self-stretch h-10 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                                    <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">MM/YY</div>
                                </div>
                            </div>
                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                                <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">CVV</div>
                                <div className="self-stretch h-10 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ececec] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                                    <div className="justify-start text-Token-Text-Tertiary text-sm font-normal font-['Inter'] leading-tight">xxx</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-2 h-5 left-[565px] top-[483px] absolute bg-zinc-300 rounded-lg" />
    </div>
    <div className="w-[578px] p-4 bg-Token-BG-Neutral-Light-1 shadow-[8px_13px_10.5px_15px_rgba(195,192,192,0.25)] flex flex-col justify-start items-start gap-2.5 overflow-hidden">
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
                <div className="justify-start text-[#fff] text-base font-medium font-['Inter'] leading-snug">Confirm Booking $55</div>
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-2">
                <div className="flex-1 h-0 bg-Token-BG-Neutral-Light-2 outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
                <div className="justify-start text-neutral-500 text-xs font-normal font-['Inter'] leading-none">or</div>
                <div className="flex-1 h-0 bg-Token-BG-Neutral-Light-2 outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
            </div>
            <div className="self-stretch px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] inline-flex justify-center items-center gap-2 overflow-hidden">
                <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">Invite to Existing Event</div>
            </div>
        </div>
    </div>
</div>
        </div>
      )}


    </div>
  );
}

export default StaffPublicProfile;