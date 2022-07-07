import './pre-start'; // Must be the first import
import logger from 'jet-logger';
import server from './server';
import { db as sequelize } from "./repos/orm"


// Constants
const serverStartMsg = 'Express server started on port: ',
        port = (process.env.PORT || 80);

// Start server
server.listen(port, async () => {
    logger.info("Syncing database...");
    await sequelize.sync({alter: true})
    logger.info(serverStartMsg + port);
});
