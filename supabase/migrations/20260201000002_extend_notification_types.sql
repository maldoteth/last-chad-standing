ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'marketplace_purchase';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'marketplace_sale';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'bid_placed';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'bid_accepted';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'bid_outbid';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'bid_expired';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'bid_rejected';
