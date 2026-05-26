import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface Message {
    role: 'assistant' | 'user';
    content: string;
    action?: string;
}

type CollectionStep = 'chat' | 'asking_name' | 'asking_email' | 'asking_phone' | 'submitting' | 'completed';

interface LeadData {
    nombre: string;
    email: string;
    telefono: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '¡Hola! Soy el asistente de Immoralia. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [collectionStep, setCollectionStep] = useState<CollectionStep>('chat');
    const [leadData, setLeadData] = useState<LeadData>({ nombre: '', email: '', telefono: '' });
    const scrollRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Determinar el color de acento según la ruta
    const getAccentColor = () => {
        const path = location.pathname;
        if (path.includes('gestorias')) return '#14b8a6'; // Teal
        if (path.includes('inmobiliaria')) return '#10b981'; // Emerald
        if (path.includes('salud')) return '#2563eb'; // Blue
        if (path.includes('centros-deportivos')) return '#06b6d4'; // Cyan
        if (path.includes('construccion')) return '#d97706'; // Amber
        if (path.includes('academias')) return '#8b5cf6'; // Violet
        if (path.includes('restauracion')) return '#ea580c'; // Orange
        if (path.includes('ecommerce')) return '#2563eb'; // Blue
        if (path.includes('agencias')) return '#e11d48'; // Rose
        return '#000000'; // Default black or primary
    };

    const accentColor = getAccentColor();
    const isLanding = accentColor !== '#000000';
    const isProcessDetail = location.pathname.startsWith('/catalogo/procesos/');

    const analyzeConversation = async (reason: 'resolved' | 'human' | 'abandoned' | 'unknown') => {
        if (messages.length <= 1 || hasAnalyzed) return;

        console.log(`Analyzing conversation. Reason: ${reason}`);
        setHasAnalyzed(true);

        const transcript = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

        try {
            const { data, error } = await supabase.functions.invoke('analyze-chat-conversation', {
                body: {
                    transcript,
                    ended_reason: reason,
                    form_opened: reason === 'human'
                },
            });

            if (error) throw error;

            console.log('Conversation analyzed and logged:', data);
        } catch (err) {
            console.error('Failed to analyze conversation:', err);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);


    const submitLead = async (finalData: LeadData) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('send-contact-email', {
                body: {
                    nombre: finalData.nombre,
                    email: finalData.email,
                    telefono: finalData.telefono,
                    empresa: 'Chatbot Lead', // Default for chatbot
                    source: 'chatbot',
                    chatbotContext: messages.map(m => `${m.role.toUpperCase()}: ${m.content}`),
                    selectedProcesses: [], // Chatbot leads might not have processes selected yet
                    n8nHosting: 'setup'
                },
            });

            if (error) throw error;

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '¡Recibido! He pasado tus datos a un consultor humano. Te contactaremos en menos de 24 horas o lo antes posible para ayudarte con tu consulta. ¡Que tengas un gran día!'
            }]);
            setCollectionStep('completed');
        } catch (err) {
            console.error('Error submitting lead:', err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Lo siento, ha habido un error al guardar tus datos. Por favor, inténtalo de nuevo más tarde o escríbenos a team@immoralia.es'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        if (collectionStep === 'chat') {
            setIsLoading(true);
            try {
                const { data, error } = await supabase.functions.invoke('chat-assistant', {
                    body: { message: userMessage },
                });

                if (error) throw error;

                if (data?.error) {
                    setMessages(prev => [...prev, { role: 'assistant', content: `Error de la IA: ${data.error}` }]);
                } else {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: data.reply || 'Lo siento, hubo un error al recibir la respuesta.',
                        action: data.action
                    }]);
                }
            } catch (err) {
                console.error('Error in chatbot:', err);
                setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, he tenido un problema técnico. Por favor, inténtalo de nuevo más tarde.' }]);
            } finally {
                setIsLoading(false);
            }
        } else if (collectionStep === 'asking_name') {
            setLeadData(prev => ({ ...prev, nombre: userMessage }));
            setMessages(prev => [...prev, { role: 'assistant', content: `Gracias ${userMessage}. ¿Podrías decirme tu correo electrónico para enviarte la información?` }]);
            setCollectionStep('asking_email');
        } else if (collectionStep === 'asking_email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userMessage)) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Ese correo no parece válido. Por favor, introduce un email correcto.' }]);
                return;
            }
            setLeadData(prev => ({ ...prev, email: userMessage }));
            setMessages(prev => [...prev, { role: 'assistant', content: 'Perfecto. Por último, ¿un teléfono de contacto? (Es opcional, pero nos ayuda a agilizar la gestión)' }]);
            setCollectionStep('asking_phone');
        } else if (collectionStep === 'asking_phone') {
            const finalData = { ...leadData, telefono: userMessage };
            setLeadData(finalData);
            setCollectionStep('submitting');
            await submitLead(finalData);
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className={`fixed right-6 w-14 h-14 rounded-full shadow-2xl z-[60] p-0 overflow-hidden group transition-all hover:scale-110 ${
                    isProcessDetail ? "bottom-[7px]" : "bottom-6"
                }`}
                style={isProcessDetail
                    ? { backgroundColor: 'rgba(0,0,0,0.85)' }
                    : isLanding ? { backgroundColor: accentColor } : {}
                }
            >
                <MessageSquare className="w-6 h-6 text-white transition-transform group-hover:rotate-12" />
            </Button>
        );
    }

    return (
        <Card className={cn(
            "fixed right-6 z-50 flex flex-col shadow-2xl border-border bg-card transition-all duration-300 overflow-hidden",
            isMinimized ? "bottom-6 w-72 h-14" : "bottom-6 w-96 max-h-[600px] h-[80vh]"
        )}>
            {/* Header */}
            <div 
                className="p-4 text-white flex items-center justify-between border-b border-white/10"
                style={isLanding ? { backgroundColor: accentColor } : { backgroundColor: 'hsl(var(--primary))' }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Asistente Immoralia</p>
                        {!isMinimized && <p className="text-[10px] opacity-80">AI en línea</p>}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/10"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/10"
                        onClick={() => {
                            analyzeConversation('abandoned');
                            setIsOpen(false);
                        }}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Chat Messages */}
                    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                        <div className="space-y-4 pb-4">
                            {messages.map((m, i) => (
                                <div key={i} className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        m.role === 'user' 
                                            ? "bg-secondary text-secondary-foreground" 
                                            : "bg-muted border border-border"
                                    )}
                                    style={m.role === 'assistant' && isLanding ? { borderColor: `${accentColor}40`, color: accentColor } : {}}
                                    >
                                        {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                                            m.role === 'user'
                                                ? "bg-secondary text-secondary-foreground rounded-tr-none"
                                                : "bg-muted border border-border rounded-tl-none"
                                        )}>
                                            {m.role === 'assistant' ? (
                                                <div
                                                    className="markdown-content"
                                                    dangerouslySetInnerHTML={{
                                                        __html: m.content
                                                            .replace(/\*\*(.*?)\*\*/g, `<strong class="font-bold" style="color: ${isLanding ? accentColor : 'hsl(var(--primary))'}">$1</strong>`)
                                                            .replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer" class="font-semibold underline underline-offset-2 hover:opacity-80 transition-all" style="color: ${isLanding ? accentColor : 'hsl(var(--primary))'}">$1</a>`)
                                                            .replace(/^\s*-\s+(.*?)$/gm, '<li class="ml-4 mb-1">$1</li>')
                                                            .replace(/\n\n/g, '<div class="h-3"></div>')
                                                            .replace(/\n/g, '<br />')
                                                    }}
                                                />
                                            ) : (
                                                m.content
                                            )}
                                        </div>
                                        {m.action === 'handover' && collectionStep === 'chat' && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="w-full mt-1 border gap-2 font-bold animate-in fade-in slide-in-from-bottom-2 duration-300"
                                                style={isLanding ? { borderColor: `${accentColor}40`, color: accentColor } : {}}
                                                onClick={() => {
                                                    analyzeConversation('human');
                                                    setMessages(prev => [...prev, { 
                                                        role: 'assistant', 
                                                        content: 'Claro, me parece perfecto. Para que un consultor humano pueda revisar tu caso y ayudarte mejor, ¿podrías decirme tu nombre?' 
                                                    }]);
                                                    setCollectionStep('asking_name');
                                                }}
                                            >
                                                <User className="w-4 h-4" /> Hablar con un humano
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 max-w-[85%] mr-auto">
                                    <div 
                                        className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center"
                                        style={isLanding ? { borderColor: `${accentColor}40`, color: accentColor } : {}}
                                    >
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-muted border border-border rounded-tl-none flex gap-1">
                                        <span 
                                            className="w-1.5 h-1.5 rounded-full animate-bounce" 
                                            style={isLanding ? { backgroundColor: accentColor, opacity: 0.4 } : { backgroundColor: 'hsl(var(--primary))', opacity: 0.4 }}
                                        />
                                        <span 
                                            className="w-1.5 h-1.5 rounded-full animate-bounce delay-100" 
                                            style={isLanding ? { backgroundColor: accentColor, opacity: 0.4 } : { backgroundColor: 'hsl(var(--primary))', opacity: 0.4 }}
                                        />
                                        <span 
                                            className="w-1.5 h-1.5 rounded-full animate-bounce delay-200" 
                                            style={isLanding ? { backgroundColor: accentColor, opacity: 0.4 } : { backgroundColor: 'hsl(var(--primary))', opacity: 0.4 }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 border-t border-border bg-card/50">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                placeholder={collectionStep === 'chat' ? "Pregunta algo..." : "Escribe aquí..."}
                                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 pr-12 transition-all"
                                style={isLanding ? { '--tw-ring-color': `${accentColor}50` } as React.CSSProperties : {}}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={collectionStep === 'completed' || collectionStep === 'submitting'}
                            />
                            <Button
                                size="icon"
                                className="absolute right-1 rounded-lg h-9 w-9"
                                style={isLanding ? { backgroundColor: accentColor } : {}}
                                disabled={isLoading || !input.trim()}
                                onClick={handleSend}
                            >
                                <Send className="w-4 h-4 text-white" />
                            </Button>
                        </div>
                        <p className="text-[9px] text-center text-muted-foreground mt-3 uppercase tracking-widest opacity-50">
                            Desarrollado con IA por Immoralia
                        </p>
                    </div>
                </>
            )}
        </Card>
    );
};

export default Chatbot;
