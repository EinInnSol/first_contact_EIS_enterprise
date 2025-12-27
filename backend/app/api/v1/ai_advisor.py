"""
AI Strategic Advisor API - LAYER 8 ONLY

Provides AI-powered strategic insights for city administrators.
This is the "killer feature" - natural language interface to system intelligence.

CRITICAL: This endpoint is ONLY accessible to city_admin and city_council roles.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

from app.database import get_db
from app.api.deps import require_city_admin
from app.models.user import User
from app.services.ai_strategic_advisor import AIStrategicAdvisor
from app.config import settings


router = APIRouter(
    prefix="/ai-advisor",
    tags=["AI Strategic Advisor (Layer 8 ONLY)"]
)


# ============================================
# SCHEMAS
# ============================================

class QuestionRequest(BaseModel):
    question: str
    include_context: Optional[bool] = True


class Recommendation(BaseModel):
    title: str
    description: str
    impact: str
    priority: str


class AdvisorResponse(BaseModel):
    answer: str
    key_insights: List[str]
    recommendations: List[Recommendation]
    data_citations: List[str]
    confidence_score: int
    generated_at: str
    model: str
    question: str


class ConversationHistory(BaseModel):
    """For future implementation: multi-turn conversations"""
    conversation_id: str
    messages: List[Dict[str, str]]


# ============================================
# ENDPOINTS
# ============================================

@router.post("/ask", response_model=AdvisorResponse)
async def ask_strategic_question(
    request: QuestionRequest,
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Ask AI Strategic Advisor a question.

    LAYER 8 ONLY - This endpoint gives city administrators AI-powered insights.

    Examples:
    - "Why is MHALA underperforming?"
    - "Which vendor should get the new $5M contract?"
    - "How can we reduce average cost per outcome?"
    - "What would happen if we cut MHALA's contract by 30%?"
    - "Show me geographic areas with no vendor coverage"

    The AI has access to:
    - All client data (aggregated, anonymized)
    - Vendor performance metrics
    - Historical trends
    - Benefit enrollment data
    - Geographic coverage data

    Returns actionable insights and specific recommendations.
    """
    if not request.question or len(request.question.strip()) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question must be at least 5 characters"
        )

    # Initialize AI advisor (GCP Vertex Native)
    advisor = AIStrategicAdvisor()

    # Generate insight with database context
    result = await advisor.get_strategic_insight(
        question=request.question,
        organization_id=user.organization_id,
        db=db
    )

    # Convert to response model
    return AdvisorResponse(
        answer=result["answer"],
        key_insights=result.get("key_insights", []),
        recommendations=[
            Recommendation(**rec) for rec in result.get("recommendations", [])
        ],
        data_citations=result.get("data_citations", []),
        confidence_score=result.get("confidence_score", 50),
        generated_at=result.get("generated_at", datetime.now().isoformat()),
        model=result.get("model", "unknown"),
        question=result["question"]
    )


@router.get("/suggested-questions")
async def get_suggested_questions(
    user: User = Depends(require_city_admin)
):
    """
    Get suggested questions based on common city administrator needs.

    These are pre-defined high-value questions that showcase the AI advisor's capabilities.
    """
    return {
        "categories": [
            {
                "category": "Vendor Performance",
                "questions": [
                    "Which vendor has the best housing rate?",
                    "Why is [vendor name] underperforming?",
                    "Compare all vendor performance metrics",
                    "Which vendors should receive additional funding?"
                ]
            },
            {
                "category": "Cost Optimization",
                "questions": [
                    "How can we reduce overall cost per outcome?",
                    "Which vendor provides best value for money?",
                    "What would we save by reallocating 20% of contracts to top performers?",
                    "Identify cost reduction opportunities"
                ]
            },
            {
                "category": "System Efficiency",
                "questions": [
                    "What are the biggest bottlenecks in our system?",
                    "How can we reduce average days to housing?",
                    "Which clients are at highest risk of not being housed?",
                    "What changes would have the biggest impact on outcomes?"
                ]
            },
            {
                "category": "Geographic Coverage",
                "questions": [
                    "Are there geographic gaps in vendor coverage?",
                    "Which areas have highest need but lowest service coverage?",
                    "Should we add a new vendor in [location]?",
                    "Show me QR scan conversion rates by location"
                ]
            },
            {
                "category": "Contract Decisions",
                "questions": [
                    "Which vendor should get the new $5M contract?",
                    "Should we renew [vendor name]'s contract?",
                    "What performance improvements should we require in contracts?",
                    "How should we structure performance incentives?"
                ]
            }
        ]
    }


@router.get("/context-summary")
async def get_context_summary(
    user: User = Depends(require_city_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a summary of the current system context that the AI advisor uses.

    This helps city administrators understand what data informs AI responses.
    """
    advisor = AIStrategicAdvisor()
    context = await advisor._fetch_context(user.organization_id, db)

    return {
        "organization_id": user.organization_id,
        "data_snapshot": context,
        "last_updated": datetime.now().isoformat(),
        "note": "This is the real-time data the AI advisor uses to answer questions"
    }
