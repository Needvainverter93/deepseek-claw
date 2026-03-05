#!/usr/bin/env python3
"""
deepseek-claw — main CLI dispatcher.
"""

import typer
from typing import Optional

app = typer.Typer(
    name="deepseek",
    help="DeepSeek model skill for OpenClaw",
    no_args_is_help=True,
)

session_app = typer.Typer(help="Multi-turn session commands")
app.add_typer(session_app, name="session")


# ── Chat & Reasoning ───────────────────────────────────────────────────────────

@app.command("chat")
def chat(
    message: str = typer.Argument(..., help="Message to send"),
    model: str = typer.Option("deepseek-chat", help="Model to use"),
    system: Optional[str] = typer.Option(None, help="System prompt"),
):
    """Chat with DeepSeek-Chat."""
    from scripts.chat import cmd_chat
    cmd_chat(message, model, system)


@app.command("reason")
def reason(
    question: str = typer.Argument(..., help="Question for deep reasoning"),
    show_thinking: bool = typer.Option(True, help="Show reasoning chain"),
):
    """Deep reasoning via DeepSeek-Reasoner (R1)."""
    from scripts.chat import cmd_reason
    cmd_reason(question, show_thinking)


@app.command("code")
def code(
    task: str = typer.Argument(..., help="Coding task description"),
    language: str = typer.Option("python", help="Target programming language"),
):
    """Generate or explain code."""
    from scripts.chat import cmd_code
    cmd_code(task, language)


# ── Session ────────────────────────────────────────────────────────────────────

@session_app.command("start")
def session_start(
    model: str = typer.Option("deepseek-chat", help="Model for this session"),
):
    """Start a new persistent multi-turn session."""
    from scripts.session import cmd_start
    cmd_start(model)


@session_app.command("message")
def session_message(
    text: str = typer.Argument(..., help="Your message"),
):
    """Send a message in the current session."""
    from scripts.session import cmd_message
    cmd_message(text)


@session_app.command("show")
def session_show():
    """Display current session history."""
    from scripts.session import cmd_show
    cmd_show()


@session_app.command("clear")
def session_clear():
    """Clear the current session history."""
    from scripts.session import cmd_clear
    cmd_clear()


# ── Models & Status ────────────────────────────────────────────────────────────

@app.command("models")
def models():
    """List available DeepSeek models."""
    from scripts.models import cmd_models
    cmd_models()


@app.command("status")
def status():
    """Check API status and account balance."""
    from scripts.models import cmd_status
    cmd_status()


# ── Utilities ──────────────────────────────────────────────────────────────────

@app.command("summarize")
def summarize(
    text: str = typer.Argument(..., help="Text to summarize"),
    language: str = typer.Option("same", help="Output language (default: same as input)"),
):
    """Summarize long text intelligently."""
    from scripts.utils import cmd_summarize
    cmd_summarize(text, language)


@app.command("translate")
def translate(
    text: str = typer.Argument(..., help="Text to translate"),
    to: str = typer.Option("English", help="Target language"),
):
    """Translate text to another language."""
    from scripts.utils import cmd_translate
    cmd_translate(text, to)


@app.command("review")
def review(
    code: str = typer.Argument(..., help="Code to review"),
    language: Optional[str] = typer.Option(None, help="Programming language hint"),
):
    """Review code and suggest improvements."""
    from scripts.utils import cmd_review
    cmd_review(code, language)


if __name__ == "__main__":
    app()
