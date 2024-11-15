import axiosInstance from "../api/axiosInstance";

export async function registerService(formData) {
    const data = await axiosInstance.post("/auth/register", {
        ...formData,
        role: "user",
    })

    return data.data;
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

export async function mediaUploadService(formData) {
    try {
        const { data } = await axiosInstance.post('/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Explicitly set Content-Type
            },
        });
        return data;
    } catch (error) {
        console.error('Upload error:', error.response?.data || error.message);
        throw error;
    }
}
