const requiredEnv = [
  "MONGODB_URI",
  "JWT_SECRET",
  "MAIL_HOST",
  "MAIL_PORT",
  "MAIL_USER",
  "MAIL_PASS",
  
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

const env = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV,
  mongoURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,

  mailHost: process.env.MAIL_HOST,
  mailPort: process.env.MAIL_PORT,
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS,


 

};

export default env;