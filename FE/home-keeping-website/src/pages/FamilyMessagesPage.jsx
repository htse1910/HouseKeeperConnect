import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaPaperPlane, FaUserCircle } from "react-icons/fa";
import "../assets/styles/Profile.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function FamilyMessagesPage() {
    const authToken = localStorage.getItem("authToken");
    const accountID = parseInt(localStorage.getItem("accountID"));
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [matchedUser, setMatchedUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);

    const [newMessagesMap, setNewMessagesMap] = useState({});

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    const handleSearch = () => {
        if (!searchQuery.trim()) return setMatchedUser(null);
        fetch(`http://localhost:5280/api/Account/SearchAccount?name=${encodeURIComponent(searchQuery)}`, {
            headers: { Authorization: `Bearer ${authToken}` },
        })
            .then(res => res.json())
            .then(data => {
                const exactMatch = data.find(user => user.name.toLowerCase() === searchQuery.toLowerCase());
                setMatchedUser(exactMatch || null);
                setSelectedUser(exactMatch || null);
            })
            .catch(err => console.error("Lỗi tìm kiếm:", err));
    };

    useEffect(() => { if (searchQuery) handleSearch(); }, []);
    useEffect(() => {
        if (!selectedUser) return;
        fetch(`http://localhost:5280/api/Chat/GetChat?fromAccountId=${accountID}&toAccountId=${selectedUser.accountID}`, {
            headers: { Authorization: `Bearer ${authToken}` },
        })
            .then(res => res.json())
            .then(data => {
                if (messages.length > 0 && data.length > messages.length) {
                    const newMsg = data.at(-1);
                    if (newMsg.fromAccountID !== accountID) {
                        const notification = new Audio("/sounds/message.mp3");
                        notification.play();

                        toast.info(`Tin nhắn mới từ ${selectedUser.name}`, {
                            icon: "💬",
                            toastId: "new-message"
                        });

                        setNewMessagesMap(prev => ({
                            ...prev,
                            [newMsg.fromAccountID]: (prev[newMsg.fromAccountID] || 0) + 1,
                        }));
                    }
                }
                setMessages(data);
                scrollToBottom();
                setNewMessagesMap(prev => ({
                    ...prev,
                    [selectedUser.accountID]: 0,
                }));
            })
            .catch(err => console.error("Lỗi tải tin nhắn:", err));
    }, [selectedUser]);

    const handleSendMessage = async () => {
        if (!selectedUser || inputMessage.trim() === "") return;

        try {
            await fetch(
                `http://localhost:5280/api/Chat/send?FromAccountId=${accountID}&ToAccountId=${selectedUser.accountID}&Message=${encodeURIComponent(inputMessage)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

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
            console.error("Lỗi gửi tin nhắn:", error);
        }
    };

    return (
        <div className="family-message-page-container">
            {/* Sidebar bên trái */}
            <div className="family-message-page-sidebar">
                <div className="family-message-page-search">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch}>Tìm</button>
                </div>

                {matchedUser && (
                    <div
                        className={`family-message-page-user-item ${selectedUser?.accountID === matchedUser.accountID ? "active" : ""}`}
                        onClick={() => setSelectedUser(matchedUser)}

                    >
                        {newMessagesMap[matchedUser.accountID] > 0 && (
                            <span className="family-message-page-badge">
                                {newMessagesMap[matchedUser.accountID]}
                            </span>
                        )}

                        <FaUserCircle className="family-message-page-avatar" />
                        <div>
                            <div className="family-message-page-name">{matchedUser.name}</div>
                            <div className="family-message-page-email">{matchedUser.email}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Khung chat bên phải */}
            <div className="family-message-page-chatbox">
                {/* Header */}
                {selectedUser && (
                    <div className="family-message-page-header">
                        <FaUserCircle className="family-message-page-avatar" />
                        <div>
                            <div className="family-message-page-name">{selectedUser.name}</div>
                            <div className="family-message-page-role">Người giúp việc</div>
                        </div>
                    </div>
                )}

                {/* Tin nhắn */}
                <div className="family-message-page-messages">
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <div
                                key={msg.chatID}
                                className={`family-message-page-message ${msg.fromAccountID === accountID ? "from-me" : "from-them"}`}
                            >
                                {msg.fromAccountID === accountID ? (
                                    <>
                                        <FaUserCircle className="family-message-page-avatar-small" />
                                        <div className="bubble">{msg.content}</div>
                                        <small>{new Date(msg.sendAt).toLocaleTimeString()}</small>
                                    </>
                                ) : (
                                    <>
                                        <small>{new Date(msg.sendAt).toLocaleTimeString()}</small>
                                        <div className="bubble other">{msg.content}</div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="family-message-page-empty">Không có tin nhắn nào.</p>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Nhập tin nhắn */}
                {selectedUser && (
                    <div className="family-message-page-input-area">
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage}>
                            <FaPaperPlane />
                        </button>
                    </div>
                )}
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default FamilyMessagesPage;
