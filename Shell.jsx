import React, { useState, useEffect, useRef, useMemo, Fragment, createContext, useContext } from "react";
import ReactDOM from "react-dom";
import App, { ALL_PARTS } from "./profitability-v6.jsx";

export const DevFlagsContext = createContext({ hideDescription: false });
export const InheritanceContext = createContext({ linkedQuotes: [], linkedPos: [], setLinkedQuotes: () => {}, setLinkedPos: () => {} });

/* ─── SVG Icons ─── */
const ChevronRight = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
);
const ChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
);
const ChevronDown = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
);
const MapPin = ({ size = 14, color = "#888" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const CalendarIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const PlusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const DotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
);
const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
);
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const ClockIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1018-1"/><polyline points="3 4 3 12 9 12"/></svg>
);
const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
);
const PhoneIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
);
const MessageIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
);
const SparkleIcon = ({ size = 14, color = "#7c3aed" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></svg>
);
const SortIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5h10M11 9h7M11 13h4"/><path d="M3 17l3 3 3-3"/><path d="M6 18V4"/></svg>
);
const TruckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
);
const QuoteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 5v3z"/></svg>
);
const PanelRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
);
const CheckIcon = ({ size = 12, color = "#9ca3af" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const PrinterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
);
const BriefcaseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
);
const PencilIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
);
const LayoutListIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><line x1="14" y1="4" x2="21" y2="4"/><line x1="14" y1="9" x2="21" y2="9"/><line x1="14" y1="15" x2="21" y2="15"/><line x1="14" y1="20" x2="21" y2="20"/></svg>
);
const MapIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
);
const LayoutDashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
);
const TrashIcon = ({ size = 15, color = "#ef4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
);
const GripVerticalIcon = ({ size = 14, color = "#d4d4d4" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>
);
const BarChartIcon = ({ size = 18, color = "#737373" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
);
const DollarIcon = ({ size = 15, color = "#6b7280" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
);
const ListChecksIcon = ({ size = 15, color = "#6b7280" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h11"/><path d="M10 12h11"/><path d="M10 18h11"/><polyline points="3 6 4 7 6 5"/><polyline points="3 12 4 13 6 11"/><polyline points="3 18 4 19 6 17"/></svg>
);
const TrendingUpIcon = ({ size = 15, color = "#6b7280" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
const AlignLeftIcon = ({ size = 18, color = "#737373" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
);
const ExternalLinkIcon = ({ size = 16, color = "#374151" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);
const UserIcon = ({ size = 14, color = "#9ca3af" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const PenLineIcon = ({ size = 14, color = "#9ca3af" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);
const FileTextIcon = ({ size = 14, color = "#9ca3af" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);
const MailIcon = ({ size = 14, color = "#a3a3a3" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
);
const BuildingIcon = ({ size = 16, color = "#6b7280" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18Z"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
);
const PackageIcon = ({ size = 16, color = "#10b981" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
);
const TagIcon = ({ size = 12, color = "#a3a3a3" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
);
const ZapIcon = ({ size = 14, color = "#7c3aed" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const CheckCircleIcon = ({ size = 13, color = "#22c55e" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const ImageIcon = ({ size = 18, color = "#9ca3af" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
);
const DownloadIcon = ({ size = 14, color = "#a3a3a3" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const SendIcon = ({ size = 14, color = "#7c3aed" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const PlayIcon = ({ size = 12, color = "#16a34a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
);
const LoaderIcon = ({ size = 12, color = "#f59e0b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
);
const CoffeeIcon = ({ size = 14, color = "#f59e0b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
);
const DotsVertIcon = ({ size = 16, color = "#a3a3a3" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
);
const BookmarkIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
);
const SettingsIcon = ({ size = 15, color = "#737373" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
);
const XIcon = ({ size = 11, color = "#9ca3af" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const RotateCcwIcon = ({ size = 10, color = "#a3a3a3" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
);
const ThumbsUpIcon = ({ size = 14, color = "#9ca3af" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
);
const ThumbsDownIcon = ({ size = 14, color = "#9ca3af" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/></svg>
);
const SlidersIcon = ({ size = 13, color = "#a3a3a3" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
);
const WorkflowGraphIcon = ({ size = 14, color = "#64748b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8.2 7.5l2.2 7"/><path d="M15.8 7.5l-2.2 7"/><path d="M8.5 6h7"/></svg>
);
const StatusArrowIcon = ({ size = 14, color = "#64748b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16V8"/><path d="M8.5 11.5L12 8l3.5 3.5"/></svg>
);
const CheckCheckIcon = ({ size = 12, color = "#3b82f6" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L7 17l-5-5"/><path d="M22 10l-7.5 7.5L13 16"/></svg>
);

/* ─── Shared styles ─── */
const btn32 = {
  width: 30, height: 30, borderRadius: 8, border: "1px solid #e5e5e5",
  background: "#fff", cursor: "pointer", display: "flex", alignItems: "center",
  justifyContent: "center", padding: 0, color: "#262626",
};

/* ─── Toggle Switch ─── */
function Toggle({ on, onChange }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange(); }} style={{ width: 28, height: 16, borderRadius: 8, background: on ? '#262626' : '#d4d4d4', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}>
      <div style={{ width: 12, height: 12, borderRadius: 6, background: '#fff', position: 'absolute', top: 2, left: on ? 14 : 2, transition: 'left 180ms cubic-bezier(0.23, 1, 0.32, 1)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
    </div>
  );
}

/* ─── Customize Panel (reusable) ─── */
function CustomizePanel({ title, items, state, onToggle, onReset, onClose, onReorder }) {
  const [localItems, setLocalItems] = useState(items);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const dragIdx = useRef(null);
  useEffect(() => { setLocalItems(items); }, [items.map(x => x.id).join(',')]);

  const handleDrop = (dropI) => {
    const fromI = dragIdx.current;
    if (fromI === null || fromI === dropI) { setDragOverIdx(null); return; }
    const next = [...localItems]; const [moved] = next.splice(fromI, 1); next.splice(dropI, 0, moved);
    setLocalItems(next); onReorder && onReorder(next);
    dragIdx.current = null; setDragOverIdx(null);
  };

  const DotHandle = () => (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" style={{ flexShrink: 0, opacity: 0.3, cursor: 'grab' }}>
      <circle cx="2" cy="2" r="1.2" fill="#6b7280" /><circle cx="6" cy="2" r="1.2" fill="#6b7280" />
      <circle cx="2" cy="6" r="1.2" fill="#6b7280" /><circle cx="6" cy="6" r="1.2" fill="#6b7280" />
      <circle cx="2" cy="10" r="1.2" fill="#6b7280" /><circle cx="6" cy="10" r="1.2" fill="#6b7280" />
    </svg>
  );

  return (
    <div style={{ width: 210, borderRadius: 12, background: '#fff', border: '1px solid #e5e5e5', boxShadow: '0 6px 24px rgba(0,0,0,0.12)', animation: 'fadeSlideIn 180ms cubic-bezier(0.23,1,0.32,1) both' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px 0 12px', height: 36, borderBottom: '1px solid #efefef' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{title}</span>
        <div onClick={onClose} style={{ width: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><XIcon /></div>
      </div>
      <div style={{ padding: '2px 0' }}>
        {localItems.map((item, i) => {
          const isOn = state[item.id] !== false;
          const isDragOver = dragOverIdx === i && dragIdx.current !== i;
          return (
            <div key={item.id} draggable onDragStart={e => { dragIdx.current = i; e.dataTransfer.effectAllowed = 'move'; }} onDragOver={e => { e.preventDefault(); setDragOverIdx(i); }} onDragLeave={() => setDragOverIdx(null)} onDrop={e => { e.preventDefault(); handleDrop(i); }} onDragEnd={() => { dragIdx.current = null; setDragOverIdx(null); }} onClick={() => onToggle(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 32, borderTop: isDragOver ? '2px solid #292929' : '2px solid transparent', cursor: 'grab', opacity: dragIdx.current === i ? 0.5 : 1, userSelect: 'none' }}>
              <DotHandle />
              <span style={{ flex: 1, fontSize: 11, color: isOn ? '#262626' : '#a3a3a3' }}>{item.label}</span>
              <Toggle on={isOn} onChange={() => onToggle(item.id)} />
            </div>
          );
        })}
      </div>
      <div style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid #efefef' }}>
        <button onClick={onReset} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
          <RotateCcwIcon /> Reset to default
        </button>
      </div>
    </div>
  );
}

/* ─── App Sidebar (Figma: 5557-79924) ─── */
const SidebarHomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const SidebarSenseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
);
const SidebarWorkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
);
const SidebarCrmIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
);
const SidebarAccountingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20"/><path d="M10 3v18"/></svg>
);
const SidebarDispatchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const SidebarReportIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
);
const SidebarMoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="8" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="16" cy="12" r="1" fill="currentColor"/></svg>
);
const SidebarSettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
);

function AppSidebar() {
  const items = [
    { id: 'home', label: 'Home', icon: SidebarHomeIcon },
    { id: 'sense', label: 'Sense', icon: SidebarSenseIcon },
    { id: 'sep' },
    { id: 'work', label: 'Work Orders', icon: SidebarWorkIcon, active: true },
    { id: 'crm', label: 'CRM', icon: SidebarCrmIcon },
    { id: 'accounting', label: 'Accounting', icon: SidebarAccountingIcon },
    { id: 'dispatch', label: 'Dispatch', icon: SidebarDispatchIcon },
    { id: 'reports', label: 'Reports', icon: SidebarReportIcon },
    { id: 'more', label: 'More', icon: SidebarMoreIcon },
  ];

  const navItem = (item) => {
    const Icon = item.icon;
    return (
      <button key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', padding: 0, width: 32 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.active ? '#e4d9c8' : '#f8f5f0', overflow: 'hidden', color: item.active ? '#5c4a1e' : '#404040' }}>
          <Icon />
        </div>
        <span style={{ fontSize: 10, fontWeight: item.active ? 500 : 400, color: item.active ? '#262626' : '#404040', textAlign: 'center', whiteSpace: 'nowrap', lineHeight: '12px' }}>{item.label}</span>
      </button>
    );
  };

  return (
    <div style={{ width: 72, flexShrink: 0, background: '#f8f5f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, paddingBottom: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {items.map(item => {
          if (item.id === 'sep') return <div key="sep" style={{ width: 32, height: 1, background: '#d0cdc6' }} />;
          return navItem(item);
        })}
      </div>
      {navItem({ id: 'settings', label: 'Settings', icon: SidebarSettingsIcon })}
    </div>
  );
}

/* ─── Module Header ─── */
/* ─── Top Nav Bar (Figma: 6041-56480) ─── */
const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
);
const SearchIcon = ({ size = 16, color = "#404040" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
);
const SmileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
);
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
);
const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
);
const XCloseIcon = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
);

function TopNavBar() {
  const tabs = [
    { id: 'job', label: 'Job -#JN-245678', active: true },
    { id: 'inv1', label: 'Invoice- #771233' },
    { id: 'inv2', label: 'Invoice- #771234' },
  ];

  const tabPill = { padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4, border: 'none', cursor: 'pointer', maxWidth: 152, fontSize: 12, fontWeight: 500, color: '#404040', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0 };
  const separator = { width: 0, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
  const iconBtn = { width: 32, height: 32, borderRadius: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', flexShrink: 0 };

  return (
    <div style={{ background: '#f8f5f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 22, paddingRight: 16, paddingTop: 8, paddingBottom: 8, flexShrink: 0 }}>
      {/* Left: menu + tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <button style={{ ...iconBtn, width: 32, height: 32 }}><HamburgerIcon /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {tabs.map((t, i) => (
            <Fragment key={t.id}>
              {i > 0 && (
                <div style={separator}>
                  <div style={{ width: 1, height: 16, background: '#d0cdc6' }} />
                </div>
              )}
              <button style={{ ...tabPill, background: t.active ? '#e4d9c8' : '#f8f5f0' }}>
                {!t.active && <span style={{ display: 'flex', color: '#8c8b86' }}><XCloseIcon size={12} /></span>}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: '1 0 0', minWidth: 1 }}>{t.label}</span>
              </button>
            </Fragment>
          ))}
          <div style={separator}><div style={{ width: 1, height: 16, background: '#d0cdc6' }} /></div>
          <button style={{ ...tabPill, background: '#f8f5f0', gap: 4 }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: '1 0 0', minWidth: 1 }}>All Tabs</span>
            <ChevronDown size={12} color="#404040" />
          </button>
        </div>
      </div>

      {/* Right: utility icons + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button style={iconBtn}><SmileIcon /></button>
        <button style={iconBtn}><SearchIcon /></button>
        <button style={iconBtn}><CalendarIcon size={16} /></button>
        <button style={iconBtn}><BellIcon /></button>
        <button style={iconBtn}><ChatIcon /></button>
        <div style={{ width: 32, height: 32, borderRadius: '100%', background: '#e4d9c8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#404040', letterSpacing: 0.17 }}>RG</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Breadcrumb Header (Figma: Module Header 5557:79926) ─── */
function BreadcrumbHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    if (!menuOpen) return;
    const close = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const menuItems = [
    { label: 'Customise Layout', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>, action: () => { document.dispatchEvent(new CustomEvent('quote:customise-layout')); setMenuOpen(false); } },
    { label: 'Duplicate Quote', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>, action: () => setMenuOpen(false) },
    { label: 'Copy link', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>, action: () => setMenuOpen(false) },
  ];

  return (
    <div className="qp-header" style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', flexShrink: 0, minHeight: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#737373', cursor: 'pointer' }}>Jobs</span>
        <ChevronRight size={12} color="#c5c5c5" />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#262626', whiteSpace: 'nowrap' }}>#JN-245- Roof Replacement - Telnet</span>
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(p => !p)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 6, border: 'none', background: menuOpen ? '#f3f4f6' : 'none', cursor: 'pointer', color: '#a3a3a3', transition: 'background 100ms' }}
            onMouseEnter={e => { if (!menuOpen) e.currentTarget.style.background = '#f3f4f6'; }}
            onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.background = 'none'; }}
          >
            <DotsIcon />
          </button>
          {menuOpen && (
            <div className="dropdown-enter" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '4px 0', minWidth: 190, zIndex: 999 }}>
              {menuItems.map(item => (
                <button key={item.label} onClick={item.action} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, color: '#262626', textAlign: 'left' }}>
                  {item.icon}{item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#262626' }}>1/30</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button className="btn-ghost btn-press" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, color: '#737373', display: 'flex' }}><ChevronUp /></button>
          <button className="btn-ghost btn-press" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, color: '#737373', display: 'flex' }}><ChevronDown /></button>
        </div>
      </div>
    </div>
  );
}

/* ─── Dev Mode Dropdown ─── */
function DevDropdown() {
  const { flags, toggle } = useContext(DevFlagsContext);
  const [devOpen, setDevOpen] = useState(false);
  const devRef = useRef(null);

  useEffect(() => {
    if (!devOpen) return;
    const close = e => { if (devRef.current && !devRef.current.contains(e.target)) setDevOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [devOpen]);

  const devToggles = [
    { id: "hideDescription", label: "Hide Description" },
  ];

  return (
    <div ref={devRef} style={{ position: "relative" }}>
      <button onClick={() => setDevOpen(p => !p)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: devOpen ? "#7c3aed" : "#a3a3a3", background: devOpen ? "#f5f3ff" : "none", border: `1px solid ${devOpen ? "#c4b5fd" : "transparent"}`, borderRadius: 6, cursor: "pointer", transition: "all 150ms ease" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
        Dev
      </button>
      {devOpen && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", border: "1px solid #e5e5e5", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.1)", padding: "8px 0", minWidth: 200, zIndex: 999 }}>
          <div style={{ padding: "6px 14px 8px", fontSize: 10, fontWeight: 700, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: "0.06em" }}>Dev Toggles</div>
          {devToggles.map(t => (
            <button key={t.id} onClick={() => toggle(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: "#262626" }}>
              <span>{t.label}</span>
              <div style={{ width: 32, height: 18, borderRadius: 9, background: flags[t.id] ? "#7c3aed" : "#d4d4d4", transition: "background 150ms ease", position: "relative" }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: "#fff", position: "absolute", top: 2, left: flags[t.id] ? 16 : 2, transition: "left 150ms ease", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Collapsible Section (shared) ─── */
function CS({ title, open, onToggle, children, extra }) {
  return (
    <div style={{ borderBottom: '1px solid #e5e7eb' }}>
      <button onClick={onToggle} style={{ width: '100%', padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#262626', flex: 1, textAlign: 'left' }}>{title}</span>
        {extra && <div onClick={e => e.stopPropagation()}>{extra}</div>}
        <span style={{ display: 'flex', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms ease', color: '#9ca3af' }}><ChevronDown size={13} color="#9ca3af" /></span>
      </button>
      {open && children && <div style={{ padding: '0 18px 18px' }}>{children}</div>}
    </div>
  );
}

/* ─── Left Pane: Job Info ─── */
function LeftPane() {
  const [showKebab, setShowKebab] = useState(false);
  const [kebabPos, setKebabPos] = useState(null);
  const kebabBtnRef = useRef(null);
  const kebabRef = useRef(null);

  const defaultLayout = [
    { id: 'details', label: 'Details', visible: true, expanded: true, fields: [
      { id: 'status', label: 'Status', visible: true },
      { id: 'priority', label: 'Priority', visible: true },
      { id: 'assignees', label: 'Assignees', visible: true },
      { id: 'salesRep', label: 'Sales Rep', visible: true },
      { id: 'customer', label: 'Customer', visible: true },
      { id: 'dueDate', label: 'Due Date', visible: true },
      { id: 'leadSource', label: 'Lead Source', visible: true },
      { id: 'startTime', label: 'Start Time', visible: true },
      { id: 'endTime', label: 'End Time', visible: true },
      { id: 'category', label: 'Category', visible: true },
      { id: 'parentJob', label: 'Parent Job', visible: true },
      { id: 'jobType', label: 'Job Type', visible: true },
      { id: 'createdBy', label: 'Created by', visible: true },
    ]},
    { id: 'otherDetails', label: 'Other Details', visible: true, expanded: false, fields: [
      { id: 'skills', label: 'Skills', visible: true },
      { id: 'roofType', label: 'Roof Type', visible: true },
      { id: 'shingleMfr', label: 'Shingle Manufacturer', visible: true },
      { id: 'inspectionDt', label: 'Inspection Completed', visible: true },
    ]},
    { id: 'financials', label: 'Financials 2.0', visible: true, expanded: false, fields: [
      { id: 'jobValue', label: 'Job Value', visible: true },
      { id: 'laborCost', label: 'Labor Cost', visible: true },
      { id: 'materialCost', label: 'Material Cost', visible: true },
    ]},
    { id: 'leadIntake', label: 'Lead Intake', visible: true, expanded: false, fields: [
      { id: 'leadSource2', label: 'Lead Source', visible: true },
      { id: 'leadDate', label: 'Lead Date', visible: true },
      { id: 'leadOwner', label: 'Lead Owner', visible: true },
    ]},
    { id: 'leadVerif', label: 'Lead Verifications', visible: true, expanded: false, fields: [
      { id: 'verified', label: 'Verified By', visible: true },
      { id: 'verifDate', label: 'Verified On', visible: true },
    ]},
    { id: 'measurements', label: 'Measurements', visible: true, expanded: false, fields: [
      { id: 'roofArea', label: 'Roof Area', visible: true },
      { id: 'slope', label: 'Slope', visible: true },
      { id: 'ridgeLen', label: 'Ridge Length', visible: true },
    ]},
    { id: 'prodData', label: 'Production Data 3.0', visible: true, expanded: false, fields: [
      { id: 'shingleLayers', label: 'Shingle Layers', visible: true },
      { id: 'shingleColor', label: 'Shingle Color', visible: true },
      { id: 'warranty', label: 'Warranty', visible: true },
    ]},
    { id: 'reDispatch', label: 'Re-Dispatch', visible: true, expanded: false, fields: [
      { id: 'reDispatchReason', label: 'Reason', visible: true },
      { id: 'reDispatchDate', label: 'Rescheduled', visible: true },
    ]},
    { id: 'appointments', label: 'Upcoming Appointments', visible: true, expanded: true, fields: [] },
  ];
  const [layout, setLayout] = useState(defaultLayout);

  const fv = {
    status: { t: 'status' }, priority: { t: 'priority' }, assignees: { t: 'assign' }, salesRep: { t: 'srep' },
    customer: { v: 'Craig Calzoni' }, dueDate: { v: '03/30/2026' }, leadSource: { v: 'Facebook' },
    startTime: { v: '03/30/2026 06:00 PM' }, endTime: { v: '04/04/2026 06:00 PM' },
    category: { v: 'Roofing' }, parentJob: { v: 'Set Parent Job', link: true },
    jobType: { v: 'New' }, createdBy: { v: 'Tom Riddle' },
    skills: { t: 'tags', vals: ['Inspection', 'Measurement'] },
    roofType: { v: 'Asphalt Shingles' }, shingleMfr: { v: 'CertainTeed' },
    inspectionDt: { v: 'Nov 21, 2025 at 12:00 AM' },
    jobValue: { v: '$12,400' }, laborCost: { v: '$4,200' }, materialCost: { v: '$5,800' },
    leadSource2: { v: 'Facebook' }, leadDate: { v: 'Jan 15, 2026' }, leadOwner: { v: 'Tom Riddle' },
    verified: { v: 'Anna Smith' }, verifDate: { v: 'Jan 18, 2026' },
    roofArea: { v: '2,450 sq ft' }, slope: { v: '6/12' }, ridgeLen: { v: '48 ft' },
    shingleLayers: { v: '2 layers' }, shingleColor: { v: 'Charcoal Gray' }, warranty: { v: '25 years' },
    reDispatchReason: { v: 'Material delay' }, reDispatchDate: { v: 'Mar 28, 2026' },
  };

  useEffect(() => {
    const h = e => {
      if (kebabRef.current && !kebabRef.current.contains(e.target)) setShowKebab(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const openKebab = () => {
    if (kebabBtnRef.current) {
      const r = kebabBtnRef.current.getBoundingClientRect();
      setKebabPos({ top: r.bottom + 4, left: r.left });
    }
    setShowKebab(p => !p);
  };

  function RV({ id }) {
    const d = fv[id]; if (!d) return null;
    if (d.t === 'status') return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#eff2f5', border: '0.5px solid #bac7d5', borderRadius: 12, padding: '3px 8px', fontSize: 11, color: '#4f5e71' }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#4f5e71' }} />New</span>;
    if (d.t === 'priority') return <span style={{ display: 'inline-flex', background: '#fef2f2', border: '0.5px solid #fca5a5', borderRadius: 16, padding: '3px 8px', fontSize: 11, color: '#ef4444', fontWeight: 500 }}>High</span>;
    if (d.t === 'assign') return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fff7ed', border: '0.5px solid #fdba74', borderRadius: 16, padding: '1px 6px 1px 2px', height: 24 }}>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg, #e8b86d, #c98d3a)', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: '#262626' }}>John Davis</span>
          <StarIcon />
        </span>
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #7a8b9c, #5a6b7a)', flexShrink: 0 }} />
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#ebebeb', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 500, color: '#6b7280', marginLeft: -6 }}>+2</span>
      </div>
    );
    if (d.t === 'srep') return <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 22, height: 22, borderRadius: 11, border: '1px dashed #d0d5dd', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><PlusIcon size={12} /></span><span style={{ fontSize: 11, color: '#737373' }}>Add Sales Rep</span></div>;
    if (d.t === 'tags') return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{d.vals.map((v, i) => <span key={i} style={{ padding: '2px 7px', borderRadius: 4, border: '1px solid #e5e5e5', fontSize: 10, color: '#374151', background: '#f9fafb' }}>{v}</span>)}</div>;
    if (d.link) return <span style={{ fontSize: 11, color: '#3b82f6', cursor: 'pointer' }}>{d.v}</span>;
    return <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.72)', whiteSpace: 'nowrap' }}>{d.v}</span>;
  }

  const menuItem = (icon, label, onClick, red = false) => (
    <div onClick={onClick || null} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 16px', cursor: 'pointer', transition: 'background 120ms ease' }}
      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      {icon}
      <span style={{ fontSize: 13, color: red ? '#ef4444' : '#262626' }}>{label}</span>
    </div>
  );

  return (
    <aside className="shell-left" style={{ width: 330, minWidth: 330, background: "#fff", borderRight: "1px solid #e5e5e5", overflow: "hidden", flexShrink: 0, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ overflowY: "auto", overflowX: "hidden", flex: 1 }}>
        {/* Cover Image */}
        <div style={{ width: "100%", height: 140, background: "linear-gradient(135deg, #8b9dad 0%, #5a6b7a 60%, #3d4d5c 100%)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 100%)" }} />
          <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 60, opacity: 0.15 }} viewBox="0 0 330 60" preserveAspectRatio="none">
            <path d="M0 60 L40 20 L80 40 L120 15 L165 35 L200 10 L240 30 L280 18 L330 45 L330 60Z" fill="#fff" />
          </svg>
        </div>

        {/* Title + address */}
        <div style={{ padding: "12px 20px 0" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#262626", lineHeight: "24px" }}>Roof Replacement - Telnet</div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 3 }}>
            <MapPin size={13} color="#a3a3a3" />
            <span style={{ fontSize: 11, color: "#a3a3a3", lineHeight: "16px" }}>2847 Boulevard, Los Angeles, CA 90026.</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 20px" }}>
          <button style={{ ...btn32, width: "auto", padding: "0 10px", fontSize: 11 }}>Update Status</button>
          <button style={btn32}><CalendarIcon /></button>
          <button style={btn32}><PlusIcon size={15} /></button>
          <button style={btn32}><BookmarkIcon /></button>
          <button ref={kebabBtnRef} onClick={openKebab} style={{ ...btn32, borderColor: showKebab ? '#a3a3a3' : '#e5e5e5', background: showKebab ? '#f3f4f6' : '#fff' }}><DotsIcon /></button>
        </div>

        {/* Kebab dropdown */}
        {showKebab && kebabPos && (
          <div ref={kebabRef} style={{ position: 'fixed', top: kebabPos.top, left: kebabPos.left, width: 220, background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 9999, padding: '4px 0', animation: 'fadeSlideIn 150ms cubic-bezier(0.23,1,0.32,1) both' }}>
            {menuItem(<PrinterIcon />, 'Print/Share')}
            {menuItem(<BriefcaseIcon />, 'New Child Job')}
            {menuItem(<CopyIcon />, 'Clone Job')}
            {menuItem(<PencilIcon />, 'Update Description')}
            {menuItem(<LayoutListIcon />, 'Update Custom Fields')}
            {menuItem(<MapIcon />, 'Assign to Route')}
            <div style={{ height: 1, margin: '4px 16px', background: '#e5e5e5' }} />
            {menuItem(<LayoutDashIcon />, 'Customize Layout')}
            <div style={{ height: 1, margin: '4px 16px', background: '#e5e5e5' }} />
            {menuItem(<TrashIcon />, 'Delete', null, true)}
          </div>
        )}

        {/* Layout-driven sections */}
        {layout.map(sec => {
          if (sec.visible === false) return null;
          const visFields = sec.fields.filter(f => f.visible !== false);
          const toggleExpanded = () => setLayout(p => p.map(s => s.id === sec.id ? { ...s, expanded: !s.expanded } : s));

          if (sec.id === 'appointments') return (
            <div key="appointments" style={{ padding: '8px 20px 16px' }}>
              <button onClick={toggleExpanded} style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', marginBottom: 8, borderRadius: 6 }}>
                <span style={{ display: 'flex', transform: sec.expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}><ChevronRight size={16} color="#262626" /></span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#262626', flex: 1 }}>Upcoming Appointments</span>
              </button>
              {sec.expanded && (
                <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#3b82f6', lineHeight: '18px' }}>06</span>
                    <span style={{ fontSize: 9, color: '#3b82f6' }}>Mar</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#262626', display: 'block' }}>Tear Off &amp; Deck Prep</span>
                    <span style={{ fontSize: 11, color: '#737373' }}>Mar 20, 7 AM → 12 PM</span>
                  </div>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #c4b5fd, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 600, color: '#7c3aed' }}>JD</div>
                </div>
              )}
            </div>
          );

          return (
            <div key={sec.id} style={{ padding: '8px 20px 4px' }}>
              <button onClick={toggleExpanded} style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', marginBottom: 8, borderRadius: 6 }}>
                <span style={{ display: 'flex', transform: sec.expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}><ChevronRight size={16} color="#262626" /></span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#262626' }}>{sec.label}</span>
              </button>
              {sec.expanded && (
                <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 4 }}>
                  {visFields.map(f => (
                    <div key={f.id} style={{ display: 'flex', alignItems: 'flex-start', minHeight: 28, padding: '2px 0', gap: 8 }}>
                      <span style={{ width: 88, fontSize: 11, color: 'rgba(0,0,0,0.48)', flexShrink: 0, paddingTop: 1 }}>{f.label}</span>
                      <RV id={f.id} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ height: 1, background: '#e5e5e5', margin: '4px 0 0' }} />
            </div>
          );
        })}
      </div>
    </aside>
  );
}

/* ─── Center Pane Tab Content ─── */
function EmptyState({ icon: Icon, title, desc, btn }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div style={{ color: '#d1d5db' }}><Icon size={40} color="#d1d5db" /></div>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#262626' }}>{title}</span>
      <span style={{ fontSize: 12, color: '#737373', maxWidth: 260, textAlign: 'center' }}>{desc}</span>
      {btn && <button style={{ marginTop: 4, padding: '7px 16px', borderRadius: 8, border: 'none', background: '#5046e5', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>{btn}</button>}
    </div>
  );
}

function OverviewSection({ icon: Icon, title, children, chevron, extra }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={18} color="#737373" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 13, color: '#262626', fontWeight: 500, letterSpacing: -0.23 }}>{title}</span>
            {chevron && <ChevronRight size={16} color="#a3a3a3" />}
          </div>
        </div>
        {extra}
      </div>
      {children}
    </div>
  );
}

function OverviewTab() {
  const [showCustomize, setShowCustomize] = useState(false);
  const customizeRef = useRef(null);
  const defaultSectionItems = [
    { id: 'highlights', label: 'Highlights' },
    { id: 'aiSummary', label: 'AI Job Summary' },
    { id: 'description', label: 'Job Description' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'tasks', label: 'Tasks Preview' },
  ];
  const [allSections, setAllSections] = useState(defaultSectionItems);
  const defaultSectionState = { highlights: true, aiSummary: true, description: true, addresses: true, tasks: true };
  const [sectionState, setSectionState] = useState(defaultSectionState);

  useEffect(() => {
    const h = e => { if (customizeRef.current && !customizeRef.current.contains(e.target)) setShowCustomize(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const vis = id => sectionState[id] !== false;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Highlights */}
      {vis('highlights') && (
        <OverviewSection icon={BarChartIcon} title="Highlights" extra={
          <div ref={customizeRef} style={{ position: 'relative' }}>
            <div onClick={() => setShowCustomize(p => !p)} style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer', background: showCustomize ? '#e4d9c8' : 'transparent' }}>
              <SlidersIcon size={13} color={showCustomize ? '#5c4a1e' : '#a3a3a3'} />
            </div>
            {showCustomize && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, zIndex: 50 }}>
                <CustomizePanel title="Customise Overview" items={allSections} state={sectionState}
                  onToggle={id => setSectionState(p => ({ ...p, [id]: p[id] === false ? true : false }))}
                  onReorder={setAllSections}
                  onReset={() => { setAllSections(defaultSectionItems); setSectionState(defaultSectionState); }}
                  onClose={() => setShowCustomize(false)} />
              </div>
            )}
          </div>
        }>
          <div style={{ display: 'flex', gap: 16 }}>
            {[{ icon: CalendarIcon, label: 'Job Due Date', val: '23 Oct 2025' }, { icon: DollarIcon, label: 'Job Value', val: '$ 10000' }, { icon: ListChecksIcon, label: 'Tasks', val: '2/8' }, { icon: TrendingUpIcon, label: 'Job Profit', val: '$ 1000' }].map((c, i) => (
              <div key={i} style={{ flex: 1, border: '1px solid #e5e5e5', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 72, cursor: 'pointer', transition: 'transform 150ms ease, box-shadow 150ms ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><c.icon size={15} color="#6b7280" /><span style={{ fontSize: 12, color: '#6b7280' }}>{c.label}</span></div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{c.val}</span>
              </div>
            ))}
          </div>
        </OverviewSection>
      )}

      {/* AI Summary */}
      {vis('aiSummary') && (
        <OverviewSection icon={SparkleIcon} title="AI Job Summary" chevron>
          <div style={{ borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 12, background: 'linear-gradient(169deg,#faf5ff 0%,#eff6ff 100%)', border: '1px solid #e9d4ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 10, color: '#6b7280' }}>Generated Dec 31, 2025</span><span style={{ cursor: 'pointer' }}><CopyIcon /></span></div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 9px', background: '#fff', border: '1px solid #dab2ff', borderRadius: 6, cursor: 'pointer' }}>
                <SparkleIcon size={12} /><span style={{ fontSize: 10, color: '#7c3aed', fontWeight: 500 }}>Ask a question</span>
              </button>
            </div>
            <p style={{ fontSize: 12, color: '#374151', lineHeight: '18px', margin: 0 }}>Residential roof replacement project for a 2,450 sq ft asphalt shingle roof with 6/12 slope. The job involves removing 2 layers of old shingles and installing new charcoal gray shingles with a 25-year warranty.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ cursor: 'pointer' }}><ThumbsUpIcon /></span>
              <span style={{ cursor: 'pointer' }}><ThumbsDownIcon /></span>
              <span style={{ cursor: 'pointer' }}><CopyIcon /></span>
            </div>
          </div>
        </OverviewSection>
      )}

      {/* Job Description */}
      {vis('description') && (
        <OverviewSection icon={AlignLeftIcon} title="Job description">
          <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 14 }}>
            <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.72)', lineHeight: '20px', margin: 0 }}>Build, manage and optimize with new ISP infrastructure. Ensure seamless connectivity for the client, troubleshoot network issues, and collaborate with cross-functional teams to enhance service delivery.</p>
          </div>
        </OverviewSection>
      )}

      {/* Addresses */}
      {vis('addresses') && (
        <OverviewSection icon={MapPin} title="Addresses">
          <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden', display: 'flex', height: 130 }}>
            <div style={{ display: 'flex', flex: 1 }}>
              <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div><span style={{ fontSize: 12, color: '#737373', fontWeight: 500, display: 'block' }}>Service Address</span><div style={{ fontSize: 12, color: '#262626', lineHeight: '17px', marginTop: 4 }}>45 Maple Avenue, London, UK,<br />England - SW1A 1AA</div></div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 999, background: '#fce7f3', alignSelf: 'flex-start' }}>
                  <MapPin size={14} color="#db2777" /><span style={{ fontSize: 12, color: '#db2777', fontWeight: 500 }}>San Jose Territory</span>
                </span>
              </div>
              <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div><span style={{ fontSize: 12, color: '#737373', fontWeight: 500, display: 'block' }}>Billing Address</span><div style={{ fontSize: 12, color: '#262626', lineHeight: '17px', marginTop: 4 }}>123 Maple Avenue, Sunnyvale,<br />CA, USA, California - 94086</div></div>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 8px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', cursor: 'pointer', alignSelf: 'flex-start' }}>
                  <ExternalLinkIcon size={16} color="#374151" /><span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>Maps</span>
                </button>
              </div>
            </div>
            <div style={{ width: 155, flexShrink: 0, position: 'relative', overflow: 'hidden', background: '#e8f0fe' }}>
              <svg viewBox="0 0 155 130" width="155" height="130">
                <rect width="155" height="130" fill="#e8f0fe" />
                <line x1="0" y1="30" x2="155" y2="30" stroke="#ccc" strokeWidth="0.5" />
                <line x1="0" y1="60" x2="155" y2="60" stroke="#d4d4d4" strokeWidth="0.5" />
                <line x1="0" y1="90" x2="155" y2="90" stroke="#ccc" strokeWidth="0.5" />
                <line x1="40" y1="0" x2="40" y2="130" stroke="#ccc" strokeWidth="0.5" />
                <line x1="80" y1="0" x2="80" y2="130" stroke="#d4d4d4" strokeWidth="0.5" />
                <line x1="120" y1="0" x2="120" y2="130" stroke="#ccc" strokeWidth="0.5" />
                <rect x="45" y="35" width="30" height="20" rx="2" fill="#d1d5db" opacity="0.5" />
                <rect x="85" y="15" width="25" height="25" rx="2" fill="#d1d5db" opacity="0.5" />
                <rect x="55" y="70" width="35" height="15" rx="2" fill="#d1d5db" opacity="0.4" />
                <path d="M90 42 C96 42,98 50,98 55 C98 62,90 70,90 70 C90 70,82 62,82 55 C82 50,84 42,90 42Z" fill="#ef4444" />
                <circle cx="90" cy="53" r="3.5" fill="white" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,white 0%,transparent 40%)' }} />
            </div>
          </div>
        </OverviewSection>
      )}

      {/* Tasks Preview */}
      {vis('tasks') && (
        <OverviewSection icon={ListChecksIcon} title="Tasks (10)" chevron>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
            {[{ name: 'Explain infra to client', status: 'todo', sub: 'Check for leaks' }, { name: 'Explain roofing options', status: 'ongoing', sub: 'Install flashing' }, { name: 'Tear off old roof', status: 'ongoing', sub: 'Install flashing' }, { name: 'Apply underlayment', status: 'progress', sub: 'Check for leaks' }].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderBottom: '1px solid #e5e7eb', cursor: 'pointer', transition: 'background 80ms ease' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: t.status === 'todo' ? '#f3f4f6' : t.status === 'ongoing' ? '#dcfce7' : '#fef3c7', border: t.status === 'todo' ? '2px solid #d1d5db' : 'none' }}>
                  {t.status !== 'todo' && (t.status === 'ongoing' ? <PlayIcon /> : <LoaderIcon />)}
                </div>
                <span style={{ flex: 1, fontSize: 12, color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, border: '1px solid #e5e5e5', borderRadius: 999, padding: '3px 7px' }}><ClockIcon size={14} color="#a3a3a3" /><span style={{ fontSize: 12, color: '#737373' }}>35 min</span></span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, border: '1px solid #e5e5e5', borderRadius: 999, padding: '3px 7px' }}><FileTextIcon size={14} color="#a3a3a3" /><span style={{ fontSize: 12, color: '#737373' }}>{t.sub}</span></span>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#d1d5db', flexShrink: 0 }} />
                  <DotsVertIcon />
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: 12, color: '#3b82f6' }}>View All</span>
              <ChevronDown size={14} color="#3b82f6" />
            </div>
          </div>
        </OverviewSection>
      )}
    </div>
  );
}

function TasksTab() {
  const tasks = [
    { name: 'Explain roofing options', sub: 'Check for leaks', status: 'ongoing' },
    { name: 'Tear off old roof', sub: 'Get materials', status: 'ongoing' },
    { name: 'Apply underlayment', sub: 'Install flashing', status: 'progress' },
    { name: 'Final walkthrough', sub: 'Install flashing', status: 'progress' },
    { name: 'Apply underlayment', sub: 'Install flashing', status: 'ongoing' },
    { name: 'Final walkthrough', sub: 'Check for leaks', status: 'ongoing' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ flex: 1 }} />
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', border: '1px solid #e5e5e5', borderRadius: 8, background: '#fff', cursor: 'pointer' }}><PlusIcon size={14} /><span style={{ fontSize: 12, color: '#262626', fontWeight: 500 }}>Create</span></button>
        <DotsVertIcon />
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tasks.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px', borderBottom: '1px solid #e5e7eb', cursor: 'pointer', transition: 'background 80ms ease' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: t.status === 'ongoing' ? '#dcfce7' : '#fef3c7' }}>
              {t.status === 'ongoing' ? <PlayIcon /> : <LoaderIcon />}
            </div>
            <span style={{ flex: 1, fontSize: 12, color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, border: '1px solid #e5e5e5', borderRadius: 999, padding: '3px 7px' }}><ClockIcon size={14} color="#a3a3a3" /><span style={{ fontSize: 12, color: '#737373' }}>35 min</span></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, border: '1px solid #e5e5e5', borderRadius: 999, padding: '3px 7px' }}><FileTextIcon size={14} color="#a3a3a3" /><span style={{ fontSize: 12, color: '#737373' }}>{t.sub}</span></span>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#d1d5db', flexShrink: 0 }} />
              <DotsVertIcon />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ─── Quote Builder — Shared Data ─── */
const QUOTE_BUILDER_DATA = {
  id: 'QT-1024',
  title: 'Roof Replacement — Full',
  type: 'quote',
  referenceNo: '1000015328',
  quoteNo: '#1000015328',
  status: 'Accepted',
  statusBg: '#e1f5ee',
  statusColor: '#0f6e56',
  acceptedDate: 'Oct 8',
  createdBy: 'mrithyunjay k',
  soldBy: 'Jerin Ajay',
  statusTimeline: [
    { stage: 'Draft', date: '10/03/2025 07:23 PM', by: 'mrithyunjay k' },
    { stage: 'Sent', date: '10/03/2025 12:44 PM', by: 'Jerin Ajay' },
    { stage: 'Await Signature', date: '10/04/2025 09:15 AM', by: 'Richard Mathew' },
    { stage: 'Change Requested', date: '10/05/2025 02:30 PM', by: 'Richard Mathew' },
    { stage: 'Accepted', date: '10/08/2025 12:45 PM', by: 'Jerin Ajay' },
  ],
  vendor: { name: 'Apex Roofing Solutions', address: '742 Industrial Blvd, Suite 200', city: 'San Jose, CA 95112', website: 'apex-roofing.com', email: 'info@apex-roofing.com', phone: '(408) 555-0100' },
  organization: { name: 'Telnet Industries', customerCount: 1, address: '742 Industrial Blvd, Suite 200, San Jose, CA 95112' },
  customer: { name: 'John Smith', email: 'smith@example.com', phone: '(408) 555-1234', address: '742 Industrial Blvd, Suite 200, San Jose, CA 95112' },
  quoteDate: '2025-10-03',
  validUntil: '2025-11-15',
  lineItems: ALL_PARTS,
  deposit: { required: true, type: 'fixed', value: 2000.00 },
  notes: '',
};

const INVOICE_STATUS_TIMELINES = {
  Draft: [
    { stage: 'Draft', date: '10/22/2025 08:12 AM', by: 'James Smith' },
    { stage: 'Mark as Sent', date: '', by: '' },
    { stage: 'Record Payment', date: '', by: '' },
    { stage: 'Archived', date: '', by: '' },
  ],
  'Mark as Sent': [
    { stage: 'Draft', date: '10/10/2025 09:08 AM', by: 'James Smith' },
    { stage: 'Mark as Sent', date: '10/10/2025 11:24 AM', by: 'James Smith' },
    { stage: 'Record Payment', date: '', by: '' },
    { stage: 'Archived', date: '', by: '' },
  ],
  'Record Payment': [
    { stage: 'Draft', date: '10/10/2025 09:08 AM', by: 'James Smith' },
    { stage: 'Mark as Sent', date: '10/10/2025 11:24 AM', by: 'James Smith' },
    { stage: 'Record Payment', date: '10/12/2025 09:42 AM', by: 'System' },
    { stage: 'Archived', date: '', by: '' },
  ],
  Archived: [
    { stage: 'Draft', date: '10/10/2025 09:08 AM', by: 'James Smith' },
    { stage: 'Mark as Sent', date: '10/10/2025 11:24 AM', by: 'James Smith' },
    { stage: 'Record Payment', date: '10/12/2025 09:42 AM', by: 'System' },
    { stage: 'Archived', date: '10/18/2025 04:16 PM', by: 'System' },
  ],
};

function buildDocumentDetailData(record) {
  if (!record) return QUOTE_BUILDER_DATA;
  const isInvoice = record.type === 'invoice';
  return {
    ...QUOTE_BUILDER_DATA,
    ...record,
    type: record.type || 'quote',
    quoteNo: record.id,
    referenceNo: record.id.replace(/\D/g, '') || QUOTE_BUILDER_DATA.referenceNo,
    statusTimeline: isInvoice
      ? (INVOICE_STATUS_TIMELINES[record.status] || INVOICE_STATUS_TIMELINES.Draft)
      : QUOTE_BUILDER_DATA.statusTimeline,
    quoteDate: record.rawDate || QUOTE_BUILDER_DATA.quoteDate,
    validUntil: record.rawValidUntil || QUOTE_BUILDER_DATA.validUntil,
  };
}

const QB_FMT_USD = v => '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2 });
const QB_FMT_DATE = d => { if (!d) return '—'; const dt = new Date(d + 'T00:00:00'); return dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); };
const QB_FMT_DATE_SHORT = d => { if (!d) return '—'; const dt = new Date(d + 'T00:00:00'); return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
const QB_CALC = items => {
  const subtotal = items.filter(i => i.billable !== false).reduce((s, i) => s + i.qty * (i.unitPrice || i.rate || 0), 0);
  const tax = subtotal * 0.085;
  return { subtotal, tax, total: subtotal + tax };
};

const LAYOUT_OPTIONS = [
  { id: '1', label: 'A · Tighten hierarchy', desc: 'Stat bar + cleaned doc + 280px sidebar', slug: 'tighten-hierarchy' },
  { id: '2', label: 'Inline edit', desc: 'Editable document with underline fields', slug: 'inline-edit' },
  { id: '3', label: 'B · Command bar', desc: 'Dark bar + tabs + focused document', slug: 'command-bar' },
  { id: '4', label: 'C · Change review', desc: 'Diff workspace + conversation pane', slug: 'change-review' },
];

const STAGE_TIMELINE_COLORS = {
  lastActive: { bg: '#1C6C66', color: '#FFFFFF' },
  active: { bg: '#BFE8D9', color: '#262626' },
  inactive: { bg: '#E6E4D9', color: '#6F6E69' },
};

/* ─── Quote Status Timeline (chevron pills, click to progress) ─── */
function StageHoverPopover({ stage, pillRef, canRollback, onRollback }) {
  const popRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!pillRef) return;
    requestAnimationFrame(() => {
      const r = pillRef.getBoundingClientRect();
      const pillCenter = r.left + r.width / 2;
      const pop = popRef.current;
      const popW = pop ? pop.offsetWidth : 180;
      let left = pillCenter - popW / 2;
      if (left < 8) left = 8;
      if (left + popW > window.innerWidth - 8) left = window.innerWidth - popW - 8;
      setPos({ top: r.bottom + 6, left });
      setVisible(true);
    });
    return () => setVisible(false);
  }, [pillRef, stage]);
  const initials = (stage.by || '').split(' ').map(w => w[0]?.toUpperCase()).join('').slice(0, 2);
  return ReactDOM.createPortal(
    <div ref={popRef} className="dropdown-enter" style={{ position: 'fixed', top: pos.top, left: pos.left, opacity: visible ? 1 : 0, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)', padding: '10px 14px', zIndex: 1100, minWidth: 180, transition: 'opacity 100ms' }}>
      <div style={{ fontSize: 11, color: '#737373', marginBottom: 6 }}>Last updated</div>
      <div style={{ fontSize: 12, fontWeight: 500, color: '#262626', marginBottom: 10 }}>{stage.date}</div>
      <div style={{ fontSize: 11, color: '#737373', marginBottom: 6 }}>Updated by</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#dbeafe', color: '#2563eb', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{initials}</div>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#262626' }}>{stage.by}</span>
      </div>
      {canRollback && (
        <>
          <div style={{ height: 1, background: '#f0eeea', margin: '10px -14px', width: 'calc(100% + 28px)' }} />
          <button
            onClick={e => { e.stopPropagation(); onRollback(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '6px 0', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#dc2626', transition: 'opacity 120ms' }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Rollback to this stage
          </button>
        </>
      )}
    </div>,
    document.body
  );
}

function StageConfirmDialog({ stage, onConfirm, onCancel, title, description, confirmLabel, confirmColor }) {
  const [remarks, setRemarks] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);
  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }} onClick={onCancel}>
      <div className="dropdown-enter" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)', padding: '24px', width: 380, maxWidth: '90vw' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#262626', marginBottom: 4 }}>{title || `Move to ${stage.stage}?`}</div>
        <div style={{ fontSize: 12, color: '#737373', marginBottom: 16 }}>{description || 'This will update the quote status. Add optional remarks below.'}</div>
        <textarea
          ref={inputRef}
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          placeholder="Add remarks (optional)..."
          rows={3}
          style={{ width: '100%', padding: '10px 12px', fontSize: 13, border: '1px solid #e5e5e5', borderRadius: 8, resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms' }}
          onFocus={e => e.target.style.borderColor = '#262626'}
          onBlur={e => e.target.style.borderColor = '#e5e5e5'}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <button className="btn-press" onClick={onCancel} style={{ padding: '7px 16px', fontSize: 12, fontWeight: 500, borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', color: '#374151', cursor: 'pointer' }}>Cancel</button>
          <button className="btn-press" onClick={() => onConfirm(remarks)} style={{ padding: '7px 16px', fontSize: 12, fontWeight: 600, borderRadius: 8, border: 'none', background: confirmColor || '#292929', color: '#fff', cursor: 'pointer' }}>{confirmLabel || 'Confirm'}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function StatusDropdownMenu({ onClose, buttonRef, optionalStatuses, onSelect }) {
  const dropdownRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.right - 160 });
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, buttonRef]);

  return ReactDOM.createPortal(
    <div ref={dropdownRef} className="dropdown-enter" style={{ position: 'fixed', top: pos.top, left: pos.left, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)', minWidth: 160, zIndex: 1200, padding: '4px 0' }}>
      {optionalStatuses.map(status => (
        <button key={status} className="dropdown-item" onClick={() => onSelect(status)} style={{ width: '100%', display: 'block', padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#262626', textAlign: 'left' }}>
          {status}
        </button>
      ))}
    </div>,
    document.body
  );
}

function getTimelineActiveIndex(timeline, explicitStage) {
  if (explicitStage) {
    const explicitIdx = timeline.findIndex(s => s.stage === explicitStage);
    if (explicitIdx !== -1) return explicitIdx;
  }
  const crIdx = timeline.findIndex(s => s.stage === 'Change Requested');
  if (crIdx !== -1) return crIdx;
  const terminalIdx = timeline.findIndex(s => s.stage === 'Accepted' || s.stage === 'Declined');
  if (terminalIdx !== -1) return terminalIdx;
  return Math.max(0, timeline.length - 1);
}

function QuoteStatusTimeline({ timeline, onAccepted, activeStage: activeStageProp = null, optionalStatuses: optionalStatusesProp = ['Archived', 'Closed', 'Cancelled'] }) {
  const [stages, setStages] = useState(timeline);
  const [activeIdx, setActiveIdx] = useState(() => {
    return getTimelineActiveIndex(timeline, activeStageProp);
  });
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [confirmIdx, setConfirmIdx] = useState(null);
  const [pendingTerminalStage, setPendingTerminalStage] = useState(null);
  const [confirmOnHold, setConfirmOnHold] = useState(false);
  const [rollbackIdx, setRollbackIdx] = useState(null);
  const [isOnHold, setIsOnHold] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pillRefs = useRef({});
  const menuButtonRef = useRef(null);
  const referencePillRef = useRef(null);
  const [pillWidth, setPillWidth] = useState(0);

  if (!stages?.length) return null;

  const CHEVRON = 14;
  const PILL_H = 28;
  const TERMINAL_GAP = 2;
  const PILL_X_PAD = 14;
  const PILL_LEAD_PAD = CHEVRON + 6;
  const optionalStatuses = optionalStatusesProp;
  const activeStage = stages[activeIdx]?.stage;

  useEffect(() => {
    setStages(timeline);
    setActiveIdx(getTimelineActiveIndex(timeline, activeStageProp));
  }, [timeline, activeStageProp]);

  useEffect(() => {
    const measure = () => {
      if (!referencePillRef.current) return;
      setPillWidth(Math.ceil(referencePillRef.current.getBoundingClientRect().width));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const handleClick = (i) => {
    if (i > activeIdx) {
      setPendingTerminalStage(null);
      setConfirmIdx(i);
      return;
    }
    if (i < activeIdx) {
      setRollbackIdx(i);
    }
  };

  const handleConfirm = (remarks) => {
    const targetStage = stages[confirmIdx];
    const effectiveStage = pendingTerminalStage ? { ...targetStage, stage: pendingTerminalStage } : targetStage;
    if (effectiveStage && (effectiveStage.stage === 'Accepted' || effectiveStage.stage === 'Declined')) {
      let nextStages = [...stages];
      if (confirmIdx !== null) {
        nextStages[confirmIdx] = {
          ...nextStages[confirmIdx],
          stage: effectiveStage.stage,
          date: new Date().toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          by: 'System'
        };
      }
      setStages(nextStages);
    }
    if (effectiveStage && effectiveStage.stage === 'Accepted' && onAccepted) onAccepted();
    setActiveIdx(confirmIdx);
    setIsOnHold(false);
    setConfirmIdx(null);
    setPendingTerminalStage(null);
  };

  const handleSelectOptionalStatus = (status) => {
    if (status === 'On Hold') {
      setConfirmOnHold(true);
      setMenuOpen(false);
      return;
    }
    setMenuOpen(false);
  };

  const handleConfirmOnHold = (remarks) => {
    const revisedIdx = stages.findIndex(s => s.stage === 'Revised');
    const newStages = [...stages];
    const newStage = {
      stage: 'On Hold',
      date: new Date().toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      by: 'System'
    };

    if (revisedIdx !== -1) {
        const onHoldIdx = revisedIdx + 1;
        newStages.splice(onHoldIdx, 0, newStage);
        setStages(newStages);
        setActiveIdx(onHoldIdx);
    } else {
      newStages.push(newStage);
      setStages(newStages);
      setActiveIdx(newStages.length - 1);
    }

    setIsOnHold(true);
    setConfirmOnHold(false);
  };

  const handleRollback = (remarks) => {
    if (rollbackIdx !== null && rollbackIdx < activeIdx) {
      setActiveIdx(rollbackIdx);
      setIsOnHold(false);
      setRollbackIdx(null);
      setHoveredIdx(null);
    }
  };

  const ON_HOLD_COLORS = {
    lastActive: { bg: '#BC5215', color: '#FFFCF0' },
    active: { bg: '#FFE7CE', color: '#71320D' },
    inactive: { bg: '#E6E4D9', color: '#6F6E69' },
  };

  const ACCEPTED_COLORS = {
    lastActive: { bg: '#536907', color: '#FFFCF0' },
    active: { bg: '#EDEECF', color: '#3D4C07' },
    inactive: { bg: '#E6E4D9', color: '#6F6E69' },
  };

  const isChangeRequested = activeStage === 'Change Requested';

  const CHANGE_REQUESTED_COLORS = {
    lastActive: { bg: '#BC5215', color: '#FFFCF0' },
    active: { bg: '#FFE7CE', color: '#71320D' },
    inactive: { bg: '#E6E4D9', color: '#6F6E69' },
  };

  const DECLINED_COLORS = {
    lastActive: { bg: '#991b1b', color: '#FFFCF0' },
    active: { bg: '#fee2e2', color: '#991b1b' },
    inactive: { bg: '#E6E4D9', color: '#6F6E69' },
  };

  const currentColors = isOnHold ? ON_HOLD_COLORS : isChangeRequested ? CHANGE_REQUESTED_COLORS : activeStage === 'Declined' ? DECLINED_COLORS : activeStage === 'Accepted' ? ACCEPTED_COLORS : STAGE_TIMELINE_COLORS;

  return (
    <div style={{ background: 'transparent' }}>
      <div style={{ position: 'relative', minHeight: 40, padding: '8px 20px 10px', boxSizing: 'border-box', width: '100%' }}>
        <div style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', whiteSpace: 'nowrap', height: PILL_H, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, padding: `0 ${PILL_LEAD_PAD}px`, boxSizing: 'border-box' }} ref={referencePillRef}>
          Change Requested
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, maxWidth: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content' }}>
          {stages.map((s, i) => {
          const isLastActive = i === activeIdx;
          const isPrevActive = i < activeIdx;
          const isTerminal = s.stage === 'Accepted' || s.stage === 'Declined';

          if (isTerminal) {
            const isAccepted = activeStage === 'Accepted';
            const isDeclined = activeStage === 'Declined';
            const terminalResolved = isAccepted || isDeclined;
            const acceptedSc = isAccepted ? ACCEPTED_COLORS.lastActive : currentColors.inactive;
            const declinedSc = isDeclined ? DECLINED_COLORS.lastActive : currentColors.inactive;
            const requestTerminalStage = (stage) => {
              setPendingTerminalStage(stage);
              setConfirmIdx(i);
            };
            const terminalStartClip = `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${CHEVRON}px 50%)`;
            const terminalStartPadding = `0 ${PILL_X_PAD}px 0 ${PILL_LEAD_PAD}px`;
            const declinedStartsTerminal = terminalResolved && isDeclined;
            return (
              <Fragment key="terminal">
                <div ref={el => pillRefs.current[i] = el} style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', flex: '0 0 auto', flexShrink: 0, height: PILL_H, overflow: 'hidden', marginLeft: 0 }}>
                  {(!terminalResolved || isAccepted) && (
                    <div
                      style={{
                        height: PILL_H, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: terminalStartPadding,
                        background: acceptedSc.bg, color: acceptedSc.color,
                        fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                        clipPath: terminalStartClip,
                        borderRadius: terminalResolved ? `0 ${PILL_H/2}px ${PILL_H/2}px 0` : 0,
                        width: pillWidth || undefined,
                        boxSizing: 'border-box',
                        flex: '0 0 auto', flexShrink: 0, cursor: isAccepted ? 'default' : 'pointer',
                        transition: 'background 200ms cubic-bezier(0.23, 1, 0.32, 1), color 200ms cubic-bezier(0.23, 1, 0.32, 1)',
                      }}
                      onClick={() => { if (!isAccepted) requestTerminalStage('Accepted'); }}
                      onMouseEnter={() => setHoveredIdx(isAccepted ? i : null)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >Accepted</div>
                  )}
                  {!terminalResolved && <div style={{ width: TERMINAL_GAP, height: PILL_H, background: '#fff', flexShrink: 0 }} />}
                  {(!terminalResolved || isDeclined) && (
                    <div
                      style={{
                        height: PILL_H, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: declinedStartsTerminal ? terminalStartPadding : `0 ${PILL_X_PAD}px`,
                        background: declinedSc.bg, color: declinedSc.color,
                        fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                        clipPath: declinedStartsTerminal ? terminalStartClip : undefined,
                        borderRadius: `0 ${PILL_H/2}px ${PILL_H/2}px 0`,
                        width: pillWidth || undefined,
                        boxSizing: 'border-box',
                        flex: '0 0 auto', flexShrink: 0, cursor: isDeclined ? 'default' : 'pointer',
                        transition: 'background 200ms cubic-bezier(0.23, 1, 0.32, 1), color 200ms cubic-bezier(0.23, 1, 0.32, 1)',
                      }}
                      onClick={() => { if (!isDeclined) requestTerminalStage('Declined'); }}
                      onMouseEnter={() => setHoveredIdx(isDeclined ? i : null)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >Declined</div>
                  )}
                </div>
              </Fragment>
            );
          }

          const sc = isLastActive
            ? currentColors.lastActive
            : isPrevActive
            ? currentColors.active
            : currentColors.inactive;

          const isFirst = i === 0;
          const nextIsTerminal = i < stages.length - 1 && (stages[i + 1].stage === 'Accepted' || stages[i + 1].stage === 'Declined');
          const isFinalStage = i === stages.length - 1;
          const clip = isFinalStage
            ? (isFirst
              ? undefined
              : `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${CHEVRON}px 50%)`)
            : (isFirst
              ? `polygon(0 0, calc(100% - ${CHEVRON}px) 0, 100% 50%, calc(100% - ${CHEVRON}px) 100%, 0 100%)`
              : `polygon(0 0, calc(100% - ${CHEVRON}px) 0, 100% 50%, calc(100% - ${CHEVRON}px) 100%, 0 100%, ${CHEVRON}px 50%)`);
          const radius = isFirst && isFinalStage
            ? PILL_H / 2
            : isFirst
            ? `${PILL_H/2}px 0 0 ${PILL_H/2}px`
            : isFinalStage
            ? `0 ${PILL_H/2}px ${PILL_H/2}px 0`
            : 0;
          const padding = isFinalStage
            ? (isFirst ? `0 ${PILL_X_PAD}px 0 18px` : `0 ${PILL_X_PAD}px 0 ${PILL_LEAD_PAD}px`)
            : (isFirst ? `0 ${PILL_LEAD_PAD}px 0 18px` : `0 ${PILL_LEAD_PAD}px 0 ${PILL_LEAD_PAD}px`);

          return (
            <div
              key={s.stage}
              ref={el => pillRefs.current[i] = el}
              style={{
                height: PILL_H,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding,
                background: sc.bg,
                color: sc.color,
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                clipPath: clip,
                borderRadius: radius,
                width: pillWidth || undefined,
                boxSizing: 'border-box',
                marginRight: isFinalStage ? 0 : nextIsTerminal ? TERMINAL_GAP - CHEVRON : -CHEVRON + 2,
                flex: '0 0 auto',
                flexShrink: 0,
                position: 'relative',
                zIndex: nextIsTerminal ? 2 : isLastActive ? 3 : 1,
                cursor: 'pointer',
                transition: 'background 200ms cubic-bezier(0.23, 1, 0.32, 1), color 200ms cubic-bezier(0.23, 1, 0.32, 1)',
              }}
              onClick={() => handleClick(i)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {s.stage}
            </div>
          );
        })}
            </div>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button ref={menuButtonRef} onClick={() => setMenuOpen(p => !p)} style={{ ...btn32, width: 28, height: 28, borderRadius: '50%' }}>
                <DotsIcon />
              </button>
              {menuOpen && <StatusDropdownMenu onClose={() => setMenuOpen(false)} buttonRef={menuButtonRef} optionalStatuses={optionalStatuses} onSelect={handleSelectOptionalStatus} />}
            </div>
          </div>
        </div>
      </div>
      {hoveredIdx !== null && hoveredIdx <= activeIdx && confirmIdx === null && rollbackIdx === null && <StageHoverPopover stage={stages[hoveredIdx]} pillRef={pillRefs.current[hoveredIdx]} canRollback={hoveredIdx < activeIdx} onRollback={() => setRollbackIdx(hoveredIdx)} />}
      {confirmIdx !== null && <StageConfirmDialog stage={pendingTerminalStage ? { ...stages[confirmIdx], stage: pendingTerminalStage } : stages[confirmIdx]} onConfirm={handleConfirm} onCancel={() => { setConfirmIdx(null); setPendingTerminalStage(null); }} />}
      {rollbackIdx !== null && <StageConfirmDialog stage={stages[rollbackIdx]} onConfirm={handleRollback} onCancel={() => setRollbackIdx(null)} title={`Rollback to ${stages[rollbackIdx].stage}?`} description="This will revert the quote status to a previous stage. Add optional remarks below." confirmLabel="Rollback" confirmColor="#dc2626" />}
      {confirmOnHold && <StageConfirmDialog stage={{stage: 'On Hold'}} onConfirm={handleConfirmOnHold} onCancel={() => setConfirmOnHold(false)} />}
    </div>
  );
}

/* ─── Overflow Menu (⋯) ─── */
function OverflowMenu({ items, bordered = true, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="btn-press btn-ghost"
        onClick={() => setOpen(p => !p)}
        style={bordered
          ? { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid #e5e5e5', background: open ? '#f5f4f0' : '#fff', cursor: 'pointer' }
          : { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 6, border: 'none', background: open ? '#f3f4f6' : 'none', cursor: 'pointer', color: '#a3a3a3', transition: 'background 100ms' }
        }
        onMouseEnter={e => {
          if (bordered || open) return;
          e.currentTarget.style.background = '#f3f4f6';
        }}
        onMouseLeave={e => {
          if (bordered || open) return;
          e.currentTarget.style.background = 'none';
        }}
      >
        <DotsIcon />
      </button>
      {open && (
        <div className="dropdown-enter" style={{ position: 'absolute', top: 'calc(100% + 4px)', [align]: 0, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)', minWidth: 160, zIndex: 100, padding: '4px 0' }}>
          {items.map(item => (
            <button key={item.label} className="dropdown-item" onClick={() => { item.onClick?.(); setOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: item.danger ? '#ef4444' : '#262626', textAlign: 'left' }}>
              {item.icon && <span style={{ display: 'flex', color: item.danger ? '#ef4444' : '#737373' }}>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Inline Editable Text (Layouts 3 & 4) ─── */
function EditableField({ value, onChange, style = {}, inputStyle = {} }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);
  useEffect(() => { if (editing && ref.current) ref.current.select(); }, [editing]);
  useEffect(() => { setDraft(value); }, [value]);
  const commit = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };
  if (editing) {
    return <input ref={ref} className="inline-edit-field" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); }} onBlur={commit} style={{ ...style, ...inputStyle, border: '1px solid #262626', borderRadius: 4, padding: '2px 6px', outline: 'none', background: '#fff', boxShadow: '0 0 0 3px rgba(38,38,38,0.08)', width: 'auto', minWidth: 40 }} />;
  }
  return <span className="edit-hotspot" role="button" tabIndex={0} onClick={() => setEditing(true)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setEditing(true); } }} style={{ ...style, padding: '2px 6px', margin: '-2px -6px', display: 'inline-block' }} title="Click to edit">{draft || '—'}</span>;
}

/* ─── Layout Dev Toggle Pill ─── */
function LayoutDevPill({ layout, setLayout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  useEffect(() => {
    const onKey = e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (['1','2','3','4'].includes(e.key)) { setLayout(e.key); localStorage.setItem('quote-builder-layout', e.key); }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setLayout]);
  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener('quote:customise-layout', handler);
    return () => document.removeEventListener('quote:customise-layout', handler);
  }, []);
  const active = LAYOUT_OPTIONS.find(o => o.id === layout);
  return (
    <div ref={ref} style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
      <button className="dev-pill btn-press" onClick={() => setOpen(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', fontSize: 11, fontWeight: 600, color: open ? '#7c3aed' : '#a3a3a3', background: open ? '#f5f3ff' : '#fff', border: `1px solid ${open ? '#c4b5fd' : '#e5e5e5'}`, borderRadius: 999, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
        Dev{layout !== '1' && <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, opacity: 0.8 }}>· {active?.label.split('—')[0].trim()}</span>}
        <ChevronDown size={10} color={open ? '#7c3aed' : '#a3a3a3'} />
      </button>
      {open && (
        <div className="dropdown-enter" role="menu" style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 260, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)', padding: '6px 0', overflow: 'hidden' }}>
          {LAYOUT_OPTIONS.map(opt => (
            <button key={opt.id} role="menuitemradio" aria-checked={layout === opt.id} className="hover-subtle" onClick={() => { setLayout(opt.id); localStorage.setItem('quote-builder-layout', opt.id); }} style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${layout === opt.id ? '#7c3aed' : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'border-color 120ms ease' }}>
                {layout === opt.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c3aed' }} />}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#262626' }}>{opt.id} · {opt.label}</div>
                <div style={{ fontSize: 11, color: '#a3a3a3', marginTop: 2 }}>{opt.desc}</div>
              </div>
            </button>
          ))}
          <div style={{ borderTop: '1px solid #f0eeea', margin: '4px 0 0', padding: '8px 14px' }}>
            <div style={{ fontSize: 10, color: '#a3a3a3' }}>Active: <span style={{ fontFamily: 'ui-monospace, monospace', color: '#737373' }}>{active?.slug}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Shared: Quote Document Card ─── */
function QuoteDocCard({ data, items, formState, editable = false, onFieldChange }) {
  const { subtotal, tax, total } = QB_CALC(items);
  const { depositRequired, depositType, depositValue, showPrices, showBreakdown, notes, quoteDate, validUntil, poNumber, contactName, orgName } = formState;
  const depositAmt = Number(depositValue) || 0;
  const balanceDue = total - (depositRequired ? depositAmt : 0);
  const Field = editable ? EditableField : ({ value, style }) => <span style={style}>{value || '—'}</span>;
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      <div style={{ height: 3, background: 'linear-gradient(90deg, #262626, #737373)' }} />
      <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid #f0eeea' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Field value={data.vendor.name} onChange={v => onFieldChange?.('vendorName', v)} style={{ fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }} />
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 6, lineHeight: '18px' }}>
              <div>{data.vendor.address}</div>
              <div>{data.vendor.city}</div>
              <div style={{ marginTop: 4, display: 'flex', gap: 16 }}>
                <span>{data.vendor.website}</span>
                <span>{data.vendor.email}</span>
                <span>{data.vendor.phone}</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{data.title}</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#a3a3a3', marginTop: 3 }}>{data.id}{data.quoteNo ? ` · ${data.quoteNo}` : ''}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '20px 32px', borderBottom: '1px solid #f0eeea', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', gap: 32, fontSize: 11, color: '#6b7280' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.06em', marginBottom: 4 }}>Quote date</div>
              <Field value={QB_FMT_DATE(quoteDate)} onChange={v => onFieldChange?.('quoteDate', v)} style={{ color: '#262626', fontWeight: 500, fontSize: 11 }} />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.06em', marginBottom: 4 }}>Valid until</div>
              <Field value={QB_FMT_DATE(validUntil)} onChange={v => onFieldChange?.('validUntil', v)} style={{ color: '#262626', fontWeight: 500, fontSize: 11 }} />
            </div>
            {data.referenceNo && <div>
              <div style={{ fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.06em', marginBottom: 4 }}>Reference no</div>
              <span style={{ color: '#262626', fontWeight: 500 }}>{data.referenceNo}</span>
            </div>}
            {poNumber && <div>
              <div style={{ fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.06em', marginBottom: 4 }}>PO number</div>
              <span style={{ color: '#262626', fontWeight: 500 }}>{poNumber}</span>
            </div>}
          </div>
          {(data.createdBy || data.soldBy) && (
            <div style={{ display: 'flex', gap: 32, fontSize: 11, color: '#6b7280', marginTop: 10 }}>
              {data.createdBy && <div>
                <div style={{ fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.06em', marginBottom: 4 }}>Created by</div>
                <span style={{ color: '#262626', fontWeight: 500 }}>{data.createdBy}</span>
              </div>}
              {data.soldBy && <div>
                <div style={{ fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.06em', marginBottom: 4 }}>Sold by</div>
                <span style={{ color: '#262626', fontWeight: 500 }}>{data.soldBy}</span>
              </div>}
            </div>
          )}
          <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginTop: 14 }}>{QB_FMT_USD(total)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.06em', marginBottom: 6 }}>Customer</div>
          <Field value={contactName} onChange={v => onFieldChange?.('contactName', v)} style={{ fontSize: 14, fontWeight: 700, color: '#111827' }} />
          <div style={{ marginTop: 2 }}><Field value={orgName} onChange={v => onFieldChange?.('orgName', v)} style={{ fontSize: 12, color: '#6b7280' }} /></div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
            <div>{data.customer.email}</div>
            <div>{data.customer.phone}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 32px 0', fontSize: 10, fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Line items</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginTop: 8 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #f0eeea' }}>
            <th style={{ padding: '8px 16px 8px 32px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description</th>
            <th style={{ padding: '8px 16px', textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Qty</th>
            {showPrices && <th style={{ padding: '8px 16px', textAlign: 'right', fontSize: 10, fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Rate</th>}
            {showPrices && <th style={{ padding: '8px 16px', textAlign: 'right', fontSize: 10, fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tax</th>}
            {showPrices && <th style={{ padding: '8px 16px 8px', textAlign: 'right', fontSize: 10, fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.04em', paddingRight: 32 }}>Amount</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const amt = item.qty * item.rate;
            const taxAmt = amt * item.tax / 100;
            return (
              <tr key={item.id || i} className={editable ? 'edit-hotspot' : undefined} style={{ borderBottom: '1px solid #f7f6f3' }}>
                <td style={{ padding: '12px 16px 12px 32px' }}>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{item.desc}</div>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center', color: '#262626' }}>{item.qty} {item.unit}</td>
                {showPrices && <td style={{ padding: '12px 16px', textAlign: 'right', color: '#262626' }}>{QB_FMT_USD(item.rate)}</td>}
                {showPrices && <td style={{ padding: '12px 16px', textAlign: 'right', color: '#6b7280', fontSize: 11 }}>{item.tax > 0 ? `${item.tax}%` : '—'}</td>}
                {showPrices && <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#111827', paddingRight: 32 }}>{QB_FMT_USD(amt + taxAmt)}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
      {editable && (
        <div style={{ padding: '8px 32px 16px' }}>
          <button className="btn-press" style={{ fontSize: 12, fontWeight: 500, color: '#185fa5', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>+ Add item</button>
        </div>
      )}
      {showBreakdown && (
        <div style={{ padding: '16px 32px 20px', borderTop: '2px solid #f0eeea' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 24, fontSize: 12 }}><span style={{ color: '#6b7280', minWidth: 80 }}>Subtotal</span><span style={{ fontWeight: 600, color: '#262626', minWidth: 90, textAlign: 'right' }}>{QB_FMT_USD(subtotal)}</span></div>
            <div style={{ display: 'flex', gap: 24, fontSize: 12 }}><span style={{ color: '#6b7280', minWidth: 80 }}>Tax</span><span style={{ fontWeight: 600, color: '#262626', minWidth: 90, textAlign: 'right' }}>{QB_FMT_USD(tax)}</span></div>
            {depositRequired && <div style={{ display: 'flex', gap: 24, fontSize: 12 }}><span style={{ color: '#6b7280', minWidth: 80 }}>Deposit ({depositType === 'percentage' ? depositValue + '%' : 'fixed'})</span><span style={{ fontWeight: 600, color: '#262626', minWidth: 90, textAlign: 'right' }}>−{QB_FMT_USD(depositAmt)}</span></div>}
            <div style={{ width: 200, height: 1, background: '#e5e5e5', margin: '6px 0' }} />
            <div style={{ display: 'flex', gap: 24, fontSize: 14 }}><span style={{ fontWeight: 700, color: '#111827' }}>Total</span><span style={{ fontWeight: 800, color: '#111827', minWidth: 90, textAlign: 'right' }}>{QB_FMT_USD(total)}</span></div>
            {depositRequired && <div style={{ display: 'flex', gap: 24, fontSize: 12, marginTop: 2 }}><span style={{ color: '#6b7280' }}>Balance due</span><span style={{ fontWeight: 700, color: '#111827', minWidth: 90, textAlign: 'right' }}>{QB_FMT_USD(balanceDue)}</span></div>}
          </div>
        </div>
      )}
      {notes && (
        <div style={{ padding: '16px 32px 20px', borderTop: '1px solid #f0eeea' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Notes & terms</div>
          <div style={{ fontSize: 12, color: '#6b7280', lineHeight: '18px', whiteSpace: 'pre-wrap' }}>{notes}</div>
        </div>
      )}
      <div style={{ padding: '16px 32px', borderTop: '1px solid #f0eeea', background: '#fafaf9', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: '#a3a3a3' }}>Thank you for your business</div>
        <div style={{ fontSize: 10, color: '#b5b5b0', marginTop: 4 }}>Apex Roofing Solutions — License #CA-ROF-28491</div>
      </div>
    </div>
  );
}

/* ─── QuotePage (4 layout variants) ─── */
function QuotePage({ onBack, quote }) {
  const isInvoice = quote?.type === 'invoice';
  const data = buildDocumentDetailData(quote);
  const documentItems = QUOTES_DATA.filter(item => item.type === (isInvoice ? 'invoice' : 'quote'));
  const currentQuoteId = quote?.id || data.id;
  const currentQuoteIndex = Math.max(0, documentItems.findIndex(item => item.id === currentQuoteId));
  const currentQuoteNumber = currentQuoteIndex + 1;
  const canGoPrevQuote = currentQuoteIndex > 0;
  const canGoNextQuote = currentQuoteIndex < documentItems.length - 1;
  const [layout, setLayout] = useState(() => localStorage.getItem('quote-builder-layout') || '1');
  const effectiveLayout = isInvoice ? '1' : layout;
  const documentLabel = isInvoice ? 'Invoice' : 'Quote';
  const documentListLabel = isInvoice ? 'Invoices' : 'Quotes';
  const documentHashPrefix = isInvoice ? 'invoice' : 'quote';
  const primaryActionLabel = isInvoice ? 'Send invoice' : 'Review & send revision';
  const ownerLabel = isInvoice ? 'Issued by' : 'Sold by';
  const [isQuoteEditing, setIsQuoteEditing] = useState(false);
  const Avatar = ({ letter, bg, color, size = 32 }) => (
    <div style={{ width: size, height: size, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 600, background: bg, color, fontSize: size > 28 ? 11 : 9 }}>{letter}</div>
  );
  const Card = ({ children }) => <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>{children}</div>;


  const [billedTo, setBilledTo] = useState('organization');
  const [orgName, setOrgName] = useState(data.organization.name);
  const [contactName, setContactName] = useState(data.customer.name);
  const [documentTitle, setDocumentTitle] = useState(data.title);
  const [quoteDate, setQuoteDate] = useState(data.quoteDate);
  const [validUntil, setValidUntil] = useState(data.validUntil);
  const [poNumber, setPoNumber] = useState('');
  const [soldByName, setSoldByName] = useState(data.soldBy || 'James Smith');
  const [vendorName, setVendorName] = useState(data.vendor?.name || 'Maven Roofing Co.');
  const [billToAddress, setBillToAddress] = useState('45 Maple Avenue, London, UK SW1A 1AA');
  const [serviceAddressName, setServiceAddressName] = useState(`${data.organization.name} — Main Bldg`);
  const [serviceAddressLine, setServiceAddressLine] = useState('88 Commerce Way, Sunnyvale, CA 94086');
  const [remarksText, setRemarksText] = useState(() => (
    isInvoice
      ? 'Invoice reflects the completed roofing scope, approved materials, site cleanup, and any change work captured in the final bill above.'
      : 'This quote includes removal of existing 2-layer shingles, full installation of new charcoal gray architectural shingles with 25-year warranty, and cleanup of all debris. Pricing valid for 30 days from issue date.'
  ));
  const [termsText, setTermsText] = useState(() => (
    isInvoice
      ? 'Payment due within 30 days of issue. Recorded deposits are applied against the balance due. Work guaranteed for 5 years from install date. Customer responsible for permits unless otherwise noted.'
      : '50% deposit required upon acceptance. Balance due upon completion. Work guaranteed for 5 years from install date. Customer responsible for permits unless otherwise noted.'
  ));
  const [customFields, setCustomFields] = useState([
    { label: 'Roof Type', value: 'Architectural Shingle' },
    { label: 'Pitch / Slope', value: '6:12' },
    { label: 'Total Squares', value: '28 sq' },
    { label: 'Existing Layers', value: '2 layers' },
    { label: 'Deck Condition', value: 'Good — no rot' },
    { label: 'Warranty Tier', value: '25-year limited' },
    { label: 'Permit Required', value: 'Yes — City of London' },
    { label: 'Ventilation Type', value: 'Ridge + Soffit' },
    { label: 'Estimated Duration', value: '3–4 days' },
  ]);
  const [depositRequired, setDepositRequired] = useState(data.deposit.required);
  const [depositType, setDepositType] = useState(data.deposit.type);
  const [depositValue, setDepositValue] = useState(String(data.deposit.value));
  const [showPrices, setShowPrices] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState(data.lineItems);
  const [expandedSections, setExpandedSections] = useState({ billed: true, details: true, deposit: true, prices: true, notes: false });
  const toggleSection = k => setExpandedSections(p => ({ ...p, [k]: !p[k] }));
  const [createOpen, setCreateOpen] = useState(false);

  const [lockedDismissed, setLockedDismissed] = useState(false);
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);
  const [customerInputPending, setCustomerInputPending] = useState(() => !isInvoice);
  const PENDING_COLOR_ITEMS = useMemo(() => new Set(['RF-101', 'FL-201', 'FL-204']), []);
  const [deposits, setDeposits] = useState([]);
  const [depositPopoverOpen, setDepositPopoverOpen] = useState(false);
  const [depositPopoverPos, setDepositPopoverPos] = useState({ top: 0, left: 0 });
  const [depositSearch, setDepositSearch] = useState('');
  const [editingDepositIdx, setEditingDepositIdx] = useState(null);
  const depositTotal = deposits.reduce((s, d) => s + d.amount, 0);
  const depositRef = useRef(null);
  const depositPopoverRef = useRef(null);
  const MOCK_QUOTES = useMemo(() => [
    { id: 'QT-1024', amount: 4225.00, date: 'Oct 3, 2025', status: 'Accepted' },
    { id: 'QT-1019', amount: 1500.00, date: 'Sep 18, 2025', status: 'Sent' },
    { id: 'QT-1015', amount: 3200.00, date: 'Sep 5, 2025', status: 'Expired' },
    { id: 'QT-1008', amount: 850.00, date: 'Aug 28, 2025', status: 'Draft' },
  ], []);
  const createRef = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (createRef.current && !createRef.current.contains(e.target)) setCreateOpen(false);
      if (
        depositRef.current &&
        !depositRef.current.contains(e.target) &&
        (!depositPopoverRef.current || !depositPopoverRef.current.contains(e.target))
      ) { setDepositPopoverOpen(false); setDepositSearch(''); setEditingDepositIdx(null); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!depositPopoverOpen) return;
    const positionPopover = () => {
      if (!depositRef.current) return;
      const rect = depositRef.current.getBoundingClientRect();
      const width = 280;
      setDepositPopoverPos({
        top: rect.bottom + 4,
        left: Math.max(12, Math.min(window.innerWidth - width - 12, rect.right - width))
      });
    };
    positionPopover();
    window.addEventListener('resize', positionPopover);
    window.addEventListener('scroll', positionPopover, true);
    return () => {
      window.removeEventListener('resize', positionPopover);
      window.removeEventListener('scroll', positionPopover, true);
    };
  }, [depositPopoverOpen]);

  const formState = { billedTo, orgName, contactName, quoteDate, validUntil, poNumber, depositRequired, depositType, depositValue, showPrices, showBreakdown, notes };
  const { subtotal, tax, total } = QB_CALC(lineItems);
  const detailDiscount = isInvoice ? 0 : subtotal * 0.05;
  const detailTotalDue = total - detailDiscount;
  const depositAmt = Number(depositValue) || 0;
  const balanceDue = total - (depositRequired ? depositAmt : 0);
  const isAccepted = data.status === 'Accepted';
  const showCustomerInputPendingPill = data.status === 'Accepted';

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 10, fontSize: 13, color: '#262626', background: '#fff', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, display: 'block' };
  const headerBar = { flexShrink: 0, background: '#fff', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', padding: '0 20px', height: 44 };
  const navigateQuoteOffset = (offset) => {
    const next = documentItems[currentQuoteIndex + offset];
    if (!next) return;
    window.location.hash = `${documentHashPrefix}/${next.id}`;
  };
  const quotePager = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: '#262626' }}>{currentQuoteNumber}/{documentItems.length}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <button
          className="btn-ghost btn-press"
          onClick={() => navigateQuoteOffset(-1)}
          disabled={!canGoPrevQuote}
          style={{ background: 'none', border: 'none', cursor: canGoPrevQuote ? 'pointer' : 'default', padding: 4, borderRadius: 6, color: canGoPrevQuote ? '#737373' : '#d1d5db', display: 'flex' }}
        >
          <ChevronUp />
        </button>
        <button
          className="btn-ghost btn-press"
          onClick={() => navigateQuoteOffset(1)}
          disabled={!canGoNextQuote}
          style={{ background: 'none', border: 'none', cursor: canGoNextQuote ? 'pointer' : 'default', padding: 4, borderRadius: 6, color: canGoNextQuote ? '#737373' : '#d1d5db', display: 'flex' }}
        >
          <ChevronDown />
        </button>
      </div>
    </div>
  );
  const quotePagerSlot = (
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
      {quotePager}
    </div>
  );

  const sectionHead = (title, key) => (
    <button className="btn-press" onClick={() => toggleSection(key)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', border: 'none', background: 'none', cursor: 'pointer', borderBottom: '1px solid #f0eeea' }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{title}</span>
      <span style={{ display: 'flex', transform: expandedSections[key] ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms cubic-bezier(0.23, 1, 0.32, 1)', color: '#9ca3af' }}><ChevronDown size={14} color="#9ca3af" /></span>
    </button>
  );
  const sectionWrap = (key, children) => (
    <div className="qp-section-wrap" data-open={expandedSections[key]}><div>{children}</div></div>
  );

  const backBtn = (
    <button className="btn-ghost btn-press" onClick={onBack} style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#737373', padding: 4, borderRadius: 6 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
    </button>
  );
  const showsPaidInvoiceBadge = isInvoice && data.status === 'Record Payment';
  const displayStatusLabel = showsPaidInvoiceBadge ? 'Paid' : data.status;
  const displayStatusBg = showsPaidInvoiceBadge ? '#16a34a' : data.statusBg;
  const displayStatusColor = showsPaidInvoiceBadge ? '#fff' : data.statusColor;
  const statusBadge = <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 999, background: displayStatusBg, color: displayStatusColor }}>{displayStatusLabel}</span>;

  const readEditInputBase = { border: '1px solid #d6d3d1', borderRadius: 8, background: '#fff', padding: '6px 10px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', boxShadow: '0 0 0 3px rgba(38,38,38,0.05)' };
  const ReadEditText = ({ value, onChange, style = {}, inputStyle = {}, displayValue, placeholder, type = 'text' }) => (
    isQuoteEditing ? (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...readEditInputBase, ...style, ...inputStyle }}
      />
    ) : (
      <span style={style}>{(displayValue ?? value) || '—'}</span>
    )
  );
  const ReadEditTextarea = ({ value, onChange, style = {}, inputStyle = {}, rows = 3, placeholder }) => (
    isQuoteEditing ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={{ ...readEditInputBase, ...style, ...inputStyle, resize: 'vertical' }}
      />
    ) : (
      <div style={style}>{value || '—'}</div>
    )
  );
  const updateCustomField = (label, value) => setCustomFields(prev => prev.map(field => field.label === label ? { ...field, value } : field));

  const onFieldChange = (field, val) => {
    if (field === 'contactName') setContactName(val);
    if (field === 'orgName') setOrgName(val);
  };

  const updateLineItem = (id, field, val) => {
    setLineItems(prev => prev.map(li => li.id === id ? { ...li, [field]: field === 'name' || field === 'desc' || field === 'unit' ? val : Number(val) || 0 } : li));
  };
  const deleteLineItem = id => setLineItems(prev => prev.filter(li => li.id !== id));
  const addLineItem = () => setLineItems(prev => [...prev, { id: Date.now(), name: 'New item', desc: '', qty: 1, unit: 'ea', rate: 0, tax: 0 }]);

  const overflowItems = [
    { label: 'Duplicate', icon: <CopyIcon /> },
    { label: 'View history', icon: <HistoryIcon /> },
    { label: `Void ${documentLabel.toLowerCase()}`, icon: <XIcon size={14} color="#737373" /> },
    { label: 'Delete', icon: <TrashIcon size={14} />, danger: true },
  ];

  /* ─── Toggle component ─── */
  const Toggle = ({ on, onToggle, size = 'normal' }) => {
    const w = size === 'small' ? 32 : 38;
    const h = size === 'small' ? 18 : 22;
    const dot = size === 'small' ? 14 : 18;
    return (
      <div onClick={onToggle} style={{ width: w, height: h, borderRadius: h / 2, background: on ? '#262626' : '#d4d4d4', transition: 'background 180ms cubic-bezier(0.23, 1, 0.32, 1)', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
        <div style={{ width: dot, height: dot, borderRadius: dot / 2, background: '#fff', position: 'absolute', top: (h - dot) / 2, left: on ? w - dot - 2 : 2, transition: 'left 180ms cubic-bezier(0.23, 1, 0.32, 1)', boxShadow: '0 1px 3px rgba(0,0,0,.15)' }} />
      </div>
    );
  };

  /* ─── Deposit section (shared) ─── */
  const DepositSection = ({ compact }) => (
    <div style={compact ? { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' } : {}}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', ...(compact ? {} : { marginBottom: 16 }) }}>
        <Toggle on={depositRequired} onToggle={() => setDepositRequired(!depositRequired)} size="small" />
        <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Require a deposit</span>
      </label>
      {depositRequired && (
        <div style={compact ? { display: 'flex', alignItems: 'center', gap: 8 } : {}}>
          <div style={{ display: 'inline-flex', borderRadius: 6, border: '1px solid #e5e5e5', overflow: 'hidden', ...(compact ? {} : { marginBottom: 12 }) }}>
            {['percentage', 'fixed'].map(v => (
              <button key={v} className="btn-press" onClick={() => setDepositType(v)} style={{ padding: '5px 14px', fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', background: depositType === v ? '#262626' : '#fff', color: depositType === v ? '#fff' : '#737373' }}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
            ))}
          </div>
          <div style={{ position: 'relative', ...(compact ? { width: 100 } : {}) }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', fontSize: 12 }}>{depositType === 'percentage' ? '%' : '$'}</span>
            <input value={depositValue} onChange={e => setDepositValue(e.target.value)} style={{ ...inputStyle, paddingLeft: 26, ...(compact ? { padding: '6px 10px 6px 26px', fontSize: 12 } : {}) }} />
          </div>
        </div>
      )}
    </div>
  );

  /* ─── Customer view toggles (shared) ─── */
  const CustomerViewToggles = ({ showPills }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[{ label: 'Line item details', desc: showPills ? undefined : 'Show individual line item prices', state: showPrices, set: setShowPrices },
        { label: 'Prices breakdown', desc: showPills ? undefined : 'Show subtotal, tax, and total', state: showBreakdown, set: setShowBreakdown }].map(t => (
        <div key={t.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{t.label}</div>
            {t.desc && <div style={{ fontSize: 11, color: '#a3a3a3', marginTop: 2 }}>{t.desc}</div>}
          </div>
          {showPills && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: t.state ? '#e1f5ee' : '#f3f4f6', color: t.state ? '#0f6e56' : '#6b7280' }}>{t.state ? 'Shown' : 'Hidden'}</span>}
          <Toggle on={t.state} onToggle={() => t.set(!t.state)} />
        </div>
      ))}
    </div>
  );

  /* ════════════════════════════════════════════════════════════
     LAYOUT 1 — Detail view with right sidebar
     ════════════════════════════════════════════════════════════ */
  const ACTIVITY_DATA = [
    { icon: '+', bg: '#eff6ff', actor: 'James Smith', action: 'created this quote', time: '2 days ago' },
    { icon: '▸', bg: '#f5f3ff', actor: 'System', action: 'sent quote to customer via email', time: '2 days ago' },
    { icon: '↗', bg: '#f0fdf4', actor: 'Telnet Industries', action: 'viewed the quote', time: '1 day ago' },
    { icon: '💬', bg: '#fefce8', actor: 'James Smith', action: 'added a note', time: '1 day ago' },
    { icon: '✓', bg: '#dcfce7', actor: 'Telnet Industries', action: 'accepted the quote', time: '5 hours ago' },
  ];
  const ATTACHMENTS_DATA = [
    { name: 'Roof_Inspection_Photos.pdf', size: '2.4 MB · Oct 2' },
    { name: 'Material_Spec_Sheet.pdf', size: '840 KB · Oct 3' },
  ];
  const RELATED_DATA = [
    { name: 'Deposit Invoice', id: 'INV-2048', amount: '$4,225.00', status: 'Paid', statusBg: '#dcfce7', statusColor: '#16a34a' },
    { name: 'Gutter Install Quote', id: 'QT-1019', amount: '$2,340.00', status: 'Sent', statusBg: '#dbeafe', statusColor: '#2563eb' },
  ];
  const NOTE_THREADS = [
    {
      id: 'note-1',
      letter: 'A',
      author: 'Admin',
      time: '2 hours ago',
      title: 'Permit follow-up',
      bg: '#dbeafe',
      color: '#2563eb',
      text: 'Customer confirmed the permit office needs the final material list before they approve the roof replacement. Send the updated shingle specification and warranty sheet with the revised quote.',
      attachments: [
        { id: 'note-1-attachment-1', name: 'revised-material-list.pdf', meta: 'PDF · 248 KB' },
        { id: 'note-1-attachment-2', name: 'charcoal-shingle-spec-sheet.pdf', meta: 'PDF · 1.1 MB' },
      ],
      replies: [
        {
          id: 'note-1-reply-1',
          letter: 'ML',
          author: 'Maya Lee',
          time: '68 min ago',
          bg: '#fef3c7',
          color: '#b45309',
          text: 'I have the warranty sheet ready. I am waiting on the final ridge cap count before sending the material list.'
        }
      ]
    },
    {
      id: 'note-2',
      letter: 'J',
      author: 'James Smith',
      time: 'Yesterday',
      title: 'Site access',
      bg: '#dcfce7',
      color: '#15803d',
      text: 'Gate code is 2481. Crew can stage materials on the left side of the driveway, but keep the garage clear because the customer needs access during the afternoon.',
      attachments: [
        { id: 'note-2-attachment-1', name: 'site-access-photo.jpg', meta: 'Image · 642 KB' },
      ],
      replies: [
        {
          id: 'note-2-reply-1',
          letter: 'RG',
          author: 'Raghav Gurumani',
          time: 'Yesterday',
          bg: '#dbeafe',
          color: '#1d4ed8',
          text: 'Logged for the crew. I also added a note to keep the driveway clear after lunch.'
        },
      ]
    },
    {
      id: 'note-3',
      letter: 'M',
      author: 'Maya Lee',
      time: 'Apr 30',
      title: 'Material preference',
      bg: '#fef3c7',
      color: '#b45309',
      text: 'Customer prefers charcoal shingles and asked us to avoid a glossy finish. They are open to the Owens Corning option if pricing stays close to the original quote.',
      attachments: [
        { id: 'note-3-attachment-1', name: 'owens-corning-options.pdf', meta: 'PDF · 786 KB' },
        { id: 'note-3-attachment-2', name: 'color-board-charcoal.png', meta: 'Image · 2.3 MB' },
      ],
      replies: []
    }
  ];
  const [threadNotes, setThreadNotes] = useState(() => NOTE_THREADS);
  const [replyingToNoteId, setReplyingToNoteId] = useState(null);
  const [collapsedNoteIds, setCollapsedNoteIds] = useState({});
  const [replyDrafts, setReplyDrafts] = useState({});
  const toggleCollapsedNote = noteId => {
    setCollapsedNoteIds(prev => ({ ...prev, [noteId]: !prev[noteId] }));
    setReplyingToNoteId(prev => prev === noteId ? null : prev);
  };
  const toggleReplyComposer = noteId => {
    setCollapsedNoteIds(prev => ({ ...prev, [noteId]: false }));
    setReplyingToNoteId(prev => prev === noteId ? null : noteId);
  };
  const submitThreadReply = noteId => {
    const text = (replyDrafts[noteId] || '').trim();
    if (!text) return;
    setThreadNotes(prev => prev.map(note => {
      if (note.id !== noteId) return note;
      return {
        ...note,
        replies: [
          ...note.replies,
          {
            id: `${noteId}-reply-${note.replies.length + 1}`,
            letter: 'YU',
            author: 'You',
            time: 'Just now',
            bg: '#ede9fe',
            color: '#6d28d9',
            text,
          }
        ]
      };
    }));
    setReplyDrafts(prev => ({ ...prev, [noteId]: '' }));
    setReplyingToNoteId(null);
  };

  const activityUsers = {
    trevor: { letter: 'TA', bg: '#fde6d8', color: '#b45309' },
    raghav: { letter: 'RG', bg: '#dbeafe', color: '#1d4ed8' },
  };
  const activityFeed = [
    {
      id: 'act-1',
      marker: { type: 'user', user: 'trevor' },
      time: '05:54 PM',
      parts: [
        { type: 'actor', text: 'Trevor Alan' },
        { type: 'text', text: ' from PineOak accepted ' },
        { type: 'emphasis', text: 'job album link test' },
      ],
    },
    {
      id: 'act-2',
      marker: { type: 'user', user: 'raghav' },
      time: '05:54 PM',
      parts: [
        { type: 'actor', text: 'Raghav Gurumani' },
        { type: 'text', text: ' assigned Trevor Alan from PineOak to ' },
        { type: 'emphasis', text: 'job album link test' },
      ],
    },
    {
      id: 'act-3',
      marker: { type: 'user', user: 'raghav' },
      time: '05:54 PM',
      parts: [
        { type: 'actor', text: 'Raghav Gurumani' },
        { type: 'text', text: ' added a Labor item ' },
        { type: 'quoted', text: '"Trevor Alan"' },
        { type: 'text', text: ' by assignment' },
      ],
    },
    {
      id: 'act-4',
      marker: { type: 'workflow' },
      time: '05:42 PM',
      parts: [
        { type: 'workflow', text: 'Workflow Inspection Form Submission → Update Job Custom Fields' },
        { type: 'text', text: ' was triggered' },
      ],
    },
    {
      id: 'act-5',
      marker: { type: 'user', user: 'raghav' },
      time: '05:41 PM',
      parts: [
        { type: 'actor', text: 'Raghav Gurumani' },
        { type: 'text', text: ' assigned user Raghav Gurumani from Beta team to the service task ' },
        { type: 'emphasis', text: 'album link test' },
      ],
    },
    {
      id: 'act-6',
      marker: { type: 'workflow' },
      time: '05:41 PM',
      parts: [
        { type: 'workflow', text: 'Workflow Inspection Form Submission → Update Job Custom Fields' },
        { type: 'text', text: ' was triggered' },
      ],
    },
    {
      id: 'act-7',
      marker: { type: 'workflow' },
      time: '05:41 PM',
      parts: [
        { type: 'workflow', text: 'Workflow Workflow-03-March-2026-18-48-07' },
        { type: 'text', text: ' was triggered' },
      ],
    },
    {
      id: 'act-8',
      marker: { type: 'status' },
      time: '05:41 PM',
      parts: [
        { type: 'actor', text: 'Raghav Gurumani' },
        { type: 'text', text: ' updated status from ' },
        { type: 'chip', text: 'New' },
        { type: 'text', text: ' to ' },
        { type: 'chip', text: 'New' },
        { type: 'text', text: ' in Job' },
      ],
    },
    {
      id: 'act-9',
      marker: { type: 'workflow' },
      time: '05:40 PM',
      parts: [
        { type: 'workflow', text: 'Workflow Test event' },
        { type: 'text', text: ' was triggered' },
      ],
    },
    {
      id: 'act-10',
      marker: { type: 'workflow' },
      time: '05:40 PM',
      parts: [
        { type: 'workflow', text: 'Workflow Workflow-13-January-2026-12-42-59' },
        { type: 'text', text: ' was triggered' },
      ],
    },
    {
      id: 'act-11',
      marker: { type: 'workflow' },
      time: '05:40 PM',
      parts: [
        { type: 'workflow', text: 'Workflow Workflow-03-March-2026-18-48-07' },
        { type: 'text', text: ' was triggered' },
      ],
    },
    {
      id: 'act-12',
      marker: { type: 'user', user: 'raghav' },
      time: '05:40 PM',
      parts: [
        { type: 'actor', text: 'Raghav Gurumani' },
        { type: 'text', text: ' assigned Team Team S to ' },
        { type: 'emphasis', text: 'album link test' },
        { type: 'text', text: ' via workflow Assign Team' },
      ],
    },
    {
      id: 'act-13',
      marker: { type: 'workflow' },
      time: '05:40 PM',
      parts: [
        { type: 'workflow', text: 'Workflow Test' },
        { type: 'text', text: ' was triggered' },
      ],
    },
    {
      id: 'act-14',
      marker: { type: 'user', user: 'raghav' },
      time: '05:40 PM',
      parts: [
        { type: 'actor', text: 'Raghav Gurumani' },
        { type: 'text', text: ' added a Labor item ' },
        { type: 'quoted', text: '"Raghav Gurumani"' },
        { type: 'text', text: ' by assignment' },
      ],
    },
    {
      id: 'act-15',
      marker: { type: 'status' },
      time: '05:40 PM',
      parts: [
        { type: 'actor', text: 'Raghav Gurumani' },
        { type: 'text', text: ' updated status to ' },
        { type: 'chip', text: 'New' },
        { type: 'text', text: ' in Job' },
      ],
    },
    {
      id: 'act-16',
      marker: { type: 'user', user: 'raghav' },
      time: '05:40 PM',
      parts: [
        { type: 'actor', text: 'Raghav Gurumani' },
        { type: 'text', text: ' created new ' },
        { type: 'emphasis', text: 'job album link test' },
      ],
    },
  ];
  const activityFilterButtonStyle = {
    height: 28,
    borderRadius: 999,
    border: '1px solid #d7dee8',
    background: '#fff',
    padding: '0 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    fontSize: 11,
    fontWeight: 500,
    color: '#64748b',
    cursor: 'pointer',
    boxSizing: 'border-box',
    flexShrink: 0,
  };
  const activityIconButtonStyle = {
    width: 28,
    height: 28,
    borderRadius: 999,
    border: '1px solid #d7dee8',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
    boxSizing: 'border-box',
    flexShrink: 0,
  };
  const renderActivityText = (parts) => (
    <span style={{ fontSize: 12, lineHeight: '20px', color: '#64748b' }}>
      {parts.map((part, idx) => {
        if (part.type === 'actor') return <span key={idx} style={{ fontWeight: 700, color: '#1f2937' }}>{part.text}</span>;
        if (part.type === 'emphasis') return <span key={idx} style={{ fontWeight: 600, color: '#334155' }}>{part.text}</span>;
        if (part.type === 'workflow') return <span key={idx} style={{ fontWeight: 700, color: '#334155' }}>{part.text}</span>;
        if (part.type === 'quoted') return <span key={idx} style={{ fontWeight: 500, color: '#475569' }}>{part.text}</span>;
        if (part.type === 'chip') return <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', margin: '0 2px', borderRadius: 10, background: '#fde8e1', color: '#e1603d', fontSize: 11, fontWeight: 600 }}>{part.text}</span>;
        return <span key={idx}>{part.text}</span>;
      })}
    </span>
  );
  const renderActivityMarker = (event) => {
    if (event.marker.type === 'user') {
      const user = activityUsers[event.marker.user];
      return <Avatar letter={user.letter} bg={user.bg} color={user.color} size={28} />;
    }
    const icon = event.marker.type === 'status' ? <StatusArrowIcon size={14} color="#667085" /> : <WorkflowGraphIcon size={14} color="#667085" />;
    return (
      <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #d7dee8', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
    );
  };
  const ActivityFilterButton = ({ label }) => (
    <button className="btn-press" style={activityFilterButtonStyle}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      <ChevronDown size={12} color="#94a3b8" />
    </button>
  );
  const ActivityIconButton = ({ label, children }) => (
    <button className="btn-press" aria-label={label} title={label} style={activityIconButtonStyle}>
      {children}
    </button>
  );

  const [assocSections, setAssocSections] = useState({ org: true, customer: true, job: true, materials: true, purchaseOrders: true, contract: true, workflow: true });
  const toggleAssocSection = key => setAssocSections(p => ({ ...p, [key]: !p[key] }));
  const [assocTab, setAssocTab] = useState('assoc');

  const [l4Sections, setL4Sections] = useState({ customer: true, jobs: true, attachments: true, related: true });

  const renderLayout1 = () => (
    <div className="quote-page-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#f5f4f0' }}>
      {/* Breadcrumb bar — full width */}
      <div style={{ ...headerBar, justifyContent: 'space-between', gap: 12, padding: '0 24px', borderBottom: '1px solid #e5e5e5', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          {backBtn}
          <span style={{ color: '#a3a3a3' }}>›</span>
          <span style={{ fontWeight: 400, color: '#737373' }}>Jobs</span>
          <span style={{ color: '#a3a3a3' }}>/</span>
          <span style={{ fontWeight: 400, color: '#737373' }}>#JN-245</span>
          <span style={{ color: '#a3a3a3' }}>/</span>
          <span style={{ fontWeight: 400, color: '#737373' }}>{documentListLabel}</span>
          <span style={{ color: '#a3a3a3' }}>/</span>
          <span style={{ fontWeight: 500, color: '#262626' }}>{data.id}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isInvoice && (
            <button
              className="btn-press btn-ghost"
              onClick={() => setIsQuoteEditing(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e5e5', background: isQuoteEditing ? '#f5f4f0' : '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#374151' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              {isQuoteEditing ? 'Done editing' : 'Edit quote'}
            </button>
          )}
          <button className="btn-press btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#374151' }}>
            <PrinterIcon /> Print
          </button>
          <button className="btn-press btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#374151' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            PDF
          </button>
          <button className="btn-press" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#292929', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#fff' }}>
            <SendIcon size={13} color="#fff" /> {primaryActionLabel}
          </button>
          <OverflowMenu items={overflowItems} bordered={true} align="right" />
        </div>
      </div>

      {/* Body: canvas + associations pane */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Status timeline bar — fixed above scroll region */}
          <div style={{ flexShrink: 0, background: '#fff', borderBottom: '1px solid #e5e5e5' }}>
            <QuoteStatusTimeline
              timeline={data.statusTimeline}
              activeStage={isInvoice ? data.status : null}
              optionalStatuses={isInvoice ? ['Archived', 'Cancelled'] : ['Archived', 'Closed', 'Cancelled']}
              onAccepted={isInvoice ? undefined : () => setCustomerInputPending(true)}
            />
          </div>
          {/* Scrollable canvas */}
          <div style={{ flex: 1, overflowY: 'auto', background: '#f5f4f0' }}>
            <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '24px 40px 60px', boxSizing: 'border-box' }}>
            <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position: 'relative', overflow: 'clip' }}>

              {/* Quote title + status pills */}
              <div style={{ padding: '24px 28px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 6, background: '#f3f4f6', fontSize: 12, fontWeight: 500, color: '#6b7280' }}>{data.id}</span>
                  {isInvoice ? statusBadge : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 6, background: showCustomerInputPendingPill ? '#DBEAFE' : '#FEF3C7', fontSize: 12, fontWeight: 500, color: showCustomerInputPendingPill ? '#1e40af' : '#92400e' }}>
                      {showCustomerInputPendingPill ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      )}
                      {showCustomerInputPendingPill ? 'Customer Input Pending' : 'Customer requested Changes'}
                    </span>
                  )}
                </div>
                <ReadEditText value={documentTitle} onChange={setDocumentTitle} style={{ fontSize: 22, fontWeight: 500, color: '#111827', letterSpacing: '-0.3px', marginBottom: 4, display: 'block' }} inputStyle={{ width: '100%', maxWidth: 460 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                  <ReadEditText value={orgName} onChange={setOrgName} style={{ fontSize: 13, color: '#6b7280' }} inputStyle={{ minWidth: 180 }} />
                  <span>· Estimate Date</span>
                  <ReadEditText value={quoteDate} onChange={setQuoteDate} type="date" displayValue={QB_FMT_DATE_SHORT(quoteDate)} style={{ fontSize: 13, color: '#6b7280' }} inputStyle={{ minWidth: 148 }} />
                  <span>· Expiry Date</span>
                  <ReadEditText value={validUntil} onChange={setValidUntil} type="date" displayValue={QB_FMT_DATE_SHORT(validUntil)} style={{ fontSize: 13, color: '#6b7280' }} inputStyle={{ minWidth: 148 }} />
                  <span>· Net 30</span>
                </div>
              </div>

              {/* Total + Sold By */}
              <div style={{ display: 'flex', gap: 0, borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', background: '#fafaf8' }}>
                <div style={{ flex: 1, padding: '14px 24px', borderRight: '1px solid #e5e5e5' }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Total</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 24, fontWeight: 500, color: '#111827', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px' }}>{QB_FMT_USD(detailTotalDue)}</span>
                    <span style={{ fontSize: 13, fontWeight: 400, color: '#9ca3af' }}>USD</span>
                  </div>
                </div>
                <div style={{ flex: 1, padding: '14px 24px' }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{ownerLabel}</div>
                  <ReadEditText value={soldByName} onChange={setSoldByName} style={{ fontSize: 13, color: '#262626', display: 'block' }} inputStyle={{ width: '100%', maxWidth: 200 }} />
                  <ReadEditText value={vendorName} onChange={setVendorName} style={{ fontSize: 13, color: '#6b7280', display: 'block', marginTop: 2 }} inputStyle={{ width: '100%', maxWidth: 240 }} />
                </div>
              </div>

              {/* Bill-to / Service-address grid */}
              <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e5e5e5' }}>
                <div style={{ flex: 1, padding: '14px 24px', borderRight: '1px solid #e5e5e5' }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Bill to</div>
                  <ReadEditText value={orgName} onChange={setOrgName} style={{ fontSize: 13, color: '#262626', display: 'block' }} inputStyle={{ width: '100%', maxWidth: 220 }} />
                  <ReadEditTextarea value={billToAddress} onChange={setBillToAddress} rows={2} style={{ fontSize: 13, color: '#6b7280', lineHeight: '19px', whiteSpace: 'pre-wrap' }} inputStyle={{ width: '100%', minHeight: 52, marginTop: 4 }} />
                </div>
                <div style={{ flex: 1, padding: '14px 24px' }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Service address</div>
                  <ReadEditText value={serviceAddressName} onChange={setServiceAddressName} style={{ fontSize: 13, color: '#262626', display: 'block' }} inputStyle={{ width: '100%', maxWidth: 260 }} />
                  <ReadEditTextarea value={serviceAddressLine} onChange={setServiceAddressLine} rows={2} style={{ fontSize: 13, color: '#6b7280', lineHeight: '19px', whiteSpace: 'pre-wrap' }} inputStyle={{ width: '100%', minHeight: 52, marginTop: 4 }} />
                </div>
              </div>

              {/* Line items */}
              <App
                embedded
                embeddedTopBorder={false}
                pendingColorItems={isInvoice ? null : (customerInputPending ? PENDING_COLOR_ITEMS : null)}
                hideEmbeddedProfitStrip={isInvoice}
                embeddedEditMode={isQuoteEditing && !isInvoice}
                embeddedFooterBefore={(
                  <>
                    {/* Total breakdown */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid #e5e5e5' }}>
                      <div style={{ width: 260 }}>
                        {[
                          { label: 'Subtotal', value: QB_FMT_USD(subtotal) },
                          { label: 'Tax (8.5%)', value: QB_FMT_USD(tax) },
                          ...(!isInvoice ? [{ label: 'Discount', value: `−${QB_FMT_USD(detailDiscount)}` }] : []),
                        ].map(r => (
                          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
                            <span style={{ color: '#6b7280' }}>{r.label}</span>
                            <span style={{ fontWeight: 500, color: '#262626', fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
                          </div>
                        ))}
                        <div style={{ height: 1, background: '#e5e5e5', margin: '5px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', alignItems: 'baseline' }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>Total due</span>
                          <span style={{ fontSize: 16, fontWeight: 500, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>{QB_FMT_USD(detailTotalDue)}</span>
                        </div>
                        {isInvoice && deposits.map((dep, di) => (
                          <div key={di} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', fontSize: 12 }}>
                            <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                              Deposit{dep.invoiceId ? ` (${dep.invoiceId})` : ''}
                              <button onClick={() => setDeposits(prev => prev.filter((_, i) => i !== di))} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#d1d5db', display: 'inline-flex', lineHeight: 1 }} title="Remove">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </span>
                            {editingDepositIdx === di ? (
                              <input autoFocus defaultValue={dep.amount} onBlur={e => { const v = parseFloat(e.target.value.replace(/^\$/, '')) || 0; setDeposits(prev => prev.map((d, i) => i === di ? { ...d, amount: v } : d)); setEditingDepositIdx(null); }} onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setEditingDepositIdx(null); }} style={{ width: 80, border: 'none', borderBottom: '1px solid #3b82f6', outline: 'none', fontSize: 12, fontWeight: 500, color: '#262626', textAlign: 'right', fontVariantNumeric: 'tabular-nums', padding: '1px 0', fontFamily: 'inherit', background: 'transparent' }} />
                            ) : (
                              <span onClick={() => setEditingDepositIdx(di)} style={{ fontWeight: 500, color: '#262626', fontVariantNumeric: 'tabular-nums', cursor: 'pointer', borderBottom: '1px dashed transparent' }} className="deposit-editable">−{QB_FMT_USD(dep.amount)}</span>
                            )}
                          </div>
                        ))}
                        {isInvoice && deposits.length > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 12 }}>
                            <span style={{ color: '#6b7280' }}>Balance</span>
                            <span style={{ fontWeight: 500, color: '#262626', fontVariantNumeric: 'tabular-nums' }}>{QB_FMT_USD(detailTotalDue - depositTotal)}</span>
                          </div>
                        )}
                        {isInvoice && (
                          <div style={{ position: 'relative', padding: '3px 0' }} ref={depositRef}>
                            <div style={{ display: 'flex', justifyContent: deposits.length ? 'flex-end' : 'space-between', fontSize: 12 }}>
                              {!deposits.length && <span style={{ color: '#6b7280' }}>Deposit</span>}
                              {(detailTotalDue - depositTotal > 0 || !deposits.length) && (
                                <button onClick={() => { setDepositPopoverOpen(!depositPopoverOpen); setDepositSearch(''); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#3b82f6', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                  {deposits.length ? 'Add another' : 'Collect Deposit'}
                                </button>
                              )}
                            </div>
                            {depositPopoverOpen && (
                              ReactDOM.createPortal(<div ref={depositPopoverRef} className="dropdown-enter" style={{ position: 'fixed', left: depositPopoverPos.left, top: depositPopoverPos.top, zIndex: 1300, background: '#fff', borderRadius: 10, border: '1px solid #e5e5e5', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', width: 280, overflow: 'hidden' }}>
                                <div style={{ padding: '10px 12px', borderBottom: '1px solid #f0eeea' }}>
                                  <input autoFocus value={depositSearch} onChange={e => setDepositSearch(e.target.value)} placeholder="Search quote or enter amount…" style={{ width: '100%', border: 'none', outline: 'none', fontSize: 13, color: '#262626', background: 'transparent', fontFamily: 'inherit', padding: '4px 0', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ maxHeight: 200, overflowY: 'auto', padding: '4px 0' }}>
                                  {(() => {
                                    const q = depositSearch.trim().replace(/^\$/, '');
                                    const isNum = /^\d+(\.\d*)?$/.test(q) && q.length > 0;
                                    const usedIds = new Set(deposits.map(d => d.invoiceId));
                                    const available = MOCK_QUOTES.filter(quote => !usedIds.has(quote.id));
                                    const quoteMatches = q ? available.filter(quote => quote.id.toLowerCase().startsWith(depositSearch.trim().toLowerCase())) : available;
                                    return (
                                      <>
                                        {quoteMatches.map(quote => (
                                          <button key={quote.id} className="deposit-option" onClick={() => { setDeposits(prev => [...prev, { invoiceId: quote.id, amount: quote.amount }]); setDepositPopoverOpen(false); setDepositSearch(''); }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, textAlign: 'left', fontFamily: 'inherit', borderRadius: 0 }}>
                                            <div>
                                              <div style={{ fontWeight: 500, color: '#262626' }}>{quote.id}</div>
                                              <div style={{ color: '#9ca3af', fontSize: 11 }}>{quote.date} · {quote.status}</div>
                                            </div>
                                            <span style={{ fontWeight: 500, color: '#262626', fontVariantNumeric: 'tabular-nums' }}>{QB_FMT_USD(quote.amount)}</span>
                                          </button>
                                        ))}
                                        {isNum && (
                                          <button className="deposit-option" onClick={() => { setDeposits(prev => [...prev, { invoiceId: null, amount: parseFloat(q) }]); setDepositPopoverOpen(false); setDepositSearch(''); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: 'none', borderTop: quoteMatches.length ? '1px solid #f0eeea' : 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#3b82f6', textAlign: 'left', fontFamily: 'inherit', borderRadius: 0 }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                            Add deposit ${q}
                                          </button>
                                        )}
                                        {!quoteMatches.length && !isNum && q && (
                                          <div style={{ padding: '12px', fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>No quotes found</div>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>, document.body)
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes & terms */}
                    <div style={{ display: 'flex', gap: 0, borderTop: '1px solid #e5e5e5' }}>
                      <div style={{ flex: 1, padding: '14px 24px', borderRight: '1px solid #e5e5e5' }}>
                        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Remarks</div>
                        <ReadEditTextarea value={remarksText} onChange={setRemarksText} rows={4} style={{ fontSize: 12, color: '#374151', lineHeight: '20px', whiteSpace: 'pre-wrap' }} inputStyle={{ width: '100%', minHeight: 88 }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 24px' }}>
                        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Terms & conditions</div>
                        <ReadEditTextarea value={termsText} onChange={setTermsText} rows={4} style={{ fontSize: 12, color: '#374151', lineHeight: '20px', whiteSpace: 'pre-wrap' }} inputStyle={{ width: '100%', minHeight: 88 }} />
                      </div>
                    </div>

                    {/* Signatures */}
                    <div style={{ display: 'flex', gap: 32, padding: '20px 24px 28px', borderTop: '1px solid #e5e5e5' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.8px', marginBottom: 6 }}>AUTHORIZED SIGNATURE</div>
                        <div style={{ borderBottom: '1px solid #d1d5db', paddingBottom: 8, marginBottom: 4 }}>
                          <ReadEditText value={soldByName} onChange={setSoldByName} style={{ fontSize: 16, fontWeight: 500, color: '#374151', fontFamily: '"Segoe Script","Bradley Hand",cursive' }} inputStyle={{ width: '100%', maxWidth: 220, fontSize: 14 }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 11, color: '#9ca3af' }}>
                          <ReadEditText value={soldByName} onChange={setSoldByName} style={{ fontSize: 11, color: '#9ca3af' }} inputStyle={{ minWidth: 120 }} />
                          <span>·</span>
                          <ReadEditText value={vendorName} onChange={setVendorName} style={{ fontSize: 11, color: '#9ca3af' }} inputStyle={{ minWidth: 150 }} />
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.8px', marginBottom: 6 }}>{isInvoice ? 'PAYMENT STATUS' : 'CUSTOMER ACCEPTANCE'}</div>
                        <div style={{ border: isInvoice ? '1px solid #e5e5e5' : '1px dashed #d1d5db', borderRadius: 8, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4, background: isInvoice ? '#fafaf8' : '#fff' }}>
                          {isInvoice ? (
                            <span style={{ fontSize: 13, fontWeight: 600, color: showsPaidInvoiceBadge ? '#16a34a' : data.statusColor }}>{displayStatusLabel}</span>
                          ) : (
                            <span style={{ fontSize: 16, fontWeight: 500, color: '#16a34a', fontFamily: '"Segoe Script","Bradley Hand",cursive' }}>R. Mathew</span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{isInvoice ? `Issued ${QB_FMT_DATE_SHORT(data.quoteDate)}` : 'Signed Oct 5, 2025'}</div>
                      </div>
                    </div>
                  </>
                )}
              />
            </div>

            {/* Custom fields card */}
            <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginTop: 16, padding: '20px 24px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 14 }}>Custom Fields</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px 20px' }}>
                {customFields.map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{f.label}</div>
                    <ReadEditText value={f.value} onChange={value => updateCustomField(f.label, value)} style={{ fontSize: 13, color: '#262626', fontWeight: 500, display: 'block' }} inputStyle={{ width: '100%' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        </div>{/* /canvas column */}

        {/* Right sidebar — associations / notes / activity */}
      <div style={{ flexShrink: 0, background: '#fff', borderLeft: '1px solid #e5e5e5', display: 'flex', height: '100%' }}>
       <div style={{ width: 340, display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid #e5e5e5' }}>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: '8px 16px 10px', minHeight: 28, boxSizing: 'content-box', borderBottom: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#262626' }}>
            {assocTab === 'assoc' && 'Associations'}
            {assocTab === 'notes' && 'Notes'}
            {assocTab === 'activity' && 'Activity History'}
          </span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {assocTab === 'assoc' && (
            <>
              <AssocSection title="Organization" open={assocSections.org} onToggle={() => toggleAssocSection('org')}>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 600, background: '#f3f4f6', color: '#6b7280', fontSize: 12 }}>{data.organization.name.charAt(0)}</div>
                    <span style={{ fontSize: 13, color: '#262626', fontWeight: 500 }}>{data.organization.name}</span>
                  </div>
                  <AssocRow icon={<UserOutlineIcon />} text="2 Customers" />
                  <AssocRow icon={<MapPin size={13} color="#9ca3af" />} text="45 Maple Avenue, London, UK SW1A 1AA" />
                </div>
              </AssocSection>
              <AssocSection title="Customer" open={assocSections.customer} onToggle={() => toggleAssocSection('customer')}>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 600, background: '#f3f4f6', color: '#6b7280', fontSize: 12 }}>{data.organization.name.charAt(0)}</div>
                    <span style={{ fontSize: 13, color: '#262626', fontWeight: 500, flex: 1 }}>{data.organization.name}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 7px', border: '1px solid #e5e7eb', borderRadius: 10 }}>
                      <CommentBadgeIcon /><span style={{ fontSize: 11, color: '#6b7280' }}>{threadNotes.length}</span>
                    </span>
                  </div>
                  <AssocRow icon={<BuildingIcon size={13} color="#9ca3af" />} text="45 Maple Avenue, London" />
                  <AssocRow icon={<HierarchyIcon />} text="Net 30 · Commercial" />
                  <AssocRow icon={<DollarBadgeIcon />} text="Credits: $285.00" />
                  <AssocRow icon={<ReceiptIcon />} text="Receivables: $3,904.00" />
                </div>
              </AssocSection>
              <AssocSection title="Job" open={assocSections.job} onToggle={() => toggleAssocSection('job')}>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: '#f59e0b', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#262626' }}>Roof Inspection & Repair</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>#JOB-1042</div>
                    </div>
                    <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600, color: '#16a34a', background: '#dcfce7' }}>In Progress</span>
                  </div>
                  <AssocRow icon={<CalendarIcon size={13} color="#9ca3af" />} text="Due 14 May 2026" />
                  <AssocRow icon={<MapPin size={13} color="#9ca3af" />} text="88 Commerce Way, Sunnyvale, CA" />
                </div>
              </AssocSection>
              <AssocSection title="Material Requests" open={assocSections.materials} onToggle={() => toggleAssocSection('materials')}>
                <AssocEmpty text="No Material Requests" />
              </AssocSection>
              <AssocSection title="Purchase Orders" open={assocSections.purchaseOrders} onToggle={() => toggleAssocSection('purchaseOrders')}>
                <AssocEmpty text="No Purchase Orders" />
              </AssocSection>
              <AssocSection title="Contract" open={assocSections.contract} onToggle={() => toggleAssocSection('contract')}>
                <AssocEmpty text="No Contract Associated" />
              </AssocSection>
              <AssocSection title="Workflow Activity" open={assocSections.workflow} onToggle={() => toggleAssocSection('workflow')}>
                <AssocEmpty text="No Workflow Activity" />
              </AssocSection>
            </>
          )}
          {assocTab === 'notes' && (
            <div style={{ padding: '0 0 14px', display: 'flex', flexDirection: 'column' }}>
              {threadNotes.map((note, index) => {
                const isCollapsed = !!collapsedNoteIds[note.id];
                const isReplying = replyingToNoteId === note.id;
                const showThread = !isCollapsed && (note.replies.length > 0 || isReplying);
                const threadBranchCount = note.replies.length + (isReplying ? 1 : 0);
                return (
                  <div key={note.id} style={{ borderTop: index === 0 ? 'none' : '1px solid #ece7dd', borderBottom: '1px solid #ece7dd', marginTop: index === 0 ? 0 : -1 }}>
                    <div style={{ padding: '14px 16px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%' }}>
                        <Avatar letter={note.letter} bg={note.bg} color={note.color} size={24} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontSize: 12, fontWeight: 650, color: '#262626' }}>{note.author}</div>
                                  <div style={{ fontSize: 11, fontWeight: 600, color: '#8c8b86', marginTop: 2 }}>{note.title}</div>
                                </div>
                                <span style={{ fontSize: 10, color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }}>{note.time}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn-press"
                              onClick={() => toggleCollapsedNote(note.id)}
                              aria-label={isCollapsed ? `Expand ${note.title}` : `Collapse ${note.title}`}
                              style={{ width: 24, height: 24, borderRadius: 999, border: '1px solid #e7e1d6', background: '#fff', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: '#a8a29e' }}
                            >
                              <span style={{ display: 'flex', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}>
                                <ChevronDown size={12} color="#a8a29e" />
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                      {!isCollapsed && <p style={{ margin: 0, fontSize: 12, lineHeight: '19px', color: '#475569', whiteSpace: 'pre-wrap' }}>{note.text}</p>}
                      {!isCollapsed && note.attachments?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {note.attachments.map(file => (
                            <div key={file.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, maxWidth: '100%', padding: '5px 8px', border: '1px solid #ece7dd', borderRadius: 999, background: '#fcfbf8', minWidth: 0 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                              <span style={{ minWidth: 0, fontSize: 10.5, fontWeight: 500, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                              <span style={{ flexShrink: 0, fontSize: 10, color: '#9ca3af' }}>{file.meta}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: note.replies.length ? 'space-between' : 'flex-end', gap: 8 }}>
                        {note.replies.length > 0 && (
                          <span style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {`${note.replies.length} repl${note.replies.length === 1 ? 'y' : 'ies'}`}
                          </span>
                        )}
                        <button
                          type="button"
                          className="btn-press"
                          onClick={() => toggleReplyComposer(note.id)}
                          style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#7c5a21' }}
                        >
                          {isReplying ? 'Hide reply' : 'Reply'}
                        </button>
                      </div>
                    </div>
                    {showThread && (
                      <div style={{ padding: '0 16px 12px 16px' }}>
                        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 18 }}>
                          {threadBranchCount > 0 && <span style={{ position: 'absolute', left: 6, top: 0, width: 1.5, height: 10, background: '#e7ddce' }} />}
                          {note.replies.map((reply, replyIndex) => (
                            <div key={reply.id} style={{ position: 'relative', display: 'flex', gap: 8 }}>
                              {replyIndex > 0 && <span style={{ position: 'absolute', left: -12, top: -12, width: 1.5, height: 22, background: '#e7ddce' }} />}
                              <span style={{ position: 'absolute', left: -12, top: 10, width: 10, height: 12, borderLeft: '1.5px solid #e7ddce', borderBottom: '1.5px solid #e7ddce' }} />
                              <Avatar letter={reply.letter} bg={reply.bg} color={reply.color} size={18} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>{reply.author}</span>
                                  <span style={{ fontSize: 10, color: '#9ca3af' }}>{reply.time}</span>
                                </div>
                                <p style={{ margin: '4px 0 0', fontSize: 11, lineHeight: '17px', color: '#64748b', whiteSpace: 'pre-wrap' }}>{reply.text}</p>
                              </div>
                            </div>
                          ))}
                          {isReplying && (
                            <div style={{ position: 'relative' }}>
                              {note.replies.length > 0 && <span style={{ position: 'absolute', left: -12, top: -12, width: 1.5, height: 22, background: '#e7ddce' }} />}
                              <span style={{ position: 'absolute', left: -12, top: 10, width: 10, height: 12, borderLeft: '1.5px solid #e7ddce', borderBottom: '1.5px solid #e7ddce' }} />
                              <textarea
                                value={replyDrafts[note.id] || ''}
                                onChange={e => setReplyDrafts(prev => ({ ...prev, [note.id]: e.target.value }))}
                                placeholder={`Reply to ${note.author}...`}
                                rows={3}
                                style={{ width: '100%', border: '1px solid #e7e1d6', borderRadius: 10, padding: '9px 10px', fontSize: 12, lineHeight: '18px', color: '#374151', background: '#fff', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                              />
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                                <button
                                  type="button"
                                  className="btn-press"
                                  onClick={() => {
                                    setReplyDrafts(prev => ({ ...prev, [note.id]: '' }));
                                    setReplyingToNoteId(null);
                                  }}
                                  style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 500, color: '#6b7280' }}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="btn-press"
                                  onClick={() => submitThreadReply(note.id)}
                                  style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: '#262626', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#fff' }}
                                >
                                  Post reply
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {assocTab === 'activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
              <div style={{ position: 'sticky', top: 0, zIndex: 2, background: '#fff', padding: '10px 16px 8px', borderBottom: '1px solid #eef2f7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <ActivityFilterButton label="Activity type" />
                  <ActivityFilterButton label="Users" />
                  <ActivityIconButton label="Select date range">
                    <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CalendarIcon size={13} />
                    </span>
                  </ActivityIconButton>
                </div>
              </div>
              <div style={{ padding: '14px 16px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Today</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {activityFeed.map((event, index) => (
                    <div key={event.id} style={{ display: 'grid', gridTemplateColumns: '34px 1fr', columnGap: 12 }}>
                      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                        {index < activityFeed.length - 1 && <span style={{ position: 'absolute', top: 30, bottom: -2, width: 1, background: '#e7edf5' }} />}
                        <div style={{ marginTop: 2 }}>{renderActivityMarker(event)}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingBottom: index < activityFeed.length - 1 ? 18 : 4 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {renderActivityText(event.parts)}
                        </div>
                        <span style={{ flexShrink: 0, paddingTop: 1, fontSize: 11, fontWeight: 500, color: '#94a3b8', whiteSpace: 'nowrap' }}>{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
       </div>
       {/* Icon rail */}
       <div style={{ width: 46, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12, gap: 2, flexShrink: 0 }}>
         {[
           { id: 'assoc', label: 'Associations', Icon: LinkIcon },
           { id: 'activity', label: 'Activity History', Icon: ClockIcon },
           { id: 'notes', label: 'Notes', Icon: FileTextIcon },
         ].map(t => (
           <button key={t.id} onClick={() => setAssocTab(t.id)} title={t.label} className="btn-press" style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: assocTab === t.id ? '#e4d9c8' : 'transparent', transition: 'background 120ms ease' }}>
             <t.Icon size={16} color={assocTab === t.id ? '#5c4a1e' : '#a3a3a3'} />
           </button>
         ))}
       </div>
      </div>
      </div>{/* /body flex-row */}
    </div>
  );

  /* ════════════════════════════════════════════════════════════
     LAYOUT 2 — Inline-edit document (proposal style)
     ════════════════════════════════════════════════════════════ */
  const underlineInput = { border: 'none', borderBottom: '1px solid #e5e5e5', outline: 'none', fontSize: 13, color: '#262626', fontWeight: 500, padding: '8px 0', width: '100%', background: 'transparent', fontFamily: 'inherit' };
  const underlinePlaceholder = { ...underlineInput, color: '#a3a3a3', fontWeight: 400 };
  const sectionChips = ['Description', 'Objectives', 'Opportunity', 'Timeline', 'Deliverables', 'Terms'];
  const [activeSections, setActiveSections] = useState([]);
  const toggleChip = (chip) => setActiveSections(p => p.includes(chip) ? p.filter(c => c !== chip) : [...p, chip]);

  const renderLayout2 = () => (
    <div className="quote-page-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#f5f4f0' }}>
      {/* Header bar */}
      <div style={{ ...headerBar, justifyContent: 'space-between', gap: 12, padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {backBtn}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span style={{ fontWeight: 500, color: '#737373' }}>Quotes & Invoices</span>
            <span style={{ color: '#a3a3a3' }}>›</span>
            <span style={{ fontWeight: 600, color: '#262626' }}>{data.id}</span>
            <OverflowMenu items={overflowItems} bordered={false} align="left" />
          </div>
          {statusBadge}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn-press btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#262626' }}>
            Preview
          </button>
          <button className="btn-press" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#262626', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#fff' }}>
            Save & send
          </button>
          {quotePagerSlot}
        </div>
      </div>

      {/* Body: doc pane + right sidebar */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Scrollable document */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#f5f4f0' }}>
        <div style={{ maxWidth: 1080, margin: '28px auto', padding: '0 20px 60px' }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e5e5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            {/* Top bar with logo + dates */}
            <div style={{ padding: '32px 40px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#262626', letterSpacing: '-1px' }}>
                {data.vendor.name.charAt(0)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</div>
                  <input type="date" value={quoteDate} onChange={e => setQuoteDate(e.target.value)} style={{ ...underlineInput, fontSize: 12, textAlign: 'right', width: 140 }} />
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Valid until</div>
                  <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} style={{ ...underlineInput, fontSize: 12, textAlign: 'right', width: 140 }} />
                </div>
              </div>
            </div>

            {/* Proposal title */}
            <div style={{ padding: '0 40px 28px' }}>
              <input placeholder="Proposal title..." defaultValue="Roof Replacement — Full" style={{ border: 'none', outline: 'none', fontSize: 24, fontWeight: 300, color: '#262626', width: '100%', background: 'transparent', fontFamily: 'inherit', padding: 0 }} />
            </div>

            {/* FROM / BILL TO */}
            <div style={{ padding: '0 40px 32px', borderBottom: '4px solid #f5f4f0' }}>
              <div style={{ display: 'flex', gap: 40 }}>
                {/* FROM */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>FROM</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    <input defaultValue={data.vendor.name} style={{ ...underlineInput, fontWeight: 700 }} />
                    <input defaultValue={data.vendor.email} style={underlineInput} />
                    <div style={{ borderBottom: '1px solid #e5e5e5', padding: '8px 0' }}>
                      <div style={{ fontSize: 13, color: '#262626' }}>{data.vendor.address}</div>
                      <div style={{ fontSize: 13, color: '#262626' }}>{data.vendor.city}</div>
                    </div>
                    <input defaultValue={data.vendor.phone} style={underlineInput} />
                    <input defaultValue={data.vendor.website} style={underlineInput} />
                  </div>
                </div>

                {/* BILL TO */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>BILL TO</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    <input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Search or type client name" style={orgName ? underlineInput : underlinePlaceholder} />
                    <input value={data.customer.email} readOnly placeholder="client@email.com" style={underlineInput} />
                    <div style={{ borderBottom: '1px solid #e5e5e5', padding: '8px 0' }}>
                      <div style={{ fontSize: 13, color: data.organization.address ? '#262626' : '#c5c5c5' }}>{data.organization.address || 'Client address'}</div>
                    </div>
                    <input value={data.customer.phone} readOnly placeholder="Phone number" style={underlineInput} />
                    <input placeholder="Website" defaultValue="" style={underlinePlaceholder} />
                    <input placeholder="Tax ID / VAT Number" defaultValue="" style={underlinePlaceholder} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section chips */}
            <div style={{ padding: '24px 40px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn-press" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, border: 'none', background: '#f5f4f0', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#262626' }}>
                <PlusIcon size={12} /> Add Section
              </button>
              {sectionChips.map(chip => (
                <button key={chip} className="btn-press" onClick={() => toggleChip(chip)} style={{ padding: '5px 14px', borderRadius: 999, border: '1px solid #e5e5e5', background: activeSections.includes(chip) ? '#262626' : '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: activeSections.includes(chip) ? '#fff' : '#737373' }}>
                  {chip}
                </button>
              ))}
            </div>

            {/* Active section editors */}
            {activeSections.map(sec => (
              <div key={sec} style={{ padding: '0 40px 20px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#8c8b86', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{sec}</div>
                <textarea placeholder={`Enter ${sec.toLowerCase()}...`} rows={3} style={{ width: '100%', border: '1px solid #e8e7e2', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1a1a18', background: '#f5f4f0', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
            ))}

            {/* Line items — full App component from job details */}
            <App embedded />

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 40px 28px' }}>
              <div style={{ width: 240 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12 }}>
                  <span style={{ color: '#6b6a65' }}>Subtotal</span>
                  <span style={{ fontWeight: 600, color: '#1a1a18' }}>{QB_FMT_USD(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12 }}>
                  <span style={{ color: '#6b6a65' }}>Tax</span>
                  <span style={{ fontWeight: 600, color: '#1a1a18' }}>{QB_FMT_USD(tax)}</span>
                </div>
                <div style={{ height: 1, background: '#e8e7e2', margin: '6px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a18' }}>Total</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#1a1a18' }}>{QB_FMT_USD(total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div style={{ padding: '0 40px 28px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#8c8b86', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Notes & terms</div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes or terms visible on the quote..." rows={3} style={{ width: '100%', border: '1px solid #e8e7e2', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1a1a18', background: '#f5f4f0', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>
        </div>

        {/* Right sidebar — associations */}
        <div style={{ width: 340, flexShrink: 0, background: '#fff', borderLeft: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <AssociationsPanel />
        </div>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════════
     LAYOUT 3 — Option B: Command bar + focused document
     ════════════════════════════════════════════════════════════ */
  const [activeTab, setActiveTab] = useState('document');
  const renderLayout3 = () => (
    <div className="quote-page-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#f5f4f0' }}>
      {/* Dark command bar */}
      <div style={{ background: '#1d1d1d', color: '#fff', padding: '16px 24px', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 24, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quote {data.id}</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#fff', marginTop: 2 }}>Roof replacement — full</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{data.organization.name} · #JN-245</div>
        </div>
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total · USD</div>
          <div style={{ fontSize: 24, fontWeight: 500, color: '#fff', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{QB_FMT_USD(detailTotalDue)}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>$4,225 deposit paid · $26,360 balance</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, background: '#FEF3C7', fontSize: 12, fontWeight: 500, color: '#92400e' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
            Change requested · 2d
          </span>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>3 items affected</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn-press" style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#fff' }}>View changes</button>
          <button className="btn-press" style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#1d1d1d' }}>Send revision</button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 24px', display: 'flex', gap: 0 }}>
        {[
          { id: 'document', label: 'Document' },
          { id: 'activity', label: 'Activity', count: 3 },
          { id: 'files', label: 'Files', count: 2 },
          { id: 'related', label: 'Related', count: 2 },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 16px', fontSize: 13, fontWeight: activeTab === tab.id ? 500 : 400, color: activeTab === tab.id ? '#262626' : '#6b7280', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #262626' : '2px solid transparent', cursor: 'pointer', marginBottom: -1 }}>
            {tab.label}{tab.count != null && <span style={{ marginLeft: 4, fontSize: 11, color: '#9ca3af' }}>({tab.count})</span>}
          </button>
        ))}
      </div>

      {/* Body: document + narrow sidebar */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
          {/* Three-up meta strip */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e5e5' }}>
            {[
              { label: 'Bill to', value: `${data.organization.name}, 45 Maple Ave, London` },
              { label: 'Service at', value: `${data.organization.name} — Main Bldg, Sunnyvale` },
              { label: 'Valid until', value: 'Nov 15, 2025' },
            ].map((m, i) => (
              <div key={m.label} style={{ flex: 1, padding: '12px 24px', borderRight: i < 2 ? '1px solid #e5e5e5' : 'none' }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 13, color: '#262626' }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Line items as flat sectioned list */}
          <App embedded />

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid #e5e5e5' }}>
            <div style={{ width: 240 }}>
              {[
                { label: 'Subtotal', value: QB_FMT_USD(subtotal) },
                { label: 'Tax', value: QB_FMT_USD(tax) },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12 }}>
                  <span style={{ color: '#6b7280' }}>{r.label}</span>
                  <span style={{ fontWeight: 500, color: '#262626', fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
                </div>
              ))}
              <div style={{ height: 1, background: '#e5e5e5', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>Total</span>
                <span style={{ fontSize: 16, fontWeight: 500, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>{QB_FMT_USD(detailTotalDue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrow sidebar — 220px, tertiary bg */}
        <div style={{ width: 220, flexShrink: 0, background: '#fafaf8', borderLeft: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}>
            {/* Customer card */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, background: '#dbeafe', color: '#2563eb', fontSize: 13 }}>R</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#262626' }}>Richard Mathew</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{data.organization.name} · since 2022</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Call', 'Email', 'Note'].map(a => (
                  <button key={a} className="btn-press" style={{ flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 500, color: '#374151' }}>{a}</button>
                ))}
              </div>
            </div>

            {/* Account stats */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: '8px 10px', border: '1px solid #e5e5e5' }}>
                <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 2 }}>Credits</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#262626' }}>$285</div>
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: '8px 10px', border: '1px solid #e5e5e5' }}>
                <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 2 }}>Receivable</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#262626' }}>$3,904</div>
              </div>
            </div>

            {/* Activity timeline */}
            <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Recent activity</div>
            <div style={{ position: 'relative', paddingLeft: 18 }}>
              <div style={{ position: 'absolute', left: 4, top: 4, bottom: 4, width: 1, background: '#e5e5e5' }} />
              {[
                { label: 'Change requested', sub: 'Richard · 2 days ago', color: '#f59e0b', current: true },
                { label: 'Viewed quote', sub: '3 days ago', color: '#d1d5db' },
                { label: 'Quote sent', sub: 'Oct 3', color: '#d1d5db' },
              ].map((ev, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: 12 }}>
                  <div style={{ position: 'absolute', left: -14, top: 4, width: 9, height: 9, borderRadius: '50%', background: ev.color, border: ev.current ? '2px solid #fef3c7' : 'none', boxSizing: 'border-box' }} />
                  <div style={{ fontSize: 12, fontWeight: ev.current ? 500 : 400, color: '#262626' }}>{ev.label}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{ev.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════════
     LAYOUT 4 — Option C: Change-review workspace
     ════════════════════════════════════════════════════════════ */
  const [showAllItems, setShowAllItems] = useState(false);
  const DIFF_ITEMS = [
    { type: 'modified', sku: 'TO-002', name: 'Dumpster rental — 30 yd', oldQty: 2, newQty: 1, unit: 1050, oldTotal: 2100, newTotal: 1050 },
    { type: 'removed', sku: 'RF-101', name: 'GAF Timberline HDZ — Charcoal', qty: 31, unit: 385, total: 11935 },
    { type: 'added', sku: 'RF-108', name: 'Owens Corning Duration — Onyx Black', qty: 31, unit: 410, total: 12710 },
  ];

  const renderLayout4 = () => (
    <div className="quote-page-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#f5f4f0' }}>
      {/* Slim top bar */}
      <div style={{ flexShrink: 0, background: '#fff', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 36, fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {backBtn}
          <span style={{ fontWeight: 400, color: '#6b7280' }}>{data.id} ·</span>
          <span style={{ fontWeight: 500, color: '#262626' }}>Roof replacement — full</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 6, background: '#FEF3C7', fontSize: 11, fontWeight: 500, color: '#92400e' }}>Change requested</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#262626', fontVariantNumeric: 'tabular-nums' }}>Total {QB_FMT_USD(detailTotalDue)}</span>
          {quotePagerSlot}
        </div>
      </div>

      {/* Change-request banner */}
      <div style={{ flexShrink: 0, background: '#FAEEDA', borderBottom: '1px solid #f0dbb8', padding: '12px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#78350f' }}>Richard requested 3 changes · 2 days ago</span>
          </div>
          <div style={{ fontSize: 12, color: '#92400e', opacity: 0.75, fontStyle: 'italic', paddingLeft: 22 }}>
            "Looks great overall — two things: we'd prefer Owens Corning shingles in onyx black if you carry them. Also we only need one dumpster, not two. Can you revise?"
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button className="btn-press" style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #d97706', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#92400e' }}>Reply</button>
          <button className="btn-press" style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#292929', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#fff' }}>Apply & revise</button>
        </div>
      </div>

      {/* Body: diff + conversation */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Left — diff view */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
          {/* Filter row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #e5e5e5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7280' }}>
              Showing {showAllItems ? '8' : '3 affected'} items of 8
              <button onClick={() => setShowAllItems(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#2563eb', padding: 0 }}>
                {showAllItems ? 'Show affected only' : 'Show all'}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#6b7280' }}>
              {[
                { color: '#f59e0b', label: 'Modified' },
                { color: '#ef4444', label: 'Removed' },
                { color: '#22c55e', label: 'Added' },
              ].map(l => (
                <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          {/* Diff table */}
          <div style={{ padding: '0 24px 16px' }}>
            {DIFF_ITEMS.map((item, i) => {
              const rail = item.type === 'modified' ? '#f59e0b' : item.type === 'removed' ? '#ef4444' : '#22c55e';
              const tint = item.type === 'modified' ? '#FFFBEB' : item.type === 'removed' ? '#FEF2F2' : '#F0FDF4';
              const textColor = item.type === 'modified' ? '#92400e' : item.type === 'removed' ? '#991b1b' : '#166534';
              return (
                <div key={i} style={{ display: 'flex', borderBottom: '1px solid #e5e5e5', background: tint }}>
                  <div style={{ width: 4, background: rail, flexShrink: 0 }} />
                  <div style={{ flex: 1, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {item.type === 'removed' && <span style={{ color: textColor, fontWeight: 500 }}>−</span>}
                        {item.type === 'added' && <span style={{ color: textColor, fontWeight: 500 }}>+</span>}
                        <span style={{ fontSize: 13, fontWeight: 500, color: textColor }}>{item.name}</span>
                        <span style={{ fontSize: 11, color: '#9ca3af' }}>{item.sku}</span>
                      </div>
                      <div style={{ fontSize: 12, color: textColor, opacity: 0.8, marginTop: 2 }}>
                        {item.type === 'modified' && <span>qty <span style={{ textDecoration: 'line-through' }}>{item.oldQty}</span> → {item.newQty} × ${item.unit.toLocaleString()}</span>}
                        {item.type === 'removed' && <span>removed by customer</span>}
                        {item.type === 'added' && <span>proposed substitute · {item.qty} × ${item.unit.toLocaleString()}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 500, color: textColor, fontVariantNumeric: 'tabular-nums' }}>
                      {item.type === 'modified' && (
                        <>
                          <div style={{ textDecoration: 'line-through', opacity: 0.6 }}>${item.oldTotal.toLocaleString()}</div>
                          <div>${item.newTotal.toLocaleString()}</div>
                        </>
                      )}
                      {item.type === 'removed' && <div style={{ textDecoration: 'line-through' }}>${item.total.toLocaleString()}</div>}
                      {item.type === 'added' && <div>${item.total.toLocaleString()}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Net-change strip */}
          <div style={{ margin: '0 24px 16px', background: '#f9fafb', border: '1px solid #e5e5e5', borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>Before</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#6b7280', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>$30,585.28</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              <div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>After revision</div>
                <div style={{ fontSize: 22, fontWeight: 500, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>$30,310.28</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Net change</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#16a34a', fontVariantNumeric: 'tabular-nums' }}>−$275.00</div>
            </div>
          </div>

          {/* Caption */}
          <div style={{ padding: '0 24px 24px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9ca3af' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            5 unchanged items hidden · Subtotal contributions reflect proposed revision
          </div>
        </div>

        {/* Right — conversation pane, 320px */}
        <div style={{ width: 320, flexShrink: 0, background: '#fafaf8', borderLeft: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {/* Customer message */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, background: '#dbeafe', color: '#2563eb', fontSize: 10 }}>R</div>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#262626' }}>Richard Mathew</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>2 days ago</span>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: '#374151', lineHeight: '20px' }}>
                Looks great overall — two things: we'd prefer Owens Corning shingles in onyx black if you carry them. Also we only need one dumpster, not two. Can you revise?
              </div>
            </div>

            {/* Reply composer */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, background: '#f3f4f6', color: '#6b7280', fontSize: 10 }}>Y</div>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#262626' }}>You</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>· draft</span>
              </div>
              <textarea placeholder="Write a reply..." rows={3} style={{ width: '100%', border: '1px solid #e5e5e5', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#262626', background: '#fff', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* Context block */}
          <div style={{ borderTop: '1px solid #e5e5e5', padding: '12px 16px' }}>
            {[
              { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>, label: 'Roof Inspection & Repair', sub: '#JOB-1042' },
              { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, label: 'Deposit invoice', sub: <span style={{ display: 'inline-flex', padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 500, background: '#dcfce7', color: '#16a34a' }}>Paid</span> },
              { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>, label: '2 attachments', sub: <ChevronDown size={12} color="#9ca3af" /> },
            ].map((ctx, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
                {ctx.icon}
                <span style={{ flex: 1, fontSize: 12, color: '#262626' }}>{ctx.label}</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{ctx.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Layout Router ─── */
  return (
    <>
      {!isInvoice && <LayoutDevPill layout={layout} setLayout={setLayout} />}
      {effectiveLayout === '1' && renderLayout1()}
      {!isInvoice && layout === '2' && renderLayout2()}
      {!isInvoice && layout === '3' && renderLayout3()}
      {!isInvoice && layout === '4' && renderLayout4()}
    </>
  );
}


/* ─── Proposal Detail Page ─── */
const PROPOSAL_OPTIONS = [
  {
    key: 'good',
    badge: 'Good',
    title: 'Essentials Roof Package',
    tagline: 'Reliable, durable basics',
    description: 'Standard 30-year architectural shingles with full tear-off, ice & water shield at the eaves, and core flashing. The dependable baseline that gets the job done right — no frills, just lasting protection.',
    scope: '3-tab shingle, 30-year',
    coverGradient: 'linear-gradient(135deg, #64748b 0%, #334155 60%, #1e293b 100%)',
    coverAccent: '#cbd5e1',
    badgeBg: '#e2e8f0', badgeColor: '#334155',
    tierIcon: 'shield',
    cost: 6300,
    items: [
      { name: '30-year architectural shingles', qty: 18, unit: 'SQ', unitPrice: 165, category: 'Materials' },
      { name: 'Synthetic underlayment', qty: 18, unit: 'SQ', unitPrice: 42, category: 'Materials' },
      { name: 'Ice & water shield (eaves only)', qty: 120, unit: 'LF', unitPrice: 4.5, category: 'Materials' },
      { name: 'Galvanized step flashing', qty: 1, unit: 'KIT', unitPrice: 220, category: 'Materials' },
      { name: 'Tear-off + disposal', qty: 1, unit: 'JOB', unitPrice: 1850, category: 'Labor' },
      { name: 'Installation labor', qty: 1, unit: 'JOB', unitPrice: 3200, category: 'Labor' },
    ],
    inclusions: ['Standard tear-off & disposal', 'Synthetic underlayment', '30-year shingle warranty', 'Galvanized flashing', 'Job-site cleanup'],
    warranty: '10-year workmanship · 30-year material',
  },
  {
    key: 'better',
    badge: 'Better',
    title: 'Performance Roof Package',
    tagline: 'Premium materials, longer life',
    description: 'Designer architectural shingles, full ice & water shield, ridge & soffit ventilation upgrade, and an aluminum flashing kit. The smart middle ground homeowners pick most often.',
    scope: 'Architectural, 50-year, ridge vent',
    coverGradient: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 50%, #0a4a45 100%)',
    coverAccent: '#5eead4',
    badgeBg: '#ccfbf1', badgeColor: '#0f766e',
    tierIcon: 'shield-check',
    cost: 9100,
    recommended: true,
    items: [
      { name: 'Designer architectural shingles', qty: 18, unit: 'SQ', unitPrice: 245, category: 'Materials' },
      { name: 'Premium synthetic underlayment', qty: 18, unit: 'SQ', unitPrice: 58, category: 'Materials' },
      { name: 'Full ice & water shield', qty: 1800, unit: 'SQFT', unitPrice: 0.95, category: 'Materials' },
      { name: 'Ridge vent system', qty: 60, unit: 'LF', unitPrice: 11, category: 'Materials' },
      { name: 'Aluminum step flashing kit', qty: 1, unit: 'KIT', unitPrice: 480, category: 'Materials' },
      { name: 'Tear-off + disposal', qty: 1, unit: 'JOB', unitPrice: 2100, category: 'Labor' },
      { name: 'Installation labor', qty: 1, unit: 'JOB', unitPrice: 4400, category: 'Labor' },
    ],
    inclusions: ['Designer-grade shingles', 'Full ice & water shield', 'Ridge ventilation upgrade', 'Aluminum flashing kit', 'Premium underlayment', 'Cleanup & haul-away'],
    warranty: '15-year workmanship · 50-year material',
  },
  {
    key: 'best',
    badge: 'Best',
    title: 'Luxury Roof System',
    tagline: 'Top-tier materials, transferable warranty',
    description: 'Luxury laminated shingles, copper step & valley flashing, full attic ventilation rebalance, gutter guard upgrade, and a transferable lifetime workmanship warranty. The forever roof.',
    scope: 'Designer, copper, lifetime',
    coverGradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 50%, #78350f 100%)',
    coverAccent: '#fcd34d',
    badgeBg: '#fef3c7', badgeColor: '#92400e',
    tierIcon: 'star',
    cost: 14800,
    items: [
      { name: 'Luxury laminated shingles', qty: 18, unit: 'SQ', unitPrice: 385, category: 'Materials' },
      { name: 'High-temp underlayment', qty: 18, unit: 'SQ', unitPrice: 78, category: 'Materials' },
      { name: 'Full ice & water shield', qty: 1800, unit: 'SQFT', unitPrice: 0.95, category: 'Materials' },
      { name: 'Copper step & valley flashing', qty: 1, unit: 'KIT', unitPrice: 1450, category: 'Materials' },
      { name: 'Ridge + soffit ventilation system', qty: 1, unit: 'JOB', unitPrice: 980, category: 'Materials' },
      { name: 'Gutter guard upgrade', qty: 180, unit: 'LF', unitPrice: 14, category: 'Materials' },
      { name: 'Attic insulation top-off', qty: 1, unit: 'JOB', unitPrice: 1200, category: 'Materials' },
      { name: 'Tear-off + disposal', qty: 1, unit: 'JOB', unitPrice: 2400, category: 'Labor' },
      { name: 'Master installation crew', qty: 1, unit: 'JOB', unitPrice: 6800, category: 'Labor' },
    ],
    inclusions: ['Luxury laminated shingles', 'Copper flashing', 'Full ventilation rebalance', 'Gutter guard system', 'Attic insulation top-off', 'Transferable lifetime warranty', 'White-glove cleanup'],
    warranty: 'Lifetime workmanship · Lifetime material (transferable)',
  },
];

const PROPOSAL_STATUS_TIMELINE = [
  { stage: 'Draft', date: '10/01/2025 09:12 AM', by: 'mrithyunjay k' },
  { stage: 'Sent', date: '10/01/2025 02:30 PM', by: 'Jerin Ajay' },
  { stage: 'Customer Review', date: '10/02/2025 10:14 AM', by: 'Richard Mathew' },
  { stage: 'Option Selected', date: '', by: '' },
  { stage: 'Accepted', date: '', by: '' },
];

function calcOptionTotals(items) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const tax = subtotal * 0.085;
  return { subtotal, tax, total: subtotal + tax };
}

function ProposalOptionCover({ option, height = 160, compact = false }) {
  return (
    <div style={{ position: 'relative', height, background: option.coverGradient, borderRadius: compact ? '12px 12px 0 0' : 12, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: compact ? 14 : 22 }}>
      {/* Decorative geometric layer */}
      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
        <defs>
          <linearGradient id={`pg-${option.key}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={option.coverAccent} stopOpacity="0.6" />
            <stop offset="1" stopColor={option.coverAccent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="0,200 0,140 200,40 400,120 400,200" fill={`url(#pg-${option.key})`} />
        <polygon points="0,200 120,160 260,180 400,140 400,200" fill={option.coverAccent} fillOpacity="0.18" />
        <circle cx="320" cy="50" r="28" fill={option.coverAccent} fillOpacity="0.35" />
      </svg>
    </div>
  );
}

function ProposalPage({ onBack, proposal }) {
  const [options, setOptions] = useState(() => PROPOSAL_OPTIONS.map(option => ({
    ...option,
    items: option.items.map(item => ({ ...item })),
    inclusions: [...option.inclusions],
  })));
  const [selectedKey, setSelectedKey] = useState(null);
  const [acceptedKey, setAcceptedKey] = useState(null);
  const [addItemOpenKey, setAddItemOpenKey] = useState(null);
  const [itemDrafts, setItemDrafts] = useState({});

  const selected = selectedKey ? options.find(o => o.key === selectedKey) : null;
  const totalsByKey = useMemo(() => Object.fromEntries(options.map(o => [o.key, calcOptionTotals(o.items)])), [options]);

  const ensureItemDraft = (key) => {
    setItemDrafts(prev => (
      prev[key]
        ? prev
        : {
            ...prev,
            [key]: { name: '', qty: '1', unit: 'EA', unitPrice: '', category: 'Materials' },
          }
    ));
  };

  const openAddItem = (key) => {
    ensureItemDraft(key);
    setAddItemOpenKey(key);
  };

  const updateItemDraft = (key, field, value) => {
    setItemDrafts(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { name: '', qty: '1', unit: 'EA', unitPrice: '', category: 'Materials' }),
        [field]: value,
      },
    }));
  };

  const closeAddItem = () => setAddItemOpenKey(null);

  const submitAddItem = (key) => {
    const draft = itemDrafts[key];
    if (!draft) return;
    const name = draft.name.trim();
    const qty = Number(draft.qty);
    const unitPrice = Number(draft.unitPrice);
    if (!name || !Number.isFinite(qty) || qty <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) return;

    const newItem = {
      name,
      qty,
      unit: draft.unit.trim() || 'EA',
      unitPrice,
      category: draft.category || 'Materials',
    };

    setOptions(prev => prev.map(option => (
      option.key === key
        ? {
            ...option,
            items: [...option.items, newItem],
            inclusions: option.inclusions.includes(name) ? option.inclusions : [...option.inclusions, name],
          }
        : option
    )));
    setItemDrafts(prev => ({
      ...prev,
      [key]: { name: '', qty: '1', unit: 'EA', unitPrice: '', category: draft.category || 'Materials' },
    }));
    setAddItemOpenKey(null);
  };

  const headerBar = (
    <div className="header-enter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderBottom: '1px solid #e5e5e5', background: '#fff', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
        <button className="btn-ghost btn-press" onClick={onBack} style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#737373', padding: 4, borderRadius: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <span style={{ color: '#a3a3a3' }}>›</span>
        <span style={{ fontWeight: 400, color: '#737373' }}>Jobs</span>
        <span style={{ color: '#a3a3a3' }}>/</span>
        <span style={{ fontWeight: 400, color: '#737373' }}>#JN-245</span>
        <span style={{ color: '#a3a3a3' }}>/</span>
        <span style={{ fontWeight: 400, color: '#737373' }}>Proposals</span>
        <span style={{ color: '#a3a3a3' }}>/</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: 5, background: '#065f46', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>PRO</span>
        <span style={{ fontWeight: 500, color: '#262626' }}>{proposal.id}</span>
        {selected && (
          <>
            <span style={{ color: '#a3a3a3' }}>/</span>
            <span style={{ fontWeight: 500, color: '#262626' }}>{selected.badge} tier</span>
          </>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="btn-press btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#374151' }}>
          <PrinterIcon /> Print
        </button>
        <button className="btn-press btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#374151' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          PDF
        </button>
        <button className="btn-press" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#292929', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#fff' }}>
          <SendIcon size={13} color="#fff" /> Send proposal
        </button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="header-enter" style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '24px 40px 60px', boxSizing: 'border-box' }}>
      {/* Section header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>Proposal options</div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{options.length} tiers · customer picks one when accepting</div>
        </div>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', border: '1px dashed #d1d5db', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontSize: 11, color: '#6b7280', fontFamily: 'inherit' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add option
        </button>
      </div>

      {/* Banner stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map(opt => {
          const t = totalsByKey[opt.key];
          const isAccepted = acceptedKey === opt.key;
          const visibleItems = opt.items.slice(0, 3);
          const hasMore = opt.items.length > 5;
          const draft = itemDrafts[opt.key] || { name: '', qty: '1', unit: 'EA', unitPrice: '', category: 'Materials' };
          const showAddItem = addItemOpenKey === opt.key;
          return (
            <div
              key={opt.key}
              onClick={() => setSelectedKey(opt.key)}
              style={{ position: 'relative', background: '#fff', border: `1px solid ${opt.recommended ? '#d9e7fb' : '#e5e5e5'}`, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'visible', boxSizing: 'border-box', cursor: 'pointer' }}
            >
              {/* ── Top: option details (light) ── */}
              <div style={{ background: '#fff', padding: '14px 18px', borderRadius: '12px 12px 0 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px minmax(0, 1fr) auto', gap: 14, alignItems: 'center' }}>

                  {/* Cover thumbnail */}
                  <div style={{ width: 80, height: 48, borderRadius: 8, overflow: 'hidden', position: 'relative', background: opt.coverGradient, flexShrink: 0 }}>
                    <svg width="100%" height="100%" viewBox="0 0 80 48" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, opacity: 0.55 }}>
                      <defs>
                        <linearGradient id={`bp-${opt.key}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor={opt.coverAccent} stopOpacity="0.8" />
                          <stop offset="1" stopColor={opt.coverAccent} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <polygon points="0,48 0,26 40,8 80,24 80,48" fill={`url(#bp-${opt.key})`} />
                      <circle cx="64" cy="12" r="10" fill={opt.coverAccent} fillOpacity="0.4" />
                    </svg>
                  </div>

                  {/* Title block */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 3 }}>
                      <span style={{ fontSize: 15, fontWeight: 500, color: '#111827', letterSpacing: '-0.15px' }}>{opt.title}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 3, background: '#f3f4f6', color: '#6b7280', fontSize: 10, fontWeight: 500, letterSpacing: '0.05em' }}>{opt.badge.toUpperCase()}</span>
                      {opt.recommended && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 3, background: '#eff6ff', color: '#2563eb', fontSize: 10, fontWeight: 500, letterSpacing: '0.05em' }}>RECOMMENDED</span>
                      )}
                      {isAccepted && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 3, background: '#e8f7ef', color: '#15803d', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>ACCEPTED</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{opt.description}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ textAlign: 'right', minWidth: 120 }}>
                      <div style={{ fontSize: 20, fontWeight: 600, color: '#111827', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.4px' }}>{QB_FMT_USD(t.total)}</div>
                    </div>

                    {/* Overflow menu */}
                    <div style={{ position: 'relative', alignSelf: 'start' }}>
                      <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#9ca3af', display: 'inline-flex', borderRadius: 4 }}
                        onClick={e => { e.stopPropagation(); const el = e.currentTarget.nextSibling; el.style.display = el.style.display === 'block' ? 'none' : 'block'; }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
                      </button>
                      <div style={{ display: 'none', position: 'absolute', top: '100%', right: 0, zIndex: 20, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', minWidth: 168, padding: '4px 0' }}>
                        {[
                          ['Rename', 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'],
                          ['Edit cover', 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z'],
                          ['Edit description', 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z'],
                          ['Duplicate option', 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'],
                          ['Set as recommended', 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
                          ['Move up', 'M18 15l-6-6-6 6'],
                          ['Move down', 'M6 9l6 6 6-6'],
                          ['Delete option', 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6'],
                        ].map(([label, path]) => (
                          <button key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: label === 'Delete option' ? '#dc2626' : '#374151', fontFamily: 'inherit', textAlign: 'left' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={path}/></svg>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Bottom: ledger (matches total stat card bg) ── */}
              <div style={{ background: '#fff', padding: '12px 18px', borderTop: '1px solid #f3f4f6', borderRadius: '0 0 12px 12px' }}>

                {/* Item ledger */}
                {visibleItems.map((it, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '4px 0', fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: '#111827', whiteSpace: 'nowrap' }}>{it.name}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>· {it.qty} × {QB_FMT_USD(it.unitPrice)}</span>
                    <span style={{ flex: 1, borderBottom: '0.5px dotted #e5e7eb', transform: 'translateY(-3px)', minWidth: 16 }} />
                    <span style={{ fontWeight: 500, color: '#111827', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{QB_FMT_USD(it.qty * it.unitPrice)}</span>
                  </div>
                ))}

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f3f4f6', marginTop: 10, paddingTop: 10 }}>
                  {hasMore ? (
                    <button onClick={(e) => { e.stopPropagation(); setSelectedKey(opt.key); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#2563eb', fontFamily: 'inherit', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      View all {opt.items.length} items →
                    </button>
                  ) : <span style={{ fontSize: 11, color: '#9ca3af' }}>Full scope shown</span>}
                  <button onClick={(e) => { e.stopPropagation(); openAddItem(opt.key); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', border: '0.5px dashed #c9c7c1', borderRadius: 6, background: showAddItem ? '#f5f4f0' : 'transparent', cursor: 'pointer', fontSize: 11, color: '#9ca3af', fontFamily: 'inherit' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add item
                  </button>
                </div>
                {showAddItem && (
                  <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 12, padding: 12, border: '1px solid #ebe7df', borderRadius: 10, background: '#fafaf8', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) 84px 78px 112px 120px', gap: 8 }}>
                      <input
                        value={draft.name}
                        onChange={(e) => updateItemDraft(opt.key, 'name', e.target.value)}
                        placeholder="Line item name"
                        style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#262626', outline: 'none', background: '#fff', fontFamily: 'inherit' }}
                      />
                      <input
                        value={draft.qty}
                        onChange={(e) => updateItemDraft(opt.key, 'qty', e.target.value)}
                        placeholder="Qty"
                        inputMode="decimal"
                        style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#262626', outline: 'none', background: '#fff', fontFamily: 'inherit' }}
                      />
                      <input
                        value={draft.unit}
                        onChange={(e) => updateItemDraft(opt.key, 'unit', e.target.value.toUpperCase())}
                        placeholder="Unit"
                        style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#262626', outline: 'none', background: '#fff', fontFamily: 'inherit' }}
                      />
                      <input
                        value={draft.unitPrice}
                        onChange={(e) => updateItemDraft(opt.key, 'unitPrice', e.target.value)}
                        placeholder="Unit price"
                        inputMode="decimal"
                        style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#262626', outline: 'none', background: '#fff', fontFamily: 'inherit' }}
                      />
                      <select
                        value={draft.category}
                        onChange={(e) => updateItemDraft(opt.key, 'category', e.target.value)}
                        style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#262626', outline: 'none', background: '#fff', fontFamily: 'inherit' }}
                      >
                        <option value="Materials">Materials</option>
                        <option value="Labor">Labor</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Services">Services</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>Adds directly to this option and updates totals instantly.</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={closeAddItem} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 500, color: '#6b7280', fontFamily: 'inherit' }}>
                          Cancel
                        </button>
                        <button onClick={() => submitAddItem(opt.key)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: '#262626', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#fff', fontFamily: 'inherit' }}>
                          Add line item
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDetail = () => {
    const opt = selected;
    const t = totalsByKey[opt.key];
    return (
      <div className="header-enter" style={{ maxWidth: 1080, margin: '0 auto', width: '100%', padding: '20px 40px 60px', boxSizing: 'border-box' }}>
        {/* Inline back link */}
        <button onClick={() => setSelectedKey(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#6b7280', padding: '4px 0', marginBottom: 14 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          All options
        </button>

        {/* Header: cover left, details right */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'stretch', marginBottom: 20 }}>
          {/* Cover */}
          <div style={{ flexShrink: 0, width: 220, borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <ProposalOptionCover option={opt} height="100%" compact />
          </div>

          {/* Details */}
          <div style={{ flex: 1, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 6, background: opt.badgeBg, color: opt.badgeColor, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{opt.badge} option</span>
                {opt.recommended && <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 6, background: '#dbeafe', color: '#1d4ed8', fontSize: 10, fontWeight: 600, letterSpacing: '0.04em' }}>RECOMMENDED</span>}
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#111827', letterSpacing: '-0.3px', marginBottom: 6 }}>{opt.title}</div>
              <div style={{ fontSize: 13, color: '#525252', lineHeight: 1.65 }}>{opt.description}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 16 }}>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{opt.scope}</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</div>
                <div style={{ fontSize: 26, fontWeight: 600, color: '#111827', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px', marginTop: 1 }}>{QB_FMT_USD(t.total)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Line items table */}
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Line items</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>{opt.items.length} items</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 80px 70px 110px 110px', padding: '10px 20px', borderBottom: '1px solid #f3f4f6', fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#fafaf8' }}>
            <div>Item</div><div style={{ textAlign: 'right' }}>Qty</div><div>Unit</div><div style={{ textAlign: 'right' }}>Unit Price</div><div style={{ textAlign: 'right' }}>Amount</div>
          </div>
          {opt.items.map((it, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 80px 70px 110px 110px', padding: '12px 20px', borderBottom: i < opt.items.length - 1 ? '1px solid #f3f4f6' : 'none', fontSize: 13, alignItems: 'center' }}>
              <div>
                <div style={{ color: '#111827', fontWeight: 500 }}>{it.name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{it.category}</div>
              </div>
              <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#374151' }}>{it.qty}</div>
              <div style={{ color: '#6b7280', fontSize: 12 }}>{it.unit}</div>
              <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#374151' }}>{QB_FMT_USD(it.unitPrice)}</div>
              <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#111827', fontWeight: 500 }}>{QB_FMT_USD(it.qty * it.unitPrice)}</div>
            </div>
          ))}
          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px', background: '#fafaf8', borderTop: '1px solid #e5e5e5' }}>
            <div style={{ width: 260 }}>
              {[
                { label: 'Subtotal', value: QB_FMT_USD(t.subtotal) },
                { label: 'Tax (8.5%)', value: QB_FMT_USD(t.tax) },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12 }}>
                  <span style={{ color: '#6b7280' }}>{r.label}</span>
                  <span style={{ fontWeight: 500, color: '#262626', fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
                </div>
              ))}
              <div style={{ height: 1, background: '#e5e5e5', margin: '6px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>{QB_FMT_USD(t.total)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#fff' }}>
      {headerBar}

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flexShrink: 0, background: '#fff', borderBottom: '1px solid #e5e5e5' }}>
            <QuoteStatusTimeline
              timeline={PROPOSAL_STATUS_TIMELINE}
              activeStage={acceptedKey ? 'Accepted' : 'Customer Review'}
              optionalStatuses={['Archived', 'Closed', 'Cancelled']}
            />
          </div>
          <div style={{ flex: 1, overflow: 'hidden', background: '#f5f4f0', position: 'relative' }}>
            <style>{`
              @keyframes slideInFromRight {
                from { transform: translateX(40px); opacity: 0; }
                to   { transform: translateX(0);    opacity: 1; }
              }
              @keyframes slideInFromLeft {
                from { transform: translateX(-40px); opacity: 0; }
                to   { transform: translateX(0);     opacity: 1; }
              }
              .view-detail {
                animation: slideInFromRight 260ms cubic-bezier(0.32, 0.72, 0, 1) both;
              }
              .view-overview {
                animation: slideInFromLeft 220ms cubic-bezier(0.32, 0.72, 0, 1) both;
              }
              .view-detail, .view-overview {
                position: absolute; inset: 0; overflow-y: auto;
              }
              @media (prefers-reduced-motion: reduce) {
                .view-detail, .view-overview { animation: none; }
              }
            `}</style>
            {selected
              ? <div key={selected.key} className="view-detail">{renderDetail()}</div>
              : <div key="overview" className="view-overview">{renderOverview()}</div>
            }
          </div>
        </div>

        <div style={{ borderLeft: '1px solid #e5e5e5', flexShrink: 0 }}>
          <AssociationsPanel />
        </div>
      </div>
    </div>
  );
}

function QuotesInvoicesTab({ onOpenQuote, onNewQuote }) {
  const [filter, setFilter] = useState('all');
  const { linkedQuotes } = useContext(InheritanceContext);
  // Build pseudo QUOTES_DATA entries for inherited quotes (mark with _inheritedLink so the row renders the link icon)
  const inheritedAsQuotes = linkedQuotes.map(q => ({
    id: q.id,
    title: q.title,
    customer: 'Telnet Industries',
    date: q.date,
    rawDate: q.date,
    validUntil: '—',
    rawValidUntil: '—',
    amount: '$' + q.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    status: q.status,
    statusBg: '#dcfce7',
    statusColor: '#16a34a',
    type: 'quote',
    _inheritedLink: true,
  }));
  // Avoid duplicates if the inherited id already exists in QUOTES_DATA
  const existingIds = new Set(QUOTES_DATA.map(q => q.id));
  const quotes = [...inheritedAsQuotes.filter(q => !existingIds.has(q.id)), ...QUOTES_DATA];

  const filtered = filter === 'all' ? quotes : quotes.filter(q => q.type === filter);
  const counts = { all: quotes.length, quote: quotes.filter(q => q.type === 'quote').length, proposal: quotes.filter(q => q.type === 'proposal').length, invoice: quotes.filter(q => q.type === 'invoice').length };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f5f4f0', borderRadius: 8, padding: 2 }}>
          {[{ key: 'all', label: 'All' }, { key: 'quote', label: 'Quotes' }, { key: 'proposal', label: 'Proposals' }, { key: 'invoice', label: 'Invoices' }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, background: filter === f.key ? '#fff' : 'transparent', color: filter === f.key ? '#262626' : '#737373', boxShadow: filter === f.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 150ms ease' }}>
              {f.label} <span style={{ fontSize: 10, color: '#a3a3a3', marginLeft: 4 }}>{counts[f.key]}</span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={onNewQuote} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', border: '1px solid #e5e5e5', borderRadius: 8, background: '#fff', cursor: 'pointer' }}>
            <PlusIcon size={14} /><span style={{ fontSize: 12, color: '#262626', fontWeight: 500 }}>New Quote</span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(q => (
          <div key={q.id} onClick={() => { if (q._inheritedLink) return; onOpenQuote(q); }} style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: '14px 18px', background: '#fff', cursor: q._inheritedLink ? 'default' : 'pointer', transition: 'all 150ms ease', display: 'flex', alignItems: 'center', gap: 16 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#d0cdc6'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            {/* Icon */}
            <div style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: q.type === 'quote' ? '#f5f3ff' : q.type === 'proposal' ? '#ecfdf5' : '#eff6ff' }}>
              {q.type === 'quote' ? <FileTextIcon size={17} color="#7c3aed" />
                : q.type === 'proposal' ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v6H4z"/><path d="M4 14h16v6H4z"/><circle cx="8" cy="7" r="1.2" fill="#059669" stroke="none"/><circle cx="8" cy="17" r="1.2" fill="#059669" stroke="none"/></svg>
                ) : <DollarIcon size={17} color="#2563eb" />}
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {q.type === 'proposal' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: 5, background: '#065f46', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>PRO</span>
                )}
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{q.title}</span>
                <span style={{ fontSize: 11, color: '#a3a3a3' }}>{q.id}</span>
                {q._inheritedLink && (
                  <span title="Linked to this job via Inherit from menu" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 5, background: '#dbeafe', color: '#1e40af', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    Linked
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6b7280' }}><CalendarIcon size={11} /> {q.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6b7280' }}><UserIcon size={11} color="#9ca3af" /> {q.customer}</span>
              </div>
            </div>
            {/* Amount */}
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827', flexShrink: 0, marginRight: 12 }}>{q.amount}</span>
            {/* Status */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: q.statusBg, fontSize: 11, fontWeight: 500, color: q.statusColor, flexShrink: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: q.statusColor }} />
              {q.status}
            </span>
            {/* Chevron */}
            <ChevronRight size={16} color="#d1d5db" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Center Pane ─── */
const centerTabs = [
  { id: "overview", label: "Overview" },
  { id: "notes", label: "Notes" },
  { id: "tasks", label: "Tasks" },
  { id: "quotesInvoices", label: "Quotes & Invoices" },
  { id: "lineItems", label: "Line Items" },
];

function CenterPane({ onOpenQuote, onNewQuote }) {
  const [activeTab, setActiveTab] = useState('lineItems');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden', background: '#fdfdfc' }}>
      {/* Persistent tab bar */}
      <div className="header-enter" style={{ display: "flex", alignItems: "center", gap: 0, borderBottom: "1px solid #e8e7e2", paddingLeft: 12, paddingRight: 12, flexShrink: 0, background: "#fff" }}>
        {centerTabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "10px 14px", fontSize: 13, fontWeight: activeTab === t.id ? 600 : 400, color: activeTab === t.id ? "#1a1a18" : "#8c8b86", background: "none", border: "none", borderBottom: activeTab === t.id ? "2px solid #1a1a18" : "2px solid transparent", cursor: "pointer", marginBottom: -1, whiteSpace: "nowrap" }}>{t.label}</button>
        ))}
        <button style={{ padding: "10px 14px", fontSize: 12, fontWeight: 500, color: "#b0afa9", background: "none", border: "none", borderBottom: "2px solid transparent", cursor: "pointer", marginBottom: -1, whiteSpace: "nowrap" }}>+ 6 more</button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'lineItems' && (
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <App />
          </div>
        )}
        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'quotesInvoices' && <QuotesInvoicesTab onOpenQuote={onOpenQuote} onNewQuote={onNewQuote} />}
        {activeTab === 'schedule' && <EmptyState icon={CalendarIcon} title="No schedule yet" desc="Create a schedule to assign time slots for this job." btn="Create Schedule" />}
      </div>
    </div>
  );
}

/* ─── Status History Panel ─── */
function StatusHistoryPanel() {
  const statuses = [
    { id: 'started', name: 'Started', badgeBg: '#dbeafe', badgeColor: '#1d4ed8', dot: '#3b82f6', user: 'James Smith', date: '05/01/2023', time: '16:32', quote: 'Pre defined text', signature: 'Richard Mathew', duration: '10 mins' },
    { id: 'onway', name: 'On my way', badgeBg: '#ffedd5', badgeColor: '#c2410c', dot: '#f97316', user: 'James Smith', date: '05/01/2023', time: '16:32', quote: 'Pre defined text', checklist: true, duration: '10 mins' },
    { id: 'scheduled', name: 'Scheduled', badgeBg: '#ffe4e6', badgeColor: '#be123c', dot: '#f43f5e', user: 'James Smith', date: '05/01/2023', time: '16:32', quote: 'Pre defined text', checklist: true, duration: '24 mins' },
    { id: 'new', name: 'New', badgeBg: '#f3f4f6', badgeColor: '#374151', dot: '#9ca3af', user: 'James Smith', date: '05/01/2023', time: '16:32', checklist: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 48, borderBottom: '1px solid #e5e7eb' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#262626' }}>Status history</span>
        <span style={{ cursor: 'pointer', display: 'flex' }}><SortIcon /></span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Update Status card */}
        <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#262626' }}>Update status</span>
          <div style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontSize: 13, color: '#737373', paddingLeft: 4 }}>Select status</span>
            <ChevronDown size={16} />
          </div>
        </div>

        {/* Timeline */}
        {statuses.map((s, i) => {
          const isLast = i === statuses.length - 1;
          return (
            <div key={s.id} style={{ display: 'flex', gap: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 24 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fff', border: '2px solid #22c55e', marginTop: 10 }}>
                  <CheckIcon size={11} color="#22c55e" />
                </div>
                {!isLast && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '100%', marginTop: 4 }}>
                    <div style={{ width: 1, flex: 1, background: '#d1d5db' }} />
                    {s.duration && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-90deg)', whiteSpace: 'nowrap', fontSize: 9, color: '#b0b0b0', fontWeight: 500 }}>{s.duration}</span>}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: isLast ? 0 : 12 }}>
                <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, background: '#fff' }}>
                  <div style={{ padding: '12px 16px 8px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: s.badgeBg }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 500, color: s.badgeColor }}>{s.name}</span>
                    </span>
                  </div>
                  <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><UserIcon /><span style={{ fontSize: 12, color: '#374151' }}>{s.user}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ClockIcon size={14} color="#9ca3af" /><span style={{ fontSize: 12, color: '#374151' }}>{s.date} {s.time}</span></div>
                    {s.quote && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1, fontWeight: 700 }}>"</span><span style={{ fontSize: 12, color: '#374151' }}>{s.quote}</span></div>}
                    {s.signature && <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><PenLineIcon /><span style={{ fontSize: 12, color: '#374151' }}>Signature - {s.signature}</span></div>
                      <div style={{ marginLeft: 22, border: '1px solid #e5e5e5', borderRadius: 8, height: 52, width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                        <span style={{ fontSize: 13, color: '#a3a3a3', fontStyle: 'italic', fontFamily: 'cursive' }}>Mathew sr.</span>
                      </div>
                    </>}
                    {s.checklist && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileTextIcon /><span style={{ fontSize: 12, color: '#3b82f6', cursor: 'pointer' }}>View checklist</span></div>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



/* ─── Associations Panel ─── */
function AssocSection({ title, open, onToggle, children }) {
  return (
    <div style={{ padding: '0 16px' }}>
      <button onClick={onToggle} style={{ width: '100%', padding: '14px 0 10px', display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
        <span style={{ display: 'flex', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms ease', color: '#6b7280' }}><ChevronDown size={14} color="#6b7280" /></span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', flex: 1, textAlign: 'left' }}>{title}</span>
      </button>
      {open && children && <div style={{ paddingBottom: 14 }}>{children}</div>}
    </div>
  );
}
function AssocEmpty({ text }) {
  return <div style={{ padding: '14px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>{text}</div>;
}
function AssocRow({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'flex', flexShrink: 0, color: '#9ca3af', width: 14, justifyContent: 'center' }}>{icon}</span>
      <span style={{ fontSize: 12, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  );
}
const UserOutlineIcon = ({ size = 13, color = '#9ca3af' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const HierarchyIcon = ({ size = 13, color = '#9ca3af' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="5" rx="1"/><rect x="3" y="17" width="6" height="5" rx="1"/><rect x="15" y="17" width="6" height="5" rx="1"/><path d="M12 7v4M6 17v-2h12v2"/></svg>
);
const DollarBadgeIcon = ({ size = 13, color = '#9ca3af' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
);
const ReceiptIcon = ({ size = 13, color = '#9ca3af' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="14" y2="13"/></svg>
);
const CommentBadgeIcon = ({ size = 12, color = '#9ca3af' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
);

function AssociationsPanel() {
  const [open, setOpen] = useState({ org: true, customer: true, job: true, materials: true, purchaseOrders: true, contract: true, workflow: true });
  const toggle = k => setOpen(p => ({ ...p, [k]: !p[k] }));
  const { linkedPos } = useContext(InheritanceContext);

  const SquareAvatar = ({ letter, size = 28 }) => (
    <div style={{ width: size, height: size, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 600, background: '#f3f4f6', color: '#6b7280', fontSize: 12 }}>{letter}</div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: 330, minWidth: 330, background: '#fff' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: '8px 16px 10px', minHeight: 46, boxSizing: 'border-box', borderBottom: '1px solid #e5e7eb' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#262626' }}>Associations</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AssocSection title="Organization" open={open.org} onToggle={() => toggle('org')}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SquareAvatar letter="A" />
              <span style={{ fontSize: 13, color: '#262626', fontWeight: 500 }}>ak org - same address1</span>
            </div>
            <AssocRow icon={<UserOutlineIcon />} text="2 Customers" />
            <AssocRow icon={<MapPin size={13} color="#9ca3af" />} text="Selvamathi farm resorts, Masinaikanpatti, Sa..." />
          </div>
        </AssocSection>
        <AssocSection title="Customer" open={open.customer} onToggle={() => toggle('customer')}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SquareAvatar letter="1" />
              <span style={{ fontSize: 13, color: '#262626', fontWeight: 500, flex: 1 }}>1 Arlene - 1 Klusman iOs</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 7px', border: '1px solid #e5e7eb', borderRadius: 10 }}>
                <CommentBadgeIcon /><span style={{ fontSize: 11, color: '#6b7280' }}>17</span>
              </span>
            </div>
            <AssocRow icon={<BuildingIcon size={13} color="#9ca3af" />} text="ak org - same address1" />
            <AssocRow icon={<HierarchyIcon />} text="Mobile Users - Zuper FSM" />
            <AssocRow icon={<DollarBadgeIcon />} text="Credits: $9,412.37" />
            <AssocRow icon={<ReceiptIcon />} text="Receivables: $1,55,271.42" />
          </div>
        </AssocSection>
        <AssocSection title="Job" open={open.job} onToggle={() => toggle('job')}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#f59e0b', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#262626' }}>Roof Inspection & Repair</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>#JOB-1042</div>
              </div>
              <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600, color: '#16a34a', background: '#dcfce7' }}>In Progress</span>
            </div>
          </div>
        </AssocSection>
        <AssocSection title="Material Requests" open={open.materials} onToggle={() => toggle('materials')}>
          <AssocEmpty text="No Material Requests" />
        </AssocSection>
        <AssocSection title="Purchase Orders" open={open.purchaseOrders} onToggle={() => toggle('purchaseOrders')}>
          {linkedPos.length === 0 ? (
            <AssocEmpty text="No Purchase Orders" />
          ) : (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 0, display: 'flex', flexDirection: 'column' }}>
              {linkedPos.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', borderTop: i === 0 ? 'none' : '1px solid #e5e7eb' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#262626' }}>{p.id}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: p.type === 'PO' ? '#fef3c7' : '#fee2e2', color: p.type === 'PO' ? '#854d0e' : '#991b1b', letterSpacing: '0.04em' }}>{p.type}</span>
                      <span title="Linked to this job via Inherit from menu" style={{ display: 'inline-flex', alignItems: 'center', color: '#1e40af' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{p.vendor} · ${p.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                  {(() => {
                    const s = p.status;
                    const palette = s === "Draft" ? { bg: "#f3f4f6", fg: "#6b7280" }
                      : s === "Submitted" ? { bg: "#dbeafe", fg: "#1e40af" }
                      : s === "Approved" ? { bg: "#dcfce7", fg: "#166534" }
                      : s === "Received" ? { bg: "#e0e7ff", fg: "#3730a3" }
                      : s === "Closed" ? { bg: "#e5e5e5", fg: "#4a4a46" }
                      : { bg: "#fef3c7", fg: "#854d0e" };
                    return <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600, color: palette.fg, background: palette.bg, flexShrink: 0 }}>{s}</span>;
                  })()}
                </div>
              ))}
            </div>
          )}
        </AssocSection>
        <AssocSection title="Contract" open={open.contract} onToggle={() => toggle('contract')}>
          <AssocEmpty text="No Contract Associated" />
        </AssocSection>
        <AssocSection title="Workflow Activity" open={open.workflow} onToggle={() => toggle('workflow')}>
          <AssocEmpty text="No Workflow Activity" />
        </AssocSection>
      </div>
    </div>
  );
}

/* ─── Notes Panel ─── */
function NotesPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 16px', height: 52, borderBottom: '1px solid #e5e7eb' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#262626' }}>Notes</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <span style={{ fontSize: 12, color: '#a3a3a3' }}>No notes yet</span>
      </div>
    </div>
  );
}

/* ─── Zuper Connect Panel ─── */
function ZuperConnectPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', height: 48, borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#262626' }}>Charles</span>
          <XIcon size={14} color="#a3a3a3" />
        </div>
        <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 500, color: '#fff', background: '#16a34a' }}>Sales</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 11, fontWeight: 500, color: '#262626' }}>Charles</span><span style={{ fontSize: 11, color: '#a3a3a3' }}>3:20 PM</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, background: '#fef2f2' }}>
          <PhoneIcon size={16} /><span style={{ fontSize: 12, fontWeight: 500, color: '#ef4444' }}>Missed Call</span>
        </div>
        <div><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}><span style={{ fontSize: 11, fontWeight: 500, color: '#262626' }}>Charles</span><span style={{ fontSize: 11, color: '#a3a3a3' }}>3:20 PM</span></div>
          <p style={{ fontSize: 12, color: '#262626', margin: 0 }}>Can you please update me?</p></div>
        <div style={{ background: '#2563eb', color: '#fff', borderRadius: '12px 12px 0 12px', padding: 12, marginLeft: 'auto', maxWidth: '85%', fontSize: 12, lineHeight: '18px' }}>Hey Mason, Please let me know your availability for Scheduling your Job?</div>
        {/* AI Summary */}
        <div style={{ borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: 'linear-gradient(169deg,#faf5ff,#eff6ff)', border: '1px solid #e9d4ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><SparkleIcon size={14} /><span style={{ fontSize: 12, fontWeight: 600, color: '#262626' }}>Call Summary</span></div>
            <span style={{ fontSize: 11, color: '#3b82f6', cursor: 'pointer' }}>View Transcript</span>
          </div>
          <p style={{ fontSize: 12, color: '#374151', lineHeight: '17px', margin: 0 }}>• Jason from CoralX Solutions confirmed the HVAC maintenance appointment with the customer.</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Chats Panel ─── */
function ChatsPanel() {
  const [subTab, setSubTab] = useState('messages');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexShrink: 0, padding: '12px 12px 0', borderBottom: '1px solid #e5e7eb' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#262626' }}>Chats</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
          {['Messages', 'Files', 'Pinned'].map(t => (
            <button key={t} onClick={() => setSubTab(t.toLowerCase())} style={{ paddingBottom: 8, borderBottom: '2px solid', borderColor: subTab === t.toLowerCase() ? '#333' : 'transparent', fontSize: 12, fontWeight: 500, color: subTab === t.toLowerCase() ? '#262626' : '#737373', background: 'none', border: 'none', borderBottomWidth: 2, borderBottomStyle: 'solid', cursor: 'pointer' }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {subTab === 'messages' && <>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div style={{ background: '#2563eb', color: '#fff', borderRadius: '12px 12px 0 12px', padding: 12, maxWidth: '85%', fontSize: 12, lineHeight: '18px' }}>Morning Mason! Just checking in did the shingles get delivered to the Pine Street site?</div></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><span style={{ fontSize: 10, color: '#a3a3a3' }}>3:00PM</span></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#d1d5db', flexShrink: 0, marginTop: 4 }} />
            <div style={{ background: '#f3f4f6', borderRadius: '12px 12px 12px 0', padding: 12, maxWidth: '85%', fontSize: 12, color: '#262626', lineHeight: '18px' }}>Yep, the delivery arrived around 8:15 AM. But we're missing 10 bundles of the WeatherGuard shingles.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ fontSize: 10, color: '#a3a3a3' }}>3:00PM</span><CheckCheckIcon /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0' }}><div style={{ flex: 1, height: 1, background: '#e5e5e5' }} /><span style={{ fontSize: 10, color: '#a3a3a3' }}>Today</span><div style={{ flex: 1, height: 1, background: '#e5e5e5' }} /></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#d1d5db', flexShrink: 0, marginTop: 4 }} />
            <div style={{ background: '#f3f4f6', borderRadius: '12px 12px 12px 0', padding: 12, maxWidth: '85%', fontSize: 12, color: '#262626', lineHeight: '18px' }}>Ah no, not again. I'll follow up with the supplier right away.</div>
          </div>
        </>}
        {subTab === 'files' && <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 12, color: '#a3a3a3' }}>No files shared yet</span></div>}
        {subTab === 'pinned' && <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 12, color: '#a3a3a3' }}>No pinned messages</span></div>}
      </div>
    </div>
  );
}

/* ─── Sense AI Panel ─── */
function SensePanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 12px', height: 48, borderBottom: '1px solid #e5e7eb' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Sense AI</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#faf5ff,#eff6ff)' }}><SparkleIcon size={24} /></div>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#262626' }}>Ask Sense about this job</span>
        <span style={{ fontSize: 12, color: '#737373', textAlign: 'center', maxWidth: 220 }}>Get instant AI-powered answers about job details, history, and recommendations.</span>
        <div style={{ width: '100%', marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
          <SparkleIcon size={14} color="#a3a3a3" />
          <input type="text" placeholder="Ask a question..." style={{ flex: 1, background: 'transparent', outline: 'none', border: 'none', fontSize: 12, color: '#262626' }} />
          <span style={{ cursor: 'pointer' }}><SendIcon /></span>
        </div>
      </div>
    </div>
  );
}

/* ─── Right Pane: Multi-panel with mini sidebar ─── */
function RightPane() {
  const [panel, setPanel] = useState('assoc');
  const [miniHovered, setMiniHovered] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const customizeRef = useRef(null);

  const defaultPanelItems = [
    { id: 'assoc', icon: 'link', label: 'Associations' },
    { id: 'notes', icon: 'note', label: 'Notes' },
    { id: 'history', icon: 'history', label: 'Activity History' },
    { id: 'connect', icon: 'phone', label: 'Zuper Connect' },
    { id: 'chats', icon: 'message', label: 'Chats' },
    { id: 'sense', icon: 'sparkle', label: 'Sense AI' },
  ];
  const [allPanels, setAllPanels] = useState(defaultPanelItems);
  const defaultRightState = { assoc: true, notes: true, history: true, connect: true, chats: true, sense: true };
  const [rightState, setRightState] = useState(defaultRightState);
  const visiblePanels = allPanels.filter(p => rightState[p.id] !== false);

  useEffect(() => {
    const h = e => { if (customizeRef.current && !customizeRef.current.contains(e.target)) setShowCustomize(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const showGear = miniHovered || showCustomize;

  const iconMap = {
    history: ClockIcon,
    link: LinkIcon,
    note: FileTextIcon,
    phone: PhoneIcon,
    message: MessageIcon,
    sparkle: SparkleIcon,
  };

  return (
    <div className="shell-right" style={{ display: 'flex', flexShrink: 0, height: '100%', borderLeft: '1px solid #e5e5e5' }}>
      {/* Panel content */}
      <div key={panel} style={{ width: 330, minWidth: 330, background: '#fff', borderRight: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fadeSlideIn 180ms cubic-bezier(0.23,1,0.32,1) both' }}>
        {panel === 'history' && <StatusHistoryPanel />}
        {panel === 'assoc' && <AssociationsPanel />}
        {panel === 'notes' && <NotesPanel />}
        {panel === 'connect' && <ZuperConnectPanel />}
        {panel === 'chats' && <ChatsPanel />}
        {panel === 'sense' && <SensePanel />}
      </div>

      {/* Mini sidebar */}
      <div style={{ width: 46, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 12, flexShrink: 0 }}
        onMouseEnter={() => setMiniHovered(true)} onMouseLeave={() => setMiniHovered(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {visiblePanels.map((p, i) => {
            const Icon = iconMap[p.icon];
            return (
              <Fragment key={p.id}>
                {i === 1 && <div style={{ width: 20, height: 1, background: '#e5e5e5', margin: '2px 0' }} />}
                <button onClick={() => setPanel(p.id)} title={p.label} style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: panel === p.id ? '#e4d9c8' : 'transparent', transition: 'background 120ms ease' }}>
                  <Icon size={16} color={panel === p.id ? '#5c4a1e' : '#a3a3a3'} />
                </button>
                {i === 0 && <div style={{ width: 20, height: 1, background: '#e5e5e5', margin: '2px 0' }} />}
              </Fragment>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div ref={customizeRef} style={{ position: 'relative', opacity: showGear ? 1 : 0, transition: 'opacity 150ms ease', pointerEvents: showGear ? 'auto' : 'none' }}>
            <button onClick={() => setShowCustomize(p => !p)} title="Customize panels" style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: showCustomize ? '#e4d9c8' : 'transparent' }}>
              <SettingsIcon size={14} color={showCustomize ? '#5c4a1e' : '#737373'} />
            </button>
            {showCustomize && (
              <div style={{ position: 'absolute', bottom: 0, right: '100%', marginRight: 8, zIndex: 50 }}>
                <CustomizePanel title="Customize Panels" items={allPanels} state={rightState}
                  onToggle={id => setRightState(p => ({ ...p, [id]: p[id] === false ? true : false }))}
                  onReorder={setAllPanels}
                  onReset={() => { setAllPanels(defaultPanelItems); setRightState(defaultRightState); }}
                  onClose={() => setShowCustomize(false)} />
              </div>
            )}
          </div>
          <button style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: 'transparent' }}>
            <PanelRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Quote lookup for URL routing ─── */
const QUOTES_DATA = [
  { id: 'QT-1024', title: 'Roof Replacement — Full', customer: 'Telnet Industries', date: 'Oct 3, 2025', rawDate: '2025-10-03', validUntil: 'Nov 15, 2025', rawValidUntil: '2025-11-15', amount: '$8,450.00', status: 'Accepted', statusBg: '#dcfce7', statusColor: '#16a34a', type: 'quote' },
  { id: 'QT-1019', title: 'Gutter Install + Flashing', customer: 'Telnet Industries', date: 'Sep 18, 2025', rawDate: '2025-09-18', validUntil: 'Oct 18, 2025', rawValidUntil: '2025-10-18', amount: '$2,340.00', status: 'Sent', statusBg: '#dbeafe', statusColor: '#2563eb', type: 'quote' },
  { id: 'QT-1015', title: 'Emergency Leak Repair', customer: 'Telnet Industries', date: 'Sep 5, 2025', rawDate: '2025-09-05', validUntil: 'Oct 5, 2025', rawValidUntil: '2025-10-05', amount: '$1,125.00', status: 'Expired', statusBg: '#fef3c7', statusColor: '#d97706', type: 'quote' },
  { id: 'INV-2048', title: 'Roof Replacement — Deposit', customer: 'Telnet Industries', date: 'Oct 10, 2025', rawDate: '2025-10-10', validUntil: 'Nov 10, 2025', rawValidUntil: '2025-11-10', amount: '$4,225.00', status: 'Record Payment', statusBg: '#dcfce7', statusColor: '#15803d', type: 'invoice' },
  { id: 'INV-2052', title: 'Gutter Install — Final', customer: 'Telnet Industries', date: 'Oct 22, 2025', rawDate: '2025-10-22', validUntil: 'Nov 22, 2025', rawValidUntil: '2025-11-22', amount: '$2,340.00', status: 'Draft', statusBg: '#f3f4f6', statusColor: '#6b7280', type: 'invoice' },
  { id: 'QT-1008', title: 'Skylight Addition Estimate', customer: 'Telnet Industries', date: 'Aug 28, 2025', rawDate: '2025-08-28', validUntil: 'Sep 28, 2025', rawValidUntil: '2025-09-28', amount: '$3,680.00', status: 'Draft', statusBg: '#f3f4f6', statusColor: '#6b7280', type: 'quote' },
  { id: 'PRO-3001', title: 'Roof Replacement — Tiered Proposal', customer: 'Telnet Industries', date: 'Oct 1, 2025', rawDate: '2025-10-01', validUntil: 'Nov 1, 2025', rawValidUntil: '2025-11-01', amount: '$8,450 — $24,180', status: 'Sent', statusBg: '#dbeafe', statusColor: '#2563eb', type: 'proposal' },
];

function parseHash() {
  const h = window.location.hash.replace('#', '');
  if (h === 'quote/new') return { mode: 'create' };
  const [type, id] = h.split('/');
  if ((type === 'quote' || type === 'invoice' || type === 'proposal') && id) {
    const q = QUOTES_DATA.find(x => x.id === id && x.type === type);
    if (q) return { mode: 'edit', quote: q };
  }
  return null;
}

/* ─── Shell (3-pane layout) ─── */
export default function Shell() {
  const [quotePage, setQuotePage] = useState(() => parseHash());
  const [devFlags, setDevFlags] = useState({ hideDescription: false });
  const toggleDevFlag = id => setDevFlags(p => ({ ...p, [id]: !p[id] }));
  const [linkedQuotes, setLinkedQuotes] = useState([]);
  const [linkedPos, setLinkedPos] = useState([]);
  const inheritanceValue = useMemo(() => ({ linkedQuotes, linkedPos, setLinkedQuotes, setLinkedPos }), [linkedQuotes, linkedPos]);

  const skipHashSync = useRef(false);

  const navigateQuote = (val) => {
    skipHashSync.current = true;
    if (val) {
      const id = val.mode === 'create' ? 'new' : val.quote?.id;
      const prefix = val.mode === 'create' ? 'quote' : (val.quote?.type || 'quote');
      window.location.hash = id ? `${prefix}/${id}` : '';
    } else {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
    setQuotePage(val);
  };

  useEffect(() => {
    const onHash = () => {
      if (skipHashSync.current) { skipHashSync.current = false; return; }
      setQuotePage(parseHash());
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const providerValue = { flags: devFlags, toggle: toggleDevFlag };

  const contentCardStyle = { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fff", borderRadius: "16px 16px 0 0", margin: "0 8px 0 0", border: "1px solid #e5e5e5", borderBottom: "none", boxShadow: "0 -1px 8px rgba(0,0,0,0.04), 0 2px 16px rgba(0,0,0,0.06)" };

  return (
    <DevFlagsContext.Provider value={providerValue}>
    <InheritanceContext.Provider value={inheritanceValue}>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#f8f5f0" }}>
        <TopNavBar />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <AppSidebar />
          <div style={contentCardStyle}>
            {quotePage ? (
              quotePage.mode === 'edit' && quotePage.quote?.type === 'proposal' ? (
                <ProposalPage
                  key={`proposal-${quotePage.quote.id}`}
                  proposal={quotePage.quote}
                  onBack={() => navigateQuote(null)}
                />
              ) : (
                <QuotePage
                  key={quotePage.mode === 'edit' ? `${quotePage.quote?.type}-${quotePage.quote?.id}` : 'quote-new'}
                  quote={quotePage.mode === 'edit' ? quotePage.quote : null}
                  onBack={() => navigateQuote(null)}
                />
              )
            ) : (
              <>
                <BreadcrumbHeader />
                <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
                  <LeftPane />
                  <div className="shell-center" style={{ display: 'flex', flex: 1, minWidth: 0, minHeight: 0, overflow: "hidden", height: "100%" }}>
                    <CenterPane
                      onOpenQuote={q => navigateQuote({ mode: 'edit', quote: q })}
                      onNewQuote={() => navigateQuote({ mode: 'create' })}
                    />
                  </div>
                  <RightPane />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </InheritanceContext.Provider>
    </DevFlagsContext.Provider>
  );
}
