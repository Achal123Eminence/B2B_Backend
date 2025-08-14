import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../common/constants.js';
import { type } from 'os';
import { encrypt, decrypt } from '../helper/encryption.js';

export const loginUser = async (username, password) => {
  username = username.toLowerCase();
  // Find user by email
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('Invalid username or password');
  }

  // Decrypt the stored password and compare
  let decryptedPassword;
  try {
    decryptedPassword = decrypt(user.encrypted_password);
  } catch (err) {
    throw new Error('Unable to verify password');
  }

  if (decryptedPassword !== password) {
    throw new Error('Invalid username or password');
  }
  // const validPassword = await bcrypt.compare(password, user.encrypted_password);
  // if (!validPassword) {
  //   throw new Error('Invalid username or password');
  // }

  // Generate JWT token
  const token = jwt.sign(
    { username: user.username, type:user.type },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

export const createUser = async (userData) => {
  const existingUser = await User.findOne({ username: userData.username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const encryptedPassword = encrypt(userData.password);

  const newUser = new User({
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    cloud_account_id: userData.cloud_account_id,
    cloud_auth: userData.cloud_auth,
    cloud_image_url: userData.cloud_image_url,
    email: userData.email || "",
    username: userData.username.toLowerCase(),
    encrypted_password: encryptedPassword,
    type: "user"
  });

  let resp = await newUser.save();
  return newUser;
};

export const getUserListService = async ({ page, limit,isAdmin }) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find({ type: 'user' })
      // .select('-hashed_password')
      .skip(skip)
      .limit(limit),
    User.countDocuments({ type: 'user' }),
  ]);

  // If admin, decrypt passwords
  if (isAdmin) {
    for (const user of users) {
      try {
        user.encrypted_password = decrypt(user.encrypted_password);
      } catch (err) {
        user.password = 'Decryption failed';
      }
    }
  }


  return {
    users,
    pagination: {
      totalUsers: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
    },
  };
};

export const updateUserService = async (id, updateData) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  // If password is being updated, hash it
  if (updateData.password) {
    updateData.encrypted_password  = encrypt(updateData.password);
    delete updateData.password;
  }

  // Ensure username stays lowercase if being updated
  if (updateData.username) {
    updateData.username = updateData.username.toLowerCase();
  }
  
  // Apply updates
  Object.assign(user, updateData);
  return await user.save();
};

export const deleteUserService = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  await User.deleteOne({ _id: id });
};