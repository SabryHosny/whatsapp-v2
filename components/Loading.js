import { Circle } from "better-react-spinkit";

function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <img
          src="https://th.bing.com/th/id/R.35ffa6e353468280a59e5b4672b8aba0?rik=e5Y6Je9zOSfWrg&riu=http%3a%2f%2flofrev.net%2fwp-content%2fphotos%2f2016%2f06%2fwhatsApp-logo-1.png&ehk=2kmD9AQIuBNDDrrdprGXc3ua6fK6W8wJ%2fiV0VbQhDsI%3d&risl=&pid=ImgRaw&r=0"
          alt=""
          style={{ marginBottom: 10 }}
          height={200}
        />

        <Circle color="#3CBC28" size={60} />
      </div>
    </center>
  );
}

export default Loading;
