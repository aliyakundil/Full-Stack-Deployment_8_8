Fullstack TODO приложение (Docker + Swarm)

Это полнофункциональное TODO-приложение, построенное на стекe:

Frontend: React
Backend: Node.js (Express)
База данных: MongoDB
Кэш: Redis
Reverse proxy: Nginx
Деплой: Docker Compose / Docker Swarm

Запуск проекта
1. Клонировать репозиторий
git clone https://github.com/your-repo/fullstack-todo.git
cd fullstack-todo
2. Собрать Docker-образы
docker build -t fullstack-backend:latest ./backend
docker build -t fullstack-frontend:latest ./frontend
3. Инициализировать Swarm (если не сделано)
docker swarm init
4. Развернуть приложение
docker stack deploy -c docker-compose.yml todo-stack
5. Масштабирование backend (опционально)
docker service scale todo-stack_backend=3


Доступ к приложению

Frontend:

http://localhost

API:

http://localhost/api

Health check:

http://localhost/health


Мониторинг (опционально)

Если включено:

ENABLE_METRICS=true

Метрики:

http://localhost/api/metrics
Остановка проекта
docker stack rm todo-stack
docker swarm leave --force

Итог

Этот проект демонстрирует:

Микросервисную архитектуру
Оркестрацию контейнеров (Docker Swarm)
Reverse proxy (Nginx)
Кэширование (Redis)
Базу данных (MongoDB)
Production-подход к деплою
