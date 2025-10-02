name: Multi-Tenant SaaS (Express + React + Postgres)

description: |
  A boilerplate SaaS app using Express.js, PostgreSQL, Sequelize, and React (Vite).
  Supports subdomain-based multi-tenancy with JWT auth, role-based access,
  and Docker Compose deployment behind Nginx.

services:
  backend:
    build: ./server
    container_name: api
    restart: always
    env_file:
      - ./server/.env
    ports:
      - "4000:4000"
    depends_on:
      - postgres

  frontend:
    build: ./client
    container_name: frontend
    restart: always
    environment:
      - VITE_API_URL=/api
    depends_on:
      - backend

  postgres:
    image: postgres:15
    container_name: postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: voho_saas
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  nginx:
    image: nginx:latest
    container_name: nginx
    restart: always
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend

volumes:
  pgdata:

instructions: |
  ## Quickstart
  1. Clone the repository
     git clone https://github.com/yourusername/voho-saas.git
     cd voho-saas

  2. Create a `.env` file inside ./server with:
     NODE_ENV=development
     PORT=4000
     DB_HOST=postgres
     DB_PORT=5432
     DB_USER=postgres
     DB_PASSWORD=postgres
     DB_NAME=voho_saas
     JWT_SECRET=supersecret
     BASE_DOMAIN=lvh.me

  3. Run everything
     docker compose up -d --build

  4. Access app
     - http://acme.lvh.me → React frontend
     - http://acme.lvh.me/api/tenants/signup → API

security_notes: |
  - Use strong JWT_SECRET in production.
  - Consider cookies + CSRF instead of localStorage.
  - Add HTTPS termination with Let’s Encrypt in Nginx.

deployment: |
  Options:
  - Vercel → frontend only
  - Render/Railway/Fly.io → full stack with Docker
  - DigitalOcean Droplet → `docker compose up -d`


