# Step 1: Use an official Node.js image as the base image.
FROM node:14-alpine

# Step 2: Set the working directory inside the container.
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) to the container.
COPY package*.json ./

# Step 4: Install dependencies.
RUN npm install --production

# Step 5: Copy the rest of the application files to the container.
COPY . .

# Step 6: Build the React application.
RUN npm run build

# Step 7: Use a lightweight web server to serve the built React application.
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Step 8: Expose the port that the server will be listening on.
EXPOSE 5000