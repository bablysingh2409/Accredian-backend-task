const express=require('express');
const jwt=require('jsonwebtoken');
const secretKey='secretkey';
const bcrypt=require('bcryptjs');
const db=require('./config/database');

const cors=require('cors');

const app=express();
app.use(cors());
app.use(express.json());


app.post('/signup',(req,res)=>{
    const data=req.body;

     db.query("Insert INTO login SET?",data,(err,result,feilds)=>{
        if(err) err;
        else res.send(result);
     })
})
// db.connect((err)=>{
//     if(err){
//         console.log('err');
//     }
//     else{
//         console.log('connected')
//     }
// })

// app.get('/',(req,res)=>{
//     res.json({
//         message:"a sample api",
//     })
// })

// app.post('/login',(req,res)=>{
//     const user={
//         id:1,
//         username:"anil",
//         email:"bab@gmail.com",
//     };

//     jwt.sign({user},secretKey,{expiresIn:'300s'},(err,token)=>{
//         res.json({token});
//     })

// })


app.post('/signup',async(req,res)=>{
    try{
       const password=req.body.password;
       const cPassword=req.body.confirmpassword;
       if(password==cPassword){

        //password hash
        const hashPassword=await bcrypt.hash(password,10)
        const registerUser={
            username:req.body.username,
            email:req.body.email,
            password:hashPassword,
            cPassword:hashPassword
            
        }

        //data is save in data base
        db.query("Insert INTO login SET?",registerUser,(err,result,feilds)=>{
            if(err) err;
            else res.send(result);
         })
        // const registered=await registerUser.save();
        res.status(200).render('index')
       }
       else{
        res.send('password are not matching')
       }
    }
    catch(err){
       res.send('errorr',err)
    }

})



app.listen(5000,()=>{
    console.log('appp is running on 5000 port')
})