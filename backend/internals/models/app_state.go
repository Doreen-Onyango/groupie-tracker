package models

import "sync"

type App struct{}

var (
	instance *App
	once     sync.Once
)

func AppState() *App {
	once.Do(func() {
		instance = &App{}
	})
	return instance
}
