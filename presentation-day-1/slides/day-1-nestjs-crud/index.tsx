import type { CSSProperties, ReactNode } from 'react';
import { useSlidePageNumber } from '@open-slide/core';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import brunoLogo from './assets/bruno.svg';
import nestLogo from './assets/nestjs.svg';
import postgresLogo from './assets/postgresql.svg';
import prismaLogo from './assets/prisma.svg';
import nodeLogo from './assets/node.svg';
import pnpmLogo from './assets/pnpm.svg';
import nextLogo from './assets/nextjs.svg';
import redisLogo from './assets/redis.svg';
import outfitFont from './assets/outfit-800.ttf';
import inter500 from './assets/inter-500.ttf';
import inter700 from './assets/inter-700.ttf';

const FONT_STYLE_ID = 'day1-sticker-fonts';
if (typeof document !== 'undefined') {
  let style = document.getElementById(FONT_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = FONT_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent =
    "@font-face{font-family:'OutfitDay1';src:url('" + outfitFont + "') format('truetype');font-weight:800;font-display:swap}" +
    "@font-face{font-family:'InterDay1';src:url('" + inter500 + "') format('truetype');font-weight:500;font-display:swap}" +
    "@font-face{font-family:'InterDay1';src:url('" + inter700 + "') format('truetype');font-weight:700;font-display:swap}";
}

export const design: DesignSystem = {
  palette: { bg: '#fff2e8', text: '#12375b', accent: '#ff4d8d' },
  fonts: {
    display: "'OutfitDay1', 'Outfit', system-ui, sans-serif",
    body: "'InterDay1', 'Inter', system-ui, sans-serif",
  },
  typeScale: { hero: 152, body: 34 },
  radius: 24,
};

const peach = '#fff2e8';
const peachDeep = '#ffe6d3';
const blueInk = '#12375b';
const electric = '#3378e6';
const pink = '#ff4d8d';
const yellow = '#ffd24c';
const cream = '#fffaf4';
const muted = '#657c94';
const dark = '#0c243d';
const mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const display = 'var(--osd-font-display)';
const body = 'var(--osd-font-body)';

const Footer = ({ inverse = false }: { inverse?: boolean }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div style={{ position: 'absolute', left: 110, right: 110, bottom: 46, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: inverse ? peach : muted, fontFamily: body, fontSize: 20, fontWeight: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <i style={{ width: 12, height: 12, borderRadius: '50%', background: pink }} />
        <i style={{ width: 12, height: 12, borderRadius: '50%', background: electric }} />
        <i style={{ width: 12, height: 12, borderRadius: '50%', background: yellow }} />
        <span style={{ marginLeft: 10 }}>NestJS CRUD Task</span>
      </div>
      <span style={{ border: '2px solid currentColor', borderRadius: 100, padding: '5px 17px', fontVariantNumeric: 'tabular-nums' }}>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
  );
};

const Sticker = ({ children, tone = 'pink', tilt = -3, style }: { children: ReactNode; tone?: 'pink' | 'blue' | 'yellow'; tilt?: number; style?: CSSProperties }) => {
  const fill = tone === 'blue' ? electric : tone === 'yellow' ? yellow : pink;
  return <span style={{ display: 'inline-block', background: fill, color: tone === 'yellow' ? blueInk : cream, border: '3px solid ' + blueInk, boxShadow: '5px 5px 0 ' + blueInk, borderRadius: 999, padding: '10px 21px', fontSize: 23, fontWeight: 700, letterSpacing: '0.05em', transform: 'rotate(' + tilt + 'deg)', ...style }}>{children}</span>;
};

const Canvas = ({ children, label, bg = peach, inverse = false }: { children: ReactNode; label?: string; bg?: string; inverse?: boolean }) => (
  <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', position: 'relative', background: bg, color: inverse ? cream : blueInk, fontFamily: body, padding: '88px 110px 106px' }}>
    {label && <div style={{ position: 'absolute', top: 67, left: 110 }}><Sticker tone={inverse ? 'yellow' : 'blue'} tilt={-3}>{label}</Sticker></div>}
    {children}
    <Footer inverse={inverse} />
  </div>
);

const Title = ({ children, size = 68, width, style }: { children: ReactNode; size?: number; width?: number; style?: CSSProperties }) => (
  <h1 style={{ fontFamily: display, fontSize: size, lineHeight: 1.04, letterSpacing: '-0.035em', fontWeight: 800, margin: 0, maxWidth: width, ...style }}>{children}</h1>
);

const Brand = ({ src, name, size = 90, style }: { src: string; name: string; size?: number; style?: CSSProperties }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 17, ...style }}>
    <img src={src} alt={name + ' logo'} style={{ width: size, height: size, objectFit: 'contain' }} />
    <span style={{ fontFamily: display, fontSize: Math.max(28, size * 0.43), lineHeight: 1 }}>{name}</span>
  </div>
);

const CodeWindow = ({ title, children, style }: { title: string; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ background: dark, color: '#e9f3ff', border: '3px solid ' + blueInk, boxShadow: '9px 9px 0 ' + blueInk, borderRadius: 22, overflow: 'hidden', fontFamily: mono, ...style }}>
    <div style={{ height: 54, background: '#183a59', borderBottom: '1px solid #3c5a72', display: 'flex', alignItems: 'center', gap: 11, padding: '0 22px', fontSize: 20, color: '#b9cddd' }}>
      <i style={{ width: 13, height: 13, borderRadius: '50%', background: pink }} /><i style={{ width: 13, height: 13, borderRadius: '50%', background: yellow }} /><i style={{ width: 13, height: 13, borderRadius: '50%', background: electric }} />
      <span style={{ marginLeft: 18 }}>{title}</span>
    </div>
    <div style={{ padding: '20px 27px 23px' }}>{children}</div>
  </div>
);

const CodeLine = ({ n, children, size = 27 }: { n: string; children: ReactNode; size?: number }) => (
  <div style={{ display: 'flex', gap: 22, minHeight: size * 1.57, fontSize: size, lineHeight: 1.52, whiteSpace: 'nowrap' }}><span style={{ width: 36, textAlign: 'right', color: '#66839a', userSelect: 'none' }}>{n}</span><span>{children}</span></div>
);
const Cmd = ({ children }: { children: ReactNode }) => <span style={{ color: '#78d4e6' }}>{children}</span>;
const Str = ({ children }: { children: ReactNode }) => <span style={{ color: '#ffd084' }}>{children}</span>;
const Key = ({ children }: { children: ReactNode }) => <span style={{ color: '#ff9fbd' }}>{children}</span>;
const Dim = ({ children }: { children: ReactNode }) => <span style={{ color: '#91aabd' }}>{children}</span>;

const Rule = ({ style }: { style?: CSSProperties }) => <div style={{ height: 3, background: blueInk, ...style }} />;

const Cover: Page = () => (
  <Canvas>
    <div style={{ position: 'absolute', left: 115, top: 87 }}><Sticker tone="yellow" tilt={-5}>Next.js & NestJS workshop</Sticker></div>
    <Title size={149} width={1330} style={{ position: 'absolute', left: 110, top: 220 }}>Membangun<br />REST API<br />dengan NestJS</Title>
    <div style={{ position: 'absolute', left: 117, top: 757, fontSize: 39, fontWeight: 700 }}>PostgreSQL · Dasar Backend · CRUD Task</div>
    <div style={{ position: 'absolute', right: 116, top: 166, width: 405, height: 405, borderRadius: '50%', background: yellow, border: '4px solid ' + blueInk, boxShadow: '13px 13px 0 ' + blueInk }} />
    <img src={nestLogo} alt="NestJS logo" style={{ position: 'absolute', right: 208, top: 227, width: 215, height: 215, transform: 'rotate(10deg)' }} />
    <img src={postgresLogo} alt="PostgreSQL logo" style={{ position: 'absolute', right: 210, top: 585, width: 157, height: 157, transform: 'rotate(-9deg)' }} />
    <div style={{ position: 'absolute', right: 117, top: 780 }}><Sticker tone="pink" tilt={5}>DAY 1</Sticker></div>
  </Canvas>
);

const Goal: Page = () => (
  <Canvas label="Target kita">
    <Title size={80} width={950} style={{ marginTop: 97 }}>Task Management API<br />yang menyimpan data sungguhan.</Title>
    <div style={{ position: 'absolute', left: 118, top: 494, fontSize: 43, lineHeight: 1.35, width: 700 }}>Create. Read. Update. Delete.<br />Satu Task, lima endpoint.</div>
    <div style={{ position: 'absolute', right: 137, top: 231, transform: 'rotate(3deg)', background: cream, border: '3px solid ' + blueInk, boxShadow: '13px 13px 0 ' + blueInk, borderRadius: 27, padding: '42px 48px', width: 588, height: 497, boxSizing: 'border-box' }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: muted }}>TASK 001</div>
      <div style={{ fontFamily: display, fontSize: 65, lineHeight: 1.05, marginTop: 40 }}>Belajar<br />NestJS</div>
      <Rule style={{ marginTop: 54, width: '100%' }} />
      <div style={{ fontFamily: mono, fontSize: 29, marginTop: 28 }}>completed: <span style={{ color: pink }}>false</span></div>
    </div>
    <div style={{ position: 'absolute', left: 120, bottom: 181, fontSize: 31, color: muted }}>Hari ini Bruno menjadi client. Day 2 memakai Next.js.</div>
  </Canvas>
);

const Workshop: Page = () => (
  <Canvas label="Peta workshop" bg={blueInk} inverse>
    <Title size={80} style={{ marginTop: 99 }}>Satu project. Empat hari.</Title>
    <div style={{ position: 'absolute', left: 110, right: 110, top: 426, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
      <div><div style={{ fontFamily: display, fontSize: 120, color: yellow }}>01</div><Rule style={{ background: yellow, margin: '18px 0 25px' }} /><div style={{ fontSize: 36, fontWeight: 700 }}>NestJS<br />REST API<br />PostgreSQL</div></div>
      <div><div style={{ fontFamily: display, fontSize: 120, color: pink }}>02</div><Rule style={{ background: pink, margin: '18px 0 25px' }} /><div style={{ fontSize: 36, fontWeight: 700 }}>Next.js<br />Integrasi API</div></div>
      <div><div style={{ fontFamily: display, fontSize: 120, color: '#88beff' }}>03</div><Rule style={{ background: '#88beff', margin: '18px 0 25px' }} /><div style={{ fontSize: 36, fontWeight: 700 }}>Authentication<br />Protected API</div></div>
      <div><div style={{ fontFamily: display, fontSize: 120, color: cream }}>04</div><Rule style={{ background: cream, margin: '18px 0 25px' }} /><div style={{ fontSize: 36, fontWeight: 700 }}>Presentasi<br />project akhir</div></div>
    </div>
  </Canvas>
);

const Backend: Page = () => (
  <Canvas label="Peran tiap bagian">
    <Title size={81} width={1000} style={{ marginTop: 101 }}>Apa yang dikerjakan Backend?</Title>
    <div style={{ position: 'absolute', left: 115, top: 380, width: 1070, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 35 }}>
      <div><Brand src={nextLogo} name="Frontend" size={72} /><Rule style={{ margin: '34px 0 23px' }} /><p style={{ fontSize: 33, lineHeight: 1.35, margin: 0 }}>UI dan interaksi pengguna</p></div>
      <div><Brand src={nestLogo} name="Backend" size={72} /><Rule style={{ margin: '34px 0 23px', background: pink }} /><p style={{ fontSize: 33, lineHeight: 1.35, margin: 0 }}>Aturan aplikasi, Validation, akses data</p></div>
      <div><Brand src={postgresLogo} name="Database" size={72} /><Rule style={{ margin: '34px 0 23px' }} /><p style={{ fontSize: 33, lineHeight: 1.35, margin: 0 }}>Data tetap tersimpan</p></div>
    </div>
    <div style={{ position: 'absolute', right: 116, top: 356, width: 444, height: 422, border: '4px solid ' + blueInk, borderRadius: '50%', background: yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transform: 'rotate(7deg)' }}><span style={{ fontFamily: display, fontSize: 43, lineHeight: 1.13 }}>PATCH<br />/tasks/:id<br /><span style={{ color: electric }}>completed<br />true</span></span></div>
  </Canvas>
);

const NestFundamental: Page = () => (
  <Canvas label="Dasar NestJS">
    <Title size={78} width={1260} style={{ marginTop: 99 }}>NestJS membantu kita menyusun aplikasi Backend.</Title>
    <div style={{ position: 'absolute', left: 132, top: 459, display: 'flex', alignItems: 'center', gap: 38 }}>
      <img src={nestLogo} alt="NestJS logo" style={{ width: 214, height: 214 }} />
      <div style={{ fontFamily: display, fontSize: 68, lineHeight: 1.02 }}>NestJS<br /><span style={{ color: electric }}>berjalan di Node.js</span></div>
    </div>
    <div style={{ position: 'absolute', right: 128, top: 332, width: 564 }}>
      <div style={{ borderTop: '3px solid ' + blueInk, padding: '17px 0 27px', fontSize: 34 }}><strong>Struktur</strong><br /><span style={{ color: muted }}>Module mengelompokkan feature</span></div>
      <div style={{ borderTop: '3px solid ' + blueInk, padding: '17px 0 27px', fontSize: 34 }}><strong>Dependency Injection</strong><br /><span style={{ color: muted }}>Nest menyiapkan Service yang diperlukan</span></div>
      <div style={{ borderTop: '3px solid ' + blueInk, padding: '17px 0 27px', fontSize: 34 }}><strong>Alur Request</strong><br /><span style={{ color: muted }}>Controller, Pipes, Service</span></div>
    </div>
    <div style={{ position: 'absolute', left: 132, top: 743, width: 960, fontSize: 31, lineHeight: 1.4 }}>Node.js menjalankan program. NestJS menata route, operasi aplikasi, dan HTTP Response.</div>
  </Canvas>
);

const NestAnalogy: Page = () => (
  <Canvas label="Analogi NestJS" bg={yellow}>
    <Title size={80} width={1160} style={{ marginTop: 94 }}>Bayangkan layanan Task seperti restoran.</Title>
    <div style={{ position: 'absolute', left: 123, top: 350, width: 1110, height: 503, background: cream, border: '4px solid ' + blueInk, boxShadow: '16px 16px 0 ' + electric, transform: 'rotate(-2deg)', padding: '37px 55px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 29, fontWeight: 700 }}><span>PESANAN TASK</span><span>POST /tasks</span></div>
      <Rule style={{ margin: '25px 0 29px' }} />
      <div style={{ fontFamily: display, fontSize: 42, lineHeight: 1.45 }}><span style={{ color: electric, marginRight: 15 }}>01</span>TasksModule <span style={{ fontFamily: body, fontSize: 32, color: muted }}>menyiapkan tim</span><br /><span style={{ color: pink, marginRight: 15 }}>02</span>TasksController <span style={{ fontFamily: body, fontSize: 32, color: muted }}>menerima pesanan</span><br /><span style={{ color: electric, marginRight: 15 }}>03</span>TasksService <span style={{ fontFamily: body, fontSize: 32, color: muted }}>mengerjakannya</span></div>
      <Rule style={{ margin: '24px 0 19px' }} />
      <div style={{ fontFamily: mono, fontSize: 28 }}>title: <span style={{ color: electric }}>"Belajar NestJS"</span></div>
    </div>
    <div style={{ position: 'absolute', right: 122, top: 420, width: 440, fontFamily: display, fontSize: 53, lineHeight: 1.12 }}>Module<br /><span style={{ color: electric }}>mengumpulkan.</span><br />Controller<br /><span style={{ color: pink }}>menerima.</span><br />Service<br /><span style={{ color: electric }}>mengerjakan.</span></div>
    <img src={nestLogo} alt="NestJS logo" style={{ position: 'absolute', right: 146, top: 146, width: 140, height: 140, transform: 'rotate(9deg)' }} />
  </Canvas>
);

const RealProject: Page = () => (
  <Canvas label="Contoh nyata" bg={yellow}>
    <Title size={79} width={1280} style={{ marginTop: 106 }}>Kenapa saya memakai NestJS<br />di project nyata?</Title>
    <div style={{ position: 'absolute', left: 120, top: 426, fontSize: 38, fontWeight: 700, maxWidth: 730, lineHeight: 1.4 }}>Financial Management System<br />Koperasi Kamorina Surya Niaga</div>
    <div style={{ position: 'absolute', left: 120, top: 678, fontSize: 32, maxWidth: 738, lineHeight: 1.4 }}>Saat feature bertambah, Module membantu merapikan kode. Controller menerima Request; Service mengerjakan operasinya.</div>
    <div style={{ position: 'absolute', right: 132, top: 376, width: 640, height: 410, border: '4px solid ' + blueInk, borderRadius: '50%', background: peach, transform: 'rotate(-7deg)' }} />
    <Brand src={nextLogo} name="Next.js" size={75} style={{ position: 'absolute', right: 440, top: 411, transform: 'rotate(-5deg)' }} />
    <Brand src={nestLogo} name="NestJS" size={91} style={{ position: 'absolute', right: 208, top: 523, transform: 'rotate(5deg)' }} />
    <Brand src={postgresLogo} name="PostgreSQL" size={79} style={{ position: 'absolute', right: 331, top: 675, transform: 'rotate(-4deg)' }} />
    <Brand src={redisLogo} name="Redis" size={66} style={{ position: 'absolute', right: 164, top: 761, transform: 'rotate(6deg)' }} />
  </Canvas>
);

const Tools: Page = () => (
  <Canvas label="Peralatan">
    <Title size={88} style={{ marginTop: 94 }}>Tools untuk hari ini.</Title>
    <div style={{ position: 'absolute', left: 129, top: 361 }}><Brand src={nodeLogo} name="Node.js" size={107} /></div>
    <div style={{ position: 'absolute', left: 742, top: 321 }}><Brand src={pnpmLogo} name="pnpm" size={106} /></div>
    <div style={{ position: 'absolute', right: 183, top: 371 }}><Brand src={nestLogo} name="NestJS" size={110} /></div>
    <div style={{ position: 'absolute', left: 214, top: 617 }}><Brand src={brunoLogo} name="Bruno" size={122} /></div>
    <div style={{ position: 'absolute', left: 815, top: 607 }}><Brand src={prismaLogo} name="Prisma" size={109} /></div>
    <div style={{ position: 'absolute', right: 145, top: 647 }}><Brand src={postgresLogo} name="PostgreSQL" size={101} /></div>
    <div style={{ position: 'absolute', left: 110, right: 110, top: 554, height: 3, background: blueInk }} />
    <div style={{ position: 'absolute', right: 124, top: 134 }}><Sticker tone="pink" tilt={7}>VS Code atau editor pilihanmu</Sticker></div>
  </Canvas>
);

const Preflight: Page = () => (
  <Canvas label="Preflight">
    <Title size={80} style={{ marginTop: 100 }}>Cek environment dulu.</Title>
    <div style={{ position: 'absolute', left: 110, top: 319, width: 793 }}><CodeWindow title="macOS Terminal" style={{ height: 462 }}>
      <CodeLine n="1"><Cmd>node</Cmd> --version</CodeLine>
      <CodeLine n="2"><Cmd>npm</Cmd> --version</CodeLine>
      <CodeLine n="3"><Cmd>git</Cmd> --version</CodeLine>
      <CodeLine n="4"><Cmd>docker</Cmd> --version</CodeLine>
      <CodeLine n="5"><Dim># Docker untuk PostgreSQL lokal saja</Dim></CodeLine>
    </CodeWindow></div>
    <div style={{ position: 'absolute', right: 110, top: 319, width: 793 }}><CodeWindow title="Windows PowerShell" style={{ height: 462 }}>
      <CodeLine n="1"><Cmd>node</Cmd> --version</CodeLine>
      <CodeLine n="2"><Cmd>npm</Cmd> --version</CodeLine>
      <CodeLine n="3"><Cmd>git</Cmd> --version</CodeLine>
      <CodeLine n="4"><Cmd>docker</Cmd> --version</CodeLine>
      <CodeLine n="5"><Dim># Docker untuk PostgreSQL lokal saja</Dim></CodeLine>
    </CodeWindow></div>
    <div style={{ position: 'absolute', left: 118, top: 833, fontSize: 30, fontWeight: 700 }}>Node.js 20.19+ atau 22.12+ atau 24+ <span style={{ color: electric, padding: '0 16px' }}>·</span> PostgreSQL siap sebelum migrasi</div>
  </Canvas>
);

const Pnpm: Page = () => (
  <Canvas label="Package manager" bg={peachDeep}>
    <img src={pnpmLogo} alt="pnpm logo" style={{ position: 'absolute', left: 130, top: 316, width: 230, height: 230 }} />
    <Title size={82} style={{ position: 'absolute', left: 398, top: 323 }}>Kenapa pnpm?</Title>
    <div style={{ position: 'absolute', left: 134, top: 622, width: 620, fontSize: 35, lineHeight: 1.45 }}><strong>Versi 10</strong> sesuai repo ini.<br /><strong>Lockfile</strong> menyamakan dependency.<br /><strong>Shared store</strong> menghemat disk.</div>
    <div style={{ position: 'absolute', right: 119, top: 322, width: 760 }}><CodeWindow title="macOS Terminal atau Windows PowerShell" style={{ height: 475 }}>
      <CodeLine n="1"><Cmd>pnpm</Cmd> --version</CodeLine>
      <CodeLine n="2"><Cmd>npm</Cmd> install --global <Str>pnpm@10</Str></CodeLine>
      <CodeLine n="3"><Cmd>pnpm</Cmd> --version</CodeLine>
      <CodeLine n="4"><Cmd>cd</Cmd> backend</CodeLine>
      <CodeLine n="5"><Cmd>pnpm</Cmd> install --frozen-lockfile</CodeLine>
    </CodeWindow></div>
    <div style={{ position: 'absolute', right: 119, top: 827, fontSize: 24, color: muted }}>Mulai dari folder utama repository.</div>
  </Canvas>
);

const Api: Page = () => (
  <Canvas label="Kontrak API">
    <Title size={82} width={1200} style={{ marginTop: 101 }}>API adalah kontrak komunikasi.</Title>
    <div style={{ position: 'absolute', left: 125, top: 376, width: 710 }}><CodeWindow title="request.http" style={{ height: 306 }}>
      <CodeLine n="1"><Key>POST</Key> /tasks</CodeLine>
      <CodeLine n="2">Content-Type: application/json</CodeLine>
      <CodeLine n="3"> </CodeLine>
      <CodeLine n="4">{'{ '}<Key>"title"</Key>: <Str>"Belajar NestJS"</Str>{' }'}</CodeLine>
    </CodeWindow></div>
    <div style={{ position: 'absolute', right: 124, top: 434, width: 696 }}><CodeWindow title="response.json" style={{ height: 310 }}>
      <CodeLine n="1"><Cmd>201 Created</Cmd></CodeLine>
      <CodeLine n="2">{'{ '}<Key>"id"</Key>: 7,</CodeLine>
      <CodeLine n="3">  <Key>"title"</Key>: <Str>"Belajar NestJS"</Str>,</CodeLine>
      <CodeLine n="4">  <Key>"completed"</Key>: false {' }'}</CodeLine>
    </CodeWindow></div>
    <div style={{ position: 'absolute', left: 127, top: 756, fontSize: 33, maxWidth: 850 }}>Client tahu endpoint dan format Response. Detail database diatur Backend.</div>
    <div style={{ position: 'absolute', right: 196, top: 161 }}><Sticker tone="yellow" tilt={8}>Dikirim lewat Bruno</Sticker></div>
  </Canvas>
);

const Anatomy: Page = () => (
  <Canvas label="HTTP Request" bg={yellow}>
    <Title size={84} style={{ marginTop: 101 }}>Anatomi HTTP Request.</Title>
    <div style={{ position: 'absolute', left: 118, top: 363, width: 995 }}><CodeWindow title="create-task.http" style={{ height: 426 }}>
      <CodeLine n="1"><Key>POST</Key> /tasks</CodeLine>
      <CodeLine n="2">Content-Type: application/json</CodeLine>
      <CodeLine n="3"> </CodeLine>
      <CodeLine n="4">{'{ '}</CodeLine>
      <CodeLine n="5">  <Key>"title"</Key>: <Str>"Belajar NestJS"</Str>,</CodeLine>
      <CodeLine n="6">  <Key>"description"</Key>: <Str>"Workshop Day 1"</Str></CodeLine>
      <CodeLine n="7">{' }'}</CodeLine>
    </CodeWindow></div>
    <div style={{ position: 'absolute', right: 125, top: 349, width: 540 }}>
      <div style={{ borderTop: '3px solid ' + blueInk, padding: '16px 0 22px', fontSize: 34 }}><strong>Method</strong> <span style={{ color: electric }}>POST</span></div>
      <div style={{ borderTop: '3px solid ' + blueInk, padding: '16px 0 22px', fontSize: 34 }}><strong>Endpoint</strong> <span style={{ color: electric }}>/tasks</span></div>
      <div style={{ borderTop: '3px solid ' + blueInk, padding: '16px 0 22px', fontSize: 34 }}><strong>Header</strong> <span style={{ color: electric }}>JSON</span></div>
      <div style={{ borderTop: '3px solid ' + blueInk, padding: '16px 0 22px', fontSize: 34 }}><strong>Body</strong> <span style={{ color: electric }}>data Task</span></div>
    </div>
  </Canvas>
);

const Crud: Page = () => (
  <Canvas label="CRUD">
    <Title size={89} style={{ marginTop: 97 }}>CRUD punya lima route.</Title>
    <div style={{ position: 'absolute', left: 114, right: 114, top: 358 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '350px 300px 1fr', padding: '18px 0', borderTop: '4px solid ' + blueInk, fontSize: 34 }}><strong>Create</strong><span style={{ color: pink, fontWeight: 700 }}>POST</span><span style={{ fontFamily: mono }}>/tasks</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '350px 300px 1fr', padding: '18px 0', borderTop: '2px solid ' + blueInk, fontSize: 34 }}><strong>Read semua</strong><span style={{ color: electric, fontWeight: 700 }}>GET</span><span style={{ fontFamily: mono }}>/tasks</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '350px 300px 1fr', padding: '18px 0', borderTop: '2px solid ' + blueInk, fontSize: 34 }}><strong>Read satu</strong><span style={{ color: electric, fontWeight: 700 }}>GET</span><span style={{ fontFamily: mono }}>/tasks/:id</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '350px 300px 1fr', padding: '18px 0', borderTop: '2px solid ' + blueInk, fontSize: 34, background: peachDeep }}><strong>Update</strong><span style={{ color: pink, fontWeight: 700 }}>PATCH</span><span style={{ fontFamily: mono }}>/tasks/:id</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '350px 300px 1fr', padding: '18px 0', borderTop: '2px solid ' + blueInk, borderBottom: '4px solid ' + blueInk, fontSize: 34 }}><strong>Delete</strong><span style={{ color: electric, fontWeight: 700 }}>DELETE</span><span style={{ fontFamily: mono }}>/tasks/:id</span></div>
    </div>
  </Canvas>
);

const Status: Page = () => (
  <Canvas label="HTTP Response" bg={electric} inverse>
    <Title size={87} style={{ marginTop: 95 }}>Status code menjelaskan hasil Request.</Title>
    <div style={{ position: 'absolute', left: 116, right: 116, top: 463, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
      <div><div style={{ fontFamily: display, fontSize: 113, color: yellow }}>200</div><Rule style={{ background: cream, margin: '7px 0 20px' }} /><div style={{ fontSize: 31 }}>OK</div></div>
      <div><div style={{ fontFamily: display, fontSize: 113, color: cream }}>201</div><Rule style={{ background: cream, margin: '7px 0 20px' }} /><div style={{ fontSize: 31 }}>Created</div></div>
      <div><div style={{ fontFamily: display, fontSize: 113, color: '#ffb6d0' }}>400</div><Rule style={{ background: cream, margin: '7px 0 20px' }} /><div style={{ fontSize: 31 }}>Bad Request</div></div>
      <div><div style={{ fontFamily: display, fontSize: 113, color: yellow }}>404</div><Rule style={{ background: cream, margin: '7px 0 20px' }} /><div style={{ fontSize: 31 }}>Not Found</div></div>
      <div><div style={{ fontFamily: display, fontSize: 113, color: cream }}>500</div><Rule style={{ background: cream, margin: '7px 0 20px' }} /><div style={{ fontSize: 31 }}>Internal Server Error</div></div>
    </div>
    <div style={{ position: 'absolute', left: 115, top: 800, fontSize: 33 }}>Task dibuat: 201 · Input salah: 400 · Task tidak ada saat GET: 404</div>
  </Canvas>
);

const Organization: Page = () => (
  <Canvas label="Struktur NestJS">
    <Title size={80} width={1430} style={{ marginTop: 101 }}>Tiga peran itu ada di kode Task.</Title>
    <div style={{ position: 'absolute', left: 128, top: 351, width: 1588, fontSize: 32 }}>
      <div style={{ borderTop: '4px solid ' + blueInk, padding: '19px 0 23px', display: 'grid', gridTemplateColumns: '435px 1fr' }}><strong style={{ fontFamily: display, fontSize: 42, color: electric }}>TasksModule</strong><span>Mengumpulkan Controller dan Service. Mengimpor PrismaModule.</span></div>
      <div style={{ borderTop: '3px solid ' + blueInk, padding: '19px 0 23px', display: 'grid', gridTemplateColumns: '435px 1fr' }}><strong style={{ fontFamily: display, fontSize: 42, color: pink }}>TasksController</strong><span>Mengenali route HTTP, menerima input, lalu memanggil Service.</span></div>
      <div style={{ borderTop: '3px solid ' + blueInk, borderBottom: '4px solid ' + blueInk, padding: '19px 0 23px', display: 'grid', gridTemplateColumns: '435px 1fr' }}><strong style={{ fontFamily: display, fontSize: 42, color: electric }}>TasksService</strong><span>Mengerjakan operasi Task dan memakai PrismaService untuk data.</span></div>
    </div>
    <div style={{ position: 'absolute', left: 132, top: 764, fontSize: 28, color: muted }}>AppModule memulai aplikasi. Nest memberikan Service yang dibutuhkan Controller melalui Dependency Injection.</div>
    <img src={nestLogo} alt="NestJS logo" style={{ position: 'absolute', right: 135, top: 129, width: 124, height: 124, transform: 'rotate(10deg)' }} />
  </Canvas>
);

const RequestFlow: Page = () => (
  <Canvas label="Alur Request" bg={peachDeep}>
    <Title size={80} style={{ marginTop: 96 }}>Ikuti satu POST /tasks.</Title>
    <div style={{ position: 'absolute', left: 228, top: 336, width: 5, height: 553, background: blueInk }} />
    <div style={{ position: 'absolute', left: 178, top: 341, display: 'grid', gridTemplateRows: 'repeat(6, 93px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}><span style={{ background: pink, border: '3px solid ' + blueInk, borderRadius: '50%', width: 102, height: 102, display: 'grid', placeItems: 'center', fontFamily: display, fontSize: 41 }}>01</span><span style={{ fontSize: 37, fontWeight: 700 }}>Bruno mengirim HTTP Request</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}><span style={{ background: yellow, border: '3px solid ' + blueInk, borderRadius: '50%', width: 102, height: 102, display: 'grid', placeItems: 'center', fontFamily: display, fontSize: 41 }}>02</span><span style={{ fontSize: 37, fontWeight: 700 }}>TasksController mengenali route</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}><span style={{ background: cream, border: '3px solid ' + blueInk, borderRadius: '50%', width: 102, height: 102, display: 'grid', placeItems: 'center', fontFamily: display, fontSize: 41 }}>03</span><span style={{ fontSize: 37, fontWeight: 700 }}>ValidationPipe memeriksa DTO</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}><span style={{ background: pink, border: '3px solid ' + blueInk, borderRadius: '50%', width: 102, height: 102, display: 'grid', placeItems: 'center', fontFamily: display, fontSize: 41 }}>04</span><span style={{ fontSize: 37, fontWeight: 700 }}>TasksService mengerjakan operasi</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}><span style={{ background: yellow, border: '3px solid ' + blueInk, borderRadius: '50%', width: 102, height: 102, display: 'grid', placeItems: 'center', fontFamily: display, fontSize: 41 }}>05</span><span style={{ fontSize: 37, fontWeight: 700 }}>Prisma menyimpan ke PostgreSQL</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}><span style={{ background: cream, border: '3px solid ' + blueInk, borderRadius: '50%', width: 102, height: 102, display: 'grid', placeItems: 'center', fontFamily: display, fontSize: 41 }}>06</span><span style={{ fontSize: 37, fontWeight: 700 }}>HTTP Response mengirim 201</span></div>
    </div>
    <div style={{ position: 'absolute', right: 137, top: 380, width: '522.63px', fontFamily: display, fontSize: 52, lineHeight: 1.12, color: electric, minWidth: '0px', minHeight: '0px', maxWidth: 'none', maxHeight: 'none', flexShrink: '0', flexGrow: '0', flexBasis: 'auto', height: '187.83px', translate: '0px 0px' }}>Satu Request.<br />Enam tahap.<br />Satu gambaran alur.</div>
  </Canvas>
);

const Prisma: Page = () => (
  <Canvas label="Akses data">
    <Title size={82} style={{ marginTop: 94 }}>Prisma dan PostgreSQL punya peran berbeda.</Title>
    <div style={{ position: 'absolute', left: 133, top: 371, width: 700 }}><img src={prismaLogo} alt="Prisma logo" style={{ width: 165, height: 165 }} /><div style={{ fontFamily: display, fontSize: 69, marginTop: 16 }}>Prisma</div><Rule style={{ width: 570, margin: '20px 0' }} /><div style={{ fontSize: 38, lineHeight: 1.35 }}>Alat akses data.<br />Service memakai Prisma Client.</div></div>
    <div style={{ position: 'absolute', left: 954, top: 371, height: 441, width: 3, background: blueInk }} />
    <div style={{ position: 'absolute', right: 128, top: 371, width: 690 }}><img src={postgresLogo} alt="PostgreSQL logo" style={{ width: 165, height: 165 }} /><div style={{ fontFamily: display, fontSize: 69, marginTop: 16 }}>PostgreSQL</div><Rule style={{ width: 570, margin: '20px 0' }} /><div style={{ fontSize: 38, lineHeight: 1.35 }}>Database.<br />Task tetap tersimpan saat aplikasi ditutup.</div></div>
  </Canvas>
);

const PrismaWorkflow: Page = () => (
  <Canvas label="Cara kerja Prisma" bg={peachDeep}>
    <Title size={80} width={1480} style={{ marginTop: 93 }}>Model Task menjadi tabel dan API data.</Title>
    <div style={{ position: 'absolute', left: 124, top: 307, width: 792 }}><CodeWindow title="schema.prisma · cuplikan" style={{ height: 320 }}>
      <CodeLine n="1" size={24}><Key>model</Key> Task {'{'}</CodeLine>
      <CodeLine n="2" size={24}>  id          Int <Cmd>@id</Cmd> <Cmd>@default</Cmd>(autoincrement())</CodeLine>
      <CodeLine n="3" size={24}>  title       String</CodeLine>
      <CodeLine n="4" size={24}>  completed   Boolean <Cmd>@default</Cmd>(false)</CodeLine>
      <CodeLine n="5" size={24}>{'}'}</CodeLine>
    </CodeWindow></div>
    <div style={{ position: 'absolute', right: 126, top: 325, width: 700, fontSize: 32, lineHeight: 1.46 }}>
      <div><strong style={{ color: electric }}>01 Schema</strong><br />Menjelaskan bentuk Task.</div>
      <div style={{ marginTop: 24 }}><strong style={{ color: pink }}>02 Migrate</strong><br />Membuat tabel di PostgreSQL.</div>
      <div style={{ marginTop: 24 }}><strong style={{ color: electric }}>03 Prisma Client</strong><br />Menyediakan method untuk kode.</div>
    </div>
    <div style={{ position: 'absolute', left: 124, top: 690, width: 1098 }}><CodeWindow title="tasks.service.ts" style={{ height: 153 }}>
      <CodeLine n="1" size={29}><Cmd>this</Cmd>.prismaService.task.<Key>create</Key>({'{ '}data: body{' }'})</CodeLine>
    </CodeWindow></div>
    <img src={prismaLogo} alt="Prisma logo" style={{ position: 'absolute', right: 167, top: 742, width: 126, height: 126 }} />
  </Canvas>
);

const Validation: Page = () => (
  <Canvas label="Validation" bg={blueInk} inverse>
    <Title size={84} style={{ marginTop: 95 }}>Input yang salah dihentikan sebelum diproses.</Title>
    <div style={{ position: 'absolute', left: 118, top: 389, width: 760 }}><CodeWindow title="valid-request.json" style={{ height: 243 }}>
      <CodeLine n="1">{'{ '}<Key>"title"</Key>: <Str>"Belajar NestJS"</Str>{' }'}</CodeLine>
      <CodeLine n="2"> </CodeLine>
    </CodeWindow><div style={{ marginTop: 28 }}><Sticker tone="yellow" tilt={-3}>Input diterima</Sticker></div></div>
    <div style={{ position: 'absolute', right: 118, top: 389, width: 760 }}><CodeWindow title="invalid-request.json" style={{ height: 243 }}>
      <CodeLine n="1">{'{ '}<Key>"title"</Key>: 123,</CodeLine>
      <CodeLine n="2">  <Key>"randomField"</Key>: true {' }'}</CodeLine>
    </CodeWindow><div style={{ marginTop: 28 }}><Sticker tone="pink" tilt={3}>400 Bad Request</Sticker></div></div>
    <div style={{ position: 'absolute', left: 122, top: 800, fontSize: 33 }}>DTO menjelaskan bentuk input. ValidationPipe memeriksa JSON saat Request masuk.</div>
  </Canvas>
);

const DataModel: Page = () => (
  <Canvas label="Data model">
    <Title size={89} style={{ marginTop: 94 }}>Model Task Day 1.</Title>
    <div style={{ position: 'absolute', left: 113, right: 113, top: 337 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '480px 320px 1fr', borderTop: '4px solid ' + blueInk, padding: '13px 20px', fontSize: 32 }}><strong>id</strong><span>Int</span><span style={{ color: muted }}>dibuat otomatis</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '480px 320px 1fr', borderTop: '2px solid ' + blueInk, padding: '13px 20px', fontSize: 32 }}><strong>title</strong><span>String</span><span style={{ color: muted }}>wajib</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '480px 320px 1fr', borderTop: '2px solid ' + blueInk, padding: '13px 20px', fontSize: 32 }}><strong>description</strong><span>String?</span><span style={{ color: muted }}>opsional</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '480px 320px 1fr', borderTop: '2px solid ' + blueInk, padding: '13px 20px', background: yellow, fontSize: 32 }}><strong>completed</strong><span>Boolean</span><span>default false</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '480px 320px 1fr', borderTop: '2px solid ' + blueInk, padding: '13px 20px', fontSize: 32 }}><strong>createdAt</strong><span>DateTime</span><span style={{ color: muted }}>dibuat otomatis</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '480px 320px 1fr', borderTop: '2px solid ' + blueInk, borderBottom: '4px solid ' + blueInk, padding: '13px 20px', fontSize: 32 }}><strong>updatedAt</strong><span>DateTime</span><span style={{ color: muted }}>diperbarui otomatis</span></div>
    </div>
    <div style={{ position: 'absolute', right: 115, top: 143 }}><Sticker tone="pink" tilt={7}>default false</Sticker></div>
  </Canvas>
);

const Roadmap: Page = () => (
  <Canvas label="Live coding" bg={yellow}>
    <Title size={84} style={{ marginTop: 96 }}>Buat. Uji. Perbaiki. Ulangi.</Title>
    <div style={{ position: 'absolute', left: 125, top: 328, width: 760, fontSize: 35, lineHeight: 1.58 }}>
      <div><strong>01</strong>  day-1-starter dan PostgreSQL</div>
      <div><strong>02</strong>  GET dengan data sementara</div>
      <div><strong>03</strong>  Service dan POST</div>
      <div><strong>04</strong>  Coba input salah, lihat masalahnya</div>
      <div><strong>05</strong>  DTO dan ValidationPipe</div>
      <div><strong>06</strong>  Prisma dan database</div>
      <div><strong>07</strong>  GET detail, PATCH, DELETE</div>
    </div>
    <div style={{ position: 'absolute', right: 123, top: 352, width: 658, height: 452, borderRadius: '50%', border: '4px solid ' + blueInk, background: peach, transform: 'rotate(7deg)', display: 'grid', placeItems: 'center', textAlign: 'center' }}><span style={{ fontFamily: display, fontSize: 55, lineHeight: 1.16 }}>Satu Task<br />dari Bruno<br />ke PostgreSQL</span></div>
  </Canvas>
);

const Closing: Page = () => (
  <Canvas label="Ingat alurnya" bg={blueInk} inverse>
    <Title size={104} width={1580} style={{ marginTop: 106 }}>Ikuti perjalanan Request.<br />Struktur kodenya jadi lebih jelas.</Title>
    <div style={{ position: 'absolute', left: 116, right: 116, top: 553, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: display, fontSize: 39 }}>
      <span>Client</span><span style={{ color: pink }}>●</span><span>Controller</span><span style={{ color: yellow }}>●</span><span>Validation</span><span style={{ color: pink }}>●</span><span>Service</span><span style={{ color: yellow }}>●</span><span>Prisma</span><span style={{ color: pink }}>●</span><span>PostgreSQL</span>
    </div>
    <Rule style={{ position: 'absolute', left: 117, right: 117, top: 642, background: cream }} />
    <div style={{ position: 'absolute', left: 117, top: 733, fontSize: 38, lineHeight: 1.3 }}>Sekarang buka VS Code. Kita ikuti Task “Belajar NestJS” sampai tersimpan.</div>
  </Canvas>
);

export const notes: (string | undefined)[] = [
  `Durasi ±45 detik. Perkenalkan sesi Day 1 sebagai fondasi backend. Hari ini kita membuat REST API untuk task workshop yang benar-benar tersimpan di PostgreSQL. Setelah presentasi singkat, kita akan live coding. Fokus paparan ini adalah alur, bukan sintaks. Saat tombol buat, ubah, atau hapus hadir di frontend pada Day 2, request akan masuk ke backend yang kita pahami hari ini.`,
  `Durasi ±1 menit. Hasil akhirnya adalah Task Management API dengan lima operasi: membuat, membaca semua, membaca satu, mengubah, dan menghapus task. Ada validasi request dan penanganan error sederhana. Hari ini Bruno menjadi client; Day 2 Next.js akan memakai kontrak API yang sama. Contoh task berjudul Belajar NestJS dimulai dengan completed false. Pada Day 1 seluruh task masih berada dalam daftar bersama.`,
  `Durasi ±1 menit. Bacakan perjalanan empat hari tanpa membahas detail hari berikutnya. Day 1 menyelesaikan alur request, validasi, logika, dan penyimpanan data. Day 2 memasang frontend Next.js di atas API ini. Day 3 baru menambahkan identitas pengguna dan API yang terlindungi. Day 4 peserta mempresentasikan project. Bayangkan satu Task yang sama makin lengkap dari hari ke hari.`,
  `Durasi ±1,5 menit. Frontend mengurus tampilan dan interaksi, backend mengurus aturan dan operasi data, database menyimpan data. Saat pengguna mencentang Task di UI, frontend kelak mengirim PATCH /tasks/:id dengan completed true. Backend memprosesnya dan PostgreSQL menyimpan nilai baru. Di workshop ini Next.js tidak berbicara langsung dengan PostgreSQL; NestJS menjadi lapisan aplikasinya.`,
  `Durasi ±2 menit. NestJS adalah framework untuk membangun aplikasi Backend dengan Node.js. Node.js menjalankan programnya; NestJS membantu kita menyusun penerimaan HTTP Request, pembagian tanggung jawab, dan pengiriman HTTP Response. Framework ini tidak menyimpan data; PostgreSQL melakukannya. Saat feature bertambah, Module mengelompokkan bagian yang berkaitan. Controller mengenali route HTTP, sedangkan Service mengerjakan operasi aplikasi. Nest juga menyiapkan Service yang dibutuhkan Controller melalui Dependency Injection. TypeScript membantu saat menulis kode, tetapi JSON dari client tetap perlu diperiksa dengan ValidationPipe saat Request berjalan. Pada project ini, AppModule menjadi titik awal dan TasksModule menangani feature Task.`,
  `Durasi ±1 menit. Bayangkan kita memesan Task berjudul Belajar NestJS di sebuah restoran. TasksModule menyiapkan tim untuk layanan Task. TasksController seperti kasir yang mengenali pesanan POST /tasks. TasksService seperti dapur yang mengerjakan operasi pembuatan Task. Jika perlu menyimpan hasilnya, Service memakai PrismaService. Ini analogi untuk tanggung jawab tiap bagian, bukan urutan teknis yang persis. Dalam aplikasi, ValidationPipe memeriksa input sebelum method Controller dijalankan. Module tidak menangani setiap Request satu per satu, dan Controller tidak menyimpan data sendiri.`,
  `Durasi ±1,5 menit. Ini bahan cerita pribadi pemateri dari Financial Management System Koperasi Kamorina Surya Niaga. Sebelum menampilkan deck ke publik, pemateri perlu mengonfirmasi sendiri nama dan arsitektur proyek pribadi ini; keduanya tidak diperiksa dari repository workshop. Ceritakan satu contoh ketika fitur bertambah dan module membantu menjaga struktur, controller tetap menangani HTTP, serta service menampung logika aplikasi. Jangan menambahkan klaim jumlah pengguna tanpa bukti. Hubungkan kembali ke TasksModule, TasksController, dan TasksService yang jauh lebih kecil tetapi memakai pola yang sama.`,
  `Durasi ±1 menit. Sebut peran tiap tool secara singkat. Node.js menjalankan aplikasi, pnpm mengelola paket, NestJS menyajikan API, Prisma menjadi alat akses data, PostgreSQL menyimpan data, Bruno mengirim request, dan editor dipakai menulis kode. Contoh API lokal ada di port 3001 sesuai konfigurasi latihan. Peserta boleh memakai Windows, Linux, atau macOS; proses instalasi tidak dibahas di presentasi ini.`,
  `Durasi ±1 menit. Minta peserta membuka macOS Terminal atau Windows PowerShell. Cek versi Node, npm, dan Git. Node harus cocok dengan syarat repo: 20.19 ke atas, 22.12 ke atas, atau 24 ke atas. Docker hanya diperlukan bila memakai PostgreSQL lokal via Docker; peserta yang memakai database panitia tidak wajib memasangnya. Perintah docker --version hanya membuktikan CLI tersedia, belum membuktikan Engine atau database sudah berjalan. Hasil di slide hanya contoh. Pemeriksaan mesin peserta dilakukan saat praktik, sebelum install package dan migrasi.`,
  `Durasi ±1 menit. Repo mempunyai lockfile pnpm terpisah di backend dan frontend. Gunakan pnpm 10 agar instalasi kelas mengikuti versi package manager yang sama. Lockfile membantu mengunci resolusi dependency, dan shared store pnpm menghemat disk. Cek pnpm --version dahulu. Bila belum ada atau bukan versi 10, jalankan npm install --global pnpm@10 setelah Node dan npm lolos Preflight. Jalankan pnpm install --frozen-lockfile dari backend, bukan root repo. Jalankan semua perintah folder dari root repository. Jika instalasi global terhalang policy mesin, ikuti bantuan setup panitia.`,
  `Durasi ±1,5 menit. API adalah kontrak komunikasi antarsoftware. Bruno mengirim POST /tasks beserta JSON, backend mengembalikan respons 201 ketika Task dibuat. ID 7 pada slide hanya ilustrasi; saat demo ambil ID dari respons nyata. Client perlu mengetahui method, endpoint, body, dan respons; client tidak perlu mengetahui bentuk tabel atau query internal. API kita memakai HTTP, gaya REST, dan JSON.`,
  `Durasi ±1,5 menit. Pecah contoh request: POST ialah method, /tasks ialah endpoint, Content-Type memberitahu format body, dan JSON memuat data Task. GET /tasks/:id memakai angka pada path sebagai parameter. Kita akan memakai GET, POST, PATCH, dan DELETE. Query parameter adalah bagian umum HTTP, tetapi CRUD Day 1 belum memakai filter atau pagination.`,
  `Durasi ±1,5 menit. CRUD berarti Create, Read, Update, Delete dan bukan konsep khusus NestJS. Kita punya lima endpoint karena Read dibagi menjadi daftar dan detail. Kata /tasks menyebut resource; method HTTP menyebut operasi. PATCH /tasks/7 dengan completed true hanyalah contoh, dan ID yang dipakai saat latihan harus diambil dari respons POST.`,
  `Durasi ±1,5 menit. Status code merupakan bagian dari kontrak respons. Pada checkpoint Day 1, POST valid mengembalikan 201, GET dan PATCH yang berhasil 200, dan DELETE berhasil juga 200 dengan Task yang dihapus. Input body tidak valid dapat menghasilkan 400. GET ID yang tidak ditemukan menghasilkan 404. Error server yang belum ditangani dapat berujung 500. Jangan menjanjikan 404 untuk PATCH ID hilang: kode Day 1 belum secara eksplisit menerjemahkan error Prisma pada operasi itu.`,
  `Durasi ±2 menit. Hubungkan dengan analogi restoran. TasksModule mengelompokkan TasksController dan TasksService, lalu mengimpor PrismaModule agar PrismaService tersedia. Controller mengenali HTTP Method dan route seperti POST /tasks, menerima input yang sudah melewati Pipe, kemudian memanggil Service. Service mengerjakan operasi membuat, membaca, mengubah, atau menghapus Task dan memakai PrismaService untuk akses data. TasksService adalah Provider. Nest membaca kebutuhan constructor dan memberikan instance Service kepada Controller melalui Dependency Injection. AppModule adalah titik awal aplikasi. Tunjuk file yang relevan tanpa meminta peserta menghafal decorator.`,
  `Durasi ±2 menit. Ikuti satu POST /tasks. Bruno mengirim JSON, Nest mencocokkan route pada TasksController, ValidationPipe memeriksa CreateTaskDto sebelum method controller dipanggil, controller meneruskan input ke TasksService, service memanggil PrismaService.task.create, PostgreSQL menyimpan data, lalu hasil kembali sebagai 201. Untuk GET detail, validasi body diganti ParseIntPipe pada ID. Diagram ini menunjukkan keadaan akhir Day 1; pada langkah awal live coding sebagian lapisan belum dipasang.`,
  `Durasi ±1 menit. Tanyakan di mana Task disimpan. Jawabannya PostgreSQL. Prisma membantu kode mengakses database itu. Dalam workshop, TasksService memakai PrismaService yang membungkus Prisma Client. Method task.create menambah Task dan task.findMany membaca daftar Task. Data tetap ada di PostgreSQL setelah aplikasi dimulai ulang. Slide berikutnya menunjukkan dari mana method itu berasal.`,
  `Durasi ±1,5 menit. Mulai dari model Task pada prisma/schema.prisma. Field title bertipe String dan completed bertipe Boolean dengan default false. Prisma Schema mendefinisikan bentuk data. Prisma Migrate mengubah struktur PostgreSQL sesuai migrasi, misalnya membuat tabel Task. Prisma Client dihasilkan dari schema sehingga kode TypeScript mengenal method dan tipe model Task. Dalam checkpoint Day 1, TasksService memanggil this.prismaService.task.create dengan data body. Migrasi menyiapkan tabel, sedangkan create menambah satu baris Task. Menulis model saja belum otomatis menyimpan data. Kita belum membahas relasi User atau JWT karena itu materi Day 3.`,
  `Durasi ±2 menit. Bandingkan request dengan title string dan request dengan title number plus field asing. Yang kedua harus berhenti sebelum operasi database. DTO mendefinisikan bentuk input; ValidationPipe memeriksanya saat JSON masuk, berbeda dari tipe TypeScript yang hanya membantu saat menulis kode. Dalam checkpoint, title harus string tidak kosong dengan batas 120 karakter, description opsional dengan batas 500, dan field asing ditolak. Saat live coding kita sengaja mencoba POST tanpa DTO dahulu agar masalahnya terlihat. Validasi Day 1 masih punya batas: judul berisi spasi saja dapat lolos.`,
  `Durasi ±1,5 menit. Sebelum merancang endpoint, tentukan data yang dikelola. Task Day 1 punya id integer otomatis, title wajib, description opsional, completed boolean dengan default false, serta createdAt dan updatedAt. Task baru berjudul Belajar NestJS otomatis mendapat ID, completed false, dan timestamp. Nama field yang benar adalah completed. Day 1 belum menambahkan kepemilikan per pengguna. Dari model ini kita menurunkan schema, API, dan aturan validasi.`,
  `Durasi ±1,5 menit. Praktik dimulai dari day-1-starter dan pemeriksaan PostgreSQL. Kita membuat GET dengan data statis, memindahkan operasi ke service, membuat POST sederhana, lalu mencoba input buruk. Setelah masalah terlihat, kita memasang DTO dan ValidationPipe. Berikutnya kita gunakan Prisma dan migrasi agar data tersimpan sungguhan, lalu tambah GET detail, PATCH, DELETE, dan uji lewat Bruno. Seed hanya opsional karena skrip checkpoint menghapus semua Task sebelum mengisi contoh. Pola belajar: buat, uji, temukan masalah, perbaiki, uji kembali.`,
  `Durasi ±1 menit. Tutup dengan tiga hal: HTTP menghubungkan client dan backend; NestJS memisahkan tanggung jawab; validasi dilakukan sebelum data mencapai database. Minta peserta membayangkan perjalanan satu request: masuk lewat controller, diperiksa, diproses service, diteruskan Prisma, tersimpan di PostgreSQL, lalu kembali sebagai respons. Tidak perlu menghafal seluruh sintaks sekarang. Kita pindah ke VS Code dan ikuti Task Belajar NestJS dari Bruno sampai tersimpan.`,
];

export const meta: SlideMeta = {
  title: 'Day 1 | NestJS CRUD Task + PostgreSQL',
  createdAt: '2026-10-07T03:31:11.667Z',
};

export default [Cover, Goal, Workshop, Backend, NestFundamental, NestAnalogy, RealProject, Tools, Preflight, Pnpm, Api, Anatomy, Crud, Status, Organization, RequestFlow, Prisma, PrismaWorkflow, Validation, DataModel, Roadmap, Closing] satisfies Page[];
