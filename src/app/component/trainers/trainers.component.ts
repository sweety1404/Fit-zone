import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Trainer } from './trainer';
import { TrainerService } from '../../services/trainer.service';


@Component({
    templateUrl: './trainers.component.html',
    providers: [MessageService],
})
export class TrainersComponent implements OnInit {
    trainers: Trainer[] = [];
    trainer: Trainer = {};
    selectedTrainers: Trainer[] = [];
    trainerDialog: boolean = false;
    deleteTrainerDialog: boolean = false;
    trainerViewDialog:boolean=false;
    deleteTrainersDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    submitted: boolean = false;
    subscriptions: any[] = [];
    trainernames: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private messageService: MessageService,
        private trainerService: TrainerService
    ) {}

    ngOnInit() {
        this.retrieveTrainers();
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
            const worksheet = xlsx.utils.json_to_sheet(this.trainers);
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
    retrieveTrainers(): void {
        this.trainerService.getAll().subscribe(
            (data) => {
                this.trainers = data;
            },
            (error) => {
                console.log(error);
            }
        );
    }
    saveTrainer() {
        this.submitted = true;

        if (
                this.trainer.name?.trim()&&
                this.trainer.dob?.trim()&&
                this.trainer.email?.trim()&&
                this.trainer.gender?.trim()&&
                this.trainer.address?.trim()&&
                this.trainer.mobile

        ){
            console.log(this.trainer.id);
            if (this.trainer.id) {
                console.log('update test');
                this.trainerService
                    .update(this.trainer.id, this.trainer)
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
                    detail: 'Trainer Successfully Updated',
                    life: 3000,
                });
            } else {
                this.trainerService.create(this.trainer).subscribe(
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
                    detail: 'Trainer Successfully Registered',
                    life: 3000,
                });
            }

            this.trainerDialog = false;
            this.trainer = {};
        }
    }

    openNew() {
        this.trainer = {};
        this.submitted = false;
        this.trainerDialog = true;
    }

    deleteSelectedTrainers() {
        this.deleteTrainersDialog = true;
    }
    viewTrainer(trainer: Trainer) {
        this.trainer = { ...trainer };
        this.trainerViewDialog= true;
    }
    editTrainer(trainer: Trainer) {
        this.trainer = { ...trainer };
        this.trainerDialog = true;
    }

    deleteTrainer(trainer: Trainer) {
        this.deleteTrainerDialog = true;
        this.trainer = { ...trainer };
    }

    confirmDeleteSelected() {
        this.deleteTrainersDialog = false;
        this.trainers = this.trainers.filter(
            (val) => !this.selectedTrainers.includes(val)
        );
        // console.log(this.selectedSTrainers);
        this.selectedTrainers.map((data) => {
            this.trainerService.delete(data.id).subscribe(
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
            detail: this.selectedTrainers.length + ' Trainer(s) Deleted',
            life: 3000,
        });
        this.selectedTrainers = [];
    }

    confirmDelete() {
        this.deleteTrainerDialog = false;
        this.trainers = this.trainers.filter(
            (val) => val.id !== this.trainer.id
        );
        console.log(this.trainer.id);
        this.trainerService.delete(this.trainer.id).subscribe(
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
            detail: 'Trainer Deleted',
            life: 3000,
        });
        this.trainer = {};
    }

    hideDialog() {
        this.trainerDialog = false;
        this.trainerViewDialog=false;
        this.submitted = false;
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.trainers.length; i++) {
            if (this.trainers[i].id === id) {
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
