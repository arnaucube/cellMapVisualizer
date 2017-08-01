package main

type LocationModel struct {
	Type        string    `json:"type"`
	Coordinates []float64 `json:"coordinates"`
}
type CellModel struct {
	Radio         string        `json:"radio"`
	MCC           string        `json:"mcc"`
	Net           int           `json:"net"`
	Area          int           `json:"area"`
	Cell          int           `json:"cell"`
	Unit          int           `json:"unit"`
	Lat           float64       `json:"lat"`
	Lon           float64       `json:"lon"`
	Location      LocationModel `json:"location"`
	Range         float64       `json:"range"`
	Samples       int           `json:"samples"`
	Changeable    string        `json:"changeable"`
	Created       int64         `json:"created"`
	Updated       int64         `json:"updated"`
	AverageSignal float64       `json:"averagesignal"`
}
