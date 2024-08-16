// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @author philogy <https://github.com/philogy>

struct tuint256 {
    uint256 __placeholder;
}

struct taddress {
    uint256 __placeholder;
}
struct tuint256Array {
    uint256 __placeholder;
}

using TransientPrimitivesLib for tuint256Array global;

using TransientPrimitivesLib for tuint256 global;

using TransientPrimitivesLib for taddress global;

library TransientPrimitivesLib {
    error ArithmeticOverflowUnderflow();

    function get(tuint256 storage ptr) internal view returns (uint256 value) {
        /// @solidity memory-safe-assembly
        assembly {
            value := tload(ptr.slot)
        }
    }

    function get(taddress storage ptr) internal view returns (address value) {
        /// @solidity memory-safe-assembly
        assembly {
            value := tload(ptr.slot)
        }
    }

    function set(tuint256 storage ptr, uint256 value) internal {
        /// @solidity memory-safe-assembly
        assembly {
            tstore(ptr.slot, value)
        }
    }

    function inc(
        tuint256 storage ptr,
        uint256 change
    ) internal returns (uint256 newValue) {
        ptr.set(newValue = ptr.get() + change);
    }

    function dec(
        tuint256 storage ptr,
        uint256 change
    ) internal returns (uint256 newValue) {
        ptr.set(newValue = ptr.get() - change);
    }

    function inc(
        tuint256 storage ptr,
        int256 change
    ) internal returns (uint256 newValue) {
        uint256 currentValue = ptr.get();
        assembly ("memory-safe") {
            newValue := add(currentValue, change)
            if iszero(eq(lt(newValue, currentValue), slt(change, 0))) {
                mstore(0x00, 0xc9654ed4 /* ArithmeticOverflowUnderflow() */)
                revert(0x1c, 0x04)
            }
        }
        ptr.set(newValue);
    }

    function dec(
        tuint256 storage ptr,
        int256 change
    ) internal returns (uint256 newValue) {
        uint256 currentValue = ptr.get();
        assembly ("memory-safe") {
            newValue := sub(currentValue, change)
            if iszero(eq(lt(newValue, currentValue), sgt(change, 0))) {
                mstore(0x00, 0xc9654ed4 /* ArithmeticOverflowUnderflow() */)
                revert(0x1c, 0x04)
            }
        }
        ptr.set(newValue);
    }

    function set(taddress storage ptr, address value) internal {
        /// @solidity memory-safe-assembly
        assembly {
            tstore(ptr.slot, value)
        }
    }

    error IndexOutOfBounds();

    function length(
        tuint256Array storage ptr
    ) internal view returns (uint256 len) {
        /// @solidity memory-safe-assembly
        assembly {
            len := tload(ptr.slot)
        }
    }

    function get(
        tuint256Array storage ptr,
        uint256 index
    ) internal view returns (uint256 value) {
        uint256 len = ptr.length();
        if (index >= len) revert IndexOutOfBounds();
        /// @solidity memory-safe-assembly
        assembly {
            value := tload(add(ptr.slot, add(1, index)))
        }
    }

    // function set(
    //     tuint256Array storage ptr,
    //     uint256 index,
    //     uint256 value
    // ) internal {
    //     uint256 len = ptr.length();
    //     if (index >= len) revert IndexOutOfBounds();
    //     /// @solidity memory-safe-assembly
    //     assembly {
    //         tstore(add(ptr.slot, add(1, index)), value)
    //     }
    // }

    function push(tuint256Array storage ptr, uint256 value) internal {
        uint256 len = ptr.length();
        /// @solidity memory-safe-assembly
        assembly {
            tstore(ptr.slot, add(len, 1))
            tstore(add(ptr.slot, add(1, len)), value)
        }
    }

    // function pop(tuint256Array storage ptr) internal returns (uint256 value) {
    //     uint256 len = ptr.length();
    //     if (len == 0) revert IndexOutOfBounds();
    //     value = ptr.get(len - 1);
    //     /// @solidity memory-safe-assembly
    //     assembly {
    //         tstore(ptr.slot, sub(len, 1))
    //     }
    // }

    function resize(tuint256Array storage ptr, uint256 newSize) internal {
        uint256 currentSize = ptr.length();
        /// @solidity memory-safe-assembly
        assembly {
            tstore(ptr.slot, newSize)
            // Clear any additional slots if shrinking
            for {
                let i := add(newSize, 1)
            } lt(i, add(currentSize, 1)) {
                i := add(i, 1)
            } {
                tstore(add(ptr.slot, i), 0)
            }
        }
    }
}
