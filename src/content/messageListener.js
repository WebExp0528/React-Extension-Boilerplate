export const onRequest = (request) => {
    if (request.msgType === "change-color") {
        document.body.style.background = request.color;
    }
};

export default onRequest;
