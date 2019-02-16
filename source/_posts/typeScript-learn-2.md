---
title: typeScript学习笔记(2/3)
date: 2017-12-18 23:14:17
categories:
- 前端
tags:
- TypeScript
---
>*因为这只是个人的学习笔记，不便之处望谅解。*
>
>**内容：** 类。

# 2. 学习（接[上一篇](http://jonge.club/2017/12/16/typeScript-learn-1/))

## 2.3 类

### 2.3.1 继承
<!--more-->
```ts
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    // 在调用this之前，必须先调用super
    constructor(name: string) { super(name); }
    // 方法重写（覆盖）
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}
```

### 2.3.2 `private`/`protected`/`public`

```ts
// private
class Animal {
    // 仅能在Animal域内访问
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { 
        super("Rhino");
        // a. 这里也无法访问Animal里的name
        console.log(this.name);
    }
    test() {
        // b. 这里也无法访问
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

// protected
// 上面private里的'a'和'b'处可以访问到name
class Person {
    protected name: string;
    // 修饰构造器，表示只可以被继承，不可以直接实例化
    protected constructor(theName: string) { this.name = theName; }
}
```

### 2.3.3 参数属性

不在类内声明`xx`属性，而直接在构造器参数里，用`private/public/protected/readonly`修饰入参`xx`，使其成为类的属性。

```ts
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName; // 注意这个的变化
    }
}
// 可以演变为
class Octopus {
    readonly numberOfLegs: number = 8;
    // 这里还可以用private／protected／public修饰
    constructor(readonly name: string) {
    }
}

let t = new Octopus("jonge");
t.name;
```

### 2.3.4 访问器

如果类的属性是公共的，那么可以直接读取或修改，但如果属性名变化了呢，如果读取或修改还有别的业务需求呢，此时前者需要多处改动，后者需要在每一处增加业务需求，所以定义统一维护的`get/set`很有必要。

```ts
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
```

**注意：**如果某个属性定义了`get`而没有定义`set`，会自动被设置为readonly（如果生成了`.d.ts`文件，会显式看到）。

### 2.3.5 静态属性

直接通过类名（类似实例的`this`）来访问静态属性。

```ts
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x); // 在这里
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

### 2.3.6 抽象类

不可实例化，抽象方法必须被继承类实现。

```ts
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
```

### 2.3.7 高级知识

当声明一个类时，实际上同时创建了好几个东西：

* 实例的类的类型：`let c: MyClass`，`MyClass`是类`MyClass`的类型；

* 构造器函数：`let c: MyClass = new MyClass()`时，由`new`引发；

* instance side和static side：构造器里可以访问静态属性

将类当作接口

```ts
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {// 如上所述，Point也是类型
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```