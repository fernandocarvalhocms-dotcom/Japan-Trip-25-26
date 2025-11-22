import { Itinerary, ActivityType } from '../types';

export const itineraryData: Itinerary = [
  {
    id: 1,
    date: '2025-12-27',
    dayOfWeek: 'Sábado',
    title: 'Partida do Brasil',
    events: [
      { id: 101, time: '23:15', title: 'Voo GRU -> JFK', description: 'Partida do Aeroporto de Guarulhos (GRU) no voo JAL 7201.', location: 'São Paulo, Brasil', type: ActivityType.FLIGHT, coordinates: { lat: -23.4356, lng: -46.4731 } },
    ],
  },
  {
    id: 2,
    date: '2025-12-28',
    dayOfWeek: 'Domingo',
    title: 'Em Trânsito',
    events: [
      { id: 201, time: '10:00', title: 'Voo JFK -> HND', description: 'Voo de conexão do Aeroporto JFK no voo JAL 7009.', location: 'Nova York, EUA', type: ActivityType.FLIGHT, coordinates: { lat: 40.6413, lng: -73.7781 } },
      { id: 202, time: 'Dia todo', title: 'Viagem para o Japão', description: 'Cruzando fusos horários e continentes a caminho de Tóquio.', location: 'No ar', type: ActivityType.CUSTOM, coordinates: { lat: 51.1813, lng: -153.2812 } },
    ],
  },
  {
    id: 3,
    date: '2025-12-29',
    dayOfWeek: 'Segunda-feira',
    title: 'Chegada em Tóquio',
    events: [
      { id: 301, time: '14:35', title: 'Chegada em Haneda (HND)', description: 'Pouso em Tóquio, passar pela imigração e alfândega.', location: 'Aeroporto de Haneda, Tóquio', type: ActivityType.FLIGHT, coordinates: { lat: 35.5494, lng: 139.7798 } },
      { id: 302, time: 'Tarde', title: 'Trem para o Hotel', description: 'Pegar o trem para a área de Shinjuku ou Ueno.', location: 'Tóquio', type: ActivityType.TRANSPORT, suggestion: 'O Keikyu Line ou o Tokyo Monorail são ótimas opções para sair do aeroporto.', coordinates: { lat: 35.6895, lng: 139.6917 } },
      { id: 303, time: 'Noite', title: 'Check-in e Acomodação', description: 'Fazer check-in no hotel, deixar as malas e jantar tranquilamente nas proximidades.', location: 'Área do Hotel, Tóquio', type: ActivityType.ACCOMMODATION, coordinates: { lat: 35.6909, lng: 139.7004 } },
    ],
  },
  {
    id: 4,
    date: '2025-12-30',
    dayOfWeek: 'Terça-feira',
    title: 'Tóquio Tradicional e Vistas',
    events: [
      { id: 401, time: 'Manhã', title: 'Templo Senso-ji', description: 'Visitar o famoso templo em Asakusa e explorar o mercado Nakamise-dori.', location: 'Asakusa, Tóquio', type: ActivityType.SIGHTSEEING, suggestion: 'Experimente os doces locais vendidos na Nakamise-dori, como o agemanju.', coordinates: { lat: 35.7148, lng: 139.7967 } },
      { id: 402, time: 'Almoço', title: 'Almoço em Asakusa', description: 'Desfrutar de uma refeição no tradicional bairro de Asakusa.', location: 'Asakusa, Tóquio', type: ActivityType.FOOD, coordinates: { lat: 35.7127, lng: 139.7984 } },
      { id: 403, time: 'Tarde', title: 'Tokyo Skytree', description: 'Subir para vistas panorâmicas da cidade. Alternativamente, explorar o Parque Ueno e seus museus.', location: 'Sumida, Tóquio', type: ActivityType.SIGHTSEEING, suggestion: 'Compre ingressos online e com antecedência para evitar longas filas, especialmente ao pôr do sol.', coordinates: { lat: 35.7101, lng: 139.8107 } },
    ],
  },
  {
    id: 5,
    date: '2025-12-31',
    dayOfWeek: 'Quarta-feira',
    title: 'Véspera de Ano Novo (Ōmisoka)',
    events: [
      { id: 501, time: 'Manhã', title: 'Cruzamento de Shibuya', description: 'Experimentar o cruzamento mais movimentado do mundo e visitar a Loja da Nintendo.', location: 'Shibuya, Tóquio', type: ActivityType.SIGHTSEEING, suggestion: 'Para uma ótima foto, suba ao Starbucks no prédio Tsutaya ou ao mirante gratuito do Shibuya Hikarie.', coordinates: { lat: 35.6595, lng: 139.7005 } },
      { id: 502, time: 'Tarde', title: 'Exploração de Harajuku', description: 'Caminhar pela Rua Takeshita para ver a cultura jovem e lojas peculiares.', location: 'Harajuku, Tóquio', type: ActivityType.SHOPPING, suggestion: 'Não deixe de provar os crepes gigantes e coloridos, uma marca registrada de Harajuku.', coordinates: { lat: 35.6706, lng: 139.7023 } },
      { id: 503, time: 'Noite', title: 'Jantar de Ano Novo', description: 'Jantar cedo, pois muitos lugares fecham para o feriado. Preparar-se para as celebrações de Ano Novo.', location: 'Tóquio', type: ActivityType.FOOD, coordinates: { lat: 35.6895, lng: 139.6917 } },
    ],
  },
  {
    id: 6,
    date: '2026-01-01',
    dayOfWeek: 'Quinta-feira',
    title: 'Ano Novo (Ganjitsu)',
    events: [
      { id: 601, time: 'Manhã', title: 'Santuário Meiji Jingu', description: 'Participar do Hatsumōde, a primeira visita ao santuário do ano. Espere grandes multidões festivas.', location: 'Shibuya, Tóquio', type: ActivityType.SIGHTSEEING, suggestion: 'Vá cedo para evitar o pico da multidão. Vista-se em camadas, pois pode fazer frio na espera.', coordinates: { lat: 35.6764, lng: 139.6993 } },
      { id: 602, time: 'Tarde', title: 'Akihabara Electric Town', description: 'Explorar o centro da cultura de animes, mangás e jogos. Muitas lojas estarão abertas.', location: 'Akihabara, Tóquio', type: ActivityType.SHOPPING, coordinates: { lat: 35.6984, lng: 139.7731 } },
    ],
  },
  {
    id: 7,
    date: '2026-01-02',
    dayOfWeek: 'Sexta-feira',
    title: 'Tóquio Disney',
    events: [
      { id: 701, time: 'Dia todo', title: 'Tokyo Disneyland ou DisneySea', description: 'Passar o dia em um dos parques da Disney. Comprar ingressos com bastante antecedência devido à alta demanda.', location: 'Urayasu, Chiba', type: ActivityType.ACTIVITY, suggestion: 'O DisneySea é exclusivo do Japão e tem uma temática mais adulta e única. É altamente recomendado!', coordinates: { lat: 35.6329, lng: 139.8804 } },
    ],
  },
  {
    id: 8,
    date: '2026-01-03',
    dayOfWeek: 'Sábado',
    title: 'Palácio Imperial e Ginza',
    events: [
      { id: 801, time: 'Manhã', title: 'Jardins do Leste do Palácio Imperial', description: 'Uma caminhada tranquila pelos terrenos do antigo Castelo de Edo.', location: 'Chiyoda, Tóquio', type: ActivityType.SIGHTSEEING, coordinates: { lat: 35.6852, lng: 139.7528 } },
      { id: 802, time: 'Tarde', title: 'Compras em Ginza', description: 'Explorar o sofisticado distrito de compras, lojas de departamento e o Hakuhinkan Toy Park.', location: 'Ginza, Tóquio', type: ActivityType.SHOPPING, coordinates: { lat: 35.6714, lng: 139.7645 } },
      { id: 803, time: 'Noite', title: 'Preparar para Quioto', description: 'Fazer as malas para a viagem para Quioto amanhã.', location: 'Hotel, Tóquio', type: ActivityType.CUSTOM, coordinates: { lat: 35.6909, lng: 139.7004 } },
    ],
  },
  {
    id: 9,
    date: '2026-01-04',
    dayOfWeek: 'Domingo',
    title: 'Viagem para Quioto',
    events: [
      { id: 901, time: 'Manhã', title: 'Shinkansen para Quioto', description: 'Fazer check-out e pegar o trem-bala para Quioto. Ativar o JR Pass, se aplicável.', location: 'Estação de Tóquio', type: ActivityType.TRANSPORT, suggestion: 'Compre um "ekiben" (marmita de estação) para comer no trem. É uma experiência japonesa clássica.', coordinates: { lat: 35.6812, lng: 139.7671 } },
      { id: 902, time: 'Tarde', title: 'Kinkaku-ji e Ryoan-ji', description: 'Após o check-in, visitar o Pavilhão Dourado (Kinkaku-ji) e o jardim de pedras Ryoan-ji.', location: 'Quioto', type: ActivityType.SIGHTSEEING, coordinates: { lat: 35.0394, lng: 135.7292 } },
      { id: 903, time: 'Noite', title: 'Jantar na Estação de Quioto', description: 'Explorar o vasto complexo da Estação de Quioto para inúmeras opções de jantar.', location: 'Estação de Quioto', type: ActivityType.FOOD, suggestion: 'Vá ao 10º andar para a "Ramen Street" (Kyoto Ramen Koji) para provar diferentes tipos de ramen de todo o Japão.', coordinates: { lat: 34.9859, lng: 135.7588 } },
    ],
  },
  {
    id: 10,
    date: '2026-01-05',
    dayOfWeek: 'Segunda-feira',
    title: 'Natureza e Santuários de Quioto',
    events: [
      { id: 1001, time: 'Manhã', title: 'Bosque de Bambu de Arashiyama', description: 'Visitar a icônica floresta de bambu e o Templo Tenryu-ji.', location: 'Arashiyama, Quioto', type: ActivityType.SIGHTSEEING, coordinates: { lat: 35.0175, lng: 135.6763 } },
      { id: 1002, time: 'Tarde', title: 'Santuário Fushimi Inari', description: 'Caminhar pelos milhares de portões torii vermelhos no Fushimi Inari Taisha.', location: 'Fushimi, Quioto', type: ActivityType.SIGHTSEEING, suggestion: 'A trilha completa até o topo da montanha leva de 2 a 3 horas. Use sapatos confortáveis.', coordinates: { lat: 34.9671, lng: 135.7727 } },
      { id: 1003, time: 'Noite', title: 'Distrito de Gion', description: 'Passear pelo histórico distrito das gueixas de Gion.', location: 'Gion, Quioto', type: ActivityType.SIGHTSEEING, suggestion: 'Seja respeitoso ao tirar fotos. As gueixas e maikos são artistas indo para seus compromissos.', coordinates: { lat: 35.0036, lng: 135.7784 } },
    ],
  },
  {
    id: 11,
    date: '2026-01-06',
    dayOfWeek: 'Terça-feira',
    title: 'Castelo de Quioto e Osaka',
    events: [
        { id: 1101, time: 'Manhã', title: 'Castelo de Nijo', description: 'Explorar a antiga residência dos xoguns Tokugawa com seus "pisos de rouxinol".', location: 'Quioto', type: ActivityType.SIGHTSEEING, coordinates: { lat: 35.0142, lng: 135.7482 } },
        { id: 1102, time: 'Tarde', title: 'Viagem para Osaka', description: 'Pegar um trem rápido para Osaka e fazer check-in no hotel.', location: 'Quioto -> Osaka', type: ActivityType.TRANSPORT, coordinates: { lat: 34.7025, lng: 135.4959 } },
        { id: 1103, time: 'Noite', title: 'Dotonbori', description: 'Experimentar a vibrante vida noturna, os letreiros luminosos gigantes e a comida de rua de Dotonbori.', location: 'Dotonbori, Osaka', type: ActivityType.FOOD, suggestion: 'Não perca o takoyaki (bolinhos de polvo) e o okonomiyaki (panqueca salgada). São especialidades de Osaka.', coordinates: { lat: 34.6687, lng: 135.5013 } },
    ],
  },
  {
    id: 12,
    date: '2026-01-07',
    dayOfWeek: 'Quarta-feira',
    title: 'Universal Studios Japan',
    events: [
        { id: 1201, time: 'Dia todo', title: 'Universal Studios Japan (USJ)', description: 'Visitar a USJ, focando no Super Nintendo World e no The Wizarding World of Harry Potter. Comprar ingressos e passes expressos com antecedência.', location: 'Osaka', type: ActivityType.ACTIVITY, coordinates: { lat: 34.6654, lng: 135.4323 } },
    ],
  },
  {
    id: 13,
    date: '2026-01-08',
    dayOfWeek: 'Quinta-feira',
    title: 'Bate e volta para Hiroshima',
    events: [
        { id: 1301, time: 'Manhã', title: 'Shinkansen para Hiroshima', description: 'Pegar um trem-bala cedo de Osaka para um bate e volta.', location: 'Estação Shin-Osaka', type: ActivityType.TRANSPORT, coordinates: { lat: 34.7337, lng: 135.5001 } },
        { id: 1302, time: 'Dia', title: 'Parque Memorial da Paz', description: 'Visitar o Domo da Bomba Atômica, o Museu Memorial da Paz e o Monumento da Paz das Crianças.', location: 'Hiroshima', type: ActivityType.SIGHTSEEING, coordinates: { lat: 34.3955, lng: 132.4536 } },
        { id: 1303, time: 'Noite', title: 'Retorno para Osaka', description: 'Pegar o Shinkansen de volta para Osaka.', location: 'Hiroshima -> Osaka', type: ActivityType.TRANSPORT, coordinates: { lat: 34.3973, lng: 132.4553 } },
    ],
  },
  {
    id: 14,
    date: '2026-01-09',
    dayOfWeek: 'Sexta-feira',
    title: 'Bate e volta para Kobe',
    events: [
        { id: 1401, time: 'Dia todo', title: 'Explorar Kobe', description: 'Pegar um trem rápido para Kobe. Saborear o mundialmente famoso bife de Kobe no almoço e explorar a área do porto e a Chinatown da cidade.', location: 'Kobe', type: ActivityType.FOOD, suggestion: 'Para uma experiência autêntica de bife de Kobe, procure por restaurantes teppanyaki, onde o chef cozinha na sua frente.', coordinates: { lat: 34.6901, lng: 135.1955 } },
        { id: 1402, time: 'Noite', title: 'Retorno e Malas', description: 'Voltar para Osaka e se preparar para a viagem de volta a Tóquio.', location: 'Osaka', type: ActivityType.CUSTOM, coordinates: { lat: 34.7025, lng: 135.4959 } },
    ],
  },
  {
    id: 15,
    date: '2026-01-10',
    dayOfWeek: 'Sábado',
    title: 'Retorno para Tóquio',
    events: [
        { id: 1501, time: 'Manhã', title: 'Shinkansen para Tóquio', description: 'Fazer check-out do hotel em Osaka e pegar o trem-bala de volta para Tóquio.', location: 'Osaka -> Tóquio', type: ActivityType.TRANSPORT, coordinates: { lat: 34.7337, lng: 135.5001 } },
        { id: 1502, time: 'Tarde', title: 'Check-in e Relaxar', description: 'Fazer check-in no hotel em Tóquio e explorar o bairro local.', location: 'Tóquio', type: ActivityType.ACCOMMODATION, coordinates: { lat: 35.6895, lng: 139.6917 } },
    ],
  },
  {
    id: 16,
    date: '2026-01-11',
    dayOfWeek: 'Domingo',
    title: 'Inovação e Diversão em Tóquio',
    events: [
      { id: 1601, time: 'Dia todo', title: 'Ilha de Odaiba', description: 'Visitar a ilha artificial de Odaiba. Explorar o teamLab Borderless (compre ingressos!), ver a estátua gigante do Gundam e visitar o museu de ciências Miraikan.', location: 'Odaiba, Tóquio', type: ActivityType.SIGHTSEEING, coordinates: { lat: 35.6304, lng: 139.7766 } },
      { id: 1602, time: 'Noite', title: 'Vistas da Rainbow Bridge', description: 'Jantar com vista para a iluminada Rainbow Bridge.', location: 'Odaiba, Tóquio', type: ActivityType.FOOD, coordinates: { lat: 35.6355, lng: 139.7758 } },
    ],
  },
   {
    id: 17,
    date: '2026-01-12',
    dayOfWeek: 'Segunda-feira',
    title: 'Dia de Esqui em Niigata',
    events: [
      { id: 1701, time: 'Dia todo', title: 'Resort de Esqui GALA Yuzawa', description: 'Pegar o Shinkansen diretamente para a estação GALA Yuzawa para um dia de esqui. O resort oferece aluguel completo de equipamentos.', location: 'Prefeitura de Niigata', type: ActivityType.ACTIVITY, suggestion: 'O JR Tokyo Wide Pass pode cobrir essa viagem de ida e volta, tornando-a muito econômica.', coordinates: { lat: 36.9388, lng: 138.7951 } },
    ],
  },
  {
    id: 18,
    date: '2026-01-13',
    dayOfWeek: 'Terça-feira',
    title: 'Bate e volta para Yokohama',
    events: [
        { id: 1801, time: 'Manhã', title: 'Minato Mirai 21', description: 'Visitar o parque de diversões Cosmo World e o Museu do Cup Noodles.', location: 'Yokohama', type: ActivityType.SIGHTSEEING, coordinates: { lat: 35.4556, lng: 139.6375 } },
        { id: 1802, time: 'Tarde', title: 'Chinatown', description: 'Almoçar e explorar a maior Chinatown do Japão.', location: 'Yokohama', type: ActivityType.FOOD, coordinates: { lat: 35.4437, lng: 139.6439 } },
        { id: 1803, time: 'Noite', title: 'Retorno para Tóquio', description: 'Pegar um trem local de volta para Tóquio.', location: 'Yokohama -> Tóquio', type: ActivityType.TRANSPORT, coordinates: { lat: 35.4658, lng: 139.6227 } },
    ],
  },
   {
    id: 19,
    date: '2026-01-14',
    dayOfWeek: 'Quarta-feira',
    title: 'Dia Livre em Tóquio',
    events: [
      { id: 1901, time: 'Dia todo', title: 'Exploração Livre e Compras', description: 'Um dia livre para compras de última hora, revisitar um lugar favorito ou explorar um novo bairro como o Jardim Nacional Shinjuku Gyoen.', location: 'Tóquio', type: ActivityType.SHOPPING, coordinates: { lat: 35.6852, lng: 139.7079 } },
    ],
  },
   {
    id: 20,
    date: '2026-01-15',
    dayOfWeek: 'Quinta-feira',
    title: 'Partida do Japão',
    events: [
      { id: 2001, time: 'Manhã', title: 'Última Refeição Japonesa', description: 'Aproveitar um último café da manhã e almoço em Tóquio.', location: 'Tóquio', type: ActivityType.FOOD, coordinates: { lat: 35.6812, lng: 139.7671 } },
      { id: 2002, time: 'Tarde', title: 'Check-out e Aeroporto', description: 'Fazer check-out do hotel e ir para o aeroporto de Narita (NRT) ou Haneda (HND).', location: 'Tóquio', type: ActivityType.TRANSPORT, coordinates: { lat: 35.7720, lng: 140.3863 } },
      { id: 2003, time: '19:30', title: 'Voo de Volta', description: 'Partida do Japão.', location: 'Aeroporto de Tóquio', type: ActivityType.FLIGHT, coordinates: { lat: 35.7720, lng: 140.3863 } },
    ],
  },
];
