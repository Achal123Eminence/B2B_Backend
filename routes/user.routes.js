import express from 'express';
import { login, register, getUserList, updateUserController, deleteUserController } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/register',authenticate ,register);
userRouter.get('/get-user-list', authenticate, getUserList);
userRouter.put('/update/:id',authenticate, updateUserController);
userRouter.delete('/remove/:id',authenticate, deleteUserController);

export default userRouter;
