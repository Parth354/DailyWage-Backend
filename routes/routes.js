import { Router } from "express";
import { registerWorker, searchSuitableWorker } from "../controllers/worker.controllers.js";
import { ExecutiveLogin, registerExecutive } from "../controllers/executive.controllers.js";
import { verifyJWT } from "../Auth/verifyJWT.js";

const router = Router();

router.route('/find-worker').post(searchSuitableWorker)
router.route('/register-worker').post(verifyJWT,registerWorker)
router.route('/register-executive').post(registerExecutive)
router.route('/executiveSignIn').post(ExecutiveLogin)
export default router