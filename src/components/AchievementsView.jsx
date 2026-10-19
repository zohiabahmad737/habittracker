import React from 'react';
import { 
  Trophy, 
  Award, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Zap, 
  Clock 
} from 'lucide-react';
import DynamicIcon from './DynamicIcon';

export default function AchievementsView({ gamification }) {
  const { currentLevel, percentToNext, totalXP, badges } = gamification;

  const tiers = [
    { level: 1, name: 'Novice Striver', xp: '0 - 200 XP', badge: '🌱' },
    { level: 2, name: 'Habit Explorer', xp: '200 - 500 XP', badge: '⚡' },
    { level: 3, name: 'Momentum Builder', xp: '500 - 1000 XP', badge: '🔥' },
    { level: 4, name: 'Consistency Master', xp: '1000 - 1800 XP', badge: '💎' },
    { level: 5, name: 'Zenith Titan', xp: '1800+ XP', badge: '👑' },
  ];

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h3 className="section-title">
          <Trophy size={20} className="section-title-icon" />
          Ranks & Achievements
        </h3>
        <p className="section-desc">
          Gamify your habits. Earn XP with every completion and unlock prestigious badges.
        </p>
      </div>

      {/* Hero Rank Card */}
      <div className="rank-hero-card">
        <div className="rank-hero-left">
          <div className="rank-huge-badge">{currentLevel.badge}</div>
          <div className="rank-info-column">
            <span className="rank-sub-label">Current Mastery Level</span>
            <h3 className="rank-name-title">
              Level {currentLevel.level}: {currentLevel.title}
            </h3>
            <span className="rank-xp-highlight">{totalXP} Total XP Earned</span>
          </div>
        </div>

        <div className="rank-hero-right">
          <div className="rank-progress-header">
            <span>Next Level Progress</span>
            <span className="rank-pct-text">{percentToNext}%</span>
          </div>
          <div className="hero-progress-track">
            <div className="hero-progress-bar" style={{ width: `${percentToNext}%` }}></div>
          </div>
          <span className="hero-progress-note">
            Keep completing daily habits to unlock new ranks!
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <h4 className="badges-grid-title">Unlocked & Milestone Badges</h4>
      <div className="badges-grid">
        {badges.map((badge) => {
          return (
            <div
              key={badge.id}
              className={`badge-card ${badge.unlocked ? 'badge-unlocked' : 'badge-locked'}`}
            >
              <div
                className="badge-icon-box"
                style={
                  badge.unlocked
                    ? { backgroundColor: `${badge.color}22`, color: badge.color, borderColor: `${badge.color}55` }
                    : {}
                }
              >
                {badge.unlocked ? (
                  <DynamicIcon name={badge.icon} size={24} color={badge.color} />
                ) : (
                  <Lock size={20} className="lock-icon" />
                )}
              </div>

              <div className="badge-details">
                <div className="badge-name-row">
                  <h5 className="badge-title">{badge.title}</h5>
                  {badge.unlocked && (
                    <span className="badge-unlocked-chip">
                      <CheckCircle2 size={12} /> Unlocked
                    </span>
                  )}
                </div>
                <p className="badge-desc">{badge.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mastery Tiers Roadmap */}
      <div className="tiers-roadmap-card">
        <h4 className="card-subtitle">Mastery Level Progression</h4>
        <div className="tiers-horizontal-list">
          {tiers.map((tier) => {
            const isPassed = currentLevel.level > tier.level;
            const isCurrent = currentLevel.level === tier.level;

            return (
              <div
                key={tier.level}
                className={`tier-step-item ${isCurrent ? 'tier-current' : ''} ${isPassed ? 'tier-passed' : ''}`}
              >
                <div className="tier-badge-icon">{tier.badge}</div>
                <span className="tier-step-num">Level {tier.level}</span>
                <span className="tier-step-title">{tier.name}</span>
                <span className="tier-step-xp">{tier.xp}</span>
                {isCurrent && <span className="tier-active-badge">Active</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
