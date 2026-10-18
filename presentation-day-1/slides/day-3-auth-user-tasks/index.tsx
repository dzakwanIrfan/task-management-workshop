import type { CSSProperties, ReactNode } from 'react';
import { useSlidePageNumber } from '@open-slide/core';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import nextLogo from './assets/nextjs.svg';
import nestLogo from './assets/nestjs.svg';
import postgresLogo from './assets/postgresql.svg';
import prismaLogo from './assets/prisma.svg';
import brunoLogo from './assets/bruno.svg';
import outfitFont from './assets/outfit-800.ttf';
import inter500 from './assets/inter-500.ttf';
import inter700 from './assets/inter-700.ttf';

const FONT_STYLE_ID = 'day3-sticker-fonts';
if (typeof document !== 'undefined') {
  let style = document.getElementById(FONT_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = FONT_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent =
    "@font-face{font-family:'OutfitDay3';src:url('" + outfitFont + "') format('truetype');font-weight:800;font-display:swap}" +
    "@font-face{font-family:'InterDay3';src:url('" + inter500 + "') format('truetype');font-weight:500;font-display:swap}" +
    "@font-face{font-family:'InterDay3';src:url('" + inter700 + "') format('truetype');font-weight:700;font-display:swap}";
}

export const design: DesignSystem = {
  palette: { bg: '#fff2e8', text: '#12375b', accent: '#3378e6' },
  fonts: { display: "'OutfitDay3', 'Outfit', system-ui, sans-serif", body: "'InterDay3', 'Inter', system-ui, sans-serif" },
  typeScale: { hero: 146, body: 34 },
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
const cyan = '#80d6eb';
const display = 'var(--osd-font-display)';
const body = 'var(--osd-font-body)';
const mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const Footer = ({ inverse = false }: { inverse?: boolean }) => {
  const { current, total } = useSlidePageNumber();
  return <div style={{ position: 'absolute', left: 110, right: 110, bottom: 43, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: body, fontSize: 20, fontWeight: 700, color: inverse ? peach : muted }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><i style={{ width: 12, height: 12, borderRadius: '50%', background: pink }} /><i style={{ width: 12, height: 12, borderRadius: '50%', background: blue }} /><i style={{ width: 12, height: 12, borderRadius: '50%', background: yellow }} /><span style={{ marginLeft: 10 }}>Authentication + Task</span></div>
    <span style={{ border: '2px solid currentColor', borderRadius: 100, padding: '5px 17px', fontVariantNumeric: 'tabular-nums' }}>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
  </div>;
};
const Sticker = ({ children, tone = 'blue', tilt = -3, style }: { children: ReactNode; tone?: 'blue' | 'pink' | 'yellow'; tilt?: number; style?: CSSProperties }) => {
  const fill = tone === 'blue' ? blue : tone === 'pink' ? pink : yellow;
  return <span style={{ display: 'inline-block', background: fill, color: tone === 'yellow' ? ink : cream, border: '3px solid ' + ink, boxShadow: '5px 5px 0 ' + ink, borderRadius: 999, padding: '10px 21px', fontSize: 23, fontWeight: 700, letterSpacing: '0.035em', transform: 'rotate(' + tilt + 'deg)', ...style }}>{children}</span>;
};
const Canvas = ({ children, label, bg = peach, inverse = false }: { children: ReactNode; label?: string; bg?: string; inverse?: boolean }) => <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', position: 'relative', background: bg, color: inverse ? cream : ink, fontFamily: body }}>
  {label && <div style={{ position: 'absolute', top: 65, left: 110 }}><Sticker tone={inverse ? 'yellow' : 'blue'}>{label}</Sticker></div>}
  {children}<Footer inverse={inverse} />
</div>;
const Title = ({ children, size = 78, style }: { children: ReactNode; size?: number; style?: CSSProperties }) => <h1 style={{ fontFamily: display, fontSize: size, lineHeight: 1.045, letterSpacing: '-0.035em', fontWeight: 800, margin: 0, ...style }}>{children}</h1>;
const Rule = ({ style }: { style?: CSSProperties }) => <div style={{ height: 3, background: ink, ...style }} />;
const Logo = ({ src, alt, size = 80, style }: { src: string; alt: string; size?: number; style?: CSSProperties }) => <img src={src} alt={alt} style={{ width: size, height: size, objectFit: 'contain', ...style }} />;
const Code = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => <span style={{ fontFamily: mono, ...style }}>{children}</span>;
const Ide = ({ title, children, style }: { title: string; children: ReactNode; style?: CSSProperties }) => <div style={{ background: dark, color: '#eaf4ff', border: '3px solid ' + ink, boxShadow: '9px 9px 0 ' + ink, borderRadius: 20, overflow: 'hidden', fontFamily: mono, ...style }}>
  <div style={{ height: 53, background: '#183a59', display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', color: '#b9cddd', fontSize: 18 }}><i style={{ width: 12, height: 12, borderRadius: '50%', background: pink }} /><i style={{ width: 12, height: 12, borderRadius: '50%', background: yellow }} /><i style={{ width: 12, height: 12, borderRadius: '50%', background: blue }} /><span style={{ marginLeft: 15 }}>{title}</span></div>
  <div style={{ padding: '26px 32px' }}>{children}</div>
</div>;
const Browser = ({ children, url = '/tasks', style }: { children: ReactNode; url?: string; style?: CSSProperties }) => <div style={{ background: cream, border: '3px solid ' + ink, borderRadius: 23, boxShadow: '10px 10px 0 ' + ink, overflow: 'hidden', ...style }}>
  <div style={{ height: 58, borderBottom: '3px solid ' + ink, background: lightBlue, display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px' }}><i style={{ width: 13, height: 13, borderRadius: '50%', background: pink }} /><i style={{ width: 13, height: 13, borderRadius: '50%', background: yellow }} /><i style={{ width: 13, height: 13, borderRadius: '50%', background: blue }} /><span style={{ marginLeft: 22, minWidth: 245, maxWidth: '75%', whiteSpace: 'nowrap', background: cream, borderRadius: 8, padding: '7px 17px', fontFamily: mono, color: muted, fontSize: 18 }}>{url}</span></div>
  {children}
</div>;
const Avatar = ({ name, color = blue, size = 90 }: { name: string; color?: string; size?: number }) => <div style={{ width: size, height: size, borderRadius: '50%', background: color, border: '4px solid ' + ink, boxShadow: '5px 5px 0 ' + ink, display: 'grid', placeItems: 'center', color: cream, fontFamily: display, fontSize: size * 0.47, flexShrink: 0 }}>{name.slice(0, 1)}</div>;
const TaskStrip = ({ owner, title, done = false, style }: { owner?: string; title: string; done?: boolean; style?: CSSProperties }) => <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 22px', borderBottom: '2px solid #bbcbdb', fontSize: 25, ...style }}><span style={{ width: 29, height: 29, border: '3px solid ' + blue, borderRadius: 7, color: cream, background: done ? blue : 'transparent', textAlign: 'center', lineHeight: '24px' }}>{done ? '✓' : ''}</span><span style={{ flex: 1 }}>{title}</span>{owner && <span style={{ color: muted, fontSize: 19 }}>{owner}</span>}</div>;
const CodeRow = ({ number, children, color = '#eaf4ff' }: { number: string; children: ReactNode; color?: string }) => <div style={{ display: 'flex', gap: 25, whiteSpace: 'nowrap', fontSize: 27, lineHeight: 1.85, color }}><span style={{ color: '#65809b', width: 32, textAlign: 'right' }}>{number}</span><span>{children}</span></div>;

const Cover: Page = () => <Canvas>
  <div style={{ position: 'absolute', left: 113, top: 83 }}><Sticker tone="yellow" tilt={-5}>Next.js & NestJS workshop</Sticker></div>
  <Title size={140} style={{ position: 'absolute', left: 108, top: 217, width: 1240 }}>Authentication<br />dan Task<br />milik User</Title>
  <div style={{ position: 'absolute', left: 116, top: 754, fontSize: 40, fontWeight: 700 }}>JWT Guard · Next.js · PostgreSQL</div>
  <div style={{ position: 'absolute', right: 127, top: 183, width: 410, height: 410, borderRadius: '50%', background: yellow, border: '4px solid ' + ink, boxShadow: '12px 12px 0 ' + ink }} />
  <Logo src={nestLogo} alt="NestJS logo" size={201} style={{ position: 'absolute', right: 229, top: 282, transform: 'rotate(-10deg)' }} />
  <div style={{ position: 'absolute', right: 153, top: 652, display: 'flex', alignItems: 'center', gap: 33 }}><Logo src={nextLogo} alt="Next.js logo" size={106} /><Logo src={postgresLogo} alt="PostgreSQL logo" size={110} /></div>
  <div style={{ position: 'absolute', right: 121, top: 817 }}><Sticker tone="pink" tilt={5}>DAY 3</Sticker></div>
</Canvas>;

const Outcome: Page = () => <Canvas label="Target kita">
  <Title size={78} style={{ position: 'absolute', left: 110, top: 204, width: 720 }}>Halaman sama.<br />Task berbeda.</Title>
  <div style={{ position: 'absolute', left: 118, top: 445, width: 570, fontSize: 36, lineHeight: 1.4 }}>Alya membuat <strong>Siapkan demo</strong>. Bima login, tetapi Task itu tidak muncul.</div>
  <Rule style={{ position: 'absolute', left: 118, top: 687, width: 565 }} />
  <div style={{ position: 'absolute', left: 118, top: 726, fontFamily: mono, fontSize: 31 }}>/register · /login · /tasks</div>
  <Browser url="/tasks · Alya" style={{ position: 'absolute', left: 786, top: 260, width: 935, height: 270, transform: 'rotate(-2deg)' }}><div style={{ padding: '25px 34px' }}><div style={{ fontSize: 23, color: muted }}>Login sebagai alya@example.com</div><div style={{ fontFamily: display, fontSize: 40, marginTop: 17 }}>Task milik Alya</div><TaskStrip title="Siapkan demo" done /></div></Browser>
  <Browser url="/tasks · Bima" style={{ position: 'absolute', left: 887, top: 593, width: 855, height: 249, transform: 'rotate(2deg)' }}><div style={{ padding: '24px 34px' }}><div style={{ fontSize: 23, color: muted }}>Login sebagai bima@example.com</div><div style={{ fontFamily: display, fontSize: 39, marginTop: 17 }}>Belum ada Task.</div></div></Browser>
</Canvas>;

const Continuity: Page = () => <Canvas label="Peta workshop" bg={ink} inverse>
  <Title size={79} style={{ position: 'absolute', left: 110, top: 205 }}>Project yang sama, aturan yang baru.</Title>
  <div style={{ position: 'absolute', left: 115, top: 415, width: 455 }}><div style={{ fontFamily: display, fontSize: 137, color: pink }}>01</div><Rule style={{ background: pink, margin: '2px 0 29px' }} /><div style={{ fontFamily: display, fontSize: 51 }}>REST API</div><div style={{ fontSize: 29, marginTop: 17, color: '#c9dce9' }}>NestJS menyimpan Task.</div></div>
  <div style={{ position: 'absolute', left: 733, top: 415, width: 455 }}><div style={{ fontFamily: display, fontSize: 137, color: yellow }}>02</div><Rule style={{ background: yellow, margin: '2px 0 29px' }} /><div style={{ fontFamily: display, fontSize: 51 }}>Browser</div><div style={{ fontSize: 29, marginTop: 17, color: '#c9dce9' }}>Next.js memakai API Task.</div></div>
  <div style={{ position: 'absolute', left: 1350, top: 415, width: 455 }}><div style={{ fontFamily: display, fontSize: 137, color: '#8bc3ff' }}>03</div><Rule style={{ background: '#8bc3ff', margin: '2px 0 29px' }} /><div style={{ fontFamily: display, fontSize: 51 }}>Identitas</div><div style={{ fontSize: 29, marginTop: 17, color: cream }}>Request tahu pemiliknya.</div></div>
  <div style={{ position: 'absolute', right: 133, top: 305 }}><Sticker tone="yellow" tilt={4}>HARI INI</Sticker></div>
</Canvas>;

const PublicTask: Page = () => <Canvas label="Masalah Day 2">
  <Title size={78} style={{ position: 'absolute', left: 110, top: 201, width: 870 }}>Siapa pun bisa meminta semua Task.</Title>
  <div style={{ position: 'absolute', left: 121, top: 452, display: 'flex', alignItems: 'center', gap: 30 }}><Avatar name="A" color={blue} /><Avatar name="B" color={pink} /><div style={{ fontFamily: display, fontSize: 52, width: 470 }}>Daftar yang sama.</div></div>
  <div style={{ position: 'absolute', left: 122, top: 661, fontSize: 34, lineHeight: 1.42, width: 660 }}>Pada starter, <Code>GET /tasks</Code> memberi <strong>200</strong> tanpa token.</div>
  <Ide title="day-3-starter · tasks.service.ts" style={{ position: 'absolute', right: 119, top: 326, width: 870, height: 428 }}><CodeRow number="16">async <span style={{ color: cyan }}>findAll</span>() {'{'}</CodeRow><CodeRow number="17">&nbsp;&nbsp;return this.prismaService.task.<span style={{ color: yellow }}>findMany</span>();</CodeRow><CodeRow number="18">{'}'}</CodeRow><Rule style={{ background: '#50718e', margin: '27px 0' }} /><div style={{ fontSize: 25, color: '#a9c0d2' }}>Tidak ada filter pemilik.</div></Ide>
</Canvas>;

const AuthQuestions: Page = () => <Canvas label="Dua pertanyaan" bg={peachDeep}>
  <Title size={78} style={{ position: 'absolute', left: 110, top: 197, width: 1590 }}>Token valid belum membuka semua Task.</Title>
  <div style={{ position: 'absolute', left: 120, top: 405, width: 745 }}><div style={{ fontFamily: display, fontSize: 64, color: blue }}>Authentication</div><div style={{ fontFamily: display, fontSize: 59, marginTop: 30 }}>“Kamu siapa?”</div><Rule style={{ background: blue, margin: '39px 0 28px' }} /><div style={{ fontSize: 32 }}>Login dan Guard memeriksa identitas.</div><div style={{ fontFamily: mono, fontSize: 27, color: muted, marginTop: 27 }}>JwtAuthGuard</div></div>
  <div style={{ position: 'absolute', right: 120, top: 405, width: 742 }}><div style={{ fontFamily: display, fontSize: 64, color: pink }}>Authorization</div><div style={{ fontFamily: display, fontSize: 59, marginTop: 30 }}>“Task ini milikmu?”</div><Rule style={{ background: pink, margin: '39px 0 28px' }} /><div style={{ fontSize: 32 }}>TasksService membatasi data.</div><div style={{ fontFamily: mono, fontSize: 27, color: muted, marginTop: 27 }}>where: {'{'} id, userId {'}'}</div></div>
</Canvas>;

const RoomAnalogy: Page = () => <Canvas label="Analogi" bg={lightBlue}>
  <Title size={77} style={{ position: 'absolute', left: 110, top: 192 }}>Boleh masuk. Belum tentu boleh buka loker.</Title>
  <div style={{ position: 'absolute', left: 154, top: 373, width: 1610, height: 463, background: cream, border: '5px solid ' + ink, borderRadius: 30, boxShadow: '12px 12px 0 ' + ink }}>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 92, background: peachDeep, borderRadius: '0 0 25px 25px', borderTop: '4px solid ' + ink }} />
    <div style={{ position: 'absolute', left: 70, top: 81, width: 218, height: 288, background: blue, border: '5px solid ' + ink, borderRadius: '110px 110px 8px 8px' }}><div style={{ position: 'absolute', top: 44, left: 44, fontFamily: display, fontSize: 30, color: cream }}>PINTU</div><div style={{ position: 'absolute', right: 22, top: 158, width: 18, height: 18, borderRadius: '50%', background: yellow, border: '2px solid ' + ink }} /></div>
    <div style={{ position: 'absolute', left: 330, top: 75, width: 200, height: 290 }}><div style={{ marginLeft: 48, width: 104, height: 104, borderRadius: '50%', background: '#ffd1ae', border: '4px solid ' + ink }} /><div style={{ marginTop: -5, width: 200, height: 170, background: ink, borderRadius: '60px 60px 20px 20px' }} /><div style={{ position: 'absolute', left: 32, top: 157, background: yellow, padding: '8px 16px', border: '3px solid ' + ink, borderRadius: 12, fontFamily: mono, fontSize: 24 }}>GUARD</div></div>
    <div style={{ position: 'absolute', left: 591, top: 128, fontFamily: display, fontSize: 42 }}>Tanda pengenal<br />diperiksa di sini.</div>
    <div style={{ position: 'absolute', right: 355, top: 89, width: 235, height: 280, background: yellow, border: '5px solid ' + ink, borderRadius: 14 }}><div style={{ fontFamily: display, fontSize: 37, padding: '29px 21px' }}>ALYA</div><div style={{ height: 4, background: ink }} /><div style={{ margin: '32px 20px', fontSize: 24 }}>Siapkan demo</div><div style={{ position: 'absolute', right: 18, bottom: 23, width: 40, height: 40, borderRadius: '50%', background: pink, border: '3px solid ' + ink }} /></div>
    <div style={{ position: 'absolute', right: 75, top: 89, width: 235, height: 280, background: lightBlue, border: '5px solid ' + ink, borderRadius: 14 }}><div style={{ fontFamily: display, fontSize: 37, padding: '29px 21px' }}>BIMA</div><div style={{ height: 4, background: ink }} /><div style={{ margin: '34px 20px', fontSize: 24, color: muted }}>Loker lain</div><div style={{ position: 'absolute', right: 18, bottom: 23, width: 40, height: 40, borderRadius: '50%', background: blue, border: '3px solid ' + ink }} /></div>
  </div>
  <div style={{ position: 'absolute', left: 167, top: 862, fontFamily: mono, fontSize: 26 }}>Guard memeriksa token.</div>
  <div style={{ position: 'absolute', right: 151, top: 862, fontFamily: mono, fontSize: 26 }}>TasksService memeriksa userId.</div>
</Canvas>;

const Preflight: Page = () => <Canvas label="Preflight">
  <Title size={76} style={{ position: 'absolute', left: 110, top: 195 }}>Cek kondisi awal sebelum mengubah schema.</Title>
  <Ide title="Terminal · day-3-starter" style={{ position: 'absolute', left: 120, top: 367, width: 867, height: 462 }}><CodeRow number="01"><span style={{ color: cyan }}>backend</span> &nbsp; localhost:3001</CodeRow><CodeRow number="02"><span style={{ color: cyan }}>frontend</span> &nbsp;localhost:3000</CodeRow><CodeRow number="03">$ curl -i localhost:3001/tasks</CodeRow><CodeRow number="04"><span style={{ color: '#a5e3ad' }}>HTTP/1.1 200 OK</span></CodeRow></Ide>
  <div style={{ position: 'absolute', right: 112, top: 366, width: 704, height: 466, background: lightBlue, borderTop: '6px solid ' + blue, padding: '42px 51px', boxSizing: 'border-box' }}><div style={{ fontFamily: display, fontSize: 56 }}>Data latihan</div><div style={{ fontSize: 34, lineHeight: 1.43, marginTop: 27 }}>Tabel <Code>Task</Code> harus kosong sebelum <Code>userId</Code> menjadi wajib.</div><Rule style={{ margin: '29px 0' }} /><div style={{ fontSize: 28, color: muted }}>JWT_SECRET hanya di backend.</div></div>
  <div style={{ position: 'absolute', left: 123, top: 856, display: 'flex', alignItems: 'center', gap: 15, fontSize: 27, color: muted }}><Logo src={brunoLogo} alt="Bruno logo" size={43} /><span>Bruno atau curl untuk API · DevTools Network untuk request browser</span></div>
</Canvas>;

const Relation: Page = () => <Canvas label="Data model" bg={peachDeep}>
  <Title size={78} style={{ position: 'absolute', left: 110, top: 191 }}>Satu User, banyak Task.</Title>
  <div style={{ position: 'absolute', left: 126, top: 392, display: 'flex', alignItems: 'center', gap: 28 }}><Avatar name="A" size={153} /><div><div style={{ fontFamily: display, fontSize: 63 }}>Alya</div><div style={{ fontSize: 30, color: muted }}>User.id = 7</div></div></div>
  <div style={{ position: 'absolute', left: 221, top: 589, width: 9, height: 239, background: blue, borderRadius: 9 }} />
  <div style={{ position: 'absolute', left: 286, top: 575, width: 637, background: cream, borderTop: '5px solid ' + blue }}><TaskStrip owner="userId: 7" title="Siapkan demo" /><TaskStrip owner="userId: 7" title="Uji API" /><TaskStrip owner="userId: 7" title="Cek UI" /></div>
  <Ide title="schema.prisma" style={{ position: 'absolute', right: 117, top: 365, width: 735, height: 409 }}><CodeRow number="16"><span style={{ color: cyan }}>model</span> Task {'{'}</CodeRow><CodeRow number="23">&nbsp;&nbsp;userId&nbsp; Int</CodeRow><CodeRow number="24">&nbsp;&nbsp;user&nbsp;&nbsp;&nbsp; User @relation(...)</CodeRow><CodeRow number="27">{'}'}</CodeRow></Ide>
  <div style={{ position: 'absolute', right: 120, top: 808, width: 680, display: 'flex', alignItems: 'center', gap: 17, fontSize: 29 }}><Logo src={prismaLogo} alt="Prisma logo" size={61} /><span>Relasi tersimpan di database. Query tetap perlu filter pemilik.</span></div>
</Canvas>;

const ThreeValues: Page = () => <Canvas label="Jangan tertukar">
  <Title size={80} style={{ position: 'absolute', left: 110, top: 191 }}>Tiga nilai, tiga tugas.</Title>
  <div style={{ position: 'absolute', left: 128, top: 380, width: 478 }}><div style={{ fontFamily: display, fontSize: 92, color: pink }}>01</div><Rule style={{ background: pink, margin: '13px 0 31px' }} /><div style={{ fontFamily: display, fontSize: 55 }}>Password</div><div style={{ fontSize: 32, lineHeight: 1.4, marginTop: 19 }}>Diketik user saat register dan login.</div><div style={{ marginTop: 43, color: muted, fontFamily: mono, fontSize: 35 }}>••••••••</div></div>
  <div style={{ position: 'absolute', left: 727, top: 380, width: 478 }}><div style={{ fontFamily: display, fontSize: 92, color: blue }}>02</div><Rule style={{ background: blue, margin: '13px 0 31px' }} /><div style={{ fontFamily: display, fontSize: 55 }}>passwordHash</div><div style={{ fontSize: 32, lineHeight: 1.4, marginTop: 19 }}>Hasil bcrypt yang disimpan di database.</div><div style={{ marginTop: 43, color: muted, fontFamily: mono, fontSize: 35 }}>$2b$10$…</div></div>
  <div style={{ position: 'absolute', right: 123, top: 380, width: 478 }}><div style={{ fontFamily: display, fontSize: 92, color: '#bc8c00' }}>03</div><Rule style={{ background: yellow, margin: '13px 0 31px' }} /><div style={{ fontFamily: display, fontSize: 55 }}>accessToken</div><div style={{ fontSize: 32, lineHeight: 1.4, marginTop: 19 }}>Dibawa request setelah login.</div><div style={{ marginTop: 43, color: muted, fontFamily: mono, fontSize: 34 }}>eyJ…</div></div>
</Canvas>;

const Register: Page = () => <Canvas label="Register" bg={lightBlue}>
  <Title size={75} style={{ position: 'absolute', left: 110, top: 193 }}>Simpan User, jangan kirim password kembali.</Title>
  <Ide title="POST /auth/register · request" style={{ position: 'absolute', left: 121, top: 369, width: 760, height: 386 }}><CodeRow number="01">{'{'}</CodeRow><CodeRow number="02">&nbsp; <span style={{ color: pink }}>"email"</span>: <span style={{ color: yellow }}>"alya@example.com"</span>,</CodeRow><CodeRow number="03">&nbsp; <span style={{ color: pink }}>"password"</span>: <span style={{ color: yellow }}>"••••••••"</span></CodeRow><CodeRow number="04">{'}'}</CodeRow></Ide>
  <Ide title="201 Created · response" style={{ position: 'absolute', right: 121, top: 369, width: 760, height: 386 }}><CodeRow number="01">{'{'}</CodeRow><CodeRow number="02">&nbsp; <span style={{ color: pink }}>"id"</span>: <span style={{ color: cyan }}>7</span>,</CodeRow><CodeRow number="03">&nbsp; <span style={{ color: pink }}>"email"</span>: <span style={{ color: yellow }}>"alya@example.com"</span></CodeRow><CodeRow number="04">{'}'}</CodeRow></Ide>
  <div style={{ position: 'absolute', left: 127, top: 803, fontSize: 31 }}>Validasi · lowercase email · bcrypt.hash · simpan User</div>
  <div style={{ position: 'absolute', right: 125, top: 803, fontSize: 30, fontWeight: 700, color: blue }}>400 input salah &nbsp; 409 email duplikat</div>
</Canvas>;

const Login: Page = () => <Canvas label="Login">
  <Title size={78} style={{ position: 'absolute', left: 110, top: 197 }}>Token terbit setelah password cocok.</Title>
  <Ide title="auth.service.ts · login" style={{ position: 'absolute', left: 235, top: 367, width: 1428, height: 430 }}><CodeRow number="48"><span style={{ color: cyan }}>const</span> user = await this.prisma.user.findUnique(...);</CodeRow><CodeRow number="49"><span style={{ color: cyan }}>if</span> (!user || !await bcrypt.<span style={{ color: yellow }}>compare</span>(...))</CodeRow><CodeRow number="50">&nbsp;&nbsp;throw new UnauthorizedException(...);</CodeRow><CodeRow number="52"><span style={{ color: cyan }}>const</span> accessToken = await this.jwt.<span style={{ color: yellow }}>signAsync</span>({'{'} sub: user.id {'}'});</CodeRow></Ide>
  <div style={{ position: 'absolute', left: 136, top: 842, fontSize: 33, fontWeight: 700 }}>200 · accessToken + profil publik</div>
  <div style={{ position: 'absolute', right: 136, top: 842, fontSize: 33, fontWeight: 700, color: pink }}>401 · email atau password salah</div>
</Canvas>;

const JwtAnatomy: Page = () => <Canvas label="JWT" bg={yellow}>
  <Title size={79} style={{ position: 'absolute', left: 110, top: 193 }}>Payload dapat dibaca. Signature harus diperiksa.</Title>
  <div style={{ position: 'absolute', left: 125, top: 408, display: 'flex', alignItems: 'center', gap: 24, fontFamily: mono, fontSize: 53, fontWeight: 700 }}><span style={{ color: pink }}>header</span><span>.</span><span style={{ color: blue }}>payload</span><span>.</span><span style={{ color: ink }}>signature</span></div>
  <Rule style={{ position: 'absolute', left: 126, right: 125, top: 547 }} />
  <div style={{ position: 'absolute', left: 128, top: 602, width: 753 }}><div style={{ fontFamily: display, fontSize: 57 }}>Di payload</div><div style={{ fontFamily: mono, fontSize: 32, lineHeight: 1.7, marginTop: 19 }}>{'{'} "sub": 7, "exp": … {'}'}</div><div style={{ fontSize: 31, marginTop: 24 }}>ID User dan batas masa berlaku.</div></div>
  <div style={{ position: 'absolute', right: 135, top: 601, width: 685, fontSize: 40, lineHeight: 1.4, fontWeight: 700 }}>Membaca token belum membuktikan token itu asli.</div>
</Canvas>;

const Bearer: Page = () => <Canvas label="Request protected">
  <Title size={79} style={{ position: 'absolute', left: 110, top: 192 }}>Request berikutnya membawa token.</Title>
  <div style={{ position: 'absolute', left: 143, top: 380, width: 329, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 31 }}><Logo src={nextLogo} alt="Next.js logo" size={166} /><div style={{ fontFamily: display, fontSize: 49 }}>Browser</div></div>
  <Ide title="Network · Request Headers" style={{ position: 'absolute', left: 558, top: 351, width: 1220, height: 442 }}><CodeRow number="01"><span style={{ color: cyan }}>GET</span> /tasks</CodeRow><Rule style={{ background: '#50718e', margin: '22px 0' }} /><CodeRow number="02"><span style={{ color: pink }}>Authorization</span>: Bearer &lt;accessToken&gt;</CodeRow><Rule style={{ background: '#50718e', margin: '22px 0' }} /><div style={{ fontSize: 24, color: '#a9c0d2' }}>NestJS membaca header, bukan cookie browser.</div></Ide>
  <div style={{ position: 'absolute', left: 126, top: 832, display: 'flex', alignItems: 'center', gap: 20, fontSize: 31 }}><Logo src={nestLogo} alt="NestJS logo" size={71} /><span>API :3001 memeriksa Bearer token.</span></div>
</Canvas>;

const Guard: Page = () => <Canvas label="JwtAuthGuard" bg={peachDeep}>
  <Title size={76} style={{ position: 'absolute', left: 110, top: 190 }}>Guard mengisi identitas yang tepercaya.</Title>
  <div style={{ position: 'absolute', left: 123, top: 374, width: 570 }}>
    <div style={{ fontFamily: display, fontSize: 48, color: blue }}>01 &nbsp;Format Bearer</div><Rule style={{ background: blue, margin: '13px 0 22px' }} />
    <div style={{ fontFamily: display, fontSize: 48, color: pink }}>02 &nbsp;Signature + waktu</div><Rule style={{ background: pink, margin: '13px 0 22px' }} />
    <div style={{ fontFamily: display, fontSize: 48, color: '#aa7f00' }}>03 &nbsp;sub yang valid</div><Rule style={{ background: yellow, margin: '13px 0 22px' }} />
    <div style={{ fontFamily: display, fontSize: 48 }}>04 &nbsp;User masih ada</div>
  </div>
  <Ide title="jwt-auth.guard.ts" style={{ position: 'absolute', right: 118, top: 371, width: 953, height: 429 }}><CodeRow number="29">payload = await this.jwt.<span style={{ color: yellow }}>verifyAsync</span>(token);</CodeRow><CodeRow number="35"><span style={{ color: '#8ba9c0' }}>typeof payload.sub !== 'number'</span></CodeRow><CodeRow number="48">request.user = {'{'} id: user.id {'}'};</CodeRow><Rule style={{ background: '#50718e', margin: '23px 0' }} /><div style={{ fontSize: 24, color: '#a9c0d2' }}>Jika gagal: 401 Unauthorized</div></Ide>
  <div style={{ position: 'absolute', left: 123, top: 842, fontSize: 28 }}>Guard terpasang pada seluruh route <Code>/tasks</Code>.</div>
</Canvas>;

const Me: Page = () => <Canvas label="Profil aktif">
  <Title size={78} style={{ position: 'absolute', left: 110, top: 194 }}>Siapa yang sedang login?</Title>
  <Browser url="/tasks" style={{ position: 'absolute', left: 128, top: 362, width: 736, height: 439, transform: 'rotate(-2deg)' }}><div style={{ padding: '39px 42px' }}><div style={{ fontSize: 30, color: muted }}>Login sebagai</div><div style={{ fontFamily: display, fontSize: 42, marginTop: 16 }}>alya@example.com</div><Rule style={{ margin: '36px 0' }} /><TaskStrip title="Siapkan demo" done /></div></Browser>
  <Ide title="GET /auth/me · response 200" style={{ position: 'absolute', right: 121, top: 373, width: 800, height: 371 }}><CodeRow number="01">{'{'}</CodeRow><CodeRow number="02">&nbsp; <span style={{ color: pink }}>"id"</span>: <span style={{ color: cyan }}>7</span>,</CodeRow><CodeRow number="03">&nbsp; <span style={{ color: pink }}>"email"</span>: <span style={{ color: yellow }}>"alya@example.com"</span></CodeRow><CodeRow number="04">{'}'}</CodeRow></Ide>
  <div style={{ position: 'absolute', right: 125, top: 807, width: 770, fontSize: 32, lineHeight: 1.35 }}>Tanpa JWT yang valid, Guard menjawab <strong>401</strong>.</div>
</Canvas>;

const Ownership: Page = () => <Canvas label="Task milik User" bg={ink} inverse>
  <Title size={74} style={{ position: 'absolute', left: 110, top: 190 }}>Guard mengenali user. Service membatasi data.</Title>
  <div style={{ position: 'absolute', left: 120, top: 361, width: 653 }}>
    <div style={{ fontSize: 28, color: '#b8d0e4', marginBottom: 16 }}>CREATE</div><div style={{ fontFamily: mono, fontSize: 37 }}>userId dari <span style={{ color: yellow }}>request.user.id</span></div>
    <Rule style={{ background: '#6586a2', margin: '31px 0' }} />
    <div style={{ fontSize: 28, color: '#b8d0e4', marginBottom: 16 }}>LIST</div><div style={{ fontFamily: mono, fontSize: 37 }}>where: {'{'} <span style={{ color: cyan }}>userId</span> {'}'}</div>
    <Rule style={{ background: '#6586a2', margin: '31px 0' }} />
    <div style={{ fontSize: 28, color: '#b8d0e4', marginBottom: 16 }}>DETAIL · UPDATE · DELETE</div><div style={{ fontFamily: mono, fontSize: 37 }}>where: {'{'} id, <span style={{ color: pink }}>userId</span> {'}'}</div>
  </div>
  <div style={{ position: 'absolute', right: 133, top: 361, width: 775, height: 410, background: cream, color: ink, border: '4px solid ' + cream, borderRadius: 17, transform: 'rotate(2deg)', padding: '39px 40px', boxSizing: 'border-box' }}><div style={{ fontFamily: display, fontSize: 52 }}>Task Alya</div><TaskStrip title="Siapkan demo" owner="userId: 7" /><div style={{ fontSize: 28, color: muted, marginTop: 45 }}>Token Bima valid, tetapi Task ini bukan miliknya.</div></div>
  <div style={{ position: 'absolute', left: 121, top: 845, fontSize: 30, color: '#c9dceb' }}>Toggle tetap memakai field <Code>completed</Code>.</div>
</Canvas>;

const Status: Page = () => <Canvas label="Baca respons">
  <Title size={79} style={{ position: 'absolute', left: 110, top: 190 }}>Status memberi petunjuk lapisannya.</Title>
  <div style={{ position: 'absolute', left: 128, right: 128, top: 370 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', borderBottom: '3px solid ' + ink, padding: '12px 0' }}><div style={{ width: 241, fontFamily: display, fontSize: 82, color: '#bb8d00' }}>400</div><div style={{ width: 835, fontSize: 36 }}>Body Task punya <Code>userId</Code> palsu</div><div style={{ fontSize: 29, color: muted }}>DTO + ValidationPipe</div></div>
    <div style={{ display: 'flex', alignItems: 'baseline', borderBottom: '3px solid ' + ink, padding: '12px 0' }}><div style={{ width: 241, fontFamily: display, fontSize: 82, color: pink }}>401</div><div style={{ width: 835, fontSize: 36 }}>Token hilang, salah, atau kedaluwarsa</div><div style={{ fontSize: 29, color: muted }}>Guard / AuthService</div></div>
    <div style={{ display: 'flex', alignItems: 'baseline', borderBottom: '3px solid ' + ink, padding: '12px 0' }}><div style={{ width: 241, fontFamily: display, fontSize: 82, color: blue }}>404</div><div style={{ width: 835, fontSize: 36 }}>Task bukan milik akun ini</div><div style={{ fontSize: 29, color: muted }}>Query userId</div></div>
    <div style={{ display: 'flex', alignItems: 'baseline', padding: '12px 0' }}><div style={{ width: 241, fontFamily: display, fontSize: 82 }}>409</div><div style={{ width: 835, fontSize: 36 }}>Email register sudah ada</div><div style={{ fontSize: 29, color: muted }}>Unique email</div></div>
  </div>
</Canvas>;

const Forms: Page = () => <Canvas label="Frontend" bg={peachDeep}>
  <Title size={77} style={{ position: 'absolute', left: 110, top: 190 }}>Register membuat akun. Login membuka sesi.</Title>
  <Browser url="/register" style={{ position: 'absolute', left: 126, top: 354, width: 708, height: 474, transform: 'rotate(-2deg)' }}><div style={{ padding: '34px 44px' }}><div style={{ fontFamily: display, fontSize: 52 }}>Register</div><div style={{ borderBottom: '2px solid #b8cde0', marginTop: 30, paddingBottom: 12, fontSize: 26 }}>alya@example.com</div><div style={{ borderBottom: '2px solid #b8cde0', marginTop: 24, paddingBottom: 12, fontSize: 26 }}>••••••••</div><div style={{ marginTop: 29, background: blue, color: cream, width: 180, padding: '11px 17px', borderRadius: 9, textAlign: 'center', fontSize: 23, fontWeight: 700 }}>Buat akun</div></div></Browser>
  <Browser url="/login" style={{ position: 'absolute', right: 125, top: 370, width: 722, height: 472, transform: 'rotate(2deg)' }}><div style={{ padding: '34px 44px' }}><div style={{ fontFamily: display, fontSize: 52 }}>Login</div><div style={{ borderBottom: '2px solid #b8cde0', marginTop: 30, paddingBottom: 12, fontSize: 26 }}>alya@example.com</div><div style={{ borderBottom: '2px solid #b8cde0', marginTop: 24, paddingBottom: 12, fontSize: 26 }}>••••••••</div><div style={{ marginTop: 29, background: pink, color: cream, width: 180, padding: '11px 17px', borderRadius: 9, textAlign: 'center', fontSize: 23, fontWeight: 700 }}>Login</div></div></Browser>
</Canvas>;

const CookieFetch: Page = () => <Canvas label="Sesi browser">
  <Title size={76} style={{ position: 'absolute', left: 110, top: 190 }}>Cookie dibaca. Header Bearer dikirim.</Title>
  <div style={{ position: 'absolute', left: 122, top: 385, width: 603, height: 390, background: yellow, border: '4px solid ' + ink, borderRadius: 22, boxShadow: '9px 9px 0 ' + ink, padding: '38px 40px', boxSizing: 'border-box' }}><div style={{ fontFamily: display, fontSize: 53 }}>Browser cookie</div><Rule style={{ margin: '26px 0' }} /><div style={{ fontFamily: mono, fontSize: 29, overflowWrap: 'anywhere' }}>workshop_access_token</div><div style={{ fontSize: 27, marginTop: 32 }}>JavaScript dapat membacanya.</div></div>
  <Ide title="auth-fetch.ts · request protected" style={{ position: 'absolute', right: 121, top: 360, width: 971, height: 435 }}><CodeRow number="09"><span style={{ color: cyan }}>const</span> token = getToken();</CodeRow><CodeRow number="15"><span style={{ color: cyan }}>const</span> headers = new Headers(options.headers);</CodeRow><CodeRow number="16">headers.<span style={{ color: yellow }}>set</span>(<span style={{ color: pink }}>"Authorization"</span>, <span style={{ color: yellow }}>{"`Bearer ${token}`"}</span>);</CodeRow><Rule style={{ background: '#50718e', margin: '24px 0' }} /><div style={{ fontSize: 24, color: '#a9c0d2' }}>401: clearToken() dan kembali ke /login.</div></Ide>
  <div style={{ position: 'absolute', left: 130, top: 841, fontSize: 28, color: muted }}>Cookie latihan ini bukan HttpOnly; backend tetap memeriksa Bearer token.</div>
</Canvas>;

const Proxy: Page = () => <Canvas label="Next.js Proxy" bg={lightBlue}>
  <Title size={78} style={{ position: 'absolute', left: 110, top: 189 }}>Proxy mengarahkan sebelum halaman dibuka.</Title>
  <div style={{ position: 'absolute', left: 127, top: 373, width: 745 }}><div style={{ fontFamily: display, fontSize: 56 }}>Cookie tidak ada</div><Rule style={{ margin: '20px 0 33px', background: pink }} /><div style={{ fontFamily: mono, fontSize: 42 }}>GET /tasks</div><div style={{ fontFamily: display, color: pink, fontSize: 94, marginTop: 40 }}>307</div><div style={{ fontSize: 33 }}>Browser menuju <Code>/login</Code>.</div></div>
  <div style={{ position: 'absolute', right: 121, top: 373, width: 727 }}><div style={{ fontFamily: display, fontSize: 56 }}>Cookie ada</div><Rule style={{ margin: '20px 0 33px', background: blue }} /><div style={{ fontFamily: mono, fontSize: 42 }}>GET /tasks</div><div style={{ fontFamily: display, color: blue, fontSize: 73, marginTop: 50 }}>Lanjut</div><div style={{ fontSize: 33, marginTop: 11 }}>API tetap memverifikasi JWT.</div></div>
  <div style={{ position: 'absolute', left: 127, top: 822, fontFamily: mono, fontSize: 29 }}>matcher: "/tasks/:path*"</div>
</Canvas>;

const TwoUsers: Page = () => <Canvas label="Uji dua akun">
  <Title size={78} style={{ position: 'absolute', left: 110, top: 190 }}>Bima tidak mendapat Task Alya.</Title>
  <div style={{ position: 'absolute', left: 122, top: 374, width: 761 }}><div style={{ display: 'flex', alignItems: 'center', gap: 20 }}><Avatar name="A" size={79} /><div style={{ fontFamily: display, fontSize: 55 }}>Alya</div></div><Rule style={{ margin: '22px 0', background: blue }} /><div style={{ fontFamily: mono, fontSize: 31 }}>GET /tasks &nbsp; <strong style={{ color: blue }}>200</strong></div><div style={{ marginTop: 36, background: cream, border: '3px solid ' + ink, borderRadius: 14 }}><TaskStrip title="Siapkan demo" /></div><div style={{ fontSize: 28, marginTop: 33 }}>Task terlihat pada pemiliknya.</div></div>
  <div style={{ position: 'absolute', right: 121, top: 374, width: 761 }}><div style={{ display: 'flex', alignItems: 'center', gap: 20 }}><Avatar name="B" color={pink} size={79} /><div style={{ fontFamily: display, fontSize: 55 }}>Bima</div></div><Rule style={{ margin: '22px 0', background: pink }} /><div style={{ fontFamily: mono, fontSize: 31 }}>GET /tasks &nbsp; <strong style={{ color: blue }}>200</strong></div><div style={{ marginTop: 36, background: cream, border: '3px solid ' + ink, borderRadius: 14, padding: '29px 22px', fontSize: 27, color: muted }}>Belum ada Task.</div><div style={{ fontFamily: mono, fontSize: 28, marginTop: 27, color: pink }}>GET /tasks/:id &nbsp; 404</div></div>
  <div style={{ position: 'absolute', left: 127, top: 854, fontSize: 27, color: muted }}>Tanpa token, API menjawab 401.</div>
</Canvas>;

const Roadmap: Page = () => <Canvas label="Live coding" bg={yellow}>
  <Title size={77} style={{ position: 'absolute', left: 110, top: 190 }}>Urutan praktik hari ini.</Title>
  <div style={{ position: 'absolute', left: 126, top: 373, width: 800 }}>
    <div style={{ fontSize: 40, marginBottom: 39 }}><strong style={{ fontFamily: display, fontSize: 63, marginRight: 30 }}>01</strong>Baseline dan database latihan</div>
    <div style={{ fontSize: 40, marginBottom: 39 }}><strong style={{ fontFamily: display, fontSize: 63, marginRight: 30 }}>02</strong>User, register, password hash</div>
    <div style={{ fontSize: 40, marginBottom: 39 }}><strong style={{ fontFamily: display, fontSize: 63, marginRight: 30 }}>03</strong>Login, JWT Guard, /auth/me</div>
  </div>
  <div style={{ position: 'absolute', right: 115, top: 373, width: 791 }}>
    <div style={{ fontSize: 40, marginBottom: 39 }}><strong style={{ fontFamily: display, fontSize: 63, marginRight: 30 }}>04</strong>Relasi dan filter Task</div>
    <div style={{ fontSize: 40, marginBottom: 39 }}><strong style={{ fontFamily: display, fontSize: 63, marginRight: 30 }}>05</strong>Form, authFetch, Proxy</div>
    <div style={{ fontSize: 40, marginBottom: 39 }}><strong style={{ fontFamily: display, fontSize: 63, marginRight: 30 }}>06</strong>Uji dua akun</div>
  </div>
  <Rule style={{ position: 'absolute', left: 125, right: 120, top: 792 }} />
  <div style={{ position: 'absolute', left: 129, top: 830, fontSize: 28 }}>Satu klik toggle <Code>completed</Code> menghasilkan satu PATCH.</div>
</Canvas>;

const Closing: Page = () => <Canvas bg={ink} inverse>
  <div style={{ position: 'absolute', left: 117, top: 120 }}><Sticker tone="yellow" tilt={-4}>Mental model Day 3</Sticker></div>
  <Title size={88} style={{ position: 'absolute', left: 110, top: 302, width: 1530 }}>Login menghasilkan token.<br />Guard memberi identitas.<br /><span style={{ color: '#8bc3ff' }}>Query membatasi Task.</span></Title>
  <Rule style={{ position: 'absolute', left: 118, right: 118, top: 723, background: '#85a9c8' }} />
  <div style={{ position: 'absolute', left: 119, top: 771, fontSize: 35 }}>Token valid membuka request. <strong style={{ color: yellow }}>userId</strong> membatasi datanya.</div>
  <div style={{ position: 'absolute', right: 122, top: 846 }}><Sticker tone="pink" tilt={4}>Lanjut live coding</Sticker></div>
</Canvas>;

export const notes: (string | undefined)[] = [
  "±30 detik. “Kemarin tombol Create, Update, dan Delete sudah bekerja dari browser. Sekarang bayangkan Alya dan Bima membuka aplikasi yang sama. Mereka tentu tidak ingin melihat daftar Task yang tercampur. Hari ini kita membuat akun, mengenali siapa yang mengirim request, lalu memastikan setiap Task hanya bisa diakses pemiliknya. Setelah mental model ini jelas, kita masuk ke live coding.”",
  "±1 menit. “Target akhirnya terlihat sederhana: masing-masing orang membuka halaman yang sama tetapi menerima daftar Task miliknya sendiri. Register membuat akun, login memberi akses, lalu setiap request Task membawa identitas. Teks email pada mockup hanyalah contoh akun Alya. Kita tidak akan berhenti pada tampilan login; kita akan buktikan bahwa backend juga menolak akses ke Task orang lain. Kalau hanya tombol atau halaman yang disembunyikan, datanya belum terlindungi.”",
  "±45 detik. “Day 1 kita membangun lima operasi CRUD Task. Day 2 kita menghubungkannya ke halaman Next.js. Day 3 tidak mengganti CRUD itu. Kita menambahkan User, login, dan aturan bahwa setiap query Task memakai identitas dari request yang sudah diverifikasi. Perubahan ini akan terasa baik pada respons API maupun pada halaman yang dipakai user.”",
  "±1 menit 15 detik. “Kita mulai dari kondisi nyata branch latihan. GET /tasks masih bisa dipanggil tanpa token, dan query findMany() mengambil Task tanpa filter pemilik. Itu cukup untuk CRUD satu pengguna saat Day 2, tetapi tidak cukup ketika ada dua akun. Kita perlu menjawab dua hal secara berurutan: siapa yang mengirim request, lalu data mana yang boleh diterimanya. Itulah alasan Day 3 memiliki Authentication dan Authorization.”",
  "±1 menit 30 detik. “Authentication adalah proses mengenali Alya. Saat login, backend memeriksa email dan password. Setelah itu, setiap request protected membawa JWT yang diperiksa Guard. Authorization terjadi setelah identitas diketahui: bolehkah Alya membaca Task dengan ID tertentu? Di latihan ini jawabannya ditentukan oleh userId pada query Prisma. Jadi token Bima boleh valid, tetapi tetap tidak memberinya Task Alya.”",
  "±1 menit. “Bayangkan sebuah ruang kerja dengan loker masing-masing. Petugas pintu memastikan orang yang datang punya tanda pengenal yang sah. Setelah masuk, petugas rak tetap memeriksa loker mana yang menjadi miliknya. Di kode kita, JwtAuthGuard memverifikasi token dan menghasilkan ID user yang tepercaya. TasksService memakai ID itu saat mencari Task. Analogi ini membantu mengingat dua pemeriksaan, tetapi JWT bukan kartu fisik, dan kepemilikan Task diperiksa melalui query database pada setiap operasi.”",
  "±1 menit. “Kita pastikan peserta berada di branch starter, lalu jalankan dua aplikasi seperti Day 2. Pakai Bruno atau curl untuk memanggil GET /tasks tanpa token; respons 200 adalah baseline yang nantinya berubah menjadi 401. DevTools Network nanti menunjukkan request dari browser. Satu syarat data perlu perhatian: migrasi Day 3 menambahkan Task.userId yang wajib. Baris Task lama belum punya pemilik, sehingga migrasi tidak bisa langsung diterapkan pada tabel yang berisi Task. Gunakan database lokal latihan yang tabel Task-nya kosong. Jika data perlu dipertahankan, buat migrasi bertahap dengan backfill. Secret JWT disimpan di backend, bukan pada variabel publik frontend.”",
  "±1 menit 15 detik. “Day 1 Task berdiri sendiri. Day 3 menambahkan model User dan relasi satu ke banyak: satu user dapat memiliki banyak Task, setiap Task punya satu pemilik. Pada schema Prisma, userId berada di Task dan merujuk ke User.id. Kita juga membuat index userId karena daftar Task akan sering dicari per user. Field status tetap bernama completed seperti Day 1 dan Day 2. Setelah schema diubah, prisma migrate dev mengubah database dan prisma generate memperbarui Prisma Client yang digunakan TypeScript.”",
  "±1 menit 15 detik. “Password adalah teks yang diketik user. Saat register, backend menghasilkan passwordHash dengan bcrypt, lalu menyimpan hash itu. Saat login, bcrypt membandingkan password yang baru diketik dengan hash yang tersimpan. Setelah cocok, backend menerbitkan accessToken. Token itu bukan password dan tidak berisi passwordHash. Batas bcrypt pada implementasi ini juga diperiksa: register menerima password 8 sampai 72 karakter, dengan maksimum 72 byte UTF-8. Jadi validasi karakter dan byte tetap perlu dibedakan.”",
  "±1 menit 30 detik. “Ketika Alya mengirim form register, DTO memeriksa bentuk email dan panjang password. Service merapikan email menjadi lowercase, memeriksa batas byte password, membuat hash bcrypt, lalu menyimpan User. Respons sengaja memilih hanya id dan email; hash tidak dikirim ke browser. Email mempunyai unique constraint di database. Jika email yang sama didaftarkan lagi, error Prisma diterjemahkan menjadi 409 Conflict. Register di workshop ini belum otomatis membuat sesi login; langkah berikutnya tetap login.”",
  "±1 menit 30 detik. “Login mengambil User berdasarkan email yang sudah dinormalisasi, lalu bcrypt.compare memeriksa password input terhadap hash di database. Jika user tidak ada atau password salah, keduanya mendapat pesan umum yang sama dan status 401. Jika cocok, JwtService.signAsync menerbitkan JWT dengan sub berisi ID User. Respons berisi token serta profil publik untuk UI. Konfigurasi JWT_SECRET ada di server, minimal 32 karakter dalam codebase latihan, dan token berlaku satu jam.”",
  "±1 menit 30 detik. “JWT memiliki tiga bagian. Payload bisa di-decode, jadi jangan masukkan password, passwordHash, atau secret ke sana. Pada aplikasi ini, sub berisi ID user; saat token diterbitkan, masa berlaku satu jam juga ditambahkan. Signature membantu backend mendeteksi token yang diubah. Token baru boleh dipercaya setelah verifyAsync memeriksa signature dan masa berlakunya dengan secret backend. Sekadar melihat sub pada teks token belum cukup.”",
  "±1 menit. “Login hanya menerbitkan token. Agar backend mengenali request berikutnya, frontend harus mengirim token itu dalam header Authorization dengan format Bearer. Itulah yang dibaca Guard NestJS. Pada latihan ini frontend menyimpan token dalam cookie agar browser dan Proxy dapat membacanya, tetapi API NestJS tidak menerima cookie itu sebagai kredensial secara langsung. Helper frontend akan menyalin nilai token ke header setiap request protected.”",
  "±1 menit 45 detik. “Guard berjalan sebelum method Controller yang dilindungi. AuthModule menyediakan Guard dan JWT untuk dipakai TasksModule; Guard dipasang pada kelas TasksController sehingga semua route CRUD ikut dilindungi. Ia memastikan header benar-benar memakai Bearer dan hanya berisi satu token. verifyAsync menolak signature salah atau token kedaluwarsa. Setelah itu Guard memeriksa sub adalah ID angka positif dan User tersebut masih ada di database. Barulah Guard mengisi request.user.id. Nilai ini berasal dari token yang telah diverifikasi dan hasil lookup User, bukan dari body yang bisa dikarang client. Jika salah satu pemeriksaan gagal, request berhenti dengan 401.”",
  "±1 menit. “Bagaimana halaman mengetahui akun yang sedang aktif? Ia memanggil GET /auth/me dengan Bearer token. Endpoint ini memakai Guard, lalu mencari data publik User dari ID yang sudah diverifikasi. Responsnya id dan email saja. Di checkpoint, halaman Task memanggil getMe() sebelum getTasks(). Jika token salah atau sudah habis masa berlakunya, 401 memicu pembersihan token dan kembali ke halaman login.”",
  "±1 menit 45 detik. “Setelah Guard mengisi ID user, Controller meneruskannya ke TasksService. Saat Create, service sendiri yang mengisi userId; client tidak boleh menentukan pemilik lewat body. Saat List, findMany menggunakan where: { userId } sehingga Alya hanya mendapat Task Alya. Detail, Update, dan Delete mencocokkan ID Task sekaligus ID pemilik. Kalau salah satunya tidak cocok, operasi itu menghasilkan 404. Guard saja belum cukup: token Bima valid, tetapi query tetap harus menolak Task Alya. Field untuk toggle tetap completed, bukan nama baru.”",
  "±1 menit 30 detik. “Status membantu kita mencari sumber masalah. 401 berarti kredensial atau token tidak diterima; request Task tanpa token berhenti di Guard. 404 untuk Task orang lain berarti token boleh valid, tetapi query id dan userId tidak menemukan Task yang boleh diakses. Jika Bima meminta list, ia bisa menerima 200 dengan daftar kosong; hanya permintaan terhadap ID Task Alya yang menghasilkan 404. Dengan token yang valid, 400 muncul saat input melanggar DTO, termasuk body yang mencoba menyisipkan userId. 409 menandai email register duplikat. Implementasi ini memilih 404 untuk Task lintas akun.”",
  "±1 menit 15 detik. “Frontend menyediakan dua halaman yang berbeda. Register memanggil endpoint publik, lalu menampilkan pesan bahwa akun berhasil dibuat beserta tautan ke Login. Ia tidak menyimpan token karena endpoint register tidak mengembalikan token. Login mengirim email dan password, menerima accessToken, menyimpannya, lalu membuka /tasks. Kedua form menampilkan keadaan sedang mengirim dan error, jadi user tahu apa yang sedang terjadi ketika request menunggu atau gagal.”",
  "±1 menit 30 detik. “Setelah login, saveToken menaruh token pada cookie workshop_access_token. Helper authFetch membaca cookie itu pada browser dan menambahkan header Authorization: Bearer ... saat memanggil API. Dengan begitu, fungsi getMe dan semua fungsi CRUD Task memakai aturan yang sama. Jika token tidak ada, helper mengarahkan ke Login; jika backend menjawab 401, helper menghapus cookie dan mengarahkan kembali. Cookie ini sengaja dapat dibaca JavaScript untuk latihan dan Proxy; ia bukan HttpOnly. Logout di checkpoint hanya menghapus token browser, bukan membatalkan JWT yang sudah terbit di server.”",
  "±1 menit 15 detik. “Pada Next.js 16, fitur yang dahulu disebut Middleware bernama Proxy. Ia berjalan untuk path /tasks sebelum halaman dilanjutkan. Jika cookie token tidak ada, Proxy langsung mengirim redirect 307 ke /login. Jika cookie ada, Proxy membiarkan halaman lanjut. Ini baru pemeriksaan keberadaan cookie; token palsu atau kedaluwarsa juga bisa lolos dari Proxy. Ketika halaman memanggil API, Guard NestJS tetap memverifikasi token, lalu TasksService membatasi data. Karena itu Proxy membantu navigasi, sementara keamanan data ditentukan backend.”",
  "±1 menit 30 detik. “Kita akan buktikan dari API dan browser. Alya login lalu membuat Task. Dengan token Alya, Task terlihat. Dengan token Bima, daftar tetap 200 tetapi tidak memuat Task Alya. Perhatikan perbedaan dua hasil ini di Network: daftar Bima boleh berhasil meskipun kosong; ketika Bima meminta ID Task Alya secara langsung, hasilnya 404. Tanpa token, request API berhenti lebih awal dengan 401. Untuk melihat dua akun bersamaan di browser, gunakan dua profil browser karena cookie pada host yang sama dibagikan antar-tab.”",
  "±1 menit 30 detik. “Kita akan mulai dari hasil Day 2, bukan dari proyek kosong. Pertama cek baseline dan database latihan. Lalu buat User, register, dan hash password; setelah itu login dan Guard. Begitu /auth/me bekerja, kita pasang userId pada Task serta filter semua query. Seed lama Day 2 yang membuat Task tanpa pemilik juga harus disesuaikan sebelum build. Baru kemudian frontend mengirim Bearer token dan Proxy memberi redirect awal. Kita tutup dengan dua akun dan pengecekan Network. Urutan ini sengaja membuat setiap kegagalan bisa ditelusuri: sebelum UI diubah, kontrak backend sudah kita uji.”",
  "±1 menit 30 detik. “Kalau hanya satu kalimat yang diingat, ingat urutan ini: login menerbitkan token, Guard memverifikasi token dan memberi ID user yang tepercaya, lalu TasksService memakai ID itu untuk setiap query. Frontend bertugas mengirim token dan menunjukkan keadaan UI, tetapi tidak boleh menjadi satu-satunya penjaga data. Ketika nanti ada 401, periksa token dan Guard. Ketika Task seseorang tidak muncul atau ID Task orang lain mendapat 404, periksa filter userId. Sekarang kita implementasikan satu lapisan pada satu waktu.”",
];

export const meta: SlideMeta = {
  title: 'Day 3 | Authentication + JWT + User-Owned Tasks',
  createdAt: '2026-10-18T22:08:45.973Z',
};

export default [Cover, Outcome, Continuity, PublicTask, AuthQuestions, RoomAnalogy, Preflight, Relation, ThreeValues, Register, Login, JwtAnatomy, Bearer, Guard, Me, Ownership, Status, Forms, CookieFetch, Proxy, TwoUsers, Roadmap, Closing] satisfies Page[];

