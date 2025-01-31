import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        sameSite: 'None', // Important for cross-site access
        secure: true // Cookies must be sent over https
    };

    res.cookie('jwt', token, cookieOptions);
};