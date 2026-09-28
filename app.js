const rooms = [
  { id: 'global', name: 'GLOBAL CHAT', icon: '🌐', subtitle: 'Bronze → Grandmaster • Everyone can chat', minRank: 0 },
  { id: 'bronze', name: 'BRONZE CHAT', icon: '🟤', subtitle: 'Bronze members and above', minRank: 0 },
  { id: 'silver', name: 'SILVER CHAT', icon: '⚪', subtitle: 'Silver members and above', minRank: 1 },
  { id: 'golden', name: 'GOLDEN CHAT', icon: '🟡', subtitle: 'Golden members and above', minRank: 2 },
  { id: 'platinum', name: 'PLATINUM CHAT', icon: '🔷', subtitle: 'Platinum members and above', minRank: 3 },
  { id: 'diamond', name: 'DIAMOND CHAT', icon: '💎', subtitle: 'Diamond members and above', minRank: 4 },
  { id: 'heroic', name: 'HEROIC CHAT', icon: '🔴', subtitle: 'Heroic members and above', minRank: 5 },
  { id: 'master', name: 'MASTER CHAT', icon: '🟣', subtitle: 'Master members and above', minRank: 6 },
  { id: 'grandmaster', name: 'GRANDMASTER CHAT', icon: '👑', subtitle: 'Grandmaster members only', minRank: 7 }
];

const ranks = [
  { id: 'bronze', name: 'BRONZE', css: 'rank-bronze', rule: 'Win 4 rounds in the 1v1 Bronze test.' },
  { id: 'silver', name: 'SILVER', css: 'rank-silver', rule: 'Win a 1v1 test.' },
  { id: 'golden', name: 'GOLDEN', css: 'rank-golden', rule: 'Win a 1v2 test.' },
  { id: 'platinum', name: 'PLATINUM', css: 'rank-platinum', rule: 'Win a 1v3 test.' },
  { id: 'diamond', name: 'DIAMOND', css: 'rank-diamond', rule: 'Win a 1v4 test.' },
  { id: 'heroic', name: 'HEROIC', css: 'rank-heroic', rule: 'From Diamond, win a 1v4 test.' },
  { id: 'master', name: 'MASTER', css: 'rank-master', rule: 'From Heroic, win a 1v4 test.' },
  { id: 'grandmaster', name: 'GRANDMASTER', css: 'rank-grandmaster', rule: 'Monthly tournament for eligible Masters.' }
];

const demoMembers = [
  { name: 'Shadow FF', rank: 5, rankId: 'heroic', initials: 'SF' },
  { name: 'RoyalJoker', rank: 7, rankId: 'grandmaster', initials: 'RJ' },
  { name: 'Dark Wolf', rank: 2, rankId: 'golden', initials: 'DW' },
  { name: 'IceX', rank: 4, rankId: 'diamond', initials: 'IX' }
];

const demoMessages = {
  global: [
    { name: 'Shadow FF', rankId: 'heroic', initials: 'SF', text: 'Welcome to ELITE FF CHAT 🔥', time: '11:02 AM' },
    { name: 'RoyalJoker', rankId: 'grandmaster', initials: 'RJ', text: 'Monthly Grandmaster applications will be announced soon 👑', time: '11:04 AM' },
    { name: 'Dark Wolf', rankId: 'golden', initials: 'DW', text: 'Good luck everyone! 💛', time: '11:07 AM' }
  ],
  bronze: [
    { name: 'Dark Wolf', rankId: 'golden', initials: 'DW', text: 'Bronze room is open for all verified members.', time: '10:58 AM' }
  ],
  silver: [
    { name: 'IceX', rankId: 'diamond', initials: 'IX', text: 'Silver members can practice here.', time: '10:51 AM' }
  ],
  golden: [
    { name: 'RoyalJoker', rankId: 'grandmaster', initials: 'RJ', text: 'Keep climbing. Next stop Platinum. 👑', time: '10:49 AM' }
  ],
  platinum: [
    { name: 'IceX', rankId: 'diamond', initials: 'IX', text: 'Diamond test is waiting.', time: '10:42 AM' }
  ],
  diamond: [
    { name: 'Shadow FF', rankId: 'heroic', initials: 'SF', text: 'Heroic progression starts from Diamond.', time: '10:38 AM' }
  ],
  heroic: [
    { name: 'Shadow FF', rankId: 'heroic', initials: 'SF', text: 'Heroic flame online 🔥', time: '10:31 AM' }
  ],
  master: [
    { name: 'RoyalJoker', rankId: 'grandmaster', initials: 'RJ', text: 'Masters: prepare for the monthly tournament.', time: '10:25 AM' }
  ],
  grandmaster: [
    { name: 'RoyalJoker', rankId: 'grandmaster', initials: 'RJ', text: 'GRANDMASTER LOUNGE — Elite members only 👑🔥', time: '10:20 AM' }
  ]
};

let state = {
  currentRoom: 'global',
  user: {
    name: 'Guest Player',
    rank: 0,
    rankId: 'bronze',
    initials: 'FF',
    approved: false,
    guildMember: false
  },
  customMessages: {}
};

const $ = (id) => document.getElementById(id);
const roomList = $('roomList');
const messagesEl = $('messages');

function rankById(id) {
  return ranks.find(r => r.id === id) || ranks[0];
}

function renderRooms() {
  roomList.innerHTML = '';
  rooms.forEach(room => {
    const canEnter = state.user.rank >= room.minRank;
    const btn = document.createElement('button');
    btn.className = 'room-btn' + (state.currentRoom === room.id ? ' active' : '');
    btn.dataset.room = room.id;
    btn.disabled = !canEnter;
    btn.innerHTML = `
      <span class="room-icon">${room.icon}</span>
      <span class="room-meta"><b>${room.name}</b><small>${room.subtitle}</small></span>
      ${canEnter ? '' : '<span class="lock">🔒</span>'}
    `;
    btn.addEventListener('click', () => selectRoom(room.id));
    roomList.appendChild(btn);
  });
}

function renderHeader() {
  const room = rooms.find(r => r.id === state.currentRoom) || rooms[0];
  $('roomBadge').textContent = room.icon;
  $('roomTitle').textContent = room.name;
  $('roomSubtitle').textContent = room.subtitle;
}

function getMessages() {
  return [...(demoMessages[state.currentRoom] || []), ...(state.customMessages[state.currentRoom] || [])];
}

function renderMessages() {
  messagesEl.innerHTML = '';
  getMessages().forEach(msg => {
    const isSelf = msg.name === state.user.name;
    const rank = rankById(msg.rankId);
    const row = document.createElement('div');
    row.className = 'message-row' + (isSelf ? ' self' : '');
    row.innerHTML = `
      ${isSelf ? '' : `<div class="message-avatar ${rank.css}">${escapeHtml(msg.initials)}</div>`}
      <div class="message-wrap">
        <div class="message-meta">
          <strong>${escapeHtml(msg.name)}</strong>
          <span class="rank-tag">${rank.name}</span>
          <span>${escapeHtml(msg.time)}</span>
        </div>
        <div class="message-bubble">${escapeHtml(msg.text)}</div>
      </div>
      ${isSelf ? `<div class="message-avatar ${rank.css}">${escapeHtml(msg.initials)}</div>` : ''}
    `;
    messagesEl.appendChild(row);
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function selectRoom(roomId) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;
  if (state.user.rank < room.minRank) {
    alert(`You need ${ranks[room.minRank].name} rank to enter this chat.`);
    return;
  }
  state.currentRoom = roomId;
  renderRooms();
  renderHeader();
  renderMessages();
}

function renderUser() {
  const rank = rankById(state.user.rankId);
  $('userName').textContent = state.user.name;
  $('userRank').textContent = `${rank.name} MEMBER`;
  const orb = document.querySelector('.profile-orb');
  orb.className = `profile-orb ${rank.css}`;
  orb.textContent = state.user.initials;

  $('bigRankBadge').className = `big-rank ${rank.css}`;
  $('bigRankBadge').textContent = state.user.initials.charAt(0) || 'E';
  $('bigRankName').textContent = rank.name;
  const pct = Math.max(8, Math.round((state.user.rank / 7) * 100));
  $('rankProgress').style.width = `${pct}%`;
  $('progressText').textContent = state.user.rank === 7 ? 'Grandmaster tournament eligible.' : rank.id === 'bronze' ? '1v1 test: 4 rounds to Silver' : rank.rule;
}

function renderOnline() {
  $('onlineCount').textContent = demoMembers.length + 1;
  const list = $('onlineMembers');
  list.innerHTML = '';
  demoMembers.forEach(member => {
    const rank = rankById(member.rankId);
    const div = document.createElement('div');
    div.className = 'online-member';
    div.innerHTML = `<div class="mini-avatar ${rank.css}">${member.initials}</div><div><b>${member.name}</b><small>${rank.name}</small></div><span class="online-dot"></span>`;
    list.appendChild(div);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[char]);
}

function openModal(id) {
  const modal = $(id);
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal(id) {
  const modal = $(id);
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => closeModal(btn.dataset.close)));
document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal.id); }));
$('rankInfoBtn').addEventListener('click', () => openModal('rankModal'));
$('testBtn').addEventListener('click', () => alert('Rank test system will be connected in the next phase.'));
$('notifyBtn').addEventListener('click', () => alert('No new notifications in this prototype.'));
$('adminBtn').addEventListener('click', () => alert('Admin Panel will be connected to Supabase in the next phase.'));
$('profileBtn').addEventListener('click', () => openModal('authModal'));
$('emojiBtn').addEventListener('click', () => { $('messageInput').value += ' 🔥'; $('messageInput').focus(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') ['authModal','rankModal'].forEach(closeModal);
});

$('composerForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = $('messageInput');
  const text = input.value.trim();
  if (!text) return;
  if (!state.user.approved) {
    openModal('authModal');
    return;
  }
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (!state.customMessages[state.currentRoom]) state.customMessages[state.currentRoom] = [];
  state.customMessages[state.currentRoom].push({
    name: state.user.name,
    rankId: state.user.rankId,
    initials: state.user.initials,
    text,
    time
  });
  input.value = '';
  renderMessages();
});

$('registerForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('ffName').value.trim();
  const uid = $('ffUid').value.trim();
  if (!name || !uid) return;
  state.user.name = name;
  state.user.initials = name.slice(0,2).toUpperCase();
  state.user.approved = true;
  // Prototype: newly registered members start as Bronze. Backend approval comes later.
  state.user.guildMember = true;
  renderUser();
  renderRooms();
  renderOnline();
  closeModal('authModal');
  alert('Demo account created. You are now a Bronze member in this prototype.');
});

function renderRankList() {
  $('rankList').innerHTML = ranks.map((r, index) => `
    <div class="rank-item">
      <div class="badge ${r.css}">${index === 7 ? 'GM' : index + 1}</div>
      <div><b>${r.name}</b><small>${r.rule}</small></div>
      <div class="rule">${index === 7 ? 'MONTHLY' : 'TEST'}</div>
    </div>
  `).join('');
}

renderRankList();
renderRooms();
renderHeader();
renderUser();
renderOnline();
renderMessages();
