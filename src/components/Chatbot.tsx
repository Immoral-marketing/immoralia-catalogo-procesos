import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';
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

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '¡Hola! Soy el asistente de Immoralia. ¿En qué puedo ayudarte hoy? Puedo resolver dudas sobre nuestros procesos de automatización o sobre el setup de n8n.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Llamada a la Edge Function de Supabase
            const { data, error } = await supabase.functions.invoke('chat-assistant', {
                body: { message: userMessage },
            });

            if (error) throw error;

            // Nota: Si usas streaming, la invocación estándar de supabase-js puede necesitar ajustes 
            // o usar fetch directamente para manejar el ReadableStream.
            // Por ahora manejamos la respuesta completa si no configuramos streaming en el cliente.

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
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl z-50 p-0 overflow-hidden group transition-all hover:scale-110 bg-primary"
            >
                <MessageSquare className="w-6 h-6 text-primary-foreground transition-transform group-hover:rotate-12" />
            </Button>
        );
    }

    return (
        <Card className={cn(
            "fixed right-6 z-50 flex flex-col shadow-2xl border-border bg-card transition-all duration-300 overflow-hidden",
            isMinimized ? "bottom-6 w-72 h-14" : "bottom-6 w-96 max-h-[600px] h-[80vh]"
        )}>
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between border-b border-primary/20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Bot className="w-5 h-5" />
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
                        onClick={() => setIsOpen(false)}
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
                                        m.role === 'user' ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary border border-primary/20"
                                    )}>
                                        {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm leading-relaxed",
                                            m.role === 'user'
                                                ? "bg-secondary text-secondary-foreground rounded-tr-none"
                                                : "bg-muted border border-border rounded-tl-none"
                                        )}>
                                            {m.content}
                                        </div>
                                        {m.action === 'handover' && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="w-full mt-1 border border-primary/20 gap-2 font-bold animate-in fade-in slide-in-from-bottom-2 duration-300"
                                                onClick={() => {
                                                    console.log("Dispatching handover event...");
                                                    window.dispatchEvent(new CustomEvent('immoralia:show-contact'));
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
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-muted border border-border rounded-tl-none flex gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce delay-100" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce delay-200" />
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
                                placeholder="Pregunta algo..."
                                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <Button
                                size="icon"
                                className="absolute right-1 rounded-lg h-9 w-9 bg-primary"
                                disabled={isLoading || !input.trim()}
                                onClick={handleSend}
                            >
                                <Send className="w-4 h-4" />
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
