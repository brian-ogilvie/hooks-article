# Hooks: They're Not Just for State.

The true power of React hooks is not simply providing statefulness to functional components. When used to their full potiential, they can encapsulate 100% of your application business logic. 

## Resources

[Sample Code on GitHub](https://github.com/brian-ogilvie/hooks-article)

[Deployed App](https://chainsaw-hooks.netlify.com)

[![Netlify Status](https://api.netlify.com/api/v1/badges/fcfe2c29-ab11-4c03-ab55-3c624dc088f2/deploy-status)](https://app.netlify.com/sites/chainsaw-hooks/deploys)

## Background

This article will be focused on some deep nuances of programming in React, so knowledge of JavaScript is a must, and some experience building in React is recommended.

##Introduction

Allow me to open by paraphrasing a story I read once (In [this book](https://www.amazon.com/Functional-Thinking-Paradigm-Over-Syntax/dp/1449365515/ref=asc_df_1449365515/?tag=hyprod-20&linkCode=df0&hvadid=312128454859&hvpos=1o3&hvnetw=g&hvrand=876775105137829647&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9067609&hvtargid=pla-554069252364&psc=1)):

<blockquote>
Let's say that you are a lumberjack, and you have the best axe in the woods, which makes you incredibly good at your job. Then one day, someone comes to the forrest extolling the virtues of this amazing new logging tool called a chainsaw. Intrigued, you buy one. The problem is that you don't know how to use it. So without cranking it, you swing it at a tree again and again, and unsurprisingly, you are disappointed in the results. You conclude that this chainsaw thing is of no real use and go back to your trusty axe.
</blockquote>

A little less than a year ago, the company I work for migrated to React 16.8 and eliminated the use of class-based components for all our new code. I was intrugued by the idea of composing an entire app using only functions, but adjusting to a new paradigm takes time. Much like our lumberjack friend, my early attempts at using this new tool were constrained by my experience using an older and far less powerful tool. The most glaring example of my early struggles was how to handle a React form.

## A New Paradigm

Previously, a very simple form built in a class-based React component might look something like this.

```
class SignUp extends React.Component {
	state = {
		name: '',
		email: ''
	};
	
	onSubmit = e => {
		e.preventDefault();
		// validate form and submit data
	}
	
	handleInputChange = ({ target }) => {
		const { name, value } = target;
		this.setState({ [name]: value });
	};
	
	render() {
		const { name, email } = this.state;
		return (
			<form onSubmit={this.onSubmit}>
				<input name="name" value={name} onChange={this.handleInputChange} />
				<input name="email" value={email} onChange={this.handleInputChange} />
				<button type="submit">Sign Up</button>
			</form>
		);
	}
}
```

At the time of our migrating to React 16.8, I had built roughly 5,743 forms following this paradigm. I was conformtable with it, and it worked reliably. So how was I going to do this same thing using React hooks?

As I worked my way through the documentation on hooks, it seemed that we would typically have a different state hook for every property, rather than one big state object with all the properties. Something like this:

```
const [name, setName] = useState('');
const [email, setEmail] = useState('');
```

`useState` is the most basic of all React hooks. It accepts as it's only argument the initial value you would like to use for your state property--in our case, an empty string. It returns an ordered pair of the current value of your property and a function you can use to update that value. Easy enough, but right off the bat, I didn't think this seemed very useful for handling form inputs. If you look in my class-based solution above, I have a generic handler function that parses the change in an input field and then updates the appropriate state property. `useState` doesn't do that. 

In further reading of the docs I discovered that you can use the standard React hooks as building blocks for your own custom hooks. This was the very first custom hook I wrote: 

```
export default function useInput(initialValue) {
	const [value, setValue] = useState(initialValue);
	
	function handleValueChange({ target }) {
		const { value: newValue } = target;
		setValue(newValue);
	}
	
	return [value, handleValueChange];
}
```

Which could be used in my form coponent like this: 

```
const [name, handleNameChange] = useInput('');
const [email, handleEmailChange] = useInput('');
```

Feeling very proud of myself and my coding prowess, I even wrote a second custom hook called `useValidatedInput`, which allows me to pass a RegEx pattern along with the initial value. The hook automatically validates the value against the pattern and returns a boolean indicating whether the value is valid. That's cool because it validates my form in real-time instead of my having to run a validation function when the form gets submitted. Here's how I used it in a component:

```
const [zipCode, zipCodeIsValid, handleZipCodeChange] = useValidatedInput(
	'',
	/^\d{6}(-\d{4})?$/
);
```

If you are curious about the actual implementation of that hook, check it out in the repo. All my custom hooks are in `/src/hooks`.

So with this initial understanding, let's build out our functional form:

```
import React from 'react';
import useInput from '../hooks/useInput';
import useValidatedInput from '../hooks/useValidatedInput';
import Input from './Input';

function SignUp() {
	const [name, handleNameChange] = useInput('');
	const [email, emailIsValid, handleEmailChange] = useValidatedInput(
		'',
		/^\w[^ ]*@\w+([.-]?\w+)*(\.\w{2,3})+$/
	);
	const [zipCode, zipCodeIsValid, handleZipCodeChange] = useValidatedInput(
		'',
		/^\d{5}(-\d{4})?$/
	);
	
	function handleSubmit(e) {
		e.preventDefault();
		const formData = {
			name,
			email,
			zipCode,
		};
		console.log({ ...formData });
	}
	
	function resetForm() {
		handleNameChange('');
		handleEmailChange('');
		handleZipCodeChange('');
	}
	
	return (
		<form onSubmit={handleSubmit}>
			<h2>Please Sign Up</h2>
			<Input
				name="name"
				label="Name:"
				value={name}
				onChange={handleNameChange}
				placeholder="Enter your name."
			/>
			<Input
				name="email"
				label="Email:"
				value={email}
				onChange={handleEmailChange}
				placeholder="Enter your email."
			/>
			<Input
				name="zipCode"
				label="Zip Code:"
				value={zipCode}
				onChange={handleZipCodeChange}
				placeholder="Enter your Zip Code."
			/>
			<div className="form-buttons">
				<button type="submit" disabled={!emailIsValid || !zipCodeIsValid}>
					Submit
				</button>
				<button type="button" onClick={resetForm}>
					Reset Form
				</button>
			</div>
		</form>
	);
}
```

A couple of things to note about the above code:

First, I disable the submit button if either our email field or our zip code field is invalid. 

Second, I've created and used a custom `<Input />` component that saves our having to type a whole bunch of code over and over again. This isn't our first rodeo with React, and we're no strangers to encapsulating repetative code into resusable components. `<Input />` basically replaces this: 

```
<div>
	<label htmlFor="email">
		Email:
		<input
			type="text"
			name="email"
			value={email}
			onChange={handleEmailChange}
			placeholder="Enter your email."
		/>
	</label>
</div>
```

This is pretty much how I handled building forms using hooks for the next several months. Does this code work? Absolutely! But there are some major issues here. 

As a responsible programmer, I instinctually created a reusable component to avoid repeating myself when it came to the UI code, but look how much repetition is still going on inside this code block: 

1. Every input property has to be declared on it's own line.
2. Every input property has it's own handler function (even though its implementation is encapsulated in a hook).
3. If I want to reset the form, I have to directly set every field back to it's inital value.
4. Disableing the Submit button is based on two boolean values. What if I had five validated fields? I would have to pass all 5 booleans into the button logic. 
5. The RegEx patterns. What if I have five different forms on different pages? I have to repeat that code or something similar to it every time??? 
6. Even the `<Input />` component doesn't save me that much typing. I still have to pass each input it's value and handler function right in line. 

## A Shift in Understanding

Not long ago, I attended a talk by Nir Kaufman that dealt with this very thing. He encouraged us to expand our use of hooks beyond just simply storing and updating single state properties. Rather than `useInput`, for instance, I could have `useForm` to take care of all my inputs. Here is the hook he showed us: 

```
export default function useForm(onSubmit, initialData = {}) {
	const [formData, setFormData] = useState(initialData);
	
	function updateField({ target }) {
		const { name, value } = target;
		setFormData(current => ({
			...current,
			[name]: value
		});
	}
	
	function handleSubmit(e) {
		e.preventDefault();
		onSubmit(formData);
	}
	
	return { formData, updateField, handleSubmit };
}
```

### 🤯 🤯 🤯 🤯 🤯 🤯

This is a very simple hook, but consider how it simplifies our code at the top of a form component. Assume we have a `register` function that actually deals with submitting the form data to our API. Now that function doesn't have to mess with preventing the default submission event; it can just deal with http (axios/fetch) code. And rather than having to define all our state properties individually, we just do:

```
const { formData, updateField, handleSubmit } = useForm(register);
```

And inside our form: 

```
<Input
	name="email"
	label="Email:"
	value={formData.email}
	onChange={updateField}
	placeholder="Enter your email."
/>
```

This solves our first two problems from above. Not only that. Consider the broader implications for our application. This one hook can be imported and used in every component that uses a form. That was never possible before using class-based components. 

## A Chainsaw is not an Axe

Maybe I had been thinking about hooks all wrong. They aren't just another way do the same things we used to do with `this.state`. When used to their full potential, hooks allow us to separate our business logic from our UI logic and to standardize its implementation throughout our applications. If you've ever built software in Ruby on Rails or Swift, you are familiar with the MVC (Model, View, Controller) paradigm. You code should always have a clear separation of concerns. Your View should not concern itself with managing the current state of your application; it should simply display it. Your View should not concern itself with validating input from your users; it should just accept it. It is the Model who manages state and validates user input. This separation of concerns has always been a little fuzy in React. UI code and business logic have always lived right next to each other inside of components. The best we could do was to create "dumb" presentational components and then wrap them in container components (or higher order components) to handle logic. But these are all still components. What if I told you that ALL components could be presentational components?

Let's see if we can expand on Nir's idea above to solve more of our problems from our naive implementation.

### Resetting the form

This is way simpler than before. Let's just add the following function to our `useForm` hook:

```
function resetForm() {
	setFormData(initialData);
}
```

And return it along with everything else: 

```
return { formData, updateField, handleSubmit, resetForm };
```

### Validating the form

We had a couple of problems with validating before. First, we had too many booleans to keep track of--one for each field. Second, we had to pass RegEx patterns straight into each input, which is not a great developer experience, and it doesn't scale well for an application with lots of forms. 

Imagine a world where we could define a schema for our form like this: 

```
const schema = {
	name: types.notEmpty,
	email: types.email,
	zipCode: types.zip,
};
```

And then get it validated like this:

```
const { formData, updateField, handleSubmit } = useForm(register);
const { formIsValid } = useFormValidation(formData, schema);

return (
	<form onSubmit={handleSubmit}>
		// inputs
		<button type="submit" disabled={!formIsValid}>
			Submit
		</button>
	</form>
);
```

I want to live in that world. Let's make it happen.

Let's create this new validation hook:

```
const validPatterns = {
  EMAIL: /^\w[^ ]*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  NOT_EMPTY: /\S+/,
  ZIP: /^\d{5}(-\d{4})?$/,
};

function checkValidity(value, type) {
	if (!value) return false;
	const pattern = validPatterns[type];
	return pattern && pattern.test(value);
}

export const types = {
	email: 'EMAIL',
	notEmpty: 'NOT_EMPTY',
	zip: 'ZIP'
}

export default function useFormValidation(formData, schema) {
	const [formIsValid, setFormIsValid] = useState(false);
	
	useEffect(() => {
		if (!Object.keys(formData).length) return false;
		return Object.keys(schema).every(key => {
			return checkValidity(formData[key], schema[key]);
		});
	}, [formData, schema]);
	
	return { formIsValid };
}
```

OK, what's going on here? First, we define a set of valid patterns. This allows us to keep all our complicated Regular Expressions here, in one place. Consumers of this hook don't need to define their own RegEx for their form schema. They can just say that a certain feild should be an `email` or a `zip`, etc. We'll even export a `types` object so that consumers can choose from the patterns we can validate, rather than having to remember whether we called it `zipCode` or `zip`, for example.

There is a little helper function `checkValidity` which actually pulls the requested RegEx pattern from our `validPatterns` object and tests that against a given value.

Finally there's our actual hook. The meat of this thing runs on the React `useEffect` hook, which allows us to perform side effects any time certain values change. In our case, every time the `formData` object is updated or the requested `schema` changes, we run through every property in the `schema` and check whether the matching property in the `formData` passes validity. We're using the `Array.prototype.every()` method here becuase we simply want to return one single boolean value regarding the validity of the form. Either every single field passes validation, or the whole form is invalid. We'll also return false if the formData object is completely empty. No need to test individual fields in that case. 

Why don't we run through every property of the `formData`? Well, not every form will have validation requirements for every field. So we only check the specific ones that were passed in via the `schema` object. 

Now that we have a couple of powerful custom hooks built out, let's put them to use in our component and see how much our code has improved:

```
import useForm from '../hooks/useForm';
import useFormValidation, { types } from '../hooks/useFormValidation';
import Input from './Input';

const schema = {
	name: types.notEmpty,
	email: types.email,
	zipCode: types.zip,
};

export default function SignUp(register) {
	const { formData, updateField, handleSubmit, resetForm } = useForm(register);
	const { formIsValid } = useFormValidation(formData, schema);
	
	return (
		<form onSubmit={handleSubmit}>
			<h2>Please Sign Up</h2>
			<Input
				name="name"
				label="Name:"
				value={formData.name}
				onChange={updateField}
				placeholder="Enter your name."
			/>
			<Input
				name="email"
				label="Email:"
				value={formData.email}
				onChange={updateField}
				placeholder="Enter your email."
			/>
			<Input
				name="zipCode"
				label="Zip Code:"
				value={formData.zipCode}
				onChange={updateField}
				placeholder="Enter your Zip Code."
			/>
			<div className="form-buttons">
				<button type="submit" disabled={!formIsValid}>
					Submit
				</button>
				<button type="button" onClick={resetForm}>
					Reset Form
				</button>
			</div>
		</form>
	);
}
```

Much better, right? And we've not only improved this one form, we've also built form handling and validation that can be plugged into every form throughout our app. No need to retype any of that logic!

## Bonus

Can we improve our code even more? You bet we can. Notice how we haven't really done anything to solve our last problem from above. Our use of the `<Input />` component is still quite repetative. Every input receives these two lines, which are almost exactly the same: 

```
value={formData.whatever}
onChange={updateField}
```

Also, most forms are going to have the exact same group of buttons at the bottom, so that's probably code we shouldn't be repeating every time we make a form. Wouldn't it be great if we had a wrapper component that would automatically pass the `value` and `onChange` handler to the inputs and also set up our buttons? Then our actual SignUp component could basically just be this:

```
function SignUp({ register }) {
	return (
		<Form onSubmit={register}>
			<Input name="name" label="Name" />
			<Input name="email" label="Email" />
			<Input name="zipCode" label="Zip Code" />
		</Form>
	);
}
```

Wouldn't that be cool???

Dude. It would be so cool.

The basic shape for this wrapper component is this:

```
export default function Form({ onSubmit, heading, children, schema }) {
	const { formData, updateField, handleSubmit, resetForm } = useForm(onSubmit);
	const { formIsValid } = useFormValidation(formData, schema);
	
	return (
		<form onSubmit={handleSubmit}>
			<h2>{heading}</h2>
			{ // Pass values and updateField to all my children (inputs) }
			<div>
				<button type="submit" disabled={!formIsValid}>
					Submit
				</button>
				<button type="button" onClick={resetForm}>
					Reset Form
				</button>
			</div>
		</form>
	);
}
```

Well, that sounds great but how are we going to pass the form values and `updateField` function into the children of this wrapper component? I know this is mostly an article about hooks, but since we are in the bonus round, let's harness another, lesser-know feature of React to accomplish this: `cloneElement`. 

`cloneElement` is an HOC (Higher-Order Component) that take a component as an argument and returns that component with additional props added. According to the React docs, "The resulting element will have the original element's props with the new props merged in shallowly."

Above our return statement, let's add this function: 

```
function renderChildren() {
	return children.map(child =>
		cloneElement(child, {
			formData,
			onChange: updateField,
			key: children.indexOf(child)
		});
	);
}
```

So every child of this wrapper component automatically gets passed props of `formData`, `onChange`, and a `key` (React says I have to). Just invoke this function underneath our `<h2>` in the code above.

But hold on. We're passing the entire formData down, not the individual field values? That right. Since this is a generic map function, we have no way of knowing, at this level, which child needs which prop, so we have to pass the whole object in. That means that our current `Input` component won't quite work. We need an `Input` component that knows how to select it's own value out of the `formData` object. Rather than change the one we have (it's perfectly fine for anyone who wants to build a form someplace without using this `Form` wrapper), let's make a new Input component right here in this file, specifically for users of this wrapper. We'll export it as a named export for anyone who wants it: 

```
export function Input({ name, formData, onChange, label, type }) {
	return (
		<div>
			<label htmlFor={name}>
			{`${label}:`}
			<input
				type={type || 'text'}
				name={name}
				value={formData[name] || ''}
				onChange={onChange}
				placeholder={`Enter your ${label}.`}
			/>
			</label>
		</div>
	);
}
```

Really similar to our first one, but look how it sets it's value: by selecting the property that matches its name inside of `formData`. Also, this one dynamically sets its placeholder text based on the label. You might not want to do that last part, but it's a design decision, and it cuts down on the code we need to write when we use this component.

So here's our entire `Form` file: 

```
import React, { cloneElement } from 'react';
import useForm from '../hooks/useForm';
import useFormValidation from '../hooks/useFormValidation';

export function Input() {
  // see above
}

export default function Form({ onSubmit, heading, children, schema }) {
	const { formData, handleSubmit, resetForm, updateField } = useForm(onSubmit);
	const { formIsValid } = useFormValidation(formData, schema);

	function renderChildren() {
		return children.map(child =>
			cloneElement(child, {
				formData,
				onChange: updateField,
				key: children.indexOf(child),
			})
		);
	}

	return (
		<form onSubmit={handleSubmit}>
			<h2>{heading}</h2>
			{renderChildren()}
			<div className="form-buttons">
				<button type="submit" disabled={!formIsValid}>
				  Submit
				</button>
				<button type="button" onClick={resetForm}>
				  Reset Form
				</button>
			</div>
		</form>
	);
}
```

Time for the payoff! This is all we have to do to create our `SignUp` form in the app: 

```
import React from 'react';
import Form, { Input } from './Form';
import { types } from '../hooks/useFormValidation';

const schema = {
	email: types.email,
	name: types.notEmpty,
	zipCode: types.zip,
};

export default function AwesomeSignUp({ register }) {
	return (
		<Form onSubmit={register} heading="Please Sign Up:" schema={schema}>
			<Input name="name" label="Name" />
			<Input name="email" label="Email" />
			<Input name="zipCode" label="Zip Code" />
		</Form>
	);
}
```

Think this is powerful? Watch this. Here's our login form:

```
const schema = {
	email: types.email,
	password: types.password
};

export default function LogIn({ authenticate }) {
	return (
		<Form onSubmit={authenticate} heading="Please Sign In" schema={schema}>
			<Input name="email" label="Email/Username" />
			<Input name="password" type="password" label="Password" />
		</Form>
	);
}
```

Done! No new logic or validation necessary!

 Thanks for reading, and I hope you find this way of thinking about hooks will change your life as a React developer. I has certainly changed mine.