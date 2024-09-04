package models

import "sync"

type App struct {
	Api *MainApi
	Res *ResponseData
	Err error
}

var (
	instance *App
	once     sync.Once
)

func AppState() *App {
	once.Do(func() {
		instance = &App{
			Api: NewMainApi(),
			Res: NewResponseData(),
			Err: nil,
		}
		instance.Res.SetData(instance.Api)
	})
	return instance
}
