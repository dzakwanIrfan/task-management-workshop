import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import sourceThree from './assets/source-3.png';

export const design: DesignSystem = {
  palette: { bg: '#FBFAFD', text: '#222138', accent: '#6D45B8' },
  fonts: {
    display: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  typeScale: { hero: 126, body: 32 },
  radius: 10,
};

const muted = '#5E5D70';
const line = '#D9D5E5';
const accentSoft = '#EEE9F7';

const canvas: CSSProperties = {
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
};

const Accent = ({ width = 105, top = 76 }: { width?: number; top?: number }) => (
  <div style={{ position: 'absolute', left: 96, top, width, height: 7, background: 'var(--osd-accent)' }} />
);

const Section = ({ title, x, y, width, children }: { title: string; x: number; y: number; width: number; children: ReactNode }) => (
  <section style={{ position: 'absolute', left: x, top: y, width }}>
    <h2 style={{ margin: '0 0 22px', fontSize: 41, lineHeight: 1.13, letterSpacing: '-0.025em', fontWeight: 750, color: 'var(--osd-accent)' }}>{title}</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
  </section>
);

const Bullet = ({ children, size = 30, lineHeight = 1.28 }: { children: ReactNode; size?: number; lineHeight?: number }) => (
  <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', fontSize: size, lineHeight }}>
    <span aria-hidden="true" style={{ color: 'var(--osd-accent)', flex: '0 0 auto', fontSize: size * 0.86, lineHeight: 1.36 }}>●</span>
    <span>{children}</span>
  </div>
);

const LongItem = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, fontSize: 29, lineHeight: 1.29 }}>
    <span aria-hidden="true" style={{ color: 'var(--osd-accent)', fontSize: 27, lineHeight: 1.35 }}>●</span>
    <span><strong style={{ fontWeight: 730 }}>{label}</strong>{children}</span>
  </div>
);

const Room: Page = () => (
  <div style={canvas}>
    <Accent width={116} top={230} />
    <h1 style={{ position: 'absolute', left: 146, top: 281, margin: 0, fontSize: 126, lineHeight: 1, fontWeight: 780, letterSpacing: '-0.05em' }}>Room 1</h1>
    <div style={{ position: 'absolute', left: 150, top: 479, width: 1080, height: 2, background: line }} />
    <div style={{ position: 'absolute', left: 150, top: 535, display: 'flex', flexDirection: 'column', gap: 25, fontSize: 47, lineHeight: 1.15 }}>
      <div><span style={{ color: 'var(--osd-accent)', display: 'inline-block', width: 74 }}>1.</span>Dzakwan Irfan Ramdhani</div>
      <div><span style={{ color: 'var(--osd-accent)', display: 'inline-block', width: 74 }}>2.</span>Adi Haditya Nursyam</div>
      <div><span style={{ color: 'var(--osd-accent)', display: 'inline-block', width: 74 }}>3.</span>Helmy Farikh Alfarizhi</div>
      <div><span style={{ color: 'var(--osd-accent)', display: 'inline-block', width: 74 }}>4.</span>Amelia Putri Chaerani</div>
    </div>
  </div>
);

const Geopolitical: Page = () => (
  <div style={canvas}>
    <Accent />
    <h1 style={{ position: 'absolute', left: 96, top: 112, right: 96, margin: 0, fontSize: 57, lineHeight: 1.12, letterSpacing: '-0.035em', fontWeight: 760 }}>
      1: Geopolitical Instability: Impacts on<br />Business, Finance &amp; People
    </h1>
    <div style={{ position: 'absolute', left: 944, top: 303, width: 2, height: 650, background: line }} />
    <div style={{ position: 'absolute', left: 96, right: 96, top: 621, height: 2, background: line }} />
    <Section title="Global Drivers" x={96} y={304} width={774}>
      <Bullet>Konflik geopolitik dan perang dagang.</Bullet>
      <Bullet>Fragmentasi rantai pasok global.</Bullet>
      <Bullet>Kenaikan biaya energi, logistik, dan tekanan inflasi.</Bullet>
    </Section>
    <Section title="Business Operations" x={1017} y={304} width={807}>
      <Bullet>Kenaikan biaya operasional.</Bullet>
      <Bullet>Gangguan pasokan dan distribusi.</Bullet>
      <Bullet>Penurunan permintaan konsumen.</Bullet>
    </Section>
    <Section title="Employee Well-being" x={96} y={662} width={774}>
      <Bullet>Penurunan daya beli.</Bullet>
      <Bullet>Peningkatan beban kerja.</Bullet>
      <Bullet>Ketidakpastian pekerjaan dan tekanan mental.</Bullet>
    </Section>
    <Section title="Financial Performance" x={1017} y={662} width={807}>
      <Bullet>Biaya pendanaan tetap tinggi.</Bullet>
      <Bullet>Tekanan terhadap pendapatan dan keuntungan.</Bullet>
      <Bullet>Peningkatan risiko kredit bermasalah.</Bullet>
    </Section>
  </div>
);

const Layoff: Page = () => (
  <div style={canvas}>
    <Accent />
    <h1 style={{ position: 'absolute', left: 96, top: 112, right: 96, margin: 0, fontSize: 61, lineHeight: 1.13, letterSpacing: '-0.034em', fontWeight: 760 }}>
      Apakah layoff / cost efficiency agresif<br />menjadi salah satu solusi survival?
    </h1>
    <div style={{ position: 'absolute', left: 96, top: 436, width: 265, height: 346, overflow: 'hidden', background: accentSoft, borderRadius: 18 }}>
      <img src={sourceThree} alt="Ilustrasi kehilangan pekerjaan dari materi sumber" style={{ position: 'absolute', width: 1248, maxWidth: 'none', height: 702, left: 0, top: -260, filter: 'grayscale(1)', opacity: 0.65 }} />
    </div>
    <div style={{ position: 'absolute', left: 415, top: 350, right: 106, display: 'flex', flexDirection: 'column', gap: 46 }}>
      <Bullet size={38}><span>Lay off merupakan <strong>pilihan terakhir</strong></span></Bullet>
      <Bullet size={34} lineHeight={1.37}><span><strong>Cara lain:</strong> bekukan rekrutmen, menurunkan biaya operasional, digitalisasi dari manual dan repetitive biar nurunin biaya, memangkas proyek yang mendesak perquarter (cost efficiency)</span></Bullet>
      <Bullet size={36} lineHeight={1.36}><span><strong>Akibat layoff</strong> bisa berdampak ke kehilangan trust/kehilangan orang-orang yang lebih berjasa</span></Bullet>
    </div>
  </div>
);

const Adaptive: Page = () => (
  <div style={canvas}>
    <Accent />
    <div style={{ position: 'absolute', left: 96, top: 109, fontSize: 29, color: 'var(--osd-accent)', fontWeight: 700 }}>nomor 3</div>
    <h1 style={{ position: 'absolute', left: 96, top: 174, right: 96, margin: 0, fontSize: 62, lineHeight: 1.13, letterSpacing: '-0.035em', fontWeight: 760 }}>
      Bagaimana perusahaan bisa tetap adaptif tanpa over panic?
    </h1>
    <div style={{ position: 'absolute', left: 96, right: 96, top: 334, height: 2, background: line }} />
    <div style={{ position: 'absolute', left: 98, right: 104, top: 383, display: 'flex', flexDirection: 'column', gap: 42 }}>
      <Bullet size={34} lineHeight={1.31}>Perusahaan akan overpanic jika perusahaan tersebut tidak mempunyai kendali terhadap apa yang akan terjadi kedepannya</Bullet>
      <Bullet size={34} lineHeight={1.31}>Perusahaan harus mengambil keputusan atau langkah berdasarkan data riil dan roadmap yang dimiliki perusahaan</Bullet>
      <Bullet size={34} lineHeight={1.31}>Perusahaan harus memetakan skenario atau risiko yang mungkin terjadi dan membuat mitigasi risiko</Bullet>
      <Bullet size={34} lineHeight={1.31}>Perusahaan harus memiliki metrik atau indikator yang sudah diimplementasikan sebelumnya agar benar benar sesuai dengan data yang dimiliki</Bullet>
    </div>
  </div>
);

const Employees: Page = () => (
  <div style={canvas}>
    <Accent top={51} />
    <div style={{ position: 'absolute', left: 96, top: 84, fontSize: 27, color: 'var(--osd-accent)', fontWeight: 700 }}>nomor 4</div>
    <div style={{ position: 'absolute', left: 963, top: 140, width: 2, height: 459, background: line }} />
    <h1 style={{ position: 'absolute', left: 96, top: 147, width: 804, margin: 0, fontSize: 60, lineHeight: 1.1, letterSpacing: '-0.035em', fontWeight: 760 }}>Apa yang dirasakan karyawan?</h1>
    <div style={{ position: 'absolute', left: 96, top: 262, fontSize: 83, color: 'var(--osd-accent)', fontWeight: 770, letterSpacing: '-0.055em' }}>“Saya aman nggak??”</div>
    <div style={{ position: 'absolute', left: 106, top: 401, width: 790, display: 'flex', flexDirection: 'column', gap: 17 }}>
      <Bullet size={32}>Berita PHK massal memicu anxiety</Bullet>
      <Bullet size={32}>Kepercayaan ke manajemen menurun</Bullet>
      <Bullet size={32}>Kewalahan dan stres meningkat</Bullet>
    </div>
    <div style={{ position: 'absolute', left: 1032, top: 152, width: 780 }}>
      <div style={{ fontSize: 40, fontWeight: 730, color: 'var(--osd-accent)', marginBottom: 20 }}>Jangka pendek</div>
      <Bullet size={32}>Produktifitas naik karena takut layouff</Bullet>
      <div style={{ fontSize: 40, fontWeight: 730, color: 'var(--osd-accent)', marginTop: 61, marginBottom: 20 }}>Jangka panjang</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Bullet size={32}>Burnout, cemas berkepanjangan, kualitas kerja turun</Bullet>
        <Bullet size={32}>talenta terbaik bisa resign duluan</Bullet>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 96, right: 96, top: 634, height: 2, background: line }} />
    <h2 style={{ position: 'absolute', left: 96, top: 661, margin: 0, fontSize: 52, lineHeight: 1.1, letterSpacing: '-0.032em', fontWeight: 760 }}>Jalan keluar: komunikasi yang lebih jelas</h2>
    <div style={{ position: 'absolute', left: 103, top: 764, width: 820, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Bullet size={30}>Transparansi kondisi dan rencana perusahaan</Bullet>
      <Bullet size={30}>Rantai komando jelas dari atas ke bawah</Bullet>
    </div>
    <div style={{ position: 'absolute', left: 1005, top: 764, width: 820, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Bullet size={30}>Prioritas kerja jelas, tidak semua urgent</Bullet>
      <Bullet size={30}>Libatkan tim terkait</Bullet>
    </div>
    <div style={{ position: 'absolute', left: 96, right: 96, top: 973, textAlign: 'center', fontSize: 47, lineHeight: 1.12, fontWeight: 760, color: 'var(--osd-accent)', letterSpacing: '-0.025em' }}>Rasa aman = produktivitas yang bertahan lama</div>
  </div>
);

const Priorities: Page = () => (
  <div style={canvas}>
    <Accent top={51} />
    <div style={{ position: 'absolute', left: 96, top: 84, fontSize: 27, color: 'var(--osd-accent)', fontWeight: 700 }}>nomor 5</div>
    <div style={{ position: 'absolute', left: 954, top: 214, width: 2, height: 755, background: line }} />
    <div style={{ position: 'absolute', left: 96, top: 169, fontSize: 60, fontWeight: 760, letterSpacing: '-0.035em' }}>Priority</div>
    <div style={{ position: 'absolute', left: 1023, top: 169, fontSize: 60, fontWeight: 760, letterSpacing: '-0.035em' }}>Kurangi</div>
    <div style={{ position: 'absolute', left: 96, top: 260, width: 803, display: 'flex', flexDirection: 'column', gap: 34 }}>
      <LongItem label="Arus Kas & Kualitas Pembiayaan: ">Jaga likuiditas dan perkuat bisnis inti leasing dengan fokus pada kualitas pembiayaan.</LongItem>
      <LongItem label="Manajemen Risiko: ">Tingkatkan pengawasan risiko kredit dan potensi gagal bayar di tengah tekanan ekonomi.</LongItem>
      <LongItem label="Keamanan Fisik & Digital: ">Perkuat perlindungan aset, data pelanggan, dan sistem untuk mengantisipasi potensi peningkatan fraud saat kondisi ekonomi sulit.</LongItem>
      <LongItem label="Penguatan Internal: ">Prioritaskan pelatihan karyawan, transparansi komunikasi, dan digitalisasi proses untuk meningkatkan efisiensi serta ketahanan organisasi.</LongItem>
    </div>
    <div style={{ position: 'absolute', left: 1023, top: 260, width: 790, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <LongItem label="Biaya Operasional Non-Esensial: ">Batasi perjalanan dinas, kegiatan seremonial, dan acara berbiaya tinggi dengan manfaat yang rendah.</LongItem>
      <LongItem label="Ekspansi Berisiko: ">Tunda rencana ekspansi yang membutuhkan investasi besar dengan tingkat ketidakpastian tinggi.</LongItem>
      <LongItem label="Proyek Berdampak Rendah: ">Tunda proyek yang tidak memberi manfaat langsung bagi bisnis dan alihkan anggarannya ke kebutuhan yang lebih mendesak.</LongItem>
    </div>
  </div>
);

export const meta: SlideMeta = {
  title: 'FGD Room 1 — Survival Mode',
  createdAt: '2026-10-08T05:49:26.473Z',
};

export default [Room, Geopolitical, Layoff, Adaptive, Employees, Priorities] satisfies Page[];
