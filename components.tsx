import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Player, Team, Standing, Match, MatchStatus, PlayerRatings, PlayerSeasonStats } from './types';
import { data } from './data';

// --- ICONS ---
export const CalendarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

const LiveIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1" fill="currentColor" stroke="currentColor"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="9"/></svg>
);

const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);

export const ArrowLeftIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>
);
export const ArrowRightIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

// --- LAYOUT COMPONENTS ---
export const Marquee: React.FC<{ text: string }> = ({ text }) => {
    const repeatedText = Array(20).fill(text).join(' • ');
    return (
        <div className="bg-gradient-to-r from-green-500 via-yellow-400 to-blue-500 text-black font-oswald font-bold overflow-hidden whitespace-nowrap py-2 text-sm">
            <div className="animate-marquee">
                <span>{repeatedText}</span>
            </div>
        </div>
    );
};

export const Header: React.FC = () => {
    const navItems = [
        { name: 'CLASSIFICAÇÃO', path: '/classification' },
        { name: 'JOGOS', path: '/games' },
        { name: 'TIMES', path: '/teams' },
        { name: 'JOGADORES', path: '/players' },
        { name: 'ESTATÍSTICAS', path: '/stats' },
        { name: 'KINGS PREDICTION', path: '/prediction' },
    ];

    return (
        <header className="bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center space-x-3">
                        <img src="https://i.imgur.com/mAnT8S6.png" alt="Brasileirão FBF25 Logo" className="h-14 w-14" />
                        <span className="font-oswald text-xl font-bold tracking-wider text-white uppercase">BRASILEIRÃO <span className="bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text">FBF25</span></span>
                    </Link>
                    <nav className="hidden lg:flex items-center space-x-6 font-oswald text-sm font-medium tracking-widest">
                        {navItems.map(item => (
                            <NavLink key={item.name} to={item.path} className={({ isActive }) => `py-2 border-b-2 transition-colors duration-300 ${isActive ? 'border-green-400 text-green-400' : 'border-transparent text-gray-300 hover:text-white'}`}>
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 text-sm font-semibold text-white bg-green-600 px-3 py-2 rounded-md hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-500/20">
                            <LiveIcon className="w-4 h-4" />
                            <span>AO VIVO</span>
                        </button>
                        <button className="text-sm font-semibold text-white bg-neutral-800 px-3 py-2 rounded-md hover:bg-neutral-700 transition-colors">Ingressos</button>
                        <button className="text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-4 py-2 rounded-md transition-all">Loja</button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export const Footer: React.FC = () => (
    <footer className="w-full mt-10">
        <Marquee text="Federação Brasileira de Futebol - FBF25" />
    </footer>
);


export const PageHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="relative bg-neutral-900 overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 20px, #009c3b 20px, #009c3b 40px), repeating-linear-gradient(45deg, transparent, transparent 20px, #002776 20px, #002776 40px)' }}></div>
        <div 
            className="absolute inset-0 -skew-y-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-50"
        />
        <div className="relative container mx-auto px-4 z-10">
            <h1 className="text-5xl md:text-7xl font-oswald font-extrabold text-white uppercase tracking-widest" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>{title}</h1>
        </div>
    </div>
);

export const FilterBar: React.FC = () => (
    <div className="flex justify-end items-center space-x-2">
        <div className="relative">
            <select className="appearance-none bg-neutral-800 border border-neutral-700 text-white font-semibold py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all">
                <option>BRASILEIRÃO FBF25</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative">
            <select className="appearance-none bg-neutral-800 border border-neutral-700 text-white font-semibold py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all">
                <option>2025</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
    </div>
);

// --- UI COMPONENTS ---

const RatingBadge: React.FC<{ rating: number }> = ({ rating }) => {
    const getColor = () => {
        if (rating >= 85) return 'bg-gradient-to-br from-green-400 via-yellow-300 to-blue-400';
        if (rating >= 80) return 'bg-gradient-to-br from-green-400 to-green-600';
        if (rating >= 75) return 'bg-gradient-to-br from-blue-400 to-blue-600';
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
    };
    return (
        <div className={`absolute -top-2 -right-2 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-black font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${getColor()}`}>
            <span className="text-xs -mb-1 font-oswald uppercase">Média</span>
            <span className="text-3xl font-oswald">{rating}</span>
        </div>
    );
};

export const PlayerCard: React.FC<{ player: Player }> = ({ player }) => (
    <Link to={`/players/${player.id}`} className="block bg-neutral-900 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1">
        <div className="relative p-4">
             <div className="absolute inset-0 bg-neutral-800 opacity-20" style={{ backgroundImage: 'radial-gradient(#22c55e 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
            <div className="relative flex items-center space-x-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-neutral-700 group-hover:border-green-400 transition-colors">
                    <img src={player.photoUrl || 'https://via.placeholder.com/150'} alt={player.fullName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-oswald font-bold text-white">{player.fullName}</h3>
                    <p className="text-neutral-400">{player.position}</p>
                    <img src={data.teams.find(t => t.id === player.teamId)?.logoUrl} alt="Team Logo" className="w-8 h-8 mt-2" />
                </div>
                <RatingBadge rating={player.ratings.average} />
            </div>
        </div>
        <div className="bg-neutral-800/50 p-3 grid grid-cols-5 gap-2 text-center text-xs">
            <div><p className="font-bold text-lg">{player.stats.matches}</p><p className="text-neutral-400">Jogos</p></div>
            <div><p className="font-bold text-lg">{player.stats.goals}</p><p className="text-neutral-400">Gols</p></div>
            <div><p className="font-bold text-lg">{player.stats.assists}</p><p className="text-neutral-400">Assist.</p></div>
            <div><p className="font-bold text-lg">{player.stats.yellowCards}</p><p className="text-neutral-400">Amarelos</p></div>
            <div><p className="font-bold text-lg">{player.stats.redCards}</p><p className="text-neutral-400">Vermelhos</p></div>
        </div>
    </Link>
);


export const TeamCard: React.FC<{ team: Team }> = ({ team }) => (
    <Link to={`/teams/${team.id}`} className="relative bg-neutral-900 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0"></div>
        <img src={`https://picsum.photos/seed/${team.id}/400/200`} alt={team.name} className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"/>
        <div className="absolute bottom-0 left-0 p-4 w-full flex items-end justify-between">
            <div>
                <h3 className="text-xl font-oswald font-bold text-white">{team.name}</h3>
                <p className="text-neutral-300 text-sm">{team.manager}</p>
            </div>
             <img src={team.logoUrl} alt={`${team.name} Logo`} className="w-16 h-16 rounded-full border-2 border-neutral-700 bg-neutral-800 group-hover:border-green-500 transition-colors"/>
        </div>
    </Link>
);


const MatchStatusBadge: React.FC<{ status: MatchStatus }> = ({ status }) => {
    const styles = {
        [MatchStatus.SCHEDULED]: 'bg-blue-500/20 text-blue-300',
        [MatchStatus.LIVE]: 'bg-green-500/20 text-green-300 animate-pulse',
        [MatchStatus.FINISHED]: 'bg-gray-500/20 text-gray-400',
    };
    const text = {
        [MatchStatus.SCHEDULED]: 'Agendado',
        [MatchStatus.LIVE]: 'Ao Vivo',
        [MatchStatus.FINISHED]: 'Finalizado',
    };
    return <span className={`px-2 py-1 text-xs font-bold rounded ${styles[status]}`}>{text[status]}</span>;
};


export const MatchListItem: React.FC<{ match: Match }> = ({ match }) => {
    const homeTeam = data.teams.find(t => t.id === match.homeTeamId);
    const awayTeam = data.teams.find(t => t.id === match.awayTeamId);
    if (!homeTeam || !awayTeam) return null;

    return (
        <Link to={`/games/${match.id}`} className="grid grid-cols-12 items-center gap-4 py-4 px-6 bg-neutral-900 rounded-xl hover:bg-neutral-800/80 transition-all duration-300 border border-neutral-800 hover:border-green-400 hover:scale-[1.02]">
            <div className="col-span-2 text-neutral-400 text-sm">
                <p>{match.date}</p>
                <p className="font-bold text-white">{match.time}</p>
            </div>
            <div className="col-span-8 flex items-center justify-center gap-4">
                <div className="flex-1 flex items-center justify-end gap-3">
                    <span className="hidden md:inline font-oswald text-xl font-bold text-right">{homeTeam.name.toUpperCase()}</span>
                    <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-12 h-12" />
                </div>
                <div className="text-center">
                    <div className="font-oswald text-4xl font-bold tracking-wider">
                        <span>{match.status !== MatchStatus.SCHEDULED ? match.scoreHome : '-'}</span>
                        <span className="mx-2 text-neutral-600">vs</span>
                        {/* Fix: Corrected typo from `Match-stateless.SCHEDULED` to `MatchStatus.SCHEDULED`. */}
                        <span>{match.status !== MatchStatus.SCHEDULED ? match.scoreAway : '-'}</span>
                    </div>
                    {match.penaltiesHome !== undefined && match.penaltiesAway !== undefined && (
                        <div className="text-xs text-yellow-300 -mt-1">
                            Pênaltis: {match.penaltiesHome} - {match.penaltiesAway}
                        </div>
                    )}
                </div>
                <div className="flex-1 flex items-center justify-start gap-3">
                    <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-12 h-12" />
                    <span className="hidden md:inline font-oswald text-xl font-bold">{awayTeam.name.toUpperCase()}</span>
                </div>
            </div>
            <div className="col-span-1 text-center">
                <MatchStatusBadge status={match.status} />
            </div>
            <div className="col-span-1 text-center">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-black font-bold text-xs w-8 h-8 flex items-center justify-center rounded-md">{data.groups.find(g => g.id === match.groupId)?.name.split(' ')[1]}</div>
            </div>
        </Link>
    );
};


export const StandingsTable: React.FC<{ standings: Standing[], teams: Team[] }> = ({ standings, teams }) => {
    const headers = ["POSIC", "TIME", "PTS", "PJ", "V", "VP", "DP", "D", "GP", "GC", "SG"];
    return (
        <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800">
            <table className="w-full text-sm text-left">
                <thead className="bg-neutral-800 text-xs text-neutral-400 uppercase font-oswald">
                    <tr>
                        {headers.map(h => <th key={h} scope="col" className={`px-4 py-3 ${h === 'TIME' ? 'text-left' : 'text-center'}`}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {standings.map((s, index) => {
                        const team = teams.find(t => t.id === s.teamId);
                        if (!team) return null;
                        return (
                            <tr key={team.id} className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/50 transition-colors duration-200">
                                <td className="px-4 py-4 text-center">
                                    <span className={`w-7 h-7 flex items-center justify-center rounded-md font-bold ${index < 4 ? 'bg-green-500 text-black' : 'bg-neutral-700 text-white'}`}>{s.position}</span>
                                </td>
                                <th scope="row" className="px-4 py-4 font-medium text-white whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <img src={team.logoUrl} alt={team.name} className="w-8 h-8" />
                                        <span>{team.name}</span>
                                    </div>
                                </th>
                                <td className="px-4 py-4 text-center font-bold text-xl">{s.pts}</td>
                                <td className="px-4 py-4 text-center">{s.pj}</td>
                                <td className="px-4 py-4 text-center">{s.v}</td>
                                <td className="px-4 py-4 text-center">{s.vp}</td>
                                <td className="px-4 py-4 text-center">{s.dp}</td>
                                <td className="px-4 py-4 text-center">{s.d}</td>
                                <td className="px-4 py-4 text-center">{s.gp}</td>
                                <td className="px-4 py-4 text-center">{s.gc}</td>
                                <td className="px-4 py-4 text-center">{s.sg}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export const CompactStandingsTable: React.FC<{ standings: Standing[], teams: Team[] }> = ({ standings, teams }) => {
    const headers = ["TIME", "PTS", "PJ", "SG"];

    const getRowColor = (position: number) => {
        if (position <= 2) return '#22c55e'; // Green
        if (position >= 7) return '#ef4444'; // Red
        return '#eab308'; // Yellow
    };
    
    return (
        <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
            <table className="w-full text-sm">
                <thead className="bg-neutral-800 text-xs text-neutral-400 uppercase font-oswald">
                    <tr>
                        <th scope="col" className="px-2 py-3 text-center">POS</th>
                        {headers.map(h => <th key={h} scope="col" className={`px-2 py-3 ${h === 'TIME' ? 'text-left' : 'text-center'}`}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {standings.map((s) => {
                        const team = teams.find(t => t.id === s.teamId);
                        if (!team) return null;
                        
                        return (
                            <tr key={team.id} className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/50 transition-colors duration-200">
                                <td className="px-2 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-1 h-4 rounded-full" style={{ background: getRowColor(s.position) }}></div>
                                        <span className="font-bold">{s.position}</span>
                                    </div>
                                </td>
                                <th scope="row" className="px-2 py-3 font-medium text-white whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <img src={team.logoUrl} alt={team.name} className="w-6 h-6" />
                                        <span>{team.name}</span>
                                    </div>
                                </th>
                                <td className="px-2 py-3 text-center font-bold text-lg">{s.pts}</td>
                                <td className="px-2 py-3 text-center">{s.pj}</td>
                                <td className="px-2 py-3 text-center">{s.sg}</td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot className="text-xs text-neutral-400">
                    <tr>
                        <td colSpan={5} className="px-3 py-3">
                            <div className="flex items-center justify-center space-x-4">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span>Eliminatórias: Semi-Final</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span>Neutro</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span>Trocados de time</span></div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};


export const StatsHighlightCard: React.FC<{
    title: string;
    players: (Player & { statValue: number })[];
    metricLabel: string;
    isMvp?: boolean;
}> = ({ title, players, metricLabel, isMvp = false }) => {
    const topPlayer = players[0];

    return (
        <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 group relative p-4 flex flex-col h-full hover:shadow-2xl hover:shadow-green-500/10 transition-shadow duration-300">
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500" 
                style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(34, 197, 94, 0.5) 10px, rgba(34, 197, 94, 0.5) 20px)',
                    animation: 'slide 20s linear infinite'
                }}>
            </div>
            
            <div className="relative z-10 flex-grow flex flex-col">
                <h3 className="font-oswald text-xl font-bold text-center bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text uppercase tracking-widest">{title}</h3>
                
                {topPlayer && (
                    <div className="flex-grow flex items-center justify-center my-4">
                        <div className="relative w-40 h-40">
                             {isMvp && <h4 className="absolute -left-8 top-1/2 -translate-y-1/2 font-oswald text-6xl font-extrabold uppercase -rotate-90 text-white/80 tracking-widest">MVP</h4>}
                            <img src={topPlayer.photoUrl} alt={topPlayer.fullName} className="w-full h-full object-contain drop-shadow-lg"/>
                        </div>
                    </div>
                )}

                <div className="mt-auto">
                    <ul className="space-y-1">
                       {players.map((p, index) => (
                           <li key={p.id} className={`flex items-center justify-between p-2 rounded-md ${index === 0 ? 'bg-neutral-800/70' : ''}`}>
                               <div className="flex items-center gap-2">
                                   <img src={data.teams.find(t => t.id === p.teamId)?.logoUrl} alt="team logo" className="w-5 h-5"/>
                                   <span className="font-semibold text-sm">{p.fullName}</span>
                               </div>
                               <span className="font-oswald font-bold text-lg">{p.statValue}</span>
                           </li>
                       ))}
                    </ul>
                </div>
            </div>
            <Link to="/stats" className="text-center text-xs text-neutral-400 mt-4 hover:text-yellow-300 transition-colors">Ver mais</Link>
        </div>
    );
};


export const TeamStatsTable: React.FC<{ teams: Team[] }> = ({ teams }) => {
    const headers = ["RANKING", "TIME", "J", "GT", "GX(2)", "PEN%", "PEN(T)", "PSO(T)", "%PSO(I)"];
    const sortedTeams = [...teams].sort((a, b) => b.stats.gt - a.stats.gt);

    return (
        <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800">
            <table className="w-full text-sm text-left">
                <thead className="bg-neutral-800 text-xs text-neutral-400 uppercase font-oswald">
                    <tr>
                        {headers.map(h => <th key={h} scope="col" className={`px-4 py-3 ${h === 'TIME' ? 'text-left' : 'text-center'}`}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {sortedTeams.map((team, index) => (
                        <tr key={team.id} className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/50 transition-colors duration-200">
                            <td className="px-4 py-4 text-center">
                                <span className="w-7 h-7 flex items-center justify-center rounded-md font-bold bg-neutral-700 text-white">{index + 1}</span>
                            </td>
                            <th scope="row" className="px-4 py-4 font-medium text-white whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                    <img src={team.logoUrl} alt={team.name} className="w-8 h-8" />
                                    <span>{team.name}</span>
                                </div>
                            </th>
                            <td className="px-4 py-4 text-center">{team.stats.pj}</td>
                            <td className="px-4 py-4 text-center font-bold text-yellow-300 text-base">{team.stats.gt}</td>
                            <td className="px-4 py-4 text-center">{team.stats.gx2}</td>
                            <td className="px-4 py-4 text-center">{team.stats.penPercent.toFixed(2)}</td>
                            <td className="px-4 py-4 text-center">{team.stats.penT}</td>
                            <td className="px-4 py-4 text-center">{team.stats.psoT}</td>
                            <td className="px-4 py-4 text-center">{team.stats.psoPercent.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export const PlayerDetailStatGrid: React.FC<{ ratings: PlayerRatings, stats: PlayerSeasonStats }> = ({ ratings, stats }) => {
    const ratingItems = [
        { label: 'Físico', value: ratings.fisico },
        { label: 'Duelos', value: ratings.duelos },
        { label: 'Chute ao gol', value: ratings.chuteAoGol },
        { label: 'Defesa', value: ratings.defesa },
        { label: 'Passe', value: ratings.passe },
        { label: 'Habilidade', value: ratings.habilidade },
    ];
    const statItems = [
        { label: 'MVP Jogo', value: stats.mvpMatches },
        { label: 'MVP Rodada', value: 0 },
        { label: 'Gols', value: stats.goals },
        { label: 'Assistências', value: stats.assists },
        { label: 'Cartões amarelos', value: stats.yellowCards },
        { label: 'Cartões vermelhos', value: stats.redCards },
        { label: 'Gols duplos', value: stats.golsDuplos },
    ];

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {ratingItems.map(item => (
                    <div key={item.label} className="bg-neutral-800 p-4 rounded-lg text-center border border-neutral-700 transition-all hover:border-green-500 hover:-translate-y-1">
                        <p className="text-neutral-400 text-sm">{item.label}</p>
                        <p className="text-4xl font-oswald font-bold">{item.value}</p>
                    </div>
                ))}
            </div>
            <h3 className="font-oswald text-2xl font-bold uppercase mb-4">Temporada</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                 {statItems.map(item => (
                    <div key={item.label} className="bg-neutral-800 p-4 rounded-lg text-center border border-neutral-700 transition-all hover:border-blue-500 hover:-translate-y-1">
                        <p className="text-neutral-400 text-sm h-10 flex items-center justify-center">{item.label}</p>
                        <p className="text-4xl font-oswald font-bold">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const CarouselMatchCard: React.FC<{ match: Match }> = ({ match }) => {
    const homeTeam = data.teams.find(t => t.id === match.homeTeamId)!;
    const awayTeam = data.teams.find(t => t.id === match.awayTeamId)!;
    const isLive = match.status === MatchStatus.LIVE;

    const TeamRow = ({team, score}: {team: Team, score: number | string}) => (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={team.logoUrl} alt={team.name} className="w-8 h-8"/>
                <span className="font-oswald font-bold">{team.name.substring(0, 3).toUpperCase()}</span>
            </div>
            <span className="font-oswald text-xl font-bold">{score}</span>
        </div>
    );
    
    return (
        <Link to={`/games/${match.id}`} 
              className={`block bg-neutral-800 border border-neutral-700 rounded-xl p-3 group hover:border-green-400 transition-all duration-300 w-full ${isLive ? 'border-2 border-green-500 shadow-lg shadow-green-500/10' : ''}`}
        >
            <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                <span>{match.time} BRA</span>
                <span className={`border ${isLive ? 'border-green-500 text-green-400' : 'border-green-400 text-green-400'} px-1.5 rounded text-[10px] font-bold`}>{data.groups.find(g => g.id === match.groupId)?.name.split(' ')[1]}</span>
            </div>
            <div className="space-y-2">
                <TeamRow team={homeTeam} score={match.status !== MatchStatus.SCHEDULED ? match.scoreHome : '-'} />
                <TeamRow team={awayTeam} score={match.status !== MatchStatus.SCHEDULED ? match.scoreAway : '-'} />
            </div>
        </Link>
    );
};