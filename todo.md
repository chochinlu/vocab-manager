# Vocab Manager - TODO

## Scenario Prompts Feature

### Overview
Add scenario prompts to practice mode to help users write sentences from different perspectives.

### Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Required? | No (free mode available) | Don't disrupt existing users |
| Switch method | Manual | Give users full control |
| Track stats per scenario? | No | Keep existing stats structure simple |
| Store scenarios? | No | Simplify architecture |
| Default state | Off | Don't disrupt existing flow |
| Source | Static library | Fast, free, reliable |

---

## Phase 1: Basic Static Scenarios (Priority)

### Step 1: Create Scenario Database
- [ ] Create file: `src/utils/scenarioPrompts.js`
- [ ] Define `SCENARIO_PROMPTS` constant (categorized by part of speech)
  - [ ] verb - 5-8 scenarios
  - [ ] noun - 5-8 scenarios
  - [ ] adjective - 5-8 scenarios
  - [ ] adverb - 5-8 scenarios
  - [ ] phrasal-verb - 5-8 scenarios
  - [ ] phrase - 5-8 scenarios
  - [ ] other - 3-5 scenarios
- [ ] Implement `getRandomScenario(partOfSpeech, excludeId)` function

**Scenario data structure:**
```javascript
{
  id: 'work-process',
  category: 'Workplace Communication',
  prompt: 'Describe how you use this verb at work...',
  difficulty: 'basic' | 'medium'
}
```

### Step 2: Create ScenarioPrompt Component
- [ ] Create file: `src/components/Practice/ScenarioPrompt.jsx`
- [ ] Implement features:
  - [ ] Display current scenario (category + prompt)
  - [ ] "Refresh" button (onRefresh)
  - [ ] "Close" button (onClose)
  - [ ] Difficulty badge
  - [ ] Gradient background (purple-pink)

### Step 3: Integrate into PracticeMode
- [ ] Modify file: `src/components/Practice/PracticeMode.jsx`
- [ ] Add state management:
  - [ ] `showScenario` (boolean) - default false
  - [ ] `currentScenario` (object) - initial random scenario
- [ ] Add features:
  - [ ] `handleRefreshScenario()` - switch to new scenario
  - [ ] "Show scenario prompt" button (dashed border)
  - [ ] Integrate `<ScenarioPrompt />` component
- [ ] UI layout:
  ```
  PracticeStats (existing)
  ↓
  Vocabulary Info (existing)
  ↓
  [Show Scenario Prompt] button (new)
  ↓
  ScenarioPrompt component (new, conditional)
  ↓
  Practice Input (existing)
  ```

### Step 4: Testing & Polish
- [ ] Test scenario switching for all parts of speech
- [ ] Test show/hide scenario functionality
- [ ] Test "refresh" doesn't repeat current scenario
- [ ] UI/UX polish (spacing, colors, animations)

---

## Phase 2: Advanced Features (Optional)

### Option A: AI-Generated Scenarios
- [ ] Backend: Add API endpoint `POST /api/ai/generate-scenario`
- [ ] Frontend: Add service `src/services/scenario.service.js`
- [ ] Implement generation logic:
  - Based on `vocab.tags` and `vocab.context`
  - Cache results to avoid repeated API calls
- [ ] UI: Add "AI Generate" button
- [ ] Cost control:
  - Use Haiku model (cheaper)
  - Cache to localStorage
  - Limit to 3 generations per word

### Option B: Scenario Favorites
- [ ] Allow users to mark favorite scenarios
- [ ] Show favorites first next time

### Option C: Difficulty Adaptation
- [ ] Recommend scenarios based on `proficiencyLevel`
  - beginner → basic only
  - intermediate/advanced → mix basic/medium
  - mastered → prefer medium

### Option D: Multi-word Scenarios
- [ ] Select 2-3 words
- [ ] Generate scenarios requiring all words

---

## File List

### New Files
- `src/utils/scenarioPrompts.js` - Scenario database & utilities
- `src/components/Practice/ScenarioPrompt.jsx` - Scenario prompt UI
- *(Phase 2)* `src/services/scenario.service.js` - AI scenario service

### Modified Files
- `src/components/Practice/PracticeMode.jsx` - Integrate scenario feature

### No Changes Needed
- Data structure (vocab, practiceStats) - unchanged
- Statistics logic - unchanged
- Other components - unchanged

---

## Scenario Categories Reference

### Verbs
- Workplace Communication - describe work processes
- Technical Explanation - explain technical implementation
- Problem Solving - describe solution approach
- Email Writing - use in professional emails
- Presentations - use in presentations

### Nouns
- Concept Definition - explain the term
- Concept Comparison - compare with similar concepts
- Real-world Examples - give concrete examples
- System Architecture - role in architecture
- Data Explanation - support with data

### Adjectives
- Product Reviews - describe product features
- Technical Features - explain technical advantages
- Personal Feelings - express subjective opinions
- Trend Description - describe developments
- Detail Description - precise description

### Phrasal Verbs
- Instructions - explain how to operate
- Debugging - use in debugging context
- Documentation - use in technical docs
- Spoken Language - use in conversations

---

## Expected Benefits

### User Experience
- Clear direction when writing sentences
- Practice same word from multiple angles
- Flexibility: use when needed, hide when not

### Technical Advantages
- Zero database impact (no structure changes)
- Pure frontend feature (Phase 1)
- Low maintenance (static data)

---

## Timeline Estimate

**Phase 1**: 2-3 hours
- Step 1: 30 min (scenario database)
- Step 2: 45 min (ScenarioPrompt component)
- Step 3: 45 min (integrate into PracticeMode)
- Step 4: 30 min (testing & polish)

**Phase 2** (optional):
- AI generation: 3-4 hours
- Other enhancements: 1-2 hours each

---

## Other Future Features

### Background Image Settings UI
- [ ] Theme switcher UI
- [ ] Mode selector UI (daily/fixed/always)
- [ ] Image preview

### Data Import/Export
- [ ] Export to JSON
- [ ] Import from JSON
- [ ] Export to CSV

### Testing
- [ ] Add unit tests (Vitest + React Testing Library)
- [ ] Add E2E tests

### Performance
- [ ] Virtual scrolling for large vocab lists
- [ ] Image lazy loading

---

**Last Updated:** 2025-01-15
