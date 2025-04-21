import winston from 'winston'
import path from 'path'

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Define level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : process.env.LOG_LEVEL || 'info'
}

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
}

// Add colors to winston
winston.addColors(colors)

// Define format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
)

// Define format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.json()
)

// Define transports
const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
  }),
]

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
  transports.push(
    // Error log file
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: fileFormat,
    }),
    // Combined log file
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      format: fileFormat,
    })
  )
}

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
})

export default logger