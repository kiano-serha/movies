import axios from "axios";
import { useState, useEffect } from "react";
import Toast from "../../Pages/components/Toast";
import Cookies from "js-cookie";

export default function Protected({ children, route }) {
  const [authenticated, setAuthentication] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SERVER_URL + "/protected", {headers: {Authorization: 'Bearer ' + Cookies.get("token")},})
      .then((res) => {
        if (res.data.error == undefined) {
          setAuthentication(true);
        } else {
          window.location.href = "/login";
        }
      })
      .catch((err) => {
        window.location.href = "/login";
      });
  }, [children, route]);

  return (
    <>
      <Toast />
      {authenticated ? children : ""}
    </>
  );
}
