import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Trainer } from '../trainers/trainer';
import { Subreport } from './subreport';
import { SubreportService } from '../../services/subreport.service';
import { TrainerService } from '../../services/trainer.service';
import { SubscriptionService } from '../../services/subscription.service';



@Component({
    selector: 'app-subreport',
    templateUrl: './subreports.component.html',
    providers: [MessageService],
})
export class SubreportsComponent implements OnInit {
    expiryDate(arg0: Date) {
        // arg0.setHours(0);
        // arg0.setMinutes(0);
        // arg0.setSeconds(0);
        console.log(arg0);
        // var newDate = new Date(arg0.setMonth(arg0.getMonth()+1));
        // // var newDate = arg0.addMonths(1);
        // console.log(newDate);
        return arg0;
        throw new Error('Method not implemented.');
    }
   
    subreports: Subreport[] = [];
    subreport: Subreport = {};
    trainers: Trainer[] = [];
    selectedSubreports: Subreport[] = [];
    subreportDialog: boolean = false;
    subreportViewDialog: boolean = false;
    deleteSubreportDialog: boolean = false;
    deleteSubreportsDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    submitted: boolean = false;
    subscriptions: any[] = [];
    trainernames: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private messageService: MessageService,
        private subreportService: SubreportService,
        private subscriptionService: SubscriptionService
    ) {}

    ngOnInit() {
        this.retrieveSubreports();
        this.subscriptions = [
            { label: '1 Month', value: '1 Month' },
            { label: '3 Month', value: '3 Month' },
            { label: '6 Month', value: '6 Month' },
            { label: '12 Month', value: '12 Month' },
        ];
    }

    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.subreports);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ['data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'subreports');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(
            data,
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        );
    }
    exportPdf() {
        const doc = new jsPDF('l', 'mm', 'a4');
        autoTable(doc, { html: '#pr_id_2-table' });
        doc.save('subreports.pdf');
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

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.subreports.length; i++) {
            if (this.subreports[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
