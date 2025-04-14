import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaPaperPlane, FaUserCircle } from "react-icons/fa";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

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
  const [myProfilePicture, setMyProfilePicture] = useState(null);
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = () => {
    if (!selectedUser) return;

    fetch(`${API_BASE_URL}/Chat/GetChat?fromAccountId=${accountID}&toAccountId=${selectedUser.accountID}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // Compare previous length or last message ID
        const latestLocal = messages[messages.length - 1];
        const latestRemote = data[data.length - 1];

        const isNew = !latestLocal || !latestRemote || latestLocal.chatID !== latestRemote.chatID;

        setMessages(data);

        // Only scroll if message was sent by me or on initial load
        if (isNew && latestRemote?.fromAccountID === accountID) {
          scrollToBottom();
        }
      })
      .catch((err) => console.error("Error fetching messages:", err));
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return setMatchedUser(null);
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
  };

  useEffect(() => {
    if (searchQuery) handleSearch();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages(); // Initial load

    fetch(`${API_BASE_URL}/Account/GetAccount?id=${selectedUser.accountID}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => setProfilePicture(data.localProfilePicture || null));

    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(fetchMessages, 3000); // Poll every 3.0s

    return () => clearInterval(pollingRef.current);
  }, [selectedUser]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/Account/GetAccount?id=${accountID}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => setMyProfilePicture(data.localProfilePicture || null));
  }, []);

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

          {matchedUser && (
            <button
              className={`list-group-item list-group-item-action d-flex align-items-center shadow-sm rounded mb-2 ${selectedUser?.accountID === matchedUser.accountID ? "active" : ""}`}
              onClick={() => setSelectedUser(matchedUser)}
            >
              {profilePicture ? (
                <img src={profilePicture} alt="Avatar" className="me-3 rounded-circle border" style={{ width: 40, height: 40, objectFit: "cover" }} />
              ) : <FaUserCircle size={40} className="me-3 text-muted" />}
              <div>
                <h6 className="mb-0 fw-bold">{matchedUser.name}</h6>
                <small className="text-muted">{matchedUser.email}</small>
              </div>
            </button>
          )}
        </div>

        {/* Chat Panel */}
        <div className="col-md-8 col-lg-9 d-flex flex-column">
          {/* Header */}
          {selectedUser && (
            <div className="p-3 border-bottom d-flex align-items-center bg-white">
              {profilePicture ? (
                <img src={profilePicture} alt="Receiver" className="me-3 rounded-circle border" style={{ width: 40, height: 40, objectFit: "cover" }} />
              ) : <FaUserCircle size={40} className="me-3 text-muted" />}
              <div>
                <h6 className="mb-0 fw-bold">{selectedUser.name}</h6>
                <small className="text-muted">Gia đình</small>
              </div>
            </div>
          )}

          {/* Messages */}
          <div
            className="flex-grow-1 overflow-auto px-3 py-2"
            style={{
              backgroundColor: "#f9f9f9",
              height: 0, // prevent extra growth
              minHeight: 0,
            }}
          >
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isMine = msg.fromAccountID === accountID;
                return (
                  <div key={msg.chatID} className={`d-flex mb-2 ${isMine ? "justify-content-end" : "justify-content-start"}`}>
                    {!isMine && (
                      <img
                        src={profilePicture || ""}
                        alt="Them"
                        className="rounded-circle me-2 border"
                        style={{ width: "30px", height: "30px", objectFit: "cover" }}
                      />
                    )}
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
            <div ref={messagesEndRef} />
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
