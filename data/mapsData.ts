
import { MapArea } from '../types';

export const mapsData: MapArea[] = [
  {
    id: 'akihabara',
    title: 'Akihabara',
    description: 'A "Cidade Elétrica", um verdadeiro paraíso para os amantes dos eletrônicos, cultura otaku (anime, mangá, videogames), fliperamas e café temáticos.',
    generalTips: [
      "A oeste da Estação de Akihabara, a maior parte das lojas de eletrônicos se situa na Chuo Dori.",
      "A melhor forma de entrar pelo 'coração nervoso' é pegar a saída Electric Town na estação Akihabara JR.",
      "Dê preferência, se possível, ir a Akihabara no domingo, pois as ruas são fechadas para o trânsito."
    ],
    nodes: [
      { id: 'akihabara_st', label: 'Akihabara St.', x: 50, y: 85, type: 'station', labelPos: 'bottom', description: 'Hub central. JR Lines, Tsukuba Express e Hibiya Line.' },
      { id: 'suehirocho_st', label: 'Suehirocho St.', x: 50, y: 10, type: 'station', labelPos: 'top', description: 'Metrô Ginza Line. Acesso norte ao distrito.' },
      { id: 'kanda_myojin', label: 'Santuário Kanda', x: 20, y: 10, type: 'landmark', labelPos: 'bottom', description: 'Santuário histórico próximo ao centro tecnológico.' },
      { id: 'maidreamin', label: 'Maidreamin', x: 65, y: 25, type: 'food', labelPos: 'bottom', description: 'Maid Café popular (Head Store).' },
      { id: 'gachapon', label: 'Gachapon Hall', x: 35, y: 25, type: 'shop', labelPos: 'left', description: 'Máquinas de brinquedos e miniaturas.' },
      { id: 'don_quijote', label: 'Don Quijote', x: 30, y: 45, type: 'shop', labelPos: 'left', description: 'Vende de tudo. Edifício icônico com o pinguim.' },
      { id: 'animate', label: 'Animate', x: 65, y: 45, type: 'shop', labelPos: 'right', description: 'Loja enorme de Anime e Mangás.' },
      { id: 'radio_kaikan', label: 'Radio Kaikan', x: 65, y: 85, type: 'shop', labelPos: 'top', description: 'Ícone de Akihabara. Livros, figuras, eletrônicos.' },
      { id: 'super_potato', label: 'Super Potato', x: 30, y: 65, type: 'shop', labelPos: 'left', description: 'Paraíso dos jogos retrô.' },
      { id: 'yodobashi', label: 'Yodobashi Akiba', x: 80, y: 75, type: 'shop', labelPos: 'top', description: 'Shopping diversificado de eletrônicos gigante.' },
      { id: 'mandarake', label: 'Mandarake', x: 15, y: 55, type: 'shop', labelPos: 'bottom', description: 'Complexo de produtos otaku usados e raros.' },
      { id: 'owl_cafe', label: 'Owl Café', x: 75, y: 55, type: 'food', labelPos: 'right', description: 'Café interativo com corujas.' },
    ],
    edges: [
      { from: 'suehirocho_st', to: 'kanda_myojin', label: '6\'' },
      { from: 'suehirocho_st', to: 'gachapon', label: '2\'' },
      { from: 'suehirocho_st', to: 'maidreamin', label: '2\'' },
      { from: 'gachapon', to: 'don_quijote', label: '2\'' },
      { from: 'don_quijote', to: 'animate', label: '1\'' },
      { from: 'animate', to: 'super_potato', label: '2\'' },
      { from: 'super_potato', to: 'akihabara_st', label: '4\'' },
      { from: 'akihabara_st', to: 'radio_kaikan', label: '1\'' },
      { from: 'akihabara_st', to: 'yodobashi', label: '1\'' },
      { from: 'mandarake', to: 'don_quijote', label: '2\'' },
      { from: 'owl_cafe', to: 'akihabara_st', label: '5\'' },
    ]
  },
  {
    id: 'asakusa',
    title: 'Asakusa',
    description: 'Bairro histórico com o Templo Senso-ji. Atmosfera da antiga Edo com ruas de compras tradicionais.',
    generalTips: [
      "Vá cedo para evitar multidões no Senso-ji.",
      "Experimente o ritual do incenso (jokoro) para purificação.",
      "Prove os doces da Nakamise Dori."
    ],
    nodes: [
      { id: 'kaminarimon', label: 'Kaminarimon', x: 50, y: 75, type: 'landmark', labelPos: 'left', description: 'Portão do Trovão com a enorme lanterna vermelha.' },
      { id: 'nakamise', label: 'Nakamise Dori', x: 50, y: 60, type: 'shop', labelPos: 'right', description: 'Rua de souvenirs e iguarias que leva ao templo.' },
      { id: 'hozomon', label: 'Hozomon', x: 50, y: 45, type: 'landmark', labelPos: 'left', description: 'Portal que dá acesso direto ao Senso-ji.' },
      { id: 'sensoji', label: 'Templo Senso-ji', x: 50, y: 30, type: 'landmark', labelPos: 'top', description: 'O templo mais antigo e famoso de Tóquio.' },
      { id: 'asakusa_st', label: 'Asakusa St.', x: 70, y: 80, type: 'station', labelPos: 'bottom', description: 'Ginza Line, Asakusa Line.' },
      { id: 'skytree', label: 'Tokyo Skytree', x: 90, y: 65, type: 'landmark', labelPos: 'left', description: 'Acesso via ponte sobre o Rio Sumida.' },
      { id: 'hoppy_street', label: 'Hoppy Street', x: 30, y: 55, type: 'food', labelPos: 'left', description: 'Rua com tradicionais izakayas.' },
      { id: 'don_quijote', label: 'Don Quijote', x: 25, y: 70, type: 'shop', labelPos: 'bottom', description: 'Loja de variedades.' },
      { id: 'hanayashiki', label: 'Hanayashiki', x: 35, y: 35, type: 'activity', labelPos: 'left', description: 'Parque de diversões mais antigo do Japão.' },
    ],
    edges: [
      { from: 'asakusa_st', to: 'kaminarimon', label: '1\'' },
      { from: 'kaminarimon', to: 'nakamise', label: '1\'' },
      { from: 'nakamise', to: 'hozomon', label: '4\'' },
      { from: 'hozomon', to: 'sensoji', label: '1\'' },
      { from: 'hozomon', to: 'hoppy_street', label: '2\'' },
      { from: 'hozomon', to: 'hanayashiki', label: '1\'' },
      { from: 'hoppy_street', to: 'don_quijote', label: '1\'' },
      { from: 'asakusa_st', to: 'skytree', label: '15\'' },
    ]
  },
  {
    id: 'harajuku',
    title: 'Harajuku & Meiji-Jingu',
    description: 'Onde a moda kawaii encontra a tradição xintoísta. Cosplay, crepes e floresta sagrada.',
    generalTips: [
      "Visite aos domingos para ver as 'tribos' urbanas.",
      "Meiji-Jingu é um refúgio sereno com 100.000 árvores.",
      "Prove os crepes da Takeshita Street."
    ],
    nodes: [
      { id: 'harajuku_st', label: 'Harajuku St.', x: 45, y: 45, type: 'station', labelPos: 'top', description: 'JR Yamanote Line. Nova estação moderna.' },
      { id: 'meiji_st', label: 'Meiji-Jingumae', x: 50, y: 55, type: 'station', labelPos: 'bottom', description: 'Metrô Chiyoda/Fukutoshin Line.' },
      { id: 'takeshita', label: 'Takeshita St.', x: 60, y: 40, type: 'shop', labelPos: 'right', description: 'Rua turística famosa, cultura kawaii.' },
      { id: 'meiji_jingu', label: 'Meiji-Jingu', x: 15, y: 35, type: 'landmark', labelPos: 'bottom', description: 'Santuário xintoísta imperial.' },
      { id: 'yoyogi', label: 'Yoyogi Park', x: 20, y: 60, type: 'landmark', labelPos: 'bottom', description: 'Parque vibrante ao lado do santuário.' },
      { id: 'omotesando', label: 'Omotesando', x: 70, y: 65, type: 'shop', labelPos: 'bottom', description: 'Avenida de grifes, "Champs-Élysées de Tóquio".' },
      { id: 'cat_street', label: 'Cat Street', x: 80, y: 50, type: 'shop', labelPos: 'left', description: 'Lojas descoladas, conexão com Shibuya.' },
      { id: 'togo', label: 'Togo Shrine', x: 65, y: 20, type: 'landmark', labelPos: 'bottom', description: 'Santuário tranquilo perto da Takeshita.' },
    ],
    edges: [
      { from: 'harajuku_st', to: 'takeshita', label: '1\'' },
      { from: 'harajuku_st', to: 'meiji_jingu', label: '3\'' },
      { from: 'harajuku_st', to: 'meiji_st', label: '1\'' },
      { from: 'meiji_st', to: 'omotesando', label: '5\'' },
      { from: 'takeshita', to: 'cat_street', label: '5\'' },
      { from: 'takeshita', to: 'togo', label: '2\'' },
    ]
  },
  {
    id: 'shibuya',
    title: 'Shibuya',
    description: 'O cruzamento mais famoso do mundo, Hachiko e compras infinitas.',
    generalTips: [
      "Reserve o Shibuya Sky com antecedência.",
      "Hachiko fica na saída 'Hachiko Exit'.",
      "Mag's Park tem vista aérea do cruzamento."
    ],
    nodes: [
      { id: 'shibuya_st', label: 'Shibuya St.', x: 55, y: 70, type: 'station', labelPos: 'bottom', description: 'Hub gigante. JR, Metrô, Keio, Tokyu.' },
      { id: 'hachiko', label: 'Hachiko', x: 50, y: 60, type: 'landmark', labelPos: 'left', description: 'Estátua do cão leal.' },
      { id: 'scramble', label: 'Scramble Cross.', x: 45, y: 50, type: 'landmark', labelPos: 'top', description: 'O cruzamento icônico.' },
      { id: 'shibuya_109', label: 'Shibuya 109', x: 30, y: 45, type: 'shop', labelPos: 'left', description: 'Ícone da moda jovem.' },
      { id: 'center_gai', label: 'Center Gai', x: 35, y: 35, type: 'food', labelPos: 'top', description: 'Rua principal de pedestres.' },
      { id: 'shibuya_sky', label: 'Shibuya Sky', x: 65, y: 65, type: 'landmark', labelPos: 'right', description: 'Observatório incrível no Scramble Square.' },
      { id: 'parco', label: 'Parco', x: 40, y: 20, type: 'shop', labelPos: 'right', description: 'Nintendo Store, Pokémon Center.' },
      { id: 'miyashita', label: 'Miyashita Park', x: 65, y: 40, type: 'landmark', labelPos: 'right', description: 'Parque no terraço e shopping.' },
    ],
    edges: [
      { from: 'shibuya_st', to: 'hachiko', label: '1\'' },
      { from: 'hachiko', to: 'scramble', label: '1\'' },
      { from: 'scramble', to: 'shibuya_109', label: '2\'' },
      { from: 'scramble', to: 'center_gai', label: '1\'' },
      { from: 'shibuya_st', to: 'shibuya_sky', label: '0\'' },
      { from: 'center_gai', to: 'parco', label: '4\'' },
      { from: 'shibuya_st', to: 'miyashita', label: '4\'' },
    ]
  },
  {
    id: 'shinjuku',
    title: 'Shinjuku',
    description: 'A estação mais movimentada do mundo. Arranha-céus, Kabukicho e Godzilla.',
    generalTips: [
      "Saída Leste (Higashi): Kabukicho, Godzilla.",
      "Saída Oeste (Nishi): Governo Metropolitano.",
      "Golden Gai: Bares minúsculos, respeite as regras."
    ],
    nodes: [
      { id: 'shinjuku_st', label: 'Shinjuku St.', x: 50, y: 60, type: 'station', labelPos: 'bottom', description: 'Labirinto subterrâneo massivo.' },
      { id: 'kabukicho', label: 'Kabukicho', x: 60, y: 40, type: 'landmark', labelPos: 'top', description: 'Distrito da luz vermelha e entretenimento.' },
      { id: 'godzilla', label: 'Godzilla Head', x: 65, y: 30, type: 'landmark', labelPos: 'right', description: 'No topo do Toho Building.' },
      { id: 'golden_gai', label: 'Golden Gai', x: 75, y: 40, type: 'food', labelPos: 'right', description: 'Vielas com micro-bares autênticos.' },
      { id: 'omoide', label: 'Omoide Yokocho', x: 40, y: 50, type: 'food', labelPos: 'left', description: '"Piss Alley". Beco de yakitori.' },
      { id: 'metro_gov', label: 'Gov. Building', x: 20, y: 60, type: 'landmark', labelPos: 'bottom', description: 'Observatório gratuito.' },
      { id: 'gyoen', label: 'Shinjuku Gyoen', x: 70, y: 70, type: 'landmark', labelPos: 'bottom', description: 'Parque enorme e tranquilo.' },
      { id: 'isetan', label: 'Isetan', x: 60, y: 60, type: 'shop', labelPos: 'top', description: 'Loja de departamento de luxo.' },
    ],
    edges: [
      { from: 'shinjuku_st', to: 'kabukicho', label: '5\'' },
      { from: 'kabukicho', to: 'godzilla', label: '2\'' },
      { from: 'kabukicho', to: 'golden_gai', label: '4\'' },
      { from: 'shinjuku_st', to: 'omoide', label: '3\'' },
      { from: 'shinjuku_st', to: 'metro_gov', label: '10\'' },
      { from: 'shinjuku_st', to: 'isetan', label: '5\'' },
      { from: 'shinjuku_st', to: 'gyoen', label: '10\'' },
    ]
  },
  {
    id: 'ueno',
    title: 'Ueno',
    description: 'Cultura e natureza. Parque com museus, zoológico e o vibrante mercado Ameyoko.',
    generalTips: [
      "O Parque de Ueno tem 6 museus e um zoológico.",
      "Ameyoko: ótimo para comida de rua e bargains.",
      "Museu Nacional: o maior do Japão."
    ],
    nodes: [
      { id: 'ueno_st', label: 'Ueno St.', x: 70, y: 70, type: 'station', labelPos: 'bottom', description: 'JR Yamanote, Shinkansen, Metrô.' },
      { id: 'ameyoko', label: 'Ameyoko', x: 60, y: 80, type: 'shop', labelPos: 'left', description: 'Mercado de rua vibrante.' },
      { id: 'ueno_park', label: 'Ueno Park', x: 40, y: 40, type: 'landmark', labelPos: 'bottom', description: 'Coração cultural do bairro.' },
      { id: 'zoo', label: 'Ueno Zoo', x: 25, y: 20, type: 'activity', labelPos: 'top', description: 'Famoso pelos pandas.' },
      { id: 'national_museum', label: 'Museu Nacional', x: 60, y: 20, type: 'landmark', labelPos: 'top', description: 'Arte e história japonesa.' },
      { id: 'science_museum', label: 'Museu Ciência', x: 70, y: 35, type: 'landmark', labelPos: 'right', description: 'Ciência e natureza.' },
      { id: 'toshogu', label: 'Toshogu', x: 20, y: 35, type: 'landmark', labelPos: 'left', description: 'Santuário dourado.' },
      { id: 'marishiten', label: 'Marishiten', x: 50, y: 85, type: 'landmark', labelPos: 'bottom', description: 'Templo oculto em Ameyoko.' },
    ],
    edges: [
      { from: 'ueno_st', to: 'ueno_park', label: '2\'' },
      { from: 'ueno_st', to: 'ameyoko', label: '2\'' },
      { from: 'ueno_park', to: 'zoo', label: '5\'' },
      { from: 'ueno_park', to: 'national_museum', label: '5\'' },
      { from: 'ueno_park', to: 'science_museum', label: '3\'' },
      { from: 'ueno_park', to: 'toshogu', label: '4\'' },
      { from: 'ameyoko', to: 'marishiten', label: '2\'' },
    ]
  },
  {
    id: 'ginza',
    title: 'Ginza & Tsukiji',
    description: 'Luxo e tradição. O distrito de compras mais caro e o histórico mercado de peixes.',
    generalTips: [
      "Chuo Dori fecha para carros nos fins de semana à tarde.",
      "Tsukiji Outer Market: vá de manhã para o sushi mais fresco.",
      "Kabukiza: ingressos 'Hitomaku-mi' para ver apenas um ato."
    ],
    nodes: [
      { id: 'ginza_st', label: 'Ginza St.', x: 45, y: 50, type: 'station', labelPos: 'bottom', description: 'O coração de Ginza.' },
      { id: 'wako', label: 'Clock Tower', x: 50, y: 45, type: 'landmark', labelPos: 'top', description: 'Símbolo de Ginza (Seiko House).' },
      { id: 'ginza_six', label: 'Ginza Six', x: 40, y: 65, type: 'shop', labelPos: 'left', description: 'Shopping de luxo com jardim no teto.' },
      { id: 'itoya', label: 'Itoya', x: 50, y: 30, type: 'shop', labelPos: 'top', description: 'Papelaria lendária de 12 andares.' },
      { id: 'uniqlo', label: 'Uniqlo Ginza', x: 35, y: 55, type: 'shop', labelPos: 'left', description: 'Flagship store de 12 andares.' },
      { id: 'kabukiza', label: 'Teatro Kabukiza', x: 65, y: 50, type: 'landmark', labelPos: 'top', description: 'Teatro tradicional Kabuki.' },
      { id: 'tsukiji_st', label: 'Tsukiji St.', x: 75, y: 60, type: 'station', labelPos: 'top', description: 'Hibiya Line.' },
      { id: 'tsukiji_mkt', label: 'Tsukiji Market', x: 80, y: 70, type: 'food', labelPos: 'bottom', description: 'Mercado externo. Paraíso do sushi.' },
      { id: 'imperial', label: 'Palácio Imperial', x: 15, y: 20, type: 'landmark', labelPos: 'right', description: 'Residência do Imperador.' },
    ],
    edges: [
      { from: 'ginza_st', to: 'wako', label: '1\'' },
      { from: 'ginza_st', to: 'ginza_six', label: '4\'' },
      { from: 'ginza_st', to: 'uniqlo', label: '4\'' },
      { from: 'wako', to: 'itoya', label: '4\'' },
      { from: 'ginza_st', to: 'kabukiza', label: '5\'' },
      { from: 'kabukiza', to: 'tsukiji_st', label: '5\'' },
      { from: 'tsukiji_st', to: 'tsukiji_mkt', label: '3\'' },
      { from: 'ginza_st', to: 'imperial', label: '15\'' },
    ]
  },
  {
    id: 'odaiba',
    title: 'Odaiba',
    description: 'Ilha artificial futurista. Gundam gigante, vistas da baía e entretenimento high-tech.',
    generalTips: [
      "Acesso via Yurikamome Line (trem sem condutor) oferece vistas lindas.",
      "Gundam se move em horários específicos.",
      "Melhor vista da Rainbow Bridge é do Marine Park."
    ],
    nodes: [
      { id: 'daiba_st', label: 'Daiba St.', x: 35, y: 45, type: 'station', labelPos: 'bottom', description: 'Yurikamome Line.' },
      { id: 'joypolis', label: 'Tokyo Joypolis', x: 40, y: 35, type: 'activity', labelPos: 'top', description: 'Parque indoor da SEGA.' },
      { id: 'fuji_tv', label: 'Fuji TV', x: 45, y: 55, type: 'landmark', labelPos: 'bottom', description: 'Prédio futurista com esfera observatório.' },
      { id: 'divercity', label: 'DiverCity', x: 55, y: 60, type: 'shop', labelPos: 'right', description: 'Shopping do Gundam.' },
      { id: 'gundam', label: 'Gundam', x: 55, y: 70, type: 'landmark', labelPos: 'bottom', description: 'Estátua Unicorn Gundam em tamanho real.' },
      { id: 'aqua_city', label: 'Aqua City', x: 30, y: 40, type: 'shop', labelPos: 'left', description: 'Shopping com vista para a baía.' },
      { id: 'liberty', label: 'Est. Liberdade', x: 25, y: 35, type: 'landmark', labelPos: 'top', description: 'Réplica da Estátua da Liberdade.' },
      { id: 'teleport', label: 'Tokyo Teleport', x: 60, y: 50, type: 'station', labelPos: 'top', description: 'Rinkai Line.' },
      { id: 'miraikan', label: 'Miraikan', x: 20, y: 80, type: 'landmark', labelPos: 'right', description: 'Museu Nacional de Ciência e Inovação.' },
    ],
    edges: [
      { from: 'daiba_st', to: 'aqua_city', label: '1\'' },
      { from: 'aqua_city', to: 'liberty', label: '2\'' },
      { from: 'daiba_st', to: 'joypolis', label: '2\'' },
      { from: 'daiba_st', to: 'fuji_tv', label: '5\'' },
      { from: 'fuji_tv', to: 'divercity', label: '5\'' },
      { from: 'divercity', to: 'gundam', label: '1\'' },
      { from: 'divercity', to: 'teleport', label: '5\'' },
      { from: 'teleport', to: 'miraikan', label: '15\'' },
    ]
  }
];
