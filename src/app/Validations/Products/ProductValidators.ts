import { Validators, ValidatorFn } from "@angular/forms";

export const ProductValidators = {
    productName: (): ValidatorFn[] => [
        Validators.required,
        Validators.minLength(3),
    ],
    unitPrice: (): ValidatorFn[] => [
        Validators.required,
        Validators.min(0), // Ürün fiyatı negatif olamaz
    ],
    categoryId: (): ValidatorFn[] => [
        Validators.required,
        Validators.min(1), // Kategori ID'si 1'den küçük olamaz
    ],
};
