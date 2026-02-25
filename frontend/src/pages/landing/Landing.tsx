import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaChartLine,
  FaClock,
  FaLayerGroup,
  FaRocket,
  FaUsers,
} from "react-icons/fa";
import "./landing.scss";
import brandLogo from "../../assets/opentaskhub-logo.svg";

const Landing: React.FC = () => {
  const features = [
    {
      icon: <FaLayerGroup />,
      title: "Gestion centralisee",
      description:
        "Regroupez vos projets, tickets et espaces de travail dans une interface unique.",
    },
    {
      icon: <FaUsers />,
      title: "Collaboration equipe",
      description:
        "Attribuez, commentez et suivez chaque tache avec un historique clair pour toute l'equipe.",
    },
    {
      icon: <FaChartLine />,
      title: "Suivi des performances",
      description:
        "Visualisez l'avancement en temps reel pour prioriser les actions qui comptent.",
    },
    {
      icon: <FaClock />,
      title: "Execution plus rapide",
      description:
        "Automatisez les flux de travail repetitifs et reduisez le temps perdu en coordination.",
    },
  ];

  const stats = [
    { label: "Tickets resolus", value: "120k+" },
    { label: "Equipes actives", value: "4.5k+" },
    { label: "Disponibilite", value: "99.9%" },
  ];

  const steps = [
    {
      title: "Creez votre espace",
      description:
        "Lancez votre compte en quelques secondes et structurez vos projets selon vos equipes.",
    },
    {
      title: "Invitez votre equipe",
      description:
        "Ajoutez les membres, definissez les roles et partagez les responsabilites sans friction.",
    },
    {
      title: "Pilotez l'execution",
      description:
        "Suivez les priorites, les delais et les blocages depuis un tableau de bord unifie.",
    },
  ];

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="hero-bg-shape hero-bg-shape-one" />
        <div className="hero-bg-shape hero-bg-shape-two" />

        <header className="landing-topbar">
          <div className="brand-block">
            <img src={brandLogo} alt="OpenTaskHub logo" className="brand-logo" />
            <span className="brand-name">OpenTaskHub</span>
          </div>
          <nav className="topbar-links">
            <Link to="/login">Connexion</Link>
            <Link to="/register" className="topbar-register">
              Essai gratuit
            </Link>
          </nav>
        </header>

        <div className="hero-content">
          <div className="hero-copy">
            <span className="hero-badge">
              <FaRocket /> Productivite orientee execution
            </span>
            <h1>
              Organisez vos projets, livrez plus vite et gardez votre equipe
              alignee.
            </h1>
            <p>
              OpenTaskHub est une plateforme de gestion des taches pour les
              equipes modernes. Centralisez vos flux, simplifiez la
              collaboration et obtenez une vision claire de l'avancement.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="primary-cta">
                Commencer gratuitement <FaArrowRight />
              </Link>
              <Link to="/login" className="secondary-cta">
                J'ai deja un compte
              </Link>
            </div>
            <ul className="hero-highlights">
              <li>
                <FaCheckCircle /> Onboarding en moins de 5 minutes
              </li>
              <li>
                <FaCheckCircle /> Interface concue pour les equipes produit
              </li>
              <li>
                <FaCheckCircle /> Plan gratuit pour demarrer sans risque
              </li>
            </ul>
          </div>

          <aside className="hero-panel">
            <h2>Vue rapide de vos operations</h2>
            <div className="panel-list">
              <div className="panel-item">
                <span>Design system v2</span>
                <strong>En cours</strong>
              </div>
              <div className="panel-item">
                <span>Migration API</span>
                <strong>Priorite haute</strong>
              </div>
              <div className="panel-item">
                <span>Support clients</span>
                <strong>12 tickets ouverts</strong>
              </div>
            </div>
            <div className="panel-stats">
              {stats.map((stat) => (
                <article key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="landing-features">
        <div className="section-heading">
          <span>Pourquoi OpenTaskHub</span>
          <h2>Un produit pense comme un vrai SaaS d'equipe</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-steps">
        <div className="section-heading">
          <span>Mise en route</span>
          <h2>Trois etapes pour deployer votre organisation</h2>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <article key={step.title} className="step-card">
              <span className="step-index">{`0${index + 1}`}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-testimonial">
        <blockquote>
          "Nous avons reduit nos retards de livraison de 38% en moins de deux
          mois. OpenTaskHub a simplifie la communication entre produit, tech et
          support."
        </blockquote>
        <p>Lea Martin, Head of Operations</p>
      </section>

      <section className="landing-final-cta">
        <h2>Passez de la gestion reactive a l'execution maitrisee.</h2>
        <p>
          Lancez votre espace OpenTaskHub maintenant et alignez toute votre
          equipe autour des memes objectifs.
        </p>
        <div className="final-cta-actions">
          <Link to="/register" className="primary-cta">
            Creer mon compte
          </Link>
          <Link to="/login" className="secondary-cta">
            Se connecter
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Landing;
