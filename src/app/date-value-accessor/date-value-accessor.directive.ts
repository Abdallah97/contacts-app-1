import { Directive, ElementRef, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const DATE_VALUE_PROVIDER = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateValueAccessorDirective),
  multi: true
};

@Directive({
  selector: 'input[type="date"] [formControlName],input[type="date"] [formControl], input[type="date"] [ngModel]',
  providers: [DATE_VALUE_PROVIDER]
})
export class DateValueAccessorDirective implements ControlValueAccessor {

  @HostListener('change', ['$event.target.value'])
  private onChange!:Function;

  @HostListener('blur', ['$event.target.valueAsDate'])
  private onTouched!:Function;

  registerOnChange(fn: any): void {
    this.onChange = (valueAsDate:Date) => fn(valueAsDate);
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


  constructor(private elementRef: ElementRef) {  }
  writeValue(value: any): void {
    if(value instanceof Date) {
      this.elementRef.nativeElement.value = value.toISOString().split('T')[0]; 
    }
    else if (typeof value === 'string') {
      this.elementRef.nativeElement.value = value;
    }
    else {
      this.elementRef.nativeElement.value = '';
    }
  }

}
