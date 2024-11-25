import { InstructorContext } from "../../../../context/instructor-context";
import React, { useContext, useRef } from "react";
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
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "../../../../services";
import MediaProgressBar from "../../../../components/media-progress-bar";
import VideoPlayer from "../../../../components/video-player";
import { Upload } from "lucide-react";

function CourseCurriculum() {
  const bulkUploadInputRef = useRef(null);
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

  const isCourseCurriculumFormDataValid = () => {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  };

  const handleReplaceVideo = async (index) => {
    let copyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      copyCourseCurriculumFormData[index].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );

    // console.log('deleteCurrentMediaResponse :', deleteCurrentMediaResponse)
    if (deleteCurrentMediaResponse?.success) {
      copyCourseCurriculumFormData[index] = {
        ...copyCourseCurriculumFormData[index],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(copyCourseCurriculumFormData);
    }
  };

  const checkCourseCurriculumObjectEmpty = (arr) => {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  };

  const handleOpenBulkUpload = () => {
    bulkUploadInputRef.current?.click();
  };

  const handleMediaBulkUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadPrecentage
      );

      if (response.success) {
        let copyCourseCurriculumFormData = checkCourseCurriculumObjectEmpty(
          courseCurriculumFormData
        )
          ? []
          : [...courseCurriculumFormData];

        copyCourseCurriculumFormData = [
          ...copyCourseCurriculumFormData,
          ...response.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${
              copyCourseCurriculumFormData.length + (index + 1)
            }`,
            freePreview: false,
          })),
        ];

        setCourseCurriculumFormData(copyCourseCurriculumFormData);
        setMediaUploadProgress(false);
      }
    } catch (error) {
      console.log("Error in bulk upload :", error);
      setMediaUploadProgress(false);
    }
  };

  const handleDeleteLecture = async (currentIndex) => {
    let copyCourseCurruculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId =
      copyCourseCurruculumFormData[currentIndex].public_id;

    try {
      const response = await mediaDeleteService(
        getCurrentSelectedVideoPublicId
      );

      if (response.success) {
        copyCourseCurruculumFormData = copyCourseCurruculumFormData.filter((_, index) => index !== currentIndex);

        setCourseCurriculumFormData(copyCourseCurruculumFormData);
      }
    } catch (error) {
      console.log("Error in deleting a course video :", error);
    }
  };

  // console.log("data :", courseCurriculumFormData);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUpload}
          >
            <Upload className="w-4 h-4 mr-2" /> Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          variant="black"
          onClick={handleAddLecture}
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
        >
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
                      url={courseCurriculumFormData[index]?.videoUrl}
                      width="450px"
                      height="200px"
                    />
                    <Button
                      variant="black"
                      onClick={() => handleReplaceVideo(index)}
                    >
                      Replace Video
                    </Button>
                    <Button
                      className="bg-red-900 text-white"
                      onClick={() => handleDeleteLecture(index)}
                    >
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
