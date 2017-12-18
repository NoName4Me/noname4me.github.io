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

function f1(o: { a: string, b?: number }) {
    let { a, b = 0 } = o;
}

f1({a: 'hh'}); // ok
f1({a: 'hh', b: 'h'}); // error

// a、b都必须
function f2({ a, b } = { a: "", b: 0 }): void {
    // ...
}
// a必须，b可选，同f1
function f3({ a, b = 0 } = { a: ""}): void {
    // ...
}
f2({}); // error, need a & b
f2({a: 'h'}); // error, need b
f2({a: 23}); // error, number cannot be assigned to string

f3({}); // error, need a
f3({a: 'h'}); // ok
f3({a: 23}); // error, number cannot be assigned to string

interface NumberDictionary {
    [index: string]: number;
    length: number;    // ok, length is a number
    name: string;      // error, the type of 'name' is not a subtype of the indexer
}

interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick();
}
class Clock implements ClockConstructor {
    currentTime: Date;
    constructor(h: number, m: number) { }
}