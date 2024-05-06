import Executive from "../models/executive.model.js"
import Worker from "../models/worker.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const searchSuitableWorker = asyncHandler(async (req, res) => {
    const { latitude, longitude, occupation, maxDistance } = req.body
    if (!latitude, !longitude, !occupation) {
        throw new apiError(403, "Data Insufficient")
    }
    const targetCoordinates = [latitude, longitude]
    const suitableWorkers = await Worker.find({
        occupation: occupation,
        geolocation: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: targetCoordinates
                },
                $maxDistance: maxDistance
            }
        }
    });
    if (!suitableWorkers) {
        throw new apiResponse(404, "No suitable workers found")
    }

    return res.status(200).json(
        new apiResponse(200, suitableWorkers, "Fetched list of suitable workers")
    )
})

const registerWorker = asyncHandler(async (req, res) => {
    const cookie = req?.headers?.cookie
    const tokens = cookie.split(';')
    const refreshToken = tokens[1].split('=')[1]
    const executive =await Executive.findOne({refreshToken})
    if(!executive){
        throw new apiError(404, "Executive Details Not Found")
    }
    const { name, phoneNo, adhaarNo, accountNo, occupation, state, city, pincode, latitude, longitude } = req.body
    if (!name || !phoneNo || !adhaarNo || !occupation) {
        throw new apiError(403, "Data Insufficient to create the user")
    }

    const existedWorker = await Worker.findOne({
        $or: [{ phoneNo }, { adhaarNo }]
    })
    if (existedWorker) {
        throw new apiError(403, "Worker Already Registered")
    }

    const worker = await Worker.create({
        name,
        phoneNo,
        adhaarNo,
        accountNo,
        occupation,
        address: {
            state,
            city,
            pincode
        },
        geolocation:
        {
            coordinates: [latitude, longitude]
        },
        executive
    })

    if (!worker) {
        throw new apiError(403, "Error registering Worker Details")
    }


    return res.status(200).json(
        new apiResponse(200, worker, "Worker Registered Successfully")
    )

})

export { registerWorker, searchSuitableWorker }