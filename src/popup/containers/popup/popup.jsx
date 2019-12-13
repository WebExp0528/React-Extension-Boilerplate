import React from "react";
import Button from "../../components/button/button";
import sendMessage from "../../services/comunicationManager";

function setGreen() {
  sendMessage("change-color", { color: "green" });
}

function setRed() {
  sendMessage("change-color", { color: "red" });
}

export default () => (
  <div>
    <Button label="green" action={setGreen} />
    <Button label="red" action={setRed} />
  </div>
);
