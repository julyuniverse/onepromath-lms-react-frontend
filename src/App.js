import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home/Home';
import { Fragment, useEffect, useState } from 'react';
import { login } from "./api/axios";
import ScrollToTop from './components/ScrollToTop';
import MonthlyReport from './pages/monthlyReport/MonthlyReport';

const App = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [isMonthlyReport, setIsMonthlyReport] = useState(false);

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
              setIsLogin(true);
              window.location.href = "/";
            }
          })
          .catch((error) => { console.error(error) })
      } else {
        if (window.sessionStorage.getItem("token")) {
          setIsLogin(true);
        } else {
          setIsLogin(false);
          window.location.href = "http://xn--qj1bp8hv6hwhs4z37u.com/login_v2.php";
        }
      }
    } else {
      if (window.sessionStorage.getItem("token")) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
        window.location.href = "http://xn--qj1bp8hv6hwhs4z37u.com/login_v2.php";
      }
    }
  }

  useEffect(() => {
    let pathname = location.pathname;
    let arr = pathname.split("/");

    arr = arr.filter((el) => {
      return el !== null && el !== undefined && el !== "";
    });

    if (arr[0] === "monthly-report") {
      setIsMonthlyReport(true);
    } else {
      checkToken();
    }
  }, [location]);

  return (
    <div className="App">
      {
        isMonthlyReport ? (
          <Routes>
            <Route path="/monthly-report/:usertype/:userno/:profileno/:startdate" element={<MonthlyReport />}></Route>
            <Route path="*" element={<MonthlyReport />}></Route>
          </Routes>
        ) : (
          isLogin ? (
            <Fragment>
              <ScrollToTop />
              <div className="h-full w-[1440px] min-w-[1440px] mx-auto">
                <Routes>
                  <Route path="/home/*" element={<Home />}></Route>
                  {/* 상단에 위치하는 라우트들의 규칙을 모두 확인하고, 일치하는 라우트가 없다면 마지막 라우트가 화면에 나타나게 됨. */}
                  <Route path="*" element={<Home />}></Route>
                </Routes>
              </div>
            </Fragment>
          ) : (null)
        )
      }
    </div>
  );
}

export default App;
