
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user from '../Modals/user.js';

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
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const foundUser = await user.findOne({ email });
        if (!foundUser) return res.status(400).json({ message: 'User does not exist' });

        // Compare Passwords
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Invalidate old token if exists
        if (foundUser.currentToken) {
            console.log('Previous session invalidated.');
        }

        // Generate a new token
        const token = jwt.sign({ id: foundUser._id, role: foundUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Save the new token in the database
        foundUser.currentToken = token;
        await foundUser.save();

        res.status(200).json({
            message: 'Login successful.',
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const logout = async (req, res) => {
    try {
        // Assuming the token is passed in the Authorization header
        const token = req.headers['authorization']?.split(' ')[1]; // Get token from header
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await user.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Invalidate token by setting it to null
        user.currentToken = null;
        await user.save();

        res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};
