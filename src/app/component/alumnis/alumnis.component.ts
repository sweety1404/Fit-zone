import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Alumni } from './alumni';
import { AlumniService } from '../../services/alumni.service';


@Component({
    templateUrl: './alumnis.component.html',
    providers: [MessageService],
})
export class AlumnisComponent implements OnInit {
    alumnis: Alumni[] = [];
    alumni: Alumni = {};
    selectedAlumnis: Alumni[] = [];
    alumniDialog: boolean = false;
    deleteAlumniDialog: boolean = false;
    alumniViewDialog:boolean=false;
    deleteAlumnisDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    submitted: boolean = false;
    subscriptions: any[] = [];
    trainernames: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private messageService: MessageService,
        private alumniService: AlumniService
    ) {}

    ngOnInit() {
        this.retrieveAlumnis();
        this.subscriptions = [
            { label: '1 Month', value: '1 Month' },
            { label: '3 Month', value: '3 Month' },
            { label: '6 Month', value: '6 Month' },
            { label: '12 Month', value: '12 Month' },
        ];
        this.trainernames = [
            { label: 'ABC', value: 'A' },
            { label: 'MNO', value: 'B' },
            { label: 'XYZ', value: 'C' },
        ];
    }
    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.alumnis);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ['data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'alumnis');
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
        doc.save('alumnis.pdf');
    }
    retrieveAlumnis(): void {
        this.alumniService.getAll().subscribe(
            (data) => {
                this.alumnis = data;
            },
            (error) => {
                console.log(error);
            }
        );
    }
    saveAlumni() {
        this.submitted = true;

        if (
                this.alumni.name?.trim()&&
                this.alumni.dob?.trim()&&
                this.alumni.email?.trim()&&
                this.alumni.gender?.trim()&&
                this.alumni.address?.trim()&&
                this.alumni.mobile

        ){
            console.log(this.alumni.id);
            if (this.alumni.id) {
                console.log('update test');
                this.alumniService
                    .update(this.alumni.id, this.alumni)
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
                    detail: 'Alumni Successfully Updated',
                    life: 3000,
                });
            } else {
                this.alumniService.create(this.alumni).subscribe(
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
                    detail: 'Alumni Successfully Registered',
                    life: 3000,
                });
            }

            this.alumniDialog = false;
            this.alumni = {};
        }
    }

    openNew() {
        this.alumni = {};
        this.submitted = false;
        this.alumniDialog = true;
    }

    deleteSelectedAlumnis() {
        this.deleteAlumnisDialog = true;
    }
    viewTAlumni(alumni: Alumni) {
        this.alumni = { ...alumni };
        this.alumniViewDialog= true;
    }
    editAlumni(alumni: Alumni) {
        this.alumni = { ...alumni};
        this.alumniDialog = true;
    }

    deleteAlumni(alumni: Alumni) {
        this.deleteAlumniDialog = true;
        this.alumni = { ...alumni };
    }

    confirmDeleteSelected() {
        this.deleteAlumnisDialog = false;
        this.alumnis = this.alumnis.filter(
            (val) => !this.selectedAlumnis.includes(val)
        );
        // console.log(this.selectedSAlumnis);
        this.selectedAlumnis.map((data) => {
            this.alumniService.delete(data.id).subscribe(
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
            detail: this.selectedAlumnis.length + ' Alumni(s) Deleted',
            life: 3000,
        });
        this.selectedAlumnis = [];
    }

    confirmDelete() {
        this.deleteAlumniDialog = false;
        this.alumnis = this.alumnis.filter(
            (val) => val.id !== this.alumni.id
        );
        console.log(this.alumni.id);
        this.alumniService.delete(this.alumni.id).subscribe(
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
            detail: 'Alumni Deleted',
            life: 3000,
        });
        this.alumni = {};
    }

    hideDialog() {
        this.alumniDialog = false;
        this.alumniViewDialog=false;
        this.submitted = false;
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.alumnis.length; i++) {
            if (this.alumnis[i].id === id) {
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

