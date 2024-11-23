import { InstructorContext } from "../../../../context/instructor-context";
import { courseLandingPageFormControls } from "../../../../config";
import FormControls from "../../../common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import React, { useContext } from "react";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext);

  // console.log('courseLandingFormData:', courseLandingFormData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Landing Page</CardTitle>
      </CardHeader>

      <CardContent>
        <FormControls
          formControls={courseLandingPageFormControls}
          formData={courseLandingFormData}
          setFormData={setCourseLandingFormData}
        />
      </CardContent>
    </Card>
  );
}

export default CourseLanding;
