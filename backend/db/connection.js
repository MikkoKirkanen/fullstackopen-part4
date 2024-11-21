import mongoose from 'mongoose'
import config from '../utils/config.js'
import logger from '../utils/logger.js'

const connectDB = async () => {
  logger.info('Connecting to MongoDB')
  await mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
      logger.info('Connected to MongoDB')
    })
    .catch((err) => logger.error(err))
}

export default connectDB