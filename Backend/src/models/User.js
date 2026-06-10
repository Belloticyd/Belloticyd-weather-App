

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
    favorites: {
        type: [String],  // Array of city names
        default: []
    },
    searchHistory: {
        type: [{
            city: String,
            weatherData: Object,
            date: {
                type: Date,
                default: Date.now
            }
        }],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Hash password before saving
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next()
    
//     try {
//         const salt = await bcrypt.genSalt(10)
//         this.password = await bcrypt.hash(this.password, salt)
//         next()
//     } catch (error) {
//         next(error)
//     }
// })

// Method to compare passwords
// userSchema.methods.comparePassword = async function(candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password)
// }

// export default mongoose.model('User', userSchema)



const User = mongoose.model('User', userSchema);
export default User;