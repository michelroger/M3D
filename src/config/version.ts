export interface VersionRelease {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export const APP_VERSION = '1.0.0';
export const APP_BUILD_DATE = '2026-08-14';

export const CHANGELOG: VersionRelease[] = [
  {
    version: '1.0.0',
    date: '2026-08-14',
    title: 'Lançamento Oficial da Plataforma M3D',
    changes: [
      'Vitrine interativa de peças 3D estilo MakerWorld',
      'Visualizador 3D WebGL com rotação, zoom e troca dinâmica de cores',
      'Formulário de solicitação de orçamento com envio direto para o WhatsApp',
      'Painel Administrativo com proteção de senha criptografada (SHA-256)',
      'Calculadora de custos de impressão 3D (filamento, energia, depreciação e margem)',
      'Deploy automatizado com CI/CD no GitHub Actions e GitHub Pages',
    ],
  },
];
