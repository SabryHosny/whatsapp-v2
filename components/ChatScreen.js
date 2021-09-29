import styled from "styled-components";
import { auth, db } from "../myFirebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { Avatar, Button, IconButton } from "@material-ui/core";
import { MoreVert, AttachFile, InsertEmoticon, Mic } from "@material-ui/icons";
import {
  doc,
  getDoc,
  addDoc,
  setDoc,
  collection,
  query,
  orderBy,
  where,
  getDocs,
  Timestamp,
} from "@firebase/firestore";
import Message from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import { useState, useEffect, useRef } from "react";

// =============================================================
function ChatScreen({ chat, messages }) {
  console.log("what.....");
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [chatMessages, setChatMessages] = useState(null);
  const [recipientData, setRecipientData] = useState(null);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null);

  const getMessages = async () => {
    const chatRef = doc(db, "chats", router.query.id);
    const messagesRef = collection(chatRef, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
    const messagesDocs = (await getDocs(messagesQuery)).docs;
    return messagesDocs;
  };

  const recipientEmail = getRecipientEmail(user, chat.users);
  const getRecipientData = async () => {
    const q = query(
      collection(db, "users"),
      where("email", "==", recipientEmail)
    );

    const usersDocs = (await getDocs(q)).docs;
    return usersDocs[0]?.data();
  };

  useEffect(async () => {
    const messagesDocs = await getMessages();
    setChatMessages(messagesDocs);

    const recipData = await getRecipientData();
    setRecipientData(recipData);
  }, [router.query.id]);

  const showMessages = () => {
    if (chatMessages && chatMessages.length > 0) {
      console.log("messages from CSR");
      console.log(chatMessages);
      return chatMessages.map((msg) => (
        <Message
          key={msg.id}
          user={msg.data().user}
          message={{
            ...msg.data(),
            timestamp: msg.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      console.log("messages from SSR");
      console.log(messages);
      return JSON.parse(messages).map((msg) => {
        return <Message key={msg.id} user={msg.user} message={msg} />;
      });
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    // Update the last seen...
    const userRef = doc(db, "users", user.uid);
    setDoc(
      userRef,
      {
        lastSeen: Timestamp.now(),
      },
      { merge: true }
    );

    const chatRef = doc(db, "chats", router.query.id);
    const messagesRef = collection(chatRef, "messages");

    const docRef = await addDoc(messagesRef, {
      timestamp: Timestamp.now(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    const messagesDocs = await getMessages();
    setChatMessages(messagesDocs);
    scrollToBottom();
  };

  return (
    <Container>
      <Header>
        {recipientData ? (
          <Avatar src={recipientData?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientData ? (
            <p>
              Last active:{" "}
              {recipientData?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipientData?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading last active...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessages ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <Mic />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;
const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  place-content: center;
  gap: 2px;

  > h3 {
    margin: 0;
  }
  > p {
    font-size: 14px;
    color: gray;
    margin: 0;
  }
`;
const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessages = styled.div`
  margin-bottom: 20px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;
