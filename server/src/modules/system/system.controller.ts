import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { env } from '../../config/env';

@ApiTags('system')
@Controller()
export class SystemController {
  @Get()
  root(@Res() res: Response) {
    res.status(200).type('html').send(`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Tailor App Backend</title>
          <style>
            :root {
              color-scheme: dark;
              --bg: #07111f;
              --panel: rgba(15, 23, 42, 0.9);
              --accent: #7c3aed;
              --accent-2: #22d3ee;
              --text: #f8fafc;
              --muted: #cbd5e1;
            }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              font-family: Inter, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, var(--bg), #111827 60%, #1e293b);
              color: var(--text);
              min-height: 100vh;
              display: grid;
              place-items: center;
              padding: 24px;
            }
            .card {
              width: min(960px, 100%);
              background: var(--panel);
              border: 1px solid rgba(255,255,255,0.12);
              border-radius: 24px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.35);
              overflow: hidden;
              backdrop-filter: blur(16px);
            }
            .hero {
              padding: 48px;
              display: grid;
              grid-template-columns: 1.2fr 0.8fr;
              gap: 28px;
              align-items: center;
            }
            .badge {
              display: inline-block;
              padding: 8px 12px;
              border-radius: 999px;
              background: rgba(124, 58, 237, 0.2);
              color: #d8b4fe;
              font-size: 0.9rem;
              margin-bottom: 16px;
            }
            h1 { font-size: clamp(2rem, 4vw, 3rem); margin: 0 0 12px; }
            p { color: var(--muted); line-height: 1.7; margin: 0 0 18px; }
            .actions {
              display: flex;
              flex-wrap: wrap;
              gap: 12px;
              margin-top: 24px;
            }
            .btn {
              text-decoration: none;
              padding: 12px 18px;
              border-radius: 999px;
              font-weight: 600;
              transition: transform 0.2s ease;
            }
            .btn:hover { transform: translateY(-2px); }
            .btn-primary {
              background: linear-gradient(135deg, var(--accent), var(--accent-2));
              color: white;
            }
            .btn-secondary {
              background: rgba(255,255,255,0.08);
              color: var(--text);
              border: 1px solid rgba(255,255,255,0.12);
            }
            .panel {
              background: linear-gradient(135deg, rgba(34,211,238,0.16), rgba(124,58,237,0.16));
              border: 1px solid rgba(255,255,255,0.12);
              border-radius: 20px;
              padding: 24px;
            }
            ul { padding-left: 18px; color: var(--muted); }
            li { margin-bottom: 8px; }
            @media (max-width: 780px) {
              .hero { grid-template-columns: 1fr; padding: 28px; }
            }
          </style>
        </head>
        <body>
          <main class="card">
            <section class="hero">
              <div>
                <div class="badge">Tailor App Backend API</div>
                <h1>Craft a better fitting experience for your customers.</h1>
                <p>Welcome to the Tailor App backend. This service powers authentication, shops, orders, measurements, payments, and analytics for your tailoring business.</p>
                <div class="actions">
                  <a class="btn btn-primary" href="/api/docs">Open API Docs</a>
                  <a class="btn btn-secondary" href="/health">Check Health</a>
                </div>
              </div>
              <div class="panel">
                <h3>What’s available</h3>
                <ul>
                  <li>Secure authentication and user management</li>
                  <li>Shop, measurement, and order workflows</li>
                  <li>Payments and real-time notifications</li>
                  <li>Analytics and upload support</li>
                </ul>
              </div>
            </section>
          </main>
        </body>
      </html>`);
  }

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('config')
  config() {
    return {
      nodeEnv: env().nodeEnv,
      port: env().port,
    };
  }
}

