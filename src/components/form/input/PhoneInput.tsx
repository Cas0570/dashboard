"use client";
import React, { useState, useEffect, useRef } from "react";
import { getCountries, getCountryCallingCode, CountryCode } from 'libphonenumber-js';
import ReactCountryFlag from "react-country-flag";

interface PhoneInputProps {
  placeholder?: string;
  onChange?: (phoneNumber: string, metadata?: { country: string, isValid: boolean }) => void;
  selectPosition?: "start" | "end";
  defaultCountry?: CountryCode;
  className?: string;
  required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  placeholder = "Enter phone number",
  onChange,
  selectPosition = "start",
  defaultCountry = "US",
  className = "",
  required = false
}) => {
  // Get all available countries - use ref to avoid recreating on each render
  const availableCountries = useRef(getCountries()).current;
  
  // State for UI elements
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [inputValue, setInputValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(availableCountries);
  
  // Refs for stability and avoiding loops
  const initializedRef = useRef(false);
  const dialCodeRef = useRef("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize once
  useEffect(() => {
    if (!initializedRef.current) {
      try {
        dialCodeRef.current = `+${getCountryCallingCode(defaultCountry)}`;
        initializedRef.current = true;
      } catch (error) {
        console.error("Error setting initial dial code:", error);
      }
    }
  }, [defaultCountry]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (dropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [dropdownOpen]);

  // Filter countries when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCountries(availableCountries);
      return;
    }

    const filtered = availableCountries.filter(country => {
      const countryName = getCountryName(country).toLowerCase();
      const countryCode = country.toLowerCase();
      try {
        const dialCode = getDialCode(country);
        return (
          countryName.includes(searchTerm.toLowerCase()) ||
          countryCode.includes(searchTerm.toLowerCase()) ||
          dialCode.includes(searchTerm)
        );
      } catch {
        return (
          countryName.includes(searchTerm.toLowerCase()) ||
          countryCode.includes(searchTerm.toLowerCase())
        );
      }
    });
    
    setFilteredCountries(filtered);
  }, [searchTerm, availableCountries]);

  // Get display name for a country
  const getCountryName = (code: string): string => {
    try {
      return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;
    } catch {
      return code;
    }
  };
  
  // Get dial code for a country
  const getDialCode = (code: CountryCode): string => {
    try {
      return `+${getCountryCallingCode(code)}`;
    } catch {
      return "";
    }
  };

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    setSearchTerm("");
    
    try {
      const newDialCode = getDialCode(country);
      dialCodeRef.current = newDialCode;
      
      // Update the full number and pass to parent
      const fullNumber = newDialCode + inputValue;
      if (onChange) {
        onChange(fullNumber, { country, isValid: true });
      }
    } catch (error) {
      console.error("Error setting country dial code:", error);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);
    
    let processedNumber = rawValue;
    let currentDialCode = dialCodeRef.current;
    
    // If user is entering a full number with country code, try to detect it
    if (rawValue.startsWith('+')) {
      // Try to find the country from the input
      for (const country of availableCountries) {
        try {
          const dialCode = getDialCode(country);
          if (rawValue.startsWith(dialCode)) {
            setSelectedCountry(country);
            dialCodeRef.current = dialCode;
            currentDialCode = dialCode;
            processedNumber = rawValue;
            break;
          }
        } catch {
          // Skip countries without dial codes
          continue;
        }
      }
    } else {
      // Keep the country code and just update the number part
      processedNumber = currentDialCode + rawValue;
    }
    
    // Provide the full number to parent component
    if (onChange) {
      onChange(processedNumber, { country: selectedCountry, isValid: true });
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setSearchTerm(""); // Clear search when toggling
    setFilteredCountries(availableCountries);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex">
        {/* Country selector button - Start position */}
        {selectPosition === "start" && (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="flex items-center h-11 rounded-l-lg border border-r-0 border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <ReactCountryFlag 
                countryCode={selectedCountry} 
                svg 
                className="mr-2"
                style={{
                  width: '1.5em',
                  height: '1.5em',
                }}
              />
              <span className="font-medium">{dialCodeRef.current}</span>
              <svg
                className="ml-2 stroke-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Custom dropdown */}
            {dropdownOpen && (
              <div className="absolute left-0 z-10 mt-1 w-64 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="p-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search countries..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredCountries.map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`flex w-full items-center px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        country === selectedCountry ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`}
                    >
                      <ReactCountryFlag 
                        countryCode={country} 
                        svg 
                        className="mr-2"
                        style={{
                          width: '1.5em',
                          height: '1.5em',
                        }}
                      />
                      <span className="flex-1 truncate dark:text-white">{getCountryName(country)}</span>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">
                        {getDialCode(country)}
                      </span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input field */}
        <input
          type="tel"
          name="phone"
          id="phone"
          value={inputValue}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder}
          required={required}
          className={`h-11 w-full rounded-${
            selectPosition === "start" ? "r" : "l"
          }-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
        />

        {/* Country selector button - End position */}
        {selectPosition === "end" && (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="flex items-center h-11 rounded-r-lg border border-l-0 border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <ReactCountryFlag 
                countryCode={selectedCountry} 
                svg 
                className="mr-2"
                style={{
                  width: '1.5em',
                  height: '1.5em',
                }}
              />
              <span className="font-medium">{dialCodeRef.current}</span>
              <svg
                className="ml-2 stroke-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Custom dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 z-10 mt-1 w-64 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="p-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search countries..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredCountries.map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`flex w-full items-center px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        country === selectedCountry ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`}
                    >
                      <ReactCountryFlag 
                        countryCode={country} 
                        svg 
                        className="mr-2"
                        style={{
                          width: '1.5em',
                          height: '1.5em',
                        }}
                      />
                      <span className="flex-1 truncate">{getCountryName(country)}</span>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">
                        {getDialCode(country)}
                      </span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneInput;