<style>
  body {
    background-color: black;
    color: white;
  }
</style>

# What does each configuration parameter means?

- `URI` :
  
  - This is the `Uniform Resource Identifier` provided by MongoDB that the project uses to connect to the Database.
  - The string is used to connect to Knuth's cluster containing the Knuth's Database.
  - It looks something like this -
  - `mongodb+srv://<username>:<password>@knuthcluster.bdqayma.mongodb.net/?retryWrites=true&w=majority`

- `DEV_PORT` :
  
  - specifies the port used by the server to host the application.
  - by default the application is hosted on port 3000.

- `CLIENT_ID` and `CLIENT_SECRET`:
  
  - To make the google authentication work, you have to use Oauth API from google console.
  - Make a new project in google console.
  - you will get a Client_ID and Client Secret from there.

- `SESSION_SECRET`
  
  - This is a string that is used by express session middleware used to sign and encrypt the session data before it is stored on the client side.
  - To run locally you can set it to anything you want.

- `ImageUploadLimit`
  
  - This specifies the max number of images you can upload per post, in an Announcements and in a Event.
  - by default it is set to 5.

- `ImageSizeLimitInBytes`
  
  - Default value is 1048576 Bytes which is 1MB.
  
  - This specifies the max size of any individual image while uploading per post, in an Announcement and in a Event.

- `imgurClientID`
  
  - Whenever we upload an image in a post of an `event` or an `announcement`, it is not stored on the server itself.
  
  - This is done because we have hosted the website on render,in which Application data isn’t persisted across deploys and restarts on `free instances`.
  
  - So instead of storing the image on the server itself, I used `Igmur APIs` to upload the images `Anonymously` to Igmur, and store the image access link in the Mongo database.
  
  - This way the uploaded data remains persistant even across deploys and restarts.
  
  - We don't need `imgurClientID` to upload images Anonymously to Igmur, but we need this to delete them.
  
  - We need the imgurClientID in the `Authorization header` to delete the images (with their respective `deleteHash`) when a post is deleted - 
  
  - ```
    Authorization': `Client-ID ${clientId}`,
    ```

- `imgurClientSecret`
  
  - Currently this is not used, because I am doing `Anonymous uploads` to `Imgur`, hence the uploads are not associated to any account.

- `TitleLength`
  
  - Specifies the maximum number of characters allowed in POD title.

- `DescriptionLength`
  
  - Specifies the maximum number of characters allowed in Description of an Event post or an Announcement Post.

- `Host`
  
  - This specifies the url on which the website is hosted.
  
  - When running locally the value should be - `http://localhost:3000`
  
  - In Delpoyment the value is be - `https://knuth-programming-hub-9p08.onrender.com`
  
  - This is used by - 
    
    - KeepAlive.js to ping to the URL every 10 minutes, to keep the server from spinning down.
    
    - Auth.js to redirect to the Host after sucessfull Google auth login.

- `limitPerPage`
  
  - This specifies the max number of posts per page in Events page, POD  page and Announcements page.

- `NodeMailerEmail`
  
  - This specifies the official email which is used to send updates to subscribers.
  
  - For local testing you can set it to any of your devtesting emails.

- `NodeMailerAppPassword`
  
  - this is the app password (not email password), for the email used above.

- `PingBotDuration`
  
  - This specifies the duration (in ms) in which the KeepAlive.js script should ping itself to keep the server from Spinning down.
  
  - by default the value is - `600000` which is `10 minutes`
