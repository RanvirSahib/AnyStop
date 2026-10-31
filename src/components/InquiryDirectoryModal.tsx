import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  PhoneCall,
  Building2,
  HelpCircle,
  AlertCircle,
  Search,
  Copy,
  Check,
  MapPin,
  Clock,
  Sparkles,
  PhoneForwarded
} from 'lucide-react';
import { InquiryContact } from '../types/transit';

interface InquiryDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: InquiryContact[];
}

type FilterCategory = 'all' | '24x7' | 'majha' | 'doaba' | 'malwa' | 'depot' | 'private';

export const InquiryDirectoryModal: React.FC<InquiryDirectoryModalProps> = ({
  isOpen,
  onClose,
  contacts
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Copy phone number to clipboard with feedback
  const handleCopyPhone = (phone: string, id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Filter contacts based on search query & active category chip
  const filteredContacts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return contacts.filter((c) => {
      // Category Chip Filter
      if (selectedCategory === '24x7' && !c.timings?.toLowerCase().includes('24x7')) {
        return false;
      }
      if (selectedCategory === 'majha') {
        const text = `${c.title} ${c.location} ${c.notes}`.toLowerCase();
        if (!text.includes('majha') && !text.includes('amritsar') && !text.includes('pathankot') && !text.includes('gurdaspur') && !text.includes('tarn taran') && !text.includes('batala') && !text.includes('beas')) {
          return false;
        }
      }
      if (selectedCategory === 'doaba') {
        const text = `${c.title} ${c.location} ${c.notes}`.toLowerCase();
        if (!text.includes('doaba') && !text.includes('jalandhar') && !text.includes('hoshiarpur') && !text.includes('phagwara') && !text.includes('kapurthala') && !text.includes('nawanshahr') && !text.includes('sbs nagar')) {
          return false;
        }
      }
      if (selectedCategory === 'malwa') {
        const text = `${c.title} ${c.location} ${c.notes}`.toLowerCase();
        if (!text.includes('malwa') && !text.includes('ludhiana') && !text.includes('patiala') && !text.includes('bathinda') && !text.includes('moga') && !text.includes('firozpur') && !text.includes('faridkot') && !text.includes('chandigarh') && !text.includes('kharar') && !text.includes('morinda') && !text.includes('ropar') && !text.includes('sangrur') && !text.includes('barnala') && !text.includes('mansa') && !text.includes('muktsar') && !text.includes('fazilka') && !text.includes('fatehgarh') && !text.includes('malerkotla')) {
          return false;
        }
      }
      if (selectedCategory === 'depot' && c.category !== 'depot') {
        return false;
      }
      if (selectedCategory === 'private' && c.category !== 'private') {
        return false;
      }

      // Search Query Filter
      if (!q) return true;

      const searchableText = `${c.title} ${c.location} ${c.phone} ${c.displayPhone} ${c.notes} ${c.timings || ''} ${c.category}`.toLowerCase();
      return searchableText.includes(q);
    });
  }, [contacts, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1E193C] rounded-[28px] shadow-2xl border border-[#E8DC CE] dark:border-[#38315E] overflow-hidden flex flex-col max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with modern brand styling */}
        <div className="p-4 sm:p-5 border-b border-[#EBDDD0] dark:border-[#342E5A] flex items-center justify-between bg-gradient-to-r from-[#FFF5EC] to-[#FFF0E0] dark:from-[#171330] dark:to-[#1E193C]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FFB020] to-[#FFA726] text-[#1F1A3F] flex items-center justify-center shadow-md shadow-[#FFA726]/20 shrink-0">
              <PhoneCall className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#231F3D] dark:text-[#F6F1FF] tracking-tight">
                  Official Inquiries & Helpdesks
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0B8F82]/10 text-[#0B8F82] dark:bg-[#4DE0CF]/15 dark:text-[#4DE0CF]">
                  <Sparkles className="w-3 h-3" /> Verified
                </span>
              </div>
              <p className="text-xs text-[#6B6585] dark:text-[#A9A2C8] mt-0.5">
                Direct government control rooms, depot dispatchers, and bus stands
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-white/80 dark:bg-[#2A2352] text-[#6B6585] dark:text-[#A9A2C8] hover:text-[#231F3D] dark:hover:text-white hover:bg-white shadow-sm flex items-center justify-center transition-all active:scale-95 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-[#1E193C] border-b border-[#EBDDD0] dark:border-[#342E5A] space-y-3">
          {/* Search Input Box */}
          <div className="inquiry-search-wrapper">
            <Search className="inquiry-search-icon" />
            <input
              type="text"
              maxLength={80}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by bus stand, city, depot, or phone number..."
              className="inquiry-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 w-6 h-6 rounded-full bg-[#DFD2C4] dark:bg-[#342E5A] text-[#6B6585] dark:text-[#A9A2C8] flex items-center justify-center hover:text-[#231F3D] dark:hover:text-white transition-all active:scale-95"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#1F1A3F] dark:bg-white text-white dark:text-[#1F1A3F] shadow-sm'
                  : 'bg-[#F4ECE3] dark:bg-[#28224E] text-[#6B6585] dark:text-[#B4ACCB] hover:bg-[#EBDDD0]'
              }`}
            >
              All ({contacts.length})
            </button>
            <button
              onClick={() => setSelectedCategory('24x7')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedCategory === '24x7'
                  ? 'bg-[#0B8F82] text-white shadow-sm'
                  : 'bg-[#F4ECE3] dark:bg-[#28224E] text-[#6B6585] dark:text-[#B4ACCB] hover:bg-[#EBDDD0]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              24x7 Control Rooms
            </button>
            <button
              onClick={() => setSelectedCategory('majha')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                selectedCategory === 'majha'
                  ? 'bg-[#1F1A3F] dark:bg-white text-white dark:text-[#1F1A3F] shadow-sm'
                  : 'bg-[#F4ECE3] dark:bg-[#28224E] text-[#6B6585] dark:text-[#B4ACCB] hover:bg-[#EBDDD0]'
              }`}
            >
              Majha (Amritsar)
            </button>
            <button
              onClick={() => setSelectedCategory('doaba')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                selectedCategory === 'doaba'
                  ? 'bg-[#1F1A3F] dark:bg-white text-white dark:text-[#1F1A3F] shadow-sm'
                  : 'bg-[#F4ECE3] dark:bg-[#28224E] text-[#6B6585] dark:text-[#B4ACCB] hover:bg-[#EBDDD0]'
              }`}
            >
              Doaba (Jalandhar)
            </button>
            <button
              onClick={() => setSelectedCategory('malwa')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                selectedCategory === 'malwa'
                  ? 'bg-[#1F1A3F] dark:bg-white text-white dark:text-[#1F1A3F] shadow-sm'
                  : 'bg-[#F4ECE3] dark:bg-[#28224E] text-[#6B6585] dark:text-[#B4ACCB] hover:bg-[#EBDDD0]'
              }`}
            >
              Malwa (Ludhiana/Bathinda/Patiala)
            </button>
            <button
              onClick={() => setSelectedCategory('depot')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                selectedCategory === 'depot'
                  ? 'bg-[#1F1A3F] dark:bg-white text-white dark:text-[#1F1A3F] shadow-sm'
                  : 'bg-[#F4ECE3] dark:bg-[#28224E] text-[#6B6585] dark:text-[#B4ACCB] hover:bg-[#EBDDD0]'
              }`}
            >
              Depot Dispatch
            </button>
            <button
              onClick={() => setSelectedCategory('private')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                selectedCategory === 'private'
                  ? 'bg-[#1F1A3F] dark:bg-white text-white dark:text-[#1F1A3F] shadow-sm'
                  : 'bg-[#F4ECE3] dark:bg-[#28224E] text-[#6B6585] dark:text-[#B4ACCB] hover:bg-[#EBDDD0]'
              }`}
            >
              Private Fleets
            </button>
          </div>
        </div>

        {/* Highway boarding tip banner */}
        <div className="px-4 py-2.5 bg-amber-500/10 dark:bg-amber-500/15 border-b border-[#EBDDD0] dark:border-[#342E5A] flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="text-amber-900 dark:text-amber-200 leading-snug">
            <span className="font-bold">Highway Boarding Tip:</span> Buses with <strong>"Direct / Superfast"</strong> on windshields use bypass flyovers and save ~60 mins.
          </div>
        </div>

        {/* Directory List Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#FAF4ED] dark:bg-[#16122D]">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => {
              const is24x7 = contact.timings?.toLowerCase().includes('24x7') ?? false;
              const isCopied = copiedId === contact.id;

              return (
                <div
                  key={contact.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#211B42] border border-[#E4D5C7] dark:border-[#383060] shadow-sm hover:shadow-md hover:border-[#0B8F82]/50 dark:hover:border-[#4DE0CF]/50 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      {/* Title & Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#0B8F82]/10 text-[#0B8F82] dark:bg-[#4DE0CF]/15 dark:text-[#4DE0CF] flex items-center justify-center shrink-0">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="font-display font-bold text-base text-[#231F3D] dark:text-[#F6F1FF] group-hover:text-[#0B8F82] dark:group-hover:text-[#4DE0CF] transition-colors">
                          {contact.title}
                        </h4>
                        {is24x7 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            24x7 Control
                          </span>
                        )}
                      </div>

                      {/* Location & Timings */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B6585] dark:text-[#A9A2C8]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF5A4E]" />
                          {contact.location}
                        </span>
                        {contact.timings && !is24x7 && (
                          <span className="flex items-center gap-1 font-semibold text-[#FF5A4E] dark:text-[#FF7D73]">
                            <Clock className="w-3 h-3" />
                            {contact.timings}
                          </span>
                        )}
                      </div>

                      {/* Notes / Route info */}
                      <p className="text-xs text-[#39335A] dark:text-[#DAD3F2] pt-0.5 leading-relaxed">
                        {contact.notes}
                      </p>
                    </div>

                    {/* Actions: Call & Copy buttons */}
                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0E6DC] dark:border-[#2F2856]">
                      {/* Phone number display badge */}
                      <div className="flex items-center gap-1.5 bg-[#F6EFE8] dark:bg-[#1A1535] px-2.5 py-1 rounded-lg border border-[#E6D9CC] dark:border-[#382F62]">
                        <span className="font-mono font-bold text-xs text-[#231F3D] dark:text-[#F6F1FF]">
                          {contact.displayPhone}
                        </span>
                        <button
                          onClick={(e) => handleCopyPhone(contact.phone, contact.id, e)}
                          title="Copy phone number"
                          className="text-[#6B6585] hover:text-[#0B8F82] dark:hover:text-[#4DE0CF] p-0.5 transition-colors"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Direct Call Link Button */}
                      <a
                        href={`tel:${contact.phone}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0B8F82] to-[#0A8074] hover:from-[#09776c] hover:to-[#086B61] text-white text-xs font-bold shadow-md shadow-[#0B8F82]/20 hover:shadow-lg transition-all active:scale-95"
                      >
                        <PhoneForwarded className="w-3.5 h-3.5" />
                        <span>Call Now</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* Empty State */
            <div className="text-center py-10 px-4 rounded-2xl border-2 border-dashed border-[#DFD2C4] dark:border-[#383060] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F4ECE3] dark:bg-[#28224E] text-[#8A84A4] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#231F3D] dark:text-[#F6F1FF]">
                  No helpdesks found
                </h4>
                <p className="text-xs text-[#6B6585] dark:text-[#A9A2C8] mt-1 max-w-xs mx-auto">
                  No contacts matched "{searchQuery}". Try searching for another city, depot name, or reset filters.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#0B8F82] text-white text-xs font-bold shadow hover:bg-[#09776c] transition-all"
              >
                Reset Search Filters
              </button>
            </div>
          )}

          {/* Conductor notice footer note */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#211B42] border border-[#E4D5C7] dark:border-[#383060] text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#231F3D] dark:text-[#F6F1FF]">
              <HelpCircle className="w-4 h-4 text-[#FF5A4E]" />
              Conductor Phone Numbers Notice
            </div>
            <p className="text-[#6B6585] dark:text-[#A9A2C8] leading-relaxed">
              Individual bus conductor numbers change daily with depot duty rosters. For official confirmation, call the Bus Stand control desks above or check the live community <strong>"Spotted"</strong> crowd sightings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDirectoryModal;
