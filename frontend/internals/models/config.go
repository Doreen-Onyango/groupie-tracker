package models

import (
	"sync"
)

// App manages the application data state.
type App struct {
	TemplateData *TemplateData
}

// Singleton instance of App
var (
	instance *App
	once     sync.Once
)

// GetApp returns the singleton instance of App
func GetApp() *App {
	once.Do(func() {
		instance = &App{
			TemplateData: NewTemplateData(),
		}
		instance.TemplateData.CreateTemplateCache()
	})
	return instance
}
