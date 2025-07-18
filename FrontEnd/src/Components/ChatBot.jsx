import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import { BsPersonFill } from "react-icons/bs";

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi there! 👋 How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat`,
        { message: input }
      );

      setMessages((prev) => [...prev, { type: "bot", text: data.reply }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-[95vw] max-w-md md:w-96 h-[70vh] md:h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaRobot className="text-xl" />
          <h3 className="text-lg font-bold">IntelliBuy Assistant</h3>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full">
          <IoMdClose size={18} />
        </button>
      </div>


      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex mb-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex max-w-[85%] ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`h-8 w-8 flex items-center justify-center rounded-full ${
                  msg.type === "user" ? "bg-blue-100 ml-2" : "bg-purple-100 mr-2"
                }`}
              >
                {msg.type === "user" ? (
                  <BsPersonFill className="text-blue-600" />
                ) : (
                  <FaRobot className="text-purple-600" />
                )}
              </div>
              <div
                className={`px-4 py-2 text-sm rounded-lg break-words ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-white border border-gray-200 rounded-tl-none shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex mb-3 justify-start">
            <div className="flex max-w-[85%]">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-100 mr-2">
                <FaRobot className="text-purple-600" />
              </div>
              <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t bg-white border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`p-2 rounded-full transition ${
              input.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <IoSend size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-1">
          AI Assistant may produce inaccurate information
        </p>
      </div>
    </div>
  );
};

export default ChatBot;
