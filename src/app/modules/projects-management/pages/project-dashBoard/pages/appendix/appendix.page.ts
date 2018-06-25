import { Component, OnInit, HostBinding } from '@angular/core';
import * as html2canvas from "html2canvas"
import * as _ from "lodash"
import { ViewChild } from '@angular/core';
import { ContextMenuModule, ContextMenuComponent } from 'ngx-contextmenu';
import { Router, ActivatedRoute } from '@angular/router';
import { HostListener } from '@angular/core';
import { UtilitiesService } from '../../../../../../core/services/utilities.service';
import { ProjectsManagementService } from '../../../../projects-management.service';
import { LOCAL_MESSAGE } from '../../../../../../core/constants/message';

@Component({
  selector: 'app-appendix',
  templateUrl: './appendix.page.html',
  styleUrls: ['./appendix.page.scss'],
  host: {
    '(document:keydown)': 'handleKeyDownEvents($event)',
    '(document:keyup)': 'handleKeyUpEvents($event)'
}
})
export class AppendixPage implements OnInit {
  projectId;
  @HostBinding('class.component-content') true;

  maxSlide = 64;
  constructor(private projectsManagementService: ProjectsManagementService,
    private activatedRoute: ActivatedRoute,
    private _UtilitiesService: UtilitiesService,
    private router: Router, ) {
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
  }
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  bussinessUnitLinks = [
    {
      label: "Accounting",
      path: "./accounting",
      index: 0
    },
    {
      label: "Human Capital Grp",
      path: "./key-findings",
      index: 1
    },
    {
      label: "Legal & Compliance",
      path: "./appendix",
      index: 2
    },
    {
      label: "RSB",
      path: "./appendix",
      index: 2
    },
    {
      label: "SIB",
      path: "./appendix",
      index: 2
    },
    {
      label: "HR",
      path: "./appendix",
      index: 2
    }
  ];
  activeLinkIndex = 0;
  cy: any;

  checkRouter() {
    let splitArray = _.split(this.router.url, '/');
    let extension = splitArray[splitArray.length - 1];
    console.log(extension);  
    if (extension === "appendix") {
      this.activeLinkIndex = 2;
    } else {
      this.activeLinkIndex = 0;
    }
  }
  slides: any[] = [];
  data: any[] = [];
  currentKeyCodeSelected: boolean = false;
  listSlideSelected: any[] = [];
  totalSlide: number = this.slides.length;
  isEdit:boolean;
  selectedSlide = {
    id: null,
    name: null,
    tabs: null,
    slideStyle: null,
    isActive: false
  };
  selectedSlideDefault = _.cloneDeep(this.selectedSlide);

  charts = [
    {
      id: 1,
      name: "Recommendation from AI",
      color: "yellow",
      subTitle: "Meeting room Optimaizartion",
      image: "dash-board/chart-1.png"
    },
    {
      id: 2,
      name: "Recommendation from AI",
      color: "yellow",
      subTitle: "Meeting room Optimaizartion",
      image: "dash-board/chart-2.png"
    },
    {
      id: 3,
      name: "Workpoints Utilization",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-3.png"
    },
    {
      id: 4,
      name: "Workpoints Utilization",
      color: null,
      subTitle: "By work points",
      image: "dash-board/chart-4.png"
    },
    {
      id: 5,
      name: "Workpoints Utilization",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-5.png"
    },
    {
      id: 7,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    },
    {
      id: 8,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    },
    {
      id: 9,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    },
    {
      id: 10,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    },
    {
      id: 11,
      name: "Workpoints Utilization",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-5.png"
    },
    {
      id: 12,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    },
    {
      id: 13,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    },
    {
      id: 14,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    },
    {
      id: 15,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    },
    {
      id: 16,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    },
    {
      id: 17,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    },
    {
      id: 18,
      name: "Workpoints Utilization",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-5.png"
    },
    {
      id: 19,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    },
    {
      id: 20,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    },
    {
      id: 21,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    },
    {
      id: 22,
      name: "Activity at Observed Work Points",
      color: null,
      subTitle: "By Business Units",
      image: "dash-board/chart-6.png"
    }
  ];

  titleContent = "WORKPLACE SOLUTION REPORT";
  subTitleContent = "{Subtitle for Appendix}";
 
  ngOnInit() {
    this.getProjectDetail(this.projectId);
  }

  handleKeyDownEvents(events) {
    if (events.keyCode === 17) {
      this.currentKeyCodeSelected = true;
    }
  }

  handleKeyUpEvents(events) {
    if (events.keyCode === 17) {
      this.currentKeyCodeSelected = false;
    }
  }

  selectSlide(slide) {
    this.slides;
    if (this.currentKeyCodeSelected) {
      let index = this.listSlideSelected.findIndex(e => { return e.id === slide.id });
      if (index === -1) {
        this.listSlideSelected.push(_.cloneDeep(slide));
      } else {
        this.listSlideSelected.splice(index, 1);
      }
      this.slides;

      for (let i in this.slides) {
        let j = this.listSlideSelected.findIndex(e => { return e.id === this.slides[i].id });

        if (j > -1) {
          this.slides[i].isActive = true;
          this.listSlideSelected[j].isActive = true;
        } else {
          this.slides[i].isActive = false;
        }
      }

    } else{
      for (let i in this.slides) {
        this.slides[i].isActive = false;
      }

      slide.isActive = true;
      this.listSlideSelected = [_.cloneDeep(slide)];
    }
    
      this.selectedSlide = slide;


    this.isEdit = true;
  }

  getSelectedSlideIndex() {
  
    return this.slides.findIndex(e => { return e.id === this.selectedSlide.id });
  }

  initialSildeId = 1;

  addSlide() {
    // let id = this.slides.length + 1
    let slide = {
      id:  this.initialSildeId,
      name: "",
      tabs: [],
      slideStyle: 1,
      isActive: true
    };
    this.slides.push(slide);

    
    // this.selectedSlide = this.slides[this.slides.length - 1];
    // this.listSlideSelected = [this.selectedSlide];
    this.selectSlide(slide);
    this.initialSildeId = this.initialSildeId + 1;
  }

  deleteSlide() {
    if (!this.selectedSlide) {
      return;
    }
    let index = this.getSelectedSlideIndex();
    _.remove(this.slides, { id: this.selectedSlide.id });
    this.selectedSlide = this.slides[index] ? this.slides[index] : this.slides[index - 1];
  }

  deleteMultipleSlide() {
    this._UtilitiesService.showConfirmDialog('TO DO: Are you sure to delete these slide?', res => {
      if (res) {

        let listSlideIndex = [];

        this.slides.forEach((slide, slideIndex) => {
          let slideSelectedIndex = this.listSlideSelected.findIndex(e => { return e.id === slide.id });

          if (slideSelectedIndex > -1) {
            // this.slides.splice(i, 1);
            listSlideIndex.push(slideIndex);
            this.listSlideSelected.splice(slideSelectedIndex, 1);
          }
        });

        let countDelete = 0;
        listSlideIndex.forEach((slideIndex, index) => {
          if (index > 0) {
            slideIndex = slideIndex - 1 - countDelete;
          }

          this.slides.splice(slideIndex, 1);
          this.selectedSlide = slideIndex > 0 ? this.slides[slideIndex - 1] : this.slides.length > 0 ? this.slides[0] : this.selectedSlideDefault;
          countDelete++;
        })

        if (this.selectedSlide.id === null) {
          this.isEdit = false;
        }
      }
    })

  }

  duplicate() {
    this.selectedSlide.isActive = false;
    let srcCopy = _.cloneDeep(this.selectedSlide);

    let copy = _.cloneDeep(this.selectedSlide);
    copy.id = this.initialSildeId;
    copy.isActive = true;

    this.initialSildeId = this.initialSildeId + 1;
    this.selectedSlide = copy;
    this.listSlideSelected = [copy];

    let i = this.slides.findIndex(e => { return e.id === srcCopy.id });
    this.slides.splice(i, 0, copy);
    this.changeSlide();
}

  changeSlideTypeEvent(id) {
    this.selectedSlide.slideStyle = parseInt(id);

    if (this.selectedSlide.slideStyle == 2) {
      this.titleContent = "WORKPLACE SOLUTION REPORT";
    } else if (this.selectedSlide.slideStyle == 3) {
      this.subTitleContent = "{Subtitle for Key-Findings}";
    }
    this.changeSlide();
  }

  changeSlide() {
    setTimeout(() => {
      let innerHtml = window.document.getElementById(
        "slide_" + this.selectedSlide.slideStyle
      ).innerHTML;

      let temp = innerHtml.split('placeholder="Slide Title"');

      let temp2;
      if (temp.length > 1) {
        temp2 = temp[0] + ' value="' + this.selectedSlide.name + '" ' + temp[1];
      } else {
        temp2 = temp[0];
      }

      let slideSideElement = window.document.getElementById(
        "slide_side_" +
        this.selectedSlide.slideStyle +
        "_" +
        this.selectedSlide.id
      );
      slideSideElement.innerHTML = temp2;
    });
  }



  getProjectDetail(id) {
    return this.projectsManagementService.getProjectById(id).then(result => {
      if (result) {
        this.data = result;
      }
    }, error => {
      this._UtilitiesService
        .translateValueByKey(LOCAL_MESSAGE["93"])
        .subscribe(value => {
          this._UtilitiesService.showConfirmDeletedDialog(value, res => {
            this.router.navigate(['/projects-management']);
          });
        });
    });
  }
}
