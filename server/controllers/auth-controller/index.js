const User = require("../../models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const { userName, userEmail, password, role } = req.body;

    const existingUser = await User.findOne({
        $or: [{ userName }, { userEmail }],
    });

    if (existingUser) return res.status(400).json({ success: false, message: "User name or email already existing." })

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ userName, userEmail, role, password: hashPassword });

    await newUser.save();

    return res.status(201).json({ success: true, message: "User registerd successfully." });
}

const loginUser = async (req, res) => {
    const { userEmail, password } = req.body;

    const checkUser = await User.findOne({ userEmail });

    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials."
        })
    }

    // JWT token generation part
    const accessToken = jwt.sign({
        _id: checkUser._id,
        userEmail: checkUser.userEmail,
        userName: checkUser.userName,
        role: checkUser.role
    }, 'JWT_SECRET', { expiresIn: '600m' })

    return res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        data: {
            accessToken,
            user: {
                _id: checkUser._id,
                userEmail: checkUser.userEmail,
                userName: checkUser.userName,
                role: checkUser.role
            }
        }
    })
}

module.exports = { registerUser, loginUser }