export interface Account {
  _id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  refreshToken: string;
  accessToken: string;
  createdAt: Date;
  updatedAt: Date;
  timestamp: Date;
  accessExpires: number;
}
