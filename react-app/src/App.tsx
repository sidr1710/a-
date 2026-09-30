import { useEffect } from 'react';
import Message from './Message';
import Scene3D from './components/Scene3D';
import TiltCard from './components/TiltCard';
import './App.css';

const features = [
  {
    icon: '◆',
    title: 'Real-time 3D',
    text: 'A WebGL scene rendered with Three.js — morphing shaders, orbiting rings and a living starfield.',
  },
  {
    icon: '✦',
    title: 'Interactive',
    text: 'Everything reacts to you. Move your pointer or scroll the page and the scene follows along.',
  },
  {
    icon: '⬢',
    title: 'Built with React',
    text: 'Typed React components powered by Vite for instant reloads and tiny production bundles.',
  },
];

const stats = [
  { value: '60', label: 'FPS animation' },
  { value: '1.8k', label: 'Particles' },
  { value: '100%', label: 'TypeScript' },
];

function App() {
  // Fade sections in as they scroll into view.
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Scene3D className="scene" />
      <div className="vignette" />

      <header className="nav">
        <a href="#top" className="nav__logo">
          sid<span>.</span>
        </a>
        <nav className="nav__links">
          <a href="#features">Features</a>
          <a href="#stats">Stats</a>
          <a href="#contact" className="btn btn--ghost">
            Contact
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__copy">
            <span className="pill">✨ Now in 3D</span>
            <Message />
            <p className="hero__lead">
              A landing page that jumps off the screen. Explore an interactive 3D world built with React and
              Three.js.
            </p>
            <div className="hero__actions">
              <a href="#features" className="btn btn--primary">
                Explore
              </a>
              <a href="#contact" className="btn btn--ghost">
                Get in touch
              </a>
            </div>
          </div>
          <a href="#features" className="scroll-hint" aria-label="Scroll down">
            <span />
          </a>
        </section>

        <section id="features" className="section reveal">
          <h2 className="section__title">
            Why it <span className="gradient-text">stands out</span>
          </h2>
          <div className="grid">
            {features.map((f) => (
              <TiltCard key={f.title} icon={f.icon} title={f.title}>
                {f.text}
              </TiltCard>
            ))}
          </div>
        </section>

        <section id="stats" className="section reveal">
          <div className="stats">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <strong className="gradient-text">{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section reveal">
          <div className="cta">
            <h2>
              Ready to build something <span className="gradient-text">out of this world?</span>
            </h2>
            <p>Let's turn ideas into immersive experiences.</p>
            <a href="mailto:hello@example.com" className="btn btn--primary">
              Say hello
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">© {new Date().getFullYear()} sid · Built with React + Three.js</footer>
    </>
  );
}

export default App;
