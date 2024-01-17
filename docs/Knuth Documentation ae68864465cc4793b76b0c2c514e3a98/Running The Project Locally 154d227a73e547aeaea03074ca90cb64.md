# Running The Project Locally

# Running The Project Locally

## Steps Overview -

### Clone the Repo

Clone the repository locally by using the git command -
`git clone https://github.com/SakshamSahgal/Knuth.git`

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
    Host = http://localhost:3000
    limitPerPage = 3
    NodeMailerEmail = <Email for Nodemailer>
    NodeMailerAppPassword = <App password for that email>
    RatingLength = 50
    ```
    
- For explaination of the .env parameters, you can refer this -
    
    [Configuration Parameters](Configuration%20Parameters%205b8ff156f01b4e9b905a85c438348086.md)
    
    > Note: The value of these configuration parameters are very sensitive information and without these values the project won't be functional.
    > 
    

### Install Packages

1. You can install the packages using the command `npm install`
2. for more details about packages you can refer - 

[Packages Used](Packages%20Used%20562ef0a62caa4062b79b33595f62e0ca.md)

### run

Start Command - `node ServerSide/server.js`