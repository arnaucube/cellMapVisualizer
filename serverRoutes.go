package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gopkg.in/mgo.v2/bson"
)

type Routes []Route

var routes = Routes{
	Route{
		"Index",
		"GET",
		"/",
		Index,
	},
	Route{
		"GetAllCells",
		"Get",
		"/allcells",
		GetAllCells,
	},
}

//ROUTES

func Index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "ask for cells in /r")
	//http.FileServer(http.Dir("./web"))
}
func GetAllCells(w http.ResponseWriter, r *http.Request) {
	ipFilter(w, r)

	cells := []CellModel{}
	iter := cellCollection.Find(bson.M{}).Limit(10000).Iter()
	err := iter.All(&cells)

	//convert []cells struct to json
	jsonCells, err := json.Marshal(cells)
	check(err)

	fmt.Fprintln(w, string(jsonCells))
}
