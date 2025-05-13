# Industro

**Industro** — это веб-приложение для взаимодействия заказчиков и исполнителей инженерных услуг. Система включает серверную и клиентскую части, реализованные на базе Django, Django REST Framework и React.

---

## 🚀 Быстрый старт

### 📦 Клонирование репозитория

Склонируй проект на своё устройство с помощью Git:

```bash
git clone https://github.com/33322111/industro
```

---

## 🛠️ Настройка базы данных (PostgreSQL)

Открой `psql` или используй pgAdmin, затем последовательно выполни следующие команды:

```sql
CREATE USER admin WITH PASSWORD 'admin';
CREATE DATABASE industro_db OWNER admin;
GRANT ALL PRIVILEGES ON DATABASE industro_db TO admin;
```

> ✅ Либо сделай то же самое вручную через **pgAdmin**, используя те же имена:  
> - пользователь: `admin`  
> - база данных: `industro_db`  
> - пароль: `admin`

---

## ⚙️ Запуск Backend (Django)

1. Установи зависимости:

```bash
pip install -r requirements.txt
```

2. Перейди в директорию `backend`:

```bash
cd backend
```

3. Примени миграции базы данных:

```bash
python3 manage.py migrate
```

4. Запусти сервер через **ASGI** с помощью Daphne:

```bash
daphne -b 127.0.0.1 -p 8000 core.asgi:application
```

🔗 **API будет доступен по адресу:**  
[http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🌐 Запуск Frontend (React + Vite)

1. Открой второе окно терминала и перейди в директорию `frontend`:

```bash
cd frontend
```

2. Установи зависимости:

```bash
npm install
```

3. Запусти приложение:

```bash
npm run dev
```

🔗 **Клиентская часть будет доступна по адресу:**  
[http://localhost:5173](http://localhost:5173)

---

## 📌 Стек технологий

- Python 3.11+
- Django 5.x
- Django REST Framework 3.15+
- PostgreSQL 16.x
- React 18
- Vite
- Tailwind CSS
- ASGI + Daphne

---

## 📬 Контакты

📧 Обратная связь: [industroo@yandex.ru](mailto:industroo@yandex.ru)

---

## 📝 Лицензия

Проект распространяется на условиях открытой лицензии. Все права защищены.
