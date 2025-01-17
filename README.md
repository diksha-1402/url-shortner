INSTRUCTION TO RUN API 


1. Google Sign-In
Endpoint:
GET https://url-shortner-js93.onrender.com/v1/api/auth/google

Description:
Initiates Google Sign-In for user authentication. Upon successful login, returns a JWT token for further API authentication.

Response Example:
{
  "version": {
    "current_version": "1.0.0",
    "major_update": 0,
    "minor_update": 0,
    "message": "App is Up to date"
  },
  "success": 1,
  "message": "Login success",
  "data": "<JWT_TOKEN>"
}
-------------------------------------------------------------------------------------------------------------
2. Swagger Documentation
Endpoint:
GET https://url-shortner-js93.onrender.com/api-url/#/

Description:
Provides access to API documentation using Swagger. Use the Authorization button to authenticate by entering the JWT token under the Bearer Token scheme.
-----------------------------------------------------------------------------------------------------------
3. Create Shortened URL
Endpoint:
POST https://url-shortner-js93.onrender.com/v1/api/shorten

Headers:
x-authorization: Bearer <JWT_TOKEN>

Description:
Creates a shortened URL for a given long URL, with optional topic and alias parameters.

Request Body:
{
  "longUrl": "https://mail.google.com/mail/u/0/#inbox",
  "topic": "epoc",
  "alias": "test"
}

Response Example:
{
  "version": {
    "current_version": "1.0.0",
    "major_update": 0,
    "minor_update": 0,
    "message": "App is Up to date"
  },
  "success": 1,
  "message": "URL created successfully",
  "data": {
    "shortUrl": "https://url-shortner-js93.onrender.com/v1/api/shorten/sSXzfd9"
  }
}
------------------------------------------------------------------------------------------------------------

4. Retrieve URL by Alias
Endpoint:
GET https://url-shortner-js93.onrender.com/v1/api/shorten/:alias

Description:
Fetches the original long URL associated with the provided alias.

Response Example:
{
  "version": {
    "current_version": "1.0.0",
    "major_update": 0,
    "minor_update": 0,
    "message": "App is Up to date"
  },
  "success": 1,
  "message": "URL retrieved successfully",
  "data": "https://mail.google.com/mail/u/0/#inbox"
}
-------------------------------------------------------------------------------------------------------------
5. URL Analytics by Alias
Endpoint:
GET https://url-shortner-js93.onrender.com/v1/api/analytics/:alias

Description:
Provides analytics for a specific URL identified by its alias, including total clicks, unique users, clicks by date, and device/OS type breakdown.

Response Example:
{
  "version": {
    "current_version": "1.0.0",
    "major_update": 0,
    "minor_update": 0,
    "message": "App is Up to date"
  },
  "success": 1,
  "message": "Success",
  "data": {
    "totalClicks": 5,
    "uniqueUsers": 1,
    "clicksByDate": [
      {
        "date": "2025-01-17",
        "count": 5
      }
    ],
    "osType": [
      {
        "osName": "Other",
        "uniqueClicks": 5,
        "uniqueUsers": 1
      }
    ],
    "deviceType": [
      {
        "deviceName": "Desktop",
        "uniqueClicks": 5,
        "uniqueUsers": 1
      }
    ]
  }
}
-------------------------------------------------------------------------------------------------------------
6. Topic-Wise Analytics
Endpoint:
GET https://url-shortner-js93.onrender.com/v1/api/analytics/topic/:topic

Description:
Fetches analytics for URLs grouped by a specific topic, including total clicks, unique users, and URL-specific analytics.

Response Example:
{
  "version": {
    "current_version": "1.0.0",
    "major_update": 0,
    "minor_update": 0,
    "message": "App is Up to date"
  },
  "success": 1,
  "message": "Success",
  "data": {
    "totalClicks": 7,
    "uniqueUsers": 1,
    "clicksByDate": {
      "2025-01-17": 7
    },
    "urls": [
      {
        "shortUrl": "https://url-shortner-js93.onrender.com/v1/api/shorten/Uub2jTH",
        "totalClicks": 5,
        "uniqueUsers": 1
      },
      {
        "shortUrl": "https://url-shortner-js93.onrender.com/v1/api/shorten/sSXzfd9",
        "totalClicks": 2,
        "uniqueUsers": 1
      }
    ]
  }
}
-------------------------------------------------------------------------------------------------------------
7. Overall Analytics
Endpoint:
GET https://url-shortner-js93.onrender.com/v1/api/analytics/overall

Description:
Provides a summary of overall analytics across all URLs, including total URLs, total clicks, unique users, and breakdowns by date, device type, and OS type.

Response Example:

{
  "version": {
    "current_version": "1.0.0",
    "major_update": 0,
    "minor_update": 0,
    "message": "App is Up to date"
  },
  "success": 1,
  "message": "Success",
  "data": {
    "totalUrls": 4,
    "totalClicks": 11,
    "uniqueUsers": 1,
    "clicksByDate": [
      {
        "date": "2025-01-17",
        "count": 11
      }
    ],
    "osType": [
      {
        "osName": "Other",
        "uniqueClicks": 11,
        "uniqueUsers": 1
      }
    ],
    "deviceType": [
      {
        "deviceName": "Desktop",
        "uniqueClicks": 11,
        "uniqueUsers": 1
      }
    ]
  }
}
