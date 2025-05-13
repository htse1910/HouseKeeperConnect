import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaPaperPlane, FaUserCircle } from "react-icons/fa";
import API_BASE_URL from "../config/apiConfig";

function MessagesPage() {
  const authToken = localStorage.getItem("authToken");
  const accountID = parseInt(localStorage.getItem("accountID"));
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [matchedUser, setMatchedUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [googlePicture, setGooglePicture] = useState(null);
  const [myProfilePicture, setMyProfilePicture] = useState(null);
  const [chattedUsers, setChattedUsers] = useState([]);
  const chatPanelRef = useRef(null);
  const pollingRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const panel = chatPanelRef.current;
    if (!panel) return;

    const handleScroll = () => {
      const distanceFromBottom = panel.scrollHeight - panel.scrollTop - panel.clientHeight;
      setShowScrollButton(distanceFromBottom > 100);
    };

    panel.addEventListener("scroll", handleScroll);
    return () => panel.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (chatPanelRef.current) {
      chatPanelRef.current.scrollTop = chatPanelRef.current.scrollHeight;
    }
  };

  const fetchMessages = () => {
    if (!selectedUser) return;

    fetch(`${API_BASE_URL}/Chat/GetChat?fromAccountId=${accountID}&toAccountId=${selectedUser.accountID}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const latestLocal = messages[messages.length - 1];
        const latestRemote = data[data.length - 1];
        const isNew = !latestLocal || !latestRemote || latestLocal.chatID !== latestRemote.chatID;
        setMessages(data);
        if (isNew && latestRemote?.fromAccountID === accountID) {
          scrollToBottom();
        }
      })
      .catch((err) => console.error("Error fetching messages:", err));
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setMatchedUser(null);
      return;
    }

    fetch(`${API_BASE_URL}/Account/SearchAccount?name=${encodeURIComponent(searchQuery)}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const match = data.find((u) => u.name.toLowerCase() === searchQuery.toLowerCase());
        setMatchedUser(match || null);
      });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedUser) return;

    const newMsg = {
      chatID: Date.now(),
      fromAccountID: accountID,
      toAccountID: selectedUser.accountID,
      content: inputMessage,
      sendAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
    scrollToBottom();

    await fetch(
      `${API_BASE_URL}/Chat/send?FromAccountId=${accountID}&ToAccountId=${selectedUser.accountID}&Message=${encodeURIComponent(inputMessage)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      }
    ).catch((err) => console.error("Send failed:", err));
    fetchMessages();
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages();

    fetch(`${API_BASE_URL}/Account/GetAccount?id=${selectedUser.accountID}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfilePicture(data.localProfilePicture || null);
        setGooglePicture(data.googleProfilePicture || null);
      });

    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(pollingRef.current);
  }, [selectedUser]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/Account/GetAccount?id=${accountID}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => setMyProfilePicture(data.localProfilePicture || data.googleProfilePicture || null));
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetch(`${API_BASE_URL}/Chat/GetChatUsersByUser?fromAccountId=${accountID}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then((res) => res.json())
        .then((ids) =>
          Promise.all(
            ids.map((id) =>
              fetch(`${API_BASE_URL}/Account/GetAccount?id=${id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
              }).then((res) => res.json())
            )
          ).then(setChattedUsers)
        )
        .catch((err) => console.error("Failed to fetch chatted users:", err));
    }
  }, [searchQuery]);

  const renderAvatar = (src) =>
    src ? (
      <img
        src={src}
        alt="Avatar"
        className="rounded-circle border"
        style={{ width: 40, height: 40, objectFit: "cover" }}
      />
    ) : (
      <FaUserCircle size={40} className="text-muted" />
    );

  return (
    <div className="container-fluid px-3" style={{ height: "calc(100vh - 80px)" }}>
      <div className="row h-100 border rounded shadow-sm overflow-hidden">
        {/* Sidebar */}
        <div className="col-md-4 col-lg-3 bg-light border-end p-3 d-flex flex-column">
          <div className="input-group mb-3">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-warning" onClick={handleSearch}>Tìm</button>
          </div>

          {matchedUser ? (
            <button
              className={`list-group-item list-group-item-action d-flex align-items-center shadow-sm rounded mb-2 ${selectedUser?.accountID === matchedUser.accountID ? "active" : ""
                }`}
              onClick={() => setSelectedUser(matchedUser)}
            >
              {renderAvatar(profilePicture || googlePicture)}
              <div>
                <h6 className="mb-0 fw-bold">{matchedUser.name}</h6>
                <small className="text-muted">{matchedUser.email}</small>
              </div>
            </button>
          ) : (
            chattedUsers.map((user) => (
              <button
                key={user.accountID}
                className={`list-group-item list-group-item-action d-flex align-items-center shadow-sm rounded mb-2 ${selectedUser?.accountID === user.accountID ? "active" : ""
                  }`}
                onClick={() => setSelectedUser(user)}
              >
                {renderAvatar(user.localProfilePicture || user.googleProfilePicture)}
                <div>
                  <h6 className="mb-0 fw-bold">{user.name}</h6>
                  <small className="text-muted">{user.email}</small>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Chat Panel */}
        <div className="col-md-8 col-lg-9 d-flex flex-column">
          {selectedUser && (
            <div className="p-3 border-bottom d-flex align-items-center bg-white">
              {renderAvatar(profilePicture || googlePicture)}
              <div>
                <h6 className="mb-0 fw-bold">{selectedUser.name}</h6>
                <small className="text-muted">
                  {selectedUser.roleID === 1 ? "Người giúp việc" : "Gia đình"}
                </small>
              </div>
            </div>
          )}

          {/* Messages */}
          <div
            ref={chatPanelRef}
            className="flex-grow-1 overflow-auto px-3 py-2"
            style={{
              backgroundColor: "#f9f9f9",
              height: 0,
              minHeight: 0,
            }}
          >
            {showScrollButton && (
              <button
                className="btn btn-warning position-absolute"
                style={{ bottom: 80, right: 30, zIndex: 10, borderRadius: "50%" }}
                onClick={scrollToBottom}
                title="Scroll to bottom"
              >
                ⬇️
              </button>
            )}

            {messages.length > 0 ? (
              messages.map((msg) => {
                const isMine = msg.fromAccountID === accountID;
                return (
                  <div key={msg.chatID} className={`d-flex mb-2 ${isMine ? "justify-content-end" : "justify-content-start"}`}>
                    {!isMine && renderAvatar(profilePicture || googlePicture)}
                    <div className={`p-2 rounded shadow-sm ${isMine ? "bg-warning text-white" : "bg-light text-dark"}`} style={{ maxWidth: "75%" }}>
                      {msg.content}
                      <div className="text-end">
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          {new Date(msg.sendAt).toLocaleTimeString()}
                        </small>
                      </div>
                    </div>
                    {isMine && (
                      <img
                        src={myProfilePicture || ""}
                        alt="You"
                        className="rounded-circle ms-2 border"
                        style={{ width: "30px", height: "30px", objectFit: "cover" }}
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted mt-4">Không có tin nhắn nào.</p>
            )}
          </div>

          {/* Input */}
          {selectedUser && (
            <div className="p-3 border-top bg-white">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tin nhắn..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button className="btn btn-warning" onClick={handleSendMessage}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
