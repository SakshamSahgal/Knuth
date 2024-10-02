# Running The Project Locally

## Steps Overview

### 1. Make sure you have Docker Installed

Ensure that you have Docker installed on your local machine. You can download Docker from [here](https://www.docker.com/products/docker-desktop/).

### 2. Clone the Repository

Clone the repository locally using the following git command:

```bash
git clone <https://github.com/SakshamSahgal/Knuth.git>
```

### 3. Build and Run the Docker Image -

```
docker build
 --build-arg CLIENT_ID=<Google OAuth DEV Client ID>
 --build-arg CLIENT_SECRET=<Google OAuth DEV Client secret>
 --build-arg DescriptionLength=1000
 --build-arg DEV_PORT=3000
 --build-arg Host=http://localhost:3000
 --build-arg ImageSizeLimitInBytes=1048576
 --build-arg ImageUploadLimit=5
 --build-arg imgurClientID=<Imgur Client ID>
 --build-arg imgurClientSecret <Imgur Client Secret>
 --build-arg limitPerPage=3
 --build-arg NodeMailerAppPassword=<App password for that email>
 --build-arg NodeMailerEmail=<Email for Nodemailer>
 --build-arg PingBotDuration=600000
 --build-arg RatingLength=50
 --build-arg SESSION_SECRET=<Express session secret>
 --build-arg TitleLength=100
 --build-arg DBUsername=<Dev DB username>
 --build-arg DBPassword=<Dev DB password>
 --build-arg ClusterAddress=<dev DB cluster Address>
 -t testimage . ; docker run -p 3000:3000 testimage
```

### 4. For explaination of the build args, you can refer [ConfigurationParameters](ConfigurationParameters.md)
    
      
>Note: The values of these configuration parameters are sensitive information. The project will not function properly without the correct values.

> Important: There are two separate databases — one for production and one for development. Both databases have different usernames, passwords, and cluster addresses.

> OAuth Clients: Similarly, there are two different OAuth clients. One is for production (which redirects to the actual website), and the other is for development (which redirects to http://localhost:3000). Both have different client IDs and client secrets.

<hr>

``` 
If you are genuenly interested in contributing to the project, i am happy to provide you the local build argument values.

❤️ Happy Developing ❤️

```
<hr>