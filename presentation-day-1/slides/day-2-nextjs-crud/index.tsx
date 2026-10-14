import type { CSSProperties, ReactNode } from 'react';
import { useSlidePageNumber } from '@open-slide/core';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import nextLogo from './assets/nextjs.svg';
import nestLogo from './assets/nestjs.svg';
import postgresLogo from './assets/postgresql.svg';
import brunoLogo from './assets/bruno.svg';
import nodeLogo from './assets/node.svg';
import pnpmLogo from './assets/pnpm.svg';
import reactLogo from './assets/react.svg';
import tailwindLogo from './assets/tailwindcss.svg';
import outfitFont from './assets/outfit-800.ttf';
import inter500 from './assets/inter-500.ttf';
import inter700 from './assets/inter-700.ttf';

const FONT_STYLE_ID = 'day2-sticker-fonts';
if (typeof document !== 'undefined') {
  let style = document.getElementById(FONT_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = FONT_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent =
    "@font-face{font-family:'OutfitDay2';src:url('" + outfitFont + "') format('truetype');font-weight:800;font-display:swap}" +
    "@font-face{font-family:'InterDay2';src:url('" + inter500 + "') format('truetype');font-weight:500;font-display:swap}" +
    "@font-face{font-family:'InterDay2';src:url('" + inter700 + "') format('truetype');font-weight:700;font-display:swap}";
}

export const design: DesignSystem = {
  palette: { bg: '#fff2e8', text: '#12375b', accent: '#3378e6' },
  fonts: { display: "'OutfitDay2', 'Outfit', system-ui, sans-serif", body: "'InterDay2', 'Inter', system-ui, sans-serif" },
  typeScale: { hero: 152, body: 34 },
  radius: 24,
};

const peach = '#fff2e8';
const peachDeep = '#ffe6d3';
const ink = '#12375b';
const blue = '#3378e6';
const pink = '#ff4d8d';
const yellow = '#ffd24c';
const cream = '#fffaf4';
const muted = '#657c94';
const dark = '#0c243d';
const lightBlue = '#dceaff';
const mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const display = 'var(--osd-font-display)';
const body = 'var(--osd-font-body)';

const Footer = ({ inverse = false }: { inverse?: boolean }) => {
  const { current, total } = useSlidePageNumber();
  return <div style={{ position: 'absolute', left: 110, right: 110, bottom: 45, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: body, fontSize: 20, fontWeight: 700, color: inverse ? peach : muted }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><i style={{ width: 12, height: 12, borderRadius: '50%', background: pink }} /><i style={{ width: 12, height: 12, borderRadius: '50%', background: blue }} /><i style={{ width: 12, height: 12, borderRadius: '50%', background: yellow }} /><span style={{ marginLeft: 10 }}>Next.js + REST API</span></div>
    <span style={{ border: '2px solid currentColor', borderRadius: 100, padding: '5px 17px', fontVariantNumeric: 'tabular-nums' }}>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
  </div>;
};
const Sticker = ({ children, tone = 'pink', tilt = -3, style }: { children: ReactNode; tone?: 'pink' | 'blue' | 'yellow'; tilt?: number; style?: CSSProperties }) => {
  const fill = tone === 'blue' ? blue : tone === 'yellow' ? yellow : pink;
  return <span style={{ display: 'inline-block', background: fill, color: tone === 'yellow' ? ink : cream, border: '3px solid ' + ink, boxShadow: '5px 5px 0 ' + ink, borderRadius: 999, padding: '10px 21px', fontSize: 23, fontWeight: 700, letterSpacing: '0.04em', transform: `rotate(${tilt}deg)`, ...style }}>{children}</span>;
};
const Canvas = ({ children, label, bg = peach, inverse = false }: { children: ReactNode; label?: string; bg?: string; inverse?: boolean }) => <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden', background: bg, color: inverse ? cream : ink, fontFamily: body, padding: '88px 110px 106px' }}>
  {label && <div style={{ position: 'absolute', top: 67, left: 110 }}><Sticker tone={inverse ? 'yellow' : 'blue'}>{label}</Sticker></div>}
  {children}<Footer inverse={inverse} />
</div>;
const Title = ({ children, size = 77, style }: { children: ReactNode; size?: number; style?: CSSProperties }) => <h1 style={{ fontFamily: display, fontSize: size, lineHeight: 1.045, letterSpacing: '-0.035em', fontWeight: 800, margin: 0, ...style }}>{children}</h1>;
const Rule = ({ style }: { style?: CSSProperties }) => <div style={{ height: 3, background: ink, ...style }} />;
const Logo = ({ src, alt, size = 80, style }: { src: string; alt: string; size?: number; style?: CSSProperties }) => <img src={src} alt={alt} style={{ width: size, height: size, objectFit: 'contain', ...style }} />;
const Mono = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => <span style={{ fontFamily: mono, ...style }}>{children}</span>;
const Browser = ({ children, url = '/tasks', style }: { children: ReactNode; url?: string; style?: CSSProperties }) => <div style={{ background: cream, border: '3px solid ' + ink, borderRadius: 24, boxShadow: '10px 10px 0 ' + ink, overflow: 'hidden', ...style }}>
  <div style={{ height: 59, borderBottom: '3px solid ' + ink, background: lightBlue, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px' }}><i style={{ width: 13, height: 13, borderRadius: '50%', background: pink }} /><i style={{ width: 13, height: 13, borderRadius: '50%', background: yellow }} /><i style={{ width: 13, height: 13, borderRadius: '50%', background: blue }} /><div style={{ marginLeft: 22, width: 340, boxSizing: 'border-box', whiteSpace: 'nowrap', background: cream, color: muted, borderRadius: 8, padding: '7px 18px', fontFamily: mono, fontSize: 18 }}>{url}</div></div>
  {children}
</div>;
const Terminal = ({ title, children, style }: { title: string; children: ReactNode; style?: CSSProperties }) => <div style={{ background: dark, color: '#eaf4ff', border: '3px solid ' + ink, boxShadow: '8px 8px 0 ' + ink, borderRadius: 20, overflow: 'hidden', fontFamily: mono, ...style }}><div style={{ height: 50, background: '#183a59', display: 'flex', alignItems: 'center', gap: 10, padding: '0 21px', fontSize: 19, color: '#b9cddd' }}><i style={{ width: 12, height: 12, borderRadius: '50%', background: pink }} /><i style={{ width: 12, height: 12, borderRadius: '50%', background: yellow }} /><i style={{ width: 12, height: 12, borderRadius: '50%', background: blue }} /><span style={{ marginLeft: 16 }}>{title}</span></div><div style={{ padding: '25px 30px' }}>{children}</div></div>;
const FixedLines = ({ lines, width, size = 28, gap = 55, color = '#eaf4ff' }: { lines: { text: string; color?: string }[]; width: number; size?: number; gap?: number; color?: string }) => <div style={{ position: 'relative', width, height: gap * lines.length, fontSize: size }}>
  {lines.map((line, index) => <div key={index} style={{ position: 'absolute', left: 0, top: index * gap, width, whiteSpace: 'nowrap', color: line.color ?? color }}>{line.text}</div>)}
</div>;
const TaskRow = ({ title, done = false, compact = false }: { title: string; done?: boolean; compact?: boolean }) => <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #c6d5e2', padding: compact ? '12px 0' : '19px 0', gap: compact ? 15 : 24, fontSize: compact ? 23 : 29 }}><span style={{ width: compact ? 30 : 38, height: compact ? 30 : 38, border: '3px solid ' + blue, borderRadius: 8, background: done ? blue : cream, color: cream, lineHeight: compact ? '27px' : '34px', textAlign: 'center', fontSize: compact ? 22 : 29, fontWeight: 700 }}>{done ? '✓' : ''}</span><span style={{ flex: 1, textDecoration: done ? 'line-through' : 'none', color: done ? muted : ink }}>{title}</span><span style={{ color: pink, fontSize: compact ? 19 : 23, fontWeight: 700 }}>Delete</span></div>;

const Cover: Page = () => <Canvas>
  <div style={{ position: 'absolute', left: 115, top: 87 }}><Sticker tone="yellow" tilt={-5}>Next.js & NestJS workshop</Sticker></div>
  <Title size={146} style={{ position: 'absolute', left: 110, top: 219, width: 1230 }}>Membangun<br />Frontend<br />dengan Next.js</Title>
  <div style={{ position: 'absolute', left: 117, top: 777, fontSize: 39, fontWeight: 700 }}>React Fundamentals · REST API Integration</div>
  <div style={{ position: 'absolute', right: 123, top: 163, width: 435, height: 435, background: yellow, border: '4px solid ' + ink, borderRadius: '50%', boxShadow: '13px 13px 0 ' + ink }} />
  <Logo src={nextLogo} alt="Next.js logo" size={240} style={{ position: 'absolute', right: 219, top: 256, transform: 'rotate(8deg)' }} />
  <div style={{ position: 'absolute', right: 164, top: 666, display: 'flex', alignItems: 'center', gap: 17 }}><Logo src={nestLogo} alt="NestJS logo" size={85} /><span style={{ fontFamily: display, fontSize: 45 }}>+</span><Logo src={postgresLogo} alt="PostgreSQL logo" size={87} /></div>
  <div style={{ position: 'absolute', right: 118, top: 811 }}><Sticker tone="pink" tilt={5}>DAY 2</Sticker></div>
</Canvas>;

const Target: Page = () => <Canvas label="Target kita">
  <Title size={82} style={{ position: 'absolute', left: 111, top: 213, width: 715 }}>CRUD Task<br />dari browser.</Title>
  <div style={{ position: 'absolute', left: 119, top: 496, width: 665, fontSize: 36, lineHeight: 1.42 }}>Lihat daftar, buat Task, ubah <Mono>completed</Mono>, lalu hapus.</div>
  <Rule style={{ position: 'absolute', left: 119, top: 713, width: 607 }} />
  <div style={{ position: 'absolute', left: 119, top: 743, fontFamily: mono, fontSize: 29, fontWeight: 700 }}>/</div>
  <div style={{ position: 'absolute', left: 300, top: 743, fontFamily: mono, fontSize: 29, color: muted }}>Landing Page</div>
  <div style={{ position: 'absolute', left: 119, top: 803, fontFamily: mono, fontSize: 29, fontWeight: 700 }}>/tasks</div>
  <div style={{ position: 'absolute', left: 300, top: 803, fontFamily: mono, fontSize: 29, color: muted }}>Task Management</div>
  <Browser style={{ position: 'absolute', right: 114, top: 205, width: 928, height: 634, transform: 'rotate(2deg)' }}><div style={{ padding: '37px 47px' }}><div style={{ fontFamily: display, fontSize: 52 }}>Task Management</div><div style={{ fontSize: 22, color: muted, marginTop: 4 }}>Task workshop dalam satu halaman</div><div style={{ display: 'flex', gap: 12, marginTop: 33 }}><div style={{ flex: 1, padding: '14px 20px', border: '2px solid #aec4d7', borderRadius: 12, fontSize: 22, color: muted }}>Judul Task...</div><div style={{ background: blue, color: cream, padding: '14px 24px', borderRadius: 12, fontWeight: 700, fontSize: 22 }}>Tambah</div></div><div style={{ marginTop: 25 }}><TaskRow title="Belajar NestJS" done compact /><TaskRow title="Belajar Next.js" compact /><TaskRow title="Integrasi REST API" compact /></div></div></Browser>
</Canvas>;

const Workshop: Page = () => <Canvas label="Peta workshop" bg={ink} inverse>
  <Title size={80} style={{ position: 'absolute', left: 110, top: 215 }}>Satu project. Empat hari.</Title>
  <div style={{ position: 'absolute', left: 112, right: 112, top: 422, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 34 }}>
    {[['01', 'REST API', 'NestJS + PostgreSQL', pink], ['02', 'Frontend', 'Next.js + integrasi API', yellow], ['03', 'Kelanjutan', 'Project berkembang', '#88beff'], ['04', 'Presentasi', 'Hasil akhir project', cream]].map(([n, h, s, c]) => <div key={n} style={{ opacity: n === '02' ? 1 : 0.75 }}><div style={{ fontFamily: display, fontSize: 121, color: c }}>{n}</div><Rule style={{ background: c, margin: '17px 0 26px' }} /><div style={{ fontFamily: display, fontSize: 43 }}>{h}</div><div style={{ fontSize: 30, lineHeight: 1.35, marginTop: 12, color: n === '02' ? cream : '#cfdeec' }}>{s}</div></div>)}
  </div>
  <div style={{ position: 'absolute', right: 228, top: 315 }}><Sticker tone="yellow" tilt={5}>HARI INI</Sticker></div>
</Canvas>;

const BrunoBrowser: Page = () => <Canvas label="Client berganti">
  <Title size={78} style={{ position: 'absolute', left: 111, top: 202 }}>API sama. Cara memakainya berubah.</Title>
  <div style={{ position: 'absolute', left: 130, top: 391, display: 'flex', alignItems: 'center', gap: 32 }}><Logo src={brunoLogo} alt="Bruno logo" size={142} /><div><div style={{ fontFamily: display, fontSize: 57 }}>Bruno</div><div style={{ fontSize: 31, color: muted }}>Day 1 · request manual</div></div></div>
  <div style={{ position: 'absolute', right: 130, top: 383, display: 'flex', alignItems: 'center', gap: 31 }}><div><div style={{ fontFamily: display, fontSize: 57 }}>Browser + Next.js</div><div style={{ fontSize: 31, color: muted }}>Day 2 · interaksi user</div></div><Logo src={nextLogo} alt="Next.js logo" size={148} /></div>
  <Rule style={{ position: 'absolute', left: 113, right: 113, top: 603 }} />
  <div style={{ position: 'absolute', left: 113, top: 650, width: 1690, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ fontFamily: mono, fontSize: 43, fontWeight: 700 }}>GET /tasks</div><div style={{ fontFamily: display, fontSize: 53, color: blue }}>NestJS API :3001</div><div style={{ fontSize: 36 }}>Task yang sama</div></div>
  <div style={{ position: 'absolute', left: 115, top: 796, fontSize: 29, color: muted }}>Backend Day 1 tetap bekerja; hari ini kita membangun client yang dipakai user.</div>
</Canvas>;

const ReactNext: Page = () => <Canvas label="Fundamental">
  <Title size={82} style={{ position: 'absolute', left: 110, top: 203 }}>React memberi model UI.<br />Next.js memberi struktur aplikasi.</Title>
  <div style={{ position: 'absolute', left: 127, top: 479, display: 'flex', alignItems: 'center', gap: 43 }}><Logo src={reactLogo} alt="React logo" size={206} /><div><div style={{ fontFamily: display, fontSize: 70 }}>React</div><div style={{ fontSize: 34, maxWidth: 540 }}>Component, Props, State, Event.</div></div></div>
  <div style={{ position: 'absolute', right: 143, top: 480, display: 'flex', alignItems: 'center', gap: 42 }}><Logo src={nextLogo} alt="Next.js logo" size={190} /><div><div style={{ fontFamily: display, fontSize: 70 }}>Next.js</div><div style={{ fontSize: 34, maxWidth: 500 }}>App Router, Page, Layout, rendering.</div></div></div>
  <Rule style={{ position: 'absolute', left: 123, right: 123, top: 765 }} />
  <div style={{ position: 'absolute', left: 124, top: 794, fontSize: 32, color: muted }}>Component yang kita tulis di Next.js tetap memakai React.</div>
</Canvas>;

const WhyNext: Page = () => <Canvas label="Kenapa Next.js" bg={yellow}>
  <Title size={72} style={{ position: 'absolute', left: 110, top: 205, width: 605 }}>UI React, dengan kerangka aplikasi web.</Title>
  <div style={{ position: 'absolute', left: 730, top: 318, width: 435, height: 435, borderRadius: '50%', background: cream, border: '4px solid ' + ink, display: 'grid', placeItems: 'center', boxShadow: '12px 12px 0 ' + ink }}><Logo src={nextLogo} alt="Next.js logo" size={245} /></div>
  <div style={{ position: 'absolute', left: 110, top: 529, width: 500, fontSize: 38, fontWeight: 700 }}>01 · File-Based Routing</div>
  <div style={{ position: 'absolute', left: 112, top: 660, width: 500, fontSize: 38, fontWeight: 700 }}>02 · React Ecosystem</div>
  <div style={{ position: 'absolute', right: 96, top: 521, width: 530, fontSize: 38, fontWeight: 700 }}>03 · Server & Client Components</div>
  <div style={{ position: 'absolute', right: 95, top: 665, width: 530, fontSize: 38, fontWeight: 700 }}>04 · Web App Structure</div>
  <div style={{ position: 'absolute', left: 114, top: 849, fontSize: 29 }}>Di workshop ini, NestJS tetap menjadi Backend API terpisah.</div>
</Canvas>;

const RealProject: Page = () => <Canvas label="Konteks nyata">
  <Title size={74} style={{ position: 'absolute', left: 110, top: 200, width: 760 }}>Saat aplikasi tumbuh,<br />UI perlu dibagi<br />dengan jelas.</Title>
  <div style={{ position: 'absolute', left: 118, top: 506, width: 615, fontSize: 39, lineHeight: 1.5 }}>Halaman menampilkan data.<br />Form mengirim request.<br />Action mengubah hasilnya.</div>
  <div style={{ position: 'absolute', left: 120, top: 771, fontSize: 25, color: muted }}>Ilustrasi interface sistem keuangan</div>
  <Browser url="demo.local" style={{ position: 'absolute', right: 118, top: 214, width: 905, height: 605, transform: 'rotate(2deg)' }}><div style={{ display: 'flex', height: 545 }}><div style={{ width: 187, background: ink, color: cream, padding: '29px 22px', boxSizing: 'border-box', fontSize: 19, lineHeight: 2.6 }}><strong>Dashboard</strong><br />Transaksi<br />Laporan<br />Pengaturan</div><div style={{ flex: 1, padding: '29px 32px' }}><div style={{ fontFamily: display, fontSize: 41 }}>Ringkasan Keuangan</div><div style={{ color: muted, fontSize: 18 }}>Data terbaru dari API</div><div style={{ display: 'flex', gap: 17, marginTop: 34 }}><div style={{ background: lightBlue, padding: 19, width: 210, borderRadius: 12, fontSize: 18 }}>Pemasukan<br /><strong style={{ fontSize: 26 }}>Dari API</strong></div><div style={{ background: peachDeep, padding: 19, width: 210, borderRadius: 12, fontSize: 18 }}>Pengeluaran<br /><strong style={{ fontSize: 26 }}>Dari API</strong></div></div><div style={{ marginTop: 38, borderTop: '2px solid ' + ink, fontSize: 20, paddingTop: 18 }}>Transaksi terbaru</div><div style={{ height: 36, borderBottom: '1px solid #adc3d7', marginTop: 12 }}>Pembelian perlengkapan <span style={{ float: 'right' }}>Lihat</span></div><div style={{ height: 36, borderBottom: '1px solid #adc3d7', marginTop: 12 }}>Biaya operasional <span style={{ float: 'right' }}>Lihat</span></div></div></div></Browser>
</Canvas>;

const Tools: Page = () => <Canvas label="Tools Day 2">
  <Title size={82} style={{ position: 'absolute', left: 110, top: 199 }}>Satu UI. Beberapa alat kerja.</Title>
  <div style={{ position: 'absolute', left: 121, top: 361, display: 'flex', alignItems: 'center', gap: 35 }}><Logo src={nextLogo} alt="Next.js logo" size={192} /><span style={{ fontFamily: display, fontSize: 79 }}>Next.js</span><Sticker tone="yellow" tilt={4}>fokus hari ini</Sticker></div>
  <Rule style={{ position: 'absolute', left: 118, right: 118, top: 613 }} />
  <div style={{ position: 'absolute', left: 122, right: 121, top: 667, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
    {[['React', reactLogo], ['Tailwind', tailwindLogo], ['Node.js', nodeLogo], ['pnpm', pnpmLogo], ['NestJS API', nestLogo], ['Bruno', brunoLogo]].map(([name, src]) => <div key={name} style={{ textAlign: 'center', width: 228 }}><Logo src={src} alt={name + ' logo'} size={96} /><div style={{ fontFamily: display, fontSize: 29, marginTop: 18 }}>{name}</div></div>)}
  </div>
  <div style={{ position: 'absolute', left: 118, top: 888, fontSize: 27, color: muted }}>Editor untuk kode · Browser DevTools untuk Console dan Network</div>
</Canvas>;

const Preflight: Page = () => <Canvas label="Preflight">
  <Title size={75} style={{ position: 'absolute', left: 110, top: 199 }}>Pastikan API Day 1 hidup sebelum membuka UI.</Title>
  <Terminal title="Terminal · environment" style={{ position: 'absolute', left: 118, top: 372, width: 486, height: 385 }}><FixedLines width={420} lines={[{ text: '$ node --version' }, { text: '$ pnpm --version' }, { text: '$ git --version' }]} gap={62} /></Terminal>
  <Terminal title="Terminal · backend" style={{ position: 'absolute', left: 655, top: 372, width: 508, height: 385 }}><FixedLines width={442} lines={[{ text: '$ cd backend' }, { text: '$ pnpm start:dev' }, { text: 'API :3001 ready', color: '#a5e3ad' }]} gap={62} /></Terminal>
  <div style={{ position: 'absolute', right: 118, top: 372, width: 581, height: 385, background: cream, border: '3px solid ' + ink, boxShadow: '8px 8px 0 ' + ink, borderRadius: 20, boxSizing: 'border-box', padding: '30px 34px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 22 }}><Logo src={brunoLogo} alt="Bruno logo" size={65} /><div style={{ fontFamily: display, fontSize: 38 }}>Bruno</div></div><Rule style={{ margin: '31px 0' }} /><div style={{ fontFamily: mono, fontSize: 26 }}>GET localhost:3001/tasks</div><div style={{ fontFamily: display, fontSize: 53, color: blue, marginTop: 37 }}>200 OK</div></div>
  <div style={{ position: 'absolute', left: 119, top: 822 }}><Sticker tone="yellow" tilt={-2}>BACKEND READY</Sticker></div>
  <div style={{ position: 'absolute', left: 480, top: 834, fontSize: 27, color: muted }}>Database aktif · dependency tersedia · GET /tasks berhasil</div>
</Canvas>;

const TwoApps: Page = () => <Canvas label="Dua aplikasi" bg={lightBlue}>
  <Title size={79} style={{ position: 'absolute', left: 110, top: 199 }}>Dua terminal, dua port, satu alur.</Title>
  <Terminal title="Terminal 1 · Backend" style={{ position: 'absolute', left: 116, top: 377, width: 786, height: 362 }}><FixedLines width={720} lines={[{ text: '$ cd backend' }, { text: '$ pnpm install --frozen-lockfile' }, { text: '$ pnpm start:dev' }, { text: 'NestJS · localhost:3001', color: '#ffd084' }]} size={27} gap={52} /></Terminal>
  <Terminal title="Terminal 2 · Frontend" style={{ position: 'absolute', right: 116, top: 377, width: 786, height: 362 }}><FixedLines width={720} lines={[{ text: '$ cd frontend' }, { text: '$ pnpm install --frozen-lockfile' }, { text: '$ pnpm dev' }, { text: 'Next.js · localhost:3000', color: '#ffd084' }]} size={27} gap={52} /></Terminal>
  <div style={{ position: 'absolute', left: 119, top: 812, fontSize: 36, fontWeight: 700 }}>Browser membuka <Mono>localhost:3000</Mono></div>
  <div style={{ position: 'absolute', right: 118, top: 822, fontSize: 29, color: muted }}>Frontend meminta data ke API :3001</div>
</Canvas>;

const AppRouter: Page = () => <Canvas label="App Router">
  <Title size={78} style={{ position: 'absolute', left: 110, top: 196 }}>Folder menentukan URL.</Title>
  <div style={{ position: 'absolute', left: 125, top: 384, width: 772, height: 439, background: dark, border: '3px solid ' + ink, boxShadow: '9px 9px 0 ' + ink, borderRadius: 20, color: '#d4e4f2', fontFamily: mono }}>
    <div style={{ position: 'absolute', left: 42, top: 26, width: 630, whiteSpace: 'nowrap', fontSize: 22, color: '#9bb5ca' }}>EXPLORER · frontend/src/app</div>
    <div style={{ position: 'absolute', left: 45, top: 92, width: 280, whiteSpace: 'nowrap', fontSize: 31, color: '#80d6eb' }}>app/</div>
    <div style={{ position: 'absolute', left: 91, top: 156, width: 350, whiteSpace: 'nowrap', fontSize: 31 }}>page.tsx</div>
    <div style={{ position: 'absolute', left: 560, top: 156, width: 100, whiteSpace: 'nowrap', fontSize: 31, color: '#ffd084' }}>/</div>
    <div style={{ position: 'absolute', left: 91, top: 220, width: 330, whiteSpace: 'nowrap', fontSize: 31, color: '#80d6eb' }}>tasks/</div>
    <div style={{ position: 'absolute', left: 140, top: 284, width: 350, whiteSpace: 'nowrap', fontSize: 31 }}>page.tsx</div>
    <div style={{ position: 'absolute', left: 560, top: 284, width: 150, whiteSpace: 'nowrap', fontSize: 31, color: '#ffd084' }}>/tasks</div>
    <div style={{ position: 'absolute', left: 91, top: 348, width: 350, whiteSpace: 'nowrap', fontSize: 31, color: '#9bb5ca' }}>layout.tsx</div>
  </div>
  <Browser url="/tasks" style={{ position: 'absolute', right: 120, top: 377, width: 817, height: 445 }}><div style={{ padding: '44px 52px' }}><div style={{ fontFamily: display, fontSize: 53 }}>Task Management</div><Rule style={{ margin: '39px 0' }} /><TaskRow title="Belajar NestJS" compact /><TaskRow title="Belajar Next.js" compact /></div></Browser>
  <div style={{ position: 'absolute', left: 117, top: 860, fontSize: 30, color: muted }}>Folder <Mono>tasks</Mono> menjadi segment; <Mono>page.tsx</Mono> menampilkan halaman.</div>
</Canvas>;

const Components: Page = () => <Canvas label="Component Tree">
  <Title size={77} style={{ position: 'absolute', left: 110, top: 197 }}>Satu halaman, beberapa responsibility.</Title>
  <Browser style={{ position: 'absolute', left: 121, top: 371, width: 851, height: 465 }}><div style={{ padding: '33px 43px' }}><div style={{ borderBottom: '3px solid ' + pink, paddingBottom: 17, fontFamily: display, fontSize: 43 }}>Task Management</div><div style={{ display: 'flex', gap: 14, marginTop: 25, padding: 13, border: '3px solid ' + yellow, borderRadius: 12 }}><div style={{ flex: 1, fontSize: 20, color: muted }}>Judul Task...</div><div style={{ background: blue, color: cream, padding: '8px 18px', borderRadius: 8, fontSize: 18 }}>Tambah</div></div><div style={{ border: '3px solid ' + blue, borderRadius: 12, marginTop: 20, padding: '0 14px' }}><TaskRow title="Belajar NestJS" done compact /><TaskRow title="Belajar Next.js" compact /></div></div></Browser>
  <div style={{ position: 'absolute', right: 123, top: 387, width: 728, height: 338, fontFamily: mono }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 280, whiteSpace: 'nowrap', fontSize: 34, fontWeight: 700 }}>TasksPage</div>
    <div style={{ position: 'absolute', left: 352, top: 8, width: 350, whiteSpace: 'nowrap', fontSize: 22, color: muted }}>State + handlers</div>
    <div style={{ position: 'absolute', left: 54, top: 68, width: 265, whiteSpace: 'nowrap', fontSize: 34, color: pink }}>TaskView</div>
    <div style={{ position: 'absolute', left: 352, top: 76, width: 300, whiteSpace: 'nowrap', fontSize: 22, color: muted }}>tampilan</div>
    <div style={{ position: 'absolute', left: 112, top: 136, width: 225, whiteSpace: 'nowrap', fontSize: 34, color: '#a77900' }}>TaskForm</div>
    <div style={{ position: 'absolute', left: 352, top: 144, width: 300, whiteSpace: 'nowrap', fontSize: 22, color: muted }}>input</div>
    <div style={{ position: 'absolute', left: 112, top: 204, width: 225, whiteSpace: 'nowrap', fontSize: 34, color: blue }}>TaskItem</div>
    <div style={{ position: 'absolute', left: 352, top: 212, width: 300, whiteSpace: 'nowrap', fontSize: 22, color: muted }}>satu Task</div>
    <div style={{ position: 'absolute', left: 112, top: 272, width: 225, whiteSpace: 'nowrap', fontSize: 34, color: blue }}>TaskItem</div>
  </div>
  <div style={{ position: 'absolute', right: 129, top: 769 }}><Sticker tone="yellow" tilt={4}>pecah saat membantu</Sticker></div>
</Canvas>;

const PropsStateEvent: Page = () => <Canvas label="React fundamentals" bg={peachDeep}>
  <Title size={79} style={{ position: 'absolute', left: 110, top: 193 }}>User mengetik. State berubah. UI ikut berubah.</Title>
  <Browser style={{ position: 'absolute', left: 471, top: 367, width: 962, height: 415 }}><div style={{ padding: '37px 45px' }}><div style={{ fontFamily: display, fontSize: 49 }}>Buat Task baru</div><div style={{ fontSize: 22, color: muted, marginTop: 8 }}>Judul</div><div style={{ border: '3px solid ' + blue, borderRadius: 13, marginTop: 12, padding: '14px 18px', fontSize: 29 }}>Belajar Next.js<span style={{ color: blue }}>|</span></div><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}><span style={{ fontSize: 22, color: muted }}>Nilai input terlihat langsung di UI</span><div style={{ background: pink, color: cream, borderRadius: 11, padding: '13px 27px', fontSize: 24, fontWeight: 700 }}>Tambah</div></div></div></Browser>
  <div style={{ position: 'absolute', left: 115, top: 428, width: 306 }}><div style={{ fontFamily: display, fontSize: 54, color: blue }}>State</div><div style={{ fontSize: 29, lineHeight: 1.4 }}>Nilai input yang sedang berubah.</div><Rule style={{ marginTop: 20, background: blue }} /></div>
  <div style={{ position: 'absolute', right: 112, top: 433, width: 284 }}><div style={{ fontFamily: display, fontSize: 54, color: pink }}>Event</div><div style={{ fontSize: 29, lineHeight: 1.4 }}>Ketik atau tekan Tambah.</div><Rule style={{ marginTop: 20, background: pink }} /></div>
  <div style={{ position: 'absolute', left: 474, top: 819, width: 965, display: 'flex', alignItems: 'center', gap: 30 }}><div style={{ fontFamily: display, fontSize: 49, color: '#a77900' }}>Props</div><Rule style={{ width: 171, background: yellow }} /><div style={{ fontSize: 28 }}>Data dan callback diteruskan ke Component anak.</div></div>
</Canvas>;

const ServerClient: Page = () => <Canvas label="Boundary Next.js">
  <Title size={77} style={{ position: 'absolute', left: 110, top: 193 }}>Bagian mana yang perlu interaksi browser?</Title>
  <div style={{ position: 'absolute', left: 113, top: 381, width: 740, height: 423, padding: '38px 47px', boxSizing: 'border-box', background: lightBlue, borderTop: '5px solid ' + blue }}><div style={{ fontFamily: display, fontSize: 65 }}>Server Component</div><div style={{ fontSize: 30, color: muted, marginTop: 15 }}>Default di App Router</div><Rule style={{ margin: '32px 0' }} /><div style={{ fontSize: 34, lineHeight: 1.42 }}>Menyiapkan UI tanpa State atau Event handler browser.</div><div style={{ position: 'absolute', left: 47, bottom: 18, display: 'flex', alignItems: 'center', gap: 13 }}><Logo src={nextLogo} alt="Next.js logo" size={39} /><span style={{ fontSize: 23 }}>Tetap bagian dari Next.js</span></div></div>
  <div style={{ position: 'absolute', right: 111, top: 381, width: 778, height: 423, padding: '38px 47px', boxSizing: 'border-box', background: yellow, borderTop: '5px solid ' + pink }}><div style={{ fontFamily: display, fontSize: 65 }}>Client Component</div><div style={{ fontSize: 30, color: ink, marginTop: 15 }}><Mono>"use client"</Mono> pada <Mono>TasksPage</Mono></div><Rule style={{ margin: '32px 0' }} /><div style={{ fontSize: 34, lineHeight: 1.42 }}>State, form, <Mono>onClick</Mono>, <Mono>onChange</Mono>, Browser APIs.</div></div>
  <div style={{ position: 'absolute', left: 118, top: 844, fontSize: 30, color: muted }}>Latihan CRUD memakai Client Component agar Event, Network Request, dan UI Update terlihat.</div>
</Canvas>;

const FullFlow: Page = () => <Canvas label="Perjalanan satu Task" bg={ink} inverse>
  <Title size={76} style={{ position: 'absolute', left: 110, top: 200, width: 1400 }}>Klik Tambah memulai perjalanan data.</Title>
  <div style={{ position: 'absolute', left: 122, right: 122, top: 389, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20 }}>
    {[['01', 'Form', 'Belajar Next.js', yellow], ['02', 'Event', 'Submit', pink], ['03', 'HTTP', 'POST /tasks', '#8bc3ff'], ['04', 'NestJS', 'Validasi + Service', yellow], ['05', 'Prisma', 'Simpan Task', pink], ['06', 'PostgreSQL', 'Data persisten', '#8bc3ff']].map(([n, h, s, c]) => <div key={n}><div style={{ fontFamily: display, fontSize: 66, color: c }}>{n}</div><Rule style={{ background: c, margin: '15px 0 24px' }} /><div style={{ fontFamily: display, fontSize: 35 }}>{h}</div><div style={{ fontSize: 23, lineHeight: 1.3, marginTop: 13, color: '#cbdeec' }}>{s}</div></div>)}
  </div>
  <div style={{ position: 'absolute', left: 124, right: 124, top: 728, display: 'flex', alignItems: 'center', gap: 38 }}><div style={{ background: yellow, color: ink, padding: '19px 28px', fontFamily: display, fontSize: 36, transform: 'rotate(-2deg)' }}>Response Task</div><div style={{ fontSize: 39 }}>State diperbarui</div><div style={{ width: 62, height: 8, background: pink }} /><div style={{ fontSize: 39 }}>UI menampilkan Task baru</div></div>
  <div style={{ position: 'absolute', left: 121, top: 857, fontSize: 27, color: '#cbdeec' }}>UI memicu Request; backend yang mengubah database.</div>
</Canvas>;

const Fetch: Page = () => <Canvas label="Fetch + async">
  <Title size={81} style={{ position: 'absolute', left: 110, top: 198 }}>Request membutuhkan waktu.</Title>
  <div style={{ position: 'absolute', left: 115, right: 118, top: 419, height: 8, background: blue }} />
  <div style={{ position: 'absolute', left: 119, right: 117, top: 379, display: 'flex', justifyContent: 'space-between' }}>
    {[['01', 'Klik', 'Event terjadi'], ['02', 'Loading', 'Menunggu Response'], ['03', 'Periksa', 'response.ok'], ['04', 'Tampilkan', 'Data atau Error']].map(([n, h, s]) => <div key={n} style={{ width: 345 }}><div style={{ width: 75, height: 75, borderRadius: '50%', background: n === '02' ? pink : yellow, border: '3px solid ' + ink, display: 'grid', placeItems: 'center', fontFamily: display, fontSize: 31 }}>{n}</div><div style={{ fontFamily: display, fontSize: 49, marginTop: 26 }}>{h}</div><div style={{ fontSize: 26, color: muted, marginTop: 9 }}>{s}</div></div>)}
  </div>
  <div style={{ position: 'absolute', left: 121, top: 668, width: 1010, height: 195, background: cream, border: '3px solid ' + ink, borderRadius: 18, boxShadow: '7px 7px 0 ' + ink, padding: '27px 33px', boxSizing: 'border-box' }}><div style={{ fontFamily: mono, fontSize: 23, color: muted }}>NETWORK · Fetch/XHR</div><Rule style={{ margin: '17px 0', height: 2 }} /><div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 120px 130px', fontFamily: mono, fontSize: 25 }}><strong>GET</strong><span>/tasks</span><strong style={{ color: blue }}>200</strong><span>182 ms</span></div></div>
  <div style={{ position: 'absolute', right: 123, top: 690, width: 487, fontSize: 35, lineHeight: 1.35 }}>Selesai di <Mono>fetch</Mono> belum tentu berhasil. Periksa statusnya.</div>
</Canvas>;

const ApiContract: Page = () => <Canvas label="API Contract" bg={lightBlue}>
  <Title size={81} style={{ position: 'absolute', left: 110, top: 198 }}>Kesepakatan Next.js dan NestJS.</Title>
  <div style={{ position: 'absolute', left: 118, top: 379, width: 532 }}><div style={{ fontFamily: display, fontSize: 54 }}>Request</div><Rule style={{ margin: '17px 0 29px', background: blue }} /><FixedLines width={510} color={ink} size={28} gap={54} lines={[{ text: 'POST /tasks' }, { text: 'title: string (wajib)' }, { text: 'description: opsional' }]} /></div>
  <div style={{ position: 'absolute', left: 736, top: 379, width: 506 }}><div style={{ fontFamily: display, fontSize: 54 }}>Response Task</div><Rule style={{ margin: '17px 0 29px', background: pink }} /><FixedLines width={495} color={ink} size={28} gap={54} lines={[{ text: 'id · title' }, { text: 'description' }, { text: 'completed', color: blue }, { text: 'createdAt · updatedAt' }]} /></div>
  <div style={{ position: 'absolute', right: 117, top: 378, width: 536 }}><div style={{ fontFamily: display, fontSize: 54 }}>Operations</div><Rule style={{ margin: '17px 0 29px', background: yellow }} /><FixedLines width={525} color={ink} size={28} gap={54} lines={[{ text: 'GET /tasks' }, { text: 'POST /tasks' }, { text: 'PATCH /tasks/:id' }, { text: 'DELETE /tasks/:id' }]} /></div>
  <div style={{ position: 'absolute', left: 119, top: 812 }}><Sticker tone="yellow" tilt={-2}>Kontrak lebih penting daripada tabel internal</Sticker></div>
</Canvas>;

const StateMini = ({ kind }: { kind: 'Loading' | 'Data' | 'Empty' | 'Error' }) => <div style={{ border: '3px solid ' + ink, borderRadius: 17, background: cream, overflow: 'hidden', height: 218 }}><div style={{ height: 40, background: lightBlue, display: 'flex', alignItems: 'center', paddingLeft: 15, gap: 7 }}><i style={{ width: 9, height: 9, borderRadius: '50%', background: pink }} /><i style={{ width: 9, height: 9, borderRadius: '50%', background: yellow }} /><i style={{ width: 9, height: 9, borderRadius: '50%', background: blue }} /><span style={{ fontFamily: mono, fontSize: 15, color: muted, marginLeft: 14 }}>/tasks</span></div><div style={{ padding: '20px 27px' }}><div style={{ fontFamily: display, fontSize: 27 }}>Task Management</div>{kind === 'Data' ? <div style={{ fontSize: 20, lineHeight: 1.7, marginTop: 12 }}>☑ Belajar NestJS<br />□ Belajar Next.js</div> : kind === 'Loading' ? <div style={{ fontSize: 22, color: muted, marginTop: 27 }}>Sedang mengambil Task...</div> : kind === 'Empty' ? <div style={{ fontSize: 22, color: muted, marginTop: 27 }}>Belum ada Task.</div> : <div style={{ fontSize: 22, color: pink, marginTop: 27 }}>Gagal mengambil Task.</div>}</div></div>;
const ReadStates: Page = () => <Canvas label="Read + UI State">
  <Title size={77} style={{ position: 'absolute', left: 110, top: 191 }}>Satu halaman, empat kondisi.</Title>
  <div style={{ position: 'absolute', left: 121, right: 121, top: 352, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 31 }}>
    {(['Loading', 'Data', 'Empty', 'Error'] as const).map((kind, i) => <div key={kind}><div style={{ fontFamily: display, fontSize: 52, color: [blue, ink, '#a77900', pink][i], marginBottom: 20 }}>{kind}</div><StateMini kind={kind} /><div style={{ fontSize: 25, lineHeight: 1.37, marginTop: 21, color: muted }}>{['Request masih berjalan', 'Daftar berhasil dimuat', '200 OK dengan array kosong', 'Request gagal'][i]}</div></div>)}
  </div>
  <Rule style={{ position: 'absolute', left: 122, right: 121, top: 760 }} />
  <div style={{ position: 'absolute', left: 122, top: 799, fontSize: 36 }}>GET /tasks <span style={{ color: blue }}>memberi data</span>; State menentukan pesan yang dilihat user.</div>
</Canvas>;

const Create: Page = () => <Canvas label="Create Task" bg={peachDeep}>
  <Title size={76} style={{ position: 'absolute', left: 110, top: 190 }}>Form mengubah input menjadi Request.</Title>
  <Browser style={{ position: 'absolute', left: 121, top: 369, width: 779, height: 478 }}><div style={{ padding: '27px 48px' }}><div style={{ fontFamily: display, fontSize: 44 }}>Task baru</div><div style={{ fontSize: 20, color: muted, margin: '19px 0 6px' }}>Title</div><div style={{ border: '2px solid ' + blue, borderRadius: 10, padding: '10px 16px', fontSize: 25 }}>Belajar Next.js</div><div style={{ fontSize: 20, color: muted, margin: '18px 0 6px' }}>Description</div><div style={{ border: '2px solid #b7cce0', borderRadius: 10, padding: '10px 16px', fontSize: 23 }}>Integrasi REST API</div><div style={{ background: pink, color: cream, fontWeight: 700, borderRadius: 10, marginTop: 18, padding: '12px 23px', width: 150, textAlign: 'center', fontSize: 21 }}>Tambah</div></div></Browser>
  <Terminal title="Request body · JSON" style={{ position: 'absolute', right: 116, top: 369, width: 819, height: 313 }}><div style={{ fontSize: 29, lineHeight: 1.5 }}>{'{'}<br />&nbsp;&nbsp;<span style={{ color: '#ff9fbd' }}>"title"</span>: <span style={{ color: '#ffd084' }}>"Belajar Next.js"</span>,<br />&nbsp;&nbsp;<span style={{ color: '#ff9fbd' }}>"description"</span>: <span style={{ color: '#ffd084' }}>"Integrasi REST API"</span><br />{'}'}</div></Terminal>
  <div style={{ position: 'absolute', right: 126, top: 726, width: 802, display: 'flex', alignItems: 'center', gap: 25 }}><div style={{ fontFamily: display, fontSize: 51, color: blue }}>POST /tasks</div><div style={{ fontSize: 29 }}>201 Created</div></div>
  <div style={{ position: 'absolute', left: 123, top: 879, fontSize: 26, color: muted }}>Sesudah sukses, Task dari Response tampil di daftar.</div>
</Canvas>;

const UpdateDelete: Page = () => <Canvas label="Update + Delete">
  <Title size={76} style={{ position: 'absolute', left: 110, top: 192 }}>Backend berubah. UI harus ikut berubah.</Title>
  <div style={{ position: 'absolute', left: 125, top: 374, width: 740 }}><div style={{ fontFamily: display, fontSize: 54 }}>Sebelum PATCH</div><Rule style={{ margin: '19px 0 28px', background: blue }} /><div style={{ background: cream, border: '3px solid ' + ink, borderRadius: 16, padding: '14px 25px' }}><TaskRow title="Belajar Next.js" /></div></div>
  <div style={{ position: 'absolute', right: 120, top: 374, width: 740 }}><div style={{ fontFamily: display, fontSize: 54 }}>Sesudah PATCH</div><Rule style={{ margin: '19px 0 28px', background: pink }} /><div style={{ background: cream, border: '3px solid ' + ink, borderRadius: 16, padding: '14px 25px' }}><TaskRow title="Belajar Next.js" done /></div></div>
  <div style={{ position: 'absolute', left: 130, top: 658, display: 'flex', alignItems: 'center', gap: 25, fontSize: 31 }}><Sticker tone="blue" tilt={-2}>completed: true</Sticker><span>Response memperbarui State.</span></div>
  <Rule style={{ position: 'absolute', left: 123, right: 123, top: 777 }} />
  <div style={{ position: 'absolute', left: 123, top: 811, fontSize: 34 }}><strong style={{ color: pink }}>DELETE /tasks/:id</strong> sukses, lalu Task hilang dari daftar.</div>
</Canvas>;

const Refactor: Page = () => <Canvas label="Refactor" bg={yellow}>
  <Title size={76} style={{ position: 'absolute', left: 110, top: 190 }}>Setelah CRUD bekerja, bagi responsibility.</Title>
  <div style={{ position: 'absolute', left: 122, top: 385, width: 663 }}><div style={{ fontFamily: display, fontSize: 57 }}>Awal</div><Rule style={{ margin: '19px 0 27px' }} /><div style={{ position: 'absolute', left: 0, top: 128, width: 640, whiteSpace: 'nowrap', fontFamily: mono, fontSize: 31 }}>/tasks/page.tsx</div><div style={{ position: 'absolute', left: 0, top: 190, width: 640, fontFamily: mono, fontSize: 28, color: '#695f47', whiteSpace: 'nowrap' }}>data · form · list · actions</div><div style={{ position: 'absolute', left: 0, top: 275, width: 640, whiteSpace: 'nowrap', fontSize: 29 }}>Mudah dimulai, lalu makin penuh.</div></div>
  <div style={{ position: 'absolute', right: 115, top: 384, width: 795 }}><div style={{ fontFamily: display, fontSize: 57 }}>Sesudah refactor</div><Rule style={{ margin: '19px 0 27px' }} />
    {[
      ['TasksPage', 'State + handlers'],
      ['TaskView', 'susun tampilan'],
      ['TaskForm + TaskItem', 'UI'],
      ['tasks.api.ts', 'HTTP'],
      ['task.ts', 'Task type'],
    ].map(([name, role], index) => <div key={name} style={{ position: 'absolute', left: 0, top: 127 + index * 54, width: 795, height: 40, fontFamily: mono, fontSize: 26, whiteSpace: 'nowrap' }}><div style={{ position: 'absolute', left: 0, top: 0, width: 430, whiteSpace: 'nowrap' }}>{name}</div><div style={{ position: 'absolute', left: 455, top: 0, width: 330, whiteSpace: 'nowrap', color: '#695f47' }}>{role}</div></div>)}
  </div>
  <div style={{ position: 'absolute', left: 124, top: 849, fontSize: 28 }}>Struktur mengikuti masalah yang kita temukan saat praktik.</div>
</Canvas>;

const Roadmap: Page = () => <Canvas label="Live coding">
  <Title size={78} style={{ position: 'absolute', left: 110, top: 194 }}>Enam checkpoint sampai CRUD dari browser.</Title>
  <div style={{ position: 'absolute', left: 119, right: 119, top: 380, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 55, rowGap: 73 }}>
    {[['01', 'SETUP', 'Backend + frontend siap', blue], ['02', 'ROUTING', '/ dan /tasks', pink], ['03', 'READ', 'GET + UI State', '#ae7a00'], ['04', 'CREATE', 'Form + POST', pink], ['05', 'UPDATE / DELETE', 'PATCH + DELETE', blue], ['06', 'REFACTOR + TEST', 'Component + API layer', '#ae7a00']].map(([n, h, s, c]) => <div key={n} style={{ borderTop: '4px solid ' + c, paddingTop: 18 }}><div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}><span style={{ fontFamily: display, fontSize: 72, color: c }}>{n}</span><span style={{ fontFamily: display, fontSize: 38 }}>{h}</span></div><div style={{ fontSize: 26, color: muted, marginTop: 7 }}>{s}</div></div>)}
  </div>
  <div style={{ position: 'absolute', left: 118, top: 868, fontSize: 26, color: muted }}>Build · Run · Observe · Temukan masalah · Rapikan · Test kembali</div>
</Canvas>;

const Closing: Page = () => <Canvas label="Ingat alurnya" bg={ink} inverse>
  <Title size={102} style={{ position: 'absolute', left: 110, top: 199, width: 1630 }}>Ikuti satu Task dari klik<br />sampai UI berubah.</Title>
  <div style={{ position: 'absolute', left: 119, right: 119, top: 538, display: 'flex', justifyContent: 'space-between', fontFamily: display, fontSize: 41 }}><span>User</span><span style={{ color: pink }}>●</span><span>Next.js UI</span><span style={{ color: yellow }}>●</span><span>HTTP</span><span style={{ color: pink }}>●</span><span>NestJS API</span><span style={{ color: yellow }}>●</span><span>PostgreSQL</span></div>
  <Rule style={{ position: 'absolute', left: 120, right: 120, top: 636, background: cream }} />
  <div style={{ position: 'absolute', left: 121, top: 689, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30, width: 1660, fontSize: 28, lineHeight: 1.35 }}><div><strong style={{ color: yellow }}>Event</strong><br />Aksi apa yang terjadi?</div><div><strong style={{ color: yellow }}>State</strong><br />Data UI apa yang berubah?</div><div><strong style={{ color: yellow }}>Request</strong><br />Endpoint mana yang dipakai?</div><div><strong style={{ color: yellow }}>Response</strong><br />Apa hasilnya di UI?</div></div>
  <div style={{ position: 'absolute', left: 121, top: 870, fontSize: 30 }}>Sekarang buka editor. Kita mulai dari halaman Task.</div>
</Canvas>;

export const notes: (string | undefined)[] = [
  `Durasi ±45 detik. Ingatkan bahwa Day 1 menghasilkan NestJS API yang dapat diuji lewat Bruno. Hari ini kita membuat halaman Next.js agar user bisa melakukan CRUD Task dari browser melalui API yang sama. Fokus paparan adalah alur data sebelum live coding.`,
  `Durasi ±1 menit 15 detik. Tunjukkan halaman /tasks sebagai hasil yang akan dicapai: membaca daftar, membuat Task, mengubah completed, dan menghapus Task. Setiap aksi memakai endpoint NestJS, tidak mengakses PostgreSQL langsung. Pada checkpoint Day 2 belum ada form edit judul atau deskripsi, jadi jangan menjanjikannya di sesi ini.`,
  `Durasi ±1 menit. Day 1 menjawab bagaimana request diproses dan Task disimpan. Day 2 menjawab bagaimana user memakai backend itu lewat UI. Hari berikutnya project berkembang lagi; cukup tunjukkan kesinambungannya tanpa masuk ke implementasi di luar Day 2.`,
  `Durasi ±1 menit. Bruno adalah API client yang dipakai developer untuk menguji endpoint secara manual. Hari ini form dan tombol Next.js menjadi cara user mengirim request yang sebelumnya dikirim lewat Bruno. Kontrak HTTP dan NestJS API tetap sama meski client berubah.`,
  `Durasi ±1 menit 30 detik. React menyusun UI dari Component dan mengelola Props, State, serta Event. Next.js memakai React lalu memberi struktur aplikasi seperti App Router, Page, Layout, dan pilihan rendering. Saat menulis Component dalam Next.js, kita tetap memakai konsep React.`,
  `Durasi ±1 menit 30 detik. Tanyakan mengapa React saja belum menjelaskan seluruh struktur aplikasi web. Next.js memberi convention untuk routing, halaman, dan batas server dengan client. Dalam workshop, NestJS dipakai sebagai API terpisah supaya hubungan Frontend, Backend, dan Database mudah ditelusuri. Ini pilihan workshop, bukan aturan bagi semua project Next.js.`,
  `Durasi ±1 menit 30 detik. Visual ini ilustrasi interface sistem keuangan, bukan screenshot produk yang telah diverifikasi. Jika pemateri punya contoh project yang aman ditampilkan, ceritakan dari sisi user: form mengirim request, daftar menampilkan data, dan UI menunjukkan loading atau error. Ketika fitur bertambah, Component dan akses API perlu ditata. Hubungkan lagi ke Task Management yang lebih kecil tetapi alurnya serupa.`,
  `Durasi ±45 detik. Tools Day 1 tetap dipakai. Perhatian baru hari ini ada pada folder frontend dan Browser DevTools. Bruno membantu memisahkan masalah API dari masalah integrasi UI; Console dan Network memberi bukti yang tidak selalu terlihat di halaman. TypeScript membantu bentuk data dan Tailwind membantu styling sederhana.`,
  `Durasi ±1 menit 30 detik. Sebelum menulis fetch, pastikan PostgreSQL dan NestJS hidup lalu uji GET /tasks di Bruno atau curl. Respons [] dengan status 200 tetap berarti API berfungsi. Jika cabang utama sudah berkembang melampaui checkpoint Day 1, gunakan backend Day 1 untuk demo CRUD ini. Bila PostgreSQL memakai Docker, periksa container berjalan, bukan hanya Docker CLI terpasang.`,
  `Durasi ±1 menit 15 detik. Ada dua proses development: Next.js di localhost:3000 dan NestJS API di localhost:3001. Port berbeda berarti origin browser berbeda. Backend checkpoint telah mengizinkan origin frontend melalui CORS; jelaskan secukupnya sebagai alasan untuk memeriksa Network bila request browser gagal.`,
  `Durasi ±1 menit 15 detik. Hubungkan src/app/page.tsx dengan / dan src/app/tasks/page.tsx dengan /tasks. Folder memberi segment URL dan page.tsx membuat UI route tersebut. layout.tsx membungkus halaman di bawahnya. Cukup dua route ini untuk Day 2.`,
  `Durasi ±1 menit 30 detik. Mulai dari mockup UI. TasksPage memiliki data dan handler, TaskView menyusun tampilan, TaskForm mengurus input serta submit, dan TaskItem menampilkan satu Task dengan aksinya. Jelaskan bahwa Component dibuat ketika tanggung jawabnya mulai jelas; sesi praktik akan memahami CRUD dalam satu page sebelum merapikan struktur.`,
  `Durasi ±1 menit 45 detik. Saat user mengetik Belajar Next.js, onChange adalah Event dan nilai input menjadi State. UI merender nilai terbaru. TasksPage meneruskan data serta callback sebagai Props ke Component anak. State adalah kondisi frontend saat ini; PostgreSQL menyimpan data persisten setelah request berhasil.`,
  `Durasi ±1 menit 30 detik. Server Component masih bagian dari Next.js, bukan NestJS. Bagian yang memakai State, onClick, dan form interaktif membutuhkan Client Component; TasksPage pada checkpoint memakai use client. Dalam latihan, CRUD dijalankan di client agar Event, Network Request, dan UI Update mudah diamati. Pengambilan data di Server Component juga valid untuk kebutuhan lain.`,
  `Durasi ±1 menit 30 detik. Telusuri satu klik Tambah: form memicu submit, frontend mengirim POST /tasks, NestJS memvalidasi body, Service memakai Prisma, dan PostgreSQL menyimpan Task. Backend mengirim Task hasilnya sebagai Response. Frontend memperbarui State lalu UI menampilkan Task yang benar-benar dibuat server. Diagram ini menjadi peta utama saat live coding.`,
  `Durasi ±1 menit. Browser tidak tahu berapa lama backend merespons, maka Loading State diperlukan. Request juga bisa gagal. Fetch dapat selesai walau server membalas 4xx atau 5xx, sehingga frontend perlu memeriksa response.ok sebelum membaca hasil. Saat praktik, cocokkan penjelasan dengan status di Network tab.`,
  `Durasi ±1 menit 30 detik. Frontend memerlukan API Contract: endpoint, bentuk Request, dan bentuk Response; ia tidak perlu tahu tabel PostgreSQL. POST /tasks menerima title wajib dan description opsional. DTO backend membatasi title maksimal 120 karakter dan description maksimal 500; PATCH toggle mengirim boolean completed. TypeScript membantu saat menulis kode, sedangkan Backend Validation tetap memeriksa request saat dijalankan.`,
  `Durasi ±1 menit 15 detik. Setelah GET /tasks, bedakan Loading, daftar berisi data, respons 200 dengan array kosong, dan Error. Checkpoint historis sudah menangani loading dan error; pesan Empty yang jelas akan ditambahkan saat live coding. Keempat kondisi ini membantu user memahami apa yang terjadi tanpa membuka DevTools.`,
  `Durasi ±1 menit. Form menyimpan title dan description sebagai State, lalu submit mengirim JSON ke POST /tasks. Validasi ringan seperti menahan judul kosong akan dibuat saat praktik untuk pengalaman user; backend tetap memvalidasi karena API dapat dipanggil oleh client lain. Sesudah 201, gunakan Task dari Response untuk memperbarui daftar agar id dan nilai default berasal dari server.`,
  `Durasi ±1 menit. Update Day 2 berarti toggle field completed, bukan edit judul. Setelah PATCH berhasil, ganti Task di array dengan hasil server; setelah DELETE berhasil, baru keluarkan Task dari UI. Checkpoint historis saat ini mengirim dua PATCH per klik dan mempunyai jeda GET buatan; saat live coding rapikan menjadi satu request lewat updateTask. Jangan tampilkan UI berhasil bila Request gagal.`,
  `Durasi ±45 detik. Setelah CRUD bekerja, satu page mulai memuat terlalu banyak pekerjaan. Pindahkan akses API ke tasks.api.ts, bentuk data ke task.ts, dan tampilan ke TaskView, TaskForm, serta TaskItem. Tujuannya memudahkan penelusuran tanggung jawab, bukan memperbanyak file. Tunjukkan bahwa refactor adalah respons terhadap masalah yang terlihat selama praktik.`,
  `Durasi ±2 menit. Praktik dimulai dari backend siap dan halaman statis, lalu State serta form lokal sebelum menghubungkan GET, POST, PATCH, dan DELETE. Setelah semua aksi dapat dilihat di Network tab, rapikan Component dan API layer. Definisi selesai: satu Task dapat dibuat, ditampilkan, diubah status completed, dan dihapus dari browser dengan respons NestJS yang nyata.`,
  `Durasi ±1 menit 30 detik. Tutup dengan pertanyaan untuk setiap interaksi: Event apa, State mana, Request ke endpoint apa, Response apa, dan bagaimana UI berubah? Browser dan Next.js menjadi client API; NestJS serta PostgreSQL memproses dan menyimpan. Pindah ke live coding dengan menelusuri satu Task dari form sampai hasilnya muncul di halaman.`,
];

export const meta: SlideMeta = {
  title: 'Day 2 | Next.js CRUD Task + REST API Integration',
  createdAt: '2026-10-14T07:20:21.696Z',
};

export default [Cover, Target, Workshop, BrunoBrowser, ReactNext, WhyNext, RealProject, Tools, Preflight, TwoApps, AppRouter, Components, PropsStateEvent, ServerClient, FullFlow, Fetch, ApiContract, ReadStates, Create, UpdateDelete, Refactor, Roadmap, Closing] satisfies Page[];
