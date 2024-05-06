import Executive from "../models/executive.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (Id) => {
    try {
        const executive = await Executive.findById(Id)
        const accessToken = executive.generateAccessToken()
        console.log(accessToken)
        const refreshToken = executive.generateRefreshToken()
        executive.refreshToken = refreshToken
        await executive.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        throw new apiError(500, "Internal Server Error while Generating Refresh And Access Tokens")
    }
}

const registerExecutive = asyncHandler(async(req,res)=>{
    const { name, phoneNo, adhaarNo,branch, state, city, pincode , password } = req.body
    if (!name || !phoneNo || !adhaarNo || !branch) {
        throw new apiError(403, "Data Insufficient to create the user")
    }

    const existedWorker = await Executive.findOne({
        $or: [{ phoneNo }, { adhaarNo }]
    })
    if (existedWorker) {
        throw new apiError(403, "Executive Already Registered")
    }

    const executive = await Executive.create({
        name,
        phoneNo,
        adhaarNo,
        branch,
        password,
        address: {
            state,
            city,
            pincode
        }
    })

    if (!executive) {
        throw new apiError(403, "Error registering Executive Details")
    }

    return res.status(200).json(
        new apiResponse(200, executive, "Executive Registered Successfully")
    )

})

const ExecutiveLogin = asyncHandler(async (req, res) => {
    const { phoneNo, password } = req.body

    if (!phoneNo) {
        throw new apiError(400, "Phone Number is Required")
    }

    const executive = await Executive.findOne({
       phoneNo
    })

    if (!executive) {
        throw new apiError(404, "Phone Number not registerd")
    }

    const isPasswordValid = await executive.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError(401, "Wrong Password")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(executive._id)

    const loggedInExecutive = await Executive.findById(executive._id).select("-password -refreshToken")

    const options = {      //cookies now become modifiable on server
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    executive: loggedInExecutive, accessToken, refreshToken
                },
                "User Logged in Successfully"
            )
        )
})

export {registerExecutive , ExecutiveLogin}