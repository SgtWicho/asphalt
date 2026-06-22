export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Planificador: undefined;
  Navegacion: undefined;
  Grabar: undefined;
  Publicar: undefined;
  Detalle: { routeId?: string } | undefined;
  POI: { poiId?: string } | undefined;
};

export type MainTabParamList = {
  Feed: undefined;
  Explorar: undefined;
  GrabarTab: undefined;
  Rutas: undefined;
  Perfil: undefined;
};
