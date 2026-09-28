const ranks = [
  { id:'bronze', name:'BRONZE', short:'BRONZE', rule:'Win 4 rounds in the Bronze 1v1 test.', symbol:'B', level:0 },
  { id:'silver', name:'SILVER', short:'SILVER', rule:'Win the Silver 1v1 test.', symbol:'S', level:1 },
  { id:'golden', name:'GOLDEN', short:'GOLDEN', rule:'Win the Golden 1v2 test.', symbol:'G', level:2 },
  { id:'platinum', name:'PLATINUM', short:'PLATINUM', rule:'Win the Platinum 1v3 test.', symbol:'P', level:3 },
  { id:'diamond', name:'DIAMOND', short:'DIAMOND', rule:'Win the Diamond 1v4 test.', symbol:'D', level:4 },
  { id:'heroic', name:'HEROIC', short:'HEROIC', rule:'From Diamond, win the Heroic 1v4 test.', symbol:'H', level:5, flame:true },
  { id:'master', name:'MASTER', short:'MASTER', rule:'From Heroic, win the Master 1v4 test.', symbol:'M', level:6, flame:true },
  { id:'grandmaster', name:'GRANDMASTER', short:'GRANDMASTER', rule:'Monthly 1v1 tournament for eligible Masters.', symbol:'GM', level:7, flame:true }
];

const rooms = [
  { id:'global', title:'GLOBAL CHAT', subtitle:'Bronze → Grandmaster • Everyone can chat', icon:'G', min:0 },
  { id:'bronze', title:'BRONZE CHAT', subtitle:'Bronze members and above', icon:'B', min:0 },
  { id:'silver', title:'SILVER CHAT', subtitle:'Silver members and above', icon:'S', min:1 },
  { id:'golden', title:'GOLDEN CHAT', subtitle:'Golden members and above', icon:'G', min:2 },
  { id:'platinum', title:'PLATINUM CHAT', subtitle:'Platinum members and above', icon:'P', min:3 },
  { id:'diamond', title:'DIAMOND CHAT', subtitle:'Diamond members and above', icon:'D', min:4 },
  { id:'heroic', title:'HEROIC CHAT', subtitle:'Heroic members and above', icon:'H', min:5 },
  { id:'master', title:'MASTER CHAT', subtitle:'Master members and above', icon:'M', min:6 },
  { id:'grandmaster', title:'GRANDMASTER CHAT', subtitle:'Grandmaster members only', icon:'GM', min:7 }
];

const demoMembers = [
  { name:'Shadow FF', initials:'SF', rankId:'heroic' },
  { name:'RoyalJoker', initials:'RJ', rankId:'grandmaster' },
  { name:'Dark Wolf', initials:'DW', rankId:'golden' },
  { name:'IceX', initials:'IX', rankId:'diamond' }
];

const demoMessages = {
  global: [
    { name:'Shadow FF', initials:'SF', rankId:'heroic', time:'11:02 AM', text:'Welcome to ELITE FF CHAT 🔥' },
    { name:'RoyalJoker', initials:'RJ', rankId:'grandmaster', time:'11:04 AM', text:'Monthly Grandmaster applications will be announced soon 👑', ticker:'BREAKING • GRANDMASTER NOTICE' },
    { name:'Dark Wolf', initials:'DW', rankId:'golden', time:'11:07 AM', text:'Good luck everyone! ❤️' }
  ],
  bronze:[{name:'Dark Wolf',initials:'DW',rankId:'golden',time:'10:58 AM',text:'Bronze room is open for verified members.'}],
  silver:[{name:'IceX',initials:'IX',rankId:'diamond',time:'10:51 AM',text:'Silver members can practice here.'}],
  golden:[{name:'RoyalJoker',initials:'RJ',rankId:'grandmaster',time:'10:49 AM',text:'Keep climbing. Next stop Platinum. 👑',ticker:'ELITE • RANK WATCH'}],
  platinum:[{name:'IceX',initials:'IX',rankId:'diamond',time:'10:42 AM',text:'Diamond test is waiting.'}],
  diamond:[{name:'Shadow FF',initials:'SF',rankId:'heroic',time:'10:38 AM',text:'Heroic progression starts from Diamond.',ticker:'HEROIC • ACTIVE'}],
  heroic:[{name:'Shadow FF',initials:'SF',rankId:'heroic',time:'10:31 AM',text:'Heroic flame is online 🔥',ticker:'HEROIC • FLAME STATUS'}],
  master:[{name:'RoyalJoker',initials:'RJ',rankId:'grandmaster',time:'10:25 AM',text:'Masters: prepare for the monthly tournament.',ticker:'MASTER • MONTHLY BRIEF'}],
  grandmaster:[{name:'RoyalJoker',initials:'RJ',rankId:'grandmaster',time:'10:20 AM',text:'GRANDMASTER LOUNGE — Elite members only 👑🔥',ticker:'LIVE • GRANDMASTER LOUNGE'}],
  guild:[{name:'ONLY JODS',initials:'OJ',rankId:'master',time:'09:48 AM',text:'Skull & Bones guild room unlocked. ☠',ticker:'HIDDEN GUILD • SECURE CHANNEL'}]
};

const state = {
  currentRoom:null,
  user:{ name:'Guest Player', initials:'FF', rankId:'bronze', rankLevel:0, approved:false, guildMember:false },
  customMessages:{}
};

const $ = id => document.getElementById(id);
const rankById = id => ranks.find(r => r.id === id) || ranks[0];
const roomById = id => [...rooms,{id:'guild',title:'HIDDEN GUILD',subtitle:'Skull & Bones • Guild members only',icon:'☠',min:0}].find(r => r.id === id);

function showToast(message){
  const toast = $('toast'); toast.textContent = message; toast.classList.remove('hidden');
  clearTimeout(showToast.timer); showToast.timer = setTimeout(()=>toast.classList.add('hidden'), 2200);
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
}

function canEnter(room){
  if(room.id === 'guild') return state.user.guildMember;
  return state.user.rankLevel >= room.min;
}

function renderRooms(){
  const list = $('roomList'); list.innerHTML='';
  rooms.forEach(room=>{
    const r = rankById(room.id);
    const unlocked = canEnter(room);
    const card = document.createElement('button');
    card.type='button';
    card.className = `room-card rank-${room.id} ${unlocked?'':'locked'}`;
    card.dataset.room = room.id;
    card.innerHTML = `
      <div class="room-card-top">
        <div class="room-icon rank-${room.id}">${room.icon}</div>
        <span class="room-mini-label">${unlocked?'OPEN':'LOCKED'}</span>
      </div>
      <h4>${room.title}</h4>
      <p>${room.subtitle}</p>
      <span class="room-enter">${unlocked?'ENTER ↗':'🔒'}</span>`;
    card.addEventListener('click',()=>selectRoom(room.id));
    list.appendChild(card);
  });
}

function renderUser(){
  const rank = rankById(state.user.rankId);
  $('userName').textContent = state.user.name;
  $('userRank').textContent = `${rank.name} MEMBER`;
  const p = document.querySelector('.member-badge-wrap');
  p.className = `member-badge-wrap rank-${rank.id} ${rank.flame?'flame-member':''}`;
  p.querySelector('.badge-glyph').textContent = rank.symbol;
  $('profileBtn').querySelector('.profile-mini').className = `profile-mini rank-${rank.id}`;
  $('profileBtn').querySelector('.profile-mini').textContent = rank.symbol;
}

function setRankVars(roomId){
  const rankId = roomId === 'guild' ? 'master' : roomId;
  const rank = rankById(rankId);
  document.documentElement.style.setProperty('--rank', `var(--${rank.id})`);
  document.documentElement.style.setProperty('--rank-line', `var(--${rank.id}-line)`);
  document.documentElement.style.setProperty('--rank-glow', `var(--${rank.id}-glow)`);
}

function selectRoom(roomId){
  const room = roomById(roomId); if(!room) return;
  if(!canEnter(room)){
    if(room.id === 'guild') showToast('Hidden Guild is only visible to verified guild members.');
    else showToast(`You need ${ranks[room.min].name} rank to enter this chat.`);
    return;
  }
  state.currentRoom = roomId;
  setRankVars(roomId);
  $('roomBrowser').classList.add('hidden');
  $('chatScreen').classList.remove('hidden');
  $('backToRooms').classList.remove('hidden');
  document.body.classList.add('chat-open');
  renderChatHeader();
  renderMessages();
}

function renderChatHeader(){
  const room = roomById(state.currentRoom);
  const rankId = state.currentRoom === 'guild' ? 'master' : state.currentRoom;
  const rank = rankById(rankId);
  $('roomCrest').className = `room-crest rank-${rank.id}`;
  $('roomCrest').textContent = room.icon;
  $('roomKicker').textContent = state.currentRoom === 'guild' ? 'SECURE CHANNEL' : (rank.flame ? 'ELITE CHANNEL' : 'OPEN CHANNEL');
  $('roomTitle').textContent = room.title;
  $('roomSubtitle').textContent = room.subtitle;
  $('roomCount').textContent = state.currentRoom === 'guild' ? '7' : `${Math.floor(88 + rank.level*11)}`;
}

function getMessages(){ return [...(demoMessages[state.currentRoom]||[]), ...(state.customMessages[state.currentRoom]||[])]; }

function renderMessages(){
  const box = $('messages'); box.innerHTML='';
  getMessages().forEach(msg=>{
    const rank = rankById(msg.rankId);
    const self = msg.name === state.user.name;
    const row = document.createElement('article');
    row.className = 'message-row' + (self ? ' self' : '');
    row.innerHTML = `
      <div class="message-avatar rank-${rank.id} ${rank.flame?'flame':''}">${escapeHtml(msg.initials)}</div>
      <div class="message-wrap">
        <div class="message-meta"><strong>${escapeHtml(msg.name)}</strong><span class="rank-tag">${rank.name}</span><span>${escapeHtml(msg.time)}</span></div>
        <div class="message-card rank-${rank.id}">
          ${msg.ticker && rank.flame ? `<div class="message-special-ticker">${escapeHtml(msg.ticker)}</div>` : ''}
          <div>${escapeHtml(msg.text)}</div>
        </div>
      </div>`;
    box.appendChild(row);
  });
  box.scrollTop = box.scrollHeight;
}

function backToRooms(){
  state.currentRoom = null;
  $('chatScreen').classList.add('hidden');
  $('roomBrowser').classList.remove('hidden');
  $('backToRooms').classList.add('hidden');
  document.body.classList.remove('chat-open');
}

function openModal(id){ const m=$(id);m.classList.remove('hidden');m.setAttribute('aria-hidden','false'); }
function closeModal(id){ const m=$(id);m.classList.add('hidden');m.setAttribute('aria-hidden','true'); }

document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>closeModal(btn.dataset.close)));
document.querySelectorAll('.modal').forEach(modal=>modal.addEventListener('click',e=>{if(e.target===modal)closeModal(modal.id)}));
$('showRanksBtn').addEventListener('click',()=>openModal('rankModal'));
$('profileBtn').addEventListener('click',()=>openModal('authModal'));
$('backToRooms').addEventListener('click',backToRooms);
$('notifyBtn').addEventListener('click',()=>showToast('No new notifications in the prototype.'));
$('adminBtn').addEventListener('click',()=>showToast('Admin Control connects in the Supabase phase.'));
$('guildRoomBtn').addEventListener('click',()=>selectRoom('guild'));
$('roomMenuBtn').addEventListener('click',()=>showToast('Room tools will be connected in the next phase.'));
$('emojiBtn').addEventListener('click',()=>{ $('messageInput').value += ' 🔥'; $('messageInput').focus(); });

document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeModal('authModal');closeModal('rankModal'); } });

$('registerForm').addEventListener('submit',e=>{
  e.preventDefault();
  const name=$('ffName').value.trim(), uid=$('ffUid').value.trim();
  if(!name||!uid) return;
  state.user.name=name;
  state.user.initials=name.replace(/[^a-zA-Z0-9]/g,'').slice(0,2).toUpperCase()||'FF';
  state.user.approved=true;
  state.user.guildMember=true;
  state.user.rankId='bronze';
  state.user.rankLevel=0;
  renderUser();
  renderRooms();
  closeModal('authModal');
  showToast('Demo account created — Bronze member ready.');
});

$('composerForm').addEventListener('submit',e=>{
  e.preventDefault();
  const text=$('messageInput').value.trim(); if(!text) return;
  if(!state.user.approved){openModal('authModal');return;}
  if(!state.currentRoom) return;
  const room=roomById(state.currentRoom);
  if(!canEnter(room)){showToast('This room is locked for your current rank.');return;}
  const now=new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
  if(!state.customMessages[state.currentRoom]) state.customMessages[state.currentRoom]=[];
  state.customMessages[state.currentRoom].push({name:state.user.name,initials:state.user.initials,rankId:state.user.rankId,time:now,text});
  $('messageInput').value='';
  renderMessages();
});

$('rankList').innerHTML = ranks.map(r=>`
  <div class="rank-item rank-${r.id}">
    <div class="rank-badge rank-${r.id}">${r.symbol}</div>
    <div><strong>${r.name}</strong><small>${r.rule}</small></div>
    <span class="rule-pill">${r.id==='grandmaster'?'MONTHLY':'TEST'}</span>
  </div>`).join('');

renderUser();
renderRooms();
