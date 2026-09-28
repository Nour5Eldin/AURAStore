import { environment } from "../../environments/environment";

export const API = {
    BASE: environment.apiUrl,

    AUTH: {
        SYNC: `${environment.apiUrl}/auth/sync`,
        ME: `${environment.apiUrl}/auth/me`,
        PROFILE: `${environment.apiUrl}/auth/profile`,
        AVATAR: `${environment.apiUrl}/auth/avatar`,
    },

    PRODUCTS: {
        BASE: `${environment.apiUrl}/products`,
        NEW_ARRIVALS: `${environment.apiUrl}/products/new-arrivals`,
        BEST_SELLERS: `${environment.apiUrl}/products/best-sellers`,
        BY_SLUG: (slug: string) => `${environment.apiUrl}/products/${slug}`,
        RELATED: (slug: string) => `${environment.apiUrl}/products/${slug}/related`,
        REVIEWS: (productId: string) => `${environment.apiUrl}/products/${productId}/reviews`,
    },

    CATEGORIES: {
        BASE: `${environment.apiUrl}/categories`,
        WITH_SUBS: `${environment.apiUrl}/categories/with-subs`,  // single batched request
        SUBS: `${environment.apiUrl}/categories/sub`,
    },

    CART: {
        BASE: `${environment.apiUrl}/cart`,
        COUNT: `${environment.apiUrl}/cart/count`,
        ITEM: (itemId: string) => `${environment.apiUrl}/cart/${itemId}`,
        RE_ADD: (itemId: string) => `${environment.apiUrl}/cart/${itemId}/re-add`,
    },

    ORDERS: {
        BASE: `${environment.apiUrl}/orders`,
        BY_ID: (id: string) => `${environment.apiUrl}/orders/${id}`,
        CANCEL: (id: string) => `${environment.apiUrl}/orders/${id}/cancel`,
        REFUND: (id: string) => `${environment.apiUrl}/orders/${id}/refund`,
    },

    ADDRESSES: {
        BASE: `${environment.apiUrl}/addresses`,
        BY_ID: (id: string) => `${environment.apiUrl}/addresses/${id}`,
        SET_DEFAULT: (id: string) => `${environment.apiUrl}/addresses/${id}/set-default`,
    },

    TESTIMONIALS: {
        BASE: `${environment.apiUrl}/testimonials`,
    },

    CONTENT: {
        SLIDES: `${environment.apiUrl}/content/slides`,
        CAMPAIGN: `${environment.apiUrl}/content/campaign`,
    },

    ADMIN: {
        DASHBOARD: `${environment.apiUrl}/admin/dashboard`,
        PRODUCTS: `${environment.apiUrl}/admin/products`,
        PRODUCT: (id: string) => `${environment.apiUrl}/admin/products/${id}`,
        PRODUCT_TOGGLE: (id: string) => `${environment.apiUrl}/admin/products/${id}/toggle-active`,
        CATEGORIES: `${environment.apiUrl}/admin/categories`,
        CATEGORY: (id: string) => `${environment.apiUrl}/admin/categories/${id}`,
        CATEGORY_TOGGLE: (id: string) => `${environment.apiUrl}/admin/categories/${id}/toggle-active`,
        SUBCATEGORIES: `${environment.apiUrl}/admin/subcategories`,
        SUBCATEGORY: (id: string) => `${environment.apiUrl}/admin/subcategories/${id}`,
        ORDERS: `${environment.apiUrl}/admin/orders`,
        ORDER: (id: string) => `${environment.apiUrl}/admin/orders/${id}`,
        ORDER_STATUS: (id: string) => `${environment.apiUrl}/admin/orders/${id}/status`,
        ORDER_REFUND: (id: string) => `${environment.apiUrl}/admin/orders/${id}/refund`,
        TESTIMONIALS: `${environment.apiUrl}/admin/testimonials`,
        TESTIMONIAL: (id: string) => `${environment.apiUrl}/admin/testimonials/${id}`,
        REPORTS: `${environment.apiUrl}/admin/reports/sales`,
        REVIEWS: `${environment.apiUrl}/admin/reviews`,
        REVIEW: (id: string) => `${environment.apiUrl}/admin/reviews/${id}/toggle`,
        CONTENT_SLIDES: `${environment.apiUrl}/admin/content/slides`,
        CONTENT_SLIDE: (id: string) => `${environment.apiUrl}/admin/content/slides/${id}`,
        CONTENT_CAMPAIGN: `${environment.apiUrl}/admin/content/campaign`,
        USERS: `${environment.apiUrl}/admin/users`,
        USER: (id: string) => `${environment.apiUrl}/admin/users/${id}`,
    },
} as const;