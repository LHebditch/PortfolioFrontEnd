import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsModule } from './modules/icons/icons.module';
import { HomeComponent } from './views/home/home.component';
import { InfoSectionComponent } from './views/home/info-section/info-section.component';
import { AboutComponent } from './views/home/sections/about/about.component';
import { ProjectsComponent } from './views/home/sections/projects/projects.component';
import { SkillsComponent } from './views/home/sections/skills/skills.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InfoSectionComponent,
    AboutComponent,
    ProjectsComponent,
    SkillsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
