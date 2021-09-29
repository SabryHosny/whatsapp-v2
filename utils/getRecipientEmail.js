export default function getRecipientEmail(userLoggedIn, users) {
  const recipientEmail = users?.filter(
    (user) => user !== userLoggedIn?.email
  )[0];
  return recipientEmail;
}
