package models

import (
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	"strings"
)

// TemplateData holds configuration for the application.
type TemplateData struct {
	PageCache map[string]*template.Template
}

// NewTemplateData returns a new instance of TemplateData.
func NewTemplateData() *TemplateData {
	return &TemplateData{PageCache: make(map[string]*template.Template)}
}

// CreateTemplateCache caches all HTML templates.
func (t *TemplateData) CreateTemplateCache() error {
	templatesDir := t.GetProjectRoute("views/templates", "*.page.html")
	pages, err := filepath.Glob(templatesDir)
	if err != nil {
		return fmt.Errorf("error globbing templates: %v", err)
	}

	for _, page := range pages {
		name := filepath.Base(page)
		ts, err := template.New(name).ParseFiles(page)
		if err != nil {
			return fmt.Errorf("error parsing page %s: %v", name, err)
		}

		layoutsPath := t.GetProjectRoute("views/templates", "*.layout.html")
		matches, err := filepath.Glob(layoutsPath)
		if err != nil {
			return fmt.Errorf("error finding layout files: %v", err)
		}

		if len(matches) > 0 {
			ts, err = ts.ParseGlob(layoutsPath)
			if err != nil {
				return fmt.Errorf("error parsing layout files: %v", err)
			}
		}

		t.PageCache[name] = ts
	}
	return nil
}

// GetTemplate returns the cached template by name.
func (t *TemplateData) GetTemplate(name string) (*template.Template, error) {
	ts, ok := t.PageCache[name]
	if !ok {
		return nil, fmt.Errorf("template %s not found", name)
	}
	return ts, nil
}
