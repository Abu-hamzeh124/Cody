# Use a standard Node.js environment
FROM node:20-alpine

# Set the working directory inside the cloud container
WORKDIR /app

# Copy the package files first to install dependencies efficiently
COPY package*.json ./

# Install all dependencies (including TypeScript build tools)
RUN npm install

# Copy the rest of your backend code
COPY . .

# Compile your TypeScript down to JavaScript
RUN npm run build

# Expose the internal port your Express app listens on
EXPOSE 3000

# Start the application using your compiled production files
CMD ["node", "dist/index.js"]