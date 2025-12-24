import { FormControl } from "@angular/forms";
import { ProductValidators } from "./ProductValidators";  // Daha önce oluşturduğumuz ProductValidators

export type BaseProductForm = {
    productName: FormControl<string>;
    unitPrice: FormControl<number>;
    categoryId: FormControl<number | null>;
};

export function baseProductForm(): BaseProductForm {
    return {
        productName: new FormControl<string>('', {
            nonNullable: true,
            validators: ProductValidators.productName()
        }),

        unitPrice: new FormControl<number>(0, {
            nonNullable: true,
            validators: ProductValidators.unitPrice()
        }),

        categoryId: new FormControl<number>(0, {
            nonNullable: true,
            validators: ProductValidators.categoryId()
        }),
    };
}
