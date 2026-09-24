export const site = {
  name: 'Dr. Murillo Santos',
  fullName: 'Dr. Murillo José Hryniewicz Santos',
  specialty: 'Ginecologia, Obstetrícia e Endoscopia Ginecológica',
  description: 'Cuidado integral à saúde da mulher em Maringá, do acompanhamento ginecológico à cirurgia ginecológica minimamente invasiva.',
  phoneDisplay: '(44) 99129-1105',
  phone: '5544991291105',
  address: 'Rua Princesa Isabel, 158 - Maringá/PR',
  clinic: 'Dahlia Medical Clinic',
  hours: 'Sextas-feiras, das 8h às 12h',
  instagram: 'https://www.instagram.com/dr.murillosantos/',
  facebook: 'https://www.facebook.com/profile.php?id=61574037861708',
  maps: 'https://maps.app.goo.gl/1mSRNY1S7vNkYieb6',
  crm: 'CRM-PR 43.086',
  rqe1: 'RQE 32.072',
  rqe2: 'RQE 34.548',
};
export const whatsapp = (msg='Olá, Dr. Murillo. Gostaria de agendar uma consulta.') => `https://wa.me/${site.phone}?text=${encodeURIComponent(msg)}`;
