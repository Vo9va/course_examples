import constants from '../../../test-data/constants';

export default {
  async getOrderBody(agent, orderType, symbol, symbolQuotes) {
    const orderBody = {
      type_id: orderType,
      symbol_id: symbol.ID,
      volume: symbol.VOLUME,
      price: null,
      price_sl: 0,
      price_tp: 0,
    };

    if (orderType === constants.ORDER_TYPE.SELL_STOP) {
      let price = (symbolQuotes.bid / 1.5).toFixed(2);
      orderBody.price = +price;
      return orderBody;
    } else if (orderType === constants.ORDER_TYPE.BUY_STOP) {
      let price = (symbolQuotes.ask * 1.5).toFixed(2);
      orderBody.price = +price;
      return orderBody;
    } else if (orderType === constants.ORDER_TYPE.SELL) {
      let price = symbolQuotes.ask;
      orderBody.price = +price;
      return orderBody;
    } else if (orderType === constants.ORDER_TYPE.BUY) {
      let price = symbolQuotes.bid;
      orderBody.price = +price;
      return orderBody;
    }
  },
};
