import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { IonContent } from '@ionic/angular';
import { ToastComponent } from "src/app/components/toastComponent";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { Category } from "../services/models/category.model";
import { QaaForumService } from "../services/qaaforum.service";

@Component({
    selector: "app-category",
    templateUrl: "./category.page.html",
    styleUrls: ["./category.page.scss"],
})
export class CategoryPage implements OnInit {

    @ViewChild("content", { static: true }) content: IonContent;
    userForm: UntypedFormGroup;
    categories: Category[];
    category: Category;
    isLoggedIn = false;
    errorOccurred = false;
    categoryLoaded = false;
    categorySaved = false;
    userId: string;
    apiKey: string;
    categoryId: string;
    isEditMode = false;
    showForm = false;

    constructor(
        private auth: AuthenticationService,
        private qaService: QaaForumService,
        private toast: ToastComponent,
        public fb: UntypedFormBuilder
    ) {
        this.userForm = fb.group({
            title: ["", Validators.compose([Validators.required])],
            description: ["", Validators.compose([Validators.required])],
            color: ["", Validators.compose([Validators.required])],
            tags: ["", Validators.compose([Validators.required])],
        });
    }

    validationMessages = {
        title: [{ type: "required", message: "Title is Required." }],
        description: [{ type: "required", message: "Description is Required" }],
        color: [{ type: "required", message: "Color is Required" }],
        tags: [{ type: "required", message: "Tags is Required" }],
    };

    ngOnInit() {
        this.showForm = false;
        this.isEditMode = false;
        this.isLoggedIn = this.auth.isAuthenticated();
        if (this.isLoggedIn == true) {
            this.userId = this.auth.getUserLogin().userId;
            this.apiKey = this.auth.getUserLogin().apikey;
        }

        this.qaService.getCategories(this.apiKey).subscribe(
            (data) => {

                if (data.httpStatus == "200") {
                    this.errorOccurred = false;
                  } else {
                    this.errorOccurred = true;
                    return;
                  }

                this.categoryLoaded = false;
                this.categories = data.Categories;
                this.categoryLoaded = true;
            },
            (err) => {
                this.categoryLoaded = false;
                this.toast.presentFailedToast("Error Occured , Please try again !!!");
            }
        );
    }

    addNew(){
        this.openForm();
        this.isEditMode =false;
        this.userForm.reset();
    }

    openForm() {
        this.showForm = true;
        
        setTimeout(() => {  this.content.scrollToBottom(1500); }, 550);
     
    }

    closeForm() {
        this.showForm = false;
        this.userForm.reset();
      
    }

    editCategory(categoryId: string) {
     this.openForm()
        this.isEditMode = true;
        this.categoryId = categoryId;

        const selectedObj = this.categories.find(
            (item) => item.catId === categoryId
        );

        if (selectedObj != undefined || selectedObj != null) {
            this.userForm.patchValue({
                title: selectedObj.title,
                description: selectedObj.description,
                color: selectedObj.color,
                tags: selectedObj.tags
            });
        }
    }

    storeCategory(value: any) {
       
        let title = value.title;
        let slug = this.qaService.slugify(title);

        if (this.isEditMode == false) {
            this.categoryId = "";
        }
        const cat: Category = {
            catId: this.categoryId,
            color: value.color,
            description: encodeURIComponent(value.description),
            title: encodeURIComponent(title),
            slug: encodeURIComponent(slug),
            tags: value.tags
        };
        this.categorySaved = false;
        this.qaService.storeCategory(cat, this.apiKey).subscribe(
            (data) => {
              
                this.userForm.reset();
                this.categorySaved = true;
                this.isEditMode = false;
                this.showForm = false;
                if(this.isEditMode ==false){
                  this.categories.push(cat);
                }       
                this.toast.presentSuccessToast("Comment Saved Successfuly");
            },
            (err) => {             
                this.toast.presentFailedToast("Server Error | " + JSON.stringify(err));
            }
        );
    }

}
