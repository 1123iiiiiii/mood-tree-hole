import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  differenceInDays,
  parseISO,
} from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';

export const formatDate = (date: string | Date, pattern = 'yyyy-MM-dd'): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern);
};

export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm');
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'yyyy-MM-dd HH:mm');
};

export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return formatDate(d);
};

export const getTimeRange = (preset: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom', startDate?: string, endDate?: string) => {
  const now = new Date();
  switch (preset) {
    case 'today':
      return {
        startDate: startOfDay(now).toISOString(),
        endDate: endOfDay(now).toISOString(),
      };
    case 'week':
      return {
        startDate: startOfWeek(now, { locale: zhCN }).toISOString(),
        endDate: endOfWeek(now, { locale: zhCN }).toISOString(),
      };
    case 'month':
      return {
        startDate: startOfMonth(now).toISOString(),
        endDate: endOfMonth(now).toISOString(),
      };
    case 'quarter':
      return {
        startDate: startOfQuarter(now).toISOString(),
        endDate: endOfQuarter(now).toISOString(),
      };
    case 'year':
      return {
        startDate: startOfYear(now).toISOString(),
        endDate: endOfYear(now).toISOString(),
      };
    case 'custom':
      return {
        startDate: startDate ? startOfDay(parseISO(startDate)).toISOString() : startOfDay(now).toISOString(),
        endDate: endDate ? endOfDay(parseISO(endDate)).toISOString() : endOfDay(now).toISOString(),
      };
  }
};

export { differenceInDays, parseISO };
