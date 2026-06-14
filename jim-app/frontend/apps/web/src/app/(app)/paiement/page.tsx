'use client';

// Page Paiements — port fidele du design `paiements-split.html` (Claude Design handoff).
// Premiere version : UI statique pixel-perfect (contenu de demo), pas de cablage Supabase.
// Le wiring data (useMesPaiements) et le backend solde/retrait/sequestre arriveront ensuite.
// Montants affiches en euros ; le mot "commission" n'apparait jamais (regle CLAUDE.md).
// La navbar est unifiee sur tout le site : Header de la page d'accueil.

import { useMemo, useState } from 'react';
import { Search, Download, ArrowDownToLine, Lock } from 'lucide-react';
import { Header } from '../../../components/layout/header';

// ─── Donnees de demo (statiques) — remplacees par useMesPaiements en v2 ───
type FactureStatus = 'paid' | 'pending' | 'escrow';

interface Facture {
  id: string;
  initials: string;
  cabinet: string;
  detail: string;
  amount: string; // formate, ex. "+1 240"
  status: FactureStatus;
  date: string; // ex. "12 mai"
  ref: string; // ex. "FAC-2026-0512"
  searchKey: string;
}

interface FactureGroup {
  month: string;
  factures: Facture[];
}

const STATUS_LABEL: Record<FactureStatus, string> = {
  paid: 'Reçue',
  pending: 'En attente',
  escrow: 'Séquestre',
};

const FACTURE_GROUPS: FactureGroup[] = [
  {
    month: 'Mai 2026',
    factures: [
      {
        id: '1',
        initials: 'CV',
        cabinet: 'Cabinet Voltaire',
        detail: 'Dr Lefèvre · Paris 11e',
        amount: '+1 240',
        status: 'paid',
        date: '12 mai',
        ref: 'FAC-2026-0512',
        searchKey: 'cabinet voltaire dr lefèvre',
      },
      {
        id: '2',
        initials: 'CN',
        cabinet: 'Cabinet Nation',
        detail: 'Dr Petit · Paris 12e',
        amount: '+691',
        status: 'pending',
        date: '6 mai',
        ref: 'FAC-2026-0506',
        searchKey: 'cabinet nation dr petit',
      },
      {
        id: '3',
        initials: 'CB',
        cabinet: 'Cabinet Bastille',
        detail: 'Dr Moreau · Paris 11e',
        amount: '+820',
        status: 'paid',
        date: '2 mai',
        ref: 'FAC-2026-0502',
        searchKey: 'cabinet bastille dr moreau',
      },
    ],
  },
  {
    month: 'Avril 2026',
    factures: [
      {
        id: '4',
        initials: 'CR',
        cabinet: 'Cabinet République',
        detail: 'Dr Saïd · Paris 3e',
        amount: '+1 516',
        status: 'escrow',
        date: '27 avr',
        ref: 'FAC-2026-0427',
        searchKey: 'cabinet république dr saïd',
      },
      {
        id: '5',
        initials: 'CO',
        cabinet: 'Cabinet Oberkampf',
        detail: 'Dr Lévy · Paris 11e',
        amount: '+980',
        status: 'paid',
        date: '18 avr',
        ref: 'FAC-2026-0418',
        searchKey: 'cabinet oberkampf dr lévy',
      },
      {
        id: '6',
        initials: 'CC',
        cabinet: 'Cabinet Charonne',
        detail: 'Dr Roy · Paris 20e',
        amount: '+1 130',
        status: 'paid',
        date: '9 avr',
        ref: 'FAC-2026-0409',
        searchKey: 'cabinet charonne dr roy',
      },
    ],
  },
];

type RangeKey = '30j' | '2026' | 'tout';
type FilterKey = 'all' | 'pending' | 'paid';

export default function PaiementPage() {
  // ─── Etats UI ───
  const [range, setRange] = useState<RangeKey>('2026');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [query, setQuery] = useState('');

  // Filtrage factures (statut + recherche)
  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FACTURE_GROUPS.map((g) => ({
      month: g.month,
      factures: g.factures.filter((f) => {
        const okStatus = filter === 'all' || f.status === filter;
        const okText = !q || f.searchKey.includes(q);
        return okStatus && okText;
      }),
    })).filter((g) => g.factures.length > 0);
  }, [filter, query]);

  const isEmpty = filteredGroups.length === 0;

  return (
    <div className="paiement-root">
      {/* ════════════ Navbar unifiee (page d'accueil) ════════════ */}
      <Header />

      {/* ════════════ Page ════════════ */}
      <div className="page">
        <div className="page-head">
          <div className="page-head-l">
            <div className="crumbs">
              <span>Tableau de bord</span>
              <span className="sep">/</span>
              <span className="cur">Paiements</span>
            </div>
            <div className="page-title-wrap">
              <h1>
                Mes <em>paiements</em>.
              </h1>
              <p>Rétrocessions reçues, séquestre en cours et factures, au même endroit.</p>
            </div>
          </div>
          <div className="page-head-r">
            <div className="range-switch">
              <button
                type="button"
                className={`range-btn${range === '30j' ? ' active' : ''}`}
                onClick={() => setRange('30j')}
              >
                30 j
              </button>
              <button
                type="button"
                className={`range-btn${range === '2026' ? ' active' : ''}`}
                onClick={() => setRange('2026')}
              >
                2026
              </button>
              <button
                type="button"
                className={`range-btn${range === 'tout' ? ' active' : ''}`}
                onClick={() => setRange('tout')}
              >
                Tout
              </button>
            </div>
            <button type="button" className="ghost-btn">
              <Download size={13} strokeWidth={2} />
              Exporter
            </button>
          </div>
        </div>

        <div className="v-split">
          <div className="sp-split-body">
            {/* ─── Colonne gauche : solde, sequestre, annee ─── */}
            <aside className="sp-split-side">
              <div className="sp-card sp-pad sp-balance-card">
                <div>
                  <div className="sp-eyebrow">Disponible</div>
                  <div className="sp-balance">
                    1 931<span className="cur">€</span>
                  </div>
                  <div className="sp-balance-sub">Mis à jour aujourd&rsquo;hui · 14:12</div>
                </div>
                <button className="sp-btn" type="button">
                  <ArrowDownToLine size={16} strokeWidth={2.2} />
                  Retirer 1 931 €
                </button>
              </div>

              <div className="sp-seq">
                <div className="sp-seq-ico">
                  <Lock size={15} strokeWidth={2} />
                </div>
                <div className="sp-seq-txt">
                  <div className="sp-seq-n">
                    1 516 €<span className="sp-seq-tag">en séquestre</span>
                  </div>
                  <div className="sp-seq-s">Libération le 27 mai · dans 8 j</div>
                </div>
              </div>

              <div className="sp-card sp-pad sp-year-card">
                <span className="sp-stat-l">Reçu en 2026</span>
                <span className="sp-year-n">
                  14 288 <span className="cur">€</span>
                </span>
                <span className="sp-year-sub">12 missions</span>
              </div>
            </aside>

            {/* ─── Colonne droite : factures ─── */}
            <section className="sp-card sp-split-main">
              <div className="sp-split-main-hd">
                <span className="sp-h">Factures</span>
                <div className="sp-split-tools">
                  <div className="sp-search">
                    <Search size={14} strokeWidth={2} />
                    <input
                      type="text"
                      placeholder="Rechercher une facture…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <div className="sp-chips">
                    <button
                      type="button"
                      className={`sp-chip${filter === 'all' ? ' active' : ''}`}
                      onClick={() => setFilter('all')}
                    >
                      Toutes
                    </button>
                    <button
                      type="button"
                      className={`sp-chip${filter === 'pending' ? ' active' : ''}`}
                      onClick={() => setFilter('pending')}
                    >
                      En attente
                    </button>
                    <button
                      type="button"
                      className={`sp-chip${filter === 'paid' ? ' active' : ''}`}
                      onClick={() => setFilter('paid')}
                    >
                      Reçues
                    </button>
                  </div>
                </div>
              </div>

              <div className="sp-split-list">
                {filteredGroups.map((group) => (
                  <div className="sp-group" key={group.month}>
                    <div className="sp-month">{group.month}</div>
                    {group.factures.map((f) => (
                      <div className="sp-row" key={f.id}>
                        <div className="sp-row-ico">{f.initials}</div>
                        <div className="sp-row-body">
                          <div className="sp-row-t">{f.cabinet}</div>
                          <div className="sp-row-s">{f.detail}</div>
                        </div>
                        <div className="sp-row-r">
                          <span className="sp-amt pos">
                            {f.amount}
                            <span className="sp-amt-cur"> €</span>
                          </span>
                          <div className="sp-row-meta">
                            <span className={`sp-status ${f.status}`}>
                              {STATUS_LABEL[f.status]}
                            </span>
                            <span className="sp-row-date">· {f.date}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="sp-pdf"
                          title={`Télécharger ${f.ref}`}
                          aria-label="Télécharger le PDF"
                        >
                          <Download size={15} strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
                {isEmpty && (
                  <div className="sp-empty">Aucune facture dans cette catégorie.</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ════════════ Styles (port fidele de paiements-split.html) ════════════ */}
      <style jsx>{`
        .paiement-root {
          --jim-primary: #ff7c5c;
          --jim-primary-soft: #ffc5b3;
          --jim-primary-pale: #fff0ea;
          --jim-accent: #e06245;
          --jim-background: #fdf6ed;
          --jim-surface: #ffffff;
          --jim-surface-alt: #fbf0e8;
          --jim-beige-dark: #dcbfa0;
          --jim-beige-mid: #edd9c4;
          --jim-beige-light: #f7ede0;
          --jim-text: #3a1f08;
          --jim-text-body: #5a3418;
          --jim-muted: #7a5434;
          --jim-border: #edd9c4;
          --jim-success: #5d8f66;
          --jim-warning: #b07824;
          --jim-warning-bg: #fbf0dc;
          --font-sans: var(--font-manrope), 'Manrope', system-ui, -apple-system, sans-serif;

          position: relative;
          min-height: 100vh;
          background: var(--jim-background);
          color: var(--jim-text);
          font-family: var(--font-sans);
        }

        /* warm brand backdrop */
        .paiement-root::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: radial-gradient(
              circle at 14% 12%,
              rgba(255, 124, 92, 0.08) 0%,
              transparent 42%
            ),
            radial-gradient(circle at 88% 78%, rgba(245, 184, 106, 0.06) 0%, transparent 50%);
        }
        .paiement-root::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: radial-gradient(circle, rgba(58, 31, 8, 1) 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.045;
        }
        .page {
          position: relative;
          z-index: 1;
        }

        /* ════ Page chrome ════ */
        .page {
          max-width: 1180px;
          margin: 0 auto;
          padding: 30px 24px 70px;
        }
        @media (max-width: 760px) {
          .page {
            padding: 24px 16px 60px;
          }
        }
        .page-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }
        .page-head-l {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .crumbs {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--jim-muted);
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--jim-beige-mid);
          border-radius: 999px;
          white-space: nowrap;
          align-self: flex-start;
        }
        .crumbs .cur {
          color: var(--jim-text);
        }
        .crumbs .sep {
          opacity: 0.4;
        }
        .page-title-wrap h1 {
          font-size: clamp(28px, 3.4vw, 40px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 0.98;
          color: var(--jim-text);
          margin: 0;
        }
        .page-title-wrap h1 em {
          font-weight: 800;
          color: var(--jim-primary);
          font-style: normal;
        }
        .page-title-wrap p {
          font-size: 13px;
          color: var(--jim-muted);
          margin: 8px 0 0;
        }
        .page-head-r {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .range-switch {
          display: inline-flex;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid var(--jim-beige-mid);
          border-radius: 12px;
          padding: 3px;
        }
        .range-btn {
          background: transparent;
          border: 0;
          padding: 8px 13px;
          border-radius: 9px;
          font-family: inherit;
          font-size: 11.5px;
          font-weight: 700;
          color: var(--jim-muted);
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.15s;
        }
        .range-btn:hover {
          color: var(--jim-text);
        }
        .range-btn.active {
          background: var(--jim-text);
          color: #fff;
        }
        .ghost-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255, 255, 255, 0.7);
          color: var(--jim-text);
          border: 1px solid var(--jim-beige-mid);
          padding: 9px 14px;
          border-radius: 11px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s;
        }
        .ghost-btn:hover {
          background: var(--jim-surface-alt);
        }

        /* ════ Split ════ */
        .v-split {
          container-type: inline-size;
        }
        .sp-split-body {
          display: grid;
          grid-template-columns: 312px 1fr;
          gap: 18px;
          align-items: start;
        }
        .sp-card {
          background: var(--jim-surface);
          border: 1px solid var(--jim-border);
          border-radius: 20px;
          box-shadow: 0 1px 2px rgba(58, 31, 8, 0.04), 0 4px 16px rgba(58, 31, 8, 0.05);
        }
        .sp-pad {
          padding: 24px;
        }
        .sp-split-side {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .sp-balance-card {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .sp-eyebrow {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 700;
          color: var(--jim-muted);
        }
        .sp-balance {
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--jim-text);
          font-variant-numeric: tabular-nums;
          margin: 11px 0 0;
          font-size: 42px;
        }
        .sp-balance .cur {
          color: var(--jim-primary);
          font-size: 0.46em;
          font-weight: 800;
          margin-left: 7px;
          letter-spacing: 0;
        }
        .sp-balance-sub {
          font-size: 12px;
          color: var(--jim-muted);
          margin-top: 10px;
          line-height: 1.4;
        }
        .sp-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--jim-primary);
          color: #fff;
          border: 0;
          padding: 13px 18px;
          border-radius: 13px;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(255, 124, 92, 0.3);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          width: 100%;
        }
        .sp-btn:hover {
          background: var(--jim-accent);
          transform: translateY(-1px);
          box-shadow: 0 9px 22px rgba(255, 124, 92, 0.38);
        }
        .sp-btn:active {
          transform: translateY(0);
        }
        .sp-seq {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 15px;
          background: var(--jim-surface-alt);
          border: 1px solid var(--jim-beige-mid);
          border-radius: 14px;
        }
        .sp-seq-ico {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: var(--jim-warning-bg);
          color: var(--jim-warning);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sp-seq-txt {
          flex: 1;
          min-width: 0;
        }
        .sp-seq-n {
          font-size: 14px;
          font-weight: 800;
          color: var(--jim-text);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.01em;
        }
        .sp-seq-tag {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--jim-muted);
          margin-left: 7px;
        }
        .sp-seq-s {
          font-size: 11px;
          color: var(--jim-muted);
          margin-top: 2px;
        }
        .sp-year-card {
          display: flex;
          flex-direction: column;
        }
        .sp-stat-l {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-weight: 700;
          color: var(--jim-muted);
        }
        .sp-year-n {
          font-size: 24px;
          font-weight: 800;
          color: var(--jim-text);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.03em;
          margin-top: 6px;
        }
        .sp-year-n .cur {
          color: var(--jim-primary);
          font-size: 0.6em;
        }
        .sp-year-sub {
          font-size: 11px;
          color: var(--jim-muted);
          margin-top: 4px;
        }
        .sp-split-main {
          padding: 22px 24px 12px;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .sp-split-main-hd {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--jim-beige-mid);
          flex-wrap: wrap;
        }
        .sp-h {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--jim-text);
        }
        .sp-split-tools {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .sp-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--jim-surface-alt);
          border: 1px solid var(--jim-beige-mid);
          border-radius: 10px;
          padding: 8px 12px;
          width: 210px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .sp-search:focus-within {
          border-color: var(--jim-primary-soft);
          box-shadow: 0 0 0 3px rgba(255, 124, 92, 0.16);
        }
        .sp-search input {
          border: 0;
          outline: 0;
          background: transparent;
          font-family: inherit;
          font-size: 12.5px;
          color: var(--jim-text);
          width: 100%;
        }
        .sp-search input::placeholder {
          color: var(--jim-muted);
        }
        .sp-search :global(svg) {
          color: var(--jim-muted);
          flex-shrink: 0;
        }
        .sp-chips {
          display: flex;
          gap: 6px;
        }
        .sp-chip {
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 700;
          background: transparent;
          border: 1px solid var(--jim-beige-mid);
          color: var(--jim-muted);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          letter-spacing: -0.005em;
          white-space: nowrap;
        }
        .sp-chip:hover {
          color: var(--jim-text);
          border-color: var(--jim-beige-dark);
        }
        .sp-chip.active {
          background: var(--jim-text);
          color: #fff;
          border-color: var(--jim-text);
        }
        .sp-split-list {
          padding-top: 2px;
        }
        .sp-month {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-weight: 700;
          color: var(--jim-muted);
          padding: 16px 0 4px;
        }
        .sp-group:first-child .sp-month {
          padding-top: 6px;
        }
        .sp-row {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 14px 0;
          border-top: 1px solid var(--jim-beige-light);
        }
        .sp-month + .sp-row {
          border-top: 0;
        }
        .sp-row-ico {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: var(--jim-surface-alt);
          color: var(--jim-text-body);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
          flex-shrink: 0;
          letter-spacing: 0.02em;
        }
        .sp-row-body {
          flex: 1;
          min-width: 0;
        }
        .sp-row-t {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--jim-text);
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sp-row-s {
          font-size: 11.5px;
          color: var(--jim-muted);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sp-row-r {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 3px;
          flex-shrink: 0;
          text-align: right;
        }
        .sp-row-meta {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sp-row-date {
          font-size: 11px;
          color: var(--jim-muted);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        .sp-amt {
          font-size: 14.5px;
          font-weight: 800;
          color: var(--jim-text);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .sp-amt.pos {
          color: var(--jim-success);
        }
        .sp-amt-cur {
          font-size: 0.82em;
        }
        .sp-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          letter-spacing: -0.005em;
        }
        .sp-status::before {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
          flex-shrink: 0;
        }
        .sp-status.paid {
          color: var(--jim-success);
        }
        .sp-status.pending {
          color: var(--jim-warning);
        }
        .sp-status.escrow {
          color: var(--jim-primary);
        }
        .sp-pdf {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: var(--jim-surface-alt);
          border: 1px solid transparent;
          color: var(--jim-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .sp-pdf:hover {
          background: var(--jim-primary-pale);
          color: var(--jim-primary);
        }
        .sp-empty {
          font-size: 13px;
          color: var(--jim-muted);
          padding: 30px 0;
          text-align: center;
        }

        /* entree douce */
        @keyframes spUp {
          from {
            transform: translateY(16px);
          }
          to {
            transform: none;
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .sp-split-side > :global(*),
          .sp-split-main {
            animation: spUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
          .sp-split-side > :global(*:nth-child(2)) {
            animation-delay: 0.06s;
          }
          .sp-split-side > :global(*:nth-child(3)) {
            animation-delay: 0.12s;
          }
          .sp-split-main {
            animation-delay: 0.08s;
          }
        }

        /* bascule mobile : empilement sous 720px */
        @container (max-width: 720px) {
          .sp-split-body {
            grid-template-columns: 1fr;
          }
          .sp-split-main {
            padding: 20px 18px 8px;
          }
          .sp-split-main-hd {
            flex-direction: column;
            align-items: stretch;
            gap: 13px;
          }
          .sp-split-tools {
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
          }
          .sp-search {
            width: 100%;
          }
          .sp-chips {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .sp-chip {
            flex-shrink: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(*) {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
