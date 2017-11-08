# Use `node:alpine` image as the base,
# which is much smaller than node:lastest.
FROM node:alpine

# The WORKDIR command creates a directory within the new container image
# and sets that as the current working directory.
# All other paths within the container image are then
# evaluated as relative to that working directory.
# Set the current working directory to /app.
WORKDIR /app

# Copy the package.json and package-lock.json file to the work directory.
COPY package.json .
COPY package-lock.json .

# Run npm install to install all dependent packages.
# We run this command within the container
# so that any packages that include native code will be compiled
# for Linux rather than our host OS.
RUN npm install

# Copy your JavaScript source files.
COPY server.js .

# Declare that your server will listen on port 80.
EXPOSE 80

# Set the entrypoint command.
ENTRYPOINT ["node", "server.js"]