// LuckLink Omamori Data
// Digital good luck charms with real utility

export const OMAMORI_TYPES = {
  MONEY: {
    id: 'money',
    name: 'Money Omamori',
    emoji: '💰',
    color: '#FFD700',
    description: 'Attracts wealth and savings',
    price: 2.99,
    features: [
      'Price drop alerts on wishlisted items',
      'Coupon finder activation',
      'Blocks impulse buy sites after midnight',
      'Lucky number generator for lottery'
    ],
    blessing: 'May fortune flow to you like a river'
  },
  
  LOVE: {
    id: 'love',
    name: 'Love Omamori',
    emoji: '💕',
    color: '#FF69B4',
    description: 'Strengthens relationships',
    price: 2.99,
    features: [
      'Anniversary & important date reminders',
      'Gift idea collector from browsing',
      'Relationship milestone tracker',
      'Daily love fortune reading'
    ],
    blessing: 'May your heart find its perfect match'
  },
  
  HEALTH: {
    id: 'health',
    name: 'Health Omamori',
    emoji: '🍃',
    color: '#90EE90',
    description: 'Protects physical and mental wellness',
    price: 2.99,
    features: [
      'Blocks junk food delivery after 9pm',
      'Screen time wellness reminders',
      'Meditation moment prompts',
      'Healthy recipe suggestions'
    ],
    blessing: 'May your body and mind flourish'
  },
  
  SUCCESS: {
    id: 'success',
    name: 'Success Omamori',
    emoji: '🎯',
    color: '#4169E1',
    description: 'Guides you toward your goals',
    price: 2.99,
    features: [
      'Motivational quotes on procrastination sites',
      'Focus mode for deep work',
      'Achievement celebration animations',
      'Lucky timing for important emails'
    ],
    blessing: 'May success follow your every step'
  },
  
  PROTECTION: {
    id: 'protection',
    name: 'Protection Omamori',
    emoji: '🛡️',
    color: '#8B008B',
    description: 'Shields from digital harm',
    price: 2.99,
    features: [
      'Scam website warnings',
      'Phishing email detection',
      'Privacy protection alerts',
      'Bad vibe blocker for toxic sites'
    ],
    blessing: 'May you be safe from all harm'
  },
  
  STUDY: {
    id: 'study',
    name: 'Study Omamori',
    emoji: '📚',
    color: '#FF8C00',
    description: 'Enhances learning and focus',
    price: 2.99,
    features: [
      'Study timer with lucky intervals',
      'Distraction site blocker during study',
      'Memory enhancement tips',
      'Exam day good luck ritual'
    ],
    blessing: 'May knowledge flow to you easily'
  }
};

// Bundle deal
export const BUNDLES = {
  COMPLETE: {
    name: 'Complete Protection Bundle',
    charms: ['money', 'love', 'health', 'success', 'protection', 'study'],
    price: 9.99,
    savings: 7.95,
    description: 'All 6 Omamori for complete life protection'
  },
  ESSENTIAL: {
    name: 'Essential Trinity',
    charms: ['money', 'health', 'love'],
    price: 6.99,
    savings: 1.98,
    description: 'The 3 most important life aspects'
  }
};

// Omamori lifecycle (they expire after 1 year like real ones)
export const LIFECYCLE = {
  duration: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
  warningDays: 30, // Warn 30 days before expiry
  renewalDiscount: 0.5 // 50% off renewal
};

// Special events when Omamori activate
export const ACTIVATION_MESSAGES = {
  money: [
    "Your Money Omamori is glowing! Check for deals.",
    "Fortune smiles upon you! A saving opportunity awaits.",
    "The spirit of wealth has noticed your desire."
  ],
  love: [
    "Your Love Omamori pulses warmly! Don't forget your special someone.",
    "The threads of fate are moving. Reach out to someone you care about.",
    "Love energy surrounds you today."
  ],
  health: [
    "Your Health Omamori whispers: Your body needs rest.",
    "The spirit of wellness reminds you to breathe deeply.",
    "Time to nourish your temple."
  ],
  success: [
    "Your Success Omamori shimmers! Push forward with confidence.",
    "The path to achievement is clear. Take action now.",
    "Victory awaits those who persist."
  ],
  protection: [
    "Your Protection Omamori shields you from danger!",
    "Caution: Negative energy detected. Proceed carefully.",
    "You are protected. Trust your instincts."
  ],
  study: [
    "Your Study Omamori glows with wisdom! Perfect time to learn.",
    "Knowledge seeks you. Open your mind.",
    "The spirits of scholars guide your understanding."
  ]
};