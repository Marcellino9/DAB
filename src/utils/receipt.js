import { jsPDF } from 'jspdf';

export function generateWithdrawalReceipt({
  user,
  amount,
  bills,
  balanceBefore,
  balanceAfter,
  transactionId,
  date,
}) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Reçu de Retrait - Distributeur Automatique', 10, 15);

  doc.setFontSize(12);
  doc.text(`Transaction ID: ${transactionId}`, 10, 30);
  doc.text(`Date: ${date.toLocaleString()}`, 10, 38);
  doc.text(`Utilisateur: ${user?.name || user?.userId || 'N/A'}`, 10, 46);

  doc.text(`Montant retiré: ${formatCurrency(amount)}`, 10, 62);
  doc.text(`Solde avant: ${formatCurrency(balanceBefore)}`, 10, 70);
  doc.text(`Solde après: ${formatCurrency(balanceAfter)}`, 10, 78);

  doc.text('Détails des billets:', 10, 94);
  const billLines = Object.entries(bills || {})
    .filter(([, count]) => count > 0)
    .map(([denom, count]) => `  - ${count} x ${formatCurrency(Number(denom))}`);
  if (billLines.length === 0) billLines.push('  - Aucun détail de billets');
  billLines.forEach((line, idx) => doc.text(line, 10, 102 + idx * 8));

  doc.setFontSize(10);
  doc.text('Merci d\'avoir utilisé notre service.', 10, 140);

  doc.save(`recu_${transactionId}.pdf`);
}

export function formatCurrency(v) {
  try {
    return new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(v);
  } catch {
    return `${v} Ar`;
  }
}
