import express from "express"
import  User from "./models/user.model.js"

export const socketHandler = (io) => {
    io.on("connection" , (socket)=>{
        console.log("✅ New client connected" , socket.id)

        // Handle user identity
        socket.on("identity" ,async ({userId})=>{
            try{
                console.log("📍 User identity received:", userId, "Socket ID:", socket.id)
                const user = await User.findByIdAndUpdate(userId ,{
                    socketId:socket.id,
                    isOnline:true
                },{new:true})
                console.log("✅ User online status updated:", user?.fullName)
            }
            catch(err){
                console.log("❌ SOCKET IDENTITY ERROR 👉" , err)
            }
        })

        // Handle disconnect at connection level
        socket.on("disconnect" , async ()=>{
            try{
                console.log("❌ Client disconnected:", socket.id)
                await User.findOneAndUpdate({socketId:socket.id} , {
                    socketId:null,
                    isOnline:false
                })
                console.log("✅ User offline status updated")
            }
            catch(err){
                console.log("❌ SOCKET DISCONNECT ERROR 👉" , err)
            }
        })
    })
}