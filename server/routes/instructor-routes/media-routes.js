const express = require('express');
const multer = require('multer');
const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require('../../helpers/cloudinary');

const router = express.Router();

const upload = multer({ dest: 'uploads/' })

router.post('/upload', upload.single('file'), async (req, res) => {
    // console.log('first')
    try {
        const result = await uploadMediaToCloudinary(req.file.path);
        // console.log('result', result)

        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.log("error :", error);
        res.status(500).json({ success: false, message: "Error uploading file." })
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Asses id is required.' });
        }

        await deleteMediaFromCloudinary(id);

        res.status(200).json({
            success: true,
            message: 'Asset deleted from cloudinary.'
        })

    } catch (error) {
        console.log("error :", error);
        res.status(500).json({ success: false, message: "Error deleting file." })
    }
})

router.post('/bulk-upload', upload.array('files', 10), async (req, res) => {
    try {
        const uploadPromise = req.files.map(fileItem => uploadMediaToCloudinary(fileItem.path));

        const result = await Promise.all(uploadPromise);

        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.log("error :", error);
        res.status(500).json({ success: false, message: "Error in bulk uploading ." })
    }
})

module.exports = router