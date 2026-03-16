<?php
require_once __DIR__ . "/data.php";
$page_title = "Страница ПРОЕКТЫ";
require_once __DIR__ . "/includes/header.php";
?>

<section class="card fade-in">
  <h1>Страница ПРОЕКТЫ</h1>
  <p class="muted">Здесь: описание проекта, состояние дел “в мире”, результаты и планы. Есть прогресс-бар с CSS-анимацией (Лаба 3).</p>
</section>

<?php foreach ($projects as $i => $p): ?>
  <section class="card fade-in" style="animation-delay:<?= 0.05 + $i * 0.05 ?>s">
    <div class="project">
      <img class="project__img" src="<?= h($p["image"]) ?>" alt="<?= h($p["title"]) ?>" />

      <div class="project__content">
        <h2><?= h($p["title"]) ?></h2>

        <div class="progress">
          <div class="progress__label">Прогресс: <?= (int)$p["progress"] ?>%</div>
          <div class="progress__bar">
            <div class="progress__fill" style="--w: <?= (int)$p["progress"] ?>%"></div>
          </div>
        </div>

        <h3>Описание</h3>
        <p><?= h($p["description"]) ?></p>

        <h3>Текущее положение дел в мире по проекту</h3>
        <p><?= h($p["world_status"]) ?></p>

        <h3>Достигнутые результаты</h3>
        <ul class="list">
          <?php foreach ($p["results"] as $r): ?>
            <li><?= h($r) ?></li>
          <?php endforeach; ?>
        </ul>

        <h3>Планы развития</h3>
        <ul class="list">
          <?php foreach ($p["plans"] as $pl): ?>
            <li><?= h($pl) ?></li>
          <?php endforeach; ?>
        </ul>

        <h3>Этапы (таблица — для Лабы 2)</h3>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Этап</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Идея и требования</td><td>Готово</td></tr>
              <tr><td>Верстка и стили</td><td>В процессе</td></tr>
              <tr><td>Подключение БД</td><td>Планируется</td></tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </section>
<?php endforeach; ?>

<?php require_once __DIR__ . "/includes/footer.php"; ?>
