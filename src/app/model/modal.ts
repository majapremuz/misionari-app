
export enum DatePresentation  {
    Date = 'date',
    DateTime = 'date-time',
    Time = 'time'

}

export class BaseModal {

    isModalOpen: boolean = false;
    showCloseButton: boolean = true;
    formVariable: any;
    title: string = '';

    openModal(): void{
        this.isModalOpen = true;
    }

    closeModal(): void{
        this.isModalOpen = false;
    }

    onModalWillDismiss(event: Event): void {
        this.closeModal();
    }

    setShowCloseButton(state: boolean): void{
        this.showCloseButton = state;
    }

}