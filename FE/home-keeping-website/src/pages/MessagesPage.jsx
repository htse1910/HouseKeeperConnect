import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom"; // Get search query from URL
import { FaSearch, FaPaperPlane, FaUserCircle } from "react-icons/fa";

function MessagesPage() {
  const authToken = localStorage.getItem("authToken");
  const accountID = parseInt(localStorage.getItem("accountID"));
  const [searchParams] = useSearchParams(); // Get search params from URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || ""); // Pre-fill search
  const [matchedUser, setMatchedUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null); // Ref for auto-scroll

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch user only when the search button is clicked
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setMatchedUser(null);
      return;
    }

    fetch(`http://localhost:5280/api/Account/SearchAccount?name=${encodeURIComponent(searchQuery)}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const exactMatch = data.find((user) => user.name.toLowerCase() === searchQuery.toLowerCase());
        setMatchedUser(exactMatch || null);
      })
      .catch((err) => console.error("Error fetching users:", err));
  };

  // Auto-search if the searchQuery is pre-filled from JobDetailsPage
  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, []);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (!selectedUser) return;

    fetch(`http://localhost:5280/api/Chat/GetChat?fromAccountId=${accountID}&toAccountId=${selectedUser.accountID}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        scrollToBottom();
      })
      .catch((err) => console.error("Error fetching messages:", err));
  }, [selectedUser]);

  // Send message function
  const handleSendMessage = async () => {
    if (!selectedUser || inputMessage.trim() === "") return;

    try {
      const response = await fetch(`http://localhost:5280/api/Chat/send?FromAccountId=${accountID}&ToAccountId=${selectedUser.accountID}&Message=${encodeURIComponent(inputMessage)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to send message");

      // Add message instantly
      const newMessage = {
        chatID: messages.length + 1,
        fromAccountID: accountID,
        toAccountID: selectedUser.accountID,
        content: inputMessage,
        sendAt: new Date().toISOString(),
      };

      setMessages([...messages, newMessage]);
      setInputMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container-fluid mt-3" style={{ height: "85vh" }}>
      <div className="row h-100">
        {/* Left Sidebar - User List */}
        <div className="col-md-4 col-lg-3 border-end p-3" style={{ backgroundColor: "#f8f8f8" }}>
          {/* Search Bar */}
          <div className="mb-3">
            <div className="input-group">
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
              <button className="btn btn-primary" onClick={handleSearch}>Tìm</button>
            </div>
          </div>

          {/* Show Name Tag Only If Exact Match */}
          {matchedUser && (
            <button
              className={`list-group-item list-group-item-action d-flex align-items-center ${selectedUser?.accountID === matchedUser.accountID ? "active" : ""}`}
              onClick={() => setSelectedUser(matchedUser)}
            >
              <FaUserCircle size={40} className="me-3" />
              <div className="flex-grow-1">
                <h6 className="mb-0">{matchedUser.name}</h6>
                <small className="text-muted">{matchedUser.email}</small>
              </div>
            </button>
          )}
        </div>

        {/* Right Chat Panel */}
        <div className="col-md-8 col-lg-9 d-flex flex-column">
          {/* Chat Header */}
          {selectedUser && (
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
              <div className="d-flex align-items-center">
                <FaUserCircle size={40} className="me-3" />
                <div>
                  <h6 className="mb-0">{selectedUser.name}</h6>
                  <small className="text-muted">Gia đình</small>
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-grow-1 p-3 d-flex flex-column" style={{ overflowY: "auto", backgroundColor: "#f9f9f9" }}>
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.chatID} className={`d-flex ${msg.fromAccountID === accountID ? "justify-content-start" : "justify-content-end"} mb-2`}>
                  {msg.fromAccountID === accountID && (
                    <div className="d-flex align-items-center">
                      <FaUserCircle size={30} className="text-muted me-2" />
                      <div className="bg-light text-dark p-2 rounded" style={{ maxWidth: "75%" }}>
                        {msg.content}
                      </div>
                      <small className="text-muted ms-2">{new Date(msg.sendAt).toLocaleTimeString()}</small>
                    </div>
                  )}

                  {msg.fromAccountID !== accountID && (
                    <div className="d-flex align-items-center">
                      <small className="text-muted me-2">{new Date(msg.sendAt).toLocaleTimeString()}</small>
                      <div className="bg-warning text-white p-2 rounded" style={{ maxWidth: "75%" }}>
                        {msg.content}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted text-center">Không có tin nhắn nào.</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          {selectedUser && (
            <div className="p-3 border-top">
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
