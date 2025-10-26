import { LeagueData, MatchStatus, MatchEventType } from './types';

export const data: LeagueData = {
  countries: [{ id: 'br', name: 'Brazil', code: 'BR' }],
  seasons: [{ id: 's2526', name: '2025' }],
  competitions: [{
    id: 'fbf25',
    name: 'BRASILEIRÃO - FBF25',
    slug: 'brasileirao-fbf25',
    season: { id: 's2526', name: '2025' },
    country: { id: 'br', name: 'Brazil', code: 'BR' },
  }],
  groups: [
    { id: 'group-a', name: 'Grupo A' },
    { id: 'group-b', name: 'Grupo B' },
  ],
  rounds: [
    { id: 'round-1', name: 'Rodada 1', order: 1 },
    { id: 'round-2', name: 'Rodada 2', order: 2 },
    { id: 'round-3', name: 'Rodada 3', order: 3 },
  ],
  teams: [
    { id: 'trovao', name: 'Trovão FC', slug: 'trovao-fc', manager: 'Rai', logoUrl: 'https://via.placeholder.com/100/FFFF00/000000?Text=TFC', stats: { pj: 2, gt: 12, gx2: 1, penPercent: 66.67, penT: 3, psoT: 1, psoPercent: 100 } },
    { id: 'araras', name: 'Araras Douradas', slug: 'araras-douradas', manager: 'Bebeto', logoUrl: 'https://via.placeholder.com/100/0000FF/FFFFFF?Text=ARA', stats: { pj: 2, gt: 11, gx2: 2, penPercent: 50, penT: 2, psoT: 2, psoPercent: 50 } },
    { id: 'metropole', name: 'Metrópole ZN', slug: 'metropole-zn', manager: 'Vampeta', logoUrl: 'https://via.placeholder.com/100/FF0000/FFFFFF?Text=MZN', stats: { pj: 2, gt: 11, gx2: 2, penPercent: 100, penT: 2, psoT: 0, psoPercent: 0 } },
    { id: 'capital', name: 'Capital Coringas', slug: 'capital-coringas', manager: 'Ricardinho', logoUrl: 'https://via.placeholder.com/100/000000/FFFFFF?Text=CAP', stats: { pj: 2, gt: 9, gx2: 0, penPercent: 33.33, penT: 3, psoT: 0, psoPercent: 0 } },
    { id: 'cerrado', name: 'Cerrado Lobos', slug: 'cerrado-lobos', manager: 'Edmundo', logoUrl: 'https://via.placeholder.com/100/A52A2A/FFFFFF?Text=CER', stats: { pj: 2, gt: 8, gx2: 1, penPercent: 60, penT: 5, psoT: 0, psoPercent: 0 } },
    { id: 'furia', name: 'Fúria da Ilha', slug: 'furia-da-ilha', manager: 'Zico', logoUrl: 'https://via.placeholder.com/100/800000/FFFFFF?Text=FDI', stats: { pj: 2, gt: 8, gx2: 2, penPercent: 100, penT: 2, psoT: 0, psoPercent: 75 } },
    { id: 'maresia', name: 'Maresia EC', slug: 'maresia-ec', manager: 'Júnior', logoUrl: 'https://via.placeholder.com/100/00FFFF/000000?Text=MAR', stats: { pj: 2, gt: 7, gx2: 1, penPercent: 0, penT: 3, psoT: 1, psoPercent: 100 } },
    { id: 'imperio', name: 'Império do Norte', slug: 'imperio-do-norte', manager: 'Rivaldo', logoUrl: 'https://via.placeholder.com/100/008000/FFFFFF?Text=IDN', stats: { pj: 2, gt: 7, gx2: 0, penPercent: 0, penT: 0, psoT: 0, psoPercent: 75 } },
  ],
  players: [
    { id: 'garrido', firstName: 'Leandro', lastName: 'Garrido', fullName: 'Leandro Garrido', birthDate: '2003-02-18', heightCm: 182, nationality: 'Brazil', position: 'Atacante', teamId: 'trovao', photoUrl: 'https://i.imgur.com/lQYQ9a2.png', ratings: { fisico: 88, duelos: 82, chuteAoGol: 92, defesa: 45, passe: 80, habilidade: 89, average: 88 }, stats: { matches: 2, goals: 7, assists: 2, yellowCards: 0, redCards: 0, mvpMatches: 1, golsDuplos: 1, tackles: 5, saves: 0 } },
    { id: 'casapieri', firstName: 'Leandro', lastName: 'Casapieri', fullName: 'Leandro Casapieri', birthDate: '2001-05-20', nationality: 'Brazil', position: 'Goleiro', teamId: 'araras', photoUrl: 'https://i.imgur.com/8zWbL3r.png', ratings: { fisico: 80, duelos: 75, chuteAoGol: 50, defesa: 85, passe: 70, habilidade: 60, average: 79 }, stats: { matches: 2, goals: 0, assists: 1, yellowCards: 0, redCards: 0, mvpMatches: 2, golsDuplos: 0, tackles: 2, saves: 12 } },
    { id: 'gelsi', firstName: 'Alessandro', lastName: 'Gelsi', fullName: 'Alessandro Gelsi', birthDate: '2000-09-01', nationality: 'Brazil', position: 'Meia', teamId: 'metropole', photoUrl: 'https://i.imgur.com/xR1m5B1.png', ratings: { fisico: 82, duelos: 85, chuteAoGol: 84, defesa: 70, passe: 90, habilidade: 91, average: 87 }, stats: { matches: 2, goals: 2, assists: 6, yellowCards: 1, redCards: 0, mvpMatches: 2, golsDuplos: 0, tackles: 15, saves: 0 } },
    { id: 'neves', firstName: 'Thiago', lastName: 'Neves', fullName: 'Thiago Neves', birthDate: '2002-11-12', nationality: 'Brazil', position: 'Meia', teamId: 'capital', photoUrl: 'https://i.imgur.com/9G2vA2X.png', ratings: { fisico: 78, duelos: 80, chuteAoGol: 85, defesa: 65, passe: 88, habilidade: 86, average: 83 }, stats: { matches: 2, goals: 3, assists: 5, yellowCards: 1, redCards: 0, mvpMatches: 0, golsDuplos: 0, tackles: 10, saves: 0 } },
    { id: 'bruno', firstName: 'Bruno', lastName: 'Silva', fullName: 'Bruno Silva', birthDate: '2004-01-01', nationality: 'Brazil', position: 'Defensor', teamId: 'cerrado', photoUrl: 'https://i.imgur.com/yFzJ7S3.png', ratings: { fisico: 90, duelos: 88, chuteAoGol: 60, defesa: 92, passe: 75, habilidade: 70, average: 85 }, stats: { matches: 2, goals: 1, assists: 0, yellowCards: 3, redCards: 1, mvpMatches: 0, golsDuplos: 0, tackles: 22, saves: 0 } },
    { id: 'matheus', firstName: 'Matheus', lastName: 'Souza', fullName: 'Matheus Souza', birthDate: '2001-07-09', nationality: 'Brazil', position: 'Atacante', teamId: 'furia', photoUrl: 'https://i.imgur.com/rT9ZHh8.png', ratings: { fisico: 84, duelos: 79, chuteAoGol: 88, defesa: 50, passe: 78, habilidade: 87, average: 81 }, stats: { matches: 2, goals: 6, assists: 4, yellowCards: 2, redCards: 0, mvpMatches: 1, golsDuplos: 2, tackles: 8, saves: 0 } },
     { id: 'oliveira', firstName: 'Kelvin', lastName: 'Oliveira', fullName: 'Kelvin Oliveira', birthDate: '2001-07-09', nationality: 'Brazil', position: 'Atacante', teamId: 'imperio', photoUrl: 'https://i.imgur.com/rT9ZHh8.png', ratings: { fisico: 84, duelos: 79, chuteAoGol: 88, defesa: 50, passe: 78, habilidade: 87, average: 81 }, stats: { matches: 2, goals: 6, assists: 1, yellowCards: 1, redCards: 0, mvpMatches: 1, golsDuplos: 2, tackles: 8, saves: 0 } },
  ],
  matches: [
    { id: 'm1', competitionId: 'fbf25', roundId: 'round-1', groupId: 'group-a', date: '2025-10-20', time: '17:00 BRA', venue: 'Arena FBF, São Paulo', homeTeamId: 'metropole', awayTeamId: 'capital', status: MatchStatus.FINISHED, scoreHome: 6, scoreAway: 3, events: [
      { id: 'e1', minute: 5, type: MatchEventType.GOAL, teamId: 'metropole', playerName: 'Alessandro Gelsi' },
      { id: 'e2', minute: 12, type: MatchEventType.GOAL, teamId: 'capital', playerName: 'Thiago Neves' },
      { id: 'e3', minute: 18, type: MatchEventType.YELLOW_CARD, teamId: 'capital', playerName: 'Thiago Neves' },
      { id: 'e4', minute: 20, type: MatchEventType.HALF_TIME, teamId: '' },
      { id: 'e5', minute: 28, type: MatchEventType.GOAL, teamId: 'metropole', playerName: 'Alessandro Gelsi' },
      { id: 'e6', minute: 38, type: MatchEventType.FULL_TIME, teamId: '' },
    ] },
    { id: 'm2', competitionId: 'fbf25', roundId: 'round-1', groupId: 'group-a', date: '2025-10-20', time: '18:00 BRA', venue: 'Arena FBF, São Paulo', homeTeamId: 'araras', awayTeamId: 'furia', status: MatchStatus.FINISHED, scoreHome: 5, scoreAway: 5, penaltiesHome: 3, penaltiesAway: 1, events: [] },
    { id: 'm3', competitionId: 'fbf25', roundId: 'round-1', groupId: 'group-b', date: '2025-10-20', time: '19:00 BRA', venue: 'Arena FBF, São Paulo', homeTeamId: 'trovao', awayTeamId: 'cerrado', status: MatchStatus.FINISHED, scoreHome: 7, scoreAway: 3, events: [] },
    { id: 'm4', competitionId: 'fbf25', roundId: 'round-2', groupId: 'group-a', date: '2025-10-23', time: '17:00 BRA', venue: 'Arena FBF, São Paulo', homeTeamId: 'capital', awayTeamId: 'araras', status: MatchStatus.LIVE, scoreHome: 6, scoreAway: 6, penaltiesHome: 2, penaltiesAway: 4, events: [] },
    { id: 'm5', competitionId: 'fbf25', roundId: 'round-3', groupId: 'group-a', date: '2025-10-27', time: '17:00 BRA', venue: 'Arena FBF, São Paulo', homeTeamId: 'metropole', awayTeamId: 'araras', status: MatchStatus.SCHEDULED, scoreHome: 0, scoreAway: 0, events: [] },
    { id: 'm6', competitionId: 'fbf25', roundId: 'round-3', groupId: 'group-b', date: '2025-10-27', time: '18:00 BRA', venue: 'Arena FBF, São Paulo', homeTeamId: 'trovao', awayTeamId: 'furia', status: MatchStatus.SCHEDULED, scoreHome: 0, scoreAway: 0, events: [] },
  ],
  standings: [
    { teamId: 'trovao', position: 1, pts: 6, pj: 2, v: 2, vp: 0, dp: 0, d: 0, gp: 14, gc: 5, sg: 9 },
    { teamId: 'araras', position: 2, pts: 4, pj: 2, v: 0, vp: 2, dp: 0, d: 0, gp: 11, gc: 11, sg: 0 },
    { teamId: 'metropole', position: 3, pts: 3, pj: 2, v: 1, vp: 0, dp: 0, d: 1, gp: 10, gc: 8, sg: 2 },
    { teamId: 'furia', position: 4, pts: 2, pj: 2, v: 0, vp: 0, dp: 2, d: 0, gp: 9, gc: 9, sg: 0 },
    { teamId: 'capital', position: 5, pts: 2, pj: 2, v: 0, vp: 0, dp: 1, d: 1, gp: 9, gc: 12, sg: -3 },
    { teamId: 'cerrado', position: 6, pts: 0, pj: 2, v: 0, vp: 0, dp: 0, d: 2, gp: 7, gc: 13, sg: -6 },
    { teamId: 'maresia', position: 7, pts: 0, pj: 2, v: 0, vp: 0, dp: 0, d: 2, gp: 5, gc: 11, sg: -6 },
    // FIX: Changed `id` to `teamId` to match the `Standing` interface.
    { teamId: 'imperio', position: 8, pts: 0, pj: 2, v: 0, vp: 0, dp: 0, d: 2, gp: 4, gc: 12, sg: -8 },
  ].sort((a, b) => a.position - b.position)
};