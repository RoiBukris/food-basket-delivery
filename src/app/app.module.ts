

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RemultModule, Context, JwtSessionManager } from '@remult/core';
import { MaterialModule } from './shared/material.module';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HelpersComponent } from './helpers/helpers.component';
import { SelectPopupComponent } from './select-popup/select-popup.component';
import { DialogService } from './select-popup/dialog';
import { YesNoQuestionComponent } from './select-popup/yes-no-question/yes-no-question.component';
import { LoginComponent } from './users/login/login.component';
import { RegisterComponent } from './users/register/register.component';
import { AuthService } from './auth/auth-service';

import { InputAreaComponent } from './select-popup/input-area/input-area.component';
import { UpdateInfoComponent } from './users/update-info/update-info.component';
import { FamiliesComponent } from './families/families.component';
import { MyFamiliesComponent } from './my-families/my-families.component';
import { AsignFamilyComponent } from './asign-family/asign-family.component';
import { ManageComponent } from './manage/manage.component';
import { FamilyInfoComponent } from './family-info/family-info.component';
import { UpdateCommentComponent } from './update-comment/update-comment.component';
import { DistributionMap } from './distribution-map/distribution-map.component';
import { SelectHelperComponent } from './select-helper/select-helper.component';
import { LoginFromSmsComponent } from './login-from-sms/login-from-sms.component';
import { MapComponent } from './map/map.component';

import { DeliveryFollowUpComponent } from './delivery-follow-up/delivery-follow-up.component';
import { HelperFamiliesComponent } from './helper-families/helper-families.component';
import { SelectFamilyComponent } from './select-family/select-family.component';

import { ImportFromExcelComponent } from './import-from-excel/import-from-excel.component';

import { NewsComponent } from './news/news.component';
import { NewsFilterService } from "./news/news-filter-service";


import { SelectService } from './select-popup/select-service';
import { UpdateFamilyDialogComponent } from './update-family-dialog/update-family-dialog.component';
import { UpdateFamilyComponent } from './update-family/update-family.component';


import { AddressProblemComponent } from './address-problem/address-problem.component';
import { StressTestComponent } from './stress-test/stress-test.component';
import { SelfPickupComponent } from './self-pickup/self-pickup.component';
import { BatchOperationsComponent } from './batch-operations/batch-operations.component';
import { DeliveryHistoryComponent } from './delivery-history/delivery-history.component';
import { PreviewFamilyComponent } from './preview-family/preview-family.component';
import { FamilyInListComponent } from './family-in-list/family-in-list.component';

import { UpdateGroupDialogComponent } from './update-group-dialog/update-group-dialog.component';
import { CreateBackupExcelFileComponent } from './create-backup-excel-file/create-backup-excel-file.component';
import { QuickAddFamilyComponent } from './quick-add-family/quick-add-family.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { TranslatePipe } from './translate';
import { SelectCompanyComponent } from './select-company/select-company.component';
import { HelperAssignmentComponent } from './helper-assignment/helper-assignment.component';
import { ImportHelpersFromExcelComponent } from './import-helpers-from-excel/import-helpers-from-excel.component';
import { PlaybackComponent } from './playback/playback.component';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../environments/environment';
import { Sites } from './sites/sites';
import { ApplicationSettings } from './manage/ApplicationSettings';

var site = Sites.initOnBrowserAndReturnAngularBaseHref();





@NgModule({
  declarations: [
    AppComponent,
    HelpersComponent,
    SelectPopupComponent,
    YesNoQuestionComponent,
    LoginComponent,
    RegisterComponent,
    InputAreaComponent,
    UpdateInfoComponent,
    FamiliesComponent,
    MyFamiliesComponent,
    AsignFamilyComponent,
    ManageComponent,
    FamilyInfoComponent,
    UpdateCommentComponent,
    DistributionMap,
    SelectHelperComponent,
    LoginFromSmsComponent,
    MapComponent,

    DeliveryFollowUpComponent,
    HelperFamiliesComponent,
    SelectFamilyComponent,
    ImportFromExcelComponent,
    NewsComponent,
    UpdateFamilyDialogComponent,
    UpdateFamilyComponent,


    AddressProblemComponent,
    StressTestComponent,
    SelfPickupComponent,
    BatchOperationsComponent,
    DeliveryHistoryComponent,
    PreviewFamilyComponent,
    FamilyInListComponent,
    UpdateGroupDialogComponent,
    CreateBackupExcelFileComponent,
    QuickAddFamilyComponent,
    TranslatePipe,
    SelectCompanyComponent,
    HelperAssignmentComponent,
    ImportHelpersFromExcelComponent,
    PlaybackComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    BrowserAnimationsModule,
    RemultModule,
    AppRoutingModule,
    ChartsModule,
    ScrollDispatchModule

  ],
  providers: [
    DialogService,
    SelectService,
    TranslatePipe,
    NewsFilterService,
    AuthService,
    {
      provide: APP_BASE_HREF, useFactory: () => {
        return '/' + site;
      }

    }
    ,
    {
      provide: APP_INITIALIZER,
      deps: [Context,JwtSessionManager],
      useFactory: initApp,
      multi: true
    }

  ],

  bootstrap: [AppComponent],
  entryComponents: [SelectHelperComponent,
    SelectFamilyComponent,
    SelectPopupComponent,
    YesNoQuestionComponent,
    InputAreaComponent,
    UpdateFamilyDialogComponent, PreviewFamilyComponent,
    SelectCompanyComponent,
    QuickAddFamilyComponent, HelperAssignmentComponent,
    UpdateCommentComponent, UpdateGroupDialogComponent]
})
export class AppModule { }

export function initApp(context: Context,session:JwtSessionManager) {
  return async () => {
    session.loadSessionFromCookie();
    console.log(context.user);
    try {
      let settings = await ApplicationSettings.getAsync(context);
    }
    catch{
      console.error('failed to get settings');
    }
    return '';

  };
}