export class Food {
    id: string;
    name: string;
    tags: string[];


    constructor(id: string, name: string, tags: string[]) {
        this.id = id;
        this.name = name;
        this.tags = tags;
    }
}
