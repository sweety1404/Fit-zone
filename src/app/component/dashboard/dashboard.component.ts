import { Component, OnInit } from '@angular/core';
import { SubreportsComponent } from '../subreports/subreports.component';
import { SubreportService } from 'src/app/services/subreport.service';
import { Subreport } from '../subreports/subreport';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { SubscriptionService } from '../../services/subscription.service';
import { MemberService } from '../../services/member.service';
import { TrainerService } from '../../services/trainer.service';


// import { Subscription } from 'rxjs';

// import { Subscription } from './subscription';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})

export class DashboardComponent implements OnInit {
    subreports: Subreport[] = [];
    subreport: Subreport = {};
    chartData: any;

    chartOptions: any;

    // subscription!: Subscription;
    subscriptions: any;
    countmembers: any;
    counttrainers: any;
    constructor(
        private subreportService: SubreportService,
        public layoutService: LayoutService,
        private subscriptionService: SubscriptionService,
        private memberService: MemberService,
        private trainerService: TrainerService,

    ) {
        // this.subscription = this.layoutService.configUpdate$.subscribe(() => {
        //     this.initChart();
        // });
    }
    ngOnInit() {
        this.initChart();
        // this.subreportService
        //     .getSubreportsSmall()
        //     .then((data) => (this.subreports = data));
        this.retrieveSubreports();
        this.retrieveMembersCount();
        this.retrieveTrainersCount();
        this.subscriptions = [
            { label: '1 Month', value: '1 Month' },
            { label: '3 Month', value: '3 Month' },
            { label: '6 Month', value: '6 Month' },
            { label: '12 Month', value: '12 Month' },
        ];
    }
    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }
    retrieveSubreports(): void {
        this.subscriptionService.getAllSubscription().subscribe(
            (data) => {
                this.subreports = data;
                console.log(data);
            },
            (error) => {
                console.log(error);
            }
        );
    }
    retrieveMembersCount(): void {
        this.memberService.count().subscribe(
            (data) => {
                this.countmembers = data.no;
                console.log(data);
            },
            (error) => {
                console.log(error);
            }
        );
    }
    retrieveTrainersCount(): void {
        this.trainerService.count().subscribe(
            (data) => {
                this.counttrainers = data.no;
                console.log(data);
            },
            (error) => {
                console.log(error);
            }
        );
    }
}
