import React, {
   useContext,
   forwardRef,
   useEffect,
   useRef,
   useState,
} from "react";
import cn from "classnames";
import { ServerContext } from "../../App";
import { requestDelay } from "../../config";
import { EHash, ERank, IMessage } from "../../modules/Server/interfaces";
import {
   firstRank,
   secondRank,
   thirdRank,
   fourthRank,
   sendMessage,
   chatIcon,
} from "./assets";

import "./Chat.css";

interface IChatProps {
   chatType: "lobby" | "game";
   ref?: React.MutableRefObject<HTMLInputElement | null>;
}

export const Chat = forwardRef<HTMLInputElement | null, IChatProps>(
   ({ chatType }, ref) => {
      const server = useContext(ServerContext);
      const [messages, setMessages] = useState<IMessage[]>();
      const [inputText, setInputText] = useState<string>("");
      const [isOpen, setIsOpen] = useState<boolean>(false);

      const messagesEndRef = useRef<null | HTMLDivElement>(null);

      useEffect(() => {
         const interval = setInterval(async () => {
            const newMessages = await server.getMessages();
            if (newMessages && newMessages !== true) {
               setMessages(newMessages.messages.reverse());
               server.STORE.setHash(EHash.chat, newMessages.chatHash);
            }
         }, requestDelay.chat);
         return () => {
            clearInterval(interval);
            server.STORE.setHash(EHash.chat, null);
         };
      }, []);

      useEffect(() => {
         scrollToBottom();
      });

      const scrollToBottom = (): void => {
         messagesEndRef.current &&
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      };

      const handleInputChange = (
         event: React.ChangeEvent<HTMLInputElement>
      ) => {
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

      const handleCloseChat = () => {
         setIsOpen(!isOpen);
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
                     <div onClick={handleCloseChat}>
                        <img
                           src={chatIcon}
                           alt="chat_icon"
                           className="chat_icon_game"
                        />
                        <span className="chat_text">Чат</span>
                     </div>
                  </div>
               )}
               <div
                  className={cn("chat_messages", `chat_messages_${chatType}`, {
                     disabled: chatType === "game" && !isOpen,
                  })}
               >
                  {messages && messages.length ? (
                     messages.map((message, index) => (
                        <div
                           key={index}
                           className={cn("message_author", {
                              message_author_user:
                                 server.STORE.user?.id === message.userId,
                           })}
                        >
                           [{message.nickname}
                           <img
                              src={messageImage(message.rank_name)}
                              alt="rank"
                              className="rank_img"
                           />
                           ]: {}
                           <span className="message_text">{message.text}</span>
                        </div>
                     ))
                  ) : (
                     <div className="no_message">Пусто!</div>
                  )}
                  <div ref={messagesEndRef} />
               </div>
            </div>
            {chatType === "game" && (
               <form
                  className={cn("chat_input", {
                     disabled: !isOpen,
                  })}
                  onSubmit={handleSendMessage}
               >
                  <input
                     ref={ref}
                     type="text"
                     className="input_chat"
                     value={inputText}
                     onChange={handleInputChange}
                     placeholder="Написать в чат"
                  />
                  <button className="chat_send_btn ">
                     <img
                        src={sendMessage}
                        alt="send"
                        className="send_btn_game"
                     />
                  </button>
               </form>
            )}
         </div>
      );
   }
);
