import React from "react";

const PATTERNS = [
  /\b24\/7\b/g,
  /\ben\s+minutos?\b/gi,
  /\bal\s+instante\b/gi,
  /\ben\s+segundos?\b/gi,
  /\ben\s+tiempo\s+real\b/gi,
  /\b\d+\s*(?:horas?|minutos?|días?|semanas?|meses?)\b/gi,
  /\b\d+\s*%\b/g,
  /\bautomáticamente\b/gi,
  /\bsin\s+trabajo\s+manual\b/gi,
  /\bsin\s+que\s+nadie\b/gi,
  /\bsin\s+perseguir\b/gi,
  /\bsin\s+perder\b/gi,
  /\bsin\s+revisar\b/gi,
  /\bsin\s+llamar\b/gi,
  /\bsin\s+errores?\b/gi,
  /\bantes\s+de\s+que\b/gi,
  /\bcero\s+\w+/gi,
  /\bsin\s+fricci[oó]n\b/gi,
  /\bde\s+forma\s+autom[aá]tica\b/gi,
];

export function highlightText(
  text: string,
  accentTextClass: string
): React.ReactNode {
  const combined = new RegExp(
    PATTERNS.map((p) => p.source).join("|"),
    "gi"
  );

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  combined.lastIndex = 0;
  while ((match = combined.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={match.index} className={`font-semibold ${accentTextClass}`}>
        {match[0]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : <>{text}</>;
}
