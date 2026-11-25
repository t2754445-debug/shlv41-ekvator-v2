"use strict";

const $ = (id) => document.getElementById(id);
const node = (tag, text, className) => {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
};
const hall = [
  ["Севиль Яхьяева", "Архетипы на занятиях", "Предложила приходить на уроки в разных образах. Для «Дитя» собрала подборку пастельных вещей.", 1491, 6057],
  ["Екатерина Красавина", "Влияторы", "Примерила образ хорошей девочки и рассказала, как знакомые начали делать ей комплименты.", 1491, 9397],
  ["Алексей Майоров", "Энергия влияния", "После объявления 19 ноября у команды два равноправных капитана: Алексей и Роман Васильев.", 1492, 15190],
  ["Роман Васильев", "Энергия влияния", "Сначала стал заместителем. Через шесть дней его назвали вторым капитаном.", 1492, 12184],
  ["Анна Кучеренок", "Вершители", "К упражнению на архетипы нашла красную шубу и сапоги. В чат написала: «Трикстер в чатике».", 1493, 8141],
  ["Елена Сипайло", "Империя влияния", "Объявила, что команда выиграла мастермайнд с Дмитрием за гостей открытого урока.", 1490, 14884],
  ["Мария Мазко", "Влияторы", "Написала из приюта, что команда уже погуляла с двумя собаками.", 1491, 16983],
  ["Юлия Шкурко", "Вершители", "Предложила поздравить всех на выпускном в костюме Бабы-яги.", 16091, 17505],
];
const curators = [
  ["Дмитрий Эснер", "Руководитель школы"], ["Яна Савина", "Куратор"],
  ["Елена Сипайло", "Куратор"], ["Евгений Сипайло", "Куратор"],
  ["Михаил Охотников", "Куратор"], ["Екатерина Матвеева", "Куратор"],
];
const teams = [
  ["Империя влияния", "imperia", [16,13,10]],
  ["Влияторы", "vliyatory", [18,16,12]],
  ["Энергия влияния", "energia", [15,15,14]],
  ["Вершители", "vershiteli", [13,13,11]],
];
const teamStories = {
  imperia: {
    activity: [1897, 1273],
    notes: [
      ["Гости открытого урока", "Елена Сипайло объявила победу: «Империя» пригласила больше всего гостей и выиграла мастермайнд с Дмитрием Эснером. Дату встречи команда выбрала голосованием."],
      ["Два выезда", "Юрий Столбовский и Ирина договорились разделить поездки: в субботу в «Ночлежку», в воскресенье в конюшню. Наталья Аржавитина вместе со Светланой Николаевной собрала список необходимого для лошадей."],
      ["Домашка для Дмитрия", "Ко дню рождения Дмитрия команда отправила мультпоздравление и сама задала ему домашнее задание."],
      ["Бейджи для всех", "Ирина Макогон предложила распечатать и заламинировать карточки. Потом они с Еленой Ковалёвой занялись бейджами, чтобы у каждого был свой."],
      ["Как одеться на занятие", "Регина Ширеева предложила выбрать цвет или архетип. Елена Сипайло подхватила идею и предложила примерить образы Дитя или Воина."],
    ],
  },
  vliyatory: {
    activity: [3956, 3708],
    notes: [
      ["Архетипы в жизни", "Севиль Яхьяева предложила приходить на занятия в образах разных архетипов. Екатерина Красавина попробовала образ хорошей девочки и рассказала, что комплименты сделали даже те, кто обычно стеснялся заговорить."],
      ["Два хвостика", "Севиль согласовала визит с приютом. 22 ноября Мария Мазко написала, что успели погулять с двумя собаками."],
      ["Откуда взялись «Вентиляторы»", "Слово мелькнуло в чате при обсуждении встречи. К 19 ноября прозвище стало своим: Евгения Лаптева подхватила шутку в сообщении про коворкинг."],
      ["Стилист подключился к разбору", "Севиль объяснила, как стилист учитывает архетипы и характер клиента, когда подбирает одежду. В ветке сравнивали разные способы описывать один образ."],
      ["Дмитрий и движущиеся предметы", "После занятия Екатерина Красавина рассказала сон: Дмитрий стоял в центре большого зала и объяснял что-то группе, а вокруг него ездили предметы."],
    ],
  },
  energia: {
    activity: [1964, 1559],
    notes: [
      ["Два капитана", "13 ноября капитаном стал Алексей Майоров, заместителем назначили Романа Васильева. 19 ноября куратор объявила второе решение: теперь они оба равноправные капитаны."],
      ["Из Беговой в Комарово", "Ольга Олифир расписала сбор у метро и распределение по машинам. Утром 22 ноября Екатерина Ракова уточнила место встречи: берег в Комарово у «Дельмара»."],
      ["Повод встретиться", "Кураторы позвали команду на кофе 14 ноября. В переписке обсуждали и возможную экскурсию к Александру в его «красную комнату»."],
      ["Зелёный на занятии", "Роман Васильев закрыл голосование и объявил результат: на следующее занятие команда идёт в зелёном. Перед встречей ещё раз напомнил про цвет одежды."],
      ["Раппорт после встречи", "Екатерина Ракова написала, что после встречи у неё осталось тёплое ощущение. Так она и описала раппорт в командном чате."],
    ],
  },
  vershiteli: {
    activity: [2842, 1219],
    notes: [
      ["В гости в пансионат", "Юлия Шкурко созвонилась с координатором. Команда обсуждала песни, гитару и гостинцы к чаю. На экваторе дату визита ещё согласовывали."],
      ["Трикстер в чатике", "Анна Кучеренок примерила роль трикстера по-своему: купила красную шубу и красные сапоги и рассказала об этом команде."],
      ["Выпускной готовят вместе", "Никита Васильев предложил взять гитару. Юлия Шкурко придумала поздравить всех в костюме Бабы-яги."],
      ["Места перед началом", "Юлия Шкурко предложила прийти на 10–15 минут раньше и занять места вместе, чтобы команда была заметна на занятии."],
      ["Способности для программы", "Ирина Сергеева позвала команду в новую ветку «Выпускной» и предложила каждому написать, с каким номером или умением он готов выступить."],
    ],
  },
};
const awardPortraits = ["Анна Кучеренок","Екатерина Ракова","Владимир Хачатуров","Елена Сипайло","Ирина Сергеева","Эллина Шевчук","Елена Ковалева","Регина Ширеева","Арина Каменская","Роман Васильев"];

function portrait(name, eager = false) {
  const mapping = window.portraitPaths?.[name];
  if (!mapping) return null;
  const frame = node("span", "", "pixel-art");
  const image = node("img");
  image.alt = "";
  image.loading = eager ? "eager" : "lazy";
  image.addEventListener("load", () => frame.setAttribute("data-ready", "true"), {once:true});
  image.src = mapping;
  frame.append(image);
  return frame;
}

function openPortrait(name) {
  const image = portrait(name, true);
  if (!image) return;
  image.setAttribute("role", "img");
  image.setAttribute("aria-label", "Пиксельный портрет: " + name);
  $("portrait-name").textContent = name;
  $("portrait-preview").replaceChildren(image);
  $("portrait-dialog").showModal();
  playEffect("flip");
}

function portraitButton(name) {
  const image = portrait(name);
  if (!image) return null;
  const button = node("button", "", "portrait-open");
  button.type = "button";
  button.setAttribute("aria-label", "Открыть портрет: " + name);
  button.append(image);
  button.onclick = () => openPortrait(name);
  return button;
}
$("close-portrait").onclick = () => $("portrait-dialog").close();

let audioContext;
let soundEnabled = true;
const music = new Audio("assets/music-bed.mp3");
music.loop = true;
music.volume = .24;
function playEffect(effect) {
  if (!soundEnabled || !window.AudioContext) return;
  audioContext ||= new AudioContext();
  if (audioContext.state !== "running") audioContext.resume().catch(() => {});
  const now = audioContext.currentTime;
  const tone = (start, from, to, volume, duration, type) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, start);
    oscillator.frequency.exponentialRampToValueAtTime(to, start + duration);
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + .02);
  };
  if (effect === "fanfare") {
    [262, 330, 392, 523].forEach((frequency, index) =>
      tone(now + index * .068, frequency, frequency * 1.01, .035, .14, "triangle")
    );
  } else if (effect === "drum") {
    tone(now, 160, 57, .033, .19, "sine");
    tone(now + .06, 270, 94, .013, .10, "triangle");
  } else if (effect === "fan") {
    tone(now, 200, 490, .015, .24, "triangle");
    tone(now + .08, 460, 175, .012, .21, "sine");
  } else if (effect === "click") {
    tone(now, 1000, 430, .019, .035, "triangle");
    tone(now + .042, 650, 380, .012, .055, "sine");
  } else if (effect === "ticket") {
    tone(now, 520, 290, .011, .12, "triangle");
    tone(now + .11, 340, 690, .012, .09, "sine");
  } else if (effect === "chime") {
    tone(now, 659, 655, .014, .17, "sine");
    tone(now + .075, 880, 875, .011, .20, "sine");
  } else if (effect === "knock") {
    tone(now, 210, 81, .023, .09, "triangle");
    tone(now + .095, 200, 69, .017, .11, "triangle");
  } else if (effect === "seal") {
    tone(now + .23, 218, 68, .032, .12, "triangle");
    tone(now + .31, 520, 680, .017, .17, "sine");
  } else {
    tone(now, 370, 110, .018, .10, "triangle");
  }
}

$("site-sound").onclick = () => {
  soundEnabled = !soundEnabled;
  $("site-sound").setAttribute("aria-pressed", soundEnabled);
  music.muted = !soundEnabled;
  if (soundEnabled) playEffect("flip");
};

function flipCard(front, back, container, label, effect, {openPortraitName, onFlip} = {}) {
  const card = node("article", "", "flip");
  const toggle = node("button", "", "flip-toggle");
  toggle.type = "button";
  toggle.setAttribute("aria-label", label);
  toggle.setAttribute("aria-expanded", "false");
  const inner = node("span", "", "flip-inner");
  front.className = "face front";
  back.className = "face back";
  back.setAttribute("aria-hidden", "true");
  inner.append(front, back);
  toggle.append(inner);
  card.append(toggle);
  toggle.onclick = () => {
    if (openPortraitName && card.classList.contains("is-flipped")) {
      openPortrait(openPortraitName);
      return;
    }
    const opened = card.classList.toggle("is-flipped");
    toggle.setAttribute("aria-expanded", opened);
    front.setAttribute("aria-hidden", opened);
    back.setAttribute("aria-hidden", !opened);
    if (openPortraitName && opened) {
      toggle.setAttribute("aria-label", "Увеличить портрет: " + openPortraitName);
      toggle.setAttribute("aria-haspopup", "dialog");
    }
    playEffect(opened ? effect : "flip");
    onFlip?.(opened);
  };
  container.append(card);
}

for (const [name, detail, fact] of hall) {
  const front = node("span");
  const back = node("span");
  const image = portrait(name);
  if (image) front.append(image);
  front.append(node("strong", name), node("small", detail));
  back.append(node("strong", name), node("span", fact));
  flipCard(front, back, $("hall-cards"), name, "flip");
}

for (const [name, role] of (window.schoolStaff.length ? window.schoolStaff : curators)) {
  const front = node("span");
  const back = node("span");
  const image = portrait(name);
  front.append(node("i", "✦", "pass-star"), node("small", role), node("strong", name));
  if (image) back.append(image);
  back.append(node("strong", name), node("small", role));
  flipCard(front, back, $("curator-cards"), name + ", " + role, "seal", {openPortraitName: image ? name : undefined});
}

for (const [id, people] of [
  ["lobby-portraits", ["Севиль Яхьяева", "Роман Васильев"]],
  ["lucille-audience", ["Екатерина Красавина", "Елена Сипайло", "Мария Мазко", "Юлия Шкурко"]],
]) {
  for (const name of people) {
    const person = portrait(name);
    if (person) $(id).append(person);
  }
}

const tabButtons = teams.map(([name, , counts], index) => {
  const row = node("tr");
  const heading = node("th", name);
  heading.scope = "row";
  row.append(heading, ...counts.map(n => node("td", String(n))));
  $("standings").append(row);
  $("team-filter").add(new Option(name, name));
  const tab = node("button", name);
  tab.type = "button";
  tab.setAttribute("aria-controls", "team-panel");
  tab.onclick = () => showTeam(index, true);
  $("team-tabs").append(tab);
  return tab;
});
const total = node("tr");
const totalLabel = node("th", "Всего");
totalLabel.scope = "row";
total.append(totalLabel, ...[62,57,47].map(n => node("td", String(n))));
$("standings").append(total);

function showTeam(index, touch) {
  for (const [i, tab] of tabButtons.entries()) tab.setAttribute("aria-pressed", i === index);
  const [name, key, counts] = teams[index];
  const {activity, notes} = teamStories[key];
  const card = node("article", "", "team-frame");
  const image = node("img");
  image.src = "assets/" + key + ".jpg";
  image.alt = "";
  const content = node("div", "", "text");
  const metrics = node("div", "", "team-metrics");
  for (const [value, label] of [[counts[0] + " → " + counts[2], "в списках"], [activity[0].toLocaleString("ru-RU"), "сообщений"], [activity[1].toLocaleString("ru-RU"), "реакций"]]) {
    const metric = node("div");
    metric.append(node("strong", value), node("small", label));
    metrics.append(metric);
  }
  content.append(node("h3", name), node("p", "Переписка команды с 28 октября по 23 ноября"), metrics);
  card.append(image, content);
  const stories = node("div", "", "team-stories");
  for (const [title, text] of notes) {
    const item = node("section", "", "team-note");
    item.append(node("h4", title), node("p", text));
    stories.append(item);
  }
  const feature = node("div", "", "team-feature");
  feature.append(card, stories);
  const rosterNames = window.currentRoster[name] || [];
  const lineup = node("div", "", "team-lineup");
  if (rosterNames.length) {
    lineup.append(node("h4", "Состав команды · " + rosterNames.length));
    const rosterGrid = node("ul", "", "lineup-grid");
    for (const person of rosterNames) {
      const item = node("li");
      const button = portraitButton(person);
      if (button) item.append(button);
      item.append(node("span", person));
      rosterGrid.append(item);
    }
    lineup.append(rosterGrid);
  }
  $("team-panel").replaceChildren(feature, lineup);
  if (touch) playEffect("flip");
}
showTeam(0, false);

const dialog = $("player");
const stage = $("player-stage");
const actors = stage.querySelector(".stage-visual");
const wipe = stage.querySelector(".stage-wipe");
const film = $("film-video");
const voice = new Audio();
const awardVoice = new Audio();
const names = {pixel:"Пиксельный", paper:"Бумажный", ellina:"Эллина", vladimir:"Владимир"};
const chapters = programme.chapters;
const flowerTakes = typeof flowerDialogue !== "undefined" ? flowerDialogue : [];
const flowerTrackStart = 44;
const dialogue = [...programme.dialogue, ...flowerTakes.map(([speaker, text], offset) => [speaker, text, flowerTrackStart + offset])];
const speechMotion = dialogue.map(([, , track]) => typeof track === "string" ? revisionCues[track] :
  track >= flowerTrackStart ? flowerMotion[track - flowerTrackStart] : waveCues[track]);
const sequences = chapters.map(chapter => chapter.film ? [] :
  Array.from({length:chapter.to-chapter.from+1}, (_,offset) => chapter.from+offset)
);
if (flowerTakes.length) sequences[2].splice(1,0,...flowerTakes.map((_,i)=>programme.dialogue.length+i));

let chapterIndex = 0;
let lineIndex = 0;
let direct = false;
let isDone = false;
let timer;
let activeCaptions = [];

const chapterButtons = chapters.map(({title}, index) => {
  const button = node("button");
  button.type = "button";
  button.title = title;
  button.setAttribute("aria-label", title);
  button.onclick = () => showChapter(index);
  $("chapter-track").append(button);
  return button;
});

for (const [index, award] of programme.awards.entries()) {
  const front = node("span");
  const back = node("span");
  front.append(node("i", "✦", "seal"), node("strong", award.name));
  const image = portrait(award.winner) || portrait(awardPortraits[index]);
  if (image) back.append(image);
  back.append(node("strong", award.winner), node("small", award.text));
  flipCard(front, back, $("award-cards"), award.name, "seal", {onFlip(opened) {
    if (!opened) {
      if (awardVoice.dataset.line === String(award.voice)) awardVoice.pause();
      return;
    }
    awardVoice.dataset.line = award.voice;
    awardVoice.src = "assets/voice/" + dialogue[award.voice][2] + ".mp3";
    awardVoice.play().catch(() => {});
  }});
}

function triggerAnimation(element) {
  element.classList.remove("in");
  void element.offsetWidth;
  element.classList.add("in");
}

function captions(text) {
  const words = text.split(/\s+/);
  const output = [];
  let line = [];
  let start = 0;
  for (const [index, word] of words.entries()) {
    line.push(word);
    if (line.length >= 6 || (line.length >= 3 && /[.?!]$/.test(word)) || index === words.length - 1) {
      output.push([start / words.length, line.join(" ")]);
      start = index + 1;
      line = [];
    }
  }
  return output;
}

function updateCaptions() {
  const fraction = voice.currentTime / voice.duration || 0;
  const mark = activeCaptions.findLast(([at]) => fraction >= at);
  if (mark) $("subtitles").textContent = mark[1];
}
voice.addEventListener("timeupdate", updateCaptions);
voice.addEventListener("play", () => {
  $("pause").textContent = "Пауза";
  dialog.classList.remove("broadcast-paused");
  if (soundEnabled) music.play().catch(() => {});
});
voice.addEventListener("pause", () => {
  music.pause();
  if (!isDone) $("pause").textContent = "Продолжить";
});
film.addEventListener("play", () => { $("pause").textContent = "Пауза"; });
film.addEventListener("pause", () => { if (!isDone) $("pause").textContent = "Продолжить"; });
film.addEventListener("ended", advance);

function speak(index) {
  lineIndex = index;
  const [speaker, text, track] = dialogue[index];
  actors.dataset.speaker = speaker;
  directMoment(index, 0);
  activeCaptions = captions(text);
  updateCaptions();
  $("subtitles").setAttribute("aria-label", names[speaker] + ". " + text);
  voice.src = "assets/voice/" + track + ".mp3";
  voice.play().catch(() => { $("pause").textContent = "Продолжить"; });
}

voice.onended = () => {
  timer = setTimeout(() => {
    if (!dialog.open) return;
    const sequence = sequences[chapterIndex];
    const next = sequence[sequence.indexOf(lineIndex)+1];
    if (next !== undefined) speak(next);
    else advance();
  }, 135);
};

function showChapter(index) {
  if (!chapters[index]) return;
  clearTimeout(timer);
  stage.querySelector(".stage-curtain").classList.remove("in");
  voice.pause();
  film.pause();
  isDone = false;
  $("subtitles").removeAttribute("aria-label");
  chapterIndex = index;
  const chapter = chapters[index];
  $("chapter-name").textContent = chapter.title;
  $("previous").disabled = index === 0;
  for (const [i, button] of chapterButtons.entries()) button.setAttribute("aria-current", i === index);
  dialog.classList.remove("opening", "broadcast-paused");
  stage.style.setProperty("--scene", chapter.color);
  const band = (" ★ " + chapter.label + " ★ ЭКВАТОР ВЛИЯНИЯ").repeat(8);
  for (const ribbon of stage.querySelectorAll(".broadcast-band span")) ribbon.textContent = band;
  wipe.textContent = chapter.label;
  actors.hidden = Boolean(chapter.film);
  film.hidden = !chapter.film;
  if (chapter.film) {
    movieFromStart();
  } else {
    if (index > 0) triggerAnimation(wipe);
    speak(chapter.from);
  }
}

function movieFromStart() {
  if (film.readyState || film.currentTime) film.currentTime = 0;
  $("subtitles").textContent = "";
  film.play().catch(() => { $("pause").textContent = "Продолжить"; });
}

function finish() {
  isDone = true;
  voice.pause();
  music.pause();
  film.pause();
  $("pause").textContent = "Сначала";
  $("subtitles").textContent = direct ? "Конец мультфильма" : "Встретимся во второй половине";
}

function advance() {
  if (direct && chapterIndex === 5) finish();
  else if (chapterIndex + 1 < chapters.length) showChapter(chapterIndex + 1);
  else finish();
}

function openShow(index) {
  awardVoice.pause();
  direct = index === 5;
  isDone = false;
  dialog.showModal();
  if (direct) {
    showChapter(index);
    return;
  }
  chapterIndex = index;
  $("chapter-name").textContent = chapters[index].title;
  $("subtitles").textContent = "";
  actors.hidden = false;
  film.hidden = true;
  dialog.classList.add("opening");
  triggerAnimation(stage.querySelector(".stage-curtain"));
  const openingLength = motionPreference.matches ? 420 : 1500;
  playEffect("fanfare");
  timer = setTimeout(() => {
    if (dialog.open) showChapter(index);
  }, openingLength);
}
document.querySelectorAll("[data-chapter]").forEach(button => {
  button.onclick = () => openShow(Number(button.dataset.chapter));
});

$("next").onclick = advance;
$("previous").onclick = () => showChapter(chapterIndex - 1);
$("close-player").onclick = () => dialog.close();
dialog.addEventListener("close", () => {
  clearTimeout(timer);
  dialog.classList.remove("opening", "broadcast-paused");
  voice.pause();
  film.pause();
  music.pause();
});
$("pause").onclick = () => {
  if (isDone) {
    showChapter(direct ? 5 : 0);
    return;
  }
  if (dialog.classList.contains("opening")) return;
  const media = chapters[chapterIndex].film ? film : voice;
  if (media.paused) media.play().catch(() => {});
  else {
    media.pause();
    if (media === voice) dialog.classList.add("broadcast-paused");
  }
};

function animateJaw() {
  const level = speechMotion[lineIndex]?.[Math.floor(voice.currentTime * 30)] || 0;
  positionCartoon(level, performance.now());
  document.documentElement.style.setProperty("--voice-motion", String(level / 15));
  if (!voice.paused && voice.duration > 0 && !chapters[chapterIndex].film) directMoment(lineIndex, voice.currentTime / voice.duration);
  if (dialog.open) requestAnimationFrame(animateJaw);
}
new MutationObserver(() => { if (dialog.open) requestAnimationFrame(animateJaw); })
  .observe(dialog, {attributes:true, attributeFilter:["open"]});

const mobileLinks = [...document.querySelectorAll(".mobile-nav a")];
function updateMobileNavigation() {
  const matched = mobileLinks.find(link => link.hash === location.hash) || mobileLinks[0];
  for (const link of mobileLinks) {
    if (link === matched) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}
window.addEventListener("hashchange", updateMobileNavigation);
updateMobileNavigation();

const normalize = (value) => value.trim().toLocaleLowerCase("ru").replaceAll("ё", "е");
let expanded = false;
function renderRanking() {
  const query = normalize($("query").value);
  const team = $("team-filter").value;
  const sort = Number($("sort-by").value);
  const results = episodeData.rank.filter(([name, group]) => normalize(name).includes(query) && (!team || team === group));
  results.sort((a, b) => b[sort] - a[sort] || a[0].localeCompare(b[0], "ru"));
  const shown = expanded ? results : results.slice(0, 12);
  $("rank-body").replaceChildren(...shown.map(([name, group, messages, reactions]) => {
    const row = node("tr");
    const participant = node("td", name);
    participant.append(node("small", group));
    row.append(participant, node("td", String(messages)), node("td", String(reactions)));
    return row;
  }));
  $("rank-count").textContent = results.length ? "Показано " + shown.length + " из " + results.length : "Никого не нашли.";
  $("rank-more").hidden = results.length <= 12;
  $("rank-more").textContent = expanded ? "Свернуть" : "Показать всех";
}
$("query").oninput = renderRanking;
$("team-filter").onchange = renderRanking;
$("sort-by").onchange = renderRanking;
$("rank-more").onclick = () => { expanded = !expanded; renderRanking(); };
renderRanking();


// Обычные сообщения общего форума по московскому времени, 28.10–23.11.
const dailyCounts = [425, 764, 491, 145, 176, 417, 530, 616, 1142, 480, 299, 382, 627, 572, 585, 897, 348, 188, 273, 478, 476, 692, 906, 758, 510, 322, 448];
const peak = Math.max(...dailyCounts);
const dateFormat = new Intl.DateTimeFormat("ru-RU", {day:"2-digit", month:"2-digit", timeZone:"UTC"});
const numberFormat = new Intl.NumberFormat("ru-RU");
const dailyBars = $("daily-bars");
dailyCounts.forEach((count, index) => {
  const date = dateFormat.format(new Date(Date.UTC(2026, 9, 28 + index)));
  const item = node("li", "", count === peak ? "peak" : "");
  item.style.setProperty("--height", (count / peak * 100) + "%");
  item.style.setProperty("--day", index);
  const column = node("div", "", "daily-column");
  column.append(node("strong", numberFormat.format(count)), node("i"));
  item.append(column, node("span", date));
  dailyBars.append(item);
});

const statistics = $("numbers");
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
let numberTimers = [];
function revealStatistics(withSound) {
  numberTimers.forEach(clearTimeout);
  numberTimers = [];
  statistics.classList.remove("numbers-playing");
  void statistics.offsetWidth;
  if (motionPreference.matches) return;
  statistics.classList.add("numbers-playing");
  if (withSound && navigator.userActivation.hasBeenActive) {
    numberTimers = [0, 260, 520, 780, 1040, 1300, 1570].map((delay, index) =>
      setTimeout(() => {
        if (!dialog.open && !document.hidden) playEffect(index % 3 === 0 ? "drum" : "flip");
      }, delay));
  }
}
const statisticsObserver = new IntersectionObserver(entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  statisticsObserver.disconnect();
  revealStatistics(true);
}, {rootMargin:"0px 0px -38% 0px"});
statisticsObserver.observe(statistics);
$("replay-numbers").onclick = () => revealStatistics(true);
