import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as html2canvas from "html2canvas"
import * as Quill from "quill";
import * as _ from "lodash";
@Component({
  selector: 'slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent implements OnInit {
  slideForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.slideForm = fb.group({
      'name': [null,]
    });
  }
  @Output() update: EventEmitter<any> = new EventEmitter();
  @Input() slide: any;

  selectedTabIndex: Number;
  onDragging = false;
  quills: any = [];
  maxTitle = 100;
  isEdit = false;
  currentValue = '';

  quillOption = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'color': [] }, { 'background': [] }]          // dropdown with defaults from theme
    ]
  };

  ngOnInit() {
  }

  /**
   * swap tab position
   * @param from :number
   * @param to :number
   */
  swapTab(from, to) {
    let tmp = _.cloneDeep(this.slide.tabs[from]);
    this.slide.tabs[from] = _.cloneDeep(this.slide.tabs[to]);
    this.slide.tabs[to] = tmp;
  }

  /**
   * drop on tab handle
   * @param  $event: DOM model
   */
  onDropHandle($event: any) {
    let targetId = $event.nativeEvent.currentTarget.id,
      targetTabIdx = Number(targetId.split('-')[1]);
    if (_.isNumber($event.dragData)) { // swap tab position
      if (targetTabIdx !== $event.dragData) {
        this.swapTab($event.dragData, targetTabIdx);
      } else if (this.slide.tabs[$event.dragData].type === 'text-editor') {
        let tmp = _.cloneDeep(this.slide.tabs[$event.dragData]);
        this.slide.tabs[$event.dragData] = undefined;
        setTimeout(() => {
          this.slide.tabs[$event.dragData] = tmp;
        });
      }
      this.onDragging = false;
    } else {
      this.slide.tabs[targetTabIdx] = _.cloneDeep($event.dragData); // add new tab
    }

    setTimeout(() => {
      this.cleanBorderDnD();

      if (this.slide.tabs[targetTabIdx].type === 'text-editor') {
        this.buildTabImage(targetTabIdx);
      } else {
        this.slide.tabs[targetTabIdx].imageUrl = 'assets/' + this.slide.tabs[targetTabIdx].image;
      }

      this.update.emit('update');
    });

    // if (this.slide.tabs[targetTabIdx].type === 'text-editor') {
    //   setTimeout(() => {
    //     var container = document.querySelector('#tab-' + targetTabIdx + ' .ws-editor');
    //     var quill = new Quill(container, { modules: this.quillOption, theme: 'snow' });
    //     this.quills[targetTabIdx] = quill;
    // }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let propName in changes) {
      let changedProp = changes[propName];
      let to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        log.push(`Initial value of ${propName} set to ${to}`);
      } else {
        let from = JSON.stringify(changedProp.previousValue);
        log.push(`${propName} changed from ${from} to ${to}`);
        if (propName === 'slideModel') {
          this.slide = changedProp.currentValue;
        }
      }
    }
  }

  /**
   * can drag tab ?
   * @param i :number
   */
  enableDrag(i) {
    return this.slide.tabs[i] && !_.isEmpty(this.slide.tabs[i]);
  }

  /**
   * delete tab handle
   * @param i : number
   */
  deleteTab(i) {
    if (this.slide.tabs[i]) {
      this.slide.tabs[i] = undefined;
    }
    this.selectedTabIndex = undefined;
    this.onDragging = false;

    this.cleanBorderDnD();
    // setTimeout(() => {
    //   this.update.emit([]);
    // }, 100);
  }

  /**
   * on drag tab start handle
   * @param i : number
   */
  onDragStart(i) {
    this.onDragging = true;
    this.selectedTabIndex = i;
  }

  /**
   * on drag tab end handle
   * @param i : number
   */
  onDragEnd(i) {
    this.onDragging = false;
    this.selectedTabIndex = undefined;
  }

  dragHandle(i) {
    return this.enableDrag(i) ? '.ql-toolbar' : undefined;
  }

  /**
   * drag image handle
   * @param i : number
   */
  dragImage(i) {
    if (this.enableDrag(i) && this.slide.tabs[i].type === 'text-editor') {
      return 'assets/dash-board/text-editor.png';
    }
    return '';
  }

  onSelectionChanged($event) {
    if (!$event || !$event.range) {
      // this.update.emit([]);
      let editorId = $event.editor.container.parentNode.id,
        tabIndex = editorId.split('-')[1];
      this.buildTabImage(tabIndex);
    }
  }

  /**
   * remove class 'on-drag-border' in case library not handle it
   */
  cleanBorderDnD() {
    $('.slide-content-item').removeClass('on-drag-border drag-hint-border drag-over-border');
  }

  /**
   * handle when iframe loaded
   * @param i : number
   */
  onloadIframe(i) {
    this.buildTabImage(i);
  }

  /**
   * build tab image for slide review
   * @param index : number
   */
  buildTabImage(index: number) {
    let htmlEle, tabId = '#tab-' + index;
    if (this.slide.tabs[index].type === 'text-editor') {
      htmlEle = $(tabId)[0] as HTMLElement;
    } else {
      htmlEle = $(tabId + ' iframe').contents().find('body')[0] as HTMLElement;
    }
    if (!htmlEle) {
      return;
    }
    html2canvas(htmlEle).then((canvas) => {
      this.slide.tabs[index].imageUrl = canvas.toDataURL("image/png");
      // window.open(this.slide.tabs[index].imageUrl);
    });
  }

  changeSlideTitle(event) {
    // console.log(event, this.slide);
    // event.preventDefault();
    event.stopPropagation();

    // slide.name = event.target.value;

    this.update.emit('update');
  }
  cancel(edit){
    this.slide.name = this.currentValue;
    this.isEdit = edit?false:true;
  }
  edit(edit){
    this.currentValue = this.slide.name;
    this.isEdit = edit?false:true;
  }
}
