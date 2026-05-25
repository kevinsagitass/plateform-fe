"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChefHat,
  ChevronRight,
  Clock3,
  Mail,
  Menu,
  Star,
  Users,
  X,
} from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Operasional Terintegrasi",
    description:
      "Satu platform untuk mengelola pesanan, reservasi, pembayaran, dan aktivitas restoran.",
    icon: CalendarDays,
  },
  {
    title: "Insight Realtime",
    description:
      "Dapatkan data penjualan dan performa bisnis secara akurat untuk membantu pengambilan keputusan.",
    icon: Star,
  },
  {
    title: "Manajemen Multistaff",
    description:
      "Atur akses dan koordinasi tim restoran dengan sistem yang lebih modern dan terstruktur.",
    icon: Users,
  },
];

const stats = [
  { label: "Restaurants onboarded", value: "100+" },
  { label: "Monthly reservations", value: "3K+" },
  { label: "Average booking time", value: "< 30 sec" },
];

const businessSolutions = [
  {
    name: "Manajemen Pesanan",
    description:
      "Kelola seluruh pesanan dine-in, takeaway, dan delivery dalam satu dashboard terintegrasi.",
    tag: "Operasional",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Analitik Penjualan",
    description:
      "Pantau performa penjualan harian, menu terlaris, dan tren pelanggan secara realtime. dan hasil analisa dari AI",
    tag: "Insight",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Manajemen Tim & Operasional",
    description:
      "Koordinasikan staff, reservasi, dan aktivitas restoran dengan lebih efisien.",
    tag: "Management",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  },
];

const pricingPlans = [
  {
    name: "Basic",
    price: "99K",
    description: "Cocok untuk restoran kecil yang baru memulai digitalisasi.",
    features: [
      "Manajemen pesanan dengan Pembayaran terintegrasi",
      "Dashboard pesanan realtime",
      "Dashboard penjualan",
      "1 bisnis & 1 tenant restoran",
      "Laporan harian",
      "Akses staff & role",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "199K",
    description:
      "Solusi lengkap untuk restoran berkembang dengan operasional lebih kompleks.",
    features: [
      "Semua fitur Starter",
      "Maksimum 3 bisnis & 5 tenant per bisnis",
      "Analitik penjualan by AI",
      "Manajemen reservasi",
      "Fitur generate caption untuk iklan by AI",
      "Stock Management",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "299K",
    description:
      "Untuk jaringan restoran dan kebutuhan operasional skala besar.",
    features: [
      "Semua fitur professional",
      "Dedicated support",
      "Unlimited bisnis & unlimited outlet",
      "Prioritas maintenance",
      "Export data & laporan",
      "Integrasi ke Whatsapp",
    ],
    highlighted: false,
  },
];

// const testimonials = [
//   {
//     name: "Alicia Hart",
//     role: "Food Content Creator",
//     quote:
//       "Plateform feels premium without trying too hard. The booking flow is ridiculously smooth.",
//   },
//   {
//     name: "Daniel Cho",
//     role: "Startup Founder",
//     quote:
//       "I use it every week for client dinners. Fast, clean, and the recommendations are actually good.",
//   },
//   {
//     name: "Maya Peterson",
//     role: "Lifestyle Editor",
//     quote:
//       "Finally a reservation platform that looks and feels modern. Everything feels intentional.",
//   },
// ];

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "discover", "pricing", "faq"];

      for (const section of sections) {
        const el = document.getElementById(section);

        if (el) {
          const rect = el.getBoundingClientRect();

          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Discover", href: "#discover" },
    { label: "Pricing", href: "#pricing" },
    // { label: "Reviews", href: "#reviews" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <main className="bg-surface text-neutral-900 overflow-hidden">
      {/* NAVBAR */}
      <header className="fixed top-0 z-50 w-full border-b border-neutral-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-warm shadow-order">
              <span className="font-display text-lg font-bold text-white">
                <ChefHat className="w-4 h-4 text-white" />
              </span>
            </div>

            <div>
              <p className="font-display text-lg font-semibold tracking-tight">
                Plateform
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm transition-colors ${
                  activeSection === item.href.replace("#", "")
                    ? "text-primary-600"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/auth">
              <Button className="rounded-full bg-primary-500 px-5 text-white hover:bg-primary-600">
                Get Started
              </Button>
            </Link>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-neutral-200 bg-white md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-neutral-700"
                >
                  {item.label}
                </a>
              ))}

              <div className="mt-2 flex gap-3">
                <Button variant="outline" className="flex-1 rounded-full">
                  Sign In
                </Button>

                <Button className="flex-1 rounded-full bg-primary-500 hover:bg-primary-600">
                  Start Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative min-h-screen overflow-hidden pt-32"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50 via-white to-white" />

        <div className="absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm text-primary-700">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              Premium restaurant management platform
            </div>

            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-neutral-950 md:text-6xl">
              Atur kebutuhan restoran anda dengan mudah.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600">
              Plateform membantu anda dalam mengelola bisnis anda menjadi mudah,
              efisien, dan cepat. Buat akun dan dapatkan free trial selama 30
              Hari untuk paket Basic!
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button className="group h-12 rounded-full bg-primary-500 px-7 text-base hover:bg-primary-600">
                <a href="#pricing">Explore Package</a>
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                className="h-12 rounded-full border-neutral-300 px-7 text-base"
              >
                View Demo
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <h3 className="font-display text-3xl font-bold text-neutral-950">
                    {stat.value}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-modal">
              <img
                src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop"
                alt="Restaurant POS system"
                className="h-[620px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/80">
                        Dashboard Operasional
                      </p>

                      <h3 className="mt-1 font-display text-2xl font-bold text-white">
                        Pantau bisnis secara langsung
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3 text-sm text-white/80">
                    <span>POS & Inventory</span>
                    <span>•</span>
                    <span>Realtime Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
              Kenapa pilih Plateform
            </p>

            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-neutral-950">
              Dirancang untuk mendukung operasional restoran yang lebih modern
              dan efisien.
            </h2>

            <p className="mt-5 text-lg leading-8 text-neutral-600">
              Solusi manajemen restoran terintegrasi untuk membantu operasional
              harian, meningkatkan efisiensi tim, dan memberikan pengalaman
              bisnis yang lebih praktis dalam satu platform.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full rounded-[28px] border-neutral-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <CardContent className="p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 transition-transform duration-300 group-hover:scale-105">
                      <feature.icon size={24} />
                    </div>

                    <h3 className="mt-6 font-display text-2xl font-semibold text-neutral-950">
                      {feature.title}
                    </h3>

                    <p className="mt-4 leading-7 text-neutral-600">
                      {feature.description}
                    </p>

                    <button className="mt-8 flex items-center gap-2 text-sm font-medium text-primary-600">
                      Learn More
                      <ChevronRight size={16} />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCOVER */}
      <section id="discover" className="bg-gradient-surface py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary-600">
                Solusi Bisnis
              </p>

              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-neutral-950">
                Seluruh kebutuhan operasional restoran dalam satu platform.
              </h2>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {businessSolutions.map((solution, index) => (
              <motion.div
                key={solution.name}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="group overflow-hidden rounded-[30px] border border-neutral-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="relative overflow-hidden">
                    <img
                      src={solution.image}
                      alt={solution.name}
                      className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-md">
                      {solution.tag}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-2xl font-semibold text-neutral-950">
                      {solution.name}
                    </h3>

                    <p className="mt-3 leading-7 text-neutral-600">
                      {solution.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Clock3 size={15} />
                        Sistem terintegrasi
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {/* <section id="reviews" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-600">
              Testimonials
            </p>

            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-neutral-950">
              Loved by modern diners everywhere.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12 }}
                viewport={{ once: true }}
              >
                <Card className="rounded-[28px] border-neutral-200 bg-white shadow-card">
                  <CardContent className="p-8">
                    <div className="flex gap-1 text-primary-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>

                    <p className="mt-6 text-lg leading-8 text-neutral-700">
                      “{item.quote}”
                    </p>

                    <div className="mt-8">
                      <h4 className="font-semibold text-neutral-950">
                        {item.name}
                      </h4>

                      <p className="mt-1 text-sm text-neutral-500">
                        {item.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* PRICING */}
      <section id="pricing" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
              Pricing
            </p>

            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-neutral-950">
              Paket fleksibel untuk setiap skala bisnis restoran.
            </h2>

            <p className="mt-5 text-lg leading-8 text-neutral-600">
              Mulai dari restoran independen hingga jaringan multi-outlet dengan
              kebutuhan operasional yang kompleks.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[32px] border p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "border-primary-500 bg-primary-500 text-white shadow-card-hover"
                    : "border-neutral-200 bg-white shadow-card"
                }`}
              >
                <div>
                  <h3 className="font-display text-2xl font-bold">
                    {plan.name}
                  </h3>

                  <p
                    className={`mt-3 leading-7 ${
                      plan.highlighted ? "text-white/80" : "text-neutral-600"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="mt-8">
                  <span className="font-display text-5xl font-bold">
                    {plan.price}
                  </span>

                  {plan.price !== "Custom" && (
                    <span
                      className={
                        plan.highlighted ? "text-white/70" : "text-neutral-500"
                      }
                    >
                      /bulan
                    </span>
                  )}
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check size={18} />

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`mt-10 h-12 w-full rounded-full ${
                    plan.highlighted
                      ? "bg-white text-primary-700 hover:bg-neutral-100"
                      : "bg-primary-500 text-white hover:bg-primary-600"
                  }`}
                >
                  Pilih Paket
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-neutral-950 py-28 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400">
              FAQ
            </p>

            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight">
              Pertanyaan yang sering diajukan
            </h2>

            <p className="mt-5 text-lg leading-8 text-neutral-400">
              Temukan informasi seputar sistem POS dan manajemen operasional
              restoran Plateform.
            </p>
          </div>

          <div className="mt-16 grid gap-5">
            {[
              {
                q: "Apa itu Plateform?",
                a: "Plateform adalah sistem POS dan manajemen restoran yang membantu operasional bisnis menjadi lebih efisien melalui pengelolaan pesanan, pembayaran, reservasi, dan analitik bisnis dalam satu platform.",
              },
              {
                q: "Apakah Plateform mendukung multi outlet?",
                a: "Ya. Plateform mendukung pengelolaan multi outlet dengan dashboard terpusat untuk memantau performa setiap cabang secara real-time.",
              },
              {
                q: "Apakah staff dapat memiliki akses yang berbeda?",
                a: "Tentu. Anda dapat mengatur role dan hak akses staff sesuai kebutuhan operasional restoran.",
              },
              {
                q: "Apakah data penjualan dapat diakses secara real-time?",
                a: "Ya. Seluruh data transaksi dan laporan penjualan diperbarui secara otomatis dan dapat diakses kapan saja melalui dashboard.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-primary-500/20 p-2 text-primary-300">
                    <Check size={14} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">{faq.q}</h3>

                    <p className="mt-3 leading-7 text-neutral-300">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TNC */}
          <div className="mt-20 rounded-[32px] border border-white/10 bg-white/5 p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h3 className="font-display text-3xl font-bold">
                  Keamanan & Privasi Data
                </h3>

                <p className="mt-4 leading-7 text-neutral-300">
                  Plateform dirancang dengan standar keamanan modern untuk
                  membantu melindungi data transaksi, operasional, dan informasi
                  bisnis restoran Anda.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="terms">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-white/15 bg-transparent text-white hover:bg-white hover:text-neutral-950 sm:w-auto"
                  >
                    Syarat & Ketentuan
                  </Button>
                </Link>

                <Link to="privacy">
                  <Button className="w-full rounded-full bg-primary-500 hover:bg-primary-600 sm:w-auto">
                    Kebijakan Privasi
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-gradient-warm opacity-[0.97]" />

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl font-bold tracking-tight text-white"
          >
            Tingkatkan operasional restoran Anda dengan sistem yang lebih
            modern.
          </motion.h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">
            Kelola pesanan, pembayaran, reservasi, dan analitik bisnis dalam
            satu platform terintegrasi yang dirancang untuk mendukung
            pertumbuhan bisnis restoran Anda.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/auth">
              <Button className="h-12 rounded-full bg-white px-7 text-base text-primary-700 hover:bg-neutral-100">
                Mulai Sekarang
              </Button>
            </Link>

            <Button
              variant="outline"
              className="h-12 rounded-full border-white/30 bg-transparent px-7 text-base text-white hover:bg-white hover:text-primary-700"
            >
              Lihat Demo
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-warm">
                <span className="font-display text-lg font-bold text-white">
                  <ChefHat className="w-4 h-4 text-white" />
                </span>
              </div>

              <div>
                <p className="font-display text-lg font-semibold">Plateform</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-neutral-500">
              © 2026 Plateform. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-600">
            <Link to="/terms">
              <a>Terms</a>
            </Link>
            <Link to="privacy">
              <a>Privacy</a>
            </Link>

            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100">
              <FaInstagram size={16} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100">
              <FaTiktok size={16} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100">
              <Mail size={16} />
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
