/*
export default function ncFormatDate(date: string) {
  // CAN LAM THEM PHAN DATE FOrMAT ---- get_option(date_format)
  if (!date) return "";

  let d = new Date(date);
  let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
  let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
  return `${mo} ${da}, ${ye}`;
}
*/
export default function ncFormatDate(date: string) {
  if (!date) return "";

  let d = new Date(date);
  let ye = d.getFullYear();
  let mo = String(d.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 두 자리로 만듦
  let da = String(d.getDate()).padStart(2, '0'); // 날짜를 두 자리로 만듦
  return `${ye}-${mo}-${da}`;
}
