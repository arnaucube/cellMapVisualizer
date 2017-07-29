package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/fatih/color"
	"github.com/gorilla/handlers"
	mgo "gopkg.in/mgo.v2"
)

var cellCollection *mgo.Collection

func main() {
	//connect with mongodb
	readMongodbConfig("./mongodbConfig.json")
	session, err := getSession()
	check(err)
	cellCollection = getCollection(session, "cells")

	if len(os.Args) > 1 {
		if os.Args[1] == "-dataset" {
			color.Blue("starting to read dataset")
			readDataset("dataModel_head.csv")
			color.Blue("finished reading dataset")
		}
	}

	//http server start
	readServerConfig("./serverConfig.json")
	color.Green("server running")
	fmt.Print("port: ")
	color.Green(serverConfig.ServerPort)
	router := NewRouter()

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Access-Control-Allow-Origin"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})
	log.Fatal(http.ListenAndServe(":"+serverConfig.ServerPort, handlers.CORS(originsOk, headersOk, methodsOk)(router)))
}
