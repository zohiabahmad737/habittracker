import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Clock, 
  Target, 
  Palette, 
  Tag 
} from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import { 
  CATEGORIES, 
  TIME_OF_DAY, 
  AVAILABLE_ICONS, 
  COLOR_PRESETS 
} from '../utils/storage';

export default function HabitModal({
  isOpen,
  onClose,
  onSaveHabit,
  habitToEdit = null,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [category, setCategory] = useState('fitness');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const [icon, setIcon] = useState('Dumbbell');
  const [error, setError] = useState('');

  // Populate data when editing
  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title || '');
      setDescription(habitToEdit.description || '');
      setTarget(habitToEdit.target || '');
      setCategory(habitToEdit.category || 'fitness');
      setTimeOfDay(habitToEdit.timeOfDay || 'morning');
      setColor(habitToEdit.color || COLOR_PRESETS[0]);
      setIcon(habitToEdit.icon || 'Dumbbell');
    } else {
      setTitle('');
      setDescription('');
      setTarget('30 mins');
      setCategory('fitness');
      setTimeOfDay('morning');
      setColor(COLOR_PRESETS[0]);
      setIcon('Dumbbell');
    }
    setError('');
  }, [habitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a habit title.');
      return;
    }

    onSaveHabit({
      id: habitToEdit ? habitToEdit.id : `habit-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      target: target.trim(),
      category,
      timeOfDay,
      color,
      icon,
      history: habitToEdit ? habitToEdit.history : {},
      createdAt: habitToEdit ? habitToEdit.createdAt : new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title-box">
            <div 
              className="modal-icon-preview" 
              style={{ backgroundColor: `${color}22`, color: color }}
            >
              <DynamicIcon name={icon} size={22} color={color} />
            </div>
            <div>
              <h3 className="modal-title">
                {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
              </h3>
              <p className="modal-subtitle">
                {habitToEdit ? 'Update habit parameters and styling' : 'Define your daily routine and commit to growth'}
              </p>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error-banner">{error}</div>}

          {/* Habit Title */}
          <div className="form-group">
            <label className="form-label">Habit Name *</label>
            <input
              type="text"
              placeholder="e.g. Read 20 Pages, Morning Run, Meditation"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              className="form-input"
              autoFocus
            />
          </div>

          {/* Description & Target Row */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Goal / Target</label>
              <div className="input-with-icon">
                <Target size={16} className="input-inner-icon" />
                <input
                  type="text"
                  placeholder="e.g. 30 mins, 2 Liters, 10 Pages"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="form-input has-icon"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Time of Day</label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="form-select"
              >
                {TIME_OF_DAY.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Motivation / Description */}
          <div className="form-group">
            <label className="form-label">Motivation / Description</label>
            <input
              type="text"
              placeholder="Why is this habit important to you?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="category-modal-chips">
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  className={`modal-cat-chip ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  <DynamicIcon name={cat.icon} size={14} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Presets */}
          <div className="form-group">
            <label className="form-label">Theme Color</label>
            <div className="color-palette-row">
              {COLOR_PRESETS.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`color-swatch ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  title={`Select color ${c}`}
                >
                  {color === c && <Check size={14} className="color-check-icon" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div className="form-group">
            <label className="form-label">Choose Icon</label>
            <div className="icon-selector-grid">
              {AVAILABLE_ICONS.map((iconName) => (
                <button
                  type="button"
                  key={iconName}
                  className={`icon-grid-item ${icon === iconName ? 'selected' : ''}`}
                  onClick={() => setIcon(iconName)}
                  style={icon === iconName ? { borderColor: color, color: color } : {}}
                  title={iconName}
                >
                  <DynamicIcon name={iconName} size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions-row">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-glow-btn">
              <Sparkles size={16} />
              <span>{habitToEdit ? 'Save Changes' : 'Create Habit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
