# AI ELIGIBILITY & PAIRING LOGIC (The "Embedded Detective")

## 1. The Core Philosophy
Standard intake forms (like the HUD 41-Question VI-SPDAT) are passive. They record data but don't *think*.
**First Contact E.I.S.** uses **Embedded Eligibility Detection**. The AI acts as a detective during the intake process, analyzing the 41 answers in real-time to uncover "Hidden Eligibility" that a human caseworker might miss.

## 2. The Agent Architecture (Based on "IHSS Pairing" Model)
The system is divided into three specialized AI sub-agents:

### A. The Intake Agent (The Listener)
*   **Role**: Conducts the 41-Question interview (Voice or Text).
*   **Input**: "HUD Standardized Intakes" (VI-SPDAT, HMIS standard).
*   **Skill**: Detecting nuance.
    *   *User says*: "I sleep in the park."
    *   *AI records*: "Category 1 Homeless."
    *   *AI notes*: "Subject mentioned 'pain in legs' while walking to park -> Potential Disability Flag."

### B. The Classification Agent (The Scorer)
*   **Role**: Real-time scoring of the matrix.
*   **Logic**:
    *   If score < 4: **Diversion** (One-time aid).
    *   If score 4-9: **Rapid Re-Housing** (Temporary Housing + Rental Support).
    *   If score > 10: **Permanent Supportive Housing** (Long-term care).
*   **Reality Check**: As you noted, most users will fall into **Temporary Housing**. The AI optimizes for *this* reality, prioritizing immediate bed stability over "Waitlist Purgatory."

### C. The IHSS Pairing Agent (The Specialist)
*   **Role**: Specifically looks for **In-Home Supportive Services (IHSS)** and other auxiliary benefits.
*   **Trigger**: Analyzes health/disability answers.
*   **Action**: "Subject qualifies for IHSS. Initiating pairing logic."
*   **Output**: Automatically generates the specific appointments needed to secure these benefits (Medical Evaluation, County Worker Interview).

## 3. The Lifecycle Management (The "Roadmap")
Once eligibility is flagged, the AI generates a **Sequential Action Plan**:

1.  **Immediate**: Reserve Temporary Housing (Shelter Bed).
2.  **Day 1-3**: "Stability appointments" auto-scheduled.
    *   *Appointment A*: IHSS Medical Verification.
    *   *Appointment B*: CalFresh/SNAP Application.
3.  **Day 7**: First Case Plan Review.

## 4. Technical Implementation
```python
class IHSSPairingAgent:
    def analyze_intake(self, intake_data):
        # Scan for keywords: "chronic pain", "mobility", "unable to cook"
        if self.detect_disability_indicators(intake_data):
            risk_score = self.calculate_risk(intake_data)
            return self.generate_referral(service="IHSS", urgency=risk_score)
```

---
*Status: Design Pattern Active*
*Source: Technical Whitepaper (User Provided)*
