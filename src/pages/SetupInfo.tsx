import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronLeft,
    Check,
    Play,
    Zap,
    Clock,
    MessageSquare,
    Info,
    ShieldCheck,
    HelpCircle,
    Server,
    Cloud,
    ChevronDown,
    MousePointerClick
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useSelection } from "@/lib/SelectionContext";
import immoraliaLogo from "@/assets/immoralia_logo.png";

const SetupInfo = () => {
    const navigate = useNavigate();
    const { n8nHosting, setN8nHosting } = useSelection();
    const [activeSection, setActiveSection] = useState("que-es");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        { id: "que-es", label: "Qué es" },
        { id: "opciones", label: "Opciones" },
        { id: "que-incluye", label: "Qué incluye" },
        { id: "seguridad", label: "Seguridad" },
        { id: "faqs", label: "Preguntas frecuentes" },
    ];

    useEffect(() => {
        const observers = sections.map(({ id }) => {
            const element = document.getElementById(id);
            if (!element) return null;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveSection(id);
                        }
                    });
                },
                {
                    rootMargin: "-20% 0px -70% 0px",
                    threshold: 0,
                }
            );

            observer.observe(element);
            return observer;
        });

        return () => {
            observers.forEach((o) => o?.disconnect());
        };
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 140;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 md:py-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate("/")}
                                className="flex gap-2 text-muted-foreground hover:text-foreground"
                            >
                                <ChevronLeft className="w-4 h-4" /> Volver al catálogo
                            </Button>
                            <img src={immoraliaLogo} alt="Immoralia" className="h-8 md:h-10" />
                        </div>
                        <div className="text-sm font-medium text-muted-foreground hidden sm:block">
                            Ayuda / Setup de automatización
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Breadcrumb (Desktop) */}
                    <nav className="mb-8 hidden md:block">
                        <ol className="flex text-sm text-muted-foreground gap-2">
                            <li className="hover:text-foreground cursor-pointer" onClick={() => navigate("/")}>Catálogo</li>
                            <li>/</li>
                            <li className="text-foreground font-medium">Ayuda</li>
                            <li>/</li>
                            <li>Setup de automatización</li>
                        </ol>
                    </nav>

                    <section className="mb-20 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Setup de automatización (n8n)</h1>
                            <p className="text-xl text-muted-foreground font-light leading-relaxed">
                                Para que tus automatizaciones funcionen, necesitan una "casa" encendida 24/7.
                            </p>

                            <ul className="space-y-4 pt-4">
                                {[
                                    "Automatizaciones funcionando siempre",
                                    "Acceso seguro y encriptado",
                                    "Mantenimiento y soporte (si lo gestionamos nosotros)"
                                ].map((text, i) => (
                                    <li key={i} className="flex items-center gap-3 text-lg text-muted-foreground">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <Check className="w-4 h-4 text-primary" />
                                        </div>
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Card className="bg-gradient-to-br from-card to-card/50 border-border p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Server className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                                <div className="flex items-center justify-center gap-4 w-full">
                                    <div className="p-4 rounded-2xl bg-muted border border-border">
                                        <Cloud className="w-8 h-8 text-primary" />
                                        <span className="text-[10px] block mt-1">Tus Apps</span>
                                    </div>
                                    <div className="h-px bg-primary/30 flex-1 relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    </div>
                                    <div className="p-6 rounded-3xl bg-primary/10 border-2 border-primary/20 shadow-lg shadow-primary/5">
                                        <Zap className="w-10 h-10 text-primary fill-primary" />
                                        <span className="text-xs font-bold block mt-1">n8n</span>
                                    </div>
                                    <div className="h-px bg-primary/30 flex-1 relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted border border-border">
                                        <Check className="w-8 h-8 text-secondary" />
                                        <span className="text-[10px] block mt-1">Resultado</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-foreground">El motor de tus procesos</p>
                                    <p className="text-xs text-muted-foreground">La infraestructura que permite que todo trabaje solo e incansablemente.</p>
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* TABS NAVIGATION (Sticky) */}
                    <div className="sticky top-20 md:top-24 z-30 bg-background/80 backdrop-blur-md border-b border-border -mx-4 px-4 mb-12 overflow-x-auto">
                        <div className="flex gap-8 whitespace-nowrap min-w-min mx-auto justify-center">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    onClick={(e) => scrollToSection(e, section.id)}
                                    className={cn(
                                        "py-4 border-b-2 transition-all duration-200 text-sm md:text-base",
                                        activeSection === section.id
                                            ? "border-primary text-foreground font-medium"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {section.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-32">
                        <section id="que-es" className="scroll-mt-40 space-y-12">
                            <div className="max-w-3xl mx-auto text-center space-y-4">
                                <h2 className="text-3xl font-bold">¿Qué es el Setup de Automatización?</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <Card className="p-8 bg-primary/5 border-primary/20 space-y-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold">En una frase:</h3>
                                    <p className="text-foreground leading-relaxed">
                                        "n8n es una herramienta que conecta tus aplicaciones (correo, CRM, facturación…) para que trabajen solas."
                                    </p>
                                </Card>

                                <Card className="p-8 bg-secondary/5 border-secondary/20 space-y-4">
                                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-secondary" />
                                    </div>
                                    <h3 className="text-xl font-bold">La idea clave:</h3>
                                    <p className="text-foreground leading-relaxed">
                                        "Para que eso pase, n8n debe estar instalado en un servidor que esté encendido todo el día (como un ordenador en internet)."
                                    </p>
                                </Card>
                            </div>

                            <div className="bg-muted/30 rounded-2xl p-8 border border-border text-center">
                                <p className="text-muted-foreground">
                                    <span className="font-bold text-foreground">VPS</span> = Virtual Private Server. Es simplemente un servidor en internet (una "máquina" siempre encendida) donde vive tu automatización.
                                </p>
                            </div>
                        </section>

                        {/* 2. Opciones */}
                        <section id="opciones" className="scroll-mt-40 space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl font-bold">Elige la opción adecuada para ti</h2>
                                <p className="text-muted-foreground">Dos caminos para un mismo objetivo: eficiencia total.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Opción A */}
                                <Card className={cn(
                                    "p-8 relative flex flex-col h-full bg-gradient-to-b transition-all duration-300",
                                    n8nHosting === 'setup'
                                        ? "from-primary/10 to-primary/5 border-primary shadow-lg shadow-primary/5"
                                        : "from-primary/5 to-transparent border-primary/30 opacity-80"
                                )}>
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">RECOMENDADO</Badge>
                                    </div>

                                    <div className="space-y-6 flex-1">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                                <Server className="w-8 h-8 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold">Alojado por Immoralia</h3>
                                                <p className="text-sm text-primary font-medium">Nos encargamos de todo</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="font-bold text-sm">Ideal si:</p>
                                            <ul className="space-y-2">
                                                <li className="flex items-start gap-2 text-sm text-muted-foreground italic">
                                                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                    No tienes equipo técnico propio.
                                                </li>
                                                <li className="flex items-start gap-2 text-sm text-muted-foreground italic">
                                                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                    Quieres olvidarte de servidores y mantenimiento.
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="font-bold text-sm">Nosotros hacemos:</p>
                                            <ul className="grid gap-2 text-sm bg-muted/50 p-4 rounded-xl border border-border">
                                                <li className="flex gap-2"><span>•</span> Instalamos y configuramos n8n.</li>
                                                <li className="flex gap-2"><span>•</span> Lo mantenemos seguro y actualizado.</li>
                                                <li className="flex gap-2"><span>•</span> Monitorizamos que todo funcione 24/7.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <Button
                                        className={cn(
                                            "w-full mt-8 font-bold py-6",
                                            n8nHosting === 'setup' ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground hover:bg-primary/20"
                                        )}
                                        onClick={() => setN8nHosting('setup')}
                                    >
                                        {n8nHosting === 'setup' ? (
                                            <><Check className="mr-2 h-5 w-5" /> Opción seleccionada</>
                                        ) : (
                                            <><MousePointerClick className="mr-2 h-5 w-5" /> Seleccionar esta opción</>
                                        )}
                                    </Button>
                                </Card>

                                {/* Opción B */}
                                <Card className={cn(
                                    "p-8 flex flex-col h-full bg-card/50 transition-all duration-300",
                                    n8nHosting === 'own'
                                        ? "border-secondary shadow-lg shadow-secondary/5 ring-1 ring-secondary/20"
                                        : "border-border opacity-80"
                                )}>
                                    <div className="space-y-6 flex-1">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center border border-border">
                                                <Cloud className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold">Tu propio servidor</h3>
                                                <p className="text-sm text-muted-foreground font-medium">Gestión por tu parte</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="font-bold text-sm">Ideal si:</p>
                                            <ul className="space-y-2">
                                                <li className="flex items-start gap-2 text-sm text-muted-foreground italic">
                                                    <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                                    Ya tienes informático, proveedor o VPS.
                                                </li>
                                                <li className="flex items-start gap-2 text-sm text-muted-foreground italic">
                                                    <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                                    Prefieres centralizar tus herramientas.
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="font-bold text-sm">Requisitos:</p>
                                            <ul className="grid gap-2 text-sm bg-muted/50 p-4 rounded-xl border border-border">
                                                <li className="flex gap-2"><span>•</span> Acceso al servidor o a n8n existente.</li>
                                                <li className="flex gap-2"><span>•</span> Dominio o URL configurada.</li>
                                                <li className="flex gap-2"><span>•</span> Credenciales para la conexión.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full mt-8 font-bold py-6 transition-all",
                                            n8nHosting === 'own' ? "border-secondary bg-secondary/10 text-foreground" : "border-border text-muted-foreground hover:bg-secondary/5"
                                        )}
                                        onClick={() => setN8nHosting('own')}
                                    >
                                        {n8nHosting === 'own' ? (
                                            <><Check className="mr-2 h-5 w-5" /> Opción seleccionada</>
                                        ) : (
                                            <><MousePointerClick className="mr-2 h-5 w-5" /> Seleccionar esta opción</>
                                        )}
                                    </Button>
                                </Card>
                            </div>

                            <div className="max-w-xl mx-auto bg-primary/10 border border-primary/30 p-6 rounded-2xl text-center space-y-3">
                                <h4 className="font-bold text-primary flex items-center justify-center gap-2">
                                    <Info className="w-5 h-5" /> Si tienes dudas, elige esto:
                                </h4>
                                <p className="text-sm">
                                    "Si no sabes qué es un VPS o no tienes a quién preguntarle, elige <span className="font-bold italic underline">Alojado por Immoralia</span>. Es la forma más rápida y segura de empezar."
                                </p>
                            </div>
                        </section>

                        {/* 3. Qué incluye */}
                        <section id="que-incluye" className="scroll-mt-40 space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl font-bold">¿Qué incluye el Setup?</h2>
                                <p className="text-muted-foreground">Un servicio llave en mano para que no te preocupes de nada.</p>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { icon: Zap, title: "Instalación", desc: "Puesta en marcha y configuración inicial de n8n." },
                                    { icon: ShieldCheck, title: "Seguridad", desc: "Accesos protegidos, backups y actualizaciones." },
                                    { icon: Clock, title: "Monitorización", desc: "Vigilancia activa para evitar caídas del sistema." },
                                    { icon: MessageSquare, title: "Soporte", desc: "Atención directa para cualquier duda técnica." }
                                ].map((item, i) => (
                                    <Card key={i} className="p-6 text-center space-y-4 group hover:border-primary/50 transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center mx-auto transition-colors">
                                            <item.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <h4 className="font-bold">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* 4. Seguridad */}
                        <section id="seguridad" className="scroll-mt-40 space-y-12">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-bold">Tu tranquilidad es nuestra prioridad</h2>
                                        <p className="text-muted-foreground text-lg italic leading-relaxed">
                                            No hace falta entender de servidores para saber que tus datos están a salvo.
                                        </p>
                                    </div>

                                    <div className="grid gap-6">
                                        {[
                                            { title: "Acceso protegido", desc: "Solo tú y las personas autorizadas pueden entrar a tu n8n." },
                                            { title: "Copias de seguridad", desc: "Guardamos versiones diarias de tus procesos por si acaso." },
                                            { title: "Actualizaciones", desc: "Mantenemos el software al día con las últimas mejoras." },
                                            { title: "Permisos granulares", desc: "Controlamos quién puede ver o tocar cada automatización." }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                                    <ShieldCheck className="w-5 h-5 text-secondary" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-bold">{item.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                                        <h3 className="font-bold flex items-center gap-2">
                                            <Info className="w-5 h-5 text-primary" /> Detalles técnicos
                                        </h3>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="item-1" className="border-border">
                                                <AccordionTrigger className="text-sm hover:no-underline">Seguridad de la conexión</AccordionTrigger>
                                                <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                                                    Utilizamos certificados SSL (HTTPS) para encriptar todo el tráfico entre tú y el servidor, además de firewalls configurados para bloquear accesos no deseados.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-2" className="border-border">
                                                <AccordionTrigger className="text-sm hover:no-underline">Infraestructura</AccordionTrigger>
                                                <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                                                    Servidores Linux de alta disponibilidad, optimizados específicamente para entornos Node.js y ejecución de flujos de trabajo en n8n.
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. FAQs */}
                        <section id="faqs" className="scroll-mt-40 space-y-12">
                            <div className="text-center space-y-4">
                                <HelpCircle className="w-12 h-12 text-primary mx-auto opacity-50" />
                                <h2 className="text-3xl font-bold">Preguntas frecuentes</h2>
                            </div>

                            <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl overflow-hidden">
                                <Accordion type="single" collapsible className="w-full">
                                    {[
                                        { q: "¿Necesito tener un servidor?", a: "Si eliges 'Alojado por Immoralia', no. Nosotros nos ocupamos de todo. Si prefieres usar el tuyo, sí necesitarás un VPS o servidor compatible." },
                                        { q: "¿Qué pasa si se apaga?", a: "Nuestros servidores están monitorizados 24/7. Si hay cualquier problema, nuestro equipo técnico lo soluciona rápidamente para que tus automatizaciones vuelvan a la vida." },
                                        { q: "¿Puedo cambiar de opción más adelante?", a: "Por supuesto. Podemos migrar tus automatizaciones de nuestro servidor al tuyo (o viceversa) cuando lo necesites." },
                                        { q: "¿Qué es un VPS?", a: "Es un Servidor Privado Virtual. Imagina que es un ordenador que 'vive' en internet, que nunca se apaga y está dedicado exclusivamente a tus tareas." },
                                        { q: "¿Cuánto tarda el setup?", a: "Normalmente, entre 24 y 48 horas laborables tenemos todo listo y funcionando para empezar a configurar tus procesos." },
                                        { q: "¿Mis datos están seguros?", a: "Totalmente. n8n corre en un entorno aislado y encriptado. No mezclamos datos de clientes y aplicamos capas de seguridad de nivel bancario." },
                                        { q: "¿Quién paga el servidor si es autoalojado?", a: "En la opción 'Alojado por Immoralia', el coste del servidor ya está incluido en la cuota de mantenimiento que pactemos. En la opción propia, tú pagas a tu proveedor de VPS." }
                                    ].map((faq, i) => (
                                        <AccordionItem key={i} value={`faq-${i}`} className="px-6 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                            <AccordionTrigger className="text-left py-6 hover:no-underline">
                                                <span className="font-bold">{faq.q}</span>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-6 text-muted-foreground">
                                                {faq.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </section>
                    </div>

                    {/* CTA FINAL */}
                    <section className="mt-32 pt-20 border-t border-border text-center space-y-12">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h2 className="text-4xl font-bold tracking-tight">Estamos aquí para ayudarte a elegir</h2>
                            <p className="text-xl text-muted-foreground">
                                Te ayudamos a elegir la opción correcta aunque no tengas conocimientos técnicos.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button size="lg" className="px-8 py-8 text-lg font-bold shadow-xl shadow-primary/20" onClick={() => navigate("/")}>
                                Volver a mi selección
                            </Button>
                            <Button size="lg" variant="outline" className="px-8 py-8 text-lg font-bold border-2" onClick={() => window.open('https://calendly.com/immoralia', '_blank')}>
                                Solicitar ayuda para elegir (15 min)
                            </Button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default SetupInfo;
