import { RouterModule, Routes } from "@angular/router";
import { ManageComponent } from "./components/manage/manage.component";

import { HotelsComponent } from "./components/hotels/hotels.component";
import { AddnewsComponent } from "./components/addnews/addnews.component";
import { ViewerComponent } from "./components/viewer/viewer.component";
import { ViewNewsComponent } from "./components/view-news/view-news.component";
import { EditComponent } from "./components/edit/edit.component";
import { ViewDetailComponent } from "./components/view-detail/view-detail.component";

const routes: Routes = [
	{
		path: '',
		pathMatch: "full",
		redirectTo: "news"
	},
	{
		path: "manage",
		component: ManageComponent,
		children: [
			{
				path: '',
				component: ViewNewsComponent
			},
			{
				path: 'addnews',
				component: AddnewsComponent
			},
			{
				path: 'editnews',
				component: EditComponent
			}
		]
	},
	{
		path: "news",
		component: ViewerComponent,
		children: [
			{
				path: '',
				component: HotelsComponent
			},
			{
				path: 'view-detail',
				component: ViewDetailComponent
			}
		]
	}

]

export const routing = RouterModule.forRoot(routes);