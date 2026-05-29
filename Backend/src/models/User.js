

// Below code is used to import the necessary libraries
import mongoose from 'mongoose'
import bcrypt from "bcrypt"


// Below code is used to create a user input looks like in the database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  favorites: [{
    type: String,        // City names
    trim: true
  }],
  searchHistory: [{
    city: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})


// // Below code is used to Hash password before saving to database
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next()
  
//   try {
//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password, salt)
//     next()
//   } catch (error) {
//     next(error)
//   }
// })

// // Method to check if password is correct
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password)
// }

// module.exports = mongoose.model('User', userSchema)

const User = mongoose.model('User', userSchema);
export default User;