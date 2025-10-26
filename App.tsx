import React, { useState } from 'react';
import { Routes, Route, useParams, Link } from 'react-router-dom';
import { data } from './data';
import { Header, PageHeader, FilterBar, PlayerCard, TeamCard, MatchListItem, StandingsTable, PlayerDetailStatGrid, CalendarIcon, TeamStatsTable, CarouselMatchCard, ArrowLeftIcon, ArrowRightIcon, CompactStandingsTable, StatsHighlightCard, Marquee, Footer } from './components';
import { Match, MatchEventType, Player, Team } from './types';

// --- HELPER COMPONENTS (PAGE SPECIFIC) ---

const StatPlayerCard: React.FC<{ title: string; player?: Player, metric: string, value: number }> = ({ title, player, metric, value }) => (
    <div className="bg-neutral-900 rounded-2xl p-4 text-center border border-neutral-800 flex flex-col items-center justify-between transition-all duration-300 hover:border-green-400 hover:shadow-xl hover:shadow-green-500/10">
        <h3 className="font-oswald text-lg uppercase text-neutral-400">{title}</h3>
        {player ? (
            <>
                <div className="w-48 h-48 my-4 relative">
                   <div className="absolute inset-0 bg-neutral-800 opacity-50 rounded-full" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                   <img src={player.photoUrl} alt={player.fullName} className="w-full h-full object-contain relative z-10" />
                </div>
                <div>
                  <p className="font-oswald text-xl font-bold">{player.fullName}</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <img src={data.teams.find(t => t.id === player.teamId)?.logoUrl} alt="team logo" className="w-5 h-5" />
                    <p className="text-neutral-300 text-sm">{data.teams.find(t => t.id === player.teamId)?.name}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-700 w-full flex justify-between items-baseline">
                    <span className="text-neutral-400 font-oswald text-sm">{metric}</span>
                    <span className="font-oswald font-bold text-4xl bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text">{value}</span>
                </div>
            </>
        ) : (
             <div className="flex-grow flex items-center justify-center w-full">
                 <div className="w-48 h-48 my-4 bg-neutral-800/50 rounded-full flex items-center justify-center border-2 border-dashed border-neutral-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-600"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
            </div>
        )}
    </div>
);


const TimelineEvent: React.FC<{ event: Match['events'][0], homeTeamId: string }> = ({ event, homeTeamId }) => {
    const team = data.teams.find(t => t.id === event.teamId);
    const isHomeEvent = event.teamId === homeTeamId;

    const Icon = () => {
        switch (event.type) {
            case MatchEventType.GOAL: return <span className="text-lg">⚽</span>;
            case MatchEventType.YELLOW_CARD: return <div className="w-3 h-4 bg-yellow-400 rounded-sm"></div>;
            case MatchEventType.RED_CARD: return <div className="w-3 h-4 bg-red-500 rounded-sm"></div>;
            case MatchEventType.HALF_TIME: return <span className="text-sm font-bold text-neutral-400">HT</span>;
            default: return null;
        }
    };

    return (
        <div className={`flex items-center ${isHomeEvent ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <div className="w-1/2 flex items-center gap-3" style={{ flexDirection: isHomeEvent ? 'row-reverse' : 'row' }}>
                {team && <img src={team.logoUrl} alt={team.name} className="w-6 h-6" />}
                <p className="font-semibold">{event.playerName || team?.name || event.type}</p>
            </div>
            <div className="relative w-12 flex justify-center">
                <div className="h-full w-0.5 bg-neutral-700 absolute"></div>
                <div className="bg-gradient-to-br from-green-500 to-blue-500 text-black w-10 h-10 rounded-full z-10 flex items-center justify-center font-bold text-sm border-2 border-neutral-900">
                    {event.minute}'
                </div>
            </div>
            <div className="w-1/2 flex items-center" style={{ justifyContent: isHomeEvent ? 'flex-end' : 'flex-start' }}>
                <div className="bg-neutral-800 w-10 h-10 rounded-full flex items-center justify-center">
                    <Icon />
                </div>
            </div>
        </div>
    );
};


// --- PAGES ---

const HomePage: React.FC = () => {
    const getTopPlayers = (metric: keyof Player['stats'], count: number = 3) => {
        return [...data.players]
            .sort((a, b) => b.stats[metric] - a.stats[metric])
            .slice(0, count)
            .map(p => ({ ...p, statValue: p.stats[metric] as number }));
    };

    const getTopDefenders = (count: number = 3) => {
        return [...data.players]
            .filter(p => p.position === 'Defensor')
            .sort((a, b) => b.stats.tackles - a.stats.tackles)
            .slice(0, count)
            .map(p => ({ ...p, statValue: p.stats.tackles }));
    };
    
    const getTopGoalkeepers = (count: number = 3) => {
        return [...data.players]
            .filter(p => p.position === 'Goleiro')
            .sort((a, b) => b.stats.saves - a.stats.saves)
            .slice(0, count)
            .map(p => ({ ...p, statValue: p.stats.saves }));
    };
    
    const getMostCardedPlayers = (count: number = 3) => {
        return [...data.players]
            .map(p => ({
                ...p,
                cardScore: p.stats.yellowCards + (p.stats.redCards * 2),
                statValue: p.stats.yellowCards + p.stats.redCards
            }))
            .sort((a, b) => b.cardScore - a.cardScore)
            .slice(0, count);
    };

    const mvps = getTopPlayers('mvpMatches');
    const topScorers = getTopPlayers('goals');
    const topAssists = getTopPlayers('assists');
    const topDefenders = getTopDefenders();
    const topGoalkeepers = getTopGoalkeepers();
    const mostCarded = getMostCardedPlayers();

    const matchesByDate = data.matches.reduce<Record<string, Match[]>>((acc, match) => {
        if (!acc[match.date]) {
            acc[match.date] = [];
        }
        acc[match.date].push(match);
        return acc;
    }, {});
    
    const slides = Object.entries(matchesByDate).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());
    
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const goToNextSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    };

    const goToPrevSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };

    if (slides.length === 0) return <div>No matches available.</div>;

    const [currentDate, currentMatches] = slides[currentSlideIndex];

    return (
        <>
            <div className="container mx-auto px-4 py-10">
                <div className="relative bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                    <div className="flex justify-center items-center mb-6 relative">
                         <h2 className="font-oswald text-3xl font-bold text-center">
                            {new Date(currentDate).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                        </h2>
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-neutral-700 text-sm font-semibold px-3 py-1 rounded-md">{data.rounds.find(r => r.id === currentMatches[0].roundId)?.name}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {currentMatches.map(match => (
                            <CarouselMatchCard key={match.id} match={match} />
                        ))}
                    </div>

                    <button 
                        onClick={goToPrevSlide} 
                        className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 bg-neutral-800 rounded-full p-2 hover:bg-green-500 hover:text-black transition-all duration-300 shadow-lg disabled:opacity-30"
                        disabled={slides.length <= 1}
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={goToNextSlide} 
                        className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 bg-neutral-800 rounded-full p-2 hover:bg-green-500 hover:text-black transition-all duration-300 shadow-lg disabled:opacity-30"
                        disabled={slides.length <= 1}
                    >
                        <ArrowRightIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="flex justify-between items-baseline mb-4">
                      <h2 className="font-oswald text-2xl font-bold uppercase">Classificação</h2>
                      <Link to="/classification" className="text-xs text-neutral-400 hover:text-yellow-300 transition-colors">Ver mais</Link>
                    </div>
                    <CompactStandingsTable standings={data.standings.slice(0, 8)} teams={data.teams} />
                </div>
                <div className="lg:col-span-2">
                   <div className="flex justify-between items-baseline mb-4">
                      <h2 className="font-oswald text-2xl font-bold uppercase">Estatísticas</h2>
                      <Link to="/stats" className="text-xs text-neutral-400 hover:text-yellow-300 transition-colors">Ver mais</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatsHighlightCard title="MVP Rodada 2" players={mvps} metricLabel="MVPs" isMvp={true} />
                        <StatsHighlightCard title="Máximo Artilheiro" players={topScorers} metricLabel="Gols" />
                        <StatsHighlightCard title="Máximo Assistente" players={topAssists} metricLabel="Assist." />
                        <StatsHighlightCard title="Zagueiro" players={topDefenders} metricLabel="Desarmes" />
                        <StatsHighlightCard title="Goleiro" players={topGoalkeepers} metricLabel="Defesas" />
                        <StatsHighlightCard title="Cartões" players={mostCarded} metricLabel="Cartões" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="border-t border-neutral-800 pt-10">
                    <h3 className="font-oswald text-center text-2xl font-bold uppercase text-neutral-500 mb-8">Nossas Ligas</h3>
                    <div className="flex justify-center items-center gap-12 md:gap-20">
                        <img src="https://i.imgur.com/mAnT8S6.png" alt="Brasileirão Série A" className="h-24 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
                        <img src="https://i.imgur.com/YJgAnQ8.png" alt="Copa do Brasil" className="h-24 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
                        <img src="https://i.imgur.com/8f2c3v4.png" alt="FBF25" className="h-24 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
                    </div>
                </div>
            </div>
        </>
    );
};


const ClassificationPage: React.FC = () => (
    <>
        <PageHeader title="CLASSIFICAÇÃO" />
         <div className="bg-neutral-950/50 border-b border-neutral-800">
          <div className="container mx-auto px-4 py-4 flex justify-end items-center">
            <FilterBar />
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">
            <h3 className="font-oswald text-xl font-bold mb-4 bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text">REGULAR - GRUPO A</h3>
            <StandingsTable standings={data.standings} teams={data.teams} />
        </main>
    </>
);

const GamesPage: React.FC = () => {
    const rounds = [...data.rounds].sort((a,b) => a.order - b.order);
    return (
    <>
        <PageHeader title="JOGOS" />
        <div className="bg-neutral-950/50 border-b border-neutral-800">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold px-4 py-2 rounded-md hover:from-green-600 hover:to-blue-600 transition-all">
                <CalendarIcon className="w-5 h-5" />
                Adicionar ao calendário
            </button>
            <FilterBar />
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">
           {rounds.map(round => (
            <div key={round.id} className="mb-12">
                 <h2 className="font-oswald text-2xl font-bold mb-4 border-l-4 border-green-400 pl-4">{round.name.toUpperCase()}</h2>
                 <div className="space-y-3">
                     {data.matches.filter(m => m.roundId === round.id).map(match => (
                        <MatchListItem key={match.id} match={match} />
                     ))}
                 </div>
            </div>
           ))}
        </main>
    </>
)};


const TeamsPage: React.FC = () => (
    <>
        <PageHeader title="TIMES" />
        <div className="bg-neutral-950/50 border-b border-neutral-800">
          <div className="container mx-auto px-4 py-4 flex justify-end items-center">
            <FilterBar />
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.teams.map(team => <TeamCard key={team.id} team={team} />)}
            </div>
        </main>
    </>
);

const PlayersPage: React.FC = () => (
    <>
        <PageHeader title="JOGADORES" />
        <div className="bg-neutral-950/50 border-b border-neutral-800">
          <div className="container mx-auto px-4 py-4 flex justify-end items-center">
            <FilterBar />
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                {data.players.map(player => <PlayerCard key={player.id} player={player} />)}
            </div>
        </main>
    </>
);

const StatsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'player' | 'team'>('player');
    const [activePlayerCat, setActivePlayerCat] = useState('Resumo');
    const [activeTeamCat, setActiveTeamCat] = useState('Gols');

    const mvp = data.players.reduce((prev, curr) => (prev.stats.mvpMatches > curr.stats.mvpMatches ? prev : curr));
    const topScorer = data.players.reduce((prev, curr) => (prev.stats.goals > curr.stats.goals ? prev : curr));
    const topAssistant = data.players.reduce((prev, curr) => (prev.stats.assists > curr.stats.assists ? prev : curr));
    
    const playerCategories = ['Resumo', 'Gols', 'Chutes a gol', 'Passes', 'Ataques', 'Defesas', 'Goleiro', 'Cartões', 'MVP Jogo', 'MVP Rodada'];
    const teamCategories = ['Resumo', 'Gols', 'Chutes a gol', 'Passes', 'Ataques', 'Defesas', 'Cartões', 'Gols esperados'];
    
    const renderPlayerContent = () => {
        switch(activePlayerCat) {
            case 'Resumo':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <StatPlayerCard title="MVP" player={mvp} metric="MVPs" value={mvp.stats.mvpMatches}/>
                        <StatPlayerCard title="Máximo Artilheiro" player={topScorer} metric="Gols" value={topScorer.stats.goals}/>
                        <StatPlayerCard title="Máximo Assistente" player={topAssistant} metric="Assist." value={topAssistant.stats.assists} />
                    </div>
                );
            default:
                return <div className="text-center py-20 bg-neutral-900 rounded-2xl border border-neutral-800"><p>Estatísticas de {activePlayerCat} em breve.</p></div>
        }
    }
    
    const renderTeamContent = () => {
        switch(activeTeamCat) {
            case 'Gols':
                return <TeamStatsTable teams={data.teams} />;
            default:
                return <div className="text-center py-20 bg-neutral-900 rounded-2xl border border-neutral-800"><p>Estatísticas de {activeTeamCat} em breve.</p></div>
        }
    }

    const PageTitle = activeTab === 'player' ? "ESTATÍSTICAS POR JOGADOR" : "ESTATÍSTICAS POR TIME";
    const categories = activeTab === 'player' ? playerCategories : teamCategories;
    const activeCat = activeTab === 'player' ? activePlayerCat : activeTeamCat;
    const setActiveCat = activeTab === 'player' ? setActivePlayerCat : setActiveTeamCat;

    return (
        <>
            <PageHeader title={PageTitle} />
            <div className="bg-neutral-950/50 border-b border-neutral-800">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex space-x-1 bg-neutral-800 p-1 rounded-md">
                       <button onClick={() => setActiveTab('player')} className={`px-4 py-2 rounded text-sm font-bold transition-colors ${activeTab === 'player' ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' : 'text-white hover:bg-neutral-700'}`}>Por jogador</button>
                       <button onClick={() => setActiveTab('team')} className={`px-4 py-2 rounded text-sm font-bold transition-colors ${activeTab === 'team' ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' : 'text-white hover:bg-neutral-700'}`}>Por time</button>
                    </div>
                    <FilterBar />
                </div>
            </div>
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-12 gap-8">
                    <aside className="col-span-2">
                        <ul className="space-y-2">
                            {categories.map(cat => (
                                <li key={cat}>
                                    <button 
                                        onClick={() => setActiveCat(cat)}
                                        className={`w-full text-left px-4 py-3 rounded-md font-semibold transition-colors text-sm ${activeCat === cat ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}>
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>
                    <div className="col-span-10">
                       <h3 className="font-oswald text-2xl font-bold mb-4 uppercase text-neutral-300">
                            {activeTab === 'player' ? 'Estatísticas' : activeCat}
                       </h3>
                       {activeTab === 'player' ? renderPlayerContent() : renderTeamContent()}
                    </div>
                </div>
            </main>
        </>
    );
};

const PlayerDetailPage: React.FC = () => {
    const { playerId } = useParams<{ playerId: string }>();
    const player = data.players.find(p => p.id === playerId);

    if (!player) return <div className="text-center py-20">Jogador não encontrado.</div>;
    const team = data.teams.find(t => t.id === player.teamId);

    return (
        <div className="bg-neutral-950 min-h-screen">
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-neutral-900 rounded-2xl p-6 relative">
                            <div className="absolute inset-0 bg-neutral-800 opacity-20" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                            <div className="absolute top-4 right-4 flex flex-col items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 text-white font-bold">
                                <span className="text-sm">Média</span>
                                <span className="text-4xl font-oswald">{player.ratings.average}</span>
                            </div>
                            <img src={player.photoUrl?.replace('400/400', '800/800')} alt={player.fullName} className="w-full rounded-lg shadow-lg" />
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <h1 className="font-oswald text-6xl font-bold uppercase">{player.fullName}</h1>
                        <p className="text-2xl text-neutral-400 mb-4">{player.position}</p>
                        <div className="flex space-x-8 text-lg mb-8">
                            <div><span className="font-bold">Time:</span> {team?.name}</div>
                            <div><span className="font-bold">Altura:</span> {player.heightCm}cm</div>
                            <div><span className="font-bold">Data de nascimento:</span> {player.birthDate}</div>
                            <div><span className="font-bold">Local:</span> {player.nationality}</div>
                        </div>
                        <PlayerDetailStatGrid ratings={player.ratings} stats={player.stats} />
                    </div>
                </div>
            </main>
        </div>
    );
};

const TeamDetailPage: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const team = data.teams.find(t => t.id === teamId);
    const players = data.players.filter(p => p.teamId === teamId);

    if (!team) return <div className="text-center py-20">Time não encontrado.</div>;

    return (
        <>
            <PageHeader title={team.name} />
            <div className="bg-neutral-950/50 border-b border-neutral-800">
              <div className="container mx-auto px-4 py-4 flex justify-end items-center">
                <FilterBar />
              </div>
            </div>
            <main className="container mx-auto px-4 py-8">
                 <h2 className="font-oswald text-3xl font-bold mb-6">ELENCO</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                    {players.map(player => <PlayerCard key={player.id} player={player} />)}
                </div>
            </main>
        </>
    )
};


const MatchDetailPage: React.FC = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const match = data.matches.find(m => m.id === matchId);

    if (!match) return <div className="text-center py-20">Jogo não encontrado.</div>;

    const homeTeam = data.teams.find(t => t.id === match.homeTeamId)!;
    const awayTeam = data.teams.find(t => t.id === match.awayTeamId)!;

    return (
       <>
         <div className="relative h-[60vh] bg-cover bg-center" style={{backgroundImage: 'url(https://picsum.photos/seed/arena/1600/900)'}}>
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="relative container mx-auto px-4 flex flex-col items-center justify-center h-full text-white">
                <div className="text-center mb-4">
                    <p>{data.competitions[0].name} {data.seasons[0].name} - {data.groups.find(g => g.id === match.groupId)?.name}</p>
                    <p>{data.rounds.find(r => r.id === match.roundId)?.name}</p>
                </div>
                <div className="flex items-center justify-center w-full max-w-4xl">
                    <div className="flex-1 flex flex-col items-center gap-4">
                        <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-24 h-24 md:w-32 md:h-32" />
                        <h2 className="font-oswald text-2xl md:text-4xl font-bold uppercase">{homeTeam.name}</h2>
                    </div>
                    <div className="px-8 text-center">
                        <p className="font-oswald text-6xl md:text-8xl font-bold tracking-wider">{match.scoreHome} - {match.scoreAway}</p>
                        {match.penaltiesHome !== undefined && (
                            <p className="text-yellow-300 text-lg">Pênaltis: {match.penaltiesHome} - {match.penaltiesAway}</p>
                        )}
                        <p className="text-lg mt-2 text-neutral-300">{match.status}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-4">
                        <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-24 h-24 md:w-32 md:h-32" />
                        <h2 className="font-oswald text-2xl md:text-4xl font-bold uppercase">{awayTeam.name}</h2>
                    </div>
                </div>
                <div className="text-center mt-6">
                    <p>{match.date}, {match.time}</p>
                    <p className="font-bold">{match.venue}</p>
                </div>
            </div>
         </div>
         <main className="container mx-auto px-4 py-12">
            <h3 className="font-oswald text-3xl font-bold text-center mb-8">LINHA DO TEMPO</h3>
            <div className="max-w-2xl mx-auto space-y-4">
                {match.events.map(event => (
                    <TimelineEvent key={event.id} event={event} homeTeamId={match.homeTeamId} />
                ))}
            </div>
         </main>
       </>
    );
};

// --- APP ---

const App: React.FC = () => {
    return (
        <div className="bg-black">
            <Marquee text="Federação Brasileira de Futebol - FBF25" />
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/classification" element={<ClassificationPage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/games/:matchId" element={<MatchDetailPage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/teams/:teamId" element={<TeamDetailPage />} />
                <Route path="/players" element={<PlayersPage />} />
                <Route path="/players/:playerId" element={<PlayerDetailPage />} />
                <Route path="/stats" element={<StatsPage />} />
                 <Route path="/prediction" element={<div className="text-center py-20">Página de Kings Prediction - Em breve</div>} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;