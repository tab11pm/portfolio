# Портфолио студента

Небольшой учебный сайт-портфолио на PHP. Проект содержит страницы с краткой информацией о студенте, списком хобби, подробной страницей хобби и разделом проектов.

## Возможности

- главная страница с ФИО, датой рождения, фото и учебными достижениями;
- страница хобби со списком карточек;
- отдельная страница выбранного хобби с полезными ссылками;
- страница проектов с описанием, результатами, планами и прогресс-барами;
- общий header/footer для всех страниц;
- локальные стили и небольшой JavaScript без внешних библиотек.

## Структура проекта

```text
.
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── includes/
│   ├── footer.php
│   └── header.php
├── data.php
├── hobbies.php
├── hobby.php
├── index.php
└── projects.php
```

## Зависимости

Для запуска нужен PHP 7.4+ или PHP 8.x. Composer, Node.js, npm и база данных не требуются.

На текущей машине уже подготовлены портативные версии:

- PHP: `D:\tusur\tools\php-8.5.6\php.exe`
- Nginx: `D:\tusur\tools\nginx-1.30.2\nginx.exe`

## Быстрый запуск через PHP

Из корня репозитория:

```powershell
D:\tusur\tools\php-8.5.6\php.exe -S localhost:8000 -t .
```

После запуска сайт доступен по адресу:

```text
http://localhost:8000/
```

Если установлен системный PHP и он добавлен в `PATH`, можно использовать короткую команду:

```powershell
php -S localhost:8000 -t .
```

## Запуск через Nginx и PHP-CGI

Для запуска через Nginx нужен отдельный процесс PHP-CGI:

```powershell
D:\tusur\tools\php-8.5.6\php-cgi.exe -b 127.0.0.1:9000
```

Пример блока `server` для Nginx:

```nginx
server {
    listen 8080;
    server_name localhost;
    root D:/tusur/веб/лабы/portfolio;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

## Данные сайта

Основные данные хранятся в `data.php`:

- `$student` — информация о студенте и достижениях;
- `$hobbies` — список хобби, описания, картинки и ссылки;
- `$projects` — проекты, результаты, планы и проценты прогресса;
- `h()` — функция безопасного вывода текста через `htmlspecialchars`.

## Изображения

В данных указаны пути к изображениям в `assets/img/`, например:

- `assets/img/student.jpg`
- `assets/img/hobby_photo.jpg`
- `assets/img/hobby_chess.jpg`
- `assets/img/hobby_run.jpg`
- `assets/img/project1.jpg`
- `assets/img/project2.jpg`
- `assets/img/project3.jpg`

Если этих файлов нет, сайт всё равно запустится, но картинки не будут отображаться.

## Проверка

Базовую проверку PHP-файлов можно выполнить так:

```powershell
D:\tusur\tools\php-8.5.6\php.exe -l index.php
D:\tusur\tools\php-8.5.6\php.exe -l hobbies.php
D:\tusur\tools\php-8.5.6\php.exe -l hobby.php
D:\tusur\tools\php-8.5.6\php.exe -l projects.php
D:\tusur\tools\php-8.5.6\php.exe -l data.php
```

Ошибок синтаксиса быть не должно.
