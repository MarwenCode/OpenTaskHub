// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token missing' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
   
    req.userId = decoded.id;  
    req.userRole = decoded.role;
    
    console.log('✅ userId:', req.userId);  // Pour vérifier
    console.log('✅ userRole:', req.userRole);

    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};