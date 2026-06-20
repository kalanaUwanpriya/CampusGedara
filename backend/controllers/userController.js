import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            accommodationBookmarks: user.accommodationBookmarks,
            foodBookmarks: user.foodBookmarks,
            noteBookmarks: user.noteBookmarks,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            accommodationBookmarks: user.accommodationBookmarks,
            foodBookmarks: user.foodBookmarks,
            noteBookmarks: user.noteBookmarks,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            mobile: user.mobile || '',
            address: user.address || '',
            accommodationBookmarks: user.accommodationBookmarks,
            foodBookmarks: user.foodBookmarks,
            noteBookmarks: user.noteBookmarks,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        // Allow clearing mobile/address by passing empty string
        if (req.body.mobile !== undefined) user.mobile = req.body.mobile;
        if (req.body.address !== undefined) user.address = req.body.address;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            mobile: updatedUser.mobile || '',
            address: updatedUser.address || '',
            accommodationBookmarks: updatedUser.accommodationBookmarks,
            foodBookmarks: updatedUser.foodBookmarks,
            noteBookmarks: updatedUser.noteBookmarks,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Toggle user bookmark
// @route   POST /api/users/bookmarks/:type/:id
// @access  Private
const toggleBookmark = async (req, res) => {
    const { type, id } = req.params;
    const user = await User.findById(req.user._id);

    if (user) {
        let bookmarksArray;
        if (type === 'accommodation') {
            if (!user.accommodationBookmarks) user.accommodationBookmarks = [];
            bookmarksArray = user.accommodationBookmarks;
        } else if (type === 'food') {
            if (!user.foodBookmarks) user.foodBookmarks = [];
            bookmarksArray = user.foodBookmarks;
        } else if (type === 'note') {
            if (!user.noteBookmarks) user.noteBookmarks = [];
            bookmarksArray = user.noteBookmarks;
        } else {
            return res.status(400).json({ message: 'Invalid bookmark type' });
        }

        const index = bookmarksArray.findIndex(bookmarkId => bookmarkId && bookmarkId.toString() === id.toString());
        
        if (index > -1) {
            // Remove bookmark
            bookmarksArray.splice(index, 1);
        } else {
            // Add bookmark
            bookmarksArray.push(id);
        }

        user.markModified('accommodationBookmarks');
        user.markModified('foodBookmarks');
        user.markModified('noteBookmarks');
        await user.save();
        res.json({
            accommodationBookmarks: user.accommodationBookmarks,
            foodBookmarks: user.foodBookmarks,
            noteBookmarks: user.noteBookmarks,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    toggleBookmark,
    getUsers,
    deleteUser
};
