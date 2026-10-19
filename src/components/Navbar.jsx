import React from 'react';
import { 
  Flame, 
  Plus, 
  Search, 
  Volume2, 
  VolumeX, 
  Palette, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { formatDateKey } from '../utils/storage';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  gamification,
  theme,
  setTheme,
  soundEnabled,
  toggleSound,
  currentDate,
  setCurrentDate,
}) {
  const isToday = formatDateKey(currentDate) === formatDateKey(new Date());

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleResetToday = () => {
    setCurrentDate(new Date());
  };

  const cycleTheme = () => {
    const themes = ['nebula', 'cyber', 'obsidian', 'light'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const formattedDateString = currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <div className="brand-badge" onClick={handleResetToday} role="button" tabIndex={0} title="Habit Pro - Return to Today">
          <div className="brand-logo-ring">
            <Flame className="brand-flame-icon" size={24} />
          </div>
          <div className="brand-titles">
            <span className="brand-title">Habit<span className="brand-gradient-text">Pro</span></span>
            <span className="brand-tagline">Achieve Daily Greatness</span>
          </div>
        </div>

        {/* Date Navigation Pill */}
        <div className="date-navigator">
          <button 
            className="date-nav-btn" 
            onClick={handlePrevDay} 
            title="Previous Day"
            aria-label="Previous Day"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="date-nav-label">
            <Calendar size={14} className="date-icon" />
            <span className="date-text">
              {isToday ? <strong className="today-chip">Today</strong> : null}
              {formattedDateString}
            </span>
          </div>

          <button 
            className="date-nav-btn" 
            onClick={handleNextDay} 
            title="Next Day"
            aria-label="Next Day"
          >
            <ChevronRight size={16} />
          </button>

          {!isToday && (
            <button 
              className="return-today-btn" 
              onClick={handleResetToday} 
              title="Jump to Today"
            >
              <RotateCcw size={12} /> Today
            </button>
          )}
        </div>
      </div>

      <div className="navbar-center">
        {/* Search Bar */}
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search habits or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="search-clear-btn" 
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="navbar-right">
        {/* XP Level Card */}
        <div className="gamification-pill" title={`Level ${gamification.currentLevel.level}: ${gamification.currentLevel.title} (${gamification.totalXP} XP)`}>
          <span className="level-badge-icon">{gamification.currentLevel.badge}</span>
          <div className="level-info">
            <div className="level-row">
              <span className="level-name">Lvl {gamification.currentLevel.level}</span>
              <span className="level-xp">{gamification.totalXP} XP</span>
            </div>
            <div className="level-progress-bg">
              <div 
                className="level-progress-fill" 
                style={{ width: `${gamification.percentToNext}%` }}
              />
            </div>
          </div>
        </div>

        {/* Theme Switcher */}
        <button 
          className="icon-action-btn theme-toggle-btn" 
          onClick={cycleTheme} 
          title={`Switch Theme (Current: ${theme.toUpperCase()})`}
          aria-label="Switch Theme"
        >
          <Palette size={18} />
          <span className="theme-pill-label">{theme}</span>
        </button>

        {/* Sound Toggle */}
        <button 
          className={`icon-action-btn ${!soundEnabled ? 'muted' : ''}`} 
          onClick={toggleSound} 
          title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Add Habit Button */}
        <button className="primary-glow-btn" onClick={onOpenAddModal} id="add-new-habit-btn">
          <Plus size={18} strokeWidth={2.5} />
          <span>New Habit</span>
        </button>
      </div>
    </header>
  );
}
