# Use the official Node.js image
FROM node:18

# Install dependencies 
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the Next.js development server port
EXPOSE 3000

# Command to start the app
CMD ["npm", "run", "dev"]
