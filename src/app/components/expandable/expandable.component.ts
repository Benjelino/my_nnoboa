import {
  Component,
  AfterViewInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";

@Component({
  selector: "app-expandable",
  templateUrl: "./expandable.component.html",
  styleUrls: ["./expandable.component.scss"],
})
export class ExpandableComponent implements AfterViewInit {
  @ViewChild("expandWrapper", { read: ElementRef }) expandWrapper: ElementRef;
  @Input("expandHeight") expandHeight: string = "150px";
  @Input("expanded")
  expanded: boolean = false;
  /**
   * The title for the accordion
   * @public
   * @property title
   * @type {string}
   */
  @Input()
  title: string;

  /**
   * The change event that will be broadcast to the parent component when the user interacts with the component's
   * <ion-button> element
   * @public
   * @property change
   * @type {EventEmitter}
   */
  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();

  constructor(public renderer: Renderer2) {}

  ngAfterViewInit() {
    this.renderer.setStyle(
      this.expandWrapper.nativeElement,
      "max-height",
      this.expandHeight
    );
  }

  expandItem(): void {
    this.expanded = !this.expanded;
  }

  /**
   * Allows the value for the  element to be broadcast to the parent component
   * @public
   * @method onChangeEmit
   * @returns {none}
   */
  public onChangeEmit(evnt: string): void {
    this.change.emit(evnt);
  }
}
