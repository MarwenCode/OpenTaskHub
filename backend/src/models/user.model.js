/**
 * User model
 * Represents a user in the system
 * Can be a regular user or an admin
 */

export const UserModel = {
  id: null,           // string, UUID
  username: null,     // string
  email: null,        // string
  password: null,     // string, hashed
  role: 'user',       // 'user' or 'admin'
  createdAt: new Date(),
  updatedAt: new Date(),
  ROLES: ['user', 'admin'], // allowed roles
};
