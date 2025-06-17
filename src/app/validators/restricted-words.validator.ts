import { AbstractControl, ValidationErrors } from "@angular/forms";


export function restrictedWordsValidator(words:string[]){ 
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null; // if no value, no errors
        const invalidWords = words
        .map(w => w.toLowerCase())
        .filter(w => control.value.toLowerCase().includes(w));
        
        return invalidWords && invalidWords.length > 0 ? { restrictedWords: invalidWords.join(', ') } : null;
    }
}   