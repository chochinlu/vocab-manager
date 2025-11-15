/**
 * Scenario Prompts for Vocabulary Practice
 * Provides contextual prompts to help users write sentences
 */

/**
 * Scenario prompt data structure:
 * {
 *   id: string - unique identifier
 *   category: string - category with emoji
 *   prompt: string - detailed scenario description
 *   difficulty: 'basic' | 'medium' - difficulty level
 * }
 */

export const SCENARIO_PROMPTS = {
  verb: [
    {
      id: 'work-process',
      category: '💼 Workplace Communication',
      prompt: 'Describe how you use this verb in your daily work routine or in a specific project task.',
      difficulty: 'basic'
    },
    {
      id: 'tech-explanation',
      category: '💻 Technical Explanation',
      prompt: 'Explain how this action is performed in software development or technical implementation.',
      difficulty: 'basic'
    },
    {
      id: 'problem-solving',
      category: '🔧 Problem Solving',
      prompt: 'Describe how you would use this verb to solve a specific technical problem or challenge.',
      difficulty: 'medium'
    },
    {
      id: 'email-writing',
      category: '📧 Professional Email',
      prompt: 'Write a sentence using this verb as if you were composing a professional email to a colleague.',
      difficulty: 'basic'
    },
    {
      id: 'presentation',
      category: '🎤 Presentation',
      prompt: 'Use this verb in a sentence you might say during a technical presentation or demo.',
      difficulty: 'medium'
    },
    {
      id: 'documentation',
      category: '📝 Documentation',
      prompt: 'Write a sentence using this verb as it might appear in technical documentation or a README file.',
      difficulty: 'basic'
    },
    {
      id: 'code-review',
      category: '👀 Code Review',
      prompt: 'Use this verb in a sentence you might write when reviewing someone\'s code or pull request.',
      difficulty: 'medium'
    },
    {
      id: 'learning-experience',
      category: '📚 Learning Experience',
      prompt: 'Describe a past experience where you learned to use this verb in a technical context.',
      difficulty: 'basic'
    }
  ],

  noun: [
    {
      id: 'concept-definition',
      category: '📖 Concept Definition',
      prompt: 'Define or explain this noun as if teaching it to someone unfamiliar with the term.',
      difficulty: 'basic'
    },
    {
      id: 'concept-comparison',
      category: '🔄 Comparison',
      prompt: 'Compare this noun with a similar concept, highlighting the differences.',
      difficulty: 'medium'
    },
    {
      id: 'real-example',
      category: '💡 Real-World Example',
      prompt: 'Give a concrete example of this noun from your work or a project you\'ve seen.',
      difficulty: 'basic'
    },
    {
      id: 'system-architecture',
      category: '🏗️ System Architecture',
      prompt: 'Describe the role of this noun in a software system or technical architecture.',
      difficulty: 'medium'
    },
    {
      id: 'data-explanation',
      category: '📊 Data & Metrics',
      prompt: 'Use this noun in a sentence that involves data, statistics, or measurable outcomes.',
      difficulty: 'basic'
    },
    {
      id: 'team-discussion',
      category: '👥 Team Discussion',
      prompt: 'Use this noun in a sentence you might say during a team meeting or brainstorming session.',
      difficulty: 'basic'
    },
    {
      id: 'technical-challenge',
      category: '⚡ Technical Challenge',
      prompt: 'Describe a challenge or limitation related to this noun in technical work.',
      difficulty: 'medium'
    },
    {
      id: 'best-practice',
      category: '✨ Best Practice',
      prompt: 'Mention this noun in the context of a best practice or recommendation.',
      difficulty: 'basic'
    }
  ],

  adjective: [
    {
      id: 'product-review',
      category: '⭐ Product Review',
      prompt: 'Use this adjective to describe a product, tool, or technology you\'ve used.',
      difficulty: 'basic'
    },
    {
      id: 'technical-feature',
      category: '🎯 Technical Feature',
      prompt: 'Describe a technical feature or characteristic using this adjective.',
      difficulty: 'basic'
    },
    {
      id: 'personal-opinion',
      category: '💬 Personal Opinion',
      prompt: 'Express your subjective opinion about something technical using this adjective.',
      difficulty: 'basic'
    },
    {
      id: 'trend-description',
      category: '📈 Trend & Development',
      prompt: 'Use this adjective to describe a trend or development in technology.',
      difficulty: 'medium'
    },
    {
      id: 'detail-description',
      category: '🔍 Detailed Description',
      prompt: 'Provide a precise, detailed description of something using this adjective.',
      difficulty: 'medium'
    },
    {
      id: 'comparison-quality',
      category: '⚖️ Quality Comparison',
      prompt: 'Compare two things using this adjective to highlight their qualities.',
      difficulty: 'medium'
    },
    {
      id: 'user-experience',
      category: '👤 User Experience',
      prompt: 'Describe a user experience or interface using this adjective.',
      difficulty: 'basic'
    },
    {
      id: 'performance',
      category: '⚡ Performance',
      prompt: 'Use this adjective to describe the performance or efficiency of a system.',
      difficulty: 'basic'
    }
  ],

  adverb: [
    {
      id: 'method-description',
      category: '🔧 Method Description',
      prompt: 'Describe how a technical process or method is performed using this adverb.',
      difficulty: 'basic'
    },
    {
      id: 'frequency',
      category: '⏰ Frequency',
      prompt: 'Use this adverb to describe how often something happens in your work.',
      difficulty: 'basic'
    },
    {
      id: 'manner',
      category: '✨ Manner',
      prompt: 'Describe the manner or way something is done using this adverb.',
      difficulty: 'basic'
    },
    {
      id: 'degree',
      category: '📊 Degree/Extent',
      prompt: 'Use this adverb to express the degree or extent of something.',
      difficulty: 'basic'
    },
    {
      id: 'workflow',
      category: '🔄 Workflow',
      prompt: 'Describe a step in your workflow or process using this adverb.',
      difficulty: 'medium'
    }
  ],

  'phrasal-verb': [
    {
      id: 'operation',
      category: '🔄 Operation',
      prompt: 'Explain how to perform a specific operation or action using this phrasal verb.',
      difficulty: 'basic'
    },
    {
      id: 'debugging',
      category: '🐛 Debugging',
      prompt: 'Describe a debugging or troubleshooting situation using this phrasal verb.',
      difficulty: 'medium'
    },
    {
      id: 'tech-docs',
      category: '📝 Technical Writing',
      prompt: 'Use this phrasal verb in a sentence that might appear in technical documentation.',
      difficulty: 'basic'
    },
    {
      id: 'casual-conversation',
      category: '💡 Casual Conversation',
      prompt: 'Use this phrasal verb in a casual conversation with a colleague about work.',
      difficulty: 'basic'
    },
    {
      id: 'project-management',
      category: '📋 Project Management',
      prompt: 'Describe a project management task or situation using this phrasal verb.',
      difficulty: 'medium'
    },
    {
      id: 'code-action',
      category: '💻 Code Action',
      prompt: 'Describe an action you take when writing or reviewing code using this phrasal verb.',
      difficulty: 'basic'
    }
  ],

  phrase: [
    {
      id: 'context-usage',
      category: '💬 Contextual Usage',
      prompt: 'Use this phrase in a natural context from your work or technical discussion.',
      difficulty: 'basic'
    },
    {
      id: 'explanation',
      category: '📖 Explanation',
      prompt: 'Explain when and why you would use this phrase.',
      difficulty: 'basic'
    },
    {
      id: 'practical-example',
      category: '💡 Practical Example',
      prompt: 'Give a practical example of using this phrase in a real work situation.',
      difficulty: 'basic'
    },
    {
      id: 'professional-setting',
      category: '💼 Professional Setting',
      prompt: 'Use this phrase in a professional or formal context.',
      difficulty: 'medium'
    },
    {
      id: 'informal-setting',
      category: '🗣️ Informal Setting',
      prompt: 'Use this phrase in an informal conversation with teammates.',
      difficulty: 'basic'
    }
  ],

  other: [
    {
      id: 'general-usage',
      category: '📝 General Usage',
      prompt: 'Write a sentence using this word in a context that demonstrates its meaning.',
      difficulty: 'basic'
    },
    {
      id: 'technical-context',
      category: '💻 Technical Context',
      prompt: 'Use this word in a technical or professional context.',
      difficulty: 'basic'
    },
    {
      id: 'real-situation',
      category: '🌟 Real Situation',
      prompt: 'Describe a real situation where you might use this word.',
      difficulty: 'basic'
    }
  ]
};

/**
 * Get a random scenario for a given part of speech
 * @param {string} partOfSpeech - Part of speech (verb, noun, adjective, etc.)
 * @param {string} excludeId - Optional scenario ID to exclude (avoid repeating)
 * @returns {Object} Random scenario object
 */
export const getRandomScenario = (partOfSpeech, excludeId = null) => {
  // Get scenarios for this part of speech, fallback to 'other' if not found
  const scenarios = SCENARIO_PROMPTS[partOfSpeech] || SCENARIO_PROMPTS.other;

  // Filter out the excluded scenario
  const availableScenarios = excludeId
    ? scenarios.filter(s => s.id !== excludeId)
    : scenarios;

  // If all scenarios are excluded, return all scenarios
  const finalScenarios = availableScenarios.length > 0 ? availableScenarios : scenarios;

  // Return a random scenario
  const randomIndex = Math.floor(Math.random() * finalScenarios.length);
  return finalScenarios[randomIndex];
};

/**
 * Get all scenarios for a specific part of speech
 * @param {string} partOfSpeech - Part of speech
 * @returns {Array} Array of scenario objects
 */
export const getScenariosByPOS = (partOfSpeech) => {
  return SCENARIO_PROMPTS[partOfSpeech] || SCENARIO_PROMPTS.other;
};

/**
 * Get total number of scenarios for a part of speech
 * @param {string} partOfSpeech - Part of speech
 * @returns {number} Number of scenarios
 */
export const getScenarioCount = (partOfSpeech) => {
  const scenarios = SCENARIO_PROMPTS[partOfSpeech] || SCENARIO_PROMPTS.other;
  return scenarios.length;
};
