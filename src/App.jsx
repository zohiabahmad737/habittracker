import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import HabitList from './components/HabitList';
import WeeklyMatrix from './components/WeeklyMatrix';
import AnalyticsView from './components/AnalyticsView';
import FocusTimer from './components/FocusTimer';
import AchievementsView from './components/AchievementsView';
import HabitModal from './components/HabitModal';
import './App.css';

import { 
  loadStoredHabits, 
  saveStoredHabits, 
  loadPomodoroCount, 
  savePomodoroCount, 
  loadTheme, 
  saveTheme, 
  loadSoundSetting, 
  saveSoundSetting,
  calculateGamification,
  formatDateKey,
  INITIAL_HABITS
} from './utils/storage';

import { soundFX } from './utils/audio';
import { fireConfetti, fireSuperCelebration } from './utils/confetti';
import { 
  CheckSquare, 
  Calendar, 
  BarChart2, 
  Timer, 
  Trophy, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

export default function App() {
  const [habits, setHabits] = useState(loadStoredHabits);
  const [pomodoroCount, setPomodoroCount] = useState(loadPomodoroCount);
  const [theme, setTheme] = useState(loadTheme);
  const [soundEnabled, setSoundEnabled] = useState(loadSoundSetting);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'weekly' | 'analytics' | 'timer' | 'achievements'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null);
  const [activeTimerHabitId, setActiveTimerHabitId] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    saveStoredHabits(habits);
  }, [habits]);

  useEffect(() => {
    savePomodoroCount(pomodoroCount);
  }, [pomodoroCount]);

  useEffect(() => {
    saveTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    saveSoundSetting(soundEnabled);
    soundFX.setMuted(!soundEnabled);
  }, [soundEnabled]);

  const currentDateKey = formatDateKey(currentDate);
  const gamification = calculateGamification(habits, pomodoroCount);

  // Toggle habit completion on current date
  const handleToggleComplete = (habitId, dateKey = currentDateKey) => {
    let wasChecked = false;
    let newAllCompleted = false;

    setHabits((prevHabits) => {
      const updated = prevHabits.map((habit) => {
        if (habit.id === habitId) {
          const currentVal = !!habit.history?.[dateKey];
          wasChecked = !currentVal;
          return {
            ...habit,
            history: {
              ...(habit.history || {}),
              [dateKey]: wasChecked,
            },
          };
        }
        return habit;
      });

      // Check if all habits are now completed for this day
      const completedTodayCount = updated.filter((h) => !!h.history?.[dateKey]).length;
      if (wasChecked && completedTodayCount === updated.length && updated.length > 0) {
        newAllCompleted = true;
      }

      return updated;
    });

    // Sound and visual celebration
    soundFX.playToggle(wasChecked);

    if (wasChecked) {
      if (newAllCompleted) {
        setTimeout(() => {
          soundFX.playCelebration();
          fireSuperCelebration();
        }, 150);
      } else {
        fireConfetti();
      }
    }
  };

  // Toggle day in weekly strip / matrix
  const handleToggleDay = (habitId, dayDateKey) => {
    handleToggleComplete(habitId, dayDateKey);
  };

  // Save new / edited habit
  const handleSaveHabit = (habitData) => {
    setHabits((prev) => {
      const exists = prev.some((h) => h.id === habitData.id);
      if (exists) {
        return prev.map((h) => (h.id === habitData.id ? { ...h, ...habitData } : h));
      } else {
        return [habitData, ...prev];
      }
    });
    soundFX.playCelebration();
    fireConfetti();
  };

  // Delete habit
  const handleDeleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      soundFX.playToggle(false);
    }
  };

  // Open edit modal
  const handleEditHabit = (habit) => {
    setHabitToEdit(habit);
    setIsModalOpen(true);
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setHabitToEdit(null);
    setIsModalOpen(true);
  };

  // Start focus timer for habit
  const handleStartTimer = (habit) => {
    setActiveTimerHabitId(habit.id);
    setActiveTab('timer');
  };

  // Pomodoro session complete
  const handlePomodoroComplete = (habitId) => {
    setPomodoroCount((prev) => prev + 1);
    if (habitId) {
      handleToggleComplete(habitId, currentDateKey);
    }
    soundFX.playLevelUp();
    fireSuperCelebration();
  };

  // Reset to sample initial habits
  const handleResetSampleData = () => {
    if (window.confirm('Reset all habits back to default demo data?')) {
      setHabits(INITIAL_HABITS);
      setPomodoroCount(2);
      soundFX.playCelebration();
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className={`app-wrapper theme-${theme}`}>
      {/* Dynamic Ambient Background Glows */}
      <div className="ambient-blob blob-purple" />
      <div className="ambient-blob blob-blue" />
      <div className="ambient-blob blob-cyan" />

      {/* Navigation Bar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddModal={handleOpenAddModal}
        gamification={gamification}
        theme={theme}
        setTheme={setTheme}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />

      <main className="main-content-layout">
        {/* Hero Stats Section */}
        <StatsOverview
          habits={habits}
          currentDateKey={currentDateKey}
          gamification={gamification}
        />

        {/* View Navigation Tabs */}
        <nav className="view-navigation-tabs" aria-label="Main Navigation">
          <button
            className={`tab-nav-btn ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            <CheckSquare size={17} />
            <span>Today's Focus</span>
          </button>

          <button
            className={`tab-nav-btn ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            <Calendar size={17} />
            <span>Weekly Matrix</span>
          </button>

          <button
            className={`tab-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart2 size={17} />
            <span>Analytics & Heatmap</span>
          </button>

          <button
            className={`tab-nav-btn ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            <Timer size={17} />
            <span>Focus Pomodoro</span>
          </button>

          <button
            className={`tab-nav-btn ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            <Trophy size={17} />
            <span>Ranks & Badges</span>
          </button>
        </nav>

        {/* Dynamic Tab Views */}
        <div className="tab-view-container">
          {activeTab === 'today' && (
            <HabitList
              habits={habits}
              currentDateKey={currentDateKey}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedTimeOfDay={selectedTimeOfDay}
              setSelectedTimeOfDay={setSelectedTimeOfDay}
              searchQuery={searchQuery}
              onToggleComplete={handleToggleComplete}
              onToggleDay={handleToggleDay}
              onEditHabit={handleEditHabit}
              onDeleteHabit={handleDeleteHabit}
              onStartTimer={handleStartTimer}
              onOpenAddModal={handleOpenAddModal}
            />
          )}

          {activeTab === 'weekly' && (
            <WeeklyMatrix
              habits={habits}
              onToggleDay={handleToggleDay}
              onOpenAddModal={handleOpenAddModal}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView habits={habits} />
          )}

          {activeTab === 'timer' && (
            <FocusTimer
              habits={habits}
              activeHabitId={activeTimerHabitId}
              setActiveHabitId={setActiveTimerHabitId}
              onSessionComplete={handlePomodoroComplete}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsView gamification={gamification} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <span className="footer-brand">
            <strong>Habit Pro</strong> • Elevate Your Daily Discipline
          </span>
          <button 
            className="footer-reset-btn" 
            onClick={handleResetSampleData}
            title="Reset data to initial sample habits"
          >
            <RotateCcw size={13} /> Reset Demo Data
          </button>
        </div>
      </footer>

      {/* Create / Edit Habit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveHabit={handleSaveHabit}
        habitToEdit={habitToEdit}
      />
    </div>
  );
}
