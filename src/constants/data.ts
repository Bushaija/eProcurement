import { NavItem } from "@/types";
import { z } from "zod";

export const BATCH_SIZE = 100;

export const DIVISION_OPTIONS = [
  { value: "BTD", label: "BTD"},
  { value: "CS", label: "CS"},
  { value: "HIV_AIDS_STIs", label: "HIV/AIDS & STIs"},
  { value: "MCCH", label: "MCCH"},
  { value: "MH", label: "MH"},
  { value: "MOPD", label: "MOPD"},
  { value: "MTD", label: "MTD"},
  { value: "NCDs", label: "NCDs"},
  { value: "NRL", label: "NRL"},
  { value: "PHS_EPR", label: "PHS_EPR"},
  { value: "RHCC", label: "RHCC"},
  { value: "RIDS", label: "RIDS"},
  { value: "SAMU", label: "SAMU"},
  { value: "TB_Nutrition", label: "TB Nutrition"},
  { value: "TB_Medicine", label: "TB Medicine"}
];

export const CATEGORY_OPTIONS = [
  { value: 'ARV', label: 'ARV'},
  { value: 'OIS', label: 'OIS'},
  { value: 'BIOCHEMISTRY', label: 'BIOCHEMISTRY'},
  { value: 'CD4', label: 'CD4'},
  { value: 'General Consummables', label: 'General Consummables'},
  { value: 'Genotyping', label: 'Genotyping'},
  { value: 'Hematology', label: 'Hematology'},
  { value: 'HIV EID', label: 'HIV EID'},
  { value: 'HIV RTKs', label: 'HIV RTKs'},
  { value: 'HIV VL Abbott', label: 'HIV VL Abbott'},
  { value: 'HIV VL Roche', label: 'HIV VL Roche'},
  { value: 'Other Tests', label: 'Other Tests'},
  { value: 'PT', label: 'PT'},
  { value: 'Hepatitis RDT', label: 'Hepatitis RDT'},
  { value: 'Hepatitis VL', label: 'Hepatitis VL'},
  { value: 'Hepatitis Self-Test', label: 'Hepatitis Self-Test'},
  { value: 'Other Test', label: 'Other Test'},
  { value: 'Hepatitis medicines ', label: 'Hepatitis medicines '},
  { value: 'MALARIA', label: 'MALARIA'},
  { value: 'Medicines\nLeprosy', label: 'Medicines\nLeprosy'},
  { value: 'Public Family planning', label: 'Public Family planning'},
  { value: 'SOCIAL MARKETING PF', label: 'SOCIAL MARKETING PF'},
  { value: 'COMMUNITY', label: 'COMMUNITY'},
  { value: 'Emergency obstetrical care ', label: 'Emergency obstetrical care '},
  { value: 'Early infant MC  drugs and consumables', label: 'Early infant MC  drugs and consumables'},
]

export const orderSchema = z.object({
  category: z.string().min(1, "Category is required"),
  plannedUnit: z.string().min(1, "Planned Unit is required"),
  allocationDepartment: z.string().min(1, "Allocation Department is required"),
  packSize: z.string().min(1, "Pack Size is required"),
  plannedOrderDate: z.string().min(1, "Planned Order Date is required"),
  plannedDeliveryDate: z.string().min(1, "Planned Delivery Date is required"),
  plannedQuantity: z.number().min(0).nullable(),
  revisedQuantity: z.number().min(0).nullable(),
  secondReview: z.number().min(0, "Second Review is required"),
  unitCost: z.string().min(1, "Unit Cost is required"),
  totalCost: z.number().min(0, "Total Cost is required"),
  fundingSource: z.string().min(1, "Funding Source is required"),
  status: z.enum(["PLANNED", "APPROVED", "REJECTED", "SUBMITTED", "COMPLETED"]).default("PLANNED"),
});


export const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      url: '/',
      icon: 'dashboard',
      isActive: false,
      shortcut: ['d', 'd'],
      items: [] // Empty array as there are no child items for Dashboard
    },
    {
      title: 'Purchase Orders',
      url: '/purchase-orders',
      icon: 'user',
      shortcut: ['e', 'e'],
      isActive: false,
      items: [] // No child items
    },
    {
      title: 'Purchase Order Review',
      url: '/reviews',
      icon: 'product',
      shortcut: ['p', 'p'],
      isActive: false,
      items: [] // No child items
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: 'product',
      shortcut: ['a', 'a'],
      isActive: false,
      items: [] // No child items
    },
    // {
    //   title: 'Account',
    //   url: '#', // Placeholder as there is no direct link for the parent
    //   icon: 'billing',
    //   isActive: true,
  
    //   items: [
    //     {
    //       title: 'Profile',
    //       url: '/dashboard/profile',
    //       icon: 'userPen',
    //       shortcut: ['m', 'm']
    //     },
    //     {
    //       title: 'Login',
    //       shortcut: ['l', 'l'],
    //       url: '/',
    //       icon: 'login'
    //     }
    //   ]
    // },
    // {
    //   title: 'Kanban',
    //   url: '/dashboard/kanban',
    //   icon: 'kanban',
    //   shortcut: ['k', 'k'],
    //   isActive: false,
    //   items: [] // No child items
    // }
  ];

  export interface BaseImplementation  {
    purchaseOrderId: number;
    purchaseOrderCreationDate: string;
    purchaseOrderNumber: string;
    purchaseOrderIssueDate: string;
    readTime: string;
    expectedDeliveryDate: string;
    unitPriceDdp: number;
    totalCostDdp: number;
    unitPriceCip: number;
    totalCostCip: number;
    currency: string;
    orderQuantity: number;
    receivedQuantity: number;
    receivedDate: string;
    balancedQuantity: number;
    shipmentStatus: string;
    comments: string;
  }
  
  // ✅ Item extends BaseImplementation
  export interface Implementation extends BaseImplementation {
    id: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface BaseItem {
    itemName: string;
    itemType: string;
    itemCategory: string;
    division: string;
    packSize: string;
    unitCost: number;
    plannedQuantity: number;
    totalCost: number;
    revisedQuantity: number;
    secondReview: number;
    fundingSource: string;
    plannedOrderDate: string;
    plannedDeliveryDate: string;
  }
  
  // ✅ Item extends BaseItem
  export interface Item extends BaseItem {
    id: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }
  