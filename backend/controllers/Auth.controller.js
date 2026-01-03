import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"
import User from "../models/user.model.js"
import { sendOtpMail } from "../utils/mail.js"

export const signUp = async (req , res) =>{
    try{
        const { fullName, email, password, mobile, role } = req.body;


        let user = await User.findOne({email})

        if(user) {
            return res.status(400).json({message:"User Already exist"})
        }

        if (password.length < 6){
            return res.status(400).json({message: "password should be greater than 6 characters."})
        }
        if(mobile.length<10){
            return res.status(400).json({message: "mobile must be at least 10 digits"})
        }
        const hashedPassword = await bcrypt.hash(password , 10);

        user = await User.create({
            fullName,
            email,
            role,
            mobile,
            password: hashedPassword
        })

        const token = await genToken(user._id)

        res.cookie("token", token, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        })

        return res.status(201).json(user)


    }
    catch(err){
        return res.status(500).json(`sign up error ${err}`)

    }
}



export const signIn  = async (req , res) =>{
    try{
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if(!user) {
            return res.status(400).json({message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password , user.password)

        if(!isMatch){
            return res.status(400).json({message : "incorrect password"})
        }

       

        const token = await genToken(user._id)

        res.cookie("token", token, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        })

        return res.status(200).json(user)


    }
    catch(err){
        return res.status(500).json(`signIn error ${err}`)

    }
}


export const signOut = async (req , res) =>{
    try{
        res.clearCookie("token")
       return  res.status(200).json({message: "signed out successfully"})

    }
    catch(err){
        return res.status(500).json(`sign Out err ${err}`)

    }
}



/*
export const sendOtp = async (req,res) =>{
    try{
        const email = req.body;
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }

        const otp = Math.floor(10000 + Math.random() * 90000).toString();

        user.resetOtp = otp;
        user.otpExpiry = Date.now() + 5*60*1000; // 5 minutes from now  
        user.isOtVerified = false;

        await user.save();
        await sendOtpMail(user.email , otp)

        return res.status(200).json({message: "otp sent successfully"})
    }
    catch(err){
        return res.status(500).json(`sent otp error ${err}`)
    }
}

*/


export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const otp = Math.floor(10000 + Math.random() * 90000).toString();

    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    console.log('Generated OTP for', email, otp);

    await user.save();
    await sendOtpMail(user.email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("SEND OTP ERROR 👉", err);
    return res.status(500).json({ message: err.message });
  }
};










export const verifyOtp = async (req,res) =>{
    try{
        const {email , otp} = req.body;
        const user = await User.findOne({email})

        if(!user || user.resetOtp !== otp || user.otpExpiry < Date.now() ){
            return res.status(400).json({message:"Invalid or expired OTP"})
        }
        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return res.status(200).json({message: "otp verified successfully"})

    }
    catch(err){
        return res.status(500).json(`is otp verified error ${err}`)
    }
}



export const resetPassword = async (req,res) =>{
    try{
        const { email , newPassword} = req.body;
        console.log('RESET PASSWORD request', { email });
        const user = await User.findOne({email})
        console.log('Found user for reset:', user ? { id: user._id, isOtpVerified: user.isOtpVerified } : null);
         if(!user || !user.isOtpVerified){
            return res.status(400).json({message:"otp not verified"})
         }

            const hashedPassword = await bcrypt.hash(newPassword , 10);

            user.password = hashedPassword;
            user.isOtpVerified = false;

            await user.save();
            console.log('Password reset successful for', user._id);
            return res.status(200).json({ message: "Password reset successful" });

        } 
    
    catch(err){
        return res.status(500).json(`reset password error ${err}`)
    }    

}





export const googleAuth = async (req,res) =>{
    try {
        const { fullName, email, mobile, role } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                fullName,
                email,
                mobile: mobile || '',
                role: role || 'user',
            });
        }

        const token = await genToken(user._id);

        res.cookie("token", token, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        return res.status(201).json(user);
    } catch (err) {
        console.error('GOOGLE AUTH ERROR 👉', err);
        return res.status(500).json({ message: err.message });
    }
};
