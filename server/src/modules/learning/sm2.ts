export interface SM2Input {
  ease_factor: number;
  interval: number;
  repetitions: number;
  status: string;
}

export interface SM2Output {
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: Date;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

export function calculateSM2(progress: SM2Input, quality: number): SM2Output {
  let { ease_factor, interval, repetitions } = progress;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease_factor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  ease_factor = Math.max(
    1.3,
    ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const next_review = new Date();
  next_review.setDate(next_review.getDate() + interval);

  const status = deriveStatus(repetitions, interval, ease_factor, progress.status);

  return { ease_factor, interval, repetitions, next_review, status };
}

function deriveStatus(
  repetitions: number,
  interval: number,
  ease_factor: number,
  currentStatus: string
): 'new' | 'learning' | 'review' | 'mastered' {
  if (currentStatus === 'new' && repetitions === 0) return 'new';
  if (repetitions >= 5 && ease_factor >= 2.0) return 'mastered';
  if (interval > 6) return 'review';
  return 'learning';
}

export function mapAnswerTypeToQuality(answerType: string): number {
  switch (answerType) {
    case 'again': return 0;
    case 'hard': return 2;
    case 'good': return 4;
    case 'easy': return 5;
    default: return 0;
  }
}
