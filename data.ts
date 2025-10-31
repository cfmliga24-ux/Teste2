
import { LeagueData, MatchStatus, MatchEventType, UserRole } from './types';

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
    { id: 'group-chl', name: 'CHL' },
  ],
  rounds: [
    { id: 'round-1', name: 'Rodada 1', order: 1 },
    { id: 'round-2', name: 'Rodada 2', order: 2 },
    { id: 'round-3', name: 'Rodada 3', order: 3 },
    { id: 'round-4', name: 'Rodada 4', order: 4 },
  ],
  teams: [
    { id: 'capim', name: 'Capim FC', slug: 'capim-fc', keyPeople: 'Jonvlogs + Luva de Pedreiro', cardImageUrl: 'https://i.imgur.com/G5YyfC1.png', cardGradient: 'from-green-500 to-green-800', manager: 'Manager', logoUrl: 'https://i.imgur.com/7gQWJ6F.png', stats: { pj: 1, gt: 2, gx2: 0, penPercent: 0, penT: 0, psoT: 0, psoPercent: 0 } },
    { id: 'dendele', name: 'Dendele FC', slug: 'dendele-fc', keyPeople: 'Paulinho o Loko + LuquEt4', cardImageUrl: 'https://i.imgur.com/4N9k7a5.png', cardGradient: 'from-yellow-500 to-blue-600', manager: 'Manager', logoUrl: 'https://i.imgur.com/2A2fufm.png', stats: { pj: 1, gt: 4, gx2: 0, penPercent: 0, penT: 0, psoT: 1, psoPercent: 0 } },
    { id: 'desimpedidos', name: 'Desimpedidos Esporte Clube', slug: 'desimpedidos', keyPeople: 'Toguro', cardImageUrl: 'https://i.imgur.com/dK4Z62E.png', cardGradient: 'from-teal-400 to-cyan-600', manager: 'Manager', logoUrl: 'https://i.imgur.com/4q2jB4B.png', stats: { pj: 1, gt: 1, gx2: 0, penPercent: 0, penT: 0, psoT: 0, psoPercent: 0 } },
    { id: 'realelite', name: 'FC Real Elite', slug: 'fc-real-elite', keyPeople: 'Ludmilla + Whindersson Nunes + Lucas Freestyle', cardImageUrl: 'https://i.imgur.com/CQU2z7S.png', cardGradient: 'from-blue-500 to-indigo-700', manager: 'Manager', logoUrl: 'https://i.imgur.com/Z0fgu5U.png', stats: { pj: 1, gt: 1, gx2: 0, penPercent: 0, penT: 0, psoT: 0, psoPercent: 0 } },
    { id: 'fluxo', name: 'Fluxo FC', slug: 'fluxo-fc', keyPeople: 'Cerol + Nobru', cardImageUrl: 'https://i.imgur.com/L7X6e2K.png', cardGradient: 'from-indigo-500 to-purple-800', manager: 'Manager', logoUrl: 'https://i.imgur.com/v04Qf5F.png', stats: { pj: 1, gt: 3, gx2: 0, penPercent: 0, penT: 0, psoT: 0, psoPercent: 0 } },
    { id: 'funkbol', name: 'Funkbol Clube', slug: 'funkbol-clube', keyPeople: 'Kond + Michel Elias + MC Hariel', cardImageUrl: 'https://i.imgur.com/yG2aVbV.png', cardGradient: 'from-fuchsia-500 to-pink-500', manager: 'Manager', logoUrl: 'https://i.imgur.com/L4xREjC.png', stats: { pj: 1, gt: 8, gx2: 0, penPercent: 0, penT: 0, psoT: 0, psoPercent: 0 } },
    { id: 'furia', name: 'Furia FC', slug: 'furia-fc', keyPeople: 'Neymar Jr + Cris Guedes', cardImageUrl: 'https://i.imgur.com/b1xTq01.png', cardGradient: 'from-neutral-700 to-neutral-900', manager: 'Zico', logoUrl: 'https://i.imgur.com/YJgAnQ8.png', stats: { pj: 2, gt: 8, gx2: 2, penPercent: 100, penT: 2, psoT: 0, psoPercent: 75 } },
    { id: 'g3x', name: 'G3X FC', slug: 'g3x-fc', keyPeople: 'Gaules + Kelvin', cardImageUrl: 'https://i.imgur.com/W2rqM3g.png', cardGradient: 'from-sky-400 to-blue-700', manager: 'Manager', logoUrl: 'https://i.imgur.com/8f2c3v4.png', stats: { pj: 1, gt: 4, gx2: 0, penPercent: 0, penT: 0, psoT: 0, psoPercent: 0 } },
    { id: 'loud', name: 'LOUD SC', slug: 'loud-sc', keyPeople: 'Coringa + Renato Vicente', cardImageUrl: 'https://i.imgur.com/3q1j3r1.png', cardGradient: 'from-green-500 to-green-800', manager: 'Manager', logoUrl: 'https://i.imgur.com/mdeFz4j.png', stats: { pj: 1, gt: 7, gx2: 0, penPercent: 0, penT: 0, psoT: 0, psoPercent: 0 } },
    { id: 'nyvelados', name: 'Nyvelados FC', slug: 'nyvelados-fc', keyPeople: 'Nyvi Estephan', cardImageUrl: 'https://i.imgur.com/z2Q9pLi.png', cardGradient: 'from-fuchsia-600 to-indigo-800', manager: 'Manager', logoUrl: 'https://i.imgur.com/sT5mY0b.png', stats: { pj: 1, gt: 4, gx2: 0, penPercent: 0, penT: 0, psoT: 1, psoPercent: 100 } },
    // Legacy teams - keeping them for other data structures
    { id: 'trovao', name: 'Trovão FC', slug: 'trovao-fc', manager: 'Rai', logoUrl: 'https://via.placeholder.com/100/FFFF00/000000?Text=TFC', stats: { pj: 2, gt: 12, gx2: 1, penPercent: 66.67, penT: 3, psoT: 1, psoPercent: 100 } },
    { id: 'araras', name: 'Araras Douradas', slug: 'araras-douradas', manager: 'Bebeto', logoUrl: 'https://via.placeholder.com/100/0000FF/FFFFFF?Text=ARA', stats: { pj: 2, gt: 11, gx2: 2, penPercent: 50, penT: 2, psoT: 2, psoPercent: 50 } },
    { id: 'metropole', name: 'Metrópole ZN', slug: 'metropole-zn', manager: 'Vampeta', logoUrl: 'https://i.imgur.com/xR1m5B1.png', stats: { pj: 2, gt: 11, gx2: 2, penPercent: 100, penT: 2, psoT: 0, psoPercent: 0 } },
    { id: 'capital', name: 'Capital Coringas', slug: 'capital-coringas', manager: 'Ricardinho', logoUrl: 'https://i.imgur.com/9G2vA2X.png', stats: { pj: 2, gt: 9, gx2: 0, penPercent: 33.33, penT: 3, psoT: 0, psoPercent: 0 } },
    { id: 'cerrado', name: 'Cerrado Lobos', slug: 'cerrado-lobos', manager: 'Edmundo', logoUrl: 'https://via.placeholder.com/100/A52A2A/FFFFFF?Text=CER', stats: { pj: 2, gt: 8, gx2: 1, penPercent: 60, penT: 5, psoT: 0, psoPercent: 0 } },
    { id: 'maresia', name: 'Maresia EC', slug: 'maresia-ec', manager: 'Júnior', logoUrl: 'https://via.placeholder.com/100/00FFFF/000000?Text=MAR', stats: { pj: 2, gt: 7, gx2: 1, penPercent: 0, penT: 3, psoT: 1, psoPercent: 100 } },
    { id: 'imperio', name: 'Império do Norte', slug: 'imperio-do-norte', manager: 'Rivaldo', logoUrl: 'https://via.placeholder.com/100/008000/FFFFFF?Text=IDN', stats: { pj: 2, gt: 7, gx2: 0, penPercent: 0, penT: 0, psoT: 0, psoPercent: 75 } },
    { id: 'lsc', name: 'Los Santos Club', slug: 'los-santos-club', manager: 'Manager', logoUrl: 'https://i.imgur.com/hS8vp2g.png', stats: { pj: 1, gt: 4, gx2: 0, penPercent: 0, penT: 0, psoT: 1, psoPercent: 0 } },
    { id: 'dec', name: 'Desce pro Play FC', slug: 'desce-pro-play-fc', manager: 'Manager', logoUrl: 'https://i.imgur.com/qAOMsS1.png', stats: { pj: 1, gt: 3, gx2: 0, penPercent: 0, penT: 0, psoT: 0, psoPercent: 0 } },
  ],
  players: [
    { id: 'garrido', number: 9, firstName: 'Leandro', lastName: 'Garrido', fullName: 'Leandro Garrido', birthDate: '2003-02-18', heightCm: 182, nationality: 'Brazil', position: 'Atacante', teamId: 'trovao', photoUrl: 'https://i.imgur.com/lQYQ9a2.png', ratings: { fisico: 88, duelos: 82, chuteAoGol: 92, defesa: 45, passe: 80, habilidade: 89, average: 88 }, stats: { matches: 2, goals: 7, assists: 2, yellowCards: 0, redCards: 0, mvpMatches: 1, golsDuplos: 1, tackles: 5, saves: 0, dribbles: 28 } },
    { id: 'casapieri', number: 1, firstName: 'Leandro', lastName: 'Casapieri', fullName: 'Leandro Casapieri', birthDate: '2001-05-20', nationality: 'Brazil', position: 'Goleiro', teamId: 'araras', photoUrl: 'https://i.imgur.com/8zWbL3r.png', ratings: { fisico: 80, duelos: 75, chuteAoGol: 50, defesa: 85, passe: 70, habilidade: 60, average: 79 }, stats: { matches: 2, goals: 0, assists: 1, yellowCards: 0, redCards: 0, mvpMatches: 2, golsDuplos: 0, tackles: 2, saves: 12, dribbles: 2 } },
// FIX: Changed player position from 'Meia' to 'Meio-Camista' to match enum.
    { id: 'gelsi', number: 10, firstName: 'Alessandro', lastName: 'Gelsi', fullName: 'Alessandro Gelsi', birthDate: '2000-09-01', nationality: 'Brazil', position: 'Meio-Camista', teamId: 'metropole', photoUrl: 'https://i.imgur.com/xR1m5B1.png', ratings: { fisico: 82, duelos: 85, chuteAoGol: 84, defesa: 70, passe: 90, habilidade: 91, average: 87 }, stats: { matches: 2, goals: 2, assists: 6, yellowCards: 1, redCards: 0, mvpMatches: 2, golsDuplos: 0, tackles: 15, saves: 0, dribbles: 35 } },
// FIX: Changed player position from 'Meia' to 'Meio-Camista' to match enum.
    { id: 'neves', number: 10, firstName: 'Thiago', lastName: 'Neves', fullName: 'Thiago Neves', birthDate: '2002-11-12', nationality: 'Brazil', position: 'Meio-Camista', teamId: 'capital', photoUrl: 'https://i.imgur.com/9G2vA2X.png', ratings: { fisico: 78, duelos: 80, chuteAoGol: 85, defesa: 65, passe: 88, habilidade: 86, average: 83 }, stats: { matches: 2, goals: 3, assists: 5, yellowCards: 1, redCards: 0, mvpMatches: 0, golsDuplos: 0, tackles: 10, saves: 0, dribbles: 31 } },
// FIX: Changed player position from 'Defesa' to 'Zagueiro' to match enum.
    { id: 'bruno', number: 4, firstName: 'Bruno', lastName: 'Silva', fullName: 'Bruno Silva', birthDate: '2004-01-01', nationality: 'Brazil', position: 'Zagueiro', teamId: 'cerrado', photoUrl: 'https://i.imgur.com/yFzJ7S3.png', ratings: { fisico: 90, duelos: 88, chuteAoGol: 60, defesa: 92, passe: 75, habilidade: 70, average: 85 }, stats: { matches: 2, goals: 1, assists: 0, yellowCards: 3, redCards: 1, mvpMatches: 0, golsDuplos: 0, tackles: 22, saves: 0, dribbles: 10 } },
    { id: 'matheus', number: 11, firstName: 'Matheus', lastName: 'Souza', fullName: 'Matheus Souza', birthDate: '2001-07-09', nationality: 'Brazil', position: 'Atacante', teamId: 'furia', photoUrl: 'https://i.imgur.com/rT9ZHh8.png', ratings: { fisico: 84, duelos: 79, chuteAoGol: 88, defesa: 50, passe: 78, habilidade: 87, average: 81 }, stats: { matches: 2, goals: 6, assists: 4, yellowCards: 2, redCards: 0, mvpMatches: 1, golsDuplos: 2, tackles: 8, saves: 0, dribbles: 33 } },
    { id: 'oliveira', number: 7, firstName: 'Kelvin', lastName: 'Oliveira', fullName: 'Kelvin Oliveira', birthDate: '2001-07-09', nationality: 'Brazil', position: 'Atacante', teamId: 'g3x', photoUrl: 'https://i.imgur.com/2sO3V5m.png', ratings: { fisico: 84, duelos: 79, chuteAoGol: 88, defesa: 50, passe: 78, habilidade: 87, average: 81 }, stats: { matches: 2, goals: 6, assists: 1, yellowCards: 1, redCards: 0, mvpMatches: 1, golsDuplos: 2, tackles: 8, saves: 0, dribbles: 30 } },
    
    // Metropole ZN Players
    { id: 'ivo-alves', number: 1, firstName: 'Ivo', lastName: 'Alves', fullName: 'Ivo Alves', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Goleiro', teamId: 'metropole', photoUrl: 'https://i.imgur.com/G5I2n64.png', ratings: { average: 80 } as any, stats: {} as any },
    { id: 'renan-crespo', number: 12, firstName: 'Renan', lastName: 'Crespo', fullName: 'Renan Crespo', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Goleiro', teamId: 'metropole', ratings: { average: 78 } as any, stats: {} as any },
// FIX: Changed player position from 'Defesa' to 'Zagueiro' to match enum.
    { id: 'nicolas-barutti', number: 4, firstName: 'Nicolas', lastName: 'Barutti', fullName: 'Nicolas Barutti', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Zagueiro', teamId: 'metropole', ratings: { average: 82 } as any, stats: {} as any },
// FIX: Changed player position from 'Defesa' to 'Zagueiro' to match enum.
    { id: 'vinicius-miranda', number: 8, firstName: 'Vinicius', lastName: 'Miranda', fullName: 'Vinicius Miranda', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Zagueiro', teamId: 'metropole', ratings: { average: 81 } as any, stats: {} as any },
// FIX: Changed player position from 'Meia' to 'Meio-Camista' to match enum.
    { id: 'gustavo-simon', number: 7, firstName: 'Gustavo', lastName: 'Simon', fullName: 'Gustavo Simon', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Meio-Camista', teamId: 'metropole', ratings: { average: 84 } as any, stats: {} as any },
    
// FIX: Changed player position from 'Meia' to 'Meio-Camista' to match enum.
    { id: 'bruninho-mandarino', number: 70, firstName: 'Bruninho', lastName: 'Mandarino', fullName: 'Bruninho Mandarino', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Meio-Camista', teamId: 'funkbol', ratings: { average: 83 } as any, stats: {} as any },
    { id: 'william-de-jesus', number: 38, firstName: 'William', lastName: 'de Jesus', fullName: 'William de Jesus', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Atacante', teamId: 'funkbol', ratings: { average: 85 } as any, stats: {} as any },
    
// FIX: Changed player position from 'Defesa' to 'Zagueiro' to match enum.
    { id: 'breno-arantes', number: 47, firstName: 'Breno', lastName: 'Arantes', fullName: 'Breno Arantes', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Zagueiro', teamId: 'metropole', ratings: { average: 80 } as any, stats: {} as any },
    { id: 'caio-japa-garcia', number: 11, firstName: 'Caio \'Japa\'', lastName: 'Garcia', fullName: 'Caio \'Japa\' Garcia', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Atacante', teamId: 'metropole', ratings: { average: 86 } as any, stats: {} as any },
// FIX: Changed player position from 'Meia' to 'Meio-Camista' to match enum.
    { id: 'matheus-klynsmann', number: 95, firstName: 'Matheus', lastName: 'Klynsmann', fullName: 'Matheus Klynsmann', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Meio-Camista', teamId: 'metropole', ratings: { average: 82 } as any, stats: {} as any },
    { id: 'joao-choco-victor', number: 31, firstName: 'João \'Choco\'', lastName: 'Victor', fullName: 'João \'Choco\' Victor', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Atacante', teamId: 'metropole', ratings: { average: 84 } as any, stats: {} as any },
    
    // Capital Coringas Players
    { id: 'joao-pedro', number: 22, firstName: 'João', lastName: 'Pedro', fullName: 'João Pedro', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Goleiro', teamId: 'capital', photoUrl: "https://i.imgur.com/i4aYgQY.png", ratings: { average: 79 } as any, stats: { yellowCards: 1, redCards: 0, goals: 0, assists: 0, mvpMatches: 0, tackles: 2, saves: 10, matches: 3, dribbles: 1, golsDuplos: 0 } },
    { id: 'vitao-ferreira', number: 95, firstName: 'Vitão', lastName: 'Ferreira', fullName: 'Vitão Ferreira', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Goleiro', teamId: 'capital', photoUrl: 'https://i.imgur.com/pElM832.png', ratings: { average: 77 } as any, stats: { tackles: 27, goals: 0, assists: 0, yellowCards: 0, redCards: 0, mvpMatches: 0, matches: 5, saves: 25, dribbles: 0, golsDuplos: 0 } },

    // Players for Stats Page
// FIX: Changed player position from 'Meia' to 'Meio-Camista' to match enum.
    { id: 'luan-mestre', number: 10, firstName: 'Luan', lastName: "'Mestre'", fullName: "Luan 'Mestre'", birthDate: '1995-01-01', nationality: 'Brazil', position: 'Meio-Camista', teamId: 'funkbol', photoUrl: 'https://i.imgur.com/Gj3jK8Z.png', ratings: { average: 90 } as any, stats: { matches: 5, goals: 7, assists: 3, yellowCards: 1, redCards: 0, mvpMatches: 3, tackles: 5, saves: 0, dribbles: 15, golsDuplos: 0 } },
    { id: 'lipao-pinheiro', number: 9, firstName: "'Lipão'", lastName: "Pinheiro", fullName: "'Lipão' Pinheiro", birthDate: '1996-01-01', nationality: 'Brazil', position: 'Atacante', teamId: 'desimpedidos', photoUrl: 'https://i.imgur.com/Gj3jK8Z.png', ratings: { average: 85 } as any, stats: { matches: 5, goals: 6, assists: 2, yellowCards: 0, redCards: 0, mvpMatches: 1, tackles: 3, saves: 0, dribbles: 6, golsDuplos: 0 } },
// FIX: Changed player position from 'Meia' to 'Meio-Camista' to match enum.
    { id: 'esau-nascimento', number: 8, firstName: 'Esaú', lastName: 'Nascimento', fullName: 'Esaú Nascimento', birthDate: '1998-05-12', nationality: 'Brazil', position: 'Meio-Camista', teamId: 'loud', photoUrl: 'https://i.imgur.com/3QZ3L3s.png', ratings: { average: 88 } as any, stats: { matches: 5, goals: 4, assists: 6, yellowCards: 2, redCards: 0, mvpMatches: 1, tackles: 21, saves: 0, dribbles: 12, golsDuplos: 0 } },
    { id: 'jeffinho-honorato', number: 11, firstName: 'Jeffinho', lastName: 'Honorato', fullName: 'Jeffinho Honorato', birthDate: '1997-03-01', nationality: 'Brazil', position: 'Atacante', teamId: 'realelite', photoUrl: 'https://i.imgur.com/3QZ3L3s.png', ratings: { average: 84 } as any, stats: { matches: 5, goals: 3, assists: 5, yellowCards: 1, redCards: 0, mvpMatches: 0, tackles: 8, saves: 0, dribbles: 10, golsDuplos: 0 } },
// FIX: Changed player position from 'Meia' to 'Meio-Camista' to match enum.
    { id: 'lyncoln-oliveira', number: 20, firstName: 'Lyncoln', lastName: 'Oliveira', fullName: 'Lyncoln Oliveira', birthDate: '2000-01-20', nationality: 'Brazil', position: 'Meio-Camista', teamId: 'fluxo', photoUrl: 'https://i.imgur.com/3QZ3L3s.png', ratings: { average: 82 } as any, stats: { matches: 5, goals: 2, assists: 4, yellowCards: 0, redCards: 0, mvpMatches: 0, tackles: 15, saves: 0, dribbles: 9, golsDuplos: 0 } },
// FIX: Changed player position from 'Defesa' to 'Zagueiro' to match enum.
    { id: 'igor-rezende', number: 3, firstName: 'Igor', lastName: 'Rezende', fullName: 'Igor Rezende', birthDate: '1999-09-15', nationality: 'Brazil', position: 'Zagueiro', teamId: 'dendele', photoUrl: 'https://i.imgur.com/yFzJ7S3.png', ratings: { average: 85 } as any, stats: { matches: 5, goals: 1, assists: 0, yellowCards: 3, redCards: 0, mvpMatches: 0, tackles: 20, saves: 0, dribbles: 5, golsDuplos: 0 } },
// FIX: Changed player position from 'Defesa' to 'Zagueiro' to match enum.
    { id: 'ailton-jose', number: 18, firstName: 'Ailton', lastName: 'José', fullName: 'Ailton José', birthDate: '1996-07-21', nationality: 'Brazil', position: 'Zagueiro', teamId: 'fluxo', photoUrl: 'https://i.imgur.com/i4aYgQY.png', ratings: { average: 83 } as any, stats: { matches: 5, goals: 0, assists: 1, yellowCards: 1, redCards: 0, mvpMatches: 0, tackles: 18, saves: 0, dribbles: 4, golsDuplos: 0 } },
// FIX: Changed player position from 'Defesa' to 'Zagueiro' to match enum.
    { id: 'gabriel-medeiros', number: 5, firstName: 'Gabriel', lastName: 'Medeiros', fullName: 'Gabriel Medeiros', birthDate: '1995-11-30', nationality: 'Brazil', position: 'Zagueiro', teamId: 'capim', photoUrl: 'https://i.imgur.com/i4aYgQY.png', ratings: { average: 81 } as any, stats: { matches: 5, goals: 0, assists: 0, yellowCards: 1, redCards: 0, mvpMatches: 0, tackles: 19, saves: 0, dribbles: 3, golsDuplos: 0 } },
// FIX: Changed player position from 'Meia' to 'Meio-Camista' to match enum.
    { id: 'leol-garcia', number: 7, firstName: "'Lelol'", lastName: 'Garcia', fullName: "'Lelol' Garcia", birthDate: '1998-02-14', nationality: 'Brazil', position: 'Meio-Camista', teamId: 'nyvelados', photoUrl: 'https://i.imgur.com/O19sWc1.png', ratings: { average: 86 } as any, stats: { matches: 5, goals: 5, assists: 3, yellowCards: 2, redCards: 0, mvpMatches: 1, tackles: 11, saves: 0, dribbles: 7, golsDuplos: 0 } },
    { id: 'haiber-junior', number: 17, firstName: 'Haiber', lastName: 'Junior', fullName: 'Haiber Junior', birthDate: '1999-04-03', nationality: 'Brazil', position: 'Atacante', teamId: 'g3x', photoUrl: 'https://i.imgur.com/O19sWc1.png', ratings: { average: 84 } as any, stats: { matches: 5, goals: 4, assists: 2, yellowCards: 1, redCards: 0, mvpMatches: 0, tackles: 6, saves: 0, dribbles: 7, golsDuplos: 0 } },
    { id: 'cerol-32', number: 92, firstName: 'Cerol', lastName: 'Silva', fullName: 'Cerol Silva', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Atacante', teamId: 'fluxo', ratings: { average: 85 } as any, stats: {} as any },
// FIX: Changed player position from 'Meia' to 'Meio-Camista' to match enum.
    { id: 'helber-junior-21', number: 96, firstName: 'Helber', lastName: 'Júnior', fullName: 'Helber Júnior', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Meio-Camista', teamId: 'fluxo', ratings: { average: 84 } as any, stats: {} as any },
// FIX: Changed player position from 'Defesa' to 'Zagueiro' to match enum.
    { id: 'murillo-pulino', number: 3, firstName: 'Murillo', lastName: 'Pulino', fullName: 'Murillo Pulino', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Zagueiro', teamId: 'fluxo', ratings: { average: 81 } as any, stats: {} as any },
    { id: 'julio-carvalho', number: 28, firstName: 'Júlio', lastName: 'Carvalho', fullName: 'Júlio Carvalho', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Goleiro', teamId: 'fluxo', ratings: { average: 80 } as any, stats: {} as any },
// FIX: Changed player position from 'Meia' to 'Meio-Camista' to match enum.
    { id: 'iago-soares', number: 20, firstName: 'Iago', lastName: 'Soares', fullName: 'Iago Soares', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Meio-Camista', teamId: 'fluxo', ratings: { average: 82 } as any, stats: {} as any },
    { id: 'igor-campos', number: 1, firstName: 'Igor', lastName: 'Campos', fullName: 'Igor Campos', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Goleiro', teamId: 'funkbol', ratings: { average: 83 } as any, stats: {} as any },
// FIX: Changed player position from 'Meia' to 'Meio-Camista' to match enum.
    { id: 'caio-miranda', number: 28, firstName: 'Caio', lastName: 'Miranda', fullName: 'Caio Miranda', birthDate: '1999-01-01', nationality: 'Brazil', position: 'Meio-Camista', teamId: 'funkbol', ratings: { average: 81 } as any, stats: {} as any },
    { id: 'andson-romarinho', number: 99, firstName: 'Andson', lastName: "'Romarinho'", fullName: "Andson 'Romarinho'", birthDate: '1999-01-01', nationality: 'Brazil', position: 'Atacante', teamId: 'funkbol', ratings: { average: 84 } as any, stats: {} as any },
  ],
  matches: [
    { id: 'm1', competitionId: 'fbf25', roundId: 'round-1', groupId: 'group-a', date: '2025-08-10', time: '16:00', venue: 'Arena FBF', homeTeamId: 'trovao', awayTeamId: 'araras', status: MatchStatus.FINISHED, scoreHome: 6, scoreAway: 5, events: [], mvpPlayerId: 'garrido', roundNumber: 1, dateLabel: "Domingo, 10 de Agosto", groupLetter: 'A' },
    { id: 'm2', competitionId: 'fbf25', roundId: 'round-1', groupId: 'group-a', date: '2025-08-10', time: '17:00', venue: 'Arena FBF', homeTeamId: 'metropole', awayTeamId: 'capital', status: MatchStatus.FINISHED, scoreHome: 4, scoreAway: 3, penaltiesHome: 3, penaltiesAway: 2, events: [], mvpPlayerId: 'gelsi', roundNumber: 1, dateLabel: "Domingo, 10 de Agosto", groupLetter: 'A' },
    { id: 'm3', competitionId: 'fbf25', roundId: 'round-1', groupId: 'group-b', date: '2025-08-11', time: '16:00', venue: 'Arena FBF', homeTeamId: 'cerrado', awayTeamId: 'furia', status: MatchStatus.FINISHED, scoreHome: 3, scoreAway: 5, events: [], mvpPlayerId: 'matheus', roundNumber: 1, dateLabel: "Segunda-feira, 11 de Agosto", groupLetter: 'B' },
    { id: 'm4', competitionId: 'fbf25', roundId: 'round-1', groupId: 'group-b', date: '2025-08-11', time: '17:00', venue: 'Arena FBF', homeTeamId: 'maresia', awayTeamId: 'imperio', status: MatchStatus.LIVE, scoreHome: 2, scoreAway: 2, events: [], roundNumber: 1, dateLabel: "Segunda-feira, 11 de Agosto", groupLetter: 'B' },
    
    // Matches from image for Carousel
    // Round 2
    { id: 'm-img-r2-1', competitionId: 'fbf25', roundId: 'round-2', groupId: 'group-chl', date: '2025-10-24', time: '17:00', venue: 'Arena FBF', homeTeamId: 'g3x', awayTeamId: 'realelite', status: MatchStatus.FINISHED, scoreHome: 8, scoreAway: 5, events: [], mvpPlayerId: 'oliveira', roundNumber: 2, dateLabel: 'Sexta-feira, 24 de outubro', groupLetter: 'CHL' },
    // Round 3
    { id: 'm-img-r3-1', competitionId: 'fbf25', roundId: 'round-3', groupId: 'group-a', date: '2025-10-24', time: '18:00', venue: 'Arena FBF', homeTeamId: 'funkbol', awayTeamId: 'capim', status: MatchStatus.FINISHED, scoreHome: 8, scoreAway: 3, events: [], mvpPlayerId: 'luan-mestre', roundNumber: 3, dateLabel: 'Sexta-feira, 24 de outubro', groupLetter: 'A' },
    { id: 'm-img-r3-2', competitionId: 'fbf25', roundId: 'round-3', groupId: 'group-b', date: '2025-10-24', time: '19:00', venue: 'Arena FBF', homeTeamId: 'dendele', awayTeamId: 'fluxo', status: MatchStatus.FINISHED, scoreHome: 2, scoreAway: 4, events: [], roundNumber: 3, dateLabel: 'Sexta-feira, 24 de outubro', groupLetter: 'B' },
    { id: 'm-img-r3-3', competitionId: 'fbf25', roundId: 'round-3', groupId: 'group-a', date: '2025-10-24', time: '20:00', venue: 'Arena FBF', homeTeamId: 'lsc', awayTeamId: 'furia', status: MatchStatus.FINISHED, scoreHome: 4, scoreAway: 4, penaltiesHome: 1, penaltiesAway: 3, events: [], roundNumber: 3, dateLabel: 'Sexta-feira, 24 de outubro', groupLetter: 'A' },
    { id: 'm-img-r3-4', competitionId: 'fbf25', roundId: 'round-3', groupId: 'group-chl', date: '2025-10-24', time: '21:00', venue: 'Arena FBF', homeTeamId: 'dec', awayTeamId: 'nyvelados', status: MatchStatus.LIVE, scoreHome: 3, scoreAway: 4, events: [], roundNumber: 3, dateLabel: 'Sexta-feira, 24 de outubro', groupLetter: 'CHL' },
    // Round 4
    { id: 'm-img-r4-1', competitionId: 'fbf25', roundId: 'round-4', groupId: 'group-b', date: '2025-10-27', time: '17:00', venue: 'Arena FBF', homeTeamId: 'nyvelados', awayTeamId: 'capim', status: MatchStatus.SCHEDULED, scoreHome: 0, scoreAway: 0, events: [], roundNumber: 4, dateLabel: 'Segunda-feira, 27 de outubro', groupLetter: 'B' },
    { id: 'm-img-r4-2', competitionId: 'fbf25', roundId: 'round-4', groupId: 'group-b', date: '2025-10-27', time: '18:00', venue: 'Arena FBF', homeTeamId: 'dendele', awayTeamId: 'funkbol', status: MatchStatus.SCHEDULED, scoreHome: 0, scoreAway: 0, events: [], roundNumber: 4, dateLabel: 'Segunda-feira, 27 de outubro', groupLetter: 'B' },
    { id: 'm-img-r4-3', competitionId: 'fbf25', roundId: 'round-4', groupId: 'group-a', date: '2025-10-27', time: '19:00', venue: 'Arena FBF', homeTeamId: 'furia', awayTeamId: 'realelite', status: MatchStatus.SCHEDULED, scoreHome: 0, scoreAway: 0, events: [], roundNumber: 4, dateLabel: 'Segunda-feira, 27 de outubro', groupLetter: 'A' },
    { id: 'm-img-r4-4', competitionId: 'fbf25', roundId: 'round-4', groupId: 'group-a', date: '2025-10-27', time: '20:00', venue: 'Arena FBF', homeTeamId: 'dec', awayTeamId: 'g3x', status: MatchStatus.SCHEDULED, scoreHome: 0, scoreAway: 0, events: [], roundNumber: 4, dateLabel: 'Segunda-feira, 27 de outubro', groupLetter: 'A' },
    { id: 'm-img-r4-5', competitionId: 'fbf25', roundId: 'round-4', groupId: 'group-chl', date: '2025-10-27', time: '21:00', venue: 'Arena FBF', homeTeamId: 'lsc', awayTeamId: 'fluxo', status: MatchStatus.SCHEDULED, scoreHome: 0, scoreAway: 0, events: [], roundNumber: 4, dateLabel: 'Segunda-feira, 27 de outubro', groupLetter: 'CHL' },
    
    // Match for detail page
    {
      id: 'm-fluxo-funkbol',
      competitionId: 'fbf25',
      roundId: 'round-3',
      groupId: 'group-b',
      date: '2025-10-17',
      time: '17:00',
      venue: 'Trident Arena Brazil',
      homeTeamId: 'fluxo',
      awayTeamId: 'funkbol',
      status: MatchStatus.FINISHED,
      scoreHome: 3,
      scoreAway: 8,
      events: [
        { id: 'g1', minute: 2, type: MatchEventType.GOAL, teamId: 'funkbol', playerName: "Luan 'Mestre'" },
        { id: 'g2', minute: 21, type: MatchEventType.GOAL, teamId: 'fluxo', playerName: "Helber Júnior" },
        { id: 'g3', minute: 21, type: MatchEventType.GOAL, teamId: 'funkbol', playerName: "Luan 'Mestre'" },
        { id: 'g4', minute: 23, type: MatchEventType.GOAL, teamId: 'funkbol', playerName: "Luan 'Mestre'" },
        { id: 'g5', minute: 29, type: MatchEventType.GOAL, teamId: 'funkbol', playerName: "Bruninho Mandarino" },
        { id: 'g6', minute: 30, type: MatchEventType.GOAL, teamId: 'funkbol', playerName: "Bruninho Mandarino" },
        { id: 'g7', minute: 32, type: MatchEventType.GOAL, teamId: 'fluxo', playerName: "Cerol Silva" },
        { id: 'g8', minute: 33, type: MatchEventType.GOAL, teamId: 'funkbol', playerName: "Luan 'Mestre'" },
        { id: 'g9', minute: 35, type: MatchEventType.GOAL, teamId: 'fluxo', playerName: "Helber Júnior" },
        { id: 'g10', minute: 38, type: MatchEventType.GOAL, teamId: 'funkbol', playerName: "William de Jesus" },
      ],
      stats: {
        posseDeBola: { home: 48, away: 52 },
        precisaoChutes: { home: 45, away: 60 },
        precisaoPasse: { home: 91, away: 87 },
        finalizacoesGol: { home: 9, away: 12 },
        passes: { home: 210, away: 235 },
        defesas: { home: 4, away: 6 },
        intercepcoes: { home: 7, away: 5 },
        impedimentos: { home: 1, away: 0 },
        faltas: { home: 12, away: 10 },
        cartoesAmarelos: { home: 2, away: 1 },
        cartoesVermelhos: { home: 0, away: 0 },
        golsShootout: { home: 0, away: 0 },
        golDePenalti: { home: 1, away: 1 },
        golsDuplos: { home: 0, away: 1 },
        xGols: { home: 1.61, away: 2.42 },
        totalChutes: { home: 15, away: 17 },
        chutesNaTrave: { home: 1, away: 0 },
        escanteios: { home: 7, away: 0 },
      },
      lineups: {
        homeCoach: 'Manager',
        homePlayers: ["Cerol Silva", "Helber Júnior", "Murillo Pulino", "Júlio Carvalho", "Iago Soares", "Ailton José", "Lyncoln Oliveira"],
        awayCoach: 'Manager',
        awayPlayers: ["Luan 'Mestre'", "Bruninho Mandarino", "William de Jesus", "Igor Campos", "Caio Miranda", "Andson 'Romarinho'", "Jogador 7"],
      },
      mvpPlayerId: 'luan-mestre',
      roundNumber: 1,
      groupLetter: 'B'
    }
  ],
  standings: [],
  standingsGroupA: [
      { teamId: 'loud', position: 1, pts: 7, pj: 3, v: 2, vp: 0, dp: 1, d: 0, gp: 14, gc: 2, sg: 12 },
      { teamId: 'furia', position: 2, pts: 5, pj: 2, v: 1, vp: 1, dp: 0, d: 0, gp: 10, gc: 5, sg: 5 },
      { teamId: 'g3x', position: 3, pts: 3, pj: 2, v: 1, vp: 0, dp: 0, d: 1, gp: 6, gc: 9, sg: -3 },
      { teamId: 'desimpedidos', position: 4, pts: 3, pj: 2, v: 1, vp: 0, dp: 0, d: 1, gp: 5, gc: 9, sg: -4 },
      { teamId: 'realelite', position: 5, pts: 0, pj: 3, v: 0, vp: 0, dp: 0, d: 3, gp: 3, gc: 13, sg: -10 },
      { teamId: 'lsc', position: 6, pts: 1, pj: 1, v: 0, vp: 0, dp: 1, d: 0, gp: 4, gc: 4, sg: 0 },
      { teamId: 'dec', position: 7, pts: 0, pj: 1, v: 0, vp: 0, dp: 0, d: 1, gp: 3, gc: 4, sg: -1 },
  ],
  standingsGroupB: [
      { teamId: 'funkbol', position: 1, pts: 9, pj: 3, v: 3, vp: 0, dp: 0, d: 0, gp: 15, gc: 6, sg: 9 },
      { teamId: 'fluxo', position: 2, pts: 5, pj: 3, v: 1, vp: 1, dp: 0, d: 1, gp: 9, gc: 12, sg: -3 },
      { teamId: 'nyvelados', position: 3, pts: 2, pj: 2, v: 0, vp: 1, dp: 0, d: 1, gp: 6, gc: 7, sg: -1 },
      { teamId: 'dendele', position: 4, pts: 1, pj: 2, v: 0, vp: 0, dp: 1, d: 1, gp: 5, gc: 7, sg: -2 },
      { teamId: 'capim', position: 5, pts: 1, pj: 2, v: 0, vp: 0, dp: 1, d: 1, gp: 4, gc: 7, sg: -3 },
  ],
  users: [
    { id: 'user-1', username: 'Admin', email: 'admin@fbf25.com', password: 'adminpassword', role: UserRole.ADMIN },
    { id: 'user-2', username: 'Membro', email: 'membro@fbf25.com', password: 'membropassword', role: UserRole.MEMBER },
  ]
};