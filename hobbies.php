<?php
require_once __DIR__ . "/data.php";
$page_title = "Страница ХОББИ";
require_once __DIR__ . "/includes/header.php";
?>

<section class="card fade-in">
  <h1>Страница ХОББИ</h1>
  <p class="muted">Ниже несколько хобби. Нажми на карточку, чтобы открыть подробную страницу хобби.</p>

  <div class="grid">
    <?php foreach ($hobbies as $id => $hb): ?>
      <a class="hobby-card" href="hobby.php?id=<?= h($id) ?>">
        <img class="hobby-card__img" src="<?= h($hb["image"]) ?>" alt="<?= h($hb["title"]) ?>">
        <div class="hobby-card__body">
          <div class="hobby-card__title"><?= h($hb["title"]) ?></div>
          <div class="hobby-card__text"><?= h($hb["short"]) ?></div>
          <div class="hobby-card__hint">Открыть →</div>
        </div>
      </a>
    <?php endforeach; ?>
  </div>
</section>

<?php require_once __DIR__ . "/includes/footer.php"; ?>
