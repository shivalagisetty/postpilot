# Project Specification: AI Social Media Marketing Tool

## 1. Project Overview
Build a React-based web application that acts as an AI social media marketing assistant. The app allows small business owners to onboard with their business details, generate AI-powered social media posts (including content, image suggestions/generation prompts, and hashtags) backed by web search for trending topics, and manage the posting workflow.

---

## 2. Tech Stack & Architecture
- **Frontend Framework:** React (Vite) with Tailwind CSS for styling.
- **Icons & UI Components:** Lucide React for clean modern icons, Shadcn/UI-inspired accessible components (cards, inputs, dropdowns, modals).
- **State Management:** React Context API or Zustand for managing onboarding profile, generated posts history, and app state.
- **AI & Search Integration Layer:** Mockable/Pluggable API service layer (`src/services/aiService.js` and `src/services/searchService.js`) designed to connect with LLM APIs (e.g., OpenAI/Anthropic) and search tools (e.g., Tavily or Google Search API).

---

## 3. Core User Flows & Requirements

### Flow 1: Onboarding / Business Profile Setup
Create a multi-step or card-based onboarding form where users define their brand identity. Store this in persistent state (`localStorage`).
- **Fields to capture:**
  1. **Business Type / Niche:** (e.g., Coffee Shop, Fitness Coach, SaaS)
  2. **Target Audience:** (e.g., Local professionals, Gen-Z fitness enthusiasts)
  3. **Platforms to Post:** Multi-select pills (e.g., Instagram, LinkedIn, Twitter/X, Facebook)
  4. **Brand Tone:** (e.g., Professional, Casual, Witty, Inspirational)

### Flow 2: AI Post Generator & Web Research
A dashboard workspace where users can generate content.
- **Web Search Integration:** Include a feature/button to "Fetch Trending Topics & Inspiration". This simulates querying the web for current trends, viral hooks, or industry news related to the user's business type.
- **Post Generation Controls:**
  - Topic / Goal input (e.g., "Announcing our weekend discount", "Tips for morning routines")
  - Platform selector (adapts length and style automatically—e.g., concise/visual for Instagram, professional/thought-leadership for LinkedIn).
- **Generated Output Breakdown:**
  - **Caption / Content:** The core copy tailored to the platform.
  - **Visual Prompt / Image Idea:** A descriptive prompt for an image generator (or placeholder image card).
  - **Hashtags:** A curated list of relevant, high-reach hashtags.

### Flow 3: Review, Edit & "Post It" Workflow
- **Preview Card:** Show a realistic social media preview card matching the selected platform layout.
- **Inline Editing:** Allow the user to click and edit the generated copy, hashtags, or swap out image ideas.
- **Action Buttons:**
  - "Copy to Clipboard" (with success toast notification).
  - "Schedule / Post" (mock action that saves the post to a "Scheduled/Published History" tab).

---

## 4. Suggested Project Structure
```text
src/
├── components/
│   ├── Navbar.jsx
│   ├── OnboardingModal.jsx (or dedicated view)
│   ├── Dashboard.jsx
│   ├── PostGenerator.jsx
│   ├── PostPreviewCard.jsx
│   └── HistoryTab.jsx
├── context/
│   └── AppContext.jsx (Manages business profile & posts state)
├── services/
│   ├── aiService.js (Handles generation logic & prompt building)
│   └── searchService.js (Handles web search / trend fetching simulation)
├── App.jsx
└── main.jsx
```
