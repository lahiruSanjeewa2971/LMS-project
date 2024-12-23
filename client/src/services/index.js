import axiosInstance from "../api/axiosInstance";

export async function registerService(formData) {
    try {
        const data = await axiosInstance.post("/auth/register", {
            ...formData,
            role: "user",
        })

        return data.data;
    } catch (error) {
        console.log('Error in registering :', error)
        return error;
    }
}

export async function loginService(formData) {
    const data = await axiosInstance.post("/auth/login", formData)

    return data.data;
}

export async function checkAuthService() {
    const { data } = await axiosInstance.get("/auth/check-auth")

    return data;
}

// export async function mediaUploadService(formData) {
//     console.log('first', formData)
//     const {data} = await axiosInstance.post("/media/upload", formData)
//     console.log('data', data)

//     return data;
// }

export async function mediaUploadService(formData, onProgressCallback) {
    try {
        const { data } = await axiosInstance.post('/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Explicitly set Content-Type
            },
            onUploadProgress: (progressEvent => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                onProgressCallback(percentCompleted);
            })
        });
        return data;
    } catch (error) {
        console.error('Upload error:', error.response?.data || error.message);
        throw error;
    }
}

export async function mediaDeleteService(id) {
    try {
        const { data } = await axiosInstance.delete(`/media/delete/${id}`);
        return data;
    } catch (error) {
        console.error('Delete error:', error.response?.data || error.message);
        throw error;
    }
}

export async function fetchInstructorCourseListService() {
    try {
        const { data } = await axiosInstance.get(`/instructor/course/get`);
        return data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
}

export async function addNewCourseService(formData) {
    try {
        const { data } = await axiosInstance.post(`/instructor/course/add`, formData);
        return data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
}

export async function fetchInstructorCourseDetailsService(id) {
    try {
        const { data } = await axiosInstance.get(`/instructor/course/get/details/${id}`);
        return data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
}

export async function updateCourseByIdService(id, formData) {
    try {
        const { data } = await axiosInstance.put(`/instructor/course/update/${id}`, formData);
        return data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
    try {
        const { data } = await axiosInstance.post('/media/bulk-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Explicitly set Content-Type
            },
            onUploadProgress: (progressEvent => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                onProgressCallback(percentCompleted);
            })
        });
        return data;
    } catch (error) {
        console.error('Upload error:', error.response?.data || error.message);
        throw error;
    }
}

export async function fetchStudentViewCourseListService(query) {
    try {
        const { data } = await axiosInstance.get(`/student/course/get?${query}`);
        return data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
}

export async function fetchStudentViewCourseDetailsService(id, studentId) {
    try {
        const { data } = await axiosInstance.get(`/student/course/get/details/${id}/${studentId}`);
        return data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
}

export async function createPaymentService(formData) {
    const data = await axiosInstance.post("/student/order/create", formData)

    return data.data;
}

export async function captureAndFinalyzePaymentService(paymentId, payerId, orderId) {
    console.log('in server :', paymentId, payerId, orderId)
    const data = await axiosInstance.post(`/student/order/capture`, {
        paymentId,
        payerId,
        orderId
    })

    return data.data;
}

export async function fetchStudentBoughtCourseService(studentId) {
    try {
        const { data } = await axiosInstance.get(`/student/bought-courses/get/${studentId}`);
        return data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
    try {
        const { data } = await axiosInstance.get(`/student/course/purchase-info/${courseId}/${studentId}`);
        return data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
}

export async function getCurrentCourseProgressService(userId, courseId) {
    try {
        const { data } = await axiosInstance.get(`/student/course-progress/get/${userId}/${courseId}`);
        return data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
    try {
        const { data } = await axiosInstance.post(`/student/course-progress/mark-lecture-viewed`, { userId, courseId, lectureId });
        return data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
}

export async function resetCourseProgressService(userId, courseId) {
    try {
        const { data } = await axiosInstance.post(`/student/course-progress/reset-progress`, { userId, courseId });
        return data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
}




// APIs with react-query

// export async function fetchInstructorCourseListService() {
//     try {
//         const { data } = await axiosInstance.get(`/instructor/course/get`);
//         return data;
//     } catch (error) {
//         console.error('Error:', error.response?.data || error.message);
//         throw error;
//     }
// }
export const fetchInstructorCourseListServiceWithReactQuery = async () => {
    const { data } = await axiosInstance.get(`/instructor/course/get`);
    return data;
}