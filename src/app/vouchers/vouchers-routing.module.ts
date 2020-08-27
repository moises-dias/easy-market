import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VouchersPage } from './vouchers.page';

const routes: Routes = [
  {
    path: '',
    component: VouchersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VouchersPageRoutingModule {}
