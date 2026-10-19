import React from 'react';
import { getPastDays, calculateStreak } from '../utils/storage';
import DynamicIcon from './DynamicIcon';
import { Check, Flame, Calendar, Award } from 'lucide-react';

export default function WeeklyMatrix({
  habits,
  onToggleDay,
  onOpenAddModal,
}) {
  const days = getPastDays(7, new Date());

  // Calculate day-by-day stats
  const dayStats = days.map((day) => {
    const total = habits.length;
    const completed = habits.filter((h) => !!h.history?.[day.dateKey]).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      ...day,
      completed,
      total,
      pct,
    };
  });

  return (
    <div className="weekly-matrix-container">
      <div className="matrix-header-box">
        <div>
          <h3 className="section-title">
            <Calendar size={20} className="section-title-icon" />
            7-Day Consistency Matrix
          </h3>
          <p className="section-desc">
            Monitor your daily performance and check off missed habits across the past week.
          </p>
        </div>

        {/* Weekly Completion Rate */}
        <div className="weekly-summary-pill">
          <Award size={18} className="text-violet" />
          <span>
            Weekly Avg:{' '}
            <strong>
              {Math.round(
                dayStats.reduce((acc, curr) => acc + curr.pct, 0) / (dayStats.length || 1)
              )}
              %
            </strong>
          </span>
        </div>
      </div>

      <div className="matrix-table-card">
        <div className="matrix-table-wrapper">
          <table className="matrix-table">
            <thead>
              <tr>
                <th className="th-habit-name">Habit</th>
                <th className="th-streak">Streak</th>
                {dayStats.map((d) => (
                  <th key={d.dateKey} className={`th-day ${d.isToday ? 'th-today' : ''}`}>
                    <div className="th-day-wrapper">
                      <span className="th-day-name">{d.dayName}</span>
                      <span className="th-day-number">{d.dayNumber}</span>
                      <span className="th-day-pct">{d.pct}%</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => {
                const streak = calculateStreak(habit.history);

                return (
                  <tr key={habit.id} className="matrix-row">
                    <td className="td-habit-info">
                      <div className="habit-row-box">
                        <div 
                          className="matrix-icon-badge"
                          style={{ 
                            backgroundColor: `${habit.color}22`,
                            color: habit.color 
                          }}
                        >
                          <DynamicIcon name={habit.icon} size={16} color={habit.color} />
                        </div>
                        <div className="matrix-title-column">
                          <span className="matrix-habit-title">{habit.title}</span>
                          <span className="matrix-habit-target">{habit.target || habit.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="td-streak">
                      <div className="matrix-streak-pill" title={`${streak.current} day current streak`}>
                        <Flame size={12} className={streak.current > 0 ? 'text-amber' : 'text-muted'} />
                        <span>{streak.current}d</span>
                      </div>
                    </td>

                    {days.map((day) => {
                      const isDone = !!habit.history?.[day.dateKey];

                      return (
                        <td 
                          key={day.dateKey} 
                          className={`td-check ${day.isToday ? 'td-today-cell' : ''}`}
                        >
                          <button
                            className={`matrix-check-btn ${isDone ? 'checked' : ''}`}
                            onClick={() => onToggleDay(habit.id, day.dateKey)}
                            title={`${habit.title} on ${day.dayName} ${day.dayNumber}: Click to toggle`}
                            style={isDone ? { backgroundColor: habit.color } : {}}
                          >
                            {isDone && <Check size={14} strokeWidth={3} />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
