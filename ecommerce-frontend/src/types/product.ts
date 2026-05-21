export interface Product {
	id: string | number;
	name?: string;
	title?: string;
	price?: number;
	basePrice?: string;
	originalPrice?: number;
	rating: number;
	reviews?: number;
	totalReviews?: number;
	image?: string;
	images?: ProductImage[];
	category?: string;
	brand?: string;
	description?: string;
	// Support both detailed variant objects and legacy sizes/colors shape
	variants?: ProductVariant[] | { sizes?: string[]; colors?: string[] };
	relatedProducts?: string[];
	slug?: string;
	shortDescription?: string;
}

export interface ProductImage {
	id: number;
	url: string;
	isPrimary: boolean;
}

export interface ProductVariant {
	id?: number;
	sku?: string;
	price?: string;
	compareAtPrice?: string;
	stock?: number;
	color?: string;
	size?: string;
	image?: string;
	isDefault?: boolean;
}

export interface CartItem {
	productId: string;
	quantity: number;
	selectedSize?: string;
	selectedColor?: string;
}

export interface Order {
	id: string;
	date: string;
	status: "pending" | "shipped" | "delivered";
	items: CartItem[];
	total: number;
}
