# syntax=docker/dockerfile:1

FROM python:3.13-slim

# отключаем буферизацию вывода и .pyc
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# системные зависимости (дополните/удалите по необходимости)
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
       build-essential \
       curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ставим утилиту uv и только потом sync зависимостей
COPY pyproject.toml uv.lock* ./
RUN pip install --no-cache-dir uv \
 && uv sync --frozen

# теперь копируем весь код
COPY . .

# создаём непривилегированного пользователя и даём ему права на /app
RUN adduser --disabled-password --gecos "" app \
 && chown -R app:app /app
USER app

# переключаемся в папку с вашим приложением
WORKDIR /app/src

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
