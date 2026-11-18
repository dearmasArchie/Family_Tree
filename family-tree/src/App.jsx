import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useNavigationType, useParams } from 'react-router-dom';
import './App.css';
import Album from './components/Album';
import Birthdays from './components/Birthdays';
import FamilyLines from './components/FamilyLines';
import Footer from './components/Footer';
import GenerationSection from './components/GenerationSection';
import Header from './components/Header';
import Hero from './components/Hero';
import ParentsPage from './components/ParentsPage';
import PersonDetail from './components/PersonDetail';
import Timeline from './components/Timeline';
import { generations, people } from './data/people';
import useReveal from './useReveal';
import useScrollParallax from './useScrollParallax';

const SITE_TITLE = 'De Armas';
const parentGeneration = generations.find((generation) => generation.id === 'children');
const childGeneration = generations.find((generation) => generation.id === 'grandchildren');

function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_TITLE}` : SITE_TITLE;
  }, [title]);
}

// "Back" goes to the previous page in this site, or home if the page was opened directly from a link.
function useGoBack() {
  const navigate = useNavigate();
  const location = useLocation();
  return () => (location.key !== 'default' ? navigate(-1) : navigate('/'));
}

// New pages open at the top; Back/Forward return to where you were on that page.
function useScrollMemory() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef({});

  useEffect(() => {
    window.history.scrollRestoration = 'manual'; // we restore it ourselves below
  }, []);

  useEffect(() => {
    const save = () => {
      positions.current[location.key] = window.scrollY;
    };
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [location.key]);

  useLayoutEffect(() => {
    if (navigationType === 'POP') {
      window.scrollTo(0, positions.current[location.key] ?? 0);
      return;
    }
    // Links like /#birthdays (from the footer) jump to that section; anything else starts at the top.
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo(0, 0);
  }, [location.key, location.hash, navigationType]);
}

function HomePage() {
  usePageTitle(null);

  const scrollToTree = () => {
    document.getElementById('family-tree')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Hero onExplore={scrollToTree} />

      <Timeline />

      <Birthdays />

      {/* The tree moves as one parallax unit so the family lines stay attached to the cards. */}
      <main id="family-tree" className="tree-wrapper parallax-rise" data-parallax data-reveal="lines">
        <FamilyLines />
        {generations.filter((generation) => generation.onHomeTree !== false).map((generation) => (
          <GenerationSection
            key={generation.id}
            label={generation.label}
            isCouple={generation.id === 'grandparents'}
            memberIds={generation.members}
            people={people}
            actionTo={generation === parentGeneration ? '/parents' : undefined}
          />
        ))}
      </main>

      <Album />
    </>
  );
}

function PersonPage() {
  const { id } = useParams();
  const person = Object.hasOwn(people, id) ? people[id] : null;
  usePageTitle(person ? person.name : 'Not found');

  if (!person) return <NotFound />;
  return <PersonDetail id={id} person={person} />;
}

function ParentsRoute() {
  const goBack = useGoBack();
  usePageTitle('Children of Ernesto & Jovita');

  return (
    <ParentsPage
      people={people}
      parentGeneration={parentGeneration}
      childGeneration={childGeneration}
      onBack={goBack}
    />
  );
}

function NotFound() {
  usePageTitle('Not found');
  return (
    <div className="not-found-page">
      <h1>Page not found</h1>
      <p>That page isn't part of the family tree.</p>
      <Link to="/" className="detail-button">
        Go to the family tree
      </Link>
    </div>
  );
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useScrollMemory();
  useScrollParallax(location.pathname);
  useReveal(location.pathname);

  const handleBrandClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <Header onHome={handleBrandClick} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/person/:id" element={<PersonPage />} />
        <Route path="/parents" element={<ParentsRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
