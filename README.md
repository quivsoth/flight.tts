# flight.tts


Run the Flights web server
either run node server or supervisor server

Run the google cast controller
cast-web-api v1.0.2
cast-web-api --hostname=192.168.1.2 --port=3000


Run 3 Replication sets of MongoDB
mongod --port 27017 --dbpath ./srv/mongodb/rs0-0 --smallfiles --replSet rs0
mongod --port 27018 --dbpath ./srv/mongodb/rs0-1 --smallfiles --replSet rs0
mongod --port 27019 --dbpath ./srv/mongodb/rs0-2 --smallfiles --replSet rs0
