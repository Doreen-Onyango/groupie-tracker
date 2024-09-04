package models

import (
	"html/template"
)

// TemplateData holds configuration for the application.
type TemplateData struct {
	PageCache map[string]*template.Template
}

// NewTemplateData returns a new instance of TemplateData.
func NewTemplateData() *TemplateData {
	return &TemplateData{PageCache: make(map[string]*template.Template)}
}
