import { InstructorContext } from "../../../../context/instructor-context";
import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Switch } from "../../../../components/ui/switch";
import { Label } from "../../../../components/ui/label";
import { courseCurriculumInitialFormData } from "../../../../config";
import { mediaUploadService } from "../../../../services";
import MediaProgressBar from "../../../../components/media-progress-bar";
import VideoPlayer from "../../../../components/video-player";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadPrecentage,
    setMediaUploadPrecentage,
  } = useContext(InstructorContext);

  const handleAddLecture = () => {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  };

  const handleCourseTitleChange = (e, index) => {
    let copyCurriculumFormData = [...courseCurriculumFormData];

    copyCurriculumFormData[index] = {
      ...copyCurriculumFormData[index],
      title: e.target.value,
    };

    setCourseCurriculumFormData(copyCurriculumFormData);
  };

  const handleFreePreviewChange = (value, index) => {
    let copyCurriculumFormData = [...courseCurriculumFormData];

    copyCurriculumFormData[index] = {
      ...copyCurriculumFormData[index],
      freePreview: value,
    };

    setCourseCurriculumFormData(copyCurriculumFormData);
  };

  const handleSingleLectureUpload = async (e, index) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadPrecentage
        );

        if (response.success) {
          let copyCourseCurriculumFormData = [...courseCurriculumFormData];
          copyCourseCurriculumFormData[index] = {
            ...copyCourseCurriculumFormData[index],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(copyCourseCurriculumFormData);
        }
      } catch (error) {
        console.log("error in uploading a video ", error);
      } finally {
        setMediaUploadProgress(false);
      }
    }
  };

  console.log("data :", courseCurriculumFormData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Course Curriculum</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="black" onClick={handleAddLecture}>
          Add Lecture
        </Button>

        {mediaUploadProgress ? (
          <MediaProgressBar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadPrecentage}
          />
        ) : null}

        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((item, index) => (
            <div className="border p-5 rounded-md">
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  onChange={(e) => handleCourseTitleChange(e, index)}
                  value={courseCurriculumFormData[index]?.title}
                />

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={courseCurriculumFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`}
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                  />

                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className="mt-6">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex gap-3">
                    <VideoPlayer
                      url={courseCurriculumFormData[index]?.videoUrl} width="450px" height="200px"
                    />
                    <Button variant="black">Replace Video</Button>
                    <Button className="bg-red-900 text-white">
                      Delete Lecture
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    className="mb-4"
                    onChange={(event) =>
                      handleSingleLectureUpload(event, index)
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
