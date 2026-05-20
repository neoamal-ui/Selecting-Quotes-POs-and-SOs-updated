import React, { useState, useMemo, forwardRef, useRef, useEffect, Fragment, useContext } from "react";
import { createPortal } from "react-dom";
import { DevFlagsContext } from "./Shell.jsx";

const Table = forwardRef(({ style, ...props }, ref) => (
  <table ref={ref} style={{ captionSide: "bottom", fontSize: 14, ...style }} {...props} />
));
const TableHeader = forwardRef((props, ref) => (
  <thead ref={ref} {...props} />
));
const TableBody = forwardRef((props, ref) => (
  <tbody ref={ref} {...props} />
));
const TableRow = forwardRef(({ style, hoverBg = true, ...props }, ref) => {
  const [hovered, setHovered] = useState(false);
  return (
    <tr ref={ref}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: "1px solid #e8e7e2", transition: "background 0.15s", background: hoverBg && hovered ? "rgba(249,249,247,0.5)" : undefined, ...style }}
      {...props} />
  );
});
const TableHead = forwardRef(({ style, ...props }, ref) => (
  <th ref={ref} style={{ height: 36, textAlign: "left", verticalAlign: "middle", fontWeight: 500, color: "#8c8b86", ...style }} {...props} />
));
const TableCell = forwardRef(({ style, ...props }, ref) => (
  <td ref={ref} style={{ verticalAlign: "middle", ...style }} {...props} />
));

const ALL_PARTS = [
  { id: "TO-001", name: "Tear-off — existing 2-layer roof", type: "SVC", group: "Tear-off & disposal", qty: 28, unit: "sq", unitCost: 45, unitPrice: 210, billable: true, notes: "Entire existing roof to be removed down to decking. Two layers confirmed during inspection.", thumb: "tearoff", description: "Complete removal of existing 2-layer asphalt roof down to deck sheathing", sku: "SVC-TEAR-2L" },
  { id: "TO-002", name: "Dumpster rental — 30 yd", type: "EQ", group: "Tear-off & disposal", qty: 2, unit: "ea", unitCost: 425, unitPrice: 1050, billable: true, notes: null, thumb: "dumpster", description: "30-yard roll-off dumpster for roofing debris", sku: "EQ-DUMP-30" },
  { id: "TO-003", name: "Dump fees & haul-away", type: "SVC", group: "Tear-off & disposal", qty: 1, unit: "lot", unitCost: 680, unitPrice: 1680, billable: true, notes: null, thumb: "truck", description: "Disposal and transport fees for roofing waste", sku: "SVC-HAUL-01" },
  { id: "RF-101", name: "GAF Timberline HDZ — Charcoal", type: "MAT", group: "Roofing materials", qty: 31, unit: "sq", unitCost: 112, unitPrice: 385, billable: true, notes: "3 squares overage for waste/cuts.", thumb: "shingle", pricelist: "Preferred Contractor Rates", financing: "6-month installment", description: "Architectural laminate shingle, Charcoal colorway, lifetime warranty", sku: "GAF-HDZ-CHAR" },
  { id: "RF-102", name: "Synthetic underlayment — FeltBuster", type: "MAT", group: "Roofing materials", qty: 10, unit: "roll", unitCost: 64, unitPrice: 195, billable: true, notes: null, thumb: "roll", pricelist: "Preferred Contractor Rates", description: "High-traction synthetic roof underlayment, 10 sq per roll", sku: "UND-FB-10SQ" },
  { id: "RF-103", name: "Ice & water shield — 36 in", type: "MAT", group: "Roofing materials", qty: 6, unit: "roll", unitCost: 95, unitPrice: 305, billable: true, notes: "Valleys, eaves, and around all penetrations.", thumb: "roll", pricelist: "Preferred Contractor Rates", description: "Self-adhering waterproofing membrane, 36\" wide", sku: "IWS-36-SA" },
  { id: "RF-104", name: "Coil nails — 1¼ in galvanized", type: "MAT", group: "Roofing materials", qty: 4, unit: "box", unitCost: 42, unitPrice: 115, billable: true, notes: null, thumb: "nails", description: "Hot-dipped galvanized coil nails for pneumatic nailer", sku: "NL-COIL-125G" },
  { id: "RF-105", name: "Starter strip shingles", type: "MAT", group: "Roofing materials", qty: 8, unit: "bdl", unitCost: 28, unitPrice: 88, billable: true, notes: null, thumb: "shingle", description: "Pre-cut starter strip for eave and rake edges", sku: "SH-START-01" },
  { id: "FL-201", name: "Drip edge — aluminum, white", type: "MAT", group: "Flashing & trim", qty: 24, unit: "pc", unitCost: 8.5, unitPrice: 30, billable: true, notes: null, thumb: "drip", description: "Type D aluminum drip edge, white finish, 10 ft", sku: "FL-DRIP-WH" },
  { id: "FL-202", name: "Step flashing — 4×4 galv", type: "MAT", group: "Flashing & trim", qty: 50, unit: "pc", unitCost: 1.75, unitPrice: 7.5, billable: true, notes: null, thumb: "flash", description: "Pre-bent galvanized step flashing, 4×4 in", sku: "FL-STEP-4G" },
  { id: "FL-203", name: "Pipe boot — 2 in neoprene", type: "MAT", group: "Flashing & trim", qty: 3, unit: "ea", unitCost: 12, unitPrice: 52, billable: true, notes: null, thumb: "boot", financing: "6-month installment", description: "Neoprene pipe boot flashing for 2\" vent pipe", sku: "FL-BOOT-2N" },
  { id: "FL-204", name: "Chimney flashing kit — lead/alum", type: "MAT", group: "Flashing & trim", qty: 1, unit: "kit", unitCost: 185, unitPrice: 775, billable: true, notes: "Two-piece counter-flashing. Cricket to be rebuilt.", thumb: "chimney", description: "Two-piece lead/aluminum chimney flashing kit with cricket", sku: "FL-CHIM-KIT" },
  { id: "VN-301", name: "Ridge vent — shingle-over, 4 ft", type: "MAT", group: "Ventilation", qty: 10, unit: "pc", unitCost: 18, unitPrice: 65, billable: true, notes: null, thumb: "vent", description: "Low-profile shingle-over ridge vent, 4 ft section", sku: "VN-RIDGE-4" },
  { id: "VN-302", name: "Soffit vent — 8×16 aluminum", type: "MAT", group: "Ventilation", qty: 6, unit: "ea", unitCost: 14, unitPrice: 56, billable: true, notes: "Verify 1:150 NFA ratio.", thumb: "vent", description: "Under-eave aluminum soffit vent, 8×16 in", sku: "VN-SOFF-816" },
  { id: "MS-401", name: "Permit & final inspection", type: "SVC", group: "Misc & inspection", qty: 1, unit: "ea", unitCost: 350, unitPrice: 0, billable: false, notes: null, thumb: "permit", description: "Building permit and municipal final inspection fee", sku: null },
  { id: "MS-402", name: "Tarps & exterior protection", type: "MAT", group: "Misc & inspection", qty: 1, unit: "lot", unitCost: 120, unitPrice: 0, billable: false, notes: "Home exterior and driveway protection during tear-off.", thumb: "tarp", description: "Protective tarps for landscaping, driveway, and siding", sku: null },
];
const ALL_LABOR = [
  { id: "LAB-01", name: "Crew labor — tear-off (4 crew)", hours: 14, rate: 48, total: 2688 },
  { id: "LAB-02", name: "Crew labor — install (4 crew)", hours: 20, rate: 48, total: 3840 },
  { id: "LAB-03", name: "Foreman", hours: 8, rate: 65, total: 520 },
];
const ALL_EXPENSES = [
  { id: "EXP-01", name: "Dumpster overage charge", category: "Disposal", date: "Oct 18, 2024", amount: 275, receipt: true, notes: "Extra haul for second dumpster load" },
  { id: "EXP-02", name: "Emergency tarp — storm delay", category: "Weather protection", date: "Oct 15, 2024", amount: 185, receipt: true, notes: null },
  { id: "EXP-03", name: "Chimney cricket lumber", category: "Materials", date: "Oct 17, 2024", amount: 142, receipt: true, notes: "2×4 and plywood for cricket rebuild" },
  { id: "EXP-04", name: "Crew fuel reimbursement", category: "Travel", date: "Oct 14, 2024", amount: 96, receipt: false, notes: null },
  { id: "EXP-05", name: "Permit expedite fee", category: "Permits", date: "Oct 10, 2024", amount: 75, receipt: true, notes: "Rush processing for city inspection" },
];
const ALL_COMMISSIONS = [
  { id: "COM-01", name: "Jake Morrison — sales", role: "Sales rep", rate: 8, basis: "revenue", amount: 2364.08 },
  { id: "COM-02", name: "Maria Chen — referral", role: "Referral partner", rate: 3, basis: "revenue", amount: 886.53 },
  { id: "COM-03", name: "Tom Bradley — project lead", role: "PM bonus", rate: 5, basis: "profit", amount: 669.63 },
];
const CATALOG_ITEMS = [
  // Tear-off & disposal
  { catalogId: "C-TO-001", name: "Tear-off — single layer", type: "SVC", group: "Tear-off & disposal", defaultUnit: "sq", defaultUnitCost: 38, defaultUnitPrice: 175, thumb: "tearoff", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-TO-002", name: "Tear-off — 2-layer roof", type: "SVC", group: "Tear-off & disposal", defaultUnit: "sq", defaultUnitCost: 45, defaultUnitPrice: 210, thumb: "tearoff", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-TO-003", name: "Dumpster rental — 20 yd", type: "EQ", group: "Tear-off & disposal", defaultUnit: "ea", defaultUnitCost: 325, defaultUnitPrice: 800, thumb: "dumpster", location: "Vendor", availability: "On request" },
  { catalogId: "C-TO-004", name: "Dumpster rental — 30 yd", type: "EQ", group: "Tear-off & disposal", defaultUnit: "ea", defaultUnitCost: 425, defaultUnitPrice: 1050, thumb: "dumpster", location: "Vendor", availability: "On request" },
  { catalogId: "C-TO-005", name: "Dump fees & haul-away", type: "SVC", group: "Tear-off & disposal", defaultUnit: "lot", defaultUnitCost: 680, defaultUnitPrice: 1680, thumb: "truck", location: "Vendor", availability: "In stock" },
  // Roofing materials
  { catalogId: "C-RF-101", name: "GAF Timberline HDZ — Charcoal", type: "MAT", group: "Roofing materials", defaultUnit: "sq", defaultUnitCost: 112, defaultUnitPrice: 385, thumb: "shingle", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-RF-102", name: "Synthetic underlayment — FeltBuster", type: "MAT", group: "Roofing materials", defaultUnit: "roll", defaultUnitCost: 64, defaultUnitPrice: 195, thumb: "roll", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-RF-103", name: "Ice & water shield — 36 in", type: "MAT", group: "Roofing materials", defaultUnit: "roll", defaultUnitCost: 95, defaultUnitPrice: 305, thumb: "roll", location: "Warehouse", availability: "Low stock" },
  { catalogId: "C-RF-104", name: "Coil nails — 1¼ in galvanized", type: "MAT", group: "Roofing materials", defaultUnit: "box", defaultUnitCost: 42, defaultUnitPrice: 115, thumb: "nails", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-RF-105", name: "Starter strip shingles", type: "MAT", group: "Roofing materials", defaultUnit: "bdl", defaultUnitCost: 28, defaultUnitPrice: 88, thumb: "shingle", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-RF-106", name: "Hip & ridge cap shingles", type: "MAT", group: "Roofing materials", defaultUnit: "bdl", defaultUnitCost: 34, defaultUnitPrice: 105, thumb: "shingle", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-RF-107", name: "Roofing cement — 10 oz tube", type: "MAT", group: "Roofing materials", defaultUnit: "ea", defaultUnitCost: 6, defaultUnitPrice: 18, thumb: "nails", location: "Job site", availability: "In stock" },
  // Flashing & trim
  { catalogId: "C-FL-201", name: "Drip edge — aluminum, white", type: "MAT", group: "Flashing & trim", defaultUnit: "pc", defaultUnitCost: 8.5, defaultUnitPrice: 30, thumb: "drip", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-FL-202", name: "Step flashing — 4×4 galv", type: "MAT", group: "Flashing & trim", defaultUnit: "pc", defaultUnitCost: 1.75, defaultUnitPrice: 7.5, thumb: "flash", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-FL-203", name: "Pipe boot — 2 in neoprene", type: "MAT", group: "Flashing & trim", defaultUnit: "ea", defaultUnitCost: 12, defaultUnitPrice: 52, thumb: "boot", location: "Warehouse", availability: "Low stock" },
  { catalogId: "C-FL-204", name: "Chimney flashing kit — lead/alum", type: "MAT", group: "Flashing & trim", defaultUnit: "kit", defaultUnitCost: 185, defaultUnitPrice: 775, thumb: "chimney", location: "Vendor", availability: "On request" },
  { catalogId: "C-FL-205", name: "Valley flashing — W-style", type: "MAT", group: "Flashing & trim", defaultUnit: "pc", defaultUnitCost: 14, defaultUnitPrice: 48, thumb: "flash", location: "Warehouse", availability: "In stock" },
  // Ventilation
  { catalogId: "C-VN-301", name: "Ridge vent — shingle-over, 4 ft", type: "MAT", group: "Ventilation", defaultUnit: "pc", defaultUnitCost: 18, defaultUnitPrice: 65, thumb: "vent", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-VN-302", name: "Soffit vent — 8×16 aluminum", type: "MAT", group: "Ventilation", defaultUnit: "ea", defaultUnitCost: 14, defaultUnitPrice: 56, thumb: "vent", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-VN-303", name: "Turbine vent — 12 in", type: "MAT", group: "Ventilation", defaultUnit: "ea", defaultUnitCost: 35, defaultUnitPrice: 120, thumb: "vent", location: "Job site", availability: "In stock" },
  { catalogId: "C-VN-304", name: "Power attic fan — solar", type: "EQ", group: "Ventilation", defaultUnit: "ea", defaultUnitCost: 280, defaultUnitPrice: 650, thumb: "vent", location: "Vendor", availability: "On request" },
  // Gutters & drainage
  { catalogId: "C-GT-401", name: "Seamless gutter — 5 in aluminum", type: "MAT", group: "Gutters & drainage", defaultUnit: "ft", defaultUnitCost: 6, defaultUnitPrice: 18, thumb: "drip", location: "Vendor", availability: "In stock" },
  { catalogId: "C-GT-402", name: "Downspout — 2×3 aluminum", type: "MAT", group: "Gutters & drainage", defaultUnit: "pc", defaultUnitCost: 12, defaultUnitPrice: 38, thumb: "drip", location: "Vendor", availability: "In stock" },
  { catalogId: "C-GT-403", name: "Gutter guard — mesh, 4 ft", type: "MAT", group: "Gutters & drainage", defaultUnit: "pc", defaultUnitCost: 8, defaultUnitPrice: 24, thumb: "drip", location: "Warehouse", availability: "Low stock" },
  // Misc & inspection
  { catalogId: "C-MS-501", name: "Permit & final inspection", type: "SVC", group: "Misc & inspection", defaultUnit: "ea", defaultUnitCost: 350, defaultUnitPrice: 0, thumb: "permit", location: "Job site", availability: "In stock" },
  { catalogId: "C-MS-502", name: "Tarps & exterior protection", type: "MAT", group: "Misc & inspection", defaultUnit: "lot", defaultUnitCost: 120, defaultUnitPrice: 0, thumb: "tarp", location: "Warehouse", availability: "In stock" },
  { catalogId: "C-MS-503", name: "Drone roof inspection", type: "SVC", group: "Misc & inspection", defaultUnit: "ea", defaultUnitCost: 150, defaultUnitPrice: 395, thumb: "permit", location: "Job site", availability: "On request" },
];
const CATALOG_GROUPS = [...new Set(CATALOG_ITEMS.map(i => i.group))];
const UNIT_LABELS = { sq: "sqft", ea: "item", roll: "roll", box: "box", bdl: "bundle", pc: "piece", kit: "kit", lot: "lot", ft: "ft" };

const CATALOG_BUNDLES = [
  {
    bundleId: "BDL-001",
    name: "Complete tear-off & replace",
    description: "Full roof tear-off with disposal, new shingles, underlayment, and fasteners",
    thumb: "tearoff",
    defaultUnitPrice: 8200,
    defaultUnitCost: 3480,
    items: [
      { catalogId: "C-TO-002", name: "Tear-off — 2-layer roof", type: "SVC", qty: 28, unit: "sq", unitCost: 45, unitPrice: 210 },
      { catalogId: "C-TO-004", name: "Dumpster rental — 30 yd", type: "EQ", qty: 1, unit: "ea", unitCost: 425, unitPrice: 1050 },
      { catalogId: "C-TO-005", name: "Dump fees & haul-away", type: "SVC", qty: 1, unit: "lot", unitCost: 680, unitPrice: 1680 },
      { catalogId: "C-RF-101", name: "GAF Timberline HDZ — Charcoal", type: "MAT", qty: 31, unit: "sq", unitCost: 112, unitPrice: 385 },
      { catalogId: "C-RF-102", name: "Synthetic underlayment — FeltBuster", type: "MAT", qty: 10, unit: "roll", unitCost: 64, unitPrice: 195 },
      { catalogId: "C-RF-104", name: "Coil nails — 1¼ in galvanized", type: "MAT", qty: 4, unit: "box", unitCost: 42, unitPrice: 115 },
    ],
  },
  {
    bundleId: "BDL-002",
    name: "Flashing & ventilation package",
    description: "Drip edge, step flashing, pipe boots, ridge vent, and soffit vents for a standard residential roof",
    thumb: "flash",
    defaultUnitPrice: 2840,
    defaultUnitCost: 695,
    items: [
      { catalogId: "C-FL-201", name: "Drip edge — aluminum, white", type: "MAT", qty: 24, unit: "pc", unitCost: 8.5, unitPrice: 30 },
      { catalogId: "C-FL-202", name: "Step flashing — 4×4 galv", type: "MAT", qty: 50, unit: "pc", unitCost: 1.75, unitPrice: 7.5 },
      { catalogId: "C-FL-203", name: "Pipe boot — 2 in neoprene", type: "MAT", qty: 3, unit: "ea", unitCost: 12, unitPrice: 52 },
      { catalogId: "C-VN-301", name: "Ridge vent — shingle-over, 4 ft", type: "MAT", qty: 10, unit: "pc", unitCost: 18, unitPrice: 65 },
      { catalogId: "C-VN-302", name: "Soffit vent — 8×16 aluminum", type: "MAT", qty: 6, unit: "ea", unitCost: 14, unitPrice: 56 },
    ],
  },
  {
    bundleId: "BDL-003",
    name: "Gutters & downspout kit",
    description: "Complete seamless gutter system with downspouts, hangers, and end caps for standard residential home",
    thumb: "drip",
    defaultUnitPrice: 3150,
    defaultUnitCost: 1240,
    items: [
      { catalogId: "C-GT-001", name: "Seamless gutter — 5 in aluminum", type: "MAT", qty: 140, unit: "ft", unitCost: 4.5, unitPrice: 12 },
      { catalogId: "C-GT-002", name: "Downspout — 2×3 in aluminum", type: "MAT", qty: 6, unit: "ea", unitCost: 28, unitPrice: 75 },
      { catalogId: "C-GT-003", name: "Gutter hanger — hidden", type: "MAT", qty: 45, unit: "ea", unitCost: 3.5, unitPrice: 9 },
      { catalogId: "C-GT-004", name: "End cap & outlet", type: "MAT", qty: 8, unit: "ea", unitCost: 6, unitPrice: 18 },
    ],
  },
];

const QUOTES = [
  { id: "Q-1041", name: "Original estimate", date: "Sep 14, 2024", status: "Approved", revenue: 28500, cogs: 16000, profit: 12500, materials: 8800, labor: 7200 },
  { id: "Q-1041-R1", name: "Rev 1 — chimney reflash", date: "Sep 22, 2024", status: "Approved", revenue: 30200, cogs: 16800, profit: 13400, materials: 9400, labor: 7400 },
  { id: "Q-1041-R2", name: "Rev 2 — HDZ upgrade", date: "Oct 3, 2024", status: "Sent", revenue: 31500, cogs: 17400, profit: 14100, materials: 10000, labor: 7400 },
];

// Accepted quotes available to inherit from (no invoice, not associated to other jobs)
const ACCEPTED_QUOTES = [
  {
    id: "Q-2104", title: "Premium gutter package", date: "Oct 8, 2024", value: 4820, status: "Accepted",
    items: [
      { name: "Seamless gutter — 5 in aluminum", type: "MAT", group: "Gutters & drainage", qty: 120, unit: "ft", unitCost: 6, unitPrice: 18, billable: true, description: "Continuous seamless aluminum gutter, front + back elevations", sku: "GT-SEAM-5AL" },
      { name: "Downspout — 2×3 aluminum", type: "MAT", group: "Gutters & drainage", qty: 8, unit: "pc", unitCost: 12, unitPrice: 38, billable: true, description: "Pre-cut downspout assemblies with elbows", sku: "GT-DS-23AL" },
      { name: "Gutter guard — mesh, 4 ft", type: "MAT", group: "Gutters & drainage", qty: 30, unit: "pc", unitCost: 8, unitPrice: 24, billable: true, description: "Stainless micromesh leaf guard", sku: "GT-GRD-MSH" },
      { name: "Gutter install — labor", type: "SVC", group: "Gutters & drainage", qty: 1, unit: "lot", unitCost: 480, unitPrice: 920, billable: true, description: "Crew install of gutters and downspouts", sku: "SVC-GT-INST" },
    ],
  },
  {
    id: "Q-2118", title: "Skylight retrofit add-on", date: "Oct 14, 2024", value: 2980, status: "Accepted",
    items: [
      { name: "Velux fixed deck-mount skylight", type: "MAT", group: "Skylights", qty: 2, unit: "ea", unitCost: 410, unitPrice: 880, billable: true, description: "FCM 2246 deck-mount skylight, tempered low-E glass", sku: "VLX-FCM-2246" },
      { name: "Skylight flashing kit", type: "MAT", group: "Skylights", qty: 2, unit: "kit", unitCost: 95, unitPrice: 220, billable: true, description: "EDL flashing kit for FCM 2246", sku: "VLX-EDL-2246" },
      { name: "Skylight install — labor", type: "SVC", group: "Skylights", qty: 1, unit: "lot", unitCost: 380, unitPrice: 740, billable: true, description: "Cut-in, frame, flash, and finish", sku: "SVC-SKY-INST" },
    ],
  },
  {
    id: "Q-2125", title: "Attic ventilation upgrade", date: "Oct 19, 2024", value: 1640, status: "Accepted",
    items: [
      { name: "Power attic fan — solar", type: "EQ", group: "Ventilation", qty: 1, unit: "ea", unitCost: 280, unitPrice: 650, billable: true, description: "Solar-powered attic exhaust fan, 30W panel", sku: "VN-FAN-SOL" },
      { name: "Soffit vent — 8×16 aluminum", type: "MAT", group: "Ventilation", qty: 8, unit: "ea", unitCost: 14, unitPrice: 56, billable: true, description: "Under-eave aluminum soffit vent", sku: "VN-SOFF-816" },
      { name: "Ventilation install — labor", type: "SVC", group: "Ventilation", qty: 1, unit: "lot", unitCost: 240, unitPrice: 540, billable: true, description: "Cut-in, mount, and wire attic fan + soffit vents", sku: "SVC-VN-INST" },
    ],
  },
];

// Submitted POs available to inherit from (active, not cancelled/archived, not associated to other jobs)
const SUBMITTED_POS = [
  {
    id: "PO-3041", type: "PO", title: "Roofing materials — GAF supplier", date: "Oct 12, 2024", value: 4275, status: "Submitted", vendor: "ABC Building Supply",
    items: [
      { name: "GAF Timberline HDZ — Charcoal", type: "MAT", group: "Roofing materials", qty: 31, unit: "sq", unitCost: 108, unitPrice: 385, billable: true, description: "Architectural shingle (received price)", sku: "GAF-HDZ-CHAR" },
      { name: "Synthetic underlayment — FeltBuster", type: "MAT", group: "Roofing materials", qty: 10, unit: "roll", unitCost: 62, unitPrice: 195, billable: true, description: "High-traction synthetic underlayment", sku: "UND-FB-10SQ" },
      { name: "Ice & water shield — 36 in", type: "MAT", group: "Roofing materials", qty: 6, unit: "roll", unitCost: 92, unitPrice: 305, billable: true, description: "Self-adhering waterproofing membrane", sku: "IWS-36-SA" },
    ],
  },
  {
    id: "PO-3055", type: "PO", title: "Flashing & trim restock", date: "Oct 16, 2024", value: 1180, status: "Submitted", vendor: "Metro Roofing Supply",
    items: [
      { name: "Drip edge — aluminum, white", type: "MAT", group: "Flashing & trim", qty: 24, unit: "pc", unitCost: 8.25, unitPrice: 30, billable: true, description: "Type D aluminum drip edge", sku: "FL-DRIP-WH" },
      { name: "Step flashing — 4×4 galv", type: "MAT", group: "Flashing & trim", qty: 50, unit: "pc", unitCost: 1.65, unitPrice: 7.5, billable: true, description: "Pre-bent galvanized step flashing", sku: "FL-STEP-4G" },
      { name: "Chimney flashing kit — lead/alum", type: "MAT", group: "Flashing & trim", qty: 1, unit: "kit", unitCost: 178, unitPrice: 775, billable: true, description: "Two-piece chimney flashing kit", sku: "FL-CHIM-KIT" },
    ],
  },
  {
    id: "SO-4012", type: "SO", title: "Tear-off subcontractor", date: "Oct 10, 2024", value: 2400, status: "Submitted", vendor: "Apex Demolition LLC",
    items: [
      { name: "Tear-off labor — 2-layer", type: "SVC", group: "Tear-off & disposal", qty: 28, unit: "sq", unitCost: 42, unitPrice: 210, billable: true, description: "Subcontracted tear-off crew, 2-layer roof", sku: "SVC-TEAR-2L" },
      { name: "Haul-away & dump fees", type: "SVC", group: "Tear-off & disposal", qty: 1, unit: "lot", unitCost: 640, unitPrice: 1680, billable: true, description: "Disposal and transport via subcontractor", sku: "SVC-HAUL-01" },
    ],
  },
  {
    id: "SO-4025", type: "SO", title: "Chimney mason subcontractor", date: "Oct 17, 2024", value: 1450, status: "Submitted", vendor: "Hearth & Stone Masonry",
    items: [
      { name: "Chimney cricket rebuild — labor", type: "SVC", group: "Flashing & trim", qty: 1, unit: "lot", unitCost: 720, unitPrice: 1450, billable: true, description: "Subcontracted mason for cricket rebuild and reflashing", sku: "SVC-CHIM-MSN" },
    ],
  },
];
const SUBMITTED_SOS = SUBMITTED_POS.filter(p => p.type === "SO");
const PRICELISTS = [
  { id: "default", name: "Standard pricing" },
  { id: "preferred", name: "Preferred customer" },
  { id: "insurance", name: "Insurance rate schedule" },
];
const FINANCING_OPTIONS = [
  { id: "net", name: "Net Terms", icon: "calendar", color: "#3b82f6", children: [
    { id: "net15", name: "Net 15" },
    { id: "net30", name: "Net 30" },
    { id: "net45", name: "Net 45" },
    { id: "net60", name: "Net 60" },
  ]},
  { id: "installment", name: "Installment Plan", icon: "split", color: "#8b5cf6", children: [
    { id: "installment3", name: "3-month installment" },
    { id: "installment6", name: "6-month installment" },
    { id: "installment12", name: "12-month installment" },
    { id: "installment24", name: "24-month installment" },
  ]},
  { id: "deferred", name: "Deferred Payment", icon: "clock", color: "#f59e0b", children: [
    { id: "deferred30", name: "30-day deferred" },
    { id: "deferred60", name: "60-day deferred" },
    { id: "deferred90", name: "90-day deferred" },
  ]},
  { id: "milestone", name: "Milestone Based", icon: "flag", color: "#10b981", children: [
    { id: "milestone5050", name: "50/50 split" },
    { id: "milestone334", name: "33/34/33 split" },
    { id: "milestone254025", name: "25/40/35 split" },
  ]},
];
const FINANCING_FLAT = FINANCING_OPTIONS.flatMap(g => g.children.map(c => ({ ...c, group: g.name, groupId: g.id })));
const financingLookup = (id) => FINANCING_FLAT.find(f => f.id === id);

const $ = (v) => "$" + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (v) => (v * 100).toFixed(1) + "%";
const tn = { fontFeatureSettings: "'tnum'" };
const hexToRgb = (hex) => { const h = hex.replace("#", ""); return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)].join(","); };
const PENDING_SELECTION_GROUPS = [
  {
    id: "roofing",
    label: "Roofing",
    options: [
      { id: "roof-charcoal", name: "Charcoal", color: "#4b5563" },
      { id: "roof-onyx", name: "Onyx Black", color: "#111827" },
      { id: "roof-weathered", name: "Weathered Wood", color: "#8b6f5a" },
      { id: "roof-slate", name: "Slate Gray", color: "#64748b" },
      { id: "roof-barkwood", name: "Barkwood", color: "#8a5a44" },
    ],
  },
  {
    id: "trim",
    label: "Flashing & Trim",
    options: [
      { id: "trim-white", name: "White", color: "#f5f5f4" },
      { id: "trim-black", name: "Black", color: "#27272a" },
      { id: "trim-brown", name: "Brown", color: "#7c5a3c" },
      { id: "trim-mill", name: "Mill Finish", color: "#9ca3af" },
      { id: "trim-lead", name: "Lead / Aluminum", color: "#6b7280" },
    ],
  },
];
const PENDING_SELECTION_OPTIONS = PENDING_SELECTION_GROUPS.flatMap((group) =>
  group.options.map((option) => ({ ...option, groupId: group.id, groupLabel: group.label }))
);
const getPendingSelectionOption = (optionId) =>
  PENDING_SELECTION_OPTIONS.find((option) => option.id === optionId) || null;
const getPendingSelectionOptionsForPart = (part) => {
  const preferredGroup = part.id.startsWith("RF-") ? "roofing" : part.id.startsWith("FL-") ? "trim" : null;
  if (!preferredGroup) return PENDING_SELECTION_OPTIONS;
  return [
    ...PENDING_SELECTION_OPTIONS.filter((option) => option.groupId === preferredGroup),
    ...PENDING_SELECTION_OPTIONS.filter((option) => option.groupId !== preferredGroup),
  ];
};

function Thumb({ type }) {
  const s = 30;
  const sh = { width: s, height: s, flexShrink: 0, borderRadius: 6, overflow: "hidden", display: "block" };
  const c = { tearoff: ["#fde8e8","#c53030"], dumpster: ["#e8eef4","#4a6785"], truck: ["#e8eef4","#4a6785"], shingle: ["#f0ebe4","#8b6914"], roll: ["#eef0e8","#5a7040"], nails: ["#eae8ee","#5a5070"], drip: ["#e8eef4","#4a6785"], flash: ["#e8eef4","#4a6785"], boot: ["#f0ebe4","#6b5a40"], chimney: ["#f0ebe4","#8b5e3c"], vent: ["#e8f0ee","#3a6b5a"], permit: ["#f5f0e8","#8b7a50"], tarp: ["#eef0e8","#5a7040"] }[type] || ["#f0eeea","#8c8b86"];
  return (
    <svg style={sh} viewBox="0 0 30 30">
      <rect width="30" height="30" fill={c[0]} rx="6" />
      <circle cx="15" cy="15" r="6" fill={c[1]} opacity="0.2" />
      <circle cx="15" cy="15" r="2.5" fill={c[1]} opacity="0.35" />
    </svg>
  );
}

function Pill({ val, invert, delay = 0 }) {
  if (val === 0) return null;
  const good = invert ? val < 0 : val > 0;
  return (
    <span className="pill-enter" style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: good ? "#dcfce7" : "#fee2e2", color: good ? "#166534" : "#991b1b", ...tn, animationDelay: `${delay}ms` }}>
      <span style={{ fontSize: 9 }}>{val > 0 ? "▲" : "▼"}</span>{$(val)}
    </span>
  );
}

// Strong ease-out curve matching cubic-bezier(0.23, 1, 0.32, 1)
function easeOutStrong(t) {
  return 1 - Math.pow(1 - t, 4);
}

function AnimatedValue({ value, duration = 600, delay = 0, prefix = "$", decimals = 2, style }) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startTime.current = performance.now();
      const animate = (now) => {
        const elapsed = now - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutStrong(progress);
        setDisplay(value * eased);
        if (progress < 1) {
          rafId.current = requestAnimationFrame(animate);
        }
      };
      rafId.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [value, duration, delay]);

  const formatted = prefix + Math.abs(display).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span style={style}>{formatted}</span>;
}

function AnimatedPct({ value, duration = 500, delay = 0, style }) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startTime.current = performance.now();
      const animate = (now) => {
        const elapsed = now - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutStrong(progress);
        setDisplay(value * eased);
        if (progress < 1) {
          rafId.current = requestAnimationFrame(animate);
        }
      };
      rafId.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [value, duration, delay]);

  return <span style={style}>{(display * 100).toFixed(1)}%</span>;
}

function PieChart({ data, size = 160, centerLabel }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), []);
  const cx = size / 2, cy = size / 2, outerR = size / 2 - 2, innerR = size / 2 - 30;
  let cumAngle = -Math.PI / 2;
  const slices = data.map((d) => {
    const angle = (d.value / total) * Math.PI * 2;
    const sa = cumAngle;
    cumAngle += angle;
    const ea = cumAngle;
    const large = angle > Math.PI ? 1 : 0;
    const outerStart = `${cx + outerR * Math.cos(sa)} ${cy + outerR * Math.sin(sa)}`;
    const outerEnd = `${cx + outerR * Math.cos(ea)} ${cy + outerR * Math.sin(ea)}`;
    const innerStart = `${cx + innerR * Math.cos(ea)} ${cy + innerR * Math.sin(ea)}`;
    const innerEnd = `${cx + innerR * Math.cos(sa)} ${cy + innerR * Math.sin(sa)}`;
    const path = `M ${outerStart} A ${outerR} ${outerR} 0 ${large} 1 ${outerEnd} L ${innerStart} A ${innerR} ${innerR} 0 ${large} 0 ${innerEnd} Z`;
    return { ...d, path, pct: ((d.value / total) * 100).toFixed(1), midAngle: sa + angle / 2 };
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            {slices.map((s, i) => (
              <linearGradient key={i} id={`pg-${uid}-${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.85" />
                <stop offset="100%" stopColor={s.color} stopOpacity="1" />
              </linearGradient>
            ))}
          </defs>
          <circle cx={cx} cy={cy} r={innerR - 1} fill="#fafaf8" />
          <text x={cx} y={cy - 2} textAnchor="middle" dominantBaseline="central" fill="#1a1a18" fontSize="16" fontWeight="700" fontFamily="inherit" style={tn}>{$(total)}</text>
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={`url(#pg-${uid}-${i})`} stroke="#fff" strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, padding: "6px 10px", borderRadius: 8, background: i % 2 === 0 ? "#fafaf8" : "transparent" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ color: "#6b6a65", fontWeight: 500, minWidth: 70 }}>{s.label}</span>
            <span style={{ fontWeight: 700, ...tn, color: "#1a1a18", minWidth: 60 }}>{$(s.value)}</span>
            <span style={{ fontSize: 10, color: "#8c8b86", fontWeight: 600 }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HoverBar({ x, y, w, h, rx, fill, value, fontSize }) {
  const [hovered, setHovered] = useState(false);
  return (
    <g onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ cursor: "default" }}>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} />
      {/* Invisible wider hit area */}
      <rect x={x - 4} y={Math.min(y, y - 20)} width={w + 8} height={h + 24} fill="transparent" />
      <text
        x={x + w / 2} y={y - 6}
        textAnchor="middle" fill="#1a1a18" fontSize={fontSize} fontWeight="700" fontFamily="inherit" style={{ ...tn, opacity: hovered ? 1 : 0, transition: "opacity 120ms ease-out" }}
      >{$(value)}</text>
    </g>
  );
}

function BarChart({ bars, maxVal, height = 200, grouped = false, groupLabels }) {
  const barW = grouped ? 32 : 48;
  const groupGap = grouped ? 3 : 0;
  const gap = grouped ? 40 : 20;
  const groupSize = grouped ? 2 : 1;
  const numGroups = Math.ceil(bars.length / groupSize);
  const groupW = groupSize * barW + (groupSize - 1) * groupGap;
  const axisX = 48;
  const chartW = axisX + 16 + numGroups * (groupW + gap) - gap + 16;
  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), []);
  return (
    <svg width="100%" height={height + 44} viewBox={`0 0 ${chartW} ${height + 44}`} style={{ maxWidth: chartW }}>
      <defs>
        {bars.map((b, i) => (
          <linearGradient key={i} id={`bg-${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={b.colorEnd || b.color} />
            <stop offset="40%" stopColor={b.colorEnd || b.color} />
            <stop offset="100%" stopColor={b.color} />
          </linearGradient>
        ))}
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const y = height - height * f;
        return (
          <g key={i}>
            <line x1={axisX} y1={y} x2={chartW - 8} y2={y} stroke={f === 0 ? "#dddcd7" : "#f0efea"} strokeWidth="1" />
            <text x={axisX - 8} y={y + 4} textAnchor="end" fill="#b0afa9" fontSize="9" fontFamily="inherit" style={tn}>{$(maxVal * f).replace(/\.00$/, "")}</text>
          </g>
        );
      })}
      {bars.map((b, i) => {
        const bh = maxVal > 0 ? (Math.max(0, b.value) / maxVal) * height : 0;
        const groupIdx = Math.floor(i / groupSize);
        const withinIdx = i % groupSize;
        const x = axisX + 8 + groupIdx * (groupW + gap) + withinIdx * (barW + groupGap);
        const valFontSize = grouped ? 9 : 11;
        return grouped ? (
          <HoverBar key={i} x={x} y={height - bh} w={barW} h={bh} rx={4} fill={`url(#bg-${uid}-${i})`} value={b.value} fontSize={valFontSize} />
        ) : (
          <g key={i}>
            <rect x={x} y={height - bh} width={barW} height={bh} rx={5} fill={`url(#bg-${uid}-${i})`} />
            <text x={x + barW / 2} y={height - bh - 6} textAnchor="middle" fill="#1a1a18" fontSize={valFontSize} fontWeight="700" fontFamily="inherit" style={tn}>{$(b.value)}</text>
            <text x={x + barW / 2} y={height + 16} textAnchor="middle" fill="#8c8b86" fontSize="9" fontWeight="600" fontFamily="inherit">{b.label}</text>
          </g>
        );
      })}
      {grouped && groupLabels && groupLabels.map((label, gi) => {
        const x = axisX + 8 + gi * (groupW + gap);
        return (
          <text key={gi} x={x + groupW / 2} y={height + 16} textAnchor="middle" fill="#6b6a65" fontSize="10" fontWeight="600" fontFamily="inherit">{label}</text>
        );
      })}
    </svg>
  );
}

function AnalyticsView({ rev, cogs, profit, margin, partsCost, laborCost, nbCost, groups, bl, blMargin, onBack, quotes }) {
  const groupData = [...groups.entries()].map(([name, items]) => ({
    name,
    cost: items.reduce((s, p) => s + p.unitCost * p.qty, 0),
    rev: items.filter(p => p.billable).reduce((s, p) => s + p.unitPrice * p.qty, 0),
    profit: items.filter(p => p.billable).reduce((s, p) => s + (p.unitPrice - p.unitCost) * p.qty, 0),
  }));
  const catColors = ["#3b82f6", "#d4a853", "#16a34a", "#c06b84", "#7b6eb8", "#e08540"];
  const catEnds   = ["#60a5fa", "#c9943a", "#4ade80", "#a85a72", "#a78bfa", "#f0a060"];

  const cardStyle = {
    borderRadius: 12,
    background: "#fff",
    border: "1px solid #e8e7e2",
    boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 0 0 0 transparent",
    overflow: "hidden",
  };
  const cardBody = { padding: "20px 24px" };
  const titleBar = (accent) => ({
    padding: "10px 20px",
    background: `linear-gradient(135deg, rgba(${hexToRgb(accent)}, 0.04) 0%, rgba(${hexToRgb(accent)}, 0.08) 100%)`,
    borderBottom: `1px solid rgba(${hexToRgb(accent)}, 0.15)`,
    display: "flex", alignItems: "center", gap: 8,
  });
  const titleText = { fontSize: 12, fontWeight: 700, color: "#4a4a46", letterSpacing: "0.01em" };

  return (
    <div className="page-enter" style={{ marginTop: 8 }}>
      <div className="page-enter" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a18", letterSpacing: "-0.02em" }}>Profitability Analytics</div>
      </div>

      {/* Hero card — Revenue / COGS / Profit */}
      <div className="analytics-card" style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={titleBar("#3b82f6")}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6" }} />
          <span style={titleText}>Revenue · COGS · Profit</span>
        </div>
        <div style={{ ...cardBody, display: "flex", justifyContent: "center" }}>
          <BarChart
            bars={[
              { label: "Revenue", value: rev, color: "#3b82f6", colorEnd: "#60a5fa" },
              { label: "COGS", value: cogs, color: "#e08540", colorEnd: "#f0a060" },
              { label: "Profit", value: profit, color: profit >= 0 ? "#16a34a" : "#dc2626", colorEnd: profit >= 0 ? "#4ade80" : "#f87171" },
            ]}
            maxVal={Math.max(rev, cogs, Math.max(0, profit)) * 1.15}
            height={180}
          />
        </div>
      </div>

      {/* Quote Comparison — horizontal stacked bars */}
      {quotes && quotes.length > 0 && (() => {
        const allItems = [...quotes, { id: "__actuals", name: "Actuals", revenue: rev, cogs, profit, isActual: true }];
        const maxRev = Math.max(...allItems.map(q => q.revenue));
        return (
          <div className="analytics-card" style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={titleBar("#7b6eb8")}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7b6eb8" }} />
              <span style={titleText}>Quote Comparison</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#8c8b86", fontWeight: 600 }}>
                  <span style={{ width: 8, height: 3, borderRadius: 1, background: "#3b82f6", flexShrink: 0 }} /> Revenue
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#8c8b86", fontWeight: 600 }}>
                  <span style={{ width: 8, height: 3, borderRadius: 1, background: "#e08540", flexShrink: 0 }} /> COGS
                </span>
              </div>
            </div>
            <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              {allItems.map((q, qi) => {
                const qMargin = q.revenue > 0 ? q.profit / q.revenue : 0;
                const revPct = maxRev > 0 ? (q.revenue / maxRev) * 100 : 0;
                const cogsPct = q.revenue > 0 ? (q.cogs / q.revenue) * 100 : 0;
                const isActual = q.isActual;
                return (
                  <Fragment key={q.id}>
                    {isActual && <div style={{ height: 1, background: "#e8e7e2", margin: "2px 0" }} />}
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 160, flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: isActual ? 700 : 600, color: isActual ? "#1a1a18" : "#4a4a46", lineHeight: 1.3 }}>{q.name}</div>
                        {!isActual && q.status && <div style={{ fontSize: 9, fontWeight: 600, color: q.status === "Approved" ? "#16a34a" : "#8c8b86", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{q.status}</div>}
                      </div>
                      <div style={{ flex: 1, position: "relative", height: 24, borderRadius: 6, background: "#f5f4f0", overflow: "hidden" }}>
                        <div className="cost-split-bar" style={{
                          position: "absolute", top: 0, left: 0, bottom: 0,
                          width: `${revPct}%`,
                          borderRadius: 6,
                          background: isActual
                            ? "linear-gradient(90deg, #2563eb, #3b82f6)"
                            : "linear-gradient(90deg, #93c5fd, #60a5fa)",
                          transition: "width 400ms cubic-bezier(0.23, 1, 0.32, 1)",
                        }} />
                        <div className="cost-split-bar" style={{
                          position: "absolute", top: 0, left: 0, bottom: 0,
                          width: `${Math.min(cogsPct, 100) * (revPct / 100)}%`,
                          borderRadius: "6px 0 0 6px",
                          background: isActual
                            ? "linear-gradient(90deg, #c97030, #e08540)"
                            : "linear-gradient(90deg, #fbbf6a, #fde2a8)",
                          opacity: 0.85,
                          transition: "width 400ms cubic-bezier(0.23, 1, 0.32, 1)",
                          animationDelay: "100ms",
                        }} />
                      </div>
                      <div style={{ display: "flex", gap: 16, flexShrink: 0, minWidth: 220 }}>
                        <div style={{ textAlign: "right", minWidth: 58 }}>
                          <div style={{ fontSize: 9, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.05em" }}>Rev</div>
                          <div style={{ fontSize: 12, fontWeight: 700, ...tn, color: "#1a1a18" }}>{$(q.revenue)}</div>
                        </div>
                        <div style={{ textAlign: "right", minWidth: 58 }}>
                          <div style={{ fontSize: 9, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.05em" }}>COGS</div>
                          <div style={{ fontSize: 12, fontWeight: 700, ...tn, color: "#1a1a18" }}>{$(q.cogs)}</div>
                        </div>
                        <div style={{ textAlign: "right", minWidth: 58 }}>
                          <div style={{ fontSize: 9, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.05em" }}>Profit</div>
                          <div style={{ fontSize: 12, fontWeight: 700, ...tn, color: q.profit >= 0 ? "#166534" : "#991b1b" }}>{$(q.profit)}</div>
                        </div>
                        <div style={{ textAlign: "right", minWidth: 34 }}>
                          <div style={{ fontSize: 9, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.05em" }}>Margin</div>
                          <div style={{ fontSize: 12, fontWeight: 700, ...tn, color: qMargin >= 0.3 ? "#166534" : qMargin >= 0.1 ? "#92400e" : "#991b1b" }}>{pct(qMargin)}</div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Two-column: breakdowns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="analytics-card" style={cardStyle}>
          <div style={titleBar("#e08540")}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#e08540" }} />
            <span style={titleText}>COGS Breakdown</span>
          </div>
          <div style={{ ...cardBody, display: "flex", justifyContent: "center" }}>
            <PieChart data={[
              { label: "Materials", value: partsCost, color: "#d4a853" },
              { label: "Labor", value: laborCost, color: "#3b82f6" },
              ...(nbCost > 0 ? [{ label: "Non-billable", value: nbCost, color: "#dc2626" }] : []),
            ]} />
          </div>
        </div>

        <div className="analytics-card" style={cardStyle}>
          <div style={titleBar("#16a34a")}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#16a34a" }} />
            <span style={titleText}>Revenue by Category</span>
          </div>
          <div style={{ ...cardBody, display: "flex", justifyContent: "center" }}>
            <PieChart data={groupData.filter(g => g.rev > 0).map((g, i) => ({
              label: g.name, value: g.rev, color: catColors[i % catColors.length],
            }))} />
          </div>
        </div>
      </div>

      {/* Two-column: category profit + actual vs estimated */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="analytics-card" style={cardStyle}>
          <div style={titleBar("#7b6eb8")}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7b6eb8" }} />
            <span style={titleText}>Profit by Category</span>
          </div>
          <div style={{ ...cardBody, display: "flex", justifyContent: "center" }}>
            <BarChart
              bars={groupData.map((g, i) => ({
                label: g.name.length > 10 ? g.name.split(" ")[0] : g.name,
                value: g.profit,
                color: catColors[i % catColors.length],
                colorEnd: catEnds[i % catEnds.length],
              }))}
              maxVal={Math.max(...groupData.map(g => g.profit), 1) * 1.15}
              height={180}
            />
          </div>
        </div>

        <div className="analytics-card" style={cardStyle}>
          <div style={titleBar("#3b82f6")}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6" }} />
            <span style={titleText}>Actual vs Estimated</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#8c8b86", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "linear-gradient(180deg, #bfdbfe, #93c5fd)", flexShrink: 0 }} /> Est.
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#8c8b86", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "linear-gradient(180deg, #60a5fa, #3b82f6)", flexShrink: 0 }} /> Actual
              </span>
            </div>
          </div>
          <div style={{ ...cardBody, display: "flex", justifyContent: "center" }}>
            <BarChart
              grouped
              groupLabels={["Revenue", "COGS", "Profit"]}
              bars={[
                { value: bl.revenue, color: "#93c5fd", colorEnd: "#bfdbfe" },
                { value: rev, color: "#3b82f6", colorEnd: "#60a5fa" },
                { value: bl.cogs, color: "#fbbf6a", colorEnd: "#fde2a8" },
                { value: cogs, color: "#e08540", colorEnd: "#f0a060" },
                { value: bl.profit, color: "#86efac", colorEnd: "#bbf7d0" },
                { value: profit, color: "#16a34a", colorEnd: "#4ade80" },
              ]}
              maxVal={Math.max(rev, bl.revenue, cogs, bl.cogs) * 1.15}
              height={180}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CatalogDialog({ open, onClose, onConfirm, existingIds }) {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [checked, setChecked] = useState(new Set());
  const [checkedBundles, setCheckedBundles] = useState(new Set());
  const [quantities, setQuantities] = useState(new Map());
  const [bundleQty, setBundleQty] = useState(new Map());
  const [expandedBundles, setExpandedBundles] = useState(new Set());
  const [bundleItemOverrides, setBundleItemOverrides] = useState(new Map());
  const [bundleDetailOverrides, setBundleDetailOverrides] = useState(new Map());
  const [itemOverrides, setItemOverrides] = useState(new Map());
  const [openDropdown, setOpenDropdown] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [detailBundle, setDetailBundle] = useState(null);
  const [addItemMenu, setAddItemMenu] = useState(null); // bundleId or null
  const [catalogPage, setCatalogPage] = useState(0);
  const CATALOG_PAGE_SIZE = 10;
  const [lineItemPicker, setLineItemPicker] = useState(null); // bundleId or null
  const [lineItemPickerSearch, setLineItemPickerSearch] = useState("");
  const [lineItemPickerChecked, setLineItemPickerChecked] = useState(new Set());
  const [lineItemPickerTypeFilter, setLineItemPickerTypeFilter] = useState(null); // null = All, "MAT", "SVC", "EQ"
  const [addedBundleItems, setAddedBundleItems] = useState(new Map()); // bundleId → [item, ...]
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const addItemMenuRef = useRef(null);

  const QUICK_FILTERS = [
    { key: "product_type", label: "Product Type", values: ["Material", "Service", "Equipment"], match: (item, vals) => vals.some(v => v === "Material" && item.type === "MAT" || v === "Service" && item.type === "SVC" || v === "Equipment" && item.type === "EQ") },
    { key: "trade_type", label: "Trade", values: ["Roofing", "Gutters", "General"], match: (item, vals) => vals.some(v => v === "Roofing" && (item.group.includes("Tear-off") || item.group.includes("Roofing") || item.group.includes("Flashing") || item.group.includes("Ventilation")) || v === "Gutters" && item.group.includes("Gutters") || v === "General" && item.group.includes("Misc")) },
    { key: "category", label: "Category", values: CATALOG_GROUPS, match: (item, vals) => vals.includes(item.group) },
    { key: "location", label: "Location", values: ["Warehouse", "Job site", "Vendor"], match: (item, vals) => vals.includes(item.location) },
    { key: "availability", label: "Availability", values: ["In stock", "Low stock", "On request"], match: (item, vals) => vals.includes(item.availability) },
  ];

  useEffect(() => {
    if (open) {
      setSearch(""); setActiveFilters(new Set()); setChecked(new Set()); setCheckedBundles(new Set());
      setQuantities(new Map()); setBundleQty(new Map()); setExpandedBundles(new Set()); setBundleItemOverrides(new Map()); setBundleDetailOverrides(new Map()); setItemOverrides(new Map()); setOpenDropdown(null); setDetailItem(null); setDetailBundle(null); setAddItemMenu(null); setLineItemPicker(null); setLineItemPickerSearch(""); setLineItemPickerChecked(new Set()); setAddedBundleItems(new Map());
      setTimeout(() => searchRef.current?.focus(), 150);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!openDropdown) return;
    const handleClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenDropdown(null); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdown]);

  useEffect(() => {
    if (!addItemMenu) return;
    const handleClick = (e) => { if (addItemMenuRef.current && !addItemMenuRef.current.contains(e.target)) setAddItemMenu(null); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [addItemMenu]);

  const toggleFilter = (filterVal) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(filterVal)) next.delete(filterVal); else next.add(filterVal);
      return next;
    });
  };

  const toggleItem = (catalogId) => {
    setChecked(prev => { const next = new Set(prev); if (next.has(catalogId)) next.delete(catalogId); else next.add(catalogId); return next; });
  };

  const toggleBundle = (bundleId) => {
    setCheckedBundles(prev => { const next = new Set(prev); if (next.has(bundleId)) next.delete(bundleId); else next.add(bundleId); return next; });
  };


  const toggleAll = () => {
    const allItemIds = filtered.map(i => i.catalogId);
    const allBundleIds = filteredBundles.map(b => b.bundleId);
    const totalCount = allItemIds.length + allBundleIds.length;
    const currentCount = allItemIds.filter(id => checked.has(id)).length + allBundleIds.filter(id => checkedBundles.has(id)).length;
    if (currentCount === totalCount && totalCount > 0) {
      setChecked(new Set()); setCheckedBundles(new Set());
    } else {
      setChecked(new Set(allItemIds)); setCheckedBundles(new Set(allBundleIds));
    }
  };

  const setQty = (catalogId, qty) => {
    setQuantities(prev => { const next = new Map(prev); next.set(catalogId, Math.max(1, qty)); return next; });
  };

  const setBQty = (bundleId, qty) => {
    setBundleQty(prev => { const next = new Map(prev); next.set(bundleId, Math.max(1, qty)); return next; });
  };

  const toggleBundleExpand = (bundleId) => {
    setExpandedBundles(prev => { const next = new Set(prev); if (next.has(bundleId)) next.delete(bundleId); else next.add(bundleId); return next; });
  };

  const getBundleItemVal = (bundleId, catalogId, field, fallback) => {
    const key = `${bundleId}:${catalogId}`;
    const ov = bundleItemOverrides.get(key);
    return ov && ov[field] !== undefined ? ov[field] : fallback;
  };
  const setBundleItemVal = (bundleId, catalogId, field, value) => {
    const key = `${bundleId}:${catalogId}`;
    setBundleItemOverrides(prev => {
      const next = new Map(prev);
      const existing = next.get(key) || {};
      next.set(key, { ...existing, [field]: value });
      return next;
    });
  };

  const getBundleDetail = (bundleId, field, fallback) => {
    const ov = bundleDetailOverrides.get(bundleId);
    return ov && ov[field] !== undefined ? ov[field] : fallback;
  };
  const setBundleDetail = (bundleId, field, value) => {
    setBundleDetailOverrides(prev => {
      const next = new Map(prev);
      const existing = next.get(bundleId) || {};
      next.set(bundleId, { ...existing, [field]: value });
      return next;
    });
  };

  const getItemVal = (catalogId, field) => {
    const ov = itemOverrides.get(catalogId);
    return ov && ov[field] !== undefined ? ov[field] : undefined;
  };
  const setItemVal = (catalogId, field, value) => {
    setItemOverrides(prev => {
      const next = new Map(prev);
      const existing = next.get(catalogId) || {};
      next.set(catalogId, { ...existing, [field]: value });
      return next;
    });
  };

  // Filter logic — activeFilters holds values like "Material", "Roofing", "Tear-off & disposal"
  const filtered = CATALOG_ITEMS.filter(item => {
    if (search) {
      const q = search.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.type.toLowerCase().includes(q)) return false;
    }
    if (activeFilters.size === 0) return true;
    return QUICK_FILTERS.some(f => {
      const activeVals = f.values.filter(v => activeFilters.has(v));
      return activeVals.length > 0 && f.match(item, activeVals);
    });
  });
  const totalPages = Math.ceil(filtered.length / CATALOG_PAGE_SIZE);
  const paginatedItems = filtered.slice(catalogPage * CATALOG_PAGE_SIZE, (catalogPage + 1) * CATALOG_PAGE_SIZE);

  const filteredBundles = CATALOG_BUNDLES.filter(b => {
    if (search) {
      const q = search.toLowerCase();
      return b.name.toLowerCase().includes(q) || b.items.some(i => i.name.toLowerCase().includes(q));
    }
    return true;
  });


  // Totals
  const selectedItems = CATALOG_ITEMS.filter(i => checked.has(i.catalogId));
  const itemPrice = selectedItems.reduce((sum, i) => sum + (quantities.get(i.catalogId) || 1) * i.defaultUnitPrice, 0);
  const itemCost = selectedItems.reduce((sum, i) => sum + (quantities.get(i.catalogId) || 1) * i.defaultUnitCost, 0);
  const selectedBundles = CATALOG_BUNDLES.filter(b => checkedBundles.has(b.bundleId));
  const bundlePrice = selectedBundles.reduce((sum, b) => sum + (bundleQty.get(b.bundleId) || 1) * b.defaultUnitPrice, 0);
  const bundleCost = selectedBundles.reduce((sum, b) => sum + (bundleQty.get(b.bundleId) || 1) * b.defaultUnitCost, 0);
  const totalPrice = itemPrice + bundlePrice;
  const totalCost = itemCost + bundleCost;
  const totalChecked = checked.size + checkedBundles.size;
  const totalVisible = filtered.length + filteredBundles.length;

  const handleConfirm = () => {
    const items = [];
    selectedItems.forEach(cat => {
      items.push({
        id: `NEW-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: cat.name, type: cat.type, group: cat.group,
        qty: quantities.get(cat.catalogId) || 1,
        unit: cat.defaultUnit, unitCost: cat.defaultUnitCost, unitPrice: cat.defaultUnitPrice,
        billable: true, notes: null, thumb: cat.thumb,
      });
    });
    selectedBundles.forEach(b => {
      const bq = bundleQty.get(b.bundleId) || 1;
      b.items.forEach(bi => {
        items.push({
          id: `NEW-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: bi.name, type: bi.type, group: "Bundle: " + b.name,
          qty: bi.qty * bq, unit: bi.unit, unitCost: bi.unitCost, unitPrice: bi.unitPrice,
          billable: true, notes: `From bundle: ${b.name}`, thumb: CATALOG_ITEMS.find(c => c.catalogId === bi.catalogId)?.thumb || "shingle",
        });
      });
    });
    onConfirm(items);
  };

  if (!open) return null;

  const allChecked = totalVisible > 0 && totalChecked === totalVisible;
  const someChecked = totalChecked > 0 && !allChecked;
  const thBase = { fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", padding: "7px 12px", borderBottom: "1px solid #e8e7e2", background: "#fff" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 40 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="overlay-enter" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)", pointerEvents: "none" }} />
      <div style={{ position: "relative", width: (detailItem || detailBundle) ? 1080 : 780, height: "calc(100vh - 80px)", background: "#fff", borderRadius: 14, boxShadow: "0 24px 80px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.06)", display: "flex", flexDirection: "row", overflow: "hidden", animation: "fadeSlideIn 250ms cubic-bezier(0.23, 1, 0.32, 1) both", transition: "width 250ms cubic-bezier(0.23, 1, 0.32, 1)" }} onClick={e => e.stopPropagation()}>
      {/* Left panel — list */}
      <div style={{ width: 780, flexShrink: 0, display: "flex", flexDirection: "column", height: "100%" }}>

        {lineItemPicker ? (() => {
          const bundleName = CATALOG_BUNDLES.find(b => b.bundleId === lineItemPicker)?.name || "Bundle";
          const pickerItems = CATALOG_ITEMS.filter(i => {
            if (lineItemPickerTypeFilter && i.type !== lineItemPickerTypeFilter) return false;
            if (!lineItemPickerSearch) return true;
            return i.name.toLowerCase().includes(lineItemPickerSearch.toLowerCase());
          });
          const handleAddLineItems = () => {
            const selected = CATALOG_ITEMS.filter(i => lineItemPickerChecked.has(i.catalogId));
            if (selected.length === 0) { setLineItemPicker(null); return; }
            setAddedBundleItems(prev => {
              const next = new Map(prev);
              const existing = next.get(lineItemPicker) || [];
              const newItems = selected.map(i => ({ catalogId: i.catalogId, name: i.name, type: i.type, qty: 1, unit: i.defaultUnit, unitCost: i.defaultUnitCost, unitPrice: i.defaultUnitPrice, location: i.location }));
              next.set(lineItemPicker, [...existing, ...newItems]);
              return next;
            });
            setLineItemPicker(null);
          };
          return <div className="bundle-picker-enter" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "20px 24px 16px", flexShrink: 0, borderBottom: "1px solid #e8e7e2" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <button className="hover-warm btn-press" onClick={() => setLineItemPicker(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b6a65", display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, padding: "4px 8px", borderRadius: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Back to Item Picker
                </button>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a18", marginBottom: 12 }}>Add items to {bundleName}</div>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b0afa9" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7.5"/><path d="M21 21l-4.35-4.35"/></svg>
                <input
                  type="text"
                  placeholder="Search catalog items..."
                  value={lineItemPickerSearch}
                  onChange={e => setLineItemPickerSearch(e.target.value)}
                  autoFocus
                  style={{ width: "100%", height: 36, padding: "0 10px 0 32px", fontSize: 13, border: "1px solid #e0dfda", borderRadius: 8, background: "#fafaf8", color: "#1a1a18", transition: "border-color 120ms ease" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#c5c4bf"; e.currentTarget.style.background = "#fff"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#e0dfda"; e.currentTarget.style.background = "#fafaf8"; }}
                />
              </div>
              {/* Product Type filter dropdown */}
              {(() => {
                const ptOpen = openDropdown === "bundlePickerType";
                const ptActive = lineItemPickerTypeFilter !== null;
                const ptOptions = [{ label: "Material", value: "MAT" }, { label: "Service", value: "SVC" }, { label: "Equipment", value: "EQ" }];
                return (
                  <div style={{ position: "relative", marginTop: 10 }} ref={ptOpen ? dropdownRef : undefined}>
                    <button
                      onClick={() => setOpenDropdown(ptOpen ? null : "bundlePickerType")}
                      style={{
                        fontSize: 11, fontWeight: 500, padding: "4px 8px 4px 10px", borderRadius: 6,
                        border: `1px solid ${ptActive ? "#c5c4bf" : "#eae9e4"}`,
                        background: ptActive ? "#f0eeea" : "#fafaf8",
                        color: ptActive ? "#1a1a18" : "#8c8b86",
                        cursor: "pointer", whiteSpace: "nowrap", transition: "background 120ms ease-out, border-color 120ms ease-out, color 120ms ease-out",
                        display: "inline-flex", alignItems: "center", gap: 4,
                      }}
                      className="hover-chip"
                    >
                      Product Type{ptActive && <span style={{ fontSize: 9, background: "#1a1a18", color: "#fff", borderRadius: 4, padding: "1px 5px", fontWeight: 700, lineHeight: 1.2 }}>1</span>}
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d={ptOpen ? "M3 7.5L6 4.5L9 7.5" : "M3 4.5L6 7.5L9 4.5"} /></svg>
                    </button>
                    {ptOpen && (
                      <div style={{
                        position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
                        background: "#fff", border: "1px solid #e8e7e2", borderRadius: 8,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
                        padding: "4px 0", minWidth: 160, maxHeight: 220, overflowY: "auto",
                        animation: "fadeSlideIn 120ms cubic-bezier(0.23, 1, 0.32, 1) both",
                      }}>
                        {ptOptions.map(o => {
                          const selected = lineItemPickerTypeFilter === o.value;
                          return (
                            <button key={o.value} onClick={() => { setLineItemPickerTypeFilter(selected ? null : o.value); setOpenDropdown(null); }} className="dropdown-item" style={{
                              display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left",
                              padding: "6px 12px", border: "none", background: "none", cursor: "pointer",
                              fontSize: 12, color: selected ? "#1a1a18" : "#6b6a65", fontWeight: selected ? 600 : 400,
                            }}>
                              <span style={{
                                width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                                border: `1.5px solid ${selected ? "#1a1a18" : "#d0cfca"}`,
                                background: selected ? "#1a1a18" : "#fff",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                {selected && <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6L5 8.5L9.5 3.5" /></svg>}
                              </span>
                              {o.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            {/* Table */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f5f4f0" }}>
                    <th style={{ width: 40, padding: "7px 0 7px 20px" }} />
                    <th style={{ textAlign: "left", padding: "7px 12px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Item</th>
                    <th style={{ textAlign: "left", padding: "7px 12px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: 90 }}>Location</th>
                    <th style={{ textAlign: "right", padding: "7px 12px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: 80 }}>Cost</th>
                    <th style={{ textAlign: "right", padding: "7px 20px 7px 12px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: 80 }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {pickerItems.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: "32px 20px", textAlign: "center", fontSize: 12, color: "#b0afa9" }}>No items found</td></tr>
                  ) : pickerItems.map(item => {
                    const isSel = lineItemPickerChecked.has(item.catalogId);
                    return (
                      <tr key={item.catalogId} className="picker-row" onClick={() => setLineItemPickerChecked(prev => { const next = new Set(prev); if (next.has(item.catalogId)) next.delete(item.catalogId); else next.add(item.catalogId); return next; })} style={{ cursor: "pointer" }}>
                        <td style={{ padding: "10px 0 10px 20px", borderBottom: "1px solid #f5f4f0" }}>
                          <input type="checkbox" checked={isSel} onChange={() => {}} style={{ width: 14, height: 14, cursor: "pointer", accentColor: "#1a1a18" }} />
                        </td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #f5f4f0" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Thumb type={item.thumb} />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                              <div style={{ fontSize: 11, color: "#b0afa9", marginTop: 1 }}>
                                <span style={{ fontWeight: 600, color: item.type === "MAT" ? "#a08030" : item.type === "SVC" ? "#5a7a9a" : "#5a7040" }}>{item.type === "MAT" ? "Material" : item.type === "SVC" ? "Service" : "Equipment"}</span>
                                <span style={{ color: "#d8d7d2", margin: "0 4px" }}>·</span>
                                <span>per {item.defaultUnit}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #f5f4f0", fontSize: 12, color: "#6b6a65" }}>{item.location}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #f5f4f0", fontSize: 12, color: "#6b6a65", textAlign: "right", ...tn }}>{$(item.defaultUnitCost)}</td>
                        <td style={{ padding: "10px 20px 10px 12px", borderBottom: "1px solid #f5f4f0", fontSize: 12, color: "#6b6a65", textAlign: "right", ...tn }}>{$(item.defaultUnitPrice)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Footer */}
            <div style={{ flexShrink: 0, borderTop: "1px solid #e8e7e2", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#b0afa9" }}>{lineItemPickerChecked.size > 0 ? `${lineItemPickerChecked.size} selected` : "Select items to add"}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="hover-subtle btn-press" onClick={() => setLineItemPicker(null)} style={{ fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 8, border: "1px solid #e0dfda", background: "#fff", cursor: "pointer", color: "#4a4a46" }}
                >Go back</button>
                <button onClick={handleAddLineItems} disabled={lineItemPickerChecked.size === 0} style={{ fontSize: 13, fontWeight: 700, padding: "8px 22px", borderRadius: 8, border: "none", background: lineItemPickerChecked.size > 0 ? "#1a1a18" : "#d8d7d2", color: "#fff", cursor: lineItemPickerChecked.size > 0 ? "pointer" : "default", transition: "background 120ms ease" }}
                  onMouseEnter={e => { if (lineItemPickerChecked.size > 0) e.currentTarget.style.background = "#2a2a28"; }} onMouseLeave={e => { if (lineItemPickerChecked.size > 0) e.currentTarget.style.background = "#1a1a18"; }}
                >Confirm{lineItemPickerChecked.size > 0 ? ` (${lineItemPickerChecked.size})` : ""}</button>
              </div>
            </div>
          </div>;
        })() : <>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 17, fontWeight: 500, color: "#1a1a18", letterSpacing: "-0.01em" }}>Add to job</div>
            <button className="hover-icon btn-press" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#b0afa9", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, marginTop: -2 }}
            ><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 12 }}>
            <svg style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b0afa9" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7.5"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              ref={searchRef}
              value={search}
              onChange={e => { setSearch(e.target.value); setCatalogPage(0); }}
              placeholder="Search parts, services, bundles..."
              style={{ width: "100%", height: 40, fontSize: 13, padding: "0 36px 0 36px", borderRadius: 10, border: "1px solid #e8e7e2", background: "#fafaf8", color: "#1a1a18", transition: "border-color 120ms ease, box-shadow 120ms ease" }}
              onFocus={e => { e.currentTarget.style.borderColor = "#c5c4bf"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.04)"; e.currentTarget.style.background = "#fff"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#e8e7e2"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#fafaf8"; }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "#e8e7e2", border: "none", cursor: "pointer", color: "#6b6a65", width: 18, height: 18, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✕</button>
            )}
          </div>

          {/* Quick filter dropdowns + active chips */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {QUICK_FILTERS.map(f => {
              const activeVals = f.values.filter(v => activeFilters.has(v));
              const isNested = f.key === "category";
              const isOpen = openDropdown === f.key || (isNested && typeof openDropdown === "string" && openDropdown.startsWith("cat:"));
              return (
                <div key={f.key} style={{ position: "relative" }} ref={isOpen ? dropdownRef : undefined}>
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : f.key)}
                    style={{
                      fontSize: 11, fontWeight: 500, padding: "4px 8px 4px 10px", borderRadius: 6,
                      border: `1px solid ${activeVals.length > 0 ? "#c5c4bf" : "#eae9e4"}`,
                      background: activeVals.length > 0 ? "#f0eeea" : "#fafaf8",
                      color: activeVals.length > 0 ? "#1a1a18" : "#8c8b86",
                      cursor: "pointer", whiteSpace: "nowrap", transition: "background 120ms ease-out, border-color 120ms ease-out, color 120ms ease-out",
                      display: "inline-flex", alignItems: "center", gap: 4,
                    }}
                    className="hover-chip"
                  >
                    {f.label}{activeVals.length > 0 && <span style={{ fontSize: 9, background: "#1a1a18", color: "#fff", borderRadius: 4, padding: "1px 5px", fontWeight: 700, lineHeight: 1.2 }}>{activeVals.length}</span>}
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d={isOpen ? "M3 7.5L6 4.5L9 7.5" : "M3 4.5L6 7.5L9 4.5"} /></svg>
                  </button>
                  {isOpen && !isNested && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
                      background: "#fff", border: "1px solid #e8e7e2", borderRadius: 8,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
                      padding: "4px 0", minWidth: 160, maxHeight: 220, overflowY: "auto",
                      animation: "fadeSlideIn 120ms cubic-bezier(0.23, 1, 0.32, 1) both",
                    }}>
                      {f.values.map(v => {
                        const selected = activeFilters.has(v);
                        return (
                          <button key={v} onClick={() => toggleFilter(v)} className="dropdown-item" style={{
                            display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left",
                            padding: "6px 12px", border: "none", background: "none", cursor: "pointer",
                            fontSize: 12, color: selected ? "#1a1a18" : "#6b6a65", fontWeight: selected ? 600 : 400,
                          }}>
                            <span style={{
                              width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                              border: `1.5px solid ${selected ? "#1a1a18" : "#d0cfca"}`,
                              background: selected ? "#1a1a18" : "#fff",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              {selected && <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6L5 8.5L9.5 3.5" /></svg>}
                            </span>
                            {v}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {/* Category — nested dropdown: groups → items w/ checkboxes */}
                  {isOpen && isNested && (() => {
                    const groupedItems = {};
                    f.values.forEach(g => { groupedItems[g] = CATALOG_ITEMS.filter(i => i.group === g); });
                    return (
                      <div style={{
                        position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
                        background: "#fff", border: "1px solid #e8e7e2", borderRadius: 8,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
                        padding: "4px 0", minWidth: 190,
                        animation: "fadeSlideIn 120ms cubic-bezier(0.23, 1, 0.32, 1) both",
                      }}>
                        {f.values.map(g => {
                          const selected = activeFilters.has(g);
                          const hovering = openDropdown === "cat:" + g;
                          return (
                            <div key={g} style={{ position: "relative" }}
                              onMouseEnter={() => setOpenDropdown("cat:" + g)}
                            >
                              <button className="dropdown-item" style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", textAlign: "left",
                                padding: "7px 10px 7px 12px", border: "none", background: hovering ? "#fafaf8" : "none", cursor: "pointer",
                                fontSize: 12, color: selected ? "#1a1a18" : "#6b6a65", fontWeight: selected ? 600 : 400,
                              }}>
                                {g.length > 20 ? g.split(" & ")[0] : g}
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#b0afa9" strokeWidth="1.5" strokeLinecap="round"><path d="M3 1.5L5.5 4L3 6.5"/></svg>
                              </button>
                              {hovering && (
                                <div style={{
                                  position: "absolute", left: "calc(100% + 2px)", top: -4, zIndex: 51,
                                  background: "#fff", border: "1px solid #e8e7e2", borderRadius: 8,
                                  boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
                                  padding: "4px 0", minWidth: 200, maxHeight: 240, overflowY: "auto",
                                }}>
                                  {groupedItems[g].map(item => {
                                    const itemSelected = activeFilters.has(item.catalogId);
                                    return (
                                      <button key={item.catalogId} onClick={() => toggleFilter(item.catalogId)} className="dropdown-item" style={{
                                        display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", width: "100%", textAlign: "left",
                                        border: "none", background: "none", cursor: "pointer",
                                        fontSize: 12, color: itemSelected ? "#1a1a18" : "#6b6a65", fontWeight: itemSelected ? 600 : 400,
                                      }}>
                                        <span style={{
                                          width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                                          border: `1.5px solid ${itemSelected ? "#1a1a18" : "#d0cfca"}`,
                                          background: itemSelected ? "#1a1a18" : "#fff",
                                          display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                          {itemSelected && <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6L5 8.5L9.5 3.5" /></svg>}
                                        </span>
                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
            {activeFilters.size > 0 && (
              <button className="hover-icon" onClick={() => setActiveFilters(new Set())} style={{ fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 6, border: "none", background: "none", color: "#b0afa9", cursor: "pointer" }}
              >Clear all</button>
            )}
          </div>
        </div>

        {/* Column headers — fixed above scroll */}
        {totalVisible > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", flexShrink: 0 }}>
            <thead>
              <tr>
                <th style={{ ...thBase, width: 40, textAlign: "center", padding: "7px 0 7px 20px" }}>
                  <input type="checkbox" checked={allChecked} ref={el => { if (el) el.indeterminate = someChecked; }} onChange={toggleAll}
                    style={{ width: 14, height: 14, cursor: "pointer", accentColor: "#1a1a18" }} />
                </th>
                <th style={{ ...thBase, textAlign: "left", paddingLeft: 8 }}>Item</th>
                <th style={{ ...thBase, width: 100, textAlign: "right", padding: "7px 8px" }}>Cost</th>
                <th style={{ ...thBase, width: 100, textAlign: "right", padding: "7px 8px" }}>Price</th>
                <th style={{ ...thBase, width: 120, textAlign: "center", padding: "7px 20px 7px 8px" }}>Qty</th>
              </tr>
            </thead>
          </table>
        )}

        {/* Data table */}
        <div className="picker-scroll" style={{ flex: 1, overflowY: "auto", minHeight: 0, overscrollBehavior: "contain" }}>
          {totalVisible === 0 ? (
            <div style={{ textAlign: "center", padding: "56px 24px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#6b6a65", marginBottom: 4 }}>No results{search ? ` for "${search}"` : ""}</div>
              <div style={{ fontSize: 13, color: "#b0afa9" }}>Try a broader search or clear filters</div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {/* Bundles section */}
                {filteredBundles.length > 0 && (
                  <>
                    {filteredBundles.map((bundle, bundleIdx) => {
                      const isChecked = checkedBundles.has(bundle.bundleId);
                      const isExpanded = expandedBundles.has(bundle.bundleId);
                      const qty = bundleQty.get(bundle.bundleId) || 1;
                      const lineTotal = qty * bundle.defaultUnitPrice;
                      const lineCost = qty * bundle.defaultUnitCost;
                      const serialNum = String(bundleIdx + 1).padStart(3, "0");
                      return (
                        <Fragment key={bundle.bundleId}>
                          <tr
                            className="picker-row"
                            onClick={() => toggleBundle(bundle.bundleId)}
                            data-active={detailBundle?.bundleId === bundle.bundleId || undefined}
                            data-selected={isChecked || undefined}
                            style={{ cursor: "pointer" }}
                          >
                            <td
                              style={{ padding: "10px 0 10px 20px", borderBottom: isExpanded ? "none" : "1px solid #f5f4f0", width: 40, textAlign: "center" }}
                              onClick={e => { e.stopPropagation(); toggleBundle(bundle.bundleId); }}
                            >
                              <span className="row-serial" style={{ fontSize: 11, fontWeight: 600, color: "#b0afa9", fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em" }}>{serialNum}</span>
                              <input className="row-checkbox" type="checkbox" checked={isChecked} onChange={() => {}} style={{ width: 14, height: 14, cursor: "pointer", accentColor: "#1a1a18" }} />
                            </td>
                            <td style={{ padding: "10px 12px 10px 8px", borderBottom: isExpanded ? "none" : "1px solid #f5f4f0" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 6, background: "linear-gradient(135deg, #e8eef4 0%, #dbeafe 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>
                                </div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span
                                      onClick={e => { e.stopPropagation(); setDetailBundle(bundle); setDetailItem(null); }}
                                      className="picker-item-link"
                                      style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18", cursor: "pointer", transition: "color 100ms ease" }}
                                    >{bundle.name}</span>
                                    <span style={{ fontSize: 9, fontWeight: 700, color: "#3b82f6", background: "rgba(59,130,246,0.08)", padding: "1px 6px", borderRadius: 3 }}>BUNDLE</span>
                                  </div>
                                  <div style={{ fontSize: 11, color: "#8c8b86", marginTop: 1, display: "flex", alignItems: "center", gap: 5 }}>
                                    <span>{bundle.items.length} items included</span>
                                    {getBundleDetail(bundle.bundleId, "billable", true) === false && <span style={{ fontSize: 9, fontWeight: 700, color: "#b45309", background: "#fef3c7", padding: "0 5px", borderRadius: 3, lineHeight: "15px" }}>Non-billable</span>}
                                  </div>
                                </div>
                                <button className="hover-icon" onClick={(e) => { e.stopPropagation(); toggleBundleExpand(bundle.bundleId); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#b0afa9", padding: 4, borderRadius: 4, display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600 }}
                                >
                                  {isExpanded ? "Hide" : "View"}
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms ease" }}><path d="M2 3.5l3 3 3-3"/></svg>
                                </button>
                              </div>
                            </td>
                            <td style={{ width: 100, padding: "10px 8px", borderBottom: isExpanded ? "none" : "1px solid #f5f4f0", textAlign: "right", fontSize: 13, color: "#6b6a65", ...tn }}>
                              {$(lineCost)}
                            </td>
                            <td style={{ width: 100, padding: "10px 8px", borderBottom: isExpanded ? "none" : "1px solid #f5f4f0", textAlign: "right", fontSize: 13, fontWeight: isChecked ? 600 : 400, color: isChecked ? "#1a1a18" : "#6b6a65", ...tn }}>
                              {$(lineTotal)}
                            </td>
                            <td style={{ width: 120, padding: "10px 20px 10px 8px", borderBottom: isExpanded ? "none" : "1px solid #f5f4f0", textAlign: "center" }} onClick={e => e.stopPropagation()}>
                              {isChecked ? (
                                <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #d8d7d2", borderRadius: 7, overflow: "hidden", background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                                  <button className="qty-btn" onClick={() => setBQty(bundle.bundleId, qty - 1)} style={{ width: 28, height: 28, border: "none", borderRight: "1px solid #eae9e4", background: "none", cursor: "pointer", fontSize: 15, color: "#6b6a65", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                                  <span style={{ minWidth: 34, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#1a1a18", ...tn }}>{qty}</span>
                                  <button className="qty-btn" onClick={() => setBQty(bundle.bundleId, qty + 1)} style={{ width: 28, height: 28, border: "none", borderLeft: "1px solid #eae9e4", background: "none", cursor: "pointer", fontSize: 15, color: "#6b6a65", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                                </div>
                              ) : (
                                <span style={{ fontSize: 12, color: "#d8d7d2", ...tn }}>1</span>
                              )}
                            </td>
                          </tr>
                          {/* Bundle expanded items — editable */}
                          {isExpanded && (
                            <>
                              <tr style={{ background: "#f5f4f0" }}>
                                <td colSpan={5} style={{ padding: "6px 16px 6px 52px" }}>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 50px 86px 68px 68px 26px", gap: 6, fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.05em", alignItems: "center" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                      Item
                                      <span style={{ position: "relative" }}>
                                        <button
                                          onClick={e => { e.stopPropagation(); setAddItemMenu(addItemMenu === bundle.bundleId ? null : bundle.bundleId); }}
                                          className="btn-press"
                                          style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, border: "1px solid #d8d7d2", background: "#fff", color: "#6b6a65", cursor: "pointer", textTransform: "none", letterSpacing: 0, lineHeight: "16px", display: "inline-flex", alignItems: "center", gap: 3 }}
                                          className="hover-lift"
                                        >
                                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                                          Add Item
                                        </button>
                                        {addItemMenu === bundle.bundleId && (
                                          <div ref={addItemMenuRef} className="dropdown-enter" style={{ position: "absolute", top: "100%", left: 0, marginTop: 4, background: "#fff", borderRadius: 8, border: "1px solid #e8e7e2", boxShadow: "0 8px 24px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.04)", padding: "4px 0", minWidth: 140, zIndex: 20, transformOrigin: "top left" }}>
                                            <button
                                              className="dropdown-item"
                                              onClick={e => { e.stopPropagation(); setAddItemMenu(null); setDetailItem(null); setDetailBundle(null); setLineItemPicker(bundle.bundleId); setLineItemPickerSearch(""); setLineItemPickerChecked(new Set()); }}
                                              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#1a1a18", textAlign: "left", textTransform: "none", letterSpacing: 0 }}
                                            >
                                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b6a65" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/></svg>
                                              Line Item
                                            </button>
                                            <button
                                              className="dropdown-item"
                                              onClick={e => { e.stopPropagation(); setAddItemMenu(null); const customItem = { catalogId: `CUSTOM-${Date.now()}`, name: "Custom item", type: "MAT", qty: 1, unit: "ea", unitCost: 0, unitPrice: 0 }; setAddedBundleItems(prev => { const next = new Map(prev); next.set(bundle.bundleId, [...(next.get(bundle.bundleId) || []), customItem]); return next; }); }}
                                              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#1a1a18", textAlign: "left", textTransform: "none", letterSpacing: 0 }}
                                            >
                                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b6a65" strokeWidth="1.8" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/></svg>
                                              Custom
                                            </button>
                                          </div>
                                        )}
                                      </span>
                                    </span>
                                    <span>Location</span>
                                    <span style={{ textAlign: "center" }}>Qty</span>
                                    <span>Serial No.</span>
                                    <span style={{ textAlign: "right" }}>Cost</span>
                                    <span style={{ textAlign: "right" }}>Price</span>
                                    <span />
                                  </div>
                                </td>
                              </tr>
                              {(() => { const extraItems = addedBundleItems.get(bundle.bundleId) || []; const allBundleItems = [...bundle.items, ...extraItems]; return allBundleItems.map((bi, idx) => {
                                const isExtra = idx >= bundle.items.length;
                                const biDisabled = getBundleItemVal(bundle.bundleId, bi.catalogId, "disabled", false);
                                const biQty = getBundleItemVal(bundle.bundleId, bi.catalogId, "qty", bi.qty);
                                const biSerial = getBundleItemVal(bundle.bundleId, bi.catalogId, "serialNo", "");
                                const biLocation = getBundleItemVal(bundle.bundleId, bi.catalogId, "location", bi.location || "Warehouse");
                                const biUnitPrice = getBundleItemVal(bundle.bundleId, bi.catalogId, "unitCost", bi.unitCost);
                                const biSellPrice = getBundleItemVal(bundle.bundleId, bi.catalogId, "unitPrice", bi.unitPrice);
                                const inputBase = { fontSize: 11, padding: "3px 5px", border: "1px solid #e8e7e2", borderRadius: 4, background: biDisabled ? "#f0eeea" : "#fff", color: biDisabled ? "#b0afa9" : "#1a1a18", width: "100%", fontVariantNumeric: "tabular-nums", transition: "border-color 120ms ease" };
                                return (
                                  <tr key={bi.catalogId + "-bdl"} style={{ background: biDisabled ? "#f8f7f5" : "#fafaf8", opacity: biDisabled ? 0.5 : 1, transition: "opacity 150ms ease" }}>
                                    <td colSpan={5} style={{ padding: "4px 16px 4px 52px", borderBottom: idx === allBundleItems.length - 1 ? "1px solid #eae9e4" : "1px solid #f0eeea" }}>
                                      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 50px 86px 68px 68px 26px", gap: 6, alignItems: "center" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0, overflow: "hidden" }}>
                                          <span
                                            onClick={e => { e.stopPropagation(); const catItem = CATALOG_ITEMS.find(c => c.catalogId === bi.catalogId); if (catItem) { setDetailItem(catItem); setDetailBundle(null); } }}
                                            className="picker-item-link"
                                            style={{ fontSize: 12, fontWeight: 500, color: biDisabled ? "#b0afa9" : "#1a1a18", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer", transition: "color 100ms ease" }}
                                          >{bi.name}</span>
                                          <span style={{ flexShrink: 0, fontSize: 8, fontWeight: 700, color: bi.type === "MAT" ? "#a08030" : bi.type === "SVC" ? "#5a7a9a" : "#5a7040", background: bi.type === "MAT" ? "#f7f0e0" : bi.type === "SVC" ? "#edf2f7" : "#eef4ee", padding: "0 3px", borderRadius: 2, lineHeight: "14px" }}>{bi.type}</span>
                                        </div>
                                        <select
                                          value={biLocation}
                                          disabled={biDisabled}
                                          onChange={e => setBundleItemVal(bundle.bundleId, bi.catalogId, "location", e.target.value)}
                                          style={{ ...inputBase, padding: "3px 1px", cursor: biDisabled ? "default" : "pointer", appearance: "auto", fontSize: 10 }}
                                          onClick={e => e.stopPropagation()}
                                        >
                                          <option>Warehouse</option>
                                          <option>Job site</option>
                                          <option>Vendor</option>
                                        </select>
                                        <input
                                          type="number"
                                          min={1}
                                          value={biQty}
                                          disabled={biDisabled}
                                          onChange={e => setBundleItemVal(bundle.bundleId, bi.catalogId, "qty", Math.max(1, parseInt(e.target.value) || 1))}
                                          onClick={e => e.stopPropagation()}
                                          style={{ ...inputBase, textAlign: "center" }}
                                          onFocus={e => { if (!biDisabled) e.currentTarget.style.borderColor = "#1a1a18"; }}
                                          onBlur={e => { e.currentTarget.style.borderColor = "#e8e7e2"; }}
                                        />
                                        <input
                                          type="text"
                                          placeholder="—"
                                          value={biSerial}
                                          disabled={biDisabled}
                                          onChange={e => setBundleItemVal(bundle.bundleId, bi.catalogId, "serialNo", e.target.value)}
                                          onClick={e => e.stopPropagation()}
                                          style={{ ...inputBase, fontSize: 10 }}
                                          onFocus={e => { if (!biDisabled) e.currentTarget.style.borderColor = "#1a1a18"; }}
                                          onBlur={e => { e.currentTarget.style.borderColor = "#e8e7e2"; }}
                                        />
                                        <input
                                          type="number"
                                          min={0}
                                          step={0.01}
                                          value={biUnitPrice}
                                          disabled={biDisabled}
                                          onChange={e => setBundleItemVal(bundle.bundleId, bi.catalogId, "unitCost", parseFloat(e.target.value) || 0)}
                                          onClick={e => e.stopPropagation()}
                                          style={{ ...inputBase, textAlign: "right" }}
                                          onFocus={e => { if (!biDisabled) e.currentTarget.style.borderColor = "#1a1a18"; }}
                                          onBlur={e => { e.currentTarget.style.borderColor = "#e8e7e2"; }}
                                        />
                                        <input
                                          type="number"
                                          min={0}
                                          step={0.01}
                                          value={biSellPrice}
                                          disabled={biDisabled}
                                          onChange={e => setBundleItemVal(bundle.bundleId, bi.catalogId, "unitPrice", parseFloat(e.target.value) || 0)}
                                          onClick={e => e.stopPropagation()}
                                          style={{ ...inputBase, textAlign: "right" }}
                                          onFocus={e => { if (!biDisabled) e.currentTarget.style.borderColor = "#1a1a18"; }}
                                          onBlur={e => { e.currentTarget.style.borderColor = "#e8e7e2"; }}
                                        />
                                        {isExtra ? (
                                          <button
                                            onClick={e => { e.stopPropagation(); setAddedBundleItems(prev => { const next = new Map(prev); const arr = (next.get(bundle.bundleId) || []).filter(x => x.catalogId !== bi.catalogId); if (arr.length) next.set(bundle.bundleId, arr); else next.delete(bundle.bundleId); return next; }); }}
                                            title="Remove item"
                                            className="btn-press"
                                            style={{ width: 22, height: 22, border: "none", borderRadius: 4, background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#b0afa9", transition: "color 120ms ease, background 120ms ease", padding: 0 }}
                                            className="btn-press hover-danger"
                                          >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                          </button>
                                        ) : (
                                          <button
                                            onClick={e => { e.stopPropagation(); setBundleItemVal(bundle.bundleId, bi.catalogId, "disabled", !biDisabled); }}
                                            title={biDisabled ? "Re-enable item" : "Exclude from this transaction"}
                                            className="btn-press"
                                            style={{ width: 22, height: 22, border: "none", borderRadius: 4, background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: biDisabled ? "#16a34a" : "#b0afa9", transition: "color 120ms ease, background 120ms ease", padding: 0 }}
                                            onMouseEnter={e => { e.currentTarget.style.background = biDisabled ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.06)"; e.currentTarget.style.color = biDisabled ? "#16a34a" : "#dc2626"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = biDisabled ? "#16a34a" : "#b0afa9"; }}
                                          >
                                            {biDisabled ? (
                                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 12H4M12 4v16"/></svg>
                                            ) : (
                                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>
                                            )}
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }); })()}
                            </>
                          )}
                        </Fragment>
                      );
                    })}
                  </>
                )}

                {/* Individual items — flat list */}
                {paginatedItems.map((item, itemIdx) => {
                        const isChecked = checked.has(item.catalogId);
                        const qty = quantities.get(item.catalogId) || 1;
                        const itemCost = getItemVal(item.catalogId, "unitCost") !== undefined ? getItemVal(item.catalogId, "unitCost") : item.defaultUnitCost;
                        const itemPrice = getItemVal(item.catalogId, "unitPrice") !== undefined ? getItemVal(item.catalogId, "unitPrice") : item.defaultUnitPrice;
                        const editInputStyle = { fontSize: 12, padding: "3px 6px", border: "1px solid #e8e7e2", borderRadius: 4, background: "#fff", color: "#1a1a18", width: "100%", fontVariantNumeric: "tabular-nums", textAlign: "right", transition: "border-color 120ms ease" };
                        const serialNum = String(filteredBundles.length + itemIdx + 1).padStart(3, "0");
                        return (
                          <tr key={item.catalogId}
                            className="picker-row"
                            onClick={() => toggleItem(item.catalogId)}
                            data-active={detailItem?.catalogId === item.catalogId || undefined}
                            data-selected={isChecked || undefined}
                            style={{ cursor: "pointer" }}
                          >
                            <td
                              style={{ padding: "10px 0 10px 20px", borderBottom: "1px solid #f5f4f0", width: 40, textAlign: "center" }}
                              onClick={e => { e.stopPropagation(); toggleItem(item.catalogId); }}
                            >
                              <span className="row-serial" style={{ fontSize: 11, fontWeight: 600, color: "#b0afa9", fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em" }}>{serialNum}</span>
                              <input className="row-checkbox" type="checkbox" checked={isChecked} onChange={() => {}} style={{ width: 14, height: 14, cursor: "pointer", accentColor: "#1a1a18" }} />
                            </td>
                            <td style={{ padding: "10px 12px 10px 8px", borderBottom: "1px solid #f5f4f0" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <Thumb type={item.thumb} />
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span
                                      onClick={e => { e.stopPropagation(); setDetailItem(item); setDetailBundle(null); }}
                                      className="picker-item-link"
                                      style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer", transition: "color 100ms ease" }}
                                    >{item.name}</span>
                                  </div>
                                  <div style={{ fontSize: 11, color: "#b0afa9", marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}>
                                    <span style={{ fontWeight: 600, color: item.type === "MAT" ? "#a08030" : item.type === "SVC" ? "#5a7a9a" : "#5a7040" }}>{item.type === "MAT" ? "Material" : item.type === "SVC" ? "Service" : "Equipment"}</span>
                                    <span style={{ color: "#d8d7d2" }}>·</span>
                                    <span>per {item.defaultUnit}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ width: 100, padding: "10px 8px", borderBottom: "1px solid #f5f4f0" }} onClick={e => e.stopPropagation()}>
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={itemCost}
                                onChange={e => setItemVal(item.catalogId, "unitCost", parseFloat(e.target.value) || 0)}
                                style={editInputStyle}
                                onFocus={e => { e.currentTarget.style.borderColor = "#1a1a18"; }}
                                onBlur={e => { e.currentTarget.style.borderColor = "#e8e7e2"; }}
                              />
                            </td>
                            <td style={{ width: 100, padding: "10px 8px", borderBottom: "1px solid #f5f4f0" }} onClick={e => e.stopPropagation()}>
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={itemPrice}
                                onChange={e => setItemVal(item.catalogId, "unitPrice", parseFloat(e.target.value) || 0)}
                                style={editInputStyle}
                                onFocus={e => { e.currentTarget.style.borderColor = "#1a1a18"; }}
                                onBlur={e => { e.currentTarget.style.borderColor = "#e8e7e2"; }}
                              />
                            </td>
                            <td style={{ width: 120, padding: "10px 20px 10px 8px", borderBottom: "1px solid #f5f4f0", textAlign: "center" }} onClick={e => e.stopPropagation()}>
                              {isChecked ? (
                                <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #d8d7d2", borderRadius: 7, overflow: "hidden", background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                                  <button className="qty-btn" onClick={() => setQty(item.catalogId, qty - 1)} style={{ width: 28, height: 28, border: "none", borderRight: "1px solid #eae9e4", background: "none", cursor: "pointer", fontSize: 15, color: "#6b6a65", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                                  <span style={{ minWidth: 34, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#1a1a18", ...tn }}>{qty}</span>
                                  <button className="qty-btn" onClick={() => setQty(item.catalogId, qty + 1)} style={{ width: 28, height: 28, border: "none", borderLeft: "1px solid #eae9e4", background: "none", cursor: "pointer", fontSize: 15, color: "#6b6a65", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                                </div>
                              ) : (
                                <span style={{ fontSize: 12, color: "#d8d7d2", ...tn }}>1</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div style={{ flexShrink: 0, borderTop: "1px solid #e8e7e2" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px" }}>
            {totalPages > 1 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button disabled={catalogPage === 0} onClick={() => setCatalogPage(p => p - 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e8e7e2", background: catalogPage === 0 ? "#fafaf8" : "#fff", cursor: catalogPage === 0 ? "default" : "pointer", color: catalogPage === 0 ? "#d0cfca" : "#6b6a65", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 2 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 5l3 3"/></svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setCatalogPage(i)} style={{ width: 28, height: 28, borderRadius: 6, border: i === catalogPage ? "1px solid #1a1a18" : "1px solid transparent", background: i === catalogPage ? "#1a1a18" : "none", color: i === catalogPage ? "#fff" : "#6b6a65", fontSize: 11, fontWeight: i === catalogPage ? 700 : 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</button>
                ))}
                <button disabled={catalogPage >= totalPages - 1} onClick={() => setCatalogPage(p => p + 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e8e7e2", background: catalogPage >= totalPages - 1 ? "#fafaf8" : "#fff", cursor: catalogPage >= totalPages - 1 ? "default" : "pointer", color: catalogPage >= totalPages - 1 ? "#d0cfca" : "#6b6a65", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 2 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 2l3 3-3 3"/></svg>
                </button>
              </div>
            ) : (
              <span style={{ fontSize: 12, color: "#b0afa9" }}>{totalChecked > 0 ? `${totalChecked} of ${totalVisible} items selected` : `${filtered.length} items`}</span>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button className="hover-lift btn-press" onClick={onClose} style={{ fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 8, border: "1px solid #e0dfda", background: "#fff", cursor: "pointer", color: "#4a4a46" }}
              >Cancel</button>
              <button
                onClick={handleConfirm}
                disabled={totalChecked === 0}
                style={{ fontSize: 13, fontWeight: 700, padding: "8px 22px", borderRadius: 8, border: "none", background: totalChecked > 0 ? "#1a1a18" : "#d8d7d2", color: "#fff", cursor: totalChecked > 0 ? "pointer" : "default", transition: "background 150ms ease-out, border-color 150ms ease-out, color 150ms ease-out" }}
                onMouseEnter={e => { if (totalChecked > 0) e.currentTarget.style.background = "#2a2a28"; }} onMouseLeave={e => { if (totalChecked > 0) e.currentTarget.style.background = "#1a1a18"; }}
              >Add {totalChecked > 0 ? `${totalChecked} item${totalChecked !== 1 ? "s" : ""} to job` : "to job"}</button>
            </div>
          </div>
        </div>
      </>}
      </div>{/* end left panel */}

      {/* Right detail pane */}
      {detailItem && (
        <div className="detail-pane-enter" style={{ width: 300, flexShrink: 0, borderLeft: "1px solid #e8e7e2", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Detail header */}
          <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #e8e7e2", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a18", letterSpacing: "-0.01em", lineHeight: 1.3 }}>Item details</div>
              <button className="hover-icon btn-press" onClick={() => setDetailItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#b0afa9", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 5, flexShrink: 0 }}
              ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
          </div>

          {/* Detail content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            {/* Thumb + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <Thumb type={detailItem.thumb} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: "#1a1a18", lineHeight: 1.25 }}>{detailItem.name}</div>
                <div style={{ fontSize: 11, color: "#8c8b86", marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontWeight: 600, color: detailItem.type === "MAT" ? "#a08030" : detailItem.type === "SVC" ? "#5a7a9a" : "#5a7040" }}>{detailItem.type === "MAT" ? "Material" : detailItem.type === "SVC" ? "Service" : "Equipment"}</span>
                  <span style={{ color: "#d8d7d2" }}>·</span>
                  <span>{detailItem.group}</span>
                </div>
              </div>
            </div>

            {/* Details list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { label: "Catalog ID", value: detailItem.catalogId },
                { label: "Unit", value: detailItem.defaultUnit },
                { label: "Location", value: detailItem.location },
                { label: "Availability", value: detailItem.availability, badge: true },
              ].map(({ label, value, badge }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0eeea" }}>
                  <span style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500 }}>{label}</span>
                  {badge ? (
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                      background: value === "In stock" ? "#dcfce7" : value === "Low stock" ? "#fef3c7" : "#f0eeea",
                      color: value === "In stock" ? "#166534" : value === "Low stock" ? "#92400e" : "#6b6a65",
                    }}>{value}</span>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18" }}>{value}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Add / remove + quantity */}
            <div style={{ marginTop: 20 }}>
              {checked.has(detailItem.catalogId) ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button className="btn-press" onClick={() => toggleItem(detailItem.catalogId)} style={{
                    padding: "9px 14px", fontSize: 12, fontWeight: 700, borderRadius: 8,
                    border: "1px solid #e0dfda", background: "#fff", color: "#6b6a65", cursor: "pointer",
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}
                    className="btn-press hover-danger-border"
                  >Remove</button>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", border: "1px solid #d8d7d2", borderRadius: 8, overflow: "hidden", background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                    <button className="qty-btn" onClick={() => setQty(detailItem.catalogId, (quantities.get(detailItem.catalogId) || 1) - 1)} style={{ width: 32, height: 34, border: "none", borderRight: "1px solid #eae9e4", background: "none", cursor: "pointer", fontSize: 15, color: "#6b6a65", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ flex: 1, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#1a1a18", ...tn }}>{quantities.get(detailItem.catalogId) || 1} <span style={{ fontSize: 11, fontWeight: 500, color: "#8c8b86" }}>{UNIT_LABELS[detailItem.defaultUnit] || detailItem.defaultUnit}</span></span>
                    <button className="qty-btn" onClick={() => setQty(detailItem.catalogId, (quantities.get(detailItem.catalogId) || 1) + 1)} style={{ width: 32, height: 34, border: "none", borderLeft: "1px solid #eae9e4", background: "none", cursor: "pointer", fontSize: 15, color: "#6b6a65", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                </div>
              ) : (
                <button className="btn-press" onClick={() => { toggleItem(detailItem.catalogId); }} style={{
                  width: "100%", padding: "9px 0", fontSize: 12, fontWeight: 700, borderRadius: 8,
                  border: "none", background: "#1a1a18", color: "#fff", cursor: "pointer",
                }}
                  className="btn-press hover-dark"
                >Add to selection</button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Right detail pane — Bundle */}
      {detailBundle && (
        <div className="detail-pane-enter" style={{ width: 300, flexShrink: 0, borderLeft: "1px solid #e8e7e2", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #e8e7e2", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a18", letterSpacing: "-0.01em", lineHeight: 1.3 }}>Bundle details</div>
              <button className="hover-icon btn-press" onClick={() => setDetailBundle(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#b0afa9", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 5, flexShrink: 0 }}
              ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            {/* Bundle icon + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #e8eef4 0%, #dbeafe 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: "#1a1a18", lineHeight: 1.25 }}>{detailBundle.name}</div>
                <div style={{ fontSize: 11, color: "#8c8b86", marginTop: 2 }}>{detailBundle.items.length} items included</div>
              </div>
            </div>

            {/* Description — editable */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Description</div>
              <textarea
                value={getBundleDetail(detailBundle.bundleId, "description", detailBundle.description || "")}
                onChange={e => setBundleDetail(detailBundle.bundleId, "description", e.target.value)}
                placeholder="Add a description..."
                rows={3}
                style={{ width: "100%", fontSize: 12, color: "#1a1a18", lineHeight: 1.5, padding: "8px 10px", border: "1px solid #e8e7e2", borderRadius: 6, background: "#fff", resize: "vertical", fontFamily: "inherit", transition: "border-color 120ms ease" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#1a1a18"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#e8e7e2"; }}
              />
            </div>

            {/* Bundle cost & sell price — view only */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={{ background: "#fafaf8", border: "1px solid #eae9e4", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Bundle Cost</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a18", ...tn }}>{$(detailBundle.defaultUnitCost)}</div>
              </div>
              <div style={{ background: "#fafaf8", border: "1px solid #eae9e4", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Sell Price</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a18", ...tn }}>{$(detailBundle.defaultUnitPrice)}</div>
              </div>
            </div>

            {/* Billable & Profitability switchers */}
            {(() => {
              const billable = getBundleDetail(detailBundle.bundleId, "billable", true);
              const forProfit = getBundleDetail(detailBundle.bundleId, "forProfitability", true);
              const rowStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0eeea" };
              const switcherStyle = { display: "inline-flex", borderRadius: 6, border: "1px solid #e0dfda", overflow: "hidden", flexShrink: 0 };
              const optStyle = (active) => ({
                fontSize: 11, fontWeight: 600, padding: "4px 12px", border: "none", cursor: "pointer",
                background: active ? "#1a1a18" : "#fff", color: active ? "#fff" : "#8c8b86",
                transition: "background 120ms ease, color 120ms ease",
              });
              return (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={rowStyle}>
                    <span style={{ fontSize: 12, color: "#1a1a18", fontWeight: 500 }}>Billable</span>
                    <div style={switcherStyle}>
                      <button style={optStyle(billable)} onClick={() => setBundleDetail(detailBundle.bundleId, "billable", true)}>Yes</button>
                      <button style={optStyle(!billable)} onClick={() => setBundleDetail(detailBundle.bundleId, "billable", false)}>No</button>
                    </div>
                  </div>
                  <div style={rowStyle}>
                    <span style={{ fontSize: 12, color: "#1a1a18", fontWeight: 500 }}>Consider for Profitability</span>
                    <div style={switcherStyle}>
                      <button style={optStyle(forProfit)} onClick={() => setBundleDetail(detailBundle.bundleId, "forProfitability", true)}>Yes</button>
                      <button style={optStyle(!forProfit)} onClick={() => setBundleDetail(detailBundle.bundleId, "forProfitability", false)}>No</button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Bundle ID */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0eeea" }}>
              <span style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500 }}>Bundle ID</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18" }}>{detailBundle.bundleId}</span>
            </div>

            {/* Add / remove + quantity */}
            <div style={{ marginTop: 16 }}>
              {checkedBundles.has(detailBundle.bundleId) ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button className="btn-press" onClick={() => toggleBundle(detailBundle.bundleId)} style={{
                    padding: "9px 14px", fontSize: 12, fontWeight: 700, borderRadius: 8,
                    border: "1px solid #e0dfda", background: "#fff", color: "#6b6a65", cursor: "pointer",
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}
                    className="btn-press hover-danger-border"
                  >Remove</button>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", border: "1px solid #d8d7d2", borderRadius: 8, overflow: "hidden", background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                    <button className="qty-btn" onClick={() => setBQty(detailBundle.bundleId, (bundleQty.get(detailBundle.bundleId) || 1) - 1)} style={{ width: 32, height: 34, border: "none", borderRight: "1px solid #eae9e4", background: "none", cursor: "pointer", fontSize: 15, color: "#6b6a65", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ flex: 1, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#1a1a18", ...tn }}>{bundleQty.get(detailBundle.bundleId) || 1} <span style={{ fontSize: 11, fontWeight: 500, color: "#8c8b86" }}>bundle</span></span>
                    <button className="qty-btn" onClick={() => setBQty(detailBundle.bundleId, (bundleQty.get(detailBundle.bundleId) || 1) + 1)} style={{ width: 32, height: 34, border: "none", borderLeft: "1px solid #eae9e4", background: "none", cursor: "pointer", fontSize: 15, color: "#6b6a65", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                </div>
              ) : (
                <button className="btn-press" onClick={() => toggleBundle(detailBundle.bundleId)} style={{
                  width: "100%", padding: "9px 0", fontSize: 12, fontWeight: 700, borderRadius: 8,
                  border: "none", background: "#1a1a18", color: "#fff", cursor: "pointer",
                }}
                  className="btn-press hover-dark"
                >Add to selection</button>
              )}
            </div>
          </div>
        </div>
      )}

      </div>{/* end dialog container */}

      {/* Line Item picker mini-dialog */}

    </div>
  );
}

export { CatalogDialog, CATALOG_ITEMS, CATALOG_BUNDLES, CATALOG_GROUPS, Thumb, ALL_PARTS };

export default function App({ embedded = false, pendingColorItems = null, embeddedTopBorder = true, embeddedFooterBefore = null, hideEmbeddedProfitStrip = false, embeddedEditMode = false }) {
  const { flags: devFlags } = useContext(DevFlagsContext);
  const appRootRef = useRef(null);
  const [demoEmpty, setDemoEmpty] = useState(false);
  const [tableOnly, setTableOnly] = useState(false);
  const [reworkView, setReworkView] = useState(true);
  const [tab, setTab] = useState(0);
  const [sort, setSort] = useState({ col: null, dir: "desc" });
  const [expandedMainBundles, setExpandedMainBundles] = useState(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [dragItem, setDragItem] = useState(null); // { type: "item"|"bundle"|"group", id: string }
  const [dragOverItem, setDragOverItem] = useState(null);
  const [draggingGroup, setDraggingGroup] = useState(null); // group name when dragging a section header
  const [sectionMenu, setSectionMenu] = useState(null); // section id when its actions menu is open
  const [profitExpanded, setProfitExpanded] = useState(false);
  const [targetMargin, setTargetMargin] = useState(35); // target margin % slider
  const [tableSearch, setTableSearch] = useState("");
  const [tableFilters, setTableFilters] = useState({ type: null, billable: null, margin: null });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef(null);
  const [rowMenu, setRowMenu] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null); // draft copy for editing
  const [selected, setSelected] = useState(new Set());
  const [activeQuotes, setActiveQuotes] = useState(new Set([QUOTES[0].id]));
  const [pricelistId, setPricelistId] = useState("default");
  const [showMenu, setShowMenu] = useState(false);
  const [showColConfig, setShowColConfig] = useState(false);
  const [colHeaderMenu, setColHeaderMenu] = useState(null);
  const [colMenuPos, setColMenuPos] = useState(null);
  const colHeaderMenuRef = useRef(null);
  const [columns, setColumns] = useState(embedded ? [
    { id: "options", label: "", visible: true, locked: true },
    { id: "pendingSelection", label: "Option", visible: Boolean(pendingColorItems?.size), locked: false },
    { id: "taxPref", label: "Tax Preference", visible: true, locked: false },
    { id: "location", label: "Location", visible: true, locked: false },
    { id: "asset", label: "Asset", visible: true, locked: false },
    { id: "price", label: "Price (USD)", visible: true, locked: false },
    { id: "total", label: "Total (USD)", visible: true, locked: false },
  ] : [
    { id: "qty", label: "Qty", visible: true, locked: false },
    { id: "unitCost", label: "Unit cost", visible: true, locked: false },
    { id: "unitPrice", label: "Unit price", visible: false, locked: false },
    { id: "revenue", label: "Price", visible: true, locked: false },
    { id: "profit", label: "Profit", visible: true, locked: false },
    { id: "margin", label: "Margin", visible: true, locked: false },
    { id: "markup", label: "Markup", visible: false, locked: false },
  ]);
  const [dragCol, setDragCol] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const visibleCols = columns.filter(c => c.visible);
  const [showPricelist, setShowPricelist] = useState(false);
  const [showPricelistMenu, setShowPricelistMenu] = useState(false);
  const [pricelistSearch, setPricelistSearch] = useState("");
  const [financingId, setFinancingId] = useState("none");
  const [showFinancing, setShowFinancing] = useState(false);
  const [showFinancingMenu, setShowFinancingMenu] = useState(false);
  const [financingSearch, setFinancingSearch] = useState("");
  const [financingSubmenu, setFinancingSubmenu] = useState(null); // group id or null
  const [financingStripOpen, setFinancingStripOpen] = useState(null); // null, "open", or "open:groupId"
  const [discountMode, setDiscountMode] = useState("transaction"); // "transaction" or "line-item"
  const [showDiscountMenu, setShowDiscountMenu] = useState(false);
  const [discounts, setDiscounts] = useState([
    { id: 1, name: "Early payment", type: "%", value: 5, disabled: false },
    { id: 2, name: "Loyalty discount", type: "$", value: 250, disabled: false },
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Permit fees", value: 350, disabled: false },
    { id: 2, name: "Equipment rental", value: 480, disabled: false },
  ]);
  const [commissions, setCommissions] = useState([
    { id: 1, name: "Sales commission", type: "%", value: 3, disabled: false },
  ]);
  const [dialog, setDialog] = useState(null);
  const [requestItems, setRequestItems] = useState([]);
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [page, setPage] = useState("table"); // "table" | "analytics"
  const metricsRef = useRef(null);
  const theadRef = useRef(null);
  const profitStripRef = useRef(null);
  const centerPaneRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [embeddedFooterSettled, setEmbeddedFooterSettled] = useState(false);
  const [isBottomSticky] = useState(false); // kept for compat
  const [showQuotesPanel, setShowQuotesPanel] = useState(false);
  const [breakdownTab, setBreakdownTab] = useState("revenue");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [parts, setParts] = useState(ALL_PARTS);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef(null);
  const tooltipTimeout = useRef(null);
  const [itemSelections, setItemSelections] = useState(new Map());
  const [colorPickerOpen, setColorPickerOpen] = useState(null);

  // Inherit-from menu + selection sliders
  const [showInheritMenu, setShowInheritMenu] = useState(false);
  const [inheritSlider, setInheritSlider] = useState(null); // "quote" | "po-so" | null
  const [inheritSearch, setInheritSearch] = useState("");
  const [inheritChecked, setInheritChecked] = useState(new Set());
  const [inheritTypeFilter, setInheritTypeFilter] = useState(null); // "PO" | "SO" | null
  const [inheritStatusFilter, setInheritStatusFilter] = useState(null); // "Submitted" | null
  const [inheritTypeMenuOpen, setInheritTypeMenuOpen] = useState(false);
  const [inheritStatusMenuOpen, setInheritStatusMenuOpen] = useState(false);
  const [linkedQuotes, setLinkedQuotes] = useState([]); // [{id,title,date,value,status,items}]
  const [linkedPos, setLinkedPos] = useState([]); // [{id,type,title,date,value,status,vendor,items}]
  const [selectedSourceChips, setSelectedSourceChips] = useState(new Set()); // ids selected for bulk remove
  const [removeConfirm, setRemoveConfirm] = useState(null); // { kind: "quote"|"po", ids: [...] }
  const [toast, setToast] = useState(null); // string

  const showTooltip = (key) => {
    clearTimeout(tooltipTimeout.current);
    setHoveredMetric(key);
  };
  const hideTooltip = () => {
    tooltipTimeout.current = setTimeout(() => setHoveredMetric(null), 200);
  };

  const toggleQuote = (id) => setActiveQuotes((prev) => {
    const next = new Set(prev);
    if (next.has(id)) { if (next.size > 1) next.delete(id); } else next.add(id);
    return next;
  });

  const selectedQuotes = QUOTES.filter((q) => activeQuotes.has(q.id));
  const primaryQuote = selectedQuotes[0] || QUOTES[0];
  const bl = {
    revenue: selectedQuotes.reduce((s, q) => s + q.revenue, 0) / (selectedQuotes.length || 1),
    cogs: selectedQuotes.reduce((s, q) => s + q.cogs, 0) / (selectedQuotes.length || 1),
    profit: selectedQuotes.reduce((s, q) => s + q.profit, 0) / (selectedQuotes.length || 1),
    materials: selectedQuotes.reduce((s, q) => s + q.materials, 0) / (selectedQuotes.length || 1),
    labor: selectedQuotes.reduce((s, q) => s + q.labor, 0) / (selectedQuotes.length || 1),
  };
  const blMargin = bl.revenue > 0 ? bl.profit / bl.revenue : 0;

  const PARTS = demoEmpty ? [] : parts;
  const LABOR = demoEmpty ? [] : ALL_LABOR;
  const hasData = PARTS.length > 0 || LABOR.some((l) => l.total > 0);

  useEffect(() => {
    let ticking = false;
    let lastSticky = false;
    const check = () => {
      const thead = theadRef.current;
      if (!thead) { ticking = false; return; }
      // The thead is position:sticky top:0 (or top:44 when strip visible).
      // When stuck, theadTop ≈ 0. When in natural flow at page top, theadTop is large.
      // Use metricsRef bottom to know when KPI cards have scrolled past viewport top.
      const metrics = metricsRef.current;
      const metricsBottom = metrics ? metrics.getBoundingClientRect().bottom : Infinity;
      // Strip appears when KPI cards' bottom edge passes the viewport top
      const shouldStick = metricsBottom <= 0;
      const shouldUnstick = metricsBottom > 44;
      if (shouldStick && !lastSticky) { lastSticky = true; setIsSticky(true); setHoveredMetric(null); clearTimeout(tooltipTimeout.current); }
      else if (shouldUnstick && lastSticky) { lastSticky = false; setIsSticky(false); }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(check); }
    };
    const scrollEl = centerPaneRef.current || document.body;
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    check();
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [hasData]);

  // Bottom sticky handled natively via CSS `position: sticky; bottom: 0` on the strip

  useEffect(() => {
    if (!embedded) return;
    const root = appRootRef.current;
    const strip = profitStripRef.current;
    if (!root || !strip) return;

    const getScrollParent = (node) => {
      let el = node?.parentElement;
      while (el && el !== document.body) {
        const style = window.getComputedStyle(el);
        if (/(auto|scroll|overlay)/.test(style.overflowY)) return el;
        el = el.parentElement;
      }
      return window;
    };

    const scrollParent = getScrollParent(root);
    let raf = 0;
    const check = () => {
      raf = 0;
      const rootRect = root.getBoundingClientRect();
      const stripRect = strip.getBoundingClientRect();
      setEmbeddedFooterSettled(stripRect.bottom >= rootRect.bottom - 1);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };

    check();
    scrollParent.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      scrollParent.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [embedded, hasData]);

  useEffect(() => {
    if (!rowMenu) return;
    const close = () => setRowMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [rowMenu]);

  useEffect(() => {
    if (!showAddMenu) return;
    const handleClick = (e) => { if (addMenuRef.current && !addMenuRef.current.contains(e.target)) setShowAddMenu(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showAddMenu]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(id);
  }, [toast]);

  const billable = PARTS.filter((p) => p.billable);
  const partsRev = billable.reduce((s, p) => s + p.unitPrice * p.qty, 0);
  const partsCost = PARTS.reduce((s, p) => s + p.unitCost * p.qty, 0);
  const laborCost = LABOR.reduce((s, l) => s + l.total, 0);
  const totalDiscount = discounts.filter(d => !d.disabled).reduce((s, d) => s + (d.type === "%" ? partsRev * d.value / 100 : d.value), 0);
  const totalExpenses = expenses.filter(e => !e.disabled).reduce((s, e) => s + e.value, 0);
  const totalCommissions = commissions.filter(c => !c.disabled).reduce((s, c) => s + (c.type === "%" ? partsRev * c.value / 100 : c.value), 0);
  const rev = partsRev - totalDiscount;
  const cogs = partsCost + laborCost;
  const profit = rev - cogs;
  const margin = rev > 0 ? profit / rev : 0;
  const nbCost = PARTS.filter((p) => !p.billable).reduce((s, p) => s + p.unitCost * p.qty, 0);
  const maxProfit = useMemo(() => Math.max(...(billable.length ? billable.map((p) => (p.unitPrice - p.unitCost) * p.qty) : [1]), 1), [billable]);
  const renderPendingSelectionCell = (part, padding) => {
    const selectedOption = getPendingSelectionOption(itemSelections.get(part.id));
    const isPendingItem = pendingColorItems?.has(part.id);
    const options = getPendingSelectionOptionsForPart(part);
    return (
      <TableCell key="pendingSelection" style={{ padding, textAlign: "left", position: "relative" }}>
        {!isPendingItem ? (
          <span style={{ fontSize: 12, color: "#d0cfca" }}>—</span>
        ) : (
          <div style={{ position: "relative", display: "inline-flex", maxWidth: "100%" }}>
            <button
              onClick={(e) => { e.stopPropagation(); setColorPickerOpen(colorPickerOpen === part.id ? null : part.id); }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                maxWidth: "100%",
                padding: "4px 9px",
                borderRadius: 6,
                border: selectedOption ? "1px solid #e5e5e5" : "1px solid #f0d9b8",
                background: selectedOption ? "#fff" : "#fff8ef",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                color: selectedOption ? "#6b6a65" : "#92400e",
                whiteSpace: "nowrap",
              }}
            >
              {selectedOption && <span style={{ width: 10, height: 10, borderRadius: "50%", background: selectedOption.color, flexShrink: 0, boxShadow: selectedOption.color === "#f5f5f4" ? "inset 0 0 0 1px #d6d3d1" : "none" }} />}
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{selectedOption ? selectedOption.name : "Select"}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {colorPickerOpen === part.id && (
              <>
                <div onClick={e => { e.stopPropagation(); setColorPickerOpen(null); }} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
                <div className="dropdown-enter" style={{ position: "absolute", left: 0, top: "calc(100% + 6px)", zIndex: 100, background: "#fff", borderRadius: 8, border: "1px solid #e8e7e2", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: "6px 0", width: 220, overflow: "hidden" }}>
                  {options.map((option) => {
                    const isSelected = selectedOption?.id === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={e => {
                          e.stopPropagation();
                          setItemSelections(prev => {
                            const next = new Map(prev);
                            next.set(part.id, option.id);
                            return next;
                          });
                          setColorPickerOpen(null);
                        }}
                        className="dropdown-item"
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", border: "none", background: isSelected ? "#faf7f1" : "none", cursor: "pointer", textAlign: "left" }}
                      >
                        <span style={{ width: 14, height: 14, borderRadius: "50%", background: option.color, flexShrink: 0, boxShadow: option.color === "#f5f5f4" ? "inset 0 0 0 1px #d6d3d1" : "none" }} />
                        <span style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: isSelected ? 600 : 500, color: "#1a1a18", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{option.name}</span>
                        {isSelected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                    );
                  })}
                  {selectedOption && (
                    <>
                      <div style={{ height: 1, background: "#f3f1ec", margin: "4px 0" }} />
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setItemSelections(prev => {
                            const next = new Map(prev);
                            next.delete(part.id);
                            return next;
                          });
                          setColorPickerOpen(null);
                        }}
                        className="dropdown-item"
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", border: "none", background: "none", cursor: "pointer", textAlign: "left", color: "#8c8b86", fontSize: 12, fontWeight: 500 }}
                      >
                        <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#f5f4f0", border: "1px solid #e8e7e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10 }}>×</span>
                        Clear selection
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </TableCell>
    );
  };

  const sections = useMemo(() => PARTS.filter(p => p.isSection), [PARTS]);
  const tsLower = tableSearch.toLowerCase();
  const activeFilterCount = Object.values(tableFilters).filter(v => v !== null).length;
  const groups = useMemo(() => {
    const map = new Map();
    const base = PARTS.filter(p => !p.isSection);
    let searched = tsLower ? base.filter(p => p.name.toLowerCase().includes(tsLower) || p.id.toLowerCase().includes(tsLower) || (p.sku && p.sku.toLowerCase().includes(tsLower)) || (p.description && p.description.toLowerCase().includes(tsLower)) || p.group.toLowerCase().includes(tsLower)) : base;
    // Apply quick filters
    if (tableFilters.type) searched = searched.filter(p => p.type === tableFilters.type);
    if (tableFilters.billable !== null) searched = searched.filter(p => p.billable === tableFilters.billable);
    if (tableFilters.margin === "high") searched = searched.filter(p => p.unitPrice > 0 && (p.unitPrice - p.unitCost) / p.unitPrice >= 0.5);
    if (tableFilters.margin === "low") searched = searched.filter(p => p.unitPrice > 0 && (p.unitPrice - p.unitCost) / p.unitPrice < 0.5);
    if (tableFilters.margin === "negative") searched = searched.filter(p => p.unitPrice > 0 && (p.unitPrice - p.unitCost) < 0);
    const items = sort.col ? [...searched].sort((a, b) => {
      const g = (p) => sort.col === "cost" ? p.unitCost * p.qty : sort.col === "revenue" ? p.unitPrice * p.qty : sort.col === "profit" ? (p.unitPrice - p.unitCost) * p.qty : sort.col === "margin" ? (p.unitPrice > 0 ? (p.unitPrice - p.unitCost) / p.unitPrice : -1) : 0;
      return sort.dir === "asc" ? g(a) - g(b) : g(b) - g(a);
    }) : searched;
    items.forEach((p) => { if (!map.has(p.group)) map.set(p.group, []); map.get(p.group).push(p); });
    // Hoist the "Inherited" group to the top so carried-forward items show first
    if (map.has("Inherited")) {
      const inherited = map.get("Inherited");
      const ordered = new Map();
      ordered.set("Inherited", inherited);
      for (const [k, v] of map) { if (k !== "Inherited") ordered.set(k, v); }
      return ordered;
    }
    return map;
  }, [PARTS, sort, tsLower, tableFilters]);

  const doSort = (c) => setSort((s) => s.col === c ? { col: c, dir: s.dir === "asc" ? "desc" : "asc" } : { col: c, dir: "desc" });
  const S = (c) => sort.col === c ? (sort.dir === "asc" ? " ↑" : " ↓") : "";
  const toggleMainBundle = (key) => setExpandedMainBundles(prev => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  const toggleGroup = (gName) => setCollapsedGroups(prev => { const next = new Set(prev); if (next.has(gName)) next.delete(gName); else next.add(gName); return next; });
  const handleDragStart = (id) => setDragItem(id);
  const handleDragOver = (e, id) => { e.preventDefault(); setDragOverItem(id); };
  const handleDrop = (targetId) => {
    if (!dragItem || dragItem === targetId) { setDragItem(null); setDragOverItem(null); setDraggingGroup(null); return; }
    setParts(prev => {
      const arr = [...prev];
      const fromIdx = arr.findIndex(p => p.id === dragItem);
      const toIdx = arr.findIndex(p => p.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return arr;
    });
    setDragItem(null);
    setDragOverItem(null);
    setDraggingGroup(null);
  };
  const handleGroupDragStart = (gName) => {
    setDraggingGroup(gName);
    setDragItem("group:" + gName);
    setCollapsedGroups(prev => { const next = new Set(prev); next.add(gName); return next; });
  };
  const handleGroupDragEnd = (gName) => {
    setDragItem(null);
    setDragOverItem(null);
    setDraggingGroup(null);
    setCollapsedGroups(prev => { const next = new Set(prev); next.delete(gName); return next; });
  };
  const handleBundleDragStart = (bundleId) => setDragItem("bundle:" + bundleId);
  const handleBundleDragEnd = () => { setDragItem(null); setDragOverItem(null); };

  // Map bundles to groups based on item overlap
  const groupBundles = useMemo(() => {
    const map = new Map();
    const assigned = new Set();
    // Score each bundle per group by overlap count, assign to best-match group only
    const groupKeys = [...groups.keys()];
    const scores = [];
    groupKeys.forEach(gName => {
      const gItemNames = new Set((groups.get(gName) || []).map(p => p.name));
      CATALOG_BUNDLES.forEach(b => {
        const overlap = b.items.filter(bi => gItemNames.has(bi.name)).length;
        if (overlap > 0) scores.push({ gName, bundle: b, overlap });
      });
    });
    scores.sort((a, b) => b.overlap - a.overlap);
    scores.forEach(({ gName, bundle }) => {
      if (assigned.has(bundle.bundleId)) return;
      assigned.add(bundle.bundleId);
      if (!map.has(gName)) map.set(gName, []);
      map.get(gName).push(bundle);
    });
    // Ensure all groups have an entry
    groupKeys.forEach(gName => { if (!map.has(gName)) map.set(gName, []); });
    return map;
  }, [groups]);

  // All selectable IDs = part IDs + visible bundle IDs
  const allSelectableIds = useMemo(() => {
    const ids = PARTS.filter(p => !p.isSection).map(p => p.id);
    [...groupBundles.values()].forEach(bundles => bundles.forEach(b => { if (!ids.includes(b.bundleId)) ids.push(b.bundleId); }));
    return ids;
  }, [PARTS, groupBundles]);

  const tabs = [
    { name: "Parts & services", n: PARTS.filter(p => !p.isSection).length, add: "Add", hasAddMenu: true },
    { name: "Labor", n: LABOR.length, add: "Add labor" },
    { name: "Expenses", n: ALL_EXPENSES.length, add: "Add expense" },
    { name: "Commissions", n: ALL_COMMISSIONS.length, add: "Add commission" },
    { name: "Status bar", n: 0, add: null },
  ];

  const renderProfitExpandedContent = () => (
    <div className="tab-content-enter" style={{ padding: "16px 20px 20px", background: "#fafaf8", display: "flex", gap: 32 }}>
      <div style={{ flex: "0 0 260px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12 }}>Target margin</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <input
            type="range"
            min={0} max={80} step={1}
            value={targetMargin}
            onChange={e => setTargetMargin(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#1a1a18", height: 4, cursor: "pointer" }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18", minWidth: 38, textAlign: "right", ...tn }}>{targetMargin}%</span>
        </div>
        <div style={{ position: "relative", height: 6, borderRadius: 3, background: "#e8e7e2", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 3, width: `${Math.min(margin * 100, 100)}%`, background: margin * 100 >= targetMargin ? "linear-gradient(90deg, #86efac, #16a34a)" : margin * 100 >= targetMargin * 0.6 ? "linear-gradient(90deg, #fde68a, #d97706)" : "linear-gradient(90deg, #fca5a5, #dc2626)", transition: "width 300ms cubic-bezier(0.23, 1, 0.32, 1)" }} />
          <div style={{ position: "absolute", left: `${targetMargin}%`, top: -3, width: 2, height: 12, background: "#1a1a18", borderRadius: 1, transition: "left 200ms cubic-bezier(0.23, 1, 0.32, 1)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "#b0afa9" }}>
          <span>0%</span>
          <span style={{ fontWeight: 600, color: margin * 100 >= targetMargin ? "#16a34a" : "#d97706" }}>
            {margin * 100 >= targetMargin ? "On target" : `${(targetMargin - margin * 100).toFixed(1)}% below target`}
          </span>
          <span>80%</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px 24px" }}>
        {[
          { label: "Revenue", value: $(rev), sub: "Billable items", color: "#1a1a18" },
          { label: "Total COGS", value: $(cogs), sub: `Parts ${$(partsCost)} · Labor ${$(laborCost)}`, color: "#1a1a18" },
          { label: "Gross Profit", value: $(profit), sub: profit >= 0 ? "Positive" : "Loss", color: profit >= 0 ? "#16a34a" : "#dc2626" },
          { label: "Gross Margin", value: pct(margin), sub: margin >= 0.3 ? "Healthy" : margin >= 0.1 ? "Below avg" : "Critical", color: margin >= 0.3 ? "#16a34a" : margin >= 0.1 ? "#d97706" : "#dc2626" },
          { label: "Parts Cost", value: $(partsCost), sub: `${PARTS.length} line items`, color: "#1a1a18" },
          { label: "Labor Cost", value: $(laborCost), sub: `${LABOR.filter(l => l.total > 0).length} entries`, color: "#1a1a18" },
        ].map((m, i) => (
          <div key={i} style={{ animationDelay: `${i * 30}ms` }} className="tab-content-enter">
            <div style={{ fontSize: 10, fontWeight: 600, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: m.color, ...tn, lineHeight: 1.2 }}>{m.value}</div>
            <div style={{ fontSize: 10, color: "#a3a29c", marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfitStripHeader = ({ label, embeddedMode }) => (
    <button
      onClick={() => setProfitExpanded(v => !v)}
      style={{ width: "100%", padding: "10px 20px", background: profitExpanded ? "#fafaf8" : "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background 120ms ease" }}
      onMouseEnter={e => { if (!profitExpanded) e.currentTarget.style.background = "#fafaf8"; }}
      onMouseLeave={e => { if (!profitExpanded) e.currentTarget.style.background = "#fff"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b6a65" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#4a4a46" }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {!profitExpanded && (
          embeddedMode ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "#8c8b86", fontVariantNumeric: "tabular-nums" }}>
              <span>Total <span style={{ fontWeight: 700, color: "#1a1a18" }}>{$(rev)}</span></span>
              <span style={{ width: 1, height: 12, background: "#e8e7e2" }} />
              <span>Cost <span style={{ fontWeight: 700, color: "#1a1a18" }}>{$(cogs)}</span></span>
              <span style={{ width: 1, height: 12, background: "#e8e7e2" }} />
              <span>Margin <span style={{ fontWeight: 700, color: margin >= 0.3 ? "#16a34a" : margin >= 0.1 ? "#d97706" : "#dc2626" }}>{pct(margin)}</span></span>
              <span style={{ width: 1, height: 12, background: "#e8e7e2" }} />
              <span>Profit <span style={{ fontWeight: 700, color: profit >= 0 ? "#16a34a" : "#dc2626" }}>{$(profit)}</span></span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "#8c8b86", ...tn }}>
              <span>Revenue <span style={{ fontWeight: 700, color: "#1a1a18" }}>{$(rev)}</span></span>
              <span style={{ width: 1, height: 12, background: "#e8e7e2" }} />
              <span>Margin <span style={{ fontWeight: 700, color: margin >= 0.3 ? "#16a34a" : margin >= 0.1 ? "#d97706" : "#dc2626" }}>{pct(margin)}</span></span>
              <span style={{ width: 1, height: 12, background: "#e8e7e2" }} />
              <span>Profit <span style={{ fontWeight: 700, color: profit >= 0 ? "#16a34a" : "#dc2626" }}>{$(profit)}</span></span>
            </div>
          )
        )}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#b0afa9" strokeWidth="1.5" strokeLinecap="round" style={{ transform: profitExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms cubic-bezier(0.23, 1, 0.32, 1)", flexShrink: 0 }}><path d="M2 3.5l3 3 3-3"/></svg>
      </div>
    </button>
  );

  return (
    <div ref={appRootRef} className={reworkView ? "rework-scope" : undefined} style={{ color: "#1a1a18", background: "#fff", height: embedded ? "auto" : "100%", display: "flex", flexDirection: "column", position: "relative" }}>

      {/* Tab bar now lives in CenterPane (Shell.jsx) */}

      {/* Scrollable content area */}
      <div ref={embedded ? undefined : centerPaneRef} style={embedded ? undefined : { flex: 1, overflowY: "auto", position: "relative", padding: "0 16px", background: "#f5f4f0" }}>
      <div style={embedded ? undefined : { border: "1px solid #e8e7e2", borderRadius: 24, background: "#fff", margin: "16px 0" }}>

      {/* Compact top strip — sticks to top of scroll container */}
      {!embedded && !tableOnly && !reworkView && hasData && (
        <div style={{
          position: "sticky", top: 0, left: 0, right: 0,
          zIndex: 50,
          pointerEvents: isSticky ? "auto" : "none",
          marginBottom: isSticky ? 0 : -44,
          height: 44,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 0,
            padding: "0 24px",
            height: 44,
            background: "#fff", borderBottom: "1px solid #e8e7e2",
            boxShadow: isSticky ? "0 1px 8px rgba(0,0,0,0.06)" : "none",
            transform: isSticky ? "translateY(0)" : "translateY(-100%)",
            opacity: isSticky ? 1 : 0,
            transition: "transform 250ms cubic-bezier(0.23, 1, 0.32, 1), opacity 180ms ease-out, box-shadow 280ms ease",
            willChange: "transform, opacity",
          }}>
            {[
              { label: "Revenue", val: rev, key: "revenue", inv: false },
              { label: "COGS", val: cogs, key: "cogs", inv: true },
              { label: "Profit", val: profit, key: "profit", inv: false },
            ].map((m, i) => {
              const diff = m.val - bl[m.key];
              const good = m.inv ? diff < 0 : diff > 0;
              return (
                <Fragment key={i}>
                  {i > 0 && <span style={{ color: "#b0afa9", fontSize: 13, fontWeight: 600, margin: "0 10px", flexShrink: 0 }}>{i === 1 ? "−" : "="}</span>}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, ...tn, color: i === 2 ? (profit >= 0 ? "#166534" : "#991b1b") : "#1a1a18" }}>{$(m.val)}</span>
                    {diff !== 0 && <span style={{ fontSize: 10, fontWeight: 600, ...tn, color: good ? "#166534" : "#991b1b" }}>{diff > 0 ? "+" : ""}{$(diff)}</span>}
                  </div>
                </Fragment>
              );
            })}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 10, paddingLeft: 10, borderLeft: "1px solid #e8e7e2" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Margin</span>
              <span style={{ fontSize: 14, fontWeight: 700, ...tn, color: margin >= 0.3 ? "#166534" : margin >= 0.1 ? "#92400e" : "#991b1b" }}>{pct(margin)}</span>
            </div>
            <span style={{ flex: 1 }} />
            <button className="hover-subtle btn-press" onClick={() => (centerPaneRef.current || document.body).scrollTo({ top: 0, behavior: "smooth" })} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e0dfda", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "#8c8b86" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/><line x1="5" y1="3" x2="19" y2="3"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Frame 1 — Header & KPIs */}
      {!embedded && (<>
      <div style={{ padding: "0 24px 0" }}>

      {/* KPI cards — stay in normal flow, scroll away naturally */}
      {!tableOnly && !reworkView && (hasData ? (
        <>
          <div ref={metricsRef} style={{ marginBottom: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.02)", borderRadius: 12, background: "#fafaf8", border: "1px solid #e8e7e2" }}>
            <div style={{ display: "flex", alignItems: "stretch", position: "relative", zIndex: 2, borderRadius: 10, background: "#fff", boxShadow: "0 1px 0 #e8e7e2, 0 3px 8px rgba(0,0,0,0.05)" }}>
              {[
                { label: "Revenue", val: rev, key: "revenue", inv: false },
                { label: "COGS", val: cogs, key: "cogs", inv: true },
                { label: "Profit", val: profit, key: "profit", inv: false },
              ].map((m, i, arr) => {
                const proj = bl[m.key];
                const diff = m.val - proj;
                const countDelay = 80 + i * 80;
                return (
                  <div key={i} className="kpi-card" style={{ flex: 1, padding: "20px 22px", borderRight: i < arr.length - 1 ? "1px solid #e8e7e2" : "none", position: "relative" }}>
                    {i > 0 && <div className={`kpi-operator op-${i}`} style={{ position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: 99, background: "#fff", border: "1px solid #e8e7e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#8c8b86", fontWeight: 700, zIndex: 1 }}>{i === 1 ? "−" : "="}</div>}
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{m.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", ...tn, lineHeight: 1.1, color: i === 2 ? (profit >= 0 ? "#166534" : "#991b1b") : "#1a1a18" }}><AnimatedValue value={m.val} duration={650} delay={countDelay} /></div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, flexWrap: "wrap", position: "relative", padding: "3px 6px", margin: "-3px -6px", cursor: "default" }}
                      onMouseEnter={() => showTooltip(m.key)} onMouseLeave={hideTooltip}>
                      {diff !== 0 ? <Pill val={diff} invert={m.inv} delay={countDelay + 500} /> : <span className="pill-enter" style={{ fontSize: 11, color: "#b0afa9", ...tn, animationDelay: `${countDelay + 500}ms` }}>On target</span>}
                      <span className="pill-enter" style={{ fontSize: 10, color: "#b0afa9", ...tn, animationDelay: `${countDelay + 520}ms` }}>vs {$(proj)} est.</span>
                      <div className="kpi-tooltip" data-visible={hoveredMetric === m.key || undefined}
                        onMouseEnter={() => showTooltip(m.key)} onMouseLeave={hideTooltip}>
                          {[
                            { label: "Materials", est: bl.materials, actual: partsCost, color: "#d4a853" },
                            { label: "Labor", est: bl.labor, actual: laborCost, color: "#5b9bd5" },
                          ].map((r, ri) => {
                            const pd = r.est > 0 ? ((r.actual - r.est) / r.est) * 100 : 0;
                            return (
                              <div key={ri} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#4a4a46", padding: "3px 0", marginBottom: ri === 0 ? 4 : 0 }}>
                                <span style={{ width: 5, height: 5, borderRadius: 2, background: r.color, flexShrink: 0, marginTop: 5 }} />
                                <span style={{ fontWeight: 500, width: 62, marginTop: 1 }}>{r.label}</span>
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontWeight: 600, ...tn }}>{$(r.actual)}</span>
                                    <span style={{ fontWeight: 600, fontSize: 11, ...tn, color: pd > 0 ? "#991b1b" : pd < 0 ? "#166534" : "#8c8b86" }}>{pd > 0 ? "+" : ""}{pd.toFixed(1)}%</span>
                                  </div>
                                  <div style={{ fontSize: 10, color: "#b0afa9", marginTop: 1, ...tn }}>est. {$(r.est)}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "12px 22px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span className="cost-split-item" style={{ fontSize: 10, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Cost split</span>
              <div className="cost-split-bar" style={{ display: "flex", gap: 2, height: 6, borderRadius: 3, overflow: "hidden", flex: "0 0 80px" }}>
                {cogs > 0 && <><div style={{ flex: partsCost / cogs, background: "#d4a853" }} /><div style={{ flex: laborCost / cogs, background: "#5b9bd5" }} /></>}
              </div>
              {[{ l: "Materials", v: partsCost, c: "#d4a853" }, { l: "Labor", v: laborCost, c: "#5b9bd5" }].map((s, i) => (
                <div key={i} className="cost-split-item" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, animationDelay: `${400 + i * 60}ms` }}>
                  <span style={{ width: 6, height: 6, borderRadius: 2, background: s.c }} />
                  <span style={{ color: "#8c8b86" }}>{s.l}</span>
                  <span style={{ fontWeight: 700, ...tn }}>{$(s.v)}</span>
                </div>
              ))}
              <span style={{ flex: 1 }} />
              <button
                onClick={() => { setShowQuotesPanel(v => !v); if (!showQuotesPanel) setBreakdownTab("revenue"); }}
                className="cost-split-item"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 6,
                  border: "1px solid #e0dfda", background: showQuotesPanel ? "#f0efeb" : "#fff",
                  color: "#4a4a46", cursor: "pointer", whiteSpace: "nowrap",
                  transition: "background 150ms ease, border-color 150ms ease",
                  animationDelay: "480ms",
                }}>
                Breakdown
                <svg width="10" height="10" viewBox="0 0 10 10" style={{ transform: showQuotesPanel ? "rotate(180deg)" : "rotate(0)", transition: "transform 200ms cubic-bezier(0.23, 1, 0.32, 1)" }}>
                  <path d="M2.5 4L5 6.5L7.5 4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={() => setPage(page === "table" ? "analytics" : "table")} className={`view-more-btn cost-split-item${page === "analytics" ? " back" : ""}`} style={{ animationDelay: "520ms" }}>{page === "analytics" ? <><span className="arrow">←</span> Back to Table</> : <>View More <span className="arrow">→</span></>}</button>
            </div>
            {/* Breakdown expand panel */}
            <div className="scope-notes-wrap" {...(showQuotesPanel ? { "data-open": "" } : {})}>
              <div>
                <div style={{ padding: "12px 22px", background: "#fff", borderTop: "1px solid #e8e7e2" }}>
                  {/* Revenue / COGS pills */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    {["revenue", "cogs"].map((t) => {
                      const on = breakdownTab === t;
                      return (
                        <button key={t} onClick={() => setBreakdownTab(t)} style={{ fontSize: 11, fontWeight: 600, padding: "4px 14px", borderRadius: 99, border: on ? "1px solid #1a1a18" : "1px solid #e0dfda", cursor: "pointer", background: on ? "#1a1a18" : "#fff", color: on ? "#fff" : "#6b6a65", transition: "background 150ms ease-out, border-color 150ms ease-out, color 150ms ease-out" }}>
                          {t === "revenue" ? "Revenue" : "COGS"}
                        </button>
                      );
                    })}
                  </div>
                  {breakdownTab === "revenue" ? (
                  <table style={{ width: "100%", fontSize: 11 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e8e7e2" }}>
                        <th style={{ textAlign: "left", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Quote</th>
                        <th style={{ textAlign: "left", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Revenue</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>COGS</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Profit</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {QUOTES.map((q) => {
                        const qm = q.revenue > 0 ? q.profit / q.revenue : 0;
                        return (
                          <tr key={q.id} style={{ borderBottom: "1px solid #eeede8" }}>
                            <td style={{ padding: "7px 0", fontWeight: 600, color: "#4a4a46" }}>{q.name}</td>
                            <td style={{ padding: "7px 0" }}>
                              <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: q.status === "Approved" ? "#f0fdf4" : "#f5f4f0", color: q.status === "Approved" ? "#16a34a" : "#8c8b86", textTransform: "uppercase", letterSpacing: "0.04em" }}>{q.status}</span>
                            </td>
                            <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(q.revenue)}</td>
                            <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(q.cogs)}</td>
                            <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn, color: q.profit >= 0 ? "#166534" : "#991b1b" }}>{$(q.profit)}</td>
                            <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn, color: qm >= 0.3 ? "#166534" : qm >= 0.1 ? "#92400e" : "#991b1b" }}>{pct(qm)}</td>
                          </tr>
                        );
                      })}
                      <tr style={{ borderTop: "2px solid #e8e7e2" }}>
                        <td style={{ padding: "7px 0", fontWeight: 700, color: "#1a1a18" }}>Actuals</td>
                        <td style={{ padding: "7px 0" }}>
                          <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#eef2ff", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.04em" }}>Current</span>
                        </td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(rev)}</td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(cogs)}</td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn, color: profit >= 0 ? "#166534" : "#991b1b" }}>{$(profit)}</td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn, color: margin >= 0.3 ? "#166534" : margin >= 0.1 ? "#92400e" : "#991b1b" }}>{pct(margin)}</td>
                      </tr>
                    </tbody>
                  </table>
                  ) : (
                  <table style={{ width: "100%", fontSize: 11 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e8e7e2" }}>
                        <th style={{ textAlign: "left", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Category</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Items</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>Cost</th>
                        <th style={{ textAlign: "right", padding: "4px 0 8px", fontSize: 9, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em" }}>% of COGS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const groups = {};
                        PARTS.forEach((p) => {
                          if (!groups[p.group]) groups[p.group] = { count: 0, cost: 0 };
                          groups[p.group].count += 1;
                          groups[p.group].cost += p.unitCost * p.qty;
                        });
                        const rows = Object.entries(groups).sort((a, b) => b[1].cost - a[1].cost);
                        return rows.map(([group, data]) => (
                          <tr key={group} style={{ borderBottom: "1px solid #eeede8" }}>
                            <td style={{ padding: "7px 0", fontWeight: 600, color: "#4a4a46" }}>{group}</td>
                            <td style={{ padding: "7px 0", textAlign: "right", ...tn, color: "#6b6a65" }}>{data.count}</td>
                            <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(data.cost)}</td>
                            <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 600, ...tn, color: "#8c8b86" }}>{cogs > 0 ? pct(data.cost / cogs) : "—"}</td>
                          </tr>
                        ));
                      })()}
                      <tr style={{ borderBottom: "1px solid #eeede8" }}>
                        <td style={{ padding: "7px 0", fontWeight: 600, color: "#4a4a46" }}>Labor</td>
                        <td style={{ padding: "7px 0", textAlign: "right", ...tn, color: "#6b6a65" }}>{LABOR.length}</td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(laborCost)}</td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 600, ...tn, color: "#8c8b86" }}>{cogs > 0 ? pct(laborCost / cogs) : "—"}</td>
                      </tr>
                      <tr style={{ borderTop: "2px solid #e8e7e2" }}>
                        <td style={{ padding: "7px 0", fontWeight: 700, color: "#1a1a18" }}>Total COGS</td>
                        <td style={{ padding: "7px 0" }} />
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn }}>{$(cogs)}</td>
                        <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 700, ...tn, color: "#1a1a18" }}>100%</td>
                      </tr>
                    </tbody>
                  </table>
                  )}
                </div>
              </div>
            </div>
          </div>

        </>
      ) : (
        <div style={{ display: "flex", marginBottom: 24, border: "1px solid #e8e7e2", borderRadius: 10, overflow: "hidden", background: "#fafaf8" }}>
          {[{ label: "Est. revenue", val: primaryQuote.revenue }, { label: "Est. COGS", val: primaryQuote.cogs }, { label: "Est. profit", val: primaryQuote.profit }].map((m, i, arr) => (
            <div key={i} style={{ flex: 1, padding: "20px 22px", borderRight: i < arr.length - 1 ? "1px solid #e8e7e2" : "none", position: "relative" }}>
              {i > 0 && <div style={{ position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: 99, background: "#fafaf8", border: "1px solid #e8e7e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#8c8b86", fontWeight: 700, zIndex: 1 }}>{i === 1 ? "−" : "="}</div>}
              <div style={{ fontSize: 11, fontWeight: 600, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", ...tn, lineHeight: 1.1, color: "#8c8b86" }}>{$(m.val)}</div>
              <div style={{ marginTop: 8 }}><span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: "#eae9e4", color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.04em" }}>From quote</span></div>
            </div>
          ))}
        </div>
      ))}

      </div>{/* End Frame 1 */}
      </>)}

      {page === "analytics" ? (
        <AnalyticsView
          rev={rev} cogs={cogs} profit={profit} margin={margin}
          partsCost={partsCost} laborCost={laborCost} nbCost={nbCost}
          groups={groups} bl={bl} blMargin={blMargin}
          onBack={() => setPage("table")}
          quotes={QUOTES}
        />
      ) : (
      <div className="page-enter">
      {/* Frame 2 — Tabs */}
      {!embedded && (
      <div style={{ borderBottom: "1px solid #e8e7e2", padding: "12px 12px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "stretch", borderRadius: 100, border: "1px solid #e0dfda", overflow: "hidden" }}>
          {tabs.map((t, i) => {
            const on = tab === i;
            return (
              <button key={i} onClick={() => setTab(i)}
                style={{ padding: "6px 14px", fontSize: 12, fontWeight: 500, color: on ? "#1a1a18" : "#8c8b86", background: on ? "rgba(0,0,0,0.06)" : "transparent", border: "none", borderRight: i < tabs.length - 1 ? "1px solid #e0dfda" : "none", cursor: "pointer", whiteSpace: "nowrap", transition: "background 120ms cubic-bezier(0.23, 1, 0.32, 1), color 120ms cubic-bezier(0.23, 1, 0.32, 1)" }}
                onMouseEnter={e => { if (!on) { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; e.currentTarget.style.color = "#4a4a46"; } }}
                onMouseLeave={e => { if (!on) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8c8b86"; } }}
              >
                {t.name}
              </button>
            );
          })}
        </div>
        <span style={{ flex: 1 }} />
        <span className="margin-hero" style={{ fontSize: 13, ...tn, padding: "0 4px" }}>
          <span style={{ fontWeight: 500, color: "#8c8b86" }}>{hasData ? "Profit margin " : "Projected margin "}</span>
          <span style={{ fontWeight: 700, color: hasData ? (margin >= 0.3 ? "#16a34a" : margin >= 0.1 ? "#d97706" : "#dc2626") : "#8c8b86" }}>{hasData ? pct(margin) : pct(blMargin)}</span>
        </span>
      </div>
      </div>
      )}{/* End Frame 2 */}

      {/* Frame 3 — Content */}
      <div key={tab} className={embedded ? undefined : "tab-content-enter"}>
      {/* Content */}
      {tab === 0 && PARTS.length > 0 ? (
        <div style={embedded ? { borderTop: embeddedTopBorder ? "1px solid #e8e7e2" : "none" } : undefined}>
          {/* Table search + filters + actions */}
          {!embedded && <div className="table-toolbar" style={{ padding: "10px 12px", borderBottom: "1px solid #f0eeea", background: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", minWidth: 180, maxWidth: 320, flex: 1 }}>
              <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b0afa9" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7.5"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
                placeholder="Search items..."
                style={{ width: "100%", height: 28, fontSize: 12, padding: "0 30px 0 34px", borderRadius: 999, border: "1px solid #e8e7e2", background: "#fafaf8", color: "#1a1a18", transition: "border-color 120ms ease, box-shadow 120ms ease" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#c5c4bf"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.03)"; e.currentTarget.style.background = "#fff"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#e8e7e2"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#fafaf8"; }}
              />
              {tableSearch && (
                <button onClick={() => setTableSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "#e8e7e2", border: "none", cursor: "pointer", color: "#6b6a65", width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>✕</button>
              )}
            </div>

            {/* Filters dropdown */}
            <div style={{ position: "relative" }} ref={filtersRef}>
              <button
                onClick={() => setFiltersOpen(p => !p)}
                className="btn-press"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  height: 28, padding: "0 12px", fontSize: 12, fontWeight: 600,
                  borderRadius: 999, border: activeFilterCount > 0 ? "1px solid #3b82f6" : "1px solid #e0dfda",
                  background: activeFilterCount > 0 ? "#eff6ff" : "#fff",
                  color: activeFilterCount > 0 ? "#3b82f6" : "#6b6a65",
                  cursor: "pointer", whiteSpace: "nowrap",
                  transition: "all 120ms ease",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filters
                {activeFilterCount > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, background: "#3b82f6", color: "#fff", borderRadius: 10, padding: "0 5px", minWidth: 16, textAlign: "center", lineHeight: "16px" }}>{activeFilterCount}</span>
                )}
              </button>

              {filtersOpen && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setFiltersOpen(false)} />
                  <div className="dropdown-enter" style={{
                    position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100,
                    width: 220, background: "#fff", borderRadius: 10,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.04)",
                    border: "1px solid #e8e7e2", overflow: "hidden",
                  }}>
                    <div style={{ padding: "10px 12px 6px", fontSize: 10, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.04em" }}>Type</div>
                    <div style={{ padding: "0 8px 8px", display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {[{ val: "MAT", label: "Material" }, { val: "SVC", label: "Service" }, { val: "EQ", label: "Equipment" }].map(t => (
                        <button key={t.val} onClick={() => setTableFilters(f => ({ ...f, type: f.type === t.val ? null : t.val }))}
                          style={{
                            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
                            border: tableFilters.type === t.val ? "1px solid #3b82f6" : "1px solid #e8e7e2",
                            background: tableFilters.type === t.val ? "#eff6ff" : "#fafaf8",
                            color: tableFilters.type === t.val ? "#3b82f6" : "#6b6a65",
                            cursor: "pointer", transition: "all 100ms ease",
                          }}>{t.label}</button>
                      ))}
                    </div>
                    <div style={{ height: 1, background: "#f0eeea" }} />
                    <div style={{ padding: "10px 12px 6px", fontSize: 10, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.04em" }}>Billable</div>
                    <div style={{ padding: "0 8px 8px", display: "flex", gap: 4 }}>
                      {[{ val: true, label: "Billable" }, { val: false, label: "Non-billable" }].map(t => (
                        <button key={String(t.val)} onClick={() => setTableFilters(f => ({ ...f, billable: f.billable === t.val ? null : t.val }))}
                          style={{
                            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
                            border: tableFilters.billable === t.val ? "1px solid #3b82f6" : "1px solid #e8e7e2",
                            background: tableFilters.billable === t.val ? "#eff6ff" : "#fafaf8",
                            color: tableFilters.billable === t.val ? "#3b82f6" : "#6b6a65",
                            cursor: "pointer", transition: "all 100ms ease",
                          }}>{t.label}</button>
                      ))}
                    </div>
                    <div style={{ height: 1, background: "#f0eeea" }} />
                    <div style={{ padding: "10px 12px 6px", fontSize: 10, fontWeight: 700, color: "#b0afa9", textTransform: "uppercase", letterSpacing: "0.04em" }}>Margin</div>
                    <div style={{ padding: "0 8px 10px", display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {[{ val: "high", label: "≥ 50%" }, { val: "low", label: "< 50%" }, { val: "negative", label: "Negative" }].map(t => (
                        <button key={t.val} onClick={() => setTableFilters(f => ({ ...f, margin: f.margin === t.val ? null : t.val }))}
                          style={{
                            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
                            border: tableFilters.margin === t.val ? "1px solid #3b82f6" : "1px solid #e8e7e2",
                            background: tableFilters.margin === t.val ? "#eff6ff" : "#fafaf8",
                            color: tableFilters.margin === t.val ? "#3b82f6" : "#6b6a65",
                            cursor: "pointer", transition: "all 100ms ease",
                          }}>{t.label}</button>
                      ))}
                    </div>
                    {activeFilterCount > 0 && (
                      <>
                        <div style={{ height: 1, background: "#f0eeea" }} />
                        <button onClick={() => { setTableFilters({ type: null, billable: null, margin: null }); setFiltersOpen(false); }}
                          style={{
                            width: "100%", padding: "8px 12px", fontSize: 11, fontWeight: 600,
                            color: "#ef4444", background: "none", border: "none", cursor: "pointer",
                            textAlign: "left", transition: "background 100ms ease",
                          }}
                          className="hover-delete"
                        >Clear all filters</button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            <span style={{ flex: 1 }} />

            {/* Add menu */}
            {tabs[tab].hasAddMenu ? (
              <div style={{ position: "relative" }} ref={addMenuRef}>
                <button onClick={() => setShowAddMenu(v => !v)} className="btn-press" style={{ height: 28, fontSize: 12, fontWeight: 600, padding: "0 14px", borderRadius: 7, border: "none", background: showAddMenu ? "#2a2a28" : "#1a1a18", cursor: "pointer", color: "#fff", display: "inline-flex", alignItems: "center", gap: 5, transition: "background 120ms ease" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                  {tabs[tab].add}
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d={showAddMenu ? "M3 7.5L6 4.5L9 7.5" : "M3 4.5L6 7.5L9 4.5"} /></svg>
                </button>
                {showAddMenu && (
                  <div className="dropdown-enter" style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", width: 200, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 20, padding: "4px 0" }}>
                    <button onClick={() => { setShowAddMenu(false); setCatalogOpen(true); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/></svg>
                      Line item
                    </button>
                    <button onClick={() => {
                      setShowAddMenu(false);
                      const sectionId = "SEC-" + Date.now();
                      setParts(prev => [...prev, { id: sectionId, name: "", type: "SECTION", group: "", qty: 0, unit: "", unitCost: 0, unitPrice: 0, billable: false, isSection: true, _editing: true }]);
                    }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                      Section
                    </button>
                    <div style={{ height: 1, background: "#f0eeea", margin: "4px 0" }} />
                    <button className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", border: "none", background: "none", cursor: "not-allowed", fontSize: 13, color: "#b0afa9", textAlign: "left" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d0cfca" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                      Group
                    </button>
                    <button className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", border: "none", background: "none", cursor: "not-allowed", fontSize: 13, color: "#b0afa9", textAlign: "left" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d0cfca" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Custom item
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setCatalogOpen(true)} className="btn-press" style={{ height: 28, fontSize: 12, fontWeight: 600, padding: "0 14px", borderRadius: 7, border: "none", background: "#1a1a18", cursor: "pointer", color: "#fff", display: "inline-flex", alignItems: "center", gap: 5, transition: "background 120ms ease" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>{tabs[tab].add}</button>
            )}

            {/* 3-dot menu */}
            <div style={{ position: "relative" }}>
              <button onClick={() => { setShowMenu(!showMenu); setShowPricelistMenu(false); setShowFinancingMenu(false); setShowColConfig(false); setPricelistSearch(""); setFinancingSearch(""); }} className="btn-press" style={{ width: 28, height: 28, padding: 0, borderRadius: 7, border: "1px solid #e0dfda", background: showMenu ? "#f5f4f0" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b6a65", fontSize: 18, lineHeight: 1, transition: "background 120ms ease, border-color 120ms ease" }}>⋯</button>
              {showMenu && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 19 }} onClick={() => { setShowMenu(false); setShowPricelistMenu(false); setShowFinancingMenu(false); setShowDiscountMenu(false); setShowColConfig(false); setShowInheritMenu(false); }} />
                  <div className="dropdown-enter" style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", width: 240, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 20, padding: "4px 0" }}>
                <button onClick={() => { setShowPricelistMenu(v => !v); setShowFinancingMenu(false); setShowDiscountMenu(false); setShowColConfig(false); setShowInheritMenu(false); setPricelistSearch(""); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: showPricelistMenu ? "#f5f4f0" : "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left", overflow: "hidden" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 7h16M4 12h16M4 17h10"/><circle cx="19" cy="17" r="3"/><path d="M17.5 18.5L16 20"/></svg>
                  <span style={{ fontWeight: pricelistId !== "default" ? 600 : 400, whiteSpace: "nowrap" }}>Pricelist</span>
                  <span style={{ flex: 1 }} />
                  {pricelistId !== "default" && <span style={{ fontSize: 11, color: "#8c8b86", fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 100 }}>{PRICELISTS.find(p => p.id === pricelistId)?.name}</span>}
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#8c8b86" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M3 1l3 3-3 3"/></svg>
                </button>
                {showPricelistMenu && (
                  <div style={{ position: "absolute", right: "calc(100% + 4px)", top: 0, width: 220, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 21 }}>
                    <div style={{ padding: "8px 8px 4px" }}>
                      <input
                        autoFocus
                        value={pricelistSearch}
                        onChange={(e) => setPricelistSearch(e.target.value)}
                        placeholder="Search pricelists…"
                        style={{ width: "100%", fontSize: 12, padding: "6px 10px", borderRadius: 5, border: "1px solid #e0dfda", background: "#fafaf8", color: "#1a1a18" }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {PRICELISTS.filter(pl => pl.id !== "default" && pl.name.toLowerCase().includes(pricelistSearch.toLowerCase())).map((pl) => (
                      <button
                        key={pl.id}
                        onClick={() => { setPricelistId(pl.id === pricelistId ? "default" : pl.id); setShowPricelistMenu(false); setShowMenu(false); }}
                        className="dropdown-item"
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: pl.id === pricelistId ? "#1a1a18" : "#4a4a46", fontWeight: pl.id === pricelistId ? 600 : 400, textAlign: "left" }}
                      >
                        {pl.name}
                        {pl.id === pricelistId && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                    ))}
                    {PRICELISTS.filter(pl => pl.id !== "default" && pl.name.toLowerCase().includes(pricelistSearch.toLowerCase())).length === 0 && (
                      <div style={{ padding: "12px 14px", fontSize: 12, color: "#a3a29c", textAlign: "center" }}>No results</div>
                    )}
                  </div>
                )}
                <button onClick={() => { setShowFinancingMenu(v => !v); setShowPricelistMenu(false); setShowDiscountMenu(false); setShowColConfig(false); setShowInheritMenu(false); setFinancingSearch(""); setFinancingSubmenu(null); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: showFinancingMenu ? "#f5f4f0" : "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left", overflow: "hidden" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                  <span style={{ fontWeight: financingId !== "none" ? 600 : 400, whiteSpace: "nowrap" }}>Financing</span>
                  <span style={{ flex: 1 }} />
                  {financingId !== "none" && <span style={{ fontSize: 11, color: "#8c8b86", fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 100 }}>{financingLookup(financingId)?.name}</span>}
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#8c8b86" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M3 1l3 3-3 3"/></svg>
                </button>
                {showFinancingMenu && (() => {
                  const activeGroup = financingSubmenu ? FINANCING_OPTIONS.find(g => g.id === financingSubmenu) : null;
                  const iconMap = {
                    calendar: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                    split: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>,
                    clock: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                    flag: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
                  };
                  return (
                  <div className="dropdown-enter" style={{ position: "absolute", right: "calc(100% + 4px)", top: 40, width: 240, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)", zIndex: 21, overflow: "hidden", transformOrigin: "top right" }}>
                    {!activeGroup ? (
                      <div key="groups" className={financingSubmenu === null ? "drill-out" : undefined}>
                        <div style={{ padding: "8px 8px 4px" }}>
                          <input
                            autoFocus
                            value={financingSearch}
                            onChange={(e) => setFinancingSearch(e.target.value)}
                            placeholder="Search financing…"
                            style={{ width: "100%", fontSize: 12, padding: "6px 10px", borderRadius: 5, border: "1px solid #e0dfda", background: "#fafaf8", color: "#1a1a18" }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        {FINANCING_OPTIONS.filter(g => g.name.toLowerCase().includes(financingSearch.toLowerCase()) || g.children.some(c => c.name.toLowerCase().includes(financingSearch.toLowerCase()))).map((g) => {
                          const hasSelected = g.children.some(c => c.id === financingId);
                          return (
                            <button
                              key={g.id}
                              onClick={() => { setFinancingSubmenu(g.id); setFinancingSearch(""); }}
                              className="dropdown-item"
                              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: hasSelected ? "#1a1a18" : "#4a4a46", fontWeight: hasSelected ? 600 : 400, textAlign: "left" }}
                            >
                              <span style={{ width: 28, height: 28, borderRadius: 7, background: `${g.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {iconMap[g.icon](g.color)}
                              </span>
                              <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.name}</span>
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#8c8b86" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M3 1l3 3-3 3"/></svg>
                            </button>
                          );
                        })}
                        {FINANCING_OPTIONS.filter(g => g.name.toLowerCase().includes(financingSearch.toLowerCase()) || g.children.some(c => c.name.toLowerCase().includes(financingSearch.toLowerCase()))).length === 0 && (
                          <div style={{ padding: "12px 14px", fontSize: 12, color: "#a3a29c", textAlign: "center" }}>No results</div>
                        )}
                      </div>
                    ) : (
                      <div key={"sub-" + activeGroup.id} className="drill-in">
                        <div style={{ padding: "8px 8px 4px" }}>
                          <button
                            onClick={() => { setFinancingSubmenu(null); setFinancingSearch(""); }}
                            className="btn-press hover-warm"
                            style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "#6b6a65", fontSize: 12, fontWeight: 600, padding: "4px 4px", borderRadius: 6 }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                            Back
                          </button>
                        </div>
                        <div style={{ padding: "4px 14px 8px", display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 28, height: 28, borderRadius: 7, background: `${activeGroup.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {iconMap[activeGroup.icon](activeGroup.color)}
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18" }}>{activeGroup.name}</span>
                        </div>
                        <div style={{ height: 1, background: "#f0eeea", margin: "0 0 4px" }} />
                        {activeGroup.children.map(c => (
                          <button
                            key={c.id}
                            onClick={(e) => { e.stopPropagation(); setFinancingId(c.id); setShowFinancing(true); setShowFinancingMenu(false); setFinancingSubmenu(null); setShowMenu(false); }}
                            className="dropdown-item"
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: c.id === financingId ? "#1a1a18" : "#4a4a46", fontWeight: c.id === financingId ? 600 : 400, textAlign: "left" }}
                          >
                            <span style={{
                              width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                              border: `2px solid ${c.id === financingId ? activeGroup.color : "#d0cfca"}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              {c.id === financingId && <span style={{ width: 6, height: 6, borderRadius: "50%", background: activeGroup.color }} />}
                            </span>
                            {c.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })()}
                {showColConfig && (
                  <div style={{ position: "absolute", right: "calc(100% + 4px)", top: 80, width: 220, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 21, padding: "4px 0" }}>
                    {columns.map((col, ci) => (
                      <div
                        key={col.id}
                        draggable
                        onDragStart={() => setDragCol(ci)}
                        onDragOver={(e) => { e.preventDefault(); setDragOverCol(ci); }}
                        onDrop={() => {
                          if (dragCol === null || dragCol === ci) { setDragCol(null); setDragOverCol(null); return; }
                          setColumns(prev => { const arr = [...prev]; const [moved] = arr.splice(dragCol, 1); arr.splice(ci, 0, moved); return arr; });
                          setDragCol(null); setDragOverCol(null);
                        }}
                        onDragEnd={() => { setDragCol(null); setDragOverCol(null); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
                          opacity: dragCol === ci ? 0.4 : 1,
                          borderTop: dragOverCol === ci && dragCol !== ci ? "2px solid #3b82f6" : "1px solid transparent",
                        }}
                      >
                        <span style={{ cursor: "grab", color: "#d0cfca", display: "flex", alignItems: "center", flexShrink: 0 }}>
                          <svg width="6" height="10" viewBox="0 0 6 10" fill="currentColor"><circle cx="1.5" cy="1.5" r="1"/><circle cx="4.5" cy="1.5" r="1"/><circle cx="1.5" cy="5" r="1"/><circle cx="4.5" cy="5" r="1"/><circle cx="1.5" cy="8.5" r="1"/><circle cx="4.5" cy="8.5" r="1"/></svg>
                        </span>
                        <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: col.visible ? "#1a1a18" : "#b0afa9" }}>{col.label}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setColumns(prev => prev.map((c, i) => i === ci ? { ...c, visible: !c.visible } : c)); }}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 1, display: "flex", alignItems: "center", color: col.visible ? "#166534" : "#d0cfca", flexShrink: 0 }}
                        >
                          {col.visible ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M20.188 10.934c.388.472.582.707.582 1.066s-.194.594-.582 1.066C18.768 14.79 15.636 18 12 18c-3.636 0-6.768-3.21-8.188-4.934C3.424 12.594 3.23 12.36 3.23 12s.194-.594.582-1.066C5.232 9.21 8.364 6 12 6c3.636 0 6.768 3.21 8.188 4.934z"/></svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 01-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => { setShowDiscountMenu(v => !v); setShowPricelistMenu(false); setShowFinancingMenu(false); setShowColConfig(false); setShowInheritMenu(false); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: showDiscountMenu ? "#f5f4f0" : "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left", overflow: "hidden" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
                  <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>Discount</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 11, color: "#8c8b86", fontWeight: 400, whiteSpace: "nowrap" }}>{discountMode === "transaction" ? "Transaction" : "Line item"}</span>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#8c8b86" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M3 1l3 3-3 3"/></svg>
                </button>
                {showDiscountMenu && (
                  <div className="dropdown-enter" style={{ position: "absolute", right: "calc(100% + 4px)", top: 80, width: 220, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)", zIndex: 21, padding: "4px 0", transformOrigin: "top right" }}>
                    <div style={{ padding: "6px 14px 8px", fontSize: 11, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Apply discount at</div>
                    {[{ id: "transaction", label: "Transaction level", desc: "Single discount on total" }, { id: "line-item", label: "Line item level", desc: "Per-item discounts" }].map(opt => {
                      const sel = discountMode === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => { setDiscountMode(opt.id); setShowDiscountMenu(false); setShowMenu(false); }}
                          className="dropdown-item"
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", border: "none", background: "none", cursor: "pointer", textAlign: "left" }}
                        >
                          <span style={{
                            width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                            border: `2px solid ${sel ? "#1a1a18" : "#d0cfca"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {sel && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1a1a18" }} />}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: sel ? 600 : 400, color: sel ? "#1a1a18" : "#4a4a46" }}>{opt.label}</div>
                            <div style={{ fontSize: 11, color: "#a3a29c", marginTop: 1 }}>{opt.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                <button onClick={() => { setShowInheritMenu(v => !v); setShowPricelistMenu(false); setShowFinancingMenu(false); setShowDiscountMenu(false); setShowColConfig(false); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: showInheritMenu ? "#f5f4f0" : "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left", overflow: "hidden" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>Inherit from</span>
                  <span style={{ flex: 1 }} />
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#8c8b86" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M3 1l3 3-3 3"/></svg>
                </button>
                {showInheritMenu && (
                  <div className="dropdown-enter" style={{ position: "absolute", right: "calc(100% + 4px)", top: 122, width: 240, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)", zIndex: 21, padding: "4px 0", transformOrigin: "top right" }}>
                    <div style={{ padding: "6px 14px 8px", fontSize: 11, fontWeight: 600, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Add line items from</div>
                    <button onClick={() => { setInheritSlider("quote"); setInheritSearch(""); setInheritChecked(new Set()); setShowInheritMenu(false); setShowMenu(false); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontSize: 13, color: "#1a1a18" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>Add Accepted Quotes</div>
                        <div style={{ fontSize: 11, color: "#a3a29c", marginTop: 1 }}>Parts & services from quotes</div>
                      </div>
                    </button>
                    <button onClick={() => { setInheritSlider("po-so"); setInheritSearch(""); setInheritChecked(new Set()); setInheritTypeFilter(null); setInheritStatusFilter(null); setShowInheritMenu(false); setShowMenu(false); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontSize: 13, color: "#1a1a18" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>Add Submitted PO/SO's</div>
                        <div style={{ fontSize: 11, color: "#a3a29c", marginTop: 1 }}>Parts from PO, services from SO</div>
                      </div>
                    </button>
                  </div>
                )}
                <div style={{ height: 1, background: "#e8e7e2", margin: "4px 0" }} />
                <button onClick={() => { setShowColConfig(v => !v); setShowPricelistMenu(false); setShowFinancingMenu(false); setShowDiscountMenu(false); setShowInheritMenu(false); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: showColConfig ? "#f5f4f0" : "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 3v18M3 12h18M9 3h6M9 21h6M3 9v6M21 9v6"/></svg>
                  <span style={{ flex: 1 }}>Customize columns</span>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#8c8b86" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M3 1l3 3-3 3"/></svg>
                </button>
                  </div>
                </>
              )}
            </div>
          </div>}


          <Table style={{ tableLayout: "fixed", width: "100%" }}>
            <colgroup>
              {!embedded && <col style={{ width: 36 }} />}
              <col />
              {visibleCols.map(c => {
                const colEmpty = embedded && (
                  (c.id === "asset" && PARTS.every(p => !p.asset)) ||
                  (c.id === "location" && PARTS.every(p => !p.location))
                );
                const w = embedded
                  ? (c.id === "options" ? "44px" : c.id === "pendingSelection" ? "176px" : colEmpty ? "5%" : c.id === "taxPref" ? "14%" : c.id === "location" ? "14%" : c.id === "asset" ? "12%" : c.id === "price" ? "13%" : c.id === "total" ? "13%" : c.id === "qty" ? "9%" : c.id === "margin" || c.id === "markup" ? "12%" : c.id === "unitCost" || c.id === "unitPrice" ? "13%" : c.id === "revenue" ? "14%" : "15%")
                  : (c.id === "qty" ? "7%" : c.id === "margin" || c.id === "markup" ? "10%" : c.id === "unitCost" || c.id === "unitPrice" ? "11%" : c.id === "revenue" ? "12%" : "14%");
                return <col key={c.id} style={{ width: w }} />;
              })}
              {!embedded && <col style={{ width: "4%" }} />}
            </colgroup>
            <TableHeader>
              <TableRow ref={theadRef} hoverBg={!embedded && undefined} style={{ position: "sticky", top: isSticky ? 44 : 0, zIndex: 10, background: !embedded && selected.size > 0 ? "#eef2ff" : "#fff", transition: "background 0.15s, top 250ms cubic-bezier(0.23, 1, 0.32, 1)", boxShadow: "0 1px 0 #e8e7e2, 0 1px 3px rgba(0,0,0,0.04)" }}>
                {!embedded && selected.size > 0 ? (
                  <TableHead colSpan={visibleCols.length + (embedded ? 1 : 3)} style={{ padding: "5px 14px 5px 6px", textAlign: "left" }}>
                    <div className="selection-bar" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", padding: "0 4px 0 12px" }}>
                        <input type="checkbox" checked={selected.size === allSelectableIds.length && allSelectableIds.length > 0} ref={(el) => { if (el) el.indeterminate = selected.size > 0 && selected.size < allSelectableIds.length; }} onChange={(e) => setSelected(e.target.checked ? new Set(allSelectableIds) : new Set())} style={{ width: 13, height: 13, cursor: "pointer", accentColor: "#1d4ed8", margin: 0 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", whiteSpace: "nowrap" }}>{selected.size} selected</span>
                      <span style={{ width: 1, height: 16, background: "#c7d7f0" }} />
                      {["Mark non-billable", "Change pricing", "Remove"].map((a) => (
                        <button key={a} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, border: "1px solid #c7d7f0", background: "#fff", cursor: "pointer", color: a === "Remove" ? "#991b1b" : "#1d4ed8", whiteSpace: "nowrap" }}>{a}</button>
                      ))}
                      <span style={{ width: 1, height: 16, background: "#c7d7f0" }} />
                      <button onClick={() => { setDialog("po"); setRequestItems([...selected].map(id => PARTS.find(p => p.id === id)).filter(Boolean)); }} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, border: "1px solid #c7d7f0", background: "#fff", cursor: "pointer", color: "#1d4ed8", whiteSpace: "nowrap" }}>PO from selected</button>
                      <button onClick={() => { setDialog("mr"); setRequestItems([...selected].map(id => PARTS.find(p => p.id === id)).filter(Boolean)); }} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, border: "1px solid #c7d7f0", background: "#fff", cursor: "pointer", color: "#1d4ed8", whiteSpace: "nowrap" }}>MR from selected</button>
                      <span style={{ flex: 1 }} />
                      <button onClick={() => setSelected(new Set())} style={{ fontSize: 10, fontWeight: 600, color: "#6b6a65", background: "none", border: "none", cursor: "pointer" }}>Clear</button>
                    </div>
                  </TableHead>
                ) : [
                  !embedded && <TableHead key="cb" style={{ padding: "6px 4px 6px 18px", textAlign: "center" }}>
                    <input type="checkbox" checked={selected.size === allSelectableIds.length && allSelectableIds.length > 0} ref={(el) => { if (el) el.indeterminate = selected.size > 0 && selected.size < allSelectableIds.length; }} onChange={(e) => setSelected(e.target.checked ? new Set(allSelectableIds) : new Set())} style={{ width: 13, height: 13, cursor: "pointer", accentColor: "#1d4ed8", margin: 0 }} />
                  </TableHead>,
                  ...[
                    { label: embedded ? "Product / Service" : "Item", align: "left", col: null },
                    ...visibleCols.map(c => ({
                      label: c.label,
                      align: c.id === "options" ? "center" : c.id === "pendingSelection" ? "left" : "right",
                      col: c.id === "options" || c.id === "pendingSelection" || c.id === "qty" || c.id === "unitPrice" ? null : c.id === "unitCost" ? "cost" : c.id,
                    })),
                    !embedded && { label: "", align: "center", col: null },
                  ].filter(Boolean).map((h, i, arr) => (
                    <TableHead key={i} onClick={() => h.col && doSort(h.col)} className="col-header-cell" style={{ padding: embedded ? (i === 0 ? "9px 14px 9px 40px" : i === arr.length - 1 ? "9px 40px 9px 14px" : "9px 14px") : "9px 14px", textAlign: h.align, cursor: h.col ? "pointer" : "default", userSelect: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap", position: "relative" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{h.label}{h.col ? S(h.col) : ""}</span>
                      {i === arr.length - 1 && <span ref={colHeaderMenuRef} className="col-header-dots" onClick={(e) => { e.stopPropagation(); if (colHeaderMenu) { setColHeaderMenu(null); setColMenuPos(null); } else { const rect = e.currentTarget.getBoundingClientRect(); let cb = { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }; let el = e.currentTarget.parentElement; while (el) { const s = getComputedStyle(el); if (s.transform !== "none" || s.filter !== "none" || s.perspective !== "none") { cb = el.getBoundingClientRect(); break; } el = el.parentElement; } setColMenuPos({ top: rect.bottom - cb.top + 4, right: cb.width - (rect.right - cb.left) }); setColHeaderMenu("menu"); } }} style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: colHeaderMenu ? 1 : 0, transition: "opacity 120ms ease, background 120ms ease", background: colHeaderMenu === "menu" ? "#f0eeea" : "transparent" }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="#8c8b86"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg>
                      </span>}
                    </TableHead>
                  ))
                ]}
              </TableRow>
            </TableHeader>
            <TableBody>
              {showFinancing && (() => {
                const stripOpen = financingStripOpen !== null;
                const stripSub = financingStripOpen?.startsWith?.("open:") ? financingStripOpen.split(":")[1] : null;
                const currentOpt = financingLookup(financingId);
                const iconMap = {
                  calendar: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                  split: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>,
                  clock: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  flag: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
                };
                return (
                <TableRow hoverBg={false} style={{ background: "#fff" }}>
                  <TableCell colSpan={visibleCols.length + (embedded ? 1 : 3)} style={{ padding: "9px 18px", borderBottom: "1px solid #f0eeea" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "#8c8b86" }}>Financing</span>
                      <div style={{ position: "relative" }}>
                        <button
                          onClick={() => setFinancingStripOpen(stripOpen ? null : "open")}
                          style={{ fontSize: 12, fontWeight: 600, padding: "3px 22px 3px 8px", borderRadius: 5, border: "1px solid #e8e7e2", background: "#fff", color: "#1a1a18", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 8 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l3 3 3-3' stroke='%23a3a29c' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}
                        >
                          {currentOpt?.name || "Select…"}
                        </button>
                        {stripOpen && (() => {
                          const activeGroup = stripSub ? FINANCING_OPTIONS.find(g => g.id === stripSub) : null;
                          return (
                          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, width: 240, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)", zIndex: 50, overflow: "hidden", animation: "dropdownIn 100ms cubic-bezier(0.23, 1, 0.32, 1) both", transformOrigin: "top left" }}>
                            {!activeGroup ? (
                              <div key="groups" className={stripSub === null ? "drill-out" : undefined}>
                                {FINANCING_OPTIONS.map((g) => {
                                  const hasSelected = g.children.some(c => c.id === financingId);
                                  return (
                                    <button
                                      key={g.id}
                                      onClick={() => setFinancingStripOpen(`open:${g.id}`)}
                                      className="dropdown-item"
                                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: hasSelected ? "#1a1a18" : "#4a4a46", fontWeight: hasSelected ? 600 : 400, textAlign: "left" }}
                                    >
                                      <span style={{ width: 28, height: 28, borderRadius: 7, background: `${g.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        {iconMap[g.icon](g.color)}
                                      </span>
                                      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.name}</span>
                                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#8c8b86" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M3 1l3 3-3 3"/></svg>
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div key={"sub-" + activeGroup.id} className="drill-in">
                                <div style={{ padding: "8px 8px 4px" }}>
                                  <button
                                    onClick={() => setFinancingStripOpen("open")}
                                    className="btn-press hover-warm"
                                    style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "#6b6a65", fontSize: 12, fontWeight: 600, padding: "4px 4px", borderRadius: 6 }}
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                                    Back
                                  </button>
                                </div>
                                <div style={{ padding: "4px 14px 8px", display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ width: 28, height: 28, borderRadius: 7, background: `${activeGroup.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {iconMap[activeGroup.icon](activeGroup.color)}
                                  </span>
                                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18" }}>{activeGroup.name}</span>
                                </div>
                                <div style={{ height: 1, background: "#f0eeea", margin: "0 0 4px" }} />
                                {activeGroup.children.map(c => (
                                  <button
                                    key={c.id}
                                    onClick={(e) => { e.stopPropagation(); setFinancingId(c.id); setFinancingStripOpen(null); }}
                                    className="dropdown-item"
                                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: c.id === financingId ? "#1a1a18" : "#4a4a46", fontWeight: c.id === financingId ? 600 : 400, textAlign: "left" }}
                                  >
                                    <span style={{
                                      width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                                      border: `2px solid ${c.id === financingId ? activeGroup.color : "#d0cfca"}`,
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                      {c.id === financingId && <span style={{ width: 6, height: 6, borderRadius: "50%", background: activeGroup.color }} />}
                                    </span>
                                    {c.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          );
                        })()}
                      </div>
                      <span style={{ fontSize: 11, color: "#b0afa9" }}>applied to all items</span>
                      <span style={{ flex: 1 }} />
                      <button onClick={() => { setShowFinancing(false); setFinancingId("none"); setFinancingStripOpen(null); }} style={{ fontSize: 11, color: "#a3a29c", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>✕</button>
                    </div>
                  </TableCell>
                </TableRow>
                );
              })()}
              {(() => { let _serialCtr = 0; return [...groups.entries()].map(([gName, items], gi) => {
                const gCost = items.reduce((s, p) => s + p.unitCost * p.qty, 0);
                const gRev = items.filter(p => p.billable).reduce((s, p) => s + p.unitPrice * p.qty, 0);
                const gBundles = groupBundles.get(gName) || [];
                return [
                  <TableRow key={"g-" + gi} className="group-header-row" hoverBg={false} draggable={!embedded && draggingGroup === gName} onDragOver={!embedded ? (e) => { e.preventDefault(); setDragOverItem("group:" + gName); } : undefined} onDrop={!embedded ? () => handleDrop("group:" + gName) : undefined} onDragEnd={!embedded ? () => handleGroupDragEnd(gName) : undefined} style={{ position: "sticky", top: isSticky ? 80 : 36, zIndex: 5, cursor: embedded ? "default" : "pointer", opacity: draggingGroup === gName ? 0.4 : 1, borderTop: dragOverItem === "group:" + gName && dragItem !== "group:" + gName ? "2px solid #3b82f6" : "1px solid #e8e7e2", boxShadow: "0 1px 0 #e8e7e2", height: embedded ? 36 : undefined }} onClick={() => toggleGroup(gName)}>
                    {!embedded && <TableCell className="group-header" style={{ padding: "0 4px 0 6px", verticalAlign: "middle", background: "#fafaf8", animationDelay: `${gi * 40}ms` }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span className="drag-handle" onMouseDown={(e) => { e.stopPropagation(); handleGroupDragStart(gName); e.currentTarget.closest("tr").draggable = true; }} style={{ cursor: "grab", color: "#d0cfca", display: "flex", alignItems: "center", padding: "2px 0" }}>
                          <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor"><circle cx="2" cy="2" r="1.2"/><circle cx="6" cy="2" r="1.2"/><circle cx="2" cy="7" r="1.2"/><circle cx="6" cy="7" r="1.2"/><circle cx="2" cy="12" r="1.2"/><circle cx="6" cy="12" r="1.2"/></svg>
                        </span>
                        <input type="checkbox" checked={items.every(p => selected.has(p.id)) && gBundles.every(b => selected.has(b.bundleId))} onChange={(e) => { const n = new Set(selected); if (e.target.checked) { items.forEach(p => n.add(p.id)); gBundles.forEach(b => n.add(b.bundleId)); } else { items.forEach(p => n.delete(p.id)); gBundles.forEach(b => n.delete(b.bundleId)); } setSelected(n); }} style={{ width: 13, height: 13, cursor: "pointer", accentColor: "#1a1a18", margin: 0 }} />
                      </div>
                    </TableCell>}
                    <TableCell colSpan={visibleCols.length + (embedded ? 1 : 2)} style={{ padding: embedded ? "7px 40px" : "4px 14px 4px 14px", background: "#fafaf8" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="group-title" style={{ fontSize: 12, fontWeight: 700, color: gName === "Inherited" ? "#1a1a18" : "#4a4a46" }}>{gName === "Inherited" ? "Inherited from Quote, PO/SO" : gName}</span>
                          <svg className="group-chevron" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#b0afa9" strokeWidth="1.5" strokeLinecap="round" style={{ transform: collapsedGroups.has(gName) ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 150ms ease", flexShrink: 0 }}><path d="M2 3.5l3 3 3-3"/></svg>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: "#8c8b86", ...tn, whiteSpace: "nowrap" }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: "#b0afa9" }}>{items.length} items</span>
                          <span>Cost {$(gCost)}</span>
                          {gName === "Inherited" && (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }} onClick={e => e.stopPropagation()}>
                              <button onClick={() => { setInheritSlider("quote"); setInheritSearch(""); setInheritChecked(new Set()); }} className="btn-press" style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6, border: "1px solid #dbeafe", background: "#eff6ff", color: "#1e40af", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                Add Quote
                              </button>
                              <button onClick={() => { setInheritSlider("po-so"); setInheritSearch(""); setInheritChecked(new Set()); setInheritTypeFilter(null); setInheritStatusFilter(null); }} className="btn-press" style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6, border: "1px solid #fde68a", background: "#fef3c7", color: "#854d0e", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                Add PO/SO
                              </button>
                            </div>
                          )}
                          {!embedded && <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                            <button className={sectionMenu === gName ? undefined : "row-dots"} onClick={() => setSectionMenu(sectionMenu === gName ? null : gName)} style={{ width: 24, height: 24, padding: 0, borderRadius: 5, border: "none", background: sectionMenu === gName ? "#eae9e4" : "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#b0afa9", fontSize: 15, lineHeight: 1, transition: "background 100ms ease, opacity 120ms ease" }}
                              onMouseEnter={e => { if (sectionMenu !== gName) e.currentTarget.style.background = "#f0eeea"; }}
                              onMouseLeave={e => { if (sectionMenu !== gName) e.currentTarget.style.background = "none"; }}
                            >⋯</button>
                            {sectionMenu === gName && (
                              <>
                                <div style={{ position: "fixed", inset: 0, zIndex: 19 }} onClick={() => setSectionMenu(null)} />
                                <div className="dropdown-enter" style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", width: 160, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 20, padding: "4px 0" }}>
                                  <button onClick={() => { setSectionMenu(null); const sec = PARTS.find(p => p.isSection && p.name === gName); if (sec) setParts(prev => prev.map(p => p.id === sec.id ? { ...p, _editing: true } : p)); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: "#1a1a18", textAlign: "left" }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Rename
                                  </button>
                                  <div style={{ height: 1, background: "#f0eeea", margin: "2px 0" }} />
                                  <button onClick={() => { setSectionMenu(null); setParts(prev => prev.filter(p => !(p.isSection && p.name === gName))); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: "#991b1b", textAlign: "left" }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                                    Delete section
                                  </button>
                                </div>
                              </>
                            )}
                          </div>}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>,
                  /* Bundles for this group — each with its own expand/collapse */
                  ...(!collapsedGroups.has(gName) ? gBundles : []).map((bundle) => {
                    const bKey = bundle.bundleId + "-" + gName;
                    const bMg = bundle.defaultUnitPrice > 0 ? (bundle.defaultUnitPrice - bundle.defaultUnitCost) / bundle.defaultUnitPrice : 0;
                    const bExpanded = expandedMainBundles.has(bKey);
                    const bSerial = String(++_serialCtr).padStart(3, "0");
                    return (
                      <Fragment key={"bdl-" + bKey}>
                        <TableRow draggable={!embedded} onDragStart={!embedded ? () => handleBundleDragStart(bundle.bundleId) : undefined} onDragOver={!embedded ? (e) => { e.preventDefault(); setDragOverItem("bundle:" + bundle.bundleId); } : undefined} onDrop={!embedded ? () => handleDrop("bundle:" + bundle.bundleId) : undefined} onDragEnd={!embedded ? handleBundleDragEnd : undefined} data-selected={!embedded && selected.has(bundle.bundleId) || undefined} style={{ background: "#fff", cursor: embedded ? "default" : "pointer", opacity: dragItem === "bundle:" + bundle.bundleId ? 0.4 : 1, borderTop: dragOverItem === "bundle:" + bundle.bundleId && dragItem !== "bundle:" + bundle.bundleId ? "2px solid #3b82f6" : undefined }} onClick={() => toggleMainBundle(bKey)}>
                          {!embedded && <TableCell style={{ padding: "0 4px 0 6px", textAlign: "center", verticalAlign: "middle" }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <span className="drag-handle" style={{ cursor: "grab", color: "#d0cfca", display: "flex", alignItems: "center", padding: "2px 0" }} onMouseDown={e => e.currentTarget.closest("tr").draggable = true}>
                                <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor"><circle cx="2" cy="2" r="1.2"/><circle cx="6" cy="2" r="1.2"/><circle cx="2" cy="7" r="1.2"/><circle cx="6" cy="7" r="1.2"/><circle cx="2" cy="12" r="1.2"/><circle cx="6" cy="12" r="1.2"/></svg>
                              </span>
                              <span className="row-serial" style={{ fontSize: 11, fontWeight: 600, color: "#b0afa9", fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em", flex: 1, textAlign: "center" }}>{bSerial}</span>
                              <input className="row-checkbox" type="checkbox" checked={selected.has(bundle.bundleId)} onChange={(e) => { const n = new Set(selected); e.target.checked ? n.add(bundle.bundleId) : n.delete(bundle.bundleId); setSelected(n); }} style={{ width: 13, height: 13, cursor: "pointer", accentColor: "#1a1a18", margin: 0 }} />
                            </div>
                          </TableCell>}
                          <TableCell style={{ padding: embedded ? "12px 14px 12px 40px" : "12px 14px", borderBottom: bExpanded ? "none" : undefined }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                              <div style={{ width: 30, height: 30, borderRadius: 6, background: "linear-gradient(135deg, #e8eef4 0%, #dbeafe 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>
                              </div>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div className="hover-link" onClick={(e) => { e.stopPropagation(); setViewItem({ id: bundle.bundleId, name: bundle.name, type: "BUNDLE", group: gName, qty: 1, unit: "ea", unitCost: bundle.defaultUnitCost, unitPrice: bundle.defaultUnitPrice, billable: true, notes: null, thumb: "bundle", description: bundle.items.length + " items included", sku: null }); }} style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18", cursor: "pointer" }}>{bundle.name}</div>
                                <div style={{ fontSize: 11, color: "#a3a29c", marginTop: 1, display: "flex", alignItems: "center", gap: 5 }}>
                                  <span>{bundle.items.length} items included</span>
                                  <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: "rgba(59,130,246,0.08)", color: "#3b82f6" }}>BUNDLE</span>
                                </div>
                              </div>
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#b0afa9" strokeWidth="1.5" strokeLinecap="round" style={{ transform: bExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms ease", flexShrink: 0 }}><path d="M2 3.5l3 3 3-3"/></svg>
                            </div>
                          </TableCell>
                          {visibleCols.map((c, ci) => {
                            const bPr = bundle.defaultUnitPrice - bundle.defaultUnitCost;
                            const bMkup = bundle.defaultUnitCost > 0 ? (bundle.defaultUnitPrice / bundle.defaultUnitCost - 1) * 100 : 0;
                            const bb = bExpanded ? "none" : undefined;
                            const bcp = embedded && ci === visibleCols.length - 1 ? "10px 40px 10px 14px" : "10px 14px";
                            if (c.id === "options") return <TableCell key={c.id} style={{ padding: "10px 6px", textAlign: "center", borderBottom: bb }} />;
                            if (c.id === "pendingSelection") return <TableCell key={c.id} style={{ padding: bcp, textAlign: "left", borderBottom: bb }}><span style={{ fontSize: 12, color: "#d0cfca" }}>—</span></TableCell>;
                            if (c.id === "qty") return <TableCell key={c.id} style={{ padding: bcp, textAlign: "right", fontSize: 13, ...tn, color: "#6b6a65", borderBottom: bb }}>1</TableCell>;
                            if (c.id === "unitCost") return <TableCell key={c.id} style={{ padding: bcp, textAlign: "right", fontSize: 13, ...tn, color: "#1a1a18", borderBottom: bb }}>{$(bundle.defaultUnitCost)}</TableCell>;
                            if (c.id === "unitPrice") return <TableCell key={c.id} style={{ padding: bcp, textAlign: "right", fontSize: 13, ...tn, color: "#1a1a18", borderBottom: bb }}>{$(bundle.defaultUnitPrice)}</TableCell>;
                            if (c.id === "revenue") return <TableCell key={c.id} style={{ padding: bcp, textAlign: "right", fontSize: 13, ...tn, color: "#1a1a18", borderBottom: bb }}>{$(bundle.defaultUnitPrice)}</TableCell>;
                            if (c.id === "profit") return <TableCell key={c.id} style={{ padding: bcp, textAlign: "right", borderBottom: bb }}><span style={{ fontSize: 13, fontWeight: 700, ...tn, color: "#166534" }}>{$(bPr)}</span></TableCell>;
                            if (c.id === "margin") return <TableCell key={c.id} style={{ padding: bcp, textAlign: "right", borderBottom: bb }}><span style={{ fontSize: 11, fontWeight: 700, padding: "3px 7px", borderRadius: 5, ...tn, background: bMg >= 0.4 ? "#dcfce7" : bMg >= 0.15 ? "#fef9c3" : "#fee2e2", color: bMg >= 0.4 ? "#166534" : bMg >= 0.15 ? "#854d0e" : "#991b1b" }}>{pct(bMg)}</span></TableCell>;
                            if (c.id === "markup") return <TableCell key={c.id} style={{ padding: bcp, textAlign: "right", fontSize: 13, ...tn, color: "#1a1a18", borderBottom: bb }}>{bMkup.toFixed(0)}%</TableCell>;
                            if (c.id === "taxPref") return <TableCell key={c.id} style={{ padding: bcp, textAlign: "right", fontSize: 12, color: "#6b6a65", borderBottom: bb }}>Taxable</TableCell>;
                            if (c.id === "location") return <TableCell key={c.id} style={{ padding: bcp, textAlign: "right", fontSize: 12, color: "#6b6a65", borderBottom: bb }}>—</TableCell>;
                            if (c.id === "asset") return <TableCell key={c.id} style={{ padding: bcp, textAlign: "right", fontSize: 12, color: "#6b6a65", borderBottom: bb }}>—</TableCell>;
                            if (c.id === "price") return <TableCell key={c.id} style={{ padding: bcp, textAlign: "right", fontSize: 13, ...tn, color: "#1a1a18", borderBottom: bb }}>{$(bundle.defaultUnitPrice)}</TableCell>;
                            if (c.id === "total") return <TableCell key={c.id} style={{ padding: bcp, textAlign: "right", fontSize: 13, fontWeight: 600, ...tn, color: "#1a1a18", borderBottom: bb }}>{$(bundle.defaultUnitPrice)}</TableCell>;
                            return null;
                          })}
                          {!embedded && <TableCell style={{ padding: "12px 8px", textAlign: "center", position: "relative", borderBottom: bExpanded ? "none" : undefined }}>
                            <span className={rowMenu === bundle.bundleId ? undefined : "row-dots"} onClick={(e) => { e.stopPropagation(); setRowMenu(rowMenu === bundle.bundleId ? null : bundle.bundleId); }} style={{ color: "#c5c4bf", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>⋯</span>
                            {rowMenu === bundle.bundleId && (
                              <div className="dropdown-enter" style={{ position: "absolute", right: 8, top: "100%", width: 200, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 50 }}>
                                <button onClick={(e) => { e.stopPropagation(); setViewItem({ id: bundle.bundleId, name: bundle.name, type: "BUNDLE", group: gName, qty: 1, unit: "ea", unitCost: bundle.defaultUnitCost, unitPrice: bundle.defaultUnitPrice, billable: true, notes: null, thumb: "bundle", description: bundle.items.length + " items included", sku: null }); setRowMenu(null); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left" }}>
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M20.188 10.934c.388.472.582.707.582 1.066s-.194.594-.582 1.066C18.768 14.79 15.636 18 12 18c-3.636 0-6.768-3.21-8.188-4.934C3.424 12.594 3.23 12.36 3.23 12s.194-.594.582-1.066C5.232 9.21 8.364 6 12 6c3.636 0 6.768 3.21 8.188 4.934z"/></svg>
                                  View bundle
                                </button>
                                <div style={{ height: 1, background: "#f0eeea", margin: "2px 0" }} />
                                <button className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#991b1b", textAlign: "left" }}>
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                                  Remove
                                </button>
                              </div>
                            )}
                          </TableCell>}
                        </TableRow>
                        {bExpanded && bundle.items.map((bi, idx) => (
                          <tr key={bi.catalogId + "-mbl"} style={{ background: "#fafaf8" }}>
                            {!embedded && <td style={{ padding: 0, borderBottom: idx === bundle.items.length - 1 ? "1px solid #eae9e4" : "none" }} />}
                            <td style={{ padding: embedded ? "6px 14px 6px 64px" : "6px 14px 6px 58px", borderBottom: idx === bundle.items.length - 1 ? "1px solid #eae9e4" : "none" }}>
                              <span style={{ fontSize: 12, color: "#6b6a65" }}>{bi.name}</span>
                            </td>
                            {visibleCols.map(c => {
                              const bb = idx === bundle.items.length - 1 ? "1px solid #eae9e4" : "none";
                              const biR = bi.unitPrice * bi.qty;
                              const biPr = biR - bi.unitCost * bi.qty;
                              if (c.id === "qty") return <td key={c.id} style={{ padding: "6px 14px", borderBottom: bb, textAlign: "right", fontSize: 12, color: "#8c8b86", ...tn }}>{bi.qty} {bi.unit}</td>;
                              if (c.id === "unitCost") return <td key={c.id} style={{ padding: "6px 14px", borderBottom: bb, textAlign: "right", fontSize: 12, color: "#8c8b86", ...tn }}>${bi.unitCost}</td>;
                              if (c.id === "unitPrice") return <td key={c.id} style={{ padding: "6px 14px", borderBottom: bb, textAlign: "right", fontSize: 12, color: "#8c8b86", ...tn }}>${bi.unitPrice}</td>;
                              if (c.id === "revenue") return <td key={c.id} style={{ padding: "6px 14px", borderBottom: bb, textAlign: "right", fontSize: 12, color: "#8c8b86", ...tn }}>${bi.unitPrice * bi.qty}</td>;
                              if (c.id === "price") return <td key={c.id} style={{ padding: "6px 14px", borderBottom: bb, textAlign: "right", fontSize: 12, color: "#8c8b86", ...tn }}>${bi.unitPrice}</td>;
                              if (c.id === "total") return <td key={c.id} style={{ padding: "6px 14px", borderBottom: bb, textAlign: "right", fontSize: 12, color: "#8c8b86", ...tn }}>${bi.unitPrice * bi.qty}</td>;
                              return <td key={c.id} style={{ padding: "6px 14px", borderBottom: bb }} />;
                            })}
                            {!embedded && <td style={{ borderBottom: idx === bundle.items.length - 1 ? "1px solid #eae9e4" : "none" }} />}
                          </tr>
                        ))}
                      </Fragment>
                    );
                  }),
                  /* Items — hidden when group collapsed */
                  ...(!collapsedGroups.has(gName) ? items : []).map((p) => {
                    const r = p.unitPrice * p.qty;
                    const pr = r - p.unitCost * p.qty;
                    const mg = r > 0 ? pr / r : 0;
                    const nb = !p.billable;
                    const menuOpen = rowMenu === p.id;
                    const pSerial = String(++_serialCtr).padStart(3, "0");
                    return (
                      <TableRow key={p.id} draggable={!embedded && !p._locked} onClick={embedded ? () => setViewItem(p) : undefined} onKeyDown={embedded ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setViewItem(p); } } : undefined} tabIndex={embedded ? 0 : undefined} aria-label={embedded ? `View details for ${p.name}` : undefined} onDragStart={!embedded && !p._locked ? () => handleDragStart(p.id) : undefined} onDragOver={!embedded ? (e) => handleDragOver(e, p.id) : undefined} onDrop={!embedded ? () => handleDrop(p.id) : undefined} onDragEnd={!embedded ? () => { setDragItem(null); setDragOverItem(null); } : undefined} data-selected={!embedded && selected.has(p.id) || undefined} style={{ cursor: embedded ? "pointer" : undefined, opacity: dragItem === p.id ? 0.4 : 1, borderTop: dragOverItem === p.id && dragItem !== p.id ? "2px solid #3b82f6" : undefined }}>
                        {!embedded && <TableCell style={{ padding: "0 4px 0 6px", textAlign: "center", verticalAlign: "middle" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span className="drag-handle" style={{ cursor: p._locked ? "default" : "grab", color: "#d0cfca", display: "flex", alignItems: "center", padding: "2px 0" }} onMouseDown={e => { if (!p._locked) e.currentTarget.closest("tr").draggable = true; }}>
                              <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor"><circle cx="2" cy="2" r="1.2"/><circle cx="6" cy="2" r="1.2"/><circle cx="2" cy="7" r="1.2"/><circle cx="6" cy="7" r="1.2"/><circle cx="2" cy="12" r="1.2"/><circle cx="6" cy="12" r="1.2"/></svg>
                            </span>
                            <span className="row-serial" style={{ fontSize: 11, fontWeight: 600, color: "#b0afa9", fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em", flex: 1, textAlign: "center" }}>{pSerial}</span>
                            <input className="row-checkbox" type="checkbox" checked={selected.has(p.id)} onChange={(e) => { const n = new Set(selected); e.target.checked ? n.add(p.id) : n.delete(p.id); setSelected(n); }} onClick={(e) => e.stopPropagation()} style={{ width: 13, height: 13, cursor: "pointer", accentColor: "#1a1a18", margin: 0 }} />
                          </div>
                        </TableCell>}
                        <TableCell style={{ padding: embedded ? "12px 14px 12px 40px" : "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                            <Thumb type={p.thumb} />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <span className="hover-link" onClick={(e) => { e.stopPropagation(); setViewItem(p); }} style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer", display: "block", color: "#1a1a18" }}>{p.name}</span>
                              {!devFlags.hideDescription && p.description && <div style={{ fontSize: 11, color: "#b0afa9", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 320 }}>{p.description}</div>}
                              <div style={{ fontSize: 11, color: "#a3a29c", marginTop: 1, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                                <span style={tn}>{p.id}</span>
                                {p.sku && <><span style={{ color: "#d0cfca" }}>·</span><span style={{ ...tn, fontSize: 10, color: "#b0afa9" }}>{p.sku}</span></>}
                                {nb && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: "#fef3c7", color: "#92400e" }}>NON-BILLABLE</span>}
                                {p._source === "quote" && (
                                  <span title={p._sourceTitle ? `Inherited from Quote ${p._sourceId} · ${p._sourceTitle}` : `Inherited from Quote ${p._sourceId}`} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: "#dbeafe", color: "#1e40af", display: "inline-flex", alignItems: "center", gap: 4, letterSpacing: "0.01em" }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                    Inherited from {p._sourceId}
                                  </span>
                                )}
                                {(p._source === "po" || p._source === "so") && (
                                  <span title={p._sourceTitle ? `Inherited from ${p._source.toUpperCase()} ${p._sourceId} · ${p._sourceTitle}` : `Inherited from ${p._source.toUpperCase()} ${p._sourceId}`} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: p._source === "po" ? "#fef3c7" : "#fee2e2", color: p._source === "po" ? "#854d0e" : "#991b1b", display: "inline-flex", alignItems: "center", gap: 4, letterSpacing: "0.01em" }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                    Inherited from {p._sourceId}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        {visibleCols.map((c, ci) => {
                          const mkup = p.unitCost > 0 ? (p.unitPrice / p.unitCost - 1) * 100 : 0;
                          const isLast = embedded && ci === visibleCols.length - 1;
                          const cp = isLast ? "12px 40px 12px 14px" : "12px 14px";
                          if (c.id === "pendingSelection") return renderPendingSelectionCell(p, cp);
                          if (c.id === "options") return (
                            <TableCell key={c.id} style={{ padding: "12px 6px", textAlign: "center", position: "relative" }}>
                              <span className={menuOpen ? undefined : "row-dots"} onClick={(e) => { e.stopPropagation(); setRowMenu(menuOpen ? null : p.id); }} style={{ color: "#c5c4bf", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>⋯</span>
                              {menuOpen && (
                                <div className="dropdown-enter" style={{ position: "absolute", left: 0, top: "100%", width: 200, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 50 }}>
                                  <button onClick={(e) => { e.stopPropagation(); setViewItem(p); setRowMenu(null); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left" }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M20.188 10.934c.388.472.582.707.582 1.066s-.194.594-.582 1.066C18.768 14.79 15.636 18 12 18c-3.636 0-6.768-3.21-8.188-4.934C3.424 12.594 3.23 12.36 3.23 12s.194-.594.582-1.066C5.232 9.21 8.364 6 12 6c3.636 0 6.768 3.21 8.188 4.934z"/></svg>
                                    View item details
                                  </button>
                                  {(!embedded || embeddedEditMode) && (
                                    <>
                                      <div style={{ height: 1, background: "#f0eeea", margin: "2px 0" }} />
                                      <button onClick={(e) => { e.stopPropagation(); setEditItem({ ...p }); setViewItem(p); setRowMenu(null); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left" }}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        Edit item
                                      </button>
                                      <button className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#991b1b", textAlign: "left" }}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                                        Remove
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </TableCell>
                          );
                          if (c.id === "taxPref") return <TableCell key={c.id} style={{ padding: cp, textAlign: "right", fontSize: 12, color: "#6b6a65" }}>{p.billable === false ? "Non-Taxable" : "Taxable"}</TableCell>;
                          if (c.id === "location") return <TableCell key={c.id} style={{ padding: cp, textAlign: "right", fontSize: 12, color: "#6b6a65" }}>{p.location || "—"}</TableCell>;
                          if (c.id === "asset") return <TableCell key={c.id} style={{ padding: cp, textAlign: "right", fontSize: 12, color: "#6b6a65" }}>{p.asset || "—"}</TableCell>;
                          if (c.id === "price") return <TableCell key={c.id} style={{ padding: cp, textAlign: "right", fontSize: 13, ...tn, color: "#1a1a18" }}>{$(p.unitPrice || p.rate || 0)}</TableCell>;
                          if (c.id === "total") return <TableCell key={c.id} style={{ padding: cp, textAlign: "right", fontSize: 13, fontWeight: 600, ...tn, color: "#1a1a18" }}>{$(p.qty * (p.unitPrice || p.rate || 0))}</TableCell>;
                          if (c.id === "qty") return <TableCell key={c.id} style={{ padding: cp, textAlign: "right", fontSize: 13, ...tn, color: "#6b6a65" }}>{p.qty} <span style={{ fontSize: 11, color: "#b0afa9" }}>{p.unit}</span></TableCell>;
                          if (c.id === "unitCost") return <TableCell key={c.id} style={{ padding: cp, textAlign: "right", fontSize: 13, ...tn, color: "#1a1a18" }}>{$(p.unitCost)}</TableCell>;
                          if (c.id === "unitPrice") return <TableCell key={c.id} style={{ padding: cp, textAlign: "right", fontSize: 13, ...tn, color: "#1a1a18" }}>{$(p.unitPrice)}</TableCell>;
                          if (c.id === "revenue") return <TableCell key={c.id} style={{ padding: cp, textAlign: "right", fontSize: 13, ...tn, color: "#1a1a18" }}>{nb ? "—" : $(r)}</TableCell>;
                          if (c.id === "profit") return <TableCell key={c.id} style={{ padding: cp, textAlign: "right" }}>{nb ? <span style={{ color: "#a3a29c" }}>—</span> : <span style={{ fontSize: 13, fontWeight: 700, ...tn, color: pr > 0 ? "#166534" : pr < 0 ? "#991b1b" : "#a3a29c" }}>{$(pr)}</span>}</TableCell>;
                          if (c.id === "margin") return <TableCell key={c.id} style={{ padding: cp, textAlign: "right" }}>{nb ? <span style={{ color: "#a3a29c" }}>—</span> : <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 7px", borderRadius: 5, ...tn, background: mg >= 0.4 ? "#dcfce7" : mg >= 0.15 ? "#fef9c3" : "#fee2e2", color: mg >= 0.4 ? "#166534" : mg >= 0.15 ? "#854d0e" : "#991b1b" }}>{pct(mg)}</span>}</TableCell>;
                          if (c.id === "markup") return <TableCell key={c.id} style={{ padding: cp, textAlign: "right", fontSize: 13, ...tn, color: "#1a1a18" }}>{nb ? "—" : (mkup.toFixed(0) + "%")}</TableCell>;
                          return null;
                        })}
                        {!embedded && <TableCell style={{ padding: "12px 8px", textAlign: "center", position: "relative", verticalAlign: "middle" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            {p._source === "quote" && (
                              <span title={`Added from Quote ${p._sourceId}`} onClick={(e) => { e.stopPropagation(); window.open(`#quote/${p._sourceId}?lineItem=${p.id}`, "_blank"); }} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: 4, background: "#dbeafe", color: "#1e40af" }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                              </span>
                            )}
                            {(p._source === "po" || p._source === "so") && (
                              <span title={`Added from ${p._source.toUpperCase()} ${p._sourceId}`} onClick={(e) => { e.stopPropagation(); window.open(`#${p._source}/${p._sourceId}?lineItem=${p.id}`, "_blank"); }} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: 4, background: p._source === "po" ? "#fef3c7" : "#fee2e2", color: p._source === "po" ? "#854d0e" : "#991b1b" }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                              </span>
                            )}
                            <span className={menuOpen ? undefined : "row-dots"} onClick={(e) => { e.stopPropagation(); setRowMenu(menuOpen ? null : p.id); }} style={{ color: "#c5c4bf", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>⋯</span>
                          </div>
                          {menuOpen && (
                            <div className="dropdown-enter" style={{ position: "absolute", right: 8, top: "100%", width: 220, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 50 }}>
                              <button onClick={(e) => { e.stopPropagation(); setViewItem(p); setRowMenu(null); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left" }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M20.188 10.934c.388.472.582.707.582 1.066s-.194.594-.582 1.066C18.768 14.79 15.636 18 12 18c-3.636 0-6.768-3.21-8.188-4.934C3.424 12.594 3.23 12.36 3.23 12s.194-.594.582-1.066C5.232 9.21 8.364 6 12 6c3.636 0 6.768 3.21 8.188 4.934z"/></svg>
                                View item details
                              </button>
                              {p._locked ? (
                                <>
                                  <div style={{ height: 1, background: "#f0eeea", margin: "2px 0" }} />
                                  <div style={{ padding: "10px 14px", fontSize: 11, color: "#8c8b86", lineHeight: 1.45, background: "#fafaf8" }}>
                                    Editing locked — line item inherited from {p._source === "po" ? "PO" : "SO"} <strong style={{ ...tn, color: "#4a4a46" }}>{p._sourceId}</strong>. Remove the {p._source === "po" ? "PO" : "SO"} link to edit.
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div style={{ height: 1, background: "#f0eeea", margin: "2px 0" }} />
                                  <button onClick={(e) => { e.stopPropagation(); setEditItem({ ...p }); setViewItem(p); setRowMenu(null); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left" }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Edit item
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); setParts(prev => prev.filter(x => x.id !== p.id)); setRowMenu(null); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#991b1b", textAlign: "left" }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                                    Remove
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </TableCell>}
                      </TableRow>
                    );
                  }),
                ];
              }); })()}
              {sections.map((sec) => (
                <TableRow key={sec.id} hoverBg={false} draggable={!embedded} onDragStart={!embedded ? () => handleDragStart(sec.id) : undefined} onDragOver={!embedded ? (e) => handleDragOver(e, sec.id) : undefined} onDrop={!embedded ? () => handleDrop(sec.id) : undefined} onDragEnd={!embedded ? () => { setDragItem(null); setDragOverItem(null); } : undefined} style={{ background: "#fafaf8", opacity: dragItem === sec.id ? 0.4 : 1, borderTop: dragOverItem === sec.id && dragItem !== sec.id ? "2px solid #3b82f6" : undefined }}>
                  <TableCell colSpan={visibleCols.length + (embedded ? 1 : 3)} style={{ padding: 0, background: "#fafaf8" }}>
                    <div style={{ padding: embedded ? "14px 40px 14px 40px" : "8px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                      {!embedded && !sec._editing && (
                        <span className="drag-handle" style={{ cursor: "grab", color: "#d0cfca", display: "flex", alignItems: "center", padding: "2px 0" }} onMouseDown={e => e.currentTarget.closest("tr").draggable = true}>
                          <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor"><circle cx="2" cy="2" r="1.2"/><circle cx="6" cy="2" r="1.2"/><circle cx="2" cy="7" r="1.2"/><circle cx="6" cy="7" r="1.2"/><circle cx="2" cy="12" r="1.2"/><circle cx="6" cy="12" r="1.2"/></svg>
                        </span>
                      )}
                      {sec._editing ? (
                        <input
                          autoFocus
                          defaultValue={sec.name}
                          placeholder="Section name"
                          onBlur={e => { const val = e.target.value.trim(); if (!val) { setParts(prev => prev.filter(p => p.id !== sec.id)); } else { setParts(prev => prev.map(p => p.id === sec.id ? { ...p, name: val, _editing: false } : p)); } }}
                          onKeyDown={e => { if (e.key === "Enter") { e.target.blur(); } if (e.key === "Escape") { setParts(prev => prev.filter(p => p.id !== sec.id)); } }}
                          style={{ fontSize: 12, fontWeight: 700, color: "#4a4a46", background: "#fff", border: "1px solid #e8e7e2", borderRadius: 5, padding: "4px 10px", width: 240, transition: "border-color 120ms ease" }}
                          onFocus={e => { e.currentTarget.style.borderColor = "#1a1a18"; }}
                        />
                      ) : (
                        <>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#4a4a46", flex: 1 }}>{sec.name}</span>
                          {!embedded && <div style={{ position: "relative" }}>
                            <button className={sectionMenu === sec.id ? undefined : "row-dots"} onClick={() => setSectionMenu(sectionMenu === sec.id ? null : sec.id)} style={{ width: 24, height: 24, padding: 0, borderRadius: 5, border: "none", background: sectionMenu === sec.id ? "#eae9e4" : "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#b0afa9", fontSize: 15, lineHeight: 1, transition: "background 100ms ease, opacity 120ms ease" }}
                              onMouseEnter={e => { if (sectionMenu !== sec.id) e.currentTarget.style.background = "#f0eeea"; }}
                              onMouseLeave={e => { if (sectionMenu !== sec.id) e.currentTarget.style.background = "none"; }}
                            >⋯</button>
                            {sectionMenu === sec.id && (
                              <>
                                <div style={{ position: "fixed", inset: 0, zIndex: 19 }} onClick={() => setSectionMenu(null)} />
                                <div className="dropdown-enter" style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", width: 160, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 20, padding: "4px 0" }}>
                                  <button onClick={() => { setSectionMenu(null); setParts(prev => prev.map(p => p.id === sec.id ? { ...p, _editing: true } : p)); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: "#1a1a18", textAlign: "left" }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Rename
                                  </button>
                                  <div style={{ height: 1, background: "#f0eeea", margin: "2px 0" }} />
                                  <button onClick={() => { setSectionMenu(null); setParts(prev => prev.filter(p => p.id !== sec.id)); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 12, color: "#991b1b", textAlign: "left" }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                                    Delete section
                                  </button>
                                </div>
                              </>
                            )}
                          </div>}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {colHeaderMenu && colMenuPos && <>
              <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => { setColHeaderMenu(null); setColMenuPos(null); }} />
              {colHeaderMenu === "menu" && (
                <div style={{ position: "fixed", top: colMenuPos.top, right: colMenuPos.right, minWidth: 200, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)", zIndex: 100, padding: "4px 0", animation: "dropdownIn 100ms cubic-bezier(0.23, 1, 0.32, 1) both" }}>
                  <button onClick={(e) => { e.stopPropagation(); setColHeaderMenu("config"); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#1a1a18", textAlign: "left" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8c8b86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 3v18M3 12h18M9 3h6M9 21h6M3 9v6M21 9v6"/></svg>
                    <span>Customize columns</span>
                  </button>
                </div>
              )}
              {colHeaderMenu === "config" && (
                <div style={{ position: "fixed", top: colMenuPos.top, right: colMenuPos.right, width: 220, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 100, padding: "4px 0", animation: "dropdownIn 100ms cubic-bezier(0.23, 1, 0.32, 1) both" }}>
                  {columns.map((col, ci) => (
                    <div
                      key={col.id}
                      draggable
                      onDragStart={() => setDragCol(ci)}
                      onDragOver={(e) => { e.preventDefault(); setDragOverCol(ci); }}
                      onDrop={() => {
                        if (dragCol === null || dragCol === ci) { setDragCol(null); setDragOverCol(null); return; }
                        setColumns(prev => { const arr = [...prev]; const [moved] = arr.splice(dragCol, 1); arr.splice(ci, 0, moved); return arr; });
                        setDragCol(null); setDragOverCol(null);
                      }}
                      onDragEnd={() => { setDragCol(null); setDragOverCol(null); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
                        opacity: dragCol === ci ? 0.4 : 1,
                        borderTop: dragOverCol === ci && dragCol !== ci ? "2px solid #3b82f6" : "1px solid transparent",
                      }}
                    >
                      <span style={{ cursor: "grab", color: "#d0cfca", display: "flex", alignItems: "center", flexShrink: 0 }}>
                        <svg width="6" height="10" viewBox="0 0 6 10" fill="currentColor"><circle cx="1.5" cy="1.5" r="1"/><circle cx="4.5" cy="1.5" r="1"/><circle cx="1.5" cy="5" r="1"/><circle cx="4.5" cy="5" r="1"/><circle cx="1.5" cy="8.5" r="1"/><circle cx="4.5" cy="8.5" r="1"/></svg>
                      </span>
                      <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: col.visible ? "#1a1a18" : "#b0afa9" }}>{col.label}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setColumns(prev => prev.map((c, idx) => idx === ci ? { ...c, visible: !c.visible } : c)); }}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 1, display: "flex", alignItems: "center", color: col.visible ? "#166534" : "#d0cfca", flexShrink: 0 }}
                      >
                        {col.visible ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M20.188 10.934c.388.472.582.707.582 1.066s-.194.594-.582 1.066C18.768 14.79 15.636 18 12 18c-3.636 0-6.768-3.21-8.188-4.934C3.424 12.594 3.23 12.36 3.23 12s.194-.594.582-1.066C5.232 9.21 8.364 6 12 6c3.636 0 6.768 3.21 8.188 4.934z"/></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 01-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
          </>}

          {!embedded && <div className="table-totals-box" style={{ borderTop: "1px solid #e8e7e2", borderBottom: "1px solid #e8e7e2", padding: "18px 20px", background: "#f9f8f6", borderRadius: 0 }}>
            <div style={{ maxWidth: 360, marginLeft: "auto", fontSize: 13 }}>
              {nbCost > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: "#a3a29c", marginBottom: 5 }}><span>Non-billable costs</span><span style={tn}>{$(nbCost)}</span></div>}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ color: "#6b6a65" }}>Billable subtotal</span><span style={{ fontWeight: 600, ...tn }}>{$(partsRev)}</span></div>

              {/* Deduction lines — discounts, expenses, commissions */}
              {[
                { key: "discounts", items: discounts, setItems: setDiscounts, hasType: true },
                { key: "expenses", items: expenses, setItems: setExpenses, hasType: false },
                { key: "commissions", items: commissions, setItems: setCommissions, hasType: true },
              ].map(({ key, items, setItems, hasType }) => items.length > 0 && (
                <div key={key} style={{ marginBottom: 6 }}>
                  {items.map((d) => {
                    const amt = hasType ? (d.type === "%" ? partsRev * d.value / 100 : d.value) : d.value;
                    return (
                      <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, opacity: d.disabled ? 0.4 : 1, transition: "opacity 150ms ease" }}>
                        <input
                          value={d.name}
                          disabled={d.disabled}
                          onChange={e => setItems(prev => prev.map(x => x.id === d.id ? { ...x, name: e.target.value } : x))}
                          style={{ flex: 1, fontSize: 12, color: "#6b6a65", background: "none", border: "none", padding: "2px 0", minWidth: 0, textDecoration: d.disabled ? "line-through" : "none" }}
                        />
                        {hasType ? (
                          <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #e0dfda", borderRadius: 5, overflow: "hidden", background: "#fff", flexShrink: 0 }}>
                            <input
                              type="number"
                              value={d.value}
                              disabled={d.disabled}
                              onChange={e => setItems(prev => prev.map(x => x.id === d.id ? { ...x, value: parseFloat(e.target.value) || 0 } : x))}
                              style={{ width: 48, fontSize: 12, fontWeight: 600, padding: "3px 6px", border: "none", textAlign: "right", color: "#1a1a18", textDecoration: d.disabled ? "line-through" : "none", ...tn }}
                            />
                            <button
                              disabled={d.disabled}
                              onClick={() => setItems(prev => prev.map(x => x.id === d.id ? { ...x, type: x.type === "%" ? "$" : "%" } : x))}
                              style={{ fontSize: 11, fontWeight: 600, padding: "3px 6px", border: "none", borderLeft: "1px solid #e0dfda", background: "none", cursor: d.disabled ? "default" : "pointer", color: "#8c8b86", minWidth: 22 }}
                            >{d.type}</button>
                          </div>
                        ) : (
                          <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #e0dfda", borderRadius: 5, overflow: "hidden", background: "#fff", flexShrink: 0 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 6px", color: "#8c8b86", borderRight: "1px solid #e0dfda" }}>$</span>
                            <input
                              type="number"
                              value={d.value}
                              disabled={d.disabled}
                              onChange={e => setItems(prev => prev.map(x => x.id === d.id ? { ...x, value: parseFloat(e.target.value) || 0 } : x))}
                              style={{ width: 56, fontSize: 12, fontWeight: 600, padding: "3px 6px", border: "none", textAlign: "right", color: "#1a1a18", textDecoration: d.disabled ? "line-through" : "none", ...tn }}
                            />
                          </div>
                        )}
                        <span style={{ fontSize: 12, color: d.disabled ? "#d0cfca" : "#1a1a18", fontWeight: 500, minWidth: 70, textAlign: "right", textDecoration: d.disabled ? "line-through" : "none", ...tn }}>−{$(amt)}</span>
                        <button onClick={() => setItems(prev => prev.map(x => x.id === d.id ? { ...x, disabled: !x.disabled } : x))} style={{ background: "none", border: "none", cursor: "pointer", color: d.disabled ? "#3b82f6" : "#d0cfca", padding: 0, display: "flex", alignItems: "center", flexShrink: 0, transition: "color 120ms ease", fontSize: 11 }}
                          onMouseEnter={e => { if (!d.disabled) e.currentTarget.style.color = "#991b1b"; }}
                          onMouseLeave={e => { if (!d.disabled) e.currentTarget.style.color = "#d0cfca"; }}
                        >
                          {d.disabled ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M12 3l-3 3 3 3"/></svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}

              {(totalDiscount > 0 || totalExpenses > 0 || totalCommissions > 0) && (
                <div style={{ borderTop: "1px solid #e8e7e2", paddingTop: 6, marginBottom: 8, fontSize: 12 }}>
                  {totalDiscount > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, color: "#4a4a46", fontWeight: 500 }}><span>Total discounts</span><span style={tn}>−{$(totalDiscount)}</span></div>}
                  {totalExpenses > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, color: "#4a4a46", fontWeight: 500 }}><span>Total expenses</span><span style={tn}>−{$(totalExpenses)}</span></div>}
                  {totalCommissions > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, color: "#4a4a46", fontWeight: 500 }}><span>Total commissions</span><span style={tn}>−{$(totalCommissions)}</span></div>}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "2px solid #1a1a18", fontWeight: 800, fontSize: 14 }}><span>Net revenue</span><span style={tn}>{$(rev - totalExpenses - totalCommissions)}</span></div>
            </div>
          </div>}
        </div>
      ) : tab === 0 ? (
        embedded ? null : <div style={{ border: "1px solid #e8e7e2", borderTop: "none", borderRadius: 0, padding: "56px 24px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#f5f4f0", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#b0afa9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M12 8v8M8 12h8" /></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a18", marginBottom: 4 }}>No parts or services added</div>
          <div style={{ fontSize: 13, color: "#8c8b86", maxWidth: 340, margin: "0 auto 20px", lineHeight: 1.5 }}>Add line items to start tracking actuals against the estimated budget shown above.</div>
          <button onClick={() => setCatalogOpen(true)} style={{ fontSize: 13, fontWeight: 700, padding: "9px 24px", borderRadius: 8, border: "none", background: "#1a1a18", color: "#fff", cursor: "pointer" }}>+ Add part / service</button>
        </div>
      ) : tab === 1 && LABOR.length > 0 ? (
        <div style={{ borderLeft: "1px solid #e8e7e2", borderRight: "1px solid #e8e7e2", borderBottom: "1px solid #e8e7e2", borderRadius: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e8e7e2", background: "#fff" }}>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Description</th>
                <th style={{ textAlign: "right", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "12%" }}>Hours</th>
                <th style={{ textAlign: "right", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "12%" }}>Rate</th>
                <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "14%" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {LABOR.map((l) => (
                <tr key={l.id} style={{ borderBottom: "1px solid #f0eeea" }}>
                  <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>{l.name}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 13, ...tn, color: "#4a4a46" }}>{l.hours}h</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 13, ...tn, color: "#4a4a46" }}>{$(l.rate)}/hr</td>
                  <td style={{ padding: "12px 20px", textAlign: "right", fontSize: 13, fontWeight: 700, ...tn }}>{$(l.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ borderTop: "1px solid #e8e7e2", padding: "14px 20px", background: "#fafaf8", borderRadius: 0 }}>
            <div style={{ maxWidth: 240, marginLeft: "auto", fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14 }}><span>Total labor</span><span style={tn}>{$(laborCost)}</span></div>
            </div>
          </div>
        </div>
      ) : tab === 2 && ALL_EXPENSES.length > 0 ? (
        <div style={{ borderLeft: "1px solid #e8e7e2", borderRight: "1px solid #e8e7e2", borderBottom: "1px solid #e8e7e2", borderRadius: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e8e7e2", background: "#fff" }}>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Description</th>
                <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "14%" }}>Category</th>
                <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "12%" }}>Date</th>
                <th style={{ textAlign: "center", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "8%" }}>Receipt</th>
                <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "12%" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {ALL_EXPENSES.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid #f0eeea" }}>
                  <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>{e.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b6a65" }}>{e.category}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b6a65", ...tn }}>{e.date}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    {e.receipt ? <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#f0fdf4", color: "#16a34a", textTransform: "uppercase" }}>Yes</span> : <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#f5f4f0", color: "#8c8b86", textTransform: "uppercase" }}>No</span>}
                  </td>
                  <td style={{ padding: "12px 20px", textAlign: "right", fontSize: 13, fontWeight: 700, ...tn }}>{$(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ borderTop: "1px solid #e8e7e2", padding: "14px 20px", background: "#fafaf8", borderRadius: 0 }}>
            <div style={{ maxWidth: 240, marginLeft: "auto", fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14 }}><span>Total expenses</span><span style={tn}>{$(ALL_EXPENSES.reduce((s, e) => s + e.amount, 0))}</span></div>
            </div>
          </div>
        </div>
      ) : tab === 3 && ALL_COMMISSIONS.length > 0 ? (
        <div style={{ borderLeft: "1px solid #e8e7e2", borderRight: "1px solid #e8e7e2", borderBottom: "1px solid #e8e7e2", borderRadius: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e8e7e2", background: "#fff" }}>
                <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Name</th>
                <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "14%" }}>Role</th>
                <th style={{ textAlign: "right", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "10%" }}>Rate</th>
                <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "12%" }}>Basis</th>
                <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 10, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", width: "12%" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {ALL_COMMISSIONS.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #f0eeea" }}>
                  <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>{c.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b6a65" }}>{c.role}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 13, ...tn, color: "#4a4a46" }}>{c.rate}%</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b6a65" }}>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: c.basis === "revenue" ? "#eef2ff" : "#f0fdf4", color: c.basis === "revenue" ? "#3b82f6" : "#16a34a", textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.basis}</span>
                  </td>
                  <td style={{ padding: "12px 20px", textAlign: "right", fontSize: 13, fontWeight: 700, ...tn }}>{$(c.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ borderTop: "1px solid #e8e7e2", padding: "14px 20px", background: "#fafaf8", borderRadius: 0 }}>
            <div style={{ maxWidth: 240, marginLeft: "auto", fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14 }}><span>Total commissions</span><span style={tn}>{$(ALL_COMMISSIONS.reduce((s, c) => s + c.amount, 0))}</span></div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ border: "1px solid #e8e7e2", borderTop: "none", borderRadius: 0, padding: "64px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#4a4a46", marginBottom: 4 }}>No {tabs[tab].name.toLowerCase()} yet</div>
          <div style={{ fontSize: 13, color: "#a3a29c", maxWidth: 280, margin: "0 auto 16px", lineHeight: 1.5 }}>
            {tab === 1 ? "Labor tracked against this job will appear here." : tab === 2 ? "Receipts and job-related expenses will show here." : "Commissions will appear once configured."}
          </div>
          <button onClick={() => setCatalogOpen(true)} style={{ fontSize: 12, fontWeight: 600, padding: "6px 16px", borderRadius: 6, border: "1px solid #e0dfda", background: "#fff", cursor: "pointer", color: "#4a4a46", display: "inline-flex", alignItems: "center", gap: 5 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>{tabs[tab].add}</button>
        </div>
      )}

      {embedded && embeddedFooterBefore}

      {/* Job Profitability strip — sticky to bottom, settles into flow at scroll end */}
      {embedded && hasData && !hideEmbeddedProfitStrip && (
        <div ref={profitStripRef} style={{ borderTop: "1px solid #e8e7e2", position: "sticky", bottom: 0, zIndex: 40, background: "#fff", boxShadow: embeddedFooterSettled ? "none" : "0 -4px 12px rgba(0,0,0,0.06)", borderRadius: "0 0 16px 16px", overflow: "hidden", margin: embeddedFooterSettled ? "0 1px 1px" : "0", transition: "box-shadow 160ms ease, margin 160ms ease" }}>
          {renderProfitStripHeader({ label: "Quote Profitability", embeddedMode: true })}
          {profitExpanded && renderProfitExpandedContent()}
        </div>
      )}
      {!embedded && hasData && (
        <div ref={profitStripRef} style={{ borderTop: "1px solid #e8e7e2", position: "sticky", bottom: 0, zIndex: 40, background: "#fff", marginTop: 0, borderRadius: "0 0 24px 24px", overflow: "hidden" }}>
          {renderProfitStripHeader({ label: "Job Profitability", embeddedMode: false })}
          {profitExpanded && renderProfitExpandedContent()}
        </div>
      )}
      </div>{/* End Frame 3 */}
      </div>
      )}

      {/* Dialog */}
      {dialog && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, minHeight: "100%", background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 80, zIndex: 50 }} onClick={(e) => { if (e.target === e.currentTarget) setDialog(null); }}>
          <div style={{ width: 520, background: "#fff", borderRadius: 12, boxShadow: "0 8px 40px rgba(0,0,0,0.15)", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px 14px", borderBottom: "1px solid #e8e7e2" }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{dialog === "po" ? "Create purchase order" : "Create material request"}</div>
              <button onClick={() => setDialog(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#8c8b86" }}>✕</button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>{dialog === "po" ? "Vendor" : "Source warehouse"}</label>
                  <select style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 6, border: "1px solid #e0dfda", background: "#fff" }}>
                    {dialog === "po" ? <><option>Select vendor...</option><option>ABC Roofing Supply</option><option>SRS Distribution</option></> : <><option>Main warehouse</option><option>Satellite — North</option></>}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>{dialog === "po" ? "Expected delivery" : "Urgency"}</label>
                  {dialog === "po" ? <input type="date" style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 6, border: "1px solid #e0dfda", background: "#fff" }} /> : <select style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 6, border: "1px solid #e0dfda", background: "#fff" }}><option>Standard (3-5 days)</option><option>Rush (1-2 days)</option></select>}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Notes</label>
                <textarea placeholder="Delivery instructions, special requirements..." style={{ width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 6, border: "1px solid #e0dfda", background: "#fff", resize: "vertical", minHeight: 60, fontFamily: "inherit" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 24px 18px", borderTop: "1px solid #e8e7e2", background: "#fafaf8" }}>
              <button onClick={() => setDialog(null)} style={{ fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 7, border: "1px solid #e0dfda", background: "#fff", cursor: "pointer", color: "#4a4a46" }}>Cancel</button>
              <button style={{ fontSize: 13, fontWeight: 700, padding: "8px 20px", borderRadius: 7, border: "none", background: "#1a1a18", color: "#fff", cursor: "pointer" }}>{dialog === "po" ? "Create PO" : "Submit request"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Dialog */}
      <CatalogDialog
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onConfirm={(newItems) => {
          setParts(prev => [...prev, ...newItems]);
          setCatalogOpen(false);
        }}
        existingIds={new Set(parts.map(p => p.name))}
      />

      {/* Item detail side sheet */}


      {viewItem && createPortal((() => {
        const catalogMatch = CATALOG_ITEMS.find(c => c.name === viewItem.name) || null;
        const isEditing = editItem && editItem.id === viewItem.id;
        const item = isEditing ? editItem : viewItem;
        const r = item.unitPrice * item.qty;
        const pr = r - item.unitCost * item.qty;
        const mg = r > 0 ? pr / r : 0;
        const nb = !item.billable;
        const editInputStyle = { fontSize: 12, fontWeight: 600, color: "#1a1a18", padding: "4px 8px", border: "1px solid #e8e7e2", borderRadius: 5, background: "#fff", width: 140, textAlign: "right", fontVariantNumeric: "tabular-nums", transition: "border-color 120ms ease" };
        const onFocus = (e) => { e.currentTarget.style.borderColor = "#1a1a18"; };
        const onBlur = (e) => { e.currentTarget.style.borderColor = "#e8e7e2"; };
        const setField = (field, value) => setEditItem(prev => ({ ...prev, [field]: value }));
        const handleSave = () => {
          setParts(prev => prev.map(p => p.id === editItem.id ? { ...p, name: editItem.name, description: editItem.description, unitCost: editItem.unitCost, unitPrice: editItem.unitPrice, qty: editItem.qty, billable: editItem.billable, notes: editItem.notes } : p));
          setViewItem({ ...editItem });
          setEditItem(null);
        };
        const handleCancel = () => setEditItem(null);
        return (
          <>
            <div className="overlay-enter sidesheet-overlay" onClick={() => { setViewItem(null); setEditItem(null); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 100 }} />
            <div className="sidesheet-enter" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 400, background: "#fff", zIndex: 101, boxShadow: "-8px 0 32px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
              {/* Header */}
              <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #e8e7e2", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a18", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{isEditing ? "Edit item" : "Item details"}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {(!embedded || embeddedEditMode) && !isEditing && (
                      <button className="hover-icon btn-press" onClick={() => setEditItem({ ...viewItem })} style={{ background: "none", border: "none", cursor: "pointer", color: "#b0afa9", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 5, flexShrink: 0 }}
                      ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                    )}
                    <button className="hover-icon btn-press" onClick={() => { setViewItem(null); setEditItem(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#b0afa9", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 5, flexShrink: 0 }}
                    ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
                {/* Thumb + name */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <Thumb type={item.thumb} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    {isEditing ? (
                      <input value={editItem.name} onChange={e => setField("name", e.target.value)} onFocus={onFocus} onBlur={onBlur}
                        style={{ fontSize: 15, fontWeight: 500, color: "#1a1a18", lineHeight: 1.25, padding: "4px 8px", border: "1px solid #e8e7e2", borderRadius: 5, background: "#fff", width: "100%", transition: "border-color 120ms ease" }} />
                    ) : (
                      <div style={{ fontSize: 15, fontWeight: 500, color: "#1a1a18", lineHeight: 1.25 }}>{item.name}</div>
                    )}
                    <div style={{ fontSize: 11, color: "#8c8b86", marginTop: 3 }}>
                      <span>{item.group}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {(item.description || isEditing) && (
                  isEditing ? (
                    <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f0eeea" }}>
                      <div style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500, marginBottom: 8 }}>Description</div>
                      <textarea
                        value={editItem.description || ""}
                        onChange={e => setField("description", e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        rows={3}
                        style={{ fontSize: 12, lineHeight: 1.6, color: "#1a1a18", background: "#fff", border: "1px solid #e8e7e2", borderRadius: 8, padding: "10px 14px", width: "100%", resize: "vertical", fontFamily: "inherit", transition: "border-color 120ms ease", boxSizing: "border-box" }}
                        placeholder="Add a description..."
                      />
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, lineHeight: 1.5, color: "#8c8b86", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f0eeea" }}>{item.description}</div>
                  )
                )}

                {/* Pricing details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {/* Unit Cost */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0eeea" }}>
                    <span style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500 }}>Unit Cost</span>
                    {isEditing ? (
                      <input type="number" value={editItem.unitCost} onChange={e => setField("unitCost", parseFloat(e.target.value) || 0)} onFocus={onFocus} onBlur={onBlur} style={editInputStyle} />
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18", ...tn }}>{$(item.unitCost)}</span>
                    )}
                  </div>
                  {/* Unit Price */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0eeea" }}>
                    <span style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500 }}>Unit Price</span>
                    {isEditing ? (
                      <input type="number" value={editItem.unitPrice} onChange={e => setField("unitPrice", parseFloat(e.target.value) || 0)} onFocus={onFocus} onBlur={onBlur} style={editInputStyle} />
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18", ...tn }}>{$(item.unitPrice)}</span>
                    )}
                  </div>
                  {/* Quantity */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0eeea" }}>
                    <span style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500 }}>Quantity</span>
                    {isEditing ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input type="number" value={editItem.qty} onChange={e => setField("qty", parseFloat(e.target.value) || 0)} onFocus={onFocus} onBlur={onBlur} style={{ ...editInputStyle, width: 70 }} />
                        <span style={{ fontSize: 11, color: "#8c8b86" }}>{item.unit}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18", ...tn }}>{item.qty} {item.unit}</span>
                    )}
                  </div>
                  {/* Computed fields — always read-only */}
                  {[
                    { label: "Total Revenue", value: nb ? "—" : $(r) },
                    { label: "Profit", value: nb ? "—" : $(pr), color: !nb && (pr >= 0 ? "#166534" : "#991b1b") },
                    ...(r > 0 ? [
                      { label: "Margin", value: pct(mg), color: "#16a34a" },
                      { label: "Markup", value: item.unitCost > 0 ? ((item.unitPrice / item.unitCost - 1) * 100).toFixed(0) + "%" : "—" },
                    ] : []),
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0eeea" }}>
                      <span style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500 }}>{label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: color || "#1a1a18", ...tn }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Job details */}
                <div style={{ marginTop: 20 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {/* Item ID — always read-only */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0eeea" }}>
                      <span style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500 }}>Item ID</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18" }}>{item.id}</span>
                    </div>
                    {/* SKU — read-only */}
                    {item.sku && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0eeea" }}>
                        <span style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500 }}>SKU</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18", fontVariantNumeric: "tabular-nums" }}>{item.sku}</span>
                      </div>
                    )}
                    {/* Group — read-only */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0eeea" }}>
                      <span style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500 }}>Group</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18" }}>{item.group}</span>
                    </div>
                    {/* Type — read-only */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0eeea" }}>
                      <span style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500 }}>Type</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18" }}>{item.type === "MAT" ? "Material" : item.type === "SVC" ? "Service" : "Equipment"}</span>
                    </div>
                    {/* Billable — toggle in edit mode */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0eeea" }}>
                      <span style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500 }}>Billable</span>
                      {isEditing ? (
                        <button onClick={() => setField("billable", !editItem.billable)} style={{
                          fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, border: "none", cursor: "pointer",
                          background: editItem.billable ? "#dcfce7" : "#fef3c7", color: editItem.billable ? "#166534" : "#92400e",
                        }}>{editItem.billable ? "Yes" : "No"}</button>
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: item.billable ? "#dcfce7" : "#fef3c7", color: item.billable ? "#166534" : "#92400e" }}>{item.billable ? "Yes" : "No"}</span>
                      )}
                    </div>
                    {/* Catalog fields — read-only */}
                    {catalogMatch && [
                      { label: "Catalog ID", value: catalogMatch.catalogId },
                      { label: "Location", value: catalogMatch.location },
                      { label: "Availability", value: catalogMatch.availability, badge: true, badgeBg: catalogMatch.availability === "In stock" ? "#dcfce7" : catalogMatch.availability === "Low stock" ? "#fef3c7" : "#f0eeea", badgeColor: catalogMatch.availability === "In stock" ? "#166534" : catalogMatch.availability === "Low stock" ? "#92400e" : "#6b6a65" },
                    ].map(({ label, value, badge, badgeBg, badgeColor }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0eeea" }}>
                        <span style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500 }}>{label}</span>
                        {badge ? (
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: badgeBg, color: badgeColor }}>{value}</span>
                        ) : (
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18" }}>{value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scope notes */}
                {(item.notes || isEditing) && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 12, color: "#8c8b86", fontWeight: 500, marginBottom: 8 }}>Scope notes</div>
                    {isEditing ? (
                      <textarea value={editItem.notes || ""} onChange={e => setField("notes", e.target.value)} onFocus={onFocus} onBlur={onBlur} rows={3}
                        style={{ fontSize: 12, lineHeight: 1.6, color: "#1a1a18", background: "#fff", border: "1px solid #e8e7e2", borderRadius: 8, padding: "10px 14px", width: "100%", resize: "vertical", fontFamily: "inherit", transition: "border-color 120ms ease", boxSizing: "border-box" }}
                        placeholder="Add scope notes..." />
                    ) : (
                      <div style={{ fontSize: 12, lineHeight: 1.6, color: "#6b6a65", background: "#fafaf8", border: "1px solid #f0eeea", borderRadius: 8, padding: "12px 16px" }}>
                        {item.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer — edit mode actions */}
              {isEditing && (
                <div style={{ padding: "16px 20px", borderTop: "1px solid #e8e7e2", flexShrink: 0, display: "flex", gap: 8 }}>
                  <button onClick={handleCancel} style={{
                    flex: 1, padding: "9px 0", fontSize: 12, fontWeight: 700, borderRadius: 8,
                    border: "1px solid #e0dfda", background: "#fff", color: "#6b6a65", cursor: "pointer",
                  }}
                    className="btn-press hover-subtle"
                  >Cancel</button>
                  <button onClick={handleSave} style={{
                    flex: 1, padding: "9px 0", fontSize: 12, fontWeight: 700, borderRadius: 8,
                    border: "none", background: "#1a1a18", color: "#fff", cursor: "pointer",
                  }}
                    className="btn-press hover-dark"
                  >Save changes</button>
                </div>
              )}
            </div>
          </>
        );
      })(), document.body)}

      {/* Inherit-from slider: Accepted Quotes */}
      {inheritSlider === "quote" && createPortal((() => {
        const linkedIds = new Set(linkedQuotes.map(q => q.id));
        const available = ACCEPTED_QUOTES.filter(q => !linkedIds.has(q.id));
        const filtered = available.filter(q => {
          if (!inheritSearch) return true;
          const s = inheritSearch.toLowerCase();
          return q.id.toLowerCase().includes(s) || q.title.toLowerCase().includes(s);
        });
        const allFilteredIds = filtered.map(q => q.id);
        const allChecked = allFilteredIds.length > 0 && allFilteredIds.every(id => inheritChecked.has(id));
        const someChecked = allFilteredIds.some(id => inheritChecked.has(id));
        const close = () => { setInheritSlider(null); setInheritSearch(""); setInheritChecked(new Set()); };
        const handleAdd = () => {
          const toAdd = available.filter(q => inheritChecked.has(q.id));
          if (toAdd.length === 0) { close(); return; }
          setLinkedQuotes(prev => [...prev, ...toAdd]);
          // Append line items to parts with source metadata
          setParts(prev => {
            const next = [...prev];
            toAdd.forEach(q => {
              q.items.forEach((it, idx) => {
                next.push({
                  id: `${q.id}-LI${idx + 1}`,
                  name: it.name, type: it.type, group: "Inherited",
                  qty: it.qty, unit: it.unit, unitCost: it.unitCost, unitPrice: it.unitPrice,
                  billable: it.billable, description: it.description, sku: it.sku,
                  notes: null, thumb: it.type === "MAT" ? "shingle" : it.type === "EQ" ? "dumpster" : "permit",
                  _source: "quote", _sourceId: q.id, _sourceTitle: q.title,
                });
              });
            });
            return next;
          });
          setToast(`Added ${toAdd.length} quote${toAdd.length > 1 ? "s" : ""} to the job`);
          close();
        };
        return (
          <>
            <div className="overlay-enter sidesheet-overlay" onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 100 }} />
            <div className="sidesheet-enter" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 720, background: "#fff", zIndex: 101, boxShadow: "-8px 0 32px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
              {/* Header */}
              <div style={{ padding: "18px 24px 14px", borderBottom: "1px solid #e8e7e2", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a18" }}>Select Accepted quotes to be added to the Job</div>
                  <div style={{ fontSize: 12, color: "#8c8b86", marginTop: 4 }}>This will add the Parts and Services line items from Quote to Job.</div>
                </div>
                <button onClick={close} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "#8c8b86", padding: 4, display: "flex", alignItems: "center", borderRadius: 6 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              {/* Search */}
              <div style={{ padding: "12px 24px", borderBottom: "1px solid #f0eeea", background: "#fafaf8" }}>
                <div style={{ position: "relative" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a3a29c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search by quote number or title..."
                    value={inheritSearch}
                    onChange={e => setInheritSearch(e.target.value)}
                    style={{ width: "100%", fontSize: 13, padding: "8px 10px 8px 32px", borderRadius: 7, border: "1px solid #e0dfda", background: "#fff", outline: "none" }}
                  />
                </div>
              </div>
              {/* Table */}
              <div style={{ flex: 1, overflow: "auto" }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: "#8c8b86", fontSize: 13 }}>
                    {available.length === 0 ? "All accepted quotes are already linked to this job." : "No accepted quotes match your search."}
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e8e7e2", background: "#fafaf8", position: "sticky", top: 0, zIndex: 1 }}>
                        <th style={{ padding: "10px 12px 10px 24px", width: 36, textAlign: "left" }}>
                          <input type="checkbox" checked={allChecked} ref={el => { if (el) el.indeterminate = !allChecked && someChecked; }} onChange={e => { const next = new Set(inheritChecked); if (e.target.checked) allFilteredIds.forEach(id => next.add(id)); else allFilteredIds.forEach(id => next.delete(id)); setInheritChecked(next); }} style={{ width: 13, height: 13, cursor: "pointer", accentColor: "#1a1a18" }} />
                        </th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Quote #</th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Title</th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Date</th>
                        <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Value</th>
                        <th style={{ padding: "10px 24px 10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(q => {
                        const checked = inheritChecked.has(q.id);
                        const toggle = () => setInheritChecked(prev => { const n = new Set(prev); if (n.has(q.id)) n.delete(q.id); else n.add(q.id); return n; });
                        return (
                          <tr key={q.id} onClick={toggle} className="picker-row" style={{ cursor: "pointer", borderBottom: "1px solid #f0eeea", background: checked ? "#fafaf8" : "transparent" }}>
                            <td style={{ padding: "12px 12px 12px 24px" }}>
                              <input type="checkbox" checked={checked} onChange={toggle} onClick={e => e.stopPropagation()} style={{ width: 13, height: 13, cursor: "pointer", accentColor: "#1a1a18" }} />
                            </td>
                            <td style={{ padding: "12px", fontSize: 13, fontWeight: 600, color: "#1a1a18", ...tn }}>{q.id}</td>
                            <td style={{ padding: "12px", fontSize: 13, color: "#1a1a18" }}>
                              <div style={{ fontWeight: 500 }}>{q.title}</div>
                              <div style={{ fontSize: 11, color: "#a3a29c", marginTop: 2 }}>{q.items.length} line item{q.items.length === 1 ? "" : "s"}</div>
                            </td>
                            <td style={{ padding: "12px", fontSize: 12, color: "#6b6a65", ...tn }}>{q.date}</td>
                            <td style={{ padding: "12px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "#1a1a18", ...tn }}>{$(q.value)}</td>
                            <td style={{ padding: "12px 24px 12px 12px" }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: "#dcfce7", color: "#166534" }}>{q.status}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              {/* Footer */}
              <div style={{ padding: "14px 24px", borderTop: "1px solid #e8e7e2", background: "#fafaf8", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 12, color: "#8c8b86" }}>{inheritChecked.size > 0 ? `${inheritChecked.size} quote${inheritChecked.size > 1 ? "s" : ""} selected` : "Select accepted quotes to add"}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={close} style={{ fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 7, border: "1px solid #e0dfda", background: "#fff", cursor: "pointer", color: "#4a4a46" }}>Cancel</button>
                  <button onClick={handleAdd} disabled={inheritChecked.size === 0} style={{ fontSize: 13, fontWeight: 700, padding: "8px 22px", borderRadius: 7, border: "none", background: inheritChecked.size > 0 ? "#1a1a18" : "#d8d7d2", color: "#fff", cursor: inheritChecked.size > 0 ? "pointer" : "default", transition: "background 120ms ease" }}>Add Quote</button>
                </div>
              </div>
            </div>
          </>
        );
      })(), document.body)}

      {/* Inherit-from slider: Submitted PO/SO */}
      {inheritSlider === "po-so" && createPortal((() => {
        const linkedIds = new Set(linkedPos.map(p => p.id));
        const available = SUBMITTED_POS.filter(p => !linkedIds.has(p.id));
        const filtered = available.filter(p => {
          if (inheritTypeFilter && p.type !== inheritTypeFilter) return false;
          if (inheritStatusFilter && p.status !== inheritStatusFilter) return false;
          if (!inheritSearch) return true;
          const s = inheritSearch.toLowerCase();
          return p.id.toLowerCase().includes(s) || p.title.toLowerCase().includes(s);
        });
        const allFilteredIds = filtered.map(p => p.id);
        const allChecked = allFilteredIds.length > 0 && allFilteredIds.every(id => inheritChecked.has(id));
        const someChecked = allFilteredIds.some(id => inheritChecked.has(id));
        const close = () => { setInheritSlider(null); setInheritSearch(""); setInheritChecked(new Set()); setInheritTypeFilter(null); setInheritStatusFilter(null); setInheritTypeMenuOpen(false); setInheritStatusMenuOpen(false); };
        const handleAdd = () => {
          const toAdd = available.filter(p => inheritChecked.has(p.id));
          if (toAdd.length === 0) { close(); return; }
          setLinkedPos(prev => [...prev, ...toAdd]);
          setParts(prev => {
            const next = [...prev];
            toAdd.forEach(po => {
              po.items.forEach((it, idx) => {
                next.push({
                  id: `${po.id}-LI${idx + 1}`,
                  name: it.name, type: it.type, group: "Inherited",
                  qty: it.qty, unit: it.unit, unitCost: it.unitCost, unitPrice: it.unitPrice,
                  billable: it.billable, description: it.description, sku: it.sku,
                  notes: null, thumb: it.type === "MAT" ? "shingle" : it.type === "EQ" ? "dumpster" : "truck",
                  _source: po.type === "PO" ? "po" : "so", _sourceId: po.id, _sourceTitle: po.title, _sourceVendor: po.vendor,
                  _locked: true,
                });
              });
            });
            return next;
          });
          const hasPO = toAdd.some(p => p.type === "PO");
          const hasSO = toAdd.some(p => p.type === "SO");
          const masterMsg = hasPO && hasSO ? "Parts master, vendor price list, and services master updated"
            : hasPO ? "Parts master and vendor price list updated with received cost"
            : "Services master updated with received cost";
          setToast(`Added ${toAdd.length} document${toAdd.length > 1 ? "s" : ""} — ${masterMsg}`);
          close();
        };
        return (
          <>
            <div className="overlay-enter sidesheet-overlay" onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 100 }} />
            <div className="sidesheet-enter" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 760, background: "#fff", zIndex: 101, boxShadow: "-8px 0 32px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
              {/* Header */}
              <div style={{ padding: "18px 24px 14px", borderBottom: "1px solid #e8e7e2", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a18" }}>Select PO/SO to be added to the Job</div>
                  <div style={{ fontSize: 12, color: "#8c8b86", marginTop: 4 }}>This will add the Parts and Products from PO and Services from SO line items to the Job.</div>
                </div>
                <button onClick={close} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "#8c8b86", padding: 4, display: "flex", alignItems: "center", borderRadius: 6 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              {/* Search + filters */}
              <div style={{ padding: "12px 24px", borderBottom: "1px solid #f0eeea", background: "#fafaf8", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a3a29c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" autoFocus placeholder="Search by PO/SO number or title..." value={inheritSearch} onChange={e => setInheritSearch(e.target.value)} style={{ width: "100%", fontSize: 13, padding: "8px 10px 8px 32px", borderRadius: 7, border: "1px solid #e0dfda", background: "#fff", outline: "none" }} />
                </div>
                {/* Type filter */}
                <div style={{ position: "relative" }}>
                  <button onClick={() => { setInheritTypeMenuOpen(v => !v); setInheritStatusMenuOpen(false); }} style={{ fontSize: 12, fontWeight: 600, padding: "7px 12px", borderRadius: 7, border: "1px solid #e0dfda", background: inheritTypeFilter ? "#1a1a18" : "#fff", cursor: "pointer", color: inheritTypeFilter ? "#fff" : "#4a4a46", display: "flex", alignItems: "center", gap: 6 }}>
                    Type{inheritTypeFilter ? `: ${inheritTypeFilter}` : ""}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {inheritTypeMenuOpen && (
                    <>
                      <div onClick={() => setInheritTypeMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 102 }} />
                      <div className="dropdown-enter" style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", width: 140, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 103, padding: "4px 0" }}>
                        {[{ v: null, l: "All types" }, { v: "PO", l: "PO" }, { v: "SO", l: "SO" }].map(opt => (
                          <button key={opt.l} onClick={() => { setInheritTypeFilter(opt.v); setInheritTypeMenuOpen(false); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "none", background: inheritTypeFilter === opt.v ? "#f5f4f0" : "none", cursor: "pointer", fontSize: 12, color: "#1a1a18", textAlign: "left", fontWeight: inheritTypeFilter === opt.v ? 600 : 400 }}>{opt.l}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* Status filter */}
                <div style={{ position: "relative" }}>
                  <button onClick={() => { setInheritStatusMenuOpen(v => !v); setInheritTypeMenuOpen(false); }} style={{ fontSize: 12, fontWeight: 600, padding: "7px 12px", borderRadius: 7, border: "1px solid #e0dfda", background: inheritStatusFilter ? "#1a1a18" : "#fff", cursor: "pointer", color: inheritStatusFilter ? "#fff" : "#4a4a46", display: "flex", alignItems: "center", gap: 6 }}>
                    Status{inheritStatusFilter ? `: ${inheritStatusFilter}` : ""}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {inheritStatusMenuOpen && (
                    <>
                      <div onClick={() => setInheritStatusMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 102 }} />
                      <div className="dropdown-enter" style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", width: 160, background: "#fff", border: "1px solid #e0dfda", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 103, padding: "4px 0" }}>
                        {[{ v: null, l: "All statuses" }, { v: "Submitted", l: "Submitted" }].map(opt => (
                          <button key={opt.l} onClick={() => { setInheritStatusFilter(opt.v); setInheritStatusMenuOpen(false); }} className="dropdown-item" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "none", background: inheritStatusFilter === opt.v ? "#f5f4f0" : "none", cursor: "pointer", fontSize: 12, color: "#1a1a18", textAlign: "left", fontWeight: inheritStatusFilter === opt.v ? 600 : 400 }}>{opt.l}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              {/* Table */}
              <div style={{ flex: 1, overflow: "auto" }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: "#8c8b86", fontSize: 13 }}>
                    {available.length === 0 ? "All POs/SOs are already linked to this job." : "No PO/SO matches your filters."}
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e8e7e2", background: "#fafaf8", position: "sticky", top: 0, zIndex: 1 }}>
                        <th style={{ padding: "10px 12px 10px 24px", width: 36, textAlign: "left" }}>
                          <input type="checkbox" checked={allChecked} ref={el => { if (el) el.indeterminate = !allChecked && someChecked; }} onChange={e => { const next = new Set(inheritChecked); if (e.target.checked) allFilteredIds.forEach(id => next.add(id)); else allFilteredIds.forEach(id => next.delete(id)); setInheritChecked(next); }} style={{ width: 13, height: 13, cursor: "pointer", accentColor: "#1a1a18" }} />
                        </th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>PO/SO #</th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Type</th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Title</th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Date</th>
                        <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Value</th>
                        <th style={{ padding: "10px 24px 10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8c8b86", textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(p => {
                        const checked = inheritChecked.has(p.id);
                        const toggle = () => setInheritChecked(prev => { const n = new Set(prev); if (n.has(p.id)) n.delete(p.id); else n.add(p.id); return n; });
                        return (
                          <tr key={p.id} onClick={toggle} className="picker-row" style={{ cursor: "pointer", borderBottom: "1px solid #f0eeea", background: checked ? "#fafaf8" : "transparent" }}>
                            <td style={{ padding: "12px 12px 12px 24px" }}>
                              <input type="checkbox" checked={checked} onChange={toggle} onClick={e => e.stopPropagation()} style={{ width: 13, height: 13, cursor: "pointer", accentColor: "#1a1a18" }} />
                            </td>
                            <td style={{ padding: "12px", fontSize: 13, fontWeight: 600, color: "#1a1a18", ...tn }}>{p.id}</td>
                            <td style={{ padding: "12px" }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: p.type === "PO" ? "#e0e7ff" : "#fef3c7", color: p.type === "PO" ? "#3730a3" : "#92400e" }}>{p.type}</span>
                            </td>
                            <td style={{ padding: "12px", fontSize: 13, color: "#1a1a18" }}>
                              <div style={{ fontWeight: 500 }}>{p.title}</div>
                              <div style={{ fontSize: 11, color: "#a3a29c", marginTop: 2 }}>{p.vendor} · {p.items.length} line item{p.items.length === 1 ? "" : "s"}</div>
                            </td>
                            <td style={{ padding: "12px", fontSize: 12, color: "#6b6a65", ...tn }}>{p.date}</td>
                            <td style={{ padding: "12px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "#1a1a18", ...tn }}>{$(p.value)}</td>
                            <td style={{ padding: "12px 24px 12px 12px" }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: "#dbeafe", color: "#1e40af" }}>{p.status}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              {/* Footer */}
              <div style={{ padding: "14px 24px", borderTop: "1px solid #e8e7e2", background: "#fafaf8", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 12, color: "#8c8b86" }}>{inheritChecked.size > 0 ? `${inheritChecked.size} document${inheritChecked.size > 1 ? "s" : ""} selected` : "Select PO/SO to add"}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={close} style={{ fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 7, border: "1px solid #e0dfda", background: "#fff", cursor: "pointer", color: "#4a4a46" }}>Cancel</button>
                  <button onClick={handleAdd} disabled={inheritChecked.size === 0} style={{ fontSize: 13, fontWeight: 700, padding: "8px 22px", borderRadius: 7, border: "none", background: inheritChecked.size > 0 ? "#1a1a18" : "#d8d7d2", color: "#fff", cursor: inheritChecked.size > 0 ? "pointer" : "default", transition: "background 120ms ease" }}>Add PO/SO</button>
                </div>
              </div>
            </div>
          </>
        );
      })(), document.body)}

      {/* Remove confirmation */}
      {removeConfirm && createPortal(
        <>
          <div className="overlay-enter" onClick={() => setRemoveConfirm(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200 }} />
          <div className="dropdown-enter" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 460, background: "#fff", borderRadius: 12, boxShadow: "0 20px 50px rgba(0,0,0,0.2)", zIndex: 201, overflow: "hidden" }}>
            <div style={{ padding: "20px 22px 14px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a18", marginBottom: 8 }}>{removeConfirm.kind === "quote" ? "Remove Quote(s) from Job?" : removeConfirm.kind === "po" ? "Remove PO/SO from Job?" : "Remove selected from Job?"}</div>
              <div style={{ fontSize: 13, color: "#4a4a46", lineHeight: 1.5 }}>
                {removeConfirm.kind === "quote"
                  ? "Removing this Quote(s) will affect the projected and planned profitability of the Job and deletes quote line items from Job. The original quote shall not be deleted. Do you wish to continue?"
                  : removeConfirm.kind === "po"
                  ? "Removing this PO(s)/SO(s) will affect the projected and planned profitability of the Job and deletes PO/SO line items from Job. The original PO/SO shall not be deleted. Do you wish to continue?"
                  : "Removing the selected items will affect the projected and planned profitability of the Job and deletes their line items from Job. The original Quote/PO/SO shall not be deleted. Do you wish to continue?"}
              </div>
            </div>
            <div style={{ padding: "12px 22px 16px", borderTop: "1px solid #f0eeea", background: "#fafaf8", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setRemoveConfirm(null)} style={{ fontSize: 13, fontWeight: 600, padding: "7px 16px", borderRadius: 7, border: "1px solid #e0dfda", background: "#fff", cursor: "pointer", color: "#4a4a46" }}>Cancel</button>
              <button onClick={() => {
                const ids = new Set(removeConfirm.ids);
                const quoteIds = new Set(removeConfirm.kind === "quote" ? removeConfirm.ids : (removeConfirm.quoteIds || []));
                const poIds = new Set(removeConfirm.kind === "po" ? removeConfirm.ids : (removeConfirm.poIds || []));
                if (quoteIds.size > 0) {
                  setLinkedQuotes(prev => prev.filter(q => !quoteIds.has(q.id)));
                  setParts(prev => prev.filter(p => !(p._source === "quote" && quoteIds.has(p._sourceId))));
                }
                if (poIds.size > 0) {
                  setLinkedPos(prev => prev.filter(p => !poIds.has(p.id)));
                  setParts(prev => prev.filter(p => !((p._source === "po" || p._source === "so") && poIds.has(p._sourceId))));
                }
                setSelectedSourceChips(prev => { const n = new Set(prev); ids.forEach(id => n.delete(id)); return n; });
                setRemoveConfirm(null);
                setToast(`Removed ${ids.size} item${ids.size > 1 ? "s" : ""} from the Job`);
              }} style={{ fontSize: 13, fontWeight: 700, padding: "7px 18px", borderRadius: 7, border: "none", background: "#991b1b", color: "#fff", cursor: "pointer" }}>Remove</button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Toast */}
      {toast && createPortal(
        <div className="dropdown-enter" style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#1a1a18", color: "#fff", padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500, boxShadow: "0 10px 30px rgba(0,0,0,0.25)", zIndex: 300, display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {toast}
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "#a3a29c", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", marginLeft: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>,
        document.body
      )}

    </div>{/* end bordered container */}
    </div>{/* end scrollable content */}
    </div>
  );
}
