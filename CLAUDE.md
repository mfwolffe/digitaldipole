# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Digital Dipole is a chemistry educational tool built with Django (backend) and React/Vite (frontend). It provides interactive calculators for chemistry equations, a periodic table reference, and a meme generator.

## Common Commands

### Backend (Django)
```bash
# Run development server
python manage.py runserver

# Run tests with pytest (uses --reuse-db by default)
pytest

# Run a single test file
pytest dipole/users/tests/test_views.py

# Run specific test
pytest dipole/users/tests/test_views.py::TestName

# Database migrations
python manage.py makemigrations
python manage.py migrate

# Linting and formatting (Python)
ruff check .
ruff check --fix .
ruff format .
```

### Frontend (React/Vite)
```bash
cd dipole/frontend

# Install dependencies
npm install

# Development with HMR
npm run dev

# Build (outputs to dipole/templates/static/assets)
npm run build

# Auto-rebuild on changes
npm run autobuild

# Lint
npm run lint

# Run equation renderer tests
npm run test
```

## Architecture

### Backend Structure
- `config/` - Django settings and URL configuration
  - `settings/base.py` - Shared settings
  - `settings/local.py` - Development settings (includes debug toolbar)
  - `settings/test.py` - Test settings
  - `settings/production.py` - Production settings
  - `api.py` - Django Ninja API endpoints at `/api/`
- `dipole/` - Main Django application directory
  - `users/` - Custom user model and authentication (allauth)
  - `calculators/` - Chemistry calculator models (Equation, Variable, Calculator)
  - `reference/` - Periodic table data models (Atom, Unit, Measure)
  - `templates/` - Django templates (Vite outputs React build here)
  - `static/` - Static assets

### Frontend Structure (dipole/frontend/)
- React 18 + Vite + Tailwind CSS 4
- `src/pages/` - Page components (calculators, tabulated reference, meme generator)
- `src/calculators/` - Calculator-specific components and equation renderer
- `src/components/` - Shared components
- `src/components/ui/` - UI primitives (built with Headless UI)
- `src/contexts/AuthContext.jsx` - User authentication state provider

### Key Integration Points
- Vite builds to `dipole/templates/static/assets/` (configured in vite.config.js)
- Django serves React SPA via `HomeView` catch-all route
- API uses Django Ninja at `/api/` with SymPy for equation solving
- Equations stored as LaTeX (`LaTeX_repr`) and simple SymPy form (`simple_repr`)

### Calculator System
The calculator system uses SymPy to parse LaTeX equations, solve for unknowns symbolically, then evaluate numerically. Key models in `dipole/calculators/models.py`:
- `Variable` - Defines equation variables with symbols and units
- `Equation` - Stores LaTeX and SymPy representations, handles solving
- `Calculator` - Groups equations by category (Gas Laws, Thermodynamics, etc.)

## Environment Variables
Required in `.env`:
- `SECRET_KEY`, `DATABASE_URL`
- `CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Google OAuth)
- `IM_USER`, `IM_PASS` (Imgflip API for meme generator)
- `GPKEY`, `GPHOST` (ChatGPT API for meme text generation)

## Code Style
- Python: Ruff (88 char lines, Django plugin, isort single-line imports)
- Templates: djLint with Django profile
- Frontend: ESLint with React hooks plugin
- ensure we commit often with terse messages