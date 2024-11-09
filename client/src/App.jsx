import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import RouteGuard from "./components/route-guard";
import InstructorDashboardPage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found";
import AddNewCoursePage from "./pages/instructor/add-new-course";

function App() {
  const { auth } = useContext(AuthContext);
  // console.log('auth context ', auth)

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
          path="/instructor/create-new-course"
          element={<RouteGuard element={<AddNewCoursePage />} authenticated={auth.authenticate} user={auth?.user} />}
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

        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </>
  );
}

export default App;
