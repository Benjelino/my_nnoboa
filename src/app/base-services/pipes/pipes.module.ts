import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";

import { NgMathPipesModule, NgFloorPipeModule } from "angular-pipes";
import { FloorPipe } from "angular-pipes";

import { TimeDifferencePipe } from "./time-difference.pipe";
import { TimeAgoPipe } from "./time-ago.pipe";
import { TruncateTextPipe } from "./truncate-text.pipe";
import { HighlightPipe } from "./highlight.pipe";

@NgModule({
    imports: [CommonModule, IonicModule, NgMathPipesModule, NgFloorPipeModule],
    declarations: [
        TimeDifferencePipe,
        TimeAgoPipe,
        TruncateTextPipe,
        HighlightPipe,
    ],
    exports: [
        TimeDifferencePipe,
        TimeAgoPipe,
        TruncateTextPipe,
        HighlightPipe,
    ]
})
export class PipesModule {}
