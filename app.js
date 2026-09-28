const rankDefs = [
  {id:'bronze',name:'BRONZE',animal:'eagle',color:'#e49351',rgb:'228,147,81',level:0,rule:'4 rounds won in a 1v1 test.',flame:false},
  {id:'silver',name:'SILVER',animal:'wolf',color:'#e6edf8',rgb:'230,237,248',level:1,rule:'Win the 1v1 rank test.',flame:false},
  {id:'golden',name:'GOLDEN',animal:'lion',color:'#ffd35a',rgb:'255,211,90',level:2,rule:'Win the 1v2 challenge.',flame:false},
  {id:'platinum',name:'PLATINUM',animal:'eagle',color:'#77e5ff',rgb:'119,229,255',level:3,rule:'Win the 1v3 challenge.',flame:false},
  {id:'diamond',name:'DIAMOND',animal:'wolf',color:'#52aaff',rgb:'82,170,255',level:4,rule:'Win the 1v4 challenge.',flame:false},
  {id:'heroic',name:'HEROIC',animal:'phoenix',color:'#ff4437',rgb:'255,68,55',level:5,rule:'From Diamond, win a 1v4.',flame:true},
  {id:'master',name:'MASTER',animal:'tiger',color:'#e7b74a',rgb:'231,183,74',level:6,rule:'From Heroic, win a 1v4.',flame:true},
  {id:'grandmaster',name:'GRANDMASTER',animal:'crown',color:'#ffd96a',rgb:'255,217,106',level:7,rule:'Monthly tournament for Masters.',flame:true}
];

const rooms = [
  {id:'global',title:'GLOBAL CHAT',subtitle:'Bronze → Grandmaster · Everyone can chat',rankId:'global',min:0,req:'ALL MEMBERS'},
  ...rankDefs.map(r=>({id:r.id,title:`${r.name} CHAT`,subtitle:`${r.name} members and above`,rankId:r.id,min:r.level,req:r.rule}))
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
  user:{name:'OWNER ADMIN',initials:'OA',ffUid:'0000000000',rankId:'bronze',rankLevel:0,approved:true,guildMember:true,isOwner:true,role:'OWNER',moderatorRoom:null},
  customMessages:{},
  moderators:[]
};

const $=id=>document.getElementById(id);
const rankById=id=>rankDefs.find(r=>r.id===id)||rankDefs[0];
const roomById=id=>rooms.find(r=>r.id===id)||(id==='guild'?{id:'guild',title:'HIDDEN GUILD',subtitle:'Skull & Bones · Verified guild members only',rankId:'master',min:0,req:'VERIFIED GUILD'}:null);

function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function showToast(msg){const t=$('toast');t.textContent=msg;t.classList.remove('hidden');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.add('hidden'),2500)}
function openModal(id){$(id).classList.remove('hidden');$(id).setAttribute('aria-hidden','false')}
function closeModal(id){$(id).classList.add('hidden');$(id).setAttribute('aria-hidden','true')}
function rankClass(id){return id==='global'?'rank-global':`rank-${id}`}

function animalArt(type,x=50,y=38){
  const common=`<circle cx="${x}" cy="${y}" r="25" class="badge-highlight"/>`;
  if(type==='eagle') return common+`<path d="M28 43 38 31l12 7 12-7 10 12-8 18-14-7-14 7z" class="animal-fill"/><path d="M48 41 41 56l7-5 7 5-7-15z" class="animal-dark"/><path d="M30 44 16 35l8 17M70 44l14-9-8 17" class="animal-stroke"/>`;
  if(type==='wolf') return common+`<path d="M29 41 24 28l12 7 14-7 12 7 13-7-5 13 3 12-12 14-18 5-18-12-3-18z" class="animal-fill"/><path d="M38 44 45 52l10-8M42 60h16" class="animal-stroke"/><circle cx="40" cy="45" r="2.5" fill="#62c7ff"/><circle cx="60" cy="45" r="2.5" fill="#62c7ff"/>`;
  if(type==='lion') return common+`<path d="M27 48c-2-17 11-30 23-30s25 13 23 30c-1 18-10 28-23 28S28 66 27 48z" fill="rgba(255,197,67,.30)" stroke="rgba(255,230,152,.8)" stroke-width="2"/><path d="M37 47c0-11 6-18 13-18s13 7 13 18c0 12-5 20-13 20s-13-8-13-20z" class="animal-fill"/><path d="M41 48 50 57l9-9M46 62h8" class="animal-stroke"/>`;
  if(type==='phoenix') return common+`<path d="M50 18 59 34l16-10-6 18 15 6-19 4 6 18-21-14-21 14 6-18-19-4 15-6-6-18 16 10z" fill="rgba(255,68,55,.36)" stroke="rgba(255,155,133,.95)" stroke-width="2"/><path d="M50 31c-8 10-9 19 0 34 9-15 8-24 0-34z" fill="#fff"/><path d="M50 42 40 50M50 42l10 8" class="animal-stroke"/>`;
  if(type==='tiger') return common+`<path d="M28 36 34 26l8 6 8-8 8 8 8-6 6 10-3 27-19 8-19-8z" fill="rgba(255,211,89,.34)" stroke="rgba(255,239,177,.88)" stroke-width="2"/><path d="M35 43c0-8 6-14 15-14s15 6 15 14c0 12-6 20-15 20s-15-8-15-20z" class="animal-fill"/><path d="M42 43 50 51l8-8M44 58h12M35 40l-7 8M65 40l7 8" class="animal-stroke"/>`;
  if(type==='crown') return `<path d="M18 59 24 30 39 44 50 21 61 44 76 30 82 59z" fill="rgba(255,215,106,.26)" stroke="rgba(255,240,184,.95)" stroke-width="2"/><path d="M24 63h52l-4 12H28z" fill="rgba(255,217,106,.16)" stroke="rgba(255,217,106,.75)" stroke-width="1.8"/><circle cx="24" cy="30" r="3.2" class="badge-gem"/><circle cx="50" cy="21" r="3.2" class="badge-gem"/><circle cx="76" cy="30" r="3.2" class="badge-gem"/>`;
  return `<path d="M50 18 62 35 80 42 63 50 50 72 37 50 20 42 38 35z" class="animal-fill"/>`;
}

function badgeSvg(rankId, mode='card'){
  const global = rankId==='global';
  const r = global ? {id:'global',name:'GLOBAL',animal:'crystal',color:'#51abff',rgb:'81,171,255'} : rankById(rankId);
  const title = mode==='mini' ? '' : `<text x="50" y="88" text-anchor="middle" class="rank-name-svg">${escapeHtml(r.name)}</text>`;
  const sub = mode==='card' ? `<text x="50" y="96" text-anchor="middle" class="rank-sub-svg">${global?'ALL':'ELITE'}</text>` : '';
  const defs=`<defs><linearGradient id="g-${r.id}" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".32" stop-color="${r.color}" stop-opacity=".72"/><stop offset="1" stop-color="#020407" stop-opacity=".9"/></linearGradient><linearGradient id="m-${r.id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".92"/><stop offset="1" stop-color="${r.color}" stop-opacity=".72"/></linearGradient></defs>`;
  const frame=`<path d="M22 6H78L94 22V76L78 94H22L6 78V22z" class="badge-frame" fill="url(#g-${r.id})"/><path d="M28 12H72L88 28V70L72 88H28L12 72V28z" class="badge-highlight"/>`;
  const animal = r.animal==='crystal' ? `<path d="M50 16 68 34 78 50 65 67 50 80 35 67 22 50 32 34z" fill="rgba(122,197,255,.38)" stroke="rgba(223,245,255,.94)" stroke-width="2"/><path d="M50 24 58 42 50 73 42 42z" fill="rgba(255,255,255,.46)"/>` : animalArt(r.animal);
  const flame = r.flame ? `<g opacity=".96"><path d="M20 78c6-8 6-16 2-23 12 4 17 12 15 22 8-7 12-14 9-25 13 9 16 22 10 33-4 8-11 12-18 12-10 0-19-7-18-19z" fill="${r.color}" opacity=".55"/><path d="M30 78c5-7 5-12 2-17 7 3 10 8 9 14 4-4 6-9 5-15 8 7 9 15 5 23-3 5-7 8-12 8-6 0-10-4-9-13z" fill="#fff" opacity=".55"/></g>` : '';
  return `<svg class="rank-badge-svg ${rankClass(r.id)} ${r.flame?'is-flame':''}" viewBox="0 0 100 110" role="img" aria-label="${escapeHtml(r.name)} badge">${defs}${flame}${frame}${animal}${title}${sub}${global?'<circle cx="82" cy="18" r="4" class="badge-gem"/>':''}</svg>`;
}

function setRootTheme(rankId){
  const r=rankId==='global'?{id:'global',color:'#51abff',rgb:'81,171,255'}:rankById(rankId);
  document.documentElement.style.setProperty('--rank',r.color);document.documentElement.style.setProperty('--rank-rgb',r.rgb);document.documentElement.style.setProperty('--rank-soft',`rgba(${r.rgb},.12)`);document.documentElement.style.setProperty('--rank-glow',`rgba(${r.rgb},.28)`);
}

function canEnter(room){
  if(!room)return false;
  if(state.user.isOwner)return true;
  if(room.id==='guild')return state.user.guildMember;
  if(state.user.role==='MODERATOR' && state.user.moderatorRoom===room.id)return true;
  if(room.id==='global')return true;
  return state.user.rankLevel>=room.min;
}

function renderBadgeInto(el,rankId,mode='card'){if(el)el.innerHTML=badgeSvg(rankId,mode)}

function renderRooms(){
  const list=$('roomList');list.innerHTML='';
  rooms.forEach(room=>{
    const rank=room.id==='global'?{id:'global',name:'GLOBAL',flame:false}:{...rankById(room.rankId)};
    const open=canEnter(room); const high=rank.flame;
    const card=document.createElement('button');card.type='button';card.className=`room-card ${rankClass(rank.id)} ${high?'high-rank':''} ${open?'':'locked'}`;
    card.style.setProperty('--accent',rank.color||'#51abff');card.style.setProperty('--accent-rgb',rank.rgb||'81,171,255');card.style.setProperty('--soft',`rgba(${rank.rgb||'81,171,255'},.10)`);
    card.innerHTML=`<span class="corner-line"></span><span class="corner-line r"></span><div class="room-top"><div class="rank-visual ${high?'flame-aura':''}">${badgeSvg(rank.id,'card')}</div><span class="room-status ${open?'':'locked'}">${open?'OPEN':'LOCKED'}</span></div><div class="room-body"><h4>${room.title}</h4><p>${escapeHtml(room.subtitle)}</p></div><div class="room-bottom"><span class="room-req">${escapeHtml(room.req)}</span><span class="enter-label">${open?'ENTER ROOM':'UNAVAILABLE'} <span>${open?'↗':'🔒'}</span></span></div>`;
    card.addEventListener('click',()=>selectRoom(room.id));list.appendChild(card);
  });
}

function renderUser(){
  const r=rankById(state.user.rankId);$('userName').textContent=state.user.name;$('userRank').textContent=`${r.name} MEMBER`;$('memberRole').textContent=state.user.isOwner?'OWNER ADMIN':state.user.role;
  renderBadgeInto($('memberBadge'),r.id,'mini');renderBadgeInto($('topBadge'),r.id,'mini');renderBadgeInto($('authMark'),r.id,'mini');
}

function selectRoom(roomId){
  const room=roomById(roomId);if(!room)return;
  if(!canEnter(room)){showToast(room.id==='guild'?'Hidden Guild is for verified guild members only.':`Reach ${rankById(room.rankId).name} or receive moderator access to enter this room.`);return;}
  state.currentRoom=room.id;setRootTheme(room.id==='global'?'global':room.rankId);$('roomBrowser').classList.add('hidden');$('chatScreen').classList.remove('hidden');$('backToRooms').classList.remove('hidden');renderChatHeader();renderMessages();window.scrollTo({top:0,behavior:'smooth'});
}

function renderChatHeader(){
  const room=roomById(state.currentRoom);const rank=room.id==='global'?{id:'global',name:'GLOBAL',flame:false}:{...rankById(room.rankId)};
  renderBadgeInto($('roomCrest'),rank.id,'mini');$('roomKicker').textContent=room.id==='guild'?'SECURE CHANNEL':rank.flame?'ELITE CHANNEL':room.id==='global'?'OPEN CHANNEL':'RANK CHANNEL';$('roomTitle').textContent=room.title;$('roomSubtitle').textContent=room.subtitle;$('roomCount').textContent=room.id==='guild'?'8':String(110+(rank.level||0)*13);
  $('chatNotice').innerHTML=room.id==='guild'?'SKULL & BONES <span>•</span> VERIFIED GUILD MEMBERS ONLY':rank.id==='grandmaster'?'GRANDMASTER LOUNGE <span>•</span> MONTHLY ELITE CHANNEL':`${rank.name} CHAT <span>•</span> RESPECT THE COMMUNITY`;
}

function getMessages(){return [...(demoMessages[state.currentRoom]||[]),...(state.customMessages[state.currentRoom]||[])];}
function renderMessages(){
  const box=$('messages');box.innerHTML='';getMessages().forEach(msg=>{
    const r=rankById(msg.rankId);const row=document.createElement('article');row.className=`message-row${msg.name===state.user.name?' self':''}`;const avatarClass=`message-avatar ${rankClass(r.id)} ${r.flame?'flame-aura':''}`;
    row.innerHTML=`<div class="${avatarClass}">${badgeSvg(r.id,'mini')}</div><div class="message-wrap"><div class="message-meta"><strong>${escapeHtml(msg.name)}</strong><span class="rank-tag ${rankClass(r.id)}">${r.name}</span><span>${escapeHtml(msg.time)}</span></div><div class="message-card ${rankClass(r.id)} ${r.flame?'flame-card':''}">${msg.ticker?`<div class="message-special-ticker">${escapeHtml(msg.ticker)}</div>`:''}<div>${escapeHtml(msg.text)}</div></div></div>`;box.appendChild(row);
  });
}

function backToRooms(){state.currentRoom=null;setRootTheme('global');$('chatScreen').classList.add('hidden');$('roomBrowser').classList.remove('hidden');$('backToRooms').classList.add('hidden');renderRooms();window.scrollTo({top:0,behavior:'smooth'})}

function populateAdminRoomSelect(){const select=$('modRoomSelect');select.innerHTML=rooms.map(r=>`<option value="${r.id}">${r.title}</option>`).join('')+'<option value="guild">HIDDEN GUILD</option>';}
function renderModerators(){
  const list=$('moderatorList');if(!state.moderators.length){list.innerHTML=`<div class="moderator-row"><div><strong>No moderators assigned</strong><small>Owner can assign one group to each moderator.</small></div><span class="access-pill">OWNER ONLY</span></div>`;return;}
  list.innerHTML=state.moderators.map(m=>`<div class="moderator-row"><div><strong>${escapeHtml(m.name)}</strong><small>${escapeHtml(m.roomTitle)} • TEST / ADD / REMOVE / BAN IN THIS ROOM ONLY</small></div><span class="access-pill">GROUP MOD</span></div>`).join('');
}

function openAdmin(){if(!state.user.isOwner){showToast('Owner Admin only.');return;}populateAdminRoomSelect();renderModerators();openModal('adminModal')}

function init(){
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
  document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m.id)}));
  $('showRanksBtn').addEventListener('click',()=>openModal('rankModal'));
  $('profileBtn').addEventListener('click',()=>openModal('authModal'));
  $('backToRooms').addEventListener('click',backToRooms);
  $('notifyBtn').addEventListener('click',()=>showToast('No new notifications in the prototype.'));
  $('adminBtn').addEventListener('click',openAdmin);
  $('guildRoomBtn').addEventListener('click',()=>selectRoom('guild'));
  $('roomMenuBtn').addEventListener('click',()=>showToast('Room tools are owner/moderator scoped in the production build.'));
  $('emojiBtn').addEventListener('click',()=>{$('messageInput').value+=' 🔥';$('messageInput').focus()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){['authModal','rankModal','adminModal'].forEach(closeModal)}});

  $('registerForm').addEventListener('submit',e=>{e.preventDefault();const name=$('ffName').value.trim(),uid=$('ffUid').value.trim();if(!name||!uid)return;state.user={name,initials:(name.replace(/[^a-zA-Z0-9]/g,'').slice(0,2)||'FF').toUpperCase(),ffUid:uid,rankId:'bronze',rankLevel:0,approved:false,guildMember:false,isOwner:false,role:'MEMBER',moderatorRoom:null};renderUser();renderRooms();closeModal('authModal');showToast('Registration submitted — awaiting owner approval.');});

  $('composerForm').addEventListener('submit',e=>{e.preventDefault();const text=$('messageInput').value.trim();if(!text)return;if(!state.user.approved){openModal('authModal');return;}const room=roomById(state.currentRoom);if(!room||!canEnter(room)){showToast('This room is locked for your current permissions.');return;}const now=new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});state.customMessages[state.currentRoom]??=[];state.customMessages[state.currentRoom].push({name:state.user.name,initials:state.user.initials,rankId:state.user.rankId,time:now,text});$('messageInput').value='';renderMessages();});

  $('assignModBtn').addEventListener('click',()=>{const roomId=$('modRoomSelect').value;const room=roomById(roomId);const name=`Moderator ${String(state.moderators.length+1).padStart(2,'0')}`;state.moderators.push({name,roomId,roomTitle:room?room.title:'HIDDEN GUILD'});renderModerators();showToast(`${name} assigned to ${room?room.title:'HIDDEN GUILD'} only.`)});
  document.querySelectorAll('.admin-action').forEach(b=>b.addEventListener('click',()=>showToast(`${b.dataset.ownerAction} — owner control confirmed.`)));

  $('rankList').innerHTML=rankDefs.map(r=>`<div class="rank-item ${rankClass(r.id)}"><div class="rank-visual ${r.flame?'flame-aura':''}">${badgeSvg(r.id,'card')}</div><div><strong>${r.name}</strong><small>${escapeHtml(r.rule)}</small></div><span class="rank-pill">${r.id==='grandmaster'?'MONTHLY':'TEST'}</span></div>`).join('');
  setRootTheme('global');renderUser();renderRooms();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
