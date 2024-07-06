export function CreateDate(date: string, time?: boolean) {
  if (!date) return '';
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const newDate = new Date(date.charAt(date.length - 1) === 'Z' ? date : date + 'Z');
  const year = new Intl.DateTimeFormat('en-au', { day: '2-digit', month: '2-digit', year:'numeric', timeZone }).format(newDate);
  const hours = new Intl.DateTimeFormat('en-au', { minute: '2-digit', hour: '2-digit', timeZone }).format(newDate);
  if (time) return `${year} at ${hours} `;
  return `${year}`;
}


export function CreateTimeOnly(date: string) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const newDate = new Date(date.charAt(date.length - 1) === 'Z' ? date : date + 'Z');
  const hours = new Intl.DateTimeFormat('en-au', { minute: '2-digit', hour: '2-digit', timeZone }).format(newDate);
  return `${hours}`;
}