import React from 'react';
import HabitCard from './HabitCard';
import DynamicIcon from './DynamicIcon';
import { CATEGORIES, TIME_OF_DAY } from '../utils/storage';
import { Sparkles, Plus, SearchX } from 'lucide-react';

export default function HabitList({
  habits,
  currentDateKey,
  selectedCategory,
  setSelectedCategory,
  selectedTimeOfDay,
  setSelectedTimeOfDay,
  searchQuery,
  onToggleComplete,
  onToggleDay,
  onEditHabit,
  onDeleteHabit,
  onStartTimer,
  onOpenAddModal,
}) {
  // Filter logic
  const filteredHabits = habits.filter((habit) => {
    // Category match
    const matchesCategory =
      selectedCategory === 'all' || habit.category === selectedCategory;

    // Time of day match
    const matchesTime =
      selectedTimeOfDay === 'all' ||
      habit.timeOfDay === selectedTimeOfDay ||
      habit.timeOfDay === 'anytime';

    // Search query match
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      habit.title.toLowerCase().includes(query) ||
      (habit.description && habit.description.toLowerCase().includes(query)) ||
      (habit.target && habit.target.toLowerCase().includes(query)) ||
      habit.category.toLowerCase().includes(query);

    return matchesCategory && matchesTime && matchesSearch;
  });

  return (
    <div className="habit-list-container">
      {/* Category Pills Bar */}
      <div className="filter-controls-bar">
        <div className="category-scroll-group">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? habits.length
                : habits.filter((h) => h.category === cat.id).length;

            return (
              <button
                key={cat.id}
                className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <DynamicIcon name={cat.icon} size={15} />
                <span>{cat.label}</span>
                <span className="category-chip-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Time of Day Filter Selector */}
        <div className="time-filter-group">
          <button
            className={`time-chip ${selectedTimeOfDay === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTimeOfDay('all')}
          >
            All Day
          </button>
          {TIME_OF_DAY.filter((t) => t.id !== 'anytime').map((tod) => (
            <button
              key={tod.id}
              className={`time-chip ${selectedTimeOfDay === tod.id ? 'active' : ''}`}
              onClick={() => setSelectedTimeOfDay(tod.id)}
            >
              {tod.label}
            </button>
          ))}
        </div>
      </div>

      {/* Habits Count Header */}
      <div className="habit-list-header">
        <span className="results-count-text">
          Showing <strong>{filteredHabits.length}</strong> of {habits.length} habits
        </span>
      </div>

      {/* Habit Cards Grid */}
      {filteredHabits.length > 0 ? (
        <div className="habit-cards-grid">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              currentDateKey={currentDateKey}
              onToggleComplete={onToggleComplete}
              onToggleDay={onToggleDay}
              onEditHabit={onEditHabit}
              onDeleteHabit={onDeleteHabit}
              onStartTimer={onStartTimer}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="empty-state-box">
          <div className="empty-state-icon-glow">
            {searchQuery ? <SearchX size={36} /> : <Sparkles size={36} />}
          </div>
          <h3 className="empty-state-title">
            {searchQuery ? 'No habits found matching your search' : 'No habits in this filter'}
          </h3>
          <p className="empty-state-desc">
            {searchQuery
              ? `We couldn't find anything matching "${searchQuery}". Try different keywords or clear the filter.`
              : 'Start your journey towards daily mastery by creating a new healthy habit!'}
          </p>
          <button className="primary-glow-btn" onClick={onOpenAddModal}>
            <Plus size={18} />
            <span>Create New Habit</span>
          </button>
        </div>
      )}
    </div>
  );
}
