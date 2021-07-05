import React from "react";
import Button from "components/Button";
import { sendMessageToActiveTab } from "utils/sendMessages";

function setGreen() {
    sendMessageToActiveTab("change-color", { color: "green" });
}

function setRed() {
    sendMessageToActiveTab("change-color", { color: "red" });
}

export const Popup = () => (
    <div>
        <Button label="green" action={setGreen} />
        <Button label="red" action={setRed} />
    </div>
);

export default Popup;
