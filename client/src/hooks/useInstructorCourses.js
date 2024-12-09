import { useQuery } from '@tanstack/react-query'
import { fetchInstructorCourseListServiceWithReactQuery } from '../services'

const useInstructorCourses = () => {
    return useQuery({
        queryKey: ["instructorCourses"], // Query key for caching.
        queryFn: fetchInstructorCourseListServiceWithReactQuery, //data fetching function.
        staleTime: 5 * 60 * 1000, //optional
        onError: (error) => {
            console.error(
                "Error fetching instructor courses:",
                error.response?.data || error.message
            );
        },
    }
    )
}

export default useInstructorCourses;