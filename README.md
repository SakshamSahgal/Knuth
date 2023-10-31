# **Knuth Programming Hub**

## Deployment

> The Knuth web application has been deployed on Render and can be accessed at [link](https://knuth-programming-hub-9p08.onrender.com/).

 

**Website is Designed, Developed, and Maintained by Saksham Sahgal**

## Purpose

> The Knuth Programming Hub (KPH) website serves the following functions:
> 
> 1. Hosting links to Competitive Programming practice websites.
> 2. Providing useful tools for Competitive Programming.
> 3. Showcasing Events Organized.
> 4. Sharing Announcements.
> 5. Featuring the "Problem of the Day," curated by KPH.



## Mission

> Our sole mission is to foster and promote a vibrant coding culture at JIIT Noida.



## Knuth Configuration Parameters

> To run the Knuth application locally, create a `.env` file with the following parameters:
> 
> - `URI` = `<MongoDB URI here>`
> - `DEV_PORT` = 3000
> - `CLIENT_ID` = `<Google OAuth Client ID>`
> - `CLIENT_SECRET` = `<Google OAuth Client secret>`
> - `SESSION_SECRET` = `<Express session secret>`
> - `ImageUploadLimit` = 5
> - `ImageSizeLimitInBytes` = 1048576
> - `imgurClientID` = `<Imgur Client ID>`
> - `imgurClientSecret` = `<Imgur Client Secret>`
> - `TitleLength` = 100
> - `DescriptionLength` = 1000
> - `Host` = `http://localhost:3000`
> - `limitPerPage` = 3
> - `NodeMailerEmail` = `<Email for Nodemailer>`
> - `NodeMailerAppPassword` = `<App password for that email>`
> - `RatingLength` = 50

## Packages Used -

> can be found in package.json
> 
> * "axios": "^1.5.0"
> * "dotenv": "^16.3.1"
> * "ejs": "^3.1.9"
> * "express": "^4.18.2"
> * "express-session": "^1.17.3"
> * "imgur": "^0.3.1"
> * "mongodb": "^5.7.0"
> * "multer": "^1.4.5-lts.1"
> * "nodemailer": "^6.9.5"
> * "passport": "^0.6.0"
> * "passport-google-oauth20": "^2.0.0"
> * "tslib": "^2.6.2"

Use ``npm install`` to install all the dependencies.

## Run Locally

to run, trigger - node ServerSide/server.js