# Running The project Locally

- Clone the repository locally by using the git command -
  `git clone https://github.com/SakshamSahgal/Knuth.git`

- Add a .env file in the root directory of the cloned local repository.

- Add these configuration parameters in the `.env` file -
  
  ```
  URI = <MongoDB URI here>
  DEV_PORT = 3000
  CLIENT_ID = <Google OAuth Client ID>
  CLIENT_SECRET = <Google OAuth Client secret>
  SESSION_SECRET = <Express session secret>
  ImageUploadLimit = 5
  ImageSizeLimitInBytes = 1048576
  imgurClientID = <Imgur Client ID>
  imgurClientSecret = <Imgur Client Secret>
  TitleLength = 100
  DescriptionLength = 1000
  Host = http://localhost:3000
  limitPerPage = 3
  NodeMailerEmail = <Email for Nodemailer>
  NodeMailerAppPassword = <App password for that email>
  RatingLength = 50
  ```

> **Note:** The value of these configuration parameters are very sensitive information and without these values the project won't be functional.

### [What does each configuration parameter means?](./ConfigurationParameter.md)

> Build Command - npm install
> 
> Start Command - node ServerSide/server.js
