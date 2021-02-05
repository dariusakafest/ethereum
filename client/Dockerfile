# pull official base image
FROM node:15.7.0

# set working directory
WORKDIR /

# add `/app/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# add app
COPY . ./

EXPOSE 3000

# start app
CMD ["npm", "run", "dev"]
