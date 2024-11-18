import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { InstructorContext } from "../../../../context/instructor-context";
import { mediaUploadService } from "../../../../services";
import MediaProgressBar from "../../../../components/media-progress-bar";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    setMediaUploadProgress,
    mediaUploadProgress,
    mediaUploadPrecentage,
    setMediaUploadPrecentage,
  } = useContext(InstructorContext);

  const handleImageUploadChange = async (e) => {
    const selectedImage = e.target.files[0];
    console.log("image :", selectedImage);

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadPrecentage
        );

        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
        }
      } catch (error) {
        console.log("Error in course image upload ", error);
      } finally {
        setMediaUploadProgress(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>

      <div className="p-4">
        {mediaUploadProgress ? (
          <MediaProgressBar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadPrecentage}
          />
        ) : null}
      </div>

      <CardContent>
        {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} />
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image.</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUploadChange(e)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
