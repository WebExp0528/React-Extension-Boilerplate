export const onRequest = (request) => {
    if (request.action === "change-color") {
        document.body.style.background = request.data.color;
    }
};

export default onRequest;
