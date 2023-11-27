import React, { useContext, useEffect, useRef, useState } from "react";
import { ServerContext } from "../../App";
import { IMessage } from "../../modules/Server/types";

import "./Chat.css";

interface IChatProps {
  chatType: "lobby" | "game";
}

export const Chat: React.FC<IChatProps> = ({ chatType }) => {
  const server = useContext(ServerContext);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const newMessages = await server.getMessages();
      if (newMessages && newMessages !== true) {
        setMessages(newMessages);
      }
    }, 300);
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
console.log(messages);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = async () => {
    const message = inputText.trim();
    if (chatType && message) {
      const res = await server.sendMessages(message);
      if (res) {
        server.STORE.chatHash = res.hash;
      }
      setInputText("");
    }
  };
console.log(messages)
  return (
    <div className="chat_container">
      <div className="chat_messages">
        {messages.map((message) => (
          <div key={message.sendTime} className="message_author">
            [{message.nickname}]: {}
            <span className="message_text">{message.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {chatType === "game" && (
        <div className="chat_input">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Введите сообщение..."
          />
          <button onClick={handleSendMessage}>Отправить</button>
        </div>
      )}
    </div>
  );
};
