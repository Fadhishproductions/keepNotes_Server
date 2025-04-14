import jwt from 'jsonwebtoken';

export const generateRefreshToken = (res, userId) => {
 

  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: 'Strict',
    path: '/api/auth/refresh-token',
  });

};

export  const generateAccessToken = (userId)=>{

 return  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
}
