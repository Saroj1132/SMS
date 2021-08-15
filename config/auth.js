const tblstud=require('../model/Student')
const tblteach=require('../model/Teacher')
const tbladmin=require('../model/Admin_login')
const jwt=require('jsonwebtoken')

var studentauth=async(req, res, next)=>{
    try{
        if(req.session.stud){
            const token=req.session.stud
            const decode=jwt.verify(token, "mykey123")
            const Stud=await tblstud.findOne({
                _id:decode._id
            })

            req.stud=Stud

            next()
        }else{
            res.redirect('/Student/login')    
        }
    }catch(error){
        res.redirect('/Student/login')
    }
}

var teacherauth=async(req, res, next)=>{
    try{
        if(req.session.teac){
            const token=req.session.teac
            const decode=jwt.verify(token, "mykey1234")
            const Teac=await tblteach.findOne({
                _id:decode._id
            })

            req.teac=Teac

            next()
        }else{
            res.redirect('/Teacher/login')    
        }
    }catch(error){
        res.redirect('/Teacher/login')
    }
}

var adminauth=async(req, res, next)=>{
    try{
        if(req.session.admin){
            const token=req.session.admin
            const decode=jwt.verify(token, "admin123")
            const Admin=await tbladmin.findOne({
                _id:decode._id
            })

            req.admin=Admin

            next()
        }else{
            res.redirect('/admin/login')    
        }
    }catch(error){
        res.redirect('/admin/login')
    }
}

module.exports={
    studentauth,
    teacherauth,
    adminauth
}