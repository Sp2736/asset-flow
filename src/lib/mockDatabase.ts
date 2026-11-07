"use client";

import {
  Asset,
  AssetStatus,
  Department,
  Employee,
  Category,
  Allocation,
  TransferRequest,
  Booking,
  MaintenanceRequest,
  AuditCycle,
  AuditVerification,
  ActivityNotification,
  Role,
} from "@/types";

export interface DatabaseState {
  assets: Asset[];
  departments: Department[];
  employees: Employee[];
  categories: Category[];
  allocations: Allocation[];
  transfers: TransferRequest[];
  bookings: Booking[];
  maintenance: MaintenanceRequest[];
  auditCycles: AuditCycle[];
  auditVerifications: AuditVerification[];
  notifications: ActivityNotification[];
}

const DB_STORAGE_KEY = "assetflow_mock_db_v1";

// -----------------------------------------------------------------------------
// SEED DATA GENERATOR (100% Fictional, 55+ Assets, Diverse Workflows)
// -----------------------------------------------------------------------------
function generateInitialData(): DatabaseState {
  const departments: Department[] = [
    { id: "dept-eng", name: "Engineering & Tech", code: "ENG", location: "Floor 4 - Tech Hub", assetCount: 22, headEmployeeId: "emp-dh-01", headEmployeeName: "Sarah Chen" },
    { id: "dept-design", name: "Product & UI/UX", code: "DSN", location: "Floor 3 - Creative Studio", assetCount: 11, headEmployeeId: "emp-user-02", headEmployeeName: "David Kim" },
    { id: "dept-ops", name: "Operations & Logistics", code: "OPS", location: "Floor 1 - Warehouse Bay", assetCount: 12, headEmployeeId: "emp-user-03", headEmployeeName: "Priya Patel" },
    { id: "dept-fin", name: "Finance & Accounting", code: "FIN", location: "Floor 2 - Finance Wing", assetCount: 6, headEmployeeId: "emp-user-04", headEmployeeName: "Robert Fox" },
    { id: "dept-hr", name: "People & Talent", code: "HR", location: "Floor 2 - Talent Hub", assetCount: 5, headEmployeeId: "emp-user-05", headEmployeeName: "Maria Santos" },
    { id: "dept-rd", name: "Research & Hardware Lab", code: "RND", location: "Annex Lab B", assetCount: 8, headEmployeeId: "emp-user-06", headEmployeeName: "Dr. Arthur Pendelton" },
    { id: "dept-compliance", name: "Compliance & Audit", code: "AUD", location: "Floor 5 - Audit Suite", assetCount: 4, headEmployeeId: "emp-audit-01", headEmployeeName: "Marcus Vance" },
  ];

  const categories: Category[] = [
    { id: "cat-laptops", name: "Laptops & Workstations", description: "Portable enterprise computing units", assetCount: 24, iconName: "Laptop" },
    { id: "cat-displays", name: "Monitors & Screens", description: "Ultra-wide 4K and color-calibrated displays", assetCount: 16, iconName: "Monitor" },
    { id: "cat-furniture", name: "Ergonomic Office Furniture", description: "Standing desks, task chairs, and acoustic booths", assetCount: 12, iconName: "Armchair" },
    { id: "cat-network", name: "Network Infrastructure", description: "Switches, routers, enterprise firewalls, and server racks", assetCount: 8, iconName: "Server" },
    { id: "cat-av", name: "Audio & Visual Gear", description: "Meeting room cameras, 4K laser projectors, and microphone pods", assetCount: 6, iconName: "Video" },
    { id: "cat-lab", name: "Lab & Testing Gear", description: "Oscilloscopes, multimeters, and RF testing apparatus", assetCount: 6, iconName: "Cpu" },
  ];

  const employees: Employee[] = [
    { id: "emp-admin-01", fullName: "Alex Rivera", email: "alex.rivera@techcorp.mock", role: "admin", departmentId: "dept-eng", departmentName: "Engineering & Tech", designation: "Global System Administrator", avatar: "AR", allocatedAssetCount: 2 },
    { id: "emp-dh-01", fullName: "Sarah Chen", email: "sarah.chen@techcorp.mock", role: "department_head", departmentId: "dept-eng", departmentName: "Engineering & Tech", designation: "VP of Software Engineering", avatar: "SC", allocatedAssetCount: 2 },
    { id: "emp-user-01", fullName: "Jane Doe", email: "jane.doe@techcorp.mock", role: "employee", departmentId: "dept-design", departmentName: "Product & UI/UX", designation: "Senior UX Designer", avatar: "JD", allocatedAssetCount: 2 },
    { id: "emp-audit-01", fullName: "Marcus Vance", email: "marcus.vance@techcorp.mock", role: "auditor", departmentId: "dept-compliance", departmentName: "Compliance & Audit", designation: "Lead Asset Compliance Auditor", avatar: "MV", allocatedAssetCount: 1 },
    { id: "emp-user-02", fullName: "David Kim", email: "david.kim@techcorp.mock", role: "department_head", departmentId: "dept-design", departmentName: "Product & UI/UX", designation: "Head of Product Design", avatar: "DK", allocatedAssetCount: 2 },
    { id: "emp-user-03", fullName: "Priya Patel", email: "priya.patel@techcorp.mock", role: "department_head", departmentId: "dept-ops", departmentName: "Operations & Logistics", designation: "Director of Supply Operations", avatar: "PP", allocatedAssetCount: 1 },
    { id: "emp-user-04", fullName: "Robert Fox", email: "robert.fox@techcorp.mock", role: "employee", departmentId: "dept-fin", departmentName: "Finance & Accounting", designation: "Senior Financial Analyst", avatar: "RF", allocatedAssetCount: 1 },
    { id: "emp-user-05", fullName: "Maria Santos", email: "maria.santos@techcorp.mock", role: "employee", departmentId: "dept-hr", departmentName: "People & Talent", designation: "HR Business Partner", avatar: "MS", allocatedAssetCount: 1 },
    { id: "emp-user-06", fullName: "Dr. Arthur Pendelton", email: "arthur.pendelton@techcorp.mock", role: "employee", departmentId: "dept-rd", departmentName: "Research & Hardware Lab", designation: "Principal Research Scientist", avatar: "AP", allocatedAssetCount: 3 },
    { id: "emp-user-07", fullName: "Liam Walker", email: "liam.walker@techcorp.mock", role: "employee", departmentId: "dept-eng", departmentName: "Engineering & Tech", designation: "Staff DevOps Engineer", avatar: "LW", allocatedAssetCount: 2 },
    { id: "emp-user-08", fullName: "Sophia Bennett", email: "sophia.bennett@techcorp.mock", role: "employee", departmentId: "dept-eng", departmentName: "Engineering & Tech", designation: "Frontend Engineer II", avatar: "SB", allocatedAssetCount: 1 },
    { id: "emp-user-09", fullName: "Carlos Gomez", email: "carlos.gomez@techcorp.mock", role: "employee", departmentId: "dept-ops", departmentName: "Operations & Logistics", designation: "Warehouse Supervisor", avatar: "CG", allocatedAssetCount: 1 },
  ];

  // 55+ Assets with realistic attributes
  const assets: Asset[] = [
    // Laptops
    { id: "AST-1001", name: "MacBook Pro Mock-16 (M3 Max)", model: "MBP16-M3M-64G", serialNumber: "SN-MBP-908124", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 3899, purchaseDate: "2024-02-15", location: "Floor 4 - Tech Hub Desk 4A", assignedToEmployeeId: "emp-dh-01", assignedToEmployeeName: "Sarah Chen", condition: "Mint" },
    { id: "AST-1002", name: "ThinkPad Carbon Mock-X1 (Gen 12)", model: "TP-X1C-G12", serialNumber: "SN-LEN-449102", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 2199, purchaseDate: "2024-01-10", location: "Floor 4 - Tech Hub Desk 4B", assignedToEmployeeId: "emp-admin-01", assignedToEmployeeName: "Alex Rivera", condition: "Good" },
    { id: "AST-1003", name: "Dell Precision Mock-5680 Workstation", model: "DP-5680-RTX", serialNumber: "SN-DEL-771890", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-rd", departmentName: "Research & Hardware Lab", status: "Allocated", acquisitionCost: 4200, purchaseDate: "2023-11-20", location: "Annex Lab B Bench 01", assignedToEmployeeId: "emp-user-06", assignedToEmployeeName: "Dr. Arthur Pendelton", condition: "Good" },
    { id: "AST-1004", name: "MacBook Pro Mock-14 (M3 Pro)", model: "MBP14-M3P-36G", serialNumber: "SN-MBP-552199", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-design", departmentName: "Product & UI/UX", status: "Allocated", acquisitionCost: 2499, purchaseDate: "2024-03-05", location: "Floor 3 - Creative Wing Desk 3C", assignedToEmployeeId: "emp-user-01", assignedToEmployeeName: "Jane Doe", condition: "Mint" },
    { id: "AST-1005", name: "MacBook Air Mock-15 (M3)", model: "MBA15-M3-16G", serialNumber: "SN-MBA-102948", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-fin", departmentName: "Finance & Accounting", status: "Allocated", acquisitionCost: 1499, purchaseDate: "2024-04-12", location: "Floor 2 - Finance Desk 2A", assignedToEmployeeId: "emp-user-04", assignedToEmployeeName: "Robert Fox", condition: "Good" },
    { id: "AST-1006", name: "HP Elite Dragonfly Mock-G4", model: "HPE-DF-G4", serialNumber: "SN-HP-309112", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-hr", departmentName: "People & Talent", status: "Allocated", acquisitionCost: 1850, purchaseDate: "2023-09-14", location: "Floor 2 - Talent Desk 2C", assignedToEmployeeId: "emp-user-05", assignedToEmployeeName: "Maria Santos", condition: "Good" },
    { id: "AST-1007", name: "ThinkPad P16 Mock Gen 2", model: "TP-P16-G2", serialNumber: "SN-LEN-881923", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 3150, purchaseDate: "2023-12-01", location: "Floor 4 - Tech Hub Desk 4G", assignedToEmployeeId: "emp-user-07", assignedToEmployeeName: "Liam Walker", condition: "Good" },
    { id: "AST-1008", name: "MacBook Pro Mock-14 (M2 Pro)", model: "MBP14-M2P-16G", serialNumber: "SN-MBP-339101", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 1999, purchaseDate: "2023-06-18", location: "Floor 4 - Tech Hub Desk 4F", assignedToEmployeeId: "emp-user-08", assignedToEmployeeName: "Sophia Bennett", condition: "Fair" },
    { id: "AST-1009", name: "MacBook Pro Mock-16 (M1 Max)", model: "MBP16-M1M-32G", serialNumber: "SN-MBP-118833", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-design", departmentName: "Product & UI/UX", status: "Allocated", acquisitionCost: 3299, purchaseDate: "2022-08-11", location: "Floor 3 - Creative Wing Desk 3A", assignedToEmployeeId: "emp-user-02", assignedToEmployeeName: "David Kim", condition: "Good" },
    { id: "AST-1010", name: "Dell Latitude Mock-7440", model: "DL-7440-I7", serialNumber: "SN-DEL-654312", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-ops", departmentName: "Operations & Logistics", status: "Allocated", acquisitionCost: 1650, purchaseDate: "2023-10-04", location: "Floor 1 - Warehouse Office", assignedToEmployeeId: "emp-user-03", assignedToEmployeeName: "Priya Patel", condition: "Good" },
    { id: "AST-1011", name: "Panasonic Toughbook Mock-40", model: "TB-40-RUG", serialNumber: "SN-PAN-902188", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-ops", departmentName: "Operations & Logistics", status: "Allocated", acquisitionCost: 3900, purchaseDate: "2023-05-19", location: "Floor 1 - Loading Bay C", assignedToEmployeeId: "emp-user-09", assignedToEmployeeName: "Carlos Gomez", condition: "Good" },
    { id: "AST-1012", name: "ThinkPad X13s ARM Mock", model: "TP-X13S-ARM", serialNumber: "SN-LEN-120934", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-compliance", departmentName: "Compliance & Audit", status: "Allocated", acquisitionCost: 1350, purchaseDate: "2023-07-22", location: "Floor 5 - Audit Suite Desk 5A", assignedToEmployeeId: "emp-audit-01", assignedToEmployeeName: "Marcus Vance", condition: "Mint" },
    { id: "AST-1013", name: "Dell XPS Mock-15 (9530)", model: "XPS15-9530", serialNumber: "SN-DEL-981245", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Available", acquisitionCost: 2250, purchaseDate: "2024-02-28", location: "Floor 4 - IT Depot Locker 02", condition: "Mint" },
    { id: "AST-1014", name: "MacBook Air Mock-13 (M2)", model: "MBA13-M2-8G", serialNumber: "SN-MBA-667123", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-hr", departmentName: "People & Talent", status: "Available", acquisitionCost: 1099, purchaseDate: "2023-04-10", location: "Floor 2 - Talent Storage", condition: "Good" },
    { id: "AST-1015", name: "ThinkPad T14s Mock Gen 4", model: "TP-T14S-G4", serialNumber: "SN-LEN-558291", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-fin", departmentName: "Finance & Accounting", status: "Available", acquisitionCost: 1450, purchaseDate: "2023-11-09", location: "Floor 2 - Finance Storage", condition: "Mint" },
    { id: "AST-1016", name: "ASUS ROG Zephyrus Mock-G14 (ML Test)", model: "ROG-G14-RTX", serialNumber: "SN-ASU-772910", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-rd", departmentName: "Research & Hardware Lab", status: "Under Maintenance", acquisitionCost: 2400, purchaseDate: "2023-03-15", location: "Repair Center Bay 04", condition: "Needs Maintenance", notes: "Thermal throttling detected during tensor model training." },
    { id: "AST-1017", name: "MacBook Pro Mock-15 (Intel Legacy)", model: "MBP15-INTEL", serialNumber: "SN-MBP-001928", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Retired", acquisitionCost: 2800, purchaseDate: "2019-10-10", location: "E-Waste Archive Storage", condition: "Fair", notes: "Depreciated and decommissioned after 5 years." },
    { id: "AST-1018", name: "Dell Precision Mock-7760 Big Rig", model: "DP-7760-MAX", serialNumber: "SN-DEL-109283", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Under Maintenance", acquisitionCost: 4500, purchaseDate: "2022-04-14", location: "IT Lab Repair Bench", condition: "Needs Maintenance", notes: "Swollen battery replacement in progress." },
    { id: "AST-1019", name: "ThinkPad Yoga Mock-X1 Gen 7", model: "TP-YOGA-G7", serialNumber: "SN-LEN-991823", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-ops", departmentName: "Operations & Logistics", status: "Lost", acquisitionCost: 1950, purchaseDate: "2022-11-05", location: "Transit (Reported Missing)", condition: "Fair", notes: "Confirmed missing during Q3 site audit." },

    // Displays
    { id: "AST-1020", name: "Dell UltraSharp 34 Curved Mock-U3423WE", model: "U3423WE-WQHD", serialNumber: "SN-MON-991201", categoryId: "cat-displays", categoryName: "Monitors & Screens", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 899, purchaseDate: "2023-08-20", location: "Floor 4 - Desk 4A", assignedToEmployeeId: "emp-dh-01", assignedToEmployeeName: "Sarah Chen", condition: "Mint" },
    { id: "AST-1021", name: "Apple Studio Display 27 5K Mock", model: "ASD-27-5K", serialNumber: "SN-ASD-441029", categoryId: "cat-displays", categoryName: "Monitors & Screens", departmentId: "dept-design", departmentName: "Product & UI/UX", status: "Allocated", acquisitionCost: 1599, purchaseDate: "2023-09-01", location: "Floor 3 - Desk 3C", assignedToEmployeeId: "emp-user-01", assignedToEmployeeName: "Jane Doe", condition: "Mint" },
    { id: "AST-1022", name: "LG UltraFine 32 4K OLED Pro Mock", model: "32BP95E-OLED", serialNumber: "SN-LG-881203", categoryId: "cat-displays", categoryName: "Monitors & Screens", departmentId: "dept-design", departmentName: "Product & UI/UX", status: "Allocated", acquisitionCost: 1999, purchaseDate: "2023-10-15", location: "Floor 3 - Desk 3A", assignedToEmployeeId: "emp-user-02", assignedToEmployeeName: "David Kim", condition: "Good" },
    { id: "AST-1023", name: "Dell UltraSharp 27 4K Mock-U2723QE", model: "U2723QE-4K", serialNumber: "SN-MON-120938", categoryId: "cat-displays", categoryName: "Monitors & Screens", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 599, purchaseDate: "2023-06-25", location: "Floor 4 - Desk 4B", assignedToEmployeeId: "emp-admin-01", assignedToEmployeeName: "Alex Rivera", condition: "Good" },
    { id: "AST-1024", name: "Dell UltraSharp 27 4K Mock-U2723QE", model: "U2723QE-4K", serialNumber: "SN-MON-120939", categoryId: "cat-displays", categoryName: "Monitors & Screens", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 599, purchaseDate: "2023-06-25", location: "Floor 4 - Desk 4G", assignedToEmployeeId: "emp-user-07", assignedToEmployeeName: "Liam Walker", condition: "Good" },
    { id: "AST-1025", name: "Samsung ViewFinity 49 Odyssey Neo Mock", model: "S49CG950SC", serialNumber: "SN-SAM-901824", categoryId: "cat-displays", categoryName: "Monitors & Screens", departmentId: "dept-rd", departmentName: "Research & Hardware Lab", status: "Allocated", acquisitionCost: 1799, purchaseDate: "2024-01-14", location: "Annex Lab B", assignedToEmployeeId: "emp-user-06", assignedToEmployeeName: "Dr. Arthur Pendelton", condition: "Mint" },
    { id: "AST-1026", name: "Dell UltraSharp 32 4K Mock-U3223QE", model: "U3223QE-4K", serialNumber: "SN-MON-440192", categoryId: "cat-displays", categoryName: "Monitors & Screens", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Available", acquisitionCost: 799, purchaseDate: "2024-03-01", location: "Floor 4 - Tech Hub Inventory", condition: "Mint" },
    { id: "AST-1027", name: "ASUS ProArt 27 Calibrated Mock", model: "PA278CV", serialNumber: "SN-ASU-330192", categoryId: "cat-displays", categoryName: "Monitors & Screens", departmentId: "dept-design", departmentName: "Product & UI/UX", status: "Available", acquisitionCost: 450, purchaseDate: "2023-07-19", location: "Floor 3 - Storage Room", condition: "Good" },
    { id: "AST-1028", name: "BenQ Designer Monitor 32 Mock", model: "PD3205U", serialNumber: "SN-BNQ-771029", categoryId: "cat-displays", categoryName: "Monitors & Screens", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Available", acquisitionCost: 650, purchaseDate: "2023-11-20", location: "Floor 4 - Tech Hub Inventory", condition: "Mint" },

    // Furniture
    { id: "AST-1029", name: "Herman Miller Aeron Mock Chair (Size B)", model: "HM-AERON-B", serialNumber: "SN-FUR-001923", categoryId: "cat-furniture", categoryName: "Ergonomic Office Furniture", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 1495, purchaseDate: "2023-01-15", location: "Floor 4 - Tech Hub Desk 4A", condition: "Good" },
    { id: "AST-1030", name: "Herman Miller Embody Mock Chair", model: "HM-EMBODY-BK", serialNumber: "SN-FUR-001924", categoryId: "cat-furniture", categoryName: "Ergonomic Office Furniture", departmentId: "dept-design", departmentName: "Product & UI/UX", status: "Allocated", acquisitionCost: 1750, purchaseDate: "2023-02-10", location: "Floor 3 - Creative Wing Desk 3C", condition: "Mint" },
    { id: "AST-1031", name: "Steelcase Gesture Ergonomic Mock Chair", model: "SC-GESTURE-GR", serialNumber: "SN-FUR-002100", categoryId: "cat-furniture", categoryName: "Ergonomic Office Furniture", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 1380, purchaseDate: "2023-05-12", location: "Floor 4 - Tech Hub Desk 4B", condition: "Good" },
    { id: "AST-1032", name: "Uplift V2 Dual-Motor Standing Desk (72x30)", model: "UPL-V2-72", serialNumber: "SN-DESK-88120", categoryId: "cat-furniture", categoryName: "Ergonomic Office Furniture", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 950, purchaseDate: "2023-03-20", location: "Floor 4 - Tech Hub Desk 4A", condition: "Good" },
    { id: "AST-1033", name: "Framery One Acoustic Focus Pod Mock", model: "FRM-ONE-POD", serialNumber: "SN-POD-33019", categoryId: "cat-furniture", categoryName: "Ergonomic Office Furniture", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Available", acquisitionCost: 8500, purchaseDate: "2023-08-11", location: "Floor 4 - Quiet Corner C", condition: "Mint" },
    { id: "AST-1034", name: "Steelcase Leap Mock Task Chair", model: "SC-LEAP-V2", serialNumber: "SN-FUR-003881", categoryId: "cat-furniture", categoryName: "Ergonomic Office Furniture", departmentId: "dept-ops", departmentName: "Operations & Logistics", status: "Available", acquisitionCost: 1200, purchaseDate: "2023-04-05", location: "Floor 1 - Warehouse Bay Staging", condition: "Good" },

    // Network & Server
    { id: "AST-1035", name: "Cisco Catalyst Mock-9300 48-Port Switch", model: "C9300-48P-E", serialNumber: "SN-NET-991283", categoryId: "cat-network", categoryName: "Network Infrastructure", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 5400, purchaseDate: "2023-06-10", location: "Floor 4 - Server Rack 01", condition: "Mint" },
    { id: "AST-1036", name: "Ubiquiti UniFi Dream Machine Pro Mock", model: "UDM-PRO-MAX", serialNumber: "SN-NET-449102", categoryId: "cat-network", categoryName: "Network Infrastructure", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 899, purchaseDate: "2023-07-15", location: "Floor 4 - Server Rack 01", condition: "Mint" },
    { id: "AST-1037", name: "Dell PowerEdge Mock-R760 2U Rack Server", model: "PE-R760-2U", serialNumber: "SN-SRV-771029", categoryId: "cat-network", categoryName: "Network Infrastructure", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 9200, purchaseDate: "2023-09-22", location: "Floor 4 - Server Rack 02", condition: "Mint" },
    { id: "AST-1038", name: "Fortinet FortiGate Mock-100F Firewall", model: "FG-100F", serialNumber: "SN-NET-110293", categoryId: "cat-network", categoryName: "Network Infrastructure", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 3100, purchaseDate: "2023-04-12", location: "Floor 4 - Server Rack 01", condition: "Good" },
    { id: "AST-1039", name: "APC Smart-UPS RT 5000VA Rack Battery", model: "SURTD5000RMXLP", serialNumber: "SN-PWR-881923", categoryId: "cat-network", categoryName: "Network Infrastructure", departmentId: "dept-ops", departmentName: "Operations & Logistics", status: "Available", acquisitionCost: 2600, purchaseDate: "2022-12-08", location: "Floor 1 - Power Distribution Rm", condition: "Good" },

    // Audio / Visual & Conference
    { id: "AST-1040", name: "Sony 4K Laser Mock Projector (6000 Lumens)", model: "VPL-FHZ85", serialNumber: "SN-AV-991204", categoryId: "cat-av", categoryName: "Audio & Visual Gear", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Available", acquisitionCost: 5200, purchaseDate: "2023-08-01", location: "Floor 4 - Exec Boardroom A", condition: "Mint" },
    { id: "AST-1041", name: "Neat Bar Pro All-in-One Video Bar Mock", model: "NBP-001-ENG", serialNumber: "SN-AV-330192", categoryId: "cat-av", categoryName: "Audio & Visual Gear", departmentId: "dept-design", departmentName: "Product & UI/UX", status: "Available", acquisitionCost: 3490, purchaseDate: "2023-09-15", location: "Floor 3 - Design Conference Room", condition: "Mint" },
    { id: "AST-1042", name: "Jabra Speak Mock-810 Conference Speaker", model: "JBR-810-BT", serialNumber: "SN-AV-771029", categoryId: "cat-av", categoryName: "Audio & Visual Gear", departmentId: "dept-ops", departmentName: "Operations & Logistics", status: "Available", acquisitionCost: 599, purchaseDate: "2023-03-10", location: "Floor 1 - Ops Huddle Room", condition: "Good" },
    { id: "AST-1043", name: "Shure MXA920 Ceiling Microphone Array", model: "MXA920-W-S", serialNumber: "SN-AV-112093", categoryId: "cat-av", categoryName: "Audio & Visual Gear", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Allocated", acquisitionCost: 2800, purchaseDate: "2023-10-05", location: "Floor 4 - Main Townhall Space", condition: "Mint" },

    // Lab & Hardware Testing Gear
    { id: "AST-1044", name: "Tektronix 4-Series MSO Mock Oscilloscope", model: "MSO44-1GHZ", serialNumber: "SN-LAB-449102", categoryId: "cat-lab", categoryName: "Lab & Testing Gear", departmentId: "dept-rd", departmentName: "Research & Hardware Lab", status: "Allocated", acquisitionCost: 8900, purchaseDate: "2023-05-18", location: "Annex Lab B Bench 02", assignedToEmployeeId: "emp-user-06", assignedToEmployeeName: "Dr. Arthur Pendelton", condition: "Mint" },
    { id: "AST-1045", name: "Fluke 8846A 6.5 Digit Precision Multimeter", model: "FLUKE-8846A", serialNumber: "SN-LAB-120938", categoryId: "cat-lab", categoryName: "Lab & Testing Gear", departmentId: "dept-rd", departmentName: "Research & Hardware Lab", status: "Available", acquisitionCost: 2450, purchaseDate: "2023-06-20", location: "Annex Lab B Tool Cabinet", condition: "Good" },
    { id: "AST-1046", name: "Keysight E36313A Triple Output DC Power Supply", model: "E36313A-PRO", serialNumber: "SN-LAB-881203", categoryId: "cat-lab", categoryName: "Lab & Testing Gear", departmentId: "dept-rd", departmentName: "Research & Hardware Lab", status: "Available", acquisitionCost: 3100, purchaseDate: "2023-07-12", location: "Annex Lab B Bench 03", condition: "Mint" },
    { id: "AST-1047", name: "Rigol RSA5065N Real-Time Spectrum Analyzer", model: "RSA5065N", serialNumber: "SN-LAB-330199", categoryId: "cat-lab", categoryName: "Lab & Testing Gear", departmentId: "dept-rd", departmentName: "Research & Hardware Lab", status: "Available", acquisitionCost: 6500, purchaseDate: "2023-10-25", location: "Annex Lab B Calibration Shelf", condition: "Mint" },

    // Additional Laptops & Test Devices to reach 55+
    { id: "AST-1048", name: "Apple iPad Pro Mock-12.9 (M2 Cellular)", model: "IPD-PRO-129", serialNumber: "SN-MOB-990123", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-design", departmentName: "Product & UI/UX", status: "Available", acquisitionCost: 1399, purchaseDate: "2023-08-19", location: "Floor 3 - Device Testing Lab", condition: "Mint" },
    { id: "AST-1049", name: "Samsung Galaxy Tab Mock-S9 Ultra", model: "SM-X910-512G", serialNumber: "SN-MOB-441209", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-design", departmentName: "Product & UI/UX", status: "Available", acquisitionCost: 1199, purchaseDate: "2023-09-02", location: "Floor 3 - Device Testing Lab", condition: "Mint" },
    { id: "AST-1050", name: "Google Pixel Tablet Mock-11 Pro", model: "G-PIX-TAB-256", serialNumber: "SN-MOB-110293", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-design", departmentName: "Product & UI/UX", status: "Available", acquisitionCost: 649, purchaseDate: "2023-10-10", location: "Floor 3 - Device Testing Lab", condition: "Good" },
    { id: "AST-1051", name: "Dell Precision Mock-3660 Tower Desktop", model: "DP-3660-TOW", serialNumber: "SN-DEL-339102", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Available", acquisitionCost: 2850, purchaseDate: "2023-11-15", location: "Floor 4 - Build Server Station", condition: "Mint" },
    { id: "AST-1052", name: "Apple Mac Studio Mock (M2 Ultra 128GB)", model: "MAC-STUDIO-U", serialNumber: "SN-MAC-771920", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Available", acquisitionCost: 4799, purchaseDate: "2024-01-20", location: "Floor 4 - Tech Hub AI Station", condition: "Mint" },
    { id: "AST-1053", name: "Lenovo ThinkStation Mock-P620 Threadripper", model: "TS-P620-64C", serialNumber: "SN-LEN-001293", categoryId: "cat-laptops", categoryName: "Laptops & Workstations", departmentId: "dept-rd", departmentName: "Research & Hardware Lab", status: "Available", acquisitionCost: 5900, purchaseDate: "2023-12-05", location: "Annex Lab B CAD Rig", condition: "Mint" },
    { id: "AST-1054", name: "Logitech Rally Plus Mock Video System", model: "LOGI-RALLY-P", serialNumber: "SN-AV-881923", categoryId: "cat-av", categoryName: "Audio & Visual Gear", departmentId: "dept-eng", departmentName: "Engineering & Tech", status: "Available", acquisitionCost: 2499, purchaseDate: "2023-07-28", location: "Floor 4 - Large Conf Room B", condition: "Good" },
    { id: "AST-1055", name: "Zebra Mock-TC58 Enterprise Mobile Barcode Computer", model: "TC58-RUGGED", serialNumber: "SN-OPS-440192", categoryId: "cat-lab", categoryName: "Lab & Testing Gear", departmentId: "dept-ops", departmentName: "Operations & Logistics", status: "Allocated", acquisitionCost: 1550, purchaseDate: "2023-04-18", location: "Floor 1 - Warehouse Bay 02", assignedToEmployeeId: "emp-user-09", assignedToEmployeeName: "Carlos Gomez", condition: "Good" },
    { id: "AST-1056", name: "Ford Transit Mock Cargo Van 2024 (Asset Fleet)", model: "VAN-TRANSIT-24", serialNumber: "VIN-MOCK-9912048", categoryId: "cat-furniture", categoryName: "Ergonomic Office Furniture", departmentId: "dept-ops", departmentName: "Operations & Logistics", status: "Available", acquisitionCost: 48000, purchaseDate: "2024-01-10", location: "Basement Parking Bay P-12", condition: "Mint" },
  ];

  // Allocations (Active, Overdue, and Completed)
  const allocations: Allocation[] = [
    { id: "ALC-2001", assetId: "AST-1001", assetName: "MacBook Pro Mock-16 (M3 Max)", employeeId: "emp-dh-01", employeeName: "Sarah Chen", departmentId: "dept-eng", departmentName: "Engineering & Tech", allocatedAt: "2024-02-16", expectedReturnDate: "2025-02-16", status: "active", notes: "Primary executive engineering laptop" },
    { id: "ALC-2002", assetId: "AST-1002", assetName: "ThinkPad Carbon Mock-X1 (Gen 12)", employeeId: "emp-admin-01", employeeName: "Alex Rivera", departmentId: "dept-eng", departmentName: "Engineering & Tech", allocatedAt: "2024-01-12", expectedReturnDate: "2025-01-12", status: "active", notes: "Administrative system console" },
    { id: "ALC-2003", assetId: "AST-1004", assetName: "MacBook Pro Mock-14 (M3 Pro)", employeeId: "emp-user-01", employeeName: "Jane Doe", departmentId: "dept-design", departmentName: "Product & UI/UX", allocatedAt: "2024-03-06", expectedReturnDate: "2025-03-06", status: "active", notes: "Figma & design workstation" },
    { id: "ALC-2004", assetId: "AST-1021", assetName: "Apple Studio Display 27 5K Mock", employeeId: "emp-user-01", employeeName: "Jane Doe", departmentId: "dept-design", departmentName: "Product & UI/UX", allocatedAt: "2024-03-06", expectedReturnDate: "2025-03-06", status: "active", notes: "Color-accurate 5K display" },
    { id: "ALC-2005", assetId: "AST-1007", assetName: "ThinkPad P16 Mock Gen 2", employeeId: "emp-user-07", employeeName: "Liam Walker", departmentId: "dept-eng", departmentName: "Engineering & Tech", allocatedAt: "2023-12-05", expectedReturnDate: "2024-05-01", status: "overdue", notes: "DevOps release machine (past return date)" },
    { id: "ALC-2006", assetId: "AST-1011", assetName: "Panasonic Toughbook Mock-40", employeeId: "emp-user-09", employeeName: "Carlos Gomez", departmentId: "dept-ops", departmentName: "Operations & Logistics", allocatedAt: "2023-06-01", expectedReturnDate: "2024-06-01", status: "overdue", notes: "Warehouse intake scanner host" },
    { id: "ALC-2007", assetId: "AST-1012", assetName: "ThinkPad X13s ARM Mock", employeeId: "emp-audit-01", employeeName: "Marcus Vance", departmentId: "dept-compliance", departmentName: "Compliance & Audit", allocatedAt: "2023-08-01", expectedReturnDate: "2025-08-01", status: "active", notes: "Field audit notebook" },
    { id: "ALC-2008", assetId: "AST-1003", assetName: "Dell Precision Mock-5680 Workstation", employeeId: "emp-user-06", employeeName: "Dr. Arthur Pendelton", departmentId: "dept-rd", departmentName: "Research & Hardware Lab", allocatedAt: "2023-11-25", expectedReturnDate: "2024-11-25", status: "active", notes: "Simulation modeling unit" },
  ];

  // Transfer Requests
  const transfers: TransferRequest[] = [
    { id: "TRF-3001", assetId: "AST-1008", assetName: "MacBook Pro Mock-14 (M2 Pro)", fromEmployeeId: "emp-user-08", fromEmployeeName: "Sophia Bennett", toEmployeeId: "emp-user-01", toEmployeeName: "Jane Doe", status: "requested", requestedAt: "2024-10-15T09:30:00Z", reason: "Cross-department UX evaluation assignment" },
    { id: "TRF-3002", assetId: "AST-1028", assetName: "BenQ Designer Monitor 32 Mock", fromEmployeeId: "emp-admin-01", fromEmployeeName: "Alex Rivera", toEmployeeId: "emp-user-07", toEmployeeName: "Liam Walker", status: "approved", requestedAt: "2024-09-20T14:15:00Z", reason: "Dual-monitor DevOps desk configuration" },
  ];

  // Maintenance Requests
  const maintenance: MaintenanceRequest[] = [
    { id: "MNT-4001", assetId: "AST-1016", assetName: "ASUS ROG Zephyrus Mock-G14 (ML Test)", reportedByEmployeeId: "emp-user-06", reportedByEmployeeName: "Dr. Arthur Pendelton", priority: "urgent", status: "In Progress", issueDescription: "Heavy thermal throttling during CUDA neural net compilation. Fans making clicking noise.", technician: "Dave Tech Services", estimatedCost: 350, createdAt: "2024-10-02" },
    { id: "MNT-4002", assetId: "AST-1018", assetName: "Dell Precision Mock-7760 Big Rig", reportedByEmployeeId: "emp-admin-01", reportedByEmployeeName: "Alex Rivera", priority: "high", status: "Approved", issueDescription: "Battery health reported at 48% with slight chassis expansion. Requires OEM battery swap.", technician: "Dell Enterprise Service", estimatedCost: 280, createdAt: "2024-10-12" },
    { id: "MNT-4003", assetId: "AST-1027", assetName: "ASUS ProArt 27 Calibrated Mock", reportedByEmployeeId: "emp-user-02", reportedByEmployeeName: "David Kim", priority: "medium", status: "Pending", issueDescription: "Display flicker when connected via Thunderbolt USB-C cable.", createdAt: "2024-10-18" },
    { id: "MNT-4004", assetId: "AST-1002", assetName: "ThinkPad Carbon Mock-X1 (Gen 12)", reportedByEmployeeId: "emp-admin-01", reportedByEmployeeName: "Alex Rivera", priority: "low", status: "Resolved", issueDescription: "TrackPoint rubber cap replacement and keyboard firmware update.", technician: "Internal IT Depot", estimatedCost: 25, actualCost: 20, createdAt: "2024-08-10", resolvedAt: "2024-08-12" },
  ];

  // Audit Cycles
  const auditCycles: AuditCycle[] = [
    { id: "AUD-2026-Q1", name: "Q1 2026 Tech Hub & Engineering Verification", scopeLocation: "Floor 4 - Tech Hub", scopeDepartmentId: "dept-eng", scopeDepartmentName: "Engineering & Tech", status: "Active", assignedAuditorId: "emp-audit-01", assignedAuditorName: "Marcus Vance", startDate: "2026-01-10", endDate: "2026-02-15", totalAssetsInScope: 12, verifiedCount: 9, missingCount: 1, damagedCount: 2 },
    { id: "AUD-2026-Q2", name: "Operations & Warehouse Logistics Audit", scopeLocation: "Floor 1 - Warehouse Bay", scopeDepartmentId: "dept-ops", scopeDepartmentName: "Operations & Logistics", status: "Completed", assignedAuditorId: "emp-audit-01", assignedAuditorName: "Marcus Vance", startDate: "2025-11-01", endDate: "2025-11-20", totalAssetsInScope: 14, verifiedCount: 13, missingCount: 1, damagedCount: 0 },
    { id: "AUD-2026-Q3", name: "Annual R&D Hardware Lab Compliance Review", scopeLocation: "Annex Lab B", scopeDepartmentId: "dept-rd", scopeDepartmentName: "Research & Hardware Lab", status: "Active", assignedAuditorId: "emp-audit-01", assignedAuditorName: "Marcus Vance", startDate: "2026-03-01", endDate: "2026-03-31", totalAssetsInScope: 8, verifiedCount: 4, missingCount: 0, damagedCount: 1 },
  ];

  const auditVerifications: AuditVerification[] = [
    { id: "AV-01", auditCycleId: "AUD-2026-Q1", assetId: "AST-1001", assetName: "MacBook Pro Mock-16 (M3 Max)", status: "Verified", verifiedAt: "2026-01-12T10:00:00Z", notes: "Asset physically verified in Sarah Chen office." },
    { id: "AV-02", auditCycleId: "AUD-2026-Q1", assetId: "AST-1002", assetName: "ThinkPad Carbon Mock-X1 (Gen 12)", status: "Verified", verifiedAt: "2026-01-12T10:30:00Z" },
    { id: "AV-03", auditCycleId: "AUD-2026-Q1", assetId: "AST-1018", assetName: "Dell Precision Mock-7760 Big Rig", status: "Damaged", verifiedAt: "2026-01-14T11:20:00Z", notes: "Swollen battery casing observed, ticket MNT-4002 opened." },
    { id: "AV-04", auditCycleId: "AUD-2026-Q1", assetId: "AST-1019", assetName: "ThinkPad Yoga Mock-X1 Gen 7", status: "Missing", verifiedAt: "2026-01-15T15:00:00Z", notes: "Employee uncontactable, unit flagged as missing." },
  ];

  // Bookings (Shared Resources)
  const bookings: Booking[] = [
    { id: "BKG-5001", resourceId: "RES-CONF-A", resourceName: "Executive Boardroom A (4K Video)", employeeId: "emp-dh-01", employeeName: "Sarah Chen", departmentId: "dept-eng", departmentName: "Engineering & Tech", startTime: "2026-11-10T10:00:00", endTime: "2026-11-10T12:00:00", purpose: "Q4 Engineering All-Hands Architecture Briefing", status: "confirmed" },
    { id: "BKG-5002", resourceId: "RES-CONF-A", resourceName: "Executive Boardroom A (4K Video)", employeeId: "emp-user-02", employeeName: "David Kim", departmentId: "dept-design", departmentName: "Product & UI/UX", startTime: "2026-11-10T14:00:00", endTime: "2026-11-10T16:00:00", purpose: "Design System 3.0 Showcase", status: "confirmed" },
    { id: "BKG-5003", resourceId: "RES-LAB-02", resourceName: "Hardware RF Testing Lab 2", employeeId: "emp-user-06", employeeName: "Dr. Arthur Pendelton", departmentId: "dept-rd", departmentName: "Research & Hardware Lab", startTime: "2026-11-11T09:00:00", endTime: "2026-11-11T17:00:00", purpose: "Antenna RF compliance sweeps", status: "confirmed" },
    { id: "BKG-5004", resourceId: "RES-PROJ-01", resourceName: "Sony 4K Mobile Projector Cart", employeeId: "emp-user-01", employeeName: "Jane Doe", departmentId: "dept-design", departmentName: "Product & UI/UX", startTime: "2026-11-12T13:00:00", endTime: "2026-11-12T15:00:00", purpose: "Interactive Usability Testing Session", status: "confirmed" },
  ];

  // Notifications
  const notifications: ActivityNotification[] = [
    { id: "NOTIF-01", title: "New Transfer Request", message: "Jane Doe submitted transfer request for MacBook Pro (AST-1008).", timestamp: "10 mins ago", type: "info", read: false },
    { id: "NOTIF-02", title: "Overdue Asset Alert", message: "AST-1007 (Liam Walker) is past expected return date (2024-05-01).", timestamp: "1 hour ago", type: "warning", read: false },
    { id: "NOTIF-03", title: "Maintenance In Progress", message: "ASUS ROG Zephyrus (AST-1016) has been picked up by technician Dave.", timestamp: "3 hours ago", type: "info", read: true },
    { id: "NOTIF-04", title: "Audit Discrepancy Flagged", message: "Marcus Vance marked AST-1019 as Missing during Q1 2026 audit.", timestamp: "Yesterday", type: "critical", read: false },
    { id: "NOTIF-05", title: "Resource Booking Confirmed", message: "Executive Boardroom A confirmed for Sarah Chen on Nov 10.", timestamp: "2 days ago", type: "success", read: true },
  ];

  return {
    assets,
    departments,
    employees,
    categories,
    allocations,
    transfers,
    bookings,
    maintenance,
    auditCycles,
    auditVerifications,
    notifications,
  };
}

// -----------------------------------------------------------------------------
// REPOSITORY ENGINE & STORAGE ADAPTER (With Corrupted State Recovery & Quota Handling)
// -----------------------------------------------------------------------------
export function getMockDatabase(): DatabaseState {
  if (typeof window === "undefined") {
    return generateInitialData();
  }

  try {
    const raw = window.sessionStorage.getItem(DB_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Validate structural integrity against malformed or corrupted JSON
      if (
        parsed &&
        typeof parsed === "object" &&
        Array.isArray(parsed.assets) &&
        Array.isArray(parsed.departments) &&
        Array.isArray(parsed.employees) &&
        Array.isArray(parsed.categories) &&
        Array.isArray(parsed.allocations) &&
        Array.isArray(parsed.transfers) &&
        Array.isArray(parsed.bookings) &&
        Array.isArray(parsed.maintenance) &&
        Array.isArray(parsed.auditCycles)
      ) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Recovering from corrupted sessionStorage mock data. Re-seeding defaults.", err);
  }

  const fresh = generateInitialData();
  saveMockDatabase(fresh);
  return fresh;
}

export function saveMockDatabase(data: DatabaseState): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.sessionStorage.setItem(DB_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("assetflow:db_updated", { detail: data }));
    return true;
  } catch (err) {
    console.error("Storage error (quota or serialization issue). Attempting pruned recovery...", err);
    try {
      const pruned = { ...data, notifications: data.notifications.slice(0, 10) };
      window.sessionStorage.setItem(DB_STORAGE_KEY, JSON.stringify(pruned));
      window.dispatchEvent(new CustomEvent("assetflow:db_updated", { detail: pruned }));
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Simulated Row Level Security (RLS) Filter Engine
 * Replicates Postgres RLS policies in the client-side data layer
 */
export function getScopedAllocations(role: Role, departmentId?: string, employeeId?: string): Allocation[] {
  const db = getMockDatabase();
  if (role === "admin" || role === "auditor") {
    return db.allocations;
  }
  if (role === "department_head") {
    return db.allocations.filter((a) => a.departmentId === departmentId);
  }
  return db.allocations.filter((a) => a.employeeId === employeeId);
}

export function getScopedAssets(role: Role, departmentId?: string, employeeId?: string): Asset[] {
  const db = getMockDatabase();
  if (role === "admin" || role === "auditor") {
    return db.assets;
  }
  if (role === "department_head") {
    return db.assets.filter((a) => a.departmentId === departmentId);
  }
  return db.assets.filter((a) => a.assignedToEmployeeId === employeeId);
}

export function getScopedMaintenance(role: Role, departmentId?: string, employeeId?: string): MaintenanceRequest[] {
  const db = getMockDatabase();
  if (role === "admin" || role === "auditor") {
    return db.maintenance;
  }
  if (role === "department_head") {
    const deptAssetIds = new Set(db.assets.filter((a) => a.departmentId === departmentId).map((a) => a.id));
    return db.maintenance.filter((m) => deptAssetIds.has(m.assetId) || m.reportedByEmployeeId === employeeId);
  }
  return db.maintenance.filter((m) => m.reportedByEmployeeId === employeeId);
}

export function resetMockDatabase(): DatabaseState {
  const fresh = generateInitialData();
  saveMockDatabase(fresh);
  return fresh;
}

export function initMockDatabase(): void {
  if (typeof window === "undefined") return;
  const existing = window.sessionStorage.getItem(DB_STORAGE_KEY);
  if (!existing) {
    saveMockDatabase(generateInitialData());
  }
}

// -----------------------------------------------------------------------------
// BUSINESS LOGIC ACTIONS (Preserving strict ERP rules)
// -----------------------------------------------------------------------------

// 1. Assets CRUD
export function createAsset(newAsset: Omit<Asset, "id">): Asset {
  const db = getMockDatabase();
  const idNum = 1000 + db.assets.length + 1;
  const id = `AST-${idNum}`;
  const asset: Asset = { ...newAsset, id };

  db.assets.unshift(asset);

  // Update category and department asset count
  const cat = db.categories.find((c) => c.id === asset.categoryId);
  if (cat) cat.assetCount += 1;
  const dept = db.departments.find((d) => d.id === asset.departmentId);
  if (dept) dept.assetCount += 1;

  // Append activity log
  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    title: "Asset Registered",
    message: `Asset ${asset.name} (${asset.id}) was registered into ${asset.departmentName}.`,
    timestamp: "Just now",
    type: "success",
    read: false,
  });

  saveMockDatabase(db);
  return asset;
}

export function updateAssetStatus(assetId: string, newStatus: AssetStatus, notes?: string): Asset | null {
  const db = getMockDatabase();
  const asset = db.assets.find((a) => a.id === assetId);
  if (!asset) return null;

  // Strict domain rule: Transitions must be validated
  asset.status = newStatus;
  if (notes) asset.notes = notes;

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    title: "Asset Status Changed",
    message: `${asset.name} (${asset.id}) transitioned to status: ${newStatus}.`,
    timestamp: "Just now",
    type: "info",
    read: false,
  });

  saveMockDatabase(db);
  return asset;
}

// 2. Allocation & Double-Allocation Check
export function allocateAsset(
  assetId: string,
  employeeId: string,
  expectedReturnDate: string,
  notes?: string
): { success: boolean; error?: string; currentlyHeldBy?: string; allocation?: Allocation } {
  const db = getMockDatabase();
  const asset = db.assets.find((a) => a.id === assetId);
  const employee = db.employees.find((e) => e.id === employeeId);

  if (!asset) return { success: false, error: "Asset not found" };
  if (!employee) return { success: false, error: "Employee not found" };

  // Rule: No double allocation!
  if (asset.status === "Allocated") {
    return {
      success: false,
      error: `Asset is already allocated.`,
      currentlyHeldBy: asset.assignedToEmployeeName || "Another employee",
    };
  }

  // Update asset status
  asset.status = "Allocated";
  asset.assignedToEmployeeId = employee.id;
  asset.assignedToEmployeeName = employee.fullName;

  employee.allocatedAssetCount += 1;

  const allocation: Allocation = {
    id: `ALC-${Date.now().toString().slice(-4)}`,
    assetId: asset.id,
    assetName: asset.name,
    employeeId: employee.id,
    employeeName: employee.fullName,
    departmentId: employee.departmentId,
    departmentName: employee.departmentName,
    allocatedAt: new Date().toISOString().split("T")[0],
    expectedReturnDate,
    status: "active",
    notes,
  };

  db.allocations.unshift(allocation);

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    title: "Asset Allocated",
    message: `${asset.name} allocated to ${employee.fullName} until ${expectedReturnDate}.`,
    timestamp: "Just now",
    type: "success",
    read: false,
  });

  saveMockDatabase(db);
  return { success: true, allocation };
}

export function returnAsset(allocationId: string): boolean {
  const db = getMockDatabase();
  const alloc = db.allocations.find((a) => a.id === allocationId);
  if (!alloc) return false;

  alloc.status = "returned";
  alloc.actualReturnDate = new Date().toISOString().split("T")[0];

  const asset = db.assets.find((a) => a.id === alloc.assetId);
  if (asset) {
    asset.status = "Available";
    asset.assignedToEmployeeId = null;
    asset.assignedToEmployeeName = null;
  }

  const employee = db.employees.find((e) => e.id === alloc.employeeId);
  if (employee && employee.allocatedAssetCount > 0) {
    employee.allocatedAssetCount -= 1;
  }

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    title: "Asset Returned",
    message: `${alloc.assetName} returned by ${alloc.employeeName}. Status reverted to Available.`,
    timestamp: "Just now",
    type: "info",
    read: false,
  });

  saveMockDatabase(db);
  return true;
}

// 3. Transfers Workflow
export function requestTransfer(assetId: string, fromEmpId: string, toEmpId: string, reason: string): TransferRequest | null {
  const db = getMockDatabase();
  const asset = db.assets.find((a) => a.id === assetId);
  const fromEmp = db.employees.find((e) => e.id === fromEmpId);
  const toEmp = db.employees.find((e) => e.id === toEmpId);

  if (!asset || !fromEmp || !toEmp) return null;

  const trf: TransferRequest = {
    id: `TRF-${Date.now().toString().slice(-4)}`,
    assetId: asset.id,
    assetName: asset.name,
    fromEmployeeId: fromEmp.id,
    fromEmployeeName: fromEmp.fullName,
    toEmployeeId: toEmp.id,
    toEmployeeName: toEmp.fullName,
    status: "requested",
    requestedAt: new Date().toISOString(),
    reason,
  };

  db.transfers.unshift(trf);

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    title: "Transfer Requested",
    message: `Transfer requested for ${asset.name} from ${fromEmp.fullName} to ${toEmp.fullName}.`,
    timestamp: "Just now",
    type: "warning",
    read: false,
  });

  saveMockDatabase(db);
  return trf;
}

export function approveTransfer(transferId: string): boolean {
  const db = getMockDatabase();
  const trf = db.transfers.find((t) => t.id === transferId);
  if (!trf || trf.status !== "requested") return false;

  trf.status = "approved";

  // Re-allocate asset to recipient
  const asset = db.assets.find((a) => a.id === trf.assetId);
  if (asset) {
    asset.assignedToEmployeeId = trf.toEmployeeId;
    asset.assignedToEmployeeName = trf.toEmployeeName;
    asset.status = "Allocated";
  }

  const fromEmp = db.employees.find((e) => e.id === trf.fromEmployeeId);
  if (fromEmp && fromEmp.allocatedAssetCount > 0) fromEmp.allocatedAssetCount -= 1;

  const toEmp = db.employees.find((e) => e.id === trf.toEmployeeId);
  if (toEmp) toEmp.allocatedAssetCount += 1;

  // Mark old allocation transferred and create new allocation
  const oldAlloc = db.allocations.find((a) => a.assetId === trf.assetId && a.status === "active");
  if (oldAlloc) {
    oldAlloc.status = "transferred";
    oldAlloc.actualReturnDate = new Date().toISOString().split("T")[0];
  }

  if (toEmp && asset) {
    db.allocations.unshift({
      id: `ALC-${Date.now().toString().slice(-4)}`,
      assetId: asset.id,
      assetName: asset.name,
      employeeId: toEmp.id,
      employeeName: toEmp.fullName,
      departmentId: toEmp.departmentId,
      departmentName: toEmp.departmentName,
      allocatedAt: new Date().toISOString().split("T")[0],
      expectedReturnDate: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
      status: "active",
      notes: `Transferred from ${trf.fromEmployeeName}`,
    });
  }

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    title: "Transfer Approved",
    message: `Transfer of ${trf.assetName} approved. Assigned to ${trf.toEmployeeName}.`,
    timestamp: "Just now",
    type: "success",
    read: false,
  });

  saveMockDatabase(db);
  return true;
}

// 4. Maintenance Workflow: Pending -> Approved -> In Progress -> Resolved
export function createMaintenanceRequest(
  assetId: string,
  reportedByEmployeeId: string,
  issueDescription: string,
  priority: "low" | "medium" | "high" | "urgent"
): MaintenanceRequest | null {
  const db = getMockDatabase();
  const asset = db.assets.find((a) => a.id === assetId);
  const emp = db.employees.find((e) => e.id === reportedByEmployeeId);

  if (!asset || !emp) return null;

  const req: MaintenanceRequest = {
    id: `MNT-${Date.now().toString().slice(-4)}`,
    assetId: asset.id,
    assetName: asset.name,
    reportedByEmployeeId: emp.id,
    reportedByEmployeeName: emp.fullName,
    priority,
    status: "Pending", // Rule 5: Status remains Available/Allocated until approved!
    issueDescription,
    createdAt: new Date().toISOString().split("T")[0],
  };

  db.maintenance.unshift(req);

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    title: "Maintenance Ticket Raised",
    message: `New ticket ${req.id} raised for ${asset.name} (${priority} priority).`,
    timestamp: "Just now",
    type: "warning",
    read: false,
  });

  saveMockDatabase(db);
  return req;
}

export function updateMaintenanceStatus(
  requestId: string,
  newStatus: "Approved" | "In Progress" | "Resolved" | "Rejected",
  technician?: string,
  cost?: number
): boolean {
  const db = getMockDatabase();
  const ticket = db.maintenance.find((m) => m.id === requestId);
  if (!ticket) return false;

  ticket.status = newStatus;
  if (technician) ticket.technician = technician;
  if (cost !== undefined) ticket.actualCost = cost;

  const asset = db.assets.find((a) => a.id === ticket.assetId);

  // Rule 5: Maintenance must be approved before status flips to "Under Maintenance"
  if (newStatus === "Approved" || newStatus === "In Progress") {
    if (asset) asset.status = "Under Maintenance";
  } else if (newStatus === "Resolved") {
    ticket.resolvedAt = new Date().toISOString().split("T")[0];
    // Reverts to Available only on Resolved
    if (asset) asset.status = "Available";
  }

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    title: "Maintenance Update",
    message: `Ticket ${ticket.id} (${ticket.assetName}) marked as ${newStatus}.`,
    timestamp: "Just now",
    type: newStatus === "Resolved" ? "success" : "info",
    read: false,
  });

  saveMockDatabase(db);
  return true;
}

// 5. Authoritative Booking Overlap Engine
export function createBooking(
  resourceId: string,
  resourceName: string,
  employeeId: string,
  startTime: string, // ISO
  endTime: string,   // ISO
  purpose: string
): { success: boolean; error?: string; booking?: Booking } {
  const db = getMockDatabase();
  const emp = db.employees.find((e) => e.id === employeeId);
  if (!emp) return { success: false, error: "Employee not found" };

  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (start >= end) {
    return { success: false, error: "End time must be strictly after start time." };
  }

  // Domain Rule 4: Server-side/authoritative overlap check!
  // Overlap condition: (StartA < EndB) and (EndA > StartB). Touching is valid!
  const hasConflict = db.bookings.some((b) => {
    if (b.resourceId !== resourceId || b.status === "cancelled") return false;
    const bStart = new Date(b.startTime).getTime();
    const bEnd = new Date(b.endTime).getTime();
    return start < bEnd && end > bStart;
  });

  if (hasConflict) {
    return {
      success: false,
      error: `Conflict: This resource is already booked during the requested time window. A booking starting when another ends is permitted, but overlapping ranges are rejected.`,
    };
  }

  const booking: Booking = {
    id: `BKG-${Date.now().toString().slice(-4)}`,
    resourceId,
    resourceName,
    employeeId: emp.id,
    employeeName: emp.fullName,
    departmentId: emp.departmentId,
    departmentName: emp.departmentName,
    startTime,
    endTime,
    purpose,
    status: "confirmed",
  };

  db.bookings.unshift(booking);

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    title: "Resource Booked",
    message: `${resourceName} successfully reserved for ${emp.fullName}.`,
    timestamp: "Just now",
    type: "success",
    read: false,
  });

  saveMockDatabase(db);
  return { success: true, booking };
}

// 6. Audit Cycles & Verification
export function verifyAuditAsset(
  auditCycleId: string,
  assetId: string,
  status: "Verified" | "Missing" | "Damaged",
  notes?: string
): boolean {
  const db = getMockDatabase();
  const cycle = db.auditCycles.find((c) => c.id === auditCycleId);
  if (!cycle || cycle.status === "Completed") return false; // Locked!

  const asset = db.assets.find((a) => a.id === assetId);
  if (!asset) return false;

  let record = db.auditVerifications.find((v) => v.auditCycleId === auditCycleId && v.assetId === assetId);
  if (record) {
    record.status = status;
    record.verifiedAt = new Date().toISOString();
    if (notes) record.notes = notes;
  } else {
    record = {
      id: `AV-${Date.now().toString().slice(-4)}`,
      auditCycleId,
      assetId,
      assetName: asset.name,
      status,
      verifiedAt: new Date().toISOString(),
      notes,
    };
    db.auditVerifications.unshift(record);
  }

  // Recount
  const verifications = db.auditVerifications.filter((v) => v.auditCycleId === auditCycleId);
  cycle.verifiedCount = verifications.filter((v) => v.status === "Verified").length;
  cycle.missingCount = verifications.filter((v) => v.status === "Missing").length;
  cycle.damagedCount = verifications.filter((v) => v.status === "Damaged").length;

  saveMockDatabase(db);
  return true;
}

export function closeAuditCycle(auditCycleId: string): boolean {
  const db = getMockDatabase();
  const cycle = db.auditCycles.find((c) => c.id === auditCycleId);
  if (!cycle || cycle.status === "Completed") return false;

  // Domain Rule 6: Closing a cycle locks the cycle and updates asset statuses (confirmed missing -> Lost)
  cycle.status = "Completed";

  const verifications = db.auditVerifications.filter((v) => v.auditCycleId === auditCycleId);
  for (const v of verifications) {
    const asset = db.assets.find((a) => a.id === v.assetId);
    if (asset) {
      if (v.status === "Missing") {
        asset.status = "Lost";
        asset.notes = `Confirmed missing in audit ${cycle.name}`;
      } else if (v.status === "Damaged") {
        asset.condition = "Needs Maintenance";
      }
    }
  }

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    title: "Audit Cycle Finalized & Locked",
    message: `${cycle.name} closed. Reconciled discrepancies: ${cycle.missingCount} marked Lost.`,
    timestamp: "Just now",
    type: "critical",
    read: false,
  });

  saveMockDatabase(db);
  return true;
}

// 7. Role Promotion (Admin only)
export function promoteEmployeeRole(employeeId: string, newRole: Role): boolean {
  const db = getMockDatabase();
  const emp = db.employees.find((e) => e.id === employeeId);
  if (!emp) return false;

  emp.role = newRole;

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    title: "Employee Promoted",
    message: `${emp.fullName} role elevated to ${newRole.replace("_", " ").toUpperCase()}.`,
    timestamp: "Just now",
    type: "success",
    read: false,
  });

  saveMockDatabase(db);
  return true;
}

