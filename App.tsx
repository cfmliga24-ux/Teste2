
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, useParams, Link, useNavigate } from 'react-router-dom';
import { data } from './data';
import { Header, PageHeader, PlayerCard, TeamCard, MatchListItem, StandingsTable, PlayerDetailStatGrid, CalendarIcon, TeamStatsTable, ArrowLeftIcon, ArrowRightIcon, Marquee, Footer, StatsCard, ClassificationPanel, MatchesCarousel, TeamDetailHeader, PresidentCard, ChevronDownIcon, SearchIcon, Pagination, MorePlayersCarousel, PlayIcon, XIcon } from './components';
// FIX: Imported PlayerSeasonStats and Standing to resolve type errors.
import { Match, MatchEvent, MatchEventType, MatchStatus, Player, Team, User, UserRole, LeagueData, Round, PlayerRatings, PlayerSeasonStats, Standing, MatchStatsData } from './types';
import { GoogleGenAI, Type } from "@google/genai";

// --- DATA CONTEXT ---
interface LeagueDataContextType {
    leagueData: LeagueData;
    addTeam: (teamData: Omit<Team, 'id' | 'stats' | 'slug'>) => void;
    addPlayer: (playerData: Omit<Player, 'id' | 'stats' | 'ratings'> & { ratings: Omit<PlayerRatings, 'average'> }) => void;
    addRoundAndMatches: (roundData: Omit<Round, 'id'>, matchesData: Omit<Match, 'id' | 'status' | 'scoreHome' | 'scoreAway' | 'events'>[]) => void;
    editTeam: (teamId: string, updatedData: Partial<Omit<Team, 'id'>>) => void;
    editPlayer: (playerId: string, updatedData: Partial<Omit<Player, 'id'>>) => void;
    editMatch: (matchId: string, updatedData: Partial<Omit<Match, 'id'>>) => void;
    removeTeam: (teamId: string) => void;
    removePlayer: (playerId: string) => void;
    removeRound: (roundId: string) => void;
    removeMatch: (matchId: string) => void;
}

const LeagueDataContext = createContext<LeagueDataContextType | null>(null);
export const useLeagueData = () => {
    const context = useContext(LeagueDataContext);
    if (!context) throw new Error("useLeagueData must be used within a LeagueDataProvider");
    return context;
};

// --- AUTHENTICATION ---
interface AuthContextType {
    currentUser: User | null;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    register: (username: string, email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        try {
            const item = window.localStorage.getItem('fbf25-user');
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return null;
        }
    });
    
    const [usersDB, setUsersDB] = useState<User[]>(data.users);

    const login = async (email: string, pass: string): Promise<void> => {
        const user = usersDB.find(u => u.email === email && u.password === pass);
        if (user) {
            const { password, ...userToStore } = user;
            setCurrentUser(userToStore);
            localStorage.setItem('fbf25-user', JSON.stringify(userToStore));
        } else {
            throw new Error("Credenciais inválidas");
        }
    };

    const register = async (username: string, email: string, pass: string): Promise<void> => {
        if (usersDB.some(u => u.email === email)) {
            throw new Error("Este e-mail já está em uso.");
        }
        const newUser: User = {
            id: `user-${Date.now()}`,
            username,
            email,
            password: pass,
            role: UserRole.MEMBER,
        };
        setUsersDB(prev => [...prev, newUser]);
        const { password, ...userToStore } = newUser;
        setCurrentUser(userToStore);
        localStorage.setItem('fbf25-user', JSON.stringify(userToStore));
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('fbf25-user');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

// --- UTILS ---
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const FormInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />;
const FormSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...props} className="w-full bg-neutral-800 border border-neutral-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />;
const FormLabel: React.FC<{ children: React.ReactNode, required?: boolean }> = ({ children, required }) => <label className="block text-sm font-medium text-neutral-400 mb-1">{children}{required && <span className="text-red-500 ml-1">*</span>}</label>;

// --- ADMIN PANEL FORMS ---

const AddTeamForm: React.FC<{ onAdd: (team: any) => void, onCancel: () => void }> = ({ onAdd, onCancel }) => {
    const [name, setName] = useState('');
    const [logo, setLogo] = useState<string | null>(null);
    const [slug, setSlug] = useState('');
    const [numColors, setNumColors] = useState(2);
    const [colors, setColors] = useState(['#ffffff', '#000000', '#cccccc']);

    const handleColorChange = (index: number, value: string) => {
        const newColors = [...colors];
        newColors[index] = value;
        setColors(newColors);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setLogo(base64);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !logo || !slug || slug.length > 4) {
            alert("Por favor, preencha todos os campos corretamente. A sigla deve ter no máximo 4 letras.");
            return;
        }
        const teamColors = colors.slice(0, numColors);
        onAdd({ name, logoUrl: logo, slug, colors: teamColors, keyPeople: 'Admin', cardImageUrl: 'https://source.unsplash.com/random/400x400?sports' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><FormLabel required>Nome do Time</FormLabel><FormInput type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
            <div><FormLabel required>Escudo do Time (Upload)</FormLabel><FormInput type="file" onChange={handleFileChange} accept="image/*" required /></div>
            <div><FormLabel required>Sigla do Time (até 4 letras)</FormLabel><FormInput type="text" value={slug} onChange={e => setSlug(e.target.value)} maxLength={4} required /></div>
            
            <div>
                <FormLabel>Quantidade de Cores</FormLabel>
                <div className="flex gap-2 p-1 bg-neutral-800 rounded-md">
                    <label className="flex items-center justify-center text-sm font-semibold text-neutral-300 cursor-pointer w-full p-2 rounded-md transition-colors has-[:checked]:bg-green-500 has-[:checked]:text-white">
                        <input type="radio" name="numColors" value="2" checked={numColors === 2} onChange={() => setNumColors(2)} className="hidden" />
                        2 Cores
                    </label>
                    <label className="flex items-center justify-center text-sm font-semibold text-neutral-300 cursor-pointer w-full p-2 rounded-md transition-colors has-[:checked]:bg-green-500 has-[:checked]:text-white">
                        <input type="radio" name="numColors" value="3" checked={numColors === 3} onChange={() => setNumColors(3)} className="hidden" />
                        3 Cores
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div><FormLabel required>Cor 1</FormLabel><FormInput type="color" value={colors[0]} onChange={e => handleColorChange(0, e.target.value)} /></div>
                <div><FormLabel required>Cor 2</FormLabel><FormInput type="color" value={colors[1]} onChange={e => handleColorChange(1, e.target.value)} /></div>
                {numColors === 3 && (
                    <div><FormLabel required>Cor 3</FormLabel><FormInput type="color" value={colors[2]} onChange={e => handleColorChange(2, e.target.value)} /></div>
                )}
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-colors">Adicionar Time</button>
            </div>
        </form>
    );
};

const AddPlayerForm: React.FC<{ onAdd: (player: any) => void, onCancel: () => void, teams: Team[] }> = ({ onAdd, onCancel, teams }) => {
    const [formData, setFormData] = useState({
        fullName: '', position: 'Atacante', teamId: teams[0]?.id || '', nationality: 'Brazil', photoUrl: '', number: '',
        fisico: '70', duelos: '70', chuteAoGol: '70', defesa: '70', passe: '70', habilidade: '70'
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setFormData(prev => ({ ...prev, photoUrl: base64 }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { fullName, photoUrl, number, ...rest } = formData;
        if (!fullName || !photoUrl || !number) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const ratings = {
            fisico: parseInt(rest.fisico),
            duelos: parseInt(rest.duelos),
            chuteAoGol: parseInt(rest.chuteAoGol),
            defesa: parseInt(rest.defesa),
            passe: parseInt(rest.passe),
            habilidade: parseInt(rest.habilidade),
        };

        const newPlayer = {
            fullName,
            photoUrl,
            number: parseInt(number),
            position: rest.position,
            teamId: rest.teamId,
            nationality: rest.nationality,
            firstName: fullName.split(' ')[0],
            lastName: fullName.split(' ').slice(1).join(' '),
            birthDate: '2000-01-01',
            ratings,
        };
        onAdd(newPlayer);
    };

    const positions = ['Atacante', 'Ponta-D', 'Ponta-E', 'Meia-Ofensivo', 'Meio-Camista', 'Lateral-D', 'Lateral-E', 'Volante', 'Zagueiro', 'Goleiro'];
    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
             <div className="grid grid-cols-2 gap-4">
                <div><FormLabel required>Nome Completo</FormLabel><FormInput name="fullName" value={formData.fullName} onChange={handleChange} required /></div>
                <div><FormLabel required>Posição</FormLabel><FormSelect name="position" value={formData.position} onChange={handleChange}>{positions.map(p => <option key={p} value={p}>{p}</option>)}</FormSelect></div>
                <div><FormLabel required>Time</FormLabel><FormSelect name="teamId" value={formData.teamId} onChange={handleChange}>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</FormSelect></div>
                <div><FormLabel required>País</FormLabel><FormInput name="nationality" value={formData.nationality} onChange={handleChange} required /></div>
                <div><FormLabel required>Número da Camisa</FormLabel><FormInput type="number" name="number" value={formData.number} onChange={handleChange} min="1" max="99" required /></div>
                <div><FormLabel required>Foto (Upload)</FormLabel><FormInput type="file" onChange={handleFileChange} accept="image/*" required /></div>
            </div>
            <h4 className="font-oswald text-lg font-semibold pt-4 border-t border-neutral-700 mt-4">Atributos</h4>
            <div className="grid grid-cols-3 gap-4">
                {Object.keys(formData).filter(k => !['fullName', 'position', 'teamId', 'nationality', 'photoUrl', 'number'].includes(k)).map(statKey => (
                     <div key={statKey}><FormLabel required>{statKey.charAt(0).toUpperCase() + statKey.slice(1)}</FormLabel><FormInput type="number" name={statKey} value={formData[statKey]} onChange={handleChange} min="0" max="99" required /></div>
                ))}
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-colors">Adicionar Jogador</button>
            </div>
        </form>
    );
};

const AddRoundForm: React.FC<{ onAdd: (round: any, matches: any) => void, onCancel: () => void, teams: Team[] }> = ({ onAdd, onCancel, teams }) => {
    const [step, setStep] = useState(1);
    const [roundNumber, setRoundNumber] = useState(1);
    const [numGames, setNumGames] = useState(1);
    const [matches, setMatches] = useState<any[]>([]);

    const handleNext = () => {
        const initialMatches = Array.from({ length: numGames }, () => ({
            homeTeamId: teams[0]?.id || '',
            awayTeamId: teams[1]?.id || '',
            date: '',
            time: ''
        }));
        setMatches(initialMatches);
        setStep(2);
    };

    const handleMatchChange = (index: number, field: string, value: string) => {
        const newMatches = [...matches];
        newMatches[index][field] = value;
        setMatches(newMatches);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const round = { name: `Rodada ${roundNumber}`, order: roundNumber };
        const newMatches = matches.map(m => ({
            ...m,
            competitionId: 'fbf25',
            roundId: `round-${roundNumber}`,
            groupId: 'group-a', // Default group
            venue: 'Arena FBF',
        }));
        onAdd(round, newMatches);
    };
    
    if (step === 1) {
        return (
            <div className="space-y-4">
                <div><FormLabel required>Número da Rodada</FormLabel><FormInput type="number" value={roundNumber} onChange={e => setRoundNumber(parseInt(e.target.value))} min="1" /></div>
                <div><FormLabel required>Quantidade de Jogos</FormLabel><FormInput type="number" value={numGames} onChange={e => setNumGames(parseInt(e.target.value))} min="1" /></div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 transition-colors">Cancelar</button>
                    <button onClick={handleNext} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors">Próximo</button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
            {matches.map((match, index) => (
                <div key={index} className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
                    <h4 className="font-oswald font-semibold mb-2">Jogo {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div><FormLabel required>Time da Casa</FormLabel><FormSelect value={match.homeTeamId} onChange={e => handleMatchChange(index, 'homeTeamId', e.target.value)}>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</FormSelect></div>
                        <div><FormLabel required>Time Visitante</FormLabel><FormSelect value={match.awayTeamId} onChange={e => handleMatchChange(index, 'awayTeamId', e.target.value)}>{teams.filter(t => t.id !== match.homeTeamId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</FormSelect></div>
                        <div><FormLabel required>Data</FormLabel><FormInput type="date" value={match.date} onChange={e => handleMatchChange(index, 'date', e.target.value)} /></div>
                        <div><FormLabel required>Horário</FormLabel><FormInput type="time" value={match.time} onChange={e => handleMatchChange(index, 'time', e.target.value)} /></div>
                    </div>
                </div>
            ))}
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 transition-colors">Voltar</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-colors">Adicionar Rodada</button>
            </div>
        </form>
    );
};

const EditTeamForm: React.FC<{ onEdit: (id: string, data: any) => void, onCancel: () => void, teams: Team[] }> = ({ onEdit, onCancel, teams }) => {
    const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
    const [formData, setFormData] = useState<Partial<Team>>({});
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        const team = teams.find(t => t.id === selectedTeamId);
        if (team) {
            setFormData(team);
            setLogoPreview(team.logoUrl);
        }
    }, [selectedTeamId, teams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setFormData(prev => ({ ...prev, logoUrl: base64 }));
            setLogoPreview(base64);
        }
    };

    const handleColorChange = (index: number, value: string) => {
        const newColors = [...(formData.colors || [])];
        newColors[index] = value;
        setFormData(prev => ({ ...prev, colors: newColors }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onEdit(selectedTeamId, formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <div><FormLabel>Selecionar Time</FormLabel><FormSelect value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)}>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</FormSelect></div>
            {formData.id && (
                <>
                    <div><FormLabel>Nome do Time</FormLabel><FormInput name="name" value={formData.name || ''} onChange={handleChange} /></div>
                    <div><FormLabel>Logo do Time</FormLabel><div className="flex items-center gap-4"><img src={logoPreview || ''} alt="logo preview" className="w-12 h-12 bg-neutral-700 rounded-md" /><FormInput type="file" onChange={handleFileChange} accept="image/*" /></div></div>
                    <div><FormLabel>Sigla do Time</FormLabel><FormInput name="slug" value={formData.slug || ''} onChange={handleChange} maxLength={4} /></div>
                    <div><FormLabel>Cores do Time</FormLabel><div className="flex gap-4">{formData.colors?.map((color, index) => (<FormInput key={index} type="color" value={color} onChange={e => handleColorChange(index, e.target.value)} />))}</div></div>
                </>
            )}
            <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600">Cancelar</button><button type="submit" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700">Salvar Alterações</button></div>
        </form>
    );
};

const EditPlayerForm: React.FC<{ onEdit: (id: string, data: any) => void, onCancel: () => void, players: Player[], teams: Team[] }> = ({ onEdit, onCancel, players, teams }) => {
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>(players[0]?.id || '');
    const [formData, setFormData] = useState<Partial<Player>>({});
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPlayers = players.filter(p => p.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        const player = players.find(p => p.id === selectedPlayerId);
        if (player) {
            setFormData(player);
            setPhotoPreview(player.photoUrl || null);
        }
    }, [selectedPlayerId, players]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const keys = name.split('.');
        setFormData(prev => {
            const newState = { ...prev };
            let current: any = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            const parsedValue = (type === 'number' || e.target.dataset.type === 'number') ? parseInt(value, 10) || 0 : value;
            current[keys[keys.length - 1]] = parsedValue;
            
            // Recalculate average
            if (keys[0] === 'ratings' && newState.ratings) {
                const { fisico, duelos, chuteAoGol, defesa, passe, habilidade } = newState.ratings;
                const sum = (fisico || 0) + (duelos || 0) + (chuteAoGol || 0) + (defesa || 0) + (passe || 0) + (habilidade || 0);
                const avg = sum / 6;
                newState.ratings.average = Math.round(avg);
            }
            return newState;
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setFormData(prev => ({ ...prev, photoUrl: base64 }));
            setPhotoPreview(base64);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onEdit(selectedPlayerId, formData);
    };

    const positions = ['Atacante', 'Ponta-D', 'Ponta-E', 'Meia-Ofensivo', 'Meio-Camista', 'Lateral-D', 'Lateral-E', 'Volante', 'Zagueiro', 'Goleiro'];
    const ratingFields: {key: keyof Omit<PlayerRatings, 'average'>, label: string}[] = [{key: 'fisico', label: 'Físico'}, {key: 'duelos', label: 'Drible'}, {key: 'chuteAoGol', label: 'Chute'}, {key: 'defesa', label: 'Defesa'}, {key: 'passe', label: 'Passe'}, {key: 'habilidade', label: 'Habilidade'}];
    const seasonStatFields: {key: keyof PlayerSeasonStats, label: string}[] = [{key: 'mvpMatches', label: 'MVP Jogo'}, {key: 'mvpRounds', label: 'MVP Rodada'}, {key: 'goals', label: 'Gols'}, {key: 'assists', label: 'Assistências'}, {key: 'yellowCards', label: 'Cartões Amarelos'}, {key: 'redCards', label: 'Cartões Vermelhos'}];

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
             <div className="grid grid-cols-2 gap-4">
                <div><FormLabel>Pesquisar Jogador</FormLabel><FormInput type="text" placeholder="Nome do jogador..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                <div><FormLabel>Selecionar Jogador</FormLabel><FormSelect value={selectedPlayerId} onChange={e => setSelectedPlayerId(e.target.value)}>{filteredPlayers.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}</FormSelect></div>
            </div>
            {formData.id && (
                <>
                    <h4 className="font-oswald text-lg font-semibold pt-4 border-t border-neutral-700 mt-4">Informações do Jogador</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div><FormLabel>Nome</FormLabel><FormInput name="fullName" value={formData.fullName || ''} onChange={handleChange} /></div>
                        <div><FormLabel>Posição</FormLabel><FormSelect name="position" value={formData.position || ''} onChange={handleChange}>{positions.map(p => <option key={p} value={p}>{p}</option>)}</FormSelect></div>
                        <div><FormLabel>Time</FormLabel><FormSelect name="teamId" value={formData.teamId || ''} onChange={handleChange}>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</FormSelect></div>
                        <div><FormLabel>País</FormLabel><FormInput name="nationality" value={formData.nationality || ''} onChange={handleChange} /></div>
                        <div><FormLabel>Foto do Jogador</FormLabel><div className="flex items-center gap-4"><img src={photoPreview || ''} alt="preview" className="w-12 h-12 bg-neutral-700 rounded-md object-cover" /><FormInput type="file" onChange={handleFileChange} accept="image/*" /></div></div>
                    </div>
                    <h4 className="font-oswald text-lg font-semibold pt-4 border-t border-neutral-700 mt-4">Atributos do Jogador</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                        <div className="text-center bg-neutral-800 p-2 rounded-md col-span-2 md:col-span-1"><FormLabel>Média</FormLabel><p className="text-2xl font-bold font-oswald text-green-400">{formData.ratings?.average || 0}</p></div>
                        {ratingFields.map(field => (<div key={field.key}><FormLabel>{field.label}</FormLabel><FormInput data-type="number" type="number" name={`ratings.${field.key}`} value={formData.ratings?.[field.key] || 0} onChange={handleChange} min="0" max="99" /></div>))}
                    </div>
                    <h4 className="font-oswald text-lg font-semibold pt-4 border-t border-neutral-700 mt-4">Estatísticas da Temporada</h4>
                    <div className="grid grid-cols-3 gap-4">
                        {seasonStatFields.map(field => (<div key={field.key}><FormLabel>{field.label}</FormLabel><FormInput data-type="number" type="number" name={`stats.${field.key}`} value={formData.stats?.[field.key] || 0} onChange={handleChange} /></div>))}
                    </div>
                </>
            )}
            <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600">Cancelar</button><button type="submit" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700">Salvar Alterações</button></div>
        </form>
    );
};

const EditRoundForm: React.FC<{ onEdit: (id: string, data: any) => void, onCancel: () => void, rounds: Round[], matches: Match[], teams: Team[] }> = ({ onEdit, onCancel, rounds, matches, teams }) => {
    const [selectedRoundId, setSelectedRoundId] = useState<string>(rounds[0]?.id || '');
    const [editedMatches, setEditedMatches] = useState<Match[]>([]);

    useEffect(() => {
        const newRoundMatches = matches.filter(m => m.roundId === selectedRoundId);
        setEditedMatches(newRoundMatches);
    }, [selectedRoundId, matches]);

    const handleMatchChange = (matchId: string, field: keyof Match, value: any) => {
        setEditedMatches(prev => prev.map(m => m.id === matchId ? { ...m, [field]: value } : m));
    };

    const handleSave = () => {
        editedMatches.forEach(match => {
            const originalMatch = matches.find(m => m.id === match.id);
            if (JSON.stringify(originalMatch) !== JSON.stringify(match)) {
                onEdit(match.id, match);
            }
        });
        alert('Rodada atualizada com sucesso!');
    };

    return (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <div><FormLabel>Selecionar Rodada</FormLabel><FormSelect value={selectedRoundId} onChange={e => setSelectedRoundId(e.target.value)}>{rounds.sort((a,b) => a.order - b.order).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</FormSelect></div>
            <div className="space-y-4">
                {editedMatches.map(match => (
                    <div key={match.id} className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div><FormLabel>Data</FormLabel><FormInput type="date" value={match.date.split('T')[0]} onChange={e => handleMatchChange(match.id, 'date', e.target.value)} /></div>
                            <div><FormLabel>Horário</FormLabel><FormInput type="time" value={match.time} onChange={e => handleMatchChange(match.id, 'time', e.target.value)} /></div>
                            <div><FormLabel>Casa</FormLabel><FormSelect value={match.homeTeamId} onChange={e => handleMatchChange(match.id, 'homeTeamId', e.target.value)}>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</FormSelect></div>
                            <div><FormLabel>Visitante</FormLabel><FormSelect value={match.awayTeamId} onChange={e => handleMatchChange(match.id, 'awayTeamId', e.target.value)}>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</FormSelect></div>
                            <div><FormLabel>Gols Casa</FormLabel><FormInput type="number" value={match.scoreHome} onChange={e => handleMatchChange(match.id, 'scoreHome', parseInt(e.target.value) || 0)} /></div>
                            <div><FormLabel>Gols Visitante</FormLabel><FormInput type="number" value={match.scoreAway} onChange={e => handleMatchChange(match.id, 'scoreAway', parseInt(e.target.value) || 0)} /></div>
                            <div><FormLabel>Status</FormLabel><FormSelect value={match.status} onChange={e => handleMatchChange(match.id, 'status', e.target.value)}>{Object.values(MatchStatus).map(s => <option key={s} value={s}>{s}</option>)}</FormSelect></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600">Cancelar</button><button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700">Salvar Alterações</button></div>
        </div>
    );
};

const RemoveTeamForm: React.FC<{ onRemove: (id: string) => void, onCancel: () => void, teams: Team[] }> = ({ onRemove, onCancel, teams }) => {
    const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeamId) {
            alert('Por favor, selecione um time.');
            return;
        }
        onRemove(selectedTeamId);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <FormLabel required>Selecionar Time</FormLabel>
                <FormSelect value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)}>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </FormSelect>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors">Remover Time</button>
            </div>
        </form>
    );
};

const RemovePlayerForm: React.FC<{ onRemove: (id: string) => void, onCancel: () => void, players: Player[] }> = ({ onRemove, onCancel, players }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredPlayers = players.filter(p => p.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>(filteredPlayers[0]?.id || '');
    
    useEffect(() => {
        setSelectedPlayerId(filteredPlayers[0]?.id || '');
    }, [searchTerm, players, filteredPlayers]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlayerId) {
            alert('Por favor, selecione um jogador.');
            return;
        }
        onRemove(selectedPlayerId);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><FormLabel>Pesquisar Jogador</FormLabel><FormInput type="text" placeholder="Nome do jogador..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
            <div>
                <FormLabel required>Selecionar Jogador</FormLabel>
                <FormSelect value={selectedPlayerId} onChange={e => setSelectedPlayerId(e.target.value)}>
                    {filteredPlayers.length > 0 ? 
                        filteredPlayers.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>) :
                        <option value="" disabled>Nenhum jogador encontrado</option>
                    }
                </FormSelect>
            </div>
             <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 transition-colors">Cancelar</button>
                <button type="submit" disabled={!selectedPlayerId} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Remover Jogador</button>
            </div>
        </form>
    );
};

const RemoveRoundForm: React.FC<{ onRemoveRound: (id: string) => void, onRemoveMatch: (id: string) => void, onCancel: () => void, rounds: Round[], matches: Match[], teams: Team[] }> = ({ onRemoveRound, onRemoveMatch, onCancel, rounds, matches, teams }) => {
    const [selectedRoundId, setSelectedRoundId] = useState<string>(rounds[0]?.id || '');
    const [selectedMatchId, setSelectedMatchId] = useState<string>('');

    const matchesInRound = matches.filter(m => m.roundId === selectedRoundId);

    useEffect(() => {
        setSelectedMatchId(''); // Reset match selection when round changes
    }, [selectedRoundId]);

    const handleRemoveRound = () => {
        if (!selectedRoundId) return;
        onRemoveRound(selectedRoundId);
    };

    const handleRemoveMatch = () => {
        if (!selectedMatchId) return;
        onRemoveMatch(selectedMatchId);
    };
    
    return (
        <div className="space-y-4">
            <div>
                <FormLabel required>Selecionar Rodada</FormLabel>
                <FormSelect value={selectedRoundId} onChange={e => setSelectedRoundId(e.target.value)}>
                    {rounds.sort((a,b) => a.order - b.order).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </FormSelect>
            </div>
            {matchesInRound.length > 0 && (
                <div>
                    <FormLabel>(Opcional) Selecionar Jogo</FormLabel>
                    <FormSelect value={selectedMatchId} onChange={e => setSelectedMatchId(e.target.value)}>
                        <option value="">-- Selecione um jogo para remover --</option>
                        {matchesInRound.map(m => {
                            const home = teams.find(t => t.id === m.homeTeamId);
                            const away = teams.find(t => t.id === m.awayTeamId);
                            return <option key={m.id} value={m.id}>{home?.name} vs {away?.name}</option>
                        })}
                    </FormSelect>
                </div>
            )}
            <div className="flex justify-end gap-4 pt-4 border-t border-neutral-700">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 transition-colors">Cancelar</button>
                <button onClick={handleRemoveMatch} disabled={!selectedMatchId} className="px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Remover Jogo Selecionado</button>
                <button onClick={handleRemoveRound} disabled={!selectedRoundId} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Remover Rodada Inteira</button>
            </div>
        </div>
    );
};


// --- ADMIN PANEL ---
const AdminPanel: React.FC<{ onClose: () => void, addTeam: any, addPlayer: any, addRoundAndMatches: any, editTeam: any, editPlayer: any, editMatch: any, removeTeam: any, removePlayer: any, removeRound: any, removeMatch: any }> = ({ onClose, addTeam, addPlayer, addRoundAndMatches, editTeam, editPlayer, editMatch, removeTeam, removePlayer, removeRound, removeMatch }) => {
    const [view, setView] = useState('main');
    const { leagueData } = useLeagueData()!;

    const buttonSections = [
        { title: 'Adicionar', buttons: ['Time', 'Jogador', 'Rodada'], color: 'bg-green-600 hover:bg-green-700' },
        { title: 'Editar', buttons: ['Time', 'Jogador', 'Rodada'], color: 'bg-blue-600 hover:bg-blue-700' },
        { title: 'Remover', buttons: ['Time', 'Jogador', 'Rodada'], color: 'bg-red-600 hover:bg-red-700' }
    ];

    const handleClick = (sectionTitle: string, type: string) => {
        if (sectionTitle === 'Adicionar') {
            if (type === 'Time') setView('add-team');
            if (type === 'Jogador') setView('add-player');
            if (type === 'Rodada') setView('add-round');
        } else if (sectionTitle === 'Editar') {
            if (type === 'Time') setView('edit-team');
            if (type === 'Jogador') setView('edit-player');
            if (type === 'Rodada') setView('edit-round');
        } else if (sectionTitle === 'Remover') {
            if (type === 'Time') setView('remove-team');
            if (type === 'Jogador') setView('remove-player');
            if (type === 'Rodada') setView('remove-round');
        }
    };
    
    const handleAddTeam = (teamData: any) => { addTeam(teamData); alert('Time adicionado!'); setView('main'); };
    const handleAddPlayer = (playerData: any) => { addPlayer(playerData); alert('Jogador adicionado!'); setView('main'); };
    const handleAddRound = (roundData: any, matchesData: any) => { addRoundAndMatches(roundData, matchesData); alert('Rodada adicionada!'); setView('main'); };
    const handleEditTeam = (id: string, data: any) => { editTeam(id, data); alert('Time atualizado!'); setView('main'); };
    const handleEditPlayer = (id: string, data: any) => { editPlayer(id, data); alert('Jogador atualizado!'); setView('main'); };
    const handleEditMatch = (id: string, data: any) => { editMatch(id, data); /* No alert here to avoid spamming on round save */ };

    const handleRemoveTeam = (id: string) => { removeTeam(id); alert('Time removido!'); setView('main'); };
    const handleRemovePlayer = (id: string) => { removePlayer(id); alert('Jogador removido!'); setView('main'); };
    const handleRemoveRound = (id: string) => { removeRound(id); alert('Rodada removida!'); setView('main'); };
    const handleRemoveMatch = (id: string) => { removeMatch(id); alert('Jogo removido!'); setView('main'); };


    const getTitle = () => {
        switch(view) {
            case 'add-team': return 'Adicionar Novo Time';
            case 'add-player': return 'Adicionar Novo Jogador';
            case 'add-round': return 'Adicionar Nova Rodada';
            case 'edit-team': return 'Editar Time';
            case 'edit-player': return 'Editar Jogador';
            case 'edit-round': return 'Editar Rodada';
            case 'remove-team': return 'Remover Time';
            case 'remove-player': return 'Remover Jogador';
            case 'remove-round': return 'Remover Rodada / Jogo';
            default: return 'Painel de Administração';
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] animate-fade-in" onClick={onClose}>
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-8 w-full max-w-3xl animate-slide-in-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-oswald text-3xl font-bold bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text">{getTitle()}</h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors" aria-label="Fechar Painel">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                {view === 'main' && (
                    <div className="space-y-8">
                        {buttonSections.map(section => (
                            <div key={section.title}>
                                <h3 className="font-oswald text-xl font-semibold mb-4 text-neutral-300 border-b border-neutral-800 pb-2">{section.title}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {section.buttons.map(label => (
                                        <button key={label} onClick={() => handleClick(section.title, label)} className={`w-full font-bold py-3 px-4 rounded-md transition-all duration-300 text-white ${section.color} shadow-lg hover:shadow-xl hover:-translate-y-0.5`}>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {view === 'add-team' && <AddTeamForm onAdd={handleAddTeam} onCancel={() => setView('main')} />}
                {view === 'add-player' && <AddPlayerForm onAdd={handleAddPlayer} onCancel={() => setView('main')} teams={leagueData.teams} />}
                {view === 'add-round' && <AddRoundForm onAdd={handleAddRound} onCancel={() => setView('main')} teams={leagueData.teams} />}
                {view === 'edit-team' && <EditTeamForm onEdit={handleEditTeam} onCancel={() => setView('main')} teams={leagueData.teams} />}
                {view === 'edit-player' && <EditPlayerForm onEdit={handleEditPlayer} onCancel={() => setView('main')} players={leagueData.players} teams={leagueData.teams} />}
                {view === 'edit-round' && <EditRoundForm onEdit={handleEditMatch} onCancel={() => setView('main')} rounds={leagueData.rounds} matches={leagueData.matches} teams={leagueData.teams} />}
                {view === 'remove-team' && <RemoveTeamForm onRemove={handleRemoveTeam} onCancel={() => setView('main')} teams={leagueData.teams} />}
                {view === 'remove-player' && <RemovePlayerForm onRemove={handleRemovePlayer} onCancel={() => setView('main')} players={leagueData.players} />}
                {view === 'remove-round' && <RemoveRoundForm onRemoveRound={handleRemoveRound} onRemoveMatch={handleRemoveMatch} onCancel={() => setView('main')} rounds={leagueData.rounds} matches={leagueData.matches} teams={leagueData.teams} />}
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes slide-in-up { from { transform: translateY(20px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
                .animate-slide-in-up { animation: slide-in-up 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};


// --- PAGES ---
const HomePage: React.FC = () => {
    const { leagueData } = useLeagueData()!;
    const getTopPlayersByStat = (stat: keyof Player['stats'], count = 3) => {
        return [...leagueData.players]
            .sort((a, b) => ((b.stats[stat] || 0) as number) - ((a.stats[stat] || 0) as number))
            .slice(0, count)
            .map(p => ({ player: p, value: (p.stats[stat] || 0) as number }));
    };

    const mvps = getTopPlayersByStat('mvpMatches', 1);
    const topScorers = getTopPlayersByStat('goals');
    const topAssists = getTopPlayersByStat('assists');
    const topDefenders = [...leagueData.players].filter(p => p.position === "Zagueiro" || p.position === "Goleiro").sort((a,b) => b.stats.tackles - a.stats.tackles).slice(0, 3).map(p => ({ player: p, value: p.stats.tackles }));
    const mostCarded = [...leagueData.players]
        .map(p => ({ player: p, value: { yellow: p.stats.yellowCards, red: p.stats.redCards }, cardScore: p.stats.yellowCards + p.stats.redCards * 2 }))
        .sort((a, b) => b.cardScore - a.cardScore)
        .slice(0, 3);
    const topDribblers = getTopPlayersByStat('dribbles');

    return (
        <>
            <div className="container mx-auto px-4 py-10 space-y-12">
                <MatchesCarousel allMatches={leagueData.matches} allRounds={leagueData.rounds} allTeams={leagueData.teams} />
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
                    <div>
                        <ClassificationPanel standingsA={leagueData.standingsGroupA} standingsB={leagueData.standingsGroupB} teams={leagueData.teams} />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-oswald text-xl font-bold uppercase">Estatísticas</h2>
                            <Link to="/stats" className="text-xs text-neutral-400 hover:text-yellow-300 transition-colors">Ver mais</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <StatsCard title="MVP" players={mvps} teams={leagueData.teams} type="mvp" />
                            <StatsCard title="Máximo Artilheiro" players={topScorers} teams={leagueData.teams} />
                            <StatsCard title="Máximo Assistente" players={topAssists} teams={leagueData.teams} />
                            <StatsCard title="Defesas" players={topDefenders} teams={leagueData.teams} type="defesas"/>
                            <StatsCard title="Cartões" players={mostCarded} teams={leagueData.teams} />
                            <StatsCard title="Drible" players={topDribblers} teams={leagueData.teams} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const ClassificationPage: React.FC = () => {
    const { leagueData } = useLeagueData()!;
    const unifiedStandings = [...leagueData.standingsGroupA, ...leagueData.standingsGroupB]
        .sort((a, b) => {
            if (a.pts !== b.pts) return b.pts - a.pts;
            if (a.sg !== b.sg) return b.sg - a.sg;
            if (a.gp !== b.gp) return b.gp - a.gp;
            return a.teamId.localeCompare(b.teamId);
        })
        .map((standing, index) => ({ ...standing, position: index + 1 }));

    return (
    <>
        <PageHeader title="CLASSIFICAÇÃO" />
         <div className="bg-neutral-950/50 border-b border-neutral-800">
          <div className="container mx-auto px-4 py-4 flex justify-end items-center">
             <div className="flex justify-end items-center space-x-2">
                <button className="bg-gradient-to-r from-green-500 via-yellow-400 to-blue-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-yellow-400/20 hover:scale-105">Brasileirão FBF</button>
                <div className="relative">
                    <select className="appearance-none bg-neutral-800 border border-neutral-700 text-white font-semibold py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm hover:border-neutral-600 focus:border-green-500">
                        <option>Season 1</option>
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">
            <h3 className="font-oswald text-xl font-bold mb-4 bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text">CLASSIFICAÇÃO GERAL</h3>
            <StandingsTable standings={unifiedStandings} teams={leagueData.teams} />
             <div className="mt-16">
                <MatchesCarousel allMatches={leagueData.matches} allRounds={leagueData.rounds} allTeams={leagueData.teams} />
            </div>
        </main>
    </>
)};

const GamesPage: React.FC = () => {
    const { leagueData } = useLeagueData()!;
    const [currentPage, setCurrentPage] = useState(1);
    const ROUNDS_PER_PAGE = 4;

    const sortedRounds = [...leagueData.rounds].sort((a,b) => a.order - b.order);
    
    const paginatedRounds = sortedRounds.slice(
        (currentPage - 1) * ROUNDS_PER_PAGE,
        currentPage * ROUNDS_PER_PAGE
    );

    return (
    <>
        <PageHeader title="JOGOS" />
        <div className="bg-neutral-950/50 border-b border-neutral-800">
          <div className="container mx-auto px-4 py-4 flex justify-end items-center">
             <div className="flex justify-end items-center space-x-2">
                <button className="bg-gradient-to-r from-green-500 via-yellow-400 to-blue-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-yellow-400/20 hover:scale-105">Brasileirão FBF</button>
                <div className="relative">
                    <select className="appearance-none bg-neutral-800 border border-neutral-700 text-white font-semibold py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm hover:border-neutral-600 focus:border-green-500">
                        <option>Season 1</option>
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">
           {paginatedRounds.map(round => {
             const roundMatches = leagueData.matches.filter(m => m.roundId === round.id);
             if (roundMatches.length === 0) return null;

             return (
                <div key={round.id} className="mb-12">
                    <h2 className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white font-oswald font-bold py-1 px-4 rounded-md mb-4">{round.name.toUpperCase()}</h2>
                    
                    <div className="hidden md:grid grid-cols-[1fr_1fr_5fr_1fr] gap-4 px-4 py-2 text-xs text-neutral-500 uppercase font-oswald tracking-wider">
                        <span>Data</span>
                        <span>Horário</span>
                        <span className="text-center">Jogo</span>
                        <span className="text-center">Status</span>
                    </div>

                    <div className="space-y-2">
                        {roundMatches.map(match => (
                            <MatchListItem key={match.id} match={match} teams={leagueData.teams} />
                        ))}
                    </div>
                </div>
             );
           })}
           <Pagination
                totalItems={sortedRounds.length}
                itemsPerPage={ROUNDS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </main>
    </>
)};

const TeamsPage: React.FC = () => {
    const { leagueData } = useLeagueData()!;
    return (
    <>
        <PageHeader title="TIMES" />
        <div className="bg-neutral-950/50 border-b border-neutral-800">
          <div className="container mx-auto px-4 py-4 flex justify-end items-center">
             <div className="flex justify-end items-center space-x-2">
                <button className="bg-gradient-to-r from-green-500 via-yellow-400 to-blue-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-yellow-400/20 hover:scale-105">Brasileirão FBF</button>
                <div className="relative">
                    <select className="appearance-none bg-neutral-800 border border-neutral-700 text-white font-semibold py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm hover:border-neutral-600 focus:border-green-500">
                        <option>Season 1</option>
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {leagueData.teams.filter(t => t.cardImageUrl || t.colors).map(team => <TeamCard key={team.id} team={team} />)}
            </div>
             <div className="mt-16">
                <MatchesCarousel allMatches={leagueData.matches} allRounds={leagueData.rounds} allTeams={leagueData.teams} />
            </div>
        </main>
    </>
)};

const PlayersPage: React.FC = () => {
    const { leagueData } = useLeagueData()!;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeamId, setSelectedTeamId] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 24;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedTeamId]);

    const filteredPlayers = leagueData.players.filter(player => {
        const nameMatch = player.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const teamMatch = selectedTeamId === 'all' || player.teamId === selectedTeamId;
        return nameMatch && teamMatch;
    });

    const paginatedPlayers = filteredPlayers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <>
            <PageHeader title="JOGADORES" />
            <div className="bg-neutral-950/50 border-b border-neutral-800">
                <div className="container mx-auto px-4 py-4 flex justify-end items-center">
                    <div className="flex items-center space-x-2">
                        <button className="bg-gradient-to-r from-green-500 via-yellow-400 to-blue-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-yellow-400/20 hover:scale-105">Brasileirão FBF</button>
                        
                        <div className="relative">
                            <select className="appearance-none bg-neutral-800 border border-neutral-700 text-white font-semibold py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm hover:border-neutral-600 focus:border-green-500">
                                <option>Season 1</option>
                            </select>
                            <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        
                        <div className="relative">
                            <select 
                                value={selectedTeamId}
                                onChange={(e) => setSelectedTeamId(e.target.value)}
                                className="appearance-none bg-neutral-800 border border-neutral-700 text-white font-semibold py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm w-48 hover:border-neutral-600 focus:border-green-500"
                            >
                                <option value="all">Time</option>
                                {leagueData.teams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <input 
                                type="text"
                                placeholder="Pesquisar"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-neutral-800 border border-neutral-700 text-white font-semibold py-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm w-48 hover:border-neutral-600 focus:border-green-500"
                            />
                            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                </div>
            </div>
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginatedPlayers.map(player => {
                        const team = leagueData.teams.find(t => t.id === player.teamId);
                        if (!team) return null;
                        return <PlayerCard key={player.id} player={player} team={team} />;
                    })}
                </div>
                <Pagination
                    totalItems={filteredPlayers.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </main>
        </>
    );
};

const StatsPage: React.FC = () => {
    const { leagueData } = useLeagueData()!;
    const [activeTab, setActiveTab] = useState<'player' | 'team'>('player');
    const [activePlayerCat, setActivePlayerCat] = useState('Resumo');
    const [activeTeamCat, setActiveTeamCat] = useState('Gols');
    
    const playerCategories = ['Resumo', 'Gols', 'Assistências', 'Zagueiro', 'Goleiro', 'Cartões', 'MVP Jogo'];
    const teamCategories = ['Resumo', 'Gols', 'Chutes a gol', 'Passes', 'Ataques', 'Defesas', 'Cartões', 'Gols esperados'];
    
    const renderPlayerContent = () => {
        switch(activePlayerCat) {
            case 'Resumo':
                const mvps = [...leagueData.players].sort((a,b) => b.stats.mvpMatches - a.stats.mvpMatches).slice(0, 1)
                    .map(p => ({ player: p, value: p.stats.mvpMatches }));

                const topScorers = [...leagueData.players].sort((a,b) => b.stats.goals - a.stats.goals).slice(0,3)
                    .map(p => ({ player: p, value: p.stats.goals }));

                const topAssists = [...leagueData.players].sort((a,b) => b.stats.assists - a.stats.assists).slice(0,3)
                    .map(p => ({ player: p, value: p.stats.assists }));
                    
                const topDefenders = [...leagueData.players].filter(p => p.position === "Zagueiro" || p.position === "Goleiro").sort((a,b) => b.stats.tackles - a.stats.tackles).slice(0,3)
                    .map(p => ({ player: p, value: p.stats.tackles }));

                const mostCarded = [...leagueData.players]
                    .map(p => ({ player: p, value: { yellow: p.stats.yellowCards, red: p.stats.redCards }, cardScore: p.stats.yellowCards + p.stats.redCards * 2 }))
                    .sort((a,b) => b.cardScore - a.cardScore)
                    .slice(0,3);
                
                const topDribblers = [...leagueData.players].sort((a,b) => (b.stats.dribbles || 0) - (a.stats.dribbles || 0)).slice(0,3)
                    .map(p => ({ player: p, value: p.stats.dribbles || 0 }));
                    
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatsCard title="MVP" players={mvps} teams={leagueData.teams} type="mvp" />
                        <StatsCard title="Máximo Artilheiro" players={topScorers} teams={leagueData.teams} />
                        <StatsCard title="Máximo Assistente" players={topAssists} teams={leagueData.teams} />
                        <StatsCard title="Defesas" players={topDefenders} teams={leagueData.teams} type="defesas"/>
                        <StatsCard title="Cartões" players={mostCarded} teams={leagueData.teams} />
                        <StatsCard title="Drible" players={topDribblers} teams={leagueData.teams} />
                    </div>
                );
            default:
                return <div className="text-center py-20 bg-neutral-900 rounded-2xl border border-neutral-800"><p>Estatísticas de {activePlayerCat} em breve.</p></div>
        }
    }
    
    const renderTeamContent = () => {
        switch(activeTeamCat) {
            case 'Gols':
                return <TeamStatsTable teams={leagueData.teams} />;
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
                     <div className="flex justify-end items-center space-x-2">
                        <button className="bg-gradient-to-r from-green-500 via-yellow-400 to-blue-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-yellow-400/20 hover:scale-105">Brasileirão FBF</button>
                        <div className="relative">
                            <select className="appearance-none bg-neutral-800 border border-neutral-700 text-white font-semibold py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm hover:border-neutral-600 focus:border-green-500">
                                <option>Season 1</option>
                            </select>
                            <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
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
                <div className="mt-16">
                    <MatchesCarousel allMatches={leagueData.matches} allRounds={leagueData.rounds} allTeams={leagueData.teams} />
                </div>
            </main>
        </>
    );
};

const PlayerDetailPage: React.FC = () => {
    const { leagueData } = useLeagueData()!;
    const { playerId } = useParams<{ playerId: string }>();
    const player = leagueData.players.find(p => p.id === playerId);

    if (!player) return <div className="text-center py-20">Jogador não encontrado.</div>;

    const team = leagueData.teams.find(t => t.id === player.teamId);
    if (!team) return <div className="text-center py-20">Time do jogador não encontrado.</div>;
    
    const teamGradient = team.cardGradient || 'from-neutral-800 to-neutral-900';
    const playerMatches = leagueData.matches.filter(m => m.homeTeamId === player.teamId || m.awayTeamId === player.teamId).slice(0, 5);

    const attributes = [
        { label: 'Físico' }, { label: 'Drible' }, { label: 'Chute' },
        { label: 'Defesa' }, { label: 'Passe' }, { label: 'Habilidade' },
    ];
    
    const seasonStatsPrimary = [
        { label: 'MVP Jogo', value: player.stats.mvpMatches },
        { label: 'MVP Rodada', value: 0 },
        { label: 'Gols', value: player.stats.goals },
        { label: 'Assistências', value: player.stats.assists },
        { label: 'Cartões amarelos', value: player.stats.yellowCards },
        { label: 'Cartões vermelhos', value: player.stats.redCards },
    ];

    return (
        <div className="bg-neutral-950 min-h-screen">
            <div className="bg-neutral-950/50 border-b border-neutral-800 sticky top-20 z-40">
                <div className="container mx-auto px-4 py-4 flex justify-end items-center">
                    <div className="flex items-center space-x-2">
                        <button className="bg-gradient-to-r from-green-500 via-yellow-400 to-blue-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-yellow-400/20 hover:scale-105">Brasileirão FBF</button>
                        <div className="relative">
                            <select className="appearance-none bg-neutral-800 border border-neutral-700 text-white font-semibold py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm">
                                <option>Season 1</option>
                            </select>
                            <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
            <main className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12">
                    {/* Left Column: Player Card */}
                    <div className="w-full">
                         <div className={`group relative bg-gradient-to-br ${teamGradient} rounded-2xl p-1`}>
                            <div className="absolute inset-0 rounded-2xl opacity-20" style={{backgroundImage: `url('https://res.cloudinary.com/practicaldev/image/fetch/s--2J_E0T9c--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://res.cloudinary.com/d2s5naq1k/image/upload/v1580393498/bg-pattern_ylse2k.png')`}}></div>
                            <div className={`relative bg-neutral-900 rounded-[15px] py-64 px-4 flex flex-col items-center text-center`}>
                                <img src={team.logoUrl} alt={`${team.name} logo`} className="w-20 h-20 absolute top-4 left-4 z-10" />
                                <img src={player.photoUrl} alt={player.fullName} className="w-full max-w-[300px] object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105" />
                            </div>
                         </div>
                    </div>
                    
                    {/* Right Column: Player Info & Stats */}
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="font-oswald text-5xl font-bold uppercase bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text">{player.fullName}</h1>
                                <p className="text-xl text-neutral-400">{player.position}</p>
                            </div>
                             <div className="text-center shadow-lg w-24 bg-gradient-to-br from-green-500/80 via-yellow-400/80 to-blue-500/80 rounded-md p-0.5">
                                <div className="bg-neutral-900 rounded-[5px] py-1">
                                    <p className="text-xs font-bold uppercase text-neutral-300">Média</p>
                                    <p className="text-3xl font-oswald font-bold leading-none bg-gradient-to-br from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text">
                                        {player.ratings.average > 0 ? player.ratings.average : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-6 text-sm mb-8 border-b border-neutral-800 pb-6">
                            <div>
                                <span className="text-neutral-500">Time</span>
                                <Link to={`/teams/${team.id}`} className="block font-bold text-white hover:text-green-400 transition-colors">{team.name}</Link>
                            </div>
                             <div>
                                <span className="text-neutral-500">País</span>
                                <p className="font-bold text-white">{player.nationality}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-10">
                            {attributes.map(attr => (
                                <div key={attr.label} className="bg-neutral-900 p-3 rounded-lg text-center border border-neutral-800 transition-all duration-300 hover:-translate-y-1 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/10">
                                    <p className="text-neutral-400 text-xs">{attr.label}</p>
                                    <p className="text-2xl font-oswald font-bold">-</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Games Section */}
                            <div>
                                <h3 className="font-oswald text-lg font-bold uppercase tracking-wider mb-3 bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text inline-block">JOGOS</h3>
                                <div className="space-y-2">
                                    {playerMatches.map((match, index) => {
                                        const homeTeam = leagueData.teams.find(t => t.id === match.homeTeamId)!;
                                        const awayTeam = leagueData.teams.find(t => t.id === match.awayTeamId)!;
                                        return (
                                            <div key={match.id} className="flex items-center bg-neutral-900 p-2 rounded-md border border-neutral-800 text-sm">
                                                <span className="text-neutral-500 w-8 text-center">{index + 1}</span>
                                                <div className="flex items-center gap-2 flex-1 justify-end">
                                                    <span className="font-bold">{homeTeam.name.substring(0,3).toUpperCase()}</span>
                                                    <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-6 h-6" />
                                                </div>
                                                <div className="font-oswald font-bold text-base px-2">{match.scoreHome} <span className="text-neutral-600">vs</span> {match.scoreAway}</div>
                                                <div className="flex items-center gap-2 flex-1">
                                                    <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-6 h-6" />
                                                    <span className="font-bold">{awayTeam.name.substring(0,3).toUpperCase()}</span>
                                                </div>
                                                <ArrowRightIcon className="w-4 h-4 text-neutral-600"/>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Season Stats Section */}
                            <div>
                                <h3 className="font-oswald text-lg font-bold uppercase tracking-wider mb-3 bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text inline-block">TEMPORADA</h3>
                                <div className="bg-neutral-900 p-3 rounded-md border border-neutral-800">
                                    <div className="grid grid-cols-3 gap-2">
                                        {seasonStatsPrimary.map(stat => (
                                            <div key={stat.label} className={`text-center p-2 rounded transition-all duration-300 hover:-translate-y-1 ${stat.label.includes('MVP') ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-neutral-800/50 hover:bg-neutral-800/80'}`}>
                                                <p className="font-oswald font-bold text-xl">{stat.value}</p>
                                                <p className="text-xs text-neutral-400">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="mt-16">
                    <h2 className="font-oswald text-3xl font-bold mb-4 uppercase text-neutral-300">MAIS JOGADORES</h2>
                    <MorePlayersCarousel />
                    <div className="text-center mt-6">
                        <Link to="/players" className="inline-block border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-md hover:bg-yellow-400 hover:text-black transition-colors duration-300">
                            Ver Jogadores
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

const TeamDetailPage: React.FC = () => {
    const { leagueData } = useLeagueData()!;
    const { teamId } = useParams<{ teamId: string }>();
    const team = leagueData.teams.find(t => t.id === teamId);

    if (!team) return <div className="text-center py-20">Time não encontrado.</div>;
    
    const teamPlayers = leagueData.players.filter(p => p.teamId === teamId);
    
    const managerPlayer: Player | null = team.manager ? {
        id: `manager-${team.id}`, number: 0, fullName: team.manager, position: 'Treinador', teamId: team.id,
        firstName: '', lastName: '', birthDate: '', nationality: '', photoUrl: '', 
        ratings: { average: 0 } as any, stats: {} as any,
    } : null;

    const roster = managerPlayer ? [managerPlayer, ...teamPlayers] : teamPlayers;
    const teamMatches = leagueData.matches.filter(match => match.homeTeamId === teamId || match.awayTeamId === teamId);
    const unifiedStandings = [...leagueData.standingsGroupA, ...leagueData.standingsGroupB]
        .sort((a, b) => b.pts - a.pts || b.sg - a.sg || b.gp - a.gp || a.teamId.localeCompare(b.teamId))
        .map((standing, index) => ({ ...standing, position: index + 1 }));

    const standing = unifiedStandings.find(s => s.teamId === teamId);
    const totalYellowCards = teamPlayers.reduce((sum, player) => sum + player.stats.yellowCards, 0);
    const totalRedCards = teamPlayers.reduce((sum, player) => sum + player.stats.redCards, 0);

    return (
        <>
            <TeamDetailHeader team={team} standing={standing} totalYellowCards={totalYellowCards} totalRedCards={totalRedCards} />
            <main className="container mx-auto px-4 py-8">
                 <div className="mb-16">
                    <MatchesCarousel teamMatches={teamMatches} allTeams={leagueData.teams} />
                 </div>
                 <h2 className="font-oswald text-3xl font-bold mb-6">ELENCO</h2>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-1">
                        <PresidentCard team={team} />
                    </div>
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {roster.map(player => <PlayerCard key={player.id} player={player} team={team} />)}
                    </div>
                </div>
            </main>
        </>
    )
};

const MatchDetailPage: React.FC = () => {
    const { leagueData, editMatch } = useLeagueData()!;
    const { matchId } = useParams<{ matchId: string }>();
    const { currentUser } = useAuth();
    const [editModalView, setEditModalView] = useState<'closed' | 'main' | 'edit-result' | 'set-status' | 'edit-stats' | 'edit-lineups' | 'edit-mvp'>('closed');

    const match = leagueData.matches.find(m => m.id === matchId);

    if (!match) return <div className="text-center py-20">Jogo não encontrado.</div>;

    const homeTeam = leagueData.teams.find(t => t.id === match.homeTeamId)!;
    const awayTeam = leagueData.teams.find(t => t.id === match.awayTeamId)!;

    const homePlayers = leagueData.players.filter(p => p.teamId === homeTeam.id);
    const awayPlayers = leagueData.players.filter(p => p.teamId === awayTeam.id);
    
    const goalEvents = match.events.filter(e => e.type === MatchEventType.GOAL);
    const homeGoalsDetails = goalEvents.filter(e => e.teamId === homeTeam.id).map(e => `${e.playerName} ${e.minute}'`).join('\n');
    const awayGoalsDetails = goalEvents.filter(e => e.teamId === awayTeam.id).map(e => `${e.playerName} ${e.minute}'`).join('\n');

    const statusText: {[key in MatchStatus]: string} = {
        [MatchStatus.SCHEDULED]: 'Agendado',
        [MatchStatus.LIVE]: 'Ao Vivo',
        [MatchStatus.FINISHED]: 'Finalizado',
        [MatchStatus.POSTPONED]: 'Adiado',
        [MatchStatus.WALKOVER]: 'W.O.',
    };

    const statsList = match.stats ? [
        { label: 'Total de gols', home: match.scoreHome, away: match.scoreAway }, { label: 'Gols', home: homeGoalsDetails || '-', away: awayGoalsDetails || '-' },
        { label: 'Posse de Bola', home: match.stats.posseDeBola.home, away: match.stats.posseDeBola.away, isBar: true }, { label: 'Precisão de Chutes', home: `${match.stats.precisaoChutes.home}%`, away: `${match.stats.precisaoChutes.away}%` },
        { label: 'Precisão de Passe', home: `${match.stats.precisaoPasse.home}%`, away: `${match.stats.precisaoPasse.away}%` }, { label: 'Finalização á Gol', home: match.stats.finalizacoesGol.home, away: match.stats.finalizacoesGol.away },
        { label: 'Passes', home: match.stats.passes.home, away: match.stats.passes.away }, { label: 'Defesas', home: match.stats.defesas.home, away: match.stats.defesas.away },
        { label: 'Intercepções', home: match.stats.intercepcoes.home, away: match.stats.intercepcoes.away }, { label: 'Impedimento', home: match.stats.impedimentos.home, away: match.stats.impedimentos.away },
        { label: 'Faltas', home: match.stats.faltas.home, away: match.stats.faltas.away }, { label: 'Cartões Amarelos', home: match.stats.cartoesAmarelos.home, away: match.stats.cartoesAmarelos.away },
        { label: 'Cartões Vermelhos', home: match.stats.cartoesVermelhos.home, away: match.stats.cartoesVermelhos.away },
    ] : [];

    const PlayerRow: React.FC<{ player: Player }> = ({ player }) => (
        <Link to={`/players/${player.id}`} className="flex items-center justify-between p-3 border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="font-bold text-lg text-neutral-500 w-6 text-center">#{player.number}</div>
                <div>
                    <p className="font-bold text-white">{player.fullName}</p>
                    <p className="text-xs text-neutral-400">{player.position}</p>
                </div>
            </div>
            <span className="text-xs text-neutral-500">Estatísticas</span>
        </Link>
    );
    
    const AdminActionSelectModal: React.FC<{ onClose: () => void; onSelect: (view: 'edit-result' | 'set-status' | 'edit-stats' | 'edit-lineups' | 'edit-mvp') => void }> = ({ onClose, onSelect }) => (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] animate-fade-in" onClick={onClose}>
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-8 w-full max-w-md animate-slide-in-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-oswald text-2xl font-bold bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text">Editar Partida</h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors" aria-label="Fechar Modal"><XIcon className="w-6 h-6" /></button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <button onClick={() => onSelect('edit-result')} className="w-full text-left font-semibold py-3 px-4 rounded-md transition-all duration-300 text-white bg-neutral-800 hover:bg-neutral-700">Editar Resultado</button>
                    <button onClick={() => onSelect('set-status')} className="w-full text-left font-semibold py-3 px-4 rounded-md transition-all duration-300 text-white bg-neutral-800 hover:bg-neutral-700">Definir Status</button>
                    <button onClick={() => onSelect('edit-stats')} className="w-full text-left font-semibold py-3 px-4 rounded-md transition-all duration-300 text-white bg-neutral-800 hover:bg-neutral-700">Editar Estatísticas</button>
                    <button onClick={() => onSelect('edit-lineups')} className="w-full text-left font-semibold py-3 px-4 rounded-md transition-all duration-300 text-white bg-neutral-800 hover:bg-neutral-700">Editar Escalações</button>
                    <button onClick={() => onSelect('edit-mvp')} className="w-full text-left font-semibold py-3 px-4 rounded-md transition-all duration-300 text-white bg-neutral-800 hover:bg-neutral-700">Editar MVP da Partida</button>
                </div>
            </div>
        </div>
    );

    const SetStatusModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
        const handleSetStatus = (status: MatchStatus) => {
            editMatch(match.id, { status });
            onClose();
        };
        const statuses: { label: string; value: MatchStatus }[] = [
            { label: 'Agendado', value: MatchStatus.SCHEDULED }, { label: 'Finalizado', value: MatchStatus.FINISHED },
            { label: 'W.O.', value: MatchStatus.WALKOVER }, { label: 'Adiado', value: MatchStatus.POSTPONED },
        ];
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] animate-fade-in" onClick={onClose}>
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-8 w-full max-w-md animate-slide-in-up" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6"><h2 className="font-oswald text-2xl font-bold">Definir Status</h2><button onClick={onClose} className="text-neutral-500 hover:text-white"><XIcon className="w-6 h-6" /></button></div>
                    <div className="grid grid-cols-2 gap-4">
                        {statuses.map(s => <button key={s.value} onClick={() => handleSetStatus(s.value)} className="w-full font-semibold py-3 px-4 rounded-md transition-all text-white bg-neutral-800 hover:bg-neutral-700">{s.label}</button>)}
                    </div>
                </div>
            </div>
        );
    };

    const EditResultModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
        const [formData, setFormData] = useState<Partial<Match>>(match);
        const [newGoal, setNewGoal] = useState<{ teamId: string; playerId: string; minute: string }>({ teamId: homeTeam.id, playerId: homePlayers[0]?.id || '', minute: '' });

        useEffect(() => {
            const homeGoals = formData.events?.filter(e => e.type === MatchEventType.GOAL && e.teamId === homeTeam.id).length || 0;
            const awayGoals = formData.events?.filter(e => e.type === MatchEventType.GOAL && e.teamId === awayTeam.id).length || 0;
            if (formData.scoreHome !== homeGoals || formData.scoreAway !== awayGoals) {
                setFormData(prev => ({ ...prev, scoreHome: homeGoals, scoreAway: awayGoals }));
            }
        }, [formData.events, homeTeam.id, awayTeam.id, formData.scoreHome, formData.scoreAway]);

        const handleGoalAdd = () => {
            if (!newGoal.playerId || !newGoal.minute) { alert('Selecione um jogador e insira o minuto.'); return; }
            const player = [...homePlayers, ...awayPlayers].find(p => p.id === newGoal.playerId);
            const newEvent: MatchEvent = { id: `evt-${Date.now()}`, minute: parseInt(newGoal.minute), type: MatchEventType.GOAL, teamId: newGoal.teamId, playerName: player?.fullName };
            setFormData(prev => ({ ...prev, events: [...(prev.events || []), newEvent] }));
            setNewGoal({ ...newGoal, minute: '' });
        };
        const handleGoalRemove = (eventId: string) => {
            setFormData(prev => ({ ...prev, events: prev.events?.filter(e => e.id !== eventId) }));
        };
        const handleSave = () => { editMatch(match.id, formData); onClose(); };
        const goalEvents = formData.events?.filter(e => e.type === MatchEventType.GOAL) || [];
        const playersForSelectedTeam = newGoal.teamId === homeTeam.id ? homePlayers : awayPlayers;

        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={onClose}>
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-2xl animate-slide-in-up" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4"><h2 className="font-oswald text-2xl font-bold">Editar Resultado</h2><button onClick={onClose}><XIcon className="w-6 h-6" /></button></div>
                    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
                        <div>
                            <FormLabel required>Definir Resultado: {formData.scoreHome} x {formData.scoreAway}</FormLabel>
                            <div className="grid grid-cols-2 gap-4">
                                <div>{goalEvents.filter(e => e.teamId === homeTeam.id).map(e => <div key={e.id} className="flex justify-between items-center bg-neutral-800 p-1 px-2 rounded text-sm mb-1"><span>{e.playerName} ({e.minute}')</span><button onClick={() => handleGoalRemove(e.id)} className="text-red-500 hover:text-red-400">&times;</button></div>)}</div>
                                <div>{goalEvents.filter(e => e.teamId === awayTeam.id).map(e => <div key={e.id} className="flex justify-between items-center bg-neutral-800 p-1 px-2 rounded text-sm mb-1"><span>{e.playerName} ({e.minute}')</span><button onClick={() => handleGoalRemove(e.id)} className="text-red-500 hover:text-red-400">&times;</button></div>)}</div>
                            </div>
                            <div className="flex items-end gap-2 mt-2 p-2 border border-neutral-700 rounded-md">
                                <div className="flex-1"><FormLabel>Time</FormLabel><FormSelect value={newGoal.teamId} onChange={e => setNewGoal({ ...newGoal, teamId: e.target.value, playerId: (e.target.value === homeTeam.id ? homePlayers[0]?.id : awayPlayers[0]?.id) || '' })}><option value={homeTeam.id}>{homeTeam.name}</option><option value={awayTeam.id}>{awayTeam.name}</option></FormSelect></div>
                                <div className="flex-1"><FormLabel>Jogador</FormLabel><FormSelect value={newGoal.playerId} onChange={e => setNewGoal({ ...newGoal, playerId: e.target.value })}>{playersForSelectedTeam.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}</FormSelect></div>
                                <div className="w-20"><FormLabel>Minuto</FormLabel><FormInput type="number" value={newGoal.minute} onChange={e => setNewGoal({ ...newGoal, minute: e.target.value })} /></div>
                                <button onClick={handleGoalAdd} className="bg-green-600 px-3 py-2 rounded-md text-sm">Adicionar Gol</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><FormLabel>Alterar Data</FormLabel><FormInput type="date" value={formData.date?.split('T')[0]} onChange={e => setFormData({ ...formData, date: e.target.value })} /></div>
                            <div><FormLabel>Alterar Horário</FormLabel><FormInput type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} /></div>
                        </div>
                        <div><FormLabel required>Definir Estádio</FormLabel><FormInput value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} /></div>
                        <div><FormLabel>Link dos Melhores Momentos (Vídeo)</FormLabel><FormInput type="url" placeholder="https://youtube.com/..." value={formData.highlightsUrl} onChange={e => setFormData({ ...formData, highlightsUrl: e.target.value })} /></div>
                    </div>
                    <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-neutral-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600">Cancelar</button>
                        <button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700">Salvar Alterações</button>
                    </div>
                </div>
            </div>
        );
    };

    const EditStatsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
        const defaultStats: MatchStatsData = { posseDeBola: { home: 0, away: 0 }, precisaoChutes: { home: 0, away: 0 }, precisaoPasse: { home: 0, away: 0 }, finalizacoesGol: { home: 0, away: 0 }, passes: { home: 0, away: 0 }, defesas: { home: 0, away: 0 }, intercepcoes: { home: 0, away: 0 }, impedimentos: { home: 0, away: 0 }, faltas: { home: 0, away: 0 }, cartoesAmarelos: { home: 0, away: 0 }, cartoesVermelhos: { home: 0, away: 0 }, golsShootout: { home: 0, away: 0 }, golDePenalti: { home: 0, away: 0 }, golsDuplos: { home: 0, away: 0 }, xGols: { home: 0, away: 0 }, totalChutes: { home: 0, away: 0 }, chutesNaTrave: { home: 0, away: 0 }, escanteios: { home: 0, away: 0 } };
        const [stats, setStats] = useState<MatchStatsData>(match.stats || defaultStats);
        const [events, setEvents] = useState<MatchEvent[]>(match.events || []);
        const [newCard, setNewCard] = useState({ type: MatchEventType.YELLOW_CARD, teamId: homeTeam.id, playerId: homePlayers[0]?.id || '', minute: '' });
        
        const handleStatChange = (statKey: keyof MatchStatsData, team: 'home' | 'away', value: string) => {
            const numericValue = parseInt(value, 10);
            if (isNaN(numericValue)) return;
            setStats(prev => ({ ...prev, [statKey]: { ...prev[statKey], [team]: numericValue } }));
        };

        const handleAddCard = () => {
            const player = [...homePlayers, ...awayPlayers].find(p => p.id === newCard.playerId);
            if (!player || !newCard.minute) { alert('Selecione um jogador e insira o minuto do cartão.'); return; }
            const newEvent: MatchEvent = { id: `evt-card-${Date.now()}`, minute: parseInt(newCard.minute), type: newCard.type, teamId: newCard.teamId, playerName: player.fullName };
            setEvents(prev => [...prev, newEvent]);
        };
        const handleRemoveCard = (eventId: string) => setEvents(prev => prev.filter(e => e.id !== eventId));

        const handleSave = () => {
            const yellowHome = events.filter(e => e.type === MatchEventType.YELLOW_CARD && e.teamId === homeTeam.id).length;
            const yellowAway = events.filter(e => e.type === MatchEventType.YELLOW_CARD && e.teamId === awayTeam.id).length;
            const redHome = events.filter(e => e.type === MatchEventType.RED_CARD && e.teamId === homeTeam.id).length;
            const redAway = events.filter(e => e.type === MatchEventType.RED_CARD && e.teamId === awayTeam.id).length;
            const finalStats = { ...stats, cartoesAmarelos: { home: yellowHome, away: yellowAway }, cartoesVermelhos: { home: redHome, away: redAway }};
            editMatch(match.id, { stats: finalStats, events });
            onClose();
        };

        const playersForSelectedTeam = newCard.teamId === homeTeam.id ? homePlayers : awayPlayers;
        const statFields: { key: keyof MatchStatsData; label: string; isPercentage?: boolean }[] = [
            { key: 'posseDeBola', label: 'Posse de Bola', isPercentage: true }, { key: 'precisaoChutes', label: 'Precisão de Chutes', isPercentage: true }, { key: 'precisaoPasse', label: 'Precisão de Passe', isPercentage: true }, { key: 'finalizacoesGol', label: 'Finalizações a Gol' },
            { key: 'passes', label: 'Passes' }, { key: 'defesas', label: 'Defesas' }, { key: 'intercepcoes', label: 'Intercepções' }, { key: 'impedimentos', label: 'Impedimentos' }, { key: 'faltas', label: 'Faltas' }
        ];

        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={onClose}>
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-3xl animate-slide-in-up" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4"><h2 className="font-oswald text-2xl font-bold">Editar Estatísticas</h2><button onClick={onClose}><XIcon className="w-6 h-6" /></button></div>
                    <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-4">
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4"><div className="font-bold text-lg text-center">{homeTeam.name}</div><div></div><div className="font-bold text-lg text-center">{awayTeam.name}</div></div>
                        {statFields.map(({ key, label, isPercentage }) => (
                            <div key={key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4">
                                <FormInput type="number" value={stats[key].home} onChange={e => handleStatChange(key, 'home', e.target.value)} />
                                <FormLabel>{label} {isPercentage ? '(%)' : ''}</FormLabel>
                                <FormInput type="number" value={stats[key].away} onChange={e => handleStatChange(key, 'away', e.target.value)} />
                            </div>
                        ))}
                        {([MatchEventType.YELLOW_CARD, MatchEventType.RED_CARD] as const).map(cardType => {
                            const title = cardType === MatchEventType.YELLOW_CARD ? 'Cartões Amarelos' : 'Cartões Vermelhos';
                            const cardEvents = events.filter(e => e.type === cardType);
                            return (<div key={cardType} className="pt-4 border-t border-neutral-800">
                                <FormLabel required>{title}: {cardEvents.filter(e=>e.teamId === homeTeam.id).length} x {cardEvents.filter(e=>e.teamId === awayTeam.id).length}</FormLabel>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>{cardEvents.filter(e => e.teamId === homeTeam.id).map(e => <div key={e.id} className="flex justify-between items-center bg-neutral-800 p-1 px-2 rounded text-sm mb-1"><span>{e.playerName} ({e.minute}')</span><button onClick={() => handleRemoveCard(e.id)} className="text-red-500 hover:text-red-400">&times;</button></div>)}</div>
                                    <div>{cardEvents.filter(e => e.teamId === awayTeam.id).map(e => <div key={e.id} className="flex justify-between items-center bg-neutral-800 p-1 px-2 rounded text-sm mb-1"><span>{e.playerName} ({e.minute}')</span><button onClick={() => handleRemoveCard(e.id)} className="text-red-500 hover:text-red-400">&times;</button></div>)}</div>
                                </div>
                                <div className="flex items-end gap-2 mt-2 p-2 border border-neutral-700 rounded-md">
                                    <div className="flex-1"><FormLabel>Time</FormLabel><FormSelect value={newCard.teamId} onChange={e => setNewCard({ ...newCard, teamId: e.target.value, playerId: (e.target.value === homeTeam.id ? homePlayers[0]?.id : awayPlayers[0]?.id) || '' })}><option value={homeTeam.id}>{homeTeam.name}</option><option value={awayTeam.id}>{awayTeam.name}</option></FormSelect></div>
                                    <div className="flex-1"><FormLabel>Jogador</FormLabel><FormSelect value={newCard.playerId} onChange={e => setNewCard({ ...newCard, playerId: e.target.value })}>{playersForSelectedTeam.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}</FormSelect></div>
                                    <div className="w-20"><FormLabel>Minuto</FormLabel><FormInput type="number" value={newCard.minute} onChange={e => setNewCard({ ...newCard, minute: e.target.value })} /></div>
                                    <button onClick={() => { setNewCard(prev => ({...prev, type: cardType})); handleAddCard(); }} className="bg-green-600 px-3 py-2 rounded-md text-sm whitespace-nowrap">Adicionar Cartão</button>
                                </div>
                            </div>)
                        })}
                    </div>
                    <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-neutral-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600">Cancelar</button>
                        <button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700">Salvar Alterações</button>
                    </div>
                </div>
            </div>
        )
    };

    const EditLineupsModal: React.FC<{
        onClose: () => void;
    }> = ({ onClose }) => {
        const [lineups, setLineups] = useState({
            homeCoach: match.lineups?.homeCoach || homeTeam.manager || '',
            homePlayers: match.lineups?.homePlayers && match.lineups.homePlayers.length > 0 
                ? [...match.lineups.homePlayers, ...Array(7 - match.lineups.homePlayers.length).fill('')] 
                : Array(7).fill(''),
            awayCoach: match.lineups?.awayCoach || awayTeam.manager || '',
            awayPlayers: match.lineups?.awayPlayers && match.lineups.awayPlayers.length > 0 
                ? [...match.lineups.awayPlayers, ...Array(7 - match.lineups.awayPlayers.length).fill('')] 
                : Array(7).fill(''),
        });
    
        const handlePlayerChange = (team: 'home' | 'away', index: number, value: string) => {
            setLineups(prev => {
                const key = team === 'home' ? 'homePlayers' : 'awayPlayers';
                const newPlayers = [...prev[key]];
                newPlayers[index] = value;
                return { ...prev, [key]: newPlayers };
            });
        };
    
        const handleCoachChange = (team: 'home' | 'away', value: string) => {
            setLineups(prev => ({ ...prev, [team === 'home' ? 'homeCoach' : 'awayCoach']: value }));
        };
    
        const handleSave = () => {
            const finalLineups = {
                ...lineups,
                homePlayers: lineups.homePlayers.filter(p => p && p !== ''),
                awayPlayers: lineups.awayPlayers.filter(p => p && p !== ''),
            };
            editMatch(match.id, { lineups: finalLineups });
            onClose();
        };

        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={onClose}>
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-4xl animate-slide-in-up" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4"><h2 className="font-oswald text-2xl font-bold">Editar Escalações</h2><button onClick={onClose}><XIcon className="w-6 h-6" /></button></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto pr-4">
                        {/* Home Team */}
                        <div>
                            <h3 className="font-oswald text-xl font-bold mb-4 flex items-center gap-2"><img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-8 h-8"/>{homeTeam.name}</h3>
                            <div className="space-y-3">
                                <div><FormLabel>Técnico/Presidente</FormLabel><FormInput value={lineups.homeCoach} onChange={e => handleCoachChange('home', e.target.value)} /></div>
                                {[...Array(7)].map((_, i) => (
                                    <div key={`home-player-${i}`}>
                                        <FormLabel>Jogador {i + 1}</FormLabel>
                                        <FormSelect value={lineups.homePlayers[i] || ''} onChange={e => handlePlayerChange('home', i, e.target.value)}>
                                            <option value="">-- Selecione um Jogador --</option>
                                            {homePlayers.map(p => <option key={p.id} value={p.fullName}>{p.fullName}</option>)}
                                        </FormSelect>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Away Team */}
                        <div>
                            <h3 className="font-oswald text-xl font-bold mb-4 flex items-center gap-2"><img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-8 h-8"/>{awayTeam.name}</h3>
                            <div className="space-y-3">
                                <div><FormLabel>Técnico/Presidente</FormLabel><FormInput value={lineups.awayCoach} onChange={e => handleCoachChange('away', e.target.value)} /></div>
                                {[...Array(7)].map((_, i) => (
                                    <div key={`away-player-${i}`}>
                                        <FormLabel>Jogador {i + 1}</FormLabel>
                                        <FormSelect value={lineups.awayPlayers[i] || ''} onChange={e => handlePlayerChange('away', i, e.target.value)}>
                                            <option value="">-- Selecione um Jogador --</option>
                                            {awayPlayers.map(p => <option key={p.id} value={p.fullName}>{p.fullName}</option>)}
                                        </FormSelect>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                     <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-neutral-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600">Cancelar</button>
                        <button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700">Salvar Alterações</button>
                    </div>
                </div>
            </div>
        );
    };
    
    const EditMvpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
        const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
        const [selectedPlayerId, setSelectedPlayerId] = useState<string>(match.mvpPlayerId || '');
    
        useEffect(() => {
            if (match.mvpPlayerId) {
                const mvpPlayer = [...homePlayers, ...awayPlayers].find(p => p.id === match.mvpPlayerId);
                if (mvpPlayer) {
                    setSelectedTeamId(mvpPlayer.teamId);
                }
            }
        }, [match.mvpPlayerId]);
    
    
        const handleTeamSelect = (teamId: string) => {
            setSelectedTeamId(teamId);
            if (teamId !== selectedTeamId) {
                setSelectedPlayerId('');
            }
        };
    
        const handleSave = () => {
            if (!selectedPlayerId) {
                alert("Por favor, selecione um jogador MVP.");
                return;
            }
            editMatch(match.id, { mvpPlayerId: selectedPlayerId });
            onClose();
        };
    
        const playersForSelectedTeam = selectedTeamId === homeTeam.id ? homePlayers : awayPlayers;
    
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={onClose}>
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-lg animate-slide-in-up" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-oswald text-2xl font-bold">Editar MVP da Partida</h2>
                        <button onClick={onClose}><XIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <FormLabel>1. Selecione o Time do MVP</FormLabel>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleTeamSelect(homeTeam.id)}
                                    className={`flex flex-col items-center p-4 rounded-md border-2 transition-colors ${selectedTeamId === homeTeam.id ? 'border-green-500 bg-green-500/10' : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'}`}
                                >
                                    <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-12 h-12 mb-2" />
                                    <span className="font-semibold">{homeTeam.name}</span>
                                </button>
                                 <button
                                    onClick={() => handleTeamSelect(awayTeam.id)}
                                    className={`flex flex-col items-center p-4 rounded-md border-2 transition-colors ${selectedTeamId === awayTeam.id ? 'border-green-500 bg-green-500/10' : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'}`}
                                >
                                    <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-12 h-12 mb-2" />
                                    <span className="font-semibold">{awayTeam.name}</span>
                                </button>
                            </div>
                        </div>
                         {selectedTeamId && (
                            <div>
                                <FormLabel>2. Selecione o Jogador MVP</FormLabel>
                                <FormSelect
                                    value={selectedPlayerId}
                                    onChange={e => setSelectedPlayerId(e.target.value)}
                                    disabled={!selectedTeamId}
                                >
                                    <option value="">-- Selecione um jogador --</option>
                                    {playersForSelectedTeam.map(p => (
                                        <option key={p.id} value={p.id}>{p.fullName}</option>
                                    ))}
                                </FormSelect>
                            </div>
                        )}
                    </div>
                     <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-neutral-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600">Cancelar</button>
                        <button onClick={handleSave} disabled={!selectedPlayerId} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Salvar Alterações</button>
                    </div>
                </div>
            </div>
        );
    };

    const getGradientStyle = (team: Team) => `bg-gradient-to-r ${team.cardGradient || 'from-neutral-800 to-neutral-900'}`;
    const formattedDate = new Date(match.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    const gradientTextClass = "bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 text-transparent bg-clip-text";

    return (
       <div className="bg-neutral-950 text-white min-h-screen">
            <div className="relative h-[60vh] flex items-center justify-center text-center" style={{ backgroundImage: `url('https://i.imgur.com/8N5Y41b.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                 {currentUser && currentUser.role === UserRole.ADMIN && (
                    <button onClick={() => setEditModalView('main')} className="absolute top-6 left-6 z-20 bg-green-600 text-white font-oswald font-bold py-2 px-5 rounded-md text-sm border-2 border-green-500 hover:bg-green-700 transition-colors uppercase tracking-wider">
                        Editar Partida
                    </button>
                )}
                <div className="relative z-10 text-white space-y-4">
                    <img src="https://i.imgur.com/mAnT8S6.png" alt="League Logo" className="h-16 w-16 mx-auto" />
                    <p className="font-oswald text-lg text-blue-400">Brasileirão Série A</p>
                    <div className="inline-block bg-neutral-800/50 border border-neutral-700 text-white font-semibold py-1 px-3 rounded-md text-sm">Rodada {match.roundNumber}</div>
                    <div className="flex items-center justify-center gap-8">
                        <div className="flex-1 text-right flex items-center justify-end gap-4"><h2 className="text-4xl font-oswald font-bold">{homeTeam.name}</h2><img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-24 h-24" /></div>
                        <div className="font-oswald font-extrabold text-7xl">{match.scoreHome} <span className="text-4xl text-neutral-500 mx-2">vs</span> {match.scoreAway}</div>
                        <div className="flex-1 text-left flex items-center justify-start gap-4"><img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-24 h-24" /><h2 className="text-4xl font-oswald font-bold">{awayTeam.name}</h2></div>
                    </div>
                    <p className="text-neutral-400">{formattedDate}, {match.time} BRA</p>
                    <p className="inline-block bg-green-500/20 border border-green-500 text-green-300 font-bold py-1 px-4 rounded-full text-sm">{statusText[match.status]}</p>
                    <div className="pt-2">
                        {match.highlightsUrl ? (
                             <a href={match.highlightsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mx-auto bg-neutral-800/80 border border-neutral-700 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-neutral-700 transition-colors">
                                <PlayIcon className="w-4 h-4 text-red-500"/>Ver melhores momentos
                            </a>
                        ) : (
                            <button className="flex items-center gap-2 mx-auto bg-neutral-800/80 border border-neutral-700 text-white font-semibold py-2 px-4 rounded-md text-sm opacity-50 cursor-not-allowed">
                                <PlayIcon className="w-4 h-4 text-neutral-500"/>Ver melhores momentos
                            </button>
                        )}
                    </div>
                    <p className="text-neutral-500 text-sm">{match.venue}</p>
                </div>
            </div>
            <div className="relative bg-neutral-950 pb-12 -mt-16 z-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    {match.stats ? (
                        <>
                            <div className="bg-[#101012] border border-neutral-800 rounded-lg overflow-hidden mt-8">
                                <div className="grid grid-cols-2">
                                    <div className={`p-6 flex flex-col items-center justify-center text-center ${getGradientStyle(homeTeam)}`}><img src={homeTeam.logoUrl} alt={homeTeam.name} className="h-20 w-20 mb-3 drop-shadow-lg" /><h2 className="text-2xl font-oswald font-bold text-white tracking-wide" style={{textShadow: '1px 1px 5px rgba(0,0,0,0.5)'}}>{homeTeam.name}</h2></div>
                                    <div className={`p-6 flex flex-col items-center justify-center text-center ${getGradientStyle(awayTeam)}`}><img src={awayTeam.logoUrl} alt={awayTeam.name} className="h-20 w-20 mb-3 drop-shadow-lg" /><h2 className="text-2xl font-oswald font-bold text-white tracking-wide" style={{textShadow: '1px 1px 5px rgba(0,0,0,0.5)'}}>{awayTeam.name}</h2></div>
                                </div>
                                <div className="p-4 md:p-6">
                                    {statsList.map((stat, index) => {
                                        if (stat.isBar) {
                                            const total = Number(stat.home) + Number(stat.away); const homePercent = total > 0 ? (Number(stat.home) / total) * 100 : 50;
                                            return (<div key={index} className="stat-row py-4 border-b border-neutral-800 last:border-b-0" style={{ animationDelay: `${index * 50}ms` }}><div className="flex justify-between items-center mb-2 font-oswald font-bold"><span className={`text-lg ${gradientTextClass}`}>{stat.home}%</span><span className="text-sm text-neutral-400 uppercase tracking-wider">{stat.label}</span><span className={`text-lg ${gradientTextClass}`}>{stat.away}%</span></div><div className="flex w-full h-2 bg-neutral-700/50 rounded-full overflow-hidden"><div className={`${getGradientStyle(homeTeam)} rounded-l-full`} style={{ width: `${homePercent}%` }}></div><div className={`${getGradientStyle(awayTeam)} rounded-r-full`} style={{ width: `${100 - homePercent}%` }}></div></div></div>);
                                        }
                                        const homeGoalsCount = stat.label === 'Gols' ? String(stat.home).split('\n').length : 0; const awayGoalsCount = stat.label === 'Gols' ? String(stat.away).split('\n').length : 0;
                                        const homeFontSizeClass = stat.label === 'Gols' && homeGoalsCount > 3 ? 'text-base leading-tight' : 'text-2xl'; const awayFontSizeClass = stat.label === 'Gols' && awayGoalsCount > 3 ? 'text-base leading-tight' : 'text-2xl';
                                        return (<div key={index} className="stat-row grid grid-cols-[1fr_auto_1fr] items-start py-3 border-b border-neutral-800 last:border-b-0" style={{ animationDelay: `${index * 50}ms` }}><div className={`text-left font-oswald font-bold whitespace-pre-line ${gradientTextClass} ${homeFontSizeClass}`}>{stat.home}</div><div className="text-sm text-neutral-400 px-4 text-center uppercase self-center">{stat.label}</div><div className={`text-right font-oswald font-bold whitespace-pre-line ${gradientTextClass} ${awayFontSizeClass}`}>{stat.away}</div></div>);
                                    })}
                                </div>
                            </div>
                             <div className="mt-12">
                                <h3 className="font-oswald text-2xl font-bold text-center mb-6 uppercase tracking-widest bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text">ESCALAÇÕES</h3>
                                {match.lineups && match.lineups.homePlayers?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        <div className="bg-neutral-900 rounded-lg border border-neutral-800">
                                            <div className="p-3 bg-neutral-800/50 border-b border-neutral-800 flex items-center gap-3">
                                                <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-8 h-8"/>
                                                <div>
                                                    <p className="text-xs text-neutral-400">Técnico/Presidente</p>
                                                    <h4 className="font-bold text-lg text-white">{match.lineups.homeCoach}</h4>
                                                </div>
                                            </div>
                                            {match.lineups.homePlayers.map((playerName, index) => (
                                                <div key={`home-${index}`} className="flex items-center p-3 border-b border-neutral-800 last:border-b-0">
                                                    <p className="font-bold text-white">{playerName}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-neutral-900 rounded-lg border border-neutral-800">
                                            <div className="p-3 bg-neutral-800/50 border-b border-neutral-800 flex items-center gap-3">
                                                 <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-8 h-8"/>
                                                <div>
                                                    <p className="text-xs text-neutral-400">Técnico/Presidente</p>
                                                    <h4 className="font-bold text-lg text-white">{match.lineups.awayCoach}</h4>
                                                </div>
                                            </div>
                                            {match.lineups.awayPlayers.map((playerName, index) => (
                                                <div key={`away-${index}`} className="flex items-center p-3 border-b border-neutral-800 last:border-b-0">
                                                    <p className="font-bold text-white">{playerName}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                        <div className="bg-neutral-900 rounded-lg border border-neutral-800">{homePlayers.map(player => <PlayerRow key={player.id} player={player} />)}</div>
                                        <div className="bg-neutral-900 rounded-lg border border-neutral-800">{awayPlayers.map(player => <PlayerRow key={player.id} player={player} />)}</div>
                                    </div>
                                )}
                            </div>
                            {match.mvpPlayerId && (() => {
                                const mvpPlayer = leagueData.players.find(p => p.id === match.mvpPlayerId); if (!mvpPlayer) return null;
                                const mvpData = [{ player: mvpPlayer, value: mvpPlayer.stats.mvpMatches }];
                                return (<div className="mt-12 text-center"><h3 className="font-oswald text-2xl font-bold mb-4 uppercase tracking-widest bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">MVP DA PARTIDA</h3><div className="max-w-xs mx-auto"><StatsCard title="MVP" players={mvpData} teams={leagueData.teams} type="mvp" /></div></div>);
                            })()}
                        </>
                    ) : ( <div className="mt-8 flex h-64 items-center justify-center rounded-lg bg-[#1C1C1C] border border-neutral-800"><p className="text-neutral-500">Estatísticas não disponíveis para esta partida.</p></div>)}
                </div>
            </div>
            {editModalView === 'main' && <AdminActionSelectModal onClose={() => setEditModalView('closed')} onSelect={(view) => setEditModalView(view)} />}
            {editModalView === 'set-status' && <SetStatusModal onClose={() => setEditModalView('closed')} />}
            {editModalView === 'edit-result' && <EditResultModal onClose={() => setEditModalView('closed')} />}
            {editModalView === 'edit-stats' && <EditStatsModal onClose={() => setEditModalView('closed')} />}
            {editModalView === 'edit-lineups' && <EditLineupsModal onClose={() => setEditModalView('closed')} />}
            {editModalView === 'edit-mvp' && <EditMvpModal onClose={() => setEditModalView('closed')} />}
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes slide-in-up { from { transform: translateY(20px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
                .animate-slide-in-up { animation: slide-in-up 0.4s ease-out forwards; }
            `}</style>
       </div>
    );
};

interface Prediction { predictedScore: { home: number; away: number; }; analysis: string; keyPlayer: { name: string; team: string; };}

const PredictionPage: React.FC = () => {
    const { leagueData } = useLeagueData()!;
    const scheduledMatches = leagueData.matches.filter(m => m.status === 'SCHEDULED');
    const [selectedMatchId, setSelectedMatchId] = useState<string>(scheduledMatches[0]?.id || '');
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePrediction = async () => {
        if (!selectedMatchId) return;
        setIsLoading(true); setError(null); setPrediction(null);
        try {
            const match = leagueData.matches.find(m => m.id === selectedMatchId); if (!match) throw new Error("Match not found");
            const homeTeam = leagueData.teams.find(t => t.id === match.homeTeamId); const awayTeam = leagueData.teams.find(t => t.id === match.awayTeamId);
            if (!homeTeam || !awayTeam) throw new Error("Teams not found for the match");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = {type: Type.OBJECT, properties: {predictedScore: {type: Type.OBJECT, properties: {home: { type: Type.INTEGER }, away: { type: Type.INTEGER },}, required: ["home", "away"],}, analysis: { type: Type.STRING, description: "Detailed tactical analysis of the match prediction, highlighting teams' strengths and weaknesses." }, keyPlayer: {type: Type.OBJECT, properties: {name: { type: Type.STRING }, team: { type: Type.STRING, description: `The full name of the team, either ${homeTeam.name} or ${awayTeam.name}` },}, required: ["name", "team"],},}, required: ["predictedScore", "analysis", "keyPlayer"],};
            const prompt = `Analyze the upcoming FBF25 football match between ${homeTeam.name} and ${awayTeam.name}. Act as an expert football analyst. Provide a score prediction, a detailed analysis, and identify a key player. Home Team: ${homeTeam.name} - Stats: Total Goals: ${homeTeam.stats.gt}, Penalties Taken: ${homeTeam.stats.penT}, Penalty %: ${homeTeam.stats.penPercent.toFixed(2)}. Away Team: ${awayTeam.name} - Stats: Total Goals: ${awayTeam.stats.gt}, Penalties Taken: ${awayTeam.stats.penT}, Penalty %: ${awayTeam.stats.penPercent.toFixed(2)}. Return the response in a JSON format matching the provided schema.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema, },});
            const predictionJson = JSON.parse(response.text); setPrediction(predictionJson);
        } catch (err) { console.error(err); setError("Falha ao gerar a previsão. Verifique se a API Key está configurada corretamente e tente novamente."); } finally { setIsLoading(false); }
    };
    
    const selectedMatchDetails = leagueData.matches.find(m => m.id === selectedMatchId);
    const homeTeam = selectedMatchDetails ? leagueData.teams.find(t => t.id === selectedMatchDetails.homeTeamId) : null;
    const awayTeam = selectedMatchDetails ? leagueData.teams.find(t => t.id === selectedMatchDetails.awayTeamId) : null;

    return (
        <><PageHeader title="KINGS PREDICTION" />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto bg-neutral-900 rounded-2xl p-8 border border-neutral-800"><h2 className="text-2xl font-oswald font-bold text-center mb-6">SELECIONE UMA PARTIDA PARA ANÁLISE</h2><div className="flex flex-col md:flex-row items-center gap-4"><select value={selectedMatchId} onChange={(e) => setSelectedMatchId(e.target.value)} className="w-full appearance-none bg-neutral-800 border border-neutral-700 text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all">{scheduledMatches.map(match => { const home = leagueData.teams.find(t => t.id === match.homeTeamId); const away = leagueData.teams.find(t => t.id === match.awayTeamId); return <option key={match.id} value={match.id}>{home?.name} vs {away?.name}</option>})} </select><button onClick={handleGeneratePrediction} disabled={!selectedMatchId || isLoading} className="w-full md:w-auto flex-shrink-0 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold px-8 py-3 rounded-md hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? 'GERANDO...' : 'GERAR PREVISÃO'}</button></div></div>
                {isLoading && ( <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div><p className="mt-4 text-neutral-300">A IA está analisando a partida...</p></div>)}
                {error && (<div className="max-w-3xl mx-auto mt-8 bg-blue-900/50 border border-blue-500 text-blue-300 p-4 rounded-lg text-center">{error}</div>)}
                {prediction && homeTeam && awayTeam && (<div className="max-w-4xl mx-auto mt-10 bg-neutral-900/50 rounded-2xl border border-neutral-800 overflow-hidden"><div className="p-8"><div className="flex items-center justify-around"><div className="text-center"><img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-24 h-24 mx-auto mb-2" /><h3 className="text-2xl font-oswald">{homeTeam.name}</h3></div><div className="text-center"><p className="text-lg text-neutral-400">PLACAR PREVISTO</p><p className="font-oswald text-7xl font-bold my-2">{prediction.predictedScore.home} - {prediction.predictedScore.away}</p></div><div className="text-center"><img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-24 h-24 mx-auto mb-2" /><h3 className="text-2xl font-oswald">{awayTeam.name}</h3></div></div></div><div className="bg-neutral-900 p-8"><h4 className="font-oswald text-xl font-bold uppercase text-green-400 mb-2">Análise Tática</h4><p className="text-neutral-300 whitespace-pre-wrap">{prediction.analysis}</p><div className="mt-6 pt-6 border-t border-neutral-700"><h4 className="font-oswald text-xl font-bold uppercase text-yellow-300 mb-2">Jogador Destaque</h4><p className="text-2xl font-bold">{prediction.keyPlayer.name} <span className="text-lg font-normal text-neutral-400">({prediction.keyPlayer.team})</span></p></div></div></div>)}
                <div className="mt-16"><MatchesCarousel allMatches={leagueData.matches} allRounds={leagueData.rounds} allTeams={leagueData.teams} /></div>
            </main>
        </>
    );
};

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
    const { login } = useAuth(); const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); try { await login(email, password); navigate('/'); } catch (err: any) { setError(err.message); } };
    return (<div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"><div className="max-w-md w-full space-y-8 bg-neutral-900 p-10 rounded-xl border border-neutral-800"><div><h2 className="mt-6 text-center text-3xl font-extrabold text-white font-oswald">Entre na sua conta</h2></div><form className="mt-8 space-y-6" onSubmit={handleSubmit}><div className="rounded-md shadow-sm -space-y-px"><div><input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /></div><div><input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} /></div></div> {error && <p className="text-red-500 text-sm text-center">{error}</p>}<div><button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-neutral-900">Entrar</button></div></form><div className="text-sm text-center"><Link to="/register" className="font-medium text-green-400 hover:text-green-300">Não tem uma conta? Registre-se</Link></div></div></div>);
};

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
    const { register } = useAuth(); const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); try { await register(username, email, password); navigate('/'); } catch (err: any) { setError(err.message); } };
    return (<div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"><div className="max-w-md w-full space-y-8 bg-neutral-900 p-10 rounded-xl border border-neutral-800"><div><h2 className="mt-6 text-center text-3xl font-extrabold text-white font-oswald">Crie sua conta</h2></div><form className="mt-8 space-y-6" onSubmit={handleSubmit}><div className="rounded-md shadow-sm -space-y-px"><div><input name="username" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} /></div><div><input name="email" type="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /></div><div><input name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} /></div></div> {error && <p className="text-red-500 text-sm text-center">{error}</p>}<div><button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-neutral-900">Registrar</button></div></form><div className="text-sm text-center"><Link to="/login" className="font-medium text-green-400 hover:text-green-300">Já tem uma conta? Entre</Link></div></div></div>)
};


// --- APP ---
const App: React.FC = () => {
    const [leagueData, setLeagueData] = useState<LeagueData>(data);
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

    const addTeam = (teamData: Omit<Team, 'id' | 'stats'>) => {
        setLeagueData(prev => {
            const newTeam: Team = {
                ...teamData,
                id: `team-${Date.now()}`,
                stats: { pj: 0, gt: 0, gx2: 0, penPercent: 0, penT: 0, psoT: 0, psoPercent: 0 }
            };
            const newStanding: Standing = {
                teamId: newTeam.id, position: 0, pts: 0, pj: 0, v: 0, vp: 0, dp: 0, d: 0, gp: 0, gc: 0, sg: 0,
            };
            const targetGroup = prev.standingsGroupA.length <= prev.standingsGroupB.length ? 'standingsGroupA' : 'standingsGroupB';
            return {
                ...prev,
                teams: [...prev.teams, newTeam],
                [targetGroup]: [...prev[targetGroup], newStanding]
            };
        });
    };
    
    const addPlayer = (playerData: Omit<Player, 'id' | 'stats' | 'ratings'> & { ratings: Omit<PlayerRatings, 'average'> }) => {
        setLeagueData(prev => {
            const avg = Object.values(playerData.ratings).reduce((a, b) => a + b, 0) / Object.values(playerData.ratings).length;
            const newPlayer: Player = {
                ...playerData,
                id: `player-${Date.now()}`,
                stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, mvpMatches: 0, mvpRounds: 0, golsDuplos: 0, tackles: 0, saves: 0, dribbles: 0 },
                ratings: { ...playerData.ratings, average: Math.round(avg) }
            };
            return { ...prev, players: [...prev.players, newPlayer] };
        });
    };

    const addRoundAndMatches = (roundData: Omit<Round, 'id'>, matchesData: Omit<Match, 'id' | 'status' | 'scoreHome' | 'scoreAway' | 'events'>[]) => {
        setLeagueData(prev => {
            const newRound: Round = { ...roundData, id: `round-${Date.now()}` };
            const newMatches: Match[] = matchesData.map(m => ({
                ...m,
                id: `match-${Date.now()}-${Math.random()}`,
                status: MatchStatus.SCHEDULED,
                scoreHome: 0,
                scoreAway: 0,
                events: [],
                roundNumber: roundData.order,
            }));
            return {
                ...prev,
                rounds: [...prev.rounds, newRound],
                matches: [...prev.matches, ...newMatches]
            };
        });
    };

    const editTeam = (teamId: string, updatedData: Partial<Omit<Team, 'id'>>) => {
        setLeagueData(prev => ({ ...prev, teams: prev.teams.map(t => t.id === teamId ? { ...t, ...updatedData } : t) }));
    };
    const editPlayer = (playerId: string, updatedData: Partial<Omit<Player, 'id'>>) => {
        setLeagueData(prev => ({ ...prev, players: prev.players.map(p => p.id === playerId ? { ...p, ...updatedData } : p)}));
    };
    const editMatch = (matchId: string, updatedData: Partial<Omit<Match, 'id'>>) => {
        setLeagueData(prev => ({ ...prev, matches: prev.matches.map(m => m.id === matchId ? { ...m, ...updatedData } : m) }));
    };

    const removeTeam = (teamId: string) => {
        if (!window.confirm("Tem certeza que deseja remover este time? Isso também removerá todos os seus jogadores e partidas associadas.")) return;
        setLeagueData(prev => {
            return {
                ...prev,
                teams: prev.teams.filter(t => t.id !== teamId),
                players: prev.players.filter(p => p.teamId !== teamId),
                matches: prev.matches.filter(m => m.homeTeamId !== teamId && m.awayTeamId !== teamId),
                standingsGroupA: prev.standingsGroupA.filter(s => s.teamId !== teamId),
                standingsGroupB: prev.standingsGroupB.filter(s => s.teamId !== teamId),
            };
        });
    };

    const removePlayer = (playerId: string) => {
        if (!window.confirm("Tem certeza que deseja remover este jogador?")) return;
        setLeagueData(prev => ({
            ...prev,
            players: prev.players.filter(p => p.id !== playerId),
        }));
    };

    const removeRound = (roundId: string) => {
        if (!window.confirm("Tem certeza que deseja remover esta rodada inteira? Todas as partidas da rodada serão excluídas.")) return;
        setLeagueData(prev => ({
            ...prev,
            rounds: prev.rounds.filter(r => r.id !== roundId),
            matches: prev.matches.filter(m => m.roundId !== roundId),
        }));
    };

    const removeMatch = (matchId: string) => {
        if (!window.confirm("Tem certeza que deseja remover esta partida?")) return;
        setLeagueData(prev => ({
            ...prev,
            matches: prev.matches.filter(m => m.id !== matchId),
        }));
    };

    return (
        <LeagueDataContext.Provider value={{ leagueData, addTeam, addPlayer, addRoundAndMatches, editTeam, editPlayer, editMatch, removeTeam, removePlayer, removeRound, removeMatch }}>
            <div className="bg-black">
                <Marquee text="Federação Brasileira de Futebol - FBF25" />
                <Header onOpenAdminPanel={() => setIsAdminPanelOpen(true)} />
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
                    <Route path="/prediction" element={<PredictionPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
                <Footer />
                {isAdminPanelOpen && <AdminPanel onClose={() => setIsAdminPanelOpen(false)} addTeam={addTeam} addPlayer={addPlayer} addRoundAndMatches={addRoundAndMatches} editTeam={editTeam} editPlayer={editPlayer} editMatch={editMatch} removeTeam={removeTeam} removePlayer={removePlayer} removeRound={removeRound} removeMatch={removeMatch} />}
            </div>
        </LeagueDataContext.Provider>
    );
};

export default App;
