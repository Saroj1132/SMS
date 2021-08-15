const express=require("express")
const router=express.Router()
const tblstudent=require('../../model/Student')
const tblnotice=require('../../model/Notice')
const tblmark=require('../../model/Subject_Result')
var nodemailer=require('nodemailer')

const bcrypt=require('bcryptjs')
const jwt = require("jsonwebtoken")
const studeauth=require('../../config/auth')

var transport=nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: "sarojpanigrahi719@gmail.com" ,
        pass: "7572999405"
    }
  })

router.get('/Dashboard',studeauth.studentauth, (req, res)=>{
    res.render("Student/Dashboard", {success: req.flash('success'), 
    errors: req.flash('errors'), stud:req.stud})
})

router.get('/login', (req, res)=>{
    if(req.session.stud){
        res.redirect('/Student/Dashboard')
    }else{
        res.render("Student/Student_login", {result:''})
    }
})

router.post('/login', (req, res)=>{
    const {Username, Password}=req.body
    
    tblstudent.findOne({Username:Username})
    .exec()
    .then(doc=>{
        if(doc){
            if(bcrypt.compareSync(Password, doc.Password)){
                const token=jwt.sign({
                    _id:doc._id
                }, "mykey123")
                req.session.stud=token
                console.log(token)
                req.flash('success', "Login Succesfully")
                res.redirect('/Student/Dashboard')
            }else
            {
                res.render("Student/Student_login", {result:"Username and Password was Incorrected"})

            }
        }else{
            res.render("Student/Student_login", {result:"Username and Password was Incorrected"})
        }
    })
})

router.get('/Notice_List', studeauth.studentauth, (req, res)=>{
    tblnotice.find({Notice_For:"2", IsDelete:false})
    .populate("Notice_Type")
    .then(doc=>{
        res.render("Student/Notice_list", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc, stud:req.stud})
    })
})

router.get('/Mark_List', studeauth.studentauth, (req, res)=>{
    tblmark.find({IsDelete:false, Enrollment_Id:req.stud.Enrollment_Id})
    .then(doc=>{
        res.render("Student/Marksheet", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc, stud:req.stud})
    })
})


router.get('/chengeprofile', studeauth.studentauth, (req, res)=>{
    res.render("Student/profile" , {stud:req.stud, success: req.flash('success'), 
    errors: req.flash('errors')})
})

router.post('/chengeprofile', studeauth.studentauth, (req, res)=>{
    tblstudent.findOneAndUpdate(
        {_id:req.stud._id},
        {Name:req.body.Name,
        Email:req.body.Email,
        MobileNo:req.body.MobileNo,
        Enrollment_Id:req.body.Enrollment_Id,
        Standered:req.body.Standered,
        ModifiedDate:Date.now(),
        IsModified:true
      }).exec().then(profile=>{
        req.flash("success", "Profile Update succesfully")
        res.redirect('/Student/Dashboard')
    })
})


router.get('/forgotpassword', (req, res)=>{
    res.render("Student/forgot_password" , {stud:req.stud, success: req.flash('success'), 
    errors: req.flash('errors'), result:''})
})

router.post('/forgotpassword', (req, res)=>{
    tblstudent.findOne({Email:req.body.Email}).exec()
        .then(profile=>{
          if(profile){
            var urls=`http://${req.headers.host}/Student/setPassword/${profile._id}`
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
            res.redirect('/Student/forgotPassword')
          }else{
            res.render("Student/forgot_password" , {stud:req.stud, success: req.flash('success'), 
            errors: req.flash('errors'), result:'Incorrect Email id'})
          }
    })
})

router.get('/setPassword/:id', (req, res)=>{
    console.log(req.params.id)
    res.render('Student/set_password', {
      error:'',Match:'',Invalid:'    ',admin_id: req.params.id,
      success: req.flash('success'), errors: req.flash('errors')
    })
})

router.post('/setPassword/:id', (req, res)=>{
    bcrypt.hash(req.body.Password, 10, (err, hash)=>{
        console.log(req.params.id, "id admin")
      tblstudent.findOneAndUpdate(
      {_id:req.params.id},
      { Password:hash, IsModified:true,ModifiedDate:Date.now()}).exec().then(profile=>{
        req.flash("success", "Password changed succesfully")
        res.redirect('/Student/login')
        })
    })
})

router.get('/logout', (req, res)=>{
    delete req.session.stud
    res.redirect('/Student/login')
})
module.exports=router
