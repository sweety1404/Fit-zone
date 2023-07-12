import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MemberService } from '../../services/member.service';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Member } from '../members/member';
import { Subscription } from './subscription';
import { SubscriptionService } from '../../services/subscription.service';


@Component({
    templateUrl: './subscription.component.html',
    providers: [MessageService],
})
export class SubscriptionComponent implements OnInit {
    subscriptions: Subscription[] = [];
    subscription: Subscription = {};
    members: Member[] = [];
    member: Member = {};
    selectedSubscriptions: Subscription[] = [];
    subscriptionDialog: boolean = false;
    deleteSubscriptionDialog: boolean = false;
    deleteSubscriptionsDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    submitted: boolean = false;
    plans: any[]=[];
    prices: any[]=[];
    rowsPerPageOptions = [5, 10, 20];
    subscribeDialogBox: boolean=false;

    constructor(
        private messageService: MessageService,
        private subscriptionService: SubscriptionService,
        private memberService: MemberService
    ) {}

    ngOnInit() {
        this.retrieveSubscriptions();
        this.retrieveMembers();
        this.plans = [
            { label: '1 Month', value: '1' },
            { label: '3 Months', value: '3' },
            { label: '6 Months', value: '6' },
            { label: '12 Months', value: '12' },
        ];
        this.prices = [
            { label: 'ABC', value: 'A' },
            { label: 'MNO', value: 'B' },
            { label: 'XYZ', value: 'C' },
        ];
    }
    retrieveMembers(): void {
        this.memberService.getAll().subscribe(
            (data) => {
                this.members = data;
                console.log(data);
            },
            (error) => {
                console.log(error);
            }
        );
    }
    
    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.subscriptions);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ['data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'trainers');
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
        doc.save('trainers.pdf');
    }
    retrieveSubscriptions(): void {
        this.subscriptionService.getAll().subscribe(
            (data) => {
                this.subscriptions = data;
            },
            (error) => {
                console.log(error);
            }
        );
    }
    saveSubscription() {
        this.submitted = true;

        if (
                this.subscription.plan?.trim()&&
                this.subscription.mid?.trim()
                

        ){
            console.log(this.subscription.mid);
            
                this.subscriptionService.create(this.subscription).subscribe(
                    (response) => {
                        console.log(response);
                        this.submitted = true;
                        this.ngOnInit();
                    },
                    (error) => {
                        console.log(error);
                    }
                );

                this.submitted = true;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Subscription Successfully Registered',
                    life: 3000,
                });
            }

            this.subscriptionDialog = false;
            this.subscription = {};
        
    }

    openNew() {
        this.subscription = {};
        this.submitted = false;
        this.subscriptionDialog = true;
    }

    deleteSelectedSubscriptions() {
        this.deleteSubscriptionsDialog = true;
    }
    editSubscription(subscription: Subscription) {
        this.subscription = { ...subscription };
        this.subscriptionDialog = true;
    }

    deleteSubscription(subscription: Subscription) {
        this.deleteSubscriptionDialog = true;
        this.subscription = { ...subscription };
    }

    confirmDeleteSelected() {
        this.deleteSubscriptionsDialog = false;
        this.subscriptions = this.subscriptions.filter(
            (val) => !this.selectedSubscriptions.includes(val)
        );
        // console.log(this.selectedsubscriptions);
        this.selectedSubscriptions.map((data) => {
            this.subscriptionService.delete(data.id).subscribe(
                (response) => {
                    console.log(response);
                    this.ngOnInit();
                },
                (error) => {
                    console.log(error);
                }
            );
        });

        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: this.selectedSubscriptions.length + ' Subscriptions(s) Deleted',
            life: 3000,
        });
        this.selectedSubscriptions = [];
    }
    subscribeMember(member: Member) {
        this.subscribeDialogBox = true;
        this.member = { ...member };
    }
    subscribeMembership() {
        this.subscribeDialogBox = false;
        this.subscription.memberId=this.member.id;
        console.log(this.member.id);
        console.log(this.subscription);
        this.subscriptionService.create(this.subscription).subscribe(
            (response) => {
                console.log(response);
                this.submitted = true;
                this.ngOnInit();
            },
            (error) => {
                console.log(error);
            }
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Subscription Issued',
            life: 3000,
        });
    }

    hideDialog() {
        this.subscribeDialogBox = false;
        this.submitted = false;
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions[i].id === id) {
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
