import { LoanVaultTokenAmount } from '@defichain/whale-api-client/dist/api/loan'
import { AddressInformation, Token } from '../definitions/address-information'
import { sumOrAddToken, toToken } from '../definitions/address-information.utils'
import { WhaleClient } from '../ocean/whale-client'

interface VaultInfo {
  collateral: Token[]
  loans: Token[]
}

export class AddressCrawler {
  private readonly address: string
  private readonly client: WhaleClient

  static create(address: string, client: WhaleClient): AddressCrawler {
    return new AddressCrawler(address, client)
  }

  private constructor(address: string, client: WhaleClient) {
    this.address = address
    this.client = client
  }

  async start(): Promise<{ addressTokens: Token[]; collateral: Token[]; loans: Token[] }> {
    const addressTokens = await this.retrieveAddressTokens()
    const { collateral, loans } = await this.retrieveVaultTokens()
    return { addressTokens, collateral, loans }
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
