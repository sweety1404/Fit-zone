import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Trainer } from '../trainers/trainer';
import { Member } from './member';
import { MemberService } from '../../services/member.service';
import { TrainerService } from '../../services/trainer.service';


@Component({
    templateUrl: './members.component.html',
    providers: [MessageService],
})
export class MembersComponent implements OnInit {
    members: Member[] = [];
    member: Member = {};

    trainers: Trainer[] = [];
    
    selectedMembers: Member[] = [];
    memberDialog: boolean = false;
    memberViewDialog:boolean=false;
    deleteMemberDialog: boolean = false;
    deleteMembersDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    submitted: boolean = false;
    subscriptions: any[] = [];
    trainernames: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private messageService: MessageService,
        private memberService: MemberService,
        private trainerService: TrainerService
    ) {}

    ngOnInit() {
        this.retrieveMembers();
        this.retrieveTrainers();
        this.subscriptions = [
            { label: '1 Month', value: '1 Month' },
            { label: '3 Month', value: '3 Month' },
            { label: '6 Month', value: '6 Month' },
            { label: '12 Month', value: '12 Month' },
        ];
    }
    retrieveTrainers(): void {
        this.trainerService.getAll().subscribe(
            (data) => {
                this.trainers = data;
                console.log(this.trainers);
            },
            (error) => {
                console.log(error);
            }
        );
    }
    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.members);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ['data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'members');
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
        doc.save('members.pdf');
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
    saveMember() {
        this.submitted = true;
        // console.log(this.member.id);
        if (
                this.member.name?.trim()
                // this.member.dob?.trim()&&
                // this.member.subscription?.trim()&&
                // this.member.trainername?.trim()&&
                // this.member.email?.trim()&&
                // this.member.gender?.trim()&&
                // this.member.relationship?.trim()&&
                // this.member.height?.trim()&&
                // this.member.cweight?.trim()&&
                // this.member.gweight?.trim()&& 
                // this.member.emergencyno&&
                // this.member.mobile

        ){
            // console.log(this.member.id);
            if (this.member.id) {
                // console.log('update test');
                this.memberService
                    .update(this.member.id, this.member)
                    .subscribe(
                        (response) => {
                            console.log(response);
                            this.ngOnInit();
                        },
                        (error) => {
                            console.log(error);
                        }
                    );

                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Member Successfully Updated',
                    life: 3000,
                });
            } else {
                this.memberService.create(this.member).subscribe(
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
                    detail: 'Member Successfully Registered',
                    life: 3000,
                });
            
            }

            this.memberDialog = false;
            this.member = {};
        }
    }

    openNew() {
        this.member = {};
        this.submitted = false;
        this.memberDialog = true;
    }

    deleteSelectedMembers() {
        this.deleteMembersDialog = true;
    }
    viewMember(member: Member) {
        this.member = { ...member };
        this.memberViewDialog = true;
    }

    editMember(member: Member) {
        this.member = { ...member };
        this.memberDialog = true;
    }

    deleteMember(member: Member) {
        this.deleteMemberDialog = true;
        this.member = { ...member };
    }

    confirmDeleteSelected() {
        this.deleteMembersDialog = false;
        this.members = this.members.filter(
            (val) => !this.selectedMembers.includes(val)
        );

        this.selectedMembers.map((data) => {
            this.memberService.delete(data.id).subscribe(
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
            detail: this.selectedMembers.length + ' Member(s) Deleted',
            life: 3000,
        });
        this.selectedMembers = [];
    }

    confirmDelete() {
        this.deleteMemberDialog = false;
        this.members = this.members.filter(
            (val) => val.id !== this.member.id
        );
        console.log(this.member.id);
        this.memberService.delete(this.member.id).subscribe(
            (response) => {
                console.log(response);
                this.ngOnInit();
            },
            (error) => {
                console.log(error);
            }
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Member Deleted',
            life: 3000,
        });
        this.member = {};
    }

    hideDialog() {
        this.memberDialog = false;
        this.memberViewDialog=false;
        this.submitted = false;
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i].id === id) {
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
