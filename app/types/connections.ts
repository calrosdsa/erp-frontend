export interface ConnectionModule {
  connections: Connection[];
  title: string;
}

export interface Connection {
  entity: string;
  href: string;
  count?: number;
  add?: ()=>void;
}
