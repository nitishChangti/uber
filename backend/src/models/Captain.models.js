import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const CaptainSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Full name must be at least 3 characters long'],
        maxlength: [100, 'Full name must not exceed 100 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: /^\+?[1-9]\d{1,14}$/
    },
    socketId: {
        type: String,
        unique: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'inactive'
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, 'Color must be at least 3 characters long'],
        },
        plate: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, 'Plate must be at least 1 character long'],
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'bike', 'auto'],
            trim: true
        }

    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0] // dummy coordinates until updated via socket 
        }
    },    
    refreshToken: {
        type: String,
        default: null
    }
    }, {
    timestamps: true,
})

CaptainSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

CaptainSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
 
CaptainSchema.index({ location: '2dsphere' });


CaptainSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
CaptainSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const Captain = mongoose.model('Captain', CaptainSchema);
export default Captain; 