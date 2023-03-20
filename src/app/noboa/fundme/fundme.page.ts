import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgressComponent } from '../progress/progress.component';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';


const IMAGE_DIR = 'stored-images';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-fundme',
  templateUrl: './fundme.page.html',
  styleUrls: ['./fundme.page.scss'],
})
export class FundmePage implements OnInit, AfterViewInit {
  testForm = new FormGroup({
    food: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.required),
  });

  images: LocalFile[] = [];
  file: File;
  fullName: string;
  email: string;
  imageUrl: string;
  role: string;

  teamMembers: any[] = [];

  constructor(private platform: Platform, private loadingCtrl: LoadingController) { }

  async ngOnInit() {
    this.loadFiles();
  }

  async loadFiles() {
    this.images = [];

    const loading = await this.loadingCtrl.create({
      message: 'Loading data....',
    });
    await loading.present();

    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR
    }).then(result => {
      console.log('HERE: ', result);
      this.loadFileData(result.files);
    }, async err => {
      console.log('err', err);
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      });
    }).then(b => {
      loading.dismiss();
    });
  }

  async loadFileData(fileNames: FileInfo[]) {
    for (let f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f.name}`
      console.log('READ_0', filePath)
      try {
        const readFile = await Filesystem.readFile({
          directory: Directory.Data,
          path: filePath
        });
        console.log('READ_1', readFile);
        this.images.push({
          name: f.name,
          path: filePath,
          data: `data: image/jpeg;base64,${readFile.data}`
        });
        console.log('READ_', readFile);
      } catch (err) {
        console.log('Error reading file:', err);
      }
    }
  }
  goNext(progress: ProgressComponent) {
    progress.next();
  }

  onStateChange(event) {
    console.log(event);
  }

  ngAfterViewInit() { }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });
    console.log(image);

    if (image) {
      this.saveImage(image);
    }
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data
    });
    console.log('SAVED', savedFile);

    this.loadFiles();
  }

  async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path
      });
      return file.data;
    }
    else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  startUpload(file: LocalFile) {

  }

  async deleteImage(file: LocalFile) {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: file.path
    });
    this.loadFiles();
  }

  changeListener($event): void {
    this.file = $event.target.files[0];
  }

  uploadSlideDeck() {

  }



  onFileSelected(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  addTeamMember() {
    const teamMember = {
      fullName: this.fullName,
      email: this.email,
      imageUrl: this.imageUrl,
      role: this.role,
    };
    this.teamMembers.push(teamMember);
    this.clearForm();
  }

  clearForm() {
    this.fullName = '';
    this.email = '';
    this.imageUrl = '';
    this.role = '';
  }

}
