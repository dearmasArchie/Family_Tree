import { useState } from 'react';
import './App.css';
import heroImage from './assets/hero.jpg';
import Footer from './components/Footer';
import GenerationSection from './components/GenerationSection';
import Header from './components/Header';
import ParentsPage from './components/ParentsPage';
import PersonDetail from './components/PersonDetail';
import { generations, people } from './data/people';

function App() {
  const [page, setPage] = useState('home');
  const [selectedId, setSelectedId] = useState(null);
  const selectedPerson = selectedId ? people[selectedId] : null;
  const parentGeneration = generations.find((generation) => generation.label.includes("Parents"));
  const childGeneration = generations.find((generation) => generation.label.includes('Our Generation'));

  const handleSelectPerson = (personId) => {
    setSelectedId(personId);
    setPage('person');
  };

  const goHome = () => {
    setSelectedId(null);
    setPage('home');
  };

  const scrollToTree = () => {
    const treeSection = document.getElementById('family-tree');
    if (treeSection) {
      treeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderContent = () => {
    if (page === 'person' && selectedPerson) {
      return <PersonDetail person={selectedPerson} onBack={goHome} />;
    }

    if (page === 'parents' && parentGeneration && childGeneration) {
      return (
        <ParentsPage
          people={people}
          parentGeneration={parentGeneration}
          childGeneration={childGeneration}
          onBack={goHome}
          onSelect={handleSelectPerson}
        />
      );
    }

    return (
      <>
        <div className="home-hero">
          <div className="hero-image-fullwidth">
            <img src={heroImage} alt="Family heritage illustration" />
            <div className="hero-overlay">
              <div className="hero-copy">
                <span className="hero-eyebrow">Family heirloom</span>
                <h2>Preserving the De Armas family story through generations</h2>
                <p className="hero-description">
                  Explore every name, relationship, and memory in the family tree. From grandparents to the newest generation,
                  this is the story of our family preserved on one page.
                </p>
                <button type="button" className="hero-cta" onClick={scrollToTree}>
                  Explore the family tree
                </button>
              </div>
            </div>
          </div>

          {/* <img className="hero-separator" src={paperCutout} alt="Paper cutout separator" aria-hidden="true" /> */}
        </div>

        <div className="content-line" />

        <main id="family-tree" className="tree-wrapper">
          {generations.map((generation, index) => (
            <div key={generation.label}>
              <GenerationSection
                label={generation.label}
                memberIds={generation.members}
                people={people}
                onSelect={handleSelectPerson}
                onHeaderClick={generation.label.includes("Parents") ? () => setPage('parents') : undefined}
              />
              {index < generations.length - 1 && <div className="connector"></div>}
            </div>
          ))}
        </main>
      </>
    );
  };

  return (
    <>
      <Header onHome={goHome} />
      {renderContent()}
      <Footer />
    </>
  );
}

export default App;
