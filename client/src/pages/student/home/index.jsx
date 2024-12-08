import { courseCategories } from "../../../config";
import banner from "../../../../public/banner_image_new.png";
import { Button } from "../../../components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "../../../context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "../../../services";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";

function StudentHomePage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);

  const fetchAllStudentViewCourses = async () => {
    const response = await fetchStudentViewCourseListService();
    // console.log("all courses :", response);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
    }
  };

  const handleCourseNavigate = async (courseId) => {
    try {
      const response = await checkCoursePurchaseInfoService(
        courseId,
        auth?.user?._id
      );

      // console.log('checkCoursePurchaseInfoService :', response)
      if (response.success) {
        if (response?.data) {
          navigate(`/course-progrss/${courseId}`);
        } else {
          navigate(`/course/details/${courseId}`);
        }
      }
    } catch (error) {
      console.log("error in handleCourseNavigate :", error);
    }
  };

  const handleNavigateToCoursesPage = async (id) => {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/courses");
  };

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="flex items-center flex-col lg:flex-row justify-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Learning can gets you.</h1>
          <p className="text-xl mb-3">
            Skills for your present and future. Get Started with US.
          </p>
        </div>

        <div className="lg:w-full mb-8 lg:mb-0">
          <img
            src={banner}
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>

      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>

      <div
        className="relative h-[500px] bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center">
          <div className="text-white space-y-4">
            <h2 className="text-4xl font-bold">Here the Register Link</h2>
            <p className="text-lg">
              Scroll to see the parallax effect in action!
            </p>
          </div>
        </div> */}
      </div>

      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                onClick={() => handleCourseNavigate(courseItem?._id)}
                className="border rounded-lg overflow-hidden shadow cursor-pointer"
              >
                <img
                  src={courseItem?.image}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem?.instructorName}
                  </p>
                  <p className="font-bold text-[16px]">
                    ${courseItem?.pricing}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1>No courses found.</h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
