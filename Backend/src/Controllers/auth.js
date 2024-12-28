import user from "../Modals/user.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signUp = async (req, res) => {
    const { name, email, password, role = 'user' } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const newUser = new user({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', data: newUser });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const User = await user.findOne({ email });
        if (!User) return res.status(400).json({ message: 'User does not exist' });

        // Compare Passwords
        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Invalidate old token
        if (user.currentToken) {
            console.log('Previous session invalidated.');
        }

        // Generate a new token
        const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, { expiresIn: '10s' });

        // Save the new token in the database
        user.currentToken = token;
        await user.save();

        res.status(200).json({
            message: 'Login successful.',
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const logout = async (req, res) => {
    try {
      const users = await user.findById(req.user.id);
      if (!users) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      users.currentToken = null; // Clear the token
      await users.save();
  
      res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };