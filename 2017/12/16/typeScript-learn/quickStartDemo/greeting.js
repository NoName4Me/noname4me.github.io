var Student = /** @class */ (function () {
    // 函数入参类型限定
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
    return Student;
}());
function greeter(person) {
    return "Hello, " + person.firstName + " " + person.lastName + "~";
}
var user = new Student("Jonge", "M.", "Den");
document.body.innerHTML = greeter(user);
