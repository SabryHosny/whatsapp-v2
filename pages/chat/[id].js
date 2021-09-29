import Head from "next/head";
import styled from "styled-components";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";

import {
  addDoc,
  getDocs,
  collection,
  query,
  orderBy,
  where,
  getDoc,
  doc,
} from "@firebase/firestore";
import { db, auth } from "../../myFirebaseConfig";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(user, chat.users)}</title>
      </Head>

      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export default Chat;

export async function getServerSideProps(context) {
  // Get Single Doc (record)
  const chatRef = doc(db, "chats", context.query.id);
  const chatDoc = await getDoc(chatRef);

  // Make Quries and get an Array of Docs (records[])
  const messagesRef = collection(chatRef, "messages");
  const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
  const messagesDocs = (await getDocs(messagesQuery)).docs;

  // reconstruct messages
  const messages = messagesDocs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((msg) => ({
      ...msg,
      timestamp: msg.timestamp?.toDate().getTime(),
    }));

  // reconstruct chat
  const chat = {
    id: chatDoc.id,
    ...chatDoc.data(),
  };

  console.log(chat);

  return {
    props: {
      messages: JSON.stringify(messages),
      chat,
    },
  };
}

const Container = styled.div`
  display: flex;
`;
const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;
  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none;
  scrollbar-width: none;
`;
