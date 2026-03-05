Deployment_URL: https://lucasfrontend.netlify.app/ 
Frontend_repo: https://github.com/LasyaRavva/lucas_frontend 
Backend_repo: https://github.com/LasyaRavva/lucas_backend

# Lucas Backend

## Project Overview
Backend API for the Lucas Language Learning Platform. Built with Node.js, Express, and Supabase.

## Tech Stack
- Node.js
- Express.js
- Supabase
- dotenv, helmet, morgan, cors

## API Documentation
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get session

## Database Schema
See `/models/*.js` for table documentation. Main tables:
- users (Supabase Auth)
- profiles
- lessons
- progress
- flashcards
- conversations
- milestones
- events
- reminders
- cultural_insights

## Installation
1. Clone this repo
2. Run `npm install`
3. Set up `.env` with your Supabase keys
4. Run `npm run dev`

## Deployment
- Deploy on Render

## License
MIT
