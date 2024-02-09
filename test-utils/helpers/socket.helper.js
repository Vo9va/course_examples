import socketIo from 'socket.io-client';
import reportPortalHelper from './reportPortal.helper';
import config from '../../config';

/**
 * Returns quotes info
 * @param {string} symbolId Type only valid symbolId
 * @returns {Promise} Promise object
 */
export async function getQuotesInfo(symbolId) {
  return new Promise((resolve, reject) => {
    const socket = socketIo(`wss://streamer.${config.default.apiURL.split('.')[1]}.com`, {
      path: '/ws',
      allowEIO3: true,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      reportPortalHelper.logInfo(`Socket Successful connection`);
    });

    socket.on('connect_error', (error) => {
      console.error(error);

      return reject(error);
    });

    socket.on('connect_timeout', (timeout) => {
      console.error(timeout);

      return reject(timeout);
    });

    socket.on('error', (error) => {
      reportPortalHelper.logInfo('An error has occurred:', error);

      socket.close();

      return reject(error);
    });

    socket.on('disconnect', (reason) => {
      reportPortalHelper.logInfo('disconnect:', reason);
    });

    socket.emit('getLimitedQuotes', { symbol_symbols: [`${symbolId}`] });

    socket.on('quotes', (data) => {
      socket.close();

      return resolve(data[symbolId]);
    });
  });
}
