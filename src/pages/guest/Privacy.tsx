import { motion } from "framer-motion";
import { ShieldCheck, Database, LockKeyhole, Users } from "lucide-react";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-surface text-neutral-900">
      {/* HERO */}
      <section className="border-b border-neutral-200 bg-gradient-to-b from-primary-50 to-white">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-100 text-primary-700">
              <ShieldCheck size={30} />
            </div>

            <h1 className="mt-6 font-display text-5xl font-bold tracking-tight text-neutral-950">
              Kebijakan Privasi
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-neutral-600">
              Plateform berkomitmen untuk melindungi data bisnis, transaksi,
              serta informasi operasional restoran Anda dengan standar keamanan
              modern dan praktik pengelolaan data yang transparan.
            </p>

            <p className="mt-4 text-sm text-neutral-500">
              Terakhir diperbarui: Mei 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                <Database size={22} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-neutral-950">
                Pengelolaan Data
              </h3>

              <p className="mt-3 leading-7 text-neutral-600">
                Data operasional restoran disimpan secara aman untuk mendukung
                transaksi, laporan, dan aktivitas bisnis.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                <LockKeyhole size={22} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-neutral-950">
                Keamanan Sistem
              </h3>

              <p className="mt-3 leading-7 text-neutral-600">
                Kami menerapkan perlindungan akses, autentikasi akun, dan
                pemantauan sistem untuk menjaga keamanan platform.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                <Users size={22} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-neutral-950">
                Privasi Pengguna
              </h3>

              <p className="mt-3 leading-7 text-neutral-600">
                Informasi pengguna dan staff hanya digunakan untuk kebutuhan
                operasional dan tidak diperjualbelikan kepada pihak ketiga.
              </p>
            </div>
          </div>

          <div className="mt-16 space-y-10 rounded-[32px] border border-neutral-200 bg-white p-8 shadow-sm md:p-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-neutral-950">
                1. Informasi yang Kami Kumpulkan
              </h2>

              <p className="mt-5 leading-8 text-neutral-600">
                Plateform dapat mengumpulkan informasi seperti nama bisnis,
                alamat email, nomor telepon, data transaksi, data menu,
                aktivitas kasir, laporan penjualan, serta informasi operasional
                lainnya yang dibutuhkan untuk menjalankan layanan.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold text-neutral-950">
                2. Penggunaan Informasi
              </h2>

              <p className="mt-5 leading-8 text-neutral-600">
                Informasi yang dikumpulkan digunakan untuk menyediakan layanan
                POS, manajemen pesanan, pengelolaan staff, laporan bisnis,
                analitik operasional, serta peningkatan kualitas platform.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold text-neutral-950">
                3. Keamanan Data
              </h2>

              <p className="mt-5 leading-8 text-neutral-600">
                Kami menerapkan langkah keamanan teknis dan administratif untuk
                membantu melindungi data dari akses tidak sah, kehilangan,
                penyalahgunaan, atau perubahan data.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold text-neutral-950">
                4. Akses Staff & Hak Pengguna
              </h2>

              <p className="mt-5 leading-8 text-neutral-600">
                Pemilik bisnis dapat mengatur hak akses staff berdasarkan peran
                tertentu seperti kasir, supervisor, atau administrator untuk
                menjaga keamanan operasional restoran.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold text-neutral-950">
                5. Pembayaran & Transaksi
              </h2>

              <p className="mt-5 leading-8 text-neutral-600">
                Data pembayaran dan transaksi digunakan hanya untuk proses
                operasional dan pelaporan bisnis. Plateform tidak menyimpan
                informasi sensitif kartu pembayaran di luar kebutuhan sistem
                yang berlaku.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold text-neutral-950">
                6. Pembaruan Kebijakan
              </h2>

              <p className="mt-5 leading-8 text-neutral-600">
                Plateform dapat memperbarui kebijakan privasi sewaktu-waktu
                untuk menyesuaikan perkembangan layanan, keamanan, dan regulasi
                yang berlaku.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
