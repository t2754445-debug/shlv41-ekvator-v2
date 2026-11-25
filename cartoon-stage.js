"use strict";

const drawnStage = $("drawn-stage");
const exerciseCanvas = $("romashka-cartoon");
const drawn = drawnStage.getContext("2d");
const exercise = exerciseCanvas.getContext("2d");
const pixelFace = stage.querySelector(".stage-pixel img");
const paperActor = $("paper-actor").getContext("2d");
const reduceStageMotion = matchMedia("(prefers-reduced-motion: reduce)");
const colors = ["#a62c43","#df7351","#267c8d","#b38b62","#54568f","#60977c"];
const faces = ["#b77b62","#e6b48b","#f2c797","#bc8269","#9a645c"];
const sideLight = ["#eaa76a","#f3a64a","#6ce9d0","#ffc75d","#f59f75","#fea88b","#ffcf6f","#f4a185"];
const daisyWords = ["Карта","Обратная связь","Намерение","Реакция","Гибкость","Изобилие","Ресурсы","Ответственность"];
let lastPaint = 0;
let currentSprite = "";

function block(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x,y,w,h);
}
function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);
  ctx.fill();
}
function path(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.closePath();
  ctx.fill();
}
function label(ctx, text, x, y, color, size, align = "left") {
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.font = "900 " + size + "px Rubik, sans-serif";
  ctx.fillText(text,x,y);
}

function drawAuditorium(seconds) {
  const accent = sideLight[chapterIndex] || "#f5c34f";
  const lighting = drawn.createLinearGradient(0,0,0,510);
  lighting.addColorStop(0, "#2e203f");
  lighting.addColorStop(.7, "#4c263e");
  lighting.addColorStop(1, "#111223");
  block(drawn,0,0,900,510,lighting);
  const audienceCut = (chapterIndex === 1 || (chapterIndex === 4 && stage.dataset.shot === "insert"));
  const arch = audienceCut ? "#9b4656" : "#a4394a";
  drawn.lineWidth = 11;
  drawn.strokeStyle = arch;
  drawn.beginPath();
  drawn.ellipse(450,253,323,202,0,Math.PI,0);
  drawn.stroke();
  drawn.lineWidth = 2;
  drawn.strokeStyle = accent;
  drawn.beginPath();
  drawn.ellipse(450,252,336,214,0,Math.PI,0);
  drawn.stroke();
  for (let slope=0;slope<2;slope++) {
    const angle = Math.sin(seconds * .63 + slope * 1.8) * 77;
    const origin = slope ? 711 : 189;
    drawn.globalAlpha = .12;
    path(drawn,[[origin-18,0],[origin+18,0],[530+angle,435],[338+angle,435]],accent);
    drawn.globalAlpha = 1;
  }
  for (const side of [0,1]) {
    for (let fold=0;fold<6;fold++) {
      const x = side ? 900-fold*19 : fold*19;
      path(drawn,[[x-22,0],[x+20,0],[x*0.95+21,275],[x*0.95-8,301]],fold%2 ? "#6e213b" : "#87314a");
    }
  }
  for (let i=0;i<20;i++) {
    const x=48+i*42;
    ellipse(drawn,x,22,3,3, i%5===Math.floor(seconds*2)%5 ? "#fff0cf" : "#805262");
  }
  block(drawn,0,378,900,132,"#38223a");
  for (let i=0;i<4;i++) {
    drawn.globalAlpha = .19;
    path(drawn,[[0,392+i*36],[900,379+i*36],[900,381+i*36],[0,394+i*36]],"#ffb870");
  }
  drawn.globalAlpha=1;
  if (!audienceCut) return;
  for (let row=0;row<3;row++) {
    for (let i=0;i<13;i++) {
      const x=20+i*70+(row%2)*25;
      const scale=1+row*.20;
      const y=284+row*62+Math.sin(seconds*2.5+i*.68+row*.8)*2.5;
      ellipse(drawn,x,y+20*scale,24*scale,18*scale,"#382234");
      ellipse(drawn,x,y+17*scale,19*scale,18*scale,colors[(i+row*3)%colors.length]);
      ellipse(drawn,x,y-5*scale,11*scale,13*scale,faces[(i+row)%faces.length]);
      path(drawn,[[x-11*scale,y-6],[x-8*scale,y-19],[x+6*scale,y-19],[x+11*scale,y-8]],i%3===0?"#806371":"#281e2b");
      if (chapterIndex===4 && (i+row)%4===0) {
        const swing=Math.sin(seconds*4.4+i)*6;
        path(drawn,[[x+11,y+20],[x+27+swing,y-4],[x+33+swing,y],[x+17,y+25]],faces[(i+row)%faces.length]);
      }
    }
  }
  path(drawn,[[0,503],[900,493],[900,510],[0,510]],"#d18752");
}

function paperPlayer(x, y, kind, talking, look, seconds) {
  exercise.save();
  exercise.translate(x,y+175);
  const drift=Math.sin(seconds*1.7+kind);
  const pose={
    ...LegacyPaper.IDLE, talk:talking, blink:seconds%4.6>=4.4,
    look:[look*.54,-.12], smile:talking ? .32 : .52, tilt:look*.038+drift*.017,
    armL:kind ? .38+talking*.34 : .14+drift*.08,
    armR:kind ? .21 : .43+talking*.50,
    wave:talking*.22, bounce:talking*5, brow:talking*.33,
    sit:true,
  };
  if (kind) LegacyPaper.drawPerson(exercise,258,LegacyPaper.LOOKS.ellina,pose);
  else LegacyPaper.drawHero(exercise,258,pose);
  exercise.restore();
}

function drawDaisyScene(seconds,amplitude,close) {
  const local = Math.max(0,voice.currentTime || 0);
  const shift=Math.cos(seconds*1.3)*4;
  const member = actors.dataset.speaker;
  const rightSpeaks = member === "ellina" || (member !== "vladimir" && local%3>1.27);
  block(exercise,0,0,900,510,"#30213c");
  path(exercise,[[0,0],[280,0],[240,510],[0,510]],"#432643");
  path(exercise,[[900,0],[630,0],[665,510],[900,510]],"#432643");
  for(let i=0;i<9;i++) ellipse(exercise,105+i*86,57,3,3,i%2?"#977f66":"#c69766");
  exercise.save();
  if (close) {exercise.translate(-60, -36);exercise.scale(1.146,1.146);}
  ellipse(exercise,455,370,313,33,"#251c35");
  paperPlayer(237+shift,239,0,rightSpeaks?0:amplitude,1,seconds);
  paperPlayer(671-shift,238,1,rightSpeaks?amplitude:0,-1,seconds);
  path(exercise,[[154,347],[735,347],[785,429],[110,429]],"#7b433f");
  path(exercise,[[110,415],[785,415],[770,435],[119,435]],"#472532");
  block(exercise,397,359,103,50,"#1f2540");
  block(exercise,403,365,91,35,"#cda96e");
  label(exercise,"РОМАШКА",449,388,"#48293e",11,"center");
  const spread=Math.min(1,(local+.1)/2.2);
  const petals=Math.min(8,Math.max(1,Math.ceil(spread*8)));
  for(let i=0;i<petals;i++){
    const theta=i*Math.PI/4 + seconds*.18;
    const x=451+Math.cos(theta)*63;
    const y=219+Math.sin(theta)*63;
    exercise.save();
    exercise.translate(x,y);
    exercise.rotate(theta);
    ellipse(exercise,0,0,28,15,i===Math.floor(seconds)%8?"#ffe09b":"#f4d9ae");
    exercise.restore();
  }
  ellipse(exercise,451,219,26,26,"#e2a44b");
  label(exercise,daisyWords[Math.floor(local*.88)%daisyWords.length],451,314,"#ffdf94",25,"center");
  exercise.restore();
  label(exercise,"ПРОБОВАЛИ РОМАШКУ",25,43,"#fff2ce",21);
  label(exercise,"СЦЕНКА ПО УПРАЖНЕНИЮ",875,43,"#f4c58e",14,"right");
  label(exercise,"Владимир",44,477,"#ffeac6",19);
  label(exercise,"Эллина",856,477,"#ffeac6",19,"right");
}

function positionCartoon(level, now) {
  if (now-lastPaint<31) return;
  lastPaint=now;
  const seconds = reduceStageMotion.matches ? 0 : voice.currentTime + lineIndex * .87;
  const moving = !voice.paused && !reduceStageMotion.matches;
  const spriteName = actors.dataset.speaker === "pixel" && moving && level>=4 ? "wavetalk" : "wave";
  if (currentSprite!==spriteName) {
    currentSprite = spriteName;
    pixelFace.src = "assets/negan/" + spriteName + ".png";
  }
  if (chapters[chapterIndex].film) return;
  drawAuditorium(seconds);
  const speaks = moving && actors.dataset.speaker === "paper";
  const mouth = speaks ? Math.min(1, level / 14) : 0;
  const idle = Math.sin(seconds*2.12);
  paperActor.clearRect(0,0,450,600);
  paperActor.save();
  paperActor.translate(225,565);
  LegacyPaper.drawHero(paperActor,520,{
    ...LegacyPaper.IDLE, talk:mouth, blink:seconds%4.46>4.25, smile:speaks?.25:.54,
    look:[speaks?-.12:-.65,-.02],
    armL:speaks?.29+mouth*.48:.22+idle*.12,
    armR:speaks?.34+mouth*.32:.17,
    brow:speaks?mouth*.36:.28,
    tilt:(idle+mouth)*.033,
    bounce:mouth*5,
  });
  paperActor.restore();
  if (!exerciseCanvas.hidden) drawDaisyScene(seconds,moving?level/15:0,stage.dataset.shot==="romashka-close");
}
