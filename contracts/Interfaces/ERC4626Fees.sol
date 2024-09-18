// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//import "./ERC4626.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";

/// @dev ERC4626 vault with entry/exit fees expressed in https://en.wikipedia.org/wiki/Basis_point[basis point (bp)].
import "hardhat/console.sol";

abstract contract ERC4626Fees is ERC4626Upgradeable {
    using MathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20MetadataUpgradeable;
    uint256 private constant _BASIS_POINT_SCALE = 1e4;

    // === Overrides ===

    /// @dev Preview taking an entry fee on deposit. See {IERC4626-previewDeposit}.
    function previewDeposit(
        uint256 assets
    ) public view virtual override returns (uint256) {
        uint256 fee = _feeOnTotal(assets, _entryFeeBasisPoints(), _msgSender());
        console.log(
            "preview deposit",
            assets,
            fee,
            super.previewDeposit(assets - fee)
        );
        return super.previewDeposit(assets - fee);
    }

    /// @dev Preview adding an entry fee on mint. See {IERC4626-previewMint}.
    function previewMint(
        uint256 shares
    ) public view virtual override returns (uint256) {
        uint256 assets = super.previewMint(shares);

        return assets + _feeOnRaw(assets, _entryFeeBasisPoints(), _msgSender());
    }

    /// @dev Preview adding an exit fee on withdraw. See {IERC4626-previewWithdraw}.
    function previewWithdraw(
        uint256 assets
    ) public view virtual override returns (uint256) {
        uint256 fee = _feeOnRaw(assets, _exitFeeBasisPoints(), _msgSender());

        return super.previewWithdraw(assets + fee);
    }

    /// @dev Preview taking an exit fee on redeem. See {IERC4626-previewRedeem}.
    function previewRedeem(
        uint256 shares
    ) public view virtual override returns (uint256) {
        uint256 assets = super.previewRedeem(shares);

        return
            assets - _feeOnTotal(assets, _exitFeeBasisPoints(), _msgSender());
    }

    function splitFees(uint256 fee) internal pure returns (uint256, uint256) {
        return (fee / 2, fee - fee / 2);
    }

    /// @dev Send entry fee to {_entryFeeRecipient}. See {IERC4626-_deposit}.
    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal virtual override {
        uint256 fee = _feeOnTotal(assets, _entryFeeBasisPoints(), _msgSender());

        (address recipient1, address recipient2) = _entryFeeRecipient();

        super._deposit(caller, receiver, assets, shares);

        if (fee > 0 && recipient2 == receiver) {
            SafeERC20Upgradeable.safeTransfer(
                IERC20Upgradeable(asset()),
                recipient1,
                fee
            );
        } else if (fee > 0 && recipient1 == receiver) {
            SafeERC20Upgradeable.safeTransfer(
                IERC20Upgradeable(asset()),
                recipient2,
                fee
            );
        } else if (fee > 0) {
            (uint256 fee1, uint256 fee2) = splitFees(fee);
            SafeERC20Upgradeable.safeTransfer(
                IERC20Upgradeable(asset()),
                recipient1,
                fee1
            );
            SafeERC20Upgradeable.safeTransfer(
                IERC20Upgradeable(asset()),
                recipient2,
                fee2
            );
        }

        afterDeposit(receiver, assets);
    }

    /// @dev Send exit fee to {_exitFeeRecipient}. See {IERC4626-_deposit}.
    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal virtual override {
        uint256 fee = _feeOnRaw(assets, _exitFeeBasisPoints(), _msgSender());
        (address recipient1, address recipient2) = _exitFeeRecipient();
        beforeWithdraw(receiver, assets);

        if (fee > 0 && recipient2 == receiver) {
            SafeERC20Upgradeable.safeTransfer(
                IERC20Upgradeable(asset()),
                recipient1,
                fee
            );
        } else if (fee > 0 && recipient1 == receiver) {
            SafeERC20Upgradeable.safeTransfer(
                IERC20Upgradeable(asset()),
                recipient2,
                fee
            );
        } else if (fee > 0) {
            (uint256 fee1, uint256 fee2) = splitFees(fee);
            SafeERC20Upgradeable.safeTransfer(
                IERC20Upgradeable(asset()),
                recipient1,
                fee1
            );
            SafeERC20Upgradeable.safeTransfer(
                IERC20Upgradeable(asset()),
                recipient2,
                fee2
            );
        }
        super._withdraw(caller, receiver, owner, assets, shares);
    }

    // === Fee configuration ===

    function _entryFeeBasisPoints() internal view virtual returns (uint256) {
        return 0; // replace with e.g. 100 for 1%
    }

    function _exitFeeBasisPoints() internal view virtual returns (uint256) {
        return 0; // replace with e.g. 100 for 1%
    }

    function _entryFeeRecipient()
        internal
        view
        virtual
        returns (address, address)
    {
        return (address(0), address(0)); // replace with e.g. a treasury address
    }

    function _exitFeeRecipient()
        internal
        view
        virtual
        returns (address, address)
    {
        return (address(0), address(0)); // replace with e.g. a treasury address
    }

    function beforeWithdraw(
        address user,
        uint256 assetsWithdrawn
    ) internal virtual {}

    function afterDeposit(
        address user,
        uint256 amountDeposited
    ) internal virtual {}

    // === Fee operations ===

    /// @dev Calculates the fees that should be added to an amount `assets` that does not already include fees.
    /// Used in {IERC4626-mint} and {IERC4626-withdraw} operations.
    function _feeOnRaw(
        uint256 assets,
        uint256 feeBasisPoints,
        address receiver
    ) private view returns (uint256) {
        (address recipient1, address recipient2) = _entryFeeRecipient();

        if ((receiver == recipient1 || receiver == recipient2)) {
            if (_doesRecipientPayFee()) {
                return _getMinFee() - _getMinFee() / 2;
            } else {
                return 0;
            }
        }
        return
            MathUpgradeable.max(
                _getMinFee(),
                assets.mulDiv(
                    feeBasisPoints,
                    _BASIS_POINT_SCALE,
                    MathUpgradeable.Rounding.Up
                )
            );
    }

    /// @dev Calculates the fee part of an amount `assets` that already includes fees.
    /// Used in {IERC4626-deposit} and {IERC4626-redeem} operations.
    function _feeOnTotal(
        uint256 assets,
        uint256 feeBasisPoints,
        address receiver
    ) private view returns (uint256) {
        (address recipient1, address recipient2) = _entryFeeRecipient();
        if ((receiver == recipient1 || receiver == recipient2)) {
            if (_doesRecipientPayFee()) {
                return _getMinFee() - _getMinFee() / 2;
            } else {
                return 0;
            }
        }
        return
            MathUpgradeable.max(
                _getMinFee(),
                assets.mulDiv(
                    feeBasisPoints,
                    feeBasisPoints + _BASIS_POINT_SCALE,
                    MathUpgradeable.Rounding.Up
                )
            );
    }

    function _doesRecipientPayFee() internal view virtual returns (bool) {}

    function _getMinFee() internal view virtual returns (uint256) {}
}
