import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home/Home';
import { useEffect } from 'react';
import { login } from "./api/axios";

const App = () => {
  const location = useLocation();

  const checkToken = () => {
    let queryString = window.location.search;

    // query string이 있을 때
    if (queryString !== "") {
      let params = new URLSearchParams(queryString);
      let token = params.get("token");

      if (token !== "") {
        let decode = window.atob(token);

        // jwt decoding
        let jwt = decode.split(".");
        let payload = JSON.parse(jwt[1]);
        let id = window.atob(payload.id);
        let pw = window.atob(payload.password);

        login(id, pw)
          .then(async (res) => {
            if (res.data === null) { // 계정이 없다면
              window.location.href = "http://xn--qj1bp8hv6hwhs4z37u.com/login_v2.php";
            } else {
              window.sessionStorage.setItem("token", token);
              window.sessionStorage.setItem("teachername", res.data.teacherName);
              window.sessionStorage.setItem("schoolinfono", res.data.schoolInfoNo);
              window.sessionStorage.setItem("schoolname", res.data.schoolName);
              window.location.href = "/";
            }
          })
          .catch((error) => { console.error(error) })
      } else {
        if (window.sessionStorage.getItem("token")) {
        } else {
          window.location.href = "http://xn--qj1bp8hv6hwhs4z37u.com/login_v2.php";
        }
      }
    } else {
      if (window.sessionStorage.getItem("token")) {
      } else {
        window.location.href = "http://xn--qj1bp8hv6hwhs4z37u.com/login_v2.php";
      }
    }
  }

  useEffect(() => {
    console.log("App.js");
    // let pathname = location.pathname;
    // let arr = pathname.split("/");

    checkToken();
  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        {/* 상단에 위치하는 라우트들의 규칙을 모두 확인하고, 일치하는 라우트가 없다면 마지막 라우트가 화면에 나타나게 됨. */}
        <Route path="/*" element={<Home />}></Route>
      </Routes>
    </div>
  );
}

export default App;
