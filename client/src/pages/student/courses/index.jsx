import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import React, { useContext, useEffect, useState } from "react";
import { ArrowUpDownIcon } from "lucide-react";
import { filterOptions, sortOptions } from "../../../config";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { StudentContext } from "../../../context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "../../../services";
import { Card, CardContent, CardTitle } from "../../../components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Skeleton } from "../../../components/ui/skeleton";
import { AuthContext } from "../../../context/auth-context";

// here we update the URL to add or remove filter items
function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams(); //when filter option clicked, update URL to add or remove param values

  const fetchAllStudentViewCourses = async (filters, sort) => {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });

    try {
      setLoadingState(true);
      const response = await fetchStudentViewCourseListService(query);

      if (response?.success) {
        setStudentViewCoursesList(response?.data);
        setLoadingState(false);
      }
    } catch (error) {
      console.log("error in fetch student course data :", error);
      setLoadingState(false);
    }
  };

  const handleFilterOnChange = async (getSectionId, getCurrentOption) => {
    let copyFilters = { ...filters };
    const indexOfCurrentSection =
      Object.keys(copyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      copyFilters = {
        ...copyFilters,
        [getSectionId]: [getCurrentOption.id],
      };

      //   console.log("copyFilters", copyFilters);
    } else {
      const indexOfCurrentOption = copyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1) {
        copyFilters[getSectionId].push(getCurrentOption.id);
      } else {
        copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    setFilters(copyFilters);
    sessionStorage.setItem("filters", JSON.stringify(copyFilters));
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

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  //   Make filters and sorting stays when the page re-freshed
  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      fetchAllStudentViewCourses(filters, sort);
    }
  }, [filters, sort]);

  //   Make URL clear when go another page and comes back
  useEffect(() => {
    sessionStorage.removeItem("filters");
  }, []);

  //   console.log('filters :', filters)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
          <div className="space-y-4">
            {/* Filter options */}
            {Object.keys(filterOptions).map((keyItem) => (
              <>
                <div className="p-4 space-y-4">
                  <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                  <div className="grid gap-2 mt-2">
                    {filterOptions[keyItem].map((option) => (
                      <Label className="flex font-medium items-center gap-3">
                        <Checkbox
                          checked={
                            filters &&
                            Object.keys(filters).length > 0 &&
                            filters[keyItem] &&
                            filters[keyItem].indexOf(option.id) > -1
                          }
                          onCheckedChange={() =>
                            handleFilterOnChange(keyItem, option)
                          }
                        />
                        {option.label}
                      </Label>
                    ))}
                  </div>
                </div>
              </>
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-5"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-[16px] font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-gray-600">
              {studentViewCoursesList?.length} results
            </span>
          </div>

          {/* Course list */}
          <div className="space-y-4">
            {loadingState ? (
              <Skeleton />
            ) : (
              <>
                {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                  studentViewCoursesList.map((courseItem) => (
                    <Card
                      key={courseItem?._id}
                      className="cursor-pointer"
                      onClick={() => handleCourseNavigate(courseItem?._id)}
                    >
                      <CardContent className="flex gap-4 p-4">
                        <div className="w-48 h-32 flex-shrink-0">
                          <img
                            src={courseItem?.image}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {courseItem?.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mb-1">
                            Created By{" "}
                            <span className="font-bold">
                              {courseItem.instructorName}
                            </span>
                          </p>
                          <p className="text-[16px] text-gray-600 mb-2 mt-3">
                            {`${courseItem?.curriculum?.length} ${
                              courseItem?.curriculum?.length <= 1
                                ? "Lecture"
                                : "Lectures"
                            } - ${courseItem?.level.toUpperCase()} Level`}
                          </p>
                          <p className="font-bold text-[16px]">
                            ${courseItem?.pricing}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <>
                    <h1>No course found.</h1>
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* <div
        className="relative h-screen bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center">
          <div className="text-white space-y-4">
            <h2 className="text-4xl font-bold">Here the Register Link</h2>
            <p className="text-lg">
              Scroll to see the parallax effect in action!
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default StudentViewCoursesPage;
