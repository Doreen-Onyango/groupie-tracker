package helpers

import (
	"os"
	"path/filepath"
	"strings"
)

func Getprojectroute(path string) string {
	cwd, _ := os.Getwd()
	basedir := cwd

	if strings.HasSuffix(basedir, "cmd") {
		basedir = filepath.Join(cwd, "../")
	}
	return filepath.Join(basedir, path)
}
