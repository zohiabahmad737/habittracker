import React from 'react';
import { 
  Check, 
  Flame, 
  Clock, 
  Timer, 
  MoreVertical, 
  Edit3, 
  Trash2,
  Sunrise,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import { calculateStreak, formatDateKey, getPastDays } from '../utils/storage';

export default function HabitCard({
  habit,
  currentDateKey,
  onToggleComplete,
  onToggleDay,
  onEditHabit,
  onDeleteHabit,
  onStartTimer,
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  const streak = calculateStreak(habit.history);
  const isCompletedToday = !!habit.history?.[currentDateKey];
  const pastDays = getPastDays(7, new Date());

  // Close popup menu on outside click
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Time of day icon helper
  const getTimeIcon = (time) => {
    switch (time) {
      case 'morning': return <Sunrise size={12} />;
      case 'afternoon': return <Sun size={12} />;
      case 'evening': return <Moon size={12} />;
      default: return <Clock size={12} />;
    }
  };

  return (
    <div 
      className={`habit-card ${isCompletedToday ? 'habit-card-completed' : ''}`}
      style={{ '--habit-accent': habit.color || '#8b5cf6' }}
    >
      <div className="habit-card-top">
        {/* Habit Icon & Info */}
        <div className="habit-main-info">
          <div 
            className="habit-icon-box"
            style={{ 
              backgroundColor: `${habit.color}22`,
              borderColor: `${habit.color}55`,
              color: habit.color || '#8b5cf6' 
            }}
          >
            <DynamicIcon name={habit.icon} size={22} color={habit.color} />
          </div>

          <div className="habit-text-group">
            <div className="habit-title-row">
              <h4 className="habit-title">{habit.title}</h4>
              {streak.current > 0 && (
                <div 
                  className={`streak-pill ${streak.current >= 7 ? 'streak-fire-high' : ''}`}
                  title={`${streak.current} day streak! Best: ${streak.longest} days`}
                >
                  <Flame size={13} className="streak-icon" />
                  <span>{streak.current}d</span>
                </div>
              )}
            </div>

            <p className="habit-description">{habit.description || habit.target}</p>

            <div className="habit-tags-row">
              {habit.target && (
                <span className="habit-tag target-tag">
                  🎯 {habit.target}
                </span>
              )}
              <span className="habit-tag time-tag">
                {getTimeIcon(habit.timeOfDay)}
                <span>{habit.timeOfDay || 'Anytime'}</span>
              </span>
              <span className="habit-tag category-tag">
                {habit.category}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Checkbox & Menu */}
        <div className="habit-actions-right">
          <button
            className={`habit-check-button ${isCompletedToday ? 'checked' : ''}`}
            onClick={() => onToggleComplete(habit.id, currentDateKey)}
            title={isCompletedToday ? 'Mark as incomplete' : 'Mark as completed'}
            aria-label={`Toggle completion for ${habit.title}`}
          >
            {isCompletedToday ? (
              <Check size={20} strokeWidth={3} className="check-icon-anim" />
            ) : (
              <div className="check-empty-dot" />
            )}
          </button>

          <div className="menu-container" ref={menuRef}>
            <button
              className="habit-menu-trigger"
              onClick={() => setMenuOpen(!menuOpen)}
              title="More actions"
              aria-label="Habit options"
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <div className="habit-dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setMenuOpen(false);
                    onStartTimer(habit);
                  }}
                >
                  <Timer size={14} /> Start Focus Timer
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setMenuOpen(false);
                    onEditHabit(habit);
                  }}
                >
                  <Edit3 size={14} /> Edit Habit
                </button>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item item-danger"
                  onClick={() => {
                    setMenuOpen(false);
                    onDeleteHabit(habit.id);
                  }}
                >
                  <Trash2 size={14} /> Delete Habit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7-Day History Mini Strip */}
      <div className="habit-week-strip">
        <span className="week-strip-label">Last 7 Days:</span>
        <div className="week-dots-group">
          {pastDays.map((day) => {
            const isDone = !!habit.history?.[day.dateKey];
            const isCurrentCardDay = day.dateKey === currentDateKey;

            return (
              <button
                key={day.dateKey}
                className={`week-day-dot ${isDone ? 'done' : ''} ${isCurrentCardDay ? 'active-target-day' : ''} ${day.isToday ? 'is-today' : ''}`}
                onClick={() => onToggleDay(habit.id, day.dateKey)}
                title={`${day.dayName} ${day.dayNumber}: ${isDone ? 'Completed' : 'Not completed'}`}
                aria-label={`Toggle ${day.dayName}`}
              >
                <span className="dot-day-name">{day.dayName[0]}</span>
                <span className="dot-indicator">
                  {isDone ? <Check size={10} strokeWidth={3} /> : day.dayNumber}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Quick Launch Focus Timer button */}
        <button 
          className="habit-quick-timer-btn" 
          onClick={() => onStartTimer(habit)}
          title="Start Pomodoro Focus Sprint"
        >
          <Timer size={13} />
          <span>Focus</span>
        </button>
      </div>
    </div>
  );
}
