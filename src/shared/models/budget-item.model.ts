export class BudgetItem {
    constructor(
        public name: string,
        public amount: number,
        public category: string,
        public details: string,
        public timestamp?: string
    ) {}
}