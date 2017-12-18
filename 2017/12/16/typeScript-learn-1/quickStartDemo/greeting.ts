class Student { // 这是ES5的语法
    fullName: string; // ts
    // 函数入参类型限定
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person : Person) {
    return `Hello, ${person.firstName} ${person.lastName}~`;
}

let user = new Student("Jonge", "M.", "Den");

document.body.innerHTML = greeter(user);