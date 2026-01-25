# AlterEgo: Agentic Personal Branding Coach 🧬

> **Hackathon Submission** - Commit To Change Hackathon 2026
> **Category**: Productivity & Work Habits
> **Tech Stack**: Next.js, Groq (Llama 3.3 70B), Opik AI Observability

## 🤖 The Solution

**AlterEgo** is not just a text generator. It is an **Agentic Workflow** that acts as your professional Ghostwriter. It clones your writing style and uses a multi-step agentic process to craft viral content.

### The Agentic Pipeline
1.  **Researcher Agent**: Scrapes viral structures and analyzes your past posts to build a "Style DNA".
2.  **Drafting Agent**: Generates 3 Hook variations and 2 Body options based on viral frameworks.
3.  **Self-Correction Agent (The "Critic")**: Before showing you the result, this agent reads the draft, checks it against your "Tone" settings (0-10 Scale), and rewrites it to ensure maximum impact. **(Visible in Opik Traces)**.

## 🏆 Hackathon Integration: Opik & Traceability

We built AlterEgo with an **"Observability First"** mindset using **Opik**.

### 1. Full Traceability
Every AI thought process is tracked. You can see exactly how the **Self_Correction_Agent** modifies the text by viewing the traces in the Opik Dashboard.

### 2. Dataset Evaluation (LLM-as-a-Judge)
We include a robust evaluation script to prove our AI's quality.
Run it locally to see the agents in action:

```bash
npm run evaluate
```

This script runs a dataset of topics through the agents and scores them based on:
*   **Virality Score**: Does the hook use strong psychological triggers?
*   **Style Adherence**: Does the body match the requested length and tone?

## 🚀 Quick Start

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/Nathasan1410/AlterEgo.git
    cd AlterEgo
    npm install
    ```

2.  **Setup Keys (.env)**:
    ```env
    GROQ_API_KEY=...
    OPIK_API_KEY=...
    ```

3.  **Run Dev**:
    ```bash
    npm run dev
    ```

4.  **Run Evaluation (For Judges)**:
    ```bash
    npm run evaluate
    ```

## 🧠 Why Opik?

Without Opik, our "Self-Correction Agent" would just be a black box. With Opik, we can **prove** that the agent is actively fixing grammar, adjusting tone, and ensuring style consistency in real-time.

---
*Built with ❤️ for the Future of Work.*
