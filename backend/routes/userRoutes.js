import express from 'express';
import { register } from '../controllers/userController.js';
import { verify } from '../controllers/userController.js';
import { reVerify } from '../controllers/userController.js';
import { login } from '../controllers/userController.js';
import { logout } from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import {forgotPassword} from '../controllers/userController.js';
const router = express.Router();

router.post('/register', register);
router.post('/verify', verify);
router.post('/reVerify', reVerify);
router.post('/login',login);
router.post('/logout',isAuthenticated,logout);
router.post('/forget-password',isAuthenticated,forgotPassword);

export default router;


