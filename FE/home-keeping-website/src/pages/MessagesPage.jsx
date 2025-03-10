import React, { useState } from "react";
import { FaSearch, FaPaperPlane, FaUserCircle, FaEllipsisV } from "react-icons/fa";

function MessagesPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Nguyễn Văn A", type: "received", text: "Xin chào, tôi cần thêm hiểu thêm một chút về chi tiết công việc", time: "10:30" },
    { id: 2, sender: "Me", type: "sent", text: "Ok, bạn muốn biết thêm thông tin gì?", time: "10:31" },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    setMessages([...messages, { id: messages.length + 1, sender: "Me", type: "sent", text: inputMessage, time: "10:32" }]);
    setInputMessage("");
  };

  return (
    <div className="container-fluid mt-3" style={{ height: "80vh" }}>
      <div className="row h-100">
        {/* Left Sidebar - Conversation List */}
        <div className="col-md-4 col-lg-3 border-end p-3" style={{ backgroundColor: "#f8f8f8" }}>
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch className="text-muted" />
              </span>
              <input type="text" className="form-control border-start-0" placeholder="Tìm kiếm..." />
            </div>
          </div>

          <div className="list-group">
            <button className="list-group-item list-group-item-action d-flex align-items-center active">
              <FaUserCircle size={40} className="me-3" />
              <div className="flex-grow-1">
                <h6 className="mb-0">Nguyễn Văn A</h6>
                <small className="text-muted">Xin chào, tôi cần thêm hiể...</small>
              </div>
              <small className="text-muted">10:30</small>
            </button>
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className="col-md-8 col-lg-9 d-flex flex-column">
          {/* Chat Header */}
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <div className="d-flex align-items-center">
              <FaUserCircle size={40} className="me-3" />
              <div>
                <h6 className="mb-0">Nguyễn Văn A</h6>
                <small className="text-muted">Người giúp việc</small>
              </div>
            </div>
            <FaEllipsisV className="text-muted" />
          </div>

          {/* Chat Messages */}
          <div className="flex-grow-1 p-3 d-flex flex-column" style={{ overflowY: "auto", backgroundColor: "#f9f9f9" }}>
            <div className="text-center mb-3">
              <span className="badge bg-light text-dark">
                Nguyễn Văn A đã đăng ký công việc [Chăm sóc mèo] của bạn.
              </span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`d-flex ${msg.type === "sent" ? "justify-content-end" : ""} mb-2`}>
                {msg.type === "received" && <FaUserCircle size={30} className="text-muted me-2" />}
                <div className={`p-2 rounded ${msg.type === "sent" ? "bg-warning text-white" : "bg-light"}`} style={{ maxWidth: "75%" }}>
                  {msg.text}
                </div>
                <small className="text-muted ms-2 align-self-end">{msg.time}</small>
              </div>
            ))}
          </div>

          {/* Chat Input */}
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
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
