import assert from "node:assert/strict";
import test from "node:test";

import { classifyTask } from "./ai-task-router.mjs";

test("routes a small style change to the local model", () => {
  assert.equal(classifyTask("Добавь отступ 12px у кнопки").level, "LOW");
});

test("routes payment work to the premium model", () => {
  assert.equal(classifyTask("Исправь интеграцию оплаты YooKassa").level, "HIGH");
});

test("routes an unclear task to premium by default", () => {
  assert.equal(classifyTask("Сделай сайт лучше").level, "HIGH");
});

test("routes an empty task to premium by default", () => {
  assert.equal(classifyTask("").level, "HIGH");
});
