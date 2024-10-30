import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import RouteGuard from "./components/route-guard";
import InstructorDashboardPage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={<RouteGuard element={<AuthPage />} authenticated={auth.authenticate} user={auth?.user} />}
        />

        <Route
          path="/instructor"
          element={<RouteGuard element={<InstructorDashboardPage />} authenticated={auth.authenticate} user={auth?.user} />}
        />

        <Route
          path="/instructor"
          element={<RouteGuard element={<InstructorDashboardPage />} authenticated={auth.authenticate} user={auth?.user} />}
        />

        {/* layout for student routes */}
        <Route
          path="/"
          element={
            <RouteGuard authenticated={auth.authenticate} user={auth.user} element={<StudentViewCommonLayout/>} />
          }
        >
          <Route path="home" element={<StudentHomePage/>} />
          <Route path="" element={<StudentHomePage/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
