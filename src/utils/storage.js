// Storage, date utilities, streak calculations, gamification & defaults

export const CATEGORIES = [
  { id: 'all', label: 'All Habits', icon: 'Sparkles', color: '#8b5cf6' },
  { id: 'fitness', label: 'Fitness & Health', icon: 'Dumbbell', color: '#f97316' },
  { id: 'productivity', label: 'Productivity', icon: 'Zap', color: '#8b5cf6' },
  { id: 'learning', label: 'Learning & Mind', icon: 'BookOpen', color: '#10b981' },
  { id: 'mindfulness', label: 'Mindfulness', icon: 'Heart', color: '#ec4899' },
  { id: 'routine', label: 'Daily Routine', icon: 'Sun', color: '#06b6d4' },
];

export const TIME_OF_DAY = [
  { id: 'anytime', label: 'Anytime', icon: 'Clock' },
  { id: 'morning', label: 'Morning', icon: 'Sunrise' },
  { id: 'afternoon', label: 'Afternoon', icon: 'Sun' },
  { id: 'evening', label: 'Evening', icon: 'Moon' },
];

export const AVAILABLE_ICONS = [
  'Dumbbell', 'Droplets', 'Zap', 'BookOpen', 'Heart', 'Sun', 
  'Moon', 'Coffee', 'Feather', 'Activity', 'Award', 'Smile', 
  'Flame', 'Brain', 'Compass', 'Code', 'Music', 'Target'
];

export const COLOR_PRESETS = [
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f97316', // Orange
  '#ec4899', // Pink
  '#a855f7', // Purple
];

// Helper: Format date as YYYY-MM-DD
export function formatDateKey(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate the past N days for calendar / weekly views
export function getPastDays(daysCount = 7, referenceDate = new Date()) {
  const days = [];
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(ref);
    d.setDate(ref.getDate() - i);
    const key = formatDateKey(d);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();
    const isToday = key === formatDateKey(new Date());

    days.push({
      date: d,
      dateKey: key,
      dayName,
      dayNumber,
      isToday,
    });
  }
  return days;
}

// Generate last 60 days for heatmap matrix
export function getHeatmapDays(daysCount = 42) {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      date: d,
      dateKey: formatDateKey(d),
      isToday: i === 0,
    });
  }
  return days;
}

// Helper to seed realistic history for sample habits
function generateSampleHistory(activeDaysCount = 18, skipPattern = 3) {
  const history = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 28; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDateKey(d);

    // Realistic pattern: mostly done, few misses
    if (i === 0) {
      // today completed for some
      history[key] = i % 2 === 0;
    } else if (i % skipPattern !== 0) {
      history[key] = true;
    } else {
      history[key] = false;
    }
  }
  return history;
}

export const INITIAL_HABITS = [
  {
    id: 'habit-1',
    title: 'Morning Workout & Mobility',
    description: '30 mins of strength or HIIT cardio',
    category: 'fitness',
    timeOfDay: 'morning',
    target: '30 mins',
    color: '#f97316',
    icon: 'Dumbbell',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    history: generateSampleHistory(20, 5),
  },
  {
    id: 'habit-2',
    title: 'Hydration Goal (2.5L)',
    description: 'Drink fresh water regularly across the day',
    category: 'fitness',
    timeOfDay: 'anytime',
    target: '8 glasses',
    color: '#06b6d4',
    icon: 'Droplets',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    history: generateSampleHistory(24, 7),
  },
  {
    id: 'habit-3',
    title: 'Deep Focus Work Sprint',
    description: 'No social media, pure distraction-free flow',
    category: 'productivity',
    timeOfDay: 'afternoon',
    target: '45 mins',
    color: '#8b5cf6',
    icon: 'Zap',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    history: generateSampleHistory(22, 4),
  },
  {
    id: 'habit-4',
    title: 'Read Non-Fiction & Tech Books',
    description: 'Expand knowledge, take key notes',
    category: 'learning',
    timeOfDay: 'evening',
    target: '20 pages',
    color: '#10b981',
    icon: 'BookOpen',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    history: generateSampleHistory(18, 4),
  },
  {
    id: 'habit-5',
    title: 'Mindful Breathing & Journaling',
    description: 'Reflect on wins, gratitude, and tomorrow plans',
    category: 'mindfulness',
    timeOfDay: 'evening',
    target: '10 mins',
    color: '#ec4899',
    icon: 'Heart',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    history: generateSampleHistory(16, 6),
  },
];

// Calculate Current Streak and Longest Streak for a habit
export function calculateStreak(history = {}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatDateKey(today);

  // Check if completed today or yesterday
  let currentStreak = 0;
  let checkDate = new Date(today);

  // If not completed today, check from yesterday
  if (!history[todayKey]) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const key = formatDateKey(checkDate);
    if (history[key]) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak across history
  const sortedDates = Object.keys(history)
    .filter((k) => history[k])
    .sort();

  let maxStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (const dateStr of sortedDates) {
    const currentDate = new Date(dateStr + 'T00:00:00');
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffTime = currentDate - prevDate;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    prevDate = currentDate;
    if (tempStreak > maxStreak) {
      maxStreak = tempStreak;
    }
  }

  // Count total completions
  const totalCompleted = Object.values(history).filter(Boolean).length;

  return {
    current: currentStreak,
    longest: Math.max(maxStreak, currentStreak),
    total: totalCompleted,
  };
}

// Calculate gamification XP & Level
export function calculateGamification(habits = [], pomodoroSessions = 0) {
  let totalCompletions = 0;
  let highestStreak = 0;

  habits.forEach((h) => {
    const streak = calculateStreak(h.history);
    totalCompletions += streak.total;
    if (streak.current > highestStreak) highestStreak = streak.current;
    if (streak.longest > highestStreak) highestStreak = streak.longest;
  });

  // 15 XP per habit completion + 25 XP per pomodoro session + bonus for streaks
  const baseXP = totalCompletions * 15;
  const pomodoroXP = pomodoroSessions * 25;
  const streakBonusXP = Math.floor(highestStreak / 3) * 30;
  const totalXP = baseXP + pomodoroXP + streakBonusXP;

  // Levels threshold
  const levels = [
    { level: 1, title: 'Novice Striver', minXP: 0, maxXP: 200, badge: '🌱' },
    { level: 2, title: 'Habit Explorer', minXP: 200, maxXP: 500, badge: '⚡' },
    { level: 3, title: 'Momentum Builder', minXP: 500, maxXP: 1000, badge: '🔥' },
    { level: 4, title: 'Consistency Master', minXP: 1000, maxXP: 1800, badge: '💎' },
    { level: 5, title: 'Zenith Titan', minXP: 1800, maxXP: 3000, badge: '👑' },
  ];

  let currentLevel = levels[0];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXP >= levels[i].minXP) {
      currentLevel = levels[i];
      break;
    }
  }

  const range = currentLevel.maxXP - currentLevel.minXP;
  const progressInLevel = Math.min(Math.max(totalXP - currentLevel.minXP, 0), range);
  const percentToNext = Math.round((progressInLevel / range) * 100);

  // Badges
  const badges = [
    {
      id: 'first_habit',
      title: 'First Step',
      desc: 'Complete your first habit activity',
      unlocked: totalCompletions >= 1,
      icon: 'CheckCircle2',
      color: '#10b981',
    },
    {
      id: 'streak_3',
      title: 'Streak Starter',
      desc: 'Reach a 3-day continuous streak',
      unlocked: highestStreak >= 3,
      icon: 'Flame',
      color: '#f97316',
    },
    {
      id: 'streak_7',
      title: 'Unstoppable Flame',
      desc: 'Achieve a 7-day solid streak',
      unlocked: highestStreak >= 7,
      icon: 'Zap',
      color: '#8b5cf6',
    },
    {
      id: 'focus_master',
      title: 'Deep Flow',
      desc: 'Complete at least 1 Pomodoro session',
      unlocked: pomodoroSessions >= 1,
      icon: 'Clock',
      color: '#06b6d4',
    },
    {
      id: 'milestone_25',
      title: 'Quarter Century',
      desc: 'Complete 25 total habit checkpoints',
      unlocked: totalCompletions >= 25,
      icon: 'Award',
      color: '#ec4899',
    },
    {
      id: 'century_50',
      title: 'Habit Champion',
      desc: 'Complete 50+ total habit checkpoints',
      unlocked: totalCompletions >= 50,
      icon: 'Trophy',
      color: '#f59e0b',
    },
  ];

  return {
    totalXP,
    currentLevel,
    percentToNext,
    totalCompletions,
    highestStreak,
    badges,
  };
}

// LocalStorage wrapper
const STORAGE_KEY = 'habitflow_pro_data_v1';
const POMODORO_KEY = 'habitflow_pomodoro_v1';
const THEME_KEY = 'habitflow_theme_v1';
const SOUND_KEY = 'habitflow_sound_v1';

export function loadStoredHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return INITIAL_HABITS;
}

export function saveStoredHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (e) {}
}

export function loadPomodoroCount() {
  try {
    const raw = localStorage.getItem(POMODORO_KEY);
    return raw ? parseInt(raw, 10) : 2; // Default to 2 for sample
  } catch (e) {
    return 2;
  }
}

export function savePomodoroCount(count) {
  try {
    localStorage.setItem(POMODORO_KEY, String(count));
  } catch (e) {}
}

export function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'nebula'; // 'nebula' | 'cyber' | 'obsidian' | 'light'
  } catch (e) {
    return 'nebula';
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {}
}

export function loadSoundSetting() {
  try {
    const val = localStorage.getItem(SOUND_KEY);
    return val !== null ? val === 'true' : true;
  } catch (e) {
    return true;
  }
}

export function saveSoundSetting(enabled) {
  try {
    localStorage.setItem(SOUND_KEY, String(enabled));
  } catch (e) {}
}
