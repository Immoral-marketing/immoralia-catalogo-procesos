/**
 * SPEC-05 — Plantilla de email transaccional con identidad Immoralia.
 *
 * Decisiones de diseño (compatibilidad cross-client):
 *  - Header oscuro + acento cian (#00ffff con opacidades sobre fondo negro #0d0d0d).
 *  - Cuerpo en blanco (los emails con body{background:#000} rompen en Outlook desktop
 *    y se ven raros en Gmail dark mode).
 *  - Tablas en lugar de flex para layout (Outlook no soporta flexbox).
 *  - Estilos inline en los elementos críticos (Gmail strippea <style> en algunos casos).
 *  - Tipografía sistema (sin webfonts: máxima compatibilidad).
 *  - Año dinámico, enlace a /privacidad.
 *
 * Ojo: si necesitas un botón CTA, usa `cta-button` en el mainContent.
 */

const PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://immoralia.com'
const CURRENT_YEAR = new Date().getFullYear()

export interface EmailTemplateOptions {
  title: string
  preheader?: string
  mainContent: string
  /** Si quieres sobreescribir el footer estándar */
  footerText?: string
}

const COLORS = {
  bg: '#f5f7fa',
  containerBg: '#ffffff',
  headerBg: '#0d0d0d',
  text: '#1a1a1a',
  textMuted: '#6b7280',
  border: '#e5e7eb',
  accent: '#00b8b8',        // cian más profundo para legibilidad sobre blanco
  accentBg: 'rgba(0, 184, 184, 0.08)',
  accentBorder: 'rgba(0, 184, 184, 0.35)',
}

export function getProfessionalTemplate({ title, preheader, mainContent, footerText }: EmailTemplateOptions): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>${title}</title>
<style>
  body { margin: 0; padding: 0; background-color: ${COLORS.bg}; color: ${COLORS.text}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; }
  table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  a { color: ${COLORS.accent}; text-decoration: underline; }
  .container { max-width: 600px; margin: 32px auto; background-color: ${COLORS.containerBg}; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
  .header { background-color: ${COLORS.headerBg}; padding: 28px 32px; }
  .header-title { color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; margin: 0; line-height: 1.2; }
  .header-accent { color: ${COLORS.accent}; }
  .header-tagline { color: #9ca3af; font-size: 12px; margin: 4px 0 0 0; letter-spacing: 0.06em; text-transform: uppercase; }
  .content { padding: 36px 32px; line-height: 1.65; font-size: 16px; color: ${COLORS.text}; }
  .content h2 { font-size: 22px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.25; color: ${COLORS.text}; }
  .content h3 { font-size: 16px; font-weight: 600; margin: 24px 0 8px 0; color: ${COLORS.text}; }
  .content p { margin: 0 0 14px 0; }
  .content ul { margin: 8px 0 18px 0; padding-left: 22px; }
  .field-label { font-weight: 600; color: ${COLORS.textMuted}; text-transform: uppercase; font-size: 11px; letter-spacing: 0.06em; margin: 0 0 4px 0; display: block; }
  .field-value { margin: 0 0 18px 0; font-size: 15px; color: ${COLORS.text}; }
  .section-title { font-size: 16px; font-weight: 700; margin-top: 28px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid ${COLORS.border}; color: ${COLORS.text}; }
  .cta-button { display: inline-block; background-color: ${COLORS.accent}; color: #ffffff !important; padding: 13px 26px; text-decoration: none !important; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 18px 0 6px 0; }
  .info-card { background-color: ${COLORS.accentBg}; border: 1px solid ${COLORS.accentBorder}; border-radius: 10px; padding: 18px 20px; margin: 18px 0; }
  pre { background-color: #f3f4f6; padding: 14px 16px; border-radius: 8px; white-space: pre-wrap; font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 13px; line-height: 1.55; color: ${COLORS.text}; }
  .footer { padding: 26px 32px 30px 32px; background-color: #fafbfc; border-top: 1px solid ${COLORS.border}; text-align: center; font-size: 12px; color: ${COLORS.textMuted}; line-height: 1.6; }
  .footer a { color: ${COLORS.textMuted}; text-decoration: underline; }
  @media only screen and (max-width: 600px) {
    .container { margin: 0; width: 100%; border-radius: 0; }
    .header { padding: 22px 22px; }
    .content { padding: 28px 22px; font-size: 15px; }
    .footer { padding: 22px; }
  }
</style>
</head>
<body>
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${COLORS.bg};opacity:0;">${preheader}</div>` : ''}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${COLORS.bg};">
    <tr>
      <td align="center" style="padding: 0;">
        <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td class="header">
              <p class="header-title">immoral<span class="header-accent">ia</span></p>
              <p class="header-tagline">Automatización con IA</p>
            </td>
          </tr>
          <tr>
            <td class="content">${mainContent}</td>
          </tr>
          <tr>
            <td class="footer">
              ${footerText ?? `
                © ${CURRENT_YEAR} Immoral Group · <a href="mailto:team@immoralia.es">team@immoralia.es</a><br />
                <a href="${PUBLIC_SITE_URL}/privacidad">Política de privacidad</a>
              `}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
