import { fetchStudentBoughtCourseService } from "../../../services";
import { AuthContext } from "../../../context/auth-context";
import { StudentContext } from "../../../context/student-context";
import React, { useContext, useEffect } from "react";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Watch } from "lucide-react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);

  const fetchStudentBoughtCourses = async () => {
    try {
      const response = await fetchStudentBoughtCourseService(auth?.user?._id);
      if (response.success) {
        setStudentBoughtCoursesList(response.data);
      }

      // console.log('fetchStudentBoughtCourseService response', response)
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response;
        console.error("Error response:", data);

        if (data && data.message) {
          alert(`Error ${status}: ${data.message}`);
        } else {
          alert(`Unexpected error occurred. Status: ${status}`);
        }
      } else {
        console.error("Error without response:", error);
        alert("Unable to connect to the server. Please try again later.");
      }
    }
  };

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => (
            <Card key={course._id} className="flex flex-col">
              <CardContent className="p-4 flex-grow">
                <img
                  src={course?.courseImage}
                  alt={course?.title}
                  className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h3 className="font-bold mb-1">{course?.title}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {course?.instructorName}
                </p>
              </CardContent>

              <CardFooter>
                <Button variant="black" className="flex-1" onClick={() => navigate(`/course-progrss/${course?.courseId}`)}>
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching-
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <h1 className="text-3xl font-bold">No Courses Fonud.</h1>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;
