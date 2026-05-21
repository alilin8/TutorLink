<script>
// ── Subject to levels map ──
const subjectLevels = {
  Math:      ['Pre-Algebra','Algebra I','Algebra II','Geometry','Pre-Calc','Calculus','AP Calculus','Statistics','AP Statistics','Honors Math'],
  English:   ['Regular English','Honors English','AP English Language','AP English Literature'],
  Writing:   ['Regular Writing','Honors Writing','AP Writing'],
  History:   ['Regular History','Honors History','AP US History','AP World History','AP Government'],
  Biology:   ['Regular Biology','Honors Biology','AP Biology'],
  Chemistry: ['Regular Chemistry','Honors Chemistry','AP Chemistry'],
  Physics:   ['Regular Physics','Honors Physics','AP Physics 1','AP Physics 2','AP Physics C'],
  Spanish:   ['Spanish 1','Spanish 2','Spanish 3','AP Spanish'],
  French:    ['French 1','French 2','French 3','AP French'],
  Mandarin:  ['Mandarin 1','Mandarin 2','Mandarin 3','AP Mandarin'],
};

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const tutorData = [
  { name:'Jordan K.', initials:'JK', grade:'11th grade',
    subjects:['Math','Physics'], levels:['Pre-Algebra','Algebra I','Geometry','Regular Physics','Honors Physics'],
    availDays:['Mon','Wed','Thu'], availDesc:'Mon, Wed, Thu afternoons',
    rating:'4.9', color:'var(--sage-light)', textColor:'var(--sage-dark)',
    bio:'Junior at Lincoln High. Got a 5 on AP Calc BC and love making math click for younger students. Patient and organized.',
    reviews:[{name:'Alex L.',text:'Jordan explained algebra in a way that finally made sense to me. 10/10.',stars:5},{name:'Parent of Maya P.',text:'Our daughter went from a C to an A in one semester. Highly recommend.',stars:5}]},
  { name:'Priya M.', initials:'PM', grade:'10th grade',
    subjects:['English','Writing','History'], levels:['Regular English','Honors English','AP English Language','Regular History','Honors History','AP US History'],
    availDays:['Tue','Fri','Sat','Sun'], availDesc:'Tue, Fri afternoons + weekends',
    rating:'5.0', color:'#fdf3e7', textColor:'#7a5012',
    bio:'Sophomore passionate about literature and writing. Published in the school literary journal twice. Great at essay structure and close reading.',
    reviews:[{name:'Sam R.',text:'She helped me rewrite my college essay and it was so much better.',stars:5},{name:'Parent of Casey M.',text:'Very professional and punctual. My son loves working with her.',stars:5}]},
  { name:'Ethan S.', initials:'ES', grade:'12th grade',
    subjects:['Math','Chemistry'], levels:['Algebra II','Pre-Calc','Calculus','AP Calculus','Regular Chemistry','Honors Chemistry','AP Chemistry'],
    availDays:['Mon','Tue','Wed','Thu'], availDesc:'Mon–Thu evenings',
    rating:'4.8', color:'#eaf1fd', textColor:'#185fa5',
    bio:'Senior heading to MIT next fall. Strong in STEM, especially math and chemistry. Uses real-world examples to explain abstract concepts.',
    reviews:[{name:'Parent of Riley T.',text:'Ethan is fantastic. Explained stoichiometry better than the teacher.',stars:5},{name:'Maya P.',text:'Super smart and actually explains his work. Would book again.',stars:4}]},
  { name:'Ava T.', initials:'AT', grade:'9th grade',
    subjects:['Spanish','English'], levels:['Spanish 1','Spanish 2','Spanish 3','Regular English','Honors English'],
    availDays:['Wed','Thu','Sat'], availDesc:'Wed, Thu, Sat',
    rating:'4.9', color:'#fdeaea', textColor:'#a32d2d',
    bio:'Native Spanish speaker, born in Bogotá. Fluent in both English and Spanish. Great at conversational practice and grammar.',
    reviews:[{name:'Alex L.',text:'Ava makes Spanish feel easy and fun. My pronunciation has improved a lot.',stars:5}]},
  { name:'Marcus L.', initials:'ML', grade:'11th grade',
    subjects:['Biology','Chemistry'], levels:['Regular Biology','Honors Biology','AP Biology','Regular Chemistry'],
    availDays:['Tue','Thu','Sun'], availDesc:'Tue, Thu, Sun',
    rating:'4.7', color:'#eaf3de', textColor:'#27500a',
    bio:'Biology nerd. Placed 2nd in the state science fair. Breaks down complex processes (cell division, osmosis) into clear, memorable steps.',
    reviews:[{name:'Parent of Sam R.',text:'Marcus is patient and thorough. My son finally understands photosynthesis.',stars:5}]},
  { name:'Zoe W.', initials:'ZW', grade:'10th grade',
    subjects:['Math','English','French'], levels:['Pre-Algebra','Algebra I','Regular English','French 1','French 2','French 3'],
    availDays:['Mon','Wed','Fri'], availDesc:'Mon, Wed, Fri',
    rating:'5.0', color:'var(--sage-light)', textColor:'var(--sage-dark)',
    bio:'Trilingual (English, French, Mandarin). Math tutor since 8th grade with 30+ sessions. Very patient with younger learners.',
    reviews:[{name:'Parent of Alex L.',text:'Zoe is wonderful. She adapts to how my daughter learns.',stars:5},{name:'Casey M.',text:'She explains things step by step and never makes me feel dumb.',stars:5}]},
];

// ── Render tutor cards ──
function renderTutors(data) {
  const grid = document.getElementById('tutors-grid');
  if (!data.length) { grid.innerHTML = '<div style="padding:3rem;text-align:center;color:var(--ink-muted);font-size:15px;grid-column:1/-1">No tutors match your filters. Try adjusting your search.</div>'; return; }
  grid.innerHTML = data.map(t => `
    <div class="tutor-card">
      <div class="tutor-card-header">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="tutor-avatar" style="background:${t.color};color:${t.textColor}">${t.initials}</div>
          <div>
            <div class="tutor-name" style="cursor:pointer;color:var(--sage);text-decoration:underline;text-underline-offset:2px" onclick="viewTutorProfile('${t.name}')">${t.name}</div>
            <div class="tutor-grade">${t.grade}</div>
          </div>
        </div>
        <div class="tutor-rating">★ ${t.rating}</div>
      </div>
      <div class="tutor-subjects">${t.subjects.map(s=>`<span class="subject-tag">${s}</span>`).join('')}</div>
      <div style="font-size:12px;color:var(--ink-muted);margin-bottom:0.75rem">${t.levels.slice(0,4).join(' · ')}${t.levels.length>4?' · …':''}</div>
      <div class="tutor-avail"><span class="avail-dot"></span>${t.availDesc}</div>
      <button class="btn btn-outline btn-full" style="font-size:13px;padding:9px" onclick="openBooking('${t.name}')">Request session</button>
    </div>`).join('');
}
renderTutors(tutorData);

// ── Day filter pills ──
let activeDays = new Set();
function buildDayPills() {
  const wrap = document.getElementById('filter-days-wrap');
  wrap.innerHTML = DAYS.map(d => `<div class="day-pill" id="daypill-${d}" onclick="toggleDay('${d}')" style="padding:6px 12px;border:1.5px solid var(--border);border-radius:99px;font-size:13px;font-weight:500;cursor:pointer;background:var(--cream);transition:all 0.12s">${d}</div>`).join('');
}
buildDayPills();

function toggleDay(d) {
  if (activeDays.has(d)) { activeDays.delete(d); }
  else { activeDays.add(d); }
  const pill = document.getElementById('daypill-'+d);
  if (activeDays.has(d)) { pill.style.background='var(--sage)'; pill.style.borderColor='var(--sage)'; pill.style.color='white'; }
  else { pill.style.background='var(--cream)'; pill.style.borderColor='var(--border)'; pill.style.color=''; }
  applyFilters();
}

// ── Subject change: show/hide level dropdown ──
function onSubjectChange() {
  const subj = document.getElementById('filter-subject').value;
  const levelSel = document.getElementById('filter-level');
  if (subj && subjectLevels[subj]) {
    levelSel.style.display = '';
    levelSel.innerHTML = '<option value="">All levels</option>' + subjectLevels[subj].map(l=>`<option value="${l}">${l}</option>`).join('');
  } else {
    levelSel.style.display = 'none';
    levelSel.value = '';
  }
  applyFilters();
}

// ── Apply all filters ──
function applyFilters() {
  const subj = document.getElementById('filter-subject').value;
  const lvl  = document.getElementById('filter-level').value;
  let filtered = tutorData;
  if (subj)           filtered = filtered.filter(t => t.subjects.includes(subj));
  if (lvl)            filtered = filtered.filter(t => t.levels.includes(lvl));
  if (activeDays.size) filtered = filtered.filter(t => [...activeDays].every(d => t.availDays.includes(d)));
  renderTutors(filtered);
}

// ── Tutor profile view ──
function viewTutorProfile(name) {
  const t = tutorData.find(x => x.name === name);
  if (!t) return;
  document.getElementById('profile-content').innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:1.5rem">
      <div class="tutor-avatar" style="width:72px;height:72px;font-size:1.6rem;background:${t.color};color:${t.textColor}">${t.initials}</div>
      <div>
        <div style="font-family:var(--serif);font-size:1.8rem;margin-bottom:2px">${t.name}</div>
        <div style="color:var(--ink-muted);font-size:14px">${t.grade} · ★ ${t.rating}</div>
      </div>
    </div>
    <div style="background:var(--warm-white);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;margin-bottom:1rem">
      <div class="section-label" style="margin-bottom:6px">About</div>
      <p style="font-size:14px;color:var(--ink-light);line-height:1.7">${t.bio}</p>
    </div>
    <div style="background:var(--warm-white);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;margin-bottom:1rem">
      <div class="section-label" style="margin-bottom:8px">Subjects & levels</div>
      <div class="tutor-subjects">${t.subjects.map(s=>`<span class="subject-tag">${s}</span>`).join('')}</div>
      <div style="font-size:13px;color:var(--ink-muted);margin-top:8px">${t.levels.join(' · ')}</div>
    </div>
    <div style="background:var(--warm-white);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;margin-bottom:1rem">
      <div class="section-label" style="margin-bottom:8px">Availability</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${t.availDays.map(d=>`<span style="padding:4px 12px;background:var(--sage-light);color:var(--sage-dark);border-radius:99px;font-size:13px;font-weight:500">${d}</span>`).join('')}</div>
    </div>
    <div style="background:var(--warm-white);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;margin-bottom:1.5rem">
      <div class="section-label" style="margin-bottom:12px">Reviews</div>
      ${t.reviews.map(r=>`<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:0.5px solid var(--border)">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:13px;font-weight:600">${r.name}</span>
          <span style="color:var(--amber);font-size:13px">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</span>
        </div>
        <p style="font-size:13px;color:var(--ink-light);line-height:1.6">${r.text}</p>
      </div>`).join('')}
    </div>
    <button class="btn btn-primary btn-large btn-full" onclick="openBooking('${t.name}')">Request a session with ${t.name.split(' ')[0]}</button>
  `;
  goto('tutor-profile');
}

// ── Student profile view (tutor side) ──
function viewStudentProfile(name, grade, subject, time) {
  const initials = name.split(' ').map(w=>w[0]).join('');
  document.getElementById('student-profile-content').innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:1.5rem">
      <div class="avatar" style="width:64px;height:64px;font-size:1.4rem">${initials}</div>
      <div>
        <div style="font-family:var(--serif);font-size:1.8rem;margin-bottom:2px">${name}</div>
        <div style="color:var(--ink-muted);font-size:14px">${grade}</div>
      </div>
    </div>
    <div style="background:var(--warm-white);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;margin-bottom:1rem">
      <div class="section-label" style="margin-bottom:8px">Session info</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div><div style="font-size:12px;color:var(--ink-muted);margin-bottom:2px">Subject</div><div style="font-size:15px;font-weight:500">${subject}</div></div>
        <div><div style="font-size:12px;color:var(--ink-muted);margin-bottom:2px">Time</div><div style="font-size:15px;font-weight:500;color:var(--sage)">${time}</div></div>
      </div>
    </div>
    <div style="background:var(--warm-white);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;margin-bottom:1rem">
      <div class="section-label" style="margin-bottom:8px">About</div>
      <p style="font-size:14px;color:var(--ink-light);line-height:1.7">No bio provided yet. Students can add a short note about their learning goals when requesting a session.</p>
    </div>
  `;
  goto('student-profile');
}

// ── Navigation ──
function goto(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

// ── Landing → signup with role pre-set ──
let selectedRole = 'student';
function landingSignup(role) {
  selectedRole = role;
  document.getElementById('signup-role-label').textContent = role;
  goto('signup');
}
function selectRole(role) {
  selectedRole = role;
  document.getElementById('signup-role-label').textContent = role;
}
function handleSignup() {
  if (selectedRole === 'tutor') goto('tutor-setup');
  else goto('student-matching');
}

// ── Tutor setup steps ──
let setupStep = 0;
function nextSetupStep() {
  document.getElementById('setup-step-'+setupStep).classList.remove('active');
  document.getElementById('dot-'+setupStep).classList.remove('active');
  document.getElementById('dot-'+setupStep).classList.add('done');
  setupStep++;
  document.getElementById('setup-step-'+setupStep).classList.add('active');
  const dot = document.getElementById('dot-'+setupStep);
  if (dot) dot.classList.add('active');
}
function prevSetupStep() {
  document.getElementById('setup-step-'+setupStep).classList.remove('active');
  document.getElementById('dot-'+setupStep).classList.remove('active');
  setupStep--;
  document.getElementById('setup-step-'+setupStep).classList.add('active');
  document.getElementById('dot-'+setupStep).classList.remove('done');
  document.getElementById('dot-'+setupStep).classList.add('active');
}
function togglePill(el) { el.classList.toggle('selected'); }
function toggleChip(el) { el.classList.toggle('selected'); }

// ── Availability grid — vertical columns per day ──
const availTimes = [
  '8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM',
  '4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM',
  '8:00 PM','8:30 PM','9:00 PM'
];
const availDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const fullAvailSlots = new Set();

function buildTimeGrid() {
  const grid = document.getElementById('avail-grid');
  if (!grid) return;
  const cellStyle = 'border:0.5px solid var(--border);height:28px;display:flex;align-items:center;justify-content:center;';
  let html = '';
  // Header row: blank corner + day labels
  html += `<div style="${cellStyle}background:var(--cream);"></div>`;
  availDays.forEach(d => {
    html += `<div style="${cellStyle}background:var(--cream);font-size:11px;font-weight:600;color:var(--ink-muted);text-transform:uppercase;letter-spacing:0.05em">${d}</div>`;
  });
  // Time rows
  availTimes.forEach((time, ti) => {
    // time label
    html += `<div style="${cellStyle}background:var(--cream);font-size:10px;color:var(--ink-muted);padding:0 4px;white-space:nowrap;justify-content:flex-end;padding-right:6px">${time}</div>`;
    availDays.forEach((d, di) => {
      const idx = ti * 7 + di;
      const isFull = fullAvailSlots.has(idx);
      if (isFull) {
        html += `<div style="${cellStyle}background:var(--border);cursor:not-allowed;" title="At capacity"></div>`;
      } else {
        html += `<div class="avail-cell" style="${cellStyle}cursor:pointer;background:white;transition:background 0.1s;" onclick="toggleAvailCell(this)"></div>`;
      }
    });
  });
  grid.innerHTML = html;
}
buildTimeGrid();

function toggleAvailCell(el) {
  const on = el.dataset.on === '1';
  el.dataset.on = on ? '0' : '1';
  el.style.background = on ? 'white' : 'var(--sage)';
}

function editProfile() {
  // Reset setup to step 0
  for (let i = 0; i <= 2; i++) {
    const step = document.getElementById('setup-step-'+i);
    const dot  = document.getElementById('dot-'+i);
    if (step) step.classList.remove('active');
    if (dot)  { dot.classList.remove('active','done'); }
  }
  setupStep = 0;
  document.getElementById('setup-step-0').classList.add('active');
  document.getElementById('dot-0').classList.add('active');
  goto('tutor-setup');
}

// ── Dashboard ──
function showDashTab(tab) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.getElementById('dash-'+tab).classList.add('active');
  event.target.closest('.sidebar-link').classList.add('active');
}
function toggleListing() {
  const t = document.getElementById('listing-toggle');
  t.classList.toggle('on');
}
function updateSlotLabel() {}

// ── Request handling ──
function acceptRequest(btn) {
  const card = btn.closest('.request-card');
  card.style.opacity = '0'; card.style.transition = 'opacity 0.3s';
  setTimeout(() => card.remove(), 300);
  const badge = document.querySelector('.badge-count');
  if (badge) { const n = parseInt(badge.textContent)-1; badge.textContent = n; if(n===0) badge.style.display='none'; }
}
function declineRequest(btn) {
  const card = btn.closest('.request-card');
  card.style.opacity = '0'; card.style.transition = 'opacity 0.3s';
  setTimeout(() => card.remove(), 300);
  const badge = document.querySelector('.badge-count');
  if (badge) { const n = parseInt(badge.textContent)-1; badge.textContent = n; if(n===0) badge.style.display='none'; }
}

// ── Booking modal ──
function openBooking(name) {
  document.getElementById('modal-tutor-name').textContent = 'Book '+name;
  document.getElementById('booking-modal').classList.add('open');
}
function closeModal() { document.getElementById('booking-modal').classList.remove('open'); }
function selectSlot(el) {
  document.querySelectorAll('.slot-option').forEach(s=>s.classList.remove('selected'));
  el.classList.add('selected');
}
function sendRequest() { closeModal(); goto('confirmation'); }

document.getElementById('booking-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
</script>
