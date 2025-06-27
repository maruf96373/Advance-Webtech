export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'your_default_jwt_secret', // fallback for dev
    expiresIn: '1d', // or '3600s', etc.
  };
  
  export const DEFAULT_ROLES = {
    ADMIN: 'admin',
    ORGANIZER: 'organizer',
    ATTENDEE: 'attendee',
  };
  