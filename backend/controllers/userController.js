import { text } from "express";
import { comparePassword, hashPassword } from "../libs/index.js";
import { pool } from '../libs/database.js';

export const getUser = async (req, res) => {
    try {
        const { userId } = req.body.user;

        const userExists = await pool.query({
            text: 'SELECT * FROM tbluser WHERE id = $1',
            values: [userId],
        });

        const user = userExists.rows[0];

        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
            });
        }

        user.password = undefined;

        res.status(200).json({
            status: 'success',
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { userId } = req.body.user;

        const { currentPassword, newPassword, confirmPassword } = req.body;

        const userExists = await pool.query({
            text: 'SELECT * FROM tbluser WHERE id = $1',
            values: [userId],
        });

        const user = userExists.rows[0];

        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(401).json({
                status: 'failed',
                message: 'New Passwords do not match',
            });
        }

        const isMatch = await comparePassword(currentPassword, user?.password);

        if (!isMatch) {
            return res.status(401).json({
                status: 'failed',
                message: 'Invalid Current Password',
            });
        }

        const hashedPassword = await hashPassword(newPassword);

        await pool.query({ 
            text: 'UPDATE tbluser SET password = $1 WHERE id = $2',
            values: [hashedPassword, userId],
        });

        res.status(200).json({
            status: 'success',
            message: 'Password changed successfully',
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const {userId} = req.body.user;
        const {firstname, lastname, country, currency, contact} = req.body;

        const userExists = await pool.query({
            text: 'SELECT * FROM tbluser WHERE id = $1',
            values: [userId],
        });

        if (!userExists.rows[0]) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
            });
        }

        const updatedUser = await pool.query({
            text: 'UPDATE tbluser SET firstname = $1, lastname = $2, country = $3, currency = $4, contact = $5, updatedat = CURRENT_TIMESTAMP WHERE id = $6 returning *',
            values: [firstname, lastname, country, currency, contact, userId],
        });

        updatedUser.rows[0].password = undefined;

        res.status(200).json({
            status: 'success',
            message: 'User information updated successfully',
            user: updatedUser.rows[0],
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

// export const signinUser = async (req, res) => {
//     try {
//         res.status(201).json({
//             status: 'success',
//             message: 'User signed up successfully',
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             message: 'Internal server error',
//         });
//     }
// };