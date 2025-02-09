# Use Node.js LTS as the base image
FROM node:18-alpine

# Build argument that controls dev vs. prod
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application
COPY . .

# If in production mode, create the optimized build
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Expose default Next.js or React port
EXPOSE 3000

# If production, run `npm run start`; else fallback to `npm run dev`
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run start; else npm run dev; fi"]
