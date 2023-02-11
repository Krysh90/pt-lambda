import { WhaleClient } from '../ocean/whale-client'

const fs = require('fs')

const doSomething = async () => {
  const prices = await new WhaleClient().getPrices()
  fs.writeFileSync('./dist/prices.json', JSON.stringify(prices, null, 2), 'utf-8')
  const poolPairs = await new WhaleClient().getPoolPairs()
  fs.writeFileSync('./dist/poolPairs.json', JSON.stringify(poolPairs, null, 2), 'utf-8')
  const dexPrices = await new WhaleClient().getDexPrices()
  fs.writeFileSync('./dist/dexPrices.json', JSON.stringify(dexPrices, null, 2), 'utf-8')
}

doSomething()
