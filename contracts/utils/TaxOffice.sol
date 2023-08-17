// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "../owner/Operator.sol";
import "../interfaces/ITaxable.sol";

contract TaxOffice is Operator {
    address public crystal;

    constructor(address _crystal) {
        require(_crystal != address(0), "CRS address cannot be 0");
        crystal = _crystal;
    }

    function setTaxTiersTwap(uint8 _index, uint256 _value) public onlyOperator returns (bool) {
        return ITaxable(crystal).setTaxTiersTwap(_index, _value);
    }

    function setTaxTiersRate(uint8 _index, uint256 _value) public onlyOperator returns (bool) {
        return ITaxable(crystal).setTaxTiersRate(_index, _value);
    }

    function enableAutoCalculateTax() public onlyOperator {
        ITaxable(crystal).enableAutoCalculateTax();
    }

    function disableAutoCalculateTax() public onlyOperator {
        ITaxable(crystal).disableAutoCalculateTax();
    }

    function setTaxRate(uint256 _taxRate) public onlyOperator {
        ITaxable(crystal).setTaxRate(_taxRate);
    }

    function setTaxCollectorAddress(address _taxCollectorAddress) public onlyOperator {
        ITaxable(crystal).setTaxCollectorAddress(_taxCollectorAddress);
    }

    function setPair(address _pair, bool _value) public onlyOperator {
        ITaxable(crystal).setPair(_pair, _value);
    }

    function excludeAddressFromTax(address _address) external onlyOperator returns (bool) {
        return ITaxable(crystal).excludeAddress(_address);
    }

    function includeAddressInTax(address _address) external onlyOperator returns (bool) {
        return ITaxable(crystal).includeAddress(_address);
    }

    function setTaxableCRSOracle(address _crystalOracle) external onlyOperator {
        ITaxable(crystal).setCRSOracle(_crystalOracle);
    }

    function transferTaxOffice(address _newTaxOffice) external onlyOperator {
        ITaxable(crystal).setTaxOffice(_newTaxOffice);
    }
}