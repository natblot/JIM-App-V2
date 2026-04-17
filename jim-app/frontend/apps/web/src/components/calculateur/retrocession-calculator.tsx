'use client';

import { useState } from 'react';
import { StoreButtons } from '../landing/store-buttons';

const URSSAF_RATE = 0.22;
const CARPIMKO_ANNUAL = 3600;
const CARPIMKO_DAILY = CARPIMKO_ANNUAL / 365;

function formatEuros(n: number): string {
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
}

// Calculateur retrocession — 100% client, zero donnee envoyee
export function RetrocessionCalculator() {
  const [montant, setMontant] = useState(5000);
  const [taux, setTaux] = useState(80);
  const [jours, setJours] = useState(10);

  const retrocession = Math.round(montant * taux) / 100;
  const partTitulaire = montant - retrocession;
  const chargesUrssaf = Math.round(retrocession * URSSAF_RATE * 100) / 100;
  const chargesCarpimko = Math.round(CARPIMKO_DAILY * jours * 100) / 100;
  const netRemplacant = retrocession - chargesUrssaf - chargesCarpimko;

  return (
    <div>
      {/* Inputs */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-6 mb-6 space-y-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-2">Montant brut encaisse (EUR)</label>
          <input
            type="number"
            value={montant}
            onChange={(e) => setMontant(Number(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-lg font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-2">Taux de retrocession : {taux}%</label>
          <input
            type="range"
            min="50"
            max="100"
            value={taux}
            onChange={(e) => setTaux(Number(e.target.value))}
            className="w-full accent-brand"
          />
          <div className="flex justify-between text-xs text-neutral-400 mt-1">
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-2">Nombre de jours de remplacement</label>
          <input
            type="number"
            value={jours}
            onChange={(e) => setJours(Number(e.target.value) || 1)}
            min={1}
            max={365}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>
      </div>

      {/* Resultat */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Resultat</h2>
        <div className="space-y-3">
          <Row label={`Retrocession (${taux}%)`} value={formatEuros(retrocession)} />
          <Row label={`Part titulaire (${100 - taux}%)`} value={formatEuros(partTitulaire)} muted />
          <div className="border-t border-neutral-100 my-3" />
          <p className="text-sm font-medium text-neutral-800">Estimation charges remplacant :</p>
          <Row label="URSSAF (~22%)" value={`- ${formatEuros(chargesUrssaf)}`} muted />
          <Row label={`CARPIMKO (${jours}j)`} value={`- ${formatEuros(chargesCarpimko)}`} muted />
          <div className="border-t border-neutral-100 my-3" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-neutral-900">Net estime remplacant</span>
            <span className="text-xl font-bold text-brand">{formatEuros(netRemplacant)}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-light rounded-2xl p-6 text-center">
        <p className="text-sm text-neutral-800 mb-4">Telechargez JIM pour le calcul connecte a votre facturation</p>
        <StoreButtons className="justify-center" />
      </div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${muted ? 'text-neutral-500' : 'text-neutral-800'}`}>{label}</span>
      <span className={`text-sm font-medium ${muted ? 'text-neutral-500' : 'text-neutral-900'}`}>{value}</span>
    </div>
  );
}
