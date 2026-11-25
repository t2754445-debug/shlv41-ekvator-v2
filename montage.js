"use strict";

// Cue positions are relative to the recorded line, so replay and seeking use the same cut.
const shotPlans = {
  0: [[0,"wide"],[.19,"insert","Добрый вечер, Школа личного влияния!","В эфире","headline"],[.70,"pixel"]],
  1: [[0,"paper"],[.20,"insert","4 из 8","Занятия","meter"],[.72,"react-pixel"]],
  2: [[0,"pixel"],[.55,"wide"]],
  r5: [[0,"pixel"],[.32,"insert","Алексей Майоров","Капитан на 13 ноября","portrait","Алексей Майоров"],[.62,"insert","Роман Васильев","Заместитель на 13 ноября","portrait","Роман Васильев"]],
  r6: [[0,"paper"],[.37,"insert","Два капитана","Решение от 19 ноября","ticket"],[.73,"react-pixel"]],
  12: [[0,"pixel"],[.18,"romashka"],[.57,"romashka-close"]],
  r14: [[0,"pixel"],[.24,"insert","Севиль Яхьяева","Предложила примерять архетипы","portrait","Севиль Яхьяева"],[.72,"insert","Сколько архетипов?","Вопрос из чата","ticket"]],
  r16: [[0,"paper"],[.25,"insert","Вентиляторы","Так шутят в своей ветке","fan"],[.69,"paper"]],
  r17: [[0,"pixel"],[.28,"insert","Влияторы","Две собаки на прогулке","paws"],[.72,"insert","Энергия влияния","Уборка берега в Комарово","route"]],
  r18: [[0,"paper"],[.14,"insert","Вершители","Готовят поездку в пансионат","route"],[.51,"insert","Империя влияния","Ночлежка · конюшня","route"],[.85,"insert","50 м","Шланг из списка для конюшни","ticket"]],
  r23: [[0,"paper"],[.46,"insert","Мастермайнд","Империя выиграла по гостям","seal"],[.81,"insert","21","Реакция на объявление","counter"]],
  r24: [[0,"insert","Дмитрий Эснер","Руководитель школы","portrait","Дмитрий Эснер"],[.43,"insert","Глубинный раппорт","Открытый урок 18 ноября","audience"],[.77,"pixel"]],
  r28: [[0,"paper"],[.44,"insert","За дверью","Первый гость","door"],[.79,"mic"]],
  29: [[0,"wide"],[.34,"insert","Золотая Люсиль","Десять конвертов","seal"]],
  30: [[0,"paper"],[.5,"insert","Открыть конверт","Раздел ниже","seal"]],
  r41: [[0,"pixel"],[.46,"insert","Никита Васильев","Гитара на выпускном","portrait","Никита Васильев"],[.72,"insert","Ольга Полянская","Футболки для награждения","portrait","Ольга Полянская"]],
  r15: [[0,"paper"],[.05,"insert","8","Архетипов на курсе","counter"],[.35,"insert","Екатерина Красавина","Образ хорошей девочки","portrait","Екатерина Красавина"],[.72,"paper"]],
  r42: [[0,"paper"],[.19,"insert","Юлия Шкурко","Костюм Бабы-яги","portrait","Юлия Шкурко"],[.62,"react-pixel"]],
  r43: [[0,"wide"],[.56,"insert","До встречи!","Вторая половина впереди","ticket"]],
  44: [[0,"romashka-close"],[.48,"romashka"]],
  45: [[0,"romashka"],[.55,"romashka-close"]],
  46: [[0,"romashka-close"],[.49,"romashka"]],
  47: [[0,"romashka"],[.52,"romashka-close"]],
};

const plateEffects = {
  headline: "chime", portrait: "click", ticket: "ticket", fan: "fan", paws: "click",
  route: "flip", seal: "seal", meter: "drum", counter: "drum", audience: "chime", door: "knock",
};

let directedLine = -1;
let directedCut = -1;
function directMoment(index, fraction) {
  const [role, , track] = dialogue[index];
  const cuts = shotPlans[track] || [[0, role]];
  let cutIndex = cuts.findLastIndex(([start]) => fraction >= start);
  if (cutIndex < 0) cutIndex = 0;
  if (directedLine === index && directedCut === cutIndex) return;
  directedLine = index;
  directedCut = cutIndex;
  const [, shot, title, label, shape, asset] = cuts[cutIndex];
  stage.dataset.shot = shot;
  stage.dataset.take = String((index + cutIndex) % 3);
  const cue = $("stage-plate");
  const exercise = shot === "romashka" || shot === "romashka-close";
  $("romashka-cartoon").hidden = !exercise;
  cue.hidden = shot !== "insert";
  if (cue.hidden) return;
  cue.dataset.art = shape;
  const insert = node("div", "", "plate-insert");
  if (shape === "portrait") {
    const person = portrait(asset);
    if (person) insert.append(person);
  } else if (shape !== "meter" && shape !== "headline") {
    insert.append(node("i", "", "prop-art"));
  }
  insert.append(node("strong", title), node("small", label));
  if (shape === "meter") {
    const meter = node("div", "", "show-meter");
    meter.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 8; i++) {
      const segment = node("i", "", i < 4 ? "filled" : "");
      segment.style.setProperty("--step", i);
      meter.append(segment);
    }
    insert.append(meter);
  }
  cue.replaceChildren(insert);
  triggerAnimation(cue);
  playEffect(plateEffects[shape]);
}
