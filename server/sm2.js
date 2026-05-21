/**
 * SM-2 algorithm by Piotr Wozniak, used in Anki and SuperMemo.
 */
function updateCard(card, quality) {
  let { interval, ease_factor, repetitions } = card;
  const today = new Date();
  
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
    // ease_factor stays the same
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease_factor);
    }
    
    repetitions += 1;
    ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    ease_factor = Math.max(1.3, ease_factor); // SM-2 minimum ease factor guard — prevents cards from becoming impossibly frequent
  }
  
  const next_review = new Date(today);
  next_review.setDate(next_review.getDate() + interval);
  
  return {
    interval,
    ease_factor,
    repetitions,
    next_review: next_review.toISOString()
  };
}

module.exports = { updateCard };
