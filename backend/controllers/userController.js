import User from '../models/user_model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyEmail } from '../emailVerify/verifyEmail.js';
import Session from '../models/sessionModel.js';
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
verifyEmail(email, token);
newUser.token = token;

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const verify = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success:false, message: "Authorization header missing" });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success:false, message: "Token missing" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        try{
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ success:false, message: "Token expired" });
            }
            return res.status(401).json({ success:false, message: "Invalid token" });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success:false, message: "User not found" });
        }
        user.token = "";
        user.isVerified = true;
        await user.save();
        res.status(200).json({ success:true, message: "Email verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success:false, message: "Internal server error" });
    }   
};

export const reVerify=async(req,res)=>{
    try{
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success:false, message: "Email is required" });
        }

    const token=jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
    verifyEmail(email, token);
     res.status(200).json({ success:true, message: "Verification email sent successfully",token:token 

     })
    }

    catch(error){
       return res.status(500).json({ success:false, message: "Internal server error" });
    }
}


export const login= async(req,res)=>{
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success:false, message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success:false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success:false, message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success:false, message: "Invalid credentials" });
        }
        if (!user.isVerified) {
            return res.status(401).json({ success:false, message: "Email not verified" });
        }
        const accesstoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        const refreshtoken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '60d' });
        const token = { accesstoken, refreshtoken };
        user.isLoggedIn = true;
        await user.save();

        //check for existing session and delete it before creating a new one
        const existingSession = await Session.findOne({ userId: user._id });
        if (existingSession) {
            await Session.deleteOne({ userId: user._id });
        }

        // create a new session for the user
        await Session.create({ userId: user._id });
        res.status(200).json({ success:true, message: "Login successful", token });
        await Session.create({ userId: user._id });
        return res.status(200).json({ success:true, message: "Login successful", token });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ success:false, message: "Internal server error" });
    }
}

// export const logout=async(req,res)=>{
//     try{
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             return res.status(401).json({ success:false, message: "Authorization header missing" });
//         }
//         const token = authHeader.split(' ')[1];
//         if (!token) {
//             return res.status(401).json({ success:false, message: "Token missing" });
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id);
//         if (!user) {
//             return res.status(404).json({ success:false, message: "User not found" });
//         }
//         user.isLoggedIn = false;
//         await user.save();  
//         await Session.deleteOne({ userId: user._id });
//         res.status(200).json({ success:true, message: "Logout successful" });
//     }
//     catch(error){
//         console.error(error);
//         res.status(500).json({ success:false, message: "Internal server error" });
//     }
// }

