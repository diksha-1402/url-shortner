import dotenv from "dotenv";
dotenv.config();

const constants = Object.freeze({
  CONST_APP_NAME: process.env.APP_NAME,
  CONST_APP_URL: process.env.APP_URL,
  CONST_APP_VERSION: process.env.APP_VERSION,

  CONST_JWT_TOKEN_KEY: process.env.JWT_TOKEN_KEY,

  // API Response code
  CONST_RESP_CODE_OK: 200, // OK: The request was successful.
  CONST_RESP_CODE_CREATED: 201, // Created: A new resource has been created successfully.
  CONST_RESP_CODE_CONTENT_NOT_FOUND: 204, // No Content: The request was successful but there is no content to send.
  CONST_RESP_CODE_DATA_NOT_MODIFIED: 304, // Not Modified: The resource has not been modified.
  CONST_RESP_CODE_BAD_REQUEST: 400, // Bad Request: The server could not understand the request due to invalid syntax.
  CONST_RESP_CODE_UNAUTHORIZED: 401, // Unauthorized: The client must authenticate itself to get the requested response.
  CONST_RESP_CODE_NOT_FOUND: 404, // Not Found: The server could not find the requested resource.
  CONST_RESP_CODE_NOT_ACCEPT: 406, // Not Acceptable: The requested resource is capable of generating only content not acceptable according to the Accept headers.
  CONST_RESP_CODE_INTERNAL_SERVER_ERROR: 500,

  CONST_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CONST_GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  CONST_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  CONST_SESSION_SECRET: process.env.SESSION_SECRET,
  CONST_ENV: process.env.ENVIROMENT,
  CONST_CALLBACK_PROD_URL: process.env.GOOGLE_CALLBACK_PROD_URL,
  CONST_REDIS_HOST: process.env.REDIS_HOST,
  CONST_REDIS_PORT: process.env.REDIS_PORT,
  CONST_REDIS_URL: process.env.REDIS_URL,

  CONST_USER_VERIFIED_TRUE: true,
  CONST_USER_VERIFIED_FALSE: false,

  CONST_GEN_SALT: 10,
  CONST_DB_URL: process.env.MONGODB_URL,

  CONST_ROLE_ADMIN: 1,
  CONST_ROLE_USER: 2,

  CONST_PAGE: 1,
  CONST_LIMIT: 10,

  CONST_RESP_LANG_COLLECTION: ["en"],

  CONST_VALIDATE_SESSION_EXPIRE: "24h",

  CONST_STATUS_ACTIVE: "Active",
  CONST_STATUS_INACTIVE: "In-Active",
  CONST_STATUS_DELETED: "Deleted",

  CONST_ALLOW_URL_WITHOUT_HEADER: ["/", "/api-admin/"],

  CONST_SMTP_HOST: process.env.MAIL_HOST,
  CONST_SMTP_PORT: process.env.MAIL_PORT,
  CONST_SMTP_USER: process.env.MAIL_USERNAME,
  CONST_SMTP_PASSWORD: process.env.MAIL_PASSWORD,
  CONST_SMTP_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
});

export default constants;
