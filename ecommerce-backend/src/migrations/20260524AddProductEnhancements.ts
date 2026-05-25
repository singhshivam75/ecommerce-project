import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductEnhancements20260524 implements MigrationInterface {
    name = 'AddProductEnhancements20260524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stock_status_enum') THEN CREATE TYPE "stock_status_enum" AS ENUM ('in_stock','low_stock','out_of_stock','pre_order'); END IF; END$$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'image_type_enum') THEN CREATE TYPE "image_type_enum" AS ENUM ('thumbnail','gallery','banner','zoom'); END IF; END$$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discount_type_enum') THEN CREATE TYPE "discount_type_enum" AS ENUM ('percentage','fixed'); END IF; END$$;`);

        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "tags" text[] DEFAULT '{}'::text[];`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "metaKeywords" text[] DEFAULT '{}'::text[];`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "searchKeywords" text[] DEFAULT '{}'::text[];`);

        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "discountType" discount_type_enum;`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "discountValue" numeric(10,2);`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "saleStartDate" timestamptz;`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "saleEndDate" timestamptz;`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "videoUrl" text;`);

        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "viewCount" integer DEFAULT 0;`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "soldCount" integer DEFAULT 0;`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "isNewArrival" boolean DEFAULT false;`);

        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "weight" numeric(10,3);`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "length" numeric(10,3);`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "width" numeric(10,3);`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "height" numeric(10,3);`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "shippingClass" text;`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "warranty" text;`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "returnPolicy" text;`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "countryOfOrigin" text;`);

        /** Product variant changes */
        await queryRunner.query(`ALTER TABLE "product_variant" ADD COLUMN IF NOT EXISTS "attributes" jsonb DEFAULT '{}'::jsonb;`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD COLUMN IF NOT EXISTS "reservedStock" integer DEFAULT 0;`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD COLUMN IF NOT EXISTS "thumbnail" text;`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD COLUMN IF NOT EXISTS "galleryUrls" text[] DEFAULT '{}'::text[];`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD COLUMN IF NOT EXISTS "barcode" text;`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD COLUMN IF NOT EXISTS "costPrice" numeric(10,2);`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD COLUMN IF NOT EXISTS "lowStockThreshold" integer DEFAULT 5;`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD COLUMN IF NOT EXISTS "allowBackOrder" boolean DEFAULT false;`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD COLUMN IF NOT EXISTS "trackInventory" boolean DEFAULT true;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stock_status_enum') THEN CREATE TYPE "stock_status_enum" AS ENUM ('in_stock','low_stock','out_of_stock','pre_order'); END IF; END$$;`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD COLUMN IF NOT EXISTS "stockStatus" stock_status_enum DEFAULT 'in_stock';`);

        /** Product image changes */
        await queryRunner.query(`ALTER TABLE "product_image" ADD COLUMN IF NOT EXISTS "imageType" image_type_enum DEFAULT 'gallery';`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD COLUMN IF NOT EXISTS "altText" text;`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD COLUMN IF NOT EXISTS "width" integer;`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD COLUMN IF NOT EXISTS "height" integer;`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD COLUMN IF NOT EXISTS "fileSize" integer;`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD COLUMN IF NOT EXISTS "mimeType" text;`);

        /** Product specification changes */
        await queryRunner.query(`ALTER TABLE "product_specification" ADD COLUMN IF NOT EXISTS "group" text;`);
        await queryRunner.query(`ALTER TABLE "product_specification" ADD COLUMN IF NOT EXISTS "sortOrder" integer DEFAULT 0;`);
        await queryRunner.query(`ALTER TABLE "product_specification" ADD COLUMN IF NOT EXISTS "isHighlighted" boolean DEFAULT false;`);

        /** New tables: product_faq */
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "product_faq" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "productId" uuid REFERENCES "product"(id) ON DELETE CASCADE,
          "question" text NOT NULL,
          "answer" text NOT NULL,
          "sortOrder" integer DEFAULT 0
        );`);

        /** New table: product_slug_history */
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "product_slug_history" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "productId" uuid REFERENCES "product"(id) ON DELETE CASCADE,
          "oldSlug" text NOT NULL,
          "recordedAt" timestamptz DEFAULT NOW()
        );`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "idx_product_slug_history_oldslug_unique" ON "product_slug_history" ("oldSlug");`);

        /** Join tables for related/upsell/cross-sell */
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "product_related_products" (
          "productId" uuid NOT NULL,
          "relatedProductId" uuid NOT NULL,
          PRIMARY KEY ("productId","relatedProductId"),
          FOREIGN KEY ("productId") REFERENCES "product"(id) ON DELETE CASCADE,
          FOREIGN KEY ("relatedProductId") REFERENCES "product"(id) ON DELETE CASCADE
        );`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "product_upsell_products" (
          "productId" uuid NOT NULL,
          "upsellProductId" uuid NOT NULL,
          PRIMARY KEY ("productId","upsellProductId"),
          FOREIGN KEY ("productId") REFERENCES "product"(id) ON DELETE CASCADE,
          FOREIGN KEY ("upsellProductId") REFERENCES "product"(id) ON DELETE CASCADE
        );`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "product_crosssell_products" (
          "productId" uuid NOT NULL,
          "crossSellProductId" uuid NOT NULL,
          PRIMARY KEY ("productId","crossSellProductId"),
          FOREIGN KEY ("productId") REFERENCES "product"(id) ON DELETE CASCADE,
          FOREIGN KEY ("crossSellProductId") REFERENCES "product"(id) ON DELETE CASCADE
        );`);

        /** Indexes */
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_product_tags_gin" ON "product" USING GIN ("tags");`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_product_searchkeywords_gin" ON "product" USING GIN ("searchKeywords");`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_product_metakeywords_gin" ON "product" USING GIN ("metaKeywords");`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_productvariant_attributes_gin" ON "product_variant" USING GIN ("attributes");`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "idx_product_variant_barcode_unique" ON "product_variant" ("barcode") WHERE "barcode" IS NOT NULL;`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_product_status" ON "product" ("status");`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_product_isFeatured" ON "product" ("isFeatured");`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_product_isNewArrival" ON "product" ("isNewArrival");`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_product_image_imageType" ON "product_image" ("imageType");`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_image_imageType";`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_isNewArrival";`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_isFeatured";`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_status";`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_variant_barcode_unique";`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_productvariant_attributes_gin";`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_metakeywords_gin";`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_searchkeywords_gin";`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_tags_gin";`);

        await queryRunner.query(`DROP TABLE IF EXISTS "product_crosssell_products";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product_upsell_products";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product_related_products";`);

        await queryRunner.query(`DROP TABLE IF EXISTS "product_slug_history";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product_faq";`);

        await queryRunner.query(`ALTER TABLE "product_specification" DROP COLUMN IF EXISTS "isHighlighted";`);
        await queryRunner.query(`ALTER TABLE "product_specification" DROP COLUMN IF EXISTS "sortOrder";`);
        await queryRunner.query(`ALTER TABLE "product_specification" DROP COLUMN IF EXISTS "group";`);

        await queryRunner.query(`ALTER TABLE "product_image" DROP COLUMN IF EXISTS "mimeType";`);
        await queryRunner.query(`ALTER TABLE "product_image" DROP COLUMN IF EXISTS "fileSize";`);
        await queryRunner.query(`ALTER TABLE "product_image" DROP COLUMN IF EXISTS "height";`);
        await queryRunner.query(`ALTER TABLE "product_image" DROP COLUMN IF EXISTS "width";`);
        await queryRunner.query(`ALTER TABLE "product_image" DROP COLUMN IF EXISTS "altText";`);
        await queryRunner.query(`ALTER TABLE "product_image" DROP COLUMN IF EXISTS "imageType";`);

        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN IF EXISTS "stockStatus";`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN IF EXISTS "trackInventory";`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN IF EXISTS "allowBackOrder";`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN IF EXISTS "lowStockThreshold";`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN IF EXISTS "costPrice";`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN IF EXISTS "barcode";`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN IF EXISTS "galleryUrls";`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN IF EXISTS "thumbnail";`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN IF EXISTS "reservedStock";`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN IF EXISTS "attributes";`);

        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "countryOfOrigin";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "returnPolicy";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "warranty";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "shippingClass";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "height";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "width";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "length";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "weight";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "isNewArrival";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "soldCount";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "viewCount";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "videoUrl";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "saleEndDate";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "saleStartDate";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "discountValue";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "discountType";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "searchKeywords";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "metaKeywords";`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "tags";`);

        await queryRunner.query(`DROP TYPE IF EXISTS "image_type_enum";`);
        await queryRunner.query(`DROP TYPE IF EXISTS "stock_status_enum";`);
        await queryRunner.query(`DROP TYPE IF EXISTS "discount_type_enum";`);

        await queryRunner.query(`DROP EXTENSION IF EXISTS pgcrypto;`);
    }
}
