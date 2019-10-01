# FLUXTOOLS-EXAMPLE

Example project to show flux pattern using fluxtools

How to run the example,

Install all the libs `npm install`  
Install node-static to start a server `npm i -g node-static`  
Run webpack build `npm run build`  
Start the server `static .`  
Go the `http://localhost:8080`  

# FLUXTOOLS

Flux is a design pattern facebook created to tackle problems they had with a standarad MCV structure.
For them MVC did not scale well, flux should solve that.

Please read more on [https://facebook.github.io/flux/]()

If you have a big project and you need well documented structure and way of working then you really should look at [React](https://reactjs.org/) and [Redux](https://redux.js.org/) instead of this.

This repo is good if you have a small application and need some structure to take away many of the buggs and spagetti code. There tools are here to help you implementing a simple flux pattern.

## Example

Please look at [https://github.com/arwidt/fluxtools-example]() for a small example application using all the tools in this module.

## Usage

### defineStore
Is used to edit the stateobject in you store object/class. Will merge two objects.

### cloneObject
Will do a deep clone object, this is important to keep the main state object in the store and not pass a reference by mistake.
Optimized and copied from [https://jsperf.com/deep-cloning-of-objects/45]()

### mergeObject
Will merge two objects. Optimized and copied from [https://jsperf.com/deep-merge2/8]()

### deepObjectDiff
Will compare two objects and return the keys that differ, will work on any depth of object.

```
let a = {
	abc: "ABC",
	foo: {
		bar: 123
	}
}

let b = {
	test: "TEST",
	abc: "CBA",
	foo: {
		bar: "foobar"
	}
}

deepObjectDiff(a, b)

result ----------

['abc', 'foo.bar']

```

### getAllPathsOfObject
Will return all paths in a object.

```
{
	test: "ABC"
	foo: {
		bar: "foobar"
	}
}

result -------------

['test', 'foo', 'foo.bar']
```

## Contribute

Install all packages `npm install`  
Run tests `npm test`  
Run tests with watch for development `npm run watch`  


