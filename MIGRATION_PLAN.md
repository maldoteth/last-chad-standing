# 🚀 Migration Plan: Custom Backend API → Supabase

## 📊 Current Architecture Analysis

### Custom Backend API Endpoints (to be migrated)

#### **1. Store Items** (`/api/store-item/`)
- `GET /store-item/?page={page}` - Fetch paginated store items
- `POST /store-item` - Create new store item (Admin)
- `PUT /store-item/{id}` - Update store item (Admin)
- `DELETE /store-item/{id}` - Delete store item (Admin)
- `PUT /store-item/buy/{id}` - Purchase store item
- `POST /store-item/generate-metadata` - Generate NFT metadata

#### **2. Locker Items** (`/api/locker-item/`)
- `GET /locker-item/?page={page}` - Fetch user's locker items
- `GET /locker-item/market-place/?page={page}` - Fetch marketplace listings
- `GET /locker-item/live-listing` - Fetch live listings
- `GET /locker-item/market-value` - Get market value stats
- `GET /locker-item/token` - Get NFT token details
- `PUT /locker-item/{id}` - Update locker item (list/unlist)
- `PUT /locker-item/buy/{id}` - Buy from marketplace

#### **3. User Management** (`/api/users/`)
- `GET /users` - Get current user profile
- `POST /users/login` - User login
- `PUT /users/` - Update user profile

#### **4. Admin** (`/api/admin/`)
- `POST /admin/login` - Admin login
- `PUT /admin` - Update admin settings
- `GET /admin/wallet` - Get admin wallet
- `POST /admin/wallet` - Set admin wallet

#### **5. Game Data** (`/api/`)
- `GET /level` - Fetch all levels
- `GET /ranks` - Fetch all ranks
- `GET /objective` - Fetch all objectives
- `GET /objective/user` - Fetch user's objective progress

#### **6. Notifications** (`/api/notifications/`)
- `GET /notifications` - Fetch user notifications
- `GET /notifications/count` - Get unread count
- `PUT /notifications/{id}` - Mark as read

#### **7. NFT Operations** (`/api/privy-nft/`)
- `POST /privy-nft/safe-transfer` - Transfer NFT
- `POST /privy-nft/mint` - Mint NFT

#### **8. Payment** (`/api/payment/`)
- `POST /payment/checkout-session` - Create Stripe session
- `POST /payment/crypto` - Process crypto payment

---

## 🗄️ Supabase Database Schema (Already Exists)

### ✅ Existing Tables
1. **store_items** - NFT store items
2. **Locker** - User's purchased items
3. **Users** - User profiles
4. **AdminUsers** - Admin accounts
5. **AdminWallet** - Admin wallet addresses
6. **Level** - Game levels
7. **Objective** - Game objectives
8. **ObjectiveProgress** - User objective progress
9. **Notification** - User notifications
10. **Transactions** - Payment transactions
11. **Contract_token** - NFT token tracking
12. **Contracts** - Deployed contracts
13. **Performances** - User performance/XP

---

## 📋 Migration Strategy

### **Phase 1: Database Operations (Direct Supabase)**
Replace API calls with direct Supabase queries for:
- ✅ Store items CRUD
- ✅ Locker items CRUD
- ✅ User profile management
- ✅ Notifications
- ✅ Game data (levels, ranks, objectives)

### **Phase 2: Supabase Edge Functions**
Create Edge Functions for complex operations:
- 🔄 NFT metadata generation
- 🔄 NFT minting/transfer
- 🔄 Marketplace transactions
- 🔄 Admin authentication
- ✅ Payment processing (already exists)

### **Phase 3: Remove Custom API Dependencies**
- Remove `axiosInstance.ts`
- Remove `apiFunction.ts` (useApi hook)
- Update all components to use Supabase directly

---

## 🛠️ Implementation Plan

### **Step 1: Create Supabase Helper Hook**
Create `src/hooks/useSupabase.ts` to replace `useApi()`

### **Step 2: Create Edge Functions**
1. `nft-metadata` - Generate NFT metadata
2. `nft-mint` - Mint NFTs
3. `nft-transfer` - Transfer NFTs
4. `admin-auth` - Admin authentication

### **Step 3: Migrate Components**
Priority order:
1. **High Priority:**
   - Admin.tsx (NFT creation)
   - storeData.tsx (Store context)
   - profileContext.tsx (User auth)
   
2. **Medium Priority:**
   - useMarketplace.ts (Marketplace)
   - lockerTab.tsx (User locker)
   - StorePurchaseDialog.tsx (Purchases)
   
3. **Low Priority:**
   - rankData.tsx (Game data)
   - notificationContext.tsx (Notifications)

### **Step 4: Testing**
- Test each migrated feature
- Ensure NFT operations work
- Verify marketplace transactions
- Check admin panel functionality

### **Step 5: Cleanup**
- Remove unused API files
- Update environment variables
- Remove custom backend URL

---

## 🎯 Benefits After Migration

1. ✅ **No Backend Server Needed** - Eliminates 502 errors
2. ✅ **Real-time Updates** - Supabase subscriptions
3. ✅ **Better Performance** - Edge functions globally distributed
4. ✅ **Lower Costs** - No separate backend hosting
5. ✅ **Built-in Auth** - Supabase Auth integration
6. ✅ **Automatic Scaling** - Supabase handles scaling

---

## ⚠️ Challenges & Solutions

### **Challenge 1: NFT Operations**
**Solution:** Create Supabase Edge Functions with Privy integration

### **Challenge 2: Admin Authentication**
**Solution:** Use Supabase Auth with custom claims or Edge Function

### **Challenge 3: Complex Transactions**
**Solution:** Use Supabase RPC functions or Edge Functions

### **Challenge 4: File Uploads**
**Solution:** Already using Supabase Storage (fallback implemented)

---

## 📝 Migration Checklist

### Database
- [x] Supabase tables exist
- [ ] Add missing indexes
- [ ] Add Row Level Security (RLS) policies
- [ ] Create database functions/triggers

### Edge Functions
- [x] Payment functions (existing)
- [ ] NFT metadata generation
- [ ] NFT minting
- [ ] NFT transfer
- [ ] Admin authentication

### Frontend
- [ ] Create useSupabase hook
- [ ] Migrate Admin panel
- [ ] Migrate Store context
- [ ] Migrate Profile context
- [ ] Migrate Marketplace
- [ ] Migrate Notifications
- [ ] Remove old API files

### Testing
- [ ] Test NFT creation
- [ ] Test NFT purchases
- [ ] Test marketplace
- [ ] Test admin panel
- [ ] Test user authentication
- [ ] Test notifications

---

## 🚀 Estimated Timeline

- **Phase 1 (Database):** 2-3 hours
- **Phase 2 (Edge Functions):** 4-6 hours
- **Phase 3 (Frontend Migration):** 6-8 hours
- **Phase 4 (Testing):** 2-3 hours
- **Phase 5 (Cleanup):** 1 hour

**Total:** 15-21 hours

---

## 📞 Next Steps

1. Review this plan
2. Approve migration strategy
3. Start with Phase 1 (Database operations)
4. Create Edge Functions
5. Migrate frontend components
6. Test thoroughly
7. Deploy and monitor

---

**Ready to start migration?** 🚀
