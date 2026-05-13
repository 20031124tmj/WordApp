import React from 'react';

interface RatingButtonsProps {
  onRate: (answerType: 'again' | 'hard' | 'good' | 'easy') => void;
  disabled?: boolean;
}

const buttons = [
  { type: 'again' as const, label: '不认识', color: '#e74c3c', desc: '< 1分钟' },
  { type: 'hard' as const, label: '模糊', color: '#f39c12', desc: '< 6天' },
  { type: 'good' as const, label: '记得', color: '#2ecc71', desc: '< 1月' },
  { type: 'easy' as const, label: '很熟', color: '#6c63ff', desc: '< 4月' },
];

const RatingButtons: React.FC<RatingButtonsProps> = ({ onRate, disabled }) => {
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
      {buttons.map((btn) => (
        <button
          key={btn.type}
          onClick={() => onRate(btn.type)}
          disabled={disabled}
          style={{
            padding: '12px 20px',
            borderRadius: 12,
            border: `2px solid ${btn.color}`,
            backgroundColor: 'transparent',
            color: btn.color,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            minWidth: 80,
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 16 }}>{btn.label}</span>
          <span style={{ fontSize: 12 }}>{btn.desc}</span>
        </button>
      ))}
    </div>
  );
};

export default RatingButtons;
