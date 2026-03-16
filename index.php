<?php
require_once __DIR__ . "/data.php";
$page_title = "Страница ФИО";
require_once __DIR__ . "/includes/header.php";
?>

<section class="card fade-in">
  <h1>Страница ФИО</h1>

  <div class="profile">
    <img class="profile__photo" src="<?= h($student["photo"]) ?>" alt="Фото студента" />
    <div class="profile__info">
      <div class="profile__name"><?= h($student["full_name"]) ?></div>
      <div class="profile__meta">
        <span class="badge">Дата рождения: <?= h($student["birth_date"]) ?></span>
      </div>
      <p class="profile__bio"><?= h($student["short_bio"]) ?></p>

      <div class="actions">
        <a class="btn" href="hobbies.php">Перейти к ХОББИ</a>
        <a class="btn btn--secondary" href="projects.php">Перейти к ПРОЕКТАМ</a>
      </div>
    </div>
  </div>
</section>

<section class="card fade-in" style="animation-delay:.05s">
  <h2>Учебные достижения (таблица — для Лабы 2)</h2>

  <div class="table-wrap">
    <table class="table">
      <thead>
        <tr>
          <th>Год</th>
          <th>Достижение</th>
          <th>Детали</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($student["achievements"] as $row): ?>
          <tr>
            <td><?= h($row["year"]) ?></td>
            <td><?= h($row["title"]) ?></td>
            <td><?= h($row["details"]) ?></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</section>

<?php require_once __DIR__ . "/includes/footer.php"; ?>
