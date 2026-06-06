<?php
// includes/header.php
if (!isset($page_title)) $page_title = "Лабораторная работа №1";
?>
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><?= h($page_title) ?></title>
  <link rel="stylesheet" href="assets/css/style.css" />
</head>
<body>
  <div class='wrapper'>
    <header class="site-header">
      <div class="container header-row">
        <div class="brand">
          <div class="brand__title">Лабораторная работа №1</div>
          <div class="brand__subtitle">Автобиография • Хобби • Проекты</div>
        </div>

        <nav class="nav">
          <a class="nav__link" href="index.php">ФИО</a>
          <a class="nav__link" href="hobbies.php">ХОББИ</a>
          <a class="nav__link" href="projects.php">ПРОЕКТЫ</a>
        </nav>
      </div>
    </header>

    <main class="container main">
