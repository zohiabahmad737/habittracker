import React from 'react';
import { Flame, Trophy, CheckCircle, Target, Sparkles, TrendingUp } from 'lucide-react';

export default function StatsOverview({
  habits,
  currentDateKey,
  gamification,
}) {
  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => !!h.history?.[currentDateKey]).length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  // Motivational quote based on completion
  const getMotivationalQuote = (pct) => {
    if (pct === 100) return { text: "Outstanding! Perfect Day Achieved!", sub: "You're building an unstoppable future." };
    if (pct >= 75) return { text: "Almost at the finish line!", sub: "Just a small push to complete today's goals." };
    if (pct >= 50) return { text: "Over halfway there!", sub: "Great consistency, keep the momentum alive." };
    if (pct > 0) return { text: "Solid start to the day!", sub: "Every small action compounds into greatness." };
    return { text: "Ready to conquer today?", sub: "Check off your first habit and ignite your streak." };
  };

  const motivation = getMotivationalQuote(completionPercentage);

  // Circular progress calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="stats-overview-grid">
      {/* Card 1: Today's Completion Circular Gauge */}
      <div className="stat-card stat-card-featured">
        <div className="stat-circular-wrapper">
          <svg className="stat-circular-svg" width="96" height="96" viewBox="0 0 96 96">
            <circle
              className="stat-circle-bg"
              cx="48"
              cy="48"
              r={radius}
              strokeWidth="8"
            />
            <circle
              className="stat-circle-fill"
              cx="48"
              cy="48"
              r={radius}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="stat-circular-inner">
            <span className="stat-percent-text">{completionPercentage}%</span>
            <span className="stat-ratio-text">{completedToday}/{totalHabits}</span>
          </div>
        </div>

        <div className="stat-content-column">
          <div className="stat-badge-tag">
            <Target size={13} /> Daily Completion
          </div>
          <h3 className="stat-headline">{motivation.text}</h3>
          <p className="stat-subheadline">{motivation.sub}</p>
        </div>
      </div>

      {/* Card 2: Highest Current Streak */}
      <div className="stat-card">
        <div className="stat-icon-glow fire-glow">
          <Flame size={24} className="streak-flame-anim" />
        </div>
        <div className="stat-card-details">
          <span className="stat-metric-label">Best Active Streak</span>
          <div className="stat-metric-row">
            <span className="stat-metric-number">{gamification.highestStreak}</span>
            <span className="stat-metric-unit">Days</span>
          </div>
          <div className="stat-metric-sub">
            <TrendingUp size={12} className="inline-icon text-emerald" />
            <span>Consistency is your superpower</span>
          </div>
        </div>
      </div>

      {/* Card 3: Total Completions */}
      <div className="stat-card">
        <div className="stat-icon-glow trophy-glow">
          <Trophy size={24} />
        </div>
        <div className="stat-card-details">
          <span className="stat-metric-label">Total Habit Wins</span>
          <div className="stat-metric-row">
            <span className="stat-metric-number">{gamification.totalCompletions}</span>
            <span className="stat-metric-unit">Done</span>
          </div>
          <div className="stat-metric-sub">
            <CheckCircle size={12} className="inline-icon text-violet" />
            <span>Recorded checkpoint victories</span>
          </div>
        </div>
      </div>

      {/* Card 4: Level & XP Mastery */}
      <div className="stat-card">
        <div className="stat-icon-glow xp-glow">
          <Sparkles size={24} />
        </div>
        <div className="stat-card-details">
          <span className="stat-metric-label">Level & Rank</span>
          <div className="stat-metric-row">
            <span className="stat-rank-badge">{gamification.currentLevel.badge}</span>
            <span className="stat-rank-title">{gamification.currentLevel.title}</span>
          </div>
          <div className="xp-bar-container">
            <div className="xp-bar-fill" style={{ width: `${gamification.percentToNext}%` }}></div>
          </div>
          <span className="stat-metric-sub">
            {gamification.percentToNext}% to next rank milestone
          </span>
        </div>
      </div>
    </div>
  );
}
