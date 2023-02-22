import { LoanVaultTokenAmount } from '@defichain/whale-api-client/dist/api/loan'
import { TokenData } from '@defichain/whale-api-client/dist/api/tokens'
import { Token } from '../definitions/address-information'
import { sumOrAddToken, toToken } from '../definitions/address-information.utils'
import { LOCKClient } from '../LOCK/lock-client'
import { WhaleClient } from '../ocean/whale-client'

interface VaultInfo {
  collateral: Token[]
  loans: Token[]
}

export class AddressCrawler {
  private readonly address: string
  private readonly isLOCKUserAddress: boolean
  private readonly tokens: TokenData[]
  private readonly client: WhaleClient

  private defaultToken: Token = { id: '-1', symbol: 'not found', isLiquidityMiningPair: false, amount: '0' }

  static create(address: string, isLOCKUserAddress: boolean, tokens: TokenData[], client: WhaleClient): AddressCrawler {
    return new AddressCrawler(address, isLOCKUserAddress, tokens, client)
  }

  private constructor(address: string, isLOCKUserAddress: boolean, tokens: TokenData[], client: WhaleClient) {
    this.address = address
    this.isLOCKUserAddress = isLOCKUserAddress
    this.tokens = tokens
    this.client = client
  }

  async start(): Promise<{ addressTokens: Token[]; collateral: Token[]; loans: Token[]; lockTokens?: Token[] }> {
    const addressTokens = await this.retrieveAddressTokens()
    const { collateral, loans } = await this.retrieveVaultTokens()
    return {
      addressTokens,
      collateral,
      loans,
      lockTokens: this.isLOCKUserAddress ? await this.retrieveLOCKTokens() : undefined,
    }
  }

  async retrieveAddressTokens(): Promise<Token[]> {
    const tokens = await this.client.getTokens(this.address)
    return tokens?.map((t) => toToken(t))
  }

  async retrieveVaultTokens(): Promise<VaultInfo> {
    const vaults = await this.client.getVaults(this.address)
    return vaults
      ?.map((v) => ({ collateral: this.mapToTokens(v.collateralAmounts), loans: this.mapToTokens(v.loanAmounts) }))
      .reduce((acc, item) => this.sumOrAdd(acc, item), { collateral: [], loans: [] })
  }

  async retrieveLOCKTokens(): Promise<Token[]> {
    return LOCKClient.getUserBalance(this.address).then((balances) =>
      balances
        .filter((b) => b.balance > 0)
        .map((b) => {
          const token = this.tokens.find((t) => t.symbolKey === b.asset) ?? this.tokens[0]
          return toToken({
            ...token,
            amount: '' + b.balance,
            additionalInformation: b.stakingStrategy === 'Masternode' ? 'Staking' : 'Yield Machine',
          })
        }),
    )
  }

  mapToTokens(vaultTokens: LoanVaultTokenAmount[]): Token[] {
    return vaultTokens?.map((t) => toToken({ ...t, isLPS: false }))
  }

  sumOrAdd(acc: VaultInfo, item: VaultInfo): VaultInfo {
    return {
      collateral: sumOrAddToken(acc.collateral, item.collateral),
      loans: sumOrAddToken(acc.loans, item.loans),
    }
  }
}
