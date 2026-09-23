/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, Phone, ExternalLink, ShieldAlert, Clock, Building } from 'lucide-react';
import { OfficialReferral } from '../types/navigator';

interface UrgentEscalationCardProps {
  level?: 'none' | 'soon' | 'urgent';
  title?: string;
  reason?: string;
  referrals?: OfficialReferral[];
  primaryContact?: OfficialReferral;
  isCourtLawsuit?: boolean;
}

export const UrgentEscalationCard: React.FC<UrgentEscalationCardProps> = ({
  level = 'urgent',
  title,
  reason,
  referrals,
  primaryContact,
  isCourtLawsuit
}) => {
  if (level === 'none') return null;

  const contactsList = referrals && referrals.length > 0
    ? referrals
    : primaryContact
    ? [primaryContact]
    : [];

  const isUrgent = level === 'urgent';

  return (
    <div
      role="region"
      aria-label="Urgent Procedural Warning"
      className={`rounded-xl border p-5 sm:p-6 transition-all ${
        isUrgent
          ? 'bg-red-50/70 border-red-300 text-red-950'
          : 'bg-amber-50/70 border-amber-300 text-amber-950'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            isUrgent ? 'bg-[#A33A3A] text-white' : 'bg-[#8A5A00] text-white'
          }`}
        >
          {isUrgent ? (
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Clock className="w-5 h-5" aria-hidden="true" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                isUrgent ? 'bg-red-200/80 text-red-900' : 'bg-amber-200/80 text-amber-900'
              }`}
            >
              {isUrgent ? 'Urgent Legal Action Required' : 'Time-Sensitive Verification'}
            </span>
          </div>

          <h2 className="text-lg font-bold tracking-tight mb-2">
            {title || (isUrgent ? 'High Priority Procedural Timeline' : 'Verification Required')}
          </h2>

          <p className="text-sm leading-relaxed mb-4">
            {reason ||
              'This document indicates an active court action or statutory countdown. The application cannot determine the legally controlling deadline safely from text alone. Immediate verification with the official court or a qualified attorney is strongly recommended.'}
          </p>

          {isCourtLawsuit && (
            <div className="mb-4 p-3 bg-white/80 border border-red-200 rounded-lg text-xs leading-relaxed space-y-1">
              <span className="font-semibold text-red-900 block">
                California Superior Court Counting Rules (Cal. CCP § 1167):
              </span>
              <p>
                In California unlawful detainer lawsuits, tenants generally have <strong>5 court days</strong> to file an Answer (Form UD-105) at the court clerk’s counter. Court days <strong>exclude</strong> weekends and state judicial holidays. Counting begins the day after personal service.
              </p>
            </div>
          )}

          {/* Official Contacts List */}
          <div className="border-t border-red-200/60 pt-3">
            <span className="text-xs font-semibold uppercase tracking-wider block mb-2 text-[#172033]">
              Verified Official Court & Legal Aid Contacts:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {contactsList.slice(0, 4).map(ref => (
                <div
                  key={ref.id}
                  className="bg-white/90 p-3 rounded-lg border border-red-100 flex flex-col justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold text-[#172033] truncate">
                        {ref.name}
                      </span>
                      {ref.freeService && (
                        <span className="text-[#176B4D] font-medium shrink-0">Free Help</span>
                      )}
                    </div>
                    <p className="text-[#596579] line-clamp-2 mb-2">{ref.notes}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                    {ref.phone ? (
                      <a
                        href={`tel:${ref.phone.replace(/[^0-9]/g, '')}`}
                        className="text-[#1E4D8F] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{ref.phone}</span>
                      </a>
                    ) : (
                      <span className="text-gray-400">Online Court Portal</span>
                    )}

                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1E4D8F] hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
