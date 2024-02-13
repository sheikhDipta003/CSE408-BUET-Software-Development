const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("email-validator");

const handleNewUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  if (!username || !email || !password)
    return res
      .status(400)
      .json({ message: "Username, email and password are required." });
  
  if (!USER_REGEX.test(username) || !PWD_REGEX.test(password) || !validator.validate(email))
    return res
      .status(400)
      .json({ message: "This username, email and/or password is not acceptable." });

  console.log(
    "\nusername = ",
    username,
    ", pass = ",
    password,
    " role = ",
    role,
  );

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ where: { email: email } });
  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    const result = await User.create({
      username: username,
      email: email,
      password: hashedPwd,
      roles: role,
    });

    console.log(result);

    res
      .status(201)
      .json({ success: `New user ${username} created with role ${role}!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
