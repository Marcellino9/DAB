import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [qrData, setQrData] = useState(null); // { userId, name, pin, expiresAt }
  // const [qrData, setQrData] = useState({
  //   userId: 1,
  //   name: "John Doe",
  //   pin: 1234,
  //   expiresAt: new Date().getTime() + 60 * 60 * 1000,
  // }); // { userId, name, pin, expiresAt }
  const [authenticated, setAuthenticated] = useState(false);
  const [balance, setBalance] = useState(500000); // in FCFA or desired currency minor units
  const [pendingWithdrawal, setPendingWithdrawal] = useState(null); // { amount, bills }

  const loginWithQR = useCallback((data) => {
    setQrData(data);
  }, []);

  const verifyPin = useCallback((pin) => {
    console.log(pin, qrData.pin);
    if (!qrData) return false;
    const given = (pin ?? '').toString().trim().replace(/\D+/g, '');
    const expected = (qrData.pin ?? '').toString().trim().replace(/\D+/g, '');
    const ok = given.length > 0 && given === expected;
    setAuthenticated(ok);
    return ok;
  }, [qrData]);

  const logout = useCallback(() => {
    setAuthenticated(false);
    setQrData(null);
  }, []);

  const value = useMemo(
    () => ({
      qrData,
      authenticated,
      balance,
      pendingWithdrawal,
      setPendingWithdrawal,
      setBalance,
      loginWithQR,
      verifyPin,
      logout,
      setQrData,
      changePin: (newPin) => setQrData((prev) => (prev ? { ...prev, pin: String(newPin) } : prev)),
    }),
    [qrData, authenticated, balance, pendingWithdrawal, loginWithQR, verifyPin, logout]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
