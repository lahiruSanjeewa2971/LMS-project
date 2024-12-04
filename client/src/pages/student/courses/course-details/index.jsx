import { useLocation, useParams } from "react-router-dom";
import { StudentContext } from "../../../../context/student-context";
import React, { useContext, useEffect, useState } from "react";
import {
  captureAndFinalyzePaymentService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "../../../../services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import VideoPlayer from "../../../../components/video-player";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { AuthContext } from "../../../../context/auth-context";

function StudentViewCourseDetailsPage() {
  const { auth } = useContext(AuthContext);
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
  } = useContext(StudentContext);

  const { id } = useParams();

  const [displayCurrentFreePreviewVideo, setDisplayCurrentFreePreviewVideo] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);

  const fetchStudentViewCourseDetails = async (currentCourseDetailsId) => {
    try {
      const response = await fetchStudentViewCourseDetailsService(
        currentCourseDetailsId
      );

      if (response.success) {
        setStudentViewCourseDetails(response?.data);
      } else {
        setStudentViewCourseDetails(null);
      }
    } catch (error) {
      console.log("error in fech single course details :", error);
    }
  };

  const handleSetFreePreview = (getCurrentVideoInfo) => {
    // console.log('getCurrentVideoInfo :', getCurrentVideoInfo)
    setDisplayCurrentFreePreviewVideo(getCurrentVideoInfo?.videoUrl);
  };

  const handleCapturePayment = async (orderId) => {
    if (orderId !== null || orderId !== undefined) {
      try {
        const response = await captureAndFinalyzePaymentService(
          "",
          auth.user._id,
          orderId
        );

        return response;
      } catch (error) {
        console.log("error in handleCapturePayment :", error);
        return error;
      }
    }
  };

  const handleCreatePayment = async () => {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    // console.log("paymentPayload :", paymentPayload);
    try {
      const response = await createPaymentService(paymentPayload);
      console.log("payment response :", response);

      if (response.success) {
        sessionStorage.setItem(
          "orderId",
          JSON.stringify(response.data.orderId)
        );

        const capturePaymentResponse = await handleCapturePayment(
          response.data.orderId
        );

        console.log("capturePaymentResponse :", capturePaymentResponse);
        if (capturePaymentResponse && capturePaymentResponse?.success) {
          window.location.href = "/student-courses";
        }
      }
    } catch (error) {
      console.log("error in handleCreatePayment :", error);
    }
  };

  useEffect(() => {
    if (displayCurrentFreePreviewVideo !== null) {
      setShowFreePreviewDialog(true);
    }
  }, [displayCurrentFreePreviewVideo]);

  useEffect(() => {
    if (id) {
      setCurrentCourseDetailsId(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) {
      fetchStudentViewCourseDetails(currentCourseDetailsId);
    }
  }, [currentCourseDetailsId]);

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>

        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created By : {studentViewCourseDetails?.instructorName}</span>
          <span>
            Created On : {studentViewCourseDetails?.date.split("T")[0]}
          </span>
          <span className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span>
            {studentViewCourseDetails?.students.length}{" "}
            {studentViewCourseDetails?.students.length > 1
              ? "Students"
              : "Student"}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What you will learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCourseDetails?.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li className="flex items-start" key={index}>
                      <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>{studentViewCourseDetails?.description}</CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {studentViewCourseDetails?.curriculum?.map(
                (curriculum, index) => (
                  <li
                    className={`${
                      curriculum?.freePreview
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    } flex items-center mb-4`}
                    onClick={
                      curriculum?.freePreview
                        ? () => handleSetFreePreview(curriculum)
                        : null
                    }
                  >
                    {curriculum?.freePreview ? (
                      <PlayCircle className="mr-2 w-4 h-4" />
                    ) : (
                      <Lock className="mr-2 w-4 h-4" />
                    )}
                    <span>{curriculum?.title}</span>
                  </li>
                )
              )}
            </CardContent>
          </Card>
        </main>

        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.curriculum[
                          getIndexOfFreePreviewUrl
                        ].videoUrl
                      : ""
                  }
                  width="450px"
                  height="200px"
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  ${studentViewCourseDetails?.pricing}
                </span>
              </div>
              <Button
                className="w-full"
                variant="black"
                onClick={() => handleCreatePayment()}
              >
                Buy Now
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentFreePreviewVideo(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentFreePreviewVideo}
              width="450px"
              height="200px"
            />
          </div>
          <div className="flex flex-col gap-2">
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem) => (
                <p
                  className="cursor-pointer text-[16px] font-medium"
                  onClick={() => handleSetFreePreview(filteredItem)}
                >
                  {filteredItem?.title}
                </p>
              ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button variant="secondary" type="button">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
