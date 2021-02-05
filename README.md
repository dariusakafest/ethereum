# Test server on GO and client on React with Next.js

1. Installation Go

Download Go Lang here: https://golang.org/dl/
Install it.

Build app via console command in 'go' folder:

`go build index.go`

Run your binary app. App will available on web address:

http://localhost:8000

2. Installation Node.Js

Download Node.Js here: https://nodejs.org/en/
Install it.

In 'client' folder run console command:

`npm install`

After successful installation you can run app via console command:

`npm run dev`

Client app will be available on web addess: 

http://localhost:3000

3. Run client on react in Docker

Install docker:

https://docs.docker.com/get-docker/

Command for build:

`sudo docker build . -t react-client`

Command for run:

`sudo docker run -d --name react-client -p 0.0.0.0:3000:3000 react-client`
