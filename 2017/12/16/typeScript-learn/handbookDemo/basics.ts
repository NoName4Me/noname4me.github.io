enum Person {White = 1, Black, Yellow}
let personName: string = Person[2];
alert(personName);

let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

function getLength(something: string | number): number {
    return (<string>something).length;
}

let o = {a: 23, b: 'jonge'};
let { a, b }: { a: number, b: string } = o;