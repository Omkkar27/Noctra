const userModel = require("../models/user.model4.js"); //usme kaunsa chiz chaiye wo req zaruri hai

const jwt = require("jsonwebtoken");

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

  const user = await userModel.create({
    username,
    email,
    password,
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
      username: user.id,
      email: user.email,
      role: user.role,
    },
  });
}
