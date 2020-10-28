import { BigInt, Address, Bytes, store } from '@graphprotocol/graph-ts'
import { LogCall } from '../types/templates/CRP/ConfigurableRightsPool'
import { ConfigurableRightsPool } from '../types/templates/CRP/ConfigurableRightsPool'
import { Pool } from '../types/templates/CRP/Pool'
import { PriceHistory, TokenPrice } from '../types/schema'
import {
  hexToDecimal,
  bigIntToDecimal,
  tokenToDecimal,
  createPoolShareEntity,
  createPoolTokenEntity,
  updatePoolLiquidity,
  saveTransaction,
  ZERO_BD,
  decrPoolCount
} from './helpers'

/************************************
 ********** CRP Controls ***********
 ************************************/

export function handlePokeWeights(event: LogCall): void {
  let crp = ConfigurableRightsPool.bind(event.address)
  let pool = Pool.bind(crp.bPool())
  let tokens = pool.getCurrentTokens()

  for (let i = 0; i < tokens.length; i++) {
    let tokenPrice = TokenPrice.load(tokens[i].toHexString())
    let priceHistoryId = tokens[i].toHexString().concat('-').concat(event.transaction.hash.toHexString()).concat('-').concat(event.logIndex.toString())
    let priceHistory = new PriceHistory(priceHistoryId)

    priceHistory.price = tokenPrice.price
    priceHistory.timestamp = event.block.timestamp;
    priceHistory.sequenceNumber = (event.block.timestamp * BigInt.fromI32(100000000)) + event.logIndex;
    priceHistory.tokenAddress = tokens[i].toHexString()

    priceHistory.save()
  }

  saveTransaction(event, 'poke')
}
