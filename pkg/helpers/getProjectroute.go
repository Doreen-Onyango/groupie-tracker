package helpers

import (
	"os"
	"path/filepath"
)

func Getprojectroute(path string) string {
	basepath, _ := os.Getwd()
	return filepath.Join(basepath, path)
}
