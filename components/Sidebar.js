import { Avatar, Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import { MoreVert, Chat, Search } from "@material-ui/icons";
import * as EmailValidator from "email-validator";
import { auth, db } from "../myFirebaseConfig";
import { addDoc, getDocs, collection, query, where } from "@firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import UserChat from "./UserChat";
import { useEffect, useState } from "react";

function Sidebar() {
  const [user] = useAuthState(auth);
  const chatsRef = collection(db, "chats");
  const [userChats, setUserChats] = useState(null);
  useEffect(async () => {
    const chatsSnapshot = await getUserChats();
    setUserChats(chatsSnapshot);
  }, []);

  const createChat = async () => {
    const user_input = prompt(
      "Please enter an email address for the user you wish to chat with"
    );
    const input = user_input.replace(/\s/g, "").toLowerCase();

    if (!input) return null;
    // get all chats of the current user to see if there is allready one chat exist with the input email.
    const isExist = await chatAllreadyExists(input);

    if (EmailValidator.validate(input) && !isExist && input !== user.email) {
      // We need to add the chat into the DB 'chats' collection if it doesnot already exist and is valid
      const chatsRef = collection(db, "chats");
      addDoc(chatsRef, {
        users: [user.email, input],
      });
    }
  };

  async function getUserChats() {
    const user_chats_query = query(
      chatsRef,
      where("users", "array-contains", user.email)
    );
    const chatsSnapshot = await getDocs(user_chats_query);
    return chatsSnapshot;
  }

  // someValue? ==> means it can be (null)
  // !!someValue ==> convert it to (true) or (false) if there is a value or not
  async function chatAllreadyExists(recipientEmail) {
    getUserChats();
    const foundData = userChats.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

    return !!foundData;
  }

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

        <IconsContainer>
          <IconButton>
            <Chat />
          </IconButton>

          <IconButton>
            <MoreVert />
          </IconButton>
        </IconsContainer>
      </Header>

      <SearchContainer>
        <Search />
        <SearchInput placeholder="Search in chats" />
      </SearchContainer>

      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

      {/* llist of chats */}
      {userChats?.docs.map((chat) => (
        <UserChat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

// ============= Styled Components ================
const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  // to hide the scrollbar
  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
