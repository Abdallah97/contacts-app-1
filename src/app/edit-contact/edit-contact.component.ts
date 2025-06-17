import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';
import { addressValueTypes, phoneValueTypes } from '../contacts/contact.model';
import { restrictedWordsValidator } from '../validators/restricted-words.validator';
import { distinctUntilChanged, debounceTime } from 'rxjs';


@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
   phoneTypes = phoneValueTypes;
   addressTypes = addressValueTypes;
   
  contactForm = this.fb.nonNullable.group({
    id: '',
    icon:'',
    firstName: ['',[Validators.required,Validators.minLength(3)]],
    lastName: '',
    dateOfBirth: new Date() as Date | null,
    favoritesRanking: <number | null>null,
    personal:false,
    phones: this.fb.array([this.createPhoneGroup()]),
    addresses: this.fb.array([this.createAddressGroup()]),
    notes: ['',[restrictedWordsValidator(['foo', 'bar', 'baz'])]]
  });

  stringifyCompare = (a: any, b: any) => {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  subscribeToAddressChanges() {
    const addressGroup = this.contactForm.controls.addresses as FormArray;
    this.contactForm.controls.addresses.valueChanges.pipe(
      distinctUntilChanged(this.stringifyCompare)
    ).subscribe(() => {
      for(const controlName in addressGroup.controls) {
        addressGroup.get(controlName)?.addValidators([Validators.required]);
        addressGroup.get(controlName)?.updateValueAndValidity();
      }
      
    });

      this.contactForm.controls.addresses.valueChanges.pipe(
      debounceTime(2000), distinctUntilChanged(this.stringifyCompare)
    ).subscribe(() => {
      for(const controlName in addressGroup.controls) {
        addressGroup.get(controlName)?.addValidators([Validators.required]);
        addressGroup.get(controlName)?.updateValueAndValidity();
      }
      
    });
  }

  
 

  constructor(private route: ActivatedRoute,private contactService: ContactsService,private router: Router,private fb: FormBuilder) { }
    ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) {
      this.subscribeToAddressChanges();
      return;
    }
    this.contactService.getContact(contactId).subscribe(contact => {
      if(!contact) return;
      this.contactForm.controls.phones.clear();
      for(let i=0; i < contact.phones.length; i++) {
        this.addPhone();
      }
      
      this.contactForm.controls.addresses.clear();
      for(let i=0; i < contact.addresses.length; i++) {
        this.addAddress();
      }
      
      this.contactForm.setValue(contact);
      this.subscribeToAddressChanges();
      
    });
  }   get firstName() { return this.contactForm.controls.firstName as FormControl }
   get notes() { return this.contactForm.controls.notes as FormControl }
   get addresses() { return this.contactForm.controls.addresses as FormArray }

   createPhoneGroup() {
   const phoneGroup = this.fb.nonNullable.group({
      phoneNumber: '',
      phoneType: '',
      preferred: false
    });
    phoneGroup.controls.preferred.valueChanges.pipe(
      distinctUntilChanged( this.stringifyCompare)
    ).subscribe((preferred) => {
      if(preferred) phoneGroup.controls.phoneNumber.addValidators([Validators.required])
      else phoneGroup.controls.phoneNumber.removeValidators([Validators.required]);
      phoneGroup.controls.phoneNumber.updateValueAndValidity();
  }
    );
    return phoneGroup;
  }

  createAddressGroup() {
    return this.fb.nonNullable.group({
      streetAddress: ['',[Validators.required]],
      city: ['',[Validators.required]],
      state: ['',[Validators.required]],
      postalCode: ['',[Validators.required]],
      addressType: ['',[Validators.required]],
    })
  }

  saveContact() {
   this.contactService.saveContact(this.contactForm.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/contacts']);
      }
     
    });
  }
  addPhone() {
    this.contactForm.controls.phones.push(this.createPhoneGroup());
  }

  addAddress() {
    this.contactForm.controls.addresses.push(this.createAddressGroup());
  }
}
