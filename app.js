const ranks = [
  {id:'bronze',name:'BRONZE',icon:'B',level:0,rule:'4 rounds won in a 1v1 test.',themeClass:'bronze'},
  {id:'silver',name:'SILVER',icon:'S',level:1,rule:'Win the 1v1 rank test.',themeClass:'silver'},
  {id:'golden',name:'GOLDEN',icon:'G',level:2,rule:'Win the 1v2 challenge.',themeClass:'golden'},
  {id:'platinum',name:'PLATINUM',icon:'P',level:3,rule:'Win the 1v3 challenge.',themeClass:'platinum'},
  {id:'diamond',name:'DIAMOND',icon:'D',level:4,rule:'Win the 1v4 challenge.',themeClass:'diamond'},
  {id:'heroic',name:'HEROIC',icon:'H',level:5,rule:'From Diamond, win a 1v4.',themeClass:'heroic',flame:true},
  {id:'master',name:'MASTER',icon:'M',level:6,rule:'From Heroic, win a 1v4.',themeClass:'master',flame:true},
  {id:'grandmaster',name:'GRANDMASTER',icon:'GM',level:7,rule:'Monthly tournament for Masters.',themeClass:'grandmaster',flame:true}
];

const rooms = [
  {id:'global',title:'GLOBAL CHAT',subtitle:'Bronze → Grandmaster · Everyone can chat',rankId:'global',min:0,req:'ALL MEMBERS',icon:'◆'},
  ...ranks.map(r => ({id:r.id,title:`${r.name} CHAT`,subtitle:r.level === 0 ? 'Bronze members and above' : `${r.name} members and above`,rankId:r.id,min:r.level,req:r.rule,icon:r.icon}))
];

const demoMessages = {
  global:[
    {name:'Shadow FF',initials:'SF',rankId:'heroic',time:'11:02 AM',text:'Welcome to ELITE FF CHAT 🔥',ticker:'HEROIC • COMMUNITY ONLINE'},
    {name:'RoyalJoker',initials:'RJ',rankId:'grandmaster',time:'11:04 AM',text:'Monthly Grandmaster applications will be announced soon 👑',ticker:'GRANDMASTER • MONTHLY BRIEF'},
    {name:'Dark Wolf',initials:'DW',rankId:'golden',time:'11:07 AM',text:'Good luck everyone! ⚔️',ticker:'GOLDEN • GOOD LUCK'}
  ],
  bronze:[{name:'Razor FF',initials:'RF',rankId:'bronze',time:'10:44 AM',text:'Bronze room ready. Let the climb begin.'}],
  silver:[{name:'Frost',initials:'FR',rankId:'silver',time:'10:38 AM',text:'Silver test room unlocked.'}],
  golden:[{name:'Dark Wolf',initials:'DW',rankId:'golden',time:'10:30 AM',text:'1v2 challenge complete.'}],
  platinum:[{name:'IceX',initials:'IX',rankId:'platinum',time:'10:24 AM',text:'Platinum channel is live.'}],
  diamond:[{name:'Blue Fang',initials:'BF',rankId:'diamond',time:'10:18 AM',text:'Diamond players only 💎'}],
  heroic:[{name:'Shadow FF',initials:'SF',rankId:'heroic',time:'10:11 AM',text:'Heroic flame is online 🔥',ticker:'HEROIC • FLAME STATUS'}],
  master:[{name:'RoyalJoker',initials:'RJ',rankId:'master',time:'10:05 AM',text:'Masters: prepare for the monthly tournament.',ticker:'MASTER • MONTHLY BRIEF'}],
  grandmaster:[{name:'RoyalJoker',initials:'RJ',rankId:'grandmaster',time:'09:58 AM',text:'GRANDMASTER LOUNGE — Elite members only 👑🔥',ticker:'LIVE • GRANDMASTER LOUNGE'}],
  guild:[{name:'ONLY JODS',initials:'OJ',rankId:'master',time:'09:48 AM',text:'Skull & Bones guild room unlocked. ☠',ticker:'HIDDEN GUILD • SECURE CHANNEL'}]
};

const state={
  currentRoom:null,
  user:{name:'Guest Player',initials:'FF',rankId:'bronze',rankLevel:0,approved:false,guildMember:false},
  customMessages:{}
};

const $=id=>document.getElementById(id);
const rankById=id=>ranks.find(r=>r.id===id)||ranks[0];
const roomById=id=>rooms.find(r=>r.id===id)||(id==='guild'?{id:'guild',rankId:'master',title:'HIDDEN GUILD',subtitle:'Skull & Bones · Guild members only',icon:'☠',min:0,req:'VERIFIED GUILD'}:null);

function showToast(msg){
  const t=$('toast'); t.textContent=msg; t.classList.remove('hidden'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>t.classList.add('hidden'),2400);
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function canEnter(room){
  if(!room)return false;
  if(room.id==='guild')return state.user.guildMember;
  if(room.id==='global')return true;
  return state.user.rankLevel>=room.min;
}

function setRootTheme(rankId){
  const r=rankId==='global'?{id:'global'}:rankById(rankId);
  const map={global:['#49a8ff','73,168,255'],bronze:['#d7864b','215,134,75'],silver:['#dfe7f5','223,231,245'],golden:['#f6c945','246,201,69'],platinum:['#74ddff','116,221,255'],diamond:['#4ba7ff','75,167,255'],heroic:['#ff3f31','255,63,49'],master:['#dca63f','220,166,63'],grandmaster:['#ffcf4b','255,207,75']}[r.id]||['#49a8ff','73,168,255'];
  document.documentElement.style.setProperty('--rank',map[0]);
  document.documentElement.style.setProperty('--rank-rgb',map[1]);
  document.documentElement.style.setProperty('--rank-soft',`rgba(${map[1]},.10)`);
  document.documentElement.style.setProperty('--rank-glow',`rgba(${map[1]},.24)`);
}

function badgeMarkup(rank){
  return `<div class="rank-badge rank-${rank.id}"><span class="rank-core">${escapeHtml(rank.icon)}</span></div>`;
}

function renderRooms(){
  const list=$('roomList'); list.innerHTML='';
  rooms.forEach(room=>{
    const rank=room.id==='global'?{id:'global',name:'GLOBAL',icon:'◆',level:0}:rankById(room.rankId);
    const open=canEnter(room);
    const high=['heroic','master','grandmaster'].includes(rank.id);
    const card=document.createElement('button');
    card.type='button';
    card.className=`room-card rank-${rank.id} ${high?'high-rank':''} ${open?'':'locked'}`;
    card.innerHTML=`<span class="card-edge"></span>
      <div class="room-top">${badgeMarkup(rank)}<span class="room-status ${open?'':'locked'}">${open?'OPEN':'LOCKED'}</span></div>
      <div class="room-body"><h4>${room.title}</h4><p>${escapeHtml(room.subtitle)}</p></div>
      <div class="room-bottom"><span class="room-req">${escapeHtml(room.req)}</span><span class="enter-label">${open?'ENTER ROOM':'UNAVAILABLE'} <span>${open?'↗':'🔒'}</span></span></div>`;
    card.addEventListener('click',()=>selectRoom(room.id));
    list.appendChild(card);
  });
}

function renderUser(){
  const r=rankById(state.user.rankId);
  $('userName').textContent=state.user.name;
  $('userRank').textContent=`${r.name} MEMBER`;
  $('memberSigil').className=`member-sigil rank-${r.id}`;
  $('memberSigil').textContent=r.icon;
  const tiny=$('profileBtn').querySelector('.tiny-sigil'); tiny.className=`tiny-sigil rank-${r.id}`; tiny.textContent=r.icon;
}

function selectRoom(roomId){
  const room=roomById(roomId); if(!room)return;
  if(!canEnter(room)){
    if(room.id==='guild')showToast('Hidden Guild is only for verified guild members.');
    else showToast(`Reach ${rankById(room.rankId).name} to unlock this room.`);
    return;
  }
  state.currentRoom=room.id;
  const rankId=room.id==='global'?'global':room.id;
  setRootTheme(rankId==='global'?'global':rankId);
  $('roomBrowser').classList.add('hidden');
  $('chatScreen').classList.remove('hidden');
  $('backToRooms').classList.remove('hidden');
  renderChatHeader(); renderMessages();
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderChatHeader(){
  const room=roomById(state.currentRoom); const rank=room.id==='global'?{id:'global',name:'GLOBAL',icon:'◆'}:rankById(room.rankId);
  $('roomCrest').className=`chat-sigil rank-${rank.id}${rank.flame?' high':''}`; $('roomCrest').textContent=rank.icon;
  $('roomKicker').textContent=room.id==='guild'?'SECURE CHANNEL':rank.flame?'ELITE CHANNEL':'OPEN CHANNEL';
  $('roomTitle').textContent=room.title; $('roomSubtitle').textContent=room.subtitle;
  $('roomCount').textContent=room.id==='guild'?'7':String(90+(rank.level||0)*12);
  $('chatNotice').innerHTML=room.id==='guild'?'SKULL & BONES • PRIVATE GUILD CHANNEL <span>•</span> VERIFIED MEMBERS ONLY':rank.id==='grandmaster'?'GRANDMASTER LOUNGE <span>•</span> MONTHLY ELITE CHANNEL':`${rank.name==='GLOBAL'?'GLOBAL':rank.name} CHAT <span>•</span> RESPECT THE COMMUNITY`;
}

function getMessages(){return [...(demoMessages[state.currentRoom]||[]),...(state.customMessages[state.currentRoom]||[])];}
function renderMessages(){
  const box=$('messages'); box.innerHTML='';
  getMessages().forEach(msg=>{
    const r=rankById(msg.rankId); const self=msg.name===state.user.name; const row=document.createElement('article'); row.className=`message-row${self?' self':''}`;
    row.innerHTML=`<div class="message-avatar rank-${r.id}${r.flame?' flame':''}">${escapeHtml(msg.initials)}</div><div class="message-wrap"><div class="message-meta"><strong>${escapeHtml(msg.name)}</strong><span class="rank-tag rank-${r.id}">${r.name}</span><span>${escapeHtml(msg.time)}</span></div><div class="message-card rank-${r.id}">${msg.ticker?`<div class="message-special-ticker">${escapeHtml(msg.ticker)}</div>`:''}<div>${escapeHtml(msg.text)}</div></div></div>`;
    box.appendChild(row);
  });
}

function backToRooms(){
  state.currentRoom=null; setRootTheme('global'); $('chatScreen').classList.add('hidden'); $('roomBrowser').classList.remove('hidden'); $('backToRooms').classList.add('hidden'); window.scrollTo({top:0,behavior:'smooth'}); renderRooms();
}
function openModal(id){$(id).classList.remove('hidden');$(id).setAttribute('aria-hidden','false')}
function closeModal(id){$(id).classList.add('hidden');$(id).setAttribute('aria-hidden','true')}

function init(){
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
  document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m.id)}));
  $('showRanksBtn').addEventListener('click',()=>openModal('rankModal'));
  $('profileBtn').addEventListener('click',()=>openModal('authModal'));
  $('backToRooms').addEventListener('click',backToRooms);
  $('notifyBtn').addEventListener('click',()=>showToast('No new notifications in the prototype.'));
  $('adminBtn').addEventListener('click',()=>showToast('Admin controls connect in the Supabase phase.'));
  $('guildRoomBtn').addEventListener('click',()=>selectRoom('guild'));
  $('roomMenuBtn').addEventListener('click',()=>showToast('Room tools connect in the next phase.'));
  $('emojiBtn').addEventListener('click',()=>{$('messageInput').value+=' 🔥';$('messageInput').focus()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal('authModal');closeModal('rankModal')}});

  $('registerForm').addEventListener('submit',e=>{
    e.preventDefault(); const name=$('ffName').value.trim(),uid=$('ffUid').value.trim(); if(!name||!uid)return;
    state.user={...state.user,name,initials:(name.replace(/[^a-zA-Z0-9]/g,'').slice(0,2)||'FF').toUpperCase(),approved:true,guildMember:true,rankId:'bronze',rankLevel:0};
    renderUser();renderRooms();closeModal('authModal');showToast('Demo profile created — Bronze member ready.');
  });

  $('composerForm').addEventListener('submit',e=>{
    e.preventDefault(); const text=$('messageInput').value.trim(); if(!text)return;
    if(!state.user.approved){openModal('authModal');return;}
    const room=roomById(state.currentRoom); if(!room||!canEnter(room)){showToast('This room is locked for your current rank.');return;}
    const now=new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
    state.customMessages[state.currentRoom]??=[];
    state.customMessages[state.currentRoom].push({name:state.user.name,initials:state.user.initials,rankId:state.user.rankId,time:now,text});
    $('messageInput').value=''; renderMessages();
  });

  $('rankList').innerHTML=ranks.map(r=>`<div class="rank-item rank-${r.id}">${badgeMarkup(r)}<div><strong>${r.name}</strong><small>${r.rule}</small></div><span class="rank-pill">${r.id==='grandmaster'?'MONTHLY':'TEST'}</span></div>`).join('');
  setRootTheme('global');renderUser();renderRooms();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
