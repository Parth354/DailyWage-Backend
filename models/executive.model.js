import pkg from 'mongoose';
const { Schema, model, models } = pkg;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ExecutiveSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is Required!"]
    },
    phoneNo: {
        type: Number,
        unique: [true, "Phone Number Already Exists"],
        required: [true, "Phone Number is Required!"]
    },
    address: {
        state: {
            type: String,
            required: [true, "State is Required!"]
        },
        city: {
            type: String,
            required: [true, "City is Required!"]
        },
        pincode: {
            type: Number,
            required: [true, "Pincode is Required!"]
        }
    },

    branch: {
        type: String
    },

    adhaarNo: {
        type: Number,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
    },

}, {
    timestamps: true
})

ExecutiveSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

ExecutiveSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

ExecutiveSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        phoneNo: this.phoneNo,
        adhaarNo: this.adhaarNo,
        name: this.name
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
ExecutiveSchema.methods.generateRefreshToken = function () {
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



const Executive = models.Executive || model('Executive', ExecutiveSchema) // here we handling the case if Worker model already exist then assign that value to Worker otherwise create a new Worker Model...

export default Executive;