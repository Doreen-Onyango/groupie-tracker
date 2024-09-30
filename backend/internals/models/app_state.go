package models

import (
	"bufio"
	"log"
	"os"
	"strings"
	"sync"
)

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

		// Load the .env file
		err := LoadEnv(".env")
		if err != nil {
			log.Fatalf("Error loading .env file: %v", err)
		}
		instance.Res.AddArtist(instance.Api)
	})
	return instance
}

// LoadEnv loads the environment variables from the .env file into the environment
func LoadEnv(filename string) error {
	file, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()

		// Ignore comments and empty lines
		if strings.HasPrefix(line, "#") || len(strings.TrimSpace(line)) == 0 {
			continue
		}

		// Split key and value by "="
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}

		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])

		// Set the environment variable
		os.Setenv(key, value)
	}

	if err := scanner.Err(); err != nil {
		return err
	}

	return nil
}
