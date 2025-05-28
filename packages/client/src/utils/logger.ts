export type LogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'none';

export interface LoggerOptions {
  level: LogLevel;
  customLogger?: (level: LogLevel, ...args: any[]) => void;
}

export class Logger {
  private level: LogLevel;
  private customLogger?: (level: LogLevel, ...args: any[]) => void;

  private readonly logLevels: Record<LogLevel, number> = {
    'verbose': 0,
    'debug': 1,
    'info': 2,
    'warn': 3,
    'error': 4,
    'none': 5, // Disable logging
  };

  constructor(options: Partial<LoggerOptions> = {}) {
    this.level = options.level || 'info';
    this.customLogger = options.customLogger;
  }

  public setLevel(level: LogLevel): void {
    this.level = level;
  }

  public setCustomLogger(logger: (level: LogLevel, ...args: any[]) => void): void {
    this.customLogger = logger;
  }

  public verbose(...args: any[]): void {
    this.log('verbose', ...args);
  }

  public debug(...args: any[]): void {
    this.log('debug', ...args);
  }

  public info(...args: any[]): void {
    this.log('info', ...args);
  }

  public warn(...args: any[]): void {
    this.log('warn', ...args);
  }

  public error(...args: any[]): void {
    this.log('error', ...args);
  }

  private log(level: LogLevel, ...args: any[]): void {
    // Skip logging if the level is too low or set to none
    if (this.logLevels[level] < this.logLevels[this.level]) {
      return;
    }

    if (this.customLogger) {
      this.customLogger(level, ...args);
    } else {
      // Default logging implementation
      switch (level) {
        default:
        case 'verbose':
          console.log(...args);
          break;
        case 'debug':
          console.debug(...args);
          break;
        case 'info':
          console.info(...args);
          break;
        case 'warn':
          console.warn(...args);
          break;
        case 'error':
          console.error(...args);
          break;
      }
    }
  }
}

// Create a default instance
export const defaultLogger = new Logger();