import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, Calendar, X, MessageSquare, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { GHLBookingModal } from './GHLBookingModal';
import { cn } from '@/lib/utils';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  action?: string;
}

const SUGGESTIONS = [
  '¿Por dónde debería empezar?',
  'Pierdo leads que llegan de redes sociales',
  'Quiero automatizar el envío de facturas',
  '¿Qué hacéis exactamente?',
];

const ACCENT = 'rgba(0,255,255,0.75)';
const ACCENT_DIM = 'rgba(0,255,255,0.15)';
const ACCENT_BORDER = 'rgba(0,255,255,0.18)';

function renderMarkdown(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(
      /\[(.*?)\]\((\/catalogo\/procesos\/[^\s)]+)\)/g,
      '<a href="$2" class="inline-flex items-center gap-1 mt-1 mb-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:opacity-90" style="background:rgba(0,255,255,0.12);color:rgba(0,255,255,1);border:1px solid rgba(0,255,255,0.3)" target="_blank" rel="noopener noreferrer">$1 ↗</a>'
    )
    .replace(
      /\[(.*?)\]\((\/sector\/[^\s)]+)\)/g,
      '<a href="$2" class="inline-flex items-center gap-1 mt-1 mb-1 px-2 py-0.5 rounded-md text-xs font-medium underline underline-offset-2 transition-opacity hover:opacity-80" style="color:rgba(0,255,255,0.75)" target="_blank" rel="noopener noreferrer">$1 →</a>'
    )
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" class="underline underline-offset-2 hover:opacity-80 transition-opacity font-medium" style="color:rgba(0,255,255,0.85)" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    .replace(/^\s*-\s+(.*?)$/gm, '<li class="ml-4 mb-1 list-disc">$1</li>')
    .replace(/\n\n/g, '<div class="h-2"></div>')
    .replace(/\n/g, '<br />');
}

const HomeChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userTurnCount, setUserTurnCount] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [scheduleSuggestionDismissed, setScheduleSuggestionDismissed] = useState(false);
  const [showMessages, setShowMessages] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasSentFirstMessage = messages.length > 0;

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || messages.length === 0) return;

    const lastIdx = messages.length - 1;
    const lastMsg = messages[lastIdx];

    if (lastMsg.role === 'assistant') {
      // Mostrar el TOP del mensaje del asistente, no el fondo
      const msgEl = messageRefs.current[lastIdx];
      if (msgEl) {
        container.scrollTop = msgEl.offsetTop - 12;
      }
    } else {
      // Mensaje de usuario: scroll al fondo para ver el indicador de carga
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    const userMessage = text.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    const newUserTurnCount = userTurnCount + 1;
    setUserTurnCount(newUserTurnCount);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: { message: userMessage, sector: null, history },
      });

      if (error) throw error;

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data?.reply || 'Lo siento, ha habido un error. Por favor, inténtalo de nuevo.',
          action: data?.action,
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Ha habido un problema técnico. Por favor, inténtalo de nuevo o escríbenos directamente.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);
  const handleSuggestion = (s: string) => sendMessage(s);
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showScheduleCta = userTurnCount >= 5 && !scheduleSuggestionDismissed;

  return (
    <>
      <section className="px-6 py-20 relative overflow-hidden">
        {/* Glow de fondo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,255,255,0.06) 0%, transparent 70%)' }}
        />

        <div className="max-w-2xl mx-auto relative">

          {/* Header — solo visible antes de empezar */}
          {!hasSentFirstMessage && (
            <div className="text-center mb-10 animate-in fade-in duration-500">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                ¿Qué te está{' '}
                <span style={{ color: 'rgba(0,255,255,0.90)' }}>robando tiempo</span>{' '}
                en tu negocio?
              </h2>
            </div>
          )}

          {/* Toggle para retomar conversación cuando está colapsada */}
          {hasSentFirstMessage && !showMessages && (
            <button
              onClick={() => setShowMessages(true)}
              className="w-full mb-4 flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm text-gray-400 hover:text-white"
              style={{ borderColor: 'rgba(0,255,255,0.15)', backgroundColor: 'rgba(0,255,255,0.04)' }}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" style={{ color: ACCENT }} />
                <span>Conversación guardada · {messages.length} mensajes</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {/* Área de conversación */}
          {hasSentFirstMessage && showMessages && (
            <div className="mb-4">
              {/* Barra superior con botón cerrar */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Conversación</span>
                <button
                  onClick={() => setShowMessages(false)}
                  className="flex items-center gap-1.5 text-xs font-medium transition-colors px-2 py-1 rounded-lg"
                  style={{ color: 'rgba(0,255,255,0.80)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(0,255,255,1)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(0,255,255,0.80)'}
                >
                  <X className="w-3.5 h-3.5" />
                  Cerrar
                </button>
              </div>

            <div ref={messagesContainerRef} className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {messages.map((m, i) => (
                <div
                  key={i}
                  ref={el => { messageRefs.current[i] = el; }}
                  className={cn(
                    'flex gap-3',
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {m.role === 'assistant' && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border"
                      style={{ borderColor: ACCENT_BORDER, color: ACCENT, backgroundColor: ACCENT_DIM }}
                    >
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                      m.role === 'user'
                        ? 'bg-white/8 text-white rounded-tr-none'
                        : 'bg-white/[0.04] border border-white/8 text-gray-200 rounded-tl-none'
                    )}
                  >
                    {m.role === 'assistant' ? (
                      <div
                        className="markdown-content"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                      />
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border"
                    style={{ borderColor: ACCENT_BORDER, color: ACCENT, backgroundColor: ACCENT_DIM }}
                  >
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/8 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce bg-gray-500" />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce delay-100 bg-gray-500" />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce delay-200 bg-gray-500" />
                  </div>
                </div>
              )}

            </div>
            </div>
          )}

          {/* CTA suave de agendar llamada tras 5+ turnos */}
          {showScheduleCta && (
            <div
              className="mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ borderColor: ACCENT_BORDER, backgroundColor: ACCENT_DIM }}
            >
              <div className="flex items-center gap-2" style={{ color: ACCENT }}>
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="font-medium">¿Hablamos 20 minutos? Te orientamos sin compromiso.</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                  style={{ backgroundColor: ACCENT, color: '#000' }}
                >
                  Agendar
                </button>
                <button
                  onClick={() => setScheduleSuggestionDismissed(true)}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Input bar */}
          <div
            className="relative flex items-center gap-3 rounded-2xl border px-5 py-4 transition-all duration-200 focus-within:shadow-[0_0_0_1px_rgba(0,255,255,0.4),0_0_20px_rgba(0,255,255,0.08)]"
            style={{
              borderColor: 'rgba(0,255,255,0.25)',
              backgroundColor: 'rgba(255,255,255,0.04)',
              boxShadow: '0 0 0 1px rgba(0,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.04)'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Cuéntanos qué necesitas..."
              className="flex-1 bg-transparent text-white text-base placeholder:text-gray-500 outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-25 shrink-0"
              style={{ backgroundColor: 'rgba(0,255,255,0.85)', color: '#000' }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Suggestion chips — solo antes del primer mensaje */}
          {!hasSentFirstMessage && (
            <div className="flex flex-wrap gap-2 mt-5 justify-center animate-in fade-in duration-500 delay-200">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="text-sm px-4 py-2 rounded-full border transition-all text-gray-300 hover:text-white"
                  style={{
                    borderColor: 'rgba(0,255,255,0.2)',
                    backgroundColor: 'rgba(0,255,255,0.05)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,255,0.5)';
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,255,255,0.12)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,255,0.2)';
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,255,255,0.05)';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Divisor hacia los sectores */}
          {hasSentFirstMessage && (
            <p className="text-center text-xs text-gray-600 mt-6">
              ¿Prefieres explorar por sector? <button
                onClick={() => document.getElementById('sectores')?.scrollIntoView({ behavior: 'smooth' })}
                className="underline text-gray-500 hover:text-gray-300 transition-colors"
              >
                Baja al catálogo
              </button>
            </p>
          )}
        </div>
      </section>

      <GHLBookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </>
  );
};

export default HomeChatbot;
