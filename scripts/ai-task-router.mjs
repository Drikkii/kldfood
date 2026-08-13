import { pathToFileURL } from "node:url";

const highRiskPatterns = [
  /архитектур|architecture/i,
  /рефактор|refactor/i,
  /оплат|плат[её]ж|yookassa|checkout|payment/i,
  /r[ -]?keeper/i,
  /баз[ауы] данных|database|schema|migration|sql/i,
  /авторизац|аутентификац|auth|security|безопасност/i,
  /депло|production|deploy|ci\/cd/i,
  /api[- ]?интеграц|webhook|интеграц/i,
  /производительност|performance|memory leak/i,
  /несколько (?:модул|сервис)|across (?:the )?(?:app|repo|services)/i,
  /breaking change|изменить контракт|контракт api/i,
];

const lowRiskPatterns = [
  /текст|опечатк|copy|typo|wording/i,
  /цвет|отступ|размер|шрифт|иконк|css|style|margin|padding/i,
  /переимен|rename/i,
  /документ|readme|comment/i,
  /один файл|single file/i,
  /добав(?:ь|ить) тест|add (?:a )?test/i,
];

export function classifyTask(task) {
  const normalized = task.trim();
  if (!normalized) {
    return {
      level: "HIGH",
      reason: "Пустая или неясная задача: сначала уточните ожидаемый результат.",
    };
  }

  const highMatch = highRiskPatterns.find((pattern) => pattern.test(normalized));
  if (highMatch) {
    return {
      level: "HIGH",
      reason: "Задача затрагивает сложную или рискованную область проекта.",
    };
  }

  const lowMatch = lowRiskPatterns.find((pattern) => pattern.test(normalized));
  if (lowMatch && normalized.length <= 240) {
    return {
      level: "LOW",
      reason: "Локальная, обратимая и хорошо ограниченная рутинная правка.",
    };
  }

  return {
    level: "HIGH",
    reason: "Задача не распознана как безопасная рутина; выбран premium-путь по умолчанию.",
  };
}

function printRoute(task, result) {
  console.log(`Маршрут: ${result.level}`);
  console.log(`Причина: ${result.reason}`);
  if (result.level === "LOW") {
    console.log("Откройте Continue в Cursor и выберите Local Qwen Coder 7B.");
    console.log("Рекомендуемый режим: Edit для точечной правки, Agent — только с подтверждением команд.");
  } else {
    console.log("Используйте Cursor premium Agent: сначала план, затем реализация и npm run check.");
  }
  console.log(`Задача: ${task}`);
}

const isDirectRun = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const task = process.argv.slice(2).join(" ").trim();
  printRoute(task, classifyTask(task));
}
