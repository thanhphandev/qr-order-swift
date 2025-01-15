import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {formatDistanceToNowStrict} from 'date-fns'
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function formatDate(
  date: string | Date,
  options?: { showTime?: boolean; onlyTime?: boolean }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dateFormat = 'dd/MM/yyyy';
  const timeFormat = 'HH:mm';

  // Decide format based on options
  if (options?.onlyTime) {
    return format(dateObj, timeFormat, { locale: vi });
  }

  const fullFormat = options?.showTime ? `${dateFormat} ${timeFormat}` : dateFormat;
  return format(dateObj, fullFormat, { locale: vi });
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function relativeDate(from: Date){
  if (isNaN(from.getTime())) {
    return 'Invalid date';
  }
  return formatDistanceToNowStrict(from, { addSuffix: true, locale: vi })
}

export function formatMoney(amount: number){
  return new Intl.NumberFormat('vi-VN',
    { style: 'currency',
     currency: 'VND' }).format(amount)
}

export function toPathLink(text: string): string {
  
  const from = "àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ";
  const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";
  
  let normalized = text
    .toLowerCase()
    .split('')
    .map(char => {
      const index = from.indexOf(char);
      return index !== -1 ? to[index] : char;
    })
    .join('');
  
  normalized = normalized
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return normalized;
}

export const getSegment = (path: string) => {
  const segments = path.split('/').filter(Boolean);
  return segments;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    const billionValue = value / 1_000_000_000;
    return `${billionValue.toFixed(1).replace('.', ',')} tỷ`;
  } else if (value >= 1_000_000) {
    const millionValue = value / 1_000_000;
    return `${millionValue.toFixed(1).replace('.', ',')} triệu`;
  }
  return `${value.toLocaleString('vi-VN')} VNĐ`;
}
