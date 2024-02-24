const Jwt = require('jsonwebtoken');
const Bcrypt = require('bcrypt');
const User = require('../models/user.model');

// Register a new user in the database
exports.signin = async (req, res) => {
    try {
        const { name, email, password, DOB } = req.body;

        // Check fields
        if (!name || !email || !password || !DOB) {
            return res.status(402).json({
                status: false,
                msg: "Please Fill All The Fields"
            });
        }

        // Check if Email Id Already Exists, If Yes, Return Error
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(403).json({
                status: false,
                msg: "Email ID is already registered!"
            });
        }

        // Hash the Password
        let hashedPassword;
        try {
            hashedPassword = await Bcrypt.hash(password, 10);
        } catch (hashError) {
            console.error("Password Hash Error:", hashError);
            return res.status(402).json({
                status: false,
                msg: "Password Hash Error"
            });
        }

        // Create a new user instance
        const newUser = new User({
            name, email, Password: hashedPassword, DOB
        });

        // Generate Login Token 
        const token = Jwt.sign({
            id: newUser._id,
            IsLoggedIn: true
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIME });

        // Save the Token In Cookies
        const options = {
            httpOnly: true,
            secure: true
        };

        res.cookie('token', token, options);

        // Save the new user in the database
        try {
            await newUser.save();
        } catch (saveError) {
            console.error("User Save Error:", saveError);
            return res.status(500).json({
                status: false,
                msg: "Error saving user to the database"
            });
        }

        // Respond with success msg, data, and auth Token
        return res.status(200).json({
            status: true,
            data: newUser,
            Authtoken: token,
            msg: "User registered successfully!"
        });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({
            status: false,
            msg: "Internal Server Error"
        });
    }
};

// login function
exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Please Fill All Fields"
            });
        }

        // Retrieve user from the database
        const user = await User.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "Invalid email"
            });
        }

        // Compare passwords
        const passwordMatch = await Bcrypt.compare(password, user.Password);

        if (passwordMatch) {
            // Passwords match, generate JWT token
            const token = Jwt.sign({
                id: user._id,
                IsLoggedIn: true
            }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIME });

            // Save the Token In Cookies
            const options = {
                httpOnly: true,
                secure: true
            };
            res.cookie('token', token, options);

            // Respond with success msg, data, and auth Token
            return res.status(200).json({
                success: true,
                data: user,
                Authtoken: token,
                msg: "Login successful"
            });
        } else {
            return res.status(401).json({
                success: false,
                msg: "Wrong password"
            });
        }
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
};

//Logout  User
exports.logOutUser = async function (req, res) {
    try {
        // Remove cookie from client side
        res.clearCookie('token');

        // Return a success response to the client
        return res.status(200).json({
            success: true,
            msg: 'Logged out'
        })
    } catch (err) {
        console.error(`Error in logOutUser: ${err}`);
        return res.status(500).json({
            success: false,
            msg: `Server error: ${err}`
        });
    }   

}