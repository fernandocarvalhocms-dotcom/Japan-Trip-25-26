import { ChecklistCategory } from '../types';

export const checklistData: ChecklistCategory[] = [
  {
    title: 'Documentos e Dinheiro',
    items: [
      { id: 1, label: 'Passaporte e Visto' },
      { id: 2, label: 'Passagens Aéreas (impressas ou digitais)' },
      { id: 3, label: 'Reservas de Hotel (impressas ou digitais)' },
      { id: 4, label: 'JR Pass (voucher de troca)' },
      { id: 5, label: 'Carteira de Motorista Internacional (se for dirigir)' },
      { id: 6, label: 'Seguro Viagem' },
      { id: 7, label: 'Cartões de Crédito/Débito' },
      { id: 8, label: 'Ienes (dinheiro em espécie para pequenas despesas)' },
    ],
  },
  {
    title: 'Eletrônicos',
    items: [
      { id: 10, label: 'Celular e Carregador' },
      { id: 11, label: 'Power Bank (bateria externa)' },
      { id: 12, label: 'Adaptador de Tomada (Tipo A/B)' },
      { id: 13, label: 'Câmera Fotográfica e Baterias' },
      { id: 14, label: 'Cartões de Memória' },
      { id: 15, label: 'Fones de Ouvido' },
      { id: 16, label: 'Chip de celular local ou Wi-Fi portátil' },
    ],
  },
  {
    title: 'Roupas e Acessórios (Inverno)',
    items: [
      { id: 20, label: 'Casaco de inverno pesado' },
      { id: 21, label: 'Roupas térmicas (segunda pele)' },
      { id: 22, label: 'Blusas de lã ou fleece' },
      { id: 23, label: 'Calças confortáveis' },
      { id: 24, label: 'Gorro, luvas e cachecol' },
      { id: 25, label: 'Meias quentes' },
      { id: 26, label: 'Calçados confortáveis e impermeáveis' },
      { id: 27, label: 'Mochila pequena para o dia a dia' },
    ],
  },
    {
    title: 'Higiene e Saúde',
    items: [
      { id: 30, label: 'Itens de higiene pessoal' },
      { id: 31, label: 'Protetor solar e labial' },
      { id: 32, label: 'Hidratante (o ar pode ser seco)' },
      { id: 33, label: 'Farmacinha pessoal (analgésicos, curativos, etc.)' },
      { id: 34, label: 'Álcool em gel' },
      { id: 35, label: 'Máscaras faciais (ainda comuns em alguns locais)' },
    ],
  },
  {
    title: 'Essenciais para Passeios Diários',
    items: [
      { id: 40, label: 'Mochila' },
      { id: 41, label: 'Garrafa de água reutilizável' },
      { id: 42, label: 'Power Bank carregado' },
      { id: 43, label: 'Dinheiro (Ienes)' },
      { id: 44, label: 'JR Pass (se estiver usando)' },
      { id: 45, label: 'Mapa ou app de navegação (Google Maps)' },
      { id: 46, label: 'Sacola para lixo (lixeiras são raras)' },
    ],
  },
];
