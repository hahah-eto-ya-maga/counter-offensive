import React, { useEffect, useRef, useState } from "react";
import { chatIcon } from "../../assets/png";

import "./Chat.css";

export interface IChatMessageProps {
  id: number;
  author?: string;
  text: string;
}

interface IChatProps {
  chatType: "lobby" | "game";
}

export const Chat: React.FC<IChatProps> = ({ chatType}) => {
  const [messages, setMessages] = useState<Array<IChatMessageProps>>([
    { id: 1, author: "Гавнарь", text: "чат" },
    {
      id: 2,
      author: "Геральд",
      text: "За пиво и за Темерию!",
    },
    {
      id: 2,
      author: "Серёга",
      text: "говнооооооооооооооооооооо0000000000000000",
    },
    {
      id: 2,
      author: "Скоятаэль",
      text: "адоуироьпщмдпзулк",
    },
    {
      id: 2,
      author: "Лох",
      text: "моча",
    },
    {
      id: 2,
      author: "Piдор",
      text: "АааааааааАААААААААААааааааааааааааААААААААААапппп",
    },
    {
      id: 2,
      author: "Габочик",
      text: "голуби лучше всех",
    },
    {
      id: 2,
      author: "Серёга",
      text: "проект говна",
    },
    {
      id: 2,
      author: "аххххМэд",
      text: "слава аллаху",
    },
    {
      id: 2,
      author: "Геральд",
      text: "За пиво и за Темерию!",
    },
    {
      id: 2,
      author: "пьянчуга",
      text: "темное пиво",
    },
    {
      id: 2,
      author: "Трисс Меригольд",
      text: "мне так приятно, что ты спросил",
    },
    {
      id: 2,
      author: "квартал нелюдей",
      text: "белок на суп!",
    },
  ]);

  const [inputText, setInputText] = useState<string>("");

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = () => {
    if (chatType && inputText.trim() !== "") {
      const newMessage: IChatMessageProps = {
        id: messages.length + 1,
        text: inputText,
      };
      setMessages([...messages, newMessage]);
      setInputText("");
    }
  };

  return (
    <div className="chat_container">
      <div className="body_chat">
        <div className="chat_messages">
          {messages.map((message) => (
            <div key={message.id} className="message_author">
              [{message.author}]: {}
              <span key={message.id} className="message_text">
                {message.text}
              </span>
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
    </div>
  );
};
