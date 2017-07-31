package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"

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
	Route{
		"GetCellsInQuad",
		"Get",
		"/cells/{lat1}/{lon1}/{lat2}/{lon2}",
		GetCellsInQuad,
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
func GetCellsInQuad(w http.ResponseWriter, r *http.Request) {
	ipFilter(w, r)

	vars := mux.Vars(r)
	lat1, err := strconv.ParseFloat(vars["lat1"], 64)
	check(err)
	lon1, err := strconv.ParseFloat(vars["lon1"], 64)
	check(err)
	lat2, err := strconv.ParseFloat(vars["lat2"], 64)
	check(err)
	lon2, err := strconv.ParseFloat(vars["lon2"], 64)
	check(err)
	fmt.Println(vars)

	cells := []CellModel{}
	iter := cellCollection.Find(bson.M{"lat": bson.M{"$gte": lat2, "$lt": lat1}, "lon": bson.M{"$gte": lon1, "$lt": lon2}}).Limit(100).Iter()
	err = iter.All(&cells)

	//convert []cells struct to json
	jsonCells, err := json.Marshal(cells)
	check(err)

	fmt.Fprintln(w, string(jsonCells))
}
