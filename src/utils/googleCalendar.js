// Utilitários de Integração com Google Agenda (Google Calendar) e Exportador .ICS

/**
 * Gera URL direta para adicionar evento no Google Agenda com 1 clique
 */
export function generateGoogleCalendarUrl(obrigacao) {
  const title = encodeURIComponent(`[Y7 Fiscal] ${obrigacao.obrigacao} - ${obrigacao.clienteNome}`);
  
  // Converte data YYYY-MM-DD para formato do Google Calendar
  const dateStr = obrigacao.vencimento.replace(/-/g, '');
  // Evento de dia inteiro ou horário das 09h às 10h
  const dates = `${dateStr}T120000Z/${dateStr}T130000Z`;

  const details = encodeURIComponent(
    `ALERTA DE OBRIGAÇÃO CONTÁBIL - Y7 SERVICE LTDA\n` +
    `--------------------------------------------------\n` +
    `📌 Obrigação: ${obrigacao.obrigacao}\n` +
    `🏢 Cliente: ${obrigacao.clienteNome}\n` +
    `📑 CNPJ: ${obrigacao.cnpj}\n` +
    `⚖️ Regime Tributário: ${obrigacao.regime}\n` +
    `📅 Competência: ${obrigacao.competencia}\n` +
    `🚨 Data Limite: ${obrigacao.vencimento}\n` +
    `👤 Responsável: ${obrigacao.responsavel || 'Contador Responsável'}\n` +
    `📝 Observações: ${obrigacao.observacao || 'Nenhuma'}\n\n` +
    `Gerado por Y7 Service - Inteligência e Compliance Contábil\n` +
    `Av. Copacabana, 112 - Sala 1712 - Alphaville, Barueri/SP\n` +
    `Email: contabil@y7service.com.br`
  );

  const location = encodeURIComponent('Y7 Service Ltda - Alphaville, Barueri - SP');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Gera e realiza o download de arquivo .ics contendo múltiplas ou uma obrigação
 * Compatível nativamente com Google Agenda, Apple Calendar e Outlook
 */
export function exportToIcsCalendar(obrigacoes, filename = 'Y7_Obrigacoes_Google_Calendar.ics') {
  if (!obrigacoes || obrigacoes.length === 0) return false;

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Y7 Service Ltda//Compliance Contabil//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Y7 Service - Prazos Fiscais',
    'X-WR-TIMEZONE:America/Sao_Paulo'
  ];

  obrigacoes.forEach(ob => {
    const dateFormatted = ob.vencimento.replace(/-/g, '');
    const uid = `${ob.id}-${Date.now()}@y7service.com.br`;
    const summary = `[Y7 Fiscal] ${ob.obrigacao} - ${ob.clienteNome}`;
    const description = `Prazo de entrega da obrigacao ${ob.obrigacao} para ${ob.clienteNome} (CNPJ: ${ob.cnpj}) - Regime: ${ob.regime} - Competencia: ${ob.competencia}. Contato Y7: contabil@y7service.com.br`;

    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:${uid}`);
    icsContent.push(`DTSTAMP:${dateFormatted}T090000Z`);
    icsContent.push(`DTSTART;VALUE=DATE:${dateFormatted}`);
    icsContent.push(`DTEND;VALUE=DATE:${dateFormatted}`);
    icsContent.push(`SUMMARY:${summary}`);
    icsContent.push(`DESCRIPTION:${description}`);
    icsContent.push('LOCATION:Y7 Service - Alphaville, Barueri/SP');
    icsContent.push('STATUS:CONFIRMED');

    // Alarme 2 dias antes
    icsContent.push('BEGIN:VALARM');
    icsContent.push('TRIGGER:-P2D');
    icsContent.push('ACTION:DISPLAY');
    icsContent.push(`DESCRIPTION:Alerta Y7: Faltam 2 dias para o vencimento da obrigação ${ob.obrigacao}`);
    icsContent.push('END:VALARM');

    // Alarme no dia do vencimento às 08h
    icsContent.push('BEGIN:VALARM');
    icsContent.push('TRIGGER:-PT1H');
    icsContent.push('ACTION:DISPLAY');
    icsContent.push(`DESCRIPTION:Alerta Y7: Vence hoje a obrigação ${ob.obrigacao} de ${ob.clienteNome}`);
    icsContent.push('END:VALARM');

    icsContent.push('END:VEVENT');
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  return true;
}
