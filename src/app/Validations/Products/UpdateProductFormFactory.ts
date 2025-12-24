import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProductValidators } from "./ProductValidators"; 
import { baseProductForm } from "./BaseProductFormFactory";  
import { UpdateProductRequestModel } from "../../Models/Products/UpdateProductRequestModel";

export type UpdateProductForm = FormGroup<{
    id: FormControl<number>;
    productName: FormControl<string>;
    unitPrice: FormControl<number>;
    categoryId: FormControl<number|null> ;
}>;

// UpdateProductForm oluşturuluyor
export function updateProductForm() {
    const base = baseProductForm();  // Base formdan oluşturuluyor

    // productName'e maxLength kısıtlaması ekleniyor
    base.productName.addValidators([Validators.maxLength(50)]);
    base.productName.updateValueAndValidity({ emitEvent: false });

    // unitPrice'e min kısıtlaması ekleniyor
    base.unitPrice.addValidators([Validators.min(0)]);
    base.unitPrice.updateValueAndValidity({ emitEvent: false });

    // Kategori Id'ye min 1 kısıtlaması ekleniyor
    base.categoryId.addValidators([Validators.min(1)]);
    base.categoryId.updateValueAndValidity({ emitEvent: false });

    // FormGroup oluşturuluyor
    return new FormGroup({
        id: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
        ...base
    });
}

export function toUpdateProductRequest(form: UpdateProductForm): UpdateProductRequestModel {
  return {
    id: form.controls.id.value,
    productName: form.controls.productName.value,
    unitPrice: form.controls.unitPrice.value,
    categoryId: form.controls.categoryId.value,
  };
}

// Formda
