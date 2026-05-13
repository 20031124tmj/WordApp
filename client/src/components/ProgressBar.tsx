import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 14, color: '#666' }}>{current} / {total}</span>
        <span style={{ fontSize: 14, color: '#6c63ff', fontWeight: 600 }}>{percent}%</span>
      </div>
      <div style={{ width: '100%', height: 8, backgroundColor: '#eee', borderRadius: 4 }}>
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            backgroundColor: '#6c63ff',
            borderRadius: 4,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
