'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function MarketingPage() {
  const { user, isLoading } = useUser();

  if (isLoading) return null;

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="glass border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between backdrop-blur-xl w-full">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logo BudgetGuru"
                width={48}
                height={48}
                className="w-12 h-12 object-cover"
              />
              <span className="text-white/90 font-semibold text-lg">SousSous</span>
            </div>
            <div className="flex gap-4">
              {user ? (
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Link
                    href="/home"
                    className="glass px-6 py-2.5 rounded-xl text-white/90 border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all duration-300"
                  >
                    Mon Dashboard
                  </Link>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Link
                    href="/api/auth/login"
                    className="glass px-6 py-2.5 rounded-xl text-white/90 border border-white/10 hover:bg-white/5 transition-all duration-300"
                  >
                    Connexion / Inscription
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="glass border border-white/10 rounded-xl p-8 lg:p-12 mb-8 relative overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Effet de brillance animé */}
            <motion.div 
              className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{
                x: ['100%', '-100%'],
                transition: {
                  repeat: Infinity,
                  duration: 3,
                  ease: 'linear'
                }
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
              <motion.div variants={fadeIn}>
                <motion.h1 
                  className="text-3xl lg:text-6xl font-bold bg-gradient-to-r from-white via-white/90 to-emerald-400 bg-clip-text text-transparent mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  La gestion de budget intelligente avec l&apos;IA
                </motion.h1>
                <motion.p 
                  className="text-base lg:text-lg text-white/60 mb-8"
                  variants={fadeIn}
                >
                  SousSous utilise l&apos;intelligence artificielle pour vous aider à prendre de meilleures décisions financières et à atteindre vos objectifs d&apos;épargne.
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  variants={stagger}
                >
                  <motion.div variants={fadeIn} whileHover={{ scale: 1.02 }}>
                    <Link
                      href="/api/auth/login"
                      className="glass px-8 py-3 rounded-xl text-white/90 border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all duration-300 text-center block"
                    >
                      Commencer gratuitement
                    </Link>
                  </motion.div>
                  <motion.div variants={fadeIn} whileHover={{ scale: 1.02 }}>
                    <Link
                      href="#features"
                      className="glass px-8 py-3 rounded-xl text-white/90 border border-white/10 hover:bg-white/5 transition-all duration-300 text-center block"
                    >
                      Découvrir les fonctionnalités
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="aspect-[16/10] rounded-xl overflow-hidden border border-white/10 relative">
                  <Image
                    src="/dashboard-preview.png"
                    alt="Aperçu du dashboard SousSous"
                    width={800}
                    height={500}
                    className="w-full h-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-purple-500/20 to-blue-500/20 mix-blend-overlay" />
                </div>
                {/* Effet de brillance */}
                <motion.div 
                  className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-purple-500/30 rounded-xl blur opacity-50"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.section
            className="pb-8 px-4 relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="container mx-auto max-w-7xl">
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { number: "10k+", label: "Utilisateurs actifs" },
                  { number: "€2M+", label: "Budget géré" },
                  { number: "98%", label: "Clients satisfaits" },
                  { number: "24/7", label: "Support client" }
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="glass border border-white/10 rounded-xl p-6 text-center relative overflow-hidden group"
                    variants={fadeIn}
                    whileHover={{ y: -5 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <motion.h3
                      className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent mb-2"
                      initial={{ scale: 0.5 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                    >
                      {stat.number}
                    </motion.h3>
                    <p className="text-white/60">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* Features Grid Section */}
          <motion.section
            className="pb-8 px-4 relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="container mx-auto max-w-7xl">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                id="features"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                {[
                  {
                    title: "Analyse intelligente",
                    description: "L'IA analyse vos dépenses et vous donne des recommandations personnalisées pour optimiser votre budget.",
                    color: "emerald"
                  },
                  {
                    title: "Objectifs personnalisés",
                    description: "Définissez vos objectifs d'épargne et laissez l'IA vous guider pour les atteindre efficacement.",
                    color: "purple"
                  },
                  {
                    title: "Prévisions avancées",
                    description: "Prévoyez vos finances futures avec des modèles prédictifs basés sur vos habitudes de dépenses.",
                    color: "blue"
                  }
                ].map((feature) => (
                  <motion.div
                    key={feature.title}
                    className="glass border border-white/10 rounded-xl p-6 hover:bg-white/5 transition-all duration-300 relative overflow-hidden group"
                    variants={fadeIn}
                    whileHover={{ y: -5 }}
                  >
                    <motion.div 
                      className={`w-12 h-12 rounded-xl bg-${feature.color}-500/20 border border-${feature.color}-500/30 flex items-center justify-center mb-4`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Image
                        src="/dashboard-preview.png"
                        alt={`Icône ${feature.title}`}
                        width={28}
                        height={28}
                        className="opacity-80"
                      />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white/90 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    {/* Effet de survol */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* Detailed Features Section */}
          <motion.section
            className="py-16 px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="container mx-auto max-w-7xl">
              <motion.h2
                className="text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-white via-white/90 to-emerald-400 bg-clip-text text-transparent mb-12"
                variants={fadeIn}
              >
                Une suite complète d&apos;outils pour votre budget
              </motion.h2>
              
              {[
                {
                  title: "Intelligence Artificielle Avancée",
                  description: "Notre IA analyse vos habitudes financières et propose des recommandations personnalisées pour optimiser vos dépenses et maximiser vos économies.",
                  features: ["Analyse prédictive", "Recommandations personnalisées", "Détection des tendances"],
                  image: "/dashboard-preview.png"
                },
                {
                  title: "Gestion Multi-Comptes",
                  description: "Gérez tous vos comptes bancaires, cartes de crédit et investissements en un seul endroit, avec une vue d'ensemble claire et intuitive.",
                  features: ["Synchronisation automatique", "Catégorisation intelligente", "Tableaux de bord personnalisables"],
                  image: "/dashboard-preview.png"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="glass border border-white/10 rounded-xl p-8 lg:p-12 mb-8 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white/90 mb-4">{item.title}</h3>
                      <p className="text-white/60 mb-6">{item.description}</p>
                      <ul className="space-y-4">
                        {item.features.map((feature) => (
                          <motion.li
                            key={feature}
                            className="flex items-center gap-3 text-white/80"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                          >
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <motion.div
                      className="relative"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                    >
                      <div className="aspect-[16/10] rounded-xl overflow-hidden border border-white/10">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={800}
                          height={500}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-purple-500/20 to-blue-500/20 mix-blend-overlay" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Testimonials Section */}
          <motion.section
            className="py-16 px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="container mx-auto max-w-7xl">
              <motion.h2
                className="text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-white via-white/90 to-emerald-400 bg-clip-text text-transparent mb-12"
                variants={fadeIn}
              >
                Ce que nos utilisateurs disent
              </motion.h2>
              
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    name: "Marie L.",
                    role: "Entrepreneure",
                    content: "SousSous a transformé la façon dont je gère mes finances. Les prévisions de l'IA sont étonnamment précises !",
                    image: "/dashboard-preview.png"
                  },
                  {
                    name: "Thomas D.",
                    role: "Freelance",
                    content: "L'interface est intuitive et les recommandations personnalisées m'ont permis d'économiser plus que jamais.",
                    image: "/dashboard-preview.png"
                  },
                  {
                    name: "Sophie M.",
                    role: "Étudiante",
                    content: "Parfait pour gérer mon budget étudiant. Les notifications intelligentes m'aident à éviter les dépenses inutiles.",
                    image: "/dashboard-preview.png"
                  }
                ].map((testimonial) => (
                  <motion.div
                    key={testimonial.name}
                    className="glass border border-white/10 rounded-xl p-6 relative overflow-hidden group"
                    variants={fadeIn}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white/90">{testimonial.name}</h3>
                        <p className="text-sm text-white/60">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-white/80 italic">&quot;{testimonial.content}&quot;</p>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            className="py-16 px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="container mx-auto max-w-7xl">
              <motion.h2
                className="text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-white via-white/90 to-emerald-400 bg-clip-text text-transparent mb-12"
                variants={fadeIn}
              >
                Questions fréquentes
              </motion.h2>
              
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    question: "Comment fonctionne l'IA de SousSous ?",
                    answer: "Notre IA analyse vos transactions, identifie les patterns de dépenses et utilise des algorithmes avancés pour vous fournir des recommandations personnalisées."
                  },
                  {
                    question: "Mes données sont-elles sécurisées ?",
                    answer: "Absolument ! Nous utilisons un chiffrement de niveau bancaire et respectons les normes les plus strictes en matière de sécurité des données."
                  },
                  {
                    question: "Puis-je connecter plusieurs comptes bancaires ?",
                    answer: "Oui, SousSous vous permet de connecter et gérer tous vos comptes bancaires en un seul endroit de manière sécurisée."
                  },
                  {
                    question: "Y a-t-il une période d'essai gratuite ?",
                    answer: "Oui, vous pouvez essayer SousSous gratuitement pendant 30 jours, sans engagement et avec accès à toutes les fonctionnalités."
                  }
                ].map((faq) => (
                  <motion.div
                    key={faq.question}
                    className="glass border border-white/10 rounded-xl p-6 relative overflow-hidden group"
                    variants={fadeIn}
                    whileHover={{ y: -2 }}
                  >
                    <h3 className="font-semibold text-white/90 mb-2">{faq.question}</h3>
                    <p className="text-white/60">{faq.answer}</p>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.div 
            className="glass border border-white/10 rounded-xl p-8 lg:p-12 text-center mb-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Effet de brillance animé */}
            <motion.div 
              className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{
                x: ['100%', '-100%'],
                transition: {
                  repeat: Infinity,
                  duration: 3,
                  ease: 'linear'
                }
              }}
            />
            
            <motion.h2 
              className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-emerald-400 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Prêt à prendre le contrôle de vos finances ?
            </motion.h2>
            <motion.p 
              className="text-white/60 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Rejoignez des milliers d&apos;utilisateurs qui font confiance à SousSous pour gérer leurs finances personnelles.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link
                href="/api/auth/login"
                className="glass inline-block px-8 py-3 rounded-xl text-white/90 border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all duration-300"
              >
                Commencer maintenant
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
