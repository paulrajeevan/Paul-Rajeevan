/**
 * Paul Rajeevan — Modern Single-Page Static Portfolio JavaScript
 * Handles Theme Toggling, Modals, Tab Filtering, Scrollspy, Clipboard & Forms
 */

(function () {
  'use strict';

  // ----------------------------------------------------------------------------
  // Data Store: Project Details
  // ----------------------------------------------------------------------------
  const PROJECTS_DATA = {
    'al-ict': {
      title: 'AL-ICT Notes Hub',
      category: 'Educational Web Platform',
      description: 'A comprehensive digital repository and educational web portal designed specifically for Sri Lankan Advanced Level (A/L) students pursuing the ICT stream in Tamil Medium. Built to democratize access to high-standard study materials and eliminate educational resource disparities.',
      highlights: [
        'Curated Tamil medium theory notes spanning core syllabus modules.',
        'Extensive searchable archive of government past papers and marking schemes from 2011 through 2024.',
        'Tuition & educator directory connecting students with verified subject tutors across Sri Lanka.',
        'Zero-latency static architecture optimized for low-bandwidth mobile connections.'
      ],
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Sri Lanka Exams', 'A/L ICT', 'Tamil Medium'],
      link: 'https://github.com/paulrajeevan/AL-ICT'
    },
    'gesture-snake': {
      title: 'AI Gesture Snake',
      category: 'Computer Vision & Browser Gaming',
      description: 'A browser-based reimagining of the iconic Snake game controlled entirely through real-time hand gestures. By utilizing Google MediaPipe hand landmark tracking directly in JavaScript, all computer vision calculations occur 100% locally on the user device without needing cloud video streams or external servers.',
      highlights: [
        'Real-time 21-point 3D hand landmark recognition in the browser at 60 FPS.',
        'Zero-install web experience built with plain HTML, CSS, and vanilla JavaScript.',
        'Dynamic gesture mapping (thumb-to-finger orientation vector calculations for directional movement).',
        'Built-in webcam permission handler and privacy-first local processing guarantee.'
      ],
      tags: ['MediaPipe', 'Computer Vision', 'Canvas API', 'Vanilla JavaScript', 'AI Gaming'],
      link: 'https://github.com/paulrajeevan/ai-gesture-snake'
    },
    'netblocker': {
      title: 'NetBlocker Android',
      category: 'Android System Utility (Root)',
      description: 'An open-source Android firewall utility built in Kotlin for rooted devices. It gives users complete sovereignty over their data by enabling or blocking internet connectivity (Wi-Fi and cellular) on an individual application level through low-level Linux IPTables rules.',
      highlights: [
        'Direct integration with root shell commands to inject granular iptables packet-filtering chains.',
        'Prevents unwanted background telemetry, ads, and data usage on a per-UID basis.',
        'Lightweight, clean toggle user interface with instant permission feedback.',
        'Zero persistent battery drain compared to local VPN-based blocking implementations.'
      ],
      tags: ['Kotlin', 'Android SDK', 'IPTables', 'Linux Shell', 'Root Security'],
      link: 'https://github.com/paulrajeevan/NetBlocker'
    },
    'hotspot-controller': {
      title: 'HotspotController Android',
      category: 'Mobile Networking & Security',
      description: 'An advanced Android network management utility crafted for rooted hardware. It intercepts tethering traffic on the mobile hotspot interface and provides a dashboard to monitor, dynamically whitelist, or instantly ban specific client devices by IP or MAC address.',
      highlights: [
        'Real-time connected peer discovery by parsing ARP table (/proc/net/arp).',
        'Dynamic rule generation for FORWARD iptables chain to drop malicious or bandwidth-heavy clients.',
        'Root-executed shell commands packaged inside an ergonomic Kotlin UI.',
        'Designed to give users desktop-router grade control directly from their smartphone.'
      ],
      tags: ['Kotlin', 'Android Root', 'IPTables', 'ARP Inspection', 'Mobile Network'],
      link: 'https://github.com/paulrajeevan/HotspotController'
    },
    'hybridos': {
      title: 'HybridOS Kernel',
      category: 'Systems & Operating System Development',
      description: 'A practical, bare-metal operating system engineering project started to master low-level computing, x86 assembly, CPU protected modes, interrupt handling, and kernel architecture. The long-term architectural goal is exploring hybrid runtime compatibility for Linux ELF and Windows PE binaries side-by-side.',
      highlights: [
        'Custom 2-stage x86 bootloader initializing Real Mode and transitioning to 32-bit Protected Mode.',
        'Interrupt Descriptor Table (IDT) and Global Descriptor Table (GDT) configuration from scratch.',
        'Custom VGA driver and basic memory paging management.',
        'Exploration of binary execution compatibility layers at the kernel level.'
      ],
      tags: ['Assembly (NASM)', 'C', 'Kernel Dev', 'x86 Architecture', 'Systems Programming'],
      link: 'https://github.com/paulrajeevan/HybridOS'
    },
    'local-ai-telegram': {
      title: 'Local AI Telegram Bridge',
      category: 'AI Assistant & Automation',
      description: 'A private, self-hosted integration bridging locally running Ollama LLMs (such as Llama 3, Mistral, and DeepSeek) with Telegram bots. It allows you to converse with your local workstation models from your mobile phone anywhere in the world without exposing your personal queries to cloud providers.',
      highlights: [
        'Zero cloud token costs: operates entirely on your personal GPU/CPU via Ollama.',
        'End-to-end privacy: your messages and data never touch third-party AI logging servers.',
        'Asynchronous Python architecture with webhook or long-polling support.',
        'Custom system prompts and support for multi-turn conversational context.'
      ],
      tags: ['Python', 'Ollama API', 'Telegram Bot API', 'Local AI', 'Automation'],
      link: 'https://github.com/paulrajeevan'
    },
    'rps-game': {
      title: 'Rock Paper Scissors AI Game',
      category: 'Web AI & Machine Learning',
      description: 'An interactive webcam-powered browser game that utilizes deep learning image classification to play Rock Paper Scissors in real time. Trained using Google Teachable Machine and deployed client-side using TensorFlow.js.',
      highlights: [
        'Real-time video frame inference running directly in the browser via WebGL.',
        'Clean score tracking, countdown round triggers, and game state audio/visual cues.',
        'Accessible to anyone with a standard webcam without needing specialized AI accelerators.'
      ],
      tags: ['JavaScript', 'Teachable Machine', 'TensorFlow.js', 'Webcam AI', 'Browser Gaming'],
      link: 'https://github.com/paulrajeevan/rps-game'
    }
  };

  // ----------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Mode with Persistence)
  // ----------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');

  function initTheme() {
    const savedTheme = localStorage.getItem('pr_theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('pr_theme', newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info', 2000);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // ----------------------------------------------------------------------------
  // 2. Mobile Drawer Navigation
  // ----------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // ----------------------------------------------------------------------------
  // 3. Sticky Header, Scrollspy & Scroll-to-Top Button
  // ----------------------------------------------------------------------------
  const siteHeader = document.getElementById('site-header');
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header shadow and padding transition
    if (siteHeader) {
      if (scrollY > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Scroll-to-top visibility
    if (scrollTopBtn) {
      if (scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Scrollspy active anchor update
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ----------------------------------------------------------------------------
  // 4. Power Stack Category Tab Filtering
  // ----------------------------------------------------------------------------
  const stackTabBtns = document.querySelectorAll('[data-stack-filter]');
  const techCards = document.querySelectorAll('.tech-card');

  stackTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stackTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-stack-filter');

      techCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ----------------------------------------------------------------------------
  // 5. Featured Projects Category Filtering
  // ----------------------------------------------------------------------------
  const projectTabBtns = document.querySelectorAll('#project-filters [data-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  function filterProjects(filter) {
    projectTabBtns.forEach(b => {
      if (b.getAttribute('data-filter') === filter) {
        b.classList.add('active');
        b.setAttribute('aria-selected', 'true');
      } else {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      }
    });

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  projectTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterProjects(filter);
    });
  });

  // Pillar links in About section triggering project filter
  const pillarLinks = document.querySelectorAll('.pillar-link[data-filter]');
  pillarLinks.forEach(link => {
    link.addEventListener('click', () => {
      const filter = link.getAttribute('data-filter');
      if (filter) {
        filterProjects(filter);
      }
    });
  });

  // ----------------------------------------------------------------------------
  // 6. Generic Modal Handler Utilities
  // ----------------------------------------------------------------------------
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind all close buttons and backdrop clicks
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal || e.target.closest('[data-close-modal]')) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) closeModal(activeModal);
      closeDrawer();
    }
  });

  // ----------------------------------------------------------------------------
  // 7. Project Details Modal
  // ----------------------------------------------------------------------------
  const projectModal = document.getElementById('project-modal');
  const projectModalTitle = document.getElementById('project-modal-title');
  const projectModalCategory = document.getElementById('project-modal-category');
  const projectModalDesc = document.getElementById('project-modal-desc');
  const projectModalHighlights = document.getElementById('project-modal-highlights');
  const projectModalTags = document.getElementById('project-modal-tags');
  const projectModalLink = document.getElementById('project-modal-link');

  document.querySelectorAll('.view-project-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-project-id');
      const data = PROJECTS_DATA[pid];
      if (!data || !projectModal) return;

      projectModalTitle.textContent = data.title;
      projectModalCategory.textContent = data.category;
      projectModalDesc.textContent = data.description;

      // Render Highlights
      projectModalHighlights.innerHTML = '';
      data.highlights.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        projectModalHighlights.appendChild(li);
      });

      // Render Tags
      projectModalTags.innerHTML = '';
      data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        projectModalTags.appendChild(span);
      });

      // Render Link
      projectModalLink.href = data.link;

      openModal(projectModal);
    });
  });

  // ----------------------------------------------------------------------------
  // 8. Legal (Privacy / Terms) Modals
  // ----------------------------------------------------------------------------
  const legalModal = document.getElementById('legal-modal');
  const openPrivacyBtn = document.getElementById('open-privacy-modal');
  const openTermsBtn = document.getElementById('open-terms-modal');

  if (openPrivacyBtn) {
    openPrivacyBtn.addEventListener('click', () => openModal(legalModal));
  }
  if (openTermsBtn) {
    openTermsBtn.addEventListener('click', () => openModal(legalModal));
  }

  // ----------------------------------------------------------------------------
  // 9. Copy Email to Clipboard
  // ----------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const targetEmail = 'contact@paulrajeevan.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(targetEmail);
        showToast('Email copied to clipboard!', 'success');
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = targetEmail;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Email copied to clipboard!', 'success');
      }
    });
  }



  // ----------------------------------------------------------------------------
  // 11. Toast Notification Helper
  // ----------------------------------------------------------------------------
  function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;

    const iconClass = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toast-out 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  // ----------------------------------------------------------------------------
  // Initialize Application on DOM Ready
  // ----------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    handleScroll();
  });
})();
