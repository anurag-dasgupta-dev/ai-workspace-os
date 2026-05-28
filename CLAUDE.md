# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# AI Workspace OS

## Project Overview

AI Workspace OS is a fullstack local AI application.

Stack:

* Frontend: Next.js + TypeScript + Tailwind CSS
* Backend: FastAPI (Python)
* AI Runtime: Ollama
* Local Model: Qwen2.5 7B
* Version Control: Git

The goal is to build a scalable AI workspace platform with:

* chat interface
* memory system
* streaming responses
* file upload and analysis
* multi-agent workflows
* automation systems

---

# Architecture Rules

## General

* Keep architecture clean and modular.
* Avoid huge files.
* Prefer reusable components.
* Maintain separation of concerns.
* Do not introduce unnecessary complexity.

---

# Frontend Rules

## Tech Stack

* Next.js App Router
* TypeScript
* Tailwind CSS

## Guidelines

* Use reusable React components.
* Keep UI modern and minimal.
* Prefer functional components.
* Use clean state management.
* Avoid duplicated logic.
* Keep page.tsx lightweight.

## Component Structure

Frontend components should be separated into:

* components/
* hooks/
* types/
* utils/

when needed.

---

# Backend Rules

## Tech Stack

* FastAPI
* Python

## Guidelines

* Use modular architecture.
* Keep business logic inside services/.
* Keep routes lightweight.
* Avoid putting AI logic directly inside routes.
* Prefer scalable patterns.

## Backend Structure

* app/routes
* app/services
* app/models

---

# AI Rules

* Use Ollama for local inference.
* Keep prompts clean and maintainable.
* Support streaming responses whenever possible.
* Optimize for local hardware performance.
* Avoid unnecessary API calls.

---

# Git Workflow

Before major changes:

* commit stable checkpoints
* avoid destructive refactors
* preserve working functionality

Never delete important files without confirmation.

---

# Coding Style

* Prefer readability over cleverness.
* Use descriptive variable names.
* Keep functions small and maintainable.
* Avoid overengineering.
* Add comments only when useful.

---

# Current Features

* Fullstack AI chat app
* FastAPI backend
* Next.js frontend
* Ollama integration
* Streaming support
* Modular frontend components
* Git version control

---

# Future Planned Features

* persistent memory
* SQLite database
* conversation history
* markdown rendering
* file upload
* PDF analysis
* multi-agent workflows
* automation systems
* workspace tools
* authentication
* deployment

---

# Important

When refactoring:

* preserve existing functionality
* avoid breaking API routes
* avoid unnecessary dependencies
* prefer incremental improvements
