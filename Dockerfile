FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the Vite server port
EXPOSE 3000

# Prevent Docker from sending SIGTERM immediately
CMD ["npm", "run", "dev", "--", "--host", "--port", "3000"]
