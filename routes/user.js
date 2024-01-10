const { Router } = require("express");
const User = require('../models/user');
const { body, validationResult } = require("express-validator");
const router = Router();


router.get('/login', (req, res) => {
    return res.render('login');
});

router.get('/register', (req, res) => {
    return res.render('register.ejs');
});

router.post('/register', [
    body("name", "The name should be atleast 3 characters long").isLength({
      min: 3,
    }),
    body("email", "Enter a valid email").isEmail(),
    body(
      "password",
      "The password should be atleast 5 characters long"
    ).isLength({ min: 5 }),
  ], async (req, res) =>{
    const {name, email, password} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log("ERROR WHILE register ",errors.array()[0].msg);
      return res.render('register', {
        error: errors.array()[0].msg
      });
    }

    // const userExist = User.findOne({ email });
    // if(userExist){
    //   return res.render('register', {
    //     error: 'User with this email already exists.'
    //   }); 
    // }
    await User.create({
        name,
        email,
        password
    });
    return res.redirect('/');
});

router.post('/login',[
  body("email", "Enter a valid email").isEmail(),
  body("password", "The password cannot be blank").exists(),
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', {
      error: errors.array()[0].msg
    });
  }
  const { email, password } = req.body;
  try{
    const token = await User.matchPasswordAndGenerateToken(email, password);
    
    res.cookie("token", token);
    return res.redirect("/");
  } catch(error) {
    // console.log("ERROR WHILE LOGIN",error);
    return res.render('login', {
      error: 'Incorrect email or password'
    }); 
  }

});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
})

module.exports = router;