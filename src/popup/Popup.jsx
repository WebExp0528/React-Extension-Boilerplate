import React from "react";
import Button from "components/Button";
import sendMessage from "./services/comunicationManager";

function setGreen() {
    sendMessage("change-color", { color: "green" });
}

function setRed() {
    sendMessage("change-color", { color: "red" });
}

export const Popup = () => (
    <div>
        <Button label="green" action={setGreen} />
        <Button label="red" action={setRed} />
    </div>
);

export default Popup;
