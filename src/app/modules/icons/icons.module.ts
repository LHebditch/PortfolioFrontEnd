import { NgModule } from '@angular/core';

import { FeatherModule } from 'angular-feather';
import { ArrowDown } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
  ArrowDown
};

@NgModule({
  imports: [
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }