import { ROLES } from '../constants/roles'

/**
 * Centralized Role Navigation Configuration
 * Defines sidebar groups, navigation items, routes, icons, and allowed roles.
 */
export const ROLE_NAVIGATION = {
  [ROLES.BEEKEEPER]: [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard', route: '/beekeeper/dashboard', icon: '📊' },
      ],
    },
    {
      group: 'Hive Management',
      items: [
        { label: 'My Hives', route: '/hives', icon: '🐝' },
        { label: 'Hive Health & IoT', route: '/hives/health', icon: '📡' },
      ],
    },
    {
      group: 'Production',
      items: [
        { label: 'My Batches', route: '/batches', icon: '🍯' },
        { label: 'New Batch', route: '/batches/new', icon: '➕' },
      ],
    },
    {
      group: 'Marketplace & Orders',
      items: [
        { label: 'My Products', route: '/my-products', icon: '🏷️' },
        { label: 'Fulfillment Orders', route: '/beekeeper/orders', icon: '📦' },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Notifications', route: '/notifications', icon: '🔔' },
        { label: 'Profile & KVIC ID', route: '/beekeeper/profile', icon: '👤' },
      ],
    },
  ],

  [ROLES.CUSTOMER]: [
    {
      group: 'Overview',
      items: [
        { label: 'Customer Dashboard', route: '/customer/dashboard', icon: '🛒' },
      ],
    },
    {
      group: 'Shopping',
      items: [
        { label: 'Honey Marketplace', route: '/marketplace', icon: '🛍️' },
        { label: 'Cart', route: '/cart', icon: '🛍️' },
      ],
    },
    {
      group: 'Orders & Disputes',
      items: [
        { label: 'My Orders', route: '/orders', icon: '📦' },
        { label: 'My Product Reviews', route: '/my-reviews', icon: '⭐' },
        { label: 'Disputes & Support', route: '/customer/disputes', icon: '🛡️' },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Notifications', route: '/notifications', icon: '🔔' },
        { label: 'Customer Profile', route: '/customer/profile', icon: '👤' },
      ],
    },
  ],

  [ROLES.LAB]: [
    {
      group: 'Overview',
      items: [
        { label: 'Lab Dashboard', route: '/lab/dashboard', icon: '🔬' },
      ],
    },
    {
      group: 'Testing Queue',
      items: [
        { label: 'Pending Batch Tests', route: '/lab/tests/pending', icon: '🧪' },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Notifications', route: '/notifications', icon: '🔔' },
      ],
    },
  ],

  [ROLES.ADMIN]: [
    {
      group: 'Overview',
      items: [
        { label: 'Admin Dashboard', route: '/admin/dashboard', icon: '⚡' },
        { label: 'System Analytics', route: '/admin/analytics', icon: '📈' },
      ],
    },
    {
      group: 'Management',
      items: [
        { label: 'Beekeepers', route: '/admin/beekeepers', icon: '👨‍🌾' },
        { label: 'Batches & Quality', route: '/admin/batches', icon: '🍯' },
        { label: 'Hives', route: '/admin/hives', icon: '🐝' },
        { label: 'Lab Audits', route: '/admin/lab', icon: '🔬' },
      ],
    },
    {
      group: 'Governance & Risk',
      items: [
        { label: 'Verification Risk', route: '/admin/verification-risk', icon: '🛡️' },
        { label: 'Disputes Overview', route: '/admin/disputes', icon: '⚖️' },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Notifications', route: '/notifications', icon: '🔔' },
      ],
    },
  ],

  [ROLES.KVIC_OFFICER]: [
    {
      group: 'Overview',
      items: [
        { label: 'Officer Dashboard', route: '/admin/dashboard', icon: '🏛️' },
        { label: 'Regional Analytics', route: '/admin/analytics', icon: '📊' },
      ],
    },
    {
      group: 'Monitoring & Audit',
      items: [
        { label: 'Registered Beekeepers', route: '/admin/beekeepers', icon: '👨‍🌾' },
        { label: 'Batch Records', route: '/admin/batches', icon: '🍯' },
        { label: 'Hive Locations', route: '/admin/hives', icon: '📍' },
        { label: 'Lab Compliance', route: '/admin/lab', icon: '🧪' },
        { label: 'Dispute Resolutions', route: '/admin/disputes', icon: '⚖️' },
        { label: 'Verification Risk Audit', route: '/admin/verification-risk', icon: '🛡️' },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Notifications', route: '/notifications', icon: '🔔' },
      ],
    },
  ],
}

export default ROLE_NAVIGATION
