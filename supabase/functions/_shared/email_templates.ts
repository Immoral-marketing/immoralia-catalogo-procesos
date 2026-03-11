/**
 * Professional HTML Email Template Utility
 * Provides a consistent, responsive, and elegant wrapper for all automated communications.
 */

export interface EmailTemplateOptions {
    title: string;
    preheader?: string;
    mainContent: string;
    footerText?: string;
}

export function getProfessionalTemplate({ title, preheader, mainContent, footerText }: EmailTemplateOptions): string {
    const primaryColor = "#020617"; // Dark slate
    const accentColor = "#3b82f6"; // Primary blue
    const grayColor = "#64748b";
    const bgColor = "#f8fafc";
    const whiteColor = "#ffffff";

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: ${bgColor};
            color: ${primaryColor};
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: ${whiteColor};
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
            background-color: ${primaryColor};
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            color: ${whiteColor};
            margin: 0;
            font-size: 24px;
            letter-spacing: -0.025em;
        }
        .content {
            padding: 40px 30px;
            line-height: 1.6;
        }
        .footer {
            padding: 24px 30px;
            background-color: #f1f5f9;
            text-align: center;
            font-size: 13px;
            color: ${grayColor};
        }
        .field-label {
            font-weight: bold;
            color: ${grayColor};
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
            display: block;
        }
        .field-value {
            margin-bottom: 20px;
            font-size: 16px;
        }
        .section-title {
            font-size: 18px;
            font-weight: 700;
            margin-top: 32px;
            margin-bottom: 16px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
        }
        .cta-button {
            display: inline-block;
            background-color: ${accentColor};
            color: ${whiteColor} !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin-top: 24px;
        }
        pre {
            background-color: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            white-space: pre-wrap;
            font-family: inherit;
            font-size: 14px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                margin: 0;
                width: 100%;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    ${preheader ? `<div style="display:none;max-height:0;overflow:hidden">${preheader}</div>` : ""}
    <div class="container">
        <div class="header">
            <h1 style="color:white">Immoralia</h1>
        </div>
        <div class="content">
            ${mainContent}
        </div>
        <div class="footer">
            ${footerText || "© 2024 Immoralia. Todos los derechos reservados.<br>Expertos en automatización y soluciones de IA."}
        </div>
    </div>
</body>
</html>
    `;
}
