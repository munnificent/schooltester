type LogLevel = 'info' | 'warn' | 'error';

class Logger {
    private isDev: boolean;

    constructor() {
        this.isDev = import.meta.env.DEV;
    }

    log(level: LogLevel, message: string, ...args: any[]) {
        if (this.isDev) {
            switch (level) {
                case 'info':
                    // eslint-disable-next-line no-console
                    console.log(`[INFO] ${message}`, ...args);
                    break;
                case 'warn':
                    // eslint-disable-next-line no-console
                    console.warn(`[WARN] ${message}`, ...args);
                    break;
                case 'error':
                    // eslint-disable-next-line no-console
                    console.error(`[ERROR] ${message}`, ...args);
                    break;
            }
        } else {
            // In production, you might want to send logs to a service like Sentry
            if (level === 'error') {
                // console.error(message, ...args); // Optional: keep errors in console for prod debugging
            }
        }
    }

    info(message: string, ...args: any[]) {
        this.log('info', message, ...args);
    }

    warn(message: string, ...args: any[]) {
        this.log('warn', message, ...args);
    }

    error(message: string, ...args: any[]) {
        this.log('error', message, ...args);
    }
}

export const logger = new Logger();
