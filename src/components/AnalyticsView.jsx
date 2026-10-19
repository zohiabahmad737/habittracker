import React from 'react';
import { getHeatmapDays, calculateStreak, CATEGORIES } from '../utils/storage';
import DynamicIcon from './DynamicIcon';
import { 
  BarChart3, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  Award,
  Zap
} from 'lucide-react';

export default function AnalyticsView({ habits }) {
  const heatmapDays = getHeatmapDays(42); // 6 weeks

  // Calculate day-by-day intensity
  const totalHabitsCount = habits.length;
  const dayActivityMap = {};

  heatmapDays.forEach((day) => {
    let completedCount = 0;
    habits.forEach((h) => {
      if (h.history?.[day.dateKey]) {
        completedCount++;
      }
    });
    const ratio = totalHabitsCount > 0 ? completedCount / totalHabitsCount : 0;
    dayActivityMap[day.dateKey] = {
      count: completedCount,
      ratio,
    };
  });

  // Category breakdown
  const categoryStats = CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
    const categoryHabits = habits.filter((h) => h.category === cat.id);
    let totalCompletions = 0;
    categoryHabits.forEach((h) => {
      totalCompletions += calculateStreak(h.history).total;
    });
    return {
      ...cat,
      habitCount: categoryHabits.length,
      totalCompletions,
    };
  });

  // Best habit calculation
  let bestHabit = null;
  let maxCompletions = -1;

  habits.forEach((h) => {
    const streak = calculateStreak(h.history);
    if (streak.total > maxCompletions) {
      maxCompletions = streak.total;
      bestHabit = { ...h, streak };
    }
  });

  // Heatmap intensity helper
  const getIntensityClass = (ratio) => {
    if (ratio === 0) return 'heat-0';
    if (ratio <= 0.25) return 'heat-1';
    if (ratio <= 0.5) return 'heat-2';
    if (ratio <= 0.75) return 'heat-3';
    return 'heat-4';
  };

  return (
    <div className="analytics-view-container">
      <div className="analytics-header">
        <h3 className="section-title">
          <BarChart3 size={20} className="section-title-icon" />
          Habit Performance & Heatmap
        </h3>
        <p className="section-desc">
          Gain deep visibility into your discipline patterns, streaks, and category distribution.
        </p>
      </div>

      {/* Heatmap Card */}
      <div className="analytics-card heatmap-card">
        <div className="heatmap-card-header">
          <div className="heatmap-title-row">
            <Calendar size={18} className="text-violet" />
            <h4 className="card-subtitle">42-Day Activity Heatmap</h4>
          </div>
          <div className="heatmap-legend">
            <span className="legend-text">Less</span>
            <div className="heatmap-box heat-0" />
            <div className="heatmap-box heat-1" />
            <div className="heatmap-box heat-2" />
            <div className="heatmap-box heat-3" />
            <div className="heatmap-box heat-4" />
            <span className="legend-text">More</span>
          </div>
        </div>

        <div className="heatmap-grid">
          {heatmapDays.map((day) => {
            const data = dayActivityMap[day.dateKey] || { count: 0, ratio: 0 };
            const intensity = getIntensityClass(data.ratio);

            return (
              <div
                key={day.dateKey}
                className={`heatmap-cell ${intensity} ${day.isToday ? 'heatmap-today' : ''}`}
                title={`${day.dateKey}: ${data.count} / ${totalHabitsCount} habits completed (${Math.round(data.ratio * 100)}%)`}
              />
            );
          })}
        </div>
      </div>

      <div className="analytics-split-grid">
        {/* Best Habit MVP */}
        {bestHabit && (
          <div className="analytics-card mvp-card">
            <div className="mvp-badge">
              <Award size={14} /> Top Performing Habit
            </div>
            <div className="mvp-body">
              <div
                className="mvp-icon"
                style={{
                  backgroundColor: `${bestHabit.color}22`,
                  color: bestHabit.color,
                }}
              >
                <DynamicIcon name={bestHabit.icon} size={28} color={bestHabit.color} />
              </div>
              <div className="mvp-info">
                <h4 className="mvp-title">{bestHabit.title}</h4>
                <p className="mvp-desc">{bestHabit.description || bestHabit.target}</p>
                <div className="mvp-stats-row">
                  <div className="mvp-stat-item">
                    <Flame size={14} className="text-amber" />
                    <span>{bestHabit.streak.current}d Streak</span>
                  </div>
                  <div className="mvp-stat-item">
                    <CheckCircle2 size={14} className="text-emerald" />
                    <span>{bestHabit.streak.total} Total Wins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        <div className="analytics-card categories-card">
          <h4 className="card-subtitle">Category Distribution</h4>
          <div className="category-bars-list">
            {categoryStats.map((cat) => {
              const maxXPVal = Math.max(...categoryStats.map((c) => c.totalCompletions), 1);
              const barPct = Math.round((cat.totalCompletions / maxXPVal) * 100);

              return (
                <div key={cat.id} className="category-bar-row">
                  <div className="cat-bar-header">
                    <span className="cat-bar-name">
                      <DynamicIcon name={cat.icon} size={14} color={cat.color} />
                      {cat.label}
                    </span>
                    <span className="cat-bar-value">{cat.totalCompletions} wins</span>
                  </div>
                  <div className="cat-bar-track">
                    <div
                      className="cat-bar-fill"
                      style={{
                        width: `${barPct}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
