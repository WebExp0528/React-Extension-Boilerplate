import React from "react";
import TestUtils from "react-dom/test-utils";
import { expect } from "chai";
import Button from "./button";

function sampleAction() {
    console.log("sampleAction");
}

describe("button", function () {
    it("renders without problems", () => {
        const button = TestUtils.renderIntoDocument(
            <div>
                <Button action={sampleAction} label="sample label" />
            </div>
        );
        expect(button).to.not.be.null;
    });
});
