package models

import "sync"

type App struct {
	Api *MainApi
	Res *ResponseData
	Err error
}

var (
	instance   *App
	once       sync.Once
	allArtists = make(chan struct{}, 1)
)

// initializing and executing only once.
func AppState() *App {
	once.Do(func() {
		instance = &App{
			Api: NewMainApi(),
			Res: NewResponseData(),
			Err: nil,
		}
		instance.Res.AddArtist(instance.Api)
	})
	return instance
}
