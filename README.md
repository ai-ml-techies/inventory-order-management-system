## Running with Docker Compose

```bash
docker compose up --build
```

Services:

* Frontend: http://localhost:5173
* Backend: http://localhost:8000
* Swagger: http://localhost:8000/docs
* PostgreSQL: localhost:5432

## Backend Docker Image

Docker Hub:

https://hub.docker.com/r/amritainventory1/inventory-backend

Run manually:

```bash
docker run \
-e DATABASE_URL=postgresql://localhost:5432/inventorydb\
-p 8000:8000 \
amritainventory1/inventory-backend:latest
```
