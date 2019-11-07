import { Component, OnInit, Input } from '@angular/core';
import { DataAreaSettings, ColumnCollection, FilterHelper, GridSettings, ColumnSetting } from 'radweb';
import { Families } from '../families/families';
import { Helpers } from '../helpers/helpers';
import { SelectService } from '../select-popup/select-service';
import { BasketType } from '../families/BasketType';
import { FamilySources } from '../families/FamilySources';
import { Context } from 'radweb';
import { FamilyDeliveries } from '../families/FamilyDeliveries'; 
import { DialogService } from '../select-popup/dialog';
import { DeliveryStatus } from '../families/DeliveryStatus';

@Component({
  selector: 'app-update-family',
  templateUrl: './update-family.component.html',
  styleUrls: ['./update-family.component.scss']
})
export class UpdateFamilyComponent implements OnInit {
  constructor(private selectService: SelectService, private context: Context, private dialog: DialogService) { }
  @Input() families: GridSettings<Families>;
  @Input() familyDeliveries: FamilyDeliveries[];

  
  familiesInfo: DataAreaSettings<Families>;
  familiesAddress: DataAreaSettings<Families>;
  phones: DataAreaSettings<Families>;
  callInfo: DataAreaSettings<Families>;
  deliverInfo: DataAreaSettings<Families>;
  ngOnInit() {
    
    this.familiesInfo = this.families.addArea({
      columnSettings: families => [
        families.name,
        [
          families.basketType.getColumn(),
          families.familyMembers
        ],
        families.internalComment,
        families.familySource.getColumn(),
        families.socialWorker,
        [
        families.socialWorkerPhone1.getColumn(),
        families.socialWorkerPhone2.getColumn()
        ],[
        families.tz,
        families.tz2],
        families.iDinExcel
      ],
    });
    this.familiesAddress = this.families.addArea({
      columnSettings: families => [
        
        families.address,
        [
          families.floor,
        families.appartment,
        families.entrance
        ],
        families.addressComment,
        families.addressByGoogle(),
        families.city,
        families.addressOk,
        families.postalCode

      ]
    });
   
    this.phones = this.families.addArea({
      columnSettings: families => [
        [
        families.phone1.getColumn(),
        families.phone1Description],
        [families.phone2.getColumn(),
        families.phone2Description]
      ]
    });

    this.deliverInfo = this.families.addArea({
      columnSettings: families =>{ 
        
        let r = [
        families.deliverStatus.getColumn(),
        families.internalComment,
        families.deliveryComments,
        families.addressComment,
        families.groups.getColumn(this.selectService),
        families.special.getColumn(),
        
        families.courier.getColumn(this.selectService),
        
        families.courierComments,
        families.needsWork,

        families.defaultSelfPickup,
        families.fixedCourier.getColumn(this.selectService)
      ];
      if (!DeliveryStatus.usingSelfPickupModule)
        r = r.filter(x=>x!=families.defaultSelfPickup);
      return r;
    }
    });
  }
  deliveryInfo(fd: FamilyDeliveries) {
    let columns: ColumnSetting<any>[] =
      [
        fd.deliverStatus.getColumn(),
        fd.deliveryStatusDate,
        fd.courier.getColumn(this.selectService),
        fd.courierComments,
        fd.courierAssingTime,
        fd.deliveryStatusUser.getColumn(this.selectService),
        fd.courierAssignUser.getColumn(this.selectService)
      ];
    for (const c of columns) {
      c.readonly = true;
    }



    this.dialog.displayArea({
      title: 'פרטי משלוח',
      settings: {
        columnSettings: () => columns
      },
      ok: () => { },
      buttons: [{
        text: 'מחקי', click: close => {
          this.dialog.confirmDelete('פרטי משלוח זה', () => {
            fd.delete();
            this.familyDeliveries.splice(this.familyDeliveries.indexOf(fd), 0);
            close();
          });
        }
      }]
    });
  }


}
