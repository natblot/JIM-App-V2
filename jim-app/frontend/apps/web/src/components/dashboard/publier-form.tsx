'use client';

// Formulaire de publication d'annonce — multi-etapes (5 steps)
// Step 1: Type + Dates + Urgent
// Step 2: Localisation (ville autocomplete)
// Step 3: Details (retrocession, description, specialites, type cabinet)
// Step 4: Photos (placeholder)
// Step 5: Recap + Publication

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  MapPin,
  FileText,
  Camera,
  Eye,
  Zap,
  Upload,
  X,
  Lock,
} from 'lucide-react';
import { z } from 'zod';
import { useVilleAutocomplete, useCreateAnnonce, useCurrentProfile } from '@jim/shared';
import type { VilleSuggestion } from '@jim/shared';
import { useAuthContext } from '../providers/auth-provider';

// ─── Types & Schemas ────────────────────────────────────────────────────────────

const ANNONCE_TYPES = [
  { value: 'remplacement', label: 'Remplacement', desc: 'Remplacement temporaire' },
  { value: 'assistanat', label: 'Assistanat', desc: 'Collaboration en assistanat' },
  { value: 'collaboration', label: 'Collaboration', desc: 'Collaboration liberale' },
  { value: 'cession', label: 'Cession', desc: 'Cession de patientele' },
] as const;

const CABINET_TYPES = [
  { value: 'liberal', label: 'Liberal' },
  { value: 'groupe', label: 'Cabinet de groupe' },
  { value: 'centre', label: 'Centre de sante' },
  { value: 'hopital', label: 'Hopital' },
  { value: 'clinique', label: 'Clinique' },
  { value: 'autre', label: 'Autre' },
] as const;

const SPECIALITES = [
  'Kinesitherapie generale',
  'Reeducation respiratoire',
  'Sport',
  'Pediatrie',
  'Geriatrie',
  'Neurologie',
  'Orthopedique',
  'Vestibulaire',
  'Perineale',
  'Domicile',
] as const;

// Schema Zod pour la validation de chaque etape
const step1Schema = z
  .object({
    type_annonce: z.enum(['remplacement', 'assistanat', 'collaboration', 'cession']),
    date_debut: z.string().min(1, 'La date de debut est obligatoire'),
    date_fin: z.string().min(1, 'La date de fin est obligatoire'),
    is_urgent: z.boolean(),
  })
  .refine((data) => data.date_fin >= data.date_debut, {
    message: 'La date de fin doit etre apres la date de debut',
    path: ['date_fin'],
  });

const step2Schema = z.object({
  ville: z.string().min(2, 'La ville est obligatoire'),
  code_postal: z.string().optional(),
  adresse_complete: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const step3Schema = z.object({
  retrocession: z
    .number()
    .min(0, 'La retrocession ne peut pas etre negative')
    .max(100, 'La retrocession ne peut pas depasser 100%'),
  description: z.string().max(1000, 'Maximum 1000 caracteres').optional(),
  specialites: z.array(z.string()).default([]),
  type_cabinet: z
    .enum(['liberal', 'groupe', 'centre', 'hopital', 'clinique', 'autre'])
    .optional(),
});

// Etat complet du formulaire
interface FormState {
  type_annonce: 'remplacement' | 'assistanat' | 'collaboration' | 'cession';
  date_debut: string;
  date_fin: string;
  is_urgent: boolean;
  ville: string;
  code_postal: string;
  adresse_complete: string;
  latitude: number | undefined;
  longitude: number | undefined;
  retrocession: number;
  description: string;
  specialites: string[];
  type_cabinet: 'liberal' | 'groupe' | 'centre' | 'hopital' | 'clinique' | 'autre' | undefined;
}

const INITIAL_STATE: FormState = {
  type_annonce: 'remplacement',
  date_debut: '',
  date_fin: '',
  is_urgent: false,
  ville: '',
  code_postal: '',
  adresse_complete: '',
  latitude: undefined,
  longitude: undefined,
  retrocession: 70,
  description: '',
  specialites: [],
  type_cabinet: undefined,
};

// Labels des etapes
const STEPS = [
  { label: 'Type & Dates', icon: Calendar },
  { label: 'Localisation', icon: MapPin },
  { label: 'Details', icon: FileText },
  { label: 'Photos', icon: Camera },
  { label: 'Recap', icon: Eye },
];

// ─── Composant principal ───────────────────────────────────────────────────────

// Wrapper : gate role titulaire (regle metier JIM) + loader profile
export function PublierForm() {
  const { supabase } = useAuthContext();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile(supabase);

  if (profileLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ff7c5c] border-t-transparent" />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  if (profile?.role !== 'titulaire') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
            <Lock size={24} className="text-[#ff7c5c]" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Reserve aux titulaires</h1>
          <p className="text-sm text-gray-500 mb-6">
            La publication d&apos;annonces est reservee aux titulaires de cabinet.
            En tant que remplacant, vous pouvez postuler aux annonces existantes.
          </p>
          <Link
            href="/dashboard"
            className="inline-block text-sm font-semibold text-[#ff7c5c] hover:underline"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return <PublierFormInternal />;
}

function PublierFormInternal() {
  const router = useRouter();
  const { supabase } = useAuthContext();
  const createAnnonce = useCreateAnnonce(supabase);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Mise a jour partielle du formulaire
  const updateForm = useCallback((patch: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    // Effacer les erreurs des champs modifies
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch)) {
        delete next[key];
      }
      return next;
    });
  }, []);

  // Validation d'une etape
  function validateStep(stepIndex: number): boolean {
    const schemas = [step1Schema, step2Schema, step3Schema] as const;
    const schema = schemas[stepIndex];
    if (!schema) return true;

    const parsed = schema.safeParse(form);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.');
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  // Navigation
  function goNext() {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  // Soumission
  async function handleSubmit() {
    setSubmitError(null);

    // Validation finale
    for (let i = 0; i <= 2; i++) {
      if (!validateStep(i)) {
        setStep(i);
        return;
      }
    }

    createAnnonce.mutate(
      {
        type_annonce: form.type_annonce,
        date_debut: form.date_debut,
        date_fin: form.date_fin,
        is_urgent: form.is_urgent,
        ville: form.ville,
        code_postal: form.code_postal || undefined,
        adresse_complete: form.adresse_complete || undefined,
        latitude: form.latitude,
        longitude: form.longitude,
        retrocession: form.retrocession,
        description: form.description || undefined,
        specialites: form.specialites,
        type_cabinet: form.type_cabinet,
      },
      {
        onSuccess: () => {
          router.push('/dashboard');
        },
        onError: (error) => {
          setSubmitError(
            error instanceof Error
              ? error.message
              : 'Une erreur est survenue. Reessayez.'
          );
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6ed]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Publier une annonce</h1>
        </div>
      </header>

      {/* Indicateur d'etapes */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    // Permettre de revenir aux etapes precedentes
                    if (i < step) setStep(i);
                  }}
                  className="flex flex-col items-center gap-1.5 flex-1"
                  disabled={i > step}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      isDone
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-[#ff7c5c] text-white'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isDone ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <span
                    className={`text-[10px] font-medium hidden sm:block ${
                      isActive ? 'text-[#ff7c5c]' : isDone ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Barre de progression */}
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ff7c5c] transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contenu de l'etape */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {step === 0 && <Step1 form={form} errors={errors} updateForm={updateForm} />}
        {step === 1 && <Step2 form={form} errors={errors} updateForm={updateForm} />}
        {step === 2 && <Step3 form={form} errors={errors} updateForm={updateForm} />}
        {step === 3 && <Step4 />}
        {step === 4 && <Step5 form={form} />}

        {/* Erreur de soumission */}
        {submitError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {submitError}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 gap-4">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} />
            Precedent
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-2 bg-[#ff7c5c] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[#e86c4c] transition-colors"
            >
              Suivant
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createAnnonce.isPending}
              className="flex items-center gap-2 bg-[#ff7c5c] text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-[#e86c4c] transition-colors disabled:opacity-50"
            >
              {createAnnonce.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Publication...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Publier l&apos;annonce
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1 : Type + Dates + Urgent ─────────────────────────────────────────────

function Step1({
  form,
  errors,
  updateForm,
}: {
  form: FormState;
  errors: Record<string, string>;
  updateForm: (patch: Partial<FormState>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Type d&apos;annonce</h2>
        <p className="text-sm text-gray-500 mb-4">Selectionnez le type de mission</p>

        <div className="grid grid-cols-2 gap-3">
          {ANNONCE_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => updateForm({ type_annonce: type.value })}
              className={`p-4 rounded-2xl border text-left transition-all ${
                form.type_annonce === type.value
                  ? 'border-[#ff7c5c] bg-[#ff7c5c]/5 ring-1 ring-[#ff7c5c]'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <p className="text-sm font-semibold text-gray-900">{type.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Date de debut
          </label>
          <input
            type="date"
            value={form.date_debut}
            onChange={(e) => updateForm({ date_debut: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7c5c]/30 focus:border-[#ff7c5c] ${
              errors.date_debut ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.date_debut && (
            <p className="text-xs text-red-500 mt-1">{errors.date_debut}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Date de fin
          </label>
          <input
            type="date"
            value={form.date_fin}
            onChange={(e) => updateForm({ date_fin: e.target.value })}
            min={form.date_debut || new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7c5c]/30 focus:border-[#ff7c5c] ${
              errors.date_fin ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.date_fin && (
            <p className="text-xs text-red-500 mt-1">{errors.date_fin}</p>
          )}
        </div>
      </div>

      {/* Urgent toggle */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
            <Zap size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Mission urgente</p>
            <p className="text-xs text-gray-500">
              L&apos;annonce sera mise en avant dans les resultats
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => updateForm({ is_urgent: !form.is_urgent })}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            form.is_urgent ? 'bg-[#ff7c5c]' : 'bg-gray-200'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              form.is_urgent ? 'translate-x-5' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2 : Localisation ──────────────────────────────────────────────────────

function Step2({
  form,
  errors,
  updateForm,
}: {
  form: FormState;
  errors: Record<string, string>;
  updateForm: (patch: Partial<FormState>) => void;
}) {
  const [villeQuery, setVilleQuery] = useState(form.ville);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, isLoading: suggestionsLoading } = useVilleAutocomplete(villeQuery);

  function selectVille(suggestion: VilleSuggestion) {
    setVilleQuery(suggestion.label);
    setShowSuggestions(false);
    updateForm({
      ville: suggestion.ville,
      code_postal: suggestion.codePostal,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Localisation</h2>
        <p className="text-sm text-gray-500 mb-4">Ou se situe le cabinet ?</p>
      </div>

      {/* Ville autocomplete */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          <MapPin size={14} className="inline mr-1" />
          Ville
        </label>
        <input
          type="text"
          value={villeQuery}
          onChange={(e) => {
            setVilleQuery(e.target.value);
            setShowSuggestions(true);
            if (e.target.value.length < 2) {
              updateForm({ ville: '', code_postal: '', latitude: undefined, longitude: undefined });
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Rechercher une ville..."
          className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7c5c]/30 focus:border-[#ff7c5c] ${
            errors.ville ? 'border-red-300' : 'border-gray-200'
          }`}
        />
        {errors.ville && (
          <p className="text-xs text-red-500 mt-1">{errors.ville}</p>
        )}

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
            {suggestions.map((suggestion) => (
              <button
                key={`${suggestion.ville}-${suggestion.codePostal}`}
                type="button"
                onClick={() => selectVille(suggestion)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              >
                <span className="font-medium text-gray-900">{suggestion.ville}</span>
                <span className="text-gray-400 ml-2">{suggestion.codePostal}</span>
              </button>
            ))}
          </div>
        )}

        {suggestionsLoading && villeQuery.length >= 2 && (
          <div className="absolute right-3 top-[38px]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#ff7c5c] border-t-transparent" />
          </div>
        )}
      </div>

      {/* Ville selectionnee */}
      {form.ville && (
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
          <Check size={16} className="text-green-600" />
          <span className="text-sm text-green-700 font-medium">
            {form.ville} {form.code_postal && `(${form.code_postal})`}
          </span>
        </div>
      )}

      {/* Adresse complete (optionnel) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Adresse complete (optionnel)
        </label>
        <input
          type="text"
          value={form.adresse_complete}
          onChange={(e) => updateForm({ adresse_complete: e.target.value })}
          placeholder="12 rue de la Sante, 75013 Paris"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7c5c]/30 focus:border-[#ff7c5c]"
        />
      </div>
    </div>
  );
}

// ─── Step 3 : Details ───────────────────────────────────────────────────────────

function Step3({
  form,
  errors,
  updateForm,
}: {
  form: FormState;
  errors: Record<string, string>;
  updateForm: (patch: Partial<FormState>) => void;
}) {
  // Toggle specialite
  function toggleSpecialite(spec: string) {
    const current = form.specialites;
    if (current.includes(spec)) {
      updateForm({ specialites: current.filter((s) => s !== spec) });
    } else {
      updateForm({ specialites: [...current, spec] });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Details de la mission</h2>
        <p className="text-sm text-gray-500 mb-4">Precisez les conditions</p>
      </div>

      {/* Retrocession slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Taux de retrocession
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={form.retrocession}
            onChange={(e) => updateForm({ retrocession: parseFloat(e.target.value) })}
            className="flex-1 h-2 bg-gray-200 rounded-full appearance-none accent-[#ff7c5c]"
          />
          <span className="text-lg font-bold text-[#ff7c5c] min-w-[4rem] text-right">
            {form.retrocession}%
          </span>
        </div>
        {errors.retrocession && (
          <p className="text-xs text-red-500 mt-1">{errors.retrocession}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Description (optionnel)
        </label>
        <textarea
          value={form.description}
          onChange={(e) => updateForm({ description: e.target.value })}
          rows={4}
          maxLength={1000}
          placeholder="Decrivez la mission, le cabinet, les conditions..."
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#ff7c5c]/30 focus:border-[#ff7c5c]"
        />
        <p className="text-xs text-gray-400 text-right mt-1">
          {form.description.length}/1000
        </p>
      </div>

      {/* Specialites (multi-select pills) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specialites
        </label>
        <div className="flex flex-wrap gap-2">
          {SPECIALITES.map((spec) => {
            const isSelected = form.specialites.includes(spec);
            return (
              <button
                key={spec}
                type="button"
                onClick={() => toggleSpecialite(spec)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  isSelected
                    ? 'bg-[#ff7c5c]/10 border-[#ff7c5c] text-[#ff7c5c]'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {isSelected && <Check size={12} className="inline mr-1" />}
                {spec}
              </button>
            );
          })}
        </div>
      </div>

      {/* Type de cabinet */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Type de cabinet
        </label>
        <select
          value={form.type_cabinet ?? ''}
          onChange={(e) =>
            updateForm({
              type_cabinet: (e.target.value || undefined) as FormState['type_cabinet'],
            })
          }
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7c5c]/30 focus:border-[#ff7c5c]"
        >
          <option value="">Selectionnez...</option>
          {CABINET_TYPES.map((ct) => (
            <option key={ct.value} value={ct.value}>
              {ct.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Step 4 : Photos (placeholder) ──────────────────────────────────────────────

function Step4() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Photos (optionnel)</h2>
        <p className="text-sm text-gray-500 mb-4">
          Ajoutez des photos du cabinet pour attirer plus de candidats
        </p>
      </div>

      {/* Zone d'upload placeholder */}
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-gray-300 transition-colors cursor-pointer">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
          <Upload size={24} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          Glissez vos photos ici
        </p>
        <p className="text-xs text-gray-400">
          PNG, JPG ou WEBP — Max 5 Mo par fichier
        </p>
        <p className="text-xs text-amber-600 mt-4 bg-amber-50 rounded-lg py-2 px-3 inline-block">
          Cette fonctionnalite sera disponible prochainement
        </p>
      </div>
    </div>
  );
}

// ─── Step 5 : Recap ─────────────────────────────────────────────────────────────

function Step5({ form }: { form: FormState }) {
  const typeLabel = ANNONCE_TYPES.find((t) => t.value === form.type_annonce)?.label ?? form.type_annonce;
  const cabinetLabel = CABINET_TYPES.find((ct) => ct.value === form.type_cabinet)?.label;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Recapitulatif</h2>
        <p className="text-sm text-gray-500 mb-4">
          Verifiez les informations avant de publier
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {/* Type & Dates */}
        <div className="p-5">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Mission
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Type</span>
              <p className="font-medium text-gray-900">{typeLabel}</p>
            </div>
            <div>
              <span className="text-gray-500">Urgent</span>
              <p className="font-medium text-gray-900">{form.is_urgent ? 'Oui' : 'Non'}</p>
            </div>
            <div>
              <span className="text-gray-500">Debut</span>
              <p className="font-medium text-gray-900">
                {form.date_debut
                  ? new Date(form.date_debut).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Fin</span>
              <p className="font-medium text-gray-900">
                {form.date_fin
                  ? new Date(form.date_fin).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="p-5">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Localisation
          </h3>
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {form.ville} {form.code_postal && `(${form.code_postal})`}
            </p>
            {form.adresse_complete && (
              <p className="text-gray-500 mt-1">{form.adresse_complete}</p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-5">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Retrocession</span>
              <p className="font-medium text-[#ff7c5c] text-lg">{form.retrocession}%</p>
            </div>
            {cabinetLabel && (
              <div>
                <span className="text-gray-500">Type de cabinet</span>
                <p className="font-medium text-gray-900">{cabinetLabel}</p>
              </div>
            )}
          </div>
          {form.description && (
            <div className="mt-3">
              <span className="text-gray-500 text-sm">Description</span>
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                {form.description}
              </p>
            </div>
          )}
          {form.specialites.length > 0 && (
            <div className="mt-3">
              <span className="text-gray-500 text-sm">Specialites</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {form.specialites.map((spec) => (
                  <span
                    key={spec}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff7c5c]/10 text-[#ff7c5c] uppercase"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
