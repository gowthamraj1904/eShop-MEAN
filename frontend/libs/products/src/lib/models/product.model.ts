import { Category } from './category.model';

export class Product {
    id?: string;
    name?: string;
    description?: string;
    richDescription?: string;
    brand?: string;
    price?: number;
    image?: string;
    images?: string[];
    category?: Category;
    rating?: number;
    numReviews?: number;
    isFeatured?: boolean;
    countInStock?: number;
    dateCreated?: string;
}
