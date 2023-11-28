import React, { useContext, useEffect, useRef, useState } from "react";
import { ServerContext } from "../../App";
import { IMessage } from "../../modules/Server/types";

import "./Chat.css";

interface IChatProps {
  chatType: "lobby" | "game";
}

export const Chat: React.FC<IChatProps> = ({ chatType }) => {
  const server = useContext(ServerContext);
  const [messages, setMessages] = useState<IMessage[]>();
  const [inputText, setInputText] = useState<string>("");

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const newMessages = await server.getMessages();

      if (newMessages && newMessages !== true) {
        setMessages(newMessages.messages.reverse());
        server.STORE.chatHash = newMessages.chatHash;
      }
    }, 300);
    return () => {
      clearInterval(interval);
      server.STORE.chatHash = null;
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  });

  const scrollToBottom = (): void => {
    messagesEndRef.current &&
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = async () => {
    const message = inputText.trim();
    if (chatType && message) {
      const res = await server.sendMessages(message);
      if (res) {
        setInputText("");
        scrollToBottom();
      }
    }
  };

  return (
    <div className="chat_container">
      <div className="body_chat">
        <div className="chat_messages ">
          {messages?.map((message) => (
            <div key={message.sendTime} className="message_author">
              [{message.nickname}]: {}
              <span className="message_text">{message.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {chatType === "lobby" && (
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
    </div>
  );
};
