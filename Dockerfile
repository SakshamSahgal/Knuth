# Use an official Node.js runtime as a base image
FROM node:20

# Define build-time variables that users can pass to the builder with the docker build command using the --build-arg <varname>=<value> flag
ARG CLIENT_ID
ARG CLIENT_SECRET
ARG DescriptionLength
ARG DEV_PORT
ARG Host
ARG ImageSizeLimitInBytes
ARG ImageUploadLimit
ARG imgurClientID
ARG imgurClientSecret
ARG limitPerPage
ARG NodeMailerAppPassword
ARG NodeMailerEmail
ARG PingBotDuration
ARG RatingLength
ARG SESSION_SECRET
ARG TitleLength
ARG DBUsername
ARG DBPassword
ARG ClusterAddress

# Set environment variables using build-time variables
ENV CLIENT_ID ${CLIENT_ID}
ENV CLIENT_SECRET ${CLIENT_SECRET}
ENV DescriptionLength ${DescriptionLength}
ENV DEV_PORT ${DEV_PORT}
ENV Host ${Host}
ENV ImageSizeLimitInBytes ${ImageSizeLimitInBytes}
ENV ImageUploadLimit ${ImageUploadLimit}
ENV imgurClientID ${imgurClientID}
ENV imgurClientSecret ${imgurClientSecret}
ENV limitPerPage ${limitPerPage}
ENV NodeMailerAppPassword ${NodeMailerAppPassword}
ENV NodeMailerEmail ${NodeMailerEmail}
ENV PingBotDuration ${PingBotDuration}
ENV RatingLength ${RatingLength}
ENV SESSION_SECRET ${SESSION_SECRET}
ENV TitleLength ${TitleLength}
ENV DBUsername ${DBUsername}
ENV DBPassword ${DBPassword}
ENV ClusterAddress ${ClusterAddress}

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN npm install

# Expose dev port (specified in the ENV variable) to the outside world
EXPOSE ${DEV_PORT}

# Run the specified command within the container
CMD ["node", "ServerSide/server.js"]