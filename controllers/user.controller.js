import { loginValidation, createUserValidation, getUserListValidation, updateUserValidation } from '../validations/user.validation.js';
import { loginUser, createUser, getUserListService, updateUserService, deleteUserService } from '../services/user.service.js';

export const login = async (req, res) => {
  try {
    // Validate input
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = req.body;

    // Call service login function
    const token = await loginUser(username, password);

    // Return success response without token in body since it's in cookie
    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(401).json({ error: err.message || 'Invalid username or password' });
  }
};

export const register = async (req, res) => {
  try {
    // Only allow admins to create users
    if (req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Validate body
    const { error } = createUserValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const createdUser = await createUser(req.body);

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        type: createdUser.type,
      },
    });
  } catch (err) {
    console.error('Create User Error:', err);
    return res.status(400).json({ error: err.message });
  }
};

export const getUserList = async (req, res) => {
  try {
    // Validate query params
    let isAdmin = false;
    if(req.user?.type == 'admin'){
      isAdmin = true;
    }
    const { error, value } = getUserListValidation.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { page = 1, limit = 10 } = value;

    const result = await getUserListService({ page, limit, isAdmin });

    return res.status(200).json({
      message: 'User list fetched successfully',
      data:result,
    });
  } catch (err) {
    console.error('Get User List Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUserController = async (req, res) => {
  try {
    // Only admins can update users
    if (req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'User _id is required in params' });
    }

    const { error } = updateUserValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedUser = await updateUserService(id, req.body);

    return res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        type: updatedUser.type,
      },
    });
  } catch (err) {
    console.error('Update User Error:', err.message);
    return res.status(400).json({ error: err.message });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    // Only admins can delete users
    if (req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required in params' });
    }

    await deleteUserService(userId);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete User Error:', err.message);
    return res.status(400).json({ error: err.message });
  }
};