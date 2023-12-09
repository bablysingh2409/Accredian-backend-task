const express=require('express');
const jwt=require('jsonwebtoken');
const secretKey='secretkey';
const bcrypt=require('bcryptjs');
const db=require('./config/database');

const cors=require('cors');

const app=express();
app.use(cors());
app.use(express.json());



const createToken=()=>{
    const token= jwt.sign({_id:"234vguy65456enbfjhyjg"},"mynamejiisbvbhj",{expiresIn:"100 seconds"})
    return token;
}

app.post('/login',async(req,res)=>{
    const { email, password } = req.body;
    
    db.query("SELECT * FROM userdata WHERE email = ?", [email],async (err,results)=>{
        if(err){
            return res.status(500).json({ message: 'Internal server error' });
        }
        else{
           
             const user=results[0];
            console.log(user);
           
            //password comparison
            const passwordMatch=await bcrypt.compare(password,user.password);
            console.log(passwordMatch)

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = createToken(user.id);
            res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email } });
            
        }

    })
   
   
})



app.post('/signup',async(req,res)=>{
    // console.log(req.body);
    try{
       const password=req.body.password;
       const cPassword=req.body.confirmpassword;
       
       if(password==cPassword){
       
        const hashPassword=await bcrypt.hash(password,10)

    
        const registerUser={
            username:req.body.username,
            email:req.body.email,
            password:hashPassword,
            confirmPassword:hashPassword
            
        }

        //data is save in data base
        db.query("Insert INTO userdata SET?",registerUser,(err,result)=>{
            if (err) {
                console.error(err);
                return res.status(500).send(`Error inserting into the database: ${err}`);
            }
            res.status(200).send(result);
         })
       
        res.status(200).send(registerUser)
       }
       else{
        res.send('password are not matching')
       }
    }
    catch(err){
        console.error(err);
        res.status(500).send(`Error: ${err.message || err}`);
    }

})

app.listen(5000,()=>{
    console.log('appp is running on 5000 port')
})