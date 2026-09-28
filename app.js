const ranks = [
  { id:'bronze', name:'BRONZE', rule:'Win 4 rounds in the Bronze 1v1 test.', icon:'🦅', level:0 },
  { id:'silver', name:'SILVER', rule:'Win the Silver 1v1 test.', icon:'🐺', level:1 },
  { id:'golden', name:'GOLDEN', rule:'Win the Golden 1v2 test.', icon:'🦁', level:2 },
  { id:'platinum', name:'PLATINUM', rule:'Win the Platinum 1v3 test.', icon:'🦅', level:3 },
  { id:'diamond', name:'DIAMOND', rule:'Win the Diamond 1v4 test.', icon:'🐺', level:4 },
  { id:'heroic', name:'HEROIC', rule:'From Diamond, win the Heroic 1v4 test.', icon:'🔥', level:5, flame:true },
  { id:'master', name:'MASTER', rule:'From Heroic, win the Master 1v4 test.', icon:'🐯', level:6, flame:true },
  { id:'grandmaster', name:'GRANDMASTER', rule:'Monthly 1v1 tournament for eligible Masters.', icon:'👑', level:7, flame:true }
];

const rooms = [
  { id:'global', rankId:'global', title:'GLOBAL CHAT', subtitle:'Bronze → Grandmaster • Everyone can chat', icon:'◆', min:0 },
  { id:'bronze', rankId:'bronze', title:'BRONZE CHAT', subtitle:'Bronze members and above', icon:'🦅', min:0 },
  { id:'silver', rankId:'silver', title:'SILVER CHAT', subtitle:'Silver members and above', icon:'🐺', min:1 },
  { id:'golden', rankId:'golden', title:'GOLDEN CHAT', subtitle:'Golden members and above', icon:'🦁', min:2 },
  { id:'platinum', rankId:'platinum', title:'PLATINUM CHAT', subtitle:'Platinum members and above', icon:'♢', min:3 },
  { id:'diamond', rankId:'diamond', title:'DIAMOND CHAT', subtitle:'Diamond members and above', icon:'◆', min:4 },
  { id:'heroic', rankId:'heroic', title:'HEROIC CHAT', subtitle:'Heroic members and above', icon:'🔥', min:5 },
  { id:'master', rankId:'master', title:'MASTER CHAT', subtitle:'Master members and above', icon:'🐯', min:6 },
  { id:'grandmaster', rankId:'grandmaster', title:'GRANDMASTER CHAT', subtitle:'Grandmaster members only', icon:'👑', min:7 }
];

const demoMessages = {
  global:[
    {name:'Shadow FF',initials:'SF',rankId:'heroic',time:'11:02 AM',text:'Welcome to ELITE FF CHAT 🔥'},
    {name:'RoyalJoker',initials:'RJ',rankId:'grandmaster',time:'11:04 AM',text:'Monthly Grandmaster applications will be announced soon 👑',ticker:'BREAKING • GRANDMASTER NOTICE'},
    {name:'Dark Wolf',initials:'DW',rankId:'golden',time:'11:07 AM',text:'Good luck everyone! 🔥'}
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
  user:{name:'Guest Player',initials:'FF',rankId:'bronze',rankLevel:0,approved:false,guildMember:false},
  customMessages:{}
};

const $ = id => document.getElementById(id);
const rankById = id => ranks.find(r => r.id === id) || ranks[0];
const roomById = id => rooms.find(r => r.id === id) || (id === 'guild' ? {id:'guild',rankId:'master',title:'HIDDEN GUILD',subtitle:'Skull & Bones • Guild members only',icon:'☠',min:0} : null);

function showToast(message){
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add('hidden'), 2200);
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
}

function canEnter(room){
  if (!room) return false;
  if (room.id === 'guild') return state.user.guildMember;
  return room.id === 'global' || state.user.rankLevel >= room.min;
}

function rankMarkup(rank){
  const symbol = rank.icon || rank.name.slice(0,1);
  return `<span class="corner corner-a"></span><span class="corner corner-b"></span><span class="corner corner-c"></span><span class="corner corner-d"></span><div class="room-card-top"><div class="room-icon rank-${rank.id}"><span class="mini-mark">${symbol}</span></div><span class="room-mini-label">${canEnter({id:rank.id,min:rank.level})?'OPEN':'LOCKED'}</span></div>`;
}

function renderRooms(){
  const list = $('roomList');
  if (!list) return;
  list.innerHTML = '';

  rooms.forEach(room => {
    const rank = room.id === 'global' ? {id:'global', name:'GLOBAL', icon:'◆', level:0} : rankById(room.rankId);
    const unlocked = canEnter(room);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `room-card rank-${rank.id} ${unlocked ? '' : 'locked'}`;
    card.setAttribute('aria-label', `${room.title}${unlocked ? '' : ' locked'}`);
    card.innerHTML = `${rankMarkup({...rank,level:rank.level || 0})}<h4>${room.title}</h4><p>${room.subtitle}</p><span class="room-enter">${unlocked ? 'ENTER ROOM →' : 'LOCKED 🔒'}</span>`;
    card.addEventListener('click', () => selectRoom(room.id));
    list.appendChild(card);
  });
}

function renderUser(){
  const rank = rankById(state.user.rankId);
  $('userName').textContent = state.user.name;
  $('userRank').textContent = `${rank.name} MEMBER`;
  const badge = document.querySelector('.member-badge-wrap');
  badge.className = `member-badge-wrap rank-${rank.id}`;
  badge.querySelector('.badge-glyph').textContent = rank.icon;
  const mini = $('profileBtn').querySelector('.profile-mini');
  mini.className = `profile-mini rank-${rank.id}`;
  mini.textContent = rank.icon;
}

function setRoomTheme(room){
  const rankId = room.id === 'global' ? 'global' : room.id === 'guild' ? 'master' : room.rankId;
  const root = document.documentElement;
  const themeRank = rankId === 'global' ? '#4ca6ff' : `var(--${rankId === 'golden' ? 'golden' : rankId})`;
  root.style.setProperty('--rank', themeRank);
  root.style.setProperty('--rank-line', rankId === 'global' ? 'rgba(76,166,255,.65)' : `rgba(${rankId === 'heroic' ? '255,63,49' : rankId === 'master' ? '224,173,66' : rankId === 'grandmaster' ? '255,205,71' : '76,166,255'},.65)`);
  root.style.setProperty('--rank-glow', rankId === 'global' ? 'rgba(76,166,255,.22)' : `rgba(${rankId === 'heroic' ? '255,63,49' : rankId === 'master' ? '224,173,66' : rankId === 'grandmaster' ? '255,205,71' : '76,166,255'},.24)`);
}

function selectRoom(roomId){
  const room = roomById(roomId);
  if (!room) return;
  if (!canEnter(room)) {
    showToast(room.id === 'guild' ? 'Hidden Guild is only for verified guild members.' : `You need ${rankById(room.rankId).name} rank to enter this chat.`);
    return;
  }
  state.currentRoom = room.id;
  setRoomTheme(room);
  $('roomBrowser').classList.add('hidden');
  $('chatScreen').classList.remove('hidden');
  $('backToRooms').classList.remove('hidden');
  document.body.classList.add('chat-open');
  renderChatHeader();
  renderMessages();
}

function renderChatHeader(){
  const room = roomById(state.currentRoom);
  const rankId = room.id === 'global' ? 'global' : room.id === 'guild' ? 'master' : room.rankId;
  const rank = rankId === 'global' ? {id:'global',name:'GLOBAL',icon:'◆'} : rankById(rankId);
  $('roomCrest').className = `room-crest rank-${rank.id}`;
  $('roomCrest').textContent = rank.icon;
  $('roomKicker').textContent = room.id === 'guild' ? 'SECURE CHANNEL' : (rank.flame ? 'ELITE CHANNEL' : 'OPEN CHANNEL');
  $('roomTitle').textContent = room.title;
  $('roomSubtitle').textContent = room.subtitle;
  $('roomCount').textContent = room.id === 'guild' ? '7' : String(91 + (rank.level || 0) * 11);
}

function getMessages(){
  return [...(demoMessages[state.currentRoom] || []), ...(state.customMessages[state.currentRoom] || [])];
}

function renderMessages(){
  const box = $('messages');
  box.innerHTML = '';
  getMessages().forEach(msg => {
    const rank = rankById(msg.rankId);
    const self = msg.name === state.user.name;
    const row = document.createElement('article');
    row.className = `message-row${self ? ' self' : ''}`;
    row.innerHTML = `
      <div class="message-avatar rank-${rank.id}${rank.flame ? ' flame' : ''}">${escapeHtml(msg.initials)}</div>
      <div class="message-wrap">
        <div class="message-meta"><strong>${escapeHtml(msg.name)}</strong><span class="rank-tag">${rank.name}</span><span>${escapeHtml(msg.time)}</span></div>
        <div class="message-card rank-${rank.id}">
          ${msg.ticker ? `<div class="message-special-ticker">${escapeHtml(msg.ticker)}</div>` : ''}
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
  renderRooms();
}

function openModal(id){const modal=$(id);modal.classList.remove('hidden');modal.setAttribute('aria-hidden','false')}
function closeModal(id){const modal=$(id);modal.classList.add('hidden');modal.setAttribute('aria-hidden','true')}

function init(){
  document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => closeModal(btn.dataset.close)));
  document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', e => { if(e.target === modal) closeModal(modal.id); }));
  $('showRanksBtn').addEventListener('click', () => openModal('rankModal'));
  $('profileBtn').addEventListener('click', () => openModal('authModal'));
  $('backToRooms').addEventListener('click', backToRooms);
  $('notifyBtn').addEventListener('click', () => showToast('No new notifications in the prototype.'));
  $('adminBtn').addEventListener('click', () => showToast('Admin Control connects in the Supabase phase.'));
  $('guildRoomBtn').addEventListener('click', () => selectRoom('guild'));
  $('roomMenuBtn').addEventListener('click', () => showToast('Room tools will be connected in the next phase.'));
  $('emojiBtn').addEventListener('click', () => { $('messageInput').value += ' 🔥'; $('messageInput').focus(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape'){closeModal('authModal');closeModal('rankModal');} });

  $('registerForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('ffName').value.trim();
    const uid = $('ffUid').value.trim();
    if (!name || !uid) return;
    state.user.name = name;
    state.user.initials = name.replace(/[^a-zA-Z0-9]/g,'').slice(0,2).toUpperCase() || 'FF';
    state.user.approved = true;
    state.user.guildMember = true;
    state.user.rankId = 'bronze';
    state.user.rankLevel = 0;
    renderUser();
    renderRooms();
    closeModal('authModal');
    showToast('Demo account created — Bronze member ready.');
  });

  $('composerForm').addEventListener('submit', e => {
    e.preventDefault();
    const text = $('messageInput').value.trim();
    if (!text) return;
    if (!state.user.approved){openModal('authModal');return;}
    const room = roomById(state.currentRoom);
    if (!room || !canEnter(room)){showToast('This room is locked for your current rank.');return;}
    const now = new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
    state.customMessages[state.currentRoom] ||= [];
    state.customMessages[state.currentRoom].push({name:state.user.name,initials:state.user.initials,rankId:state.user.rankId,time:now,text});
    $('messageInput').value = '';
    renderMessages();
  });

  $('rankList').innerHTML = ranks.map(rank => `
    <div class="rank-item rank-${rank.id}">
      <div class="rank-badge rank-${rank.id}">${rank.icon}</div>
      <div><strong>${rank.name}</strong><small>${rank.rule}</small></div>
      <span class="rule-pill">${rank.id === 'grandmaster' ? 'MONTHLY' : 'TEST'}</span>
    </div>`).join('');

  renderUser();
  renderRooms();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
