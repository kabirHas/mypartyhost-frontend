import React, { useEffect, useState, useRef } from "react";
import "../asset/css/MessagePage.css";
import { FaSearch, FaCheckDouble, FaTimes } from "react-icons/fa";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import BASE_URLS from "../config";
import io from "socket.io-client";

const ENDPOINT = "https://mypartyhost.onrender.com";
let socket;

const MessagePage = () => {
  const selectedChatCompare = useRef();
  const chatBodyRef = useRef(null); // Reference for chat body div
  const user = localStorage.getItem("userInfo");
  const role = localStorage.getItem("role");
  const {
    //user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const [search, setSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [groupSearchResult, setGroupSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [loggedUser, setLoggedUser] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Scroll to bottom when messages or selectedChat changes
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, selectedChat]);

  useEffect(() => {
    if (!user) return;
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Fetch users for main search
  useEffect(() => {
    if (!search.trim()) {
      setSearchResult([]);
      return;
    }
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}user/search?username=${search}`)
      .then((res) => {
        setSearchResult(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [search]);

  // Fetch users for group search
  useEffect(() => {
    if (!groupSearch.trim()) {
      setGroupSearchResult([]);
      return;
    }
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}user/search?username=${groupSearch}`)
      .then((res) => {
        setGroupSearchResult(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [groupSearch]);

  // Fetch chats on mount
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}chat`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setChats(res.data);
        setSelectedChat(res.data[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  function fetchMessage() {
    if (!selectedChat?._id) return;
    setLoading(true);
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}message/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        // Sort messages by createdAt in ascending order
        const sortedMessages = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);
        setLoading(false);
        // Emit join chat event to socket server
        socket.emit("join chat", selectedChat._id);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        setLoading(false);
      });
  }

  // Fetch messages for selected chat
  useEffect(() => {
    fetchMessage();
    selectedChatCompare.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (newMessageReceived) => {
      if (
        !selectedChatCompare.current ||
        selectedChatCompare.current._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications((prev) => [newMessageReceived, ...prev]);
          setFetchAgain(!fetchAgain);
        }
      }
      setMessages((prev) => [...prev, newMessageReceived]);
    };

    socket.on("message received", handleMessage);

    return () => {
      socket.off("message received", handleMessage);
    };
  }, [selectedChat]);
  console.log(notifications, "_------_-_---_-_");
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${BASE_URLS.BACKEND_BASEURL}chat`,
        { userId },
        config
      );
      setChats((prevChats) => {
        const existingChat = prevChats.find((chat) => chat._id === data._id);
        if (existingChat) {
          return prevChats;
        }
        return [data, ...prevChats];
      });
      setSelectedChat(data);

      await axios.put(
        `${BASE_URLS.BACKEND_BASEURL}message/read/${data._id}`,
        {},
        config
      );

      // Clear notifications for this chat
      setNotifications((prev) =>
        prev.filter((notification) => notification.chat._id !== data._id)
      );

      setLoadingChat(false);
    } catch (error) {
      console.error("Error accessing chat:", error);
      setLoadingChat(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) {
      alert("Please enter a group name and select at least one user.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${BASE_URLS.BACKEND_BASEURL}chat/group`,
        {
          name: groupName,
          users: selectedUsers.map((u) => u._id),
        },
        config
      );
      setChats((prevChats) => [data, ...prevChats]);
      setSelectedChat(data);
      setShowPopup(false);
      setGroupName("");
      setSelectedUsers([]);
      setGroupSearch("");
      setGroupSearchResult([]);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat?._id) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${BASE_URLS.BACKEND_BASEURL}message`,
        {
          chatId: selectedChat._id,
          content: newMessage,
        },
        config
      );
      socket.emit("new message", data);
      setMessages((prev) => [...prev, data]);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, latestMessage: data }
            : chat
        )
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setGroupName("");
    setSelectedUsers([]);
    setGroupSearch("");
    setGroupSearchResult([]);
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userId));
  };

  const getChatName = () => {
    if (!selectedChat) return "Select a chat";
    return selectedChat.isGroupChat
      ? selectedChat.chatName
      : selectedChat.users[0]._id === user._id
      ? selectedChat.users[1].name
      : selectedChat.users[0].name;
  };

  return (
    <div className="kaab-message-page relative">
      <div className="kaab-sidebar relative">
        {/* Search Functionality */}
        { role === "superadmin" && (
        <div className="w-full flex gap-3 mb-3">
          <select
            className="px-3 py-2 border rounded-full focus:outline-none w-full"
            // value={userType}
            // onChange={(e) => setUserType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            className="px-3 py-2 border rounded-full focus:outline-none w-full"
            // value={userType}
            // onChange={(e) => setUserType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="user">Sent</option>
            <option value="admin">Archive</option>
          </select>
        </div>
        )}
        <div className="kaab-search relative">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search name"
          />
          <button>
            <FaSearch />
          </button>
          <div
            className={`${
              searchResult.length > 0 ? "block" : "hidden"
            } absolute top-12 z-10 left-0 w-full bg-white shadow-lg rounded-lg p-4`}
          >
            {searchResult.map((user) => (
              <div
                onClick={() => accessChat(user._id)}
                className="flex cursor-pointer items-center px-3 py-2 rounded-lg bg-white shadow-md"
                key={user._id}
              >
                <img
                  src={
                    user.profileImage ||
                    "https://imgs.search.brave.com/sHfS5WDNtJlI9C_CT2YL2723HttEALNRtpekulPAD9Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2LzMzLzU0Lzc4/LzM2MF9GXzYzMzU0/Nzg0Ml9BdWdZemV4/VHBNSjl6MVljcFRL/VUJvcUJGMENVQ2sx/MC5qcGc"
                  }
                  className="h-10 w-10 rounded-full"
                  alt={user.name}
                />
                <div className="ml-4">
                  <div className="font-bold">{user.name}</div>
                  <div className="text-gray-700">{user.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="kaab-messages-title">
          <p>Messages</p>
          {role == "superadmin" && (
            <button
              onClick={togglePopup}
              className="text-sm absolute bg-[#e61e4d] text-white bottom-12 right-4 text-[#3D3D3D] font-bold bg-[#ECECEC] px-3.5 py-2.5 rounded-full z-[9999]"
            >
              <i className="ri-add-line text-xl"></i>
            </button>
          )}
        </div>
        <div className="kaab-message-list">
          <div className="kaab-message-item active">
            <img src="/images/emilli.png" alt="Emily" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Emily Roberts</span>
                <span>4:30 PM</span>
              </div>
              <div className="kaab-message-preview typing">Typing...</div>
            </div>
            <span className="kaab-unread-count">2</span>
          </div>
          <div className="kaab-message-item">
            <img src="/images/sophia.png" alt="Sophia" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Sophia Williams</span>
                <span>12:30 PM</span>
              </div>
              <div className="kaab-message-preview">Thank you.</div>
            </div>
          </div>
          <div className="kaab-message-item">
            <img src="/images/james.png" alt="James" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>James Carter</span>
                <span>1:36 PM</span>
              </div>
              <div className="kaab-message-preview">
                Looking forward to tomorrow’s event!
              </div>
            </div>
            <img src="/images/Checks.svg" alt="read" className="kaab-read"/>
          </div>
          <div className="kaab-message-item">
            <img src="/images/sophia.png" alt="Olivia" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Olivia Brown</span>
                <span>2:15 PM</span>
              </div>
              <div className="kaab-message-preview">Can’t wait for the presentation!</div>
            </div>
          </div>
          <div className="kaab-message-item">
            <img src="/images/james.png" alt="Ethan" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Ethan Davis</span>
                <span>3:00 PM</span>
              </div>
              <div className="kaab-message-preview">I hope everyone is ready!</div>
            </div>
            <img src="/images/Checks.svg" alt="read" className="kaab-read"/>
          </div>
          <div className="kaab-message-item">
            <img src="/images/sophia.png" alt="Ava" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Ava Johnson</span>
                <span>3:45 PM</span>
              </div>
              <div className="kaab-message-preview">Let’s make this a great session!</div>
            </div>
          </div>
          <div className="kaab-message-item">
            <img src="/images/james.png" alt="Liam" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Liam Smith</span>
                <span>4:10 PM</span>
              </div>
              <div className="kaab-message-preview">Will there be snacks available?</div>
            </div>
            <img src="/images/Checks.svg" alt="read" className="kaab-read"/>
          </div>
          <div className="kaab-message-item">
            <img src="/images/sophia.png" alt="Isabella" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Isabella Martinez</span>
                <span>4:30 PM</span>
              </div>
              <div className="kaab-message-preview">Excited to see everyone!</div>
            </div>
          </div>
        </div>




      </div>

      <div className="kaab-chat-panel z-1">
        <div className="kaab-chat-header  flex justify-between items-center">
          <div>
            <div className="kaab-chat-title capitalize">{getChatName()}</div>
            <div className="kaab-chat-subtitle">
              {selectedChat?.isGroupChat
                ? "Group Chat"
                : "Exclusive Beach Party – Energetic Hostess Required"}
            </div>
          </div>
          {role === "superadmin" && (
            <div className="relative">
              <i
                onClick={() => setShowMenu(!showMenu)}
                className="ri-information-line text-3xl text-[#343330] absolute top-1/2 transform -translate-y-1/2  right-4 cursor-pointer"
              ></i>
              {showMenu && (
                <div className="w-80 absolute top-12 right-0 p-6 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2.5 overflow-hidden z-[9999]">
                  <div className="flex-1 inline-flex flex-col justify-start items-center gap-4">
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="w-60 justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                        Exclusive Beach Party – Energetic Hostess Required
                      </div>
                      <i onClick={() => setShowMenu(false)} className="ri-close-circle-line text-3xl cursor-pointer text-[#656565]"></i>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                        Members
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch inline-flex justify-end items-center gap-3">
                          <div className="flex-1 flex justify-start items-center gap-3.5">
                            <img
                              className="w-8 h-8 rounded-full"
                              src="https://placehold.co/32x32"
                            />
                            <div className="flex-1 justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                              Emily Roberts
                            </div>
                          </div>
                          <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                            Remove
                          </div>
                        </div>
                        <div className="self-stretch inline-flex justify-start items-center gap-3.5">
                          <img
                            className="w-8 h-8 rounded-full"
                            src="https://placehold.co/32x32"
                          />
                          <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                            Emily Roberts
                          </div>
                        </div>
                        <div className="self-stretch inline-flex justify-start items-center gap-3.5">
                          <img
                            className="w-8 h-8 rounded-full"
                            src="https://placehold.co/32x32"
                          />
                          <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                            Sophia Carter
                          </div>
                        </div>
                        <div className="self-stretch inline-flex justify-start items-center gap-3.5">
                          <img
                            className="w-8 h-8 rounded-full"
                            src="https://placehold.co/32x32"
                          />
                          <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                            Mia Johnson
                          </div>
                        </div>
                        <div className="self-stretch inline-flex justify-start items-center gap-3.5">
                          <img
                            className="w-8 h-8 rounded-full"
                            src="https://placehold.co/32x32"
                          />
                          <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                            Olivia Brown
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch justify-start text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
                      Add Members
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="kaab-chat-body">
          <div className="kaab-chat-message sender">
            <img src="/images/emilli.png" alt="Emily" />
            <div>
              <div className="kaab-chat-name-time">Emily Roberts <span>10:00 AM</span></div>
              <div className="kaab-chat-text">Hi Samantha, hope you’re doing well! I’m reaching out regarding the upcoming Exclusive Beach Party. Just wanted to check if you received all the event details.</div>
            </div>
          </div>
          <div className="kaab-chat-message sender">
            <img src="/images/samantha.png" alt="Emily" />
            <div>
              <div className="kaab-chat-name-time">Samantha Lee <span>10:05 AM</span></div>
              <div className="kaab-chat-text">Hi Emily, yes, I received everything and I’m really excited for the gig! Could you please confirm what time I should arrive?</div>
            </div>
          </div>
          <div className="kaab-chat-message sender">
            <img src="/images/emilli.png" alt="Emily" />
            <div>
              <div className="kaab-chat-name-time">Emily Roberts <span>10:08 AM</span></div>
              <div className="kaab-chat-text">Absolutely. The event starts at 4:00 PM, but we’d like you to arrive by 3:45 PM for a brief setup meeting.</div>
            </div>
          </div>
          <div className="kaab-chat-message sender">
            <img src="/images/samantha.png" alt="Emily" />
            <div>
              <div className="kaab-chat-name-time">Samantha Lee <span>10:10 AM</span></div>
              <div className="kaab-chat-text">Great, thanks for the confirmation! Also, could you remind me of the dress code?</div>
            </div>
          </div>
          <div className="kaab-chat-message sender">
            <img src="/images/emilli.png" alt="Emily" />
            <div>
              <div className="kaab-chat-name-time">Emily Roberts <span>10:15 AM</span></div>
              <div className="kaab-chat-text">Sure! The dress code is Beach Formal—think smart summer dress with comfortable yet stylish footwear.</div>
            </div>
          </div>
        </div>
        {selectedChat && (
          <div className="kaab-chat-input">
            <input
              type="text"
              placeholder="Type your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>
              <img src="/images/Send.png" alt="send" />
            </button>
          </div>
        )}
      </div>

      {/* Popup for Creating Group */}
      {showPopup && (
        <div className="absolute top-0 left-0 w-full h-full bg-opacity-10 flex items-center justify-center z-[100]">
          <div className="w-[600px] relative p-6 rounded-lg bg-white shadow-2xl">
            <i
              onClick={togglePopup}
              className="ri-close-circle-line text-3xl text-[#343330] absolute top-5 right-5"
            ></i>
            <h2 className="text-xl font-bold mb-4">New Message</h2>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter group name"
              />
            </div> */}

            <div className="mb-4">
              {selectedUsers && selectedUsers.length > 0 && (
                <>
                  {/* <label className="block text-sm font-medium text-gray-700">
                Selected Users
              </label> */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedUsers.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center w-full justify-between  px-2 py-1 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            className="w-8 h-8 rounded-full"
                            src={user.profileImage}
                            alt=""
                          />
                          <span className="text-sm capitalize">
                            {user.name}
                          </span>
                        </div>
                        <div
                          className="ml-2 cursor-pointer text-zinc-500"
                          onClick={() => removeUser(user._id)}
                        >
                          Remove
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <label className="block text-sm font-medium text-gray-700">
                Search Users
              </label>
              <input
                type="text"
                onChange={(e) => setGroupSearch(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Search users to add"
              />
              <div className="mt-2 max-h-40 overflow-y-auto">
                {groupSearchResult.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserSelect(user)}
                    className={`flex items-center p-2 cursor-pointer rounded-lg ${
                      selectedUsers.find((u) => u._id === user._id)
                        ? "bg-blue-100"
                        : "bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.find((u) => u._id === user._id)}
                      readOnly
                      className="mr-2"
                    />
                    <img
                      src={user.profileImage || "/images/default-user.png"}
                      className="h-8 w-8 rounded-full"
                      alt={user.name}
                    />
                    <div className="ml-3">
                      <div className="font-bold">{user.name}</div>
                      <div className="text-gray-700 text-sm">{user.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              {/* <button
                onClick={togglePopup}
                className="px-4 py-2 mr-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button> */}
              <button
                onClick={handleCreateGroup}
                className={`px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600  text-white rounded-lg ${
                  selectedUsers.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Start Conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;