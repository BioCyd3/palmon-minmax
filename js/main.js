// Palmon Website - Main JavaScript
// Optimized for static hosting on InfinityFree

import DataUtils from './utils/data-utils.js';
import TeamManager from './team/team-manager.js';
import PalmonSelectionPanel from './team/palmon-selection-panel.js';
import TeamSaveShareUI from './team/team-save-share-ui.js';

class PalmonApp {
  constructor() {
    this.palmonData = null;
    this.processedPalmonData = null;
    this.tierData = this.initializeTierData();
    this.dataUtils = new DataUtils();
    this.teamManager = null;
    this.palmonSelectionPanel = null;
    this.teamSaveShareUI = null;
    this.init();
  }

  async init() {
    try {
      // Load Palmon data using DataUtils
      await this.dataUtils.loadPalmonData();
      this.processedPalmonData = this.dataUtils.getAllPalmon();
      
      // Initialize team management
      this.teamManager = new TeamManager(this.dataUtils);
      this.teamManager.loadFromStorage();
      
      // Initialize components
      this.initializeComponents();
      
      // Set up event listeners
      this.setupEventListeners();
      
      console.log('Palmon App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Palmon App:', error);
      this.showError('Failed to load application. Please refresh the page.');
    }
  }

  async loadPalmonData() {
    try {
      const response = await fetch('./palmon.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.palmonData = await response.json();
      this.processedPalmonData = this.processPalmonData(this.palmonData);
    } catch (error) {
      console.error('Error loading Palmon data:', error);
      throw error;
    }
  }

  initializeTierData() {
    // Tier assignments based on Palmon analysis
    return {
      // S-Tier - Top performers
      'Barkplug': { tier: 'S', element: 'Electric', role: 'Support' },
      'Statchew': { tier: 'S', element: 'Earth', role: 'Tank' },
      'Escarffier': { tier: 'S', element: 'Fire', role: 'DPS' },
      
      // A-Tier - Strong performers
      'Snowkami': { tier: 'A', element: 'Water', role: 'DPS' },
      'Hoofrit': { tier: 'A', element: 'Earth', role: 'Tank' },
      'Lucidina': { tier: 'A', element: 'Electric', role: 'Support' },
      'Battereina': { tier: 'A', element: 'Electric', role: 'DPS' },
      'Ninjump': { tier: 'A', element: 'Water', role: 'DPS' },
      'Wyvierno': { tier: 'A', element: 'Fire', role: 'DPS' },
      
      // B-Tier - Solid choices
      'Kilohopp': { tier: 'B', element: 'Electric', role: 'Support' },
      'Thunderclawd': { tier: 'B', element: 'Electric', role: 'DPS' },
      'Terrastudo': { tier: 'B', element: 'Earth', role: 'Tank' },
      'Incineraptor': { tier: 'B', element: 'Fire', role: 'DPS' },
      'Maximito': { tier: 'B', element: 'Earth', role: 'Support' },
      'Bruiseberry': { tier: 'B', element: 'Water', role: 'Tank' },
      'Lendanear': { tier: 'B', element: 'Water', role: 'Support' },
      'Rotorlotor': { tier: 'B', element: 'Electric', role: 'DPS' },
      'Cerverdant': { tier: 'B', element: 'Earth', role: 'Support' },
      'Vulcanid': { tier: 'B', element: 'Fire', role: 'Support' },
      'Herculeaf': { tier: 'B', element: 'Water', role: 'DPS' },
      'Voltbolt': { tier: 'B', element: 'Electric', role: 'DPS' },
      'Axollium': { tier: 'B', element: 'Earth', role: 'DPS' },
      
      // C-Tier - Situational
      'Meowdame': { tier: 'C', element: 'Electric', role: 'Support' },
      'Platyputz': { tier: 'C', element: 'Water', role: 'Tank' },
      'Baboom': { tier: 'C', element: 'Earth', role: 'DPS' },
      'Magmolin': { tier: 'C', element: 'Fire', role: 'DPS' },
      'Surveilynx': { tier: 'C', element: 'Earth', role: 'Support' },
      'Fingenue': { tier: 'C', element: 'Water', role: 'Support' },
      'Woozard': { tier: 'C', element: 'Earth', role: 'Support' },
      'Salamantis': { tier: 'C', element: 'Earth', role: 'DPS' },
      'Ghillant': { tier: 'C', element: 'Water', role: 'DPS' },
      'Dolphriend': { tier: 'C', element: 'Water', role: 'Tank' },
      'Abuzzinian': { tier: 'C', element: 'Electric', role: 'Support' },
      'Blazeal': { tier: 'C', element: 'Fire', role: 'Tank' },
      'Mantleray': { tier: 'C', element: 'Electric', role: 'DPS' },
      
      // Economy Tier - Early game/resource focused
      'Graffitty': { tier: 'Economy', element: 'Earth', role: 'Support' },
      'Squeezel': { tier: 'Economy', element: 'Water', role: 'DPS' },
      'Flouffant': { tier: 'Economy', element: 'Earth', role: 'Support' },
      'Spinchilla': { tier: 'Economy', element: 'Earth', role: 'Support' },
      'Emboa': { tier: 'Economy', element: 'Fire', role: 'DPS' },
      'Auktyke': { tier: 'Economy', element: 'Water', role: 'Tank' }
    };
  }

  processPalmonData(rawData) {
    return rawData.map(palmon => {
      const name = palmon['Hero Name'];
      const tierInfo = this.tierData[name] || { tier: 'C', element: 'Earth', role: 'DPS' };
      
      return {
        id: palmon['Hero ID'],
        name: name,
        heroKey: palmon['Hero Key'],
        tier: tierInfo.tier,
        element: tierInfo.element,
        role: tierInfo.role,
        skills: {
          skill1: {
            name: palmon['Skill 1 Name'],
            description: palmon['Skill 1 Description']
          },
          skill2: {
            name: palmon['Skill 2 Name'],
            description: palmon['Skill 2 Description']
          },
          passive: {
            name: palmon['Skill 3 (Passive) Name'],
            description: palmon['Skill 3 Description']
          },
          evolve: palmon['Evolve Skill Name'] ? {
            name: palmon['Evolve Skill Name'],
            description: palmon['Evolve Skill Description']
          } : null
        }
      };
    });
  }

  initializeComponents() {
    // Initialize core components
    this.initializeNavigation();
    this.initializeThemeToggle();
    this.initializeHeroSection();
    this.initializeFeaturedContent();
    this.initializeTierListPreview();
    this.initializeTeamBuilder();
    this.initializeMetaAnalysis();
    this.initializeTutorialSystem();
    this.initializeSharingSystem();
  }

  initializeNavigation() {
    // Mobile navigation toggle
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('active');
          mobileToggle.classList.remove('active');
        }
      });
    }

    // Handle navigation link clicks
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Navigate to section
        const section = link.dataset.nav;
        if (section) {
          this.navigateTo(section);
        }

        // Close mobile menu
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      });
    });

    // Initialize search functionality
    this.initializeSearch();
  }

  initializeThemeToggle() {
    // Theme switching functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        // Update icon
        if (themeIcon) {
          themeIcon.textContent = isLight ? '☀️' : '🌙';
        }
        
        // Save preference
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      });
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      if (themeIcon) {
        themeIcon.textContent = '☀️';
      }
    }
  }

  initializeSearch() {
    const searchInput = document.getElementById('global-search');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
      // Handle search input
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
          this.performSearch(query);
        }
      });

      // Handle search button click
      if (searchBtn) {
        searchBtn.addEventListener('click', () => {
          const query = searchInput.value.trim();
          if (query) {
            this.performSearch(query);
          }
        });
      }

      // Handle Enter key
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = searchInput.value.trim();
          if (query) {
            this.performSearch(query);
          }
        }
      });
    }
  }

  performSearch(query) {
    // Basic search functionality - will be enhanced in later tasks
    console.log('Searching for:', query);
    
    // For now, just show a simple message
    this.showNotification(`Searching for "${query}"... (Search functionality will be implemented in upcoming tasks)`);
  }

  setupEventListeners() {
    // Global event listeners
    document.addEventListener('DOMContentLoaded', () => {
      this.hideLoadingScreen();
      this.initializeFooter();
    });

    // Handle hash changes for direct navigation
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        this.showSection(hash);
        this.updateActiveNavLink(hash);
      }
    });

    // Initialize with current hash or default to home
    const initialHash = window.location.hash.slice(1) || 'home';
    this.showSection(initialHash);
    this.updateActiveNavLink(initialHash);
  }

  updateActiveNavLink(section) {
    // Update active navigation link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.nav === section) {
        link.classList.add('active');
      }
    });
  }

  initializeHeroSection() {
    // Animate hero statistics
    this.animateStats();
    
    // Set up random Palmon button
    const randomBtn = document.getElementById('random-palmon');
    if (randomBtn) {
      randomBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showRandomPalmon();
      });
    }
  }

  animateStats() {
    if (!this.processedPalmonData) return;

    const stats = {
      'total-palmon': this.processedPalmonData.length || 0,
      'tier-s-count': this.processedPalmonData.filter(p => p.tier === 'S').length || 0,
      'synergy-combos': Math.floor(this.processedPalmonData.length * 1.5) || 0
    };

    // Animate each stat counter
    Object.entries(stats).forEach(([id, target]) => {
      const element = document.getElementById(id);
      if (element) {
        this.animateCounter(element, target);
      }
    });
  }

  animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);

    // Add animation class
    element.style.animation = 'countUp 0.6s ease-out';
  }

  initializeTierListPreview() {
    // Initialize tier list preview
    console.log('Tier list preview initialization placeholder');
  }

  initializeFeaturedContent() {
    // Initialize featured Palmon
    this.updateFeaturedPalmon();
    
    // Set updates date
    const updatesDate = document.getElementById('updates-date');
    if (updatesDate) {
      const now = new Date();
      updatesDate.textContent = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Animate trend bars
    setTimeout(() => {
      this.animateTrendBars();
    }, 1000);
  }

  updateFeaturedPalmon() {
    if (!this.processedPalmonData || this.processedPalmonData.length === 0) return;

    // Get a random S-tier Palmon or fallback to any Palmon
    const sTierPalmon = this.processedPalmonData.filter(p => p.tier === 'S');
    const featuredPalmon = sTierPalmon.length > 0 
      ? sTierPalmon[Math.floor(Math.random() * sTierPalmon.length)]
      : this.processedPalmonData[Math.floor(Math.random() * this.processedPalmonData.length)];

    const featuredElement = document.getElementById('featured-palmon');
    if (featuredElement && featuredPalmon) {
      // Create a compact Palmon card for the featured section
      const card = new PalmonCard(featuredPalmon, { 
        compact: true, 
        showDetails: false,
        clickable: true 
      });
      
      featuredElement.innerHTML = '';
      featuredElement.appendChild(card.createElement());
    }
  }

  animateTrendBars() {
    const trendFills = document.querySelectorAll('.trend-fill');
    trendFills.forEach((fill, index) => {
      setTimeout(() => {
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
          fill.style.width = width;
        }, 100);
      }, index * 200);
    });
  }

  showRandomPalmon() {
    if (!this.processedPalmonData || this.processedPalmonData.length === 0) {
      this.showNotification('Palmon data not loaded yet!', 'warning');
      return;
    }

    const randomPalmon = this.processedPalmonData[Math.floor(Math.random() * this.processedPalmonData.length)];
    this.showNotification(`Random Palmon: ${randomPalmon.name} (${randomPalmon.tier}-Tier ${randomPalmon.element})`, 'info');
  }

  initializeFooter() {
    // Set last updated date
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
      const now = new Date();
      lastUpdatedElement.textContent = now.toLocaleDateString();
    }

    // Handle footer link clicks
    document.querySelectorAll('.footer-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const section = href.slice(1);
          this.navigateTo(section);
        }
      });
    });
  }

  navigateTo(section) {
    // Simple hash-based navigation for static hosting
    window.location.hash = section;
    this.showSection(section);
  }

  showSection(section) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(el => {
      el.classList.remove('active');
    });

    // Show target section
    const targetSection = document.querySelector(`#${section}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Special handling for meta analysis section
    if (section === 'meta-analysis' && this.metaAnalyzer) {
      this.metaAnalyzer.renderMetaDashboard();
    }

    // Update page title
    this.updatePageTitle(section);
  }

  updatePageTitle(section) {
    const titles = {
      'home': 'Palmon Masters - Ultimate Strategy Hub',
      'tier-list': 'Tier List - Palmon Masters',
      'team-builder': 'Team Builder - Palmon Masters',
      'meta-analysis': 'Meta Analysis - Palmon Masters',
      'guides': 'Strategy Guides - Palmon Masters'
    };
    
    document.title = titles[section] || 'Palmon Masters';
  }

  hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  initializeMetaAnalysis() {
    // Initialize meta analysis dashboard
    // TODO: Implement MetaAnalyzer class
    console.log('Meta analysis initialization placeholder');
  }

  initializeTeamBuilder() {
    // Initialize team builder components
    const teamBuilderContainer = document.getElementById('team-builder-container');
    if (teamBuilderContainer) {
      // Initialize Palmon selection panel
      const selectionPanelContainer = teamBuilderContainer.querySelector('#palmon-selection-panel');
      if (selectionPanelContainer) {
        this.palmonSelectionPanel = new PalmonSelectionPanel(this.dataUtils, this.teamManager);
        this.palmonSelectionPanel.initialize(selectionPanelContainer);
      }

      // Initialize synergy analyzer
      const synergyAnalyzerContainer = teamBuilderContainer.querySelector('#synergy-analyzer-container');
      if (synergyAnalyzerContainer) {
        // Import and initialize synergy analyzer
        import('./team/synergy-analyzer.js').then(({ default: SynergyAnalyzer }) => {
          this.synergyAnalyzer = new SynergyAnalyzer(this.teamManager, this.dataUtils);
          this.synergyAnalyzer.initialize(synergyAnalyzerContainer);
        }).catch(error => {
          console.error('Failed to load synergy analyzer:', error);
        });
      }

      // Initialize team save/share UI
      const saveShareContainer = teamBuilderContainer.querySelector('#team-save-share-container');
      if (saveShareContainer) {
        this.teamSaveShareUI = new TeamSaveShareUI(this.teamManager, this.dataUtils);
        this.teamSaveShareUI.initialize(saveShareContainer);
        
        // Listen for team changes to update the UI
        document.addEventListener('teamChanged', () => {
          if (this.teamSaveShareUI) {
            this.teamSaveShareUI.onTeamChange();
          }
        });
      }
    }
  }

  initializeTutorialSystem() {
    // Initialize tutorial system and beginner guides
    // TODO: Implement TutorialSystem class
    console.log('Tutorial system initialization placeholder');
  }

  initializeSharingSystem() {
    // Initialize sharing and export features
    // TODO: Implement SharingExportSystem class
    console.log('Sharing system initialization placeholder');
  }

  setupMetaAnalysisNavigation() {
    // Add meta analysis navigation link
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
      const metaLink = document.createElement('a');
      metaLink.href = '#meta-analysis';
      metaLink.className = 'nav-link';
      metaLink.dataset.nav = 'meta-analysis';
      metaLink.innerHTML = `
        <span class="nav-icon">📈</span>
        <span class="nav-text">Meta Analysis</span>
      `;
      
      // Insert before guides link
      const guidesLink = navMenu.querySelector('[data-nav="guides"]');
      if (guidesLink) {
        navMenu.insertBefore(metaLink, guidesLink);
      } else {
        navMenu.appendChild(metaLink);
      }
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style based on type
    const styles = {
      info: 'var(--text-accent)',
      error: 'var(--tier-s)',
      success: 'var(--tier-economy)',
      warning: 'var(--tier-a)'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${styles[type] || styles.info};
      color: white;
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: var(--z-tooltip);
      max-width: 300px;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }
}

// Palmon Detail Modal Component Class
class PalmonDetailModal {
  constructor(palmonData) {
    this.palmon = palmonData;
    this.modal = null;
    this.isVisible = false;
  }

  show() {
    if (this.isVisible) return;
    
    this.createModal();
    document.body.appendChild(this.modal);
    
    // Trigger animation
    requestAnimationFrame(() => {
      this.modal.classList.add('modal-visible');
      this.isVisible = true;
    });

    // Add event listeners
    this.attachEventListeners();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  hide() {
    if (!this.isVisible || !this.modal) return;
    
    this.modal.classList.remove('modal-visible');
    
    setTimeout(() => {
      if (this.modal && this.modal.parentNode) {
        this.modal.parentNode.removeChild(this.modal);
      }
      this.modal = null;
      this.isVisible = false;
      
      // Restore body scroll
      document.body.style.overflow = '';
    }, 300);
  }

  createModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'palmon-detail-modal';
    this.modal.innerHTML = this.generateModalHTML();
  }

  generateModalHTML() {
    const tierClass = this.palmon.tier.toLowerCase();
    const elementClass = this.palmon.element.toLowerCase();
    
    return `
      <div class="modal-backdrop"></div>
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-header-content">
            <div class="palmon-portrait-large">
              <div class="palmon-portrait-placeholder-large">
                <span class="palmon-element-icon-large" data-element="${elementClass}">
                  ${this.getElementIcon(this.palmon.element)}
                </span>
              </div>
              <div class="palmon-tier-indicator-large">
                <span class="badge badge-tier-${tierClass === 'economy' ? 'economy' : tierClass} tier-badge-xl">
                  ${this.palmon.tier}
                </span>
              </div>
            </div>
            <div class="palmon-header-info">
              <h1 class="palmon-detail-name">${this.palmon.name}</h1>
              <div class="palmon-detail-meta">
                <span class="badge badge-${elementClass} element-badge-large">
                  ${this.getElementIcon(this.palmon.element)} ${this.palmon.element}
                </span>
                <span class="palmon-role-large">${this.getRoleIcon(this.palmon.role)} ${this.palmon.role}</span>
              </div>
              <div class="palmon-detail-id">
                <span class="detail-label">ID:</span>
                <span class="detail-value">${this.palmon.id}</span>
              </div>
            </div>
          </div>
          <button class="modal-close-btn" title="Close">
            <span class="close-icon">✕</span>
          </button>
        </div>

        <div class="modal-body">
          <div class="modal-content-grid">
            <!-- Skills Section -->
            <div class="modal-section skills-section">
              <h2 class="section-title">
                <span class="section-icon">⚡</span>
                Skills & Abilities
              </h2>
              <div class="skills-container">
                ${this.generateSkillHTML(this.palmon.skills.skill1, 'skill1', 'Active Skill 1')}
                ${this.generateSkillHTML(this.palmon.skills.skill2, 'skill2', 'Active Skill 2')}
                ${this.generateSkillHTML(this.palmon.skills.passive, 'passive', 'Passive Skill')}
                ${this.palmon.skills.evolve ? this.generateSkillHTML(this.palmon.skills.evolve, 'evolve', 'Evolution Skill') : ''}
              </div>
            </div>

            <!-- Strategic Analysis Section -->
            <div class="modal-section analysis-section">
              <h2 class="section-title">
                <span class="section-icon">📊</span>
                Strategic Analysis
              </h2>
              <div class="analysis-container">
                ${this.generateAnalysisHTML()}
              </div>
            </div>

            <!-- Synergy & Counters Section -->
            <div class="modal-section synergy-section">
              <h2 class="section-title">
                <span class="section-icon">🤝</span>
                Synergies & Counters
              </h2>
              <div class="synergy-container">
                ${this.generateSynergyHTML()}
              </div>
            </div>

            <!-- Usage Guide Section -->
            <div class="modal-section usage-section">
              <h2 class="section-title">
                <span class="section-icon">📚</span>
                Usage Guide
              </h2>
              <div class="usage-container">
                ${this.generateUsageHTML()}
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-actions">
            <button class="btn btn-secondary modal-action-btn" id="add-to-team-btn">
              <span class="btn-icon">➕</span>
              Add to Team
            </button>
            <button class="btn btn-ghost modal-action-btn" id="compare-btn">
              <span class="btn-icon">⚖️</span>
              Compare
            </button>
            <button class="btn btn-ghost modal-action-btn" id="share-btn">
              <span class="btn-icon">🔗</span>
              Share
            </button>
            <button class="btn btn-primary modal-action-btn" id="view-tier-btn">
              <span class="btn-icon">📊</span>
              View in Tier List
            </button>
          </div>
        </div>
      </div>
    `;
  }

  generateSkillHTML(skill, skillType, skillLabel) {
    if (!skill || !skill.name) return '';
    
    const skillTypeClass = skillType === 'passive' ? 'passive' : skillType === 'evolve' ? 'evolve' : 'active';
    const skillIcon = this.getSkillIcon(skillType);
    
    return `
      <div class="skill-card ${skillTypeClass}">
        <div class="skill-header">
          <div class="skill-icon-container">
            <span class="skill-icon">${skillIcon}</span>
          </div>
          <div class="skill-info">
            <h3 class="skill-name">${skill.name}</h3>
            <span class="skill-type">${skillLabel}</span>
          </div>
        </div>
        <div class="skill-description">
          <p>${this.formatSkillDescription(skill.description)}</p>
        </div>
        ${this.generateSkillEffectsHTML(skill)}
      </div>
    `;
  }

  generateSkillEffectsHTML(skill) {
    // Extract potential effects from description for visual formatting
    const effects = this.extractSkillEffects(skill.description);
    if (effects.length === 0) return '';
    
    return `
      <div class="skill-effects">
        <h4 class="effects-title">Key Effects:</h4>
        <ul class="effects-list">
          ${effects.map(effect => `<li class="effect-item">${effect}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  generateAnalysisHTML() {
    const analysis = this.generateStrategicAnalysis();
    
    return `
      <div class="analysis-grid">
        <div class="rating-section">
          <h3 class="analysis-subtitle">Performance Ratings</h3>
          <div class="rating-bars">
            ${this.generateRatingBar('Damage Output', analysis.ratings.damage)}
            ${this.generateRatingBar('Survivability', analysis.ratings.survivability)}
            ${this.generateRatingBar('Utility', analysis.ratings.utility)}
            ${this.generateRatingBar('Synergy Potential', analysis.ratings.synergy)}
            ${this.generateRatingBar('Economy Value', analysis.ratings.economy)}
          </div>
        </div>
        
        <div class="strengths-weaknesses">
          <div class="strengths">
            <h4 class="analysis-subtitle">
              <span class="strength-icon">💪</span>
              Strengths
            </h4>
            <ul class="analysis-list">
              ${analysis.strengths.map(strength => `<li class="analysis-item strength-item">${strength}</li>`).join('')}
            </ul>
          </div>
          
          <div class="weaknesses">
            <h4 class="analysis-subtitle">
              <span class="weakness-icon">⚠️</span>
              Weaknesses
            </h4>
            <ul class="analysis-list">
              ${analysis.weaknesses.map(weakness => `<li class="analysis-item weakness-item">${weakness}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
      
      <div class="tier-justification">
        <h3 class="analysis-subtitle">Tier Placement Justification</h3>
        <p class="tier-explanation">${analysis.tierJustification}</p>
      </div>
    `;
  }

  generateSynergyHTML() {
    const synergies = this.generateSynergyData();
    
    return `
      <div class="synergy-grid">
        <div class="synergy-partners">
          <h3 class="synergy-subtitle">
            <span class="synergy-icon">🤝</span>
            Best Partners
          </h3>
          <div class="partner-list">
            ${synergies.partners.map(partner => this.generatePartnerHTML(partner)).join('')}
          </div>
        </div>
        
        <div class="counters">
          <h3 class="synergy-subtitle">
            <span class="counter-icon">⚔️</span>
            Counters & Threats
          </h3>
          <div class="counter-list">
            ${synergies.counters.map(counter => this.generateCounterHTML(counter)).join('')}
          </div>
        </div>
        
        <div class="element-synergies">
          <h3 class="synergy-subtitle">
            <span class="element-icon">${this.getElementIcon(this.palmon.element)}</span>
            ${this.palmon.element} Element Synergies
          </h3>
          <div class="element-synergy-info">
            ${this.generateElementSynergyHTML()}
          </div>
        </div>
      </div>
    `;
  }

  generateUsageHTML() {
    const usage = this.generateUsageGuide();
    
    return `
      <div class="usage-guide">
        <div class="positioning-guide">
          <h3 class="usage-subtitle">
            <span class="position-icon">📍</span>
            Optimal Positioning
          </h3>
          <p class="usage-text">${usage.positioning}</p>
        </div>
        
        <div class="timing-guide">
          <h3 class="usage-subtitle">
            <span class="timing-icon">⏰</span>
            Skill Timing
          </h3>
          <p class="usage-text">${usage.timing}</p>
        </div>
        
        <div class="team-role">
          <h3 class="usage-subtitle">
            <span class="role-icon">${this.getRoleIcon(this.palmon.role)}</span>
            Team Role
          </h3>
          <p class="usage-text">${usage.teamRole}</p>
        </div>
        
        <div class="matchup-tips">
          <h3 class="usage-subtitle">
            <span class="tips-icon">💡</span>
            Pro Tips
          </h3>
          <ul class="tips-list">
            ${usage.tips.map(tip => `<li class="tip-item">${tip}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // Helper methods for generating content
  getElementIcon(element) {
    const icons = {
      'Fire': '🔥',
      'Water': '💧',
      'Earth': '🌱',
      'Electric': '⚡'
    };
    return icons[element] || '❓';
  }

  getRoleIcon(role) {
    const icons = {
      'Tank': '🛡️',
      'DPS': '⚔️',
      'Support': '💚',
      'Control': '🎯'
    };
    return icons[role] || '❓';
  }

  getSkillIcon(skillType) {
    const icons = {
      'skill1': '🎯',
      'skill2': '💥',
      'passive': '🔄',
      'evolve': '⭐'
    };
    return icons[skillType] || '⚡';
  }

  formatSkillDescription(description) {
    if (!description) return 'No description available.';
    
    // Format percentages and numbers for better readability
    return description
      .replace(/(\d+)%/g, '<span class="skill-value">$1%</span>')
      .replace(/(\d+) times?/g, '<span class="skill-count">$1 times</span>')
      .replace(/(\d+) damage/g, '<span class="skill-damage">$1 damage</span>');
  }

  extractSkillEffects(description) {
    const effects = [];
    
    // Extract common effect patterns
    if (description.includes('damage')) {
      effects.push('Deals damage to enemies');
    }
    if (description.includes('heal')) {
      effects.push('Provides healing effects');
    }
    if (description.includes('buff') || description.includes('enhance')) {
      effects.push('Buffs allies or self');
    }
    if (description.includes('debuff') || description.includes('reduce')) {
      effects.push('Applies debuffs to enemies');
    }
    if (description.includes('chance')) {
      effects.push('Has probability-based activation');
    }
    
    return effects;
  }

  generateRatingBar(label, value) {
    const percentage = Math.min(100, Math.max(0, value * 20)); // Convert 1-5 scale to percentage
    const ratingClass = value >= 4 ? 'excellent' : value >= 3 ? 'good' : value >= 2 ? 'average' : 'poor';
    
    return `
      <div class="rating-item">
        <div class="rating-label">${label}</div>
        <div class="rating-bar">
          <div class="rating-fill ${ratingClass}" style="width: ${percentage}%"></div>
        </div>
        <div class="rating-value">${value}/5</div>
      </div>
    `;
  }

  generateStrategicAnalysis() {
    // Generate analysis based on tier and role
    const tierRatings = {
      'S': { damage: 5, survivability: 5, utility: 5, synergy: 5, economy: 3 },
      'A': { damage: 4, survivability: 4, utility: 4, synergy: 4, economy: 4 },
      'B': { damage: 3, survivability: 3, utility: 3, synergy: 3, economy: 4 },
      'C': { damage: 2, survivability: 2, utility: 2, synergy: 2, economy: 4 },
      'Economy': { damage: 2, survivability: 2, utility: 2, synergy: 2, economy: 5 }
    };

    const baseRatings = tierRatings[this.palmon.tier] || tierRatings['C'];
    
    // Adjust ratings based on role
    const roleAdjustments = {
      'Tank': { survivability: 1, damage: -1 },
      'DPS': { damage: 1, survivability: -1 },
      'Support': { utility: 1, synergy: 1, damage: -1 },
      'Control': { utility: 1, synergy: 1, survivability: -1 }
    };

    const adjustments = roleAdjustments[this.palmon.role] || {};
    const ratings = { ...baseRatings };
    
    Object.keys(adjustments).forEach(key => {
      ratings[key] = Math.min(5, Math.max(1, ratings[key] + adjustments[key]));
    });

    return {
      ratings,
      strengths: this.generateStrengths(),
      weaknesses: this.generateWeaknesses(),
      tierJustification: this.generateTierJustification()
    };
  }

  generateStrengths() {
    const strengths = [];
    
    if (this.palmon.tier === 'S') {
      strengths.push('Exceptional performance in current meta');
      strengths.push('High impact in team compositions');
    }
    
    if (this.palmon.role === 'Tank') {
      strengths.push('Strong defensive capabilities');
      strengths.push('Excellent frontline presence');
    } else if (this.palmon.role === 'DPS') {
      strengths.push('High damage output potential');
      strengths.push('Strong offensive capabilities');
    } else if (this.palmon.role === 'Support') {
      strengths.push('Valuable team utility');
      strengths.push('Strong synergy enabler');
    }
    
    if (this.palmon.element === 'Fire') {
      strengths.push('Aggressive playstyle synergy');
    } else if (this.palmon.element === 'Water') {
      strengths.push('Balanced offensive/defensive options');
    } else if (this.palmon.element === 'Earth') {
      strengths.push('Solid defensive foundation');
    } else if (this.palmon.element === 'Electric') {
      strengths.push('High-speed combat effectiveness');
    }
    
    return strengths.slice(0, 4); // Limit to 4 strengths
  }

  generateWeaknesses() {
    const weaknesses = [];
    
    if (this.palmon.tier === 'C' || this.palmon.tier === 'Economy') {
      weaknesses.push('Limited late-game scaling');
      weaknesses.push('Outclassed by higher-tier alternatives');
    }
    
    if (this.palmon.role === 'Tank') {
      weaknesses.push('Lower damage output');
    } else if (this.palmon.role === 'DPS') {
      weaknesses.push('Vulnerable to focused fire');
    } else if (this.palmon.role === 'Support') {
      weaknesses.push('Dependent on team coordination');
    }
    
    weaknesses.push('Requires specific team compositions for optimal performance');
    
    return weaknesses.slice(0, 3); // Limit to 3 weaknesses
  }

  generateTierJustification() {
    const justifications = {
      'S': `${this.palmon.name} earns its S-tier placement through exceptional performance across multiple metrics. Its combination of powerful abilities, strong synergies, and meta relevance makes it a top-tier choice for competitive play.`,
      'A': `${this.palmon.name} is a solid A-tier performer with strong capabilities in its role. While not quite reaching S-tier dominance, it offers reliable performance and good synergy potential in most team compositions.`,
      'B': `${this.palmon.name} represents a balanced B-tier choice with decent performance in its designated role. It may require more specific team setups to shine but can be effective in the right circumstances.`,
      'C': `${this.palmon.name} is placed in C-tier due to limited impact compared to higher-tier alternatives. While still usable, it may struggle in competitive environments without significant support.`,
      'Economy': `${this.palmon.name} excels in its Economy tier role, providing excellent value for resource management and early-game progression. While not a late-game powerhouse, it serves its purpose effectively.`
    };
    
    return justifications[this.palmon.tier] || justifications['C'];
  }

  generateSynergyData() {
    // Get all available Palmon data for cross-referencing
    const app = window.palmonApp;
    const allPalmon = app?.processedPalmonData || [];
    
    // Generate specific synergy partners based on element, role, and tier
    const elementPartners = this.getElementSynergyPartners(allPalmon);
    const rolePartners = this.getRoleSynergyPartners(allPalmon);
    const specificPartners = this.getSpecificSynergyPartners(allPalmon);
    
    // Generate counter information
    const elementCounters = this.getElementCounters(allPalmon);
    const roleCounters = this.getRoleCounters(allPalmon);
    const specificCounters = this.getSpecificCounters(allPalmon);

    return {
      partners: [
        ...elementPartners,
        ...rolePartners,
        ...specificPartners
      ].slice(0, 6), // Limit to top 6 partners
      counters: [
        ...elementCounters,
        ...roleCounters,
        ...specificCounters
      ].slice(0, 6) // Limit to top 6 counters
    };
  }

  getElementSynergyPartners(allPalmon) {
    // Find Palmon of the same element with good synergy potential
    const sameElementPalmon = allPalmon.filter(p => 
      p.element === this.palmon.element && 
      p.id !== this.palmon.id &&
      (p.tier === 'S' || p.tier === 'A' || (this.palmon.tier === 'B' && p.tier === 'B'))
    );

    return sameElementPalmon.slice(0, 3).map(partner => ({
      name: partner.name,
      id: partner.id,
      tier: partner.tier,
      element: partner.element,
      role: partner.role,
      type: 'element',
      description: `Strong ${this.palmon.element} element synergy. ${this.getElementSynergyExplanation(partner)}`,
      synergyStrength: this.calculateSynergyStrength(partner, 'element'),
      clickable: true
    }));
  }

  getRoleSynergyPartners(allPalmon) {
    // Find complementary roles that work well together
    const complementaryRoles = this.getComplementaryRoles(this.palmon.role);
    const rolePartners = allPalmon.filter(p => 
      complementaryRoles.includes(p.role) && 
      p.id !== this.palmon.id &&
      (p.tier === 'S' || p.tier === 'A' || (this.palmon.tier !== 'Economy' && p.tier === 'B'))
    );

    return rolePartners.slice(0, 2).map(partner => ({
      name: partner.name,
      id: partner.id,
      tier: partner.tier,
      element: partner.element,
      role: partner.role,
      type: 'role',
      description: `Excellent ${this.palmon.role}-${partner.role} synergy. ${this.getRoleSynergyExplanation(partner)}`,
      synergyStrength: this.calculateSynergyStrength(partner, 'role'),
      clickable: true
    }));
  }

  getSpecificSynergyPartners(allPalmon) {
    // Define specific synergy combinations based on game knowledge
    const specificSynergies = this.getSpecificSynergyMappings();
    const partnerNames = specificSynergies[this.palmon.name] || [];
    
    const specificPartners = allPalmon.filter(p => 
      partnerNames.includes(p.name) && p.id !== this.palmon.id
    );

    return specificPartners.map(partner => ({
      name: partner.name,
      id: partner.id,
      tier: partner.tier,
      element: partner.element,
      role: partner.role,
      type: 'specific',
      description: `Unique synergy combination. ${this.getSpecificSynergyExplanation(partner)}`,
      synergyStrength: this.calculateSynergyStrength(partner, 'specific'),
      clickable: true
    }));
  }

  getElementCounters(allPalmon) {
    // Find Palmon that counter this element type
    const counterElements = this.getCounterElements(this.palmon.element);
    const elementCounters = allPalmon.filter(p => 
      counterElements.includes(p.element) && 
      p.id !== this.palmon.id &&
      (p.tier === 'S' || p.tier === 'A')
    );

    return elementCounters.slice(0, 2).map(counter => ({
      name: counter.name,
      id: counter.id,
      tier: counter.tier,
      element: counter.element,
      role: counter.role,
      type: 'element',
      description: `${counter.element} element advantage. ${this.getElementCounterExplanation(counter)}`,
      threatLevel: this.calculateThreatLevel(counter, 'element'),
      clickable: true
    }));
  }

  getRoleCounters(allPalmon) {
    // Find roles that typically counter this Palmon's role
    const counterRoles = this.getCounterRoles(this.palmon.role);
    const roleCounters = allPalmon.filter(p => 
      counterRoles.includes(p.role) && 
      p.id !== this.palmon.id &&
      (p.tier === 'S' || p.tier === 'A')
    );

    return roleCounters.slice(0, 2).map(counter => ({
      name: counter.name,
      id: counter.id,
      tier: counter.tier,
      element: counter.element,
      role: counter.role,
      type: 'role',
      description: `${counter.role} role advantage. ${this.getRoleCounterExplanation(counter)}`,
      threatLevel: this.calculateThreatLevel(counter, 'role'),
      clickable: true
    }));
  }

  getSpecificCounters(allPalmon) {
    // Define specific counter relationships
    const specificCounters = this.getSpecificCounterMappings();
    const counterNames = specificCounters[this.palmon.name] || [];
    
    const specificCounterPalmon = allPalmon.filter(p => 
      counterNames.includes(p.name) && p.id !== this.palmon.id
    );

    return specificCounterPalmon.map(counter => ({
      name: counter.name,
      id: counter.id,
      tier: counter.tier,
      element: counter.element,
      role: counter.role,
      type: 'specific',
      description: `Direct counter matchup. ${this.getSpecificCounterExplanation(counter)}`,
      threatLevel: this.calculateThreatLevel(counter, 'specific'),
      clickable: true
    }));
  }

  // Helper methods for synergy calculations
  getComplementaryRoles(role) {
    const complementary = {
      'Tank': ['DPS', 'Support'],
      'DPS': ['Tank', 'Support'],
      'Support': ['Tank', 'DPS', 'Control'],
      'Control': ['Tank', 'DPS']
    };
    return complementary[role] || [];
  }

  getCounterElements(element) {
    // Define element counter relationships (can be expanded based on game mechanics)
    const counters = {
      'Fire': ['Water'],
      'Water': ['Electric'],
      'Electric': ['Earth'],
      'Earth': ['Fire']
    };
    return counters[element] || [];
  }

  getCounterRoles(role) {
    const counters = {
      'Tank': ['Control', 'DPS'],
      'DPS': ['Tank'],
      'Support': ['DPS', 'Control'],
      'Control': ['DPS']
    };
    return counters[role] || [];
  }

  getSpecificSynergyMappings() {
    // Define specific Palmon synergies based on game knowledge
    return {
      'Barkplug': ['Statchew', 'Lucidina', 'Battereina'],
      'Statchew': ['Barkplug', 'Hoofrit', 'Terrastudo'],
      'Escarffier': ['Wyvierno', 'Incineraptor', 'Vulcanid'],
      'Snowkami': ['Ninjump', 'Bruiseberry', 'Lendanear'],
      'Hoofrit': ['Statchew', 'Maximito', 'Cerverdant'],
      'Lucidina': ['Barkplug', 'Battereina', 'Kilohopp'],
      'Battereina': ['Barkplug', 'Lucidina', 'Thunderclawd'],
      'Ninjump': ['Snowkami', 'Herculeaf', 'Ghillant'],
      'Wyvierno': ['Escarffier', 'Incineraptor']
    };
  }

  getSpecificCounterMappings() {
    // Define specific counter relationships
    return {
      'Barkplug': ['Snowkami', 'Ninjump', 'Bruiseberry'],
      'Statchew': ['Escarffier', 'Wyvierno', 'Incineraptor'],
      'Escarffier': ['Snowkami', 'Bruiseberry', 'Dolphriend'],
      'Snowkami': ['Battereina', 'Thunderclawd', 'Voltbolt'],
      'Hoofrit': ['Escarffier', 'Wyvierno', 'Vulcanid'],
      'Lucidina': ['Statchew', 'Hoofrit', 'Terrastudo'],
      'Battereina': ['Statchew', 'Maximito', 'Axollium'],
      'Ninjump': ['Battereina', 'Lucidina', 'Kilohopp'],
      'Wyvierno': ['Snowkami', 'Ninjump', 'Lendanear']
    };
  }

  calculateSynergyStrength(partner, type) {
    let strength = 3; // Base strength
    
    // Adjust based on tier compatibility
    if (partner.tier === this.palmon.tier) strength += 1;
    if (partner.tier === 'S' || this.palmon.tier === 'S') strength += 1;
    
    // Adjust based on synergy type
    if (type === 'specific') strength += 2;
    if (type === 'element') strength += 1;
    
    return Math.min(5, strength);
  }

  calculateThreatLevel(counter, type) {
    let threat = 3; // Base threat
    
    // Adjust based on tier difference
    if (counter.tier === 'S' && this.palmon.tier !== 'S') threat += 2;
    if (counter.tier === 'A' && (this.palmon.tier === 'C' || this.palmon.tier === 'Economy')) threat += 1;
    
    // Adjust based on counter type
    if (type === 'specific') threat += 2;
    if (type === 'element') threat += 1;
    
    return Math.min(5, threat);
  }

  // Explanation methods
  getElementSynergyExplanation(partner) {
    const explanations = {
      'Fire': 'Amplifies aggressive strategies and burst damage potential.',
      'Water': 'Provides balanced offensive and defensive synergies.',
      'Earth': 'Strengthens defensive formations and sustainability.',
      'Electric': 'Enhances speed and utility-based strategies.'
    };
    return explanations[partner.element] || 'Provides elemental synergy benefits.';
  }

  getRoleSynergyExplanation(partner) {
    const explanations = {
      'Tank-DPS': 'Tank provides protection while DPS delivers damage.',
      'Tank-Support': 'Tank absorbs damage while Support provides utility.',
      'DPS-Support': 'Support enables DPS to maximize damage output.',
      'DPS-Control': 'Control creates opportunities for DPS to strike.',
      'Support-Control': 'Combined utility and battlefield control.',
      'Tank-Control': 'Control supports Tank positioning and presence.'
    };
    
    const key = `${this.palmon.role}-${partner.role}`;
    const reverseKey = `${partner.role}-${this.palmon.role}`;
    
    return explanations[key] || explanations[reverseKey] || 'Provides complementary role benefits.';
  }

  getSpecificSynergyExplanation(partner) {
    // This could be expanded with specific ability interactions
    return `Unique ability interactions create powerful combination effects.`;
  }

  getElementCounterExplanation(counter) {
    const explanations = {
      'Fire': 'Fire abilities are effective against Earth defenses.',
      'Water': 'Water attacks counter Fire-based strategies.',
      'Electric': 'Electric speed overwhelms Water-based tactics.',
      'Earth': 'Earth stability counters Electric mobility.'
    };
    return explanations[counter.element] || 'Has elemental advantage in this matchup.';
  }

  getRoleCounterExplanation(counter) {
    const explanations = {
      'Tank': 'High durability counters burst damage strategies.',
      'DPS': 'High damage output can overwhelm defensive positions.',
      'Support': 'Utility and healing counter aggressive strategies.',
      'Control': 'Battlefield control disrupts enemy positioning.'
    };
    return explanations[counter.role] || 'Role provides strategic advantage.';
  }

  getSpecificCounterExplanation(counter) {
    return `Specific abilities and positioning create unfavorable matchups.`;
  }

  generatePartnerHTML(partner) {
    const tierClass = partner.tier?.toLowerCase() === 'economy' ? 'economy' : partner.tier?.toLowerCase() || 'c';
    const elementClass = partner.element?.toLowerCase() || 'earth';
    const synergyStars = '★'.repeat(partner.synergyStrength || 3);
    
    return `
      <div class="partner-item ${partner.clickable ? 'clickable' : ''}" ${partner.clickable ? `data-palmon-id="${partner.id}"` : ''}>
        <div class="partner-header">
          <div class="partner-portrait">
            <div class="partner-portrait-placeholder">
              <span class="partner-element-icon" data-element="${elementClass}">
                ${this.getElementIcon(partner.element)}
              </span>
            </div>
            <div class="partner-tier-badge">
              <span class="badge badge-tier-${tierClass}">${partner.tier}</span>
            </div>
          </div>
          <div class="partner-info">
            <h4 class="partner-name">${partner.name}</h4>
            <div class="partner-meta">
              <span class="partner-role">${this.getRoleIcon(partner.role)} ${partner.role}</span>
              <div class="synergy-strength">
                <span class="synergy-stars">${synergyStars}</span>
                <span class="synergy-label">Synergy</span>
              </div>
            </div>
          </div>
          ${partner.clickable ? `
            <div class="partner-actions">
              <button class="btn btn-xs btn-ghost partner-view-btn" data-palmon-id="${partner.id}">
                <span class="btn-icon">👁️</span>
              </button>
              <button class="btn btn-xs btn-secondary partner-compare-btn" data-palmon-id="${partner.id}">
                <span class="btn-icon">⚖️</span>
              </button>
            </div>
          ` : ''}
        </div>
        <div class="partner-description">
          <p>${partner.description}</p>
          <div class="synergy-type-badge">
            <span class="badge badge-${partner.type || 'general'}">${this.getSynergyTypeLabel(partner.type)}</span>
          </div>
        </div>
      </div>
    `;
  }

  generateCounterHTML(counter) {
    const tierClass = counter.tier?.toLowerCase() === 'economy' ? 'economy' : counter.tier?.toLowerCase() || 'c';
    const elementClass = counter.element?.toLowerCase() || 'earth';
    const threatStars = '⚠️'.repeat(counter.threatLevel || 3);
    
    return `
      <div class="counter-item ${counter.clickable ? 'clickable' : ''}" ${counter.clickable ? `data-palmon-id="${counter.id}"` : ''}>
        <div class="counter-header">
          <div class="counter-portrait">
            <div class="counter-portrait-placeholder">
              <span class="counter-element-icon" data-element="${elementClass}">
                ${this.getElementIcon(counter.element)}
              </span>
            </div>
            <div class="counter-tier-badge">
              <span class="badge badge-tier-${tierClass}">${counter.tier}</span>
            </div>
          </div>
          <div class="counter-info">
            <h4 class="counter-name">${counter.name}</h4>
            <div class="counter-meta">
              <span class="counter-role">${this.getRoleIcon(counter.role)} ${counter.role}</span>
              <div class="threat-level">
                <span class="threat-stars">${threatStars}</span>
                <span class="threat-label">Threat</span>
              </div>
            </div>
          </div>
          ${counter.clickable ? `
            <div class="counter-actions">
              <button class="btn btn-xs btn-ghost counter-view-btn" data-palmon-id="${counter.id}">
                <span class="btn-icon">👁️</span>
              </button>
              <button class="btn btn-xs btn-secondary counter-compare-btn" data-palmon-id="${counter.id}">
                <span class="btn-icon">⚖️</span>
              </button>
            </div>
          ` : ''}
        </div>
        <div class="counter-description">
          <p>${counter.description}</p>
          <div class="counter-type-badge">
            <span class="badge badge-${counter.type || 'general'}">${this.getCounterTypeLabel(counter.type)}</span>
          </div>
        </div>
      </div>
    `;
  }

  getSynergyTypeLabel(type) {
    const labels = {
      'element': 'Element Synergy',
      'role': 'Role Synergy',
      'specific': 'Unique Combo',
      'general': 'General Synergy'
    };
    return labels[type] || 'Synergy';
  }

  getCounterTypeLabel(type) {
    const labels = {
      'element': 'Element Counter',
      'role': 'Role Counter',
      'specific': 'Direct Counter',
      'general': 'General Counter'
    };
    return labels[type] || 'Counter';
  }

  generateElementSynergyHTML() {
    const elementSynergies = {
      'Fire': 'Fire Palmon excel in aggressive compositions, providing high damage output and offensive pressure. They synergize well with other Fire types for elemental bonuses.',
      'Water': 'Water Palmon offer balanced capabilities with both offensive and defensive options. They provide flexibility in team compositions and adapt well to various strategies.',
      'Earth': 'Earth Palmon focus on defensive stability and support capabilities. They form the backbone of defensive compositions and provide excellent survivability.',
      'Electric': 'Electric Palmon specialize in speed and utility, offering quick strikes and support abilities. They excel in fast-paced, high-mobility strategies.'
    };
    
    return `<p class="element-synergy-text">${elementSynergies[this.palmon.element] || 'Provides unique elemental advantages in team compositions.'}</p>`;
  }

  generateUsageGuide() {
    const roleGuides = {
      'Tank': {
        positioning: 'Place in front row to absorb damage and protect backline allies. Focus on maintaining aggro and controlling enemy positioning.',
        timing: 'Use defensive abilities early in combat to establish presence. Save emergency abilities for critical moments.',
        teamRole: 'Primary damage absorber and frontline controller. Enables aggressive positioning for DPS allies.',
        tips: [
          'Position to protect vulnerable allies',
          'Use abilities to control enemy movement',
          'Coordinate with healers for maximum survivability',
          'Focus on disrupting enemy formations'
        ]
      },
      'DPS': {
        positioning: 'Optimal placement depends on range - melee DPS in front, ranged in back. Focus on high-value targets.',
        timing: 'Coordinate burst damage with team abilities. Save powerful skills for key moments in combat.',
        teamRole: 'Primary damage dealer responsible for eliminating threats. Focus on target prioritization.',
        tips: [
          'Target enemy supports and DPS first',
          'Coordinate with tanks for protection',
          'Time abilities for maximum impact',
          'Maintain safe positioning while dealing damage'
        ]
      },
      'Support': {
        positioning: 'Usually placed in back row for safety. Position to maximize ability coverage of allies.',
        timing: 'Use abilities proactively to prevent damage rather than reactively. Maintain consistent support.',
        teamRole: 'Enables team performance through buffs, healing, and utility. Critical for team sustainability.',
        tips: [
          'Prioritize keeping key allies alive',
          'Use abilities before they\'re desperately needed',
          'Position safely but within support range',
          'Coordinate with team for maximum effectiveness'
        ]
      },
      'Control': {
        positioning: 'Flexible positioning based on ability range. Focus on controlling key battlefield areas.',
        timing: 'Use control abilities to disrupt enemy strategies and create opportunities for allies.',
        teamRole: 'Battlefield controller that creates advantages through positioning and timing manipulation.',
        tips: [
          'Disrupt enemy formations and strategies',
          'Create opportunities for ally abilities',
          'Control key battlefield positions',
          'Time abilities to maximize disruption'
        ]
      }
    };
    
    return roleGuides[this.palmon.role] || roleGuides['DPS'];
  }

  attachEventListeners() {
    // Close button
    const closeBtn = this.modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }

    // Backdrop click
    const backdrop = this.modal.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.hide());
    }

    // Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.hide();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Action buttons
    const addToTeamBtn = this.modal.querySelector('#add-to-team-btn');
    if (addToTeamBtn) {
      addToTeamBtn.addEventListener('click', () => {
        this.addToTeam();
      });
    }

    const compareBtn = this.modal.querySelector('#compare-btn');
    if (compareBtn) {
      compareBtn.addEventListener('click', () => {
        this.openComparison();
      });
    }

    const shareBtn = this.modal.querySelector('#share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.sharePalmon();
      });
    }

    const viewTierBtn = this.modal.querySelector('#view-tier-btn');
    if (viewTierBtn) {
      viewTierBtn.addEventListener('click', () => {
        this.viewInTierList();
      });
    }

    // Partner and counter interaction buttons
    this.attachSynergyEventListeners();
  }

  addToTeam() {
    // Dispatch custom event for team builder
    const event = new CustomEvent('palmon-add-to-team', {
      detail: { palmon: this.palmon }
    });
    document.dispatchEvent(event);
    
    // Show notification
    const app = window.palmonApp;
    if (app) {
      app.showNotification(`${this.palmon.name} added to team!`, 'success');
    }
    
    this.hide();
  }

  openComparison() {
    // Open comparison modal with this Palmon
    const comparisonManager = PalmonComparisonManager.getInstance();
    comparisonManager.addPalmon(this.palmon);
    comparisonManager.show();
  }

  sharePalmon() {
    // Create shareable URL
    const shareUrl = `${window.location.origin}${window.location.pathname}#palmon-${this.palmon.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${this.palmon.name} - Palmon Masters`,
        text: `Check out ${this.palmon.name}, a ${this.palmon.tier}-tier ${this.palmon.element} ${this.palmon.role} in Palmon: Survival Min|Max!`,
        url: shareUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        const app = window.palmonApp;
        if (app) {
          app.showNotification('Share link copied to clipboard!', 'success');
        }
      });
    }
  }

  viewInTierList() {
    // Navigate to tier list and highlight this Palmon
    const app = window.palmonApp;
    if (app) {
      app.navigateTo('tier-list');
      // Highlight the Palmon in tier list (implementation depends on tier list structure)
      setTimeout(() => {
        const palmonCard = document.querySelector(`[data-palmon-id="${this.palmon.id}"]`);
        if (palmonCard) {
          palmonCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          palmonCard.classList.add('highlighted');
          setTimeout(() => palmonCard.classList.remove('highlighted'), 3000);
        }
      }, 500);
    }
    
    this.hide();
  }

  attachSynergyEventListeners() {
    // Partner view buttons
    const partnerViewBtns = this.modal.querySelectorAll('.partner-view-btn');
    partnerViewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const palmonId = btn.dataset.palmonId;
        this.viewRelatedPalmon(palmonId);
      });
    });

    // Partner compare buttons
    const partnerCompareBtns = this.modal.querySelectorAll('.partner-compare-btn');
    partnerCompareBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const palmonId = btn.dataset.palmonId;
        this.compareWithRelatedPalmon(palmonId);
      });
    });

    // Counter view buttons
    const counterViewBtns = this.modal.querySelectorAll('.counter-view-btn');
    counterViewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const palmonId = btn.dataset.palmonId;
        this.viewRelatedPalmon(palmonId);
      });
    });

    // Counter compare buttons
    const counterCompareBtns = this.modal.querySelectorAll('.counter-compare-btn');
    counterCompareBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const palmonId = btn.dataset.palmonId;
        this.compareWithRelatedPalmon(palmonId);
      });
    });

    // Clickable partner/counter items
    const clickablePartners = this.modal.querySelectorAll('.partner-item.clickable');
    clickablePartners.forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.closest('.partner-actions')) {
          const palmonId = item.dataset.palmonId;
          this.viewRelatedPalmon(palmonId);
        }
      });
    });

    const clickableCounters = this.modal.querySelectorAll('.counter-item.clickable');
    clickableCounters.forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.closest('.counter-actions')) {
          const palmonId = item.dataset.palmonId;
          this.viewRelatedPalmon(palmonId);
        }
      });
    });
  }

  viewRelatedPalmon(palmonId) {
    const app = window.palmonApp;
    if (!app || !app.processedPalmonData) return;

    const relatedPalmon = app.processedPalmonData.find(p => p.id === palmonId);
    if (relatedPalmon) {
      // Hide current modal and show the related Palmon's modal
      this.hide();
      setTimeout(() => {
        const relatedModal = new PalmonDetailModal(relatedPalmon);
        relatedModal.show();
      }, 300);
    }
  }

  compareWithRelatedPalmon(palmonId) {
    const app = window.palmonApp;
    if (!app || !app.processedPalmonData) return;

    const relatedPalmon = app.processedPalmonData.find(p => p.id === palmonId);
    if (relatedPalmon) {
      // Add both current and related Palmon to comparison
      const comparisonManager = PalmonComparisonManager.getInstance();
      comparisonManager.addPalmon(this.palmon);
      comparisonManager.addPalmon(relatedPalmon);
      
      // Hide current modal and show comparison
      this.hide();
      setTimeout(() => {
        comparisonManager.show();
      }, 300);
    }
  }
}

// Palmon Comparison Manager Class (Singleton)
class PalmonComparisonManager {
  static instance = null;
  
  static getInstance() {
    if (!PalmonComparisonManager.instance) {
      PalmonComparisonManager.instance = new PalmonComparisonManager();
    }
    return PalmonComparisonManager.instance;
  }

  constructor() {
    if (PalmonComparisonManager.instance) {
      return PalmonComparisonManager.instance;
    }
    
    this.comparedPalmon = [];
    this.maxComparisons = 3; // Maximum number of Palmon to compare at once
    this.modal = null;
    this.isVisible = false;
    
    PalmonComparisonManager.instance = this;
  }

  addPalmon(palmon) {
    // Check if Palmon is already in comparison
    const existingIndex = this.comparedPalmon.findIndex(p => p.id === palmon.id);
    if (existingIndex !== -1) {
      // Already in comparison, just show the modal
      return;
    }

    // Add new Palmon, remove oldest if at max capacity
    if (this.comparedPalmon.length >= this.maxComparisons) {
      this.comparedPalmon.shift(); // Remove first (oldest) Palmon
    }
    
    this.comparedPalmon.push(palmon);
    
    // Update modal if it's visible
    if (this.isVisible) {
      this.updateModal();
    }
  }

  removePalmon(palmonId) {
    this.comparedPalmon = this.comparedPalmon.filter(p => p.id !== palmonId);
    
    if (this.comparedPalmon.length === 0) {
      this.hide();
    } else if (this.isVisible) {
      this.updateModal();
    }
  }

  clearAll() {
    this.comparedPalmon = [];
    if (this.isVisible) {
      this.hide();
    }
  }

  show() {
    if (this.comparedPalmon.length === 0) {
      const app = window.palmonApp;
      if (app) {
        app.showNotification('No Palmon selected for comparison', 'warning');
      }
      return;
    }

    if (this.isVisible) {
      this.updateModal();
      return;
    }
    
    this.createModal();
    document.body.appendChild(this.modal);
    
    // Trigger animation
    requestAnimationFrame(() => {
      this.modal.classList.add('modal-visible');
      this.isVisible = true;
    });

    // Add event listeners
    this.attachEventListeners();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  hide() {
    if (!this.isVisible || !this.modal) return;
    
    this.modal.classList.remove('modal-visible');
    
    setTimeout(() => {
      if (this.modal && this.modal.parentNode) {
        this.modal.parentNode.removeChild(this.modal);
      }
      this.modal = null;
      this.isVisible = false;
      
      // Restore body scroll
      document.body.style.overflow = '';
    }, 300);
  }

  createModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'palmon-comparison-modal';
    this.modal.innerHTML = this.generateModalHTML();
  }

  updateModal() {
    if (!this.modal) return;
    
    const modalContainer = this.modal.querySelector('.modal-container');
    if (modalContainer) {
      modalContainer.innerHTML = this.generateModalContent();
      this.attachModalEventListeners();
    }
  }

  generateModalHTML() {
    return `
      <div class="modal-backdrop"></div>
      <div class="modal-container">
        ${this.generateModalContent()}
      </div>
    `;
  }

  generateModalContent() {
    return `
      <div class="comparison-header">
        <div class="comparison-header-content">
          <h1 class="comparison-title">
            <span class="comparison-icon">⚖️</span>
            Palmon Comparison
          </h1>
          <div class="comparison-meta">
            <span class="comparison-count">${this.comparedPalmon.length} of ${this.maxComparisons} Palmon</span>
          </div>
        </div>
        <div class="comparison-actions">
          <button class="btn btn-ghost btn-sm" id="add-palmon-btn">
            <span class="btn-icon">➕</span>
            Add Palmon
          </button>
          <button class="btn btn-secondary btn-sm" id="clear-comparison-btn">
            <span class="btn-icon">🗑️</span>
            Clear All
          </button>
          <button class="modal-close-btn" title="Close">
            <span class="close-icon">✕</span>
          </button>
        </div>
      </div>

      <div class="comparison-body">
        <div class="comparison-grid">
          ${this.generateComparisonTable()}
        </div>
      </div>

      <div class="comparison-footer">
        <div class="comparison-footer-actions">
          <button class="btn btn-ghost" id="export-comparison-btn">
            <span class="btn-icon">📊</span>
            Export Comparison
          </button>
          <button class="btn btn-secondary" id="share-comparison-btn">
            <span class="btn-icon">🔗</span>
            Share Comparison
          </button>
        </div>
      </div>
    `;
  }

  generateComparisonTable() {
    if (this.comparedPalmon.length === 0) {
      return `
        <div class="comparison-empty">
          <div class="empty-state">
            <span class="empty-icon">⚖️</span>
            <h3 class="empty-title">No Palmon to Compare</h3>
            <p class="empty-description">Add Palmon to start comparing their stats and abilities</p>
            <button class="btn btn-primary" id="add-first-palmon-btn">
              <span class="btn-icon">➕</span>
              Add Palmon
            </button>
          </div>
        </div>
      `;
    }

    const comparisonData = this.generateComparisonData();
    
    return `
      <div class="comparison-table">
        <!-- Header Row with Palmon Cards -->
        <div class="comparison-row comparison-header-row">
          <div class="comparison-cell comparison-label-cell">
            <span class="comparison-section-title">Palmon</span>
          </div>
          ${this.comparedPalmon.map(palmon => this.generatePalmonHeaderCell(palmon)).join('')}
        </div>

        <!-- Basic Info Section -->
        <div class="comparison-section">
          <div class="comparison-section-header">
            <h3 class="section-title">
              <span class="section-icon">📋</span>
              Basic Information
            </h3>
          </div>
          
          ${this.generateComparisonRow('Tier', this.comparedPalmon.map(p => ({
            value: p.tier,
            display: `<span class="badge badge-tier-${p.tier.toLowerCase() === 'economy' ? 'economy' : p.tier.toLowerCase()}">${p.tier}</span>`,
            sortValue: this.getTierSortValue(p.tier)
          })))}
          
          ${this.generateComparisonRow('Element', this.comparedPalmon.map(p => ({
            value: p.element,
            display: `<span class="badge badge-${p.element.toLowerCase()}">${this.getElementIcon(p.element)} ${p.element}</span>`,
            sortValue: p.element
          })))}
          
          ${this.generateComparisonRow('Role', this.comparedPalmon.map(p => ({
            value: p.role,
            display: `<span class="role-display">${this.getRoleIcon(p.role)} ${p.role}</span>`,
            sortValue: p.role
          })))}
        </div>

        <!-- Skills Section -->
        <div class="comparison-section">
          <div class="comparison-section-header">
            <h3 class="section-title">
              <span class="section-icon">⚡</span>
              Skills & Abilities
            </h3>
          </div>
          
          ${this.generateSkillComparisonRows()}
        </div>

        <!-- Strategic Analysis Section -->
        <div class="comparison-section">
          <div class="comparison-section-header">
            <h3 class="section-title">
              <span class="section-icon">📊</span>
              Strategic Analysis
            </h3>
          </div>
          
          ${this.generateAnalysisComparisonRows()}
        </div>

        <!-- Synergy Section -->
        <div class="comparison-section">
          <div class="comparison-section-header">
            <h3 class="section-title">
              <span class="section-icon">🤝</span>
              Synergies & Matchups
            </h3>
          </div>
          
          ${this.generateSynergyComparisonRows()}
        </div>
      </div>
    `;
  }

  generatePalmonHeaderCell(palmon) {
    const tierClass = palmon.tier.toLowerCase();
    const elementClass = palmon.element.toLowerCase();
    
    return `
      <div class="comparison-cell palmon-header-cell">
        <div class="palmon-comparison-card">
          <button class="palmon-remove-btn" data-palmon-id="${palmon.id}" title="Remove from comparison">
            <span class="remove-icon">✕</span>
          </button>
          
          <div class="palmon-portrait-comparison">
            <div class="palmon-portrait-placeholder-comparison">
              <span class="palmon-element-icon-comparison" data-element="${elementClass}">
                ${this.getElementIcon(palmon.element)}
              </span>
            </div>
            <div class="palmon-tier-indicator-comparison">
              <span class="badge badge-tier-${tierClass === 'economy' ? 'economy' : tierClass}">
                ${palmon.tier}
              </span>
            </div>
          </div>
          
          <div class="palmon-comparison-info">
            <h3 class="palmon-comparison-name">${palmon.name}</h3>
            <div class="palmon-comparison-meta">
              <span class="palmon-comparison-id">ID: ${palmon.id}</span>
            </div>
          </div>
          
          <button class="btn btn-ghost btn-sm palmon-detail-btn" data-palmon-id="${palmon.id}">
            <span class="btn-icon">👁️</span>
            Details
          </button>
        </div>
      </div>
    `;
  }

  generateComparisonRow(label, values) {
    // Determine best/worst values for highlighting
    const bestIndices = this.getBestValueIndices(values);
    const worstIndices = this.getWorstValueIndices(values);
    
    return `
      <div class="comparison-row">
        <div class="comparison-cell comparison-label-cell">
          <span class="comparison-label">${label}</span>
        </div>
        ${values.map((valueData, index) => {
          const isBest = bestIndices.includes(index);
          const isWorst = worstIndices.includes(index);
          const cellClass = isBest ? 'best-value' : isWorst ? 'worst-value' : '';
          
          return `
            <div class="comparison-cell comparison-value-cell ${cellClass}">
              <div class="comparison-value">${valueData.display}</div>
              ${isBest ? '<span class="value-indicator best-indicator">👑</span>' : ''}
              ${isWorst ? '<span class="value-indicator worst-indicator">⚠️</span>' : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  generateSkillComparisonRows() {
    const skillTypes = [
      { key: 'skill1', label: 'Active Skill 1', icon: '🎯' },
      { key: 'skill2', label: 'Active Skill 2', icon: '💥' },
      { key: 'passive', label: 'Passive Skill', icon: '🔄' },
      { key: 'evolve', label: 'Evolution Skill', icon: '⭐' }
    ];

    return skillTypes.map(skillType => {
      const skillData = this.comparedPalmon.map(palmon => {
        const skill = palmon.skills[skillType.key];
        if (!skill || !skill.name) {
          return {
            value: null,
            display: '<span class="skill-unavailable">Not Available</span>',
            sortValue: 0
          };
        }
        
        return {
          value: skill,
          display: `
            <div class="skill-comparison-item">
              <div class="skill-comparison-header">
                <span class="skill-icon">${skillType.icon}</span>
                <span class="skill-name">${skill.name}</span>
              </div>
              <div class="skill-description-short">
                ${this.truncateText(skill.description, 100)}
              </div>
            </div>
          `,
          sortValue: skill.name ? 1 : 0
        };
      });

      return this.generateComparisonRow(skillType.label, skillData);
    }).join('');
  }

  generateAnalysisComparisonRows() {
    const analysisMetrics = [
      { key: 'damage', label: 'Damage Output', icon: '⚔️' },
      { key: 'survivability', label: 'Survivability', icon: '🛡️' },
      { key: 'utility', label: 'Utility', icon: '🔧' },
      { key: 'synergy', label: 'Synergy Potential', icon: '🤝' },
      { key: 'economy', label: 'Economy Value', icon: '💰' }
    ];

    return analysisMetrics.map(metric => {
      const metricData = this.comparedPalmon.map(palmon => {
        const analysis = this.generateStrategicAnalysisForPalmon(palmon);
        const rating = analysis.ratings[metric.key];
        
        return {
          value: rating,
          display: `
            <div class="rating-comparison-item">
              <div class="rating-bar-small">
                <div class="rating-fill-small ${this.getRatingClass(rating)}" style="width: ${rating * 20}%"></div>
              </div>
              <span class="rating-value-small">${rating}/5</span>
            </div>
          `,
          sortValue: rating
        };
      });

      return this.generateComparisonRow(metric.label, metricData);
    }).join('');
  }

  generateSynergyComparisonRows() {
    const synergyData = this.comparedPalmon.map(palmon => {
      const elementPartners = this.comparedPalmon.filter(p => 
        p.id !== palmon.id && p.element === palmon.element
      ).length;
      
      const rolePartners = this.comparedPalmon.filter(p => 
        p.id !== palmon.id && this.getRoleCompatibility(palmon.role, p.role)
      ).length;

      return {
        value: elementPartners + rolePartners,
        display: `
          <div class="synergy-comparison-item">
            <div class="synergy-stat">
              <span class="synergy-icon">🌟</span>
              <span class="synergy-count">${elementPartners}</span>
              <span class="synergy-label">Element</span>
            </div>
            <div class="synergy-stat">
              <span class="synergy-icon">🎯</span>
              <span class="synergy-count">${rolePartners}</span>
              <span class="synergy-label">Role</span>
            </div>
          </div>
        `,
        sortValue: elementPartners + rolePartners
      };
    });

    return this.generateComparisonRow('Team Synergy', synergyData);
  }

  // Helper methods
  generateComparisonData() {
    return this.comparedPalmon.map(palmon => ({
      ...palmon,
      analysis: this.generateStrategicAnalysisForPalmon(palmon)
    }));
  }

  generateStrategicAnalysisForPalmon(palmon) {
    // Reuse the analysis generation logic from PalmonDetailModal
    const tierRatings = {
      'S': { damage: 5, survivability: 5, utility: 5, synergy: 5, economy: 3 },
      'A': { damage: 4, survivability: 4, utility: 4, synergy: 4, economy: 4 },
      'B': { damage: 3, survivability: 3, utility: 3, synergy: 3, economy: 4 },
      'C': { damage: 2, survivability: 2, utility: 2, synergy: 2, economy: 4 },
      'Economy': { damage: 2, survivability: 2, utility: 2, synergy: 2, economy: 5 }
    };

    const baseRatings = tierRatings[palmon.tier] || tierRatings['C'];
    
    const roleAdjustments = {
      'Tank': { survivability: 1, damage: -1 },
      'DPS': { damage: 1, survivability: -1 },
      'Support': { utility: 1, synergy: 1, damage: -1 },
      'Control': { utility: 1, synergy: 1, survivability: -1 }
    };

    const adjustments = roleAdjustments[palmon.role] || {};
    const ratings = { ...baseRatings };
    
    Object.keys(adjustments).forEach(key => {
      ratings[key] = Math.min(5, Math.max(1, ratings[key] + adjustments[key]));
    });

    return { ratings };
  }

  getBestValueIndices(values) {
    if (values.length === 0) return [];
    
    const maxValue = Math.max(...values.map(v => v.sortValue || 0));
    return values.map((v, i) => (v.sortValue || 0) === maxValue ? i : -1).filter(i => i !== -1);
  }

  getWorstValueIndices(values) {
    if (values.length === 0) return [];
    
    const minValue = Math.min(...values.map(v => v.sortValue || 0));
    return values.map((v, i) => (v.sortValue || 0) === minValue ? i : -1).filter(i => i !== -1);
  }

  getTierSortValue(tier) {
    const tierValues = { 'S': 5, 'A': 4, 'B': 3, 'C': 2, 'Economy': 1 };
    return tierValues[tier] || 0;
  }

  getRatingClass(rating) {
    if (rating >= 4) return 'excellent';
    if (rating >= 3) return 'good';
    if (rating >= 2) return 'average';
    return 'poor';
  }

  getRoleCompatibility(role1, role2) {
    const compatibilities = {
      'Tank': ['DPS', 'Support'],
      'DPS': ['Tank', 'Support'],
      'Support': ['Tank', 'DPS'],
      'Control': ['Tank', 'DPS']
    };
    
    return compatibilities[role1]?.includes(role2) || false;
  }

  truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
  }

  getElementIcon(element) {
    const icons = {
      'Fire': '🔥',
      'Water': '💧',
      'Earth': '🌱',
      'Electric': '⚡'
    };
    return icons[element] || '❓';
  }

  getRoleIcon(role) {
    const icons = {
      'Tank': '🛡️',
      'DPS': '⚔️',
      'Support': '💚',
      'Control': '🎯'
    };
    return icons[role] || '❓';
  }

  attachEventListeners() {
    // Close button
    const closeBtn = this.modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }

    // Backdrop click
    const backdrop = this.modal.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.hide());
    }

    // Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.hide();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    this.attachModalEventListeners();
  }

  attachModalEventListeners() {
    // Remove Palmon buttons
    const removeButtons = this.modal.querySelectorAll('.palmon-remove-btn');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const palmonId = btn.dataset.palmonId;
        this.removePalmon(palmonId);
      });
    });

    // Detail buttons
    const detailButtons = this.modal.querySelectorAll('.palmon-detail-btn');
    detailButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const palmonId = btn.dataset.palmonId;
        const palmon = this.comparedPalmon.find(p => p.id === palmonId);
        if (palmon) {
          const detailModal = new PalmonDetailModal(palmon);
          detailModal.show();
        }
      });
    });

    // Clear all button
    const clearBtn = this.modal.querySelector('#clear-comparison-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearAll();
      });
    }

    // Add Palmon button
    const addBtn = this.modal.querySelector('#add-palmon-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.showPalmonSelector();
      });
    }

    // Export button
    const exportBtn = this.modal.querySelector('#export-comparison-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportComparison();
      });
    }

    // Share button
    const shareBtn = this.modal.querySelector('#share-comparison-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.shareComparison();
      });
    }
  }

  showPalmonSelector() {
    // For now, show a notification. This could be enhanced with a proper selector modal
    const app = window.palmonApp;
    if (app) {
      app.showNotification('Navigate to tier list or team builder to add more Palmon to comparison', 'info');
    }
  }

  exportComparison() {
    // Create a simple text export of the comparison
    let exportText = `Palmon Comparison - ${new Date().toLocaleDateString()}\n`;
    exportText += '='.repeat(50) + '\n\n';
    
    this.comparedPalmon.forEach((palmon, index) => {
      exportText += `${index + 1}. ${palmon.name}\n`;
      exportText += `   Tier: ${palmon.tier} | Element: ${palmon.element} | Role: ${palmon.role}\n`;
      exportText += `   Skills: ${palmon.skills.skill1?.name || 'N/A'}, ${palmon.skills.skill2?.name || 'N/A'}\n\n`;
    });

    // Create and download file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palmon-comparison-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const app = window.palmonApp;
    if (app) {
      app.showNotification('Comparison exported successfully!', 'success');
    }
  }

  shareComparison() {
    // Create shareable URL with comparison data
    const palmonIds = this.comparedPalmon.map(p => p.id).join(',');
    const shareUrl = `${window.location.origin}${window.location.pathname}#compare-${palmonIds}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Palmon Comparison - Palmon Masters',
        text: `Compare ${this.comparedPalmon.map(p => p.name).join(', ')} in Palmon: Survival Min|Max!`,
        url: shareUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        const app = window.palmonApp;
        if (app) {
          app.showNotification('Comparison link copied to clipboard!', 'success');
        }
      });
    }
  }
}

// Palmon Card Component Class
class PalmonCard {
  constructor(palmonData, options = {}) {
    this.palmon = palmonData;
    this.options = {
      compact: options.compact || false,
      showDetails: options.showDetails !== false,
      clickable: options.clickable !== false,
      draggable: options.draggable !== false,
      ...options
    };
  }

  createElement() {
    const card = document.createElement('div');
    card.className = `palmon-card ${this.options.compact ? 'palmon-card-compact' : ''}`;
    card.dataset.palmonId = this.palmon.id;
    card.dataset.tier = this.palmon.tier.toLowerCase();
    card.dataset.element = this.palmon.element.toLowerCase();
    card.dataset.role = this.palmon.role.toLowerCase();

    if (this.options.draggable) {
      card.draggable = true;
      card.classList.add('palmon-card-draggable');
    }

    card.innerHTML = this.generateCardHTML();
    
    if (this.options.clickable) {
      this.attachEventListeners(card);
    }

    return card;
  }

  generateCardHTML() {
    const tierClass = this.palmon.tier.toLowerCase();
    const elementClass = this.palmon.element.toLowerCase();
    
    return `
      <div class="palmon-card-header">
        <div class="palmon-portrait">
          <div class="palmon-portrait-placeholder">
            <span class="palmon-element-icon" data-element="${elementClass}">
              ${this.getElementIcon(this.palmon.element)}
            </span>
          </div>
          <div class="palmon-tier-indicator">
            <span class="badge badge-tier-${tierClass === 'economy' ? 'economy' : tierClass}">
              ${this.palmon.tier}
            </span>
          </div>
        </div>
        <div class="palmon-basic-info">
          <h3 class="palmon-name">${this.palmon.name}</h3>
          <div class="palmon-meta">
            <span class="badge badge-${elementClass}">${this.palmon.element}</span>
            <span class="palmon-role">${this.palmon.role}</span>
          </div>
        </div>
      </div>
      ${this.options.showDetails ? this.generateDetailsHTML() : ''}
      <div class="palmon-card-overlay">
        <div class="palmon-card-actions">
          <button class="btn btn-sm btn-primary palmon-details-btn">
            <span class="btn-icon">👁️</span>
            Details
          </button>
          <div class="palmon-card-secondary-actions">
            <button class="btn btn-sm btn-secondary palmon-add-btn">
              <span class="btn-icon">➕</span>
              Add
            </button>
            <button class="btn btn-sm btn-ghost palmon-compare-btn">
              <span class="btn-icon">⚖️</span>
              Compare
            </button>
          </div>
        </div>
      </div>
    `;
  }

  generateDetailsHTML() {
    if (this.options.compact) return '';
    
    return `
      <div class="palmon-skills-preview">
        <div class="skill-preview">
          <span class="skill-name">${this.palmon.skills.skill1.name}</span>
        </div>
        <div class="skill-preview">
          <span class="skill-name">${this.palmon.skills.skill2.name}</span>
        </div>
        ${this.palmon.skills.passive ? `
          <div class="skill-preview passive">
            <span class="skill-name">${this.palmon.skills.passive.name}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  getElementIcon(element) {
    const icons = {
      'Fire': '🔥',
      'Water': '💧',
      'Earth': '🌱',
      'Electric': '⚡'
    };
    return icons[element] || '❓';
  }

  attachEventListeners(card) {
    // Hover effects
    card.addEventListener('mouseenter', () => {
      card.classList.add('palmon-card-hover');
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('palmon-card-hover');
    });

    // Click to expand details
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.palmon-card-actions')) {
        this.showDetailModal();
      }
    });

    // Details button
    const detailsBtn = card.querySelector('.palmon-details-btn');
    if (detailsBtn) {
      detailsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showDetailModal();
      });
    }

    // Add button
    const addBtn = card.querySelector('.palmon-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addToTeam();
      });
    }

    // Compare button
    const compareBtn = card.querySelector('.palmon-compare-btn');
    if (compareBtn) {
      compareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addToComparison();
      });
    }
  }

  showDetailModal() {
    // Create and show detailed modal
    const modal = new PalmonDetailModal(this.palmon);
    modal.show();
  }

  addToTeam() {
    // Dispatch custom event for team builder
    const event = new CustomEvent('palmon-add-to-team', {
      detail: { palmon: this.palmon }
    });
    document.dispatchEvent(event);
    
    // Show notification
    const app = window.palmonApp;
    if (app) {
      app.showNotification(`${this.palmon.name} added to team!`, 'success');
    }
  }

  addToComparison() {
    // Add to comparison manager
    const comparisonManager = PalmonComparisonManager.getInstance();
    comparisonManager.addPalmon(this.palmon);
    
    // Show notification
    const app = window.palmonApp;
    if (app) {
      app.showNotification(`${this.palmon.name} added to comparison!`, 'success');
    }
  }
}

// Tier Grid System Class
class TierGridSystem {
  constructor(palmonData, container) {
    this.palmonData = palmonData;
    this.container = container;
    this.tiers = ['S', 'A', 'B', 'C', 'Economy'];
    this.draggedElement = null;
    this.draggedPalmon = null;
    this.currentFilters = {
      element: 'all',
      role: 'all',
      tier: 'all',
      search: ''
    };
    this.currentSort = 'name';
    this.filteredData = [...palmonData];
  }

  render() {
    this.container.innerHTML = this.generateTierGridHTML();
    this.initializeFilterControls();
    this.applyFiltersAndSort();
    this.populateTierGrids();
    this.initializeDragAndDrop();
  }

  generateTierGridHTML() {
    let html = '<div class="tier-grid-system">';
    
    // Add tier grid controls
    html += `
      <div class="tier-grid-controls">
        <div class="tier-grid-header">
          <h2 class="tier-grid-title">Interactive Tier List</h2>
          <p class="tier-grid-subtitle">Drag and drop Palmon to reorganize tiers</p>
        </div>
        <div class="tier-grid-actions">
          <button class="btn btn-secondary" id="reset-tiers">
            <span class="btn-icon">🔄</span>
            Reset Tiers
          </button>
          <button class="btn btn-primary" id="save-tiers">
            <span class="btn-icon">💾</span>
            Save Changes
          </button>
        </div>
      </div>
    `;

    // Add filter and sort controls
    html += this.generateFilterControlsHTML();

    // Generate tier sections
    this.tiers.forEach(tier => {
      const tierClass = tier.toLowerCase() === 'economy' ? 'economy' : tier.toLowerCase();
      html += `
        <div class="tier-row" data-tier="${tier}">
          <div class="tier-label">
            <div class="tier-label-content">
              <span class="badge badge-tier-${tierClass} tier-badge-large">
                ${tier}
              </span>
              <div class="tier-info">
                <span class="tier-name">${this.getTierName(tier)}</span>
                <span class="tier-description">${this.getTierDescription(tier)}</span>
              </div>
            </div>
          </div>
          <div class="tier-drop-zone" data-tier="${tier}">
            <div class="tier-palmon-container" id="tier-container-${tier.toLowerCase()}">
              <div class="tier-empty-message">
                <span class="empty-icon">📦</span>
                <span class="empty-text">Drop Palmon here</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  generateFilterControlsHTML() {
    return `
      <div class="tier-filter-panel">
        <div class="filter-section">
          <h3 class="filter-title">
            <span class="filter-icon">🔍</span>
            Filters & Search
          </h3>
          
          <div class="filter-controls">
            <!-- Search Input -->
            <div class="filter-group">
              <label class="filter-label">Search Palmon</label>
              <div class="search-input-container">
                <input type="text" 
                       class="filter-search-input" 
                       id="tier-search" 
                       placeholder="Search by name..."
                       value="${this.currentFilters.search}">
                <button class="search-clear-btn" id="clear-search" title="Clear search">
                  <span class="btn-icon">✕</span>
                </button>
              </div>
            </div>

            <!-- Element Filter -->
            <div class="filter-group">
              <label class="filter-label">Element</label>
              <select class="filter-select" id="element-filter">
                <option value="all" ${this.currentFilters.element === 'all' ? 'selected' : ''}>All Elements</option>
                <option value="fire" ${this.currentFilters.element === 'fire' ? 'selected' : ''}>🔥 Fire</option>
                <option value="water" ${this.currentFilters.element === 'water' ? 'selected' : ''}>💧 Water</option>
                <option value="earth" ${this.currentFilters.element === 'earth' ? 'selected' : ''}>🌱 Earth</option>
                <option value="electric" ${this.currentFilters.element === 'electric' ? 'selected' : ''}>⚡ Electric</option>
              </select>
            </div>

            <!-- Role Filter -->
            <div class="filter-group">
              <label class="filter-label">Role</label>
              <select class="filter-select" id="role-filter">
                <option value="all" ${this.currentFilters.role === 'all' ? 'selected' : ''}>All Roles</option>
                <option value="tank" ${this.currentFilters.role === 'tank' ? 'selected' : ''}>🛡️ Tank</option>
                <option value="dps" ${this.currentFilters.role === 'dps' ? 'selected' : ''}>⚔️ DPS</option>
                <option value="support" ${this.currentFilters.role === 'support' ? 'selected' : ''}>💚 Support</option>
                <option value="control" ${this.currentFilters.role === 'control' ? 'selected' : ''}>🎯 Control</option>
              </select>
            </div>

            <!-- Tier Filter -->
            <div class="filter-group">
              <label class="filter-label">Show Tiers</label>
              <select class="filter-select" id="tier-filter">
                <option value="all" ${this.currentFilters.tier === 'all' ? 'selected' : ''}>All Tiers</option>
                <option value="s" ${this.currentFilters.tier === 's' ? 'selected' : ''}>S-Tier Only</option>
                <option value="a" ${this.currentFilters.tier === 'a' ? 'selected' : ''}>A-Tier Only</option>
                <option value="b" ${this.currentFilters.tier === 'b' ? 'selected' : ''}>B-Tier Only</option>
                <option value="c" ${this.currentFilters.tier === 'c' ? 'selected' : ''}>C-Tier Only</option>
                <option value="economy" ${this.currentFilters.tier === 'economy' ? 'selected' : ''}>Economy Only</option>
              </select>
            </div>

            <!-- Sort Options -->
            <div class="filter-group">
              <label class="filter-label">Sort By</label>
              <select class="filter-select" id="sort-select">
                <option value="name" ${this.currentSort === 'name' ? 'selected' : ''}>Name (A-Z)</option>
                <option value="name-desc" ${this.currentSort === 'name-desc' ? 'selected' : ''}>Name (Z-A)</option>
                <option value="tier" ${this.currentSort === 'tier' ? 'selected' : ''}>Tier (S-Economy)</option>
                <option value="tier-desc" ${this.currentSort === 'tier-desc' ? 'selected' : ''}>Tier (Economy-S)</option>
                <option value="element" ${this.currentSort === 'element' ? 'selected' : ''}>Element</option>
                <option value="role" ${this.currentSort === 'role' ? 'selected' : ''}>Role</option>
              </select>
            </div>

            <!-- Filter Actions -->
            <div class="filter-actions">
              <button class="btn btn-ghost btn-sm" id="clear-filters">
                <span class="btn-icon">🗑️</span>
                Clear All
              </button>
              <button class="btn btn-secondary btn-sm" id="toggle-filters">
                <span class="btn-icon">📊</span>
                <span class="toggle-text">Hide Filters</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Filter Results Summary -->
        <div class="filter-results">
          <div class="results-summary" id="filter-results-summary">
            Showing <span class="results-count" id="results-count">${this.filteredData.length}</span> 
            of <span class="total-count">${this.palmonData.length}</span> Palmon
          </div>
          <div class="active-filters" id="active-filters"></div>
        </div>
      </div>
    `;
  }

  getTierName(tier) {
    const names = {
      'S': 'Supreme',
      'A': 'Excellent',
      'B': 'Good',
      'C': 'Average',
      'Economy': 'Budget'
    };
    return names[tier] || tier;
  }

  getTierDescription(tier) {
    const descriptions = {
      'S': 'Meta-defining powerhouses',
      'A': 'Strong competitive choices',
      'B': 'Solid and reliable',
      'C': 'Situational picks',
      'Economy': 'Early game focused'
    };
    return descriptions[tier] || '';
  }

  populateTierGrids() {
    this.tiers.forEach(tier => {
      const tierPalmon = this.filteredData.filter(p => p.tier === tier);
      const container = document.getElementById(`tier-container-${tier.toLowerCase()}`);
      const tierRow = document.querySelector(`.tier-row[data-tier="${tier}"]`);
      
      if (container) {
        // Clear existing content
        container.innerHTML = '';
        
        if (tierPalmon.length > 0) {
          // Show tier row
          if (tierRow) tierRow.style.display = 'flex';
          
          // Add Palmon cards
          tierPalmon.forEach(palmon => {
            const card = new PalmonCard(palmon, { 
              compact: true, 
              showDetails: false,
              clickable: true,
              draggable: true
            });
            const cardElement = card.createElement();
            cardElement.draggable = true;
            container.appendChild(cardElement);
          });
        } else {
          // Hide tier row if no Palmon match filters
          if (tierRow) {
            if (this.hasActiveFilters()) {
              tierRow.style.display = 'none';
            } else {
              tierRow.style.display = 'flex';
              // Show empty message
              container.innerHTML = `
                <div class="tier-empty-message">
                  <span class="empty-icon">📦</span>
                  <span class="empty-text">Drop Palmon here</span>
                </div>
              `;
            }
          }
        }
      }
    });

    // Initialize control buttons
    this.initializeControls();
  }

  initializeControls() {
    const resetBtn = document.getElementById('reset-tiers');
    const saveBtn = document.getElementById('save-tiers');

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetTiers();
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveTiers();
      });
    }
  }

  initializeDragAndDrop() {
    // Add drag event listeners to all Palmon cards
    const palmonCards = this.container.querySelectorAll('.palmon-card');
    palmonCards.forEach(card => {
      this.addDragListeners(card);
    });

    // Add drop event listeners to tier zones
    const dropZones = this.container.querySelectorAll('.tier-drop-zone');
    dropZones.forEach(zone => {
      this.addDropListeners(zone);
    });
  }

  addDragListeners(card) {
    card.addEventListener('dragstart', (e) => {
      this.draggedElement = card;
      this.draggedPalmon = this.getPalmonFromCard(card);
      card.classList.add('dragging');
      
      // Set drag data
      e.dataTransfer.setData('text/plain', card.dataset.palmonId);
      e.dataTransfer.effectAllowed = 'move';
      
      // Add visual feedback
      setTimeout(() => {
        card.style.opacity = '0.5';
      }, 0);
    });

    card.addEventListener('dragend', (e) => {
      card.classList.remove('dragging');
      card.style.opacity = '1';
      this.draggedElement = null;
      this.draggedPalmon = null;
      
      // Remove all drop zone highlights
      this.container.querySelectorAll('.tier-drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
      });
    });
  }

  addDropListeners(zone) {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', (e) => {
      if (!zone.contains(e.relatedTarget)) {
        zone.classList.remove('drag-over');
      }
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      
      if (this.draggedElement && this.draggedPalmon) {
        const newTier = zone.dataset.tier;
        const oldTier = this.draggedPalmon.tier;
        
        if (newTier !== oldTier) {
          this.movePalmonToTier(this.draggedElement, this.draggedPalmon, newTier, oldTier);
        }
      }
    });
  }

  movePalmonToTier(cardElement, palmon, newTier, oldTier) {
    // Update palmon data
    palmon.tier = newTier;
    
    // Update card attributes
    cardElement.dataset.tier = newTier.toLowerCase();
    
    // Move card to new tier container
    const newContainer = document.getElementById(`tier-container-${newTier.toLowerCase()}`);
    const oldContainer = cardElement.parentElement;
    
    if (newContainer) {
      // Hide empty message in new container
      const emptyMessage = newContainer.querySelector('.tier-empty-message');
      if (emptyMessage) {
        emptyMessage.style.display = 'none';
      }
      
      newContainer.appendChild(cardElement);
      
      // Show empty message in old container if it's now empty
      if (oldContainer && oldContainer.children.length === 1) { // Only empty message left
        const oldEmptyMessage = oldContainer.querySelector('.tier-empty-message');
        if (oldEmptyMessage) {
          oldEmptyMessage.style.display = 'flex';
        }
      }
      
      // Dispatch tier change event
      const event = new CustomEvent('palmon-tier-changed', {
        detail: { palmon, oldTier, newTier }
      });
      document.dispatchEvent(event);
      
      // Add visual feedback
      cardElement.classList.add('tier-changed');
      setTimeout(() => {
        cardElement.classList.remove('tier-changed');
      }, 1000);
    }
  }

  getPalmonFromCard(card) {
    const palmonId = card.dataset.palmonId;
    return this.palmonData.find(p => p.id === palmonId);
  }

  resetTiers() {
    // Reset all Palmon to their original tiers
    // This would require storing original tier data
    const app = window.palmonApp;
    if (app && app.showNotification) {
      app.showNotification('Tier reset functionality will be implemented with data persistence', 'info');
    }
  }

  saveTiers() {
    // Save current tier configuration
    const tierData = {};
    this.tiers.forEach(tier => {
      const container = document.getElementById(`tier-container-${tier.toLowerCase()}`);
      const cards = container.querySelectorAll('.palmon-card');
      tierData[tier] = Array.from(cards).map(card => card.dataset.palmonId);
    });
    
    // Store in localStorage for now
    localStorage.setItem('palmon-tier-data', JSON.stringify(tierData));
    
    const app = window.palmonApp;
    if (app && app.showNotification) {
      app.showNotification('Tier configuration saved successfully!', 'success');
    }
  }

  initializeFilterControls() {
    // Search input
    const searchInput = document.getElementById('tier-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentFilters.search = e.target.value.toLowerCase();
        this.applyFiltersAndSort();
        this.populateTierGrids();
        this.initializeDragAndDrop();
      });
    }

    // Clear search button
    const clearSearchBtn = document.getElementById('clear-search');
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.currentFilters.search = '';
        this.applyFiltersAndSort();
        this.populateTierGrids();
        this.initializeDragAndDrop();
      });
    }

    // Filter selects
    const elementFilter = document.getElementById('element-filter');
    const roleFilter = document.getElementById('role-filter');
    const tierFilter = document.getElementById('tier-filter');
    const sortSelect = document.getElementById('sort-select');

    if (elementFilter) {
      elementFilter.addEventListener('change', (e) => {
        this.currentFilters.element = e.target.value;
        this.applyFiltersAndSort();
        this.populateTierGrids();
        this.initializeDragAndDrop();
      });
    }

    if (roleFilter) {
      roleFilter.addEventListener('change', (e) => {
        this.currentFilters.role = e.target.value;
        this.applyFiltersAndSort();
        this.populateTierGrids();
        this.initializeDragAndDrop();
      });
    }

    if (tierFilter) {
      tierFilter.addEventListener('change', (e) => {
        this.currentFilters.tier = e.target.value;
        this.applyFiltersAndSort();
        this.populateTierGrids();
        this.initializeDragAndDrop();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.applyFiltersAndSort();
        this.populateTierGrids();
        this.initializeDragAndDrop();
      });
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.clearAllFilters();
      });
    }

    // Toggle filters button
    const toggleFiltersBtn = document.getElementById('toggle-filters');
    if (toggleFiltersBtn) {
      toggleFiltersBtn.addEventListener('click', () => {
        this.toggleFilterPanel();
      });
    }
  }

  applyFiltersAndSort() {
    let filtered = [...this.palmonData];

    // Apply search filter
    if (this.currentFilters.search) {
      filtered = filtered.filter(palmon => 
        palmon.name.toLowerCase().includes(this.currentFilters.search)
      );
    }

    // Apply element filter
    if (this.currentFilters.element !== 'all') {
      filtered = filtered.filter(palmon => 
        palmon.element.toLowerCase() === this.currentFilters.element
      );
    }

    // Apply role filter
    if (this.currentFilters.role !== 'all') {
      filtered = filtered.filter(palmon => 
        palmon.role.toLowerCase() === this.currentFilters.role
      );
    }

    // Apply tier filter
    if (this.currentFilters.tier !== 'all') {
      filtered = filtered.filter(palmon => 
        palmon.tier.toLowerCase() === this.currentFilters.tier
      );
    }

    // Apply sorting
    filtered = this.sortPalmonData(filtered);

    this.filteredData = filtered;
    this.updateFilterResults();
    this.updateActiveFilters();
  }

  sortPalmonData(data) {
    const tierOrder = { 'S': 0, 'A': 1, 'B': 2, 'C': 3, 'Economy': 4 };
    
    return data.sort((a, b) => {
      switch (this.currentSort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'tier':
          return tierOrder[a.tier] - tierOrder[b.tier];
        case 'tier-desc':
          return tierOrder[b.tier] - tierOrder[a.tier];
        case 'element':
          return a.element.localeCompare(b.element);
        case 'role':
          return a.role.localeCompare(b.role);
        default:
          return 0;
      }
    });
  }

  updateFilterResults() {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
      resultsCount.textContent = this.filteredData.length;
    }
  }

  updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('active-filters');
    if (!activeFiltersContainer) return;

    const activeFilters = [];

    if (this.currentFilters.search) {
      activeFilters.push({
        type: 'search',
        label: `Search: "${this.currentFilters.search}"`,
        value: this.currentFilters.search
      });
    }

    if (this.currentFilters.element !== 'all') {
      const elementIcons = { fire: '🔥', water: '💧', earth: '🌱', electric: '⚡' };
      activeFilters.push({
        type: 'element',
        label: `${elementIcons[this.currentFilters.element]} ${this.currentFilters.element.charAt(0).toUpperCase() + this.currentFilters.element.slice(1)}`,
        value: this.currentFilters.element
      });
    }

    if (this.currentFilters.role !== 'all') {
      const roleIcons = { tank: '🛡️', dps: '⚔️', support: '💚', control: '🎯' };
      activeFilters.push({
        type: 'role',
        label: `${roleIcons[this.currentFilters.role]} ${this.currentFilters.role.toUpperCase()}`,
        value: this.currentFilters.role
      });
    }

    if (this.currentFilters.tier !== 'all') {
      activeFilters.push({
        type: 'tier',
        label: `${this.currentFilters.tier.toUpperCase()}-Tier`,
        value: this.currentFilters.tier
      });
    }

    if (activeFilters.length === 0) {
      activeFiltersContainer.innerHTML = '';
      return;
    }

    const filtersHTML = activeFilters.map(filter => `
      <div class="active-filter-tag" data-type="${filter.type}" data-value="${filter.value}">
        <span class="filter-tag-label">${filter.label}</span>
        <button class="filter-tag-remove" title="Remove filter">✕</button>
      </div>
    `).join('');

    activeFiltersContainer.innerHTML = `
      <div class="active-filters-header">Active Filters:</div>
      <div class="active-filters-list">${filtersHTML}</div>
    `;

    // Add remove filter functionality
    activeFiltersContainer.querySelectorAll('.filter-tag-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tag = e.target.closest('.active-filter-tag');
        const type = tag.dataset.type;
        this.removeFilter(type);
      });
    });
  }

  removeFilter(type) {
    switch (type) {
      case 'search':
        this.currentFilters.search = '';
        const searchInput = document.getElementById('tier-search');
        if (searchInput) searchInput.value = '';
        break;
      case 'element':
        this.currentFilters.element = 'all';
        const elementFilter = document.getElementById('element-filter');
        if (elementFilter) elementFilter.value = 'all';
        break;
      case 'role':
        this.currentFilters.role = 'all';
        const roleFilter = document.getElementById('role-filter');
        if (roleFilter) roleFilter.value = 'all';
        break;
      case 'tier':
        this.currentFilters.tier = 'all';
        const tierFilter = document.getElementById('tier-filter');
        if (tierFilter) tierFilter.value = 'all';
        break;
    }

    this.applyFiltersAndSort();
    this.populateTierGrids();
    this.initializeDragAndDrop();
  }

  clearAllFilters() {
    this.currentFilters = {
      element: 'all',
      role: 'all',
      tier: 'all',
      search: ''
    };

    // Reset form controls
    const searchInput = document.getElementById('tier-search');
    const elementFilter = document.getElementById('element-filter');
    const roleFilter = document.getElementById('role-filter');
    const tierFilter = document.getElementById('tier-filter');

    if (searchInput) searchInput.value = '';
    if (elementFilter) elementFilter.value = 'all';
    if (roleFilter) roleFilter.value = 'all';
    if (tierFilter) tierFilter.value = 'all';

    this.applyFiltersAndSort();
    this.populateTierGrids();
    this.initializeDragAndDrop();
  }

  toggleFilterPanel() {
    const filterPanel = document.querySelector('.tier-filter-panel');
    const toggleBtn = document.getElementById('toggle-filters');
    const toggleText = toggleBtn.querySelector('.toggle-text');

    if (filterPanel.classList.contains('collapsed')) {
      filterPanel.classList.remove('collapsed');
      toggleText.textContent = 'Hide Filters';
    } else {
      filterPanel.classList.add('collapsed');
      toggleText.textContent = 'Show Filters';
    }
  }

  hasActiveFilters() {
    return this.currentFilters.search !== '' ||
           this.currentFilters.element !== 'all' ||
           this.currentFilters.role !== 'all' ||
           this.currentFilters.tier !== 'all';
  }
}

// Palmon Detail Modal Class
// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.palmonApp = new PalmonApp();
  });
} else {
  window.palmonApp = new PalmonApp();
}

// Team Builder Class
class TeamBuilder {
  constructor(palmonData) {
    this.palmonData = palmonData;
    this.currentTeam = {
      frontRow: [null, null, null],
      backRow: [null, null, null]
    };
    this.draggedPalmon = null;
    this.dragPreview = null;
    this.init();
  }

  init() {
    this.setupTeamSlots();
    this.setupTeamActions();
    this.setupDragAndDrop();
    this.populateTemporaryLibrary();
  }

  setupTeamSlots() {
    const teamSlots = document.querySelectorAll('.team-slot');
    
    teamSlots.forEach(slot => {
      // Add drag over event listeners
      slot.addEventListener('dragover', (e) => this.handleDragOver(e));
      slot.addEventListener('dragenter', (e) => this.handleDragEnter(e));
      slot.addEventListener('dragleave', (e) => this.handleDragLeave(e));
      slot.addEventListener('drop', (e) => this.handleDrop(e));
      
      // Add click event for slot clearing
      const clearBtn = slot.querySelector('.slot-clear');
      if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.clearSlot(slot);
        });
      }
    });
  }

  setupTeamActions() {
    const clearTeamBtn = document.getElementById('clear-team');
    const randomTeamBtn = document.getElementById('random-team');

    if (clearTeamBtn) {
      clearTeamBtn.addEventListener('click', () => this.clearTeam());
    }

    if (randomTeamBtn) {
      randomTeamBtn.addEventListener('click', () => this.generateRandomTeam());
    }
  }

  setupDragAndDrop() {
    // This will be enhanced when we implement the Palmon selection panel
    // For now, we'll set up the basic drag and drop infrastructure
    document.addEventListener('dragstart', (e) => this.handleDragStart(e));
    document.addEventListener('dragend', (e) => this.handleDragEnd(e));
  }

  handleDragStart(e) {
    // Check if the dragged element is a Palmon card
    const palmonCard = e.target.closest('.palmon-card');
    if (!palmonCard) return;

    const palmonId = palmonCard.dataset.palmonId;
    const palmon = this.palmonData.find(p => p.id === palmonId);
    
    if (palmon) {
      this.draggedPalmon = palmon;
      
      // Create drag preview
      this.createDragPreview(palmon, e.clientX, e.clientY);
      
      // Add dragging class to original element
      palmonCard.classList.add('dragging');
      
      // Set drag data
      e.dataTransfer.setData('text/plain', palmonId);
      e.dataTransfer.effectAllowed = 'move';
    }
  }

  handleDragEnd(e) {
    // Clean up drag state
    const palmonCard = e.target.closest('.palmon-card');
    if (palmonCard) {
      palmonCard.classList.remove('dragging');
    }
    
    // Remove drag preview
    if (this.dragPreview) {
      this.dragPreview.remove();
      this.dragPreview = null;
    }
    
    // Clear drag over states
    document.querySelectorAll('.team-slot.drag-over').forEach(slot => {
      slot.classList.remove('drag-over');
    });
    
    this.draggedPalmon = null;
  }

  handleDragOver(e) {
    if (!this.draggedPalmon) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Update drag preview position
    if (this.dragPreview) {
      this.dragPreview.style.left = e.clientX + 'px';
      this.dragPreview.style.top = e.clientY + 'px';
    }
  }

  handleDragEnter(e) {
    if (!this.draggedPalmon) return;
    
    e.preventDefault();
    const slot = e.currentTarget;
    slot.classList.add('drag-over');
  }

  handleDragLeave(e) {
    if (!this.draggedPalmon) return;
    
    const slot = e.currentTarget;
    // Only remove drag-over if we're actually leaving the slot
    if (!slot.contains(e.relatedTarget)) {
      slot.classList.remove('drag-over');
    }
  }

  handleDrop(e) {
    if (!this.draggedPalmon) return;
    
    e.preventDefault();
    const slot = e.currentTarget;
    slot.classList.remove('drag-over');
    
    // Get slot information
    const slotId = slot.dataset.slot;
    const row = slot.dataset.row;
    
    // Add Palmon to team slot
    this.addPalmonToSlot(this.draggedPalmon, slot, row, slotId);
  }

  createDragPreview(palmon, x, y) {
    this.dragPreview = document.createElement('div');
    this.dragPreview.className = 'drag-preview';
    this.dragPreview.style.left = x + 'px';
    this.dragPreview.style.top = y + 'px';
    
    // Create mini Palmon card for preview
    const miniCard = this.createMiniPalmonCard(palmon);
    this.dragPreview.appendChild(miniCard);
    
    document.body.appendChild(this.dragPreview);
  }

  addPalmonToSlot(palmon, slot, row, slotId) {
    // Check if Palmon is already in team
    if (this.isPalmonInTeam(palmon)) {
      this.showNotification('This Palmon is already in your team!', 'warning');
      return;
    }
    
    // Update team data
    const slotIndex = parseInt(slotId.split('-')[1]) - 1;
    if (row === 'front') {
      this.currentTeam.frontRow[slotIndex] = palmon;
    } else {
      this.currentTeam.backRow[slotIndex] = palmon;
    }
    
    // Update slot visual
    this.updateSlotVisual(slot, palmon);
    
    // Show success notification
    this.showNotification(`${palmon.name} added to ${row} row!`, 'success');
    
    // Update team analysis (placeholder for task 5.3)
    this.updateTeamAnalysis();
  }

  updateSlotVisual(slot, palmon) {
    const slotContent = slot.querySelector('.slot-content');
    const clearBtn = slot.querySelector('.slot-clear');
    
    // Clear existing content
    slotContent.innerHTML = '';
    
    // Add Palmon mini card
    const miniCard = this.createMiniPalmonCard(palmon);
    slotContent.appendChild(miniCard);
    
    // Show clear button
    if (clearBtn) {
      clearBtn.style.display = 'flex';
    }
    
    // Update slot state
    slot.classList.add('occupied');
  }

  createMiniPalmonCard(palmon) {
    const card = document.createElement('div');
    const elementClass = palmon.element.toLowerCase();
    const tierClass = palmon.tier.toLowerCase();
    
    card.className = `palmon-card-mini element-${elementClass} tier-${tierClass}`;
    card.innerHTML = `
      <div class="palmon-portrait-mini">
        <span class="palmon-element-icon">${this.getElementIcon(palmon.element)}</span>
      </div>
      <div class="palmon-name-mini">${palmon.name}</div>
      <div class="palmon-tier-mini">${palmon.tier}</div>
      <div class="palmon-element-mini">${this.getElementIcon(palmon.element)}</div>
    `;
    
    return card;
  }

  getElementIcon(element) {
    const icons = {
      'Fire': '🔥',
      'Water': '💧',
      'Earth': '🌱',
      'Electric': '⚡'
    };
    return icons[element] || '❓';
  }

  clearSlot(slot) {
    const slotId = slot.dataset.slot;
    const row = slot.dataset.row;
    const slotIndex = parseInt(slotId.split('-')[1]) - 1;
    
    // Update team data
    if (row === 'front') {
      this.currentTeam.frontRow[slotIndex] = null;
    } else {
      this.currentTeam.backRow[slotIndex] = null;
    }
    
    // Reset slot visual
    this.resetSlotVisual(slot);
    
    // Update team analysis
    this.updateTeamAnalysis();
  }

  resetSlotVisual(slot) {
    const slotContent = slot.querySelector('.slot-content');
    const clearBtn = slot.querySelector('.slot-clear');
    const row = slot.dataset.row;
    
    // Reset to placeholder
    slotContent.innerHTML = `
      <div class="slot-placeholder">
        <span class="slot-icon">${row === 'front' ? '⚔️' : '🛡️'}</span>
        <span class="slot-text">Drop Palmon Here</span>
      </div>
    `;
    
    // Hide clear button
    if (clearBtn) {
      clearBtn.style.display = 'none';
    }
    
    // Update slot state
    slot.classList.remove('occupied');
  }

  clearTeam() {
    // Clear team data
    this.currentTeam = {
      frontRow: [null, null, null],
      backRow: [null, null, null]
    };
    
    // Reset all slots
    document.querySelectorAll('.team-slot').forEach(slot => {
      this.resetSlotVisual(slot);
    });
    
    // Update team analysis
    this.updateTeamAnalysis();
    
    this.showNotification('Team cleared!', 'info');
  }

  generateRandomTeam() {
    if (!this.palmonData || this.palmonData.length === 0) {
      this.showNotification('No Palmon data available!', 'error');
      return;
    }
    
    // Clear current team first
    this.clearTeam();
    
    // Get random Palmon for each slot
    const availablePalmon = [...this.palmonData];
    const teamSlots = document.querySelectorAll('.team-slot');
    
    teamSlots.forEach(slot => {
      if (availablePalmon.length === 0) return;
      
      // Pick random Palmon
      const randomIndex = Math.floor(Math.random() * availablePalmon.length);
      const randomPalmon = availablePalmon.splice(randomIndex, 1)[0];
      
      // Add to slot
      const row = slot.dataset.row;
      const slotId = slot.dataset.slot;
      this.addPalmonToSlot(randomPalmon, slot, row, slotId);
    });
    
    this.showNotification('Random team generated!', 'success');
  }

  isPalmonInTeam(palmon) {
    const allTeamMembers = [...this.currentTeam.frontRow, ...this.currentTeam.backRow];
    return allTeamMembers.some(member => member && member.id === palmon.id);
  }

  updateTeamAnalysis() {
    // Placeholder for team analysis functionality (task 5.3)
    // This will calculate synergies, team score, and suggestions
    console.log('Team updated:', this.currentTeam);
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  getTeamData() {
    return this.currentTeam;
  }

  setTeamData(teamData) {
    this.currentTeam = teamData;
    this.renderTeam();
  }

  renderTeam() {
    // Render the current team state to the UI
    const teamSlots = document.querySelectorAll('.team-slot');
    
    teamSlots.forEach(slot => {
      const row = slot.dataset.row;
      const slotId = slot.dataset.slot;
      const slotIndex = parseInt(slotId.split('-')[1]) - 1;
      
      const palmon = row === 'front' 
        ? this.currentTeam.frontRow[slotIndex]
        : this.currentTeam.backRow[slotIndex];
      
      if (palmon) {
        this.updateSlotVisual(slot, palmon);
      } else {
        this.resetSlotVisual(slot);
      }
    });
    
    this.updateTeamAnalysis();
  }

  populateTemporaryLibrary() {
    const libraryContainer = document.getElementById('temp-palmon-library');
    if (!libraryContainer || !this.palmonData) return;

    // Get a sample of Palmon for testing (first 12)
    const samplePalmon = this.palmonData.slice(0, 12);
    
    libraryContainer.innerHTML = '';
    
    samplePalmon.forEach(palmon => {
      const card = new PalmonCard(palmon, { 
        compact: true, 
        showDetails: false,
        draggable: true 
      });
      
      const cardElement = card.createElement();
      libraryContainer.appendChild(cardElement);
    });
  }
}

// Add team builder initialization to the main app
PalmonApp.prototype.initializeTeamBuilder = function() {
  if (this.processedPalmonData) {
    this.teamBuilder = new TeamBuilder(this.processedPalmonData);
  }
};

// Update the main app initialization to include team builder
const originalInitializeComponents = PalmonApp.prototype.initializeComponents;
PalmonApp.prototype.initializeComponents = function() {
  originalInitializeComponents.call(this);
  this.initializeTeamBuilder();
};
// Meta Analysis Dashboard Component
class MetaAnalyzer {
  constructor(palmonData) {
    this.palmonData = palmonData || [];
    this.historicalData = this.generateHistoricalData();
    this.usageStats = this.calculateUsageStats();
    this.winRates = this.generateWinRates();
    this.metaTrends = this.calculateMetaTrends();
  }

  generateHistoricalData() {
    // Generate simulated historical data for meta trends
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const tiers = ['S', 'A', 'B', 'C', 'Economy'];
    const elements = ['Fire', 'Water', 'Earth', 'Electric'];
    
    return {
      tierDistribution: months.map(month => ({
        month,
        data: tiers.reduce((acc, tier) => {
          acc[tier] = Math.floor(Math.random() * 20) + 5;
          return acc;
        }, {})
      })),
      elementUsage: months.map(month => ({
        month,
        data: elements.reduce((acc, element) => {
          acc[element] = Math.floor(Math.random() * 30) + 15;
          return acc;
        }, {})
      })),
      popularityTrends: this.palmonData.slice(0, 10).map(palmon => ({
        name: palmon.name,
        data: months.map(() => Math.floor(Math.random() * 100) + 20)
      }))
    };
  }

  calculateUsageStats() {
    if (!this.palmonData.length) return {};

    const stats = {
      totalPalmon: this.palmonData.length,
      tierDistribution: {},
      elementDistribution: {},
      roleDistribution: {},
      mostUsed: [],
      leastUsed: []
    };

    // Calculate distributions
    this.palmonData.forEach(palmon => {
      // Tier distribution
      stats.tierDistribution[palmon.tier] = (stats.tierDistribution[palmon.tier] || 0) + 1;
      
      // Element distribution
      stats.elementDistribution[palmon.element] = (stats.elementDistribution[palmon.element] || 0) + 1;
      
      // Role distribution
      stats.roleDistribution[palmon.role] = (stats.roleDistribution[palmon.role] || 0) + 1;
    });

    // Generate usage rankings (simulated)
    const palmonWithUsage = this.palmonData.map(palmon => ({
      ...palmon,
      usageRate: this.calculateSimulatedUsage(palmon)
    }));

    stats.mostUsed = palmonWithUsage
      .sort((a, b) => b.usageRate - a.usageRate)
      .slice(0, 10);

    stats.leastUsed = palmonWithUsage
      .sort((a, b) => a.usageRate - b.usageRate)
      .slice(0, 10);

    return stats;
  }

  calculateSimulatedUsage(palmon) {
    // Simulate usage based on tier and other factors
    const tierMultipliers = { 'S': 0.8, 'A': 0.6, 'B': 0.4, 'C': 0.2, 'Economy': 0.1 };
    const baseUsage = (tierMultipliers[palmon.tier] || 0.3) * 100;
    const randomVariation = (Math.random() - 0.5) * 20;
    return Math.max(5, Math.min(95, baseUsage + randomVariation));
  }

  generateWinRates() {
    // Generate simulated win rate data
    return this.palmonData.map(palmon => ({
      ...palmon,
      winRate: this.calculateSimulatedWinRate(palmon),
      pickRate: this.calculateSimulatedUsage(palmon),
      banRate: Math.random() * 30,
      synergies: this.calculateSynergyScore(palmon)
    }));
  }

  calculateSimulatedWinRate(palmon) {
    const tierMultipliers = { 'S': 0.65, 'A': 0.58, 'B': 0.52, 'C': 0.48, 'Economy': 0.42 };
    const baseWinRate = (tierMultipliers[palmon.tier] || 0.5) * 100;
    const randomVariation = (Math.random() - 0.5) * 10;
    return Math.max(35, Math.min(75, baseWinRate + randomVariation));
  }

  calculateSynergyScore(palmon) {
    // Calculate synergy potential based on element and role
    const elementSynergies = this.palmonData.filter(p => p.element === palmon.element).length;
    const roleSynergies = this.palmonData.filter(p => p.role === palmon.role).length;
    return Math.min(100, (elementSynergies * 5) + (roleSynergies * 3) + Math.random() * 20);
  }

  calculateMetaTrends() {
    const currentMonth = new Date().getMonth();
    const trends = {
      rising: [],
      falling: [],
      stable: [],
      emerging: []
    };

    this.palmonData.forEach(palmon => {
      const trendValue = (Math.random() - 0.5) * 20;
      const category = trendValue > 5 ? 'rising' : 
                     trendValue < -5 ? 'falling' : 'stable';
      
      if (palmon.tier === 'C' && trendValue > 8) {
        trends.emerging.push({ ...palmon, trend: trendValue });
      } else {
        trends[category].push({ ...palmon, trend: trendValue });
      }
    });

    // Sort by trend value
    Object.keys(trends).forEach(key => {
      trends[key] = trends[key]
        .sort((a, b) => Math.abs(b.trend) - Math.abs(a.trend))
        .slice(0, 8);
    });

    return trends;
  }

  renderMetaDashboard() {
    const container = document.getElementById('meta-analysis-container');
    if (!container) return;

    container.innerHTML = `
      <div class="meta-dashboard">
        <!-- Dashboard Header -->
        <div class="dashboard-header">
          <div class="dashboard-title-section">
            <h2 class="dashboard-title">Meta Analysis Dashboard</h2>
            <p class="dashboard-subtitle">Comprehensive statistics and trends for Palmon: Survival Min|Max</p>
          </div>
          <div class="dashboard-controls">
            <select class="form-select" id="time-period-select">
              <option value="current">Current Meta</option>
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
            </select>
            <button class="btn btn-secondary" id="refresh-data">
              <span class="btn-icon">🔄</span>
              Refresh Data
            </button>
          </div>
        </div>

        <!-- Key Metrics Cards -->
        <div class="metrics-grid">
          ${this.renderMetricsCards()}
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <div class="charts-grid">
            <!-- Tier Distribution Chart -->
            <div class="chart-container">
              <div class="chart-header">
                <h3 class="chart-title">Tier Distribution</h3>
                <span class="chart-subtitle">Current meta breakdown</span>
              </div>
              <div class="chart-content">
                ${this.renderTierDistributionChart()}
              </div>
            </div>

            <!-- Element Usage Chart -->
            <div class="chart-container">
              <div class="chart-header">
                <h3 class="chart-title">Element Usage</h3>
                <span class="chart-subtitle">Popularity by element type</span>
              </div>
              <div class="chart-content">
                ${this.renderElementUsageChart()}
              </div>
            </div>

            <!-- Win Rate vs Pick Rate -->
            <div class="chart-container chart-wide">
              <div class="chart-header">
                <h3 class="chart-title">Win Rate vs Pick Rate</h3>
                <span class="chart-subtitle">Performance correlation analysis</span>
              </div>
              <div class="chart-content">
                ${this.renderWinRateChart()}
              </div>
            </div>
          </div>
        </div>

        <!-- Trends Section -->
        <div class="trends-section">
          <div class="trends-grid">
            <!-- Rising Stars -->
            <div class="trend-category">
              <div class="trend-header">
                <h3 class="trend-title">
                  <span class="trend-icon rising">📈</span>
                  Rising Stars
                </h3>
                <span class="trend-count">${this.metaTrends.rising.length} Palmon</span>
              </div>
              <div class="trend-list">
                ${this.renderTrendList(this.metaTrends.rising, 'rising')}
              </div>
            </div>

            <!-- Falling -->
            <div class="trend-category">
              <div class="trend-header">
                <h3 class="trend-title">
                  <span class="trend-icon falling">📉</span>
                  Declining
                </h3>
                <span class="trend-count">${this.metaTrends.falling.length} Palmon</span>
              </div>
              <div class="trend-list">
                ${this.renderTrendList(this.metaTrends.falling, 'falling')}
              </div>
            </div>

            <!-- Emerging -->
            <div class="trend-category">
              <div class="trend-header">
                <h3 class="trend-title">
                  <span class="trend-icon emerging">⭐</span>
                  Emerging Picks
                </h3>
                <span class="trend-count">${this.metaTrends.emerging.length} Palmon</span>
              </div>
              <div class="trend-list">
                ${this.renderTrendList(this.metaTrends.emerging, 'emerging')}
              </div>
            </div>

            <!-- Stable -->
            <div class="trend-category">
              <div class="trend-header">
                <h3 class="trend-title">
                  <span class="trend-icon stable">➡️</span>
                  Meta Stable
                </h3>
                <span class="trend-count">${this.metaTrends.stable.length} Palmon</span>
              </div>
              <div class="trend-list">
                ${this.renderTrendList(this.metaTrends.stable, 'stable')}
              </div>
            </div>
          </div>
        </div>

        <!-- Top Performers Table -->
        <div class="performers-section">
          <div class="performers-header">
            <h3 class="performers-title">Top Performers</h3>
            <div class="performers-tabs">
              <button class="tab-btn active" data-tab="winrate">Win Rate</button>
              <button class="tab-btn" data-tab="pickrate">Pick Rate</button>
              <button class="tab-btn" data-tab="synergy">Synergy Score</button>
            </div>
          </div>
          <div class="performers-content">
            ${this.renderPerformersTable()}
          </div>
        </div>

        <!-- Historical Trends -->
        <div class="historical-section">
          <div class="historical-header">
            <h3 class="historical-title">Historical Trends</h3>
            <p class="historical-subtitle">Meta evolution over the past 6 months</p>
          </div>
          <div class="historical-content">
            ${this.renderHistoricalChart()}
          </div>
        </div>
      </div>
    `;

    this.attachMetaDashboardEvents();
  }

  renderMetricsCards() {
    const stats = this.usageStats;
    const totalPalmon = stats.totalPalmon || 0;
    const sTierCount = stats.tierDistribution['S'] || 0;
    const mostPopularElement = Object.entries(stats.elementDistribution)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';
    const avgWinRate = this.winRates.reduce((sum, p) => sum + p.winRate, 0) / this.winRates.length || 0;

    return `
      <div class="metric-card">
        <div class="metric-icon">📊</div>
        <div class="metric-content">
          <div class="metric-value">${totalPalmon}</div>
          <div class="metric-label">Total Palmon</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">⭐</div>
        <div class="metric-content">
          <div class="metric-value">${sTierCount}</div>
          <div class="metric-label">S-Tier Palmon</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">${this.getElementIcon(mostPopularElement)}</div>
        <div class="metric-content">
          <div class="metric-value">${mostPopularElement}</div>
          <div class="metric-label">Top Element</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">🏆</div>
        <div class="metric-content">
          <div class="metric-value">${avgWinRate.toFixed(1)}%</div>
          <div class="metric-label">Avg Win Rate</div>
        </div>
      </div>
    `;
  }

  renderTierDistributionChart() {
    const distribution = this.usageStats.tierDistribution;
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    
    return `
      <div class="pie-chart">
        ${Object.entries(distribution).map(([tier, count]) => {
          const percentage = ((count / total) * 100).toFixed(1);
          return `
            <div class="pie-segment" data-tier="${tier}">
              <div class="segment-bar">
                <div class="segment-fill tier-${tier.toLowerCase()}" style="width: ${percentage}%"></div>
              </div>
              <div class="segment-info">
                <span class="segment-label">${tier}-Tier</span>
                <span class="segment-value">${count} (${percentage}%)</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderElementUsageChart() {
    const distribution = this.usageStats.elementDistribution;
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    
    return `
      <div class="bar-chart">
        ${Object.entries(distribution).map(([element, count]) => {
          const percentage = ((count / total) * 100).toFixed(1);
          return `
            <div class="bar-item">
              <div class="bar-label">
                <span class="element-icon">${this.getElementIcon(element)}</span>
                <span class="element-name">${element}</span>
              </div>
              <div class="bar-container">
                <div class="bar-fill element-${element.toLowerCase()}" style="width: ${percentage}%"></div>
                <span class="bar-value">${count}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderWinRateChart() {
    const topPerformers = this.winRates
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 15);

    return `
      <div class="scatter-chart">
        <div class="chart-grid">
          ${topPerformers.map(palmon => `
            <div class="scatter-point" 
                 style="left: ${palmon.pickRate}%; bottom: ${palmon.winRate}%"
                 data-palmon="${palmon.name}"
                 title="${palmon.name}: ${palmon.winRate.toFixed(1)}% WR, ${palmon.pickRate.toFixed(1)}% PR">
              <div class="point-dot tier-${palmon.tier.toLowerCase()}"></div>
              <div class="point-label">${palmon.name}</div>
            </div>
          `).join('')}
        </div>
        <div class="chart-axes">
          <div class="x-axis">
            <span class="axis-label">Pick Rate (%)</span>
          </div>
          <div class="y-axis">
            <span class="axis-label">Win Rate (%)</span>
          </div>
        </div>
      </div>
    `;
  }

  renderTrendList(palmonList, trendType) {
    if (!palmonList.length) {
      return '<div class="trend-empty">No significant trends detected</div>';
    }

    return palmonList.map(palmon => `
      <div class="trend-item" data-palmon="${palmon.name}">
        <div class="trend-palmon-info">
          <div class="trend-palmon-name">${palmon.name}</div>
          <div class="trend-palmon-meta">
            <span class="badge badge-tier-${palmon.tier.toLowerCase()}">${palmon.tier}</span>
            <span class="badge badge-${palmon.element.toLowerCase()}">${palmon.element}</span>
          </div>
        </div>
        <div class="trend-value ${trendType}">
          ${trendType === 'rising' ? '+' : trendType === 'falling' ? '' : ''}${palmon.trend.toFixed(1)}%
        </div>
      </div>
    `).join('');
  }

  renderPerformersTable() {
    const sortedByWinRate = [...this.winRates].sort((a, b) => b.winRate - a.winRate).slice(0, 10);
    
    return `
      <div class="performers-table" id="performers-table">
        <div class="table-header">
          <div class="table-row header-row">
            <div class="table-cell rank-cell">Rank</div>
            <div class="table-cell palmon-cell">Palmon</div>
            <div class="table-cell tier-cell">Tier</div>
            <div class="table-cell stat-cell">Win Rate</div>
            <div class="table-cell stat-cell">Pick Rate</div>
            <div class="table-cell stat-cell">Synergy</div>
          </div>
        </div>
        <div class="table-body">
          ${sortedByWinRate.map((palmon, index) => `
            <div class="table-row" data-palmon="${palmon.name}">
              <div class="table-cell rank-cell">
                <span class="rank-number">#${index + 1}</span>
              </div>
              <div class="table-cell palmon-cell">
                <div class="palmon-info">
                  <span class="palmon-name">${palmon.name}</span>
                  <span class="palmon-element">${this.getElementIcon(palmon.element)} ${palmon.element}</span>
                </div>
              </div>
              <div class="table-cell tier-cell">
                <span class="badge badge-tier-${palmon.tier.toLowerCase()}">${palmon.tier}</span>
              </div>
              <div class="table-cell stat-cell">
                <span class="stat-value">${palmon.winRate.toFixed(1)}%</span>
              </div>
              <div class="table-cell stat-cell">
                <span class="stat-value">${palmon.pickRate.toFixed(1)}%</span>
              </div>
              <div class="table-cell stat-cell">
                <span class="stat-value">${palmon.synergies.toFixed(0)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderHistoricalChart() {
    const months = this.historicalData.tierDistribution.map(d => d.month);
    
    return `
      <div class="historical-chart">
        <div class="chart-legend">
          <div class="legend-item">
            <div class="legend-color tier-s"></div>
            <span class="legend-label">S-Tier</span>
          </div>
          <div class="legend-item">
            <div class="legend-color tier-a"></div>
            <span class="legend-label">A-Tier</span>
          </div>
          <div class="legend-item">
            <div class="legend-color tier-b"></div>
            <span class="legend-label">B-Tier</span>
          </div>
          <div class="legend-item">
            <div class="legend-color tier-c"></div>
            <span class="legend-label">C-Tier</span>
          </div>
        </div>
        <div class="line-chart">
          <div class="chart-lines">
            ${['S', 'A', 'B', 'C'].map(tier => `
              <div class="chart-line tier-${tier.toLowerCase()}">
                ${months.map((month, index) => {
                  const value = this.historicalData.tierDistribution[index].data[tier] || 0;
                  const x = (index / (months.length - 1)) * 100;
                  const y = 100 - (value / 25) * 100; // Normalize to chart height
                  return `<div class="line-point" style="left: ${x}%; top: ${y}%" data-value="${value}"></div>`;
                }).join('')}
              </div>
            `).join('')}
          </div>
          <div class="chart-x-axis">
            ${months.map(month => `<span class="x-label">${month}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  getElementIcon(element) {
    const icons = {
      'Fire': '🔥',
      'Water': '💧',
      'Earth': '🌱',
      'Electric': '⚡'
    };
    return icons[element] || '❓';
  }

  attachMetaDashboardEvents() {
    // Time period selector
    const timePeriodSelect = document.getElementById('time-period-select');
    if (timePeriodSelect) {
      timePeriodSelect.addEventListener('change', (e) => {
        this.updateDashboardForPeriod(e.target.value);
      });
    }

    // Refresh data button
    const refreshBtn = document.getElementById('refresh-data');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.refreshMetaData();
      });
    }

    // Performers table tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        this.switchPerformersTab(tab);
        
        // Update active tab
        tabBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // Trend item clicks
    const trendItems = document.querySelectorAll('.trend-item');
    trendItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const palmonName = e.currentTarget.dataset.palmon;
        this.showPalmonDetails(palmonName);
      });
    });

    // Table row clicks
    const tableRows = document.querySelectorAll('.table-row[data-palmon]');
    tableRows.forEach(row => {
      row.addEventListener('click', (e) => {
        const palmonName = e.currentTarget.dataset.palmon;
        this.showPalmonDetails(palmonName);
      });
    });
  }

  updateDashboardForPeriod(period) {
    // Simulate data update for different time periods
    console.log(`Updating dashboard for period: ${period}`);
    // In a real implementation, this would fetch different data
    // For now, just show a notification
    this.showNotification(`Updated data for ${period}`, 'info');
  }

  refreshMetaData() {
    // Simulate data refresh
    this.historicalData = this.generateHistoricalData();
    this.usageStats = this.calculateUsageStats();
    this.winRates = this.generateWinRates();
    this.metaTrends = this.calculateMetaTrends();
    
    // Re-render dashboard
    this.renderMetaDashboard();
    this.showNotification('Meta data refreshed successfully', 'success');
  }

  switchPerformersTab(tab) {
    const tableContainer = document.getElementById('performers-table');
    if (!tableContainer) return;

    let sortedData;
    switch (tab) {
      case 'pickrate':
        sortedData = [...this.winRates].sort((a, b) => b.pickRate - a.pickRate);
        break;
      case 'synergy':
        sortedData = [...this.winRates].sort((a, b) => b.synergies - a.synergies);
        break;
      default: // winrate
        sortedData = [...this.winRates].sort((a, b) => b.winRate - a.winRate);
    }

    // Update table content
    const tableBody = tableContainer.querySelector('.table-body');
    if (tableBody) {
      tableBody.innerHTML = sortedData.slice(0, 10).map((palmon, index) => `
        <div class="table-row" data-palmon="${palmon.name}">
          <div class="table-cell rank-cell">
            <span class="rank-number">#${index + 1}</span>
          </div>
          <div class="table-cell palmon-cell">
            <div class="palmon-info">
              <span class="palmon-name">${palmon.name}</span>
              <span class="palmon-element">${this.getElementIcon(palmon.element)} ${palmon.element}</span>
            </div>
          </div>
          <div class="table-cell tier-cell">
            <span class="badge badge-tier-${palmon.tier.toLowerCase()}">${palmon.tier}</span>
          </div>
          <div class="table-cell stat-cell">
            <span class="stat-value">${palmon.winRate.toFixed(1)}%</span>
          </div>
          <div class="table-cell stat-cell">
            <span class="stat-value">${palmon.pickRate.toFixed(1)}%</span>
          </div>
          <div class="table-cell stat-cell">
            <span class="stat-value">${palmon.synergies.toFixed(0)}</span>
          </div>
        </div>
      `).join('');

      // Re-attach click events
      const newTableRows = tableBody.querySelectorAll('.table-row[data-palmon]');
      newTableRows.forEach(row => {
        row.addEventListener('click', (e) => {
          const palmonName = e.currentTarget.dataset.palmon;
          this.showPalmonDetails(palmonName);
        });
      });
    }
  }

  showPalmonDetails(palmonName) {
    const palmon = this.palmonData.find(p => p.name === palmonName);
    if (palmon) {
      // Use existing PalmonDetailModal if available
      if (typeof PalmonDetailModal !== 'undefined') {
        const modal = new PalmonDetailModal(palmon);
        modal.show();
      } else {
        // Fallback notification
        this.showNotification(`Viewing details for ${palmonName}`, 'info');
      }
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style based on type
    const styles = {
      info: 'var(--text-accent)',
      error: 'var(--tier-s)',
      success: 'var(--tier-economy)',
      warning: 'var(--tier-a)'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${styles[type] || styles.info};
      color: white;
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: var(--z-tooltip);
      max-width: 300px;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }
}

// Tutorial System and Beginner Guides Component
class TutorialSystem {
  constructor(app) {
    this.app = app;
    this.currentTour = null;
    this.currentStep = 0;
    this.isActive = false;
    this.tutorials = this.initializeTutorials();
    this.tooltips = new Map();
    this.init();
  }

  init() {
    this.createTutorialUI();
    this.setupEventListeners();
    this.checkFirstVisit();
  }

  initializeTutorials() {
    return {
      'getting-started': {
        id: 'getting-started',
        title: 'Getting Started with Palmon Masters',
        description: 'Learn the basics of navigating and using our strategy hub',
        steps: [
          {
            target: '.nav-brand',
            title: 'Welcome to Palmon Masters!',
            content: 'This is your ultimate strategy hub for Palmon: Survival Min|Max. Let\'s take a quick tour to get you started.',
            position: 'bottom'
          },
          {
            target: '[data-nav="tier-list"]',
            title: 'Tier List',
            content: 'Browse our comprehensive tier list to see how each Palmon ranks in the current meta. Click here to explore different tiers and filtering options.',
            position: 'bottom'
          },
          {
            target: '[data-nav="team-builder"]',
            title: 'Team Builder',
            content: 'Create and optimize your team compositions with our drag-and-drop team builder. Perfect for experimenting with synergies.',
            position: 'bottom'
          },
          {
            target: '[data-nav="meta-analysis"]',
            title: 'Meta Analysis',
            content: 'Dive deep into statistics, win rates, and meta trends to stay ahead of the competition.',
            position: 'bottom'
          },
          {
            target: '#global-search',
            title: 'Search Function',
            content: 'Quickly find any Palmon using our search feature. Just start typing a name to get instant results.',
            position: 'bottom'
          },
          {
            target: '#theme-toggle',
            title: 'Theme Toggle',
            content: 'Switch between dark and light themes to customize your viewing experience.',
            position: 'bottom-left'
          }
        ]
      },
      'team-building': {
        id: 'team-building',
        title: 'Team Building Basics',
        description: 'Learn how to create effective team compositions',
        steps: [
          {
            target: '.team-composition-section',
            title: 'Team Composition Grid',
            content: 'This is where you\'ll build your team. You have 6 slots total - 3 in the front row and 3 in the back row.',
            position: 'top'
          },
          {
            target: '.front-row',
            title: 'Front Row Strategy',
            content: 'Front row Palmon are typically your tanks and melee DPS. They\'ll take the brunt of enemy attacks.',
            position: 'top'
          },
          {
            target: '.back-row',
            title: 'Back Row Strategy',
            content: 'Back row is perfect for ranged DPS, supports, and utility Palmon. They\'re safer from enemy attacks.',
            position: 'top'
          },
          {
            target: '.palmon-selection-section',
            title: 'Palmon Library',
            content: 'Browse and select Palmon from your library. You can drag them directly onto team slots or use quick-add buttons.',
            position: 'left'
          }
        ]
      },
      'tier-list-guide': {
        id: 'tier-list-guide',
        title: 'Understanding Tier Lists',
        description: 'Learn how to interpret and use our tier rankings',
        steps: [
          {
            target: '.tier-list-container',
            title: 'Tier Rankings Explained',
            content: 'Palmon are ranked from S-Tier (strongest) to Economy Tier (budget-friendly). Each tier represents overall power level and meta relevance.',
            position: 'top'
          },
          {
            target: '.filter-panel',
            title: 'Filtering Options',
            content: 'Use filters to narrow down Palmon by element, role, or tier. This helps you find exactly what you\'re looking for.',
            position: 'right'
          }
        ]
      }
    };
  }

  createTutorialUI() {
    // Create tutorial overlay
    const overlay = document.createElement('div');
    overlay.id = 'tutorial-overlay';
    overlay.className = 'tutorial-overlay';
    overlay.innerHTML = `
      <div class="tutorial-spotlight"></div>
      <div class="tutorial-popup">
        <div class="tutorial-header">
          <h3 class="tutorial-title"></h3>
          <button class="tutorial-close" title="Close tutorial">×</button>
        </div>
        <div class="tutorial-content">
          <p class="tutorial-text"></p>
        </div>
        <div class="tutorial-footer">
          <div class="tutorial-progress">
            <span class="tutorial-step-counter"></span>
            <div class="tutorial-progress-bar">
              <div class="tutorial-progress-fill"></div>
            </div>
          </div>
          <div class="tutorial-actions">
            <button class="btn btn-ghost tutorial-prev">Previous</button>
            <button class="btn btn-primary tutorial-next">Next</button>
            <button class="btn btn-secondary tutorial-finish" style="display: none;">Finish</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Create tutorial launcher button
    const launcher = document.createElement('div');
    launcher.id = 'tutorial-launcher';
    launcher.className = 'tutorial-launcher';
    launcher.innerHTML = `
      <button class="tutorial-launcher-btn" title="Start Tutorial">
        <span class="launcher-icon">🎓</span>
        <span class="launcher-text">Help</span>
      </button>
      <div class="tutorial-menu">
        <div class="tutorial-menu-header">
          <h4>Tutorials & Guides</h4>
        </div>
        <div class="tutorial-menu-content">
          <button class="tutorial-menu-item" data-tutorial="getting-started">
            <span class="menu-item-icon">🚀</span>
            <div class="menu-item-content">
              <span class="menu-item-title">Getting Started</span>
              <span class="menu-item-desc">Basic navigation and features</span>
            </div>
          </button>
          <button class="tutorial-menu-item" data-tutorial="team-building">
            <span class="menu-item-icon">⚔️</span>
            <div class="menu-item-content">
              <span class="menu-item-title">Team Building</span>
              <span class="menu-item-desc">Learn composition strategies</span>
            </div>
          </button>
          <button class="tutorial-menu-item" data-tutorial="tier-list-guide">
            <span class="menu-item-icon">📊</span>
            <div class="menu-item-content">
              <span class="menu-item-title">Tier List Guide</span>
              <span class="menu-item-desc">Understanding rankings</span>
            </div>
          </button>
          <div class="tutorial-menu-divider"></div>
          <button class="tutorial-menu-item" id="toggle-tooltips">
            <span class="menu-item-icon">💡</span>
            <div class="menu-item-content">
              <span class="menu-item-title">Toggle Tooltips</span>
              <span class="menu-item-desc">Show/hide contextual help</span>
            </div>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(launcher);
  }

  setupEventListeners() {
    // Tutorial launcher
    const launcherBtn = document.querySelector('.tutorial-launcher-btn');
    const tutorialMenu = document.querySelector('.tutorial-menu');
    
    if (launcherBtn) {
      launcherBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        tutorialMenu.classList.toggle('active');
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.tutorial-launcher')) {
        tutorialMenu.classList.remove('active');
      }
    });

    // Tutorial menu items
    const menuItems = document.querySelectorAll('.tutorial-menu-item[data-tutorial]');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const tutorialId = e.currentTarget.dataset.tutorial;
        this.startTutorial(tutorialId);
        tutorialMenu.classList.remove('active');
      });
    });

    // Tooltip toggle
    const tooltipToggle = document.getElementById('toggle-tooltips');
    if (tooltipToggle) {
      tooltipToggle.addEventListener('click', () => {
        this.toggleTooltips();
        tutorialMenu.classList.remove('active');
      });
    }

    // Tutorial controls
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) {
      overlay.querySelector('.tutorial-close').addEventListener('click', () => {
        this.endTutorial();
      });

      overlay.querySelector('.tutorial-prev').addEventListener('click', () => {
        this.previousStep();
      });

      overlay.querySelector('.tutorial-next').addEventListener('click', () => {
        this.nextStep();
      });

      overlay.querySelector('.tutorial-finish').addEventListener('click', () => {
        this.endTutorial();
      });

      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.endTutorial();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.isActive) return;

      switch (e.key) {
        case 'Escape':
          this.endTutorial();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          this.nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.previousStep();
          break;
      }
    });
  }

  checkFirstVisit() {
    const hasVisited = localStorage.getItem('palmon-masters-visited');
    if (!hasVisited) {
      // Show welcome message after a short delay
      setTimeout(() => {
        this.showWelcomeMessage();
      }, 2000);
      localStorage.setItem('palmon-masters-visited', 'true');
    }
  }

  showWelcomeMessage() {
    const welcomeModal = document.createElement('div');
    welcomeModal.className = 'welcome-modal';
    welcomeModal.innerHTML = `
      <div class="welcome-backdrop"></div>
      <div class="welcome-container">
        <div class="welcome-header">
          <h2 class="welcome-title">Welcome to Palmon Masters! 🎉</h2>
          <button class="welcome-close">×</button>
        </div>
        <div class="welcome-content">
          <p class="welcome-text">
            Your ultimate strategy hub for Palmon: Survival Min|Max is ready! 
            Would you like a quick tour to get started?
          </p>
          <div class="welcome-features">
            <div class="welcome-feature">
              <span class="feature-icon">📊</span>
              <span class="feature-text">Interactive tier lists</span>
            </div>
            <div class="welcome-feature">
              <span class="feature-icon">⚔️</span>
              <span class="feature-text">Team builder tools</span>
            </div>
            <div class="welcome-feature">
              <span class="feature-icon">📈</span>
              <span class="feature-text">Meta analysis dashboard</span>
            </div>
          </div>
        </div>
        <div class="welcome-actions">
          <button class="btn btn-ghost welcome-skip">Skip Tour</button>
          <button class="btn btn-primary welcome-start-tour">Start Tour</button>
        </div>
      </div>
    `;

    document.body.appendChild(welcomeModal);

    // Event listeners
    const closeWelcome = () => {
      welcomeModal.remove();
    };

    welcomeModal.querySelector('.welcome-close').addEventListener('click', closeWelcome);
    welcomeModal.querySelector('.welcome-skip').addEventListener('click', closeWelcome);
    welcomeModal.querySelector('.welcome-start-tour').addEventListener('click', () => {
      closeWelcome();
      this.startTutorial('getting-started');
    });

    welcomeModal.addEventListener('click', (e) => {
      if (e.target === welcomeModal) {
        closeWelcome();
      }
    });
  }

  startTutorial(tutorialId) {
    const tutorial = this.tutorials[tutorialId];
    if (!tutorial) return;

    this.currentTour = tutorial;
    this.currentStep = 0;
    this.isActive = true;

    const overlay = document.getElementById('tutorial-overlay');
    overlay.classList.add('active');
    
    this.showStep(0);
  }

  showStep(stepIndex) {
    if (!this.currentTour || stepIndex >= this.currentTour.steps.length) return;

    const step = this.currentTour.steps[stepIndex];
    const overlay = document.getElementById('tutorial-overlay');
    const popup = overlay.querySelector('.tutorial-popup');
    const spotlight = overlay.querySelector('.tutorial-spotlight');

    // Update content
    overlay.querySelector('.tutorial-title').textContent = step.title;
    overlay.querySelector('.tutorial-text').textContent = step.content;
    
    // Update progress
    const stepCounter = overlay.querySelector('.tutorial-step-counter');
    const progressFill = overlay.querySelector('.tutorial-progress-fill');
    stepCounter.textContent = `${stepIndex + 1} of ${this.currentTour.steps.length}`;
    progressFill.style.width = `${((stepIndex + 1) / this.currentTour.steps.length) * 100}%`;

    // Update buttons
    const prevBtn = overlay.querySelector('.tutorial-prev');
    const nextBtn = overlay.querySelector('.tutorial-next');
    const finishBtn = overlay.querySelector('.tutorial-finish');

    prevBtn.style.display = stepIndex > 0 ? 'block' : 'none';
    
    if (stepIndex === this.currentTour.steps.length - 1) {
      nextBtn.style.display = 'none';
      finishBtn.style.display = 'block';
    } else {
      nextBtn.style.display = 'block';
      finishBtn.style.display = 'none';
    }

    // Position popup and spotlight
    this.positionTutorialElements(step, popup, spotlight);
  }

  positionTutorialElements(step, popup, spotlight) {
    const target = document.querySelector(step.target);
    if (!target) {
      // If target not found, center the popup
      popup.style.position = 'fixed';
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
      spotlight.style.display = 'none';
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();

    // Position spotlight
    spotlight.style.display = 'block';
    spotlight.style.left = `${targetRect.left - 10}px`;
    spotlight.style.top = `${targetRect.top - 10}px`;
    spotlight.style.width = `${targetRect.width + 20}px`;
    spotlight.style.height = `${targetRect.height + 20}px`;

    // Position popup based on step.position
    let popupLeft, popupTop;

    switch (step.position) {
      case 'top':
        popupLeft = targetRect.left + (targetRect.width / 2) - (popupRect.width / 2);
        popupTop = targetRect.top - popupRect.height - 20;
        break;
      case 'bottom':
        popupLeft = targetRect.left + (targetRect.width / 2) - (popupRect.width / 2);
        popupTop = targetRect.bottom + 20;
        break;
      case 'left':
        popupLeft = targetRect.left - popupRect.width - 20;
        popupTop = targetRect.top + (targetRect.height / 2) - (popupRect.height / 2);
        break;
      case 'right':
        popupLeft = targetRect.right + 20;
        popupTop = targetRect.top + (targetRect.height / 2) - (popupRect.height / 2);
        break;
      case 'bottom-left':
        popupLeft = targetRect.left;
        popupTop = targetRect.bottom + 20;
        break;
      default:
        popupLeft = targetRect.left + (targetRect.width / 2) - (popupRect.width / 2);
        popupTop = targetRect.bottom + 20;
    }

    // Ensure popup stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    popupLeft = Math.max(20, Math.min(popupLeft, viewportWidth - popupRect.width - 20));
    popupTop = Math.max(20, Math.min(popupTop, viewportHeight - popupRect.height - 20));

    popup.style.position = 'fixed';
    popup.style.left = `${popupLeft}px`;
    popup.style.top = `${popupTop}px`;
    popup.style.transform = 'none';

    // Scroll target into view if needed
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  nextStep() {
    if (this.currentStep < this.currentTour.steps.length - 1) {
      this.currentStep++;
      this.showStep(this.currentStep);
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  }

  endTutorial() {
    this.isActive = false;
    this.currentTour = null;
    this.currentStep = 0;

    const overlay = document.getElementById('tutorial-overlay');
    overlay.classList.remove('active');
  }

  // Contextual tooltips system
  addTooltip(selector, content, options = {}) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const tooltip = {
        element,
        content,
        position: options.position || 'top',
        trigger: options.trigger || 'hover',
        delay: options.delay || 500
      };

      this.tooltips.set(element, tooltip);
      this.attachTooltipEvents(tooltip);
    });
  }

  attachTooltipEvents(tooltip) {
    const { element, trigger } = tooltip;

    if (trigger === 'hover') {
      let hoverTimeout;

      element.addEventListener('mouseenter', () => {
        hoverTimeout = setTimeout(() => {
          this.showTooltip(tooltip);
        }, tooltip.delay);
      });

      element.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        this.hideTooltip(tooltip);
      });
    } else if (trigger === 'click') {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTooltip(tooltip);
      });
    }
  }

  showTooltip(tooltip) {
    if (!this.tooltipsEnabled) return;

    const { element, content, position } = tooltip;
    
    // Remove existing tooltip
    this.hideTooltip(tooltip);

    // Create tooltip element
    const tooltipEl = document.createElement('div');
    tooltipEl.className = 'contextual-tooltip';
    tooltipEl.innerHTML = content;
    document.body.appendChild(tooltipEl);

    // Position tooltip
    const elementRect = element.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();

    let left, top;

    switch (position) {
      case 'top':
        left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
        top = elementRect.top - tooltipRect.height - 10;
        break;
      case 'bottom':
        left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
        top = elementRect.bottom + 10;
        break;
      case 'left':
        left = elementRect.left - tooltipRect.width - 10;
        top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
        break;
      case 'right':
        left = elementRect.right + 10;
        top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
        break;
    }

    // Ensure tooltip stays within viewport
    left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
    top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));

    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${top}px`;

    // Store reference
    tooltip.tooltipElement = tooltipEl;

    // Animate in
    requestAnimationFrame(() => {
      tooltipEl.classList.add('visible');
    });
  }

  hideTooltip(tooltip) {
    if (tooltip.tooltipElement) {
      tooltip.tooltipElement.remove();
      tooltip.tooltipElement = null;
    }
  }

  toggleTooltip(tooltip) {
    if (tooltip.tooltipElement) {
      this.hideTooltip(tooltip);
    } else {
      this.showTooltip(tooltip);
    }
  }

  toggleTooltips() {
    this.tooltipsEnabled = !this.tooltipsEnabled;
    localStorage.setItem('palmon-tooltips-enabled', this.tooltipsEnabled);

    if (!this.tooltipsEnabled) {
      // Hide all active tooltips
      this.tooltips.forEach(tooltip => {
        this.hideTooltip(tooltip);
      });
    }

    this.app.showNotification(
      `Tooltips ${this.tooltipsEnabled ? 'enabled' : 'disabled'}`,
      'info'
    );
  }

  initializeContextualTooltips() {
    // Load tooltip preference
    this.tooltipsEnabled = localStorage.getItem('palmon-tooltips-enabled') !== 'false';

    // Add tooltips to various elements
    this.addTooltip('.nav-link', 'Navigate to this section', { position: 'bottom' });
    this.addTooltip('.badge', 'Click for more information about this tier/element', { position: 'top' });
    this.addTooltip('.team-slot', 'Drag Palmon here to add them to your team', { position: 'top' });
    this.addTooltip('.search-input', 'Search for Palmon by name, element, or role', { position: 'bottom' });
    this.addTooltip('.theme-toggle', 'Switch between light and dark themes', { position: 'bottom-left' });
  }
}

// Sharing and Export Features Component
class SharingExportSystem {
  constructor(app) {
    this.app = app;
    this.canvas = null;
    this.init();
  }

  init() {
    this.createCanvas();
    this.setupSharingButtons();
    this.setupExportButtons();
  }

  createCanvas() {
    // Create hidden canvas for image generation
    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'none';
    document.body.appendChild(this.canvas);
  }

  setupSharingButtons() {
    // Add sharing buttons to various components
    this.addSharingToCards();
    this.addSharingToTeamBuilder();
    this.addSharingToTierList();
  }

  setupExportButtons() {
    // Add export functionality
    this.addExportToTeamBuilder();
    this.addExportToTierList();
  }

  addSharingToCards() {
    // Add sharing buttons to Palmon cards
    document.addEventListener('click', (e) => {
      if (e.target.closest('.share-palmon-btn')) {
        const palmonCard = e.target.closest('.palmon-card');
        if (palmonCard) {
          const palmonName = palmonCard.dataset.palmon;
          this.sharePalmon(palmonName);
        }
      }
    });
  }

  addSharingToTeamBuilder() {
    // Add sharing functionality to team builder
    const teamBuilderSection = document.getElementById('team-builder');
    if (teamBuilderSection) {
      const shareTeamBtn = document.createElement('button');
      shareTeamBtn.className = 'btn btn-secondary';
      shareTeamBtn.innerHTML = `
        <span class="btn-icon">🔗</span>
        Share Team
      `;
      shareTeamBtn.addEventListener('click', () => {
        this.shareTeam();
      });

      const teamActions = teamBuilderSection.querySelector('.team-actions');
      if (teamActions) {
        teamActions.appendChild(shareTeamBtn);
      }
    }
  }

  addSharingToTierList() {
    // Add sharing functionality to tier list
    const tierListSection = document.getElementById('tier-list');
    if (tierListSection) {
      const shareTierBtn = document.createElement('button');
      shareTierBtn.className = 'btn btn-ghost';
      shareTierBtn.innerHTML = `
        <span class="btn-icon">📊</span>
        Share Tier List
      `;
      shareTierBtn.addEventListener('click', () => {
        this.shareTierList();
      });

      const tierListContainer = tierListSection.querySelector('#tier-list-container');
      if (tierListContainer) {
        tierListContainer.appendChild(shareTierBtn);
      }
    }
  }

  addExportToTeamBuilder() {
    // Add export functionality to team builder
    const teamBuilderSection = document.getElementById('team-builder');
    if (teamBuilderSection) {
      const exportTeamBtn = document.createElement('button');
      exportTeamBtn.className = 'btn btn-primary';
      exportTeamBtn.innerHTML = `
        <span class="btn-icon">📷</span>
        Export as Image
      `;
      exportTeamBtn.addEventListener('click', () => {
        this.exportTeamAsImage();
      });

      const teamActions = teamBuilderSection.querySelector('.team-actions');
      if (teamActions) {
        teamActions.appendChild(exportTeamBtn);
      }
    }
  }

  addExportToTierList() {
    // Add export functionality to tier list
    const tierListSection = document.getElementById('tier-list');
    if (tierListSection) {
      const exportTierBtn = document.createElement('button');
      exportTierBtn.className = 'btn btn-primary';
      exportTierBtn.innerHTML = `
        <span class="btn-icon">💾</span>
        Export Tier List
      `;
      exportTierBtn.addEventListener('click', () => {
        this.exportTierListAsImage();
      });

      const tierListContainer = tierListSection.querySelector('#tier-list-container');
      if (tierListContainer) {
        tierListContainer.appendChild(exportTierBtn);
      }
    }
  }

  // Sharing Methods
  async sharePalmon(palmonName) {
    const palmon = this.app.processedPalmonData?.find(p => p.name === palmonName);
    if (!palmon) return;

    const shareData = {
      title: `${palmon.name} - Palmon Masters`,
      text: `Check out ${palmon.name}, a ${palmon.tier}-tier ${palmon.element} ${palmon.role} in Palmon: Survival Min|Max!`,
      url: `${window.location.origin}${window.location.pathname}#palmon=${encodeURIComponent(palmon.name)}`
    };

    try {
      if (navigator.share && this.isMobile()) {
        await navigator.share(shareData);
      } else {
        this.showShareModal(shareData);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      this.showShareModal(shareData);
    }
  }

  async shareTeam() {
    const team = this.getCurrentTeam();
    if (!team || team.length === 0) {
      this.app.showNotification('No team to share! Add some Palmon to your team first.', 'warning');
      return;
    }

    const teamNames = team.map(p => p.name).join(', ');
    const shareData = {
      title: 'My Palmon Team - Palmon Masters',
      text: `Check out my Palmon team: ${teamNames}`,
      url: `${window.location.origin}${window.location.pathname}#team=${this.encodeTeam(team)}`
    };

    try {
      if (navigator.share && this.isMobile()) {
        await navigator.share(shareData);
      } else {
        this.showShareModal(shareData);
      }
    } catch (error) {
      console.error('Error sharing team:', error);
      this.showShareModal(shareData);
    }
  }

  async shareTierList() {
    const shareData = {
      title: 'Palmon Tier List - Palmon Masters',
      text: 'Check out the latest Palmon: Survival Min|Max tier list and meta analysis!',
      url: `${window.location.origin}${window.location.pathname}#tier-list`
    };

    try {
      if (navigator.share && this.isMobile()) {
        await navigator.share(shareData);
      } else {
        this.showShareModal(shareData);
      }
    } catch (error) {
      console.error('Error sharing tier list:', error);
      this.showShareModal(shareData);
    }
  }

  showShareModal(shareData) {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
      <div class="share-backdrop"></div>
      <div class="share-container">
        <div class="share-header">
          <h3 class="share-title">Share</h3>
          <button class="share-close">×</button>
        </div>
        <div class="share-content">
          <div class="share-preview">
            <h4 class="share-preview-title">${shareData.title}</h4>
            <p class="share-preview-text">${shareData.text}</p>
            <span class="share-preview-url">${shareData.url}</span>
          </div>
          <div class="share-options">
            <button class="share-option" data-platform="twitter">
              <span class="share-icon">🐦</span>
              <span class="share-label">Twitter</span>
            </button>
            <button class="share-option" data-platform="facebook">
              <span class="share-icon">📘</span>
              <span class="share-label">Facebook</span>
            </button>
            <button class="share-option" data-platform="reddit">
              <span class="share-icon">📱</span>
              <span class="share-label">Reddit</span>
            </button>
            <button class="share-option" data-platform="discord">
              <span class="share-icon">💬</span>
              <span class="share-label">Discord</span>
            </button>
            <button class="share-option" data-platform="copy">
              <span class="share-icon">📋</span>
              <span class="share-label">Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    const closeModal = () => modal.remove();
    
    modal.querySelector('.share-close').addEventListener('click', closeModal);
    modal.querySelector('.share-backdrop').addEventListener('click', closeModal);

    // Platform sharing
    modal.querySelectorAll('.share-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const platform = e.currentTarget.dataset.platform;
        this.shareOnPlatform(platform, shareData);
        closeModal();
      });
    });

    // Show modal
    requestAnimationFrame(() => {
      modal.classList.add('visible');
    });
  }

  shareOnPlatform(platform, shareData) {
    const encodedText = encodeURIComponent(shareData.text);
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedTitle = encodeURIComponent(shareData.title);

    let shareUrl;

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'reddit':
        shareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
        break;
      case 'discord':
        // Discord doesn't have a direct share URL, so copy to clipboard
        this.copyToClipboard(`${shareData.text} ${shareData.url}`);
        this.app.showNotification('Link copied! Paste it in Discord.', 'success');
        return;
      case 'copy':
        this.copyToClipboard(shareData.url);
        this.app.showNotification('Link copied to clipboard!', 'success');
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  // Export Methods
  async exportTeamAsImage() {
    const team = this.getCurrentTeam();
    if (!team || team.length === 0) {
      this.app.showNotification('No team to export! Add some Palmon to your team first.', 'warning');
      return;
    }

    try {
      this.app.showNotification('Generating team image...', 'info');
      const imageBlob = await this.generateTeamImage(team);
      this.downloadImage(imageBlob, 'palmon-team.png');
      this.app.showNotification('Team image exported successfully!', 'success');
    } catch (error) {
      console.error('Error exporting team:', error);
      this.app.showNotification('Failed to export team image.', 'error');
    }
  }

  async exportTierListAsImage() {
    try {
      this.app.showNotification('Generating tier list image...', 'info');
      const imageBlob = await this.generateTierListImage();
      this.downloadImage(imageBlob, 'palmon-tier-list.png');
      this.app.showNotification('Tier list exported successfully!', 'success');
    } catch (error) {
      console.error('Error exporting tier list:', error);
      this.app.showNotification('Failed to export tier list image.', 'error');
    }
  }

  async generateTeamImage(team) {
    const ctx = this.canvas.getContext('2d');
    const width = 800;
    const height = 600;
    
    this.canvas.width = width;
    this.canvas.height = height;

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#feca57';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('My Palmon Team', width / 2, 50);

    // Subtitle
    ctx.fillStyle = '#a2d2ff';
    ctx.font = '16px Arial';
    ctx.fillText('Created with Palmon Masters', width / 2, 80);

    // Team grid
    const slotWidth = 120;
    const slotHeight = 140;
    const startX = (width - (3 * slotWidth + 2 * 20)) / 2;
    const frontRowY = 120;
    const backRowY = 280;

    // Draw team slots
    team.forEach((palmon, index) => {
      const isBackRow = index >= 3;
      const slotIndex = index % 3;
      const x = startX + slotIndex * (slotWidth + 20);
      const y = isBackRow ? backRowY : frontRowY;

      // Slot background
      ctx.fillStyle = '#16213e';
      ctx.fillRect(x, y, slotWidth, slotHeight);

      // Slot border (tier color)
      const tierColors = {
        'S': '#ff4757',
        'A': '#feca57',
        'B': '#54a0ff',
        'C': '#8395a7',
        'Economy': '#2ed573'
      };
      ctx.strokeStyle = tierColors[palmon.tier] || '#8395a7';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, slotWidth, slotHeight);

      // Palmon name
      ctx.fillStyle = '#e0e0e0';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(palmon.name, x + slotWidth / 2, y + 30);

      // Tier badge
      ctx.fillStyle = tierColors[palmon.tier] || '#8395a7';
      ctx.fillRect(x + 5, y + 5, 30, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(palmon.tier, x + 20, y + 18);

      // Element and role
      ctx.fillStyle = '#a2d2ff';
      ctx.font = '12px Arial';
      ctx.fillText(`${palmon.element} ${palmon.role}`, x + slotWidth / 2, y + slotHeight - 20);
    });

    // Row labels
    ctx.fillStyle = '#a2d2ff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Front Row', 50, frontRowY + 20);
    ctx.fillText('Back Row', 50, backRowY + 20);

    // Watermark
    ctx.fillStyle = '#8395a7';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('palmonmasters.com', width - 20, height - 20);

    return new Promise(resolve => {
      this.canvas.toBlob(resolve, 'image/png');
    });
  }

  async generateTierListImage() {
    const ctx = this.canvas.getContext('2d');
    const width = 1200;
    const height = 800;
    
    this.canvas.width = width;
    this.canvas.height = height;

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#feca57';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Palmon Tier List', width / 2, 50);

    // Subtitle
    ctx.fillStyle = '#a2d2ff';
    ctx.font = '16px Arial';
    ctx.fillText('Current Meta Rankings', width / 2, 80);

    // Tier sections
    const tiers = ['S', 'A', 'B', 'C', 'Economy'];
    const tierColors = {
      'S': '#ff4757',
      'A': '#feca57',
      'B': '#54a0ff',
      'C': '#8395a7',
      'Economy': '#2ed573'
    };

    let currentY = 120;
    const sectionHeight = 120;

    tiers.forEach(tier => {
      const palmonInTier = this.app.processedPalmonData?.filter(p => p.tier === tier) || [];
      
      // Tier label background
      ctx.fillStyle = tierColors[tier];
      ctx.fillRect(20, currentY, 100, sectionHeight);

      // Tier label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(tier, 70, currentY + sectionHeight / 2 + 10);

      // Tier content background
      ctx.fillStyle = '#16213e';
      ctx.fillRect(120, currentY, width - 140, sectionHeight);

      // Palmon in tier
      ctx.fillStyle = '#e0e0e0';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      
      const palmonNames = palmonInTier.slice(0, 15).map(p => p.name).join(', ');
      const maxWidth = width - 160;
      const lines = this.wrapText(ctx, palmonNames, maxWidth);
      
      lines.forEach((line, index) => {
        ctx.fillText(line, 140, currentY + 30 + index * 20);
      });

      currentY += sectionHeight + 10;
    });

    // Watermark
    ctx.fillStyle = '#8395a7';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Generated by Palmon Masters', width - 20, height - 20);

    return new Promise(resolve => {
      this.canvas.toBlob(resolve, 'image/png');
    });
  }

  // Utility Methods
  getCurrentTeam() {
    const teamSlots = document.querySelectorAll('.team-slot');
    const team = [];
    
    teamSlots.forEach(slot => {
      const palmonName = slot.dataset.palmon;
      if (palmonName) {
        const palmon = this.app.processedPalmonData?.find(p => p.name === palmonName);
        if (palmon) {
          team.push(palmon);
        }
      }
    });
    
    return team;
  }

  encodeTeam(team) {
    return btoa(JSON.stringify(team.map(p => ({ name: p.name, tier: p.tier, element: p.element, role: p.role }))));
  }

  decodeTeam(encodedTeam) {
    try {
      return JSON.parse(atob(encodedTeam));
    } catch (error) {
      console.error('Error decoding team:', error);
      return null;
    }
  }

  wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  downloadImage(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Embeddable Widget Generator
  generateEmbedCode(type, data) {
    const baseUrl = window.location.origin + window.location.pathname;
    let embedUrl;
    
    switch (type) {
      case 'palmon':
        embedUrl = `${baseUrl}embed/palmon/${encodeURIComponent(data.name)}`;
        break;
      case 'team':
        embedUrl = `${baseUrl}embed/team/${this.encodeTeam(data)}`;
        break;
      case 'tier-list':
        embedUrl = `${baseUrl}embed/tier-list`;
        break;
      default:
        return null;
    }

    return `<iframe src="${embedUrl}" width="400" height="300" frameborder="0" style="border-radius: 8px;"></iframe>`;
  }

  showEmbedModal(type, data) {
    const embedCode = this.generateEmbedCode(type, data);
    if (!embedCode) return;

    const modal = document.createElement('div');
    modal.className = 'embed-modal';
    modal.innerHTML = `
      <div class="embed-backdrop"></div>
      <div class="embed-container">
        <div class="embed-header">
          <h3 class="embed-title">Embed Code</h3>
          <button class="embed-close">×</button>
        </div>
        <div class="embed-content">
          <p class="embed-description">Copy this code to embed on your website:</p>
          <div class="embed-code-container">
            <textarea class="embed-code" readonly>${embedCode}</textarea>
            <button class="btn btn-primary embed-copy">Copy Code</button>
          </div>
          <div class="embed-preview">
            <h4>Preview:</h4>
            <div class="embed-preview-container">
              ${embedCode}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    const closeModal = () => modal.remove();
    
    modal.querySelector('.embed-close').addEventListener('click', closeModal);
    modal.querySelector('.embed-backdrop').addEventListener('click', closeModal);
    
    modal.querySelector('.embed-copy').addEventListener('click', () => {
      const textarea = modal.querySelector('.embed-code');
      textarea.select();
      this.copyToClipboard(embedCode);
      this.app.showNotification('Embed code copied!', 'success');
    });

    // Show modal
    requestAnimationFrame(() => {
      modal.classList.add('visible');
    });
  }
}
// Initialize the Palmon App when the module loads
const palmonApp = new PalmonApp();