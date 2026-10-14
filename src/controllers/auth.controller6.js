const userModel = require("../models/user.model4.js"); //usme kaunsa chiz chaiye wo req zaruri hai

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

/* 
step1=paila body req kia(stage par laya)
step2=check kia koi exiting toh nahi aa gaya(koi 2 baar toh stage par nai aaya na)
step3=user bana dia based on params (unko dance karne ka permission mil gaya)
step4=haar admi ka unique id banaya taaki check karna aasan ho(unique id dia)
step5=unko cookie storage me add kia taaki bbaarr baarr id naa likhna pode(bande ka id page par likh dia)
step6=user create ho gaya aur uska details aa gaya

*/

async function registerUser(req, res) {
  const { username, email, password, role = "user" } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  }); //$or->koi ek bhi paramter match hua toh wo op de degan

  if (isUserAlreadyExist) {
    return res.status(409).json({
      message: "user already exist",
    });
  }

  const hash = await bcrypt.hash(password, 10); //pass ko encrypt kia ,10 is salt->attack ko deelay karne kaam aata hai

  const user = await userModel.create({
    username,
    email,
    password: hash,
    role,
  });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "user is created",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(401).json({
      message: "invalid credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "user logged in succesfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

module.exports = { registerUser, loginUser };
