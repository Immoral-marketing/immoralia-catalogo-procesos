'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Send, Loader2, Bot, Calendar, X, MessageSquare, ChevronDown } from 'lucide-react';
import { GHLBookingModal } from './GHLBookingModal';
import { cn } from '@/lib/utils';
import { processes } from '@/data/processes';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  action?: string;
}

export interface SectorChatbotProps {
  sector: string;
  sectorName: string;
  accentHex: string;
  suggestions: string[];
  headline?: string;
}

export const SECTOR_SUGGESTIONS: Record<string, string[]> = {
  construccion: [
    'Pierdo leads de portales inmobiliarios',
    'Mis agentes improvisan el discurso',
    '¿Cómo genero un dossier al momento?',
  ],
  salud: [
    'Tengo llamadas perdidas fuera de horario',
    '¿Cómo reduzco los no-shows?',
    'Necesito reactivar pacientes inactivos',
  ],
  gestorias: [
    'Los clientes no mandan documentación a tiempo',
    '¿Cómo envío nóminas automáticamente?',
    'Se me olvidan vencimientos fiscales',
  ],
  'centros-deportivos': [
    'Detecto tarde cuando un socio se va a dar de baja',
    '¿Cómo gestiono reservas y listas de espera?',
    'Quiero automatizar el cobro mensual',
  ],
  academias: [
    'Los alumnos se dan de baja sin avisar',
    '¿Cómo hago las matrículas sin papeleo?',
    'Necesito reactivar exalumnos',
  ],
  'gastronomia-hosteleria': [
    'Tengo muchos no-shows que me cuestan dinero',
    '¿Cómo consigo más reseñas en Google?',
    'Quiero controlar el stock automáticamente',
  ],
  industrial: [
    'Tardo demasiado en preparar presupuestos',
    '¿Cómo doy visibilidad del pedido al cliente?',
    'Necesito trazabilidad de lote sin Excel',
  ],
};

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Busca un proceso por slug para extraer su nomenclatura
function getProcessNomenclature(slug: string): { codigo: string; bloque: string; nombre: string } | null {
  const p = processes.find(pr => pr.slug === slug);
  if (!p) return null;
  return {
    codigo: p.modulo_codigo || p.codigo || '',
    bloque: p.bloque_negocio || '',
    nombre: p.nombre,
  };
}

// Chip de proceso clicable con nomenclatura correcta
const ProcessChip: React.FC<{ slug: string; label: string; accentHex: string }> = ({ slug, label, accentHex }) => {
  const { r, g, b } = hexToRgb(accentHex);
  const info = getProcessNomenclature(slug);
  const displayLabel = info
    ? `${info.bloque ? info.bloque + ' · ' : ''}${info.codigo ? info.codigo + ' · ' : ''}${info.nombre}`
    : label;

  return (
    <Link
      href={`/catalogo/procesos/${slug}`}
      className="inline-flex items-center gap-1.5 mt-1 mb-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 hover:translate-x-0.5"
      style={{
        background: `rgba(${r},${g},${b},0.12)`,
        color: `rgba(${r},${g},${b},1)`,
        border: `1px solid rgba(${r},${g},${b},0.35)`,
      }}
    >
      {displayLabel}
    </Link>
  );
};

// Renderer de markdown como componentes React (soporta bold, process links, sector links, listas, saltos)
const MarkdownContent: React.FC<{ content: string; accentHex: string }> = ({ content, accentHex }) => {
  const { r, g, b } = hexToRgb(accentHex);
  const accentStyle = { color: `rgba(${r},${g},${b},0.9)` };

  const renderInline = (text: string, key: string): React.ReactNode => {
    // Procesar bold + process links + sector links en el mismo texto
    const parts: React.ReactNode[] = [];
    // Regex combinado: bold, process link, sector link, generic link
    const regex = /\*\*(.*?)\*\*|\[(.*?)\]\((\/catalogo\/procesos\/([^\s)]+))\)|\[(.*?)\]\((\/sector\/[^\s)]+)\)|\[(.*?)\]\(([^)]+)\)/g;
    let last = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) {
        parts.push(<span key={`t-${key}-${last}`}>{text.slice(last, match.index)}</span>);
      }

      if (match[1] !== undefined) {
        // **bold**
        parts.push(<strong key={`b-${key}-${match.index}`} className="font-semibold text-white">{match[1]}</strong>);
      } else if (match[4] !== undefined) {
        // Process link
        parts.push(<ProcessChip key={`p-${key}-${match.index}`} slug={match[4]} label={match[2]} accentHex={accentHex} />);
      } else if (match[5] !== undefined) {
        // Sector link
        parts.push(
          <Link key={`s-${key}-${match.index}`} href={match[6]} className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity" style={accentStyle}>
            {match[5]} →
          </Link>
        );
      } else if (match[7] !== undefined) {
        // Generic link
        parts.push(
          <a key={`l-${key}-${match.index}`} href={match[8]} className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity" style={accentStyle} target="_blank" rel="noopener noreferrer">
            {match[7]}
          </a>
        );
      }
      last = match.index + match[0].length;
    }

    if (last < text.length) {
      parts.push(<span key={`t-${key}-end`}>{text.slice(last)}</span>);
    }

    return parts.length === 1 && typeof parts[0] === 'object' ? parts[0] : <>{parts}</>;
  };

  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      nodes.push(<div key={`gap-${i}`} className="h-2" />);
    } else if (/^\s*[-*]\s+/.test(line)) {
      // Lista — agrupa ítems consecutivos
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="ml-4 space-y-1 my-1">
          {items.map((item, idx) => (
            <li key={idx} className="list-disc">{renderInline(item, `li-${i}-${idx}`)}</li>
          ))}
        </ul>
      );
      continue;
    } else {
      nodes.push(<p key={`p-${i}`} className="leading-relaxed">{renderInline(line, `p-${i}`)}</p>);
    }
    i++;
  }

  return <div className="space-y-1 text-sm">{nodes}</div>;
};

const STORAGE_KEY = (sector: string) => `immoralia_chat_${sector}`;

const SectorChatbot: React.FC<SectorChatbotProps> = ({
  sector,
  sectorName,
  accentHex,
  suggestions,
  headline,
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY(sector));
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userTurnCount, setUserTurnCount] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [scheduleSuggestionDismissed, setScheduleSuggestionDismissed] = useState(false);
  const [showMessages, setShowMessages] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { r, g, b } = hexToRgb(accentHex);
  const accentRgb = `${r},${g},${b}`;
  const ACCENT = `rgba(${accentRgb},0.90)`;
  const ACCENT_DIM = `rgba(${accentRgb},0.12)`;
  const ACCENT_BORDER = `rgba(${accentRgb},0.22)`;

  const hasSentFirstMessage = messages.length > 0;

  // Persistir en localStorage cada vez que cambian los mensajes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY(sector), JSON.stringify(messages));
    } catch {}
  }, [messages, sector]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || messages.length === 0) return;
    const lastIdx = messages.length - 1;
    const lastMsg = messages[lastIdx];
    if (lastMsg.role === 'assistant') {
      const msgEl = messageRefs.current[lastIdx];
      if (msgEl) container.scrollTop = msgEl.offsetTop - 12;
    } else {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    const userMessage = text.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setUserTurnCount(prev => prev + 1);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sector, history }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
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
        { role: 'assistant', content: 'Ha habido un problema técnico. Por favor, inténtalo de nuevo.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sector, messages]);

  const handleSend = () => sendMessage(input);
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const showScheduleCta = userTurnCount >= 5 && !scheduleSuggestionDismissed;

  return (
    <>
      <section className="px-6 py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(${accentRgb},0.05) 0%, transparent 70%)` }}
        />

        <div className="max-w-2xl mx-auto relative">

          <div className={`text-center animate-in fade-in duration-500 ${hasSentFirstMessage ? 'mb-6' : 'mb-10'}`}>
            <h2 className={`font-bold text-white leading-tight ${hasSentFirstMessage ? 'text-2xl md:text-3xl mb-1' : 'text-3xl md:text-4xl mb-3'}`}>
              {headline ?? (
                <>¿Qué te está{' '}
                  <span style={{ color: ACCENT }}>robando tiempo</span>{' '}
                  en {sectorName.startsWith('tu') ? sectorName : `tu ${sectorName.toLowerCase()}`}?
                </>
              )}
            </h2>
            {!hasSentFirstMessage && (
              <p className="text-sm text-gray-500">
                Cuéntanos el problema y te decimos qué proceso lo resuelve.
              </p>
            )}
          </div>

          {hasSentFirstMessage && !showMessages && (
            <button
              onClick={() => setShowMessages(true)}
              className="w-full mb-4 flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm text-gray-400 hover:text-white"
              style={{ borderColor: ACCENT_BORDER, backgroundColor: ACCENT_DIM }}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" style={{ color: ACCENT }} />
                <span>Conversación guardada · {messages.length} mensajes</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {hasSentFirstMessage && showMessages && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Conversación</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setMessages([]);
                      localStorage.removeItem(STORAGE_KEY(sector));
                      setUserTurnCount(0);
                    }}
                    className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    Borrar
                  </button>
                  <button
                    onClick={() => setShowMessages(false)}
                    className="flex items-center gap-1.5 text-xs font-medium transition-colors px-2 py-1 rounded-lg"
                    style={{ color: ACCENT }}
                  >
                    <X className="w-3.5 h-3.5" />
                    Cerrar
                  </button>
                </div>
              </div>

              <div ref={messagesContainerRef} className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    ref={el => { messageRefs.current[i] = el; }}
                    className={cn('flex gap-3', m.role === 'user' ? 'justify-end' : 'justify-start')}
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
                      {m.role === 'assistant'
                        ? <MarkdownContent content={m.content} accentHex={accentHex} />
                        : m.content
                      }
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
                <button onClick={() => setScheduleSuggestionDismissed(true)} className="text-gray-500 hover:text-gray-300 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Input bar */}
          <div
            className="relative flex items-center gap-3 rounded-2xl border px-5 py-4 transition-all duration-200"
            style={{
              borderColor: `rgba(${accentRgb},0.28)`,
              backgroundColor: 'rgba(255,255,255,0.04)',
              boxShadow: `0 0 0 1px rgba(${accentRgb},0.12), inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}
          >
            <input
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
              style={{ backgroundColor: ACCENT, color: '#000' }}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>

          {!hasSentFirstMessage && (
            <div className="flex gap-2 mt-5 justify-center animate-in fade-in duration-500 delay-200">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3.5 py-2 rounded-full border transition-all text-gray-300 hover:text-white whitespace-nowrap"
                  style={{ borderColor: `rgba(${accentRgb},0.22)`, backgroundColor: `rgba(${accentRgb},0.05)` }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `rgba(${accentRgb},0.5)`;
                    (e.currentTarget as HTMLElement).style.backgroundColor = `rgba(${accentRgb},0.12)`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `rgba(${accentRgb},0.22)`;
                    (e.currentTarget as HTMLElement).style.backgroundColor = `rgba(${accentRgb},0.05)`;
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <GHLBookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </>
  );
};

export default SectorChatbot;
