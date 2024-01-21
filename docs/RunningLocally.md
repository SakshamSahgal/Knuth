# Running The Project Locally

## Steps Overview -

### Clone the Repo

Clone the repository locally by using the git command - 
`git clone <https://github.com/SakshamSahgal/Knuth.git`>

### Setup .env file

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
    Host = <http://localhost:3000>
    limitPerPage = 3
    NodeMailerEmail = <Email for Nodemailer>
    NodeMailerAppPassword = <App password for that email>
    RatingLength = 50
    ```
    
- For explaination of the .env parameters, you can refer [ConfigurationParameters](ConfigurationParameters.md)
    
      
    > Note: The value of these configuration parameters are very sensitive information and without these values the project won't be functional.
    

### Install Packages

1. You can install the packages using the command `npm install`
2. for more details about packages you can refer [Packages Used](PackagesUsed.md)

### run

Start Command - `node ServerSide/server.js`