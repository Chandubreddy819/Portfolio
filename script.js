/* ============================================
   PORTFOLIO — Data Engine & Renderer
   Fetches JSON data and renders all sections
   ============================================ */

// ---- Data Loading ----

async function loadJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${path}:`, error);
    return null;
  }
}

// ---- Utility ----

function createChip(text, filled = false) {
  const span = document.createElement('span');
  span.className = filled ? 'chip filled' : 'chip';
  span.textContent = text;
  return span;
}

function createCategoryChip(text) {
  const span = document.createElement('span');
  span.className = 'chip-category';
  span.textContent = text;
  return span;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// ---- Page Detection ----

function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('project.html')) return 'project-detail';
  if (path.includes('projects.html')) return 'projects';
  if (path.includes('posts.html')) return 'posts';
  if (path.includes('resume.html')) return 'resume';
  return 'home';
}

function getURLParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

// ============================================
// HOME PAGE RENDERERS
// ============================================

function renderHero(profile) {
  const nameEl = document.getElementById('hero-name');
  const degreeEl = document.getElementById('hero-degree');
  const chipsEl = document.getElementById('hero-chips');
  const introEl = document.getElementById('hero-intro');
  const availEl = document.getElementById('hero-availability');
  const buttonsEl = document.getElementById('hero-buttons');

  if (!nameEl) return;

  nameEl.textContent = profile.name + '.';
  degreeEl.textContent = profile.degree;

  profile.tagline_chips.forEach(chip => {
    chipsEl.appendChild(createChip(chip));
  });

  introEl.innerHTML = profile.intro;
  availEl.textContent = profile.availability;

  // Buttons
  const buttons = [
    { icon: 'fab fa-linkedin', text: 'LINKEDIN', href: `https://linkedin.com/in/${profile.social.linkedin}` },
    { icon: 'fab fa-github', text: 'GITHUB', href: `https://github.com/${profile.social.github}` },
    { icon: 'fas fa-download', text: 'RESUME', href: profile.resume_file, primary: true }
  ];

  buttons.forEach(btn => {
    const a = document.createElement('a');
    a.href = btn.href;
    a.className = btn.primary ? 'btn btn-primary' : 'btn';
    a.target = btn.href.startsWith('http') ? '_blank' : '_self';
    a.innerHTML = `<i class="${btn.icon} btn-icon"></i> ${btn.text}`;
    buttonsEl.appendChild(a);
  });

  // Status card
  const indicatorEl = document.getElementById('status-indicator');
  indicatorEl.innerHTML = `<span class="status-dot"></span> ${profile.status.indicator} · ${profile.status.location}`;

  const infoEl = document.getElementById('status-info');
  infoEl.innerHTML = `
    <div class="status-name">${profile.name}</div>
    <div class="status-tagline">EE → embedded</div>
    <div class="status-bio">Passionate about creating efficient, scalable embedded solutions.</div>
  `;

  const fieldsEl = document.getElementById('status-fields');
  Object.entries(profile.status.fields).forEach(([key, value]) => {
    const row = document.createElement('div');
    row.className = 'status-field';
    row.innerHTML = `
      <span class="status-field-label">${key}</span>
      <span class="status-field-value">${value}</span>
    `;
    fieldsEl.appendChild(row);
  });
}

function renderTimeline(experience) {
  const container = document.getElementById('timeline-list');
  if (!container) return;

  experience.forEach((entry, index) => {
    const row = document.createElement('div');
    row.className = `timeline-entry reveal reveal-delay-${(index % 4) + 1}`;
    row.innerHTML = `
      <div class="timeline-year-col">
        <div class="timeline-year">${entry.year}</div>
        <div class="timeline-daterange">${entry.dateRange}</div>
      </div>
      <div class="timeline-body">
        <span class="timeline-type-badge">${entry.type} · ${entry.role}</span>
        <h3 class="timeline-title">${entry.title}</h3>
        <h4 class="timeline-company">${entry.company}</h4>
        <div class="timeline-location">${entry.location}</div>
        <p class="timeline-description">${entry.description}</p>
        ${entry.demoLink ? `<a href="${entry.demoLink}" target="_blank" class="btn btn-secondary" style="margin-bottom: 1.5rem; display: inline-flex; font-size: 0.85rem; padding: 0.5rem 1rem;"><i class="fas fa-play-circle"></i>Watch Demo Video</a>` : ''}
        <div class="timeline-tech">
          ${entry.tech.map(t => `<span class="chip">${t}</span>`).join('')}
        </div>
      </div>
      <div class="timeline-duration">${entry.duration}</div>
    `;
    container.appendChild(row);
  });
}

function renderProjects(projects, containerId = 'project-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  projects.forEach((project, index) => {
    const card = document.createElement('a');
    card.className = `project-card reveal reveal-delay-${(index % 4) + 1}`;
    card.href = `project.html?id=${project.id}`;
    card.innerHTML = `
      <div class="project-card-categories">
        ${project.categories.map(c => `<span class="chip-category">${c}</span>`).join('')}
      </div>
      <img src="${project.image}" alt="${project.title}" class="project-card-image" loading="lazy">
      <div class="project-card-body">
        <h3 class="project-card-title">${project.title}</h3>
        <p class="project-card-summary">${project.summary}</p>
        ${project.demoLink ? `<a href="${project.demoLink}" target="_blank" class="btn btn-secondary" style="margin-top: 1rem; margin-bottom: 1.5rem; display: inline-flex; font-size: 0.85rem; padding: 0.5rem 1rem;" onclick="event.stopPropagation();"><i class="fas fa-play-circle"></i>Watch Demo</a>` : ''}
        <div class="project-card-tech">
          ${project.tech.slice(0, 4).map(t => `<span class="chip">${t}</span>`).join('')}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderToolbox(skills) {
  const container = document.getElementById('toolbox-container');
  if (!container) return;

  skills.forEach((category, index) => {
    const row = document.createElement('div');
    row.className = `toolbox-row reveal reveal-delay-${(index % 4) + 1}`;
    row.innerHTML = `
      <div class="toolbox-label">${category.number} ${category.category}</div>
      <div class="toolbox-skills">
        ${category.skills.map(s =>
      `<span class="chip ${s.primary ? 'filled' : ''}">${s.name}</span>`
    ).join('')}
      </div>
    `;
    container.appendChild(row);
  });
}

function renderContact(profile) {
  const headingEl = document.getElementById('contact-heading');
  const subtextEl = document.getElementById('contact-subtext');
  const linksEl = document.getElementById('contact-links');

  if (!headingEl) return;

  headingEl.innerHTML = `Got a project idea, a weird embedded problem, or just want to nerd out? <a href="mailto:${profile.social.email}">Send me a note.</a>`;
  subtextEl.textContent = profile.availability;

  const links = [
    { label: 'EMAIL', value: profile.social.email, href: `mailto:${profile.social.email}` },
    { label: 'GITHUB', value: `@${profile.social.github}`, href: `https://github.com/${profile.social.github}` },
    { label: 'LINKEDIN', value: `/in/${profile.social.linkedin.split('/')[0]}`, href: `https://linkedin.com/in/${profile.social.linkedin}` }
  ];

  links.forEach(link => {
    const row = document.createElement('a');
    row.className = 'contact-link-row';
    row.href = link.href;
    row.target = '_blank';
    row.innerHTML = `
      <span class="contact-link-label">${link.label}</span>
      <span class="contact-link-value">${link.value}</span>
      <span class="contact-link-arrow">→</span>
    `;
    linksEl.appendChild(row);
  });
}

function renderFooter() {
  const footerEl = document.getElementById('footer-bottom');
  if (!footerEl) return;
  footerEl.textContent = `© ${new Date().getFullYear()} Chandu Baya Reddy`;
}

// ============================================
// PROJECT DETAIL PAGE
// ============================================

function renderProjectDetail(project) {
  if (!project) {
    document.getElementById('project-detail-title').textContent = 'Project not found';
    return;
  }

  document.title = `${project.title} — Chandu Baya Reddy`;

  // Breadcrumb
  const breadcrumb = document.getElementById('project-breadcrumb');
  breadcrumb.innerHTML = `
    <a href="projects.html" class="project-breadcrumb-back">← ALL PROJECTS</a>
    <span class="project-breadcrumb-sep"></span>
    <span class="project-breadcrumb-id">PROJECT ${project.number} · ${project.categories.join(' · ')}</span>
  `;

  // Title & summary
  document.getElementById('project-detail-title').textContent = project.title;
  document.getElementById('project-detail-summary').innerHTML = project.summary + (project.demoLink ? `<br><br><a href="${project.demoLink}" target="_blank" class="btn btn-secondary" style="display: inline-flex; font-size: 0.85rem; padding: 0.5rem 1rem;"><i class="fas fa-play-circle"></i>Watch Demo Video</a>` : '');

  // Tech chips (including context tags)
  const techContainer = document.getElementById('project-detail-tech');
  project.categories.forEach(c => techContainer.appendChild(createCategoryChip(c)));
  project.tech.forEach(t => techContainer.appendChild(createChip(t)));

  if (project.projectInfo) {
    const contextParts = [];
    if (project.projectInfo.INSTITUTE) contextParts.push(project.projectInfo.INSTITUTE);
    if (project.projectInfo.COMPANY) contextParts.push(project.projectInfo.COMPANY);
    if (project.projectInfo.TIMELINE) contextParts.push(project.projectInfo.TIMELINE);
    if (contextParts.length > 0) {
      const contextChip = document.createElement('span');
      contextChip.className = 'chip';
      contextChip.style.marginLeft = '0.5rem';
      contextChip.textContent = contextParts.join(' · ');
      techContainer.appendChild(contextChip);
    }
  }

  // Content sections
  const contentContainer = document.getElementById('project-detail-content');
  if (project.sections) {
    project.sections.forEach(section => {
      const div = document.createElement('div');
      div.className = 'project-section';
      
      let html = `
        <div class="project-section-label">${section.title}</div>
        <p class="project-section-text">${section.content}</p>
      `;

      if (section.image) {
        html += `
          <div class="project-section-image">
            <img src="${section.image}" alt="${section.title}">
            ${section.caption ? `<div class="project-section-caption">${section.caption}</div>` : ''}
          </div>
        `;
      }

      div.innerHTML = html;
      contentContainer.appendChild(div);
    });
  }

  // Sidebar
  const sidebar = document.getElementById('project-sidebar');
  if (!sidebar) return;
  sidebar.innerHTML = ''; // Clear previous

  // 1. Info Card
  if (project.projectInfo) {
    const infoCard = document.createElement('div');
    infoCard.className = 'project-info-card';
    let html = '<div class="project-info-header">PROJECT INFO</div>';
    Object.entries(project.projectInfo).forEach(([key, value]) => {
      html += `
        <div class="project-info-row">
          <span class="project-info-label">${key}</span>
          <span class="project-info-value">${value}</span>
        </div>
      `;
    });
    infoCard.innerHTML = html;
    sidebar.appendChild(infoCard);
  }

  // 2. Tools & Stack Card
  if (project.tech && project.tech.length > 0) {
    const toolsCard = document.createElement('div');
    toolsCard.className = 'project-info-card';
    toolsCard.innerHTML = `
      <div class="project-info-header">TOOLS & STACK</div>
      <div class="project-tool-chips">
        ${project.tech.map(t => `<span class="project-tool-chip">${t}</span>`).join('')}
      </div>
    `;
    sidebar.appendChild(toolsCard);
  }

  // 3. Navigation Card (Prev / Next)
  if (typeof projectsData !== 'undefined') {
    const currentIndex = projectsData.findIndex(p => p.id === project.id);
    if (currentIndex !== -1) {
      const prevProject = currentIndex > 0 ? projectsData[currentIndex - 1] : null;
      const nextProject = currentIndex < projectsData.length - 1 ? projectsData[currentIndex + 1] : null;

      const navCard = document.createElement('div');
      navCard.className = 'project-info-card project-nav-card';
      
      navCard.innerHTML = `
        <a href="${prevProject ? `project.html?id=${prevProject.id}` : '#'}" class="project-nav-link" ${!prevProject ? 'style="visibility:hidden;"' : ''}>← PREV<br><span style="color:var(--text-primary); text-transform:none;">${prevProject ? prevProject.title.substring(0, 15) + '...' : ''}</span></a>
        <a href="projects.html" class="project-nav-link" style="text-align: center; color: var(--text-tertiary);"><br>ALL</a>
        <a href="${nextProject ? `project.html?id=${nextProject.id}` : '#'}" class="project-nav-link" style="text-align: right;" ${!nextProject ? 'style="visibility:hidden;"' : ''}>NEXT →<br><span style="color:var(--text-primary); text-transform:none;">${nextProject ? nextProject.title.substring(0, 15) + '...' : ''}</span></a>
      `;
      sidebar.appendChild(navCard);
    }
  }
}

// ============================================
// POSTS PAGE
// ============================================

function renderPostsList(posts) {
  const container = document.getElementById('post-list');
  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary); font-size: 1.1rem;">No posts yet. Check back soon!</p>';
    return;
  }

  posts.forEach((post, index) => {
    const card = document.createElement('a');
    card.className = `post-card reveal reveal-delay-${(index % 4) + 1}`;
    card.href = `posts.html?id=${post.id}`;
    
    const imageHtml = post.image ? `<div class="post-card-image"><img src="${post.image}" alt="${post.title}" loading="lazy"></div>` : '';
    
    card.innerHTML = `
      ${imageHtml}
      <div class="post-card-body">
        <div class="post-card-category">${post.category} ${post.readTime ? `· ${post.readTime}` : ''}</div>
        <h3 class="post-card-title">${post.title}</h3>
        <p class="post-card-summary">${post.summary}</p>
        <div class="post-card-tags">
          ${post.tags.map(t => `<span class="chip">${t}</span>`).join('')}
        </div>
      </div>
      <div class="post-card-footer">
        <span class="post-card-date">${formatDate(post.date)}</span>
        <span class="post-card-arrow">→</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderPostDetail(post) {
  if (!post) return;

  document.title = `${post.title} — Chandu Baya Reddy`;

  document.getElementById('posts-listing').style.display = 'none';
  const detailEl = document.getElementById('post-detail');
  detailEl.style.display = 'block';

  document.getElementById('post-detail-meta').textContent = `${post.category} ${post.readTime ? `· ${post.readTime}` : ''} · ${formatDate(post.date)}`;
  document.getElementById('post-detail-title').textContent = post.title;

  const contentEl = document.getElementById('post-detail-content');
  
  if (post.image) {
    contentEl.innerHTML = `<div class="post-detail-image-wrapper"><img src="${post.image}" alt="${post.title}" class="post-detail-image"></div>`;
  } else {
    contentEl.innerHTML = '';
  }

  if (post.content) {
    post.content.forEach(section => {
      contentEl.innerHTML += `<h2>${section.heading}</h2><p>${section.text}</p>`;
    });
  }
}

// ============================================
// PROJECTS LISTING PAGE
// ============================================

function renderAllProjects(projects) {
  renderProjects(projects, 'all-projects-grid');
}

// ============================================
// SCROLL REVEAL
// ============================================

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Re-observe after dynamic content is rendered
function refreshScrollReveal() {
  setTimeout(() => {
    initScrollReveal();
  }, 100);
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================
// MAIN INITIALIZATION
// ============================================

async function init() {
  const page = getCurrentPage();

  // Always render footer
  renderFooter();

  if (page === 'home') {
    if (typeof profileData !== 'undefined') {
      renderHero(profileData);
      renderContact(profileData);
    }
    if (typeof experienceData !== 'undefined') renderTimeline(experienceData);
    if (typeof projectsData !== 'undefined') renderProjects(projectsData);
    if (typeof skillsData !== 'undefined') renderToolbox(skillsData);

  } else if (page === 'project-detail') {
    const projectId = getURLParam('id');
    if (typeof projectsData !== 'undefined') {
      const project = projectsData.find(p => p.id === projectId);
      renderProjectDetail(project);
    }

  } else if (page === 'projects') {
    if (typeof projectsData !== 'undefined') renderAllProjects(projectsData);

  } else if (page === 'posts') {
    const postId = getURLParam('id');
    if (typeof postsData !== 'undefined') {
      if (postId) {
        const post = postsData.find(p => p.id === postId);
        renderPostDetail(post);
      } else {
        renderPostsList(postsData);
      }
    }
  }

  refreshScrollReveal();
}

// Start
document.addEventListener('DOMContentLoaded', init);
