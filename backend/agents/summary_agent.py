from agno.agent import Agent
from agno.models.google import Gemini
from dotenv import load_dotenv
from textwrap import dedent
import os

load_dotenv()

summary_agent = Agent(
    model=Gemini(
        id=os.getenv("GOOGLE_MODEL"),
        api_key=os.getenv("GOOGLE_API_KEY"),
    ),
    description=dedent("""\
        You are a Manim Animation Summarizer. Your goal is to provide a concise,
        high-level running summary of what the current Manim animation does.
        """),
    instructions=dedent("""\
        1.  Analyze the provided Manim Python code.
        2.  If a previous summary is provided, update it to include the new changes while maintaining the overall flow of the animation.
        3.  Keep the summary concise and focused on the final state of the animation (1-4 sentences).
        4.  Focus on the visual elements and the flow of the animation (e.g., "A red circle fades in, transforms into a blue square, and then moves to the right").
        5.  Your response *MUST* be *ONLY* the summary text. No conversational phrases, no markdown.
        6.  Input format: "Previous Summary: {previous_summary}\\nManim Code:\\n{manim_code}"
        """),
    markdown=False,
)
