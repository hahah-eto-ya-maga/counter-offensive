import React, { useContext, useEffect, useRef, useState } from "react";
import { ServerContext } from "../../App";
import { IMessage } from "../../modules/Server/types";
import { firstRank } from "../../assets/png";
import cn from "classnames";

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
    <div className={cn("chat_container", `chat_container_${chatType}`)}>
      <div className="body_chat">
        <div className={cn("chat_messages", `chat_messages_${chatType}`)}>
          {messages?.map((message) => (
            <div key={message.sendTime} className="message_author">
              [{message.nickname}
              <img src={firstRank} alt="rank" className="rank_img"></img>]: {}
              <span className="message_text">{message.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {chatType === "game" && (
          <div className="chat_input">
            <input
              type="text"
              className="input_chat"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Написать в чат"
            />
            <div className="chat_send_btn " onClick={handleSendMessage}>
              Отправить
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
