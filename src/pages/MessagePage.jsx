import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../asset/css/MessagePage.css";
import { FaSearch, FaCheckDouble, FaTimes } from "react-icons/fa";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import BASE_URLS from "../config";
import io from "socket.io-client"; 

const ENDPOINT = "https://mypartyhost.onrender.com";
let socket;

// let BASE_URLS = {
//   BACKEND_BASEURL: "http://localhost:4000/api/",
// }

const MessagePage = () => {
  // const user = JSON.parse(localStorage.getItem("userInfo"));
  const selectedChatCompare = useRef();
  const chatBodyRef = useRef(null); // Reference for chat body div
  const {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const [search, setSearch] = useState("");
  const location = useLocation();
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
  const [groupMembers, setGroupMembers] = useState([]);
  const [showAddMemberInput, setShowAddMemberInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all"); // For user role
  const [chatType, setChatType] = useState("all"); // Sent / Archive
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const hasOpenedFromStateRef = useRef(false);
  const lastOpenedUserIdRef = useRef(null);

  const removeGroupMember = async (chatId, userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.put(
        `${BASE_URLS.BACKEND_BASEURL}chat/groupremove`,
        { chatId, userId },
        config
      );

      setGroupMembers(data);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId ? { ...chat, users: data.users } : chat
        )
      );
      setSelectedChat((prevChat) => {
        if (prevChat._id === chatId) {
          return { ...prevChat, users: data.users };
        }
        return prevChat;
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Function to add a member to the group

  const addGroupMember = async (chatId, userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.put(
        `${BASE_URLS.BACKEND_BASEURL}chat/groupadd`,
        { chatId, userId },
        config
      );

      setGroupMembers(data);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId ? { ...chat, users: data.users } : chat
        )
      );
      setSelectedChat((prevChat) => {
        if (prevChat._id === chatId) {
          return { ...prevChat, users: data.users };
        }
        return prevChat;
      });
    } catch (error) {
      console.error(error);
    }
  };
  const filteredChats = chats.filter((chat) => {
    // Filter by role (check first other user in the chat if not group)
    if (roleFilter !== "all" && !chat.isGroupChat) {
      const otherUser = chat.users.find((u) => u._id !== user._id);
      if (!otherUser || otherUser.role !== roleFilter) {
        return false;
      }
    }

    // Chat Type filter (assuming `chat.archived` is a flag)
    // if (chatType === "archive" && !chat.archived) return false;
    // if (chatType === "sent" && chat.archived) return false;

    return true;
  });

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
        setSearchResults(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [search]);

  // Fetch users for group member search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URLS.BACKEND_BASEURL}user/search?username=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

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
        setChatsLoaded(true);
        // Only select the first chat by default if no explicit userId is provided via navigation state
        const userIdFromState = location?.state?.userId;
        if (!userIdFromState) {
          setSelectedChat(res.data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // If navigated with a userId in location state, prefer existing chat; else create/access it (guarded)
  useEffect(() => {
    const userIdFromState = location?.state?.userId;
    console.log("User ID from state:", userIdFromState);
    if (!userIdFromState) return;
    if (!chatsLoaded) return;
    if (lastOpenedUserIdRef.current === userIdFromState) return;

    const existing = chats.find(
      (c) => !c.isGroupChat && c.users && c.users.some((u) => u._id === userIdFromState)
    );

    if (existing) {
      setSelectedChat(existing);
      hasOpenedFromStateRef.current = true;
      lastOpenedUserIdRef.current = userIdFromState;
    } else {
      accessChat(userIdFromState).finally(() => {
        hasOpenedFromStateRef.current = true;
        lastOpenedUserIdRef.current = userIdFromState;
      });
    }
  }, [location?.state?.userId, chatsLoaded, chats]);

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
        console.log("Chat accessed:", selectedChat);
        // Clear notifications for this chat
        setNotifications((prev) =>
          prev.filter(
            (notification) => notification.chat._id !== selectedChat._id
          )
        );
        setLoading(false);
        // Emit join chat event to socket server
        socket.emit("join chat", selectedChat._id);

        axios
          .put(
            `${BASE_URLS.BACKEND_BASEURL}message/read/${selectedChat._id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            console.log("Message marked as read:", res.data);
            // setChats((prevChats) =>
            //   prevChats.map((chat) =>
            //     chat._id === selectedChat._id
            //       ? {
            //           ...chat,
            //           latestMessage: {
            //             ...chat.latestMessage,
            //             read: true,
            //           },
            //         }
            //       : chat
            //   )
            // );
            setChats((prevChats) =>
              prevChats.map((chat) => {
                if (
                  chat._id === selectedChat._id &&
                  chat.latestMessage?.sender?._id !== user._id
                ) {
                  return {
                    ...chat,
                    latestMessage: {
                      ...chat.latestMessage,
                      read: true,
                    },
                  };
                }
                return chat;
              })
            );

           
            
          })
          .catch((err) => {
            console.error("Error marking message as read:", err);
          });
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        setLoading(false);
      });
  }

  // useEffect(() => {
  //   if (!socket) return;
  
  //   socket.on("message read", (chatId) => {
  //     setChats((prevChats) =>
  //       prevChats.map((chat) =>
  //         chat._id === chatId && chat.latestMessage?.sender?._id === user._id
  //           ? {
  //               ...chat,
  //               latestMessage: {
  //                 ...chat.latestMessage,
  //                 read: true,
  //               },
  //             }
  //           : chat
  //       )
  //     );
  //   });
  
  //   return () => {
  //     socket.off("message read");
  //   };
  // }, [user]);
  
  useEffect(() => {
    if (!socket) return;
  
    socket.on("message read", ({ chatId, readerId }) => {
      // Only update if current user is the sender
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (
            chat._id === chatId &&
            chat.latestMessage?.sender?._id === user._id // validate sender
          ) {
            return {
              ...chat,
              latestMessage: {
                ...chat.latestMessage,
                read: true,
              },
            };
          }
          return chat;
        })
      );
    });
  
    return () => {
      socket.off("message read");
    };
  }, [user]);
  

  // Fetch messages for selected chat
  useEffect(() => {
    fetchMessage();
    selectedChatCompare.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (newMessageReceived) => {
      // If the message is for the currently selected chat, update messages
      if (
        selectedChatCompare.current &&
        selectedChatCompare.current._id === newMessageReceived.chat._id
      ) {
        setMessages((prev) => [...prev, newMessageReceived]);

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === newMessageReceived.chat._id
              ? {
                  ...chat,
                  latestMessage: {
                    ...newMessageReceived,
                    read: true,
                  },
                }
              : chat
          )
        );

        socket.emit("message read", {
          chatId: newMessageReceived.chat._id,
          readerId: user._id,
        });
        // Clear notifications for the current chat
        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              notification.chat._id !== selectedChatCompare.current._id
          )
        );

      } else {
        // If the message is for a different chat, add it to notifications
        if (!notifications.some((n) => n._id === newMessageReceived._id)) {
          setNotifications((prev) => [newMessageReceived, ...prev]);
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat._id === newMessageReceived.chat._id
                ? { ...chat, latestMessage: newMessageReceived }
                : chat
            )
          );
          setFetchAgain(!fetchAgain);
        }
      }
    };

    socket.on("message received", handleMessage);

    return () => {
      socket.off("message received", handleMessage);
    };
  }, [selectedChat, notifications]);

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
        {user.role === "superadmin" && (
          <div className="w-full flex gap-3 mb-3">
            <select
              className="px-3 py-2 border rounded-full focus:outline-none w-full"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="organiser">Organiser</option>
              <option value="staff">Staff</option>
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
            {searchResult.map((users) => {
              if (users._id === user._id) return null;
              return (
                <div
                  onClick={() => accessChat(users._id)}
                  className="flex cursor-pointer items-center mt-2"
                  key={users._id}
                >
                  <img
                    src={
                      users.profileImage ||
                      "https://imgs.search.brave.com/sHfS5WDNtJlI9C_CT2YL2723HttEALNRtpekulPAD9Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2LzMzLzU0Lzc4/LzM2MF9GXzYzMzU0/Nzg0Ml9BdWdZemV4/VHBNSjl6MVljcFRL/VUJvcUJGMENVQ2sx/MC5qcGc"
                    }
                    className="h-10 w-10 rounded-full"
                    alt={users.name}
                  />
                  <div className="ml-4">
                    <div className="font-medium capitalize">{users.name}</div>
                    {/* <div className="text-gray-700">{users.email}</div> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="kaab-messages-title">
          <p>Messages</p>
          {user && user.role == "superadmin" && (
            <button
              onClick={togglePopup}
              className="text-sm absolute bg-[#e61e4d] text-white bottom-12 right-4 text-[#3D3D3D] font-bold bg-[#ECECEC] px-3.5 py-2.5 rounded-full"
            >
              <i className="ri-add-line text-xl"></i>
            </button>
          )}
        </div>
        <div className="kaab-message-list">
          {filteredChats && filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`kaab-message-item ${
                  selectedChat && selectedChat._id === chat._id ? "active" : ""
                }`}
              >
                <img
                  src={
                    chat.isGroupChat
                      ? "https://imgs.search.brave.com/IlEhT8Dcgu3T4mm7t9xhl6UsFEooWIWZ3wDtgeDtZsc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDAv/NTUwLzUzNS9zbWFs/bC91c2VyX2ljb25f/MDA3LmpwZw"
                      : chat.users.filter((u) => u._id !== user._id)[0]
                          .profileImage
                  }
                  alt={
                    chat.isGroupChat
                      ? chat.chatName
                      : chat.users.filter((u) => u._id !== user._id)[0].name
                  }
                />
                <div className="kaab-message-info">
                  <div className="kaab-message-name-time">
                    <span>
                      {chat.isGroupChat
                        ? chat.chatName
                        : chat.users.filter((u) => u._id !== user._id)[0].name}
                    </span>
                    <span>
                      {chat.updatedAt
                        ? new Date(chat.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Time not available"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="kaab-message-preview">
                      {chat.latestMessage?.content?.length > 18
                        ? `${chat.latestMessage?.content.slice(0, 18)}...`
                        : chat.latestMessage?.content}
                    </div>
                    <div className="kaab-message-status">
                      {chat.latestMessage?.read ? (
                        <i className="ri-check-double-line text-red-400"></i>
                      ) : (
                        <i className="ri-check-line text-red-400"></i>
                      )}
                    </div>
                  </div>
                </div>
                {notifications.find((n) => n.chat?._id === chat._id) && (
                  <span className="kaab-unread-count">
                    {
                      notifications.filter((n) => n.chat?._id === chat._id)
                        .length
                    }
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="kaab-no-messages">
              <img src="/images/no-messages.png" alt="No Messages" />
              <p>No messages found</p>
            </div>
          )}
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
          {selectedChat?.isGroupChat && (
            <div className="relative">
              <i
                onClick={() => setShowMenu(!showMenu)}
                className="ri-information-line text-3xl text-[#343330] absolute top-1/2 transform -translate-y-1/2  right-4 cursor-pointer"
              ></i>
              {showMenu && (
                <div className="w-80 absolute top-12 right-0 p-6 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2.5 overflow-hidden">
                  <div className="flex-1 inline-flex flex-col justify-start items-center gap-4">
                    <div className="self-stretch inline-flex justify-between items-center">
                      <div className="w-60 justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                        {selectedChat?.chatName}
                      </div>
                      <i
                        onClick={() => setShowMenu(false)}
                        className="ri-close-circle-line text-3xl cursor-pointer text-[#656565]"
                      ></i>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch justify-start text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                        Members
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        {selectedChat?.users
                          .filter((m) => m._id !== user._id)
                          .map((m) => (
                            <div
                              key={m._id}
                              className="self-stretch inline-flex justify-end items-center gap-3"
                            >
                              <div className="flex-1 flex justify-start items-center gap-3.5">
                                <img
                                  className="w-8 h-8 rounded-full"
                                  src={
                                    m.profileImage ||
                                    "https://placehold.co/32x32"
                                  }
                                />
                                <div className="flex-1 justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                                  {m.name}
                                </div>
                              </div>
                              <div
                                onClick={() =>
                                  removeGroupMember(selectedChat._id, m._id)
                                }
                                className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight cursor-pointer"
                              >
                                Remove
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div
                      onClick={() => setShowAddMemberInput(!showAddMemberInput)}
                      className="self-stretch justify-start text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight cursor-pointer"
                    >
                      {showAddMemberInput ? "Close" : "Add Member"}
                    </div>
                    {showAddMemberInput && (
                      <div className="self-stretch flex flex-col justify-start items-start gap-3 mt-4">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search users"
                          className="self-stretch p-2 rounded-lg outline outline-1 outline-[#292929] text-[#3D3D3D] text-base font-normal font-['Inter']"
                        />
                        <div className="self-stretch flex flex-col justify-start items-start gap-3">
                          {searchResults.map((user) => (
                            <div
                              key={user._id}
                              onClick={() =>
                                addGroupMember(selectedChat._id, user._id)
                              }
                              className="self-stretch inline-flex justify-end items-center gap-3 cursor-pointer"
                            >
                              <img
                                className="w-8 h-8 rounded-full"
                                src={
                                  user.profileImage ||
                                  "https://placehold.co/32x32"
                                }
                              />
                              <div className="flex-1 justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                                {user.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="kaab-chat-body" ref={chatBodyRef}>
          {loading ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message._id}
                className={`kaab-chat-message ${
                  message.sender._id === user?._id ? "sender" : "receiver"
                }`}
              >
                <img
                  src={
                    message.sender.profileImage || "/images/default-user.png"
                  }
                  alt={message.sender.name || "User"}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <div className="kaab-chat-name-time">
                    {message.sender.name || "Unknown User"}
                    <span>
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </span>
                  </div>
                  <div className="kaab-chat-text">{message.content || ""}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No messages in this chat
            </div>
          )}
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
              <img src="/images/send.png" alt="send" />
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
            <div className="mb-4">
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
            </div>

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
                  selectedUsers.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
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
