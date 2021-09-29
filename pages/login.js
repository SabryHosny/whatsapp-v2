import { signInWithPopup } from "@firebase/auth";
import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components";
import { auth, provider } from "../myFirebaseConfig";

function Login() {
  const signIn = () => {
    signInWithPopup(auth, provider).catch(alert);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src="https://th.bing.com/th/id/R.35ffa6e353468280a59e5b4672b8aba0?rik=e5Y6Je9zOSfWrg&riu=http%3a%2f%2flofrev.net%2fwp-content%2fphotos%2f2016%2f06%2fwhatsApp-logo-1.png&ehk=2kmD9AQIuBNDDrrdprGXc3ua6fK6W8wJ%2fiV0VbQhDsI%3d&risl=&pid=ImgRaw&r=0" />
        <Button onClick={signIn} variant="outlined">
          Sign In with Google
        </Button>
      </LoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #b0ffb0;
  padding: 100px;
  border-radius: 15px;
  box-shadow: 0px 2px 10px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;
