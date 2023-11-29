import React, { useContext, useEffect, useRef, useState } from "react";
import { ServerContext } from "../../App";
import { ERank, IMessage } from "../../modules/Server/types";
import {
  firstRank,
  secondRank,
  thirdRank,
  fourthRank,
  sendMessage,
  chatIcon,
} from "../../assets/png";
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

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = inputText.trim();
    if (chatType && message) {
      const res = await server.sendMessages(message);
      if (res) {
        setInputText("");
        scrollToBottom();
      }
    }
  };

  const messageImage = (rank: ERank) => {
    switch (rank) {
      case ERank.Private: {
        return firstRank;
      }
      case ERank.Sergeant: {
        return secondRank;
      }
      case ERank.Officer: {
        return thirdRank;
      }
      case ERank.General: {
        return fourthRank;
      }
    }
  };

  return (
    <div className={cn("chat_container", `chat_container_${chatType}`)}>
      <div className="body_chat">
        {chatType === "game" && (
          <div className="header_chat">
            <img src={chatIcon} alt="chat_icon" className="chat_icon_game" />
            <span className="chat_text">Чат</span>
          </div>
        )}
        <div className={cn("chat_messages", `chat_messages_${chatType}`)}>
          {messages?.map((message, index) => (
            <div key={index} className="message_author">
              [{message.nickname}
              <img
                src={messageImage(message.rank_name)}
                alt="rank"
                className="rank_img"
              />
              ]: {}
              <span className="message_text">{message.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {chatType === "game" && (
        <form className="chat_input" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="input_chat"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Написать в чат"
          />
          <button className="chat_send_btn ">
            <img src={sendMessage} alt="send" className="send_btn_game" />
          </button>
        </form>
      )}
    </div>
  );
};
