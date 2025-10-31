
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Player, Team, Standing, Match, MatchStatus, PlayerRatings, PlayerSeasonStats, UserRole, LeagueData } from './types';
import { useAuth } from './App';
import { useLeagueData } from './App';

// --- ICONS ---
// FIX: Corrected the viewBox attribute from '0 0 24" 24"' to '0 0 24 24'.
export const CalendarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

// FIX: Corrected the viewBox attribute from '0 0 24" 24"' to '0 0 24 24'.
const LiveIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1" fill="currentColor" stroke="currentColor"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="9"/></svg>
);

// FIX: Corrected the viewBox attribute from '0 0 24" 24"' to '0 0 24 24'.
export const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);

// FIX: Corrected the viewBox attribute from '0 0 24" 24"' to '0 0 24 24'.
export const ArrowLeftIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>
);
// FIX: Corrected the viewBox attribute from '0 0 24" 24"' to '0 0 24 24'.
export const ArrowRightIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

export const SearchIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

export const LightningIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

export const PlayIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M8 5v14l11-7z"/></svg>
);

export const SettingsIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

export const XIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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

export const Header: React.FC<{ onOpenAdminPanel: () => void }> = ({ onOpenAdminPanel }) => {
    const { currentUser, logout } = useAuth();

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
                        {currentUser && currentUser.role === UserRole.ADMIN && (
                            <button
                                onClick={onOpenAdminPanel}
                                className="flex items-center space-x-2 text-sm font-semibold text-white bg-yellow-600 px-3 py-2 rounded-md hover:bg-yellow-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-yellow-500/20"
                                aria-label="Painel de Admin"
                            >
                                <SettingsIcon className="w-4 h-4" />
                                <span>Painel de Admin</span>
                            </button>
                        )}
                        {currentUser ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-semibold text-white">Olá, {currentUser.username}</span>
                                <button onClick={logout} className="text-sm font-semibold text-white bg-neutral-800 px-3 py-2 rounded-md hover:bg-neutral-700 transition-colors">Sair</button>
                            </div>
                        ) : (
                             <Link to="/login" className="text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-4 py-2 rounded-md transition-all">
                                Entrar
                            </Link>
                        )}
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
        <div className="bg-neutral-800 border border-neutral-700 text-white font-semibold py-2 px-4 rounded-md">
            BRASILEIRÃO FBF25
        </div>
        <div className="relative">
            <select className="appearance-none bg-neutral-800 border border-neutral-700 text-white font-semibold py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all">
                <option>Season 1</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
    </div>
);

// --- UI COMPONENTS ---

export const PresidentCard: React.FC<{ team: Team }> = ({ team }) => {
    if (!team.keyPeople || !team.cardImageUrl) {
        return null;
    }

    const gradient = team.cardGradient || 'from-neutral-500 to-neutral-700';
    const accentBorderColor = gradient.split(' ')[0].replace('from-', 'border-');

    return (
        <div className={`relative bg-neutral-900 rounded-lg overflow-hidden border-2 ${accentBorderColor}/50 h-full`}>
            <img 
                src={team.cardImageUrl} 
                alt={team.keyPeople} 
                className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                <h3 className="text-3xl font-oswald font-bold text-white leading-tight">{team.keyPeople}</h3>
                <p className="text-neutral-300">Presid.</p>
            </div>
        </div>
    );
};

export const PlayerCard: React.FC<{ player: Player; team: Team }> = ({ player, team }) => {
    if (player.position === 'Treinador') {
        const gradient = team.cardGradient || 'from-neutral-500 to-neutral-700';
        const gradientStyle = team.colors?.length ? { background: `linear-gradient(to bottom right, ${team.colors.join(', ')})` } : {};

        return (
             <div className="relative group rounded-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`absolute inset-0 bg-neutral-800 group-hover:bg-gradient-to-br ${gradient} rounded-lg transition-all duration-300`} style={gradientStyle}></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300`} style={gradientStyle}></div>
                <div className="relative block bg-neutral-900 rounded-[7px] m-0.5">
                    <div className="p-3">
                        <div className="flex items-center gap-3 min-h-[105px]">
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-neutral-800">
                                <div className="w-full h-full flex items-center justify-center bg-neutral-900/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-neutral-700" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                </div>
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg font-oswald font-bold text-white leading-tight">{player.fullName}</h3>
                                <p className="text-neutral-400 text-sm">{player.position}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const statsToShow = player.position === 'Goleiro' ? [
        { label: 'Jogos', value: player.stats.matches },
        { label: 'Gols sofrid.', value: player.stats.saves },
        { label: 'Proporção', value: player.stats.matches > 0 ? (player.stats.saves / player.stats.matches).toFixed(2) : '0.00' },
        { label: 'Amarelos', value: player.stats.yellowCards },
        { label: 'Vermelhos', value: player.stats.redCards }
    ] : [
        { label: 'Jogos', value: player.stats.matches },
        { label: 'Gols', value: player.stats.goals },
        { label: 'Assist.', value: player.stats.assists },
        { label: 'Amarelos', value: player.stats.yellowCards },
        { label: 'Vermelhos', value: player.stats.redCards }
    ];

    return (
        <div className="relative group rounded-lg transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-neutral-800 group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:via-yellow-400 group-hover:to-blue-500 rounded-lg transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-yellow-400 to-blue-500 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

            <Link
                to={`/players/${player.id}`}
                className="relative block bg-neutral-900 rounded-[7px] m-0.5"
            >
                <div className="p-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-neutral-800">
                                <img
                                    src={player.photoUrl || 'https://via.placeholder.com/150'}
                                    alt={player.fullName}
                                    className="w-full h-full object-cover object-top relative z-10"
                                />
                                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs font-bold px-1 rounded z-20">#{player.number}</div>
                            </div>
                            
                            <div className="pt-1">
                                <h3 className="text-lg font-oswald font-bold text-white leading-tight">{player.fullName}</h3>
                                <p className="text-neutral-400 text-sm">{player.position}</p>
                            </div>
                        </div>

                        <div className="flex items-center flex-shrink-0 gap-2">
                            <img src={team.logoUrl} alt={`${team.name} logo`} className="w-9 h-9 opacity-90 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="text-center shadow-lg w-16 bg-gradient-to-br from-green-500/80 via-yellow-400/80 to-blue-500/80 rounded-md p-0.5">
                                <div className="bg-neutral-900 rounded-[5px] py-0.5">
                                    <p className="text-[10px] font-bold uppercase text-neutral-300">Média</p>
                                    <p className="text-xl font-oswald font-bold leading-none bg-gradient-to-br from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text">
                                        {player.ratings.average > 0 ? player.ratings.average : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 mt-3 text-center">
                        {statsToShow.map(stat => (
                            <div key={stat.label} className="bg-neutral-800/50 p-1 rounded-md">
                                <p className="text-[10px] text-neutral-400">{stat.label}</p>
                                <p className="font-oswald font-bold text-base text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Link>
        </div>
    );
};


export const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
  const gradient = team.cardGradient || 'from-neutral-500 to-neutral-700';
  const gradientStyle = team.colors?.length ? { background: `linear-gradient(to bottom right, ${team.colors.join(', ')})` } : {};

  return (
    <Link to={`/teams/${team.id}`} className="relative bg-neutral-900 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ease-in-out">
      {/* Background Image */}
      <img src={team.cardImageUrl || `https://source.unsplash.com/random/400x200?stadium,${team.id}`} alt={team.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"/>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10"></div>

      {/* Diagonal Color Shape */}
      <div 
        className={`absolute inset-y-0 left-0 w-2/5 bg-gradient-to-br ${gradient} transition-all duration-500 ease-in-out group-hover:w-1/2`}
        style={{ clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0% 100%)', ...gradientStyle }}
      ></div>

      <div className="relative flex items-center h-48 px-6">
        {/* Logo */}
        <div className="w-1/3 flex-shrink-0">
            <img 
                src={team.logoUrl} 
                alt={`${team.name} Logo`} 
                className="w-24 h-24 drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
            />
        </div>

        {/* Text Info */}
        <div className="w-2/3 pl-4">
            <h3 className="text-2xl font-oswald font-bold text-white leading-tight">{team.name}</h3>
            <p className="text-neutral-300 text-sm mt-1">{team.keyPeople}</p>
        </div>
      </div>
       <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-current transition-all duration-300 ${gradient.replace('from-', 'text-').split(' ')[0]}`}
         style={{
             boxShadow: '0 0 0 0 transparent',
             transition: 'box-shadow 0.3s ease-in-out',
             color: team.colors ? team.colors[0] : 'currentColor'
         }}
      ></div>
       <style>{`
        .group:hover .${gradient.replace('from-', 'text-').split(' ')[0]} {
            box-shadow: 0 0 25px -5px ${team.colors ? team.colors[0] : 'var(--tw-shadow-color)'};
        }
      `}</style>
    </Link>
  );
};



export const MatchListItem: React.FC<{ match: Match, teams: Team[] }> = ({ match, teams }) => {
    const homeTeam = teams.find(t => t.id === match.homeTeamId);
    const awayTeam = teams.find(t => t.id === match.awayTeamId);
    if (!homeTeam || !awayTeam) return null;

    let winner: 'home' | 'away' | 'tie' | 'none' = 'none';

    if (match.status === MatchStatus.FINISHED) {
        if (match.scoreHome > match.scoreAway) {
            winner = 'home';
        } else if (match.scoreAway > match.scoreHome) {
            winner = 'away';
        } else if (match.penaltiesHome !== undefined && match.penaltiesAway !== undefined) {
             if (match.penaltiesHome > match.penaltiesAway) {
                winner = 'home';
            } else if (match.penaltiesAway > match.penaltiesHome) {
                winner = 'away';
            } else {
                winner = 'tie';
            }
        } else {
            winner = 'tie';
        }
    }
    
    const statusText = {
        [MatchStatus.SCHEDULED]: 'Agendado',
        [MatchStatus.LIVE]: 'Ao Vivo',
        [MatchStatus.FINISHED]: 'Finalizado',
    };

    return (
        <Link 
            to={`/games/${match.id}`} 
            className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_5fr_1fr] items-center gap-4 py-3 px-4 bg-neutral-900 rounded-lg hover:bg-neutral-800/80 transition-all duration-300 border border-neutral-800 hover:border-green-400 ${match.id === 'm-img-5' ? 'border-green-500' : ''}`}
        >
            {/* Date & Time */}
            <div className="text-neutral-400 text-sm font-medium">{new Date(match.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
            <div className="text-neutral-400 text-sm font-medium">{match.time}</div>

            {/* Game */}
            <div className="flex items-center justify-center gap-2">
                <div className="flex-1 flex items-center justify-end gap-3">
                    <span className={`font-oswald text-base font-semibold text-right ${winner === 'home' ? 'text-green-400' : 'text-neutral-300'}`}>{homeTeam.name.toUpperCase()}</span>
                    <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-8 h-8" />
                </div>
                <div className="text-center">
                    <div className="font-oswald text-2xl font-bold tracking-wider flex items-center">
                        <span className={`${winner === 'home' ? 'text-green-400' : 'text-neutral-400'}`}>{match.status !== MatchStatus.SCHEDULED ? match.scoreHome : '-'}</span>
                        <span className="mx-2 text-neutral-500 text-sm font-normal">VS</span>
                        <span className={`${winner === 'away' ? 'text-green-400' : 'text-neutral-400'}`}>{match.status !== MatchStatus.SCHEDULED ? match.scoreAway : '-'}</span>
                    </div>
                     {match.penaltiesHome !== undefined && match.penaltiesAway !== undefined && winner !== 'none' && (
                        <div className="text-xs text-green-400 -mt-1 font-semibold">
                           ({match.penaltiesHome}) - ({match.penaltiesAway})
                        </div>
                    )}
                </div>
                <div className="flex-1 flex items-center justify-start gap-3">
                    <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-8 h-8" />
                    <span className={`font-oswald text-base font-semibold ${winner === 'away' ? 'text-green-400' : 'text-neutral-300'}`}>{awayTeam.name.toUpperCase()}</span>
                </div>
            </div>
            
            {/* Status */}
            <div className="text-center text-sm text-neutral-300">
                {statusText[match.status]}
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

const StandingsGroupTable: React.FC<{ title?: string, letter?: string, standings: Standing[], teams: Team[] }> = ({ title, letter, standings, teams }) => {
    const headers = ["POSIÇ.", "TIME", "PTS", "PJ", "SG"];
    return (
        <div className="bg-[#1C1C1C] rounded-lg overflow-hidden border border-neutral-800">
            {title && letter && (
                <div className="flex justify-between items-center px-3 py-2 bg-[#111]">
                    <h3 className="font-oswald uppercase text-sm font-semibold">{title}</h3>
                    <div className="bg-gradient-to-r from-green-500 via-yellow-400 to-blue-500 w-5 h-5 flex items-center justify-center font-bold text-xs text-black rounded-sm">{letter}</div>
                </div>
            )}
            <table className="w-full text-xs">
                <thead>
                    <tr className="text-neutral-500 font-oswald uppercase">
                        {headers.map(h => <th key={h} className={`py-2 font-normal ${h === 'TIME' ? 'text-left px-1' : 'text-center'}`}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {standings.map(s => {
                        const team = teams.find(t => t.id === s.teamId);
                        if (!team) return null;
                        const posColor = s.position <= 2 ? 'bg-green-500' : s.position <= 4 ? 'bg-yellow-500' : 'bg-transparent';
                        return (
                            <tr key={s.teamId} className="border-t border-neutral-800">
                                <td className="py-2 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="font-bold">{s.position}</span>
                                        <div className={`w-1 h-3 rounded-full ${posColor}`}></div>
                                    </div>
                                </td>
                                <td className="px-1 py-2">
                                    <div className="flex items-center gap-2">
                                        <img src={team.logoUrl} alt={team.name} className="w-5 h-5"/>
                                        <span className="font-semibold text-white">{team.name}</span>
                                    </div>
                                </td>
                                <td className="py-2 text-center font-bold text-white">{s.pts}</td>
                                <td className="py-2 text-center text-neutral-400">{s.pj}</td>
                                <td className="py-2 text-center text-neutral-400">{s.sg}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
};

export const ClassificationPanel: React.FC<{standingsA: Standing[], standingsB: Standing[], teams: Team[]}> = ({standingsA, standingsB, teams}) => {
    const unifiedStandings = [...standingsA, ...standingsB]
        .sort((a, b) => {
            if (a.pts !== b.pts) return b.pts - a.pts;
            if (a.sg !== b.sg) return b.sg - a.sg;
            if (a.gp !== b.gp) return b.gp - a.gp;
            return a.teamId.localeCompare(b.teamId);
        })
        .map((standing, index) => ({ ...standing, position: index + 1 }));

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-oswald text-xl font-bold uppercase">Classificação</h2>
                <Link to="/classification" className="text-xs text-neutral-400 hover:text-yellow-300 transition-colors">Ver mais</Link>
            </div>
            <div className="space-y-4">
                <StandingsGroupTable standings={unifiedStandings} teams={teams} />
            </div>
        </div>
    );
};

export const StatsCard: React.FC<{
    title: string;
    players: { player: Player; value: number | string | {yellow: number, red: number} }[];
    teams: Team[];
    type?: 'mvp' | 'default' | 'defesas';
    round?: number;
}> = ({ title, players, teams, type = 'default', round }) => {
    
    const mainPlayer = players[0]?.player;

    const bgGradient = `repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 10px,
        rgba(5, 150, 105, 0.08) 10px,
        rgba(5, 150, 105, 0.08) 20px
      ),
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(2, 132, 199, 0.08) 10px,
        rgba(2, 132, 199, 0.08) 20px
      )`;

    return (
        <div className="bg-[#1A1A1A] rounded-md overflow-hidden border border-neutral-800 group relative flex flex-col h-[400px]">
            <div className="absolute inset-0 opacity-50" style={{backgroundImage: bgGradient}}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            <div className="relative z-10 flex flex-col h-full p-4">
                {type === 'mvp' && (
                    <div className="absolute top-4 left-2 flex items-center">
                        <div className="[writing-mode:vertical-lr] transform rotate-180 font-oswald uppercase">
                           <span className="font-semibold text-white text-3xl tracking-widest">Rodada</span>
                           <span className="font-extrabold text-7xl bg-gradient-to-b from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text ml-2">MVP</span>
                        </div>
                    </div>
                )}
                
                {mainPlayer && (
                     <div className="flex-grow flex items-end justify-center">
                        <img 
                            src={type === 'defesas' ? 'https://i.imgur.com/pElM832.png' : mainPlayer.photoUrl} 
                            alt={mainPlayer.fullName} 
                            className="max-h-[280px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                )}

                <div className="mt-auto">
                    {type !== 'mvp' && (
                         <h3 className={`font-oswald text-xl font-bold text-center bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text uppercase tracking-widest mb-3`}>{title}</h3>
                    )}
                   
                    <div className="space-y-1.5">
                        {players.map((p, index) => {
                            const team = teams.find(t => t.id === p.player.teamId);
                            if (type === 'mvp' && index > 0) return null;
                            const statLabel = title === 'Máximo Assistente' ? 'Assist.' : title === 'Drible' ? 'Drib.' : 'Gols';

                            return (
                               <div key={p.player.id} className={`flex items-center justify-between p-2 rounded-md bg-black/40 backdrop-blur-sm`}>
                                   <div className="flex items-center gap-2">
                                       {team ? <img src={team.logoUrl} alt={team.name} className="w-5 h-5"/> : <div className="w-5 h-5 bg-neutral-700 rounded-full"></div>}
                                       <span className="font-semibold text-sm text-white">{p.player.fullName}</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                       {typeof p.value === 'object' && p.value !== null && 'yellow' in p.value ? (
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-oswald font-bold text-lg text-white">{p.value.yellow}</span>
                                                <div className="w-2.5 h-3.5 bg-yellow-400 rounded-sm"></div>
                                                <span className="font-oswald font-bold text-lg text-white">{p.value.red}</span>
                                                <div className="w-2.5 h-3.5 bg-red-500 rounded-sm"></div>
                                            </div>
                                       ) : (
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-oswald font-bold text-lg text-white w-6 text-right">{String(p.value)}</span>
                                                {type === 'default' && <span className="text-xs text-neutral-400">{statLabel}</span>}
                                            </div>
                                       )}
                                   </div>
                               </div>
                           );
                        })}
                    </div>
                     <Link to="/stats" className="block text-center text-xs text-neutral-500 hover:text-yellow-300 transition-colors pt-3">Ver mais</Link>
                </div>
            </div>
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

const CarouselMatchCard: React.FC<{ match: Match; teams: Team[] }> = ({ match, teams }) => {
    const homeTeam = teams.find(t => t.id === match.homeTeamId);
    const awayTeam = teams.find(t => t.id === match.awayTeamId);
    if (!homeTeam || !awayTeam) return null;

    let homeWinner = match.status === MatchStatus.FINISHED && (match.scoreHome > match.scoreAway || (match.scoreHome === match.scoreAway && (match.penaltiesHome || 0) > (match.penaltiesAway || 0)));
    let awayWinner = match.status === MatchStatus.FINISHED && (match.scoreAway > match.scoreHome || (match.scoreAway === match.scoreHome && (match.penaltiesAway || 0) > (match.penaltiesHome || 0)));

    const date = new Date(match.date);
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;

    return (
        <Link
            to={`/games/${match.id}`}
            className={`
                relative bg-[#1C1C1C] rounded-lg p-3 w-[240px] h-auto
                flex-shrink-0 flex flex-col justify-between
                border-2 border-transparent
                transition-all duration-300 group
                hover:border-yellow-400
                ${match.status === MatchStatus.LIVE ? 'border-green-500' : ''}
            `}
        >
            <div className="text-center text-xs text-green-400 font-semibold mb-2 pb-2 border-b border-neutral-800">
                <span>{formattedDate} - {match.time} BRA</span>
            </div>

            <div className="flex items-stretch justify-between gap-3">
                 <div className="flex-1 flex flex-col justify-around space-y-2">
                    {/* Team Info Section */}
                    <div className="flex items-center justify-between">
                        <span className="font-oswald font-bold text-lg text-white w-12">{homeTeam.name.substring(0,3).toUpperCase()}</span>
                        <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-8 h-8"/>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-oswald font-bold text-lg text-white w-12">{awayTeam.name.substring(0,3).toUpperCase()}</span>
                        <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-8 h-8"/>
                    </div>
                 </div>
                 <div className="w-16 bg-[#111] rounded-md flex flex-col items-center justify-center p-2 space-y-1">
                    {/* Score Section */}
                     <div className={`font-oswald font-bold text-2xl ${homeWinner ? 'text-yellow-400' : 'text-white'}`}>
                         {match.status !== MatchStatus.SCHEDULED ? match.scoreHome : '-'}
                     </div>
                     <div className={`font-oswald font-bold text-2xl ${awayWinner ? 'text-yellow-400' : 'text-white'}`}>
                         {match.status !== MatchStatus.SCHEDULED ? match.scoreAway : '-'}
                     </div>
                 </div>
            </div>
        </Link>
    );
};

export const MatchesCarousel: React.FC<{ allMatches?: Match[], allRounds?: any[], allTeams?: Team[], teamMatches?: Match[] }> = ({ allMatches = [], allRounds = [], allTeams = [], teamMatches }) => {
    const isTeamMode = teamMatches !== undefined;

    const rounds = !isTeamMode ? [...new Set(allMatches.map(m => m.roundNumber).filter(Boolean) as number[])].sort((a, b) => a - b) : [];
    const [activeRoundIndex, setActiveRoundIndex] = useState(!isTeamMode ? (rounds.findIndex(r => allMatches.some(m => m.roundNumber === r && m.status === MatchStatus.LIVE)) ?? 0) : 0);
    const [animationClass, setAnimationClass] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    const handleNavigate = (direction: 'next' | 'prev') => {
        if (isAnimating || isTeamMode) return;
        setIsAnimating(true);
        setAnimationClass(direction === 'next' ? 'animate-slide-out-left' : 'animate-slide-out-right');
        setTimeout(() => {
            setActiveRoundIndex(prevIndex => (direction === 'next' ? (prevIndex + 1) % rounds.length : (prevIndex - 1 + rounds.length) % rounds.length));
            setAnimationClass(direction === 'next' ? 'animate-slide-in-from-right' : 'animate-slide-in-from-left');
            setTimeout(() => {
                setAnimationClass('');
                setIsAnimating(false);
            }, 300);
        }, 300);
    };

    const matchesToDisplay = isTeamMode
        ? teamMatches
        : allMatches.filter(m => m.roundNumber === rounds[activeRoundIndex]);

    const title = isTeamMode ? "Jogos do Time" : `Rodada ${rounds[activeRoundIndex]}`;

    if (!matchesToDisplay || matchesToDisplay.length === 0) {
        return (
             <div className="relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-oswald text-2xl font-bold uppercase">{title}</h2>
                </div>
                <div className="text-center py-10 bg-neutral-900 rounded-lg">
                    <p className="text-neutral-500">{isTeamMode ? "Nenhum jogo encontrado para este time." : "Nenhum jogo encontrado para esta rodada."}</p>
                </div>
            </div>
        )
    }

    const groupedByDate = matchesToDisplay.reduce((acc, match) => {
        const date = match.dateLabel || new Date(match.date).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(match);
        return acc;
    }, {} as Record<string, Match[]>);

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-oswald text-2xl font-bold uppercase">{title}</h2>
            </div>
            
            <div className={`relative flex items-center group ${!isTeamMode ? '-mx-8' : ''}`}>
                {!isTeamMode && (
                    <button 
                        onClick={() => handleNavigate('prev')} 
                        disabled={isAnimating}
                        aria-label="Rodada Anterior"
                        className="absolute -left-0 z-10 bg-neutral-800/50 border border-neutral-700 rounded-full p-2 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all duration-300 disabled:opacity-50 opacity-0 group-hover:opacity-100"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                )}

                <div className="overflow-hidden w-full">
                     <div className={animationClass}>
                        <div className={`flex overflow-x-auto scroll-smooth scrollbar-hide py-2 gap-8 ${isTeamMode ? '' : 'px-4'}`}>
                            {Object.keys(groupedByDate).map((date) => (
                                <div key={date} className="flex-shrink-0">
                                    <h3 className="text-white font-oswald text-lg font-semibold mb-3">{date}</h3>
                                    <div className="flex gap-4">
                                        {groupedByDate[date].map(match => (
                                            <CarouselMatchCard key={match.id} match={match} teams={allTeams} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {!isTeamMode && (
                    <button 
                        onClick={() => handleNavigate('next')}
                        disabled={isAnimating}
                        aria-label="Próxima Rodada"
                        className="absolute -right-0 z-10 bg-neutral-800/50 border border-neutral-700 rounded-full p-2 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all duration-300 disabled:opacity-50 opacity-0 group-hover:opacity-100"
                    >
                        <ArrowRightIcon className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>
    );
};


export const TeamDetailHeader: React.FC<{
    team: Team,
    standing?: Standing,
    totalYellowCards: number,
    totalRedCards: number
}> = ({ team, standing, totalYellowCards, totalRedCards }) => {
    
    const teamTextColorClass = team.colors ? '' : (team.cardGradient?.split(' ')[0] || 'from-neutral-500').replace('from-', 'text-');
    const teamBorderColorClass = team.colors ? '' : (team.cardGradient?.split(' ')[0] || 'from-neutral-500').replace('from-', 'border-');

    const headerStyle = team.colors?.length 
        ? { background: `linear-gradient(to right, ${team.colors.join(', ')}), url('https://www.transparenttextures.com/patterns/woven.png')` }
        : { backgroundImage: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to)), url('https://www.transparenttextures.com/patterns/woven.png')` };

// FIX: Defined gradientStyle to handle custom team colors, resolving a reference error.
    const gradientStyle = team.colors?.length
        ? { background: `linear-gradient(to right, ${team.colors.join(', ')})` }
        : {};
    const borderStyle = team.colors ? { borderColor: team.colors[0] } : {};
    const textColorStyle = team.colors ? { color: team.colors[0] } : {};
    const shadowStyle = team.colors ? { textShadow: `0 0 15px ${team.colors[0]}` } : {};

    const stats = [
        { label: 'Classificação', value: standing?.position ? `${standing.position}º` : '-' },
        { label: 'Vitórias', value: standing?.v ?? '-' },
        { label: 'Empates', value: standing ? standing.vp + standing.dp : '-' },
        { label: 'Derrotas', value: standing?.d ?? '-' },
        { label: 'GP', value: standing?.gp ?? '-' },
        { label: 'GC', value: standing?.gc ?? '-' },
        { label: 'SG', value: standing?.sg ?? '-' },
        { label: 'Cartões amarelos', value: totalYellowCards },
        { label: 'Cartões vermelhos', value: totalRedCards },
    ];

    return (
        <div>
            <div className={`relative bg-gradient-to-r ${team.cardGradient} py-20 text-white flex flex-col items-center justify-center space-y-4`} style={headerStyle}>
                 <div className="absolute inset-0 bg-black/30"></div>
                 <div className="relative z-10 flex flex-col items-center">
                    <img src={team.logoUrl} alt={`${team.name} Logo`} className="w-32 h-32 mb-4 drop-shadow-2xl"/>
                    <h1 className="text-5xl font-oswald font-bold">{team.name}</h1>
                 </div>
            </div>
            <div className={`p-4 bg-gradient-to-r ${team.cardGradient}`} style={gradientStyle}>
                <div className={`bg-neutral-900/80 backdrop-blur-sm rounded-lg p-6 border-2 ${teamBorderColorClass}`} style={borderStyle}>
                    <p className="text-center font-oswald font-bold text-lg tracking-wider mb-4 uppercase">
                        <span className="bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text">
                            BRASILEIRÃO FBF
                        </span>
                        <span className="text-neutral-400"> - Season 1</span>
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-9 gap-4 text-center">
                        {stats.map((stat, index) => (
                            <div key={stat.label} className={`group/stat ${teamTextColorClass}`} style={textColorStyle}>
                                <div 
                                    className="bg-neutral-900 p-4 rounded-lg border border-neutral-800 transition-all duration-300 ease-in-out group-hover/stat:-translate-y-1 group-hover/stat:bg-neutral-800/50 group-hover/stat:shadow-lg flex flex-col justify-center min-h-[110px]"
                                >
                                    <p className={`text-4xl font-oswald font-bold transition-colors ${index < 1 ? 'text-current' : 'text-white'}`}>
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-neutral-500 uppercase mt-1">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

export const Pagination: React.FC<{
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const maxPages = 5; 
        const sidePages = 1; 
        
        if (totalPages <= maxPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        
        if (currentPage <= sidePages + 2) {
            for (let i = 1; i <= sidePages + 3; i++) pageNumbers.push(i);
            pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }
        else if (currentPage >= totalPages - (sidePages + 1)) {
            pageNumbers.push(1);
            pageNumbers.push('...');
            for (let i = totalPages - (sidePages + 2); i <= totalPages; i++) pageNumbers.push(i);
        }
        else {
            pageNumbers.push(1);
            pageNumbers.push('...');
            for (let i = currentPage - sidePages; i <= currentPage + sidePages; i++) pageNumbers.push(i);
            pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }
        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();
    
    return (
        <nav className="flex justify-center items-center space-x-2 mt-8">
            {currentPage > 1 && (
                 <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                    aria-label="Página Anterior"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
            )}
            {pageNumbers.map((page, index) =>
                typeof page === 'number' ? (
                    <button
                        key={index}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-300
                            ${currentPage === page
                                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                : 'bg-neutral-800 text-white hover:bg-neutral-700'
                            }`}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={index} className="px-2 text-neutral-500">
                        {page}
                    </span>
                )
            )}
            {currentPage < totalPages && (
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                    aria-label="Próxima Página"
                >
                    <ArrowRightIcon className="w-5 h-5" />
                </button>
            )}
        </nav>
    );
};

export const FeaturedPlayerCard: React.FC<{ player: Player, teams: Team[] }> = ({ player, teams }) => {
    const team = teams.find(t => t.id === player.teamId);
    if (!team) return null;

    const isGoalkeeper = player.position === 'Goleiro';
    
    let specialStat = null;
    if (player.stats.mvpMatches > 0) {
        specialStat = { label: 'MVP Jogo', value: player.stats.mvpMatches, color: 'text-orange-400' };
    } else if (!isGoalkeeper && player.stats.goals > 0) {
        specialStat = { label: 'Gols', value: player.stats.goals, color: 'text-green-400' };
    } else if (!isGoalkeeper && player.stats.assists > 0) {
        specialStat = { label: 'Assist.', value: player.stats.assists, color: 'text-blue-400' };
    }

    return (
        <Link to={`/players/${player.id}`} className="block w-[280px] flex-shrink-0 bg-neutral-900 rounded-lg overflow-hidden group relative transition-all duration-300 hover:-translate-y-1 border border-neutral-800 hover:border-green-500">
            <div className="p-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-neutral-800">
                             <img src={player.photoUrl} alt={player.fullName} className="w-full h-full object-cover object-top" />
                             <div className="absolute bottom-0.5 right-0.5 bg-black/50 text-white text-[10px] font-bold px-1 rounded z-10">#{player.number}</div>
                        </div>
                        <div>
                            <h3 className="text-base font-oswald font-bold text-white leading-tight">{player.fullName}</h3>
                            <p className="text-neutral-400 text-xs">{player.position}</p>
                        </div>
                    </div>
                    {player.ratings.average > 0 && (
                         <div className="flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full text-xs font-bold">
                             <LightningIcon className="w-3 h-3"/>
                             <span>{player.ratings.average}</span>
                         </div>
                    )}
                </div>
                 <div className="grid grid-cols-3 gap-1.5 mt-2 text-center text-xs">
                     <div className="bg-neutral-800/50 p-1 rounded">
                         <p className="text-neutral-400">Jogos</p>
                         <p className="font-oswald font-bold text-base text-white">{player.stats.matches}</p>
                     </div>
                      <div className="bg-neutral-800/50 p-1 rounded">
                         <p className="text-neutral-400">{isGoalkeeper ? 'Gols Sofr.' : 'Gols'}</p>
                         <p className="font-oswald font-bold text-base text-white">{isGoalkeeper ? player.stats.saves : player.stats.goals}</p>
                     </div>
                      <div className="bg-neutral-800/50 p-1 rounded">
                         <p className="text-neutral-400">{specialStat ? specialStat.label : 'Assist.'}</p>
                         <p className={`font-oswald font-bold text-base ${specialStat ? specialStat.color : 'text-white'}`}>{specialStat ? specialStat.value : (isGoalkeeper ? player.stats.assists : player.stats.assists)}</p>
                     </div>
                 </div>
            </div>
        </Link>
    );
};

export const MorePlayersCarousel: React.FC = () => {
    const { leagueData } = useLeagueData()!;
    const carouselRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const players = leagueData.players.slice(0, 10);

    const handleScroll = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };
    
    useEffect(() => {
        handleScroll();
    }, []);

    return (
        <div className="relative group">
            <div 
                ref={carouselRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto scroll-smooth scrollbar-hide py-4 gap-6"
            >
                {players.map(player => (
                    <FeaturedPlayerCard key={player.id} player={player} teams={leagueData.teams}/>
                ))}
            </div>
             {showLeftArrow && (
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-neutral-800/50 border border-neutral-700 rounded-full p-2 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                    aria-label="Scroll Left"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
            )}
            {showRightArrow && (
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-neutral-800/50 border border-neutral-700 rounded-full p-2 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                    aria-label="Scroll Right"
                >
                    <ArrowRightIcon className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};