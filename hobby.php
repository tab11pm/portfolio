<?php
require_once __DIR__ . "/data.php";

$id = $_GET["id"] ?? "";
if (!isset($hobbies[$id])) {
  header("Location: hobbies.php");
  exit;
}

$hb = $hobbies[$id];
$page_title = "Хобби: " . $hb["title"];
require_once __DIR__ . "/includes/header.php";
?>

<section class="card fade-in">
  <div class="split">
    <div>
      <h1><?= h($hb["title"]) ?></h1>
      <p><?= h($hb["description"]) ?></p>

      <div class="actions">
        <a class="btn btn--secondary" href="hobbies.php">← Назад к списку</a>
      </div>
    </div>

    <div class="media">
      <img class="media__img" src="<?= h($hb["image"]) ?>" alt="<?= h($hb["title"]) ?>">
    </div>
  </div>
</section>

<section class="card fade-in" style="animation-delay:.05s">
  <h2>Ссылки на интересные ресурсы (таблица — для Лабы 2)</h2>

  <div class="table-wrap">
    <table class="table">
      <thead>
        <tr>
          <th>Ресурс</th>
          <th>Тип</th>
          <th>Ссылка</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($hb["resources"] as $r): ?>
          <tr>
            <td><?= h($r["name"]) ?></td>
            <td><?= h($r["type"]) ?></td>
            <td><a class="link" href="<?= h($r["url"]) ?>" target="_blank" rel="noopener">Открыть</a></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</section>

<?php require_once __DIR__ . "/includes/footer.php"; ?>
