"""
DeepSeek API client.
DeepSeek's API is OpenAI-compatible, so we use the openai SDK pointed at
the DeepSeek base URL.
"""

from __future__ import annotations

import os
from typing import Iterator

from openai import OpenAI

DEEPSEEK_BASE_URL = "https://api.deepseek.com"

MODELS = {
    "chat":     "deepseek-chat",
    "reasoner": "deepseek-reasoner",
    "coder":    "deepseek-chat",   # deepseek-chat handles code well
}


class DeepSeekClient:
    def __init__(
        self,
        api_key: str | None = None,
        base_url: str | None = None,
        default_model: str | None = None,
        max_tokens: int | None = None,
    ):
        self.api_key = api_key or os.environ.get("DEEPSEEK_API_KEY", "")
        if not self.api_key:
            raise EnvironmentError(
                "DEEPSEEK_API_KEY is not set. "
                "Get your key at https://platform.deepseek.com/api_keys"
            )
        self.base_url = (
            base_url
            or os.environ.get("DEEPSEEK_BASE_URL", DEEPSEEK_BASE_URL)
        )
        self.default_model = (
            default_model
            or os.environ.get("DEEPSEEK_DEFAULT_MODEL", "deepseek-chat")
        )
        self.max_tokens = int(
            max_tokens
            or os.environ.get("DEEPSEEK_MAX_TOKENS", "4096")
        )
        self._client = OpenAI(
            api_key=self.api_key,
            base_url=self.base_url,
        )

    # ── Core completion ───────────────────────────────────────────────────────

    def complete(
        self,
        messages: list[dict],
        model: str | None = None,
        stream: bool = False,
        temperature: float = 1.0,
        system: str | None = None,
    ) -> str:
        msgs = []
        if system:
            msgs.append({"role": "system", "content": system})
        msgs.extend(messages)

        resp = self._client.chat.completions.create(
            model=model or self.default_model,
            messages=msgs,
            max_tokens=self.max_tokens,
            temperature=temperature,
            stream=False,
        )
        return resp.choices[0].message.content or ""

    def complete_with_reasoning(
        self,
        messages: list[dict],
        system: str | None = None,
    ) -> tuple[str, str]:
        """
        Returns (reasoning_content, final_answer) for deepseek-reasoner.
        """
        msgs = []
        if system:
            msgs.append({"role": "system", "content": system})
        msgs.extend(messages)

        resp = self._client.chat.completions.create(
            model="deepseek-reasoner",
            messages=msgs,
            max_tokens=self.max_tokens,
            stream=False,
        )
        choice = resp.choices[0].message
        reasoning = getattr(choice, "reasoning_content", "") or ""
        answer = choice.content or ""
        return reasoning, answer

    # ── Models & balance ──────────────────────────────────────────────────────

    def list_models(self) -> list[dict]:
        try:
            models = self._client.models.list()
            return [{"id": m.id} for m in models.data]
        except Exception:
            # Return known models if endpoint not supported
            return [{"id": v} for v in MODELS.values()]

    def get_balance(self) -> dict:
        import httpx
        resp = httpx.get(
            f"{self.base_url}/user/balance",
            headers={"Authorization": f"Bearer {self.api_key}"},
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json()
