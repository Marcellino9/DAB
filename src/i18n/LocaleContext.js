import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const LocaleContext = createContext(null);

const messages = {
  fr: {
    brand: 'Distributeur',
    nav: { dashboard: 'Tableau de bord', withdraw: 'Retrait', home: 'Accueil' },
    login: {
      title: 'Distributeur Automatique',
      subtitle: 'Importez votre QR code pour commencer.',
      dropHere: 'Déposez votre image ici',
      orBrowse: 'ou cliquez pour parcourir vos fichiers',
      reading: 'Lecture du QR...',
      ready: 'Prêt à valider',
      user: 'Utilisateur',
      expiresAt: 'Expire le',
      alerts: {
        expiredTitle: 'Accès refusé',
        expiredText: 'Le QR code est expiré. Veuillez régénérer votre code.',
        pinTitle: 'Entrer le code PIN',
        pinPlaceholder: 'Votre PIN',
        cancel: 'Annuler',
        confirm: 'Valider',
        ok: 'OK',
        pinRequired: 'Veuillez saisir votre PIN',
        pinOk: 'Connexion réussie',
        pinError: 'PIN incorrect',
        readError: 'Impossible de lire le QR.',
      },
    },
    dashboard: { hello: 'Bonjour', balance: 'Solde disponible', logout: 'Déconnexion', changePin: 'Changer PIN', refresh: 'Actualiser', withdraw: 'Retrait' },
    withdraw: {
      title: 'Retrait',
      subtitle: 'Choisissez un montant et la répartition des billets',
      custom: 'Montant personnalisé',
      auto: 'Aide: Répartition auto',
      rules: 'Règles billets',
      amount: 'Montant',
      validate: 'Valider', back: 'Retour', cancel: 'Annuler', reset: 'Réinitialiser billets',
      alerts: {
        invalidAmount: 'Montant invalide',
        invalidAmountText: 'Veuillez saisir un montant positif.',
        ruleTitle: 'Règle de montant',
        ruleText: 'Le montant doit être un multiple de 500.',
        needAmountTitle: 'Montant requis',
        needAmountText: 'Choisissez ou saisissez un montant.',
        insufficientTitle: 'Solde insuffisant',
        insufficientText: 'Le montant dépasse votre solde disponible.',
        billsTitle: 'Répartition des billets',
        billsText: 'Ajustez les billets pour atteindre exactement le montant.',
        rulesTitle: 'Montants & billets',
        rulesHtml: 'Les montants doivent être un multiple de <b>500</b>. Choisissez le montant puis ajustez le nombre de billets pour obtenir exactement le même total.'
      }
    },
    confirm: {
      title: 'Confirmation', subtitle: 'Vérifiez les détails avant de confirmer', user: 'Utilisateur', currentBalance: 'Solde actuel', withdrawAmount: 'Montant du retrait', details: 'Détails des billets:', confirm: 'Confirmer', cancel: 'Annuler',
      alerts: {
        cancelTitle: 'Annuler le retrait ?',
        cancelText: 'Votre répartition de billets sera perdue.',
        successTitle: 'Retrait confirmé',
        successText: 'Votre reçu PDF a été téléchargé.'
      }
    },
    footer: { rights: 'Tous droits réservés.' }
  },
  en: {
    brand: 'Vending',
    nav: { dashboard: 'Dashboard', withdraw: 'Withdraw', home: 'Home' },
    login: {
      title: 'Vending Machine',
      subtitle: 'Upload your QR code to begin.',
      dropHere: 'Drop your image here',
      orBrowse: 'or click to browse files',
      reading: 'Reading QR...',
      ready: 'Ready to validate',
      user: 'User',
      expiresAt: 'Expires at',
      alerts: {
        expiredTitle: 'Access denied',
        expiredText: 'The QR code has expired. Please regenerate your code.',
        pinTitle: 'Enter PIN',
        pinPlaceholder: 'Your PIN',
        cancel: 'Cancel',
        confirm: 'Confirm',
        ok: 'OK',
        pinRequired: 'Please enter your PIN',
        pinOk: 'Signed in successfully',
        pinError: 'Incorrect PIN',
        readError: 'Unable to read the QR.',
      },
    },
    dashboard: { hello: 'Hello', balance: 'Available balance', logout: 'Logout', changePin: 'Change PIN', refresh: 'Refresh', withdraw: 'Withdraw' },
    withdraw: {
      title: 'Withdraw', subtitle: 'Choose an amount and bill breakdown', custom: 'Custom amount', auto: 'Help: Auto split', rules: 'Bill rules', amount: 'Amount', validate: 'Validate', back: 'Back', cancel: 'Cancel', reset: 'Reset bills',
      alerts: {
        invalidAmount: 'Invalid amount',
        invalidAmountText: 'Please enter a positive amount.',
        ruleTitle: 'Amount rule',
        ruleText: 'Amount must be a multiple of 500.',
        needAmountTitle: 'Amount required',
        needAmountText: 'Choose or enter an amount.',
        insufficientTitle: 'Insufficient balance',
        insufficientText: 'The amount exceeds your available balance.',
        billsTitle: 'Bills breakdown',
        billsText: 'Adjust bills to exactly match the amount.',
        rulesTitle: 'Amounts & bills',
        rulesHtml: 'Amounts must be a multiple of <b>500</b>. Choose the amount then adjust bills to reach the exact total.'
      }
    },
    confirm: {
      title: 'Confirmation', subtitle: 'Review details before confirming', user: 'User', currentBalance: 'Current balance', withdrawAmount: 'Withdrawal amount', details: 'Bill details:', confirm: 'Confirm', cancel: 'Cancel',
      alerts: {
        cancelTitle: 'Cancel withdrawal?',
        cancelText: 'Your bills configuration will be lost.',
        successTitle: 'Withdrawal confirmed',
        successText: 'Your PDF receipt has been downloaded.'
      }
    },
    footer: { rights: 'All rights reserved.' }
  }
};

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('fr');

  const switchLocale = useCallback((l) => setLocale(l), []);

  const t = useCallback(
    (key, fallback = '') => {
      const parts = key.split('.');
      let cur = messages[locale];
      for (const p of parts) {
        cur = cur?.[p];
      }
      return (cur ?? fallback ?? key);
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, switchLocale, t }), [locale, switchLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
