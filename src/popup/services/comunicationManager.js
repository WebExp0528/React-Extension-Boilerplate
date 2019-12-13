import ext from "../../utils/ext";

export default function sendMessage(message, data) {
  ext.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0];
    ext.tabs.sendMessage(activeTab.id, { action: message, data });
  });
}
