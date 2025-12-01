/**
 * Simple logger for the application
 * Can be upgraded to Winston later
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

/**
 * Log message to console and optionally to file
 */
export function log(level: LogLevel, message: string, data?: any) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(data && { data }),
  };

  // Console output
  const consoleMethod = console[level] || console.log;
  consoleMethod(`[${level.toUpperCase()}]`, message, data || '');

  // In production, you would also write to a log file or service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Write to file or external logging service
  }
}

/**
 * Convenience methods
 */
export const logger = {
  error: (message: string, data?: any) => log(LogLevel.ERROR, message, data),
  warn: (message: string, data?: any) => log(LogLevel.WARN, message, data),
  info: (message: string, data?: any) => log(LogLevel.INFO, message, data),
  debug: (message: string, data?: any) => log(LogLevel.DEBUG, message, data),
};

/**
 * Log API request
 */
export function logRequest(method: string, url: string, ip?: string) {
  logger.info(`API Request: ${method} ${url}`, { ip });
}

/**
 * Log API response
 */
export function logResponse(method: string, url: string, statusCode: number, duration: number) {
  logger.info(`API Response: ${method} ${url} ${statusCode}`, { duration: `${duration}ms` });
}

/**
 * Performance measurement helper
 */
export function measurePerformance(name: string) {
  const start = Date.now();
  return {
    end: () => {
      const duration = Date.now() - start;
      logger.debug(`Performance: ${name}`, { duration: `${duration}ms` });
      return duration;
    },
  };
}






