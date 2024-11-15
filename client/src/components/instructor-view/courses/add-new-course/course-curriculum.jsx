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

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
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
    // console.log("file upload :", e.target.files);
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log("seletected file :", selectedFile);

      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      for (let pair of videoFormData.entries()) {
        console.log(`_hi ${pair[0]}:`, pair[1]);
      }

      // console.log("videoFormData :", videoFormData);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(videoFormData);
        console.log("file upload :", response);
      } catch (error) {
        console.log("error in uploading a video ", error);
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
                <Input
                  type="file"
                  accept="video/*"
                  className="mb-4"
                  onChange={(event) => handleSingleLectureUpload(event, index)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
