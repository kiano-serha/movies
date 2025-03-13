import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./Pages/Index";
import RatingIndex from "./Pages/Ratings/Index";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import { UserProvider } from "./Contexts/UserProvider";
import Create from "./Pages/Ratings/Create";
import View from "./Pages/movies/View";
import Protected from "./Pages/auth/Protected";
import Watched from "./Pages/movies/Watched";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Protected route={"/"}>
                <Index />
              </Protected>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/ratings/add/:id"
            element={
              <Protected route={"/ratings/add/:id"}>
                <Create />
              </Protected>
            }
          />
          <Route
            path="/movie/view/:id"
            element={
              <Protected route={"/movie/view/:id"}>
                <View />
              </Protected>
            }
          />
          <Route
            path="/ratings"
            element={
              <Protected route={"/ratings"}>
                <RatingIndex />
              </Protected>
            }
          />
          <Route
            path="/watched"
            element={
              <Protected route={"/watched"}>
                <Watched />
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
