var Person;
(function (Person) {
    Person[Person["White"] = 1] = "White";
    Person[Person["Black"] = 2] = "Black";
    Person[Person["Yellow"] = 3] = "Yellow";
})(Person || (Person = {}));
var personName = Person[2];
alert(personName);
var someValue = "this is a string";
var strLength = someValue.length;
function getLength(something) {
    return something.length;
}
var o = { a: 23, b: 'jonge' };
var a = o.a, b = o.b;
