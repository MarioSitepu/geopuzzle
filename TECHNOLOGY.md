# Tech Stack & Architecture 🛠️

Dokumen ini merinci tumpukan teknologi (tech stack) dan keputusan arsitektural yang digunakan dalam pengembangan **GeoPuzzle**.

## 💻 Core Technologies

### 1. [Next.js 16.2 (App Router)](https://nextjs.org/)
Digunakan sebagai framework utama untuk membangun aplikasi React yang berperforma tinggi.
- **Server Components**: Mengoptimalkan waktu muat halaman awal.
- **Client Components**: Digunakan pada modul puzzle untuk interaksi real-time.
- **App Router**: Memanfaatkan sistem routing berbasis direktori yang modern.

### 2. [React 19](https://react.dev/)
Library UI inti yang digunakan untuk membangun antarmuka berbasis komponen yang reaktif.

### 3. [TypeScript](https://www.typescriptlang.org/)
Memberikan keamanan tipe (type-safety) di seluruh aplikasi, mengurangi bug saat runtime, dan meningkatkan pengalaman pengembangan.

## 🎨 UI & Styling

### 1. [Tailwind CSS 4.0](https://tailwindcss.com/)
Utility-first CSS framework yang digunakan untuk membangun desain kustom tanpa menulis CSS mentah.
- **Custom Color Palette**: Menggunakan skema warna *Earth Tone* (Emerald, Amber, Orange, Red) untuk merepresentasikan elemen alam.
- **Glassmorphism**: Implementasi efek kaca menggunakan `backdrop-blur` dan transparansi variabel.

### 2. [Lucide React](https://lucide.dev/)
Kumpulan ikon SVG yang ringan dan konsisten untuk meningkatkan navigasi visual.

### 3. [Framer Motion / Motion](https://www.framer.com/motion/)
Library animasi untuk menciptakan transisi yang halus, efek *hover* yang dinamis, dan animasi mikro pada kepingan puzzle.

## 🖱️ Interactive Mechanics

### 1. [@dnd-kit](https://dnd-kit.com/)
Toolkit drag-and-drop tingkat lanjut yang digunakan untuk seluruh logika puzzle.
- **Sensors**: Mendukung input Mouse dan Touch secara bersamaan.
- **Modifiers**: Memastikan kepingan puzzle tetap berada dalam kontainer saat ditarik.
- **Collision Detection**: Menggunakan strategi `closestCenter` untuk presisi penempatan pada papan.

## 🗄️ State & Data Management

### 1. [Zustand](https://github.com/pmndrs/zustand)
Manajemen state global yang ringan dan cepat untuk melacak:
- Skor pemain di setiap stage.
- Riwayat kuis yang telah diselesaikan.
- Progres regional pemain.

### 2. [Prisma ORM](https://www.prisma.io/)
Digunakan sebagai lapisan abstraksi database untuk mengelola data pengguna dan riwayat permainan.
- **Adapter**: PostgreSQL (`pg`).

### 3. [NextAuth.js](https://next-auth.js.org/)
Solusi autentikasi untuk mengamankan data pengguna dan memungkinkan fitur penyimpanan progres lintas perangkat.

## 🛠️ Development Tools

- **ESLint**: Linter untuk menjaga konsistensi gaya kode.
- **PostCSS**: Pemrosesan CSS tingkat lanjut.
- **Babel Plugin React Compiler**: Mengoptimalkan performa rendering React secara otomatis.

---

## 🏗️ Design Patterns

- **Atomic Design**: Membagi UI menjadi atom (tombol, ikon), molekul (item puzzle), dan organisme (papan puzzle).
- **Responsive Geometry**: Menggunakan sistem koordinat persentase (`top`, `left` %) untuk memastikan kepingan puzzle tetap selaras dengan gambar latar belakang di semua resolusi layar.
- **Constraint-Based Dragging**: Menggunakan `activationConstraint` untuk mencegah tarikan yang tidak disengaja saat scrolling pada perangkat mobile.
