// | File          | Example endpoints                                                                                                                                                                               |
// | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
// | `auth.js`     | `/register` → register new user <br> `/login` → login user                                                                                                                                      |
// | `accounts.js` | `/` → list all accounts for this user <br> `/add` → add new account <br> `/edit/:id` → update account <br> `/delete/:id` → delete account <br> `/run/:id` → run Puppeteer task for that account |
// | `tasks.js`    | (Optional: expose advanced task management if you break them out)                                                                                                                               |
// | `logs.js`     | (Optional: show logs per user, filter logs, download logs)                                                                                                                                      |

// | Folder / File | What it does |
// | -------------- | ------------------------------------------------------------- |
// | `/models` | Mongoose schemas(User, Account) |
// | `/routes` | Express routers: group your endpoints logically |
// | `/controllers` | Route handler logic(cleaner than writing in routes directly) |
// | `/middleware` | Reusable middlewares(JWT auth, error handlers) |
// | `/utils` | Helper scripts(e.g.Puppeteer automation, logger) |
// | `server.js` | Entry point: sets up Express, connects DB, uses routes |
// | `db.js` | MongoDB connection logic |
// | `.env` | Store secrets / config |
// | `package.json` | Dependencies and scripts |

import express from 'express';

const router = express.Router();

import { body } from 'express-validator'
import {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser, getCurrentUserData,getUserRideHistory,updateUserProfile
} from '../controllers/user.controllers.js';
import { verifyJWT } from '../middlewares/verifyJwt.js';
import {authorization } from '../middlewares/roleAuth.js';
router.route('/register')
    .post(
        [body('username').notEmpty().withMessage('Name is required'),
        body('phone').notEmpty().withMessage('Phone number is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        ],
        registerUser
    );

router.route('/login').post(
    [body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),],
    loginUser
)

router.route('/profile').get(verifyJWT, getUserProfile);

router.route('/logout').get(verifyJWT, logoutUser);

router.route('/getCurrentUser').get(verifyJWT, getCurrentUserData)

router.route("/ride-history").get(verifyJWT,getUserRideHistory);

router.route(  "/update-profile").put( verifyJWT, updateUserProfile)

export default router;
