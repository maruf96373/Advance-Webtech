// src/types/express.d.ts

import { User } from '../../authentication/auth.entity'; // adjust the path if necessary

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      role: string;
      name?: string; // optional if not always present
    }

    interface Request {
      user?: User;
    }
  }
}
