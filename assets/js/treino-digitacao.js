const lessons=[
{id:1,title:'Posição das mãos',icon:'🖐️',goal:'Praticar a posição base: ASDF e JKL;',verse:'“Tudo o que fizerem, façam de todo o coração.” — Colossenses 3:23',texts:['asdf jkl; asdf jkl;','F J D K S L A ;','asdf jkl; sdlk fj;a']},
{id:2,title:'Fé e confiança',icon:'🙏',goal:'Digitar palavras sobre confiar e não desanimar',verse:'“Confie no Senhor de todo o seu coração.” — Provérbios 3:5',texts:['fé confiança esperança','confie no Senhor','não desanime']},
{id:3,title:'Amor e respeito',icon:'❤️',goal:'Praticar palavras que fortalecem as amizades',verse:'“Ame uns aos outros.” — João 13:34',texts:['amor respeito amizade','trate todos com carinho','seja gentil']},
{id:4,title:'Paciência e perseverança',icon:'🌱',goal:'Digitar com atenção, sem desistir',verse:'“O que é paciente mostra prudência.” — Provérbios 14:29',texts:['paciência calma atenção','persistir é aprender','continue com cuidado']},
{id:5,title:'Gratidão e alegria',icon:'😄',goal:'Digitar palavras de gratidão e alegria',verse:'“Deem graças em todas as circunstâncias.” — 1 Tessalonicenses 5:18',texts:['gratidão alegria paz','seja agradecido','celebre cada conquista']},
{id:6,title:'Acentos e cedilha',icon:'✨',goal:'Praticar ç, ã, õ, é, ê, í, ó, ú, â e ô',verse:'“Sejam agradáveis as palavras que saem da boca de vocês.” — Efésios 4:29',texts:['ação coração coração','çã ã õ ê í ó ú','aprendizado oração']},
{id:7,title:'Verdades bíblicas',icon:'📖',goal:'Digitar verdades que fortalecem a fé e o caráter',verse:'“Lâmpada para os meus pés é a tua palavra.” — Salmo 119:105',texts:['Deus é amor','Jesus ensina a verdade','a Bíblia orienta a vida']},
{id:8,title:'O plano da salvação',icon:'✝️',goal:'Entender o amor de Deus, o perdão em Jesus e a nova vida',verse:'“Porque Deus amou o mundo de tal maneira que deu seu Filho unigênito.” — João 3:16',texts:['Deus ama você','Jesus oferece perdão','nova vida em Cristo']},
{id:9,title:'Desafio final: luz e serviço',icon:'⭐',goal:'Digitar com velocidade, precisão e propósito',verse:'“Vocês são a luz do mundo.” — Mateus 5:14',texts:['seja luz onde você estiver','sirva com excelência','dedique seu trabalho ao Senhor']}
];

(() => {
'use strict';
const STORAGE_KEY='nicDigitaçãoPropositoV6';
const $=id=>document.getElementById(id);
let state={};
try { state=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{}; } catch { state={}; }
let currentKey='',current=null,textIndex=0,startTime=null,finished=false,errors=0,streak=0,errorChars={};

function normalizedKey(name,cls){return (name.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()+'|'+cls.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()).slice(0,240);}
function profileKey(){const name=$('studentName')?.value.trim()||'';const cls=$('studentClass')?.value.trim()||'';return name?normalizedKey(name,cls):'';}
function student(){return $('studentName')?.value.trim()||'Aluno NIC';}
function profile(){if(!currentKey)return null;if(!state[currentKey])state[currentKey]={name:student(),class:$('studentClass')?.value.trim()||'',lessons:{}};if(!state[currentKey].lessons)state[currentKey].lessons={};return state[currentKey];}

function setText(id,text){const el=$(id);if(el)el.textContent=text;}
function setHtml(id,html){const el=$(id);if(el)el.innerHTML=html;}
function setStyleWidth(id,value){const el=$(id);if(el)el.style.width=value;}

function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){console.warn('[NIC] Não foi possível salvar o progresso.',e);}renderHome();renderPerformance();}
function xpFor(wpm,acc){return Math.max(10,Math.min(120,Math.round(wpm*4+(acc-60)*2)));}
function level(xp){return xp>=1200?'Mestre do Teclado':xp>=800?'Digitador Avançado':xp>=400?'Digitador Intermediário':xp>=150?'Aprendiz Rápido':'Iniciante';}

function feedback(type,msg){const f=$('feedback');if(f)f.className='feedback show '+type;setHtml('feedback',msg);}
function hideFeedback(){const f=$('feedback');if(f)f.className='feedback';}

function renderHome(){
const grid=$('lessonGrid');if(!grid)return;
const progress=currentKey&&profile()?profile().lessons:{};
let xp=0,best=0,done=0;
lessons.forEach(l=>{const s=progress[l.id];if(s){xp+=s.xp||0;best=Math.max(best,s.wpm||0);if(s.completed)done++;}});
const fragment=document.createDocumentFragment();
lessons.forEach(l=>{const s=progress[l.id];const card=document.createElement('button');card.type='button';card.className='lesson';card.setAttribute('aria-label','Abrir missão '+l.title);card.innerHTML=`<span aria-hidden="true">${l.icon}</span><h3>${l.title}</h3><p>${l.goal}</p>`;if(s?.completed){const badge=document.createElement('span');badge.className='badge';badge.textContent=`Concluída · ${s.wpm||0} PPM · ${s.acc||0}%`;card.appendChild(badge);}card.addEventListener('click',()=>openLesson(l));fragment.appendChild(card);});
grid.replaceChildren(fragment);
setText('doneCount',String(done));
setText('xpTotal',String(xp));
setText('bestWpm',String(best));
setStyleWidth('xpBar',`${Math.min(100,(xp/1200)*100)}%`);
}

function renderPerformance(){
const box=$('performanceSummary');if(!box)return;
const p=profile();if(!p||!p.lessons||Object.keys(p.lessons).length===0){box.textContent='Informe seu nome na aba Treino de Digitação para consultar seu desempenho.';return;}
let xp=0,best=0,done=0,accTotal=0,count=0;
Object.values(p.lessons).forEach(s=>{xp+=s.xp||0;best=Math.max(best,s.wpm||0);if(s.completed)done++;if(s.acc){accTotal+=s.acc;count++;}});
const avg=count?Math.round(accTotal/count):0;
box.replaceChildren();
[['XP',xp],['Melhor PPM',best],['Missões concluídas',done],['Precisão média',`${avg}%`],['Nível',level(xp)]].forEach(([label,value])=>{const item=document.createElement('div');item.className='performance-item';const strong=document.createElement('strong');strong.textContent=String(value);const span=document.createElement('span');span.textContent=label;item.append(strong,span);box.appendChild(item);});
}

function openLesson(l){
if(!$('studentName')?.value.trim()){feedback('warn','Digite seu nome antes de começar a missão.');$('studentName')?.focus();return;}
currentKey=profileKey();if(!currentKey)return;
profile();current=l;textIndex=0;errors=0;streak=0;errorChars={};finished=false;
setText('lessonTitle',`${l.icon} ${l.title}`);setText('verse',l.verse);
$('lessonGrid')&&( $('lessonGrid').hidden=true);$('trainScreen')&&( $('trainScreen').hidden=false);
loadText();
}

function loadText(){
if(!current)return;
const text=current.texts[textIndex];startTime=null;finished=false;errors=0;streak=0;errorChars={};
const typing=$('typing');if(typing){typing.value='';typing.disabled=false;typing.className='';typing.focus();}
renderTarget(text,'');setStyleWidth('progress','0%');setText('timer','0s');setText('liveWpm','0');setText('liveAcc','100%');setText('liveErrors','0');setText('liveStreak','0');hideFeedback();
const result=$('result');if(result)result.className='result';
}

function renderTarget(text,typed){
let h='';for(let i=0;i<text.length;i++){const c=text[i];let cls='pending';if(i<typed.length)cls=typed[i]===c?'correct':'wrong';if(i===typed.length)cls+=' cursor';h+=`<span class="${cls}">${c===' '?'&nbsp;':c}</span>`;}setHtml('target',h);
}
function updateLive(wpm,acc,err,str){setText('liveWpm',String(wpm));setText('liveAcc',acc+'%');setText('liveErrors',String(err));setText('liveStreak',String(str));}
function metrics(text,typed){let right=0;for(let i=0;i<typed.length;i++)if(typed[i]===text[i])right++;const secs=startTime?Math.max(1,(Date.now()-startTime)/1000):1;const wpm=Math.round((typed.length/5)/(secs/60));const acc=typed.length?Math.round((right/typed.length)*100):100;return{wpm:Math.max(0,wpm),acc,secs};}

function checkText(){
if(!current)return;
const text=current.texts[textIndex],typed=$('typing')?.value||'';const m=metrics(text,typed);
if(m.acc>=90)feedback('good',`🌟 <strong>Que legal!</strong> Sua precisão foi de ${m.acc}% e você digitou ${m.wpm} PPM.`);
else if(m.acc>=80)feedback('warn',`👍 <strong>Bom trabalho!</strong> Precisão: ${m.acc}%. Vamos tentar novamente, com calma.`);
else feedback('bad',`💪 <strong>Vamos tentar de novo!</strong> Precisão: ${m.acc}%. Respire e digite devagar.`);
if(m.acc>=80){
if(textIndex<current.texts.length-1){setTimeout(()=>{textIndex++;loadText();},900);}
else{
const p=profile();if(!p)return;const progress=p.lessons;const old=progress[current.id]||{xp:0,wpm:0,acc:0,completed:false};const xp=xpFor(m.wpm,m.acc);progress[current.id]={xp:Math.max(old.xp||0,xp),wpm:Math.max(old.wpm||0,m.wpm),acc:Math.max(old.acc||0,m.acc),completed:true};save();finished=true;const typing=$('typing');if(typing)typing.disabled=true;
setText('finalXp',`${progress[current.id].xp} XP`);setText('wpm',String(m.wpm));setText('acc',`${m.acc}%`);setText('errors',String(errors));setText('elapsed',`${Math.round(m.secs)}s`);setText('resultVerse',current.verse);setHtml('coach',`<strong>${level(progress[current.id].xp)}</strong>. Continue praticando postura e precisão.`);const result=$('result');if(result)result.className='result show';
}
}else{setTimeout(()=>{if(!finished)loadText();},1400);}
}

const typing=$('typing');if(typing)typing.addEventListener('input',()=>{
if(finished||!current)return;const text=current.texts[textIndex];let typed=typing.value;if(typed.length>text.length){typing.value=typed.slice(0,text.length);typed=typing.value;}if(!startTime&&typed.length)startTime=Date.now();const i=typed.length-1;if(i>=0){if(typed[i]===text[i]){streak++;if(streak===10)feedback('good','🔥 <strong>Muito bem!</strong> Você acertou 10 letras seguidas!');}else{errors++;streak=0;errorChars[text[i]]=(errorChars[text[i]]||0)+1;typing.className='error';setTimeout(()=>typing.className='',150);} }renderTarget(text,typed);const m=metrics(text,typed);updateLive(m.wpm,m.acc,errors,streak);setStyleWidth('progress',(typed.length/text.length*100)+'%');setText('timer',Math.round(m.secs)+'s');if(typing.className==='error')typing.className='';if(typed.length>=text.length)checkText();
});

if($('resetBtn'))$('resetBtn').addEventListener('click',loadText);
if($('nextTextBtn'))$('nextTextBtn').addEventListener('click',()=>{if(!current)return;if(textIndex<current.texts.length-1){textIndex++;loadText();}else feedback('warn','Este já é o último texto da missão. Finalize para receber seu resultado.');});
function returnHome(){const train=$('trainScreen');if(train)train.hidden=true;const grid=$('lessonGrid');if(grid)grid.hidden=false;renderHome();}
if($('backBtn'))$('backBtn').addEventListener('click',returnHome);
if($('finishBtn'))$('finishBtn').addEventListener('click',returnHome);
if($('homeBtn'))$('homeBtn').addEventListener('click',returnHome);

$('studentName')?.addEventListener('change',syncStudent);
$('studentClass')?.addEventListener('change',syncStudent);
function syncStudent(){currentKey=profileKey();if(currentKey)profile();renderHome();renderPerformance();}

if(window.NIC?.store&&$('studentName'))$('studentName').value=window.NIC.store.get('nomeAluno','')||'';
syncStudent();
window.addEventListener('nic:desempenho-aberto',renderPerformance);
})();
