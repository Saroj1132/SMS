const express=require("express")
const router=express.Router()
const tblTeacher=require('../../model/Teacher')
const tblstudent=require('../../model/Student')
const tblnotice=require('../../model/Notice')
var nodemailer=require('nodemailer')
const teacauth=require('../../config/auth')
const tblsubjectResult=require('../../model/Subject_Result')

const bcrypt=require('bcryptjs')
const jwt = require("jsonwebtoken")

var transport=nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: "sarojpanigrahi719@gmail.com" ,
        pass: "7572999405"
    }
  })

router.get('/Dashboard',teacauth.teacherauth, (req, res)=>{
    tblstudent.find({IsDelete:false, Standered:req.teac.Class}).count()
    .then(doc=>{
        res.render("Teacher/Dashboard", {success: req.flash('success'), 
        errors: req.flash('errors'), teac:req.teac, Stud:doc})
    })

    
})

router.get('/login', (req, res)=>{
    if(req.session.teac){
        res.redirect('/Teacher/Dashboard')
    }else{
        res.render("Teacher/Teacher_login", {result:''})
    }
})

router.post('/login', (req, res)=>{
    const {Username, Password}=req.body
    
    tblTeacher.findOne({Username:Username})
    .exec()
    .then(doc=>{
        if(doc){
            if(bcrypt.compareSync(Password, doc.Password)){
                const token=jwt.sign({
                    _id:doc._id
                }, "mykey1234")

                req.session.teac=token
    
                console.log(token)
                req.flash('success', "Login Succesfully")
                res.redirect('/Teacher/Dashboard')
            }else{
                res.render("Teacher/Teacher_login", {result:"Username and Password was Incorrected"})

            }
        }else{
            res.render("Teacher/Teacher_login", {result:"Username and Password was Incorrected"})

        }
    })
})
router.get('/Notice_List', teacauth.teacherauth,(req, res)=>{
    tblnotice.find({Notice_For:"1", IsDelete:false})
    .populate("Notice_Type")
    .then(doc=>{
        res.render("Teacher/Notice_list", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc, teac:req.teac})
    })
})

router.get('/chengeprofile', teacauth.teacherauth, (req, res)=>{
    res.render("Teacher/profile" , {teac:req.teac, success: req.flash('success'), 
    errors: req.flash('errors')})
})


router.post('/chengeprofile', teacauth.teacherauth, (req, res)=>{
    tblTeacher.findOneAndUpdate(
        {_id:req.teac._id},
        {Name:req.body.Name,
        Email:req.body.Email,
        MobileNo:req.body.MobileNo,
        Teacher_Id:req.body.Teacher_Id,
        Class:req.body.Class,
        ModifiedDate:Date.now(),
        IsModified:true
      }).exec().then(profile=>{
        req.flash("success", "Profile Update succesfully")
        res.redirect('/Teacher/Dashboard')
    })
})

router.get('/Result_Enrollment_list', teacauth.teacherauth, (req, res)=>{
    tblstudent.find({Standered:req.teac.Class, IsDelete:false})
    .exec()
    .then(doc=>{
        res.render("Teacher/Result_Enrollment", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc, teac:req.teac})
    })
})

router.get('/Mark_List/:Enrollment_Id', teacauth.teacherauth, (req, res)=>{
    tblsubjectResult.find({IsDelete:false, Enrollment_Id:req.params.Enrollment_Id})
    .then(doc=>{
        res.render("Teacher/Marksheet", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc, teac:req.teac})
    })
})

router.get('/Student_Enrollment_list', teacauth.teacherauth, (req, res)=>{
    tblstudent.find({Standered:req.teac.Class, IsDelete:false})
    .exec()
    .then(doc=>{
        res.render("Teacher/Student_Enrollment", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc, teac:req.teac})
    })
})

router.get('/Student_Details/:Enrollment_Id', teacauth.teacherauth, (req, res)=>{
    tblstudent.find({IsDelete:false, Enrollment_Id:req.params.Enrollment_Id})
    .then(doc=>{
        res.render("Teacher/Student_Details", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc, teac:req.teac})
    })
})

router.get('/forgotpassword', (req, res)=>{
    res.render("Teacher/forgot_password" , {teach:req.teach, success: req.flash('success'), 
    errors: req.flash('errors'), result:''})
})

router.post('/forgotpassword', (req, res)=>{
    tblTeacher.findOne({Email:req.body.Email}).exec()
        .then(profile=>{
          if(profile){
            var urls=`http://${req.headers.host}/Teacher/setPassword/${profile._id}`
            var mailoption = {
              from:"sarojpanigrahi719@gmail.com",
              to: profile.Email,
              subject: "Forgot password - Just one more Step to set your password!",
              html: `Hello ${profile.Name} <br> Please click below link to set your account password  <br> ${urls}`,
            }
            console.log("Mail sent",mailoption)
      
            transport.sendMail(mailoption, (req, res)=>{
              console.log("Mail sent succesfully")
              console.log("Mail sent succesfully",mailoption)
            })
      
            req.flash("success", "Mail sent succesfully")
            res.redirect('/Teacher/forgotPassword')
          }else{
            res.render("Teacher/forgot_password" , {teach:req.teach, success: req.flash('success'), 
            errors: req.flash('errors'), result:'Incorrect Email id'})
          }
    })
})

router.get('/setPassword/:id', (req, res)=>{
    console.log(req.params.id)
    res.render('Teacher/set_password', {
      error:'',Match:'',Invalid:'    ',admin_id: req.params.id,
      success: req.flash('success'), errors: req.flash('errors')
    })
})

router.post('/setPassword/:id', (req, res)=>{
    bcrypt.hash(req.body.Password, 10, (err, hash)=>{
        console.log(req.params.id, "id admin")
      tblTeacher.findOneAndUpdate(
      {_id:req.params.id},
      { Password:hash, IsModified:true,ModifiedDate:Date.now()}).exec().then(profile=>{
        req.flash("success", "Password changed succesfully")
        res.redirect('/Teacher/login')
        })
    })
})

router.get('/logout', (req, res)=>{
    delete req.session.teac
    res.redirect('/Teacher/login')
})
module.exports=router
