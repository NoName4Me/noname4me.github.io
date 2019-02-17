
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


class Octopus {
    readonly numberOfLegs: number = 8;
    // 这里还可以用private／protected／public修饰
    constructor(readonly name: string) {
    }
}

let t = new Octopus("jonge");
t.name;

let passcode = "secret passcode";

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}


abstract class Department {
    
        constructor(public name: string) {
        }
    
        printName(): void {
            console.log("Department name: " + this.name);
        }
    
        abstract printMeeting(): void; // must be implemented in derived classes
    }
    
    class AccountingDepartment extends Department {
    
        constructor() {
            super("Accounting and Auditing"); // constructors in derived classes must call super()
        }
    
        printMeeting(): void {
            console.log("The Accounting Department meets each Monday at 10am.");
        }
    
        generateReports(): void {
            console.log("Generating accounting reports...");
        }
    }
    
    let department: Department; // ok to create a reference to an abstract type
    department = new Department(); // error: cannot create an instance of an abstract class
    department = new AccountingDepartment(); // ok to create and assign a non-abstract subclass
    department.printName();
    department.printMeeting();
    department.generateReports(); // error: method doesn't exist on declared abstract type
*/

class Greeter {
    static standardGreeting = "Hello, there";
    greeting: string;
    greet() {
        if (this.greeting) {
            return "Hello, " + this.greeting;
        }
        else {
            return Greeter.standardGreeting;
        }
    }
}

let greeter1: Greeter;
greeter1 = new Greeter();
console.log(greeter1.greet());

let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey there!";

let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet());
