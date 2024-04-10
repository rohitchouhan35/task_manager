import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ status: 'failed', message: 'Access denied. No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error:', error);
    res.status(401).json({ status: 'failed', message: 'Invalid token' });
  }
};

const checkUserRole = async (req, res, next) => {
    try {

        const token = req.headers['authorization'].split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userRole = decoded.role;

        console.log("User Role: ", decoded);

        if (userRole !== "administrator") {
            return res.status(403).json({ message: 'Access denied. Only teacher can access this resource.' });
        }

        req.userRole = userRole;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

export default checkUserRole;
