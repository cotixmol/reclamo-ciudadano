FROM node:18-alpine

# Set build argument (default to development)
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with NODE_ENV set to development to include devDependencies
RUN NODE_ENV=development npm install

# Copy the rest of the application
COPY . .

# If in production mode, run the optimized build
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Expose the default port
EXPOSE 3000

# Start the application: production uses "npm run start", otherwise "npm run dev"
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run start; else npm run dev; fi"]
