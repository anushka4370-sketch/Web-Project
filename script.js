// 1. STATE MANAGEMENT
let studentProfile = {
    name: "Alex Johnson",
    id: "STU-2025-089",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200"
};

let projects = [
    { id: 1, title: "Cybersecurity Framework", desc: "Documentation of network security protocols.", progress: 100, feedback: "Excellent documentation." }
];

let isAdminMode = false;

// 2. VIEW SWITCHING
function switchView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const displayType = (viewName === 'projects') ? 'grid' : 'block';
    document.getElementById('view-' + viewName).style.display = displayType;
    document.getElementById('nav-' + viewName).classList.add('active');
    document.getElementById('page-title').innerText = viewName.charAt(0).toUpperCase() + viewName.slice(1);

    if (viewName === 'milestones') renderMilestones();
}

// 3. ADMIN LOGIC
function toggleAdminMode() {
    isAdminMode = document.getElementById('adminToggle').checked;
    document.getElementById('admin-notice').style.display = isAdminMode ? "block" : "none";
    document.querySelectorAll('.student-only').forEach(el => el.style.display = isAdminMode ? "none" : "block");
    renderProjects();
}

function saveFeedback(index) {
    const input = document.getElementById(`admin-input-${index}`);
    if (input.value.trim() !== "") {
        projects[index].feedback = input.value;
        renderProjects();
    }
}

// 4. PORTFOLIO LOGIC
function renderProjects() {
    const container = document.getElementById('projectDisplay');
    container.innerHTML = ''; 

    projects.forEach((p, index) => {
        const isComplete = p.progress >= 100;
        const feedbackHTML = p.feedback ? `<div class="feedback-box"><strong>Teacher:</strong> ${p.feedback}</div>` : '';
        const adminTools = isAdminMode ? `
            <div class="admin-controls">
                <textarea id="admin-input-${index}" class="admin-input" placeholder="Type feedback..."></textarea>
                <button class="btn-save-feedback" onclick="saveFeedback(${index})">Save Feedback</button>
            </div>` : '';

        container.innerHTML += `
            <div class="project-card">
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <h3 style="margin:0;">${p.title}</h3>
                    <span class="badge ${isComplete ? 'badge-complete' : 'badge-progress'}">${isComplete ? 'Done' : 'Working'}</span>
                </div>
                <p style="font-size:0.9rem; color:#555;">${p.desc}</p>
                <div class="progress-bg"><div class="progress-fill" style="width:${p.progress}%"></div></div>
                <small>${p.progress}% Complete</small>
                ${feedbackHTML} ${adminTools}
            </div>`;
    });
    document.getElementById('stat-count').innerText = projects.length;
    document.getElementById('feedback-count').innerText = projects.filter(p => p.feedback).length;
}

function addNewProject() {
    const title = document.getElementById('titleInput').value;
    const desc = document.getElementById('descInput').value;
    const prog = document.getElementById('progressInput').value;

    if (title && prog) {
        projects.push({ id: Date.now(), title, desc, progress: prog, feedback: "" });
        renderProjects();
        closeModal();
    }
}

// 5. MILESTONE LOGIC
function renderMilestones() {
    const list = document.getElementById('milestone-list');
    list.innerHTML = projects.length === 0 ? "<p>No tasks yet.</p>" : "";
    projects.forEach(p => {
        const isDone = p.progress >= 100;
        list.innerHTML += `
            <div style="display:flex; align-items:center; gap:15px; padding:12px; border-bottom:1px solid #eee;">
                <input type="checkbox" ${isDone ? 'checked' : ''} disabled>
                <div style="flex-grow:1;"><strong>${p.title}</strong><br><small>${p.progress}%</small></div>
                <span class="badge ${isDone ? 'badge-complete' : 'badge-progress'}">${isDone ? 'VERIFIED' : 'PENDING'}</span>
            </div>`;
    });
}

// 6. PROFILE LOGIC
function editProfile() {
    document.getElementById('editName').value = studentProfile.name;
    document.getElementById('editID').value = studentProfile.id;
    document.getElementById('editPhoto').value = studentProfile.photo;
    document.getElementById('profileModal').style.display = 'flex';
}

function saveProfile() {
    studentProfile = {
        name: document.getElementById('editName').value,
        id: document.getElementById('editID').value,
        photo: document.getElementById('editPhoto').value
    };
    updateProfileUI();
    document.getElementById('profileModal').style.display = 'none';
}

function updateProfileUI() {
    document.getElementById('sidebar-name').innerText = studentProfile.name;
    document.getElementById('sidebar-id').innerText = "ID: #" + studentProfile.id;
    document.getElementById('sidebar-photo').src = studentProfile.photo;
    document.getElementById('display-student-name').innerText = studentProfile.name;
    document.getElementById('display-student-id').innerText = studentProfile.id;
    document.getElementById('main-photo').src = studentProfile.photo;
}

// 7. INITIALIZATION
function openModal() { document.getElementById('projectModal').style.display = 'flex'; }
function closeModal() { document.getElementById('projectModal').style.display = 'none'; }
function closeProfileModal() { document.getElementById('profileModal').style.display = 'none'; }

window.onload = () => {
    updateProfileUI();
    renderProjects();
};