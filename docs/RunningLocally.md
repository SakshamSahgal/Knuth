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



 

## What does each configuration parameter means?

- `URI` : 
  - This is the Uniform Resource Identifier provided by MongoDB that the project uses to connect to the Database.
  - The string is used to connect to Knuth's cluster containing the Knuth's Database.
  - It looks something like this - 
  - `mongodb+srv://<username>:<password>@knuthcluster.bdqayma.mongodb.net/?retryWrites=true&w=majority`
- `DEV_PORT` : 
  - specifies the port used by the server to host the application.
- 
- `CLIENT_ID`  and `CLIENT_SECRET`: 
  - To make the google authentication work, you have to use Oauth API from google console.
  - Make a new project in google console.
  - you will get a Client_ID and Client Secret from there.
- `SESSION_SECRET`
  - this is a string that is used by express session middleware used to sign and encrypt the session data before it is stored on the client side.
  - to run locally you can set it to anything you want.
