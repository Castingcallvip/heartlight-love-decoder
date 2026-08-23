const authScreen=document.getElementById('authScreen');
const appScreen=document.getElementById('appScreen');
const toast=document.getElementById('toast');
let decodeTotal=0;

const user={name:'Alex Morgan',email:'alex@example.com'};

function showToast(message){
  toast.textContent=message;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),2200);
}

function initials(name){
  return name.trim().split(/\s+/).slice(0,2).map(part=>part[0]||'').join('').toUpperCase()||'U';
}

function enterApp(name,email){
  if(name) user.name=name;
  if(email) user.email=email;
  syncProfile();
  authScreen.classList.remove('active');
  appScreen.classList.add('active');
  showToast('Welcome to HeartLight');
}

function syncProfile(){
  const first=user.name.split(' ')[0]||'Friend';
  document.getElementById('greeting').textContent='Hi, '+first;
  document.getElementById('miniProfile').textContent=initials(user.name).slice(0,1);
  document.getElementById('profileInitials').textContent=initials(user.name);
  document.getElementById('profileNameText').textContent=user.name;
  document.getElementById('profileEmailText').textContent=user.email;
  document.getElementById('profileName').value=user.name;
  document.getElementById('profileEmail').value=user.email;
}

function switchTab(tabId){
  document.querySelectorAll('.tab-page').forEach(page=>page.classList.toggle('active',page.id===tabId));
  document.querySelectorAll('.nav-item').forEach(item=>item.classList.toggle('active',item.dataset.tab===tabId));
}

document.querySelectorAll('[data-auth-tab]').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('[data-auth-tab]').forEach(btn=>btn.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.auth-panel').forEach(panel=>panel.classList.remove('active'));
    document.getElementById(button.dataset.authTab+'Form').classList.add('active');
  });
});

document.getElementById('loginForm').addEventListener('submit',event=>{
  event.preventDefault();
  enterApp('Alex Morgan',document.getElementById('loginEmail').value||'alex@example.com');
});

document.getElementById('signupForm').addEventListener('submit',event=>{
  event.preventDefault();
  enterApp(document.getElementById('signupName').value,document.getElementById('signupEmail').value);
});

document.querySelectorAll('.social-btn').forEach(button=>{
  button.addEventListener('click',()=>enterApp(button.dataset.social+' User','hello@heartlight.app'));
});

document.querySelectorAll('.nav-item').forEach(item=>item.addEventListener('click',()=>switchTab(item.dataset.tab)));
document.querySelectorAll('[data-tab-target]').forEach(button=>button.addEventListener('click',()=>switchTab(button.dataset.tabTarget)));
document.getElementById('miniProfile').addEventListener('click',()=>switchTab('profilePage'));

function analyzeConversation(text){
  const lower=text.toLowerCase();
  const flags={green:[],yellow:[],red:[]};
  if(/thank|appreciate|respect|understand|sorry|honest|plan|call/.test(lower)) flags.green.push('Shows care, accountability, or willingness to communicate.');
  if(/busy|maybe|later|idk|whatever|fine|seen|left on read/.test(lower)) flags.yellow.push('May need clarification because tone or consistency is unclear.');
  if(/stupid|crazy|shut up|hate|control|jealous|threat|block you|worthless/.test(lower)) flags.red.push('Contains language that may be disrespectful, controlling, or emotionally unsafe.');
  if(!text.trim()) flags.yellow.push('Paste a conversation to receive a more useful reflection.');
  if(!flags.green.length&&!flags.yellow.length&&!flags.red.length) flags.yellow.push('No strong pattern detected. Consider context, consistency, and actions over time.');
  return flags;
}

function renderDecode(){
  const text=document.getElementById('conversationInput').value;
  const flags=analyzeConversation(text);
  const meaning=text.trim()? 'Possible meaning: the person may be expressing emotion, uncertainty, interest, or avoidance. The safest next step is to ask clearly rather than assume intent.' : 'Add a conversation to explore possible meaning.';
  const responses=[
    'I want to understand you correctly. What did you mean by that?',
    'I care about this conversation, and I also need us to speak respectfully.',
    'Can we talk when we both have time to be clear and calm?',
    'I am open to listening, but I do not want to guess your intentions.'
  ];
  document.getElementById('decodeResults').innerHTML=`
    <div class='result-card'>
      <h3>Possible meaning</h3>
      <p class='muted'>${meaning}</p>
    </div>
    <div class='result-card'>
      <h3>Flags to notice</h3>
      <div class='chips'>
        ${flags.green.map(f=>`<span class='chip green'>Green: ${f}</span>`).join('')}
        ${flags.yellow.map(f=>`<span class='chip yellow'>Yellow: ${f}</span>`).join('')}
        ${flags.red.map(f=>`<span class='chip red'>Red: ${f}</span>`).join('')}
      </div>
    </div>
    <div class='result-card'>
      <h3>Healthy response options</h3>
      <ul class='response-list'>${responses.map(r=>`<li>${r}</li>`).join('')}</ul>
    </div>`;
  decodeTotal++;
  document.getElementById('decodeCount').textContent=decodeTotal;
  const activity=document.getElementById('activityList');
  const li=document.createElement('li');
  li.innerHTML='<span class=\'dot green\'></span><div><b>Conversation decoded</b><small>Healthy response options were generated.</small></div>';
  activity.prepend(li);
  showToast('Message decoded');
}

document.getElementById('decodeBtn').addEventListener('click',renderDecode);

const reflections=[
  ['Gentle wisdom','Let your response be shaped by patience, honesty, and peace. You can be compassionate without abandoning your boundaries.'],
  ['Guard your heart','A guarded heart is not a closed heart. It is a heart that invites trust through consistency and truth.'],
  ['Love with clarity','Love is patient and kind, but it is also truthful. Ask for clarity without accusation.'],
  ['Peaceful courage','You do not need to chase certainty. Choose the next faithful, healthy step.']
];

document.getElementById('newReflectionBtn').addEventListener('click',()=>{
  const item=reflections[Math.floor(Math.random()*reflections.length)];
  document.getElementById('verseTitle').textContent=item[0];
  document.getElementById('reflectionText').textContent=item[1];
});

document.getElementById('saveJournalBtn').addEventListener('click',()=>{
  const input=document.getElementById('journalInput');
  if(input.value.trim()){
    input.value='';
    showToast('Reflection saved');
  }else{
    showToast('Write a reflection first');
  }
});

document.getElementById('profileForm').addEventListener('submit',event=>{
  event.preventDefault();
  user.name=document.getElementById('profileName').value||'HeartLight User';
  user.email=document.getElementById('profileEmail').value||'hello@heartlight.app';
  syncProfile();
  showToast('Profile updated');
});

document.getElementById('logoutBtn').addEventListener('click',()=>{
  appScreen.classList.remove('active');
  authScreen.classList.add('active');
  switchTab('dashboardPage');
  showToast('Logged out');
});

syncProfile();