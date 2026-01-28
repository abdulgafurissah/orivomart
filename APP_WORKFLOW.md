# OrivoMart - Application Workflow

This document outlines the core workflows and user journeys within the OrivoMart multi-vendor marketplace application.

## 1. User Roles & Authentication
The platform supports four distinct user roles, each with specific permissions and dashboards. Authentication is handled via a custom session management system using encrypted cookies and a Neon (PostgreSQL) database.

*   **Buyer**: Standard user who browses and purchases products.
*   **Seller**: Vendor who manages a shop, products, and fulfills orders.
*   **Courier** (Delivery Manager): user responsible for logistics and delivery tracking.
*   **Admin**: Superuser with oversight of the entire platform.

---

## 2. Buyer Workflow (Customer)
The primary flow for customers looking to purchase items.

1.  **Browsing**:
    *   User visits home page `/`.
    *   Can search for products or filter by category.
    *   Can view specific Shops via `/sellers` to see grouped products from a single vendor.
    *   User can view product details, including description, price, and stock status.

2.  **Cart & Checkout**:
    *   User adds items to Cart (stored in local storage/context).
    *   Proceeds to Checkout.
    *   If not logged in, user is prompted to **Sign In** or **Sign Up** (`/auth/signin`, `/auth/signup-buyer`).
    *   User enters Shipping Details (Address, GPS).
    *   Payment is processed (integration with Paystack mocked/ready).

3.  **Order Tracking**:
    *   Upon successful order, a unique **Tracking ID** is generated for each item/shipment.
    *   User can visit `/track` and enter the ID to see real-time status (e.g., "Pending", "Processing", "Out for Delivery", "Delivered").
    *   Registered buyers can also view history in `/orders`.

---

## 3. Seller Workflow (Vendor)
The flow for merchants to join and sell on the platform.

1.  **Registration & KYC**:
    *   User visits `/auth/signup` to become a seller.
    *   Fills in **Shop Details** (Shop Name, Owner Name).
    *   Provides **KYC Information**:
        *   Business Registration Number.
        *   Ghana Card Number.
        *   Uploads a **Business Certificate or ID Document** (Stored in Supabase Storage).
        *   Uploads a **Shop Logo/Image**.
    *   Provides **Payout Details** (Mobile Money Number & Network).
    *   Account is created with status `pending`.

2.  **Shop Management (Dashboard)**:
    *   Seller logs in and is redirected to `/dashboard`.
    *   **Settings**: Seller customizes shop profile, updates logo, and manages contact info via `/dashboard/settings`.
    *   **Products**: Seller creates, edits, and deletes products via `/dashboard/products`. Images are uploaded to Supabase.
    *   **Orders**: Seller views new orders, changes status to "Ready for Pickup" or "Shipped".

3.  **Approval Process**:
    *   New sellers cannot sell immediately. They must be approved by an **Admin** after verifying their KYC documents.

---

## 4. Admin Workflow
The oversight flow for platform administrators.

1.  **Dashboard Overview**:
    *   Admin logs in to `/admin/dashboard`.
    *   Views high-level stats: Total Users, Total Sales, Active Sellers, Pending Approvals.

2.  **Seller Management**:
    *   Visits `/admin/sellers`.
    *   Views list of all sellers.
    *   **Verification**: Reviews KYC documents and approves or rejects `pending` sellers.
    *   Can suspend active sellers if necessary.
    *   Can delete seller accounts.

3.  **Order & Delivery Oversight**:
    *   Visits `/admin/transactions` to see global order history.
    *   Visits `/admin/delivery` to monitor dispatch status and courier performance.

---

## 5. Delivery Workflow
The logistics flow for managing shipments.

1.  **Dispatch & Assignment**:
    *   Delivery Managers (or Admins) access `/delivery/dashboard`.
    *   View all order items marked as "Ready for Pickup" by sellers.
    *   Assign orders to specific **Couriers** (Riders).

2.  **Fulfillment**:
    *   Couriers pickup items from Sellers.
    *   Status is updated to "Out for Delivery".
    *   Upon delivery to buyer, status is updated to "Delivered".

---

## Technical Architecture Overview
*   **Database**: Neon (PostgreSQL) - Stores Users, profiles, products, orders, and sessions.
*   **Auth**: Custom JWT-based session management (`src/utils/session.ts`) protected by middleware.
*   **Storage**: Supabase Storage - Used strictly for storing user-uploaded files (KYC Docs, Product Images, Shop Logos).
*   **Backend**: Next.js Server Actions - Handle all data mutations and fetching directly from the database.
*   **Styling**: Custom CSS Modules with a glassmorphism aesthetic.
