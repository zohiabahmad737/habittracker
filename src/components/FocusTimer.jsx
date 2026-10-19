import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  CheckCircle, 
  Coffee, 
  Zap, 
  Sparkles,
  Flame
} from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import { soundFX } from '../utils/audio';
import { fireConfetti } from '../utils/confetti';

const MODES = [
  { id: 'focus_25', label: '25m Focus', minutes: 25, icon: 'Zap' },
  { id: 'flow_45', label: '45m Deep Flow', minutes: 45, icon: 'Flame' },
  { id: 'break_5', label: '5m Short Break', minutes: 5, icon: 'Coffee' },
  { id: 'break_15', label: '15m Long Break', minutes: 15, icon: 'Sparkles' },
];

export default function FocusTimer({
  habits,
  activeHabitId,
  setActiveHabitId,
  onSessionComplete,
}) {
  const [selectedMode, setSelectedMode] = useState(MODES[0]);
  const [timeLeft, setTimeLeft] = useState(MODES[0].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  const selectedHabit = habits.find((h) => h.id === activeHabitId) || habits[0];
  const timerRef = useRef(null);

  // Set initial time on mode change
  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    setIsRunning(false);
    setTimeLeft(mode.minutes * 60);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            soundFX.playTimerDone();
            fireConfetti();
            if (onSessionComplete) {
              onSessionComplete(selectedHabit?.id);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, selectedHabit, onSessionComplete]);

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedMode.minutes * 60);
    }
    soundFX.playToggle(!isRunning);
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedMode.minutes * 60);
  };

  // Format mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Circular progress calculations
  const totalSeconds = selectedMode.minutes * 60;
  const progressRatio = (totalSeconds - timeLeft) / totalSeconds;
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="focus-timer-container">
      <div className="timer-header">
        <h3 className="section-title">
          <Timer size={20} className="section-title-icon" />
          Focus Sprint & Pomodoro
        </h3>
        <p className="section-desc">
          Lock in your concentration with timed sessions dedicated to your habits.
        </p>
      </div>

      <div className="timer-glass-card">
        {/* Habit Selector for Timer */}
        <div className="timer-habit-picker">
          <label className="timer-picker-label">Link Session to Habit:</label>
          <div className="habit-select-pills">
            {habits.map((h) => (
              <button
                key={h.id}
                className={`timer-habit-chip ${selectedHabit?.id === h.id ? 'active' : ''}`}
                onClick={() => setActiveHabitId(h.id)}
                style={
                  selectedHabit?.id === h.id
                    ? { borderColor: h.color, color: h.color, backgroundColor: `${h.color}18` }
                    : {}
                }
              >
                <DynamicIcon name={h.icon} size={14} color={h.color} />
                <span>{h.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="timer-mode-buttons">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              className={`timer-mode-btn ${selectedMode.id === mode.id ? 'active' : ''}`}
              onClick={() => handleSelectMode(mode)}
            >
              <DynamicIcon name={mode.icon} size={15} />
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Circular Countdown Display */}
        <div className="timer-dial-wrapper">
          <svg className="timer-svg" width="250" height="250" viewBox="0 0 250 250">
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <circle
              className="timer-track"
              cx="125"
              cy="125"
              r={radius}
              strokeWidth="10"
            />
            <circle
              className="timer-progress"
              cx="125"
              cy="125"
              r={radius}
              strokeWidth="10"
              stroke="url(#timerGradient)"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          <div className="timer-center-content">
            <span className="timer-time-string">{timeFormatted}</span>
            <span className="timer-mode-caption">
              {isRunning ? 'Flowing in Focus...' : timeLeft === 0 ? 'Session Complete! 🎉' : 'Ready'}
            </span>
            {selectedHabit && (
              <span className="timer-habit-name-tag">
                🎯 {selectedHabit.title}
              </span>
            )}
          </div>
        </div>

        {/* Timer Controls */}
        <div className="timer-controls-row">
          <button
            className={`timer-main-play-btn ${isRunning ? 'running' : ''}`}
            onClick={toggleTimer}
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} className="play-icon-offset" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            className="timer-reset-btn"
            onClick={handleReset}
            title="Reset Timer"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="timer-reward-notice">
          <Sparkles size={14} className="text-amber" />
          <span>Each completed focus session earns <strong>+25 XP</strong> towards your next mastery rank!</span>
        </div>
      </div>
    </div>
  );
}
