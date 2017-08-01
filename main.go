package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	mgo "gopkg.in/mgo.v2"
)

var cellCollection *mgo.Collection

func main() {
	savelog()

	//connect with mongodb
	readMongodbConfig("./mongodbConfig.json")
	session, err := getSession()
	check(err)
	cellCollection = getCollection(session, "cells")

	if len(os.Args) > 1 {
		if os.Args[1] == "-dataset" {
			log.Println("starting to read dataset")
			readDataset("cell_towers.csv")
			//readDataset("dataModel_head.csv")
			log.Println("finished reading dataset")
		}
	}

	//http server start
	readServerConfig("./serverConfig.json")
	log.Println("server running")
	log.Print("port: ")
	log.Println(serverConfig.ServerPort)
	router := NewRouter()

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Access-Control-Allow-Origin"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})
	log.Fatal(http.ListenAndServe(":"+serverConfig.ServerPort, handlers.CORS(originsOk, headersOk, methodsOk)(router)))
}
