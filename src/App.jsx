import { useState, useEffect } from "react";

const TEAM = [
  { name: "Alix", emoji: "🦊", color: "#e74c3c" },
  { name: "Célia", emoji: "🐺", color: "#8e44ad" },
  { name: "Sofia", emoji: "🦅", color: "#2980b9" },
];

const CHALLENGES = [
  { id: 1, title: "Le Code Avocat", location: "🛋️ Grand Salon", locationDesc: "Rassemblez-vous dans le grand salon !", icon: "🥑" },
  { id: 2, title: "Le Quiz des Héros", location: "🎬 Salle Cinéma", locationDesc: "Installez-vous dans la salle cinéma !", icon: "🎬" },
  { id: 3, title: "La Suite Mystérieuse", location: "🪟 Chambre Parentale", locationDesc: "Allez à la fenêtre ouest de la suite parentale !", icon: "🔍" },
  { id: 4, title: "La Carte au Trésor", location: "📚 Bureau Mezzanine", locationDesc: "Restez au bureau mezzanine !", icon: "🗺️" },
  { id: 5, title: "Le Trésor Légendaire", location: "🏆 Épreuve Finale", locationDesc: "", icon: "💎" },
];

function norm(s) {
  return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
}
function match(input, accepted) {
  const n = norm(input);
  return accepted.some(a => n === norm(a) || n.includes(norm(a)));
}

function Particles({ count = 20 }) {
  const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#A78BFA", "#F472B6"];
  const ps = Array.from({ length: count }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 6,
    dur: 4 + Math.random() * 5, size: 4 + Math.random() * 6,
    color: colors[i % colors.length],
  }));
  return (
    <div className="particles-container">
      {ps.map(p => (
        <div key={p.id} className="particle" style={{
          left: `${p.left}%`,
          width: p.size, height: p.size,
          background: p.color,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div className="progress-wrapper">
      <div className="progress-header">
        <span>Progression</span><span>{current} / {total}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${(current / total) * 100}%` }} />
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className={`progress-dot ${i < current ? 'completed' : ''}`}
            style={{ left: `${((i + 1) / total) * 100}%` }}>
            {i < current ? "⭐" : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

function Header({ ch }) {
  return (
    <div className="header">
      <div className="header-location">{ch.location}</div>
      <h2 className="header-title">
        <span className="header-icon">{ch.icon}</span>
        Épreuve {ch.id} : {ch.title}
      </h2>
      {ch.locationDesc && (
        <p className="header-desc">📍 {ch.locationDesc}</p>
      )}
    </div>
  );
}

function Timer({ seconds }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return (
    <span className="timer">
      {m}:{s.toString().padStart(2, "0")}
    </span>
  );
}

// ─── CHALLENGE 1: Avocat Cipher ───
function Challenge1({ onComplete }) {
  const [phase, setPhase] = useState("cipher");
  const [elapsed, setElapsed] = useState(0);
  const [showHint1, setShowHint1] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [answer, setAnswer] = useState("");
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const [codeHint, setCodeHint] = useState(false);
  const [solved, setSolved] = useState(false);

  const ENCODED = "SEKIIYD IQBBU SYDUCQ";
  const DECODED = "COUSSIN SALLE CINEMA";
  const SHIFT = 10;
  const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const H1 = 180;
  const H2 = 360;

  useEffect(() => {
    if (solved || phase !== "cipher") return;
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [solved, phase]);

  const h1ok = elapsed >= H1;
  const h2ok = elapsed >= H2;

  const checkCipher = () => {
    if (norm(answer).replace(/\s/g, "") === norm(DECODED).replace(/\s/g, "")) setSolved(true);
    else { setWrong(true); setTimeout(() => setWrong(false), 1500); }
  };

  const checkCode = () => {
    if (match(code, ["indiana jones", "indiana", "indianajones"])) onComplete();
    else { setWrongCode(true); setTimeout(() => setWrongCode(false), 1500); }
  };

  if (phase === "cipher" && !solved) {
    return (
      <div className="challenge-content fade-in">
        <p className="challenge-intro">
          Un mystérieux message codé a été laissé sur la table du salon… Chaque lettre a été remplacée par une autre. Un seul indice pour le déchiffrer :
        </p>

        <div className="avocat-hint">
          <span className="avocat-text">🥑 AVOCAT</span>
        </div>

        <div className="code-box">
          <p className="code-label">Message codé :</p>
          <div className="code-text">{ENCODED}</div>
        </div>

        <div className="input-group">
          <input type="text" value={answer} onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => e.key === "Enter" && checkCipher()}
            placeholder="Le message déchiffré…"
            className={`text-input ${wrong ? 'error' : ''}`} />
          <button onClick={checkCipher} className="btn btn-primary">Valider ✓</button>
        </div>
        {wrong && <p className="error-msg shake">❌ Pas tout à fait… Vérifiez chaque lettre !</p>}

        <div className="hints-section">
          {!h1ok ? (
            <div className="hint-locked">
              🔒 Indice 1 disponible dans <Timer seconds={Math.max(0, H1 - elapsed)} />
            </div>
          ) : !showHint1 ? (
            <button onClick={() => setShowHint1(true)} className="btn btn-hint fade-in">
              💡 Indice 1 disponible ! Cliquez pour le révéler
            </button>
          ) : (
            <div className="hint-revealed fade-in">
              <p>💡 <strong>A vaut K</strong> — chaque lettre codée correspond à une lettre décalée ! A→K, B→L, C→M… Pour décoder, faites le chemin inverse !</p>
            </div>
          )}
        </div>

        {h1ok && (
          <div className="hints-section">
            {!h2ok ? (
              <div className="hint-locked">
                🔒 Indice 2 disponible dans <Timer seconds={Math.max(0, H2 - elapsed)} />
              </div>
            ) : !showTable ? (
              <button onClick={() => setShowTable(true)} className="btn btn-hint-alt fade-in">
                📊 Indice 2 disponible ! Voir la table de décodage
              </button>
            ) : (
              <div className="table-container fade-in">
                <p className="table-label">📊 Table de décodage :</p>
                <div className="decode-table-wrapper">
                  <table className="decode-table">
                    <tbody>
                      <tr>
                        <td className="table-header">Codé</td>
                        {ALPHA.split("").map(l => (
                          <td key={l} className="table-coded">{l}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="table-header">Vrai</td>
                        {ALPHA.split("").map((_, i) => (
                          <td key={i} className="table-decoded">
                            {ALPHA[(i + SHIFT) % 26]}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (solved && phase === "cipher") {
    return (
      <div className="challenge-content fade-in text-center">
        <div className="success-icon">🎉</div>
        <p className="success-text">
          Le message dit :<br />
          <strong className="success-answer">« COUSSIN SALLE CINÉMA »</strong>
        </p>
        <p className="success-hint">
          Courez à la salle cinéma et cherchez sous les coussins ! 🛋️
        </p>
        <button onClick={() => setPhase("code")} className="btn btn-success">
          On a trouvé le papier ! →
        </button>
      </div>
    );
  }

  return (
    <div className="password-box fade-in">
      <div className="password-header">
        <span className="password-icon">🔑</span>
        <p>Vous avez trouvé un papier sous le coussin ? Entrez le nom du grand aventurier !</p>
      </div>
      <div className="input-group">
        <input type="text" value={code} onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === "Enter" && checkCode()} placeholder="Mot de passe…"
          className={`text-input text-input-large ${wrongCode ? 'error' : ''}`} />
        <button onClick={checkCode} className="btn btn-unlock">🔓</button>
      </div>
      {wrongCode && <p className="error-msg shake">❌ Ce n'est pas le bon mot de passe…</p>}
      {!codeHint ? (
        <button onClick={() => setCodeHint(true)} className="btn-text">💡 Un indice ?</button>
      ) : (
        <p className="code-hint fade-in">C'est un archéologue avec un chapeau et un fouet… 🤠</p>
      )}
    </div>
  );
}

// ─── CHALLENGE 2: Emoji Quiz ───
function Challenge2({ onComplete }) {
  const [phase, setPhase] = useState("quiz");
  const questions = [
    { emojis: "🏠⬆️🎈🎈👴👦", accepted: ["la haut", "là haut", "la-haut", "là-haut", "up"] },
    { emojis: "🐀👨‍🍳🇫🇷🍝⭐", accepted: ["ratatouille"] },
    { emojis: "🏝️👧🌊🐔⛵", accepted: ["vaiana", "moana"] },
    { emojis: "🤖🌱🚀🗑️❤️", accepted: ["wall-e", "walle", "wall e"] },
    { emojis: "👧🏴󠁧󠁢󠁳󠁣󠁴󠁿🐻🏹🧶", accepted: ["rebelle", "brave", "merida", "mérida"] },
  ];
  const [answers, setAnswers] = useState(questions.map(() => ""));
  const [results, setResults] = useState(questions.map(() => null));
  const [allOk, setAllOk] = useState(false);
  const [code, setCode] = useState("");
  const [wrongCode, setWrongCode] = useState(false);
  const [codeHint, setCodeHint] = useState(false);

  const checkAll = () => {
    const r = questions.map((q, i) => match(answers[i], q.accepted));
    setResults(r);
    if (r.every(Boolean)) setTimeout(() => setAllOk(true), 400);
  };

  const checkCode = () => {
    if (match(code, ["xena", "xéna", "xenna"])) onComplete();
    else { setWrongCode(true); setTimeout(() => setWrongCode(false), 1500); }
  };

  if (phase === "quiz" && !allOk) {
    return (
      <div className="challenge-content fade-in">
        <p className="challenge-intro">
          Trouvez les 5 films Disney/Pixar cachés derrière ces emojis ! 🎬
        </p>
        {questions.map((q, i) => (
          <div key={i} className={`quiz-item ${results[i] === true ? 'correct' : results[i] === false ? 'incorrect' : ''}`}
            style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="quiz-emojis">{q.emojis}</div>
            <div className="quiz-input-row">
              <input type="text" value={answers[i]}
                onChange={e => { const a = [...answers]; a[i] = e.target.value; setAnswers(a); }}
                placeholder={`Film ${i + 1}`} disabled={results[i] === true}
                className={`text-input ${results[i] === true ? 'success' : ''}`} />
              {results[i] === true && <span className="result-icon">✅</span>}
              {results[i] === false && <span className="result-icon">❌</span>}
            </div>
          </div>
        ))}
        <button onClick={checkAll} className="btn btn-primary btn-center">Vérifier ✓</button>
      </div>
    );
  }

  if (allOk && phase === "quiz") {
    return (
      <div className="challenge-content fade-in text-center">
        <div className="success-icon">🌟</div>
        <p className="success-text">Bravo les cinéphiles !</p>
        <p className="success-hint">
          Le prochain indice est caché dans la <strong>chambre d'amis</strong>… dans la <strong className="highlight">Mystery Machine</strong> ! 🚐
        </p>
        <button onClick={() => setPhase("code")} className="btn btn-success">
          On a trouvé le papier ! →
        </button>
      </div>
    );
  }

  return (
    <div className="password-box fade-in">
      <div className="password-header">
        <span className="password-icon">🔑</span>
        <p>Vous avez fouillé la Mystery Machine dans la chambre d'amis ? Entrez le nom de la guerrière !</p>
      </div>
      <div className="input-group">
        <input type="text" value={code} onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === "Enter" && checkCode()} placeholder="Mot de passe…"
          className={`text-input text-input-large ${wrongCode ? 'error' : ''}`} />
        <button onClick={checkCode} className="btn btn-unlock">🔓</button>
      </div>
      {wrongCode && <p className="error-msg shake">❌ Ce n'est pas le bon mot de passe…</p>}
      {!codeHint ? (
        <button onClick={() => setCodeHint(true)} className="btn-text">💡 Un indice ?</button>
      ) : (
        <p className="code-hint fade-in">C'est une princesse guerrière de la télé… ⚔️</p>
      )}
    </div>
  );
}

// ─── CHALLENGE 3: Word Completion ───
function Challenge3({ onComplete }) {
  const [phase, setPhase] = useState("words");
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);
  const [code, setCode] = useState("");
  const [wrongCode, setWrongCode] = useState(false);
  const [codeHint, setCodeHint] = useState(false);

  const checkWords = () => {
    if (match(answer, ["jour et nuit"])) setSolved(true);
    else { setWrong(true); setTimeout(() => setWrong(false), 1500); }
  };

  const checkCode = () => {
    if (match(code, ["picsou", "oncle picsou", "uncle scrooge", "scrooge"])) onComplete();
    else { setWrongCode(true); setTimeout(() => setWrongCode(false), 1500); }
  };

  if (phase === "words" && !solved) {
    return (
      <div className="challenge-content fade-in">
        <p className="challenge-intro">
          Regardez attentivement par la fenêtre ouest… Un élément du décor extérieur contient la suite de cette phrase. Trouvez les <strong className="highlight">3 mots suivants</strong> !
        </p>

        <div className="phrase-box">
          <p className="phrase-hint">👀 Cherchez dans le décor visible depuis la fenêtre !</p>
          <div className="phrase-text">
            « Sorties de véhicules
            <br />
            <span className="phrase-blanks">
              <span className="blank blank-1">mot 1</span>
              <span className="blank blank-2">mot 2</span>
              <span className="blank blank-3">mot 3</span>
            </span>
            <span className="phrase-end"> »</span>
          </div>
        </div>

        <div className="input-group">
          <input type="text" value={answer} onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => e.key === "Enter" && checkWords()}
            placeholder="Les 3 mots manquants…"
            className={`text-input ${wrong ? 'error' : ''}`} />
          <button onClick={checkWords} className="btn btn-primary">Valider ✓</button>
        </div>
        {wrong && <p className="error-msg shake">❌ Ce n'est pas ça… Regardez encore par la fenêtre !</p>}
      </div>
    );
  }

  if (solved && phase === "words") {
    return (
      <div className="challenge-content fade-in text-center">
        <div className="success-icon">🔍</div>
        <p className="success-text">
          « Sorties de véhicules <strong className="success-answer">JOUR ET NUIT</strong> » !
        </p>
        <p className="success-hint">
          Le prochain mot de passe est caché dans le <strong className="highlight">panda</strong> sur le <strong>bureau mezzanine</strong> ! 🐼
        </p>
        <button onClick={() => setPhase("code")} className="btn btn-success">
          On a trouvé le papier dans le panda ! →
        </button>
      </div>
    );
  }

  return (
    <div className="password-box fade-in">
      <div className="password-header">
        <span className="password-icon">🔑</span>
        <p>Entrez le nom de l'aventurier écrit sur le papier du panda !</p>
      </div>
      <div className="input-group">
        <input type="text" value={code} onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === "Enter" && checkCode()} placeholder="Mot de passe…"
          className={`text-input text-input-large ${wrongCode ? 'error' : ''}`} />
        <button onClick={checkCode} className="btn btn-unlock">🔓</button>
      </div>
      {wrongCode && <p className="error-msg shake">❌ Ce n'est pas le bon mot de passe…</p>}
      {!codeHint ? (
        <button onClick={() => setCodeHint(true)} className="btn-text">💡 Un indice ?</button>
      ) : (
        <p className="code-hint fade-in">C'est un canard milliardaire qui adore plonger dans ses pièces d'or… 🦆💰</p>
      )}
    </div>
  );
}

// ─── CHALLENGE 4: Treasure Map ───
function Challenge4({ onComplete }) {
  const [phase, setPhase] = useState("map");
  const [room, setRoom] = useState("");
  const [wrongRoom, setWrongRoom] = useState(false);
  const [foundRoom, setFoundRoom] = useState(false);
  const [code, setCode] = useState("");
  const [wrongCode, setWrongCode] = useState(false);
  const [codeHint, setCodeHint] = useState(false);

  const acceptedRooms = ["placard a chaussures", "placard à chaussures", "placard chaussures",
    "placard a chaussure", "placard à chaussure", "placard chaussure",
    "le placard a chaussures", "le placard à chaussures", "le placard a chaussure", "placard chaussure"];

  const checkRoom = () => {
    if (match(room, acceptedRooms)) setFoundRoom(true);
    else { setWrongRoom(true); setTimeout(() => setWrongRoom(false), 1500); }
  };

  const checkCode = () => {
    if (match(code, ["benjamin gates", "ben gates", "benjamin gate", "gates"])) onComplete();
    else { setWrongCode(true); setTimeout(() => setWrongCode(false), 1500); }
  };

  if (phase === "map" && !foundRoom) {
    return (
      <div className="challenge-content fade-in">
        <p className="challenge-intro">
          Quelque part dans cette pièce se cache une <strong className="highlight">carte au trésor</strong>… Cherchez bien !
        </p>

        <div className="treasure-map-box">
          <div className="treasure-map-icon pulse">🗺️</div>
          <p className="treasure-map-title">Trouvez la carte au trésor !</p>
          <p className="treasure-map-hint">
            Elle se trouve <strong className="highlight">près du feu 🔥</strong>, cachée sous un <strong className="highlight">tas de parchemins 📜</strong>
          </p>
          <p className="treasure-map-sub">Étudiez la carte et trouvez le nom de la pièce secrète !</p>
        </div>

        <div className="input-group">
          <input type="text" value={room} onChange={e => setRoom(e.target.value)}
            onKeyDown={e => e.key === "Enter" && checkRoom()}
            placeholder="Le nom de la pièce…"
            className={`text-input ${wrongRoom ? 'error' : ''}`} />
          <button onClick={checkRoom} className="btn btn-primary">Valider ✓</button>
        </div>
        {wrongRoom && <p className="error-msg shake">❌ Ce n'est pas cette pièce… Relisez bien la carte !</p>}
      </div>
    );
  }

  if (foundRoom && phase === "map") {
    return (
      <div className="challenge-content fade-in text-center">
        <div className="success-icon">🐱</div>
        <p className="success-text">
          Exact ! C'est le <strong className="success-answer">placard à chaussures</strong> !
        </p>
        <p className="success-hint">
          Le mot de passe est caché dans la <strong className="highlight">maison de sommeil de Maître Chat</strong> ! 🐱💤
        </p>
        <button onClick={() => setPhase("code")} className="btn btn-success">
          On a trouvé le papier chez Maître Chat ! →
        </button>
      </div>
    );
  }

  return (
    <div className="password-box fade-in">
      <div className="password-header">
        <span className="password-icon">🔑</span>
        <p>Entrez le nom de l'aventurier écrit sur le papier de Maître Chat !</p>
      </div>
      <div className="input-group">
        <input type="text" value={code} onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === "Enter" && checkCode()} placeholder="Mot de passe…"
          className={`text-input text-input-large ${wrongCode ? 'error' : ''}`} />
        <button onClick={checkCode} className="btn btn-unlock">🔓</button>
      </div>
      {wrongCode && <p className="error-msg shake">❌ Ce n'est pas le bon mot de passe…</p>}
      {!codeHint ? (
        <button onClick={() => setCodeHint(true)} className="btn-text">💡 Un indice ?</button>
      ) : (
        <p className="code-hint fade-in">C'est un chasseur de trésors américain joué par Nicolas Cage ! 🏛️</p>
      )}
    </div>
  );
}

// ─── CHALLENGE 5: Final + Banquet ───
function Challenge5({ onComplete }) {
  const [step, setStep] = useState("reveal");
  const [revealed, setRevealed] = useState(false);
  const [banquetCode, setBanquetCode] = useState("");
  const [wrongB, setWrongB] = useState(false);
  const [bHint, setBHint] = useState(false);

  const checkBanquet = () => {
    if (match(banquetCode, ["bijou", "boite bijou", "boîte bijou", "la boite bijou", "la boîte bijou"])) setStep("banquet");
    else { setWrongB(true); setTimeout(() => setWrongB(false), 1500); }
  };

  if (step === "reveal") {
    return (
      <div className="challenge-content fade-in text-center">
        {!revealed ? (
          <>
            <div className="final-key-icon pulse">🗝️</div>
            <p className="final-unlock-text">Les 4 aventuriers ont été débloqués !</p>
            <div className="adventurers-list">
              {["🤠 Indiana Jones", "⚔️ Xéna", "🦆 Picsou", "🏛️ Benjamin Gates"].map(a => (
                <span key={a} className="adventurer-badge">{a}</span>
              ))}
            </div>
            <button onClick={() => setRevealed(true)} className="btn btn-reveal pulse">
              🔓 Révéler la cachette du trésor !
            </button>
          </>
        ) : (
          <div className="fade-in">
            <div className="riddle-box">
              <div className="riddle-icons">🌳💎🗿</div>
              <pre className="riddle-text">
{`Sous le plus noble des arbres,
À l'angle sud du lac artificiel,
Sous une pierre…

🍁 Le trésor vous attend !`}
              </pre>
            </div>
            <button onClick={() => setStep("treasure")} className="btn btn-success">
              🏃‍♀️ On court le chercher !
            </button>
          </div>
        )}
      </div>
    );
  }

  if (step === "treasure") {
    return (
      <div className="challenge-content fade-in text-center">
        <div className="trophy-icon bounce">🏆</div>
        <h2 className="treasure-found-title">Trésor trouvé !</h2>
        <p className="treasure-found-text">
          Bravo ! Mais attendez… il y a un <strong className="highlight">petit papier</strong> à l'intérieur du trésor !<br />
          Il mène au lieu du <strong>banquet des aventurières</strong> ! 🎂
        </p>
        <button onClick={() => setStep("banquetCode")} className="btn btn-special">
          On a trouvé le papier ! 📄
        </button>
      </div>
    );
  }

  if (step === "banquetCode") {
    return (
      <div className="challenge-content fade-in">
        <div className="text-center" style={{ marginBottom: 24 }}>
          <div className="banquet-icon">🎂</div>
          <p className="banquet-intro">
            Dernier mot de passe ! Entrez le mot écrit sur le papier du trésor pour découvrir le lieu du banquet !
          </p>
        </div>
        <div className="password-box">
          <div className="input-group">
            <input type="text" value={banquetCode} onChange={e => setBanquetCode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && checkBanquet()} placeholder="Dernier mot de passe…"
              className={`text-input text-input-large ${wrongB ? 'error' : ''}`} />
            <button onClick={checkBanquet} className="btn btn-unlock">🔓</button>
          </div>
          {wrongB && <p className="error-msg shake">❌ Ce n'est pas le bon mot…</p>}
          {!bHint ? (
            <button onClick={() => setBHint(true)} className="btn-text">💡 Un indice ?</button>
          ) : (
            <p className="code-hint fade-in">C'est un mot précieux qu'on porte au doigt ou au cou… 💎</p>
          )}
        </div>
      </div>
    );
  }

  // step === "banquet"
  return (
    <div className="challenge-content fade-in text-center">
      <Particles count={40} />
      <div className="celebration-icon">🎉</div>
      <h2 className="banquet-title">Le Banquet des Aventurières !</h2>
      <div className="banquet-reveal-box">
        <div className="banquet-food-icons">🎂🍰🧁</div>
        <p className="banquet-location">Direction la boîte « Bijou » !</p>
        <p className="banquet-sub">Le festin des aventurières vous y attend !</p>
      </div>
      <button onClick={onComplete} className="btn btn-success">🎊 C'est la fête !</button>
    </div>
  );
}

// ─── VICTORY ───
function VictoryScreen({ onRestart }) {
  return (
    <div className="screen victory-screen">
      <Particles count={50} />
      <div className="victory-crown bounce">👑</div>
      <h1 className="victory-title">Aventure Terminée !</h1>
      <p className="victory-text">
        Alix, Célia et Sofia, dignes héritières d'Indiana Jones, Xéna, Picsou et Benjamin Gates, ont triomphé de toutes les épreuves et mérité leur banquet ! 🎂
      </p>
      <div className="team-cards">
        {TEAM.map((m, i) => (
          <div key={m.name} className="team-card" style={{
            background: `linear-gradient(135deg, ${m.color}30, ${m.color}10)`,
            borderColor: m.color,
            animationDelay: `${i * 0.15}s`,
          }}>
            <div className="team-emoji">{m.emoji}</div>
            <div className="team-name" style={{ color: m.color }}>{m.name}</div>
            <div className="team-stars">⭐⭐⭐⭐⭐</div>
          </div>
        ))}
      </div>
      <button onClick={onRestart} className="btn btn-restart">🔄 Recommencer</button>
    </div>
  );
}

// ─── START ───
function StartScreen({ onStart }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="screen start-screen">
      <div className="start-map-icon pulse">🗺️</div>
      <h1 className="start-title">La Chasse au Trésor</h1>
      <p className="start-subtitle">des Grandes Aventurières</p>
      <p className="start-info">5 épreuves • 4 mots de passe secrets • 1 trésor légendaire</p>
      <div className="team-cards-start">
        {TEAM.map((m, i) => (
          <div key={m.name}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            onTouchStart={() => setHovered(i)} onTouchEnd={() => setHovered(null)}
            className={`team-card-start ${hovered === i ? 'hovered' : ''}`}
            style={{
              borderColor: `${m.color}70`,
              background: hovered === i ? `linear-gradient(135deg, ${m.color}35, ${m.color}15)` : undefined,
              animationDelay: `${i * 0.12}s`,
            }}>
            <div className="team-emoji-start">{m.emoji}</div>
            <div className="team-name-start" style={{ color: m.color }}>{m.name}</div>
            <div className="team-role">Chasseuse de trésor</div>
          </div>
        ))}
      </div>
      <button onClick={onStart} className="btn btn-start">🏴‍☠️ C'est parti !</button>
    </div>
  );
}

// ─── MAIN ───
export default function App() {
  const [screen, setScreen] = useState("start");
  const [ci, setCi] = useState(0);
  const [completed, setCompleted] = useState(0);

  const handleStart = () => { setScreen("challenge"); setCi(0); setCompleted(0); };
  const handleComplete = () => {
    const next = ci + 1;
    setCompleted(next);
    if (next >= CHALLENGES.length) setScreen("victory");
    else setCi(next);
  };

  const CC = [Challenge1, Challenge2, Challenge3, Challenge4, Challenge5];
  const Cur = CC[ci];

  return (
    <div className="app">
      <Particles count={18} />
      {screen === "start" && <StartScreen onStart={handleStart} />}
      {screen === "challenge" && (
        <div className="challenge-screen">
          <ProgressBar current={completed} total={5} />
          <Header ch={CHALLENGES[ci]} />
          <Cur key={ci} onComplete={handleComplete} />
        </div>
      )}
      {screen === "victory" && <VictoryScreen onRestart={handleStart} />}
    </div>
  );
}
