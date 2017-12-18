
/*
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");


class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();


class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { 
        super("Rhino");
        // 这里也无法访问Animal里的name
        console.log(this.name);
    }
    test() {
        // 这里也无法访问
        this.name;
    }
}

class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
console.log(animal.name); // Property 'name' is private and only accessible within class 'Animal'.
animal = employee; // Error: 'Animal' and 'Employee' are not compatible
*/

class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
class Octopus {
    readonly numberOfLegs: number = 8;
    // 这里还可以用private／protected／public修饰
    constructor(readonly name: string) {
    }
}

let t = new Octopus("jonge");
t.name;