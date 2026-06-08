import express from 'express';
import { register } from '../controllers/userController.js';
import { verify } from '../controllers/userController.js';
import { reVerify } from '../controllers/userController.js';
import { login } from '../controllers/userController.js';
const router = express.Router();

router.post('/register', register);
router.post('/verify', verify);
router.post('/reVerify', verify);
router.post('/login',login);
export default router;


