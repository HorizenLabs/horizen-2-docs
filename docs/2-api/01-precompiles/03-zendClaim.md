# Zend Claim

In line with the migration strategy from the Zend mainchain to the Horizen2 parachain, the genesis state of the Horizen2 parachain includes a list of accounts whose balances reflect the ZEN held by transparent addresses on the Zend mainchain.

ZEN balances will be part of the initial state but will not be immediately accessible. A claim procedure has been established requiring users to “unlock” these balances; a successful claim transfers the balance to a new address controlled by the claimer.

ZEN mainchain transparent addresses may be associated with either a P2PKH (in the vast majority of cases) or a multisig P2SH.

To facilitate the transfer of these balances to regular Horizen2 addresses, the `ZenClaim` precompile has been devised exposing two methods, one for each supported locking type.

### Precompile Details

- **Precompile Address**: `0x0000000000000000000000000000000000000409`
- **Solidity Interface**: [ZenClaim.sol](https://github.com/HorizenOfficial/horizen/blob/main/precompiles/zenclaim/ZenClaim.sol)


### Claim P2PKH
The Solidity interface is as follows:

`function claimP2pkh(string memory zend_address, string memory destination_address, string memory signature) external returns (uint256);`


A user owning a P2PKH transparent address `<zend_address>` wants to claim their funds by transferring them to a specified `<destination_address>`. To initiate this process, they must generate a `<signature>` (off-chain) using the private key associated with their transparent address. The message to be signed is created by concatenating:

`“ZENCLAIM” + <destination_address>`

Key requirements:

- The `<signature>` must be compatible with Zend and SphereByHorizen wallet.
- The `<destination_address>` string should be encoded in the EIP-55 checksum format.

The user (or an authorized representative) can then call the `claimP2pkh` method of the `ZenClaim` precompile, providing `<zend_address>`, `<destination_address>`, and `<signature>` as input parameters.

These are the steps covered in the precompile implementation:

- Perform a sanity check of the input parameters
- Reconstruct the signed message and use the provided `<signature>` to extract the signer's public key
- Verify that the extracted public key is compatible with the specified transparent address `<zend_address>`
- Transfer the funds to the `<destination_address>`

The `claimP2pkh` method emits an event where the indexed fields allow to match a zend_address after recomposing its 35 ascii char bytes representation.
The data part includes both claimed amount and destination address. The solidity description is as follows:

`event P2PKHClaimed(bytes32 indexed zend_addr_part1, bytes3 indexed zend_addr_part2, uint256 amount, address destination_address);`



### Claim P2SH
The Solidity interface is as follows:

`function claimP2shMultisig(string memory zend_multisig_address, string memory destination_address, string memory redeem_script, string[] memory signatures) external returns (uint256);`


**M** users are co-owners of a multisig P2SH transparent address `<zend_multisig_address>`, derived from a `<redeem_script>` with a signature threshold of **N** (where **N ≤ M**) required to unlock the P2SH. These users agree to claim the funds, transferring them to a `<destination_address>`.

At least **N** users need to each generate a `<signature>` (off-chain) using the private key corresponding to their public key as specified in the `<redeem_script>` for `<zend_multisig_address>`. Each signature should apply to the message created by concatenating the following strings:

`"ZENCLAIM" + <zend_multisig_address> + <destination_address>`

Key requirements:

- Each `<signature>` must be compatible with Zend and SphereByHorizen wallet.
- The `<destination_address>` string should be encoded in EIP-55 checksum format.

Finally, one of the **M** users (or an authorized delegate, not necessarily a co-owner) can then call the `ZenClaim` precompile’s `claimP2shMultisig` method, providing `<zend_multisig_address>`, `<destination_address>`, `<redeem_script>`, and an array of **N** `<signature>` values as input parameters.

These are the steps covered in the precompile implementation:

- Perform a sanity check of the input parameters
- Verify that `<redeem_script>` and `<zend_multisig_address>` are compatible
- Reconstruct the signed message and verify that at least **N** provided `<signature>` have their extracted public key included in the specified `<redeem_script>`
- Transfer the funds to the `<destination_address>`

The `claimP2shMultisig` method emits an event where the indexed fields allow to match a `zend_multisig_address` after recomposing its 35 ascii char bytes representation.
The data part includes both claimed amount and destination address. The solidity description is as follows:

`event P2SHMultisigClaimed(bytes32 indexed zend_multisig_addr_part1, bytes3 indexed zend_multisig_addr_part2, uint256 amount, address destination_address);`