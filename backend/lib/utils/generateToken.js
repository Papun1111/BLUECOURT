import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined.');
        return;
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true,
        sameSite: 'strict'
    });
};
