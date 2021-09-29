import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../myFirebaseConfig";
import getRecipientEmail from "../utils/getRecipientEmail";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function UserChat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(user, users);

  const [recipientData, setRecipientData] = useState(null);
  useEffect(async () => {
    const recepData = await getRecipientData();
    setRecipientData(recepData);
  }, []);

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  // make query and get data from the DB
  async function getRecipientData() {
    const usersRef = collection(db, "users");
    const recipient = query(usersRef, where("email", "==", recipientEmail));
    const recipientSnapshot = await getDocs(recipient);
    const recpDoc = recipientSnapshot.docs.find(
      (user) => user.data().email === recipientEmail
    );
    const recpData = recpDoc ? recpDoc.data() : null;
    return recpData;
  }

  return (
    <Container onClick={enterChat}>
      {recipientData ? (
        <UserAvatar src={recipientData?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  );
}

export default UserChat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
