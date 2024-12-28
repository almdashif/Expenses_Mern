import user from "../Modals/user.js";

export const getAllUser = async (req, res) => {
    try {
        const users = await user.find().select('-password'); // Exclude passwords
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const users = await user.findById(id).select('-password'); // Exclude passwords

        if (!users) return res.status(404).json({ message: 'User not found.' });

        // Check if the user is accessing their own profile or is an admin
        if (req.user.id !== id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
}