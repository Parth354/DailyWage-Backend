import pkg from 'mongoose';
const { Schema, model, models } = pkg;

const WorkerSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is Required!"]
    },
    phoneNo: {
        type: Number,
        unique: [true, "Phone Number Already Exists"],
        required: [true, "Phone Number is Required!"]
    },
    occupation: {
        type: String,
        required:true

    },
    address: {
        state: {
            type: String,
            required: [true, "City is Required!"]
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

    accountNo: Number,

    adhaarNo: {
        type: Number,
        required: true
    },

    executive: {
        type: Schema.Types.ObjectId,
        ref: 'Executive'
    },
    geolocation:{
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }

}, {
    timestamps: true
})

WorkerSchema.index({geolocation:'2dsphere'})

const Worker = models.Worker || model('Worker', WorkerSchema);
export default Worker;