const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const userSchema = new Schema({
  name: {
    type: String,
    require: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password should be atleast 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    // This only works on save
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

userSchema.pre("save", async function (next) {
  //
  if (!this.isModified("password")) return next();

  //Hash the password at cost of 10
  this.password = await bcrypt.hash(this.password, 12);

  //Delete Confirm Password
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
