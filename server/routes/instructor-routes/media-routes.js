const express = require('express');
const multer = require('multer');
const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require('../../helpers/cloudinary');

const router = express.Router();

const payload = multer({ dest: 'uploads/' })