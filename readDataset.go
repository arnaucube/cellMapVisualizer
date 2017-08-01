package main

import (
	"bufio"
	"log"
	"os"
	"strconv"
	"strings"
	"time"
)

func readDataset(path string) {
	tStart := time.Now()
	inFile, _ := os.Open(path)
	defer inFile.Close()
	scanner := bufio.NewScanner(inFile)
	scanner.Split(bufio.ScanLines)

	var lineNum int
	for scanner.Scan() {
		if lineNum > 0 {
			line := strings.Split(scanner.Text(), ",")
			var cell CellModel
			cell.Radio = line[0]
			cell.MCC = line[1]
			cell.Net, _ = strconv.Atoi(line[2])
			cell.Area, _ = strconv.Atoi(line[3])
			cell.Cell, _ = strconv.Atoi(line[4])
			cell.Unit, _ = strconv.Atoi(line[5])
			cell.Lon, _ = strconv.ParseFloat(line[6], 64)
			cell.Lat, _ = strconv.ParseFloat(line[7], 64)
			var location LocationModel
			location.Type = "Point"
			lon, _ := strconv.ParseFloat(line[6], 64)
			lat, _ := strconv.ParseFloat(line[7], 64)
			location.Coordinates = append(location.Coordinates, lat)
			location.Coordinates = append(location.Coordinates, lon)
			cell.Location = location
			cell.Range, _ = strconv.ParseFloat(line[8], 64)
			cell.Samples, _ = strconv.Atoi(line[9])
			cell.Changeable = line[10]
			cell.Created, _ = strconv.ParseInt(line[11], 10, 64)
			cell.Updated, _ = strconv.ParseInt(line[12], 10, 64)
			cell.AverageSignal, _ = strconv.ParseFloat(line[13], 64)

			//save cell to mongodb
			err := cellCollection.Insert(cell)
			check(err)
		}
		lineNum++
	}
	log.Println("line num: " + strconv.Itoa(lineNum))
	log.Print("time elapsed from start: ")
	log.Println(time.Since(tStart))
}
