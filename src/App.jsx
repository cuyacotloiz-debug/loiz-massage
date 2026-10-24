import { lazy, Suspense, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";

const Scene = lazy(() => import("./ExperienceScene.jsx"));
const image = (id, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;

const treatments = [
  [
    "AURA SIGNATURE MASSAGE",
    "60 MINUTES",
    "₱2,500",
    "A calming full-body massage to release everyday tension and restore a sense of balance.",
    "photo-1544161515-4ab6ce6db874",
  ],
  [
    "DEEP RELEASE",
    "90 MINUTES",
    "₱3,500",
    "A deeper therapeutic massage focused on areas of accumulated muscular tension.",
    "photo-1600334129128-685c5582fd35",
  ],
  [
    "HOT STONE RITUAL",
    "90 MINUTES",
    "₱3,800",
    "Warm volcanic stones combined with flowing techniques for deep relaxation.",
    "photo-1519823551278-64ac92734fb1",
  ],
  [
    "AROMA ESCAPE",
    "60 MINUTES",
    "₱2,800",
    "A soothing massage enhanced with carefully selected aromatic oils.",
    "photo-1540555700478-4be289fbecef",
  ],
  [
    "COUPLES SANCTUARY",
    "90 MINUTES",
    "₱6,500",
    "A private side-by-side massage experience designed for two.",
    "photo-1515377905703-c4788e51af15",
  ],
];
const therapists = [
  [
    "MAYA SANTOS",
    "Senior Massage Therapist",
    "8 years · English, Filipino",
    "photo-1551836022-d5d88e9218df",
  ],
  [
    "ELENA CRUZ",
    "Holistic Bodywork Specialist",
    "6 years · English, Filipino, Spanish",
    "photo-1580489944761-15a19d654956",
  ],
  [
    "JULIAN REYES",
    "Deep Tissue Therapist",
    "10 years · English, Filipino",
    "photo-1500648767791-00dcc994a43e",
  ],
];
const quotes = [
  [
    "From the moment I walked in, everything felt peaceful. The massage was incredible and the atmosphere was beautiful.",
    "Sophia M.",
  ],
  [
    "One of the most relaxing experiences I have had. My therapist was attentive, thoughtful, and truly exceptional.",
    "Daniel R.",
  ],
  [
    "A rare little pocket of calm. I left feeling lighter, and have already made my next reservation.",
    "Isabel T.",
  ],
];
const plans = [
  [
    "ESSENTIAL",
    "₱3,500",
    "1 Signature Massage",
    ["10% off additional treatments", "Priority booking"],
  ],
  [
    "SIGNATURE",
    "₱6,500",
    "2 Signature Massages",
    [
      "15% off additional treatments",
      "Complimentary aromatherapy",
      "Priority booking",
    ],
  ],
  [
    "AURA PRIVÉ",
    "₱12,500",
    "4 Signature Massages",
    [
      "20% off additional treatments",
      "Private wellness consultation",
      "Exclusive member benefits",
    ],
  ],
];

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ritual, setRitual] = useState("RELAX");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [treatment, setTreatment] = useState(treatments[0][0]);
  const [confirmation, setConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 850);
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    gsap.registerPlugin(ScrollTrigger);
    const ctx = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? null
      : gsap.context(() => {
          gsap.utils
            .toArray("[data-reveal]")
            .forEach((element) =>
              gsap.fromTo(
                element,
                { y: 22, autoAlpha: 0 },
                {
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.8,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: element,
                    start: "top 88%",
                    once: true,
                  },
                },
              ),
            );
          gsap.to(".environment-image", {
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: ".environment",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          });
        });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      ctx?.revert();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const selectTreatment = (name) => {
    setTreatment(name);
    document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });
  };
  const submitBooking = (event) => {
    event.preventDefault();
    const booking = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );
    booking.createdAt = new Date().toISOString();
    const saved = JSON.parse(
      window.localStorage.getItem("aura-reservations") || "[]",
    );
    window.localStorage.setItem(
      "aura-reservations",
      JSON.stringify([...saved, booking]),
    );
    event.currentTarget.reset();
    setTreatment(treatments[0][0]);
    setConfirmation(true);
  };
  const moveQuote = (step) =>
    setQuoteIndex(
      (current) => (current + step + quotes.length) % quotes.length,
    );

  return (
    <>
      <div
        className={`loading-screen${loading ? " is-visible" : ""}`}
        aria-hidden={!loading}
      >
        <span className="loading-mark">AURA</span>
        <span className="loading-copy">Preparing your sanctuary</span>
        <span className="loading-rule" />
      </div>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <a className="wordmark" href="#home" onClick={closeMenu}>
          AURA<span>®</span>
        </a>
        <nav
          className={`main-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="#experience" onClick={closeMenu}>
            Experience
          </a>
          <a href="#massages" onClick={closeMenu}>
            Massages
          </a>
          <a href="#therapists" onClick={closeMenu}>
            Therapists
          </a>
          <a href="#membership" onClick={closeMenu}>
            Membership
          </a>
          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>
          <a className="mobile-book-link" href="#booking" onClick={closeMenu}>
            Book an experience <ArrowUpRight size={15} />
          </a>
        </nav>
        <a className="header-book button-dark" href="#booking">
          BOOK NOW <ArrowUpRight size={14} />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-backdrop" />
          <Suspense fallback={null}>
            <Scene mode="hero" />
          </Suspense>
          <div className="hero-grain" />
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">
              <span /> A PRIVATE WELLNESS SANCTUARY · MANILA
            </p>
            <h1>
              TOUCH THAT
              <br />
              <em>RESTORES.</em>
            </h1>
            <p className="hero-description">
              Luxury massage rituals designed to release tension, restore
              balance, and reconnect you with yourself.
            </p>
            <div className="hero-actions">
              <a className="button-light" href="#booking">
                BOOK YOUR MASSAGE <ArrowUpRight size={15} />
              </a>
              <a className="text-link hero-explore" href="#experience">
                EXPLORE OUR RITUALS <ArrowDown size={14} />
              </a>
            </div>
          </div>
          <div className="hero-bottom">
            <span>MAKATI CITY, PHILIPPINES</span>
            <span className="scroll-cue">
              <span className="scroll-line" /> SCROLL TO BEGIN
            </span>
            <span>14°33′ N&nbsp; 121°01′ E</span>
          </div>
        </section>

        <section className="manifesto" id="experience">
          <div className="manifesto-top">
            <span className="eyebrow" data-reveal>
              THE AURA METHOD · 01 / 04
            </span>
            <span className="manifesto-aside" data-reveal>
              Thoughtfully made for the moments you need most.
            </span>
          </div>
          <div className="manifesto-lines" data-reveal>
            <p>
              FROM TENSION <span>TO RELEASE.</span>
            </p>
            <p>
              FROM STRESS <span>TO STILLNESS.</span>
            </p>
          </div>
          <div className="manifesto-bottom">
            <span>REST. RELEASE. RENEW.</span>
            <a
              href="#massages"
              className="round-link"
              aria-label="Explore massages"
            >
              <ArrowDown size={17} />
            </a>
          </div>
        </section>

        <section className="experience section-pad">
          <div className="experience-image image-frame" data-reveal>
            <img
              src={image("photo-1600334129128-685c5582fd35")}
              alt="Warm timber and soft linen inside the AURA wellness sanctuary"
              loading="lazy"
            />
            <span className="image-index">
              A QUIETER KIND OF CARE · EST. 2024
            </span>
          </div>
          <div className="experience-copy" data-reveal>
            <span className="eyebrow">THE AURA EXPERIENCE</span>
            <h2>
              Care that begins
              <br />
              with <em>intention.</em>
            </h2>
            <p>
              Every massage at AURA begins with a moment to arrive. Our
              therapists combine considered techniques, calming aromatherapy,
              and thoughtful rituals to create an experience that reaches beyond
              relaxation.
            </p>
            <a className="text-link underline-link" href="#arrival">
              OUR PHILOSOPHY <ArrowUpRight size={14} />
            </a>
            <div className="experience-note">
              <Sparkles size={15} />
              <span>PERSONAL, PRESENT, ENTIRELY YOURS.</span>
            </div>
          </div>
        </section>

        <section className="journey section-pad" id="journey">
          <div className="journey-heading" data-reveal>
            <span className="eyebrow">A BODY IN BALANCE · 02 / 04</span>
            <h2>
              CHOOSE YOUR
              <br />
              <em>RITUAL.</em>
            </h2>
          </div>
          <div className="journey-stage">
            <Suspense fallback={null}>
              <Scene mode="journey" />
            </Suspense>
            <div className="journey-orbit orbit-one" />
            <div className="journey-orbit orbit-two" />
            <span className="journey-caption">A MOMENT, MADE FOR YOU</span>
          </div>
          <div
            className="journey-controls"
            role="tablist"
            aria-label="Explore massage intentions"
          >
            {["RELAX", "RELEASE", "RESTORE", "RENEW"].map((name, index) => (
              <button
                key={name}
                type="button"
                className={ritual === name ? "is-active" : ""}
                role="tab"
                aria-selected={ritual === name}
                onClick={() => setRitual(name)}
              >
                <span>0{index + 1}</span>
                {name}
                <ArrowUpRight size={14} />
              </button>
            ))}
          </div>
          <p className="journey-description" aria-live="polite">
            {
              {
                RELAX:
                  "A gentle, unhurried rhythm that invites your whole body to soften.",
                RELEASE:
                  "Focused, intuitive pressure to ease the places that carry the day.",
                RESTORE:
                  "Thoughtful techniques that help bring you back to your own balance.",
                RENEW:
                  "A sensory reset, finished slowly, so you leave feeling entirely present.",
              }[ritual]
            }
          </p>
        </section>

        <section className="treatments section-pad" id="massages">
          <div className="section-heading" data-reveal>
            <div>
              <span className="eyebrow">THE TREATMENT MENU · 03 / 04</span>
              <h2>
                Find your
                <br />
                <em>way back.</em>
              </h2>
            </div>
            <p>
              Each ritual is shaped around how you feel today. Begin with a
              treatment, and we will take care of the rest.
            </p>
          </div>
          <div className="treatment-grid">
            {treatments.map(
              ([name, duration, price, description, photo], index) => (
                <article
                  className={`treatment-item treatment-item-${index + 1}`}
                  key={name}
                  data-reveal
                >
                  <button
                    className="treatment-photo image-frame"
                    type="button"
                    onClick={() => selectTreatment(name)}
                    aria-label={`Book ${name}`}
                  >
                    <img
                      src={image(photo, 900)}
                      alt={`Quiet spa setting for ${name.toLowerCase()}`}
                      loading="lazy"
                    />
                    <span className="treatment-number">0{index + 1}</span>
                    <span className="photo-arrow">
                      <ArrowUpRight size={17} />
                    </span>
                  </button>
                  <div className="treatment-info">
                    <div className="treatment-title">
                      <h3>{name}</h3>
                      <span>{price}</span>
                    </div>
                    <span className="treatment-duration">{duration}</span>
                    <p>{description}</p>
                    <button
                      type="button"
                      className="text-link underline-link"
                      onClick={() => selectTreatment(name)}
                    >
                      {index === 4 ? "BOOK FOR TWO" : "BOOK THIS RITUAL"}{" "}
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>

        <section className="art-touch">
          <div className="art-touch-copy" data-reveal>
            <span className="eyebrow">A PRACTICE OF PRESENCE</span>
            <h2>
              THE ART
              <br />
              OF <em>TOUCH.</em>
            </h2>
            <p>Pressure. Rhythm. Warmth. Presence.</p>
          </div>
          <div className="stone-study" aria-hidden="true">
            <span className="stone stone-large" />
            <span className="stone stone-medium" />
            <span className="stone stone-small" />
            <span className="stone stone-four" />
            <span className="stone-shadow" />
          </div>
          <span className="art-touch-foot">EVERY DETAIL, CONSIDERED</span>
        </section>

        <section className="therapists section-pad" id="therapists">
          <div className="section-heading therapists-heading" data-reveal>
            <div>
              <span className="eyebrow">THE PEOPLE BEHIND THE PAUSE</span>
              <h2>
                In the hands
                <br />
                of <em>experience.</em>
              </h2>
            </div>
            <a className="text-link underline-link" href="#booking">
              MEET OUR THERAPISTS <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="therapist-grid">
            {therapists.map(([name, role, details, photo], index) => (
              <article className="therapist-item" key={name} data-reveal>
                <div className="therapist-photo image-frame">
                  <img
                    src={image(photo, 760)}
                    alt={`Portrait of ${name}, ${role}`}
                    loading="lazy"
                  />
                  <span>0{index + 1} / AURA TEAM</span>
                </div>
                <div className="therapist-name">
                  <h3>{name}</h3>
                  <span>{details.split(" · ")[0]}</span>
                </div>
                <p>{role}</p>
                <span className="therapist-languages">
                  {details.split(" · ")[1]}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="environment">
          <img
            className="environment-image"
            src={image("photo-1540555700478-4be289fbecef", 2000)}
            alt="Sunlit, peaceful interior at AURA Massage & Wellness"
            loading="lazy"
          />
          <div className="environment-shade" />
          <div className="environment-copy" data-reveal>
            <span className="eyebrow">
              A PRIVATE PLACE TO RETURN TO YOURSELF
            </span>
            <h2>
              YOUR SPACE
              <br />
              TO <em>EXHALE.</em>
            </h2>
          </div>
          <span className="environment-caption">
            THE AURA SANCTUARY · MAKATI
          </span>
        </section>

        <section className="arrival section-pad" id="arrival">
          <div className="arrival-heading" data-reveal>
            <span className="eyebrow">A LITTLE SPACE BEFORE YOU ARRIVE</span>
            <h2>
              Arrive. Unwind.
              <br />
              <em>Let go.</em>
            </h2>
          </div>
          <div className="arrival-steps">
            {[
              [
                "01",
                "ARRIVE",
                "Give yourself a few minutes to settle into the environment.",
              ],
              [
                "02",
                "BREATHE",
                "Choose your preferred pressure, aroma, and treatment style.",
              ],
              [
                "03",
                "RELEASE",
                "Let your therapist guide you into a deeper state of relaxation.",
              ],
            ].map(([number, title, description]) => (
              <article className="arrival-step" key={number} data-reveal>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="step-rule" />
              </article>
            ))}
          </div>
        </section>

        <section className="couples">
          <div className="couples-image">
            <img
              src={image("photo-1515377905703-c4788e51af15", 1600)}
              alt="Quiet, intimate treatment setting prepared for a couples massage"
              loading="lazy"
            />
          </div>
          <div className="couples-copy" data-reveal>
            <span className="eyebrow">A SHARED RITUAL</span>
            <h2>
              Share the
              <br />
              <em>stillness.</em>
            </h2>
            <p>
              Two people. One private sanctuary. An experience designed to slow
              time down together.
            </p>
            <a className="button-light" href="#booking">
              BOOK THE COUPLES EXPERIENCE <ArrowUpRight size={14} />
            </a>
          </div>
          <span className="couples-index">SIDE BY SIDE · 90 MINUTES</span>
        </section>

        <section className="testimonials section-pad">
          <div className="testimonial-top" data-reveal>
            <span className="eyebrow">KIND WORDS, KEPT CLOSE</span>
            <span className="quote-count">
              0{quoteIndex + 1} <i /> 0{quotes.length}
            </span>
          </div>
          <div className="testimonial-body" data-reveal aria-live="polite">
            <span className="quote-mark">“</span>
            <blockquote>{quotes[quoteIndex][0]}</blockquote>
            <div className="quote-credit">
              <span>{quotes[quoteIndex][1]}</span>
              <span>AURA GUEST</span>
            </div>
          </div>
          <div className="testimonial-controls">
            <button
              type="button"
              onClick={() => moveQuote(-1)}
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={17} />
            </button>
            <button
              type="button"
              onClick={() => moveQuote(1)}
              aria-label="Next testimonial"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <section className="membership section-pad" id="membership">
          <div className="membership-heading" data-reveal>
            <span className="eyebrow">A MORE PERSONAL WAY TO PAUSE</span>
            <h2>
              Make relaxation
              <br />a <em>ritual.</em>
            </h2>
            <p>Make room for the care you deserve, more often.</p>
          </div>
          <div className="membership-grid">
            {plans.map(([name, price, massages, details], index) => (
              <article
                className={`membership-plan${index === 1 ? " is-featured" : ""}`}
                key={name}
                data-reveal
              >
                <span className="membership-index">0{index + 1} / MONTHLY</span>
                <h3>{name}</h3>
                <p className="membership-price">
                  {price}
                  <span> / MONTH</span>
                </p>
                <p className="membership-massage">{massages}</p>
                <ul>
                  {details.map((detail) => (
                    <li key={detail}>
                      <Check size={14} />
                      {detail}
                    </li>
                  ))}
                </ul>
                <a
                  href="#booking"
                  className={index === 1 ? "button-dark" : "plan-link"}
                >
                  BECOME A MEMBER <ArrowUpRight size={14} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="booking section-pad" id="booking">
          <div className="booking-heading" data-reveal>
            <span className="eyebrow">YOUR MOMENT IS WAITING</span>
            <h2>
              Your time
              <br />
              to <em>unwind.</em>
            </h2>
            <p>
              Tell us a little about what you need. Our team will be in touch to
              confirm your reservation.
            </p>
            <div className="booking-contact">
              <span>NEED A HAND?</span>
              <a href="tel:+63281234567">+63 2 8123 4567</a>
              <span>DAILY · 10:00 AM — 9:00 PM</span>
            </div>
          </div>
          <form className="booking-form" onSubmit={submitBooking} data-reveal>
            <div className="form-row">
              <label>
                FULL NAME
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                />
              </label>
              <label>
                MOBILE NUMBER
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+63"
                  required
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                EMAIL ADDRESS
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                TREATMENT
                <select
                  name="treatment"
                  value={treatment}
                  onChange={(event) => setTreatment(event.target.value)}
                  required
                >
                  {treatments.map(([name]) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-row form-row-three">
              <label>
                PREFERRED DATE
                <input name="date" type="date" required />
              </label>
              <label>
                PREFERRED TIME
                <select name="time" defaultValue="" required>
                  <option value="" disabled>
                    Select time
                  </option>
                  {[
                    "10:00 AM",
                    "11:30 AM",
                    "1:00 PM",
                    "2:30 PM",
                    "4:00 PM",
                    "5:30 PM",
                    "7:00 PM",
                  ].map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
              </label>
              <label>
                GUESTS
                <select name="guests" defaultValue="1">
                  <option>1</option>
                  <option>2</option>
                </select>
              </label>
            </div>
            <div className="form-row">
              <label>
                THERAPIST PREFERENCE
                <select name="therapist" defaultValue="No preference">
                  <option>No preference</option>
                  {therapists.map(([name]) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </label>
              <fieldset className="pressure-field">
                <legend>PREFERRED PRESSURE</legend>
                <div className="pressure-options">
                  {["LIGHT", "MEDIUM", "DEEP"].map((level, index) => (
                    <label key={level}>
                      <input
                        type="radio"
                        name="pressure"
                        value={level}
                        defaultChecked={index === 1}
                      />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            <label className="requests-label">
              ADDITIONAL REQUESTS
              <textarea
                name="requests"
                rows="2"
                placeholder="Anything you would like us to know?"
              />
            </label>
            <button className="button-dark submit-booking" type="submit">
              REQUEST A RESERVATION <ArrowUpRight size={15} />
            </button>
            <span className="form-privacy">
              Your details are only used to coordinate your visit.
            </span>
          </form>
        </section>

        <section className="closing">
          <Suspense fallback={null}>
            <Scene mode="closing" />
          </Suspense>
          <div className="closing-copy" data-reveal>
            <span className="eyebrow">WHEN YOU ARE READY</span>
            <h2>
              Take a breath.
              <br />
              <em>Let go.</em>
            </h2>
            <p>Come back to yourself.</p>
            <a className="button-light" href="#booking">
              BOOK YOUR EXPERIENCE <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="closing-wordmark">AURA</div>
          <span className="closing-caption">MASSAGE & WELLNESS</span>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="footer-main">
          <a className="footer-logo" href="#home">
            AURA<span>®</span>
          </a>
          <p>
            Slow down. Breathe deep.
            <br />
            Feel renewed.
          </p>
          <a
            className="footer-address"
            href="https://maps.google.com/?q=Makati+City+Philippines"
            target="_blank"
            rel="noreferrer"
          >
            Makati City, Philippines <ArrowUpRight size={13} />
          </a>
        </div>
        <div className="footer-column">
          <span>EXPLORE</span>
          <a href="#experience">The experience</a>
          <a href="#massages">Our massages</a>
          <a href="#therapists">Our therapists</a>
          <a href="#membership">Membership</a>
        </div>
        <div className="footer-column">
          <span>GET IN TOUCH</span>
          <a href="tel:+63281234567">+63 2 8123 4567</a>
          <a href="mailto:hello@aurawellness.ph">hello@aurawellness.ph</a>
          <span>DAILY · 10 AM — 9 PM</span>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AURA MASSAGE & WELLNESS</span>
          <span>MADE WITH INTENTION IN MANILA</span>
          <a href="#home">BACK TO TOP ↑</a>
        </div>
      </footer>

      {confirmation && (
        <div
          className="confirmation-overlay"
          onClick={() => setConfirmation(false)}
        >
          <section
            className="confirmation-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="confirmation-close"
              aria-label="Close confirmation"
              onClick={() => setConfirmation(false)}
            >
              <X size={19} />
            </button>
            <span className="confirmation-icon">
              <Check size={20} />
            </span>
            <span className="eyebrow">A MOMENT JUST FOR YOU</span>
            <h2 id="confirmation-title">
              Your moment of stillness
              <br />
              has been <em>reserved.</em>
            </h2>
            <p>
              Thank you. Our team will be in touch shortly to confirm the
              details of your visit.
            </p>
            <button
              className="button-dark"
              type="button"
              onClick={() => setConfirmation(false)}
            >
              BACK TO AURA <ArrowUpRight size={14} />
            </button>
          </section>
        </div>
      )}
    </>
  );
}

export default App;
