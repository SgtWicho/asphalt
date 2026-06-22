export type FeedPost = {
  id: string;
  ini: string;
  author: string;
  moto: string;
  loc: string;
  time: string;
  title: string;
  km: string;
  likes: number;
  comments: number;
  poiCount: number;
  stats: { n: string; u: string; l: string }[];
  routeGlow: string;
  gsx: number;
  gsy: number;
  gex: number;
  gey: number;
  poiBig: { x: number; y: number }[];
};

export const feedPosts: FeedPost[] = [
  {
    id: '1',
    ini: 'MR',
    author: 'Marina Ruiz',
    moto: 'Ducati Monster 937',
    loc: 'Picos de Europa',
    time: 'hace 2 h',
    title: 'Desfiladero de la Hermida',
    km: '142',
    likes: 284,
    comments: 37,
    poiCount: 3,
    stats: [
      { n: '142', u: 'km', l: 'Distancia' },
      { n: '3h 12m', u: '', l: 'Tiempo' },
      { n: '1.840', u: 'm', l: 'Desnivel' },
    ],
    routeGlow: 'M22,168 C72,150 86,70 158,80 C220,89 248,150 300,128 C322,119 336,142 344,152',
    gsx: 22,
    gsy: 168,
    gex: 344,
    gey: 152,
    poiBig: [{ x: 158, y: 80 }, { x: 300, y: 128 }],
  },
  {
    id: '2',
    ini: 'DS',
    author: 'Diego Salas',
    moto: 'Yamaha Ténéré 700',
    loc: 'Sierra de Gredos',
    time: 'ayer',
    title: 'Puerto del Pico al amanecer',
    km: '98',
    likes: 512,
    comments: 64,
    poiCount: 2,
    stats: [
      { n: '98', u: 'km', l: 'Distancia' },
      { n: '2h 04m', u: '', l: 'Tiempo' },
      { n: '1.260', u: 'm', l: 'Desnivel' },
    ],
    routeGlow: 'M20,164 C74,150 82,80 154,90 C226,99 252,150 304,128 C326,119 338,140 344,152',
    gsx: 20,
    gsy: 164,
    gex: 344,
    gey: 152,
    poiBig: [{ x: 154, y: 90 }, { x: 304, y: 128 }],
  },
];

export type ExploreRoute = {
  id: string;
  name: string;
  region: string;
  dist: string;
  desn: string;
  rating: string;
};

export const exploreRoutes: ExploreRoute[] = [
  { id: 'e1', name: 'Desfiladero de la Hermida', region: 'Picos de Europa', dist: '142', desn: '1.840', rating: '4,9' },
  { id: 'e2', name: 'Puerto del Pico', region: 'Gredos', dist: '98', desn: '1.260', rating: '4,8' },
  { id: 'e3', name: 'Costa da Morte', region: 'Galicia', dist: '76', desn: '540', rating: '4,7' },
  { id: 'e4', name: 'Sa Calobra', region: 'Mallorca', dist: '52', desn: '820', rating: '5,0' },
];

export const exploreFilters = ['Cerca de mí', 'Curvas', 'Costa', 'Montaña'];

export type RouteStyleKey = 'curvas' | 'paisaje' | 'rapida';

export const plannerDefs: Record<
  RouteStyleKey,
  {
    label: string;
    path: string;
    distance: string;
    duration: string;
    metricValue: string;
    metricLabel: string;
    indexLabel: string;
    indexTag: string;
    indexPct: string;
  }
> = {
  curvas: {
    label: 'Más curvas',
    path: 'M40,560 C90,500 60,420 130,380 C200,340 180,260 250,210 C300,175 280,120 330,90',
    distance: '148',
    duration: '4h 05m',
    metricValue: '212',
    metricLabel: 'Curvas',
    indexLabel: 'Índice de curvas',
    indexTag: 'Muy alto',
    indexPct: '88%',
  },
  paisaje: {
    label: 'Más paisaje',
    path: 'M40,560 C100,520 90,440 160,410 C230,380 220,300 280,250 C310,220 300,150 330,90',
    distance: '171',
    duration: '4h 40m',
    metricValue: '14',
    metricLabel: 'Miradores',
    indexLabel: 'Índice panorámico',
    indexTag: 'Alto',
    indexPct: '74%',
  },
  rapida: {
    label: 'Más rápida',
    path: 'M40,560 C70,460 110,380 150,300 C190,230 230,160 330,90',
    distance: '112',
    duration: '2h 18m',
    metricValue: '138',
    metricLabel: 'Min. en marcha',
    indexLabel: 'Tiempo en marcha',
    indexTag: 'Óptimo',
    indexPct: '92%',
  },
};

export const profile = {
  ini: 'MR',
  name: 'Marina Ruiz',
  handle: '@marina.rides · León, España',
  bio: 'Curvas, café y Ducati. Siempre buscando el siguiente puerto de montaña.',
  stats: [
    { n: '12.480', l: 'Km totales' },
    { n: '84', l: 'Rutas' },
    { n: '1.243', l: 'Seguidores' },
  ],
  bikes: [
    { brand: 'Ducati', model: 'Monster 937', spec: '937 cc · 2024' },
    { brand: 'Yamaha', model: 'Ténéré 700', spec: '689 cc · 2021' },
  ],
  badges: [
    { label: '10.000 km', kind: 'trophy', locked: false },
    { label: 'Madrugador', kind: 'dawn', locked: false },
    { label: 'Rey de la montaña', kind: 'peak', locked: false },
    { label: 'Ruta de costa', kind: 'wave', locked: false },
    { label: '100 rutas', kind: 'trophy', locked: true },
    { label: 'Cima legendaria', kind: 'peak', locked: true },
  ],
  routes: [
    { name: 'Desfiladero de la Hermida', km: '142', desn: '1.840', route: 'M18,92 C60,80 80,30 130,28 C168,26 180,55 188,22', sx: 18, sy: 92, ex: 188, ey: 22 },
    { name: 'Puerto del Pico', km: '98', desn: '1.260', route: 'M16,24 C60,40 90,70 130,80 C160,86 175,90 188,90', sx: 16, sy: 24, ex: 188, ey: 90 },
    { name: 'Costa da Morte', km: '76', desn: '540', route: 'M16,60 C60,40 100,70 140,55 C160,48 175,50 188,52', sx: 16, sy: 60, ex: 188, ey: 52 },
    { name: 'Lagos de Covadonga', km: '64', desn: '1.100', route: 'M18,88 C60,70 90,30 130,35 C160,38 175,40 188,40', sx: 18, sy: 88, ex: 188, ey: 40 },
  ],
};

export type SavedRoute = {
  id: string;
  name: string;
  region: string;
  km: string;
  duration: string;
  desn: string;
  date: string;
};

export const savedRoutes: SavedRoute[] = [
  { id: '1', name: 'Desfiladero de la Hermida', region: 'Picos de Europa', km: '142', duration: '3h 12m', desn: '1.840', date: '14 jun 2026' },
  { id: '2', name: 'Puerto del Pico', region: 'Gredos', km: '98', duration: '2h 04m', desn: '1.260', date: '2 jun 2026' },
  { id: 'e3', name: 'Costa da Morte', region: 'Galicia', km: '76', duration: '1h 35m', desn: '540', date: '28 may 2026' },
  { id: '4', name: 'Lagos de Covadonga', region: 'Asturias', km: '64', duration: '1h 50m', desn: '1.100', date: '19 may 2026' },
];

export const poiDetail = {
  name: 'Mirador de Santa Catalina',
  type: 'Mirador',
  rating: '4,8',
  ratingCount: 126,
  distance: '0,4 km',
  routeKm: 'km 38 de la ruta',
  recommendCount: 214,
  recommendPct: '96 %',
  info: [
    { kind: 'clock', label: 'Horario', value: 'Acceso libre · 24 h', open: true },
    { kind: 'view', label: 'Vistas', value: 'Panorámica del valle y los Picos' },
    { kind: 'park', label: 'Aparcamiento', value: 'Explanada para motos junto al acceso' },
    { kind: 'coffee', label: 'Servicios', value: 'Food truck de café los fines de semana' },
  ],
  gallery: ['marina.rides', 'diego_ds', 'anacastro', 'tomasr', 'leon_moto'],
  reviews: [
    { ini: 'JL', name: 'Javier León', time: 'hace 2 d', text: 'Vistas espectaculares, parada obligatoria en la ruta. El acceso en moto es muy cómodo.', stars: 5, bg: ['#2a6fdb', '#1f8a5b'] },
    { ini: 'AC', name: 'Ana Castro', time: 'hace 5 d', text: 'Muy bonito al atardecer, aunque se llena los fines de semana.', stars: 4, bg: ['#d32f2f', '#f9a825'] },
    { ini: 'DS', name: 'Diego Salas', time: 'hace 1 sem', text: 'Uno de los mejores miradores de la zona. Volveré seguro.', stars: 5, bg: ['#6a3fd1', '#2a6fdb'] },
  ],
};

export const routeDetail = {
  title: 'Desfiladero de la Hermida',
  tags: ['Curvas', 'Montaña'],
  author: 'Marina Ruiz',
  moto: 'Ducati Monster 937',
  date: '14 jun 2026',
  stats: [
    { n: '142', u: 'km', l: 'Distancia' },
    { n: '3h12', u: '', l: 'Duración' },
    { n: '46', u: 'km/h', l: 'Vel. media' },
    { n: '1.840', u: 'm', l: 'Desnivel' },
  ],
  photos: [
    { label: 'km 12 · valle' },
    { label: 'km 38 · mirador' },
    { label: 'km 74 · puente' },
    { label: 'km 96 · curvas' },
    { label: 'km 142 · meta' },
  ],
  pois: [
    { name: 'Mirador de Santa Catalina', type: 'Mirador', km: 'km 38', kind: 'view' },
    { name: 'Repsol La Hermida', type: 'Gasolinera', km: 'km 52', kind: 'fuel' },
    { name: 'Mesón El Puente', type: 'Comida', km: 'km 74', kind: 'food' },
  ],
  comments: [
    { ini: 'JL', name: 'Javier León', time: 'hace 3 h', text: 'Ruta brutal, las curvas del desfiladero son un espectáculo.', likes: 12, bg: ['#2a6fdb', '#1f8a5b'] },
    { ini: 'AC', name: 'Ana Castro', time: 'hace 1 d', text: '¿Cómo está el firme después de las lluvias?', likes: 4, bg: ['#d32f2f', '#f9a825'] },
    { ini: 'TR', name: 'Tomás Ríos', time: 'hace 2 d', text: 'La hice el fin de semana, totalmente recomendable.', likes: 9, bg: ['#6a3fd1', '#2a6fdb'] },
  ],
  likes: 284,
  comments_count: 37,
};

export type NavStep = {
  id: string;
  instruction: string;
  street: string;
  distance: string;
  bearing: number;
  done: boolean;
};

export const navSteps: NavStep[] = [
  { id: 'n1', instruction: 'Continúa recto', street: 'CL-6 hacia La Hermida', distance: '4,2 km', bearing: 0, done: true },
  { id: 'n2', instruction: 'Gira a la derecha', street: 'Desfiladero de la Hermida', distance: '1,8 km', bearing: 90, done: false },
  { id: 'n3', instruction: 'Gira a la izquierda', street: 'N-621 hacia Potes', distance: '6,5 km', bearing: -90, done: false },
  { id: 'n4', instruction: 'Llegada a destino', street: 'Mirador de Santa Catalina', distance: '0 km', bearing: 0, done: false },
];

export const navSummary = {
  eta: '12:48',
  remainingKm: '38',
  remainingTime: '52 min',
  nextTurnIn: '350 m',
};

export const draftRoute = {
  title: 'Desfiladero de la Hermida',
  distance: '142',
  duration: '3h 12m',
  desnivel: '1.840',
  date: '14 jun 2026',
  photos: [
    { label: 'km 12 · valle' },
    { label: 'km 38 · mirador' },
    { label: 'km 96 · curvas' },
  ],
  poiCount: 3,
  defaultTags: ['Curvas', 'Montaña'],
};
