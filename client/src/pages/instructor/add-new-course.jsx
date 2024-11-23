import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import React, { useContext, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import CourseCurriculum from "../../components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "../../components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "../../components/instructor-view/courses/add-new-course/course-settings";
import { InstructorContext } from "../../context/instructor-context";
import { AuthContext } from "../../context/auth-context";
import { addNewCourseService } from "../../services";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "../../config";
import { useNavigate } from "react-router-dom";

function AddNewCoursePage() {
  const navigate = useNavigate();
  const {
    courseCurriculumFormData,
    courseLandingFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);
  const { auth } = useContext(AuthContext);

  const isEmpty = (value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  };

  const validateFormData = () => {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true;
      }
    }

    return hasFreePreview;
  };

  const handleCreateCourse = async () => {
    const coursePayload = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    const response = await addNewCourseService(coursePayload);
    console.log('add course response :', response)

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      navigate(-1) // it will go back to previous page.
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
        <Button
          className="text-sm tracking-wider font-bold px-8"
          variant="black"
          disabled={!validateFormData()}
          onClick={handleCreateCourse}
        >
          Submit
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>

              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>

              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
