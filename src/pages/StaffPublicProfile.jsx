import { useState } from "react";
import { useNavigate } from "react-router-dom";



function StaffPublicProfile() {
  const navigate = useNavigate();
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
              <div className="self-stretch px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
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
    </div>
  );
}

export default StaffPublicProfile;