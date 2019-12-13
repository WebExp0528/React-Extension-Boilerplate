import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new EnzymeAdapter() });

const context = require.context("./src", true, /spec\.js/); // make sure you have your directory and regex test set correctly!
context.keys().forEach(context);
