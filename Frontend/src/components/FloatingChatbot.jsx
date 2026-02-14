import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL } from "../utils/api";

const INITIAL_MESSAGE = {
  role: "assistant",
  text: "Hi! I am Furnito Assistant. Ask me anything about Furnito products, orders, delivery, returns, or support.",
};

const BOT_ERROR_FALLBACK =
  "I can help only with Furnito-related questions. Please ask about Furnito products, orders, delivery, returns, or support.";

const toHistoryPayload = (messages) =>
  messages
    .filter((message) => message.role === "assistant" || message.role === "user")
    .slice(-8)
    .map((message) => ({
      role: message.role,
      text: message.text,
    }));

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const scrollAnchorRef = useRef(null);

  const canSend = useMemo(
    () => !isSending && input.trim().length > 0,
    [input, isSending]
  );

  useEffect(() => {
    if (!isOpen) return;
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isOpen, messages, isSending]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    const history = toHistoryPayload(messages);
    const userMessage = { role: "user", text: trimmedInput };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setErrorMessage("");
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedInput,
          history,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Unable to get assistant response.");
      }

      const reply = String(payload?.reply || "").trim();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply || BOT_ERROR_FALLBACK,
        },
      ]);
    } catch (error) {
      const fallbackText = String(error?.message || BOT_ERROR_FALLBACK);
      setErrorMessage(fallbackText);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: BOT_ERROR_FALLBACK,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-amber-300 bg-white shadow-2xl dark:border-blue-700 dark:bg-blue-950">
          <div className="flex items-center justify-between border-b border-amber-200 bg-gradient-to-r from-amber-100 to-orange-50 px-4 py-3 dark:border-blue-700 dark:from-blue-900 dark:to-blue-800">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <Bot className="h-5 w-5" />
              <p className="text-sm font-semibold">Furnito Assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1.5 text-amber-800 transition-colors hover:bg-amber-200/70 dark:text-amber-300 dark:hover:bg-blue-700/60"
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="h-80 overflow-y-auto bg-amber-50/30 px-3 py-3 dark:bg-blue-900/40">
            <div className="space-y-2">
              {messages.map((message, index) => {
                const isInitialAssistantMessage =
                  index === 0 && message.role === "assistant";

                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[88%] rounded-xl px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "ml-auto bg-amber-600 text-white"
                        : `bg-white text-slate-800 dark:bg-blue-800 ${
                            isInitialAssistantMessage
                              ? "dark:text-blue-300"
                              : "dark:text-white"
                          }`
                    }`}
                  >
                    {message.text}
                  </div>
                );
              })}
              {isSending && (
                <div className="max-w-[88%] rounded-xl bg-white px-3 py-2 text-sm text-slate-700 dark:bg-blue-800 dark:text-white">
                  Typing...
                </div>
              )}
              <div ref={scrollAnchorRef} />
            </div>
          </div>

          <div className="border-t border-amber-200 bg-white p-3 dark:border-blue-700 dark:bg-blue-950">
            {errorMessage ? (
              <p className="mb-2 text-xs text-red-600 dark:text-red-300">{errorMessage}</p>
            ) : null}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about Furnito..."
                className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-blue-600 dark:bg-blue-900 dark:text-white dark:placeholder:text-white/70"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600 text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-amber-300 bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg transition-transform hover:scale-105 dark:border-blue-700 dark:from-blue-700 dark:to-blue-600"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
