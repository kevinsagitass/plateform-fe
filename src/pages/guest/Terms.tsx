export default function Terms() {
  const sections = [
    {
      title: "1. Penggunaan Layanan",
      content:
        "Plateform menyediakan sistem POS dan manajemen operasional restoran yang mencakup pengelolaan pesanan, pembayaran, reservasi, staff, dan laporan bisnis. Pengguna bertanggung jawab untuk menggunakan layanan sesuai dengan hukum dan regulasi yang berlaku.",
    },
    {
      title: "2. Akun & Keamanan",
      content:
        "Setiap akun yang terdaftar wajib menjaga kerahasiaan informasi login dan bertanggung jawab atas seluruh aktivitas yang terjadi di dalam akun tersebut. Plateform berhak menangguhkan akun yang terindikasi melakukan penyalahgunaan sistem.",
    },
    {
      title: "3. Data Transaksi & Operasional",
      content:
        "Plateform menyimpan data transaksi, pesanan, laporan penjualan, serta aktivitas operasional restoran untuk mendukung fitur analitik dan monitoring bisnis. Pengguna bertanggung jawab atas keakuratan data yang dimasukkan ke dalam sistem.",
    },
    {
      title: "4. Pembayaran & Langganan",
      content:
        "Beberapa fitur Plateform tersedia melalui sistem berlangganan. Seluruh pembayaran yang telah dilakukan tidak dapat dikembalikan kecuali ditentukan lain oleh kebijakan perusahaan atau ketentuan hukum yang berlaku.",
    },
    {
      title: "5. Hak Akses Staff",
      content:
        "Pemilik bisnis dapat mengatur hak akses staff sesuai kebutuhan operasional restoran. Plateform tidak bertanggung jawab atas penyalahgunaan akses yang diberikan oleh pemilik akun kepada pihak internal bisnis.",
    },
    {
      title: "6. Ketersediaan Sistem",
      content:
        "Plateform berupaya menjaga stabilitas dan ketersediaan layanan, namun tidak menjamin sistem akan selalu bebas dari gangguan, maintenance, atau kendala teknis tertentu.",
    },
    {
      title: "7. Privasi & Keamanan Data",
      content:
        "Kami berkomitmen menjaga keamanan data pengguna dengan menerapkan standar keamanan yang wajar untuk melindungi informasi transaksi dan operasional bisnis restoran.",
    },
    {
      title: "8. Pembatasan Tanggung Jawab",
      content:
        "Plateform tidak bertanggung jawab atas kerugian bisnis, kehilangan data, atau gangguan operasional yang disebabkan oleh kesalahan pengguna, koneksi internet, perangkat pihak ketiga, atau faktor di luar kendali kami.",
    },
    {
      title: "9. Perubahan Layanan",
      content:
        "Plateform dapat memperbarui, mengubah, atau menghentikan sebagian fitur layanan sewaktu-waktu untuk pengembangan produk dan peningkatan kualitas sistem.",
    },
    {
      title: "10. Persetujuan Pengguna",
      content:
        "Dengan menggunakan layanan Plateform, pengguna dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* HERO */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
              Legal
            </p>

            <h1 className="mt-5 font-display text-5xl font-bold tracking-tight text-neutral-950">
              Syarat & Ketentuan
            </h1>

            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Dokumen ini mengatur penggunaan layanan Plateform sebagai sistem
              POS dan manajemen operasional restoran.
            </p>

            <div className="mt-8 inline-flex rounded-full border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm text-neutral-600">
              Terakhir diperbarui: Mei 2026
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm"
              >
                <h2 className="font-display text-2xl font-bold text-neutral-950">
                  {section.title}
                </h2>

                <p className="mt-5 leading-8 text-neutral-600">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* CONTACT */}
          <div className="mt-12 rounded-[32px] bg-primary-500 p-8 text-white">
            <h3 className="font-display text-3xl font-bold">
              Butuh bantuan lebih lanjut?
            </h3>

            <p className="mt-4 max-w-2xl leading-8 text-white/80">
              Jika Anda memiliki pertanyaan terkait syarat penggunaan atau
              keamanan layanan Plateform, silakan hubungi tim kami.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="mailto:support@plateform.id"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-primary-700 transition hover:bg-neutral-100"
              >
                support@plateform.id
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
