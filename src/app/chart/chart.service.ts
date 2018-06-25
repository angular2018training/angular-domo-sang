import { Injectable } from "@angular/core";
import { CommonService } from "../shared/services/common.service";

@Injectable()
export class ChartService extends CommonService {

    public getChartData(url, body) {
        return this.handleRequest(() => this.postRequest(url, body));
    }

}
