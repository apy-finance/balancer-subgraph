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

export function priceHistory(event: LOG_CALL): void {
  let poolId = event.address.toHex()

  //let crp = ConfigurableRightsPool.bind(event.address)
  //let pool = Pool.bind(crp.bPool)

  //priceHistory.price
  priceHistory.timestamp = event.block.timestamp;
  priceHistory.sequenceNumber = (event.block.timestamp * BigInt.fromI32(100000000)) + event.logIndex;
  priceHistory.poolTokenAddress = event.address

  saveTransaction(event, 'poke')
}
